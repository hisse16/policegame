import {
  PersonRecord,
  CaseRecord,
  IncidentRecord,
  EvidenceRecord,
  VehicleRecord,
  OfficerRecord,
  ReportRecord,
  WarrantRecord,
  ArrestRecord,
  LocationRecord,
  OrganizationRecord,
  Relationship
} from '../../types/police';

export const CURATED_OFFICERS: OfficerRecord[] = [
  {
    id: 'OFF-3014',
    type: 'officer',
    title: 'Detective Daniel Hayes',
    badgeNumber: '3014',
    name: 'Daniel Hayes',
    rank: 'Detective',
    department: 'Major Crimes / Missing Persons Division',
    assignment: 'Squad 3 - Lead Forensic Investigator',
    employmentDates: '1992-04-12 to 2008-11-01',
    supervisorName: 'Captain Arthur Vance',
    assignedCaseIds: ['CASE-1998-027', 'CASE-1991-081'],
    authoredReportIds: ['R-1998-112', 'R-1998-114'],
    status: 'TRANSFERRED',
    tags: ['LEAD_INVESTIGATOR', 'MAJOR_CRIMES', 'CASE_27'],
    createdAt: '1998-09-15 08:00:00',
    updatedAt: '2008-11-02 10:15:00',
    timeline: [
      { id: 't_off_1', date: '1992-04-12', title: 'Joined Department', description: 'Sworn in as Patrol Officer, 3rd Precinct.' },
      { id: 't_off_2', date: '1996-08-01', title: 'Promoted to Detective', description: 'Assigned to Detective Bureau, Missing Persons & Homicide.' },
      { id: 't_off_3', date: '1998-09-15', title: 'Assigned Case 27', description: 'Assigned lead detective on the suspicious disappearance of Anna Bell.' },
      { id: 't_off_4', date: '2008-11-01', title: 'Department Transfer', description: 'Reassigned to County Special Investigations Division.' }
    ],
    internalNotes: 'Subject was commended in 1997 for forensic diligence. Requested sealed file access regarding Case 27 prior to transfer.'
  },
  {
    id: 'OFF-1044',
    type: 'officer',
    title: 'Retired Detective John Mercer',
    badgeNumber: '1044',
    name: 'John Mercer',
    rank: 'Detective',
    department: 'Burglary & Special Investigations',
    assignment: 'Archived Squad (Retired)',
    employmentDates: '1974-06-01 to 2001-03-31',
    supervisorName: 'Captain E. Holloway',
    assignedCaseIds: ['CASE-1987-014'],
    authoredReportIds: ['R-1987-042'],
    status: 'RETIRED',
    tags: ['RETIRED', 'BURGLARY', 'HISTORIC'],
    createdAt: '1987-02-14 09:00:00',
    updatedAt: '2001-04-01 00:00:00',
    timeline: [
      { id: 't_mer_1', date: '1974-06-01', title: 'Appointed Officer', description: 'Metropolitan Police Dept patrol corps.' },
      { id: 't_mer_2', date: '1987-03-10', title: 'Investigated Crownline Heist', description: 'Primary investigator on CASE-1987-014.' },
      { id: 't_mer_3', date: '2001-03-31', title: 'Honorably Retired', description: 'Concluded 27 years of sworn law enforcement duty.' }
    ]
  },
  {
    id: 'OFF-4081',
    type: 'officer',
    title: 'Detective Sarah Miller',
    badgeNumber: '4081',
    name: 'Sarah Miller',
    rank: 'Detective',
    department: 'Cold Case & Special Review Unit',
    assignment: 'Current Workstation Operator #07',
    employmentDates: '2018-05-15 to PRESENT',
    supervisorName: 'Lieutenant Marcus Reed',
    assignedCaseIds: ['CASE-1998-027'],
    authoredReportIds: ['R-2026-004'],
    status: 'ACTIVE',
    tags: ['ACTIVE', 'CURRENT_USER', 'COLD_CASE_UNIT'],
    createdAt: '2026-01-10 08:30:00',
    updatedAt: '2026-09-08 02:00:00',
    timeline: [
      { id: 't_sm_1', date: '2018-05-15', title: 'Graduated Police Academy', description: 'Assigned to Northbridge 2nd Precinct Patrol.' },
      { id: 't_sm_2', date: '2023-11-20', title: 'Assigned to Cold Case Review', description: 'Tasked with digital re-examination of unsolved municipal archives.' },
      { id: 't_sm_3', date: '2026-09-08', title: 'Workstation Session Logged', description: 'Re-opened forensic review of CASE-1998-027.' }
    ]
  }
];

