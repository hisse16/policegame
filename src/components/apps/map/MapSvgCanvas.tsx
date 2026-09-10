import React, { useMemo, useRef, useState } from 'react';
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

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 700;

// The city is deliberately vector-based rather than an AI-generated bitmap. This keeps
// roads, water, blocks and buildings crisp at every zoom level and makes the six Case 27
// locations line up with a stable fictional Northbridge geography.
const WATER_PATHS = [
  'M0 0 H1000 V112 C920 125 860 120 790 135 C700 155 650 160 580 145 C490 125 410 118 315 132 C205 150 95 142 0 155 Z',
  'M760 150 C835 155 905 150 1000 135 V700 H815 C790 650 810 600 800 550 C790 490 815 430 800 375 C785 315 810 250 790 205 Z',
  'M475 700 C490 665 510 635 505 600 C500 570 520 545 548 530 C575 516 605 520 620 545 C638 575 622 600 615 630 C608 658 625 680 650 700 Z'
];

const PARKS = [
  { x: 45, y: 185, w: 170, h: 115 },
  { x: 245, y: 145, w: 105, h: 80 },
  { x: 120, y: 330, w: 105, h: 75 },
  { x: 310, y: 285, w: 90, h: 55 },
  { x: 560, y: 180, w: 80, h: 55 }
];

const MAIN_ROADS = [
  { name: 'Grand Avenue', points: '50,390 230,382 410,375 590,365 755,350', width: 20, label: [430, 357], angle: -5 },
  { name: '4th Avenue', points: '250,90 255,190 260,300 275,390 300,500', width: 15, label: [238, 245], angle: 88 },
  { name: 'Willow Street', points: '85,250 180,245 255,250 350,250', width: 10, label: [180, 235], angle: 0 },
  { name: 'Waterfront Way', points: '610,205 710,215 805,225 925,235', width: 16, label: [760, 210], angle: 4 },
  { name: 'Freight Terminal Road', points: '650,330 730,365 805,420 870,505', width: 18, label: [770, 395], angle: 38 },
  { name: 'Canal Road', points: '500,420 560,470 590,525 600,585 620,660', width: 13, label: [585, 560], angle: 70 },
  { name: 'Lower Shore Parkway', points: '40,610 180,625 320,640 450,655 560,665', width: 18, label: [290, 635], angle: 8 }
];

const SECONDARY_ROADS = [
  '70,205 145,210 215,215 300,210 370,205 440,210',
  '65,285 140,285 215,290 295,285 370,290 430,285',
  '85,320 150,315 220,320 290,315 365,320',
  '120,445 200,440 280,445 355,440 420,445 475,440',
  '130,500 205,495 285,500 355,495 420,500',
  '340,175 400,180 460,175 525,180 585,175',
  '355,225 420,230 490,225 550,230 615,225',
  '350,300 420,295 485,300 550,295 610,300',
  '390,430 450,425 510,430 575,425 640,430',
  '420,470 480,465 540,470 605,465 675,470',
  '625,275 690,280 755,275 825,280 915,275',
  '650,310 715,315 780,310 845,315 925,310',
  '715,470 775,465 835,470 900,465 950,470',
  '735,535 790,530 850,535 915,530 960,535',
  '680,575 735,570 790,575 850,570 925,575'
];

const BUILDING_BLOCKS = [
  { x: 370, y: 155, w: 170, h: 100, cols: 5, rows: 3 },
  { x: 410, y: 270, w: 185, h: 75, cols: 6, rows: 2 },
  { x: 315, y: 410, w: 135, h: 90, cols: 4, rows: 3 },
  { x: 465, y: 395, w: 120, h: 95, cols: 4, rows: 3 },
  { x: 615, y: 245, w: 125, h: 80, cols: 4, rows: 2 },
  { x: 790, y: 260, w: 130, h: 70, cols: 4, rows: 2 },
  { x: 720, y: 495, w: 130, h: 75, cols: 3, rows: 2 },
  { x: 855, y: 555, w: 90, h: 70, cols: 2, rows: 2 }
];

