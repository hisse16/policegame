export interface CaseLayer {
  act: number;
  scope: string;
  pressure: string;
  question: string;
}

/**
 * Narrative framing only. This is deliberately not a task graph and never
 * exposes the order in which discoveries must be made.
 */
export const CASE_LAYERS: CaseLayer[] = [
  {
    act: 1,
    scope: 'A reopened disappearance with a damaged official record.',
    pressure: 'The archive contains more history than the case summary admits.',
    question: 'What was changed, and why was someone still touching a closed file years later?'
  },
  {
    act: 2,
    scope: 'A missing person case becomes a reconstruction of the night itself.',
    pressure: 'Witness times, dispatch traffic and vehicle movements refuse to agree.',
    question: 'Which version of the night could physically have happened?'
  },
  {
    act: 3,
    scope: 'Anna’s private life collides with a network of people, companies and old cases.',
    pressure: 'Several suspects have motives, but some of their apparent connections are deliberately misleading.',
    question: 'Who benefits from making these people look connected — and who benefits from keeping them separate?'
  },
  {
    act: 4,
    scope: 'The investigation leaves 1998 and starts following the records that survived it.',
    pressure: 'Missing testimony, shell companies and old public archives reveal consequences that continued long after Anna vanished.',
    question: 'Was Case 27 suppressed because of Anna, or because of something Anna accidentally discovered?'
  },
  {
    act: 5,
    scope: 'The evidence trail turns inward toward the institution investigating the crime.',
    pressure: 'The same omissions appear in different years, suggesting a repeatable method rather than a single cover-up.',
    question: 'Who had the authority to make contradictory records look official?'
  },
  {
    act: 6,
    scope: 'The final reconstruction separates what happened to Anna from the larger machinery around her.',
    pressure: 'A convincing culprit is not necessarily the person who designed the system that protected them.',
    question: 'Can Case 27 be solved without pretending the larger network ended with one arrest?'
  }
];

export const getCaseLayer = (act: number): CaseLayer =>
  CASE_LAYERS.find((layer) => layer.act === act) || CASE_LAYERS[0];
