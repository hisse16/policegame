import {
  AnyRecord,
  PersonRecord,
  CaseRecord,
  EvidenceRecord,
  ReportRecord,
  VehicleRecord,
  RelationshipType
} from '../../types/police';
import { policeDatabase } from './databaseEngine';

export class StoryDatabaseApi {
  public createPerson(data: Partial<PersonRecord>): PersonRecord {
    const id = data.id || `P-${Math.floor(100000 + Math.random() * 900000)}`;
    const newPerson: PersonRecord = {
      id,
      type: 'person',
      title: data.title || `${data.firstName || 'Unknown'} ${data.lastName || 'Person'}`,
      firstName: data.firstName || 'Unknown',
      lastName: data.lastName || 'Person',
      dob: data.dob || '1980-01-01',
      pob: data.pob || 'Northbridge, NJ',
      gender: data.gender || 'OTHER',
      height: data.height || "5'9\"",
      weight: data.weight || '160 lbs',
      hair: data.hair || 'Unknown',
      eyes: data.eyes || 'Unknown',
      occupation: data.occupation || 'Unemployed',
      nationality: data.nationality || 'United States',
      aliases: data.aliases || [],
      addresses: data.addresses || [],
      phones: data.phones || [],
      emails: data.emails || [],
      employmentHistory: data.employmentHistory || [],
      riskLevel: data.riskLevel || 'LOW',
      knownOffenses: data.knownOffenses || [],
      arrestHistory: data.arrestHistory || [],
      convictionHistory: data.convictionHistory || [],
      openCaseIds: data.openCaseIds || [],
      closedCaseIds: data.closedCaseIds || [],
      warrantIds: data.warrantIds || [],
      timeline: data.timeline || [],
      status: data.status || 'ACTIVE_RECORD',
      tags: data.tags || ['CITIZEN'],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...data
    };

    policeDatabase.updateRecord(id, newPerson, 'SYSTEM_STORY_EVENT', 'Person profile created by story event');
    return newPerson;
  }

  public createCase(data: Partial<CaseRecord>): CaseRecord {
    const caseNum = data.caseNumber || `CASE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newCase: CaseRecord = {
      id: caseNum,
      type: 'case',
      title: data.title || `${caseNum}: Investigation`,
      caseNumber: caseNum,
      classification: data.classification || 'OTHER',
      dateOpened: data.dateOpened || new Date().toISOString().replace('T', ' ').substring(0, 19),
      leadInvestigatorId: data.leadInvestigatorId || 'OFF-4081',
      department: data.department || 'Major Crimes Division',
      location: data.location || 'Northbridge',
      victimIds: data.victimIds || [],
      suspectIds: data.suspectIds || [],
      poiIds: data.poiIds || [],
      witnessIds: data.witnessIds || [],
      evidenceIds: data.evidenceIds || [],
      vehicleIds: data.vehicleIds || [],
      weaponIds: data.weaponIds || [],
      reportIds: data.reportIds || [],
      warrantIds: data.warrantIds || [],
      arrestIds: data.arrestIds || [],
      incidentIds: data.incidentIds || [],
      relatedCaseIds: data.relatedCaseIds || [],
      priority: data.priority || 'NORMAL',
      status: data.status || 'OPEN',
      summary: data.summary || 'Investigation initialized.',
      timeline: data.timeline || [],
      tags: data.tags || ['STORY_CASE'],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...data
    };

    policeDatabase.updateRecord(caseNum, newCase, 'SYSTEM_STORY_EVENT', 'Case docket created by story event');
    return newCase;
  }

  public createEvidence(data: Partial<EvidenceRecord>): EvidenceRecord {
    const id = data.evidenceId || `E-${Math.floor(100000 + Math.random() * 900000)}`;
    const newEvidence: EvidenceRecord = {
      id,
      type: 'evidence',
      title: data.title || `Evidence ${id}`,
      evidenceId: id,
      caseId: data.caseId || 'CASE-GENERAL',
      evidenceType: data.evidenceType || 'Physical Item',
      description: data.description || 'Recovered item.',
      collectedByOfficerId: data.collectedByOfficerId || 'OFF-4081',
      collectionDate: data.collectionDate || new Date().toISOString().replace('T', ' ').substring(0, 19),
      collectionLocation: data.collectionLocation || 'Northbridge',
      storageLocation: data.storageLocation || 'Vault B, Shelf 01',
      chainOfCustody: data.chainOfCustody || [
        {
          id: `cust_${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          action: 'Item Logged into PRIS Evidence Registry',
          fromOfficerOrLocation: 'Field Scene',
          toOfficerOrLocation: 'Evidence Vault B',
          reason: 'Initial intake'
        }
      ],
      relatedPersonIds: data.relatedPersonIds || [],
      status: 'IN_STORAGE',
      tags: data.tags || ['EVIDENCE'],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...data
    };

    policeDatabase.updateRecord(id, newEvidence, 'SYSTEM_STORY_EVENT', 'Evidence item cataloged');
    return newEvidence;
  }

  public updateCase(caseId: string, partial: Partial<CaseRecord>, reason?: string): CaseRecord | null {
    return policeDatabase.updateRecord(caseId, partial, 'Detective S. Miller (#4081)', reason) as CaseRecord | null;
  }

  public linkRecords(sourceId: string, targetId: string, type: RelationshipType, description?: string) {
    policeDatabase.addRelationship(sourceId, targetId, type, description);
  }

  public modifyRecord(id: string, partial: Partial<AnyRecord>, reason?: string): AnyRecord | null {
    return policeDatabase.updateRecord(id, partial, 'SYSTEM_EVENT', reason);
  }

  public revealRecord(id: string): boolean {
    const rec = policeDatabase.getRecord(id);
    if (!rec) return false;
    policeDatabase.updateRecord(id, { isSealed: false, sealedReason: undefined }, 'SUPERVISOR_ORDER', 'Record seal revoked');
    return true;
  }

  public sealRecord(id: string, reason: string, accessLevel: 'SUPERVISOR' | 'ADMIN' = 'SUPERVISOR'): boolean {
    const rec = policeDatabase.getRecord(id);
    if (!rec) return false;
    policeDatabase.updateRecord(id, { isSealed: true, sealedReason: reason, accessLevel }, 'COURT_ORDER', 'Protective seal placed');
    return true;
  }

  public unredactSection(reportId: string, sectionKey: string): boolean {
    const report = policeDatabase.getRecord(reportId) as ReportRecord;
    if (!report || report.type !== 'report' || !report.redactions) return false;

    const redactionItem = report.redactions.find((r) => r.section === sectionKey);
    if (!redactionItem) return false;

    // Replace in narrative
    const updatedNarrative = report.narrative.replace(`[REDACTED: ${sectionKey}]`, redactionItem.originalText);
    const updatedRedactions = report.redactions.filter((r) => r.section !== sectionKey);

    policeDatabase.updateRecord(
      reportId,
      {
        narrative: updatedNarrative,
        redactions: updatedRedactions,
        isRedacted: updatedRedactions.length > 0
      },
      'PROSECUTOR_DISCOVERY',
      `Redaction lifted for ${sectionKey}`
    );
    return true;
  }
}

export const storyDatabase = new StoryDatabaseApi();

// Expose on window for runtime testing or script execution
if (typeof window !== 'undefined') {
  (window as any).storyDatabase = storyDatabase;
  (window as any).policeDatabase = policeDatabase;
}