const RESIDENTIAL_HOMES = [
  [70, 220], [115, 220], [160, 220], [205, 220], [300, 215], [345, 215],
  [80, 265], [125, 265], [175, 270], [305, 270], [350, 270],
  [80, 355], [130, 355], [180, 360], [325, 350], [375, 350],
  [90, 430], [140, 430], [190, 435], [240, 430], [90, 475], [145, 475], [200, 480], [250, 475]
];

const STORY_POSITION_OVERRIDES: Array<[string, number, number]> = [
  ['42 Willow Street', 220, 245],
  ['612 Grand Avenue', 430, 375],
  ['104 Waterfront Way', 735, 225],
  ['18 Freight Terminal Road', 850, 465],
  ['400 Canal Road', 620, 585],
  ['Canal Road / East Culvert', 650, 635]
];

const getMapPosition = (location: NorthbridgeMapLocation): { x: number; y: number } => {
  const match = STORY_POSITION_OVERRIDES.find(([address]) => location.address.toLowerCase().includes(address.toLowerCase()));
  if (match) return { x: match[1], y: match[2] };
  return { x: Math.max(25, Math.min(975, location.coordinates.x)), y: Math.max(25, Math.min(675, location.coordinates.y)) };
};

const pointList = (points: string) => points.split(' ').map((pair) => pair.split(',').map(Number) as [number, number]);

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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<{ title: string; subtitle: string; x: number; y: number } | null>(null);
  const dragMoved = useRef(false);

  const sortedSightings = useMemo(() => [...sightings].sort((a, b) => a.stepOrder - b.stepOrder), [sightings]);
  const taurusSightings = sortedSightings.filter((s) => s.vehicleId === 'VEH-TXR481');
  const capriceSightings = sortedSightings.filter((s) => s.vehicleId === 'VEH-KLY902');
  const taurusPathPoints = taurusSightings.map((s) => `${s.coordinates.x},${s.coordinates.y}`).join(' ');
  const capricePathPoints = capriceSightings.map((s) => `${s.coordinates.x},${s.coordinates.y}`).join(' ');

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button !== 0) return;
    setIsDragging(true);
    dragMoved.current = false;
    setDragStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    const next = { x: event.clientX - dragStart.x, y: event.clientY - dragStart.y };
    if (Math.abs(next.x - pan.x) > 3 || Math.abs(next.y - pan.y) > 3) dragMoved.current = true;
    onChangePan(next);
  };

  const stopDragging = () => setIsDragging(false);

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.1 : 0.9;
    onChangeZoom(Math.max(0.7, Math.min(2.5, zoom * factor)));
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onWheel={handleWheel}
      onContextMenu={(event) => { event.preventDefault(); event.stopPropagation(); }}
      className="relative h-full w-full overflow-hidden bg-[#dfe9df] select-none cursor-grab active:cursor-grabbing"
    >
      <style>{`
        .northbridge-map svg { width:100%; height:100%; display:block; }
        .map-label { paint-order:stroke; stroke:rgba(255,255,255,.92); stroke-width:4px; stroke-linejoin:round; }
        .map-road-label { paint-order:stroke; stroke:rgba(255,255,255,.9); stroke-width:5px; stroke-linejoin:round; }
        .map-water-label { letter-spacing:.16em; }
        .map-building { fill:#d7d2c9; stroke:#b5afa5; stroke-width:1; }
        .map-house { fill:#ebe4d8; stroke:#b9b09f; stroke-width:1; }
      `}</style>

      <div className="absolute left-4 top-4 z-30 flex flex-col gap-1 rounded-xl border border-slate-300/80 bg-white/95 p-1 shadow-lg backdrop-blur-sm">
        <button type="button" onClick={() => onChangeZoom(Math.min(2.5, zoom + 0.2))} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100" title="Zoom in" aria-label="Zoom in"><Icon name="Plus" className="h-4 w-4" /></button>
        <button type="button" onClick={() => onChangeZoom(Math.max(0.7, zoom - 0.2))} className="flex h-9 w-9 items-center justify-center rounded-lg border-t border-slate-200 text-slate-700 hover:bg-slate-100" title="Zoom out" aria-label="Zoom out"><Icon name="Minus" className="h-4 w-4" /></button>
        <button type="button" onClick={() => { onChangeZoom(1); onChangePan({ x: 0, y: 0 }); }} className="flex h-8 w-9 items-center justify-center border-t border-slate-200 text-[9px] font-mono font-semibold text-slate-500 hover:bg-slate-100" title="Reset view" aria-label="Reset view">1:1</button>
      </div>

      <div className="absolute left-4 top-32 z-30 rounded-full border border-slate-300/90 bg-white/95 shadow-lg" title="North" aria-label="North">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <span className="absolute top-1 text-[9px] font-bold text-slate-700">N</span>
          <span className="mt-2 text-base text-red-600">▲</span>
          <span className="absolute bottom-1 text-[8px] text-slate-400">S</span>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 z-30 rounded-xl border border-slate-300/80 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700"><Icon name="Map" className="h-3.5 w-3.5 text-blue-600" /><span>NORTHBRIDGE · CASE 27</span></div>
        <div className="mt-1 text-[9px] text-slate-500">Vector GIS · {locations.length} locations · {activeEra} records</div>
      </div>

      <div className="northbridge-map absolute inset-0">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio="xMidYMid slice"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center', transition: isDragging ? 'none' : 'transform 120ms ease-out' }}
          role="img"
          aria-label="Northbridge modern vector city map"
        >
          <rect width="1000" height="700" fill="#edf1e8" />

          {WATER_PATHS.map((path, index) => <path key={`water-${index}`} d={path} fill="#b9d9e5" stroke="#9fc7d4" strokeWidth="2" />)}
          <path d="M800 150 C870 170 925 175 1000 165" fill="none" stroke="#8ebdcb" strokeWidth="2" />
          <path d="M808 205 C875 220 930 225 1000 215" fill="none" stroke="#8ebdcb" strokeWidth="2" />
          <text x="875" y="105" fill="#5e96a7" fontSize="18" fontFamily="Inter, Arial" className="map-water-label">NORTHBRIDGE BAY</text>
          <text x="552" y="595" fill="#5e96a7" fontSize="12" fontFamily="Inter, Arial" transform="rotate(-68 552 595)" className="map-water-label">INDUSTRIAL CANAL</text>

          {PARKS.map((park, index) => (
            <g key={`park-${index}`}>
              <rect x={park.x} y={park.y} width={park.w} height={park.h} rx="8" fill="#cfe1c8" stroke="#b4cdb0" strokeWidth="1.5" />
              <circle cx={park.x + 25} cy={park.y + 28} r="8" fill="#a9c59f" />
              <circle cx={park.x + 52} cy={park.y + 45} r="7" fill="#a9c59f" />
              <circle cx={park.x + 80} cy={park.y + 22} r="6" fill="#a9c59f" />
            </g>
          ))}

          {/* Residential houses in Willow / 4th District */}
          {RESIDENTIAL_HOMES.map(([x, y], index) => (
            <g key={`home-${index}`}>
              <rect className="map-house" x={x} y={y} width="27" height="20" rx="2" />
              <path d={`M${x - 2} ${y} L${x + 13.5} ${y - 9} L${x + 29} ${y} Z`} fill="#c7b7a3" stroke="#a99b89" strokeWidth="1" />
              <rect x={x + 5} y={y + 8} width="5" height="5" fill="#a8c7d3" />
              <circle cx={x + 22} cy={y + 24} r="5" fill="#9fbd95" />
            </g>
          ))}

          {/* Downtown and industrial building footprints */}
          {BUILDING_BLOCKS.map((block, blockIndex) => {
            const bw = block.w / block.cols - 7;
            const bh = block.h / block.rows - 7;
            return Array.from({ length: block.cols * block.rows }).map((_, index) => {
              const col = index % block.cols;
              const row = Math.floor(index / block.cols);
              const x = block.x + col * (block.w / block.cols) + 3;
              const y = block.y + row * (block.h / block.rows) + 3;
              const tall = blockIndex < 5 && index % 4 === 0;
              return <rect key={`building-${blockIndex}-${index}`} className="map-building" x={x} y={y} width={bw} height={bh * (tall ? 1.12 : 1)} rx="2" />;
            });
          })}

          {/* Harbor warehouses and container yard */}
          <g>
            {[0, 1, 2, 3].map((i) => <rect key={`warehouse-${i}`} x={820 + i * 35} y={340} width="27" height="70" rx="2" fill="#c7c5be" stroke="#999b96" />)}
            {Array.from({ length: 30 }).map((_, i) => {
              const x = 790 + (i % 6) * 22;
              const y = 430 + Math.floor(i / 6) * 16;
              return <rect key={`container-${i}`} x={x} y={y} width="18" height="11" rx="1" fill={i % 3 === 0 ? '#aeb8bf' : '#c7c1b7'} stroke="#9ba2a6" />;
            })}
            <path d="M800 520 H955 M800 540 H955 M800 560 H955" stroke="#aab5b8" strokeWidth="2" />
          </g>

          {/* Roads: realistic layered carriageways, sidewalks and center lines */}
          {MAIN_ROADS.map((road) => {
            const pts = pointList(road.points);
            const d = `M${pts.map(([x, y]) => `${x} ${y}`).join(' L')}`;
            return (
              <g key={road.name}>
                <path d={d} fill="none" stroke="#c4c4bd" strokeWidth={road.width + 8} strokeLinecap="round" strokeLinejoin="round" />
                <path d={d} fill="none" stroke="#f8f7f2" strokeWidth={road.width} strokeLinecap="round" strokeLinejoin="round" />
                <path d={d} fill="none" stroke="#d8d8d2" strokeWidth="2" strokeDasharray="12 10" strokeLinecap="round" />
                <text x={road.label[0]} y={road.label[1]} transform={`rotate(${road.angle} ${road.label[0]} ${road.label[1]})`} textAnchor="middle" fill="#59616a" fontSize="10" fontWeight="600" fontFamily="Inter, Arial" className="map-road-label">{road.name}</text>
              </g>
            );
          })}

          {SECONDARY_ROADS.map((road, index) => {
            const pts = pointList(road);
            const d = `M${pts.map(([x, y]) => `${x} ${y}`).join(' L')}`;
            return <path key={`street-${index}`} d={d} fill="none" stroke="#fffdf9" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />;
          })}

          {/* District labels */}
          <g opacity="0.72" fontFamily="Inter, Arial" textAnchor="middle">
            <text x="190" y="170" fill="#6d8068" fontSize="15" fontWeight="700" className="map-label">WILLOW / 4TH DISTRICT</text>
            <text x="470" y="135" fill="#6f7478" fontSize="15" fontWeight="700" className="map-label">DOWNTOWN</text>
            <text x="755" y="175" fill="#6f7478" fontSize="13" fontWeight="700" className="map-label">WATERFRONT INDUSTRIAL</text>
            <text x="855" y="600" fill="#6f7478" fontSize="13" fontWeight="700" className="map-label">HARBOR / FREIGHT</text>
            <text x="585" y="675" fill="#6f7478" fontSize="12" fontWeight="700" className="map-label">INDUSTRIAL CANAL</text>
          </g>

          {showVehicleRoutes && taurusPathPoints && <polyline points={taurusPathPoints} fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="11 8" strokeOpacity="0.78" />}
          {showVehicleRoutes && capricePathPoints && <polyline points={capricePathPoints} fill="none" stroke="#dc2626" strokeWidth="3" strokeDasharray="9 8" strokeOpacity="0.68" />}

          {showVehicleRoutes && sortedSightings.map((s) => {
            const isSelected = s.id === selectedSightingId;
            const isTaurus = s.vehicleId === 'VEH-TXR481';
            return (
              <g key={s.id} onClick={(event) => { event.stopPropagation(); if (!dragMoved.current) onSelectSighting(s.id); }} className="cursor-pointer">
                {(isSelected || s.isConflict) && <circle cx={s.coordinates.x} cy={s.coordinates.y} r={isSelected ? 17 : 13} fill="none" stroke={s.isConflict ? '#f59e0b' : '#2563eb'} strokeWidth="2.5" strokeOpacity="0.9" />}
                <circle cx={s.coordinates.x} cy={s.coordinates.y} r="8" fill="#fff" stroke={s.isConflict ? '#f59e0b' : isTaurus ? '#2563eb' : '#dc2626'} strokeWidth="2.5" />
                <text x={s.coordinates.x} y={s.coordinates.y + 3.5} textAnchor="middle" fill="#1e293b" fontSize="7" fontFamily="monospace" fontWeight="bold" className="pointer-events-none">{s.stepOrder}</text>
                <title>{`${s.time} · ${s.vehicleName} · ${s.locationName}`}</title>
              </g>
            );
          })}

          {showIncidents && incidents.map((incident) => (
            <g key={incident.id} onClick={(event) => event.stopPropagation()} className="cursor-pointer">
              <circle cx={incident.coordinates.x} cy={incident.coordinates.y} r="9" fill="#dc2626" stroke="#fff" strokeWidth="2" />
              <text x={incident.coordinates.x} y={incident.coordinates.y + 3.5} textAnchor="middle" fill="#fff" fontSize="8" fontFamily="monospace" fontWeight="bold">!</text>
              <title>{incident.title}</title>
            </g>
          ))}

          {showEvidence && evidence.map((item) => (
            <g key={item.id} className="cursor-pointer">
              <rect x={item.coordinates.x - 6} y={item.coordinates.y - 6} width="12" height="12" rx="2" fill="#047857" stroke="#fff" strokeWidth="2" transform={`rotate(45 ${item.coordinates.x} ${item.coordinates.y})`} />
              <title>{`${item.evidenceId}: ${item.title}`}</title>
            </g>
          ))}

          {locations.map((location) => {
            const pos = getMapPosition(location);
            const isSelected = location.id === selectedLocationId;
            const historical = location.historicalStates.find((state) => state.era === activeEra) || location.historicalStates[0];
            return (
              <g
                key={location.id}
                onClick={(event) => { event.stopPropagation(); if (!dragMoved.current) onSelectLocation(location.id); }}
                onMouseEnter={() => setHoveredItem({ title: location.name, subtitle: `${location.address} · ${historical?.statusDescription || 'ACTIVE'}`, x: pos.x, y: pos.y })}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer"
              >
                {isSelected && <circle cx={pos.x} cy={pos.y} r="25" fill={location.color || '#2563eb'} fillOpacity="0.15" stroke={location.color || '#2563eb'} strokeWidth="2.5" />}
                <circle cx={pos.x} cy={pos.y} r={isSelected ? 12 : 9} fill="#fff" stroke={location.color || '#2563eb'} strokeWidth={isSelected ? 3 : 2.5} />
                <circle cx={pos.x} cy={pos.y} r="4.5" fill={location.color || '#2563eb'} />
                <text x={pos.x} y={pos.y + 24} textAnchor="middle" fill="#27323a" fontSize="10" fontFamily="Inter, Arial, sans-serif" fontWeight={isSelected ? '700' : '600'} className="map-label pointer-events-none">{location.name.split(' (')[0]}</text>
              </g>
            );
          })}

          {hoveredItem && (
            <g transform={`translate(${Math.min(hoveredItem.x + 16, MAP_WIDTH - 255)}, ${Math.max(hoveredItem.y - 72, 18)})`} pointerEvents="none">
              <rect width="240" height="58" rx="9" fill="rgba(255,255,255,.98)" stroke="#c8d0d6" strokeWidth="1" />
              <text x="12" y="21" fill="#17212b" fontSize="11" fontFamily="Inter, Arial" fontWeight="700">{hoveredItem.title}</text>
              <text x="12" y="41" fill="#64748b" fontSize="9.5" fontFamily="Inter, Arial">{hoveredItem.subtitle}</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
