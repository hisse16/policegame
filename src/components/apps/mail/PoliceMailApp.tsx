import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '../../common/Icon';
import { MailFolder, PoliceEmail, DirectoryContact, EmailThread } from '../../../types/mail';
import { policeMailEngine } from '../../../services/police/policeMailEngine';
import { MailThreadList } from './MailThreadList';
import { MailReader } from './MailReader';
import { PoliceDirectoryView } from './PoliceDirectoryView';
import { ComposeMailModal } from './ComposeMailModal';

interface PoliceMailAppProps {
  windowId?: string;
  params?: Record<string, any>;
}

export const PoliceMailApp: React.FC<PoliceMailAppProps> = ({ windowId, params }) => {
  const [activeFolder, setActiveFolder] = useState<MailFolder>('inbox');
  const [viewMode, setViewMode] = useState<'mail' | 'directory'>('mail');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeRecipient, setComposeRecipient] = useState<DirectoryContact | null>(null);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeThreadId, setComposeThreadId] = useState<string | undefined>(undefined);
  const [, setTick] = useState(0);

  // Subscribe to policeMailEngine updates
  useEffect(() => {
    const unsub = policeMailEngine.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsub;
  }, []);

  // Handle incoming routing params
  useEffect(() => {
    if (!params) return;

    if (params.folder) {
      setActiveFolder(params.folder);
      setViewMode('mail');
    }
    if (params.search) {
      setSearchQuery(params.search);
      setViewMode('mail');
    }
    if (params.contactId) {
      setViewMode('directory');
    }
    if (params.emailId) {
      const email = policeMailEngine.getEmail(params.emailId);
      if (email) {
        setActiveFolder(email.folder);
        setSelectedThreadId(email.threadId);
        setViewMode('mail');
        policeMailEngine.markThreadRead(email.threadId, true);
      }
    } else if (params.threadId) {
      setSelectedThreadId(params.threadId);
      setViewMode('mail');
      policeMailEngine.markThreadRead(params.threadId, true);
    }
    if (params.composeTo) {
      const contact = policeMailEngine.getDirectoryContact(params.composeTo);
      if (contact) {
        handleComposeToDirectoryContact(contact);
      }
    }
  }, [params]);

  const threads = useMemo(() => {
    return policeMailEngine.getThreads(activeFolder, searchQuery);
  }, [activeFolder, searchQuery, _tickState()]);

  const directory = useMemo(() => {
    return policeMailEngine.getDirectory();
  }, [_tickState()]);

  function _tickState() {
    return policeMailEngine.getAllEmails().length;
  }

  // Automatically select first thread if none selected or if folder changed
  useEffect(() => {
    if (threads.length > 0 && (!selectedThreadId || !threads.some((t) => t.threadId === selectedThreadId))) {
      setSelectedThreadId(threads[0].threadId);
      policeMailEngine.markThreadRead(threads[0].threadId, true);
    } else if (threads.length === 0) {
      setSelectedThreadId(null);
    }
  }, [activeFolder, threads.length]);

  const activeThread = useMemo(() => {
    if (!selectedThreadId) return null;
    return threads.find((t) => t.threadId === selectedThreadId) || null;
  }, [threads, selectedThreadId]);

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    policeMailEngine.markThreadRead(threadId, true);
  };

  const handleToggleStar = (emailId: string) => {
    policeMailEngine.toggleStar(emailId);
  };

  const handlePinToBoard = (emailId: string) => {
    policeMailEngine.pinEmailToBoard(emailId);
  };

  const handleDeleteThread = (threadId: string) => {
    policeMailEngine.moveThreadToFolder(threadId, 'trash');
    const remaining = threads.filter((t) => t.threadId !== threadId);
    if (remaining.length > 0) {
      setSelectedThreadId(remaining[0].threadId);
    } else {
      setSelectedThreadId(null);
    }
  };

  const handleArchiveThread = (threadId: string) => {
    policeMailEngine.moveThreadToFolder(threadId, 'archive');
    const remaining = threads.filter((t) => t.threadId !== threadId);
    if (remaining.length > 0) {
      setSelectedThreadId(remaining[0].threadId);
    } else {
      setSelectedThreadId(null);
    }
  };

  const handleReply = (toEmail: PoliceEmail) => {
    const contact = policeMailEngine.getDirectoryContact(toEmail.from.email);
    setComposeRecipient(
      contact || {
        id: 'DIR-REPLY',
        name: toEmail.from.name,
        email: toEmail.from.email,
        rank: toEmail.from.rank || 'Officer',
        department: toEmail.from.department || 'NPD',
        division: 'Internal',
        role: 'Correspondent',
        phoneExt: '',
        directPhone: '',
        officeLocation: 'NPD',
        status: 'ACTIVE',
        supervisor: '',
        employmentPeriod: '',
        deskAssignment: '',
        clearanceLevel: 'LEVEL 2'
      }
    );
    setComposeSubject(toEmail.subject.startsWith('RE:') ? toEmail.subject : `RE: ${toEmail.subject}`);
    setComposeThreadId(toEmail.threadId);
    setIsComposeOpen(true);
  };

  const handleForward = (thread: EmailThread) => {
    setComposeRecipient(null);
    setComposeSubject(thread.subject.startsWith('FWD:') ? thread.subject : `FWD: ${thread.subject}`);
    setComposeThreadId(undefined);
    setIsComposeOpen(true);
  };

  const handleFilterEmailHistory = (query: string) => {
    setViewMode('mail');
    setSearchQuery(query);
  };

  const handleComposeToDirectoryContact = (contact: DirectoryContact) => {
    setComposeRecipient(contact);
    setComposeSubject('');
    setComposeThreadId(undefined);
    setIsComposeOpen(true);
  };

  const handleSendCompose = (data: {
    to: PoliceEmail['to'];
    subject: string;
    body: string;
    priority: PoliceEmail['priority'];
    classification: PoliceEmail['classification'];
    threadId?: string;
  }) => {
    policeMailEngine.sendEmail({
      to: data.to,
      subject: data.subject,
      body: data.body,
      threadId: data.threadId
    });
    setIsComposeOpen(false);
    setActiveFolder('sent');
    setViewMode('mail');
  };

  const inboxUnread = policeMailEngine.getUnreadCount('inbox');

  const folders: { id: MailFolder; name: string; icon: string; count?: number }[] = [
    { id: 'inbox', name: 'Inbox', icon: 'Inbox', count: inboxUnread },
    { id: 'starred', name: 'Starred', icon: 'Star' },
    { id: 'important', name: 'Priority / Urgent', icon: 'AlertCircle' },
    { id: 'sent', name: 'Sent Memos', icon: 'Send' },
    { id: 'archive', name: 'Historical Archive', icon: 'Archive' },
    { id: 'trash', name: 'Deleted Items', icon: 'Trash2' }
  ];

  return (
    <div className="flex h-full w-full bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* LEFT SIDEBAR */}
      <div className="w-56 bg-slate-925 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* App Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Icon name="Mail" className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono text-xs font-bold tracking-wider text-slate-100">
                POLICE MAIL
              </span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              SEC-V3
            </span>
          </div>

          {/* Compose Button */}
          <div className="p-3">
            <button
              type="button"
              onClick={() => {
                setComposeRecipient(null);
                setComposeSubject('');
                setComposeThreadId(undefined);
                setIsComposeOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-mono font-medium shadow transition-all duration-150 active:scale-98"
            >
              <Icon name="Plus" className="w-3.5 h-3.5" />
              <span>Compose Memo</span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="px-2 space-y-0.5">
            <div className="px-2 pt-1 pb-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Mailboxes
            </div>
            {folders.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setActiveFolder(f.id);
                  setViewMode('mail');
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors ${
                  viewMode === 'mail' && activeFolder === f.id
                    ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon name={f.icon} className="w-3.5 h-3.5" />
                  <span>{f.name}</span>
                </div>
                {f.count !== undefined && f.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold">
                    {f.count}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-3 px-2 pb-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Department Services
            </div>

            <button
              type="button"
              onClick={() => setViewMode('directory')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors ${
                viewMode === 'directory'
                  ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon name="Users" className="w-3.5 h-3.5" />
                <span>NPD Roster & Directory</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{directory.length}</span>
            </button>
          </nav>
        </div>

        {/* User Badge Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300 font-semibold truncate">Det. S. Miller #4081</span>
          </div>
          <div className="text-[10px] text-slate-500 truncate mt-0.5">
            WS-07 • Cold Case Unit
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      {viewMode === 'directory' ? (
        <PoliceDirectoryView
          directory={directory}
          onComposeTo={handleComposeToDirectoryContact}
          onFilterEmailHistory={handleFilterEmailHistory}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* THREAD LIST COLUMN */}
          <div className="w-80 lg:w-96 border-r border-slate-800 flex flex-col bg-slate-900/60 flex-shrink-0">
            {/* Search Bar */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-950/40">
              <div className="relative">
                <Icon name="Search" className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={`Search ${activeFolder}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            {/* List */}
            <MailThreadList
              threads={threads}
              selectedThreadId={selectedThreadId}
              activeFolder={activeFolder}
              onSelectThread={handleSelectThread}
              onToggleStar={handleToggleStar}
              onReply={handleReply}
              onForward={handleForward}
              onArchive={handleArchiveThread}
              onPinToBoard={handlePinToBoard}
            />
          </div>

          {/* READER COLUMN */}
          {activeThread ? (
            <MailReader
              thread={activeThread}
              onToggleStar={handleToggleStar}
              onPinToBoard={handlePinToBoard}
              onDeleteThread={handleDeleteThread}
              onArchiveThread={handleArchiveThread}
              onReply={handleReply}
              onForward={handleForward}
              onComposeTo={handleComposeToDirectoryContact}
              onFilterEmailHistory={handleFilterEmailHistory}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 font-mono text-xs">
              <Icon name="Mail" className="w-10 h-10 mb-2 opacity-30 text-slate-400" />
              <p className="font-semibold uppercase tracking-wider text-slate-400">NO MESSAGE SELECTED</p>
              <p className="text-[11px] text-slate-500 mt-1">Select a correspondence thread from the left column to view dossier.</p>
            </div>
          )}
        </div>
      )}

      {/* Compose Modal */}
      {isComposeOpen && (
        <ComposeMailModal
          initialRecipient={composeRecipient}
          initialSubject={composeSubject}
          initialThreadId={composeThreadId}
          directory={directory}
          onClose={() => setIsComposeOpen(false)}
          onSend={handleSendCompose}
        />
      )}
    </div>
  );
};
