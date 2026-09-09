import {
  StoryState,
  StoryAct,
  DiscoveryStep,
  StoryFact,
  UnresolvedQuestion,
  Contradiction,
  InvestigationTimelineEvent,
  InvestigationLead,
  DeductionSubmission,
  DeductionResult
} from '../../types/story';
import {
  STORY_ACTS,
  DISCOVERY_STEPS,
  STORY_FACTS,
  UNRESOLVED_QUESTIONS,
  CONTRADICTIONS,
  TIMELINE_EVENTS,
  INVESTIGATION_LEADS,
  FINAL_DEDUCTION_SOLUTION
} from './storyData';
import {
  EvidenceRecord,
  ForensicReport,
  CustodyTransfer,
  BoardNode,
  BoardEdge,
  BoardTimelineEvent,
  InvestigationBoardState
} from '../../types/police';
import { policeDatabase } from '../police/databaseEngine';

const STORAGE_KEY = 'investigator_os_story_state_v1';

export type StoryListener = (state: StoryState) => void;

class StoryEngine {
  private state: StoryState;
  private listeners: Set<StoryListener> = new Set();
  private notificationHandler?: (title: string, message: string, type?: 'info' | 'warning' | 'error' | 'success') => void;

  constructor() {
    this.state = this.loadInitialState();
  }

  public setNotificationHandler(handler: (title: string, message: string, type?: 'info' | 'warning' | 'error' | 'success') => void) {
    this.notificationHandler = handler;
  }

