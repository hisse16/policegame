export interface StoryAct {
  id: number; // 1 to 6
  title: string;
  subtitle: string;
  description: string;
  revelationTitle: string;
  revelationText: string;
}

export type DiscoveryTriggerType =
  | 'view_record'
  | 'search_term'
  | 'view_webpage'
  | 'view_file'
  | 'compare_records'
  | 'terminal_cmd'
  | 'flag';

export interface DiscoveryStep {
  id: string;
  act: number;
  order: number;
  title: string;
  description: string;
  trigger: {
    type: DiscoveryTriggerType;
    targetId?: string;
    searchTerm?: string;
    requiredFlags?: string[];
  };
  flagGranted: string;
  factsAdded: string[];
  questionsAdded?: string[];
  questionsResolved?: string[];
  timelineEventsAdded?: string[];
  contradictionAdded?: string;
  leadsAdded?: string[];
  hintLevel1: string;
  hintLevel2: string;
  hintLevel3: string;
}

export interface StoryFact {
  id: string;
  act: number;
  category: 'CASE' | 'PERSON' | 'VEHICLE' | 'EVIDENCE' | 'LOCATION' | 'TIMELINE' | 'ARCHIVE';
  text: string;
  source: string;
  relatedRecordIds?: string[];
  discoveredAt?: string;
}

export interface UnresolvedQuestion {
  id: string;
  act: number;
  text: string;
  context: string;
  resolutionSummary?: string;
  isResolved?: boolean;
}

export interface Contradiction {
  id: string;
  title: string;
  sourceA: {
    recordId: string;
    label: string;
    statement: string;
    timestamp?: string;
  };
  sourceB: {
    recordId: string;
    label: string;
    statement: string;
    timestamp?: string;
  };
  explanation: string;
  category: 'TIMELINE' | 'ALIBI' | 'EVIDENCE' | 'PROCEDURE';
}

export interface InvestigationTimelineEvent {
  id: string;
  date: string;
  time?: string;
  timestampFormatted: string;
  location: string;
  personsInvolved: string[];
  description: string;
  source: string;
  sourceRecordId?: string;
  confidence:
    | 'OFFICIAL_LOG'
    | 'DISPATCH_VERIFIED'
    | 'WITNESS_STATEMENT'
    | 'SUSPECT_ALIBI'
    | 'CONTRADICTED';
  hasConflict?: boolean;
  conflictDetails?: string;
}

export interface InvestigationLead {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'PURSUED' | 'DISPROVEN' | 'CONFIRMED';
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  suggestedAction: string;
  relatedRecordId?: string;
}

export interface DeductionSubmission {
  whoSuspectId: string;
  whatCrimeType: string;
  whenDate: string;
  whereLocationId: string;
  whyMotive: string;
  howMethod: string;
  keyEvidenceIds: string[];
}

export interface DeductionResult {
  isFullyCorrect: boolean;
  accuracyPercentage: number;
  whoCorrect: boolean;
  whatCorrect: boolean;
  whenCorrect: boolean;
  whereCorrect: boolean;
  whyCorrect: boolean;
  howCorrect: boolean;
  evidenceScore: number;
  feedback: {
    who: string;
    what: string;
    when: string;
    where: string;
    why: string;
    how: string;
    evidence: string;
  };
  officialDetermination: string;
}

export interface InvestigationAction {
  stepId: string;
  title: string;
  description: string;
  actionType: DiscoveryTriggerType;
  targetId?: string;
  searchTerm?: string;
  hintLevel: number;
  hintText: string;
  isOptional: boolean;
}

export interface DeductionReadiness {
  ready: boolean;
  currentAct: number;
  reasons: string[];
  discoveredEvidenceIds: string[];
  requiredEvidenceIds: string[];
}

export interface StoryState {
  currentAct: number;
  flags: Record<string, boolean>;
  discoveredStepIds: string[];
  discoveredFactIds: string[];
  openQuestionIds: string[];
  resolvedQuestionIds: string[];
  discoveredContradictionIds: string[];
  activeLeadIds: string[];
  timelineEventIds: string[];
  playerNotes: string;
  hintsUnlocked: Record<string, number>;
  lastActivityTimestamp: number;
  deductionAttempts: number;
  caseResolved: boolean;
  caseResolvedAt?: string;
}
