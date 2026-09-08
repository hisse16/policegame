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
    id: 'OFF-1012',
    type: 'officer',
    title: 'Captain Arthur Vance',
    badgeNumber: '1012',
    name: 'Arthur Vance',
    rank: 'Captain',
    department: 'Detective Bureau / Archive Administration',
    assignment: 'Supervising Investigator / Archive Division Commander',
    employmentDates: '1984-01-15 to Present',
    supervisorName: 'Chief of Police',
    assignedCaseIds: ['CASE-1998-027', 'CASE-1989-114'],
    authoredReportIds: ['R-1989-088'],
    status: 'ACTIVE',
    tags: ['COMMAND', 'ARCHIVE_SUPERVISOR', 'INTERNAL_AFFAIRS_LINK'],
    createdAt: '1989-05-10 08:00:00',
    updatedAt: '2026-09-08 08:00:00',
    timeline: [
      { id: 't_av_1', date: '1984-01-15', title: 'Commissioned Officer', description: 'Assigned to Harbor Precinct patrol.' },
      { id: 't_av_2', date: '1989-07-22', title: 'Internal Affairs Assignment', description: 'Directed review of off-duty officer moonlighting in freight corridor.' },
      { id: 't_av_3', date: '1998-09-15', title: 'Assigned Case 27 to Hayes', description: 'Assigned Detective Daniel Hayes as sole lead on Anna Bell disappearance.' },
      { id: 't_av_4', date: '2004-06-03', title: 'Archive Reorganization', description: 'Authorized microfilming and indexing override under security token SEC-VANCE-89.' },
      { id: 't_av_5', date: '2026-09-08', title: 'Archive Review Directive', description: 'Authorized cold case audit review following automated discrepancy alert.' }
    ],
    internalNotes: 'Supervisory authority on Case 27 closure in 1999. In 2004, presided over records retention changes that expunged IA-1989-114 cross-references.'
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
    dob: '1981-04-18',
    pob: 'Northbridge Memorial Hospital',
    gender: 'F',
    height: "5'6\"",
    weight: '122 lbs',
    hair: 'Auburn / Dark Brown',
    eyes: 'Hazel',
    occupation: 'Clerical Assistant & Component Auditor',
    nationality: 'United States',
    aliases: ['Annie Bell', 'A. C. Bell'],
    addresses: ['42 Willow Street, Northbridge, NJ 07094', '118 Elm Avenue (former)'],
    phones: ['(555) 382-9014', '(555) 382-1140 (work)'],
    emails: ['abell@bell-electronics.local', 'anna.bell@metro-net.local'],
    employmentHistory: [
      { company: 'Bell Electronics Components', role: 'Inventory Auditor & Dispatch Clerk', years: '1997-1998' }
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
      { id: 't_ab_1', date: '1981-04-18', title: 'Birth', description: 'Born in Northbridge, New Jersey.' },
      { id: 't_ab_2', date: '1997-06-10', title: 'Hired at Bell Electronics', description: 'Began part-time clerical audit role for family firm.' },
      { id: 't_ab_3', date: '1998-09-14', time: '21:30', title: 'Last Confirmed Sighting', description: 'Witnessed leaving Bell Electronics office with manila binder.' },
      { id: 't_ab_4', date: '1998-09-15', time: '07:45', title: 'Missing Person Report Filed', description: 'Brother Michael Bell files missing report after vehicle not at residence.' },
      { id: 't_ab_5', date: '1998-10-02', title: 'Vehicle Located', description: 'Ford Taurus TXR-481 recovered abandoned near Canal Road turnoff.' },
      { id: 't_ab_6', date: '1999-01-14', title: 'Case Reclassified to Cold', description: 'Investigation suspended pending actionable forensic leads.' }
    ]
  },
  {
    id: 'P-004822',
    type: 'person',
    title: 'Michael Thomas Bell',
    firstName: 'Michael',
    lastName: 'Bell',
    dob: '1975-11-03',
    pob: 'Northbridge',
    gender: 'M',
    height: "5'11\"",
    weight: '175 lbs',
    hair: 'Brown',
    eyes: 'Blue',
    occupation: 'Warehouse Supervisor & Manager, Bell Electronics',
    nationality: 'United States',
    aliases: ['Mike Bell'],
    addresses: ['104 Meadow Lane, Northbridge, NJ 07094', '42 Willow Street (family)'],
    phones: ['(555) 382-7719'],
    emails: ['mbell@bell-electronics.local'],
    employmentHistory: [
      { company: 'Bell Electronics Components', role: 'Warehouse Supervisor / Vice President', years: '1995-PRESENT' }
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
      { id: 't_mb_2', date: '1998-09-18', title: 'Interviewed by Det. Hayes', description: 'Confirmed Anna discovered anomalous shipments on company inventory manifest.' },
      { id: 't_mb_3', date: '1998-10-12', title: 'Deposition Signed', description: 'Testified regarding Crownline night runs and missing Canal storage key.' }
    ]
  },
  {
    id: 'P-003102',
    type: 'person',
    title: 'Leo Vance',
    firstName: 'Leo',
    lastName: 'Vance',
    dob: '1962-09-14',
    pob: 'Newark, NJ',
    gender: 'M',
    height: "5'9\"",
    weight: '160 lbs',
    hair: 'Sandy Gray',
    eyes: 'Blue',
    occupation: 'Diner Night Manager / Counter Clerk',
    nationality: 'United States',
    aliases: ['Leo'],
    addresses: ['88 Grand Avenue, Northbridge, NJ'],
    phones: ['(555) 382-4119'],
    emails: [],
    employmentHistory: [
      { company: 'Grand Avenue 24hr Diner', role: 'Night Shift Clerk', years: '1992-2006' }
    ],
    driverLicenseId: 'DL-NJ-6612091',
    riskLevel: 'LOW',
    knownOffenses: [],
    arrestHistory: [],
    convictionHistory: [],
    openCaseIds: ['CASE-1998-027'],
    closedCaseIds: [],
    warrantIds: [],
    status: 'ACTIVE_RECORD',
    tags: ['WITNESS', 'ALIBI_REFUTATION'],
    createdAt: '1998-09-16 14:00:00',
    updatedAt: '1998-10-04 11:00:00',
    timeline: [
      { id: 't_lv_1', date: '1998-09-16', title: 'Witness Interview', description: 'Interviewed by Det. Hayes regarding customer presence on the night of September 14, 1998.' }
    ]
  },
  {
    id: 'P-005118',
    type: 'person',
    title: 'Daniel Mercer',
    firstName: 'Daniel',
    lastName: 'Mercer',
    dob: '1965-03-29',
    pob: 'Camden, NJ',
    gender: 'M',
    height: "6'1\"",
    weight: '205 lbs',
    hair: 'Brown',
    eyes: 'Brown',
    occupation: 'Commercial Freight Driver',
    nationality: 'United States',
    aliases: ['Danny Mercer'],
    addresses: ['512 Harbor Boulevard, Elizabeth, NJ'],
    phones: ['(555) 491-3382'],
    emails: ['dmercer@crownline-freight.local'],
    employmentHistory: [
      { company: 'Crownline Logistics', role: 'Heavy Freight Driver', years: '1995-2005' }
    ],
    driverLicenseId: 'CDL-NJ-4091882',
    riskLevel: 'MEDIUM',
    knownOffenses: ['Speeding in Commercial Zone (1997)', 'Logbook Violation (1998)'],
    arrestHistory: [],
    convictionHistory: [],
    openCaseIds: ['CASE-1998-027'],
    closedCaseIds: [],
    warrantIds: [],
    status: 'ACTIVE_RECORD',
    tags: ['PERSON_OF_INTEREST', 'CROWNLINE_DRIVER'],
    createdAt: '1998-09-18 10:00:00',
    updatedAt: '2004-06-03 16:00:00',
    timeline: [
      { id: 't_dm_1', date: '1998-09-14', title: 'Overnight Route Logged', description: 'Operated tractor trailer on Northbridge industrial loop.' }
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
      'Subject Anna Claire Bell (17) vanished following her shift at Bell Electronics on the evening of September 14, 1998. Her personal vehicle (1987 Ford Taurus TXR-481) was found abandoned on Canal Road turnoff 18 days later with keys removed and interior glove compartment ransacked. Inventory audits authored by the victim in the weeks prior indicate she had flagged unauthorized shipping manifests connecting Bell Electronics to Crownline Logistics. Suspended in January 1999 as cold case; officially reopened for digital forensic audit following archive audit discrepancy.',
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
  },
  {
    id: 'CASE-1991-081',
    type: 'case',
    title: 'CASE-1991-081: Commercial Freight Diversion - Bell Electronics Depot',
    caseNumber: 'CASE-1991-081',
    classification: 'BURGLARY',
    subCategory: 'Commercial Freight Diversion / Inventory Anomaly',
    dateOpened: '1991-11-04 09:00:00',
    leadInvestigatorId: 'OFF-3014',
    department: 'Detective Bureau / Commercial Inquiries',
    location: '1440 River Road, Bay 4, Northbridge',
    victimIds: ['P-005102'],
    suspectIds: ['P-005118'],
    poiIds: ['P-006219'],
    witnessIds: [],
    evidenceIds: [],
    vehicleIds: [],
    weaponIds: [],
    reportIds: [],
    warrantIds: [],
    arrestIds: [],
    incidentIds: [],
    relatedCaseIds: ['CASE-1998-027'],
    priority: 'NORMAL',
    status: 'CLOSED',
    summary:
      'Investigation into repeated discrepancy between Bell Electronics inventory manifests and outgoing Crownline transport logs. Det. Daniel Hayes determined no criminal intent; classified as administrative accounting variance.',
    tags: ['ARCHIVED', 'FREIGHT_ANOMALY', 'BELL_ELECTRONICS'],
    createdAt: '1991-11-04 09:00:00',
    updatedAt: '1992-02-12 11:00:00',
    timeline: [
      { id: 't_c91_1', date: '1991-11-04', title: 'Discrepancy Reported', description: 'Management noted unverified nocturnal pickups.' },
      { id: 't_c91_2', date: '1992-02-12', title: 'File Closed', description: 'Hayes concluded clerical error.' }
    ]
  },
  {
    id: 'FINAL_DEDUCTION_BOARD',
    type: 'case',
    title: 'FINAL DEDUCTION BOARD: Case 27 - Official Resolution Matrix',
    caseNumber: 'FINAL-DEDUCTION-MATRIX',
    classification: 'HOMICIDE',
    subCategory: 'Deduction Synthesis & Arraignment Brief',
    dateOpened: '2026-09-08 08:00:00',
    leadInvestigatorId: 'OFF-4081',
    department: 'Metropolitan Police - Archive Division',
    location: 'Workstation #07 Terminal',
    victimIds: ['P-004821'],
    suspectIds: ['OFF-3014', 'OFF-1012', 'P-006219', 'P-005118'],
    poiIds: [],
    witnessIds: ['P-004822', 'P-002891', 'P-003102'],
    evidenceIds: ['E-004821', 'E-004829'],
    vehicleIds: ['VEH-TXR481'],
    weaponIds: [],
    reportIds: ['R-1998-112', 'R-1989-088'],
    warrantIds: [],
    arrestIds: [],
    incidentIds: ['INC-1998-0914', 'INC-1998-0915'],
    relatedCaseIds: ['CASE-1998-027', 'CASE-1989-114'],
    priority: 'CRITICAL',
    status: 'ACTIVE',
    summary:
      'Official deduction synthesis board for Case 27. Cross-examine the 1998 physical evidence, the 2004 archive alteration, CAD dispatch logs, and corruption linkages to file formal charges.',
    tags: ['FINAL_DEDUCTION', 'SYNTHESIS', 'SPECIAL_MATRIX'],
    createdAt: '2026-09-08 08:00:00',
    updatedAt: '2026-09-08 08:00:00',
    timeline: [
      { id: 't_fd_1', date: '2026-09-08', title: 'Synthesis Active', description: 'Arraignment matrix opened.' }
    ]
  }
];

