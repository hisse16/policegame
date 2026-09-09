import {
  PoliceEmail,
  EmailThread,
  DirectoryContact,
  MailFolder,
  PoliceMailState,
  PoliceEmailContact
} from '../../types/mail';
import { CURATED_POLICE_EMAILS } from './curatedEmails';
import { NPD_DIRECTORY } from './policeDirectoryData';
import { policeDatabase } from './databaseEngine';

const STORAGE_KEY = 'npd_police_mail_state_v1';

export class PoliceMailEngine {
  private static instance: PoliceMailEngine;
  private emails: PoliceEmail[] = [];
  private directory: DirectoryContact[] = [...NPD_DIRECTORY];
  private listeners: Set<() => void> = new Set();
  private isInitialized = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): PoliceMailEngine {
    if (!PoliceMailEngine.instance) {
      PoliceMailEngine.instance = new PoliceMailEngine();
    }
    return PoliceMailEngine.instance;
  }

  private initialize() {
    if (this.isInitialized) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.emails) && parsed.emails.length > 0) {
          // Merge with any missing curated emails to prevent loss of story emails
          const existingIds = new Set(parsed.emails.map((e: PoliceEmail) => e.id));
          const missing = CURATED_POLICE_EMAILS.filter((e) => !existingIds.has(e.id));
          this.emails = [...parsed.emails, ...missing];
          this.isInitialized = true;
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved Police Mail state, using curated defaults', e);
    }

    // Default: copy curated emails
    this.emails = JSON.parse(JSON.stringify(CURATED_POLICE_EMAILS));
    this.save();
    this.isInitialized = true;
  }

  private save() {
    try {
      const state = {
        emails: this.emails,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save Police Mail state', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.save();
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        console.error('Error in PoliceMail listener', e);
      }
    });
  }

  // --- Directory Queries ---
  public getDirectory(query?: string): DirectoryContact[] {
    if (!query || !query.trim()) {
      return [...this.directory];
    }
    const q = query.toLowerCase().trim();
    return this.directory.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.rank.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.division.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.badgeNumber && c.badgeNumber.toLowerCase().includes(q)) ||
        (c.officerId && c.officerId.toLowerCase().includes(q))
    );
  }

  public getDirectoryContact(idOrEmail: string): DirectoryContact | undefined {
    return this.directory.find(
      (c) => c.id === idOrEmail || c.email === idOrEmail || c.officerId === idOrEmail
    );
  }

  // --- Email & Thread Retrieval ---
  public getAllEmails(): PoliceEmail[] {
    return [...this.emails];
  }

  public getEmail(id: string): PoliceEmail | undefined {
    return this.emails.find((e) => e.id === id);
  }

  public getEmailsByFolder(folder: MailFolder): PoliceEmail[] {
    if (folder === 'starred') {
      return this.emails.filter((e) => e.isStarred && e.folder !== 'trash');
    }
    if (folder === 'important') {
      return this.emails.filter((e) => e.isImportant && e.folder !== 'trash');
    }
    return this.emails.filter((e) => e.folder === folder);
  }

  public getThreads(folder: MailFolder, searchQuery = ''): EmailThread[] {
    let emails = this.getEmailsByFolder(folder);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      emails = emails.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.body.toLowerCase().includes(q) ||
          e.from.name.toLowerCase().includes(q) ||
          e.from.email.toLowerCase().includes(q) ||
          (e.relatedCaseIds && e.relatedCaseIds.some((cid) => cid.toLowerCase().includes(q))) ||
          (e.relatedRecordIds && e.relatedRecordIds.some((rid) => rid.toLowerCase().includes(q)))
      );
    }

    // Group by threadId
    const threadMap = new Map<string, PoliceEmail[]>();
    for (const email of emails) {
      const list = threadMap.get(email.threadId) || [];
      list.push(email);
      threadMap.set(email.threadId, list);
    }

    const threads: EmailThread[] = [];

    threadMap.forEach((msgs, threadId) => {
      // Sort messages ascending by timestamp
      msgs.sort((a, b) => a.timestamp - b.timestamp);

      const latestMsg = msgs[msgs.length - 1];
      const unreadCount = msgs.filter((m) => !m.isRead).length;
      const isStarred = msgs.some((m) => m.isStarred);
      const isImportant = msgs.some((m) => m.isImportant);

      // Collect unique participants
      const partMap = new Map<string, PoliceEmailContact>();
      msgs.forEach((m) => {
        partMap.set(m.from.email, m.from);
        m.to.forEach((t) => partMap.set(t.email, t));
      });

      const participants = Array.from(partMap.values());

      threads.push({
        threadId,
        subject: latestMsg.subject.replace(/^(RE:\s*|Fw:\s*)+/i, ''),
        participants,
        lastMessageDate: latestMsg.date,
        lastMessageTimestamp: latestMsg.timestamp,
        messageCount: msgs.length,
        unreadCount,
        isStarred,
        isImportant,
        messages: msgs,
        folder: latestMsg.folder,
        classification: latestMsg.classification,
        relatedCaseIds: latestMsg.relatedCaseIds
      });
    });

    // Sort threads descending by latest message
    threads.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
    return threads;
  }

  // --- Operations ---
  public markRead(emailId: string, isRead = true) {
    const email = this.emails.find((e) => e.id === emailId);
    if (email && email.isRead !== isRead) {
      email.isRead = isRead;
      this.notify();
    }
  }

  public markThreadRead(threadId: string, isRead = true) {
    let changed = false;
    this.emails.forEach((e) => {
      if (e.threadId === threadId && e.isRead !== isRead) {
        e.isRead = isRead;
        changed = true;
      }
    });
    if (changed) this.notify();
  }

  public toggleStar(emailId: string) {
    const email = this.emails.find((e) => e.id === emailId);
    if (email) {
      email.isStarred = !email.isStarred;
      this.notify();
    }
  }

  public toggleImportant(emailId: string) {
    const email = this.emails.find((e) => e.id === emailId);
    if (email) {
      email.isImportant = !email.isImportant;
      this.notify();
    }
  }

  public moveToFolder(emailId: string, folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash') {
    const email = this.emails.find((e) => e.id === emailId);
    if (email) {
      email.folder = folder;
      this.notify();
    }
  }

  public moveThreadToFolder(threadId: string, folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash') {
    let changed = false;
    this.emails.forEach((e) => {
      if (e.threadId === threadId) {
        e.folder = folder;
        changed = true;
      }
    });
    if (changed) this.notify();
  }

  public deletePermanently(emailId: string) {
    this.emails = this.emails.filter((e) => e.id !== emailId);
    this.notify();
  }

  public sendEmail(params: {
    to: PoliceEmailContact[];
    cc?: PoliceEmailContact[];
    subject: string;
    body: string;
    threadId?: string;
    relatedCaseIds?: string[];
  }): PoliceEmail {
    const newId = `MAIL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0'
    )}`;

    const newEmail: PoliceEmail = {
      id: newId,
      threadId: params.threadId || `TH-CUSTOM-${Date.now()}`,
      subject: params.subject,
      from: {
        name: 'Detective Sarah Miller',
        email: 'investigator@workstation-07.npd.local',
        rank: 'Detective',
        badge: '4081',
        department: 'Cold Case & Special Review Unit'
      },
      to: params.to,
      cc: params.cc,
      date: dateStr,
      timestamp: now.getTime(),
      body: params.body,
      folder: 'sent',
      isRead: true,
      isStarred: false,
      isImportant: false,
      priority: 'NORMAL',
      classification: 'LAW ENFORCEMENT SENSITIVE',
      relatedCaseIds: params.relatedCaseIds || ['CASE-1998-027'],
      historicalEra: '2026',
      act: 1
    };

    this.emails.unshift(newEmail);
    this.notify();
    return newEmail;
  }

  public pinEmailToBoard(emailId: string) {
    const email = this.emails.find((e) => e.id === emailId);
    if (!email) return;

    email.isBoardPinned = true;

    // Add node to policeDatabase
    policeDatabase.addBoardNode({
      id: `node_email_${email.id}`,
      recordId: email.id,
      nodeType: 'note',
      label: `MAIL: ${email.subject.substring(0, 32)}`,
      subtitle: `${email.from.name} • ${email.date.split(' ')[0]}`,
      x: 320 + Math.floor(Math.random() * 120),
      y: 200 + Math.floor(Math.random() * 120),
      color: '#3b82f6',
      noteText: `[FROM: ${email.from.name} <${email.from.email}>]\n[DATE: ${email.date}]\n\n${email.body.substring(
        0,
        280
      )}...`
    });

    this.notify();
  }

  public getUnreadCount(folder: MailFolder = 'inbox'): number {
    return this.emails.filter((e) => e.folder === folder && !e.isRead).length;
  }
}

export const policeMailEngine = PoliceMailEngine.getInstance();
