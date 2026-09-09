import {
  NorthbridgeMapLocation,
  VehicleSightingPoint,
  HistoricalEra,
  InvestigationMapState,
  IncidentMapMarker,
  EvidenceMapMarker
} from '../../types/map';
import {
  NORTHBRIDGE_MAP_LOCATIONS,
  NORTHBRIDGE_DISTRICTS,
  NORTHBRIDGE_STREETS,
  VEHICLE_SIGHTINGS,
  INCIDENT_MAP_MARKERS,
  EVIDENCE_MAP_MARKERS
} from './northbridgeCityData';
import { policeDatabase } from './databaseEngine';

const STORAGE_KEY = 'npd_investigation_map_state_v1';

export class InvestigationMapEngine {
  private static instance: InvestigationMapEngine;
  private locations: NorthbridgeMapLocation[] = [];
  private sightings: VehicleSightingPoint[] = [...VEHICLE_SIGHTINGS];
  private incidents: IncidentMapMarker[] = [...INCIDENT_MAP_MARKERS];
  private evidence: EvidenceMapMarker[] = [...EVIDENCE_MAP_MARKERS];
  private activeEra: HistoricalEra = '2026';
  private selectedLocationId: string | null = 'LOC-0042';
  private selectedVehicleId: string | null = 'VEH-TXR481';
  private selectedSightingId: string | null = null;
  private activeFilter: 'ALL' | 'CRIME_SCENE' | 'COMMERCIAL' | 'RESIDENTIAL' | 'INDUSTRIAL' | 'MUNICIPAL' = 'ALL';
  private searchQuery = '';
  private zoom = 1;
  private pan = { x: 0, y: 0 };
  private listeners: Set<() => void> = new Set();
  private isInitialized = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): InvestigationMapEngine {
    if (!InvestigationMapEngine.instance) {
      InvestigationMapEngine.instance = new InvestigationMapEngine();
    }
    return InvestigationMapEngine.instance;
  }

  private initialize() {
    if (this.isInitialized) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeEra) this.activeEra = parsed.activeEra;
        if (parsed.selectedLocationId) this.selectedLocationId = parsed.selectedLocationId;
        if (parsed.selectedVehicleId) this.selectedVehicleId = parsed.selectedVehicleId;
        if (parsed.zoom) this.zoom = parsed.zoom;
        if (parsed.pan) this.pan = parsed.pan;
      }
    } catch (e) {
      console.warn('Failed to load investigation map state', e);
    }

    this.locations = JSON.parse(JSON.stringify(NORTHBRIDGE_MAP_LOCATIONS));
    this.isInitialized = true;
  }

  private save() {
    try {
      const state = {
        activeEra: this.activeEra,
        selectedLocationId: this.selectedLocationId,
        selectedVehicleId: this.selectedVehicleId,
        zoom: this.zoom,
        pan: this.pan,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save map state', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.save();
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        console.error('MapEngine listener error', e);
      }
    });
  }

  // --- Getters ---
  public getDistricts() {
    return NORTHBRIDGE_DISTRICTS;
  }

  public getStreets() {
    return NORTHBRIDGE_STREETS;
  }

  public getLocations(): NorthbridgeMapLocation[] {
    let list = [...this.locations];

    if (this.activeFilter !== 'ALL') {
      list = list.filter((l) => l.locationType === this.activeFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          l.districtName.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.knownOccupants.some((occ) => occ.toLowerCase().includes(q)) ||
          l.knownBusinesses.some((biz) => biz.toLowerCase().includes(q))
      );
    }

    return list;
  }

  public getLocation(id: string): NorthbridgeMapLocation | undefined {
    return this.locations.find((l) => l.id === id || l.recordId === id);
  }

  public getSightings(vehicleId?: string): VehicleSightingPoint[] {
    if (!vehicleId) return [...this.sightings];
    return this.sightings.filter((s) => s.vehicleId === vehicleId);
  }

  public getIncidents(): IncidentMapMarker[] {
    return [...this.incidents];
  }

  public getEvidence(): EvidenceMapMarker[] {
    return [...this.evidence];
  }

  public getActiveEra(): HistoricalEra {
    return this.activeEra;
  }

  public getSelectedLocationId(): string | null {
    return this.selectedLocationId;
  }

  public getSelectedVehicleId(): string | null {
    return this.selectedVehicleId;
  }

  public getSelectedSightingId(): string | null {
    return this.selectedSightingId;
  }

  public getZoom(): number {
    return this.zoom;
  }

  public getPan(): { x: number; y: number } {
    return this.pan;
  }

  public getActiveFilter(): string {
    return this.activeFilter;
  }

  public getSearchQuery(): string {
    return this.searchQuery;
  }

  // --- Setters / Actions ---
  public setActiveEra(era: HistoricalEra) {
    this.activeEra = era;
    this.notify();
  }

  public selectLocation(id: string | null) {
    this.selectedLocationId = id;
    if (id) {
      this.selectedSightingId = null;
    }
    this.notify();
  }

  public selectVehicle(vehicleId: string | null) {
    this.selectedVehicleId = vehicleId;
    this.notify();
  }

  public selectSighting(sightingId: string | null) {
    this.selectedSightingId = sightingId;
    if (sightingId) {
      const s = this.sightings.find((item) => item.id === sightingId);
      if (s) {
        this.selectedVehicleId = s.vehicleId;
      }
    }
    this.notify();
  }

  public setActiveFilter(filter: 'ALL' | 'CRIME_SCENE' | 'COMMERCIAL' | 'RESIDENTIAL' | 'INDUSTRIAL' | 'MUNICIPAL') {
    this.activeFilter = filter;
    this.notify();
  }

  public setSearchQuery(q: string) {
    this.searchQuery = q;
    this.notify();
  }

  public setZoom(zoom: number) {
    this.zoom = Math.max(0.7, Math.min(2.5, zoom));
    this.notify();
  }

  public setPan(pan: { x: number; y: number }) {
    this.pan = pan;
    this.notify();
  }

  public centerOnLocation(id: string) {
    const loc = this.getLocation(id);
    if (!loc) return;
    this.selectedLocationId = loc.id;
    // Pan so (loc.coordinates.x, loc.coordinates.y) is at center
    this.notify();
  }

  public pinLocationToBoard(locationId: string) {
    const loc = this.getLocation(locationId);
    if (!loc) return;

    loc.isBoardPinned = true;

    const hist = loc.historicalStates.find((h) => h.era === this.activeEra) || loc.historicalStates[0];

    policeDatabase.addBoardNode({
      id: `node_loc_${loc.id}`,
      recordId: loc.recordId || loc.id,
      nodeType: 'location',
      label: `LOC: ${loc.name}`,
      subtitle: `${loc.address} (${this.activeEra})`,
      x: 200 + Math.floor(Math.random() * 140),
      y: 180 + Math.floor(Math.random() * 140),
      color: loc.color || '#3b82f6',
      noteText: `[DISTRICT: ${loc.districtName}]\n[STATUS ${this.activeEra}: ${hist?.statusDescription || 'ACTIVE'}]\n\n${loc.description}\n\nKey Occupants: ${loc.knownOccupants.join(', ') || 'None'}`
    });

    this.notify();
  }
}

export const investigationMapEngine = InvestigationMapEngine.getInstance();