export const CURATED_INCIDENTS: IncidentRecord[] = [
  {
    id: 'INC-1998-0914',
    type: 'incident',
    title: 'INC-1998-0914: CAD 911 Call #98-4412 - Disturbance on Willow Street',
    incidentNumber: 'INC-1998-0914',
    category: 'Emergency 911 Disturbance',
    date: '1998-09-14',
    time: '22:17',
    location: '42 Willow Street, Northbridge',
    reportingOfficerId: 'OFF-3014',
    linkedCaseId: 'CASE-1998-027',
    linkedPersonIds: ['P-004821', 'P-002891', 'P-004822'],
    linkedVehicleIds: ['VEH-TXR481'],
    linkedEvidenceIds: [],
    narrative:
      'CAD Call #98-4412 logged at 22:17:30. Reporting party Martha Gable (40 Willow St) called 911 to report loud screeching tires, aggressive engine revving, and slamming doors in the driveway alley between 40 and 42 Willow St. Unit 304 (Det. Daniel Hayes) acknowledged dispatch at 22:21 while in transit on Commercial Way.',
    status: 'CLOSED_LINKED_TO_CASE',
    tags: ['911_CALL', 'CAD_DISPATCH', 'WILLOW_ST', 'CRITICAL_TIMELINE'],
    createdAt: '1998-09-14 22:17:30',
    updatedAt: '1998-09-15 08:00:00'
  },
  {
    id: 'INC-1998-0915',
    type: 'incident',
    title: 'INC-1998-0915: CAD Radio Transmission - Unit 304 Canal Road Sighting',
    incidentNumber: 'INC-1998-0915',
    category: 'Field Officer Radio Transmission',
    date: '1998-09-14',
    time: '22:41',
    location: 'Willow Street / Canal Road Frontage',
    reportingOfficerId: 'OFF-3014',
    linkedCaseId: 'CASE-1998-027',
    linkedPersonIds: ['P-004821'],
    linkedVehicleIds: ['VEH-TXR481'],
    linkedEvidenceIds: ['E-004821'],
    narrative:
      'Radio dispatch burst from Unit 304 (Hayes) at 22:41:22. Hayes reported clearing 42 Willow Street and claimed he observed a dark mid-sized sedan turning onto Canal Road frontage. Security gate logs at Central Station show HayesCaprice entering rear garage at 22:52.',
    status: 'CLOSED_LINKED_TO_CASE',
    tags: ['CAD_RADIO', 'HAYES', 'CANAL_ROAD', 'UNIT_304'],
    createdAt: '1998-09-14 22:41:22',
    updatedAt: '1998-09-15 08:00:00'
  },
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
    collectionDate: '1998-10-02',
    collectionTime: '15:45:00',
    collectionLocation: 'Glove box of Ford Taurus TXR-481, Canal Road culvert',
    storageLocation: 'Evidence Vault B, Shelf 04, Box 27-A',
    submittedBy: 'Det. Daniel Hayes (#3014)',
    status: 'IN_STORAGE',
    currentStatus: 'IN_STORAGE',
    laboratoryStatus: 'COMPLETED',
    tags: ['CRITICAL_EVIDENCE', 'MICRO_CASSETTE', 'KEY_FOB', 'TIMING_DISCREPANCY', 'AUDIO'],
    createdAt: '1998-10-02 16:30:00',
    updatedAt: '2026-09-08 01:40:00',
    discrepancyFlag: 'Chain-of-Custody timestamp inversion: Intake transfer logged at 14:10 before field collection at 15:45.',
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
    forensicReports: [
      {
        id: 'FR-AUDIO-98-027',
        type: 'AUDIO',
        title: 'Magnetic Audio Tape Analysis & Acoustic Enhancement',
        laboratory: 'NJ State Police Forensic Multimedia Unit',
        technician: 'R. Chen (Audio Specialist #882)',
        submissionDate: '1998-10-05',
        completionDate: '1998-10-11',
        status: 'COMPLETED',
        confidenceRating: 'High Audio Fidelity (Bandpass filtered 300Hz-3.4kHz)',
        comparisonTarget: 'Anna Bell voice exemplar (1997 high school video interview)',
        findings:
          'Voice identified as Anna Bell with high acoustic probability (>95%). Background environmental signature confirms diesel tractor engine and Erie Lackawanna freight rail crossing bell pattern identical to Northbridge rail junction.',
        notes: 'Magnetic tape shows signs of manual rewind prior to vehicle abandonment.',
        details: {
          tapeFormat: 'Microcassette standard 1.2cm/s',
          duration: '4 minutes 12 seconds',
          backgroundDb: '-24dB ambient industrial idle'
        }
      }
    ],
    photos: [
      {
        id: 'PH-98-027-01',
        photoNumber: 'PHOTO-98-027-A01',
        caption: 'Micro-cassette and leather key fob as discovered inside vehicle glove box.',
        timestamp: '1998-10-02 15:48:00',
        photographer: 'Officer T. Vance (Crime Scene Tech)',
        location: 'Canal Road culvert, Northbridge',
        azimuth: 'Interior glove compartment facing passenger dash',
        svgData: `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" class="w-full h-full bg-slate-900"><rect width="400" height="240" fill="#0f172a"/><rect x="40" y="40" width="320" height="160" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/><rect x="80" y="70" width="130" height="85" rx="4" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/><circle cx="115" cy="112" r="14" fill="#0f172a" stroke="#64748b" stroke-width="2"/><circle cx="175" cy="112" r="14" fill="#0f172a" stroke="#64748b" stroke-width="2"/><rect x="133" y="104" width="24" height="16" fill="#1e293b"/><text x="145" y="90" font-family="monospace" font-size="7" fill="#f8fafc" text-anchor="middle">SEPT AUDIT - A. BELL</text><path d="M260 90 L295 110 L275 145 L240 125 Z" fill="#292524" stroke="#d97706" stroke-width="2"/><circle cx="280" cy="100" r="10" fill="none" stroke="#f59e0b" stroke-width="2"/><rect x="290" y="102" width="40" height="8" fill="#d97706"/><rect x="20" y="205" width="360" height="24" fill="#020617" opacity="0.8"/><text x="28" y="221" font-family="monospace" font-size="9" fill="#38bdf8">EVID # E-004821 // CRIME SCENE TECH T. VANCE // 10-02-1998</text></svg>`
      }
    ],
    relatedPersonIds: ['P-004821', 'P-006219'],
    relatedVehicleId: 'VEH-TXR481',
    relatedVehicleIds: ['VEH-1987-0481'],
    relatedCaseIds: ['CASE-1998-027'],
    relatedReportIds: ['R-1998-112', 'R-1998-118']
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
    collectionDate: '1998-09-16',
    collectionTime: '10:15:00',
    collectionLocation: 'Desk drawer in Anna Bell office, 42 Willow Street second floor study',
    storageLocation: 'Vault B, Shelf 04, Box 27-A',
    submittedBy: 'Det. Daniel Hayes',
    status: 'IN_STORAGE',
    currentStatus: 'IN_STORAGE',
    laboratoryStatus: 'COMPLETED',
    tags: ['DOCUMENTS', 'AUDIT', 'BELL_ELECTRONICS', 'HANDWRITING'],
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
      },
      {
        id: 'cust_b2',
        timestamp: '1998-09-17 14:00:00',
        action: 'Submitted to Document Examination',
        fromOfficerOrLocation: 'Det. Hayes',
        toOfficerOrLocation: 'State Forensic Questioned Documents Unit',
        reason: 'Handwriting comparison against known samples'
      }
    ],
    forensicReports: [
      {
        id: 'FR-DOC-98-022',
        type: 'DOCUMENT',
        title: 'Forensic Document & Handwriting Analysis',
        laboratory: 'State Crime Lab Questioned Documents Unit',
        technician: 'E. Kowalski (Forensic Document Examiner)',
        submissionDate: '1998-09-17',
        completionDate: '1998-09-24',
        status: 'COMPLETED',
        confidenceRating: 'Definite Match (Standard Exemplar Comparison)',
        comparisonTarget: 'Anna Bell school notebook & corporate signature card',
        findings:
          'Audit notes on pages 12, 17, and 33 positively identified as handwriting of Anna Bell. Carbon shipping slips stamped "Crownline Freight - B-Dock" bear forged receiving initials "J.B." not matching any registered Bell Electronics employee.',
        notes: 'Indented writing impressions on page 34 reveal a phone number: 555-0194 (Crownline dispatcher line).'
      }
    ],
    photos: [
      {
        id: 'PH-98-027-02',
        photoNumber: 'PHOTO-98-027-B04',
        caption: 'Open page 17 of Manila Ledger showing diverted freight lot codes.',
        timestamp: '1998-09-16 11:20:00',
        photographer: 'Det. Daniel Hayes',
        location: '42 Willow Street, study desk',
        svgData: `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" class="w-full h-full bg-slate-900"><rect width="400" height="240" fill="#18181b"/><rect x="60" y="30" width="280" height="180" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/><line x1="80" y1="60" x2="320" y2="60" stroke="#d97706" stroke-width="1.5"/><line x1="80" y1="90" x2="320" y2="90" stroke="#fde68a"/><line x1="80" y1="120" x2="320" y2="120" stroke="#fde68a"/><line x1="80" y1="150" x2="320" y2="150" stroke="#fde68a"/><text x="85" y="52" font-family="monospace" font-size="9" font-weight="bold" fill="#78350f">Q3 AUDIT: CROWNLINE MANIFEST #98-442</text><text x="85" y="82" font-family="monospace" font-size="8" fill="#92400e">Item 419: Missing 12 crates microcontrollers</text><text x="85" y="112" font-family="monospace" font-size="8" fill="#dc2626">DISCREPANCY: Signed off by off-duty unit #104</text><text x="85" y="142" font-family="monospace" font-size="8" fill="#92400e">Destination: Bayonne Warehouse Pier 4</text></svg>`
      }
    ],
    relatedPersonIds: ['P-004821', 'P-005102'],
    relatedCaseIds: ['CASE-1998-027'],
    relatedReportIds: ['R-1998-112']
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
    collectionDate: '1998-10-02',
    collectionTime: '16:10:00',
    collectionLocation: 'Driver side floorboard, Ford Taurus TXR-481',
    storageLocation: 'Narcotics & Hazardous Chemical Locker 08',
    submittedBy: 'Det. Hayes',
    status: 'IN_STORAGE',
    currentStatus: 'IN_STORAGE',
    laboratoryStatus: 'COMPLETED',
    tags: ['CHEMICAL_RESIDUE', 'VEHICLE_INTERIOR', 'PACKAGING', 'NARCOTICS'],
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
      },
      {
        id: 'cust_c2',
        timestamp: '1998-10-03 11:00:00',
        action: 'Sent to County Toxicology Lab',
        fromOfficerOrLocation: 'Det. Hayes',
        toOfficerOrLocation: 'Dr. M. Sorkin',
        reason: 'Chemical analysis of surface residue'
      }
    ],
    labAnalysis: {
      laboratory: 'County Toxicology & Narcotics Laboratory',
      analysisDate: '1998-10-18',
      technician: 'Dr. M. Sorkin',
      results:
        'Residue positive for trace industrial solvents and precursor chemicals consistent with synthetic pharmaceutical packaging.'
    },
    forensicReports: [
      {
        id: 'FR-CHEM-98-004',
        type: 'CHEMICAL',
        title: 'Chromatography & Mass Spectrometry Analysis',
        laboratory: 'County Toxicology & Narcotics Laboratory',
        technician: 'Dr. M. Sorkin (Chief Toxicologist)',
        submissionDate: '1998-10-03',
        completionDate: '1998-10-18',
        status: 'COMPLETED',
        confidenceRating: 'Gas Chromatography-Mass Spec: 99.1% Confidence',
        findings:
          'Sample surface positive for chemical residue containing methyl ethyl ketone and industrial grade plasticizer. Matching chemical profile to packaging recovered in 1996 Port Authority seizure at Crownline Bayonne terminal.',
        notes: 'The presence of solvent residue suggests item was handled in an industrial chemical transit zone shortly prior to entering vehicle.'
      }
    ],
    relatedPersonIds: ['P-004821', 'P-006219'],
    relatedVehicleId: 'VEH-TXR481',
    relatedCaseIds: ['CASE-1998-027']
  },
  {
    id: 'E-004824',
    type: 'evidence',
    title: 'Evidence E-004824: Latent Fingerprint Lift from Driver Exterior Door Handle',
    evidenceId: 'E-004824',
    caseId: 'CASE-1998-027',
    evidenceType: 'Fingerprint Latent',
    description:
      'Latent fingerprint lift lifted using black magnetic powder on transparent acetate backing tape from exterior chrome door handle of Ford Taurus TXR-481.',
    collectedByOfficerId: 'OFF-3014',
    collectionDate: '1998-10-02',
    collectionTime: '17:30:00',
    collectionLocation: 'Exterior driver door handle, Impound Lot 2',
    storageLocation: 'Latent Print Card Cabinet, Drawer 3, Case 27',
    submittedBy: 'Det. Daniel Hayes',
    status: 'EXAMINED',
    currentStatus: 'EXAMINED',
    laboratoryStatus: 'COMPLETED',
    tags: ['LATENT_PRINT', 'DOOR_HANDLE', 'VEHICLE', 'FINGERPRINT'],
    createdAt: '1998-10-02 18:00:00',
    updatedAt: '2026-09-08 02:10:00',
    discrepancyFlag: 'Secondary contributor print comparison was intentionally suppressed and marked "INSUFFICIENT" in 1998, but 2026 digital AFIS re-scan identified 14 minutiae points matching Officer Daniel Hayes.',
    chainOfCustody: [
      {
        id: 'cust_lp1',
        timestamp: '1998-10-02 17:30:00',
        action: 'Lifted from vehicle',
        fromOfficerOrLocation: 'Impound Bay 14',
        toOfficerOrLocation: 'Det. Daniel Hayes',
        reason: 'Crime scene fingerprint processing'
      },
      {
        id: 'cust_lp2',
        timestamp: '1998-10-04 10:00:00',
        action: 'Delivered to Latent Print Examiner',
        fromOfficerOrLocation: 'Det. Hayes',
        toOfficerOrLocation: 'Examiner L. Wright',
        reason: 'Comparison against Anna Bell exemplars'
      },
      {
        id: 'cust_lp3',
        timestamp: '2026-09-08 02:00:00',
        action: 'Automated AFIS Re-Scan & Audit',
        fromOfficerOrLocation: 'Evidence Archive',
        toOfficerOrLocation: 'PRIS Cold Case Audit System',
        reason: 'Routine digital cold-case re-indexing'
      }
    ],
    forensicReports: [
      {
        id: 'FR-FP-98-012',
        type: 'FINGERPRINT',
        title: 'Latent Print Comparison: Anna Bell vs External Contributor',
        laboratory: 'Metropolitan Police Identification Bureau',
        technician: 'L. Wright (Senior Fingerprint Specialist)',
        submissionDate: '1998-10-04',
        completionDate: '1998-10-09',
        status: 'COMPLETED',
        confidenceRating: '1998: Inconclusive // 2026 Re-Analysis: 14 Minutiae Points POSITIVE',
        comparisonTarget: 'Exemplar 10-print cards: Anna Bell & Det. Daniel Hayes (#3014)',
        findings:
          '1998 initial filing: "Partial right thumbprint consistent with victim Anna Bell. Smudged secondary print deemed insufficient quality for classification."\n2026 AFIS Digital Enhancement: Secondary latent print resolved at 1200 DPI. 14 minutiae points match right index finger of Detective Daniel Hayes (#3014) on exterior door lever, oriented as someone forcing the door open from outside.',
        notes: 'Contradicts Det. Hayes statement that he never touched the vehicle exterior prior to scene photographer arrival.'
      }
    ],
    photos: [
      {
        id: 'PH-98-027-04',
        photoNumber: 'PHOTO-98-027-F14',
        caption: '1200 DPI AFIS macro scan of latent print showing ridge minutiae overlay.',
        timestamp: '1998-10-04 10:15:00',
        photographer: 'L. Wright',
        location: 'Identification Bureau Darkroom',
        svgData: `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" class="w-full h-full bg-slate-950"><rect width="400" height="240" fill="#030712"/><circle cx="200" cy="120" r="90" fill="none" stroke="#22c55e" stroke-width="1" stroke-dasharray="3 3"/><path d="M160 120 C160 80 240 80 240 120 C240 150 170 160 170 130" fill="none" stroke="#e2e8f0" stroke-width="2.5"/><path d="M150 125 C150 70 250 70 250 125 C250 165 160 175 160 135" fill="none" stroke="#e2e8f0" stroke-width="2.5"/><path d="M140 130 C140 60 260 60 260 130 C260 180 150 190 150 140" fill="none" stroke="#e2e8f0" stroke-width="2.5"/><circle cx="185" cy="105" r="4" fill="#ef4444"/><circle cx="215" cy="115" r="4" fill="#ef4444"/><circle cx="195" cy="140" r="4" fill="#ef4444"/><line x1="185" y1="105" x2="220" y2="60" stroke="#ef4444" stroke-width="1"/><text x="225" y="60" font-family="monospace" font-size="8" fill="#f87171">MINUTIAE #07: BIFURCATION</text><text x="30" y="30" font-family="monospace" font-size="9" fill="#22c55e">AFIS MATCH CONFIDENCE: 98.4% // SUBJECT: HAYES, D. (#3014)</text></svg>`
      }
    ],
    relatedPersonIds: ['P-004821', 'P-006219', 'OFF-3014'],
    relatedVehicleId: 'VEH-TXR481',
    relatedCaseIds: ['CASE-1998-027']
  },
  {
    id: 'E-004825',
    type: 'evidence',
    title: 'Evidence E-004825: 35mm Crime Scene Photographic Negatives & Contact Sheet',
    evidenceId: 'E-004825',
    caseId: 'CASE-1998-027',
    evidenceType: 'Photograph / Photographic Film',
    description:
      'Two strips of Kodak T-Max 400 black-and-white 35mm film negatives and one 8x10 contact sheet depicting the culvert embankment, vehicle resting angle, and tire impressions on Canal Road.',
    collectedByOfficerId: 'OFF-3014',
    collectionDate: '1998-10-02',
    collectionTime: '15:20:00',
    collectionLocation: 'Canal Road culvert 200 yards south of Milepost 14',
    storageLocation: 'Vault B, Shelf 04, Box 27-C',
    submittedBy: 'Officer T. Vance',
    status: 'IN_STORAGE',
    currentStatus: 'IN_STORAGE',
    laboratoryStatus: 'COMPLETED',
    tags: ['PHOTOGRAPHY', 'CRIME_SCENE', 'CULVERT', 'TIRE_TRACKS'],
    createdAt: '1998-10-02 17:00:00',
    updatedAt: '2026-09-08 01:00:00',
    chainOfCustody: [
      {
        id: 'cust_ph1',
        timestamp: '1998-10-02 15:20:00',
        action: 'Exposed at Scene',
        fromOfficerOrLocation: 'Canal Rd Culvert',
        toOfficerOrLocation: 'Officer T. Vance',
        reason: 'Scene documentation'
      },
      {
        id: 'cust_ph2',
        timestamp: '1998-10-02 19:00:00',
        action: 'Developed in Police Darkroom',
        fromOfficerOrLocation: 'Officer T. Vance',
        toOfficerOrLocation: 'Central Evidence Locker',
        reason: 'Negative preservation'
      }
    ],
    photos: [
      {
        id: 'PH-98-027-05',
        photoNumber: 'PHOTO-98-027-C01',
        caption: 'Ford Taurus resting in water culvert; front bumper submerged 14 inches.',
        timestamp: '1998-10-02 15:25:00',
        photographer: 'Officer T. Vance',
        location: 'Canal Road, 200 yds south of MP 14',
        azimuth: 'South-facing wide angle perspective',
        svgData: `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" class="w-full h-full bg-slate-900"><rect width="400" height="240" fill="#090d16"/><polygon points="0,180 400,160 400,240 0,240" fill="#1c1917"/><polygon points="0,200 400,185 400,240 0,240" fill="#0c4a6e" opacity="0.7"/><rect x="140" y="125" width="130" height="50" rx="6" fill="#1e3a8a" stroke="#60a5fa" stroke-width="1.5" transform="rotate(7 140 125)"/><circle cx="170" cy="180" r="16" fill="#020617"/><circle cx="260" cy="185" r="16" fill="#020617"/><line x1="20" y1="130" x2="140" y2="140" stroke="#78350f" stroke-width="5" stroke-dasharray="10 6"/><line x1="20" y1="145" x2="140" y2="155" stroke="#78350f" stroke-width="5" stroke-dasharray="10 6"/><text x="20" y="30" font-family="monospace" font-size="9" fill="#94a3b8">FRAME 18 // TIRE ACCELERATION TRACKS RUN IN REVERSE DIRECTION</text></svg>`
      }
    ],
    relatedPersonIds: ['OFF-3014', 'P-004821'],
    relatedVehicleId: 'VEH-TXR481',
    relatedCaseIds: ['CASE-1998-027'],
    relatedLocationIds: ['LOC-WILLOW42']
  },
  {
    id: 'E-004826',
    type: 'evidence',
    title: 'Evidence E-004826: Police Dispatch Radio Cassette & CAD Log Transcript',
    evidenceId: 'E-004826',
    caseId: 'CASE-1998-027',
    evidenceType: 'Audio / Dispatch Recording',
    description:
      'Standard magnetic audio reel recording channel 2 dispatch traffic for the Northbridge precinct between 22:00 and 23:30 on September 14, 1998. Accompanied by official CAD computer printout.',
    collectedByOfficerId: 'OFF-1002',
    collectionDate: '1998-09-17',
    collectionTime: '08:00:00',
    collectionLocation: 'Northbridge Communications Center, Dispatch Terminal 3',
    storageLocation: 'Communications Vault, Audio Rack 02',
    submittedBy: 'Communications Supervisor G. Bailey',
    status: 'IN_STORAGE',
    currentStatus: 'IN_STORAGE',
    laboratoryStatus: 'COMPLETED',
    tags: ['AUDIO', 'DISPATCH', 'CAD_LOG', 'TIMELINE_CONTRADICTION'],
    createdAt: '1998-09-17 09:00:00',
    updatedAt: '2026-09-08 01:15:00',
    discrepancyFlag: 'CAD log records Unit 104 (Det. Hayes) calling in a 10-38 traffic stop at 22:38 on Willow Street, but incident was manually deleted from shift summary at 04:15 AM.',
    chainOfCustody: [
      {
        id: 'cust_cad1',
        timestamp: '1998-09-17 08:00:00',
        action: 'Master Reel Archiving',
        fromOfficerOrLocation: 'Dispatch Reel Deck A',
        toOfficerOrLocation: 'Supervisor G. Bailey',
        reason: 'Standard 72-hour case retention'
      }
    ],
    forensicReports: [
      {
        id: 'FR-CAD-98-001',
        type: 'AUDIO',
        title: 'Dispatch Channel 2 Transmission Decryption & Timestamp Audit',
        laboratory: 'Internal Affairs Technology Division',
        technician: 'Investigator K. Novak',
        submissionDate: '2026-09-08',
        status: 'COMPLETED',
        confidenceRating: 'Bitstream Verified 100%',
        findings:
          'Audio at 22:38:14 EST: Unit 104 announces: "Control, show me out on Willow with a dark Ford sedan, New Jersey TXR-481." Radio transmission was cut short after 6 seconds. No follow-up status check was initiated by dispatch.',
        notes: 'Corroborates Mrs. Gable witness report seeing flashing lightbar outside 42 Willow at 22:40.'
      }
    ],
    relatedPersonIds: ['P-004821', 'OFF-3014'],
    relatedCaseIds: ['CASE-1998-027'],
    relatedReportIds: ['R-1998-112']
  },
  {
    id: 'E-004827',
    type: 'evidence',
    title: 'Evidence E-004827: Blue Coated Nylon Fabric Scrap with Blood Trace',
    evidenceId: 'E-004827',
    caseId: 'CASE-1998-027',
    evidenceType: 'Biological / Trace Fiber',
    description:
      'Triangular torn swatch of dark navy nylon fabric (approx. 2in x 1.5in) snagged on rusted barbed wire fence near the Canal Road drainage outflow. Bears faint brown stain tested presumptive positive for blood.',
    collectedByOfficerId: 'OFF-3014',
    collectionDate: '1998-10-03',
    collectionTime: '09:15:00',
    collectionLocation: 'Chain-link fence perimeter, Canal Road drainage ditch',
    storageLocation: 'Biological Cold Vault - Freezer 2',
    submittedBy: 'Det. Daniel Hayes',
    status: 'IN_STORAGE',
    currentStatus: 'IN_STORAGE',
    laboratoryStatus: 'COMPLETED',
    tags: ['BIOLOGICAL', 'BLOOD', 'DNA', 'FABRIC', 'CRITICAL_EVIDENCE'],
    createdAt: '1998-10-03 10:30:00',
    updatedAt: '2026-09-08 02:20:00',
    chainOfCustody: [
      {
        id: 'cust_fab1',
        timestamp: '1998-10-03 09:15:00',
        action: 'Collected at Scene',
        fromOfficerOrLocation: 'Canal Road Fence',
        toOfficerOrLocation: 'Det. Hayes',
        reason: 'Potential victim clothing trace'
      },
      {
        id: 'cust_fab2',
        timestamp: '1998-10-04 14:00:00',
        action: 'Submitted for Serology & DNA extraction',
        fromOfficerOrLocation: 'Det. Hayes',
        toOfficerOrLocation: 'State Forensic DNA Lab',
        reason: 'PCR STR Profile comparison'
      }
    ],
    forensicReports: [
      {
        id: 'FR-DNA-98-009',
        type: 'DNA',
        title: 'Nuclear DNA STR Typing Report: Item E-004827',
        laboratory: 'New Jersey State Police Forensic Serology & DNA Unit',
        technician: 'Dr. Sarah Patel (Forensic Biologist)',
        submissionDate: '1998-10-04',
        completionDate: '1998-10-22',
        status: 'COMPLETED',
        confidenceRating: '13 CODIS Core Loci Match: 1 in 4.2 Billion',
        comparisonTarget: 'Anna Bell Buccal Swab Exemplar (P-004821)',
        findings:
          'Complete female DNA profile obtained from bloodstain on nylon scrap. Profile matches reference sample of Anna Bell at all 13 tested STR loci. Fabric composition matches London Fog nylon trench coat reported missing from victim wardrobe.',
        notes: 'Indicates physical struggle or passage through the Canal Road fence perimeter.'
      }
    ],
    relatedPersonIds: ['P-004821'],
    relatedCaseIds: ['CASE-1998-027'],
    relatedLocationIds: ['LOC-WILLOW42']
  },
  {
    id: 'E-004829',
    type: 'evidence',
    title: 'Evidence E-004829: Recovered Canal Storage Unit #44 Ledger & Key',
    evidenceId: 'E-004829',
    caseId: 'CASE-1998-027',
    evidenceType: 'Documentary / Personal Effects',
    description:
      'Brass Master Lock key #44 and spiral stenographer notepad recovered from Canal Self-Storage Unit 44. Notepad contains handwritten notes by Anna Bell listing Crownline truck registrations, night driver Daniel Mercer, and off-duty police cruiser escort calls.',
    collectedByOfficerId: 'OFF-3014',
    collectionDate: '1998-10-15',
    collectionTime: '14:00:00',
    collectionLocation: 'Canal Self-Storage, Unit 44, Northbridge',
    storageLocation: 'Vault B, Shelf 04, Box 27-B',
    submittedBy: 'Det. Daniel Hayes',
    status: 'IN_STORAGE',
    currentStatus: 'IN_STORAGE',
    laboratoryStatus: 'COMPLETED',
    tags: ['CRITICAL_EVIDENCE', 'STORAGE_LOCKER', 'NOTEBOOK', 'CROWNLINE_LEDGER'],
    createdAt: '1998-10-15 15:30:00',
    updatedAt: '2004-06-03 14:45:00',
    chainOfCustody: [
      {
        id: 'cust_e29_1',
        timestamp: '1998-10-15 14:00:00',
        action: 'Recovered from Storage Locker',
        fromOfficerOrLocation: 'Canal Storage Unit 44',
        toOfficerOrLocation: 'Det. Daniel Hayes',
        reason: 'Execution of consent search from next-of-kin'
      }
    ],
    forensicReports: [
      {
        id: 'FR-DOC-98-033',
        type: 'DOCUMENT',
        title: 'Spiral Notepad Content Transcription & Latent Indentation',
        laboratory: 'State Questioned Documents Lab',
        technician: 'E. Kowalski',
        submissionDate: '1998-10-16',
        completionDate: '1998-10-25',
        status: 'COMPLETED',
        confidenceRating: 'Handwriting Confirmed (Anna Bell)',
        findings:
          'Notebook lists 14 Crownline Freight shipping manifests spanning May-September 1998. Explicit entry dated Sept 12: "Det. Hayes warned Michael not to contact state auditors. Said Northbridge PD controls the corridor."',
        notes: 'Proves Anna Bell had discovered the corrupt police protection racket prior to disappearance.'
      }
    ],
    photos: [
      {
        id: 'PH-98-027-06',
        photoNumber: 'PHOTO-98-027-L44',
        caption: 'Canal Storage Unit 44 interior showing metal shelf and stenographer notepad.',
        timestamp: '1998-10-15 14:10:00',
        photographer: 'Officer T. Vance',
        location: 'Canal Self-Storage Unit 44',
        svgData: `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" class="w-full h-full bg-slate-900"><rect width="400" height="240" fill="#18181b"/><rect x="80" y="30" width="240" height="180" fill="#27272a" stroke="#52525b" stroke-width="2"/><line x1="80" y1="90" x2="320" y2="90" stroke="#71717a" stroke-width="3"/><line x1="80" y1="150" x2="320" y2="150" stroke="#71717a" stroke-width="3"/><rect x="120" y="55" width="40" height="30" fill="#e4e4e7" stroke="#3f3f46"/><rect x="180" y="45" width="55" height="40" fill="#fef08a" stroke="#ca8a04"/><text x="185" y="70" font-family="monospace" font-size="7" fill="#713f12">UNIT #44 PAD</text><circle cx="270" cy="70" r="8" fill="#eab308" stroke="#a16207"/><text x="30" y="225" font-family="monospace" font-size="9" fill="#e4e4e7">STORAGE UNIT 44 // SEIZED 10-15-1998</text></svg>`
      }
    ],
    relatedPersonIds: ['P-004821', 'P-004822', 'P-005118', 'P-006219'],
    relatedCaseIds: ['CASE-1998-027']
  },
  {
    id: 'E-004830',
    type: 'evidence',
    title: 'Evidence E-004830: QIC-80 Magnetic Tape Cartridge labeled "Audit Backup"',
    evidenceId: 'E-004830',
    caseId: 'CASE-1998-027',
    evidenceType: 'Digital Storage Media',
    description:
      '3M brand QIC-80 mini data cartridge (250MB capacity) recovered from Anna Bell personal computer drive at 42 Willow Street. Contains system backups and Lotus 1-2-3 spreadsheets.',
    collectedByOfficerId: 'OFF-3014',
    collectionDate: '1998-09-16',
    collectionTime: '11:45:00',
    collectionLocation: 'Study, 42 Willow Street',
    storageLocation: 'Digital Evidence Vault, Media Bin 03',
    submittedBy: 'Det. Hayes',
    status: 'IN_STORAGE',
    currentStatus: 'IN_STORAGE',
    laboratoryStatus: 'COMPLETED',
    tags: ['DIGITAL_EVIDENCE', 'TAPE_BACKUP', 'LOTUS_123', 'FINANCIAL'],
    createdAt: '1998-09-16 12:30:00',
    updatedAt: '2026-09-08 01:25:00',
    chainOfCustody: [
      {
        id: 'cust_dig1',
        timestamp: '1998-09-16 11:45:00',
        action: 'Seized during Search',
        fromOfficerOrLocation: '42 Willow St Study',
        toOfficerOrLocation: 'Det. Hayes',
        reason: 'Computer hardware processing'
      },
      {
        id: 'cust_dig2',
        timestamp: '2026-09-08 01:20:00',
        action: 'Cold Case Digital Bitstream Recovery',
        fromOfficerOrLocation: 'Media Bin 03',
        toOfficerOrLocation: 'Cyber & Digital Forensics Unit',
        reason: 'Restoration of corrupted spreadsheet records'
      }
    ],
    forensicReports: [
      {
        id: 'FR-DIG-26-003',
        type: 'DIGITAL',
        title: 'QIC-80 Data Tape Forensic Bitstream Extraction',
        laboratory: 'State Cyber Forensics Division',
        technician: 'Agent M. Lindqvist',
        submissionDate: '2026-09-08',
        completionDate: '2026-09-08',
        status: 'COMPLETED',
        confidenceRating: 'SHA-256 Hash Verified',
        findings:
          '18 deleted Lotus 1-2-3 spreadsheets carved from unallocated tape sectors. Files reveal $240,000 in diverted inventory marked "Paid to Shield Escort Accounts" with bank account routing numbers traced to a shell entity registered to Daniel Hayes.',
        notes: 'Provides irrefutable financial motive for the silencing of Anna Bell.'
      }
    ],
    relatedPersonIds: ['P-004821', 'OFF-3014'],
    relatedCaseIds: ['CASE-1998-027']
  }
];

