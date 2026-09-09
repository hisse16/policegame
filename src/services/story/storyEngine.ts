import {
  StoryState, StoryAct, DiscoveryStep, StoryFact, UnresolvedQuestion, Contradiction,
  InvestigationTimelineEvent, InvestigationLead, DeductionSubmission, DeductionResult,
  InvestigationAction, DeductionReadiness
} from '../../types/story';
import { STORY_ACTS, DISCOVERY_STEPS, STORY_FACTS, UNRESOLVED_QUESTIONS, CONTRADICTIONS, TIMELINE_EVENTS, INVESTIGATION_LEADS, FINAL_DEDUCTION_SOLUTION } from './storyData';
import { EvidenceRecord, ForensicReport, CustodyTransfer, BoardNode, BoardEdge, BoardTimelineEvent, InvestigationBoardState } from '../../types/police';
import { policeDatabase } from '../police/databaseEngine';

const STORAGE_KEY = 'investigator_os_story_state_v1';
export type StoryListener = (state: StoryState) => void;

class StoryEngine {
  private state: StoryState;
  private listeners: Set<StoryListener> = new Set();
  private notificationHandler?: (title: string, message: string, type?: 'info' | 'warning' | 'error' | 'success') => void;
  constructor() { this.state = this.loadInitialState(); }
  public setNotificationHandler(handler: (title: string, message: string, type?: 'info' | 'warning' | 'error' | 'success') => void) { this.notificationHandler = handler; }
  private createDefaultState(): StoryState { return { currentAct: 1, flags: { flag_assignment_active: true }, discoveredStepIds: [], discoveredFactIds: [], openQuestionIds: ['q_why_audit_modification', 'q_why_case_closed_early'], resolvedQuestionIds: [], discoveredContradictionIds: [], activeLeadIds: ['lead_initial_case_review'], timelineEventIds: [], playerNotes: '', hintsUnlocked: {}, lastActivityTimestamp: Date.now(), deductionAttempts: 0, caseResolved: false }; }
  private loadInitialState(): StoryState { try { const stored = localStorage.getItem(STORAGE_KEY); if (stored) { const parsed = JSON.parse(stored); return { ...this.createDefaultState(), ...parsed, flags: parsed.flags || { flag_assignment_active: true }, discoveredStepIds: Array.isArray(parsed.discoveredStepIds) ? parsed.discoveredStepIds : [], discoveredFactIds: Array.isArray(parsed.discoveredFactIds) ? parsed.discoveredFactIds : [], openQuestionIds: Array.isArray(parsed.openQuestionIds) ? parsed.openQuestionIds : [], resolvedQuestionIds: Array.isArray(parsed.resolvedQuestionIds) ? parsed.resolvedQuestionIds : [], discoveredContradictionIds: Array.isArray(parsed.discoveredContradictionIds) ? parsed.discoveredContradictionIds : [], activeLeadIds: Array.isArray(parsed.activeLeadIds) ? parsed.activeLeadIds : [], timelineEventIds: Array.isArray(parsed.timelineEventIds) ? parsed.timelineEventIds : [], hintsUnlocked: parsed.hintsUnlocked || {} }; } } catch (e) { console.warn('[StoryEngine] Failed to parse stored state, using defaults:', e); } return this.createDefaultState(); }
  public saveState(): void { try { this.state.lastActivityTimestamp = Date.now(); localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); } catch (e) { console.error('[StoryEngine] Save state error:', e); } }
  public resetState(): void { try { localStorage.removeItem(STORAGE_KEY); } catch {} this.state = this.createDefaultState(); this.notify(); }
  public subscribe(listener: StoryListener): () => void { this.listeners.add(listener); listener(this.getState()); return () => this.listeners.delete(listener); }
  private notify(): void { this.saveState(); const currentState = this.getState(); this.listeners.forEach((listener) => { try { listener(currentState); } catch (e) { console.error('[StoryEngine] Listener error:', e); } }); }
  public getState(): StoryState { return { ...this.state }; }
  public getCurrentAct(): StoryAct { return STORY_ACTS.find((a) => a.id === this.state.currentAct) || STORY_ACTS[0]; }
  public getAllActs(): StoryAct[] { return STORY_ACTS; }
  public hasFlag(flag: string): boolean { return Boolean(this.state.flags[flag]); }

  public setFlag(flag: string, value = true): void {
    if (this.state.flags[flag] !== value) {
      this.state.flags[flag] = value;
      this.checkStepTriggers();
      this.checkAct6SynthesisTriggers();
      this.checkActProgression();
      this.notify();
    }
  }

  private isSearchMatch(clean: string, searchTerm: string): boolean { const needle = searchTerm.toLowerCase().trim(); if (!needle) return false; if (needle.includes(' ')) return clean.includes(needle); const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); return new RegExp(`\\b${escaped}\\b`, 'i').test(clean); }

  private executeMatchingSteps(predicate: (step: DiscoveryStep) => boolean): boolean {
    let changed = false;
    DISCOVERY_STEPS.forEach((step) => { if (predicate(step) && !this.state.discoveredStepIds.includes(step.id)) { this.executeStep(step); changed = true; } });
    if (changed) {
      this.checkStepTriggers();
      this.checkAct6SynthesisTriggers();
      this.checkActProgression();
      this.notify();
    }
    return changed;
  }

  public onViewRecord(recordId: string): void {
    if (!recordId) return;
    const cleanId = recordId.toLowerCase().trim();
    this.executeMatchingSteps((step) => {
      const stepAct = step.id === 'step_39' ? 4 : step.act;
      return stepAct <= this.state.currentAct && step.trigger.type === 'view_record' && Boolean(step.trigger.targetId) && step.trigger.targetId!.toLowerCase().trim() === cleanId;
    });
  }

  public onSearchTerm(term: string): void {
    if (!term || term.trim().length < 2) return;
    const clean = term.toLowerCase().trim();
    this.executeMatchingSteps((step) => step.act <= this.state.currentAct && step.trigger.type === 'search_term' && Boolean(step.trigger.searchTerm) && this.isSearchMatch(clean, step.trigger.searchTerm!));
  }

  public onViewWebpage(url: string): void {
    if (!url) return;
    const cleanUrl = url.toLowerCase().trim();
    this.executeMatchingSteps((step) => {
      if (step.act > this.state.currentAct || step.trigger.type !== 'view_webpage' || !step.trigger.targetId) return false;
      const target = step.trigger.targetId.toLowerCase();
      const targetSlug = target.split('/').filter(Boolean).pop();
      return cleanUrl.includes(target) || Boolean(targetSlug && cleanUrl.includes(targetSlug));
    });
  }

  public onViewFile(filePath: string): void {
    if (!filePath) return;
    const cleanPath = filePath.toLowerCase().trim();
    this.executeMatchingSteps((step) => step.act <= this.state.currentAct && step.trigger.type === 'view_file' && Boolean(step.trigger.targetId) && (cleanPath.endsWith(step.trigger.targetId!.toLowerCase()) || cleanPath.includes(step.trigger.targetId!.toLowerCase())));
  }

  private areStepPrerequisitesMet(step: DiscoveryStep): boolean { return !step.trigger.requiredFlags || step.trigger.requiredFlags.every((flag) => this.hasFlag(flag)); }

  private checkStepTriggers(): void {
    let triggeredAny = false;
    let loopCount = 0;
    do {
      triggeredAny = false;
      loopCount++;
      DISCOVERY_STEPS.forEach((step) => {
        const stepAct = step.id === 'step_39' ? 4 : step.act;
        if (stepAct <= this.state.currentAct && step.trigger.type === 'flag' && step.trigger.targetId && this.hasFlag(step.trigger.targetId) && this.areStepPrerequisitesMet(step) && !this.state.discoveredStepIds.includes(step.id)) {
          this.executeStep(step);
          triggeredAny = true;
        }
      });
    } while (triggeredAny && loopCount < 20);
  }

  private checkAct6SynthesisTriggers(): void {
    if (this.state.currentAct !== 6) return;

    // Step 55 is now a synthesis milestone. The player reaches it by assembling
    // corroborated timeline anchors, not by guessing an artificial search phrase.
    const hasAllTimelineAnchors = [
      'evt_anna_shift_end',
      'evt_radio_traffic_willow',
      'evt_gable_audio_witness',
      'evt_vehicle_found_canal'
    ].every((id) => this.state.timelineEventIds.includes(id)) && this.hasFlag('flag_interviewed_leo_vance');
    const step55 = DISCOVERY_STEPS.find((step) => step.id === 'step_55');
    if (hasAllTimelineAnchors && step55 && !this.state.discoveredStepIds.includes('step_55')) this.executeStep(step55);

    // Step 56 requires the timeline plus independent physical/documentary proof.
    const perpetratorEvidence = [
      'flag_reconstructed_fatal_night',
      'flag_read_recovered_ledger',
      'flag_found_time_divergence',
      'flag_inspected_audit_metadata'
    ].every((flag) => this.hasFlag(flag));
    const step56 = DISCOVERY_STEPS.find((step) => step.id === 'step_56');
    if (perpetratorEvidence && step56 && !this.state.discoveredStepIds.includes('step_56')) this.executeStep(step56);

    // Step 57 is unlocked by connecting the older IA case to the 2004 cover-up.
    const accompliceChain = [
      'flag_identified_hayes_perpetrator',
      'flag_identified_ia_officers',
      'flag_viewed_captain_vance',
      'flag_connected_tampering_motive'
    ].every((flag) => this.hasFlag(flag));
    const step57 = DISCOVERY_STEPS.find((step) => step.id === 'step_57');
    if (accompliceChain && step57 && !this.state.discoveredStepIds.includes('step_57')) this.executeStep(step57);
  }

  private executeStep(step: DiscoveryStep): void {
    if (this.state.discoveredStepIds.includes(step.id)) return;
    this.state.discoveredStepIds.push(step.id);
    if (step.flagGranted) this.state.flags[step.flagGranted] = true;
    step.factsAdded.forEach((factId) => { if (!this.state.discoveredFactIds.includes(factId)) this.state.discoveredFactIds.push(factId); });
    step.questionsAdded?.forEach((qid) => { if (!this.state.openQuestionIds.includes(qid) && !this.state.resolvedQuestionIds.includes(qid)) this.state.openQuestionIds.push(qid); });
    step.questionsResolved?.forEach((qid) => { this.state.openQuestionIds = this.state.openQuestionIds.filter((id) => id !== qid); if (!this.state.resolvedQuestionIds.includes(qid)) this.state.resolvedQuestionIds.push(qid); });
    step.timelineEventsAdded?.forEach((evtId) => { if (!this.state.timelineEventIds.includes(evtId)) this.state.timelineEventIds.push(evtId); });
    if (step.contradictionAdded && !this.state.discoveredContradictionIds.includes(step.contradictionAdded)) { this.state.discoveredContradictionIds.push(step.contradictionAdded); this.notificationHandler?.('Timeline Conflict', 'Two records disagree. Compare the sources before deciding what happened.', 'warning'); }
    step.leadsAdded?.forEach((leadId) => { if (!this.state.activeLeadIds.includes(leadId)) this.state.activeLeadIds.push(leadId); });
  }

  public checkActProgression(): void {
    if (this.state.currentAct >= 6) return;
    const act = this.state.currentAct;
    const actSteps = DISCOVERY_STEPS.filter((s) => (s.id === 'step_39' ? 4 : s.act) === act);
    const completionStep = actSteps.find((s) => s.flagGranted === `flag_act_${act}_completed`);
    if (completionStep) {
      const complete = this.state.discoveredStepIds.includes(completionStep.id) && this.areStepPrerequisitesMet(completionStep);
      if (!complete) return;
    } else {
      const discovered = actSteps.filter((s) => this.state.discoveredStepIds.includes(s.id)).length;
      if (discovered < Math.ceil(actSteps.length * 0.8)) return;
    }
    const nextAct = act + 1;
    const finishedAct = this.getCurrentAct();
    this.state.currentAct = nextAct;
    const unlockMessage: Record<number, string> = {
      2: 'Evidence & Forensics is now available in the workstation dock.',
      3: 'The Investigation Board is now available in the workstation dock.',
      4: 'Browser access is now available for public archive research.',
      5: 'Police Mail and the Investigation Map are now available.',
      6: 'The Case Determination module is now available.'
    };
    this.notificationHandler?.(`Case 27 // ${finishedAct.revelationTitle}`, `A new line of inquiry is open: ${STORY_ACTS[nextAct - 1].subtitle}. ${unlockMessage[nextAct] || ''}`, 'success');
    this.checkAct6SynthesisTriggers();
  }

  public getDiscoveredFacts(): StoryFact[] { return STORY_FACTS.filter((fact) => this.state.discoveredFactIds.includes(fact.id)); }
  public getOpenQuestions(): UnresolvedQuestion[] { return UNRESOLVED_QUESTIONS.filter((q) => this.state.openQuestionIds.includes(q.id)); }
  public getResolvedQuestions(): UnresolvedQuestion[] { return UNRESOLVED_QUESTIONS.filter((q) => this.state.resolvedQuestionIds.includes(q.id)); }
  public getDiscoveredContradictions(): Contradiction[] { return CONTRADICTIONS.filter((c) => this.state.discoveredContradictionIds.includes(c.id)); }
  public getDiscoveredTimelineEvents(): InvestigationTimelineEvent[] { return TIMELINE_EVENTS.filter((evt) => this.state.timelineEventIds.includes(evt.id)).sort((a, b) => `${a.date} ${a.time || ''}`.localeCompare(`${b.date} ${b.time || ''}`)); }
  public getActiveLeads(): InvestigationLead[] { return INVESTIGATION_LEADS.filter((l) => this.state.activeLeadIds.includes(l.id)); }
  public getPlayerNotes(): string { return this.state.playerNotes; }
  public setPlayerNotes(notes: string): void { this.state.playerNotes = notes; this.notify(); }

  private isInvestigationStepReady(step: DiscoveryStep): boolean { if (step.trigger.type === 'flag') return this.areStepPrerequisitesMet(step) && Boolean(step.trigger.targetId && this.hasFlag(step.trigger.targetId)); return true; }
  private getActionableStep(): DiscoveryStep | null {
    const currentSteps = DISCOVERY_STEPS.filter((s) => (s.id === 'step_39' ? 4 : s.act) === this.state.currentAct && !this.state.discoveredStepIds.includes(s.id)).sort((a, b) => a.order - b.order);
    return currentSteps.find((step) => this.isInvestigationStepReady(step)) || currentSteps.find((step) => step.trigger.type !== 'flag') || null;
  }
  public getNextInvestigationAction(): InvestigationAction | null {
    const step = this.getActionableStep();
    if (!step) return null;
    const unlocked = this.state.hintsUnlocked[step.id] || 0;
    const hintLevel = Math.min(unlocked + 1, 3);
    let title = step.title;
    let description = step.description;
    let hintText = hintLevel === 1 ? step.hintLevel1 : hintLevel === 2 ? step.hintLevel2 : step.hintLevel3;
    // Keep the first appearance of Hayes investigative rather than accusatory.
    if (step.id === 'step_05') {
      title = 'Review the Lead Investigator';
      description = 'The original reports share an author. Verify the investigator’s role and prior assignments before drawing conclusions.';
      hintText = hintLevel === 1 ? 'Open the officer profile named in the report headers.' : hintLevel === 2 ? 'Compare the lead investigator’s service record with the earlier case history.' : 'You are looking for context, not a suspect: establish who handled Case 27 and what they handled before it.';
    }
    return { stepId: step.id, title, description, actionType: step.trigger.type, targetId: step.trigger.type === 'view_record' ? undefined : step.trigger.targetId, searchTerm: step.trigger.searchTerm, hintLevel, hintText, isOptional: step.order % 10 !== 0 };
  }
  public getInvestigationStatus(): { currentActTitle: string; whatWeKnow: string[]; unresolvedQuestions: string[]; activeLeads: string[]; recentDiscoveriesCount: number; nextAction: InvestigationAction | null; } {
    const act = this.getCurrentAct();
    const facts = this.getDiscoveredFacts().slice(-4).map((f) => f.text);
    const questions = this.getOpenQuestions().slice(0, 3).map((q) => q.text);
    const leads = this.getActiveLeads().slice(0, 3).map((l) => l.title);
    return { currentActTitle: `${act.title}: ${act.subtitle}`, whatWeKnow: facts.length ? facts : ['The case was reopened after an unexplained post-closure modification.'], unresolvedQuestions: questions.length ? questions : ['What prompted the post-closure modification on Case 27?'], activeLeads: leads, recentDiscoveriesCount: this.state.discoveredStepIds.length, nextAction: this.getNextInvestigationAction() };
  }
  public getNextAvailableHint() { const action = this.getNextInvestigationAction(); if (!action) return null; return { stepId: action.stepId, stepTitle: action.title, currentLevel: action.hintLevel, hintText: action.hintText }; }
  public unlockHint(stepId: string): string { const step = DISCOVERY_STEPS.find((s) => s.id === stepId); if (!step) return 'No investigative lead is available for this thread.'; const nextLevel = Math.min((this.state.hintsUnlocked[stepId] || 0) + 1, 3); this.state.hintsUnlocked[stepId] = nextLevel; this.notify(); return nextLevel === 1 ? step.hintLevel1 : nextLevel === 2 ? step.hintLevel2 : step.hintLevel3; }

  public getDeductionReadiness(): DeductionReadiness {
    const reasons: string[] = [];
    if (this.state.currentAct < 6) reasons.push('The investigation has not reached the final reconstruction phase.');
    if (this.state.discoveredContradictionIds.length < 3) reasons.push('At least three independent contradictions must be established.');
    if (this.state.timelineEventIds.length < 4) reasons.push('The timeline needs more corroborated events.');
    const requiredEvidenceIds = FINAL_DEDUCTION_SOLUTION.keyEvidenceIds;
    const availableEvidenceIds = requiredEvidenceIds.filter((id) => Boolean(policeDatabase.getRecord(id)));
    const missingCount = requiredEvidenceIds.length - availableEvidenceIds.length;
    if (missingCount > 0) reasons.push(`Key evidence is still missing (${missingCount} item${missingCount === 1 ? '' : 's'}).`);
    return { ready: reasons.length === 0, currentAct: this.state.currentAct, reasons, discoveredEvidenceIds: availableEvidenceIds, requiredEvidenceIds };
  }

  private normalize(value: string): string { return value.trim().toUpperCase(); }
  private exactDate(value: string): boolean { return this.normalize(value) === '1998-09-14 22:38'; }

  public submitDeduction(sub: DeductionSubmission): DeductionResult {
    this.state.deductionAttempts += 1;
    const sol = FINAL_DEDUCTION_SOLUTION;
    const whoCorrect = this.normalize(sub.whoSuspectId) === this.normalize(sol.whoSuspectId);
    const whatCorrect = this.normalize(sub.whatCrimeType) === this.normalize('HOMICIDE_ABDUCTION');
    const whenCorrect = this.exactDate(sub.whenDate);
    const whereCorrect = this.normalize(sub.whereLocationId) === this.normalize(sol.whereLocationId);
    const whyCorrect = this.normalize(sub.whyMotive) === this.normalize('SILENCE_AUDIT_EXPOSURE');
    const howCorrect = this.normalize(sub.howMethod) === this.normalize('POLICE_PULLOVER_INTERCEPTION');
    const selectedUnique = Array.from(new Set(sub.keyEvidenceIds));
    const matchedEvidence = selectedUnique.filter((id) => sol.keyEvidenceIds.includes(id));
    const evidenceScore = Math.round((matchedEvidence.length / Math.max(1, sol.keyEvidenceIds.length)) * 100);
    const allRequiredEvidence = sol.keyEvidenceIds.every((id) => selectedUnique.includes(id));
    const scores = [whoCorrect, whatCorrect, whenCorrect, whereCorrect, whyCorrect, howCorrect];
    const trueCount = scores.filter(Boolean).length;
    const accuracyPercentage = Math.round((trueCount / scores.length) * 70 + evidenceScore * 0.3);
    const readiness = this.getDeductionReadiness();
    const isFullyCorrect = readiness.ready && allRequiredEvidence && scores.every(Boolean);
    if (isFullyCorrect) {
      this.state.caseResolved = true;
      this.state.caseResolvedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      this.state.flags.case_27_solved_correctly = true;
      const finalStep = DISCOVERY_STEPS.find((s) => s.id === 'step_60');
      if (finalStep) this.executeStep(finalStep);
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
        who: whoCorrect ? 'Corroborated: Detective Daniel Hayes is supported by the reconstructed chain of records.' : 'Not established: the selected person is not supported by the complete evidence chain.',
        what: whatCorrect ? 'Corroborated: the final record classification is kidnapping, homicide and evidence tampering.' : 'Not established: the selected classification does not match the reconstructed offense.',
        when: whenCorrect ? 'Corroborated: September 14, 1998 at 22:38 is the verified interception time.' : 'Contradicted: the selected date or time conflicts with the reconstructed timeline.',
        where: whereCorrect ? 'Corroborated: 42 Willow Street is the primary interception site.' : 'Not established: the selected site is not the primary interception location.',
        why: whyCorrect ? 'Corroborated: the motive was preventing exposure of the Bell Electronics/Crownline operation.' : 'Not established: the selected motive does not explain the suppression chain.',
        how: howCorrect ? 'Corroborated: a pretextual traffic stop was used for the interception.' : 'Not established: the selected method does not fit the reconstructed sequence.',
        evidence: allRequiredEvidence ? `Complete chain selected: ${matchedEvidence.length}/${sol.keyEvidenceIds.length} required exhibits.` : `Incomplete chain: ${matchedEvidence.length}/${sol.keyEvidenceIds.length} required exhibits selected.`
      },
      officialDetermination: isFullyCorrect ? 'CASE-1998-027 // RECONSTRUCTION ACCEPTED. The evidentiary chain is complete and the case is formally resolved.' : `CASE-1998-027 // REMANDED. ${readiness.reasons.length ? readiness.reasons.join(' ') + ' ' : ''}The record does not yet support a complete determination.`
    };
  }

  public createEvidence(evidenceData: Partial<EvidenceRecord>): EvidenceRecord { const id = evidenceData.id || `E-${Date.now().toString().slice(-6)}`; const now = new Date().toISOString().replace('T', ' ').substring(0, 19); const newRecord: EvidenceRecord = { id, type: 'evidence', title: evidenceData.title || `Evidence Item ${id}`, evidenceId: evidenceData.evidenceId || id, caseId: evidenceData.caseId || 'CASE-1998-027', evidenceType: evidenceData.evidenceType || 'Physical', description: evidenceData.description || 'Newly indexed evidence item.', collectedByOfficerId: evidenceData.collectedByOfficerId || 'OFF-4081', collectionDate: evidenceData.collectionDate || now.split(' ')[0], collectionTime: evidenceData.collectionTime || now.split(' ')[1], collectionLocation: evidenceData.collectionLocation || 'Evidence Receiving Intake', storageLocation: evidenceData.storageLocation || 'Vault B', status: evidenceData.status || 'IN_STORAGE', currentStatus: evidenceData.currentStatus || 'IN_STORAGE', laboratoryStatus: evidenceData.laboratoryStatus || 'NOT_REQUESTED', chainOfCustody: evidenceData.chainOfCustody || [{ id: `cust_${Date.now()}`, timestamp: now, action: 'Initial Intake Logging', fromOfficerOrLocation: 'Field Intake', toOfficerOrLocation: 'Evidence Vault', reason: 'Initial storage' }], relatedPersonIds: evidenceData.relatedPersonIds || [], tags: evidenceData.tags || ['EVIDENCE_INTAKE'], createdAt: now, updatedAt: now, ...evidenceData }; policeDatabase.addEvidence(newRecord); this.onViewRecord(newRecord.id); return newRecord; }
  public updateEvidence(id: string, partial: Partial<EvidenceRecord>): EvidenceRecord | null { const updated = policeDatabase.updateRecord(id, partial, 'Det. S. Miller (#4081)', 'Updated evidence metadata'); if (updated) { this.checkStepTriggers(); this.checkAct6SynthesisTriggers(); this.checkActProgression(); this.notify(); } return updated as EvidenceRecord | null; }
  public revealEvidence(id: string): void { const rec = policeDatabase.getRecord(id) as EvidenceRecord | null; if (rec) { policeDatabase.updateRecord(id, { status: 'IN_STORAGE', currentStatus: 'IN_STORAGE' }); this.onViewRecord(id); } }
  public hideEvidence(id: string): void { policeDatabase.updateRecord(id, { status: 'ARCHIVED', currentStatus: 'ARCHIVED' }); }
  public archiveEvidence(id: string): void { policeDatabase.updateRecord(id, { status: 'ARCHIVED', isArchived: true, currentStatus: 'ARCHIVED' }); }
  public addEvidenceAnalysis(evidenceId: string, analysis: ForensicReport): void { policeDatabase.addForensicReport(evidenceId, analysis); this.setFlag(`analyzed_${evidenceId.toLowerCase()}`, true); this.setFlag(`forensic_${analysis.id.toLowerCase()}`, true); }
  public addCustodyEvent(evidenceId: string, event: CustodyTransfer): void { policeDatabase.addCustodyTransfer(evidenceId, event); this.setFlag(`custody_updated_${evidenceId.toLowerCase()}`, true); }
  public modifyCustodyEvent(evidenceId: string, eventId: string, partial: Partial<CustodyTransfer>): void { const rec = policeDatabase.getRecord(evidenceId) as EvidenceRecord | null; if (rec?.chainOfCustody) { const target = rec.chainOfCustody.find((c) => c.id === eventId); if (target) { Object.assign(target, partial); policeDatabase.updateRecord(evidenceId, { chainOfCustody: [...rec.chainOfCustody] }, 'Auditor', 'Modified custody log'); } } }
  public linkEvidence(evidenceId: string, targetType: 'case' | 'person' | 'vehicle' | 'report' | 'location', targetId: string): void { const rec = policeDatabase.getRecord(evidenceId) as EvidenceRecord | null; if (!rec) return; if (targetType === 'person' && !rec.relatedPersonIds.includes(targetId)) rec.relatedPersonIds = [...rec.relatedPersonIds, targetId]; else if (targetType === 'vehicle') { rec.relatedVehicleId = targetId; rec.relatedVehicleIds = Array.from(new Set([...(rec.relatedVehicleIds || []), targetId])); } else if (targetType === 'case') rec.relatedCaseIds = Array.from(new Set([...(rec.relatedCaseIds || []), targetId])); else if (targetType === 'report') rec.relatedReportIds = Array.from(new Set([...(rec.relatedReportIds || []), targetId])); else if (targetType === 'location') rec.relatedLocationIds = Array.from(new Set([...(rec.relatedLocationIds || []), targetId])); policeDatabase.updateRecord(evidenceId, rec, 'Investigator', `Linked ${targetType} ${targetId}`); }
  public unlinkEvidence(evidenceId: string, targetType: 'case' | 'person' | 'vehicle' | 'report' | 'location', targetId: string): void { const rec = policeDatabase.getRecord(evidenceId) as EvidenceRecord | null; if (!rec) return; if (targetType === 'person') rec.relatedPersonIds = rec.relatedPersonIds.filter((id) => id !== targetId); else if (targetType === 'vehicle') { rec.relatedVehicleIds = (rec.relatedVehicleIds || []).filter((id) => id !== targetId); if (rec.relatedVehicleId === targetId) rec.relatedVehicleId = undefined; } else if (targetType === 'case') rec.relatedCaseIds = (rec.relatedCaseIds || []).filter((id) => id !== targetId); else if (targetType === 'report') rec.relatedReportIds = (rec.relatedReportIds || []).filter((id) => id !== targetId); else if (targetType === 'location') rec.relatedLocationIds = (rec.relatedLocationIds || []).filter((id) => id !== targetId); policeDatabase.updateRecord(evidenceId, rec, 'Investigator', `Unlinked ${targetType} ${targetId}`); }
  public getBoardState(): InvestigationBoardState { return policeDatabase.getBoardState(); }
  public createBoard(title?: string): InvestigationBoardState { const board: InvestigationBoardState = { id: `board_${Date.now()}`, title: title || 'Case 27 Investigation Board', nodes: [], edges: [], timelineEvents: [], viewMode: 'board', zoom: 1, pan: { x: 0, y: 0 }, lastSaved: new Date().toISOString() }; policeDatabase.updateBoardState(board); return board; }
  public saveBoard(boardState: InvestigationBoardState): void { policeDatabase.updateBoardState(boardState); this.notify(); }
  public createBoardNode(node: Partial<BoardNode>): BoardNode { const completeNode: BoardNode = { id: node.id || `bn_${Date.now()}_${Math.floor(Math.random() * 1000)}`, label: node.label || 'UNTITLED NODE', x: node.x ?? (200 + Math.random() * 300), y: node.y ?? (150 + Math.random() * 200), color: node.color || '#3b82f6', ...node }; policeDatabase.addBoardNode(completeNode); return completeNode; }
  public removeBoardNode(nodeId: string): void { policeDatabase.removeBoardNode(nodeId); }
  public moveBoardNode(nodeId: string, x: number, y: number): void { policeDatabase.updateBoardNode(nodeId, { x, y }); }
  public updateBoardNode(nodeId: string, partial: Partial<BoardNode>): void { policeDatabase.updateBoardNode(nodeId, partial); this.notify(); }
  public createBoardConnection(from: string, to: string, label: string, relationType: string = 'associated with', isContradiction = false, isSupport = false): BoardEdge { const edge: BoardEdge = { id: `edge_${from}_${to}_${Date.now()}`, from, to, label, relationType, isContradiction, isSupport }; policeDatabase.addBoardEdge(edge); const board = policeDatabase.getBoardState(); const source = board.nodes.find((n) => n.id === from); const target = board.nodes.find((n) => n.id === to); if (source?.recordId && target?.recordId) { this.setFlag(`connected_${source.recordId}_${target.recordId}`, true); this.setFlag(`connected_${target.recordId}_${source.recordId}`, true); } return edge; }
  public removeBoardConnection(edgeId: string): void { policeDatabase.removeBoardEdge(edgeId); }
  public createInvestigationNote(title: string, content: string, x?: number, y?: number): BoardNode { return this.createBoardNode({ label: title.toUpperCase(), noteText: content, nodeType: 'note', color: '#eab308', x: x ?? 200, y: y ?? 180 }); }
  public createInvestigationQuestion(question: string, status: 'OPEN' | 'RESOLVED' = 'OPEN', x?: number, y?: number): BoardNode { return this.createBoardNode({ label: 'INVESTIGATIVE QUESTION', noteText: question, nodeType: 'question', questionStatus: status, color: status === 'RESOLVED' ? '#10b981' : '#f97316', x: x ?? 200, y: y ?? 180 }); }
  public createHypothesis(title: string, summary: string, status: 'OPEN' | 'SUPPORTED' | 'WEAKENED' | 'DISPROVEN' | 'UNRESOLVED' = 'OPEN', confidence = 50): BoardNode { return this.createBoardNode({ label: `HYPOTHESIS: ${title.toUpperCase()}`, noteText: summary, nodeType: 'hypothesis', hypothesisStatus: status, confidenceScore: confidence, color: status === 'SUPPORTED' ? '#22c55e' : status === 'DISPROVEN' ? '#ef4444' : '#a855f7', x: 350, y: 220 }); }
  public updateHypothesis(nodeId: string, partial: Partial<BoardNode>): void { policeDatabase.updateBoardNode(nodeId, partial); this.notify(); }
  public addTimelineEvent(event: Partial<BoardTimelineEvent>): BoardTimelineEvent { const newEvent: BoardTimelineEvent = { id: event.id || `tle_${Date.now()}`, date: event.date || '1998-09-14', time: event.time || '22:00:00', title: event.title || 'Timeline Milestone', description: event.description || '', reliability: event.reliability || 'VERIFIED', ...event }; policeDatabase.addTimelineEvent(newEvent); this.notify(); return newEvent; }
  public updateTimelineEvent(eventId: string, partial: Partial<BoardTimelineEvent>): void { policeDatabase.updateTimelineEvent(eventId, partial); this.notify(); }
}
export const storyEngine = new StoryEngine();
if (typeof window !== 'undefined' && import.meta.env.DEV) (window as any).storyEngine = storyEngine;
