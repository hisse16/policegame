import React, { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  ScaleControl,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from '../../common/Icon';
import { MAP_LOCATIONS } from '../../../services/fictionalWebData';
import { MapLocation } from '../../../types/browser';

interface MapRendererProps {
  onNavigate: (url: string) => void;
}

const NORTHBRIDGE_CENTER: [number, number] = [40.7128, -74.006];
const NORTHBRIDGE_BOUNDS: [[number, number], [number, number]] = [
  [40.695, -74.030],
  [40.731, -73.980],
];

// The x/y positions authored for the fictional city remain the source of truth
// for story distances. They are simply projected onto the street basemap.
const toLatLng = (loc: MapLocation): [number, number] => [
  NORTHBRIDGE_CENTER[0] + (loc.y - 50) * 0.00052,
  NORTHBRIDGE_CENTER[1] + (loc.x - 50) * 0.00068,
];

const markerColor = (category: string) => {
  switch (category) {
    case 'Emergency': return '#d93025';
    case 'Business': return '#1967d2';
    case 'Residential': return '#7e57c2';
    case 'Transport': return '#e37400';
    case 'Government': return '#188038';
    default: return '#5f6368';
  }
};

const markerIcon = (category: string, selected = false) => {
  const color = markerColor(category);
  const size = selected ? 40 : 34;
  return L.divIcon({
    className: 'northbridge-pin',
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.28));">
        <div style="position:absolute;left:50%;top:1px;transform:translateX(-50%) rotate(45deg);width:${size - 4}px;height:${size - 4}px;border-radius:50% 50% 50% 0;background:${color};border:2px solid #fff;"></div>
        <div style="position:absolute;left:50%;top:${selected ? 10 : 9}px;transform:translateX(-50%);width:${selected ? 11 : 9}px;height:${selected ? 11 : 9}px;border-radius:50%;background:#fff;"></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 2],
  });
};

const MapViewport: React.FC<{ location: MapLocation | null }> = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) map.flyTo(toLatLng(location), 17, { duration: 0.45 });
  }, [location, map]);
  return null;
};

const MapReset: React.FC<{ resetKey: number }> = ({ resetKey }) => {
  const map = useMap();
  useEffect(() => {
    if (resetKey > 0) map.fitBounds(NORTHBRIDGE_BOUNDS, { padding: [28, 28], maxZoom: 15 });
  }, [map, resetKey]);
  return null;
};

const MapInteraction: React.FC<{ onClearSelection: () => void }> = ({ onClearSelection }) => {
  useMapEvents({ click: onClearSelection });
  return null;
};

const Compass: React.FC = () => (
  <div
    className="absolute right-3 top-[58px] z-[1000] flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,.18)]"
    title="North"
    aria-label="North"
  >
    <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white">
      <span className="absolute -top-[2px] text-[8px] font-bold text-slate-700">N</span>
      <span className="mt-1 text-[15px] leading-none text-red-600">▲</span>
    </span>
  </div>
);