export const CURATED_VEHICLES: VehicleRecord[] = [
  {
    id: 'VEH-1987-0481',
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
      { date: '1998-05-18', violation: 'No Parking 2AM-6AM Street Cleaning', location: 'Willow Street' }
    ],
    accidents: [],
    caseIds: ['CASE-1998-027'],
    status: 'IMPOUNDED',
    tags: ['VICTIM_VEHICLE', 'ABANDONED', 'CASE_27'],
    createdAt: '1998-09-15 08:30:00',
    updatedAt: '1998-10-03 10:00:00'
  },
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

==================================================
ARCHIVE AUDIT DISCREPANCY RECORD
AUDIT ID: AUD-2026-09-08-0042
LAST MODIFIED: June 3, 2004 — 14:22:08
MODIFIED BY: RECORDS ADMINISTRATION [TERMINAL ADM-04]
OVERRIDE AUTH: SUPERVISORY BYPASS [TOKEN: SEC-VANCE-89]
CHANGE: ATTACHMENT INDEX UPDATED
ATTACHED EXHIBIT: ATT-1989-114A -> STATUS: NOT FOUND
==================================================

SUBJECT: Initial Investigation into the Disappearance of Anna Claire Bell (Age: 17, DOB: 04/18/1981)

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
    tags: ['REPORT', 'INITIAL', 'HAYES', 'CASE_27', 'ARCHIVE_ALTERED'],
    createdAt: '1998-09-15 14:30:00',
    updatedAt: '2004-06-03 14:22:08'
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
  },
  {
    id: 'R-1989-088',
    type: 'report',
    title: 'Report #R-1989-088: Internal Affairs Preliminary Inquiry - Freight Security Details',
    reportNumber: 'R-1989-088',
    caseId: 'CASE-1989-114',
    authorOfficerId: 'OFF-1012',
    authorRank: 'Captain',
    authorName: 'Arthur Vance',
    date: '1989-07-22',
    time: '09:30',
    location: 'Internal Affairs Division',
    reportType: 'INTERNAL MEMO',
    narrative: `INTERNAL AFFAIRS DIVISION - PRELIMINARY SPECIAL REPORT
FILE REF: IA-1989-114
CASE REF: CASE-1989-114
AUTHOR: Captain Arthur Vance (#1012)
DATE: July 22, 1989

SUBJECT: Investigation of Off-Duty Security Details & Escort Services

1. SCOPE:
Inquiry into allegations that patrol units of the 3rd Precinct were operating unapproved private escort details for commercial tractor trailers operated by Crownline Logistics between the hours of 23:00 and 04:00.

2. FINDINGS:
Interviews conducted with shift supervisors. Vehicle gate logs examined. Administrative records indicate that off-duty presence of officers at Crownline facilities was informal and arranged to deter freight vandalism following the 1987 sensor theft (CASE-1987-014).

3. DISPOSITION:
No evidence of criminal conspiracy or municipal policy breach substantiated. Investigation closed administratively. File sealed pursuant to Municipal Protective Order 89-041. Supervisory sign-off: Capt. A. Vance.`,
    signature: 'Capt. A. Vance #1012',
    relatedPersonIds: ['P-006219'],
    relatedEvidenceIds: [],
    status: 'FILED',
    tags: ['INTERNAL_AFFAIRS', 'SEALED', 'CROWNLINE'],
    createdAt: '1989-07-22 09:30:00',
    updatedAt: '1990-01-18 10:00:00'
  }
];

