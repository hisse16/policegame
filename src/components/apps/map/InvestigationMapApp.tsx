import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '../../common/Icon';
import { HistoricalEra } from '../../../types/map';
import { investigationMapEngine } from '../../../services/police/investigationMapEngine';
import { HistoricalEraSelector } from './HistoricalEraSelector';
import { MapSvgCanvas } from './MapSvgCanvas';
import { LocationDetailDrawer } from './LocationDetailDrawer';
import { VehicleRouteTimeline } from './VehicleRouteTimeline';

interface InvestigationMapAppProps {
  windowId?: string;
  initialLocationId?: string;
  params?: Record<string, any>;
}

type MapFilter = 'ALL' | 'CRIME_SCENE' | 'COMMERCIAL' | 'RESIDENTIAL' | 'INDUSTRIAL' | 'MUNICIPAL';
type MapTab = 'details' | 'timeline';

const MAP_VIEW_STORAGE_KEY = 'investigation_map_view_v2';

interface MapViewPreferences {
  activeFilter: MapFilter;
  searchQuery: string;
  activeTab: MapTab;
  showDistricts: boolean;
  showStreets: boolean;
  showVehicleRoutes: boolean;
  showIncidents: boolean;
  showEvidence: boolean;
  showGrid: boolean;
}

const loadMapViewPreferences = (): MapViewPreferences => {
  try {
    const stored = localStorage.getItem(MAP_VIEW_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        activeFilter: parsed.activeFilter || 'ALL',
        searchQuery: typeof parsed.searchQuery === 'string' ? parsed.searchQuery : '',
        activeTab: parsed.activeTab === 'timeline' ? 'timeline' : 'details',
        showDistricts: parsed.showDistricts ?? true,
        showStreets: parsed.showStreets ?? true,
        showVehicleRoutes: parsed.showVehicleRoutes ?? true,
        showIncidents: parsed.showIncidents ?? true,
        showEvidence: parsed.showEvidence ?? true,
        showGrid: parsed.showGrid ?? true
      };
    }
  } catch {
    // Ignore malformed view preferences.
  }
  return {
    activeFilter: 'ALL',
    searchQuery: '',
    activeTab: 'details',
    showDistricts: true,
    showStreets: true,
    showVehicleRoutes: true,
    showIncidents: true,
    showEvidence: true,
    showGrid: true
  };
};