export const CURATED_PERSONS: PersonRecord[] = [
  {
    id: 'P-004821',
    type: 'person',
    title: 'Anna Claire Bell',
    firstName: 'Anna',
    lastName: 'Bell',
    dob: '1972-04-18',
    pob: 'Northbridge Memorial Hospital',
    gender: 'F',
    height: "5'6\"",
    weight: '128 lbs',
    hair: 'Auburn / Dark Brown',
    eyes: 'Hazel',
    occupation: 'Lead Circuit Designer & Inventory Auditor',
    nationality: 'United States',
    aliases: ['Annie Bell', 'A. C. Bell'],
    addresses: ['42 Willow Street, Northbridge, NJ 07094', '118 Elm Avenue (former)'],
    phones: ['(555) 382-9014', '(555) 382-1140 (work)'],
    emails: ['abell@bell-electronics.local', 'anna.bell72@metro-net.local'],
    employmentHistory: [
      { company: 'Bell Electronics Components', role: 'Component Auditor & Hardware Architect', years: '1994-1998' },
      { company: 'Metro Technical Institute', role: 'Lab Assistant', years: '1991-1994' }
    ],
    driverLicenseId: 'DL-NJ-9841289',
    nationalId: 'SSN-XXX-XX-4912',
    riskLevel: 'LOW',
    knownOffenses: [],
    arrestHistory: [],
    convictionHistory: [],
    openCaseIds: ['CASE-1998-027'],
    closedCaseIds: [],
    warrantIds: [],
    isMissing: true,
    missingPersonDetails: {
      dateReported: '1998-09-15 07:45:00',
      lastSeenDate: '1998-09-14 21:30:00',
      lastSeenLocation: 'Bell Electronics Warehouse, Bay 4 / Willow Street intersection',
      clothingDescription: 'Dark blue wool trench coat, beige corduroy trousers, silver watch with leather strap.',
      vehicleDescription: '1987 Ford Taurus, Midnight Blue, Plate TXR-481',
      medicalNotes: 'Asthma inhaler prescription; dental records on file at Northbridge General Hospital Dental Archive.',
      searchGridRef: 'GRID-B7 (Northbridge Industrial Marshland)',
      status: 'MISSING'
    },
    status: 'MISSING / UNRESOLVED',
    tags: ['VICTIM', 'MISSING_PERSON', 'CASE_27', 'HIGH_PRIORITY'],
    createdAt: '1998-09-15 08:30:00',
    updatedAt: '2026-09-08 01:15:00',
    timeline: [
      { id: 't_ab_1', date: '1972-04-18', title: 'Birth', description: 'Born in Northbridge, New Jersey.' },
      { id: 't_ab_2', date: '1994-06-10', title: 'Hired at Bell Electronics', description: 'Began role as component auditor for family-owned firm.' },
      { id: 't_ab_3', date: '1998-09-14', time: '21:30', title: 'Last Confirmed Sighting', description: 'Witnessed leaving Bell Electronics office with manila binder.' },
      { id: 't_ab_4', date: '1998-09-15', time: '07:45', title: 'Missing Person Report Filed', description: 'Brother Michael Bell files missing report after vehicle not at residence.' },
      { id: 't_ab_5', date: '1998-10-02', title: 'Vehicle Located', description: 'Ford Taurus TXR-481 recovered abandoned near Canal Road turnoff.' },
      { id: 't_ab_6', date: '1999-01-14', title: 'Case Reclassified to Cold', description: 'Investigation suspended pending actionable forensic leads.' }
    ]
  },
  {
    id: 'P-005102',
    type: 'person',
    title: 'Michael Thomas Bell',
    firstName: 'Michael',
    lastName: 'Bell',
    dob: '1969-11-03',
    pob: 'Northbridge',
    gender: 'M',
    height: "5'11\"",
    weight: '175 lbs',
    hair: 'Brown (receding)',
    eyes: 'Blue',
    occupation: 'Managing Director, Bell Electronics',
    nationality: 'United States',
    aliases: ['Mike Bell'],
    addresses: ['104 Meadow Lane, Northbridge, NJ 07094'],
    phones: ['(555) 382-7719'],
    emails: ['mbell@bell-electronics.local'],
    employmentHistory: [
      { company: 'Bell Electronics Components', role: 'Executive Vice President', years: '1990-PRESENT' }
    ],
    driverLicenseId: 'DL-NJ-3319082',
    riskLevel: 'LOW',
    knownOffenses: [],
    arrestHistory: [],
    convictionHistory: [],
    openCaseIds: ['CASE-1998-027'],
    closedCaseIds: [],
    warrantIds: [],
    status: 'ACTIVE_RECORD',
    tags: ['REPORTING_PARTY', 'FAMILY', 'ASSOCIATE'],
    createdAt: '1998-09-15 08:30:00',
    updatedAt: '2004-06-12 14:20:00',
    timeline: [
      { id: 't_mb_1', date: '1998-09-15', title: 'Reported Sister Missing', description: 'Filed formal missing persons complaint at 1st District Precinct.' },
      { id: 't_mb_2', date: '1998-09-18', title: 'Interviewed by Det. Hayes', description: 'Confirmed Anna discovered anomalous shipments on company inventory manifest.' }
    ]
  },
  {
    id: 'P-002891',
    type: 'person',
    title: 'Robert Vance Hale',
    firstName: 'Robert',
    lastName: 'Hale',
    dob: '1955-08-22',
    pob: 'Trenton, NJ',
    gender: 'M',
    height: "6'0\"",
    weight: '210 lbs',
    hair: 'Gray',
    eyes: 'Brown',
    occupation: 'Night Security Guard / Retired Millwright',
    nationality: 'United States',
    aliases: ['Bob Hale'],
    addresses: ['40 Willow Street, Northbridge, NJ 07094'],
    phones: ['(555) 382-5501'],
    emails: [],
    employmentHistory: [
      { company: 'Crownline Logistics Depot', role: 'Night Gate Watchman', years: '1995-2003' }
    ],
    driverLicenseId: 'DL-NJ-1192834',
    riskLevel: 'MEDIUM',
    knownOffenses: ['Disorderly Conduct (1984 - Dismissed)'],
    arrestHistory: ['ARR-1984-091'],
    convictionHistory: [],
    openCaseIds: ['CASE-1998-027'],
    closedCaseIds: [],
    warrantIds: [],
    status: 'ACTIVE_RECORD',
    tags: ['WITNESS', 'PERSON_OF_INTEREST', 'INCONSISTENT_STATEMENT'],
    createdAt: '1998-09-16 11:20:00',
    updatedAt: '1998-10-05 16:30:00',
    timeline: [
      { id: 't_rh_1', date: '1998-09-15', title: 'Initial Statement', description: 'Claimed he heard vehicle door slam outside 42 Willow St at 22:45.' },
      { id: 't_rh_2', date: '1998-09-22', title: 'Amended Statement', description: 'Changed time of hearing vehicle from 22:45 to 23:30 during secondary interview.' }
    ]
  },
  {
    id: 'P-006219',
    type: 'person',
    title: 'Victor James Vance',
    firstName: 'Victor',
    lastName: 'Vance',
    dob: '1966-02-14',
    pob: 'Philadelphia, PA',
    gender: 'M',
    height: "6'2\"",
    weight: '225 lbs',
    hair: 'Black',
    eyes: 'Brown',
    occupation: 'Freight Dispatcher & Warehouse Operator',
    nationality: 'United States',
    aliases: ['Vic Vance', 'Vance-J', 'The Dispatcher'],
    addresses: ['210 Industrial Parkway, Northbridge, NJ', '77 Canal Turn, Bayonne, NJ'],
    phones: ['(555) 491-0029'],
    emails: ['vvance@crownline-freight.local'],
    employmentHistory: [
      { company: 'Crownline Logistics', role: 'Operations Shift Lead', years: '1996-2004' }
    ],
    driverLicenseId: 'DL-NJ-8829104',
    riskLevel: 'HIGH',
    knownOffenses: ['Interstate Transport of Stolen Goods (1993)', 'Grand Larceny (1996)'],
    arrestHistory: ['ARR-1993-412', 'ARR-1996-189'],
    convictionHistory: ['Convicted 1993 (Suspended Sentence)', 'Convicted 1996 (24 Months Served)'],
    openCaseIds: ['CASE-1998-027'],
    closedCaseIds: ['CASE-1987-014'],
    warrantIds: [],
    status: 'UNDER_SURVEILLANCE',
    tags: ['SUSPECT', 'ORGANIZED_CRIME', 'PRIOR_CONVICTION'],
    createdAt: '1998-09-17 14:00:00',
    updatedAt: '2004-08-19 11:10:00',
    timeline: [
      { id: 't_vv_1', date: '1996-05-12', title: 'Released from Rahway State Facility', description: 'Paroled to Northbridge district.' },
      { id: 't_vv_2', date: '1998-09-14', title: 'On Duty at Crownline Logistics', description: 'Clocked in at freight depot 1.2 miles from Willow Street.' }
    ]
  }
];

