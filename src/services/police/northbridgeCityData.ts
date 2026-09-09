import {
  NorthbridgeDistrict,
  NorthbridgeStreet,
  NorthbridgeMapLocation,
  VehicleSightingPoint,
  IncidentMapMarker,
  EvidenceMapMarker
} from '../../types/map';

export const NORTHBRIDGE_DISTRICTS: NorthbridgeDistrict[] = [
  {
    id: 'DIST-01',
    name: 'Historic 3rd Ward',
    code: 'WARD-3',
    wardNumber: '3rd Ward',
    description: 'Victorian residential quarter, tree-lined avenues, residential dwellings dating to early 1900s.',
    color: '#38bdf8',
    zoneType: 'RESIDENTIAL',
    path: 'M 100 120 L 380 120 L 380 340 L 100 340 Z',
    center: { x: 240, y: 230 }
  },
  {
    id: 'DIST-02',
    name: 'Civic Center & Municipal Core',
    code: 'CIVIC-4',
    wardNumber: '4th Ward',
    description: 'Government complex, Police Headquarters, County Courthouse, Records Archives, and Central Library.',
    color: '#818cf8',
    zoneType: 'CIVIC',
    path: 'M 380 120 L 660 120 L 660 340 L 380 340 Z',
    center: { x: 520, y: 230 }
  },
  {
    id: 'DIST-03',
    name: 'Waterfront Maritime District',
    code: 'PORT-1',
    wardNumber: 'Harbor Ward',
    description: 'Grand Harbor shoreline, container freight piers, municipal impound yard, and marine patrol basin.',
    color: '#0284c7',
    zoneType: 'WATERFRONT',
    path: 'M 660 80 L 960 80 L 960 480 L 660 480 Z',
    center: { x: 810, y: 280 }
  },
  {
    id: 'DIST-04',
    name: 'Northbridge Industrial Zone',
    code: 'IND-2',
    wardNumber: '2nd District',
    description: 'Rail freight corridor, heavy manufacturing, logistics depots, electronics fabrication plants.',
    color: '#f59e0b',
    zoneType: 'INDUSTRIAL',
    path: 'M 100 340 L 520 340 L 520 560 L 100 560 Z',
    center: { x: 310, y: 450 }
  },
  {
    id: 'DIST-05',
    name: 'Outer County Wetlands Reserve',
    code: 'MARSH-6',
    wardNumber: 'County Reserve',
    description: 'Tidal salt marshes, brackish canal culverts, drainage sluices, and sparsely lit rural bypass roads.',
    color: '#10b981',
    zoneType: 'WETLANDS',
    path: 'M 520 340 L 960 480 L 960 660 L 520 660 Z',
    center: { x: 740, y: 550 }
  }
];

export const NORTHBRIDGE_STREETS: NorthbridgeStreet[] = [
  {
    id: 'ST-GRAND',
    name: 'Grand Avenue',
    type: 'AVENUE',
    path: 'M 80 340 L 920 340',
    width: 6,
    labelPos: { x: 260, y: 334 }
  },
  {
    id: 'ST-MARKET',
    name: 'Market Street',
    type: 'STREET',
    path: 'M 380 90 L 380 620',
    width: 6,
    labelPos: { x: 388, y: 170, angle: 90 }
  },
  {
    id: 'ST-WILLOW',
    name: 'Willow Street',
    type: 'STREET',
    path: 'M 120 180 L 360 180',
    width: 4,
    labelPos: { x: 210, y: 174 }
  },
  {
    id: 'ST-HIGH',
    name: 'High Street',
    type: 'STREET',
    path: 'M 400 180 L 640 180',
    width: 4,
    labelPos: { x: 500, y: 174 }
  },
  {
    id: 'ST-RIVER',
    name: 'River Road Corridor',
    type: 'ROAD',
    path: 'M 120 450 L 500 450',
    width: 5,
    labelPos: { x: 280, y: 444 }
  },
  {
    id: 'ST-IND-PKWY',
    name: 'Industrial Parkway',
    type: 'PARKWAY',
    path: 'M 240 340 L 240 600',
    width: 5,
    labelPos: { x: 248, y: 510, angle: 90 }
  },
  {
    id: 'ST-CANAL',
    name: 'Canal Road',
    type: 'ROAD',
    path: 'M 540 340 L 880 620',
    width: 4,
    labelPos: { x: 670, y: 460, angle: 39 }
  },
  {
    id: 'ST-SHORE',
    name: 'Lower Shore Parkway',
    type: 'PARKWAY',
    path: 'M 660 100 L 660 460 Q 720 540 850 640',
    width: 5,
    labelPos: { x: 668, y: 260, angle: 90 }
  },
  {
    id: 'ST-DOCKSIDE',
    name: 'Dockside Way',
    type: 'WAY',
    path: 'M 680 220 L 920 220',
    width: 4,
    labelPos: { x: 790, y: 214 }
  }
];

