/**
 * Type definitions for the PRIS (Police Records & Investigation System)
 */

export type RecordType =
  | 'person'
  | 'case'
  | 'incident'
  | 'evidence'
  | 'vehicle'
  | 'officer'
  | 'report'
  | 'location'
  | 'organization'
  | 'warrant'
  | 'arrest'
  | 'witness';

export type CrimeCategory =
  | 'HOMICIDE'
  | 'ROBBERY'
  | 'BURGLARY'
  | 'THEFT'
  | 'ASSAULT'
  | 'NARCOTICS'
  | 'FRAUD'
  | 'CYBERCRIME'
  | 'ORGANIZED_CRIME'
  | 'WEAPONS'
  | 'MISSING_PERSON'
  | 'TRAFFIC'
  | 'VANDALISM'
  | 'SEXUAL_OFFENSE'
  | 'OTHER';

export type CaseStatus =
  | 'OPEN'
  | 'ACTIVE'
  | 'PENDING'
  | 'SUSPENDED'
  | 'CLOSED'
  | 'SOLVED'
  | 'UNSOLVED'
  | 'COLD CASE'
  | 'ARCHIVED'
  | 'REOPENED';

export type PriorityLevel = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type AccessLevel = 'OFFICER' | 'DETECTIVE' | 'SUPERVISOR' | 'ADMIN';

export interface RecordVersion {
  version: number;
  date: string;
  modifiedBy: string;
  changeSummary: string;
  changedFields?: Record<string, { oldVal: any; newVal: any }>;
}

export interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  recordId?: string;
  recordType?: RecordType;
  officerId?: string;
}

export interface CustodyTransfer {
  id: string;
  timestamp: string;
  action: string;
  fromOfficerOrLocation: string;
  toOfficerOrLocation: string;
  reason: string;
  authorizedBy?: string;
  discrepancyNote?: string;
}

export interface BaseRecord {
  id: string;
  type: RecordType;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  tags: string[];
  isSealed?: boolean;
  isRedacted?: boolean;
  accessLevel?: AccessLevel;
  sealedReason?: string;
  isCorrupted?: boolean;
  corruptionMessage?: string;
  history?: RecordVersion[];
  metadata?: Record<string, any>;
}

export interface PersonRecord extends BaseRecord {
  type: 'person';
  firstName: string;
  lastName: string;
  dob: string;
  pob: string;
  gender: 'M' | 'F' | 'OTHER';
  height: string;
  weight: string;
  hair: string;
  eyes: string;
  occupation: string;
  nationality: string;
  aliases: string[];
  addresses: string[];
  phones: string[];
  emails: string[];
  employmentHistory: { company: string; role: string; years: string }[];
  driverLicenseId?: string;
  nationalId?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  knownOffenses: string[];
  arrestHistory: string[]; // Arrest IDs
  convictionHistory: string[];
  openCaseIds: string[];
  closedCaseIds: string[];
  warrantIds: string[];
  isMissing?: boolean;
  missingPersonDetails?: {
    dateReported: string;
    lastSeenDate: string;
    lastSeenLocation: string;
    clothingDescription: string;
    vehicleDescription?: string;
    medicalNotes?: string;
    searchGridRef?: string;
    status: 'MISSING' | 'LOCATED' | 'DECEASED' | 'UNKNOWN';
  };
  timeline: TimelineEvent[];
}