export const CURATED_CASES: CaseRecord[] = [
  {
    id: 'CASE-1998-027',
    type: 'case',
    title: 'CASE-1998-027: Suspicious Disappearance of Anna Claire Bell',
    caseNumber: 'CASE-1998-027',
    classification: 'MISSING_PERSON',
    subCategory: 'Suspicious Disappearance / Presumed Abduction',
    dateOpened: '1998-09-15 08:00:00',
    leadInvestigatorId: 'OFF-3014',
    department: 'Metro Police Department - Forensic Archive Division',
    location: '42 Willow Street / Bell Electronics Facility, Northbridge',
    victimIds: ['P-004821'],
    suspectIds: ['P-006219'],
    poiIds: ['P-002891', 'P-005102'],
    witnessIds: ['P-002891', 'P-005102'],
    evidenceIds: ['E-004821', 'E-004822', 'E-004823'],
    vehicleIds: ['VEH-TXR481'],
    weaponIds: [],
    reportIds: ['R-1998-112', 'R-1998-114', 'R-1998-129'],
    warrantIds: ['WAR-1998-044'],
    arrestIds: [],
    incidentIds: ['INC-1998-1142'],
    relatedCaseIds: ['CASE-1987-014', 'CASE-1989-114'],
    priority: 'CRITICAL',
    status: 'REOPENED',
    summary:
      'Subject Anna Claire Bell (26) vanished following her shift at Bell Electronics on the evening of September 14, 1998. Her personal vehicle (1987 Ford Taurus TXR-481) was found abandoned on Canal Road turnoff 18 days later with keys removed and interior glove compartment ransacked. Inventory audits authored by the victim in the weeks prior indicate she had flagged unauthorized shipping manifests connecting Bell Electronics to Crownline Logistics. Suspended in January 1999 as cold case; officially reopened for digital forensic audit.',
    reopenedInfo: {
      timestamp: '2026-09-08 01:00:00',
      officerId: 'OFF-4081',
      reason: 'Digital evidence and unindexed dispatch recording tapes discovered during precinct archive migration.'
    },
    tags: ['CENTRAL_INVESTIGATION', 'COLD_CASE', 'ANNA_BELL', 'CORRUPTION_DISCREPANCY'],
    createdAt: '1998-09-15 08:00:00',
    updatedAt: '2026-09-08 02:20:00',
    history: [
      {
        version: 1,
        date: '1998-09-15 08:00:00',
        modifiedBy: 'Det. Daniel Hayes (#3014)',
        changeSummary: 'Case initiated following missing persons complaint by Michael Bell.'
      },
      {
        version: 2,
        date: '1998-10-03 14:15:00',
        modifiedBy: 'Det. Daniel Hayes (#3014)',
        changeSummary: 'Vehicle TXR-481 processed and evidence items E-004821 through E-004823 cataloged.'
      },
      {
        version: 3,
        date: '1999-01-14 16:00:00',
        modifiedBy: 'Captain Arthur Vance',
        changeSummary: 'Status amended from ACTIVE to COLD CASE due to exhaustion of initial leads.'
      },
      {
        version: 4,
        date: '2004-06-03 11:20:00',
        modifiedBy: 'Archivist L. Gomez',
        changeSummary: 'Case records microfilmed and physical box transferred to Vault B.'
      },
      {
        version: 5,
        date: '2026-09-08 01:00:00',
        modifiedBy: 'Det. Sarah Miller (#4081)',
        changeSummary: 'Case REOPENED for digital cold case audit. Added workstation cross-references.'
      }
    ],
    timeline: [
      {
        id: 't_c27_1',
        date: '1998-09-14',
        time: '21:30',
        title: 'Subject Departs Bell Electronics',
        description: 'Anna Bell clocks out at warehouse office. Security guard notes she carried personal briefcase.',
        officerId: 'OFF-3014'
      },
      {
        id: 't_c27_2',
        date: '1998-09-14',
        time: '22:41',
        title: 'Suspicious Incident Reported at 42 Willow St',
        description: 'Neighbor reports vehicle idling in alley with high beams illuminated.',
        recordId: 'INC-1998-1142',
        recordType: 'incident'
      },
      {
        id: 't_c27_3',
        date: '1998-09-15',
        time: '08:00',
        title: 'Official Missing Persons Docket Opened',
        description: 'Assigned to Detective Hayes. Initial search warrant drafted for residential premises.',
        recordId: 'R-1998-112',
        recordType: 'report'
      },
      {
        id: 't_c27_4',
        date: '1998-10-02',
        time: '14:22',
        title: 'Vehicle TXR-481 Recovered',
        description: 'Taurus located near marsh drainage culvert off Canal Road. Towed to Impound Lot 2.',
        recordId: 'VEH-TXR481',
        recordType: 'vehicle'
      },
      {
        id: 't_c27_5',
        date: '1999-01-14',
        time: '16:00',
        title: 'Investigation Suspended (Cold Status)',
        description: 'Administrative memo issued shelving active canvassing.'
      },
      {
        id: 't_c27_6',
        date: '2026-09-08',
        time: '01:00',
        title: 'CASE REOPENED',
        description: 'Cold Case Unit assigns Detective Sarah Miller (#4081) to conduct full terminal review.'
      }
    ],
    internalCommunications: [
      {
        timestamp: '1998-09-16 09:12:00',
        author: 'Det. Hayes',
        message: 'Conducted walkthrough of 42 Willow. No sign of forced entry, but back porch padlock was unlatched.'
      },
      {
        timestamp: '1998-09-22 17:40:00',
        author: 'Capt. Vance',
        message: 'Inquiries regarding Crownline Logistics freight invoices must receive supervisory approval prior to serving subpoenas.'
      },
      {
        timestamp: '2026-09-08 01:25:00',
        author: 'Det. Miller',
        message: 'Noted discrepancy in chain of custody for Evidence E-004821: booking timestamp shows item checked in before vehicle was logged at impound.'
      }
    ]
  },
  {
    id: 'CASE-1987-014',
    type: 'case',
    title: 'CASE-1987-014: Crownline Freight Warehouse Commercial Larceny',
    caseNumber: 'CASE-1987-014',
    classification: 'BURGLARY',
    subCategory: 'Commercial Depot Break-In',
    dateOpened: '1987-03-10 06:30:00',
    dateClosed: '1989-02-28 17:00:00',
    leadInvestigatorId: 'OFF-1044',
    department: 'Burglary Division',
    location: 'Crownline Logistics Depot, 210 Industrial Parkway',
    victimIds: [],
    suspectIds: ['P-006219'],
    poiIds: [],
    witnessIds: [],
    evidenceIds: [],
    vehicleIds: [],
    weaponIds: [],
    reportIds: ['R-1987-042'],
    warrantIds: [],
    arrestIds: ['ARR-1993-412'],
    incidentIds: [],
    relatedCaseIds: ['CASE-1998-027'],
    priority: 'NORMAL',
    status: 'CLOSED',
    summary:
      'Theft of six freight pallets containing commercial avionics sensors and telecommunications hardware valued at approximately $240,000. Entry gained via severed cyclone fence and bypassed alarm sensor relay. Victor Vance was questioned as shift dispatcher; charges dropped due to inconclusive physical evidence.',
    tags: ['ARCHIVED', 'BURGLARY', 'CROWNLINE'],
    createdAt: '1987-03-10 06:30:00',
    updatedAt: '1989-03-01 10:00:00',
    timeline: [
      { id: 't_c87_1', date: '1987-03-10', title: 'Break-in Discovered', description: 'Morning guard finds gate chain severed.' },
      { id: 't_c87_2', date: '1989-02-28', title: 'Investigation Closed', description: 'Insurance settlement finalized; case closed with no active indictments.' }
    ]
  },
  {
    id: 'CASE-1989-114',
    type: 'case',
    title: 'CASE-1989-114: [RESTRICTED INTERNAL INQUIRY]',
    caseNumber: 'CASE-1989-114',
    classification: 'ORGANIZED_CRIME',
    subCategory: 'Internal Affairs Special Inquiry',
    dateOpened: '1989-07-14 00:00:00',
    leadInvestigatorId: 'OFF-1044',
    department: 'Internal Affairs Division',
    location: 'Redacted',
    victimIds: [],
    suspectIds: [],
    poiIds: [],
    witnessIds: [],
    evidenceIds: [],
    vehicleIds: [],
    weaponIds: [],
    reportIds: [],
    warrantIds: [],
    arrestIds: [],
    incidentIds: [],
    relatedCaseIds: ['CASE-1998-027'],
    priority: 'HIGH',
    status: 'ARCHIVED',
    isSealed: true,
    accessLevel: 'SUPERVISOR',
    sealedReason: 'Internal Affairs Investigation sealed pursuant to Municipal Judicial Protective Order 89-041. Supervisory clearance required.',
    summary:
      'RECORD SEALED BY COURT ORDER. File contains inquiries into alleged improper evidence disposal and undisclosed commercial relations between precinct senior officers and industrial freight operators in the Northbridge industrial corridor.',
    tags: ['SEALED', 'INTERNAL_AFFAIRS', 'SUPERVISOR_LEVEL'],
    createdAt: '1989-07-14 00:00:00',
    updatedAt: '1995-11-20 12:00:00',
    timeline: [
      { id: 't_c89_1', date: '1989-07-14', title: 'Inquiry Commenced', description: 'Internal file created.' },
      { id: 't_c89_2', date: '1990-01-18', title: 'Sealing Order Applied', description: 'Judicial protective seal entered by Municipal Superior Court.' }
    ]
  }
];