export const NORTHBRIDGE_MAP_LOCATIONS: NorthbridgeMapLocation[] = [
  {
    id: 'LOC-0042',
    recordId: 'LOC-0042',
    name: '42 Willow Street (Anna Bell Residence)',
    address: '42 Willow Street, Northbridge, NJ',
    districtId: 'DIST-01',
    districtName: 'Historic 3rd Ward',
    locationType: 'RESIDENTIAL',
    coordinates: { x: 220, y: 180 },
    description:
      'Two-story Victorian wood-frame residence. Primary home of Anna Claire Bell prior to her disappearance on September 14, 1998. Front driveway borders 46 Willow Street.',
    phone: '(555) 382-9014',
    icon: 'Home',
    color: '#ef4444',
    knownOccupants: ['Anna Claire Bell (1981-1998)', 'Michael Thomas Bell (Co-resident until 1996)'],
    knownBusinesses: [],
    caseIds: ['CASE-1998-027'],
    incidentIds: ['INC-1998-0914', 'INC-1998-1142'],
    evidenceIds: ['EV-1998-027-002'],
    personIds: ['P-004821', 'P-004822'],
    vehicleIds: ['VEH-TXR481'],
    reportIds: ['R-1998-112', 'R-1998-114'],
    historicalStates: [
      {
        era: '1998',
        statusDescription: 'ACTIVE CRIME SCENE & RESIDENCE',
        occupantOrOwner: 'Anna Claire Bell',
        notes:
          'Canvassed by Det. Hayes on Sept 17, 1998. Neighbor confirmed blue Ford Taurus TXR-481 in driveway until approx 22:15 on Sept 14.'
      },
      {
        era: '2003',
        statusDescription: 'ESTATE PROBATE VACANCY',
        occupantOrOwner: 'Bell Family Estate Trust',
        notes: 'Property entered probate court oversight following statutory five-year missing person filing.'
      },
      {
        era: '2004',
        statusDescription: 'PROPERTY TRANSFER RECORDED',
        occupantOrOwner: 'Crownline Real Estate Holding LLC',
        notes:
          'Deed transfer executed under municipal tax lien assignment. Recorded by County Clerk on July 14, 2004.'
      },
      {
        era: '2026',
        statusDescription: 'RENTAL PROPERTY / PRESERVED HISTORIC DWELLING',
        occupantOrOwner: 'Private Tenant (Managed by Northbridge Heritage Realty)',
        notes: 'Cold case re-examination site. Exterior perimeter photographed for cold case review dossier.'
      }
    ],
    isDiscovered: true
  },
  {
    id: 'LOC-BELL-ELEC',
    recordId: 'LOC-BELL-ELEC',
    name: 'Bell Electronics Components Facility',
    address: '1440 River Road, Bay 4, Northbridge Industrial Zone',
    districtId: 'DIST-04',
    districtName: 'Northbridge Industrial Zone',
    locationType: 'COMMERCIAL',
    coordinates: { x: 320, y: 450 },
    description:
      'Industrial warehouse and distribution center specializing in electromechanical relays and telecom hardware. Shared rail siding with Crownline Logistics spur.',
    phone: '(555) 382-1140',
    icon: 'Cpu',
    color: '#f59e0b',
    knownOccupants: ['Michael Bell (Warehouse VP)', 'Anna Bell (Inventory Auditor)'],
    knownBusinesses: ['Bell Electronics Components Inc.'],
    caseIds: ['CASE-1998-027'],
    incidentIds: [],
    evidenceIds: ['EV-1998-027-009'],
    personIds: ['P-004821', 'P-004822', 'P-005102'],
    vehicleIds: ['VEH-TXR481'],
    reportIds: ['R-1998-112'],
    historicalStates: [
      {
        era: '1998',
        statusDescription: 'ACTIVE COMMERCIAL OPERATIONS',
        occupantOrOwner: 'Bell Electronics Components Inc.',
        notes:
          'Last confirmed sighting of Anna Bell leaving Bay 4 office on September 14, 1998 at 21:30 with audit ledger.'
      },
      {
        era: '2003',
        statusDescription: 'CEASED OPERATIONS / CHAPTER 11 LIQUIDATION',
        occupantOrOwner: 'Liquidation Trustee',
        notes: 'Firm collapsed after commercial contracts terminated following shipping irregularities.'
      },
      {
        era: '2004',
        statusDescription: 'SUB-DIVIDED WAREHOUSE LEASE',
        occupantOrOwner: 'Crownline Storage Annex',
        notes: 'Warehouse space absorbed into Crownline logistics freight compound.'
      },
      {
        era: '2026',
        statusDescription: 'INDEPENDENT LOGISTICS REPAIR DEPOT',
        occupantOrOwner: 'River Road Freight Services',
        notes: 'Foundation structural work from late 1998 identified in municipal building inspector archives.'
      }
    ],
    isDiscovered: true
  },
  {
    id: 'LOC-CROWNLINE',
    recordId: 'LOC-CROWNLINE',
    name: 'Crownline Logistics Freight Depot',
    address: '210 Industrial Parkway, Northbridge Rail Corridor',
    districtId: 'DIST-04',
    districtName: 'Northbridge Industrial Zone',
    locationType: 'INDUSTRIAL',
    coordinates: { x: 240, y: 530 },
    description:
      'Multi-acre intermodal freight yard with overhead gantry cranes, private rail spur, and secure fenced perimeter. Heavy transport operations hub.',
    phone: '(555) 491-0000',
    icon: 'Truck',
    color: '#dc2626',
    knownOccupants: ['Victor Vance (Operations Lead)', 'Captain Arthur Vance (Former Board Director)'],
    knownBusinesses: ['Crownline Logistics Corp', 'Crownline Intermodal Freight'],
    caseIds: ['CASE-1987-014', 'CASE-1998-027'],
    incidentIds: [],
    evidenceIds: ['EV-1998-027-014'],
    personIds: ['P-006219', 'P-003102', 'OFF-1012'],
    vehicleIds: ['VEH-KLY902'],
    reportIds: ['R-1987-042'],
    historicalStates: [
      {
        era: '1998',
        statusDescription: 'ACTIVE PRIVATE FREIGHT DEPOT',
        occupantOrOwner: 'Crownline Logistics Corp',
        notes:
          'Gate 3 security logs recorded white Caprice sedan KLY-902 exiting at 23:30 on September 14, 1998.'
      },
      {
        era: '2003',
        statusDescription: 'EXPANDED DEPOT TERMINAL',
        occupantOrOwner: 'Crownline Logistics Corp',
        notes: 'Acquired adjoining rail rights from shuttered Bell Electronics parcel.'
      },
      {
        era: '2004',
        statusDescription: 'CORPORATE RESTRUCTURING',
        occupantOrOwner: 'Crownline Holdings International',
        notes: 'Renovated Gate 3 security booth and decommissioned legacy VHS surveillance archives.'
      },
      {
        era: '2026',
        statusDescription: 'ACTIVE LOGISTICS TERMINAL',
        occupantOrOwner: 'Crownline Intermodal LLC',
        notes: 'Subject of cold case warrant inquiry regarding gantry crane lubricant chemical signatures.'
      }
    ],
    isDiscovered: true
  },
  {
    id: 'LOC-CANAL-RD',
    recordId: 'LOC-CANAL-RD',
    name: 'Canal Road Marsh Turnoff (Mile Marker 4.2)',
    address: 'Canal Road at Marsh Culvert Drainage Sluice',
    districtId: 'DIST-05',
    districtName: 'Outer County Wetlands Reserve',
    locationType: 'CRIME_SCENE',
    coordinates: { x: 740, y: 530 },
    description:
      'Gravel pull-off beside the tidal canal drainage culvert. Sparse sodium vapor lighting, dense marsh reed growth, and muddy drainage incline.',
    icon: 'AlertTriangle',
    color: '#ef4444',
    knownOccupants: [],
    knownBusinesses: [],
    caseIds: ['CASE-1998-027'],
    incidentIds: ['INC-1998-1142'],
    evidenceIds: ['EV-1998-027-014', 'E-004821'],
    personIds: ['P-004821'],
    vehicleIds: ['VEH-TXR481', 'VEH-KLY902'],
    reportIds: ['R-1998-112'],
    historicalStates: [
      {
        era: '1998',
        statusDescription: 'VEHICLE RECOVERY & DUMP SITE',
        occupantOrOwner: 'County Wetlands Reserve',
        notes:
          'Ford Taurus TXR-481 recovered abandoned on Oct 2, 1998. Initial CAD call INC-1998-1142 logged at 22:45 on Sept 14.'
      },
      {
        era: '2003',
        statusDescription: 'WETLAND CONSERVATION ZONE',
        occupantOrOwner: 'State Dept of Environmental Protection',
        notes: 'Erected concrete culvert barricade preventing vehicle turnaround.'
      },
      {
        era: '2004',
        statusDescription: 'RESERVE FLOODWAY',
        occupantOrOwner: 'State DEP',
        notes: 'Dredged drainage canal bed; no human remains recovered in initial 2004 dredge.'
      },
      {
        era: '2026',
        statusDescription: 'COLD CASE FORENSIC RE-EXAMINATION GRID',
        occupantOrOwner: 'Northbridge Police Department Evidence Search Grid B-7',
        notes: 'Ground-penetrating radar survey authorized under 2026 cold case review protocol.'
      }
    ],
    isDiscovered: true
  },
  {
    id: 'LOC-NPD-HQ',
    recordId: 'LOC-NPD-HQ',
    name: 'Northbridge Police Headquarters',
    address: '400 Civic Center Plaza, Northbridge, NJ',
    districtId: 'DIST-02',
    districtName: 'Civic Center & Municipal Core',
    locationType: 'MUNICIPAL',
    coordinates: { x: 490, y: 220 },
    description:
      'Five-story municipal fortress housing Detective Bureau, Cold Case Review Unit, CAD 911 Communications, Workstation 07, and Executive Offices.',
    phone: '(555) 382-1000',
    icon: 'Shield',
    color: '#3b82f6',
    knownOccupants: [
      'Detective Sarah Miller (Workstation 07)',
      'Lieutenant Marcus Reed',
      'Captain Arthur Vance',
      'Karen Kowalski (CAD)'
    ],
    knownBusinesses: ['Northbridge Police Department'],
    caseIds: ['CASE-1998-027', 'CASE-1987-014'],
    incidentIds: ['INC-1998-1142'],
    evidenceIds: [],
    personIds: ['OFF-4081', 'OFF-1012', 'OFF-3014'],
    vehicleIds: [],
    reportIds: ['R-1998-112', 'R-2026-004'],
    historicalStates: [
      {
        era: '1998',
        statusDescription: 'POLICE HEADQUARTERS & ACTIVE INVESTIGATION HUB',
        occupantOrOwner: 'Northbridge Police Department',
        notes: 'Incident Room 3 operated the initial Case 27 investigation under Det. Daniel Hayes.'
      },
      {
        era: '2003',
        statusDescription: 'HEADQUARTERS',
        occupantOrOwner: 'NPD',
        notes: 'Mainframe computerized dispatch conversion completed.'
      },
      {
        era: '2004',
        statusDescription: 'EXPANDED COMMUNICATIONS WING',
        occupantOrOwner: 'NPD',
        notes: 'Sub-basement archival terminal SEC-VANCE-89 installed.'
      },
      {
        era: '2026',
        statusDescription: 'HEADQUARTERS & WORKSTATION 07 AUDIT CONSOLE',
        occupantOrOwner: 'NPD',
        notes: 'Active command center for the 2026 Cold Case Review Directive.'
      }
    ],
    isDiscovered: true
  },
  {
    id: 'LOC-ARCHIVE',
    recordId: 'LOC-ARCHIVE',
    name: 'County Records Archive Annex',
    address: '800 High Street, Civic Center District',
    districtId: 'DIST-02',
    districtName: 'Civic Center & Municipal Core',
    locationType: 'MUNICIPAL',
    coordinates: { x: 570, y: 180 },
    description:
      'Brick archive depository containing microfilm reels, historical property ledgers, sealed case files, and physical evidence vault B-12.',
    phone: '(555) 382-3401',
    icon: 'Archive',
    color: '#8b5cf6',
    knownOccupants: ['Captain Laura Bennett', 'Marcus Thorne (Records Specialist)'],
    knownBusinesses: ['Northbridge County Records & Archive Division'],
    caseIds: ['CASE-1998-027', 'CASE-1987-014'],
    incidentIds: [],
    evidenceIds: [],
    personIds: ['OFF-2018', 'OFF-5109'],
    vehicleIds: [],
    reportIds: ['R-1998-112', 'R-1987-042'],
    historicalStates: [
      {
        era: '1998',
        statusDescription: 'ACTIVE ARCHIVES REPOSITORY',
        occupantOrOwner: 'Northbridge County Archives',
        notes: 'Preserved original paper filings and carbon copies of active missing person dockets.'
      },
      {
        era: '2003',
        statusDescription: 'ARCHIVES FACILITY',
        occupantOrOwner: 'Northbridge County Archives',
        notes: 'Began microfilming pre-2000 investigation binders.'
      },
      {
        era: '2004',
        statusDescription: 'ARCHIVE REORGANIZATION (SEC-VANCE-89)',
        occupantOrOwner: 'Northbridge County Archives',
        notes:
          'Microfilm roll 14-B sealed and redacted under Captain Arthur Vance administrative directive.'
      },
      {
        era: '2026',
        statusDescription: 'DIGITAL AUDIT COMMAND & VAULT B-12 INSPECTION',
        occupantOrOwner: 'Records Division under Captain Laura Bennett',
        notes: 'Physical recovery of uncatalogued carbon freight receipts behind microfilm placard.'
      }
    ],
    isDiscovered: true
  },
  {
    id: 'LOC-HOSPITAL',
    recordId: 'LOC-HOSPITAL',
    name: 'Northbridge Memorial Hospital',
    address: '1200 Health Parkway, Medical District',
    districtId: 'DIST-02',
    districtName: 'Civic Center & Municipal Core',
    locationType: 'MEDICAL',
    coordinates: { x: 440, y: 140 },
    description:
      'Metropolitan hospital facility housing regional trauma center, pathology morgue, and historic dental records archive.',
    phone: '(555) 382-8000',
    icon: 'PlusCircle',
    color: '#06b6d4',
    knownOccupants: ['County Medical Examiner'],
    knownBusinesses: ['Northbridge Memorial Health System'],
    caseIds: ['CASE-1998-027'],
    incidentIds: [],
    evidenceIds: [],
    personIds: ['P-004821'],
    vehicleIds: [],
    reportIds: [],
    historicalStates: [
      {
        era: '1998',
        statusDescription: 'ACUTE HOSPITAL & ARCHIVE',
        occupantOrOwner: 'Northbridge Memorial',
        notes: 'Maintained dental X-rays and medical records for Anna Claire Bell.'
      },
      {
        era: '2003',
        statusDescription: 'EXPANDED TRAUMA CENTER',
        occupantOrOwner: 'Northbridge Memorial',
        notes: 'Retained sealed cold case forensic charts in medical records vault.'
      },
      {
        era: '2004',
        statusDescription: 'MEDICAL CENTER',
        occupantOrOwner: 'Northbridge Memorial',
        notes: 'Digitized historical dental records into regional database.'
      },
      {
        era: '2026',
        statusDescription: 'REGIONAL HEALTH FACILITY',
        occupantOrOwner: 'Northbridge Health',
        notes: 'Comparison ready for any human remains recovery forensic identification.'
      }
    ],
    isDiscovered: true
  },
  {
    id: 'LOC-IMPOUND',
    recordId: 'LOC-IMPOUND',
    name: 'Municipal Auto Impound & Forensics Yard',
    address: 'Dockside Way & Canal Corridor, Waterfront Ward',
    districtId: 'DIST-03',
    districtName: 'Waterfront Maritime District',
    locationType: 'MUNICIPAL',
    coordinates: { x: 740, y: 260 },
    description:
      'Secured municipal impound facility with covered vehicle examination bays and forensic lift racks. Storage depot for impounded vehicles.',
    phone: '(555) 382-4112',
    icon: 'Car',
    color: '#64748b',
    knownOccupants: ['Walter Briggs (Evidence Custodian)', 'Gerry Miller (Fleet)'],
    knownBusinesses: ['Northbridge Police Impound Division'],
    caseIds: ['CASE-1998-027'],
    incidentIds: [],
    evidenceIds: ['EV-1998-027-014', 'E-004821'],
    personIds: ['P-004821', 'P-006219'],
    vehicleIds: ['VEH-TXR481', 'VEH-KLY902'],
    reportIds: ['R-1998-112'],
    historicalStates: [
      {
        era: '1998',
        statusDescription: 'ACTIVE FORENSIC IMPOUND YARD',
        occupantOrOwner: 'NPD Impound Division',
        notes:
          '1987 Ford Taurus TXR-481 towed from Canal Road on Oct 2, 1998 and processed for trace evidence.'
      },
      {
        era: '2003',
        statusDescription: 'SECURE VEHICLE STORAGE',
        occupantOrOwner: 'NPD Impound',
        notes: 'Taurus held in long-term locked cold storage bay 12.'
      },
      {
        era: '2004',
        statusDescription: 'IMPOUND STORAGE',
        occupantOrOwner: 'NPD Impound',
        notes: 'Chain of custody inspection conducted during archive consolidation.'
      },
      {
        era: '2026',
        statusDescription: 'MODERN FORENSIC VEHICLE LAB',
        occupantOrOwner: 'NPD Forensic Sciences',
        notes:
          'Secondary chemical swipe revealed heavy crane lubricant on Taurus door sill.'
      }
    ],
    isDiscovered: true
  }
];

