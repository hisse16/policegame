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

export const InvestigationMapApp: React.FC<InvestigationMapAppProps> = ({
  windowId,
  initialLocationId,
  params
}) => {
  const [activeEra, setActiveEra] = useState<HistoricalEra>(investigationMapEngine.getActiveEra());
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    params?.locationId || initialLocationId || investigationMapEngine.getSelectedLocationId()
  );
  const [selectedSightingId, setSelectedSightingId] = useState<string | null>(
    params?.sightingId || investigationMapEngine.getSelectedSightingId()
  );
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRIME_SCENE' | 'COMMERCIAL' | 'RESIDENTIAL' | 'INDUSTRIAL' | 'MUNICIPAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState(params?.search || params?.locationQuery || '');
  const [activeTab, setActiveTab] = useState<'details' | 'timeline'>(params?.tab || (params?.sightingId ? 'timeline' : 'details'));

  // Layer toggles
  const [showDistricts, setShowDistricts] = useState(true);
  const [showStreets, setShowStreets] = useState(true);
  const [showVehicleRoutes, setShowVehicleRoutes] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showEvidence, setShowEvidence] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  // Zoom & pan
  const [zoom, setZoom] = useState(investigationMapEngine.getZoom());
  const [pan, setPan] = useState(investigationMapEngine.getPan());

  const centerOnLocation = (locId: string) => {
    const loc = investigationMapEngine.getLocation(locId);
    if (loc) {
      setPan({
        x: 400 - loc.coordinates.x * zoom,
        y: 350 - loc.coordinates.y * zoom
      });
    }
  };

  // Subscribe to MapEngine updates
  useEffect(() => {
    const unsub = investigationMapEngine.subscribe(() => {
      setActiveEra(investigationMapEngine.getActiveEra());
      setSelectedLocationId(investigationMapEngine.getSelectedLocationId());
      setSelectedSightingId(investigationMapEngine.getSelectedSightingId());
    });
    return unsub;
  }, []);

  // Handle routing / prop changes
  useEffect(() => {
    const locId = params?.locationId || initialLocationId;
    if (locId) {
      setSelectedLocationId(locId);
      investigationMapEngine.selectLocation(locId);
      setActiveTab('details');
      setTimeout(() => centerOnLocation(locId), 100);
    }
    if (params?.era) {
      handleSelectEra(params.era);
    }
    if (params?.search || params?.locationQuery) {
      setSearchQuery(params.search || params.locationQuery);
    }
    if (params?.tab) {
      setActiveTab(params.tab);
    }
    if (params?.sightingId) {
      setSelectedSightingId(params.sightingId);
      investigationMapEngine.selectSighting(params.sightingId);
      setActiveTab('timeline');
    }
  }, [params, initialLocationId]);

  const districts = useMemo(() => investigationMapEngine.getDistricts(), []);
  const streets = useMemo(() => investigationMapEngine.getStreets(), []);

  const locations = useMemo(() => {
    let list = investigationMapEngine.getLocations();
    if (activeFilter !== 'ALL') {
      list = list.filter((l) => l.locationType === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          l.districtName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeFilter, searchQuery]);

  const sightings = useMemo(() => investigationMapEngine.getSightings(), []);
  const incidents = useMemo(() => investigationMapEngine.getIncidents(), []);
  const evidence = useMemo(() => investigationMapEngine.getEvidence(), []);

  const selectedLocation = useMemo(() => {
    if (!selectedLocationId) return null;
    return investigationMapEngine.getLocation(selectedLocationId) || null;
  }, [selectedLocationId]);

  const handleSelectEra = (era: HistoricalEra) => {
    setActiveEra(era);
    investigationMapEngine.setActiveEra(era);
  };

  const handleSelectLocation = (id: string) => {
    setSelectedLocationId(id);
    setSelectedSightingId(null);
    investigationMapEngine.selectLocation(id);
    setActiveTab('details');
  };

  const handleSelectSighting = (id: string) => {
    setSelectedSightingId(id);
    investigationMapEngine.selectSighting(id);
    setActiveTab('timeline');
  };

  const handleFocusCoordinates = (x: number, y: number) => {
    // Center viewport on these coordinates
    const targetPanX = 530 - x;
    const targetPanY = 360 - y;
    setPan({ x: targetPanX * 0.7, y: targetPanY * 0.7 });
    setZoom(1.3);
  };

  const handlePinLocationToBoard = (locId: string) => {
    investigationMapEngine.pinLocationToBoard(locId);
  };

  const filterTypes: { id: typeof activeFilter; label: string }[] = [
    { id: 'ALL', label: 'All Sites' },
    { id: 'CRIME_SCENE', label: 'Crime Scenes' },
    { id: 'RESIDENTIAL', label: 'Residential' },
    { id: 'COMMERCIAL', label: 'Commercial' },
    { id: 'INDUSTRIAL', label: 'Industrial' },
    { id: 'MUNICIPAL', label: 'Municipal' }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* TOP COMMAND TOOLBAR */}
      <div className="h-13 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between gap-3 flex-shrink-0">
        {/* Left: App Title & Era Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Icon name="Map" className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold tracking-wider text-slate-100 block">
                NORTHBRIDGE GIS MAP
              </span>
              <span className="font-mono text-[9px] text-slate-400 block">
                MUNICIPAL POLICE GEOGRAPHIC DATABASE
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 mx-1" />

          {/* Historical Era Selector */}
          <HistoricalEraSelector activeEra={activeEra} onSelectEra={handleSelectEra} />
        </div>

        {/* Center: Search & Filter */}
        <div className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Icon name="Search" className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search address, landmark, resident..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as typeof activeFilter)}
            className="px-2 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
          >
            {filterTypes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Layer Toggles & Drawer Tab Selector */}
        <div className="flex items-center gap-2">
          {/* Layer toggles popup / buttons */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
            <button
              type="button"
              onClick={() => setShowDistricts(!showDistricts)}
              className={`px-2 py-1 rounded transition-colors ${
                showDistricts ? 'bg-blue-900/50 text-blue-300 font-semibold' : 'hover:text-slate-200'
              }`}
              title="Toggle District Boundaries"
            >
              Districts
            </button>
            <button
              type="button"
              onClick={() => setShowStreets(!showStreets)}
              className={`px-2 py-1 rounded transition-colors ${
                showStreets ? 'bg-blue-900/50 text-blue-300 font-semibold' : 'hover:text-slate-200'
              }`}
              title="Toggle Street Labels"
            >
              Streets
            </button>
            <button
              type="button"
              onClick={() => setShowVehicleRoutes(!showVehicleRoutes)}
              className={`px-2 py-1 rounded transition-colors ${
                showVehicleRoutes ? 'bg-blue-900/50 text-blue-300 font-semibold' : 'hover:text-slate-200'
              }`}
              title="Toggle Vehicle Trajectory Routes"
            >
              Routes
            </button>
          </div>

          {/* Drawer Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === 'details'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon name="Info" className="w-3 h-3" />
              <span>Dossier</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === 'timeline'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon name="Clock" className="w-3 h-3" />
              <span>Sightings ({sightings.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CANVAS + SIDE DRAWER */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* SVG Interactive Canvas */}
        <MapSvgCanvas
          districts={districts}
          streets={streets}
          locations={locations}
          sightings={sightings}
          incidents={incidents}
          evidence={evidence}
          activeEra={activeEra}
          selectedLocationId={selectedLocationId}
          selectedSightingId={selectedSightingId}
          showDistricts={showDistricts}
          showStreets={showStreets}
          showVehicleRoutes={showVehicleRoutes}
          showIncidents={showIncidents}
          showEvidence={showEvidence}
          showGrid={showGrid}
          onSelectLocation={handleSelectLocation}
          onSelectSighting={handleSelectSighting}
          zoom={zoom}
          pan={pan}
          onChangeZoom={setZoom}
          onChangePan={setPan}
        />

        {/* SIDE DRAWER: Details or Timeline */}
        {activeTab === 'details' && selectedLocation && (
          <LocationDetailDrawer
            location={selectedLocation}
            activeEra={activeEra}
            onClose={() => setSelectedLocationId(null)}
            onPinToBoard={handlePinLocationToBoard}
          />
        )}

        {activeTab === 'timeline' && (
          <div className="w-80 sm:w-96 flex flex-col h-full z-10 shadow-2xl">
            <VehicleRouteTimeline
              sightings={sightings}
              selectedSightingId={selectedSightingId}
              onSelectSighting={handleSelectSighting}
              onFocusCoordinates={handleFocusCoordinates}
            />
          </div>
        )}
      </div>
    </div>
  );
};