export const CURATED_INCIDENTS: IncidentRecord[] = [
  {
    id: 'INC-1998-1142',
    type: 'incident',
    title: 'INCIDENT-1998-1142: Suspicious Activity & Prowler Complaint',
    incidentNumber: 'INC-1998-1142',
    category: 'Suspicious Condition / Prowler',
    date: '1998-09-14',
    time: '22:41',
    location: '42 Willow Street, Northbridge',
    reportingOfficerId: 'OFF-3014',
    linkedCaseId: 'CASE-1998-027',
    linkedPersonIds: ['P-004821', 'P-002891'],
    linkedVehicleIds: ['VEH-TXR481'],
    linkedEvidenceIds: ['E-004821'],
    narrative:
      'Dispatched to address following 911 call from neighbor R. Hale reporting an unfamiliar dark sedan parked across the driveway at 42 Willow Street with headlights extinguished. Officer arrived on scene at 22:58. Area was quiet; residence exterior lights were off. Taurus vehicle was observed parked in carport. No signs of struggle detected on exterior perimeter.',
    status: 'CLOSED_LINKED_TO_CASE',
    tags: ['PROWLER', 'WILLOW_ST', 'CASE_27'],
    createdAt: '1998-09-14 23:30:00',
    updatedAt: '1998-09-15 09:00:00'
  }
];