export const VEHICLE_SIGHTINGS: VehicleSightingPoint[] = [
  {
    id: 'SIGHT-01',
    vehicleId: 'VEH-TXR481',
    licensePlate: 'TXR-481',
    vehicleName: '1987 Ford Taurus (Midnight Blue)',
    date: '1998-09-14',
    time: '21:30',
    locationName: 'Bell Electronics Facility - Bay 4',
    address: '1440 River Road, Bay 4',
    coordinates: { x: 320, y: 450 },
    speedEstimate: '15 mph (Exiting)',
    direction: 'Heading East on River Road',
    source: 'WITNESS_STATEMENT',
    reportId: 'R-1998-112',
    narrative:
      'Witness Michael Bell observed victim Anna Bell leave the warehouse dispatch office carrying a brown manila binder and enter her midnight blue Taurus TXR-481.',
    stepOrder: 1
  },
  {
    id: 'SIGHT-02',
    vehicleId: 'VEH-TXR481',
    licensePlate: 'TXR-481',
    vehicleName: '1987 Ford Taurus (Midnight Blue)',
    date: '1998-09-14',
    time: '22:15',
    locationName: '42 Willow Street Driveway',
    address: '42 Willow Street, Historic 3rd Ward',
    coordinates: { x: 220, y: 180 },
    speedEstimate: 'Stationary (Parked)',
    direction: 'Parked in driveway facing street',
    source: 'WITNESS_STATEMENT',
    reportId: 'R-1998-114',
    narrative:
      'Neighbor Mrs. Gable at 46 Willow Street reported observing the Taurus parked in the driveway until approximately 22:15, directly contradicting the theory that Anna drove straight to Canal Road from work.',
    isConflict: true,
    conflictDetails:
      'Initial report R-1998-112 stated Anna never returned home after leaving River Road at 21:30.',
    stepOrder: 2
  },
  {
    id: 'SIGHT-03',
    vehicleId: 'VEH-TXR481',
    licensePlate: 'TXR-481',
    vehicleName: '1987 Ford Taurus (Midnight Blue)',
    date: '1998-09-14',
    time: '22:31',
    locationName: 'Intersection of Willow Street & 4th Avenue',
    address: 'Willow & 4th Avenue, Historic District',
    coordinates: { x: 340, y: 180 },
    speedEstimate: '45 mph (Excessive)',
    direction: 'Heading South-East toward Grand Avenue bypass',
    source: 'CAD_CALL',
    reportId: 'INC-1998-1142',
    narrative:
      'Anonymous 911 caller reported a dark blue sedan traveling at excessive speed with headlights switched off, closely followed by a large white American sedan (KLY-902).',
    stepOrder: 3
  },
  {
    id: 'SIGHT-04',
    vehicleId: 'VEH-KLY902',
    licensePlate: 'KLY-902',
    vehicleName: '1992 Chevrolet Caprice (White)',
    date: '1998-09-14',
    time: '22:32',
    locationName: 'Willow & 4th Avenue Corridor',
    address: 'Willow Street at 4th Avenue',
    coordinates: { x: 350, y: 190 },
    speedEstimate: '45 mph',
    direction: 'Pursuing dark sedan towards Grand Ave',
    source: 'CAD_CALL',
    reportId: 'INC-1998-1142',
    narrative:
      'White Chevrolet Caprice (matching Crownline vehicle KLY-902 registered to Victor Vance) witnessed trailing dark Taurus.',
    stepOrder: 4
  },
  {
    id: 'SIGHT-05',
    vehicleId: 'VEH-TXR481',
    licensePlate: 'TXR-481',
    vehicleName: '1987 Ford Taurus (Midnight Blue)',
    date: '1998-09-14',
    time: '22:45',
    locationName: 'Canal Road Marsh Culvert (Mile Marker 4.2)',
    address: 'Canal Road Turnoff',
    coordinates: { x: 740, y: 530 },
    speedEstimate: 'Stationary with Hazard Flashers',
    direction: 'Facing Marsh Drainage Culvert',
    source: 'DISPATCH_LOG',
    reportId: 'INC-1998-1142',
    narrative:
      'Passing motorist called 911 reporting vehicle hazards flashing near culvert. Responding Unit 304 dispatched at 22:42 but manually cleared at 23:15 by terminal OPR-01 as "Gone on Arrival".',
    isConflict: true,
    conflictDetails:
      'Unit 304 arrival log was overridden by terminal OPR-01 (Captain Vance office) and marked unfounded.',
    stepOrder: 5
  },
  {
    id: 'SIGHT-06',
    vehicleId: 'VEH-KLY902',
    licensePlate: 'KLY-902',
    vehicleName: '1992 Chevrolet Caprice (White)',
    date: '1998-09-14',
    time: '23:30',
    locationName: 'Crownline Logistics Gate 3 Security Post',
    address: '210 Industrial Parkway',
    coordinates: { x: 240, y: 530 },
    speedEstimate: 'Low (Entering Facility)',
    direction: 'Inbound through Gate 3 Freight Siding',
    source: 'IMPOUND_RECORD',
    reportId: 'R-1998-112',
    narrative:
      'Uncatalogued gate pass recovered from microfilm roll 14-B proves Victor Vance returned Caprice KLY-902 to Crownline depot at 23:30.',
    stepOrder: 6
  },
  {
    id: 'SIGHT-07',
    vehicleId: 'VEH-TXR481',
    licensePlate: 'TXR-481',
    vehicleName: '1987 Ford Taurus (Midnight Blue)',
    date: '1998-10-02',
    time: '14:00',
    locationName: 'Canal Road Marsh Culvert Recovery Site',
    address: 'Canal Road Mile Marker 4.2',
    coordinates: { x: 740, y: 530 },
    speedEstimate: 'Abandoned',
    direction: 'Mired in marsh reeds',
    source: 'OFFICER_PATROL',
    reportId: 'R-1998-112',
    narrative:
      'Vehicle formally recovered by County Sheriff patrol. Driver side window down 2 inches, keys missing, handbag missing, trace hair and trench coat fibers collected.',
    stepOrder: 7
  }
];

