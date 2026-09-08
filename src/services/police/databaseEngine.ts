import {
  AnyRecord,
  RecordType,
  Relationship,
  InvestigatorNote,
  InvestigationBookmark,
  InvestigationBoardState,
  BoardNode,
  BoardEdge,
  BoardTimelineEvent,
  EvidenceRecord,
  CustodyTransfer,
  ForensicReport,
  CaseRecord
} from '../../types/police';
import {
  CURATED_OFFICERS,
  CURATED_PERSONS,
  CURATED_CASES,
  CURATED_INCIDENTS,
  CURATED_EVIDENCE,
  CURATED_VEHICLES,
  CURATED_REPORTS,
  CURATED_LOCATIONS,
  CURATED_ORGANIZATIONS,
  CURATED_WARRANTS,
  CURATED_RELATIONSHIPS
} from './curatedRecords';
import { generatePoliceDataset } from './datasetGenerator';
import { vfs } from '../vfs';

export interface PoliceDatabaseStats {
  openCases: number;
  closedCases: number;
  activeInvestigations: number;
  missingPersons: number;
  wantedPersons: number;
  unidentifiedPersons: number;
  recentIncidents: number;
  evidenceItems: number;
  totalPersons: number;
  totalVehicles: number;
  totalReports: number;
  totalOfficers: number;
}

const STORAGE_KEY = 'pris_database_state_v1';

class DatabaseEngine {
  private records: Map<string, AnyRecord> = new Map();
  private recordsByType: Map<RecordType, AnyRecord[]> = new Map();
  private relationships: Relationship[] = [];
  private notes: Map<string, InvestigatorNote[]> = new Map(); // recordId -> notes
  private bookmarks: Map<string, InvestigationBookmark> = new Map();
  private searchHistory: { timestamp: string; query: string }[] = [];
  private recentViews: string[] = []; // IDs
  private boardState: InvestigationBoardState = { nodes: [], edges: [] };
  private listeners: Set<() => void> = new Set();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  public initialize() {
    if (this.isInitialized) return;

    // 1. Generate base procedural dataset
    const generated = generatePoliceDataset();

    // 2. Insert generated records into map
    const allGenerated: AnyRecord[] = [
      ...generated.officers,
      ...generated.persons,
      ...generated.cases,
      ...generated.incidents,
      ...generated.evidence,
      ...generated.vehicles,
      ...generated.reports,
      ...generated.locations,
      ...generated.organizations,
      ...generated.warrants,
      ...generated.arrests
    ];

    for (const rec of allGenerated) {
      this.records.set(rec.id, rec);
    }

    // 3. Override/Insert Curated Mystery records (take priority!)
    const allCurated: AnyRecord[] = [
      ...CURATED_OFFICERS,
      ...CURATED_PERSONS,
      ...CURATED_CASES,
      ...CURATED_INCIDENTS,
      ...CURATED_EVIDENCE,
      ...CURATED_VEHICLES,
      ...CURATED_REPORTS,
      ...CURATED_LOCATIONS,
      ...CURATED_ORGANIZATIONS,
      ...CURATED_WARRANTS
    ];

    for (const rec of allCurated) {
      this.records.set(rec.id, rec);
    }

    // 4. Combine relationships
    this.relationships = [...CURATED_RELATIONSHIPS, ...generated.relationships];

    // 5. Build Type indices
    this.rebuildTypeIndices();

    // 6. Restore user persistence (notes, bookmarks, search history, board)
    this.loadPersistence();

    // Seed default Investigation Board if empty
    if (this.boardState.nodes.length === 0) {
      this.seedDefaultInvestigationBoard();
    }

    this.isInitialized = true;
  }

  private rebuildTypeIndices() {
    this.recordsByType.clear();
    for (const rec of this.records.values()) {
      const list = this.recordsByType.get(rec.type) || [];
      list.push(rec);
      this.recordsByType.set(rec.type, list);
    }
  }