export const CURATED_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'E-004821',
    type: 'evidence',
    title: 'Evidence E-004821: Ford Key Fob & Cassette Dictation Tape',
    evidenceId: 'E-004821',
    caseId: 'CASE-1998-027',
    incidentId: 'INC-1998-1142',
    evidenceType: 'Physical / Magnetic Media',
    description:
      'Single brass ignition key attached to a black leather key fob inscribed with "B.E.C. - Lab 2". Found alongside a micro-cassette tape labeled "Sept Audit Manifest - A. Bell".',
    collectedByOfficerId: 'OFF-3014',
    collectionDate: '1998-10-02 15:45:00',
    collectionLocation: 'Glove box of Ford Taurus TXR-481, Canal Road culvert',
    storageLocation: 'Evidence Vault B, Shelf 04, Box 27-A',
    status: 'IN_STORAGE',
    tags: ['CRITICAL_EVIDENCE', 'MICRO_CASSETTE', 'KEY_FOB', 'TIMING_DISCREPANCY'],
    createdAt: '1998-10-02 16:30:00',
    updatedAt: '2026-09-08 01:40:00',
    chainOfCustody: [
      {
        id: 'cust_1',
        timestamp: '1998-10-02 15:45:00',
        action: 'Collected at Scene',
        fromOfficerOrLocation: 'Vehicle Interior (Canal Rd)',
        toOfficerOrLocation: 'Det. Daniel Hayes (#3014)',
        reason: 'Initial recovery from vehicle search'
      },
      {
        id: 'cust_2',
        // Notice: timestamp says 14:10 on Oct 2, which precedes collection at 15:45! An authentic puzzle clue!
        timestamp: '1998-10-02 14:10:00',
        action: 'Transferred to Property Clerk',
        fromOfficerOrLocation: 'Det. Daniel Hayes',
        toOfficerOrLocation: 'Evidence Room Central Intake',
        reason: 'Storage logging',
        discrepancyNote: 'Logbook entry time precedes field recovery time. Possible clerical clock desynchronization or pre-logging.'
      },
      {
        id: 'cust_3',
        timestamp: '1998-10-05 09:20:00',
        action: 'Checked out for Audio Lab Analysis',
        fromOfficerOrLocation: 'Evidence Room Central Intake',
        toOfficerOrLocation: 'Forensic Audio Tech R. Chen',
        reason: 'Tape playback and acoustic enhancement'
      },
      {
        id: 'cust_4',
        timestamp: '1998-10-12 16:00:00',
        action: 'Returned to Evidence Room',
        fromOfficerOrLocation: 'Forensic Audio Lab',
        toOfficerOrLocation: 'Vault B, Shelf 04',
        reason: 'Analysis complete; transcripts generated'
      }
    ],
    labAnalysis: {
      laboratory: 'New Jersey State Police Forensic Multimedia Unit',
      analysisDate: '1998-10-11',
      technician: 'R. Chen (Audio Specialist #882)',
      results:
        'Tape contains 4 minutes 12 seconds of dictation by female voice matching Anna Bell. Subject reads invoice numbers from Crownline Logistics: "Manifest 98-442 billed to Westside Pharmacy does not match warehouse outgoing logs." Background acoustic profile reveals diesel truck idling and distinctive railway crossing chime.'
    },
    relatedPersonIds: ['P-004821', 'P-006219'],
    relatedVehicleId: 'VEH-TXR481'
  },
  {
    id: 'E-004822',
    type: 'evidence',
    title: 'Evidence E-004822: Manila Ledger Binder with Shipping Memos',
    evidenceId: 'E-004822',
    caseId: 'CASE-1998-027',
    evidenceType: 'Documentary',
    description:
      'Cardboard ring binder labeled "Q3 1998 Component Audits - Bell Electronics". Contains 48 pages of carbon-copy receipts and handwritten audit tallies in blue ink.',
    collectedByOfficerId: 'OFF-3014',
    collectionDate: '1998-09-16 10:15:00',
    collectionLocation: 'Desk drawer in Anna Bell office, 42 Willow Street second floor study',
    storageLocation: 'Vault B, Shelf 04, Box 27-A',
    status: 'IN_STORAGE',
    tags: ['DOCUMENTS', 'AUDIT', 'BELL_ELECTRONICS'],
    createdAt: '1998-09-16 11:00:00',
    updatedAt: '1998-10-15 00:00:00',
    chainOfCustody: [
      {
        id: 'cust_b1',
        timestamp: '1998-09-16 10:15:00',
        action: 'Seized during Residential Search',
        fromOfficerOrLocation: '42 Willow St Study',
        toOfficerOrLocation: 'Det. Daniel Hayes',
        reason: 'Potential motive documentation'
      }
    ],
    relatedPersonIds: ['P-004821', 'P-005102']
  },
  {
    id: 'E-004823',
    type: 'evidence',
    title: 'Evidence E-004823: Plastic Packaging Fragment with Chemical Residue',
    evidenceId: 'E-004823',
    caseId: 'CASE-1998-027',
    evidenceType: 'Chemical / Synthetic Material',
    description:
      'Heat-sealed polyethylene film strip (3in x 2in) stamped with serial marking "CL-EXP-98". Recovered from driver floorboard carpet of Ford Taurus.',
    collectedByOfficerId: 'OFF-3014',
    collectionDate: '1998-10-02 16:10:00',
    collectionLocation: 'Driver side floorboard, Ford Taurus TXR-481',
    storageLocation: 'Narcotics & Hazardous Chemical Locker 08',
    status: 'IN_STORAGE',
    tags: ['CHEMICAL_RESIDUE', 'VEHICLE_INTERIOR', 'PACKAGING'],
    createdAt: '1998-10-02 17:00:00',
    updatedAt: '1998-10-20 00:00:00',
    chainOfCustody: [
      {
        id: 'cust_c1',
        timestamp: '1998-10-02 16:10:00',
        action: 'Collected at Impound Lot',
        fromOfficerOrLocation: 'Lot 2 Bay 14',
        toOfficerOrLocation: 'Det. Hayes',
        reason: 'Vehicle processing'
      }
    ],
    labAnalysis: {
      laboratory: 'County Toxicology & Narcotics Laboratory',
      analysisDate: '1998-10-18',
      technician: 'Dr. M. Sorkin',
      results:
        'Residue positive for trace industrial solvents and precursor chemicals consistent with synthetic pharmaceutical packaging.'
    },
    relatedPersonIds: ['P-004821', 'P-006219'],
    relatedVehicleId: 'VEH-TXR481'
  }
];