export const INCIDENT_MAP_MARKERS: IncidentMapMarker[] = [
  {
    id: 'MARK-INC-1142',
    incidentId: 'INC-1998-1142',
    caseId: 'CASE-1998-027',
    title: 'CAD 911 Call: Suspicious Vehicle at Canal Turnoff',
    incidentType: 'SUSPICIOUS_VEHICLE',
    date: '1998-09-14',
    time: '22:45',
    address: 'Canal Road at Mile Marker 4.2',
    coordinates: { x: 740, y: 530 },
    status: 'CLOSED_UNFOUNDED_OVERRIDDEN',
    severity: 'HIGH',
    officerIds: ['OFF-3014', 'OFF-2241']
  },
  {
    id: 'MARK-INC-0914',
    incidentId: 'INC-1998-0914',
    caseId: 'CASE-1998-027',
    title: 'Prowler / Surveillance Complaint',
    incidentType: 'SUSPICIOUS_PERSON',
    date: '1998-09-12',
    time: '23:10',
    address: '42 Willow Street',
    coordinates: { x: 220, y: 180 },
    status: 'RESOLVED',
    severity: 'MEDIUM',
    officerIds: ['OFF-3014']
  }
];

export const EVIDENCE_MAP_MARKERS: EvidenceMapMarker[] = [
  {
    id: 'MARK-EV-014',
    evidenceId: 'EV-1998-027-014',
    caseId: 'CASE-1998-027',
    title: 'Fibers & Hydraulic Crane Lubricant Residue',
    itemType: 'BIOLOGICAL_AND_CHEMICAL',
    recoveryDate: '1998-10-02',
    address: 'Canal Road Marsh Culvert (Recovered inside TXR-481)',
    coordinates: { x: 740, y: 530 },
    recoveredByOfficerId: 'OFF-3014'
  },
  {
    id: 'MARK-EV-009',
    evidenceId: 'EV-1998-027-009',
    caseId: 'CASE-1998-027',
    title: 'Manila Ledger Envelope Fragments',
    itemType: 'DOCUMENTARY',
    recoveryDate: '1998-10-03',
    address: 'Marsh Drainage Sluice #3 (300 ft South of Culvert)',
    coordinates: { x: 770, y: 560 },
    recoveredByOfficerId: 'OFF-3014'
  }
];
