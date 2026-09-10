export type ClueKind = 'observation' | 'contradiction' | 'lead';

export type InvestigationClue = {
  id: string;
  title: string;
  text: string;
  kind: ClueKind;
  sourceDocumentId: string;
};

export type CaseHypothesis = {
  id: string;
  title: string;
  description: string;
  clueIds: string[];
  status: 'possible' | 'supported' | 'disproved';
};

export const CASE_001_CLUES: InvestigationClue[] = [
  {
    id: 'clue-coat',
    title: 'Anna left her coat behind',
    text: 'The coat is still hanging on the hallway hook. It was cold and raining that evening.',
    kind: 'observation',
    sourceDocumentId: 'doc-report',
  },
  {
    id: 'clue-bag',
    title: 'Her handbag is still inside',
    text: 'Anna apparently left without the bag she normally carried to work.',
    kind: 'observation',
    sourceDocumentId: 'doc-report',
  },
  {
    id: 'clue-door',
    title: 'A door was heard at 21:10',
    text: 'Helen Ward heard the apartment door close at approximately 21:10, but did not see who used it.',
    kind: 'lead',
    sourceDocumentId: 'doc-report',
  },
  {
    id: 'clue-clock',
    title: 'The wall clock is eleven minutes slow',
    text: 'The police record the clock at 20:59 while the verified time is 21:10.',
    kind: 'contradiction',
    sourceDocumentId: 'doc-report',
  },
  {
    id: 'clue-rain',
    title: 'Rain began before the reported door sound',
    text: 'The handwritten note specifically says to check what happened before the rain. The weather entry on the receipt places the first rainfall at approximately 20:48.',
    kind: 'lead',
    sourceDocumentId: 'doc-note',
  },
  {
    id: 'clue-receipt',
    title: 'A supermarket receipt remains on the counter',
    text: 'The receipt is from October 12 and carries a purchase time of 20:31. The shop is less than ten minutes from Anna’s flat.',
    kind: 'observation',
    sourceDocumentId: 'doc-photo',
  },
  {
    id: 'clue-note',
    title: 'Anna warned someone not to trust the clock',
    text: 'The note was written before the disappearance and refers specifically to the wall clock and the rain.',
    kind: 'contradiction',
    sourceDocumentId: 'doc-note',
  },
  {
    id: 'clue-police-language',
    title: 'The police conclusion comes before the evidence is settled',
    text: 'The report labels the absence voluntary even though the coat, handbag, open window and unexplained door sound are all still unresolved.',
    kind: 'contradiction',
    sourceDocumentId: 'doc-report',
  },
];

export const CASE_001_HYPOTHESES: CaseHypothesis[] = [
  {
    id: 'hyp-voluntary',
    title: 'Anna left voluntarily',
    description: 'Anna deliberately disappeared and left the apartment herself.',
    clueIds: ['clue-coat', 'clue-bag', 'clue-note'],
    status: 'disproved',
  },
  {
    id: 'hyp-staged',
    title: 'The apartment was staged',
    description: 'Someone wanted the apartment to look as though Anna had simply left.',
    clueIds: ['clue-coat', 'clue-bag', 'clue-clock', 'clue-police-language'],
    status: 'supported',
  },
  {
    id: 'hyp-door-witness',
    title: 'The 21:10 sound is the key event',
    description: 'The sound heard by Helen Ward marks the moment the disappearance was staged or completed.',
    clueIds: ['clue-door', 'clue-clock'],
    status: 'possible',
  },
];

export const CASE_001_VALID_CONNECTIONS = [
  ['clue-clock', 'clue-door'],
  ['clue-receipt', 'clue-rain'],
  ['clue-note', 'clue-clock'],
  ['clue-coat', 'clue-bag'],
  ['clue-police-language', 'clue-coat'],
] as const;