export const MapRenderer: React.FC<MapRendererProps> = ({ onNavigate }) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [showPlaces, setShowPlaces] = useState(true);

  const filteredLocations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MAP_LOCATIONS;
    return MAP_LOCATIONS.filter(location =>
      `${location.name} ${location.address} ${location.district} ${location.category}`.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const selectLocation = (location: MapLocation) => setSelectedLocation(location);

  const resetMap = () => {
    setSelectedLocation(null);
    setSearchQuery('');
    setResetKey(value => value + 1);
    window.dispatchEvent(new CustomEvent('northbridge-map-reset'));
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#dbe7ee] text-slate-900 select-none">
      <style>{`
        .northbridge-map .leaflet-container { width:100%;height:100%;background:#dbe7ee;font-family:Inter,ui-sans-serif,system-ui,sans-serif; }
        .northbridge-map .leaflet-control-zoom { border:0!important;border-radius:12px!important;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.18)!important; }
        .northbridge-map .leaflet-control-zoom a { width:40px!important;height:40px!important;line-height:40px!important;border:0!important;border-bottom:1px solid #e5e7eb!important;background:#fff!important;color:#3c4043!important;font-size:21px!important; }
        .northbridge-map .leaflet-control-zoom a:last-child { border-bottom:0!important; }
        .northbridge-map .leaflet-control-zoom a:hover { background:#f8f9fa!important; }
        .northbridge-map .leaflet-control-attribution { font-size:9px!important;background:rgba(255,255,255,.86)!important;padding:2px 5px!important;color:#5f6368!important; }
        .northbridge-map .leaflet-control-scale-line { border:2px solid #5f6368!important;border-top:0!important;background:rgba(255,255,255,.75)!important;color:#3c4043!important;font-size:9px!important;line-height:10px!important; }
        .northbridge-map .leaflet-popup-content-wrapper { padding:0!important;border-radius:12px!important;overflow:hidden;box-shadow:0 5px 24px rgba(0,0,0,.2)!important; }
        .northbridge-map .leaflet-popup-content { margin:0!important; }
        .northbridge-map .leaflet-tooltip { border:0!important;border-radius:6px!important;padding:5px 8px!important;box-shadow:0 2px 8px rgba(0,0,0,.18)!important;font-size:11px!important;font-weight:600!important;color:#3c4043!important; }
      `}</style>

      <div className="northbridge-map absolute inset-0">
        <MapContainer
          center={NORTHBRIDGE_CENTER}
          zoom={14}
          minZoom={12}
          maxZoom={19}
          maxBounds={NORTHBRIDGE_BOUNDS}
          maxBoundsViscosity={0.8}
          scrollWheelZoom
          zoomControl={false}
          className="absolute inset-0"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={20}
          />
          <ZoomControl position="bottomright" />
          <ScaleControl position="bottomleft" imperial={false} />
          <MapViewport location={selectedLocation} />
          <MapReset resetKey={resetKey} />
          <MapInteraction onClearSelection={() => setSelectedLocation(null)} />

          {showPlaces && filteredLocations.map(location => (
            <Marker
              key={location.id}
              position={toLatLng(location)}
              icon={markerIcon(location.category, selectedLocation?.id === location.id)}
              eventHandlers={{
                click: event => {
                  event.originalEvent.stopPropagation();
                  selectLocation(location);
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -25]} opacity={0.98}>{location.name}</Tooltip>
              <Popup closeButton>
                <div className="w-[270px]">
                  <div className="border-b border-slate-100 px-4 pb-3 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: markerColor(location.category) }} />
                      <span className="text-[9px] font-bold uppercase tracking-[.12em] text-slate-500">{location.category}</span>
                    </div>
                    <div className="mt-1 text-[14px] font-semibold leading-5 text-slate-900">{location.name}</div>
                    <div className="mt-1 text-[11px] leading-4 text-slate-500">{location.address} · {location.district}</div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[11px] leading-[17px] text-slate-600">{location.description}</p>
                    <button onClick={() => onNavigate(`map://location/${location.id}`)} className="mt-3 w-full rounded-lg bg-[#1a73e8] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#1765cc]">
                      Open location record
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <Compass />
      </div>

      <div className="absolute left-4 top-4 z-[1000] w-[min(430px,calc(100%-32px))]">
        <div className="flex h-12 items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,.18)]">
          <Icon name="Search" className="ml-4 h-4 w-4 shrink-0 text-slate-500" />
          <input value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Search Northbridge" className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="mr-1 rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Clear search"><Icon name="X" className="h-4 w-4" /></button>}
          <div className="h-7 w-px bg-slate-200" />
          <button onClick={() => setShowPlaces(value => !value)} className={`mx-1 rounded-lg p-2 ${showPlaces ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`} title={showPlaces ? 'Hide case locations' : 'Show case locations'} aria-label="Toggle case locations">
            <Icon name="MapPinned" className="h-4 w-4" />
          </button>
        </div>

        {searchQuery && (
          <div className="mt-2 max-h-72 overflow-auto rounded-xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(0,0,0,.18)]">
            {filteredLocations.length === 0 ? <div className="px-4 py-5 text-center text-xs text-slate-500">No locations found</div> : filteredLocations.map(location => (
              <button key={location.id} onClick={() => selectLocation(location)} className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-slate-50">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: markerColor(location.category) }}><Icon name="MapPin" className="h-3.5 w-3.5" /></span>
                <span className="min-w-0"><span className="block truncate text-xs font-semibold text-slate-900">{location.name}</span><span className="mt-0.5 block truncate text-[10px] text-slate-500">{location.address} · {location.district}</span></span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={resetMap} className="absolute right-3 top-4 z-[1000] flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-[0_2px_10px_rgba(0,0,0,.18)] hover:bg-slate-50" title="Recenter map" aria-label="Recenter map">
        <Icon name="LocateFixed" className="h-4 w-4" />
      </button>
    </div>
  );
};