export const CURATED_VEHICLES: VehicleRecord[] = [
  {
    id: 'VEH-TXR481',
    type: 'vehicle',
    title: '1987 Ford Taurus GL (Midnight Blue) - Plate TXR-481',
    licensePlate: 'TXR-481',
    vin: '1FALP52U9HA198421',
    make: 'Ford',
    model: 'Taurus GL',
    year: 1987,
    color: 'Midnight Blue',
    ownerId: 'P-004821',
    registeredAddress: '42 Willow Street, Northbridge, NJ',
    vehicleStatus: 'IMPOUNDED',
    tickets: [
      { date: '1997-11-04', violation: 'Expired Meter (Willow & 4th)', location: 'Northbridge Downtown' },
      { date: '1998-04-19', violation: 'Speeding 42mph in 30mph Zone', location: 'Canal Road Corridor' }
    ],
    accidents: [],
    caseIds: ['CASE-1998-027'],
    status: 'IMPOUNDED',
    tags: ['VICTIM_VEHICLE', 'ABANDONED', 'CASE_27'],
    createdAt: '1998-09-15 08:45:00',
    updatedAt: '1998-10-03 12:00:00'
  },
  {
    id: 'VEH-KLY902',
    type: 'vehicle',
    title: '1992 Chevrolet Caprice Classic (White) - Plate KLY-902',
    licensePlate: 'KLY-902',
    vin: '1G1BL52E4NR104928',
    make: 'Chevrolet',
    model: 'Caprice Classic',
    year: 1992,
    color: 'White',
    ownerId: 'P-006219',
    registeredAddress: '210 Industrial Parkway, Northbridge, NJ',
    vehicleStatus: 'REGISTERED',
    tickets: [
      { date: '1998-08-11', violation: 'Improper Lane Change', location: 'Route 9 Expressway' }
    ],
    accidents: [],
    caseIds: ['CASE-1998-027'],
    status: 'REGISTERED',
    tags: ['SUSPECT_VEHICLE', 'CROWNLINE'],
    createdAt: '1998-09-18 10:00:00',
    updatedAt: '1998-09-18 10:00:00'
  }
];

export const CURATED_REPORTS: ReportRecord[] = [
  {
    id: 'R-1998-112',
    type: 'report',
    title: 'Report #R-1998-112: Initial Missing Person Investigative Summary',
    reportNumber: 'R-1998-112',
    caseId: 'CASE-1998-027',
    incidentId: 'INC-1998-1142',
    authorOfficerId: 'OFF-3014',
    authorRank: 'Detective',
    authorName: 'Daniel Hayes',
    date: '1998-09-15',
    time: '14:30',
    location: 'Northbridge Police Headquarters - Detective Bureau',
    reportType: 'INITIAL REPORT',
    narrative: `METROPOLITAN POLICE DEPARTMENT
INCIDENT & INVESTIGATIVE REPORT
CASE REF: CASE-1998-027
DATE: SEPTEMBER 15, 1998

SUBJECT: Initial Investigation into the Disappearance of Anna Claire Bell (DOB: 04/18/1972)

1. INCIDENT ORIGIN:
On September 15, 1998 at approximately 07:45 hours, Michael Bell (brother of subject) arrived at Central Precinct to report that subject failed to arrive at her scheduled 07:00 shift at Bell Electronics and could not be reached at her residence (42 Willow Street). Michael Bell stated this absence is wholly uncharacteristic.

2. PRELIMINARY CANVASS:
Undersigned detective proceeded to 42 Willow Street at 09:15 hours accompanied by Patrol Officer Kowalski. Subject's vehicle (1987 Ford Taurus, Midnight Blue, NJ Plate TXR-481) was absent from driveway and street parking. Front door was secured. A rear kitchen window was latched from the inside.

Upon entering with key provided by Michael Bell, interior examination showed no signs of violent struggle, ransacking, or forced entry. A half-consumed cup of black coffee and a paperback book were present on the dining room table. Subject's purse, wallet, and passport were not located on premises.

3. WITNESS INTERVIEW:
Interviewed Robert Hale (residing adjacent at 40 Willow Street). Hale stated he heard an engine shut off and a car door slam between 22:30 and 22:45 hours on the evening of September 14. Looked out his front window and saw what he believed was subject's vehicle parked in the driveway. Stated he observed no other individuals.

4. INVESTIGATIVE LEADS:
Interviews scheduled with warehouse personnel at Bell Electronics regarding recent audit documentation. BOLO broadcast for 1987 Ford Taurus TXR-481 across state police teletype.

STATUS: OPEN / ACTIVE SEARCH.`,
    signature: 'Det. D. Hayes #3014',
    relatedPersonIds: ['P-004821', 'P-005102', 'P-002891'],
    relatedEvidenceIds: [],
    status: 'FILED',
    tags: ['REPORT', 'INITIAL', 'HAYES', 'CASE_27'],
    createdAt: '1998-09-15 14:30:00',
    updatedAt: '1998-09-15 14:30:00'
  },
  {
    id: 'R-1998-114',
    type: 'report',
    title: 'Report #R-1998-114: Supplemental Witness Interview - Robert Hale',
    reportNumber: 'R-1998-114',
    caseId: 'CASE-1998-027',
    authorOfficerId: 'OFF-3014',
    authorRank: 'Detective',
    authorName: 'Daniel Hayes',
    date: '1998-09-22',
    time: '11:00',
    location: '40 Willow Street (Interview on scene)',
    reportType: 'INTERVIEW REPORT',
    narrative: `SUPPLEMENTAL INVESTIGATION REPORT
CASE: CASE-1998-027
DATE: SEPTEMBER 22, 1998

INTERVIEWEE: Robert Hale (Neighbor)
INTERVIEWER: Det. Daniel Hayes (#3014)

Re-interviewed witness regarding discrepancy between his initial statement of 09/15 and neighborhood canvass times.

Witness now states that upon reflection, the vehicle he heard arriving was not at 22:45 as originally claimed, but may have been as late as 23:30 hours. When questioned as to why his timeline shifted by nearly an hour, witness stated he was watching television and did not check his wristwatch until the commercial break following the 11:00 PM news broadcast.

Witness also recalled that when he looked outside, the vehicle was facing outbound toward the street with running lights illuminated for several minutes before departing. Witness could not state with certainty whether it was subject's vehicle or another light-colored sedan.

NOTE: Witness exhibited signs of nervous agitation when asked if any commercial freight trucks frequently traverse Willow Street late at night. Stated: "You should ask the dispatcher over at Crownline about late-night deliveries, not me."`,
    signature: 'Det. D. Hayes #3014',
    relatedPersonIds: ['P-002891', 'P-006219'],
    relatedEvidenceIds: [],
    status: 'FILED',
    tags: ['WITNESS', 'CONTRADICTION', 'CROWNLINE'],
    createdAt: '1998-09-22 11:00:00',
    updatedAt: '1998-09-22 11:00:00'
  },
  {
    id: 'R-1998-129',
    type: 'report',
    title: 'Report #R-1998-129: [REDACTED] Special Intelligence Brief',
    reportNumber: 'R-1998-129',
    caseId: 'CASE-1998-027',
    authorOfficerId: 'OFF-3014',
    authorRank: 'Detective',
    authorName: 'Daniel Hayes',
    date: '1998-10-14',
    time: '16:45',
    location: 'Confidential Detective Bureau',
    reportType: 'INTERNAL MEMO',
    isRedacted: true,
    redactions: [
      {
        section: 'CONFIDENTIAL_INFORMANT_NAME',
        originalText: 'Crownline Warehouse Supervisor Raymond Alvarez'
      },
      {
        section: 'DESTINATION_ACCOUNT',
        originalText: 'Offshore corporate holding entity "Vance Maritime Freight SA"'
      }
    ],
    narrative: `INTERNAL INTELLIGENCE MEMORANDUM // RESTRICTED ACCESS
DATE: OCTOBER 14, 1998
FROM: Det. Daniel Hayes (#3014)
TO: Captain Arthur Vance, Division Commander

SUBJECT: Freight Inconsistencies Connecting Bell Electronics and Case 27

Confidential source [REDACTED: CONFIDENTIAL_INFORMANT_NAME] was interviewed at off-site location. Source confirmed that during the months of July through September 1998, high-value optical components billed to Bell Electronics were routinely diverted during cross-docking at the Industrial Parkway depot.

According to the source, Anna Bell visited the depot on the morning of September 11 demanding to inspect bills of lading. She confronted Victor Vance directly regarding missing shipments. An argument occurred in the dispatch office.

Source states Vance was overhead stating: "Tell your brother to stop asking for signed receipts, or you're both going to end up in the canal."

Financial records indicate diverted component proceeds were wired to [REDACTED: DESTINATION_ACCOUNT].

RECOMMENDATION: Immediate grand jury subpoena for warehouse shipping records.`,
    signature: 'Det. D. Hayes #3014',
    relatedPersonIds: ['P-004821', 'P-006219'],
    relatedEvidenceIds: ['E-004821', 'E-004823'],
    status: 'SEALED_REDACTED',
    tags: ['REDACTED', 'INTERNAL_MEMO', 'MOTIVE_CLUE'],
    createdAt: '1998-10-14 16:45:00',
    updatedAt: '2004-06-03 10:00:00'
  },
  {
    id: 'R-1987-042',
    type: 'report',
    title: 'Report #R-1987-042: Burglary Scene Examination - Crownline Depot',
    reportNumber: 'R-1987-042',
    caseId: 'CASE-1987-014',
    authorOfficerId: 'OFF-1044',
    authorRank: 'Detective',
    authorName: 'John Mercer',
    date: '1987-03-11',
    time: '10:00',
    location: '210 Industrial Parkway',
    reportType: 'CRIME SCENE REPORT',
    narrative: `CRIME SCENE EXAMINATION REPORT
CASE: CASE-1987-014
DATE: MARCH 11, 1987

Inspected warehouse perimeter fence at Crownline Logistics depot. Chain link wire was severed with heavy-duty mechanical bolt cutters. Interior alarm contacts on Bay 3 rollup door were bypassed with an electrical jumper clip indicating inside familiarity with security circuitry.

Victor Vance (shift dispatcher) stated he was off site between 01:00 and 04:00 getting coffee at the 24-hour diner on Route 9. Diner waitress could not confirm his presence.

No fingerprints recoverable due to industrial dust coating. Case remains open.`,
    signature: 'Det. J. Mercer #1044',
    relatedPersonIds: ['P-006219'],
    relatedEvidenceIds: [],
    status: 'FILED',
    tags: ['ARCHIVED_REPORT', 'BURGLARY'],
    createdAt: '1987-03-11 10:00:00',
    updatedAt: '1987-03-11 10:00:00'
  }
];