export interface CaseRecord extends BaseRecord {
  type: 'case';
  caseNumber: string; // e.g. CASE-1998-027
  classification: CrimeCategory;
  subCategory?: string;
  dateOpened: string;
  dateClosed?: string;
  leadInvestigatorId: string;
  department: string;
  location: string;
  victimIds: string[];
  suspectIds: string[];
  poiIds: string[];
  witnessIds: string[];
  evidenceIds: string[];
  vehicleIds: string[];
  weaponIds: string[];
  reportIds: string[];
  warrantIds: string[];
  arrestIds: string[];
  incidentIds: string[];
  relatedCaseIds: string[];
  priority: PriorityLevel;
  summary: string;
  internalCommunications?: { timestamp: string; author: string; message: string }[];
  reopenedInfo?: { timestamp: string; officerId: string; reason: string };
  timeline: TimelineEvent[];
  // Homicide specialized fields
  homicideDetails?: {
    mannerOfDeath: string;
    causeOfDeath: string;
    estimatedTimeOfDeath: string;
    locationFound: string;
    medicalExaminer: string;
    autopsyReportNumber?: string;
    ballisticsSummary?: string;
    toxicologySummary?: string;
  };
  // Narcotics specialized fields
  narcoticsDetails?: {
    substances: { name: string; estimatedWeight: string; purity?: string }[];
    packagingType: string;
    distributionTier: string;
    suspectedCartelOrGang?: string;
    labTestedDate?: string;
  };
  // Theft / Robbery specialized fields
  theftDetails?: {
    stolenProperty: { item: string; serialNumber?: string; valueEstimate: number }[];
    recoveredValueTotal?: number;
    pointsOfEntry?: string;
    cctvReferences?: string[];
  };
}

export interface IncidentRecord extends BaseRecord {
  type: 'incident';
  incidentNumber: string; // e.g. INCIDENT-1998-1142
  category: string;
  date: string;
  time: string;
  location: string;
  reportingOfficerId: string;
  linkedCaseId?: string;
  linkedPersonIds: string[];
  linkedVehicleIds: string[];
  linkedEvidenceIds: string[];
  narrative: string;
}

export interface ForensicReport {
  id: string;
  type?:
    | 'DNA'
    | 'FINGERPRINT'
    | 'DOCUMENT'
    | 'DIGITAL'
    | 'VEHICLE'
    | 'TRACE'
    | 'BALLISTICS'
    | 'AUDIO'
    | 'CHEMICAL'
    | 'GENERAL'
    | string;
  reportType?: string;
  title?: string;
  laboratory?: string;
  labName?: string;
  technician?: string;
  analystName?: string;
  submissionDate?: string;
  completionDate?: string;
  dateConducted?: string;
  status: 'COMPLETED' | 'PENDING' | 'INCONCLUSIVE' | 'INSUFFICIENT_SAMPLE';
  confidenceRating?: string;
  confidenceScore?: number;
  comparisonTarget?: string;
  comparisonReference?: string;
  methodology?: string;
  findings: string;
  notes?: string;
  details?: Record<string, any>;
}

export interface EvidencePhoto {
  id: string;
  photoNumber: string;
  caption: string;
  timestamp: string;
  photographer: string;
  location: string;
  azimuth?: string;
  svgData?: string;
  url?: string;
  tags?: string[];
}

export interface EvidenceRecord extends BaseRecord {
  type: 'evidence';
  evidenceId: string; // e.g. E-004821 or EV-1998-027-014
  caseId: string;
  incidentId?: string;
  evidenceType: string; // e.g. Physical, Digital, Ballistics, Document, Biological
  description: string;
  collectedByOfficerId: string;
  collectionDate: string;
  collectionTime?: string;
  collectionLocation: string;
  storageLocation: string; // e.g. Vault B, Locker 14
  submittedBy?: string;
  currentStatus?: string; // IN_STORAGE, CHECKED_OUT, ARCHIVED, EXAMINED, CORRUPTED, DESTROYED, MISSING, RELEASED
  laboratoryStatus?:
    | 'NOT_REQUESTED'
    | 'SCHEDULED'
    | 'PENDING'
    | 'COMPLETED'
    | 'INCONCLUSIVE'
    | 'INSUFFICIENT_SAMPLE';
  chainOfCustody: CustodyTransfer[];
  labAnalysis?: {
    laboratory: string;
    analysisDate: string;
    technician: string;
    results: string;
  };
  forensicReports?: ForensicReport[];
  photos?: EvidencePhoto[];
  relatedPersonIds?: string[];
  relatedVehicleId?: string;
  relatedVehicleIds?: string[];
  relatedLocationIds?: string[];
  relatedReportIds?: string[];
  relatedIncidentIds?: string[];
  relatedCaseIds?: string[];
  discrepancyFlag?: string;
  isArchived?: boolean;
  notes?: string;
}

