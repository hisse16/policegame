export interface PoliceEmailContact {
  name: string;
  email: string;
  rank?: string;
  badge?: string;
  department?: string;
}

export interface PoliceEmailAttachment {
  id: string;
  name: string;
  size: string;
  mimeType: string;
  relatedRecordId?: string;
  filePath?: string;
  fileContent?: string;
}

export type PoliceEmailPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type SecurityClassification =
  | 'UNCLASSIFIED'
  | 'LAW ENFORCEMENT SENSITIVE'
  | 'CONFIDENTIAL'
  | 'RESTRICTED / INTERNAL AFFAIRS';

export type MailFolder = 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash' | 'starred' | 'important';

export interface PoliceEmail {
  id: string;
  threadId: string;
  subject: string;
  from: PoliceEmailContact;
  to: PoliceEmailContact[];
  cc?: PoliceEmailContact[];
  date: string;
  timestamp: number;
  body: string;
  folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash';
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  priority: PoliceEmailPriority;
  classification: SecurityClassification;
  relatedCaseIds?: string[];
  relatedRecordIds?: string[];
  attachments?: PoliceEmailAttachment[];
  historicalEra: '1998' | '1999' | '2004' | '2026';
  act: number; // 1 to 6
  isBoardPinned?: boolean;
}

export interface EmailThread {
  threadId: string;
  subject: string;
  participants: PoliceEmailContact[];
  lastMessageDate: string;
  lastMessageTimestamp: number;
  messageCount: number;
  unreadCount: number;
  isStarred: boolean;
  isImportant: boolean;
  messages: PoliceEmail[];
  folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash';
  classification: SecurityClassification;
  relatedCaseIds?: string[];
}

export interface DirectoryContact {
  id: string;
  officerId?: string;
  personId?: string;
  name: string;
  rank: string;
  badgeNumber?: string;
  department: string;
  division: string;
  role: string;
  email: string;
  phoneExt: string;
  directPhone: string;
  officeLocation: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TRANSFERRED' | 'RETIRED' | 'DECEASED';
  supervisor: string;
  employmentPeriod: string;
  deskAssignment: string;
  clearanceLevel: 'LEVEL 1' | 'LEVEL 2' | 'LEVEL 3' | 'LEVEL 4 - RESTRICTED' | 'EXECUTIVE';
  notes?: string;
}

export interface PoliceMailState {
  emails: PoliceEmail[];
  drafts: Partial<PoliceEmail>[];
  activeFolder: MailFolder;
  selectedThreadId: string | null;
  selectedEmailId: string | null;
  searchQuery: string;
  filterPriority?: PoliceEmailPriority | 'all';
  filterClassification?: SecurityClassification | 'all';
  filterCaseId?: string;
  filterEra?: string;
  unreadCount: number;
  lastSync: string;
}
