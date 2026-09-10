import { CURATED_PERSONS } from '../police/curatedRecords';
import { DISCOVERY_STEPS, STORY_FACTS, UNRESOLVED_QUESTIONS, CONTRADICTIONS, TIMELINE_EVENTS, INVESTIGATION_LEADS, FINAL_DEDUCTION_SOLUTION } from './storyData';

const EVELYN_REED_ID = 'P-005119';

if (!CURATED_PERSONS.some((person) => person.id === EVELYN_REED_ID)) {
  CURATED_PERSONS.push({
    id: EVELYN_REED_ID,
    type: 'person',
    title: 'Evelyn Reed',
    firstName: 'Evelyn',
    lastName: 'Reed',
    dob: '1968-07-21',
    pob: 'Newark, NJ',
    gender: 'F',
    height: "5'5\"",
    weight: '130 lbs',
    hair: 'Dark Brown',
    eyes: 'Green',
    occupation: 'Assistant Comptroller, Bell Electronics Components',
    nationality: 'United States',
    aliases: ['E. Reed'],
    addresses: ['17 Maple Court, Northbridge, NJ 07094'],
    phones: ['(555) 382-6241'],
    emails: ['ereed@bell-electronics.local'],
    employmentHistory: [{ company: 'Bell Electronics Components', role: 'Assistant Comptroller', years: '1994-2001' }],
    driverLicenseId: 'DL-NJ-7714205',
    riskLevel: 'LOW',
    knownOffenses: [],
    arrestHistory: [],
    convictionHistory: [],
    openCaseIds: ['CASE-1998-027'],
    closedCaseIds: [],
    warrantIds: [],
    status: 'ACTIVE_RECORD',
    tags: ['WITNESS', 'BELL_ELECTRONICS', 'ACCOUNTING', 'CASE_27'],
    createdAt: '1998-09-20 10:00:00',
    updatedAt: '1999-10-15 09:30:00',
    timeline: [
      { id: 't_er_1', date: '1998-09-20', title: 'Interviewed Regarding Inventory Discrepancies', description: 'Confirmed that Anna Bell had identified irregular Crownline shipping entries before her disappearance.' },
      { id: 't_er_2', date: '1999-10-01', title: 'Grand Jury Subpoena Issued', description: 'Subpoena SUB-1999-042 issued for testimony concerning Bell Electronics export-account discrepancies.' }
    ]
  });
}

const normalize = (value: unknown): void => {
  if (!value || typeof value !== 'object') return;
  const object = value as Record<string, unknown>;
  const serialized = JSON.stringify(object);
  const isMercer = serialized.includes('Daniel Mercer');
  const isReed = serialized.includes('Evelyn Reed');

  Object.keys(object).forEach((key) => {
    const current = object[key];
    if (typeof current === 'string') {
      let next = current;
      if (isMercer) next = next.replace(/P-006219/g, 'P-005118');
      if (isReed) next = next.replace(/P-005118/g, EVELYN_REED_ID);
      object[key] = next;
    } else {
      normalize(current);
    }
  });
};

[DISCOVERY_STEPS, STORY_FACTS, UNRESOLVED_QUESTIONS, CONTRADICTIONS, TIMELINE_EVENTS, INVESTIGATION_LEADS, FINAL_DEDUCTION_SOLUTION].forEach(normalize);