export const CURATED_LOCATIONS: LocationRecord[] = [
  {
    id: 'LOC-WILLOW42',
    type: 'location',
    title: '42 Willow Street, Northbridge',
    address: '42 Willow Street',
    district: 'Northbridge 3rd Ward (Historic District)',
    locationType: 'RESIDENTIAL',
    knownOccupantNames: ['Anna Claire Bell'],
    knownBusinessNames: [],
    incidentIds: ['INC-1998-1142'],
    caseIds: ['CASE-1998-027'],
    status: 'ACTIVE_RECORD',
    tags: ['CRIME_SCENE', 'RESIDENCE', 'CASE_27'],
    createdAt: '1998-09-15 08:00:00',
    updatedAt: '2026-09-08 01:00:00'
  },
  {
    id: 'LOC-BELL-ELEC',
    type: 'location',
    title: 'Bell Electronics Components Facility',
    address: '1440 River Road, Bay 4',
    district: 'Northbridge Industrial Zone',
    locationType: 'COMMERCIAL',
    knownOccupantNames: ['Michael Bell', 'Anna Bell'],
    knownBusinessNames: ['Bell Electronics Components Inc.'],
    incidentIds: [],
    caseIds: ['CASE-1998-027'],
    status: 'ACTIVE_RECORD',
    tags: ['COMMERCIAL', 'BELL_ELECTRONICS'],
    createdAt: '1998-09-15 08:00:00',
    updatedAt: '2026-09-08 01:00:00'
  },
  {
    id: 'LOC-CROWNLINE',
    type: 'location',
    title: 'Crownline Logistics Freight Depot',
    address: '210 Industrial Parkway',
    district: 'Northbridge Rail Corridor',
    locationType: 'INDUSTRIAL',
    knownOccupantNames: ['Victor Vance', 'Arthur Vance'],
    knownBusinessNames: ['Crownline Logistics Corp', 'Crownline Freight Depot'],
    incidentIds: [],
    caseIds: ['CASE-1987-014', 'CASE-1998-027'],
    status: 'ACTIVE_RECORD',
    tags: ['INDUSTRIAL', 'FREIGHT_DEPOT', 'CROWNLINE'],
    createdAt: '1987-03-10 06:30:00',
    updatedAt: '2026-09-08 01:00:00'
  },
  {
    id: 'LOC-CANAL-RD',
    type: 'location',
    title: 'Canal Road Marsh Turnoff (Mile Marker 4.2)',
    address: 'Canal Road at Marsh Culvert',
    district: 'Outer County Wetlands Reserve',
    locationType: 'PUBLIC',
    knownOccupantNames: [],
    knownBusinessNames: [],
    incidentIds: [],
    caseIds: ['CASE-1998-027'],
    status: 'ACTIVE_RECORD',
    tags: ['VEHICLE_RECOVERY_SITE', 'CANAL'],
    createdAt: '1998-10-02 14:00:00',
    updatedAt: '1998-10-03 00:00:00'
  }
];