export interface VehicleRecord extends BaseRecord {
  type: 'vehicle';
  licensePlate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  ownerId?: string;
  registeredAddress: string;
  vehicleStatus: 'REGISTERED' | 'STOLEN' | 'RECOVERED' | 'IMPOUNDED' | 'SOLD' | 'SCRAPPED';
  tickets: { date: string; violation: string; location: string }[];
  accidents: { date: string; details: string; reportId?: string }[];
  caseIds: string[];
}

export interface OfficerRecord extends BaseRecord {
  type: 'officer';
  badgeNumber: string;
  name: string;
  rank: 'Officer' | 'Detective' | 'Sergeant' | 'Lieutenant' | 'Captain' | 'Chief';
  department: string;
  assignment: string;
  employmentDates: string;
  supervisorName?: string;
  assignedCaseIds: string[];
  authoredReportIds: string[];
  timeline: TimelineEvent[];
  internalNotes?: string;
}

export interface ReportRecord extends BaseRecord {
  type: 'report';
  reportNumber: string; // e.g. R-1998-112
  caseId?: string;
  incidentId?: string;
  authorOfficerId: string;
  authorRank: string;
  authorName: string;
  date: string;
  time: string;
  location: string;
  reportType:
    | 'INITIAL REPORT'
    | 'SUPPLEMENTAL REPORT'
    | 'INTERVIEW REPORT'
    | 'CRIME SCENE REPORT'
    | 'ARREST REPORT'
    | 'EVIDENCE REPORT'
    | 'FORENSIC REPORT'
    | 'AUTOPSY REPORT'
    | 'SURVEILLANCE REPORT'
    | 'INTERNAL MEMO';
  narrative: string;
  signature: string;
  attachments?: string[];
  redactions?: { section: string; originalText: string }[];
  relatedPersonIds: string[];
  relatedEvidenceIds: string[];
}

export interface WarrantRecord extends BaseRecord {
  type: 'warrant';
  warrantNumber: string;
  personId: string;
  personName: string;
  caseId?: string;
  issueDate: string;
  expirationDate: string;
  issuingAuthority: string; // e.g. Municipal Superior Court Judge Alvarez
  charges: string[];
  warrantStatus: 'ACTIVE' | 'EXECUTED' | 'CANCELLED' | 'EXPIRED';
  assignedOfficerId: string;
  notes?: string;
}

export interface ArrestRecord extends BaseRecord {
  type: 'arrest';
  bookingNumber: string;
  personId: string;
  personName: string;
  caseId?: string;
  date: string;
  time: string;
  location: string;
  arrestingOfficerId: string;
  charges: string[];
  courtOutcome?: string;
  bailAmount?: number;
}

export interface LocationRecord extends BaseRecord {
  type: 'location';
  address: string;
  district: string;
  locationType: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'PUBLIC' | 'MUNICIPAL' | 'MEDICAL';
  knownOccupantNames: string[];
  knownBusinessNames: string[];
  incidentIds: string[];
  caseIds: string[];
}

export interface OrganizationRecord extends BaseRecord {
  type: 'organization';
  orgName: string;
  registrationNumber: string;
  orgType: string;
  headquartersAddress: string;
  phone: string;
  executives: string[];
  employeePersonIds: string[];
  associatedCaseIds: string[];
  complaints: { date: string; summary: string }[];
}

export type AnyRecord =
  | PersonRecord
  | CaseRecord
  | IncidentRecord
  | EvidenceRecord
  | VehicleRecord
  | OfficerRecord
  | ReportRecord
  | WarrantRecord
  | ArrestRecord
  | LocationRecord
  | OrganizationRecord;

