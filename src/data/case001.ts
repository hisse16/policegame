export type CaseDocument = {
  id: string;
  type: 'letter' | 'newspaper' | 'report' | 'photograph' | 'note';
  title: string;
  date: string;
  source: string;
  content: string;
  tags?: string[];
};

export type CasePerson = {
  id: string;
  name: string;
  role: string;
  note: string;
};

export const CASE_001 = {
  id: 'CASE-001',
  title: 'The Empty Room',
  subtitle: 'A woman disappeared without taking her coat.',
  date: 'October 14, 2026',
  client: 'Margaret Bell',
  premise:
    'Your agency has been open for twelve days. This is the first case that arrives without a police referral, a lawyer, or a name you recognize. A woman has vanished from a locked apartment. Her sister believes she was taken. The police do not.',
  documents: [
    {
      id: 'doc-client-letter',
      type: 'letter',
      title: 'Letter from Margaret Bell',
      date: 'October 13, 2026',
      source: 'Delivered by hand',
      content:
        'Mr. / Ms. Detective,\n\nMy sister Anna has been missing since Monday night. The police say she left voluntarily. I know my sister. She would not leave without her coat, and she would never leave the kitchen window open in October.\n\nThere is something else. When I went back to her flat yesterday, the clock in the kitchen was running eleven minutes slow. Anna was obsessive about that clock.\n\nPlease do not tell me to wait another forty-eight hours. I have already waited too long.\n\n— Margaret',
      tags: ['Anna Bell', 'kitchen clock', 'open window'],
    },
    {
      id: 'doc-newspaper',
      type: 'newspaper',
      title: 'LOCAL TEACHER REPORTED MISSING',
      date: 'October 14, 2026',
      source: 'The Evening Register',
      content:
        'LOCAL TEACHER REPORTED MISSING\n\nAnna Bell, 34, was reported missing from her apartment on Monday evening. Police say there are currently no indications of foul play. Bell was last seen leaving St. Alden Primary School shortly after 6 p.m.\n\nNeighbours described Bell as private and punctual. Detective Inspector Martin Vale said there was no evidence at present to suggest that Bell did not leave the property voluntarily.\n\nPolice ask anyone with information to contact the central station.',
      tags: ['34', '6 p.m.', 'Martin Vale', 'voluntary disappearance'],
    },
    {
      id: 'doc-report',
      type: 'report',
      title: 'Initial Missing Person Report',
      date: 'October 13, 2026',
      source: 'North District Police',
      content:
        'SUBJECT: BELL, ANNA\n\nResidence: 14 Harrow Lane, Flat 3B\nLast confirmed sighting: October 12, 18:12 — St. Alden Primary School\n\nAttending officer notes: Front door locked. No visible damage. Personal handbag located inside residence. Coat located on hallway hook. Kitchen window found open approximately 12 cm. No obvious disturbance.\n\nNeighbour statement: Mrs. Helen Ward reports hearing the front door close at approximately 21:10. She did not see anyone enter or leave.\n\nPreliminary classification: Voluntary absence — LOW RISK.\n\nAdditional note: Kitchen clock displayed 20:59 at time of police attendance. Current verified time was 21:10.',
      tags: ['21:10', 'coat', 'handbag', 'kitchen clock', 'Helen Ward'],
    },
    {
      id: 'doc-photo',
      type: 'photograph',
      title: 'Photograph — Bell Apartment',
      date: 'October 13, 2026',
      source: 'Scene photographer',
      content:
        'A photograph of Anna Bell’s kitchen. The window is open. The wall clock reads 20:59. On the counter sits a ceramic mug with a dark ring of coffee around its base. Beside it is a folded supermarket receipt dated October 12.\n\nThe photograph contains no obvious sign of forced entry.',
      tags: ['20:59', 'receipt', 'coffee mug', 'window'],
    },
    {
      id: 'doc-note',
      type: 'note',
      title: 'Handwritten Note',
      date: 'Undated',
      source: 'Found inside Anna Bell’s book',
      content:
        'Do not trust the time on the wall.\n\nCheck what happened before the rain.\n\nA.B.',
      tags: ['time', 'rain', 'A.B.'],
    },
  ] as CaseDocument[],
  people: [
    {
      id: 'anna-bell',
      name: 'Anna Bell',
      role: 'Missing person · Primary school teacher',
      note: '34 years old. Known for punctuality and meticulous routines.',
    },
    {
      id: 'margaret-bell',
      name: 'Margaret Bell',
      role: 'Client · Anna’s sister',
      note: 'Insists Anna would not leave without her coat.',
    },
    {
      id: 'helen-ward',
      name: 'Helen Ward',
      role: 'Neighbour',
      note: 'Reports hearing the front door at approximately 21:10.',
    },
    {
      id: 'martin-vale',
      name: 'Martin Vale',
      role: 'Police inspector',
      note: 'Publicly described the disappearance as voluntary.',
    },
  ] as CasePerson[],
};
