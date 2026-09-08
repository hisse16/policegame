import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { MAP_LOCATIONS } from '../../../services/fictionalWebData';
import { MapLocation } from '../../../types/browser';

interface MapRendererProps {
  onNavigate: (url: string) => void;
}

export const MapRenderer: React.FC<MapRendererProps> = ({ onNavigate }) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(MAP_LOCATIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [routeDestination, setRouteDestination] = useState<MapLocation | null>(null);

  const filteredLocations = searchQuery.trim()
    ? MAP_LOCATIONS.filter((l) =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.district.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : MAP_LOCATIONS;

  return (
    <div className="h-full w-full bg-slate-950 text-slate-200 overflow-hidden font-sans select-none flex flex-col">
      {/* Map Header Toolbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white">
            <Icon name="MapPin" className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100">OmniMaps</h1>
            <p className="text-[10px] text-slate-400">Metropolitan Geographic Information System</p>
          </div>
        </div>

        {/* Location Search Bar */}
        <div className="w-72 relative">
          <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
            <Icon name="Search" className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search precinct, harbor, street..."
              className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-hidden text-xs"
            />
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setZoom((z) => Math.max(0.8, z - 0.2))}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <Icon name="Minus" className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono px-2 text-slate-300">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.8, z + 0.2))}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <Icon name="Plus" className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Map Viewport */}
      <div className="flex-1 relative overflow-hidden bg-slate-950">
        {/* Interactive SVG Canvas */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          <svg
            viewBox="0 0 1000 700"
            className="w-full h-full max-w-[1000px] max-h-[700px] select-none"
          >
            {/* Background & Terrain */}
            <rect width="1000" height="700" fill="#090d16" />

            {/* Grid Lines */}
            <defs>
              <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="1000" height="700" fill="url(#city-grid)" />

            {/* Grand Estuary / Harbor Waterway */}
            <path
              d="M 680 0 C 640 200, 720 380, 850 520 C 920 600, 1000 640, 1000 700 L 1000 0 Z"
              fill="#082f49"
              opacity="0.7"
            />
            <path
              d="M 680 0 C 640 200, 720 380, 850 520 C 920 600, 1000 640, 1000 700"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeDasharray="6,4"
            />
            <text x="820" y="220" fill="#38bdf8" opacity="0.5" fontSize="16" fontFamily="monospace" fontWeight="bold" transform="rotate(45, 820, 220)">
              GRAND HARBOR ESTUARY
            </text>

            {/* Major Arteries / Roads */}
            {/* Grand Avenue */}
            <line x1="100" y1="360" x2="800" y2="360" stroke="#334155" strokeWidth="8" />
            <line x1="100" y1="360" x2="800" y2="360" stroke="#64748b" strokeWidth="2" strokeDasharray="10,6" />
            <text x="240" y="352" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">GRAND AVENUE</text>

            {/* Market Street */}
            <line x1="480" y1="80" x2="480" y2="620" stroke="#334155" strokeWidth="8" />
            <line x1="480" y1="80" x2="480" y2="620" stroke="#64748b" strokeWidth="2" strokeDasharray="10,6" />
            <text x="490" y="160" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" transform="rotate(90, 490, 160)">MARKET STREET</text>

            {/* Lower Shore Parkway */}
            <path d="M 650 80 Q 620 350 780 620" fill="none" stroke="#1e3a8a" strokeWidth="6" />
            <text x="690" y="520" fill="#60a5fa" fontSize="9" fontFamily="sans-serif" transform="rotate(60, 690, 520)">LOWER SHORE PKWY</text>

            {/* District Labels */}
            <text x="280" y="240" fill="#475569" fontSize="18" fontWeight="bold" fontFamily="sans-serif" letterSpacing="4">DOWNTOWN CORE</text>
            <text x="460" y="280" fill="#38bdf8" opacity="0.8" fontSize="16" fontWeight="bold" fontFamily="sans-serif" letterSpacing="3">CIVIC CENTER / 4TH DISTRICT</text>
            <text x="720" y="440" fill="#0284c7" opacity="0.8" fontSize="15" fontWeight="bold" fontFamily="sans-serif" letterSpacing="2">WATERFRONT MARITIME</text>
            <text x="200" y="540" fill="#475569" fontSize="16" fontWeight="bold" fontFamily="sans-serif" letterSpacing="3">WESTSIDE DISTRICT</text>

            {/* Active Route Rendering (if selected) */}
            {routeDestination && selectedLocation && (
              <g>
                <line
                  x1={`${selectedLocation.x * 10}`}
                  y1={`${selectedLocation.y * 7}`}
                  x2={`${routeDestination.x * 10}`}
                  y2={`${routeDestination.y * 7}`}
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeDasharray="8,5"
                  className="animate-pulse"
                />
              </g>
            )}

            {/* Pins for Locations */}
            {MAP_LOCATIONS.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              const px = loc.x * 10;
              const py = loc.y * 7;

              return (
                <g
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  {/* Pin Circle Ripple */}
                  {isSelected && (
                    <circle cx={px} cy={py} r="18" fill="#38bdf8" opacity="0.2" className="animate-ping" />
                  )}

                  {/* Marker Pin */}
                  <circle
                    cx={px}
                    cy={py}
                    r={isSelected ? '10' : '7'}
                    fill={
                      loc.category === 'Emergency'
                        ? '#ef4444'
                        : loc.category === 'Government'
                        ? '#3b82f6'
                        : loc.category === 'Transit'
                        ? '#f59e0b'
                        : '#10b981'
                    }
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  {/* Label */}
                  <text
                    x={px}
                    y={py - 12}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize={isSelected ? '11' : '9'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    fontFamily="sans-serif"
                    className="drop-shadow-md"
                  >
                    {loc.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Location Info Card (Floating Overlay) */}
        {selectedLocation && (
          <div className="absolute left-4 bottom-4 w-84 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md space-y-3 z-30 text-xs">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-bold uppercase">
                  {selectedLocation.category}
                </span>
                <h3 className="font-bold text-sm text-slate-100">{selectedLocation.name}</h3>
                <p className="text-slate-400">{selectedLocation.address} • {selectedLocation.district}</p>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400"
              >
                <Icon name="X" className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
              {selectedLocation.description}
            </p>

            {selectedLocation.phone && (
              <div className="flex items-center gap-2 text-slate-400">
                <Icon name="Phone" className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono text-[11px]">{selectedLocation.phone}</span>
              </div>
            )}

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  const target = MAP_LOCATIONS.find((l) => l.id === 'loc_pier_9') || MAP_LOCATIONS[1];
                  setRouteDestination(target);
                }}
                className="flex-1 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Icon name="Navigation" className="w-3.5 h-3.5" />
                <span>Calculate Route</span>
              </button>
            </div>

            {routeDestination && (
              <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800 text-[11px] text-blue-200">
                <p className="font-semibold">Route to {routeDestination.name}:</p>
                <p className="text-slate-300 mt-0.5">Estimated Drive: 14 mins via Lower Shore Pkwy (4.2 miles)</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