export const CURATED_ORGANIZATIONS: OrganizationRecord[] = [
  {
    id: 'ORG-BELL-ELEC',
    type: 'organization',
    title: 'Bell Electronics Components Inc.',
    orgName: 'Bell Electronics Components Inc.',
    registrationNumber: 'CORP-NJ-1979-0419',
    orgType: 'CORPORATION',
    headquartersAddress: '1440 River Road, Bay 4, Northbridge, NJ',
    phone: '(555) 382-1140',
    executives: ['Michael Bell (President)', 'Thomas Bell (Founder - Deceased)'],
    employeePersonIds: ['P-004821', 'P-005102'],
    associatedCaseIds: ['CASE-1998-027'],
    complaints: [
      { date: '1998-09-12', summary: 'Internal discrepancy report logged by A. Bell regarding unauthorized freight dock transfers.' }
    ],
    status: 'ACTIVE_BUSINESS',
    tags: ['ELECTRONICS', 'FAMILY_FIRM'],
    createdAt: '1979-04-19 00:00:00',
    updatedAt: '2026-09-08 00:00:00'
  },
  {
    id: 'ORG-CROWNLINE',
    type: 'organization',
    title: 'Crownline Logistics Corporation',
    orgName: 'Crownline Logistics Corporation',
    registrationNumber: 'CORP-NJ-1982-8812',
    orgType: 'CORPORATION',
    headquartersAddress: '210 Industrial Parkway, Northbridge, NJ',
    phone: '(555) 491-0000',
    executives: ['Captain Arthur Vance (Board Director - Former)', 'Victor Vance (Operations Lead)'],
    employeePersonIds: ['P-006219', 'P-002891'],
    associatedCaseIds: ['CASE-1987-014', 'CASE-1989-114', 'CASE-1998-027'],
    complaints: [
      { date: '1987-03-10', summary: 'Reported commercial burglary of sensor pallets.' },
      { date: '1998-08-20', summary: 'Municipal noise complaint regarding unregistered overnight diesel tractor trailers.' }
    ],
    status: 'ACTIVE_BUSINESS',
    tags: ['LOGISTICS', 'SUSPECT_ORGANIZATION'],
    createdAt: '1982-06-11 00:00:00',
    updatedAt: '2026-09-08 00:00:00'
  }
];

export const CURATED_WARRANTS: WarrantRecord[] = [
  {
    id: 'WAR-1998-044',
    type: 'warrant',
    title: 'Warrant #WAR-1998-044: Residential Search Warrant for 42 Willow St',
    warrantNumber: 'WAR-1998-044',
    personId: 'P-004821',
    personName: 'Anna Claire Bell',
    caseId: 'CASE-1998-027',
    issueDate: '1998-09-16 08:30:00',
    expirationDate: '1998-09-26 23:59:00',
    issuingAuthority: 'Municipal Superior Court Judge Evelyn Alvarez',
    charges: ['Search Authorization - Suspicious Disappearance Investigation'],
    warrantStatus: 'EXECUTED',
    assignedOfficerId: 'OFF-3014',
    notes: 'Executed by Detective Hayes on September 16, 1998 at 10:00. Evidence item E-004822 secured.',
    status: 'EXECUTED',
    tags: ['WARRANT', 'SEARCH', 'EXECUTED'],
    createdAt: '1998-09-16 08:30:00',
    updatedAt: '1998-09-16 11:00:00'
  }
];

export const CURATED_RELATIONSHIPS: Relationship[] = [
  { id: 'rel_1', sourceId: 'P-004821', targetId: 'CASE-1998-027', type: 'VICTIM', description: 'Missing person / subject of case' },
  { id: 'rel_2', sourceId: 'P-004821', targetId: 'P-005102', type: 'FAMILY', description: 'Brother and business partner' },
  { id: 'rel_3', sourceId: 'P-004821', targetId: 'ORG-BELL-ELEC', type: 'EMPLOYEE', description: 'Auditor & Component Architect' },
  { id: 'rel_4', sourceId: 'P-004821', targetId: 'LOC-WILLOW42', type: 'LOCATION', description: 'Primary residence' },
  { id: 'rel_5', sourceId: 'P-004821', targetId: 'VEH-TXR481', type: 'OWNER', description: 'Registered vehicle owner' },
  { id: 'rel_6', sourceId: 'E-004821', targetId: 'CASE-1998-027', type: 'EVIDENCE', description: 'Recovered key fob & audio cassette' },
  { id: 'rel_7', sourceId: 'E-004821', targetId: 'VEH-TXR481', type: 'VEHICLE', description: 'Recovered from glove box' },
  { id: 'rel_8', sourceId: 'OFF-3014', targetId: 'CASE-1998-027', type: 'OFFICER', description: 'Lead investigator' },
  { id: 'rel_9', sourceId: 'P-006219', targetId: 'CASE-1998-027', type: 'SUSPECT', description: 'Person of interest regarding freight discrepancies' },
  { id: 'rel_10', sourceId: 'P-006219', targetId: 'ORG-CROWNLINE', type: 'EMPLOYEE', description: 'Shift operations dispatcher' },
  { id: 'rel_11', sourceId: 'P-002891', targetId: 'CASE-1998-027', type: 'WITNESS', description: 'Neighbor reporting auditory sighting' },
  { id: 'rel_12', sourceId: 'P-002891', targetId: 'LOC-WILLOW42', type: 'LOCATION', description: 'Adjacent resident at #40 Willow' },
  { id: 'rel_13', sourceId: 'CASE-1998-027', targetId: 'CASE-1987-014', type: 'CASE', description: 'Linked via Crownline Logistics freight operations' },
  { id: 'rel_14', sourceId: 'CASE-1998-027', targetId: 'CASE-1989-114', type: 'CASE', description: 'Referenced in sealed internal affairs inquiry' }
];
