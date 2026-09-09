import React, { useRef, useState, useEffect } from 'react';
import {
  NorthbridgeDistrict,
  NorthbridgeStreet,
  NorthbridgeMapLocation,
  VehicleSightingPoint,
  IncidentMapMarker,
  EvidenceMapMarker,
  HistoricalEra
} from '../../../types/map';
import { Icon } from '../../common/Icon';

interface MapSvgCanvasProps {
  districts: NorthbridgeDistrict[];
  streets: NorthbridgeStreet[];
  locations: NorthbridgeMapLocation[];
  sightings: VehicleSightingPoint[];
  incidents: IncidentMapMarker[];
  evidence: EvidenceMapMarker[];
  activeEra: HistoricalEra;
  selectedLocationId: string | null;
  selectedSightingId: string | null;
  showDistricts: boolean;
  showStreets: boolean;
  showVehicleRoutes: boolean;
  showIncidents: boolean;
  showEvidence: boolean;
  showGrid: boolean;
  onSelectLocation: (id: string) => void;
  onSelectSighting: (id: string) => void;
  zoom: number;
  pan: { x: number; y: number };
  onChangeZoom: (zoom: number) => void;
  onChangePan: (pan: { x: number; y: number }) => void;
}

export const MapSvgCanvas: React.FC<MapSvgCanvasProps> = ({
  districts,
  streets,
  locations,
  sightings,
  incidents,
  evidence,
  activeEra,
  selectedLocationId,
  selectedSightingId,
  showDistricts,
  showStreets,
  showVehicleRoutes,
  showIncidents,
  showEvidence,
  showGrid,
  onSelectLocation,
  onSelectSighting,
  zoom,
  pan,
  onChangeZoom,
  onChangePan
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<{
    title: string;
    subtitle: string;
    x: number;
    y: number;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left click on canvas background
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    onChangePan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.max(0.6, Math.min(2.5, zoom * zoomFactor));
    onChangeZoom(newZoom);
  };

  // Build route polyline points for vehicle sightings
  const sortedSightings = [...sightings].sort((a, b) => a.stepOrder - b.stepOrder);
  const taurusSightings = sortedSightings.filter((s) => s.vehicleId === 'VEH-TXR481');
  const capriceSightings = sortedSightings.filter((s) => s.vehicleId === 'VEH-KLY902');

  const taurusPathPoints = taurusSightings.map((s) => `${s.coordinates.x},${s.coordinates.y}`).join(' ');
  const capricePathPoints = capriceSightings.map((s) => `${s.coordinates.x},${s.coordinates.y}`).join(' ');

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className="flex-1 w-full h-full bg-[#080d16] relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
    >
      {/* HUD Zoom Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 shadow-xl backdrop-blur-xs">
        <button
          type="button"
          onClick={() => onChangeZoom(Math.min(2.5, zoom + 0.2))}
          className="w-7 h-7 rounded flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono"
          title="Zoom In"
        >
          <Icon name="Plus" className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onChangeZoom(Math.max(0.6, zoom - 0.2))}
          className="w-7 h-7 rounded flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono"
          title="Zoom Out"
        >
          <Icon name="Minus" className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            onChangeZoom(1);
            onChangePan({ x: 0, y: 0 });
          }}
          className="w-7 h-7 rounded flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[10px] font-mono"
          title="Reset View"
        >
          1:1
        </button>
      </div>

      {/* Mini Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-950/85 px-3 py-2 rounded-lg border border-slate-800 shadow-xl text-[10px] font-mono text-slate-400 space-y-1 backdrop-blur-xs">
        <div className="text-slate-200 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Icon name="Compass" className="w-3 h-3 text-blue-400" />
          <span>GIS Grid Northbridge</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>Ford Taurus Route (TXR-481)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>Caprice Sedan (KLY-902)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
          <span>Contradiction Sighting</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1060 720"
        className="w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '530px 360px',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30, 41, 59, 0.4)" strokeWidth="1" />
          </pattern>

          {/* Water body gradient */}
          <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#082f49" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.65" />
          </linearGradient>

          {/* Arrow markers for route lines */}
          <marker
            id="arrow-blue"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
          </marker>
          <marker
            id="arrow-red"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#ef4444" />
          </marker>

          {/* Glow filters */}
          <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background base */}
        <rect x="0" y="0" width="1060" height="720" fill="#090e17" />

        {/* Grid lines */}
        {showGrid && <rect x="40" y="40" width="980" height="640" fill="url(#grid-pattern)" />}

        {/* Water Bodies: Grand Harbor Shoreline & Wetlands Tidal Sluice */}
        <path
          d="M 660 60 Q 720 180 840 280 T 960 660 L 1020 660 L 1020 60 Z"
          fill="url(#waterGrad)"
          stroke="#0369a1"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
        {/* Canal Water Ribbon */}
        <path
          d="M 530 340 Q 640 440 840 600"
          fill="none"
          stroke="#0284c7"
          strokeWidth="12"
          strokeOpacity="0.35"
          strokeLinecap="round"
        />

        {/* District Polygons */}
        {showDistricts &&
          districts.map((d) => (
            <g key={d.id} className="transition-opacity duration-200">
              <path
                d={d.path}
                fill={d.color}
                fillOpacity="0.08"
                stroke={d.color}
                strokeWidth="1.5"
                strokeDasharray="4,4"
                strokeOpacity="0.45"
              />
              <text
                x={d.center.x}
                y={d.center.y}
                textAnchor="middle"
                fill={d.color}
                fillOpacity="0.4"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="2"
                className="select-none pointer-events-none uppercase"
              >
                {d.name} ({d.wardNumber})
              </text>
            </g>
          ))}

        {/* Street Lines */}
        {showStreets && (
          <g>
            {streets.map((st) => (
              <g key={st.id}>
                {/* Casing stroke */}
                <path
                  d={st.path}
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth={st.width + 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Main street fill */}
                <path
                  d={st.path}
                  fill="none"
                  stroke="#334155"
                  strokeWidth={st.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.8"
                />
                {/* Street Label */}
                <text
                  x={st.labelPos.x}
                  y={st.labelPos.y}
                  transform={
                    st.labelPos.angle
                      ? `rotate(${st.labelPos.angle}, ${st.labelPos.x}, ${st.labelPos.y})`
                      : undefined
                  }
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="pointer-events-none select-none font-semibold"
                >
                  {st.name}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* Vehicle Trajectory Routes */}
        {showVehicleRoutes && (
          <g>
            {/* Ford Taurus path */}
            {taurusPathPoints && (
              <polyline
                points={taurusPathPoints}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="6,4"
                strokeOpacity="0.75"
                markerEnd="url(#arrow-blue)"
              />
            )}

            {/* Caprice Sedan path */}
            {capricePathPoints && (
              <polyline
                points={capricePathPoints}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="4,4"
                strokeOpacity="0.65"
                markerEnd="url(#arrow-red)"
              />
            )}

            {/* Sighting Step Circles */}
            {sortedSightings.map((s) => {
              const isSelected = s.id === selectedSightingId;
              const isTaurus = s.vehicleId === 'VEH-TXR481';

              return (
                <g
                  key={s.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSighting(s.id);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Outer pulse if selected or conflict */}
                  {(isSelected || s.isConflict) && (
                    <circle
                      cx={s.coordinates.x}
                      cy={s.coordinates.y}
                      r={isSelected ? 18 : 14}
                      fill="none"
                      stroke={s.isConflict ? '#f59e0b' : '#38bdf8'}
                      strokeWidth="2"
                      strokeOpacity="0.8"
                      className="animate-pulse"
                    />
                  )}

                  {/* Circle marker */}
                  <circle
                    cx={s.coordinates.x}
                    cy={s.coordinates.y}
                    r="9"
                    fill={s.isConflict ? '#78350f' : isTaurus ? '#0c4a6e' : '#7f1d1d'}
                    stroke={s.isConflict ? '#f59e0b' : isTaurus ? '#38bdf8' : '#ef4444'}
                    strokeWidth="2"
                  />

                  {/* Step number inside circle */}
                  <text
                    x={s.coordinates.x}
                    y={s.coordinates.y + 3.5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {s.stepOrder}
                  </text>

                  {/* Tooltip on hover */}
                  <title>{`${s.time} - ${s.vehicleName}: ${s.locationName}`}</title>
                </g>
              );
            })}
          </g>
        )}

        {/* Incident Map Markers */}
        {showIncidents &&
          incidents.map((inc) => (
            <g
              key={inc.id}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="cursor-pointer"
            >
              <polygon
                points={`${inc.coordinates.x},${inc.coordinates.y - 12} ${
                  inc.coordinates.x + 10
                },${inc.coordinates.y + 6} ${inc.coordinates.x - 10},${inc.coordinates.y + 6}`}
                fill="#b91c1c"
                stroke="#fca5a5"
                strokeWidth="1.5"
              />
              <text
                x={inc.coordinates.x}
                y={inc.coordinates.y + 4}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                !
              </text>
            </g>
          ))}

        {/* Evidence Markers */}
        {showEvidence &&
          evidence.map((ev) => (
            <g key={ev.id} className="cursor-pointer">
              <rect
                x={ev.coordinates.x - 7}
                y={ev.coordinates.y - 7}
                width="14"
                height="14"
                fill="#065f46"
                stroke="#34d399"
                strokeWidth="1.5"
                transform={`rotate(45, ${ev.coordinates.x}, ${ev.coordinates.y})`}
              />
              <title>{`${ev.evidenceId}: ${ev.title}`}</title>
            </g>
          ))}

        {/* Primary Location Markers */}
        {locations.map((loc) => {
          const isSelected = loc.id === selectedLocationId;
          const hist =
            loc.historicalStates.find((h) => h.era === activeEra) || loc.historicalStates[0];

          return (
            <g
              key={loc.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectLocation(loc.id);
              }}
              onMouseEnter={() => {
                setHoveredItem({
                  title: loc.name,
                  subtitle: `${loc.districtName} • ${hist?.statusDescription || 'ACTIVE'}`,
                  x: loc.coordinates.x,
                  y: loc.coordinates.y
                });
              }}
              onMouseLeave={() => setHoveredItem(null)}
              className="cursor-pointer group"
            >
              {/* Outer halo ring for selected location */}
              {isSelected && (
                <circle
                  cx={loc.coordinates.x}
                  cy={loc.coordinates.y}
                  r="24"
                  fill="none"
                  stroke={loc.color}
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  className="animate-spin"
                  style={{ animationDuration: '8s' }}
                />
              )}

              {/* Marker pin background */}
              <circle
                cx={loc.coordinates.x}
                cy={loc.coordinates.y}
                r={isSelected ? '14' : '11'}
                fill="#0f172a"
                stroke={loc.color}
                strokeWidth={isSelected ? '2.5' : '2'}
                filter={isSelected ? 'url(#glow-blue)' : undefined}
                className="transition-all duration-150 group-hover:scale-110"
              />

              {/* Small center dot */}
              <circle
                cx={loc.coordinates.x}
                cy={loc.coordinates.y}
                r="4.5"
                fill={loc.color}
                className="transition-transform duration-150 group-hover:scale-125"
              />

              {/* Location Name Tag */}
              <text
                x={loc.coordinates.x}
                y={loc.coordinates.y + 22}
                textAnchor="middle"
                fill={isSelected ? '#f8fafc' : '#cbd5e1'}
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight={isSelected ? 'bold' : '500'}
                className="select-none pointer-events-none filter drop-shadow-md"
              >
                {loc.name.split(' (')[0]}
              </text>

              {/* Crime scene badge if applicable */}
              {loc.locationType === 'CRIME_SCENE' && (
                <text
                  x={loc.coordinates.x}
                  y={loc.coordinates.y - 16}
                  textAnchor="middle"
                  fill="#f87171"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="select-none pointer-events-none uppercase"
                >
                  [ CRIME SCENE ]
                </text>
              )}
            </g>
          );
        })}

        {/* Hover Tooltip Card */}
        {hoveredItem && (
          <g transform={`translate(${hoveredItem.x + 15}, ${hoveredItem.y - 30})`}>
            <rect
              x="0"
              y="0"
              width="210"
              height="44"
              rx="4"
              fill="#020617"
              stroke="#334155"
              strokeWidth="1"
              opacity="0.95"
            />
            <text
              x="8"
              y="16"
              fill="#f1f5f9"
              fontSize="10"
              fontFamily="sans-serif"
              fontWeight="bold"
            >
              {hoveredItem.title.length > 28
                ? `${hoveredItem.title.substring(0, 26)}...`
                : hoveredItem.title}
            </text>
            <text
              x="8"
              y="32"
              fill="#94a3b8"
              fontSize="8"
              fontFamily="monospace"
            >
              {hoveredItem.subtitle.length > 34
                ? `${hoveredItem.subtitle.substring(0, 32)}...`
                : hoveredItem.subtitle}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