export const InvestigationMapApp: React.FC<InvestigationMapAppProps> = ({ initialLocationId, params }) => {
  const savedView = useMemo(loadMapViewPreferences, []);
  const routeLocationId = params?.locationId || initialLocationId;
  const routeSightingId = params?.sightingId;

  const [activeEra, setActiveEra] = useState<HistoricalEra>(investigationMapEngine.getActiveEra());
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(routeLocationId || investigationMapEngine.getSelectedLocationId());
  const [selectedSightingId, setSelectedSightingId] = useState<string | null>(routeSightingId || investigationMapEngine.getSelectedSightingId());
  const [activeFilter, setActiveFilter] = useState<MapFilter>((params?.filter as MapFilter) || savedView.activeFilter);
  const [searchQuery, setSearchQuery] = useState(params?.search || params?.locationQuery || savedView.searchQuery);
  const [activeTab, setActiveTab] = useState<MapTab>((params?.tab as MapTab) || (routeSightingId ? 'timeline' : savedView.activeTab));
  const [showDistricts, setShowDistricts] = useState(savedView.showDistricts);
  const [showStreets, setShowStreets] = useState(savedView.showStreets);
  const [showVehicleRoutes, setShowVehicleRoutes] = useState(savedView.showVehicleRoutes);
  const [showIncidents, setShowIncidents] = useState(savedView.showIncidents);
  const [showEvidence, setShowEvidence] = useState(savedView.showEvidence);
  const [showGrid, setShowGrid] = useState(savedView.showGrid);
  const [zoom, setZoom] = useState(investigationMapEngine.getZoom());
  const [pan, setPan] = useState(investigationMapEngine.getPan());

  useEffect(() => {
    try {
      localStorage.setItem(MAP_VIEW_STORAGE_KEY, JSON.stringify({ activeFilter, searchQuery, activeTab, showDistricts, showStreets, showVehicleRoutes, showIncidents, showEvidence, showGrid } satisfies MapViewPreferences));
    } catch {
      // Ignore storage failures.
    }
  }, [activeFilter, searchQuery, activeTab, showDistricts, showStreets, showVehicleRoutes, showIncidents, showEvidence, showGrid]);

  const centerOnLocation = (locId: string) => {
    const loc = investigationMapEngine.getLocation(locId);
    if (!loc) return;
    const nextPan = { x: 530 - loc.coordinates.x * zoom, y: 360 - loc.coordinates.y * zoom };
    setPan(nextPan);
    investigationMapEngine.setPan(nextPan);
  };

  useEffect(() => {
    const unsub = investigationMapEngine.subscribe(() => {
      setActiveEra(investigationMapEngine.getActiveEra());
      setSelectedLocationId(investigationMapEngine.getSelectedLocationId());
      setSelectedSightingId(investigationMapEngine.getSelectedSightingId());
      setZoom(investigationMapEngine.getZoom());
      setPan(investigationMapEngine.getPan());
    });
    return unsub;
  }, []);

  // Apply only actual route changes. Avoid remount/render loops that reset the map.
  const routeSignature = JSON.stringify({
    locationId: routeLocationId || null,
    sightingId: routeSightingId || null,
    era: params?.era || null,
    search: params?.search || params?.locationQuery || null,
    tab: params?.tab || null,
    filter: params?.filter || null
  });

  useEffect(() => {
    if (routeLocationId) {
      setSelectedLocationId(routeLocationId);
      investigationMapEngine.selectLocation(routeLocationId);
      setActiveTab('details');
      window.setTimeout(() => centerOnLocation(routeLocationId), 0);
    }
    if (params?.era) investigationMapEngine.setActiveEra(params.era as HistoricalEra);
    if (params?.search || params?.locationQuery) {
      const nextSearch = params.search || params.locationQuery;
      setSearchQuery(nextSearch);
      investigationMapEngine.setSearchQuery(nextSearch);
    }
    if (params?.filter) {
      const nextFilter = params.filter as MapFilter;
      setActiveFilter(nextFilter);
      investigationMapEngine.setActiveFilter(nextFilter);
    }
    if (params?.tab) setActiveTab(params.tab as MapTab);
    if (routeSightingId) {
      setSelectedSightingId(routeSightingId);
      investigationMapEngine.selectSighting(routeSightingId);
      setActiveTab('timeline');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeSignature]);

  const districts = useMemo(() => investigationMapEngine.getDistricts(), []);
  const streets = useMemo(() => investigationMapEngine.getStreets(), []);

  const locations = useMemo(() => {
    let list = investigationMapEngine.getLocations();
    if (activeFilter !== 'ALL') list = list.filter((l) => l.locationType === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((l) => l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q) || l.districtName.toLowerCase().includes(q));
    }
    return list;
  }, [activeFilter, searchQuery]);

  const sightings = useMemo(() => investigationMapEngine.getSightings(), []);
  const incidents = useMemo(() => investigationMapEngine.getIncidents(), []);
  const evidence = useMemo(() => investigationMapEngine.getEvidence(), []);

  const selectedLocation = useMemo(() => selectedLocationId ? investigationMapEngine.getLocation(selectedLocationId) || null : null, [selectedLocationId]);

  const handleSelectEra = (era: HistoricalEra) => {
    setActiveEra(era);
    investigationMapEngine.setActiveEra(era);
  };

  const handleSelectLocation = (id: string) => {
    setSelectedLocationId(id);
    setSelectedSightingId(null);
    setActiveTab('details');
    investigationMapEngine.selectLocation(id);
  };

  const handleSelectSighting = (id: string) => {
    setSelectedSightingId(id);
    setActiveTab('timeline');
    investigationMapEngine.selectSighting(id);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    investigationMapEngine.setSearchQuery(value);
  };

  const handleFilterChange = (value: MapFilter) => {
    setActiveFilter(value);
    investigationMapEngine.setActiveFilter(value);
  };

  const handleZoomChange = (value: number) => {
    const next = Math.max(0.7, Math.min(2.5, value));
    setZoom(next);
    investigationMapEngine.setZoom(next);
  };

  const handlePanChange = (value: { x: number; y: number }) => {
    setPan(value);
    investigationMapEngine.setPan(value);
  };

  const handleFocusCoordinates = (x: number, y: number) => {
    const nextZoom = 1.3;
    const nextPan = { x: 530 - x * nextZoom, y: 360 - y * nextZoom };
    setZoom(nextZoom);
    setPan(nextPan);
    investigationMapEngine.setZoom(nextZoom);
    investigationMapEngine.setPan(nextPan);
  };

  const handlePinLocationToBoard = (locId: string) => investigationMapEngine.pinLocationToBoard(locId);

  const filterTypes: { id: MapFilter; label: string }[] = [
    { id: 'ALL', label: 'All Sites' },
    { id: 'CRIME_SCENE', label: 'Crime Scenes' },
    { id: 'RESIDENTIAL', label: 'Residential' },
    { id: 'COMMERCIAL', label: 'Commercial' },
    { id: 'INDUSTRIAL', label: 'Industrial' },
    { id: 'MUNICIPAL', label: 'Municipal' }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      <div className="h-13 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400"><Icon name="Map" className="w-4 h-4" /></div>
            <div><span className="font-mono text-xs font-bold tracking-wider text-slate-100 block">NORTHBRIDGE GIS MAP</span><span className="font-mono text-[9px] text-slate-400 block">MUNICIPAL POLICE GEOGRAPHIC DATABASE</span></div>
          </div>
          <div className="h-6 w-px bg-slate-800 mx-1" />
          <HistoricalEraSelector activeEra={activeEra} onSelectEra={handleSelectEra} />
        </div>

        <div className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1"><Icon name="Search" className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" /><input type="text" placeholder="Search address, landmark, resident..." value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono" /></div>
          <select value={activeFilter} onChange={(e) => handleFilterChange(e.target.value as MapFilter)} className="px-2 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500">
            {filterTypes.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
            <button type="button" onClick={() => setShowDistricts((v) => !v)} className={`px-2 py-1 rounded transition-colors ${showDistricts ? 'bg-blue-900/50 text-blue-300 font-semibold' : 'hover:text-slate-200'}`}>Districts</button>
            <button type="button" onClick={() => setShowStreets((v) => !v)} className={`px-2 py-1 rounded transition-colors ${showStreets ? 'bg-blue-900/50 text-blue-300 font-semibold' : 'hover:text-slate-200'}`}>Streets</button>
            <button type="button" onClick={() => setShowVehicleRoutes((v) => !v)} className={`px-2 py-1 rounded transition-colors ${showVehicleRoutes ? 'bg-blue-900/50 text-blue-300 font-semibold' : 'hover:text-slate-200'}`}>Routes</button>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button type="button" onClick={() => setActiveTab('details')} className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${activeTab === 'details' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}><Icon name="Info" className="w-3 h-3" /><span>Dossier</span></button>
            <button type="button" onClick={() => setActiveTab('timeline')} className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${activeTab === 'timeline' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}><Icon name="Clock" className="w-3 h-3" /><span>Sightings ({sightings.length})</span></button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <MapSvgCanvas districts={districts} streets={streets} locations={locations} sightings={sightings} incidents={incidents} evidence={evidence} activeEra={activeEra} selectedLocationId={selectedLocationId} selectedSightingId={selectedSightingId} showDistricts={showDistricts} showStreets={showStreets} showVehicleRoutes={showVehicleRoutes} showIncidents={showIncidents} showEvidence={showEvidence} showGrid={showGrid} onSelectLocation={handleSelectLocation} onSelectSighting={handleSelectSighting} zoom={zoom} pan={pan} onChangeZoom={handleZoomChange} onChangePan={handlePanChange} />

        {activeTab === 'details' && selectedLocation && <LocationDetailDrawer location={selectedLocation} activeEra={activeEra} onClose={() => setSelectedLocationId(null)} onPinToBoard={handlePinLocationToBoard} />}
        {activeTab === 'timeline' && <div className="w-80 sm:w-96 flex flex-col h-full z-10 shadow-2xl"><VehicleRouteTimeline sightings={sightings} selectedSightingId={selectedSightingId} onSelectSighting={handleSelectSighting} onFocusCoordinates={handleFocusCoordinates} /></div>}
      </div>
    </div>
  );
};
