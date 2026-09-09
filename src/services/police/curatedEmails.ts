import { PoliceEmail } from '../../types/mail';

export const CURATED_POLICE_EMAILS: PoliceEmail[] = [
  // --- ACT 1: INITIAL DIRECTIVE & ARCHIVE AUDIT ---
  {
    id: 'MAIL-2026-001',
    threadId: 'TH-CASE27-ASSIGNMENT',
    subject: 'Archive Review Directive — CASE-1998-027 (Anna Bell Disappearance)',
    from: {
      name: 'Captain Laura Bennett',
      email: 'lbennett@records.npd.local',
      rank: 'Captain',
      badge: '2018',
      department: 'Records & Archive Division'
    },
    to: [
      {
        name: 'Detective Sarah Miller',
        email: 'investigator@workstation-07.npd.local'
      }
    ],
    cc: [
      {
        name: 'Lieutenant Marcus Reed',
        email: 'mreed@investigations.npd.local'
      }
    ],
    date: '2026-09-08 07:15',
    timestamp: new Date('2026-09-08T07:15:00').getTime(),
    body: `CONFIDENTIAL // LAW ENFORCEMENT INTERNAL COMMUNICATION
MEMORANDUM FOR: Detective Sarah Miller, Workstation Operator #07
FROM: Captain Laura Bennett, Records & Archive Division
DATE: September 8, 2026
SUBJECT: Priority Audit & Digital Reconciliation — CASE-1998-027

Detective Miller,

Pursuant to the Department-wide Cold Case Digital Preservation Directive, our automated indexing system flagged a data anomaly between the physical microfilm rolls (Box B-12/27) and the scanned database index for CASE-1998-027 (Investigation into the Unsolved Disappearance of Anna Claire Bell, DOB 1981-04-18).

Specifically:
1. Primary investigative summary Report R-1998-112, filed by former Detective Daniel Hayes (OFF-3014) on September 15, 1998, contains a three-hour divergence between recorded witness departure times from Bell Electronics (1440 River Road) and the initial dispatch log entry (INC-1998-1142).
2. The vehicle recovery docket for 1987 Ford Taurus TXR-481 (VEH-TXR481) recovered near Canal Road turnoff (LOC-CANAL-RD) lists physical evidence EV-1998-027-014 with incomplete chain-of-custody transfer signatures from October 1998.
3. Microfilm roll 14-B bears an administrative redaction stamp referencing security authorization token SEC-VANCE-89.

You have been granted temporary Level 4 audit clearance on Workstation 07. Access PRIS, the Evidence & Forensics laboratory, and our internal files. Cross-reference all witness depositions, vehicle sighting logs, and report exhibits.

Keep me and Lt. Reed briefed on any verified contradictions.

Respectfully,

Captain Laura Bennett
Commander, Records Division
Northbridge Police Department
Office: 204-A, 800 High Street | Tel: (555) 382-3401`,
    folder: 'inbox',
    isRead: false,
    isStarred: true,
    isImportant: true,
    priority: 'HIGH',
    classification: 'LAW ENFORCEMENT SENSITIVE',
    relatedCaseIds: ['CASE-1998-027'],
    relatedRecordIds: ['R-1998-112', 'OFF-3014', 'INC-1998-1142', 'VEH-TXR481', 'LOC-CANAL-RD', 'EV-1998-027-014'],
    attachments: [
      {
        id: 'ATT-CASE27-DIRECTIVE',
        name: 'ARCHIVE_AUDIT_DIRECTIVE_27.pdf',
        size: '142 KB',
        mimeType: 'application/pdf',
        relatedRecordId: 'R-1998-112',
        filePath: '/home/investigator/Desktop/CASE_27_REOPENING_MEMO.txt'
      }
    ],
    historicalEra: '2026',
    act: 1,
    isBoardPinned: false
  },
  {
    id: 'MAIL-2026-002',
    threadId: 'TH-CASE27-ASSIGNMENT',
    subject: 'RE: Archive Review Directive — CASE-1998-027 (Anna Bell Disappearance)',
    from: {
      name: 'Lieutenant Marcus Reed',
      email: 'mreed@investigations.npd.local',
      rank: 'Lieutenant',
      badge: '3310',
      department: 'Cold Case & Special Review Unit'
    },
    to: [
      {
        name: 'Detective Sarah Miller',
        email: 'investigator@workstation-07.npd.local'
      },
      {
        name: 'Captain Laura Bennett',
        email: 'lbennett@records.npd.local'
      }
    ],
    date: '2026-09-08 07:42',
    timestamp: new Date('2026-09-08T07:42:00').getTime(),
    body: `Miller,

I have authorized your unrestricted access to the Evidence Lab intake logs and the municipal GIS mapping tool. 

Captain Bennett's team in Archives pulled the physical storage ledgers this morning. There is considerable political sensitivity regarding historical Crownline Logistics (ORG-0012) references that cross-over into the 1998 disappearance file. Do not jump to early conclusions, but ensure every premise on your Investigation Board is backed by hard corroboration.

If you identify clear procedural contradictions between Det. Hayes's reports (R-1998-112, R-1998-114) and CAD timestamps, document them in your Case Notebook immediately.

Lt. Marcus Reed
Special Review Unit Supervisor`,
    folder: 'inbox',
    isRead: false,
    isStarred: false,
    isImportant: true,
    priority: 'HIGH',
    classification: 'LAW ENFORCEMENT SENSITIVE',
    relatedCaseIds: ['CASE-1998-027'],
    relatedRecordIds: ['ORG-0012', 'R-1998-112', 'R-1998-114'],
    historicalEra: '2026',
    act: 1,
    isBoardPinned: false
  },

  // --- ACT 2: HISTORICAL ARCHIVE CORRESPONDENCE (1998 DISPATCH & SIGHTINGS) ---
  {
    id: 'MAIL-1998-088',
    threadId: 'TH-HAYES-TIMELINE-1998',
    subject: 'CASE 27: Initial Canvass Discrepancy — Willow Street & Canal Culvert',
    from: {
      name: 'Detective Daniel Hayes',
      email: 'dhayes@investigations.npd.local',
      rank: 'Detective',
      badge: '3014',
      department: 'Major Crimes Squad 3'
    },
    to: [
      {
        name: 'Captain Arthur Vance',
        email: 'avance@command.npd.local'
      }
    ],
    date: '1998-09-18 16:20',
    timestamp: new Date('1998-09-18T16:20:00').getTime(),
    body: `Captain Vance,

Supplemental field notes regarding the missing person report for Anna Claire Bell (P-004821):

During my neighborhood canvass at 42 Willow Street (LOC-0042) on September 17, Mrs. Gable at 46 Willow stated she observed the blue Ford Taurus (TXR-481) parked in the driveway until approximately 22:15 on the night of September 14. This is 45 minutes AFTER the time Michael Bell (P-004822) stated she left the Bell Electronics warehouse facility (LOC-BELL-ELEC).

Furthermore, dispatch log INC-1998-1142 indicates that Patrol Unit 304 logged a call regarding an abandoned vehicle with hazards blinking near the Canal Road culvert (LOC-CANAL-RD) at 22:45, but the responding unit cleared the scene within 12 minutes claiming no vehicle was present. The Taurus was then mysteriously 'discovered' at that exact location two weeks later on October 2.

I am requesting permission to interview the night dispatcher who handled the 22:45 CAD call, as well as a full subpoena for Crownline Freight's Gate 3 security camera tapes.

Det. Daniel Hayes
Squad 3, Major Crimes`,
    folder: 'archive',
    isRead: true,
    isStarred: true,
    isImportant: true,
    priority: 'HIGH',
    classification: 'LAW ENFORCEMENT SENSITIVE',
    relatedCaseIds: ['CASE-1998-027'],
    relatedRecordIds: ['P-004821', 'LOC-0042', 'P-004822', 'LOC-BELL-ELEC', 'INC-1998-1142', 'LOC-CANAL-RD'],
    historicalEra: '1998',
    act: 2,
    isBoardPinned: false
  },
  {
    id: 'MAIL-1998-089',
    threadId: 'TH-HAYES-TIMELINE-1998',
    subject: 'RE: CASE 27: Initial Canvass Discrepancy — Willow Street & Canal Culvert',
    from: {
      name: 'Captain Arthur Vance',
      email: 'avance@command.npd.local',
      rank: 'Captain',
      badge: '1012',
      department: 'Detective Bureau Command'
    },
    to: [
      {
        name: 'Detective Daniel Hayes',
        email: 'dhayes@investigations.npd.local'
      }
    ],
    date: '1998-09-19 08:30',
    timestamp: new Date('1998-09-19T08:30:00').getTime(),
    body: `Hayes,

Focus your attention on the primary victim timeline and the brother Michael Bell. He was the last confirmed contact at the warehouse and his initial statement has significant gaps regarding the firm's financial accounts.

Regarding Crownline Logistics: Crownline's private terminal property is outside municipal jurisdiction unless you have clear probable cause connecting their freight docks to Miss Bell's disappearance. Do not submit speculative subpoena requests without my explicit written sign-off.

File your formal summary report R-1998-112 today. The Chief is asking for the briefing by 1700 hours.

Capt. Arthur Vance
Commanding Officer, Detective Bureau`,
    folder: 'archive',
    isRead: true,
    isStarred: false,
    isImportant: false,
    priority: 'NORMAL',
    classification: 'CONFIDENTIAL',
    relatedCaseIds: ['CASE-1998-027'],
    relatedRecordIds: ['P-004822', 'R-1998-112', 'ORG-0012'],
    historicalEra: '1998',
    act: 2,
    isBoardPinned: false
  },

  // --- ACT 3: FORENSIC LAB ANALYSES & EVIDENCE EXCHANGES ---
  {
    id: 'MAIL-2026-015',
    threadId: 'TH-FORENSIC-LAB-014',
    subject: 'LAB AUDIT NOTICE: Spectrographic Residue on Evidence EV-1998-027-014',
    from: {
      name: 'Dr. Elena Rostova',
      email: 'erostova@forensics.npd.local',
      rank: 'Lead Forensic Analyst',
      badge: '5820',
      department: 'Forensic Sciences Division'
    },
    to: [
      {
        name: 'Detective Sarah Miller',
        email: 'investigator@workstation-07.npd.local'
      }
    ],
    cc: [
      {
        name: 'Walter Briggs',
        email: 'wbriggs@evidence.npd.local'
      }
    ],
    date: '2026-09-08 09:12',
    timestamp: new Date('2026-09-08T09:12:00').getTime(),
    body: `Detective Miller,

At Captain Bennett's request, I conducted a modern multi-spectral re-examination of physical evidence envelope EV-1998-027-014 (recovered wool fibers and soil debris collected from the driver's side footwell and door sill of 1987 Ford Taurus TXR-481).

Here are the critical forensic findings:
1. FIBER COMPOSITION: The dark wool fibers match the known control standard from Anna Bell's navy trench coat (E-004821).
2. PETROCHEMICAL RESIDUE: In addition to standard road grime, gas chromatography revealed traces of industrial-grade heavy hydraulic lubricant (AeroShell Grease 14 / MIL-G-25537). This lubricant is NOT used in civilian passenger automobiles. It is exclusively utilized in heavy intermodal container cranes and commercial freight gantries — specifically matching the equipment used at the Crownline Freight Depot (LOC-CROWNLINE) and River Road Bay 4 (LOC-BELL-ELEC).
3. SECONDARY TEXTILE TRACE: We isolated synthetic nylon monofilament transfer fibers that do NOT match any garment belonging to Anna Bell or Michael Bell.

I have submitted Forensic Analysis Report FA-2026-091 into PRIS and updated the Evidence Lab module.

Let me know if you need comparative assays against any personnel garments.

Dr. Elena Rostova, Ph.D.
Senior Forensic Scientist | Ext. 5820`,
    folder: 'inbox',
    isRead: false,
    isStarred: true,
    isImportant: true,
    priority: 'URGENT',
    classification: 'LAW ENFORCEMENT SENSITIVE',
    relatedCaseIds: ['CASE-1998-027'],
    relatedRecordIds: ['EV-1998-027-014', 'E-004821', 'LOC-CROWNLINE', 'LOC-BELL-ELEC', 'VEH-TXR481'],
    attachments: [
      {
        id: 'ATT-FA-2026-091',
        name: 'LAB_ANALYSIS_FA_2026_091.pdf',
        size: '280 KB',
        mimeType: 'application/pdf',
        relatedRecordId: 'EV-1998-027-014',
        filePath: '/home/investigator/Documents/Forensics/FA_2026_091_ANALYSIS.txt'
      }
    ],
    historicalEra: '2026',
    act: 3,
    isBoardPinned: false
  },

  // --- ACT 4: CAD DISPATCH DISCREPANCY & HISTORICAL COMMUNICATIONS ---
  {
    id: 'MAIL-2026-022',
    threadId: 'TH-CAD-RECOVERY',
    subject: 'CAD Archive Search: Incident INC-1998-1142 Audio Log & Dispatch Records',
    from: {
      name: 'Karen Kowalski',
      email: 'kkowalski@dispatch.npd.local',
      rank: 'Senior Dispatcher',
      badge: '2241',
      department: 'Communications & 911 CAD Dispatch'
    },
    to: [
      {
        name: 'Detective Sarah Miller',
        email: 'investigator@workstation-07.npd.local'
      }
    ],
    date: '2026-09-08 10:30',
    timestamp: new Date('2026-09-08T10:30:00').getTime(),
    body: `Detective Miller,

I located the magnetic backup tape for Sector 3 CAD logs from September 14–15, 1998.

You asked about incident INC-1998-1142 (Suspicious Vehicle, Canal Road):
• 22:31: Anonymous 911 caller reported a vehicle matching TXR-481 traveling at high speed without headlights heading south toward Canal Road turnoff, followed closely by a white American sedan (matching license plate prefix KLY-902, registered to Crownline Logistics / Victor Vance).
• 22:42: Unit 304 dispatched.
• 23:15: Supervisor manual override entered under operator terminal OPR-01 (Administrative Command Desk). The call code was altered from 'SUSPICIOUS VEHICLE / PURSUIT' to 'UNFOUNDED VEHICLE / RECKLESS DRIVING', and the unit status was closed out as 'GONE ON ARRIVAL'.

The operator terminal OPR-01 was physically located in the Captain's office at headquarters.

I have placed the transcribed call sheet into the CAD records pool.

Karen Kowalski
Senior Dispatch Supervisor | Ext. 9110`,
    folder: 'inbox',
    isRead: false,
    isStarred: true,
    isImportant: true,
    priority: 'HIGH',
    classification: 'LAW ENFORCEMENT SENSITIVE',
    relatedCaseIds: ['CASE-1998-027'],
    relatedRecordIds: ['INC-1998-1142', 'VEH-TXR481', 'VEH-KLY902', 'P-006219', 'LOC-CANAL-RD'],
    historicalEra: '2026',
    act: 4,
    isBoardPinned: false
  },

  // --- ACT 5: 2004 ARCHIVE REORGANIZATION & REDACTION MEMO ---
  {
    id: 'MAIL-2004-019',
    threadId: 'TH-ARCHIVE-PURGE-2004',
    subject: 'CONFIDENTIAL: Records Retention Directive & Microfilm Security Override SEC-VANCE-89',
    from: {
      name: 'Captain Arthur Vance',
      email: 'avance@command.npd.local',
      rank: 'Captain',
      badge: '1012',
      department: 'Archive Administration'
    },
    to: [
      {
        name: 'Captain Laura Bennett',
        email: 'lbennett@records.npd.local'
      }
    ],
    cc: [
      {
        name: 'Marcus Thorne',
        email: 'mthorne@records.npd.local'
      }
    ],
    date: '2004-06-03 14:15',
    timestamp: new Date('2004-06-03T14:15:00').getTime(),
    body: `Captain Bennett,

Under Municipal Records Retention Ordinance 04-188 and Administrative Protocol 7, cold case dockets exceeding five years without active actionable leads must undergo index consolidation and microfilming.

Regarding CASE-1998-027 (Anna Bell Disappearance):
Certain auxiliary folders containing unsubstantiated internal affairs cross-references (specifically IA-1989-114 and freight company transport receipts) are to be microfilmed under restricted access seal SEC-VANCE-89.

Physical documents in Box B-12 are to be indexed under cold storage status. Any external records requests from journalists or relatives must be routed directly through my office.

Acknowledge receipt and compliance.

Capt. Arthur Vance
Archive Division Commander`,
    folder: 'archive',
    isRead: true,
    isStarred: true,
    isImportant: true,
    priority: 'HIGH',
    classification: 'RESTRICTED / INTERNAL AFFAIRS',
    relatedCaseIds: ['CASE-1998-027'],
    relatedRecordIds: ['OFF-1012', 'OFF-2018', 'OFF-5109'],
    historicalEra: '2004',
    act: 5,
    isBoardPinned: false
  },
  {
    id: 'MAIL-2026-033',
    threadId: 'TH-ARCHIVE-PURGE-2004',
    subject: 'RE: Microfilm Roll 14-B Inspection — Redacted Log Recovered',
    from: {
      name: 'Marcus Thorne',
      email: 'mthorne@records.npd.local',
      rank: 'Senior Records Specialist',
      badge: '5109',
      department: 'Records & Archive Division'
    },
    to: [
      {
        name: 'Detective Sarah Miller',
        email: 'investigator@workstation-07.npd.local'
      }
    ],
    date: '2026-09-08 11:45',
    timestamp: new Date('2026-09-08T11:45:00').getTime(),
    body: `Detective Miller,

Following up on Captain Bennett's directive: I pulled microfilm roll 14-B from the sub-basement vault.

Behind the 'SEALED - SEC-VANCE-89' placard, I found three uncatalogued carbon receipts that were never digitized into PRIS:
1. Crownline Freight Bill #CR-98-4412, dated September 14, 1998, 23:30, authorizing emergency gate egress for white Caprice sedan KLY-902 driven by Victor Vance.
2. An internal memo from former Detective Daniel Hayes protesting the abrupt closure of the Canal Road turnoff grid search on October 5, 1998.
3. Handwritten notation in the margin: "Check warehouse Bay 4 foundation repairs dated Sept 16, 1998."

I have digitized these records and attached them below. The physical copies remain secured in Vault B-12.

Marcus Thorne
Senior Records Specialist | Ext. 3415`,
    folder: 'inbox',
    isRead: false,
    isStarred: true,
    isImportant: true,
    priority: 'URGENT',
    classification: 'RESTRICTED / INTERNAL AFFAIRS',
    relatedCaseIds: ['CASE-1998-027'],
    relatedRecordIds: ['VEH-KLY902', 'P-006219', 'LOC-BELL-ELEC', 'OFF-3014'],
    attachments: [
      {
        id: 'ATT-MICROFILM-14B',
        name: 'MICROFILM_ROLL_14B_RECOVERED.pdf',
        size: '410 KB',
        mimeType: 'application/pdf',
        filePath: '/home/investigator/Documents/Investigation/MICROFILM_14B_RECORDS.txt'
      }
    ],
    historicalEra: '2026',
    act: 5,
    isBoardPinned: false
  },

  // --- ACT 6: REVELATION & CONCLUSIVE CORRESPONDENCE ---
  {
    id: 'MAIL-2026-049',
    threadId: 'TH-FINAL-REVELATION',
    subject: 'MEMO: Evidentiary Convergence & Probable Cause Assessment — Case 27',
    from: {
      name: 'Lieutenant Marcus Reed',
      email: 'mreed@investigations.npd.local',
      rank: 'Lieutenant',
      badge: '3310',
      department: 'Cold Case & Special Review Unit'
    },
    to: [
      {
        name: 'Detective Sarah Miller',
        email: 'investigator@workstation-07.npd.local'
      }
    ],
    cc: [
      {
        name: 'Captain Laura Bennett',
        email: 'lbennett@records.npd.local'
      }
    ],
    date: '2026-09-08 13:20',
    timestamp: new Date('2026-09-08T13:20:00').getTime(),
    body: `Detective Miller,

You have established a compelling chain of corroborated facts:
1. The timeline discrepancy between Det. Hayes's initial report (R-1998-112) and CAD dispatch records (INC-1998-1142) proves Anna Bell never drove to Canal Road on the evening of Sept 14.
2. The hydraulic crane lubricant on fibers EV-1998-027-014 ties the vehicle contamination directly to Crownline Freight Depot (LOC-CROWNLINE).
3. The white Caprice KLY-902 sighting at 22:31 and subsequent Gate 3 egress proves Victor Vance's vehicle was active in Sector 3 during the abduction window.
4. The manual override of CAD unit 304 from OPR-01 and the 2004 microfilm redaction under SEC-VANCE-89 substantiate high-level administrative interference.

When you have finalized your Board connections and Contradiction matrix, open the 'Case Determination' tool on your desktop to submit your formal Probable Cause Findings to the District Attorney's Office.

Lt. Marcus Reed`,
    folder: 'inbox',
    isRead: false,
    isStarred: true,
    isImportant: true,
    priority: 'HIGH',
    classification: 'CONFIDENTIAL',
    relatedCaseIds: ['CASE-1998-027'],
    relatedRecordIds: ['R-1998-112', 'INC-1998-1142', 'EV-1998-027-014', 'LOC-CROWNLINE', 'VEH-KLY902', 'P-006219'],
    historicalEra: '2026',
    act: 6,
    isBoardPinned: false
  },

  // --- ROUTINE DEPARTMENT OPERATIONAL & REALISTIC NOISE EMAILS ---
  {
    id: 'MAIL-2026-090',
    threadId: 'TH-IT-ADVISORY',
    subject: 'IT SYSTEM ADVISORY: Securix OS VFS v4.1 Terminal Maintenance Window',
    from: {
      name: 'NPD IT Support Center',
      email: 'support@it.npd.local',
      department: 'Information Technology Division'
    },
    to: [
      {
        name: 'All Sworn Personnel',
        email: 'personnel@all.npd.local'
      }
    ],
    date: '2026-09-07 18:00',
    timestamp: new Date('2026-09-07T18:00:00').getTime(),
    body: `ALL PRECINCT PERSONNEL:

Please be advised that the Securix Terminal and Intranet Gateway will undergo routine kernel optimization tonight between 0200 and 0400 hours.

Workstations left logged in will remain locked. Database queries against PRIS will remain operational with read-only caching. If you experience session timeout on Workstation WS-07, verify your credentials with the Watch Commander.

Respectfully,
NPD Systems Administration`,
    folder: 'inbox',
    isRead: true,
    isStarred: false,
    isImportant: false,
    priority: 'LOW',
    classification: 'UNCLASSIFIED',
    historicalEra: '2026',
    act: 1,
    isBoardPinned: false
  },
  {
    id: 'MAIL-2026-091',
    threadId: 'TH-FIREARMS-QUAL',
    subject: 'MANDATORY: Q3 Firearms Qualification & Defensive Tactics Recertification',
    from: {
      name: 'Training Division - Range Master Cole',
      email: 'training@npd.local',
      rank: 'Sergeant',
      badge: '2190',
      department: 'Training & Professional Standards'
    },
    to: [
      {
        name: 'Detective Sarah Miller',
        email: 'investigator@workstation-07.npd.local'
      }
    ],
    date: '2026-09-06 14:00',
    timestamp: new Date('2026-09-06T14:00:00').getTime(),
    body: `Detective Miller,

Your quarterly duty sidearm qualification (Glock 19 / Sig P320) is scheduled for Friday, September 18 at 0900 at the Harbor Range facility.

Ensure you bring 50 rounds of department-issued ball ammunition and duty rig. Officers who fail to qualify prior to October 1 will be placed on restricted administrative status.

Sgt. R. Cole
Head Firearms Instructor`,
    folder: 'inbox',
    isRead: true,
    isStarred: false,
    isImportant: false,
    priority: 'NORMAL',
    classification: 'UNCLASSIFIED',
    historicalEra: '2026',
    act: 1,
    isBoardPinned: false
  },
  {
    id: 'MAIL-2026-092',
    threadId: 'TH-MOTOR-POOL',
    subject: 'Motor Pool Maintenance: Unmarked Unit 408 Scheduled for 60,000 Mile Service',
    from: {
      name: 'Northbridge Fleet Operations',
      email: 'fleet@city.northbridge.nj.us',
      department: 'Municipal Motor Pool'
    },
    to: [
      {
        name: 'Detective Sarah Miller',
        email: 'investigator@workstation-07.npd.local'
      }
    ],
    date: '2026-09-05 11:30',
    timestamp: new Date('2026-09-05T11:30:00').getTime(),
    body: `Det. Miller,

Your assigned unmarked sedan (Unit 408 - 2021 Ford Taurus, Silver, Plate MG-4082) is overdue for brake pad inspection and tire rotation.

Please drop the vehicle off at Fleet Bay 1 (Dockside Way & Canal) by Wednesday morning. A pool cruiser will be made available for your shift.

Gerry Miller
Fleet Supervisor`,
    folder: 'inbox',
    isRead: true,
    isStarred: false,
    isImportant: false,
    priority: 'LOW',
    classification: 'UNCLASSIFIED',
    historicalEra: '2026',
    act: 1,
    isBoardPinned: false
  },
  {
    id: 'MAIL-2026-093',
    threadId: 'TH-FOP-BENEFIT',
    subject: '38th Annual Northbridge Police Benevolent Fund Dinner - Tickets Available',
    from: {
      name: 'Officer Tom Higgins (FOP Lodge 42)',
      email: 'fop42@npd-association.local',
      department: 'Fraternal Order of Police'
    },
    to: [
      {
        name: 'All Sworn Personnel',
        email: 'personnel@all.npd.local'
      }
    ],
    date: '2026-09-04 09:15',
    timestamp: new Date('2026-09-04T09:15:00').getTime(),
    body: `Brothers and Sisters,

Tickets for the 38th Annual Fallen Officers Memorial Banquet at the Grand Harbor Yacht Club on October 14 are now available through the precinct union rep.

Keynote speaker this year will honor retired detectives from the 1980s and 1990s squads. Tables of 8 are $350. All proceeds support the Widows and Children Educational Endowment.

Fraternally yours,
Tom Higgins, Lodge 42 Trustee`,
    folder: 'archive',
    isRead: true,
    isStarred: false,
    isImportant: false,
    priority: 'LOW',
    classification: 'UNCLASSIFIED',
    historicalEra: '2026',
    act: 1,
    isBoardPinned: false
  }
];
