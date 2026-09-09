export type HistoricalEra = '1998' | '2003' | '2004' | '2026';

export interface MapCoordinates {
  x: number; // 0 to 1000 in SVG grid space
  y: number; // 0 to 700 in SVG grid space
}

export interface NorthbridgeDistrict {
  id: string;
  name: string;
  code: string;
  wardNumber: string;
  description: string;
  color: string;
  zoneType: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'CIVIC' | 'WATERFRONT' | 'WETLANDS';
  path: string; // SVG path string
  center: MapCoordinates;
}

export interface NorthbridgeStreet {
  id: string;
  name: string;
  type: 'AVENUE' | 'STREET' | 'ROAD' | 'PARKWAY' | 'HIGHWAY' | 'WAY';
  path: string;
  width: number;
  labelPos: { x: number; y: number; angle?: number };
}

export interface HistoricalLocationState {
  era: HistoricalEra;
  statusDescription: string;
  occupantOrOwner: string;
  isRestricted?: boolean;
  notableIncidents?: string[];
  notes: string;
}

export interface NorthbridgeMapLocation {
  id: string;
  recordId?: string; // links to PRIS LOC-* record
  name: string;
  address: string;
  districtId: string;
  districtName: string;
  locationType:
    | 'RESIDENTIAL'
    | 'COMMERCIAL'
    | 'INDUSTRIAL'
    | 'PUBLIC'
    | 'MUNICIPAL'
    | 'MEDICAL'
    | 'CRIME_SCENE'
    | 'CORRECTIONAL'
    | 'WATERWAY';
  coordinates: MapCoordinates;
  description: string;
  phone?: string;
  icon: string;
  color: string;
  knownOccupants: string[];
  knownBusinesses: string[];
  caseIds: string[];
  incidentIds: string[];
  evidenceIds: string[];
  personIds: string[];
  vehicleIds: string[];
  reportIds: string[];
  historicalStates: HistoricalLocationState[];
  isDiscovered: boolean;
  isBoardPinned?: boolean;
}

export interface VehicleSightingPoint {
  id: string;
  vehicleId: string; // e.g. VEH-TXR481
  licensePlate: string;
  vehicleName: string;
  date: string;
  time: string;
  locationName: string;
  address: string;
  coordinates: MapCoordinates;
  speedEstimate?: string;
  direction: string;
  source: 'CAD_CALL' | 'OFFICER_PATROL' | 'TRAFFIC_CAMERA' | 'WITNESS_STATEMENT' | 'DISPATCH_LOG' | 'IMPOUND_RECORD';
  reportId?: string;
  narrative: string;
  isConflict?: boolean;
  conflictDetails?: string;
  stepOrder: number;
}

export interface IncidentMapMarker {
  id: string;
  incidentId: string;
  caseId: string;
  title: string;
  incidentType: string;
  date: string;
  time: string;
  address: string;
  coordinates: MapCoordinates;
  status: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  officerIds: string[];
}

export interface EvidenceMapMarker {
  id: string;
  evidenceId: string;
  caseId: string;
  title: string;
  itemType: string;
  recoveryDate: string;
  address: string;
  coordinates: MapCoordinates;
  recoveredByOfficerId: string;
}

export interface InvestigationMapState {
  activeEra: HistoricalEra;
  selectedLocationId: string | null;
  selectedVehicleId: string | null;
  selectedSightingId: string | null;
  selectedMarkerId: string | null;
  showDistricts: boolean;
  showStreets: boolean;
  showIncidentMarkers: boolean;
  showEvidenceMarkers: boolean;
  showVehicleRoutes: boolean;
  showGrid: boolean;
  searchQuery: string;
  activeFilterType: 'ALL' | 'CRIME_SCENE' | 'COMMERCIAL' | 'RESIDENTIAL' | 'INDUSTRIAL' | 'MUNICIPAL';
  zoom: number;
  pan: { x: number; y: number };
  discoveredLocationIds: string[];
  pinnedLocationIds: string[];
}
