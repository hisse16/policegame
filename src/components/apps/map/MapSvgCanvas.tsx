import React, { useRef, useState } from 'react';
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

const MAP_IMAGE = 'https://raw.githubusercontent.com/hisse16/policegame/main/Gemini_Generated_Image_3x2rto3x2rto3x2r.jpeg';
const MAP_WIDTH = 1060;
const MAP_HEIGHT = 720;

export const MapSvgCanvas: React.FC<MapSvgCanvasProps> = ({
  locations,
  sightings,
  incidents,
  evidence,
  activeEra,
  selectedLocationId,
  selectedSightingId,
  showVehicleRoutes,
  showIncidents,
  showEvidence,
  onSelectLocation,
  onSelectSighting,
  zoom,
  pan,
  onChangeZoom,
  onChangePan
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<{ title: string; subtitle: string; x: number; y: number } | null>(null);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    onChangePan({ x: event.clientX - dragStart.x, y: event.clientY - dragStart.y });
  };

  const stopDragging = () => setIsDragging(false);

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.1 : 0.9;
    onChangeZoom(Math.max(0.65, Math.min(2.5, zoom * factor)));
  };

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
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onWheel={handleWheel}
      onContextMenu={(event) => { event.preventDefault(); event.stopPropagation(); }}
      className="relative h-full w-full overflow-hidden bg-slate-200 select-none cursor-grab active:cursor-grabbing"
    >
      <style>{`
        .northbridge-static-map { width:100%; height:100%; }
        .northbridge-static-map svg { width:100%; height:100%; display:block; }
        .northbridge-location-label { paint-order:stroke; stroke:rgba(15,23,42,.78); stroke-width:4px; stroke-linejoin:round; }
      `}</style>

      <div className="absolute left-4 top-4 z-30 flex flex-col gap-1 rounded-xl border border-slate-300/80 bg-white/95 p-1 shadow-lg backdrop-blur-sm">
        <button type="button" onClick={() => onChangeZoom(Math.min(2.5, zoom + 0.2))} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100" title="Zoom in" aria-label="Zoom in">
          <Icon name="Plus" className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => onChangeZoom(Math.max(0.65, zoom - 0.2))} className="flex h-9 w-9 items-center justify-center rounded-lg border-t border-slate-200 text-slate-700 hover:bg-slate-100" title="Zoom out" aria-label="Zoom out">
          <Icon name="Minus" className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => { onChangeZoom(1); onChangePan({ x: 0, y: 0 }); }} className="flex h-8 w-9 items-center justify-center border-t border-slate-200 text-[9px] font-mono font-semibold text-slate-500 hover:bg-slate-100" title="Reset view" aria-label="Reset view">1:1</button>
      </div>

      <div className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-slate-300/80 bg-white/95 shadow-lg" title="North" aria-label="North">
        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border border-slate-300">
          <span className="absolute -top-1 text-[8px] font-bold text-slate-700">N</span>
          <span className="mt-1 text-sm text-red-600">▲</span>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 z-30 rounded-xl border border-slate-300/80 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700">
          <Icon name="Map" className="h-3.5 w-3.5 text-blue-600" />
          <span>NORTHBRIDGE · CASE 27</span>
        </div>
        <div className="mt-1 text-[9px] text-slate-500">{locations.length} locations · {activeEra} records</div>
      </div>

      <div className="northbridge-static-map absolute inset-0">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio="xMidYMid slice"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center', transition: isDragging ? 'none' : 'transform 120ms ease-out' }}
          role="img"
          aria-label="Northbridge city map"
        >
          <image href={MAP_IMAGE} x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} preserveAspectRatio="xMidYMid slice" />

          {showVehicleRoutes && taurusPathPoints && (
            <polyline points={taurusPathPoints} fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="10 7" strokeOpacity="0.72" />
          )}
          {showVehicleRoutes && capricePathPoints && (
            <polyline points={capricePathPoints} fill="none" stroke="#dc2626" strokeWidth="3" strokeDasharray="8 7" strokeOpacity="0.65" />
          )}

          {showVehicleRoutes && sortedSightings.map((s) => {
            const isSelected = s.id === selectedSightingId;
            const isTaurus = s.vehicleId === 'VEH-TXR481';
            return (
              <g key={s.id} onClick={(event) => { event.stopPropagation(); onSelectSighting(s.id); }} className="cursor-pointer">
                {(isSelected || s.isConflict) && <circle cx={s.coordinates.x} cy={s.coordinates.y} r={isSelected ? 18 : 14} fill="none" stroke={s.isConflict ? '#f59e0b' : '#2563eb'} strokeWidth="2.5" strokeOpacity="0.9" className="animate-pulse" />}
                <circle cx={s.coordinates.x} cy={s.coordinates.y} r="9" fill="#ffffff" fillOpacity="0.92" stroke={s.isConflict ? '#f59e0b' : isTaurus ? '#2563eb' : '#dc2626'} strokeWidth="2.5" />
                <text x={s.coordinates.x} y={s.coordinates.y + 3.5} textAnchor="middle" fill="#1e293b" fontSize="8" fontFamily="monospace" fontWeight="bold" className="pointer-events-none">{s.stepOrder}</text>
                <title>{`${s.time} · ${s.vehicleName} · ${s.locationName}`}</title>
              </g>
            );
          })}

          {showIncidents && incidents.map((incident) => (
            <g key={incident.id} onClick={(event) => event.stopPropagation()} className="cursor-pointer">
              <circle cx={incident.coordinates.x} cy={incident.coordinates.y} r="10" fill="#dc2626" fillOpacity="0.92" stroke="#fff" strokeWidth="2" />
              <text x={incident.coordinates.x} y={incident.coordinates.y + 4} textAnchor="middle" fill="#fff" fontSize="9" fontFamily="monospace" fontWeight="bold">!</text>
              <title>{incident.title}</title>
            </g>
          ))}

          {showEvidence && evidence.map((item) => (
            <g key={item.id} className="cursor-pointer">
              <rect x={item.coordinates.x - 7} y={item.coordinates.y - 7} width="14" height="14" rx="2" fill="#047857" fillOpacity="0.95" stroke="#fff" strokeWidth="2" transform={`rotate(45 ${item.coordinates.x} ${item.coordinates.y})`} />
              <title>{`${item.evidenceId}: ${item.title}`}</title>
            </g>
          ))}

          {locations.map((location) => {
            const isSelected = location.id === selectedLocationId;
            const historical = location.historicalStates.find((state) => state.era === activeEra) || location.historicalStates[0];
            return (
              <g
                key={location.id}
                onClick={(event) => { event.stopPropagation(); onSelectLocation(location.id); }}
                onMouseEnter={() => setHoveredItem({ title: location.name, subtitle: `${location.address} · ${historical?.statusDescription || 'ACTIVE'}`, x: location.coordinates.x, y: location.coordinates.y })}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer"
              >
                {isSelected && <circle cx={location.coordinates.x} cy={location.coordinates.y} r="25" fill={location.color} fillOpacity="0.16" stroke={location.color} strokeWidth="2.5" className="animate-pulse" />}
                <circle cx={location.coordinates.x} cy={location.coordinates.y} r={isSelected ? 13 : 10} fill="#fff" fillOpacity="0.96" stroke={location.color || '#2563eb'} strokeWidth={isSelected ? 3 : 2.5} />
                <circle cx={location.coordinates.x} cy={location.coordinates.y} r="5" fill={location.color || '#2563eb'} />
                <text x={location.coordinates.x} y={location.coordinates.y + 26} textAnchor="middle" fill="#fff" fontSize="11" fontFamily="Inter, Arial, sans-serif" fontWeight={isSelected ? '700' : '600'} className="northbridge-location-label pointer-events-none">{location.name.split(' (')[0]}</text>
              </g>
            );
          })}

          {hoveredItem && (
            <g transform={`translate(${Math.min(hoveredItem.x + 18, MAP_WIDTH - 250)}, ${Math.max(hoveredItem.y - 70, 20)})`} pointerEvents="none">
              <rect width="235" height="55" rx="8" fill="rgba(255,255,255,.97)" stroke="#cbd5e1" strokeWidth="1" />
              <text x="12" y="20" fill="#0f172a" fontSize="12" fontFamily="Inter, Arial, sans-serif" fontWeight="700">{hoveredItem.title}</text>
              <text x="12" y="39" fill="#64748b" fontSize="9.5" fontFamily="Inter, Arial, sans-serif">{hoveredItem.subtitle}</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