export const CURATED_LOCATIONS: LocationRecord[] = [
  {
    id: 'LOC-0042',
    type: 'location',
    title: '42 Willow Street, Northbridge',
    address: '42 Willow Street',
    district: 'Northbridge 3rd Ward (Historic District)',
    locationType: 'RESIDENTIAL',
    knownOccupantNames: ['Anna Claire Bell'],
    knownBusinessNames: [],
    incidentIds: ['INC-1998-0914', 'INC-1998-1142'],
    caseIds: ['CASE-1998-027'],
    status: 'ACTIVE_RECORD',
    tags: ['CRIME_SCENE', 'RESIDENCE', 'CASE_27'],
    createdAt: '1998-09-15 08:00:00',
    updatedAt: '2026-09-08 01:00:00'
  },
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
    id: 'ORG-0012',
    type: 'organization',
    title: 'Crownline Logistics Corporation',
    orgName: 'Crownline Logistics Corporation',
    registrationNumber: 'CORP-NJ-1982-8812',
    orgType: 'CORPORATION',
    headquartersAddress: '210 Industrial Parkway, Northbridge, NJ',
    phone: '(555) 491-0000',
    executives: ['Captain Arthur Vance (Board Director - Former)', 'Victor Vance (Operations Lead)'],
    employeePersonIds: ['P-006219', 'P-002891', 'P-005118'],
    associatedCaseIds: ['CASE-1987-014', 'CASE-1989-114', 'CASE-1998-027'],
    complaints: [
      { date: '1987-03-10', summary: 'Reported commercial burglary of sensor pallets.' },
      { date: '1998-08-20', summary: 'Municipal noise complaint regarding unregistered overnight diesel tractor trailers.' }
    ],
    status: 'ACTIVE_BUSINESS',
    tags: ['LOGISTICS', 'SUSPECT_ORGANIZATION'],
    createdAt: '1982-06-11 00:00:00',
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
