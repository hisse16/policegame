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
  Relationship,
  CrimeCategory,
  CaseStatus,
  PriorityLevel
} from '../../types/police';

// Deterministic Pseudo-Random Number Generator (PRNG)
class SeededRandom {
  private s: number;
  constructor(seed = 4229) {
    this.s = seed % 2147483647;
    if (this.s <= 0) this.s += 2147483646;
  }
  public next(): number {
    this.s = (this.s * 16807) % 2147483647;
    return (this.s - 1) / 2147483646;
  }
  public pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
  public int(min: number, max: number): number {
    return Math.floor(min + this.next() * (max - min + 1));
  }
}

const FIRST_NAMES_M = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
  'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
  'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan',
  'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
  'Frank', 'Benjamin', 'Gregory', 'Samuel', 'Raymond', 'Patrick', 'Alexander', 'Jack', 'Dennis', 'Jerry'
];

const FIRST_NAMES_F = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
  'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
  'Carol', 'Amanda', 'Dorothy', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia',
  'Kathleen', 'Amy', 'Angela', 'Shirley', 'Anna', 'Brenda', 'Pamela', 'Emma', 'Nicole', 'Helen',
  'Samantha', 'Katherine', 'Christine', 'Debra', 'Rachel', 'Carolyn', 'Janet', 'Catherine', 'Maria', 'Heather'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart',
  'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson'
];

const STREET_NAMES = [
  'Willow St', 'Oak Ave', 'Maple Rd', 'Cedar Blvd', 'Pine St', 'Elm St', 'Industrial Pkwy', 'River Rd',
  'Canal Rd', 'Meadow Ln', 'Highland Ave', 'Prospect St', 'Lincoln Ave', 'Washington Blvd', 'Harrison St',
  'Market St', 'Main St', 'Center St', 'Chestnut St', 'Walnut St', 'Franklin Ave', 'Park Ave', 'Dock St'
];

const DISTRICTS = [
  'Northbridge 1st Ward', 'Northbridge 2nd Ward', 'Northbridge 3rd Ward (Historic)',
  'Industrial Rail Corridor', 'Downtown Commercial District', 'Waterfront Marina',
  'Westside Heights', 'Eastside Residential', 'Outer Valley District'
];

const CRIME_CATEGORIES: CrimeCategory[] = [
  'HOMICIDE', 'ROBBERY', 'BURGLARY', 'THEFT', 'ASSAULT', 'NARCOTICS',
  'FRAUD', 'CYBERCRIME', 'ORGANIZED_CRIME', 'WEAPONS', 'MISSING_PERSON',
  'TRAFFIC', 'VANDALISM', 'OTHER'
];

const CASE_STATUSES: CaseStatus[] = [
  'OPEN', 'ACTIVE', 'PENDING', 'SUSPENDED', 'CLOSED', 'SOLVED', 'UNSOLVED', 'COLD CASE', 'ARCHIVED'
];

const VEHICLE_MAKES_MODELS = [
  { make: 'Ford', models: ['Taurus', 'Crown Victoria', 'F-150', 'Escort', 'Explorer'] },
  { make: 'Chevrolet', models: ['Caprice', 'Impala', 'Cavalier', 'Silverado', 'Malibu'] },
  { make: 'Toyota', models: ['Camry', 'Corolla', 'Pickup', 'Celica'] },
  { make: 'Honda', models: ['Civic', 'Accord', 'CR-X', 'Prelude'] },
  { make: 'Dodge', models: ['Caravan', 'Ram 1500', 'Intrepid', 'Shadow'] },
  { make: 'Buick', models: ['LeSabre', 'Regal', 'Century'] },
  { make: 'Pontiac', models: ['Grand Am', 'Grand Prix', 'Sunfire'] }
];

const VEHICLE_COLORS = ['Black', 'White', 'Silver', 'Midnight Blue', 'Maroon', 'Dark Green', 'Gray', 'Tan', 'Gold'];

