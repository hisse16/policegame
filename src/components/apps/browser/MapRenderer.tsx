import React, { useMemo, useState } from 'react';
import { Icon } from '../../common/Icon';
import { MAP_LOCATIONS } from '../../../services/fictionalWebData';
import { MapLocation } from '../../../types/browser';

interface MapRendererProps { onNavigate: (url: string) => void; }

const streets = [
  ['Riverfront Ave', '12%', '74%', '92%', '38%'], ['4th Street', '18%', '20%', '78%', '82%'],
  ['Market St', '8%', '48%', '94%', '48%'], ['Willow Street', '25%', '12%', '61%', '91%'],
  ['Canal Road', '62%', '8%', '36%', '94%'], ['Grand Avenue', '4%', '67%', '96%', '67%']
];

export const MapRenderer: React.FC<MapRendererProps> = ({ onNavigate }) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [mapCenter, setMapCenter] = useState({ x: 0, y: 0 });

  const filteredLocations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MAP_LOCATIONS;
    return MAP_LOCATIONS.filter(l => `${l.name} ${l.address} ${l.district} ${l.category}`.toLowerCase().includes(q));
  }, [searchQuery]);

  const toPercent = (value: number, max: number) => `${Math.max(5, Math.min(95, (value / max) * 100))}%`;

  return (
    <div
      className="h-full w-full bg-[#eef1f3] text-slate-800 overflow-hidden flex flex-col font-sans select-none"
      onContextMenu={e => e.preventDefault()}
    >
      <header className="h-14 bg-white border-b border-slate-300 flex items-center gap-3 px-4 z-30 shadow-sm shrink-0">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm"><Icon name="Map" className="w-5 h-5" /></div>
        <div className="min-w-[150px]"><div className="font-semibold text-sm text-slate-900">Northbridge Maps</div><div className="text-[10px] text-slate-500">Police Geographic Information System</div></div>
        <div className="flex-1 max-w-xl relative">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search this map" className="w-full h-10 rounded-full bg-slate-100 border border-slate-200 pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-blue-400" />
        </div>
        <div className="ml-auto flex items-center rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <button onClick={() => setZoom(z => Math.max(.75, +(z - .1).toFixed(2)))} className="w-9 h-9 hover:bg-slate-100 flex items-center justify-center"><Icon name="Minus" className="w-4 h-4" /></button>
          <span className="w-12 text-center text-[10px] font-mono text-slate-500">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(1.8, +(z + .1).toFixed(2)))} className="w-9 h-9 hover:bg-slate-100 flex items-center justify-center"><Icon name="Plus" className="w-4 h-4" /></button>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden" onWheel={e => setZoom(z => Math.max(.75, Math.min(1.8, +(z + (e.deltaY < 0 ? .04 : -.04)).toFixed(2))))}>
        <div className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing">
          <div className="absolute inset-[-12%] transition-transform duration-200" style={{ transform: `translate(${mapCenter.x}px, ${mapCenter.y}px) scale(${zoom})` }}>
            <svg viewBox="0 0 1200 760" className="w-full h-full" preserveAspectRatio="none">
              <rect width="1200" height="760" fill="#e9edf0" />
              <path d="M0 0H1200V170C1010 150 900 230 760 210C560 180 430 250 280 200C150 157 70 190 0 230Z" fill="#dbeafe" />
              <path d="M0 110C170 180 300 120 440 175C600 238 700 120 850 165C990 208 1090 115 1200 150" fill="none" stroke="#b7d8ef" strokeWidth="34" opacity=".9" />
              <g fill="#dde3e6" stroke="#d1d8dc" strokeWidth="1">
                <path d="M40 260L280 230L330 430L90 470Z" /><path d="M350 225L570 250L555 430L330 420Z" /><path d="M590 235L820 220L875 405L575 430Z" />
                <path d="M100 500L320 450L370 690L70 720Z" /><path d="M395 460L610 450L645 690L380 690Z" /><path d="M680 445L930 420L1110 680L670 690Z" />
              </g>
              <g stroke="#ffffff" strokeLinecap="round" fill="none">
                <path d="M40 330C260 300 410 340 610 315S980 270 1160 315" strokeWidth="16" />
                <path d="M80 560C300 520 470 560 690 530S1010 480 1160 520" strokeWidth="15" />
                <path d="M250 180C275 300 245 450 280 720" strokeWidth="14" />
                <path d="M500 190C530 320 485 480 520 710" strokeWidth="14" />
                <path d="M750 190C720 310 790 450 760 700" strokeWidth="14" />
                <path d="M930 180C900 330 980 500 1020 700" strokeWidth="14" />
              </g>
              <g stroke="#c8cdd1" fill="none" strokeWidth="2">
                {streets.map(([name, x1, y1, x2, y2]) => <line key={name} x1={x1} y1={y1} x2={x2} y2={y2} vectorEffect="non-scaling-stroke" />)}
              </g>
              <g fill="#9aa5ad" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="600">
                <text x="120" y="295">WESTSIDE</text><text x="405" y="295">DOWNTOWN</text><text x="680" y="295">CIVIC CENTER</text><text x="850" y="545">WATERFRONT</text>
              </g>
              <g fill="#8b949b" fontFamily="Arial, sans-serif" fontSize="11">
                <text x="465" y="305">Market St</text><text x="300" y="440" transform="rotate(84 300 440)">Willow Street</text><text x="790" y="390" transform="rotate(84 790 390)">Canal Road</text><text x="520" y="325">4th Street</text>
              </g>
              {filteredLocations.map(loc => {
                const x = loc.x * 10, y = loc.y * 7;
                const selected = selectedLocation?.id === loc.id;
                return <g key={loc.id} onClick={() => setSelectedLocation(loc)} className="cursor-pointer">
                  {selected && <circle cx={x} cy={y} r="22" fill="#2563eb" opacity=".14" />}
                  <circle cx={x} cy={y} r={selected ? 8 : 6} fill={loc.category === 'Emergency' ? '#dc2626' : loc.category === 'Government' ? '#2563eb' : loc.category === 'Transit' ? '#f59e0b' : '#16a34a'} stroke="white" strokeWidth="3" />
                  <text x={x + 11} y={y + 4} fontSize={selected ? 12 : 10} fill="#334155" fontWeight={selected ? '700' : '500'}>{loc.name}</text>
                </g>;
              })}
            </svg>
          </div>
        </div>

        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <button onClick={() => setZoom(z => Math.min(1.8, +(z + .15).toFixed(2)))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 border-b border-slate-200"><Icon name="Plus" className="w-4 h-4" /></button>
            <button onClick={() => setZoom(z => Math.max(.75, +(z - .15).toFixed(2)))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50"><Icon name="Minus" className="w-4 h-4" /></button>
          </div>
          <button onClick={() => { setZoom(1); setMapCenter({x:0,y:0}); }} className="w-10 h-10 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50" title="Reset map"><Icon name="LocateFixed" className="w-4 h-4 text-slate-600" /></button>
        </div>

        <div className="absolute right-4 bottom-4 bg-white/95 border border-slate-200 rounded-xl shadow-lg p-3 text-[10px] text-slate-500 space-y-2">
          <div className="font-semibold text-slate-700">MAP LEGEND</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Government</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Emergency</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-600" /> Public location</div>
        </div>

        {selectedLocation && <aside className="absolute right-4 top-4 w-[310px] max-w-[calc(100%-2rem)] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-start justify-between">
            <div><div className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">{selectedLocation.category}</div><h2 className="mt-1 text-base font-semibold text-slate-900">{selectedLocation.name}</h2><p className="text-xs text-slate-500 mt-1">{selectedLocation.address} · {selectedLocation.district}</p></div>
            <button onClick={() => setSelectedLocation(null)} className="p-1.5 rounded-full hover:bg-slate-100"><Icon name="X" className="w-4 h-4" /></button>
          </div>
          <div className="p-4 space-y-3"><p className="text-xs leading-5 text-slate-600">{selectedLocation.description}</p>{selectedLocation.phone && <div className="flex gap-2 text-xs text-slate-500"><Icon name="Phone" className="w-3.5 h-3.5" />{selectedLocation.phone}</div>}<button onClick={() => onNavigate(`map://location/${selectedLocation.id}`)} className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">Open location record</button></div>
        </aside>}

        <div className="absolute left-4 bottom-4 bg-white/95 border border-slate-200 rounded-lg shadow-sm px-3 py-2 text-[10px] text-slate-500">Northbridge · Metropolitan GIS · {filteredLocations.length} mapped locations</div>
      </div>
    </div>
  );
};
