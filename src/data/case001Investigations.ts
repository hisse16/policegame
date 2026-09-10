export type ClueKind = 'observation' | 'contradiction' | 'lead';
export type InvestigationClue = { id: string; title: string; text: string; kind: ClueKind; sourceDocumentId: string };
export type CaseHypothesis = { id: string; title: string; description: string; clueIds: string[]; status: 'possible' | 'supported' | 'disproved' };

export const CASE_001_CLUES: InvestigationClue[] = [
 { id:'clue-coat', title:'Anna left without her coat', text:'The coat remained inside despite cold rain.', kind:'observation', sourceDocumentId:'doc-report' },
 { id:'clue-bag', title:'Her handbag was still inside', text:'Her everyday handbag, containing her keys and glasses case, was found in the flat.', kind:'observation', sourceDocumentId:'doc-report' },
 { id:'clue-clock', title:'The kitchen clock is eleven minutes slow', text:'Police arrived at 21:10 while the wall clock showed 20:59.', kind:'contradiction', sourceDocumentId:'doc-report' },
 { id:'clue-door', title:'Someone closed the front door at 21:10', text:'Helen heard the door but never saw who left.', kind:'lead', sourceDocumentId:'doc-witness' },
 { id:'clue-footsteps', title:'Heavy footsteps followed the door', text:'Helen later corrected her statement: the person on the stairs sounded heavier than Anna.', kind:'lead', sourceDocumentId:'doc-witness' },
 { id:'clue-rain', title:'Anna wanted the period before the rain checked', text:'Her note points investigators toward events before the rain began.', kind:'lead', sourceDocumentId:'doc-note' },
 { id:'clue-receipt', title:'Anna used her card at 20:31', text:'Her card was used at Mercer Market, seven minutes from home, at 20:31.', kind:'observation', sourceDocumentId:'doc-receipt' },
 { id:'clue-school', title:'Anna was investigating an old record', text:'At school she asked about the 1998 archive shortly before leaving.', kind:'lead', sourceDocumentId:'doc-school' },
 { id:'clue-photo', title:'Anna specifically asked about the photograph', text:'Margaret remembers Anna saying to look at the old photograph if she stopped answering.', kind:'lead', sourceDocumentId:'doc-client-letter' },
 { id:'clue-blue-ink', title:'The same unusual blue mark appears twice', text:'A blue-ink mark appears in the old ledger and on material Anna had copied.', kind:'contradiction', sourceDocumentId:'doc-archive' },
 { id:'clue-e-ward', title:'The old photograph names E. Ward', text:'The person marked in the 1998 photograph is identified on its back as E. Ward.', kind:'lead', sourceDocumentId:'doc-photograph' },
 { id:'clue-sedan', title:'A dark blue sedan was outside', text:'Helen remembers a dark blue sedan outside the building earlier that evening.', kind:'lead', sourceDocumentId:'doc-witness' },
 { id:'clue-police', title:'The voluntary classification was premature', text:'The police classified the case as voluntary while the coat, handbag, clock, open window and unknown person remained unexplained.', kind:'contradiction', sourceDocumentId:'doc-report' },
];

export const CASE_001_HYPOTHESES: CaseHypothesis[] = [
 { id:'hyp-voluntary', title:'Anna left voluntarily', description:'Anna deliberately disappeared and arranged the apartment to look ordinary.', clueIds:['clue-coat','clue-bag','clue-note'], status:'disproved' },
 { id:'hyp-staged', title:'The apartment was staged', description:'Someone created a false timeline and left ordinary belongings behind to make the disappearance appear voluntary.', clueIds:['clue-coat','clue-bag','clue-clock','clue-door','clue-police'], status:'supported' },
 { id:'hyp-school', title:'The disappearance is connected to the old archive', description:'Anna’s investigation at school gives the disappearance a motive beyond a personal decision to vanish.', clueIds:['clue-school','clue-photo','clue-blue-ink','clue-e-ward'], status:'supported' },
 { id:'hyp-sedan', title:'The sedan belongs to the person who took Anna', description:'The blue sedan is suspicious, but there is not enough evidence yet to prove who was driving it.', clueIds:['clue-sedan','clue-footsteps','clue-door'], status:'possible' },
];

export const CASE_001_VALID_CONNECTIONS = [
 ['clue-clock','clue-door'], ['clue-door','clue-footsteps'], ['clue-receipt','clue-rain'], ['clue-note','clue-clock'], ['clue-school','clue-blue-ink'], ['clue-photo','clue-e-ward'], ['clue-sedan','clue-footsteps'], ['clue-coat','clue-bag'], ['clue-police','clue-coat'],
] as const;