const ORG_NAMES = [
  'Northbridge Steel & Wire', 'Harborview Medical Center', 'Apex Global Logistics', 'Metro Transit Authority',
  'Westside Chemical Supply', 'Pinnacle Security Solutions', 'Tri-State Auto Parts', 'Sterling Financial Trust',
  'Canal Street Storage Facilities', 'Riverside Cold Storage', 'Vanguard Electronics Laboratory', 'Liberty Marine Transport',
  'Bayside Courier Express', 'Summit Construction Ltd', 'Continental Hauling Services', 'Oakridge Senior Residence'
];

export interface GeneratedDataset {
  officers: OfficerRecord[];
  persons: PersonRecord[];
  cases: CaseRecord[];
  incidents: IncidentRecord[];
  evidence: EvidenceRecord[];
  vehicles: VehicleRecord[];
  reports: ReportRecord[];
  locations: LocationRecord[];
  organizations: OrganizationRecord[];
  warrants: WarrantRecord[];
  arrests: ArrestRecord[];
  relationships: Relationship[];
}

export function generatePoliceDataset(): GeneratedDataset {
  const rng = new SeededRandom(19980914);

  // 1. Generate 110 Officers
  const officers: OfficerRecord[] = [];
  const ranks: OfficerRecord['rank'][] = ['Officer', 'Detective', 'Sergeant', 'Lieutenant', 'Captain'];
  for (let i = 1; i <= 110; i++) {
    const isFemale = rng.next() > 0.65;
    const first = isFemale ? rng.pick(FIRST_NAMES_F) : rng.pick(FIRST_NAMES_M);
    const last = rng.pick(LAST_NAMES);
    const badge = (1000 + i).toString();
    const rank = rng.pick(ranks);
    const id = `OFF-${badge}`;
    const yearStart = rng.int(1982, 2022);
    const isRetired = yearStart < 1995 && rng.next() > 0.4;
    const yearEnd = isRetired ? (yearStart + rng.int(15, 25)).toString() : 'PRESENT';

    officers.push({
      id,
      type: 'officer',
      title: `${rank} ${first} ${last} (#${badge})`,
      badgeNumber: badge,
      name: `${first} ${last}`,
      rank,
      department: rng.pick([
        'Patrol Division',
        'Detective Bureau',
        'Major Crimes & Homicide',
        'Traffic Enforcement',
        'Special Investigations & Vice',
        'Forensic Services Unit',
        'Missing Persons Squad',
        'Cold Case Review Unit'
      ]),
      assignment: `Squad ${rng.int(1, 8)}`,
      employmentDates: `${yearStart} to ${yearEnd}`,
      assignedCaseIds: [],
      authoredReportIds: [],
      status: isRetired ? 'RETIRED' : 'ACTIVE',
      tags: ['OFFICER', rank.toUpperCase(), isRetired ? 'RETIRED' : 'ACTIVE'],
      createdAt: `${yearStart}-01-15 08:00:00`,
      updatedAt: '2026-09-08 00:00:00',
      timeline: [
        { id: `t_${id}_1`, date: `${yearStart}-01-15`, title: 'Appointed Officer', description: 'Sworn in to metropolitan service.' }
      ]
    });
  }

  // 2. Generate 220 Locations
  const locations: LocationRecord[] = [];
  for (let i = 1; i <= 220; i++) {
    const num = rng.int(10, 990);
    const street = rng.pick(STREET_NAMES);
    const district = rng.pick(DISTRICTS);
    const id = `LOC-${i.toString().padStart(4, '0')}`;
    const address = `${num} ${street}`;
    const type = rng.pick(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'PUBLIC', 'MUNICIPAL', 'MEDICAL'] as const);

    locations.push({
      id,
      type: 'location',
      title: `${address}, ${district}`,
      address,
      district,
      locationType: type,
      knownOccupantNames: [],
      knownBusinessNames: type === 'COMMERCIAL' || type === 'INDUSTRIAL' ? [rng.pick(ORG_NAMES)] : [],
      incidentIds: [],
      caseIds: [],
      status: 'ACTIVE_RECORD',
      tags: ['LOCATION', type],
      createdAt: '1985-01-01 00:00:00',
      updatedAt: '2026-09-08 00:00:00'
    });
  }

  // 3. Generate 110 Organizations
  const organizations: OrganizationRecord[] = [];
  for (let i = 1; i <= 110; i++) {
    const name = i < ORG_NAMES.length ? ORG_NAMES[i] : `${rng.pick(LAST_NAMES)} ${rng.pick(['Logistics', 'Motors', 'Enterprises', 'Fabrication', 'Security', 'Holdings', 'Hauling'])}`;
    const id = `ORG-${i.toString().padStart(4, '0')}`;
    const loc = rng.pick(locations);

    organizations.push({
      id,
      type: 'organization',
      title: name,
      orgName: name,
      registrationNumber: `CORP-NJ-${rng.int(1975, 2018)}-${rng.int(1000, 9999)}`,
      orgType: rng.pick(['CORPORATION', 'LLC', 'PARTNERSHIP', 'NON_PROFIT']),
      headquartersAddress: loc.address,
      phone: `(555) ${rng.int(200, 899)}-${rng.int(1000, 9999)}`,
      executives: [`${rng.pick(FIRST_NAMES_M)} ${rng.pick(LAST_NAMES)} (Director)`],
      employeePersonIds: [],
      associatedCaseIds: [],
      complaints: [],
      status: 'ACTIVE_BUSINESS',
      tags: ['ORGANIZATION', 'COMMERCIAL'],
      createdAt: '1985-01-01 00:00:00',
      updatedAt: '2026-09-08 00:00:00'
    });
  }

  // 4. Generate 520 Persons
  const persons: PersonRecord[] = [];
  for (let i = 1; i <= 520; i++) {
    const isFemale = rng.next() > 0.5;
    const first = isFemale ? rng.pick(FIRST_NAMES_F) : rng.pick(FIRST_NAMES_M);
    const last = rng.pick(LAST_NAMES);
    const id = `P-${(i + 10000).toString().padStart(6, '0')}`;
    const birthYear = rng.int(1945, 2004);
    const birthMonth = rng.int(1, 12).toString().padStart(2, '0');
    const birthDay = rng.int(1, 28).toString().padStart(2, '0');
    const dob = `${birthYear}-${birthMonth}-${birthDay}`;
    const address = `${rng.int(12, 890)} ${rng.pick(STREET_NAMES)}, Northbridge, NJ`;
    const hasRecord = rng.next() > 0.72;
    const isMissing = !hasRecord && rng.next() > 0.96;
    const phone = `(555) ${rng.int(210, 790)}-${rng.int(1000, 9999)}`;

    persons.push({
      id,
      type: 'person',
      title: `${first} ${last}`,
      firstName: first,
      lastName: last,
      dob,
      pob: rng.pick(['Northbridge, NJ', 'Newark, NJ', 'Jersey City, NJ', 'Philadelphia, PA', 'New York, NY', 'Trenton, NJ']),
      gender: isFemale ? 'F' : 'M',
      height: `${rng.int(5, 6)}'${rng.int(0, 11)}"`,
      weight: `${rng.int(115, 230)} lbs`,
      hair: rng.pick(['Brown', 'Black', 'Blonde', 'Gray', 'Auburn', 'Red']),
      eyes: rng.pick(['Brown', 'Blue', 'Hazel', 'Green']),
      occupation: rng.pick([
        'Warehouse Worker', 'Mechanic', 'Retail Clerk', 'Electrician', 'Truck Driver', 'Accountant',
        'Nurse', 'Software Technician', 'Security Guard', 'Contractor', 'Sales Associate', 'Teacher'
      ]),
      nationality: 'United States',
      aliases: rng.next() > 0.8 ? [`${first.substring(0, 1)}. ${last}`] : [],
      addresses: [address],
      phones: [phone],
      emails: [`${first.toLowerCase()}.${last.toLowerCase()}@metro-mail.local`],
      employmentHistory: [
        { company: rng.pick(ORG_NAMES), role: 'General Staff', years: `${birthYear + 22}-PRESENT` }
      ],
      driverLicenseId: `DL-NJ-${rng.int(1000000, 9999999)}`,
      riskLevel: hasRecord ? rng.pick(['MEDIUM', 'HIGH']) : 'LOW',
      knownOffenses: hasRecord ? [rng.pick(['Petty Larceny (2001)', 'Disorderly Conduct (2014)', 'Trespassing (2018)', 'Speeding Violation (2020)'])] : [],
      arrestHistory: [],
      convictionHistory: [],
      openCaseIds: [],
      closedCaseIds: [],
      warrantIds: [],
      isMissing,
      missingPersonDetails: isMissing
        ? {
            dateReported: `20${rng.int(10, 24)}-05-12 10:00:00`,
            lastSeenDate: `20${rng.int(10, 24)}-05-11 20:00:00`,
            lastSeenLocation: address,
            clothingDescription: 'Jeans, gray hooded sweatshirt, dark sneakers.',
            status: 'MISSING'
          }
        : undefined,
      status: isMissing ? 'MISSING' : hasRecord ? 'FLAGGED_RECORD' : 'CLEAR',
      tags: [isMissing ? 'MISSING_PERSON' : hasRecord ? 'PRIOR_RECORD' : 'CITIZEN'],
      createdAt: `${rng.int(1995, 2024)}-02-10 09:00:00`,
      updatedAt: '2026-09-08 00:00:00',
      timeline: [
        { id: `t_${id}_b`, date: dob, title: 'Birth', description: 'Born in New Jersey.' }
      ]
    });
  }

  // 5. Generate 420 Vehicles
  const vehicles: VehicleRecord[] = [];
  for (let i = 1; i <= 420; i++) {
    const makeObj = rng.pick(VEHICLE_MAKES_MODELS);
    const model = rng.pick(makeObj.models);
    const year = rng.int(1982, 2023);
    const color = rng.pick(VEHICLE_COLORS);
    const letters = `${String.fromCharCode(65 + rng.int(0, 25))}${String.fromCharCode(65 + rng.int(0, 25))}${String.fromCharCode(65 + rng.int(0, 25))}`;
    const numbers = rng.int(100, 999);
    const plate = `${letters}-${numbers}`;
    const vin = `1${makeObj.make.substring(0, 1)}${model.substring(0, 2).toUpperCase()}${year % 100}${rng.int(100000000, 999999999)}`;
    const owner = rng.pick(persons);
    const id = `VEH-${(i + 2000).toString()}`;
    const status = rng.pick(['REGISTERED', 'REGISTERED', 'REGISTERED', 'STOLEN', 'RECOVERED', 'IMPOUNDED'] as const);

    vehicles.push({
      id,
      type: 'vehicle',
      title: `${year} ${makeObj.make} ${model} (${color}) - ${plate}`,
      licensePlate: plate,
      vin,
      make: makeObj.make,
      model,
      year,
      color,
      ownerId: owner.id,
      registeredAddress: owner.addresses[0] || 'Northbridge, NJ',
      vehicleStatus: status,
      tickets: rng.next() > 0.7 ? [{ date: '2021-04-12', violation: 'Expired Inspection', location: 'River Rd' }] : [],
      accidents: [],
      caseIds: [],
      status,
      tags: ['VEHICLE', status, makeObj.make.toUpperCase()],
      createdAt: `${year}-06-01 00:00:00`,
      updatedAt: '2026-09-08 00:00:00'
    });
  }

  // 6. Generate 320 Cases
  const cases: CaseRecord[] = [];
  for (let i = 1; i <= 320; i++) {
    const year = rng.int(1985, 2025);
    const num = i.toString().padStart(3, '0');
    const caseNumber = `CASE-${year}-${num}`;
    const category = rng.pick(CRIME_CATEGORIES);
    const status = rng.pick(CASE_STATUSES);
    const priority: PriorityLevel = rng.pick(['LOW', 'NORMAL', 'NORMAL', 'HIGH', 'CRITICAL']);
    const leadOfficer = rng.pick(officers);
    const loc = rng.pick(locations);
    const victim = rng.pick(persons);
    const suspect = rng.pick(persons);
    const id = `CASE-${year}-${num}`;

    cases.push({
      id,
      type: 'case',
      title: `${caseNumber}: ${category.replace('_', ' ')} Investigation`,
      caseNumber,
      classification: category,
      dateOpened: `${year}-${rng.int(1, 12).toString().padStart(2, '0')}-${rng.int(1, 28).toString().padStart(2, '0')} 09:00:00`,
      dateClosed: status === 'CLOSED' || status === 'SOLVED' ? `${year + rng.int(0, 2)}-11-20 17:00:00` : undefined,
      leadInvestigatorId: leadOfficer.id,
      department: leadOfficer.department,
      location: loc.address,
      victimIds: [victim.id],
      suspectIds: status !== 'COLD CASE' && status !== 'UNSOLVED' ? [suspect.id] : [],
      poiIds: [],
      witnessIds: [],
      evidenceIds: [],
      vehicleIds: [],
      weaponIds: [],
      reportIds: [],
      warrantIds: [],
      arrestIds: [],
      incidentIds: [],
      relatedCaseIds: [],
      priority,
      status,
      summary: `Investigation opened regarding reported ${category.toLowerCase().replace('_', ' ')} incident occurring at ${loc.address}. Initial field evidence and statements documented by ${leadOfficer.name}.`,
      tags: ['CASE', category, status, priority],
      createdAt: `${year}-01-15 09:00:00`,
      updatedAt: '2026-09-08 00:00:00',
      timeline: [
        { id: `t_${id}_1`, date: `${year}-01-15`, title: 'Case Opened', description: `Investigation initiated by ${leadOfficer.name}.` }
      ]
    });
  }

  // 7. Generate 720 Incidents
  const incidents: IncidentRecord[] = [];
  for (let i = 1; i <= 720; i++) {
    const year = rng.int(1990, 2026);
    const id = `INC-${year}-${i.toString().padStart(4, '0')}`;
    const cat = rng.pick(CRIME_CATEGORIES);
    const officer = rng.pick(officers);
    const loc = rng.pick(locations);
    const linkedCase = rng.next() > 0.4 ? rng.pick(cases) : undefined;
    const person = rng.pick(persons);

    incidents.push({
      id,
      type: 'incident',
      title: `Incident #${id}: ${cat.replace('_', ' ')}`,
      incidentNumber: id,
      category: cat.replace('_', ' '),
      date: `${year}-${rng.int(1, 12).toString().padStart(2, '0')}-${rng.int(1, 28).toString().padStart(2, '0')}`,
      time: `${rng.int(0, 23).toString().padStart(2, '0')}:${rng.int(0, 59).toString().padStart(2, '0')}`,
      location: loc.address,
      reportingOfficerId: officer.id,
      linkedCaseId: linkedCase ? linkedCase.caseNumber : undefined,
      linkedPersonIds: [person.id],
      linkedVehicleIds: [],
      linkedEvidenceIds: [],
      narrative: `Dispatched to ${loc.address} in response to call regarding ${cat.toLowerCase().replace('_', ' ')}. Reporting officer ${officer.name} completed initial field assessment and logged findings.`,
      status: 'LOGGED',
      tags: ['INCIDENT', cat],
      createdAt: `${year}-01-15 10:00:00`,
      updatedAt: `${year}-01-15 12:00:00`
    });

    if (linkedCase) {
      linkedCase.incidentIds.push(id);
    }
  }

  // 8. Generate 1,050 Evidence Records
  const evidence: EvidenceRecord[] = [];
  const evidenceTypes = ['Physical Item', 'Documentary', 'Biological / DNA', 'Digital Storage Media', 'Fingerprint Latent', 'Ballistics Shell', 'Chemical / Narcotic'];
  for (let i = 1; i <= 1050; i++) {
    const id = `E-${(i + 10000).toString().padStart(6, '0')}`;
    const linkedCase = rng.pick(cases);
    const officer = rng.pick(officers);
    const type = rng.pick(evidenceTypes);
    const storage = `Locker ${rng.int(1, 40)}, Shelf ${rng.int(1, 6)}`;
    const date = linkedCase.dateOpened.split(' ')[0] || '2000-01-01';

    evidence.push({
      id,
      type: 'evidence',
      title: `Evidence ${id}: ${type}`,
      evidenceId: id,
      caseId: linkedCase.caseNumber,
      evidenceType: type,
      description: `Recovered ${type.toLowerCase()} item secured during crime scene processing at ${linkedCase.location}.`,
      collectedByOfficerId: officer.id,
      collectionDate: `${date} ${rng.int(10, 18)}:00:00`,
      collectionLocation: linkedCase.location,
      storageLocation: storage,
      chainOfCustody: [
        {
          id: `cust_${id}_1`,
          timestamp: `${date} 16:30:00`,
          action: 'Secured at Scene',
          fromOfficerOrLocation: 'Field Scene',
          toOfficerOrLocation: officer.name,
          reason: 'Initial intake'
        },
        {
          id: `cust_${id}_2`,
          timestamp: `${date} 18:00:00`,
          action: 'Transferred to Property Clerk',
          fromOfficerOrLocation: officer.name,
          toOfficerOrLocation: storage,
          reason: 'Vault logging'
        }
      ],
      relatedPersonIds: linkedCase.victimIds,
      status: 'IN_STORAGE',
      tags: ['EVIDENCE', type.toUpperCase().replace(/\s+/g, '_')],
      createdAt: `${date} 18:00:00`,
      updatedAt: `${date} 18:00:00`
    });

    linkedCase.evidenceIds.push(id);
  }

  // 9. Generate 520 Reports
  const reports: ReportRecord[] = [];
  const reportTypes: ReportRecord['reportType'][] = [
    'INITIAL REPORT', 'SUPPLEMENTAL REPORT', 'INTERVIEW REPORT',
    'CRIME SCENE REPORT', 'ARREST REPORT', 'EVIDENCE REPORT', 'FORENSIC REPORT'
  ];
  for (let i = 1; i <= 520; i++) {
    const linkedCase = rng.pick(cases);
    const officer = rng.pick(officers);
    const rType = rng.pick(reportTypes);
    const year = linkedCase.caseNumber.split('-')[1] || '2000';
    const id = `R-${year}-${i.toString().padStart(4, '0')}`;
    const date = linkedCase.dateOpened.split(' ')[0] || '2000-01-01';

    reports.push({
      id,
      type: 'report',
      title: `Report #${id}: ${rType} (${linkedCase.caseNumber})`,
      reportNumber: id,
      caseId: linkedCase.caseNumber,
      authorOfficerId: officer.id,
      authorRank: officer.rank,
      authorName: officer.name,
      date,
      time: `${rng.int(8, 20).toString().padStart(2, '0')}:${rng.int(0, 59).toString().padStart(2, '0')}`,
      location: linkedCase.location,
      reportType: rType,
      narrative: `METROPOLITAN POLICE DEPARTMENT // OFFICIAL INVESTIGATIVE MEMO\nCASE NUMBER: ${linkedCase.caseNumber}\nAUTHOR: ${officer.rank} ${officer.name} (#${officer.badgeNumber})\n\nInvestigative examination conducted regarding ${linkedCase.classification.toLowerCase()} docket. Personnel interviewed witnesses and logged relevant scene characteristics at ${linkedCase.location}.\n\nAll physical evidence transferred to property clerk according to departmental protocol.`,
      signature: `${officer.rank} ${officer.name} #${officer.badgeNumber}`,
      relatedPersonIds: linkedCase.victimIds,
      relatedEvidenceIds: [],
      status: 'FILED',
      tags: ['REPORT', rType.replace(/\s+/g, '_')],
      createdAt: `${date} 12:00:00`,
      updatedAt: `${date} 12:00:00`
    });

    linkedCase.reportIds.push(id);
    officer.authoredReportIds.push(id);
  }

  // 10. Generate 110 Warrants & Arrests
  const warrants: WarrantRecord[] = [];
  const arrests: ArrestRecord[] = [];
  for (let i = 1; i <= 110; i++) {
    const person = rng.pick(persons);
    const officer = rng.pick(officers);
    const linkedCase = rng.pick(cases);
    const warId = `WAR-20${rng.int(10, 24)}-${i.toString().padStart(3, '0')}`;
    const status = rng.pick(['ACTIVE', 'EXECUTED', 'CANCELLED', 'EXPIRED'] as const);

    warrants.push({
      id: warId,
      type: 'warrant',
      title: `Warrant #${warId}: ${person.title}`,
      warrantNumber: warId,
      personId: person.id,
      personName: person.title,
      caseId: linkedCase.caseNumber,
      issueDate: '2021-03-14 09:00:00',
      expirationDate: '2024-03-14 23:59:00',
      issuingAuthority: 'Municipal Court 4th District',
      charges: ['Failure to Appear', 'Suspicion of Stolen Property Trafficking'],
      warrantStatus: status,
      assignedOfficerId: officer.id,
      status,
      tags: ['WARRANT', status],
      createdAt: '2021-03-14 09:00:00',
      updatedAt: '2021-03-14 09:00:00'
    });

    person.warrantIds.push(warId);
    linkedCase.warrantIds.push(warId);

    if (status === 'EXECUTED') {
      const arrId = `ARR-2022-${i.toString().padStart(3, '0')}`;
      arrests.push({
        id: arrId,
        type: 'arrest',
        title: `Arrest Booking #${arrId}: ${person.title}`,
        bookingNumber: arrId,
        personId: person.id,
        personName: person.title,
        caseId: linkedCase.caseNumber,
        date: '2022-04-18',
        time: '14:20',
        location: person.addresses[0] || 'Northbridge',
        arrestingOfficerId: officer.id,
        charges: ['Warrant Execution', 'Possession of Contraband'],
        status: 'PROCESSED',
        tags: ['ARREST', 'BOOKING'],
        createdAt: '2022-04-18 15:00:00',
        updatedAt: '2022-04-18 15:00:00'
      });
      person.arrestHistory.push(arrId);
      linkedCase.arrestIds.push(arrId);
    }
  }

  // 11. Generate Inter-record Relationships
  const relationships: Relationship[] = [];
  let relId = 100;
  for (const c of cases) {
    if (c.victimIds.length > 0) {
      relationships.push({
        id: `rel_${relId++}`,
        sourceId: c.victimIds[0],
        targetId: c.id,
        type: 'VICTIM',
        description: 'Victim in case investigation'
      });
    }
    if (c.suspectIds.length > 0) {
      relationships.push({
        id: `rel_${relId++}`,
        sourceId: c.suspectIds[0],
        targetId: c.id,
        type: 'SUSPECT',
        description: 'Suspect named in case'
      });
    }
    relationships.push({
      id: `rel_${relId++}`,
      sourceId: c.leadInvestigatorId,
      targetId: c.id,
      type: 'OFFICER',
      description: 'Lead investigative detective'
    });
  }

  for (const v of vehicles) {
    if (v.ownerId) {
      relationships.push({
        id: `rel_${relId++}`,
        sourceId: v.ownerId,
        targetId: v.id,
        type: 'OWNER',
        description: 'Registered owner of vehicle'
      });
    }
  }

  return {
    officers,
    persons,
    cases,
    incidents,
    evidence,
    vehicles,
    reports,
    locations,
    organizations,
    warrants,
    arrests,
    relationships
  };
}
