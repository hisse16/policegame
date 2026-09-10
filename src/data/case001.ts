export type CaseDocument = {
  id: string;
  type: 'letter' | 'newspaper' | 'report' | 'photograph' | 'note';
  title: string;
  date: string;
  source: string;
  content: string;
  tags?: string[];
};

export type CasePerson = { id: string; name: string; role: string; note: string };

export const CASE_001 = {
  id: 'CASE-001',
  title: 'THE EMPTY ROOM',
  subtitle: 'A woman vanished. The room tells a different story.',
  date: 'October 14, 2026',
  client: 'Margaret Bell',
  premise: 'Anna Bell disappeared on October 12. Police believe she left voluntarily. Her sister hired Blackwood Detective Agency because Anna left behind the things she would never leave without.',
  documents: [
    { id: 'doc-client-letter', type: 'letter', title: 'Letter from Margaret Bell', date: 'October 13, 2026', source: 'Delivered by hand', content: 'Mr. Blackwood,\n\nMy sister Anna is missing. The police say she left willingly. I do not believe them.\n\nHer coat is still behind the door. Her handbag is still in the kitchen. Her glasses are beside her bed. She would not leave without any of them.\n\nThere is one more thing. Anna called me Sunday night and said she had found something at work that frightened her. She would not tell me what. She said, “If I stop answering, look at the old photograph.”\n\nPlease go to her apartment before you decide anything.\n\n— Margaret Bell', tags: ['CLIENT', 'OLD PHOTOGRAPH', 'SUNDAY CALL'] },
    { id: 'doc-newspaper', type: 'newspaper', title: 'Teacher Reported Missing', date: 'October 14, 2026', source: 'The Evening Register', content: 'TEACHER REPORTED MISSING\n\nAnna Bell, 34, was reported missing Monday night after failing to return home. Police say there is currently no evidence of foul play.\n\nBell was last seen leaving St. Alden Primary School at approximately 6:12 p.m.\n\nDetective Inspector Martin Vale said the circumstances were consistent with a voluntary disappearance.\n\nNeighbours reported hearing nothing unusual.', tags: ['6:12 PM', 'MARTIN VALE', 'VOLUNTARY'] },
    { id: 'doc-report', type: 'report', title: 'Initial Missing Person Report', date: 'October 13, 2026 · 22:14', source: 'North District Police', content: 'SUBJECT: BELL, ANNA\nADDRESS: 14 HARROW LANE, FLAT 3B\n\nLast confirmed sighting: October 12, 18:12 — St. Alden Primary School.\n\nFront door locked. No visible damage. Handbag inside. Coat inside. Glasses inside bedroom. Kitchen window open approximately 12 cm. No obvious disturbance.\n\nNeighbour Helen Ward reports hearing the front door close at approximately 21:10. She did not see anyone.\n\nKitchen wall clock displayed 20:59 when officers arrived at 21:10.\n\nPreliminary classification: VOLUNTARY ABSENCE — LOW RISK.', tags: ['21:10', '20:59', 'COAT', 'BAG', 'WINDOW'] },
    { id: 'doc-photo', type: 'photograph', title: 'Scene Photograph — Kitchen', date: 'October 13, 2026', source: 'Police evidence', content: 'A photograph of Anna Bell’s kitchen. The wall clock reads 20:59. The window is open. A mug sits beside a folded supermarket receipt. The receipt is dated October 12 and shows a purchase at 20:31. The apartment appears orderly.', tags: ['20:59', '20:31', 'RECEIPT', 'WINDOW'] },
    { id: 'doc-note', type: 'note', title: 'Anna’s Handwritten Note', date: 'Found October 13', source: 'Inside Anna’s book', content: 'Do not trust the wall clock.\n\nCheck what happened before the rain.\n\nAsk why the photograph was kept.', tags: ['CLOCK', 'RAIN', 'PHOTOGRAPH'] },
    { id: 'doc-school', type: 'report', title: 'St. Alden Staff Statement', date: 'October 14, 2026', source: 'School administration', content: 'Anna Bell left the school at 18:12 on October 12. She appeared distracted. At 17:40 she asked whether the old attendance archive was still stored in the basement.\n\nColleague Daniel Hayes states that he spoke with Anna at approximately 18:05. He says she was worried about “a mistake in an old record.”\n\nAnna did not mention taking leave or travelling.', tags: ['18:12', 'DANIEL HAYES', 'OLD ARCHIVE'] },
    { id: 'doc-receipt', type: 'report', title: 'Supermarket Transaction Record', date: 'October 12, 2026', source: 'Mercer Market', content: 'Transaction 4418\nDate: October 12\nTime: 20:31\nLocation: Mercer Market, Harrow Lane\n\nItems: coffee, bread, batteries.\nPayment: Anna Bell debit card.\n\nThe market is approximately seven minutes from 14 Harrow Lane on foot.', tags: ['20:31', 'ANNA BELL', 'MERCER MARKET'] },
    { id: 'doc-witness', type: 'report', title: 'Second Statement — Helen Ward', date: 'October 15, 2026', source: 'Interview at Blackwood office', content: 'I heard the front door of Flat 3B close at about 21:10. I remember because I was waiting for the kettle to boil.\n\nBut I need to correct something from my first statement. I heard footsteps on the stairs afterward. They were heavy. Anna was quiet when she walked.\n\nI also remember seeing a dark blue sedan outside earlier that evening. I thought it belonged to someone visiting the building.', tags: ['21:10', 'FOOTSTEPS', 'BLUE SEDAN'] },
    { id: 'doc-archive', type: 'report', title: 'St. Alden Attendance Archive — 1998', date: 'October 16, 2026', source: 'School basement archive', content: 'A damaged attendance ledger contains a handwritten correction beside the name of a former caretaker: Edward Ward. The correction uses the same unusual blue-ink mark found on a page Anna had photocopied.\n\nA loose photograph tucked inside the ledger shows the school staff in 1998. On the back: “Do not file this under staff.”\n\nThe archive notes that Ward resigned after an internal dispute over missing attendance records.', tags: ['1998', 'EDWARD WARD', 'BLUE INK'] },
    { id: 'doc-photograph', type: 'photograph', title: 'The Old Photograph', date: '1998 · recovered October 16', source: 'School archive', content: 'A staff photograph from 1998. The back reads: “Do not file this under staff.” A man standing near the rear entrance has been marked with a blue ink circle. The name written beneath the photograph is: E. Ward. The school inventory identifies him as Edward Ward, former caretaker.', tags: ['1998', 'E. WARD', 'BLUE INK'] },
    { id: 'doc-street', type: 'report', title: 'Street Inspection — Harrow Lane', date: 'October 16, 2026', source: 'Blackwood field notes', content: 'Rainwater has collected along the curb outside Flat 3B. A fresh-looking tyre impression begins beside the building entrance and matches the width of a mid-size sedan.\n\nHelen Ward identifies the dark blue sedan she saw that evening as the same vehicle that had been parked beside the entrance.\n\nA partial plate recovered from a photograph taken by a shop across the road reads: EW-19.\n\nThe old school maintenance register lists Edward Ward as the driver of a blue sedan with the same partial registration.', tags: ['TYRE MARK', 'BLUE SEDAN', 'EW-19', 'EDWARD WARD'] },
  ] as CaseDocument[],
  people: [
    { id: 'anna-bell', name: 'Anna Bell', role: 'Missing person · Primary school teacher', note: '34. Meticulous, punctual, and recently investigating an old school record.' },
    { id: 'margaret-bell', name: 'Margaret Bell', role: 'Client · Anna’s sister', note: 'Received a worrying call from Anna the night before the disappearance.' },
    { id: 'helen-ward', name: 'Helen Ward', role: 'Neighbour', note: 'Heard a door and later heavy footsteps. Saw a dark blue sedan.' },
    { id: 'daniel-hayes', name: 'Daniel Hayes', role: 'Colleague', note: 'Spoke to Anna shortly before she left school. Knows about the old archive.' },
    { id: 'martin-vale', name: 'Martin Vale', role: 'Police inspector', note: 'Classified the disappearance as voluntary before several details were resolved.' },
    { id: 'edward-ward', name: 'Edward Ward', role: 'Former St. Alden caretaker', note: 'Named in the 1998 archive. The old records connect him to the disputed attendance entries.' },
  ] as CasePerson[],
};