  private seedDefaultInvestigationBoard() {
    this.boardState = {
      nodes: [
        { id: 'bn_1', recordId: 'P-004821', recordType: 'person', label: 'ANNA BELL', subtitle: 'Missing Person (Case 27)', x: 120, y: 140, color: '#3b82f6' },
        { id: 'bn_2', recordId: 'CASE-1998-027', recordType: 'case', label: 'CASE-1998-027', subtitle: 'Reopened 2026', x: 380, y: 140, color: '#eab308' },
        { id: 'bn_3', recordId: 'LOC-WILLOW42', recordType: 'location', label: '42 WILLOW STREET', subtitle: 'Residence Scene', x: 640, y: 140, color: '#10b981' },
        { id: 'bn_4', recordId: 'VEH-TXR481', recordType: 'vehicle', label: '1987 FORD TAURUS', subtitle: 'Plate: TXR-481', x: 380, y: 320, color: '#8b5cf6' },
        { id: 'bn_5', recordId: 'E-004821', recordType: 'evidence', label: 'EVIDENCE E-004821', subtitle: 'Key Fob & Tape', x: 640, y: 320, color: '#ef4444' },
        { id: 'bn_6', recordId: 'OFF-3014', recordType: 'officer', label: 'DET. DANIEL HAYES', subtitle: 'Original Lead Investigator', x: 120, y: 320, color: '#06b6d4' },
        { id: 'bn_note1', label: 'INITIAL CASE SUMMARY', noteText: 'Check chain-of-custody timestamps on Evidence E-004821 vs Impound Lot arrival.', x: 360, y: 460, color: '#f59e0b' }
      ],
      edges: [
        { id: 'be_1', from: 'bn_1', to: 'bn_2', label: 'Subject of Case' },
        { id: 'be_2', from: 'bn_2', to: 'bn_3', label: 'Crime Scene' },
        { id: 'be_3', from: 'bn_2', to: 'bn_4', label: 'Victim Vehicle' },
        { id: 'be_4', from: 'bn_4', to: 'bn_5', label: 'Found In Vehicle' },
        { id: 'be_5', from: 'bn_6', to: 'bn_2', label: 'Filed Reports' }
      ]
    };
  }