  private loadInitialState(): StoryState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          currentAct: parsed.currentAct || 1,
          flags: parsed.flags || { flag_assignment_active: true },
          discoveredStepIds: parsed.discoveredStepIds || [],
          discoveredFactIds: parsed.discoveredFactIds || [],
          openQuestionIds: parsed.openQuestionIds || ['q_why_audit_modification', 'q_why_case_closed_early'],
          resolvedQuestionIds: parsed.resolvedQuestionIds || [],
          discoveredContradictionIds: parsed.discoveredContradictionIds || [],
          activeLeadIds: parsed.activeLeadIds || ['lead_initial_case_review'],
          timelineEventIds: parsed.timelineEventIds || [],
          playerNotes: parsed.playerNotes || '',
          hintsUnlocked: parsed.hintsUnlocked || {},
          lastActivityTimestamp: parsed.lastActivityTimestamp || Date.now(),
          deductionAttempts: parsed.deductionAttempts || 0,
          caseResolved: parsed.caseResolved || false,
          caseResolvedAt: parsed.caseResolvedAt
        };
      }
    } catch (e) {
      console.warn('[StoryEngine] Failed to parse stored state, using defaults:', e);
    }

    return {
      currentAct: 1,
      flags: { flag_assignment_active: true },
      discoveredStepIds: [],
      discoveredFactIds: [],
      openQuestionIds: ['q_why_audit_modification', 'q_why_case_closed_early'],
      resolvedQuestionIds: [],
      discoveredContradictionIds: [],
      activeLeadIds: ['lead_initial_case_review'],
      timelineEventIds: [],
      playerNotes: '',
      hintsUnlocked: {},
      lastActivityTimestamp: Date.now(),
      deductionAttempts: 0,
      caseResolved: false
    };
  }

  public saveState(): void {
    try {
      this.state.lastActivityTimestamp = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('[StoryEngine] Save state error:', e);
    }
  }

  public resetState(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    this.state = {
      currentAct: 1,
      flags: { flag_assignment_active: true },
      discoveredStepIds: [],
      discoveredFactIds: [],
      openQuestionIds: ['q_why_audit_modification', 'q_why_case_closed_early'],
      resolvedQuestionIds: [],
      discoveredContradictionIds: [],
      activeLeadIds: ['lead_initial_case_review'],
      timelineEventIds: [],
      playerNotes: '',
      hintsUnlocked: {},
      lastActivityTimestamp: Date.now(),
      deductionAttempts: 0,
      caseResolved: false
    };
    this.notify();
  }

  public subscribe(listener: StoryListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.saveState();
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (e) {
        console.error('[StoryEngine] Listener error:', e);
      }
    });
  }

  public getState(): StoryState {
    return { ...this.state };
  }

  public getCurrentAct(): StoryAct {
    return STORY_ACTS.find((a) => a.id === this.state.currentAct) || STORY_ACTS[0];
  }

  public getAllActs(): StoryAct[] {
    return STORY_ACTS;
  }

  public hasFlag(flag: string): boolean {
    return Boolean(this.state.flags[flag]);
  }

  public setFlag(flag: string, value = true): void {
    if (this.state.flags[flag] !== value) {
      this.state.flags[flag] = value;
      this.checkStepTriggers();
      this.checkActProgression();
      this.notify();
    }
  }

  // ================= ACTION HANDLERS =================

  public onViewRecord(recordId: string): void {
    if (!recordId) return;
    let changed = false;
    const cleanId = recordId.toLowerCase().trim();

    DISCOVERY_STEPS.forEach((step) => {
      if (
        step.trigger.type === 'view_record' &&
        step.trigger.targetId &&
        (step.trigger.targetId.toLowerCase() === cleanId || cleanId.includes(step.trigger.targetId.toLowerCase())) &&
        !this.state.discoveredStepIds.includes(step.id)
      ) {
        this.executeStep(step);
        changed = true;
      }
    });

    if (changed) {
      this.checkStepTriggers();
      this.checkActProgression();
      this.notify();
    }
  }

  public onSearchTerm(term: string): void {
    if (!term || term.trim().length < 2) return;
    const clean = term.toLowerCase().trim();
    let changed = false;

    DISCOVERY_STEPS.forEach((step) => {
      if (
        step.trigger.type === 'search_term' &&
        step.trigger.searchTerm &&
        clean.includes(step.trigger.searchTerm.toLowerCase()) &&
        !this.state.discoveredStepIds.includes(step.id)
      ) {
        this.executeStep(step);
        changed = true;
      }
    });

    if (changed) {
      this.checkStepTriggers();
      this.checkActProgression();
      this.notify();
    }
  }

  public onViewWebpage(url: string): void {
    if (!url) return;
    let changed = false;
    const cleanUrl = url.toLowerCase().trim();

    DISCOVERY_STEPS.forEach((step) => {
      if (
        step.trigger.type === 'view_webpage' &&
        step.trigger.targetId &&
        !this.state.discoveredStepIds.includes(step.id)
      ) {
        const target = step.trigger.targetId.toLowerCase();
        const targetSlug = target.split('/').filter(Boolean).pop();
        if (cleanUrl.includes(target) || (targetSlug && cleanUrl.includes(targetSlug))) {
          this.executeStep(step);
          changed = true;
        }
      }
    });

    if (changed) {
      this.checkStepTriggers();
      this.checkActProgression();
      this.notify();
    }
  }

  public onViewFile(filePath: string): void {
    if (!filePath) return;
    let changed = false;
    const cleanPath = filePath.toLowerCase().trim();

    DISCOVERY_STEPS.forEach((step) => {
      if (
        step.trigger.type === 'view_file' &&
        step.trigger.targetId &&
        (cleanPath.endsWith(step.trigger.targetId.toLowerCase()) || cleanPath.includes(step.trigger.targetId.toLowerCase())) &&
        !this.state.discoveredStepIds.includes(step.id)
      ) {
        this.executeStep(step);
        changed = true;
      }
    });

    if (changed) {
      this.checkStepTriggers();
      this.checkActProgression();
      this.notify();
    }
  }

  private checkStepTriggers(): void {
    let triggeredAny = false;
    let loopCount = 0;
    do {
      triggeredAny = false;
      loopCount++;
      DISCOVERY_STEPS.forEach((step) => {
        if (
          step.trigger.type === 'flag' &&
          step.trigger.targetId &&
          this.hasFlag(step.trigger.targetId) &&
          !this.state.discoveredStepIds.includes(step.id)
        ) {
          if (step.trigger.requiredFlags) {
            const allMet = step.trigger.requiredFlags.every((f) => this.hasFlag(f));
            if (!allMet) return;
          }
          this.executeStep(step);
          triggeredAny = true;
        }
      });
    } while (triggeredAny && loopCount < 10);
  }

  private executeStep(step: DiscoveryStep): void {
    if (this.state.discoveredStepIds.includes(step.id)) return;

    this.state.discoveredStepIds.push(step.id);
    if (step.flagGranted) {
      this.state.flags[step.flagGranted] = true;
    }

    // Add facts
    step.factsAdded.forEach((factId) => {
      if (!this.state.discoveredFactIds.includes(factId)) {
        this.state.discoveredFactIds.push(factId);
      }
    });

    // Add questions
    if (step.questionsAdded) {
      step.questionsAdded.forEach((qid) => {
        if (!this.state.openQuestionIds.includes(qid) && !this.state.resolvedQuestionIds.includes(qid)) {
          this.state.openQuestionIds.push(qid);
        }
      });
    }

    // Resolve questions
    if (step.questionsResolved) {
      step.questionsResolved.forEach((qid) => {
        this.state.openQuestionIds = this.state.openQuestionIds.filter((id) => id !== qid);
        if (!this.state.resolvedQuestionIds.includes(qid)) {
          this.state.resolvedQuestionIds.push(qid);
        }
      });
    }

    // Add timeline events
    if (step.timelineEventsAdded) {
      step.timelineEventsAdded.forEach((evtId) => {
        if (!this.state.timelineEventIds.includes(evtId)) {
          this.state.timelineEventIds.push(evtId);
        }
      });
    }

    // Add contradiction
    if (step.contradictionAdded && !this.state.discoveredContradictionIds.includes(step.contradictionAdded)) {
      this.state.discoveredContradictionIds.push(step.contradictionAdded);
      if (this.notificationHandler) {
        this.notificationHandler(
          'Timeline Contradiction Identified',
          'A conflict has been logged in your Investigation Notebook.',
          'warning'
        );
      }
    }

    // Add leads
    if (step.leadsAdded) {
      step.leadsAdded.forEach((leadId) => {
        if (!this.state.activeLeadIds.includes(leadId)) {
          this.state.activeLeadIds.push(leadId);
        }
      });
    }
  }

  public checkActProgression(): void {
    const actSteps = DISCOVERY_STEPS.filter((s) => s.act === this.state.currentAct);
    const discoveredInAct = actSteps.filter((s) => this.state.discoveredStepIds.includes(s.id));

    // If 80% of current act is discovered, advance act if not at 6
    if (discoveredInAct.length >= Math.ceil(actSteps.length * 0.8) && this.state.currentAct < 6) {
      const nextActNum = this.state.currentAct + 1;
      const finishedAct = this.getCurrentAct();
      this.state.currentAct = nextActNum;

      if (this.notificationHandler) {
        this.notificationHandler(
          `Case 27 Progress: ${finishedAct.revelationTitle}`,
          `Entering ${STORY_ACTS[nextActNum - 1].title}: ${STORY_ACTS[nextActNum - 1].subtitle}`,
          'success'
        );
      }
    }
  }

  // ================= GETTERS FOR NOTEBOOK & UI =================

  public getDiscoveredFacts(): StoryFact[] {
    return STORY_FACTS.filter((fact) => this.state.discoveredFactIds.includes(fact.id));
  }

  public getOpenQuestions(): UnresolvedQuestion[] {
    return UNRESOLVED_QUESTIONS.filter((q) => this.state.openQuestionIds.includes(q.id));
  }

  public getResolvedQuestions(): UnresolvedQuestion[] {
    return UNRESOLVED_QUESTIONS.filter((q) => this.state.resolvedQuestionIds.includes(q.id));
  }

  public getDiscoveredContradictions(): Contradiction[] {
    return CONTRADICTIONS.filter((c) => this.state.discoveredContradictionIds.includes(c.id));
  }

  public getDiscoveredTimelineEvents(): InvestigationTimelineEvent[] {
    return TIMELINE_EVENTS.filter((evt) => this.state.timelineEventIds.includes(evt.id)).sort(
      (a, b) => (a.time || '').localeCompare(b.time || '')
    );
  }

  public getActiveLeads(): InvestigationLead[] {
    return INVESTIGATION_LEADS.filter((l) => this.state.activeLeadIds.includes(l.id));
  }

  public getPlayerNotes(): string {
    return this.state.playerNotes;
  }

  public setPlayerNotes(notes: string): void {
    this.state.playerNotes = notes;
    this.notify();
  }

  // ================= SOFT GUIDANCE SYSTEM =================

  public getInvestigationStatus(): {
    currentActTitle: string;
    whatWeKnow: string[];
    unresolvedQuestions: string[];
    activeLeads: string[];
    recentDiscoveriesCount: number;
  } {
    const act = this.getCurrentAct();
    const facts = this.getDiscoveredFacts().slice(-4).map((f) => f.text);
    const questions = this.getOpenQuestions().slice(0, 3).map((q) => q.text);
    const leads = this.getActiveLeads().slice(0, 3).map((l) => l.title);

    return {
      currentActTitle: `${act.title}: ${act.subtitle}`,
      whatWeKnow: facts.length > 0 ? facts : ['Case reopened due to unindexed modification on Report R-1998-112.'],
      unresolvedQuestions: questions.length > 0 ? questions : ['What prompted the post-closure modification on Case 27?'],
      activeLeads: leads,
      recentDiscoveriesCount: this.state.discoveredStepIds.length
    };
  }

  // ================= HINT SYSTEM =================

  public getNextAvailableHint(): {
    stepId: string;
    stepTitle: string;
    currentLevel: number;
    hintText: string;
  } | null {
    // Find earliest uncompleted step in current act
    const nextStep = DISCOVERY_STEPS.find(
      (s) => s.act <= this.state.currentAct && !this.state.discoveredStepIds.includes(s.id)
    );

    if (!nextStep) return null;

    const currentLevel = this.state.hintsUnlocked[nextStep.id] || 0;
    const nextLevel = Math.min(currentLevel + 1, 3);

    let hintText = nextStep.hintLevel1;
    if (nextLevel === 2) hintText = nextStep.hintLevel2;
    if (nextLevel === 3) hintText = nextStep.hintLevel3;

    return {
      stepId: nextStep.id,
      stepTitle: nextStep.title,
      currentLevel: nextLevel,
      hintText
    };
  }

  public unlockHint(stepId: string): string {
    const step = DISCOVERY_STEPS.find((s) => s.id === stepId);
    if (!step) return 'No hints available for this record.';

    const currentLevel = this.state.hintsUnlocked[stepId] || 0;
    const nextLevel = Math.min(currentLevel + 1, 3);
    this.state.hintsUnlocked[stepId] = nextLevel;
    this.notify();

    if (nextLevel === 1) return step.hintLevel1;
    if (nextLevel === 2) return step.hintLevel2;
    return step.hintLevel3;
  }

  // ================= FINAL DEDUCTION =================

  public submitDeduction(sub: DeductionSubmission): DeductionResult {
    this.state.deductionAttempts += 1;

    const sol = FINAL_DEDUCTION_SOLUTION;
    const whoCorrect = sub.whoSuspectId.toUpperCase() === sol.whoSuspectId;
    const whatCorrect = sub.whatCrimeType.toUpperCase().includes('HOMICIDE') || sub.whatCrimeType.toUpperCase().includes('ABDUCTION');
    const whenCorrect = sub.whenDate.includes('1998-09-14');
    const whereCorrect = sub.whereLocationId === sol.whereLocationId || sub.whereLocationId === 'LOC-0400' || sub.whereLocationId === 'LOC-0042' || sub.whereLocationId === 'LOC-WILLOW42';
    const whyCorrect = sub.whyMotive.toUpperCase().includes('AUDIT') || sub.whyMotive.toUpperCase().includes('THEFT') || sub.whyMotive.toUpperCase().includes('CROWNLINE') || sub.whyMotive.toUpperCase().includes('SILENCE');
    const howCorrect = sub.howMethod.toUpperCase().includes('PULLOVER') || sub.howMethod.toUpperCase().includes('PATROL') || sub.howMethod.toUpperCase().includes('CAR') || sub.howMethod.toUpperCase().includes('INTERCEPTION');

    // Calculate evidence overlap
    const matchedEvidence = sub.keyEvidenceIds.filter((e) => sol.keyEvidenceIds.includes(e));
    const evidenceScore = Math.round((matchedEvidence.length / sol.keyEvidenceIds.length) * 100);

    const scores = [whoCorrect, whatCorrect, whenCorrect, whereCorrect, whyCorrect, howCorrect];
    const trueCount = scores.filter(Boolean).length;
    const accuracyPercentage = Math.round((trueCount / scores.length) * 80 + (evidenceScore * 0.2));

    const isFullyCorrect = whoCorrect && whatCorrect && whenCorrect && whyCorrect && evidenceScore >= 60;

    if (isFullyCorrect) {
      this.state.caseResolved = true;
      this.state.caseResolvedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      this.state.flags['case_27_solved_correctly'] = true;
      this.executeStep(DISCOVERY_STEPS.find((s) => s.id === 'step_60')!);
    }

    this.notify();

    return {
      isFullyCorrect,
      accuracyPercentage,
      whoCorrect,
      whatCorrect,
      whenCorrect,
      whereCorrect,
      whyCorrect,
      howCorrect,
      evidenceScore,
      feedback: {
        who: whoCorrect
          ? 'ACCURATE: Detective Daniel Hayes is corroborated by vehicle dispatch, report omissions, and financial kickbacks.'
          : 'INCONCLUSIVE: Person of interest lacks verified administrative motive or physical opportunity on the night in question.',
        what: whatCorrect
          ? 'CORRECT: Offense classified as Kidnapping & Deprivation of Civil Rights leading to Homicide and Evidence Tampering.'
          : 'IMPRECISE: Crime category does not align with the deliberate disappearance and suppressed physical evidence.',
        when: whenCorrect
          ? 'VERIFIED: September 14, 1998, specifically during the 22:38–22:50 dispatch interval.'
          : 'CONTRADICTED: Timestamp conflicts with verified CAD logs or railway work alibis.',
        where: whereCorrect
          ? 'CORROBORATED: Primary interception occurred at 42 Willow Street, with secondary evidence staging at Canal Road.'
          : 'UNVERIFIED: Selected location does not fit the physical transfer points established in witness reports.',
        why: whyCorrect
          ? 'SUBSTANTIATED: Prevention of imminent federal disclosure regarding the Bell Electronics-Crownline freight diversion ring.'
          : 'UNSUPPORTED: Stated motive fails to explain the suppression of Internal Affairs Docket CASE-1989-114.',
        how: howCorrect
          ? 'CONSISTENT: Unauthorized traffic stop using marked patrol cruiser followed by vehicle relocation and report falsification.'
          : 'PLAUSIBLE BUT INCOMPLETE: Method does not account for the radio dispatch transmission at 22:38.',
        evidence: `Chain-of-Custody Match: ${matchedEvidence.length} of ${sol.keyEvidenceIds.length} foundational evidence dockets substantiated.`
      },
      officialDetermination: isFullyCorrect
        ? 'DOCKET CASE-1998-027 OFFICIALLY CONCLUDED. All findings referred to the State Attorney General Special Prosecutions Unit for arrest warrants.'
        : 'INSUFFICIENT PROBABLE CAUSE. Review conflicting timestamps, physical evidence items, and internal affairs dockets before re-submitting.'
    };
  }

  // ================= EVIDENCE LAB API =================

  public createEvidence(evidenceData: Partial<EvidenceRecord>): EvidenceRecord {
    const id = evidenceData.id || `E-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newRecord: EvidenceRecord = {
      id,
      type: 'evidence',
      title: evidenceData.title || `Evidence Item ${id}`,
      evidenceId: evidenceData.evidenceId || id,
      caseId: evidenceData.caseId || 'CASE-1998-027',
      evidenceType: evidenceData.evidenceType || 'Physical',
      description: evidenceData.description || 'Newly indexed evidence item.',
      collectedByOfficerId: evidenceData.collectedByOfficerId || 'OFF-4081',
      collectionDate: evidenceData.collectionDate || now.split(' ')[0],
      collectionTime: evidenceData.collectionTime || now.split(' ')[1],
      collectionLocation: evidenceData.collectionLocation || 'Evidence Receiving Intake',
      storageLocation: evidenceData.storageLocation || 'Vault B',
      status: evidenceData.status || 'IN_STORAGE',
      currentStatus: evidenceData.currentStatus || 'IN_STORAGE',
      laboratoryStatus: evidenceData.laboratoryStatus || 'NOT_REQUESTED',
      chainOfCustody: evidenceData.chainOfCustody || [
        {
          id: `cust_${Date.now()}`,
          timestamp: now,
          action: 'Initial Intake Logging',
          fromOfficerOrLocation: 'Field Intake',
          toOfficerOrLocation: 'Evidence Vault',
          reason: 'Initial storage'
        }
      ],
      relatedPersonIds: evidenceData.relatedPersonIds || [],
      tags: evidenceData.tags || ['EVIDENCE_INTAKE'],
      createdAt: now,
      updatedAt: now,
      ...evidenceData
    };

    policeDatabase.addEvidence(newRecord);
    this.onViewRecord(newRecord.id);
    return newRecord;
  }

  public updateEvidence(id: string, partial: Partial<EvidenceRecord>): EvidenceRecord | null {
    const updated = policeDatabase.updateRecord(id, partial, 'Det. S. Miller (#4081)', 'Updated evidence metadata');
    if (updated) {
      this.checkStepTriggers();
      this.checkActProgression();
      this.notify();
    }
    return updated as EvidenceRecord | null;
  }

  public revealEvidence(id: string): void {
    const rec = policeDatabase.getRecord(id) as EvidenceRecord | null;
    if (rec) {
      policeDatabase.updateRecord(id, { status: 'IN_STORAGE', currentStatus: 'IN_STORAGE' } as any);
      this.onViewRecord(id);
    }
  }

  public hideEvidence(id: string): void {
    policeDatabase.updateRecord(id, { status: 'ARCHIVED', currentStatus: 'ARCHIVED' } as any);
  }

  public archiveEvidence(id: string): void {
    policeDatabase.updateRecord(id, { status: 'ARCHIVED', isArchived: true, currentStatus: 'ARCHIVED' } as any);
  }

  public addEvidenceAnalysis(evidenceId: string, analysis: ForensicReport): void {
    policeDatabase.addForensicReport(evidenceId, analysis);
    this.setFlag(`analyzed_${evidenceId.toLowerCase()}`, true);
    this.setFlag(`forensic_${analysis.id.toLowerCase()}`, true);
    this.checkStepTriggers();
    this.checkActProgression();
    this.notify();
  }

  public addCustodyEvent(evidenceId: string, event: CustodyTransfer): void {
    policeDatabase.addCustodyTransfer(evidenceId, event);
    this.setFlag(`custody_updated_${evidenceId.toLowerCase()}`, true);
    this.checkStepTriggers();
    this.checkActProgression();
    this.notify();
  }

  public modifyCustodyEvent(evidenceId: string, eventId: string, partial: Partial<CustodyTransfer>): void {
    const rec = policeDatabase.getRecord(evidenceId) as EvidenceRecord | null;
    if (rec && rec.chainOfCustody) {
      const target = rec.chainOfCustody.find((c) => c.id === eventId);
      if (target) {
        Object.assign(target, partial);
        policeDatabase.updateRecord(evidenceId, { chainOfCustody: [...rec.chainOfCustody] }, 'Auditor', 'Modified custody log');
      }
    }
  }

  public linkEvidence(evidenceId: string, targetType: 'case' | 'person' | 'vehicle' | 'report' | 'location', targetId: string): void {
    const rec = policeDatabase.getRecord(evidenceId) as EvidenceRecord | null;
    if (!rec) return;

    if (targetType === 'person' && !rec.relatedPersonIds.includes(targetId)) {
      rec.relatedPersonIds = [...rec.relatedPersonIds, targetId];
    } else if (targetType === 'vehicle') {
      rec.relatedVehicleId = targetId;
      rec.relatedVehicleIds = Array.from(new Set([...(rec.relatedVehicleIds || []), targetId]));
    } else if (targetType === 'case') {
      rec.relatedCaseIds = Array.from(new Set([...(rec.relatedCaseIds || []), targetId]));
    } else if (targetType === 'report') {
      rec.relatedReportIds = Array.from(new Set([...(rec.relatedReportIds || []), targetId]));
    } else if (targetType === 'location') {
      rec.relatedLocationIds = Array.from(new Set([...(rec.relatedLocationIds || []), targetId]));
    }

    policeDatabase.updateRecord(evidenceId, rec, 'Investigator', `Linked ${targetType} ${targetId}`);
  }

  public unlinkEvidence(evidenceId: string, targetType: 'case' | 'person' | 'vehicle' | 'report' | 'location', targetId: string): void {
    const rec = policeDatabase.getRecord(evidenceId) as EvidenceRecord | null;
    if (!rec) return;

    if (targetType === 'person') {
      rec.relatedPersonIds = rec.relatedPersonIds.filter((id) => id !== targetId);
    } else if (targetType === 'vehicle') {
      rec.relatedVehicleIds = (rec.relatedVehicleIds || []).filter((id) => id !== targetId);
      if (rec.relatedVehicleId === targetId) rec.relatedVehicleId = undefined;
    } else if (targetType === 'case') {
      rec.relatedCaseIds = (rec.relatedCaseIds || []).filter((id) => id !== targetId);
    } else if (targetType === 'report') {
      rec.relatedReportIds = (rec.relatedReportIds || []).filter((id) => id !== targetId);
    } else if (targetType === 'location') {
      rec.relatedLocationIds = (rec.relatedLocationIds || []).filter((id) => id !== targetId);
    }

    policeDatabase.updateRecord(evidenceId, rec, 'Investigator', `Unlinked ${targetType} ${targetId}`);
  }

  // ================= INVESTIGATION BOARD API =================

  public createBoard(title?: string): InvestigationBoardState {
    const newBoard: InvestigationBoardState = {
      id: `board_${Date.now()}`,
      title: title || 'Case 27 Investigation Board',
      nodes: [],
      edges: [],
      timelineEvents: [],
      viewMode: 'board',
      zoom: 1,
      pan: { x: 0, y: 0 },
      lastSaved: new Date().toISOString()
    };
    policeDatabase.updateBoardState(newBoard);
    return newBoard;
  }

  public saveBoard(boardState: InvestigationBoardState): void {
    policeDatabase.updateBoardState(boardState);
    this.notify();
  }

  public createBoardNode(node: Partial<BoardNode>): BoardNode {
    const id = node.id || `bn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const completeNode: BoardNode = {
      id,
      label: node.label || 'UNTITLED NODE',
      x: node.x ?? (200 + Math.random() * 300),
      y: node.y ?? (150 + Math.random() * 200),
      color: node.color || '#3b82f6',
      ...node
    };
    policeDatabase.addBoardNode(completeNode);
    return completeNode;
  }

  public removeBoardNode(nodeId: string): void {
    policeDatabase.removeBoardNode(nodeId);
  }

  public moveBoardNode(nodeId: string, x: number, y: number): void {
    policeDatabase.updateBoardNode(nodeId, { x, y });
  }

  public updateBoardNode(nodeId: string, partial: Partial<BoardNode>): void {
    policeDatabase.updateBoardNode(nodeId, partial);
    this.notify();
  }

  public createBoardConnection(
    from: string,
    to: string,
    label: string,
    relationType: string = 'associated with',
    isContradiction: boolean = false,
    isSupport: boolean = false
  ): BoardEdge {
    const edge: BoardEdge = {
      id: `edge_${from}_${to}_${Date.now()}`,
      from,
      to,
      label,
      relationType,
      isContradiction,
      isSupport
    };
    policeDatabase.addBoardEdge(edge);

    // If this connection links key case nodes, check if a contradiction or clue is discovered!
    const board = policeDatabase.getBoardState();
    const sourceNode = board.nodes.find((n) => n.id === from);
    const targetNode = board.nodes.find((n) => n.id === to);
    if (sourceNode?.recordId && targetNode?.recordId) {
      this.setFlag(`connected_${sourceNode.recordId}_${targetNode.recordId}`, true);
      this.setFlag(`connected_${targetNode.recordId}_${sourceNode.recordId}`, true);
      this.checkStepTriggers();
      this.checkActProgression();
      this.notify();
    }

    return edge;
  }

  public removeBoardConnection(edgeId: string): void {
    policeDatabase.removeBoardEdge(edgeId);
  }

  public createInvestigationNote(title: string, content: string, x?: number, y?: number): BoardNode {
    return this.createBoardNode({
      label: title.toUpperCase(),
      noteText: content,
      nodeType: 'note',
      color: '#eab308',
      x: x ?? (150 + Math.random() * 200),
      y: y ?? (150 + Math.random() * 200)
    });
  }

  public createInvestigationQuestion(question: string, status: 'OPEN' | 'RESOLVED' = 'OPEN', x?: number, y?: number): BoardNode {
    return this.createBoardNode({
      label: 'INVESTIGATIVE QUESTION',
      noteText: question,
      nodeType: 'question',
      questionStatus: status,
      color: status === 'RESOLVED' ? '#10b981' : '#f97316',
      x: x ?? (150 + Math.random() * 200),
      y: y ?? (150 + Math.random() * 200)
    });
  }

  public createHypothesis(
    title: string,
    summary: string,
    status: 'OPEN' | 'SUPPORTED' | 'WEAKENED' | 'DISPROVEN' | 'UNRESOLVED' = 'OPEN',
    confidence: number = 50
  ): BoardNode {
    return this.createBoardNode({
      label: `HYPOTHESIS: ${title.toUpperCase()}`,
      noteText: summary,
      nodeType: 'hypothesis',
      hypothesisStatus: status,
      confidenceScore: confidence,
      color: status === 'SUPPORTED' ? '#22c55e' : status === 'DISPROVEN' ? '#ef4444' : '#a855f7',
      x: 350 + Math.random() * 100,
      y: 200 + Math.random() * 100
    });
  }

  public updateHypothesis(nodeId: string, partial: Partial<BoardNode>): void {
    policeDatabase.updateBoardNode(nodeId, partial);
    this.notify();
  }

  public addTimelineEvent(event: Partial<BoardTimelineEvent>): BoardTimelineEvent {
    const newEvent: BoardTimelineEvent = {
      id: event.id || `tle_${Date.now()}`,
      date: event.date || '1998-09-14',
      time: event.time || '22:00:00',
      title: event.title || 'Timeline Milestone',
      description: event.description || '',
      reliability: event.reliability || 'VERIFIED',
      ...event
    };
    policeDatabase.addTimelineEvent(newEvent);
    this.notify();
    return newEvent;
  }

  public updateTimelineEvent(eventId: string, partial: Partial<BoardTimelineEvent>): void {
    policeDatabase.updateTimelineEvent(eventId, partial);
    this.notify();
  }
}

export const storyEngine = new StoryEngine();

if (typeof window !== 'undefined') {
  (window as any).storyEngine = storyEngine;
}
