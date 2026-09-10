import React, { useMemo, useState } from 'react';
import { Icon } from '../../common/Icon';
import { CASE_27_MAP_LOCATIONS } from '../../../services/story/storyMapData';
import { MapLocation } from '../../../types/browser';

interface MapRendererProps {
  onNavigate: (url: string) => void;
}

const MAP_IMAGE = 'https://raw.githubusercontent.com/hisse16/policegame/main/Gemini_Generated_Image_3x2rto3x2rto3x2r.jpeg';

const markerColor = (category: string) => {
  if (category === 'Residential') return '#7c3aed';
  if (category === 'Commercial' || category === 'Business') return '#2563eb';
  if (category === 'Food') return '#ea580c';
  return '#334155';
};

const markerPosition = (location: MapLocation) => ({
  left: `${location.x}%`,
  top: `${100 - location.y}%`,
});

export const MapRenderer: React.FC<MapRendererProps> = ({ onNavigate }) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const filteredLocations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return CASE_27_MAP_LOCATIONS;
    return CASE_27_MAP_LOCATIONS.filter((location) =>
      `${location.name} ${location.address} ${location.district} ${location.category}`.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const resetMap = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedLocation(null);
    setSearchQuery('');
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button === 0) setDragStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!dragStart) return;
    setPan({ x: event.clientX - dragStart.x, y: event.clientY - dragStart.y });
  };

  const selectLocation = (location: MapLocation) => {
    setSelectedLocation(location);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-200 select-none">
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDragStart(null)}
        onMouseLeave={() => setDragStart(null)}
        onWheel={(event) => {
          event.preventDefault();
          setZoom((value) => Math.max(0.8, Math.min(2.8, value * (event.deltaY < 0 ? 1.1 : 0.9))));
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[100%] w-[150%]"
          style={{ transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})` }}
        >
          <img src={MAP_IMAGE} alt="Northbridge city map" className="h-full w-full object-cover" draggable={false} />
          {filteredLocations.map((location) => {
            const position = markerPosition(location);
            const selected = selectedLocation?.id === location.id;
            return (
              <button
                key={location.id}
                type="button"
                onClick={(event) => { event.stopPropagation(); selectLocation(location); }}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={position}
                title={location.name}
              >
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: markerColor(location.category) }}>
                  {selected && <span className="absolute -inset-2 animate-ping rounded-full border-2 border-current opacity-30" />}
                  <Icon name="MapPin" className="h-4 w-4 text-white" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute left-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 shadow-lg">
        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border border-slate-300">
          <span className="absolute -top-1 text-[8px] font-bold text-slate-700">N</span>
          <span className="mt-1 text-sm text-red-600">▲</span>
        </div>
      </div>

      <div className="absolute left-16 top-3 z-20 w-[min(420px,calc(100%-80px))]">
        <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur-sm">
          <Icon name="Search" className="ml-3 h-4 w-4 text-slate-500" />
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search Northbridge" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
          {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="mr-2 p-1 text-slate-400"><Icon name="X" className="h-4 w-4" /></button>}
        </div>
        {searchQuery && <div className="mt-2 max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl">{filteredLocations.map((location) => <button key={location.id} type="button" onClick={() => selectLocation(location)} className="flex w-full items-start gap-3 border-b border-slate-100 px-3 py-3 text-left last:border-0 hover:bg-slate-50"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: markerColor(location.category) }}><Icon name="MapPin" className="h-3.5 w-3.5" /></span><span className="min-w-0"><span className="block truncate text-xs font-semibold">{location.name}</span><span className="block truncate text-[10px] text-slate-500">{location.address} · {location.district}</span></span></button>)}</div>}
      </div>

      <div className="absolute right-3 top-3 z-20 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-lg">
        <button type="button" onClick={() => setZoom((value) => Math.min(2.8, value + 0.2))} className="flex h-10 w-10 items-center justify-center text-slate-700 hover:bg-slate-100"><Icon name="Plus" className="h-4 w-4" /></button>
        <button type="button" onClick={() => setZoom((value) => Math.max(0.8, value - 0.2))} className="flex h-10 w-10 items-center justify-center border-t border-slate-200 text-slate-700 hover:bg-slate-100"><Icon name="Minus" className="h-4 w-4" /></button>
        <button type="button" onClick={resetMap} className="flex h-10 w-10 items-center justify-center border-t border-slate-200 text-slate-500 hover:bg-slate-100"><Icon name="LocateFixed" className="h-4 w-4" /></button>
      </div>

      {selectedLocation && (
        <div className="absolute bottom-4 left-4 z-20 w-[min(360px,calc(100%-32px))] rounded-xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <div><div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{selectedLocation.category}</div><div className="mt-1 text-sm font-semibold text-slate-900">{selectedLocation.name}</div><div className="mt-1 text-[11px] text-slate-500">{selectedLocation.address} · {selectedLocation.district}</div></div>
            <button type="button" onClick={() => setSelectedLocation(null)} className="text-slate-400 hover:text-slate-700"><Icon name="X" className="h-4 w-4" /></button>
          </div>
          <p className="mt-3 text-[11px] leading-4 text-slate-600">{selectedLocation.description}</p>
          <button type="button" onClick={() => onNavigate(`map://location/${selectedLocation.id}`)} className="mt-3 w-full rounded-lg bg-blue-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-blue-700">Open location record</button>
        </div>
      )}
    </div>
  );
};