  // --- Persistence ---
  private loadPersistence() {
    try {
      const dataStr = localStorage.getItem(STORAGE_KEY);
      if (!dataStr) return;
      const data = JSON.parse(dataStr);

      if (data.notes) {
        for (const [recId, noteList] of Object.entries(data.notes)) {
          this.notes.set(recId, noteList as InvestigatorNote[]);
        }
      }

      if (data.bookmarks) {
        for (const [recId, bm] of Object.entries(data.bookmarks)) {
          this.bookmarks.set(recId, bm as InvestigationBookmark);
        }
      }

      if (Array.isArray(data.searchHistory)) {
        this.searchHistory = data.searchHistory;
      }

      if (Array.isArray(data.recentViews)) {
        this.recentViews = data.recentViews;
      }

      if (data.boardState && Array.isArray(data.boardState.nodes)) {
        this.boardState = data.boardState;
      }

      // Restore modified records
      if (data.recordOverrides) {
        for (const [id, partial] of Object.entries(data.recordOverrides)) {
          const existing = this.records.get(id);
          if (existing) {
            Object.assign(existing, partial);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load PRIS database persistence:', e);
    }
  }

  public savePersistence() {
    try {
      const notesObj: Record<string, InvestigatorNote[]> = {};
      this.notes.forEach((val, key) => {
        notesObj[key] = val;
      });

      const bookmarksObj: Record<string, InvestigationBookmark> = {};
      this.bookmarks.forEach((val, key) => {
        bookmarksObj[key] = val;
      });

      const payload = {
        notes: notesObj,
        bookmarks: bookmarksObj,
        searchHistory: this.searchHistory.slice(0, 50),
        recentViews: this.recentViews.slice(0, 30),
        boardState: this.boardState
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save PRIS database persistence:', e);
    }
  }

  // --- Subscriptions ---
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.savePersistence();
    this.listeners.forEach((l) => l());
  }

  // --- Data Access ---
  public getRecord(id: string): AnyRecord | null {
    return this.records.get(id) || null;
  }

  public getAllRecords(type?: RecordType): AnyRecord[] {
    if (type) {
      return this.recordsByType.get(type) || [];
    }
    return Array.from(this.records.values());
  }

  public getRecordsByCrimeCategory(category: string): CaseRecord[] {
    const allCases = (this.recordsByType.get('case') || []) as CaseRecord[];
    return allCases.filter((c) => c.classification === category);
  }

  public getStats(): PoliceDatabaseStats {
    const cases = (this.recordsByType.get('case') || []) as CaseRecord[];
    const openCases = cases.filter((c) => c.status === 'OPEN' || c.status === 'ACTIVE' || c.status === 'REOPENED').length;
    const closedCases = cases.filter((c) => c.status === 'CLOSED' || c.status === 'SOLVED' || c.status === 'ARCHIVED').length;
    const activeInvestigations = cases.filter((c) => c.status === 'ACTIVE' || c.status === 'REOPENED').length;

    const persons = (this.recordsByType.get('person') || []);
    const missingPersons = persons.filter((p: any) => p.isMissing || p.tags.includes('MISSING_PERSON')).length;
    const warrants = (this.recordsByType.get('warrant') || []);
    const wantedPersons = warrants.filter((w: any) => w.warrantStatus === 'ACTIVE').length;

    const incidents = (this.recordsByType.get('incident') || []);
    const evidence = (this.recordsByType.get('evidence') || []);
    const vehicles = (this.recordsByType.get('vehicle') || []);
    const reports = (this.recordsByType.get('report') || []);
    const officers = (this.recordsByType.get('officer') || []);

    return {
      openCases,
      closedCases,
      activeInvestigations,
      missingPersons: Math.max(missingPersons, 19),
      wantedPersons: Math.max(wantedPersons, 31),
      unidentifiedPersons: 7,
      recentIncidents: incidents.length,
      evidenceItems: evidence.length,
      totalPersons: persons.length,
      totalVehicles: vehicles.length,
      totalReports: reports.length,
      totalOfficers: officers.length
    };
  }

  // --- Relationships ---
  public getRelationshipsForRecord(recordId: string): Relationship[] {
    return this.relationships.filter(
      (rel) => rel.sourceId === recordId || rel.targetId === recordId
    );
  }

  public addRelationship(sourceId: string, targetId: string, type: Relationship['type'], description?: string) {
    const newRel: Relationship = {
      id: `rel_${Math.random().toString(36).substring(2, 9)}`,
      sourceId,
      targetId,
      type,
      description
    };
    this.relationships.push(newRel);
    this.notify();
  }

  // --- Notes ---
  public getNotesForRecord(recordId: string): InvestigatorNote[] {
    return this.notes.get(recordId) || [];
  }

  public addNote(recordId: string, author: string, content: string): InvestigatorNote {
    const newNote: InvestigatorNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      recordId,
      author,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      content
    };
    const list = this.notes.get(recordId) || [];
    list.unshift(newNote);
    this.notes.set(recordId, list);
    this.notify();
    return newNote;
  }

  public deleteNote(recordId: string, noteId: string) {
    const list = this.notes.get(recordId);
    if (!list) return;
    this.notes.set(recordId, list.filter((n) => n.id !== noteId));
    this.notify();
  }

  // --- Bookmarks ---
  public isBookmarked(recordId: string): boolean {
    return this.bookmarks.has(recordId);
  }

  public toggleBookmark(recordId: string): boolean {
    if (this.bookmarks.has(recordId)) {
      this.bookmarks.delete(recordId);
      this.notify();
      return false;
    } else {
      const rec = this.records.get(recordId);
      if (!rec) return false;
      this.bookmarks.set(recordId, {
        recordId,
        recordType: rec.type,
        title: rec.title,
        timestamp: new Date().toISOString()
      });
      this.notify();
      return true;
    }
  }

  public getAllBookmarks(): InvestigationBookmark[] {
    return Array.from(this.bookmarks.values());
  }

  // --- History & Recents ---
  public recordView(recordId: string) {
    this.recentViews = [recordId, ...this.recentViews.filter((id) => id !== recordId)].slice(0, 30);
    this.notify();
  }

  public getRecentViews(): AnyRecord[] {
    return this.recentViews
      .map((id) => this.records.get(id))
      .filter((r): r is AnyRecord => Boolean(r));
  }

  public recordSearch(query: string) {
    if (!query.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.searchHistory = [{ timestamp: now, query: query.trim() }, ...this.searchHistory.filter((s) => s.query !== query.trim())].slice(0, 40);
    this.notify();
  }

  public getSearchHistory(): { timestamp: string; query: string }[] {
    return this.searchHistory;
  }

  // --- Investigation Board ---
  public getBoardState(): InvestigationBoardState {
    return this.boardState;
  }

  public getBoardNodes(): BoardNode[] {
    return this.boardState.nodes || [];
  }

  public getBoardEdges(): BoardEdge[] {
    return this.boardState.edges || [];
  }

  public getBoardTimeline(): BoardTimelineEvent[] {
    return this.boardState.timelineEvents || [];
  }

  public updateBoardState(state: InvestigationBoardState) {
    this.boardState = state;
    this.notify();
  }

  public addBoardNode(node: BoardNode) {
    const existingIdx = this.boardState.nodes.findIndex((n) => n.id === node.id);
    if (existingIdx >= 0) {
      this.boardState.nodes[existingIdx] = { ...this.boardState.nodes[existingIdx], ...node };
    } else {
      this.boardState.nodes.push(node);
    }
    this.notify();
  }

  public removeBoardNode(id: string) {
    this.boardState.nodes = this.boardState.nodes.filter((n) => n.id !== id);
    this.boardState.edges = this.boardState.edges.filter((e) => e.from !== id && e.to !== id);
    this.notify();
  }

  public updateBoardNode(id: string, partial: Partial<BoardNode>) {
    const node = this.boardState.nodes.find((n) => n.id === id);
    if (node) {
      Object.assign(node, partial);
      this.notify();
    }
  }

  public addBoardEdge(edge: BoardEdge) {
    const existing = this.boardState.edges.find((e) => e.id === edge.id || (e.from === edge.from && e.to === edge.to));
    if (existing) {
      Object.assign(existing, edge);
    } else {
      this.boardState.edges.push(edge);
    }
    this.notify();
  }

  public removeBoardEdge(id: string) {
    this.boardState.edges = this.boardState.edges.filter((e) => e.id !== id);
    this.notify();
  }

  public addTimelineEvent(event: BoardTimelineEvent) {
    if (!this.boardState.timelineEvents) {
      this.boardState.timelineEvents = [];
    }
    this.boardState.timelineEvents.push(event);
    this.notify();
  }

  public updateTimelineEvent(id: string, partial: Partial<BoardTimelineEvent>) {
    if (!this.boardState.timelineEvents) return;
    const ev = this.boardState.timelineEvents.find((e) => e.id === id);
    if (ev) {
      Object.assign(ev, partial);
      this.notify();
    }
  }

  public removeTimelineEvent(id: string) {
    if (!this.boardState.timelineEvents) return;
    this.boardState.timelineEvents = this.boardState.timelineEvents.filter((e) => e.id !== id);
    this.notify();
  }

  // --- Evidence Management ---
  public getEvidenceRecords(): EvidenceRecord[] {
    return (this.recordsByType.get('evidence') || []) as EvidenceRecord[];
  }

  public addEvidence(evidence: EvidenceRecord): EvidenceRecord {
    this.records.set(evidence.id, evidence);
    const list = this.recordsByType.get('evidence') || [];
    const idx = list.findIndex((e) => e.id === evidence.id);
    if (idx >= 0) {
      list[idx] = evidence;
    } else {
      list.push(evidence);
    }
    this.recordsByType.set('evidence', list);
    this.notify();
    return evidence;
  }

  public addCustodyTransfer(evidenceId: string, transfer: CustodyTransfer): boolean {
    const ev = this.records.get(evidenceId) as EvidenceRecord | undefined;
    if (!ev || ev.type !== 'evidence') return false;
    ev.chainOfCustody = [...(ev.chainOfCustody || []), transfer];
    ev.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    this.notify();
    return true;
  }

  public addForensicReport(evidenceId: string, report: ForensicReport): boolean {
    const ev = this.records.get(evidenceId) as EvidenceRecord | undefined;
    if (!ev || ev.type !== 'evidence') return false;
    ev.forensicReports = [...(ev.forensicReports || []), report];
    ev.laboratoryStatus = report.status;
    ev.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    this.notify();
    return true;
  }

  // --- Record Update / Mutation (For Story Engine or In-App editing) ---
  public updateRecord(
    id: string,
    partial: Partial<AnyRecord>,
    modifierName = 'Detective S. Miller (#4081)',
    changeSummary?: string
  ): AnyRecord | null {
    const existing = this.records.get(id);
    if (!existing) return null;

    if (changeSummary) {
      const currentVer = existing.history && existing.history.length > 0 ? existing.history[existing.history.length - 1].version : 1;
      const newVersion = {
        version: currentVer + 1,
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        modifiedBy: modifierName,
        changeSummary
      };
      existing.history = [...(existing.history || []), newVersion];
    }

    Object.assign(existing, partial, {
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    this.notify();
    return existing;
  }

  // --- Export to Virtual Filesystem ---
  public exportRecordToVfs(record: AnyRecord, format: 'txt' | 'pdf' = 'txt'): string {
    const sanitizedTitle = record.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
    const fileName = `${record.type.toUpperCase()}_${sanitizedTitle}.${format}`;
    const targetDir = '/home/investigator/Documents/Police Records';
    const fullPath = `${targetDir}/${fileName}`;

    let bodyText = `=========================================================================\n`;
    bodyText += `METROPOLITAN POLICE DEPARTMENT - CRIMINAL RECORDS ARCHIVE (PRIS)\n`;
    bodyText += `DOCUMENT EXPORT // OFFICIAL USE ONLY // RESTRICTED SENSITIVE\n`;
    bodyText += `RECORD ID: ${record.id}  |  RECORD TYPE: ${record.type.toUpperCase()}\n`;
    bodyText += `EXPORT TIMESTAMP: ${new Date().toISOString()}\n`;
    bodyText += `=========================================================================\n\n`;
    bodyText += `TITLE: ${record.title}\n`;
    bodyText += `STATUS: ${record.status}\n`;
    bodyText += `CREATED: ${record.createdAt}  |  LAST MODIFIED: ${record.updatedAt}\n\n`;

    if (record.type === 'case') {
      const c = record as CaseRecord;
      bodyText += `CLASSIFICATION: ${c.classification}\n`;
      bodyText += `PRIORITY: ${c.priority}\n`;
      bodyText += `LEAD INVESTIGATOR: ${c.leadInvestigatorId}\n`;
      bodyText += `LOCATION: ${c.location}\n\n`;
      bodyText += `CASE SUMMARY:\n${c.summary}\n\n`;
      if (c.timeline && c.timeline.length > 0) {
        bodyText += `INVESTIGATION TIMELINE:\n`;
        c.timeline.forEach((t) => {
          bodyText += `  [${t.date}${t.time ? ' ' + t.time : ''}] ${t.title}: ${t.description}\n`;
        });
      }
    } else if (record.type === 'report') {
      const r = record as any;
      bodyText += `REPORT NUMBER: ${r.reportNumber}\n`;
      bodyText += `OFFICER: ${r.authorRank} ${r.authorName} (${r.authorOfficerId})\n`;
      bodyText += `DATE/TIME: ${r.date} ${r.time}\n`;
      bodyText += `LOCATION: ${r.location}\n\n`;
      bodyText += `NARRATIVE:\n${r.narrative}\n\n`;
      bodyText += `SIGNATURE: ${r.signature}\n`;
    } else {
      bodyText += JSON.stringify(record, null, 2);
    }

    try {
      if (!vfs.getNode(targetDir)) {
        vfs.createDir(targetDir);
      }
      vfs.createFile(fullPath, bodyText);
    } catch (e) {
      console.warn('VFS export error:', e);
    }

    return fullPath;
  }
}

export const policeDatabase = new DatabaseEngine();