export type RelationshipType =
  | 'FAMILY'
  | 'FRIEND'
  | 'ASSOCIATE'
  | 'EMPLOYEE'
  | 'EMPLOYER'
  | 'VICTIM'
  | 'SUSPECT'
  | 'WITNESS'
  | 'OFFICER'
  | 'OWNER'
  | 'DRIVER'
  | 'LOCATION'
  | 'EVIDENCE'
  | 'CASE'
  | 'INCIDENT'
  | 'VEHICLE'
  | 'ORGANIZATION'
  | 'REPORT'
  | 'WARRANT';

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  description?: string;
}

export interface InvestigatorNote {
  id: string;
  recordId: string;
  author: string;
  timestamp: string;
  content: string;
}

export interface InvestigationBookmark {
  recordId: string;
  recordType: RecordType;
  title: string;
  timestamp: string;
  folder?: string;
}

export type BoardNodeType =
  | 'person'
  | 'case'
  | 'incident'
  | 'evidence'
  | 'vehicle'
  | 'officer'
  | 'report'
  | 'location'
  | 'organization'
  | 'warrant'
  | 'note'
  | 'question'
  | 'hypothesis'
  | 'event'
  | 'date'
  | 'analysis'
  | 'record';

export interface BoardNode {
  id: string;
  recordId?: string;
  recordType?: RecordType;
  nodeType?: BoardNodeType;
  label: string;
  subtitle?: string;
  x: number;
  y: number;
  color?: string;
  noteText?: string;
  evidenceId?: string;
  photoUrl?: string;
  // Question fields
  questionStatus?: 'OPEN' | 'RESOLVED';
  // Hypothesis fields
  hypothesisStatus?: 'OPEN' | 'SUPPORTED' | 'WEAKENED' | 'DISPROVEN' | 'UNRESOLVED';
  confidenceScore?: number; // 0 - 100
  supportingRecordIds?: string[];
  contradictingRecordIds?: string[];
  // Event / Date fields
  date?: string;
  time?: string;
  isPinned?: boolean;
}

export type ConnectionRelation =
  | 'knew'
  | 'related to'
  | 'owned'
  | 'employed by'
  | 'witnessed'
  | 'contacted'
  | 'located at'
  | 'associated with'
  | 'referenced by'
  | 'collected from'
  | 'transferred to'
  | 'contradicts'
  | 'supports'
  | 'occurred before'
  | 'occurred after'
  | 'possibly connected to'
  | string;

export interface BoardEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  relationType?: ConnectionRelation;
  isContradiction?: boolean;
  isSupport?: boolean;
  notes?: string;
}

export interface BoardTimelineEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  sourceRecordId?: string;
  sourceRecordType?: RecordType;
  relatedRecordId?: string;
  nodeId?: string;
  reliability: 'VERIFIED' | 'QUESTIONABLE' | 'CONTRADICTED' | 'UNCONFIRMED' | 'UNVERIFIED';
  hasContradiction?: boolean;
  contradictionWithEventId?: string;
  contradictionNote?: string;
}

export interface InvestigationBoardState {
  id?: string;
  title?: string;
  nodes: BoardNode[];
  edges: BoardEdge[];
  timelineEvents?: BoardTimelineEvent[];
  viewMode?: 'board' | 'timeline';
  zoom?: number;
  pan?: { x: number; y: number };
  lastSaved?: string;
}

export interface SearchQuery {
  term: string;
  type?: RecordType | 'all';
  limit?: number;
  offset?: number;
}

export interface AdvancedSearchFilters {
  query?: string;
  recordType?: RecordType | 'all';
  dateFrom?: string;
  dateTo?: string;
  crimeCategory?: CrimeCategory | 'all';
  status?: string;
  priority?: PriorityLevel | 'all';
  location?: string;
  officerId?: string;
  operator?: 'AND' | 'OR';
}
