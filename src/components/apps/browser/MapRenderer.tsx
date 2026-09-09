import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from '../../common/Icon';
import { MAP_LOCATIONS } from '../../../services/fictionalWebData';
import { MapLocation } from '../../../types/browser';

interface MapRendererProps { onNavigate: (url: string) => void; }

const NORTHBRIDGE_CENTER: [number, number] = [40.7128, -74.0060];

const toLatLng = (loc: MapLocation): [number, number] => [
  NORTHBRIDGE_CENTER[0] + (loc.y - 50) * 0.00085,
  NORTHBRIDGE_CENTER[1] + (loc.x - 50) * 0.00105,
];

const markerIcon = (category: string, selected = false) => L.divIcon({
  className: '',
  html: `<div class="nb-map-marker ${selected ? 'nb-map-marker-selected' : ''}"><span>${category === 'Emergency' ? '!' : ''}</span></div>`,
  iconSize: selected ? [34, 34] : [28, 28],
  iconAnchor: selected ? [17, 17] : [14, 14],
});

const MapViewport: React.FC<{ location: MapLocation | null }> = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) map.flyTo(toLatLng(location), 15, { duration: 0.55 });
  }, [location, map]);
  return null;
};

const MapInteraction: React.FC<{ onClearSelection: () => void }> = ({ onClearSelection }) => {
  useMapEvents({ click: onClearSelection });
  return null;
};

export const MapRenderer: React.FC<MapRendererProps> = ({ onNavigate }) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredLocations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return q
      ? MAP_LOCATIONS.filter(l => `${l.name} ${l.address} ${l.district} ${l.category}`.toLowerCase().includes(q))
      : MAP_LOCATIONS;
  }, [searchQuery]);

  const locate = () => {
    setSelectedLocation(null);
    window.dispatchEvent(new CustomEvent('northbridge-map-reset'));
  };

  return <div className="h-full w-full bg-slate-100 text-slate-800 overflow-hidden flex flex-col font-sans select-none">
    <style>{`
      .leaflet-container { width: 100%; height: 100%; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
      .leaflet-control-zoom { border: 0 !important; box-shadow: 0 2px 10px rgba(15,23,42,.14) !important; }
      .leaflet-control-zoom a { width: 34px !important; height: 34px !important; line-height: 34px !important; color: #334155 !important; border: 0 !important; }
      .leaflet-control-attribution { font-size: 9px !important; }
      .nb-map-marker { width: 28px; height: 28px; border-radius: 999px; background: #2563eb; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(15,23,42,.35); display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:800; }
      .nb-map-marker-selected { width: 34px; height: 34px; background: #0f172a; box-shadow: 0 0 0 5px rgba(37,99,235,.22), 0 3px 12px rgba(15,23,42,.4); }
    `}</style>
    <header className="h-14 bg-white border-b border-slate-200 flex items-center gap-3 px-4 z-30 shadow-sm shrink-0">
      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm"><Icon name="Map" className="w-5 h-5" /></div>
      <div className="min-w-[150px]"><div className="font-semibold text-sm text-slate-900">Northbridge Maps</div><div className="text-[10px] text-slate-500">Case locations · investigation map</div></div>
      <div className="flex-1 max-w-xl relative">
        <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search places, addresses, districts" className="w-full h-10 rounded-full bg-slate-100 border border-slate-200 pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-blue-400" />
      </div>
      <button onClick={locate} className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 shadow-sm flex items-center justify-center" title="Center map"><Icon name="LocateFixed" className="w-4 h-4 text-slate-600" /></button>
    </header>
    <div className="flex-1 relative min-h-0">
      <MapContainer center={NORTHBRIDGE_CENTER} zoom={15} scrollWheelZoom className="absolute inset-0" zoomControl>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapViewport location={selectedLocation} />
        <MapInteraction onClearSelection={() => setSelectedLocation(null)} />
        {filteredLocations.map(loc => <Marker key={loc.id} position={toLatLng(loc)} icon={markerIcon(loc.category, selectedLocation?.id === loc.id)} eventHandlers={{ click: e => { e.originalEvent.stopPropagation(); setSelectedLocation(loc); } }} />)}
      </MapContainer>
      {selectedLocation && <aside className="absolute right-4 top-4 w-[320px] max-w-[calc(100%-2rem)] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-[1000]">
        <div className="p-4 border-b border-slate-100 flex items-start justify-between">
          <div><div className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">{selectedLocation.category}</div><h2 className="mt-1 text-base font-semibold text-slate-900">{selectedLocation.name}</h2><p className="text-xs text-slate-500 mt-1">{selectedLocation.address} · {selectedLocation.district}</p></div>
          <button onClick={() => setSelectedLocation(null)} className="p-1.5 rounded-full hover:bg-slate-100"><Icon name="X" className="w-4 h-4" /></button>
        </div>
        <div className="p-4"><p className="text-xs leading-5 text-slate-600">{selectedLocation.description}</p><button onClick={() => onNavigate(`map://location/${selectedLocation.id}`)} className="w-full mt-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">Open case location</button></div>
      </aside>}
      <div className="absolute left-4 bottom-4 bg-white/95 border border-slate-200 rounded-lg shadow-sm px-3 py-2 text-[10px] text-slate-500 z-[1000]">Northbridge · {filteredLocations.length} locations shown · OpenStreetMap</div>
    </div>
  </div>;
};
