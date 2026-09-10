import React, { useEffect, useMemo, useState } from 'react';
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  ScaleControl,
  TileLayer,
  Tooltip,
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

// Northbridge is fictional, so the investigation locations are placed in a
// compact area around the existing fictional-city map center. The basemap
// provides the familiar street-map visual language; case locations remain
// fictional overlays on top of it.
const NORTHBRIDGE_CENTER: [number, number] = [40.7128, -74.0060];
const NORTHBRIDGE_BOUNDS: [[number, number], [number, number]] = [
  [40.699, -74.026],
  [40.727, -73.984],
];

const toLatLng = (loc: MapLocation): [number, number] => [
  NORTHBRIDGE_CENTER[0] + (loc.y - 50) * 0.00045,
  NORTHBRIDGE_CENTER[1] + (loc.x - 50) * 0.00058,
];

const markerColor = (category: string) => {
  switch (category) {
    case 'Emergency':
      return '#dc2626';
    case 'Business':
      return '#2563eb';
    case 'Residential':
      return '#7c3aed';
    case 'Transport':
      return '#ea580c';
    case 'Government':
      return '#0f766e';
    default:
      return '#475569';
  }
};

const markerIcon = (category: string, selected = false) => {
  const color = markerColor(category);
  const size = selected ? 42 : 36;
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:${size}px;height:${size}px;
        transform:rotate(-45deg);
        border-radius:50% 50% 50% 0;
        background:${color};
        border:3px solid #fff;
        box-shadow:0 2px 7px rgba(15,23,42,.35),0 1px 2px rgba(15,23,42,.2);
        display:flex;align-items:center;justify-content:center;
      ">
        <div style="
          width:${selected ? 12 : 10}px;height:${selected ? 12 : 10}px;
          border-radius:999px;background:#fff;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 3],
  });
};

const MapViewport: React.FC<{ location: MapLocation | null }> = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo(toLatLng(location), 16, { duration: 0.45 });
    }
  }, [location, map]);

  return null;
};

const MapReset: React.FC<{ resetKey: number }> = ({ resetKey }) => {
  const map = useMap();

  useEffect(() => {
    if (resetKey > 0) {
      map.fitBounds(NORTHBRIDGE_BOUNDS, { padding: [32, 32], maxZoom: 15 });
    }
  }, [map, resetKey]);

  return null;
};

const MapInteraction: React.FC<{ onClearSelection: () => void }> = ({ onClearSelection }) => {
  useMapEvents({ click: onClearSelection });
  return null;
};

export const MapRenderer: React.FC<MapRendererProps> = ({ onNavigate }) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [showPlaces, setShowPlaces] = useState(true);

  const filteredLocations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MAP_LOCATIONS;
    return MAP_LOCATIONS.filter(location =>
      `${location.name} ${location.address} ${location.district} ${location.category}`
        .toLowerCase()
        .includes(q),
    );
  }, [searchQuery]);

  const selectLocation = (location: MapLocation) => {
    setSelectedLocation(location);
  };

  const resetMap = () => {
    setSelectedLocation(null);
    setSearchQuery('');
    setResetKey(value => value + 1);
    window.dispatchEvent(new CustomEvent('northbridge-map-reset'));
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-200 text-slate-900 font-sans select-none">
      <style>{`
        .northbridge-map .leaflet-container {
          width: 100%;
          height: 100%;
          background: #e5e7eb;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }
        .northbridge-map .leaflet-control-zoom {
          border: 0 !important;
          box-shadow: 0 2px 10px rgba(15,23,42,.18) !important;
          border-radius: 9px !important;
          overflow: hidden;
        }
        .northbridge-map .leaflet-control-zoom a {
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          color: #334155 !important;
          background: rgba(255,255,255,.97) !important;
          border: 0 !important;
          border-bottom: 1px solid #e2e8f0 !important;
          font-size: 20px !important;
        }
        .northbridge-map .leaflet-control-zoom a:last-child { border-bottom: 0 !important; }
        .northbridge-map .leaflet-control-zoom a:hover { background: #f8fafc !important; }
        .northbridge-map .leaflet-control-attribution {
          font-size: 9px !important;
          background: rgba(255,255,255,.82) !important;
          padding: 2px 5px !important;
        }
        .northbridge-map .leaflet-popup-content-wrapper,
        .northbridge-map .leaflet-popup-tip {
          background: #fff;
          box-shadow: 0 8px 28px rgba(15,23,42,.18);
        }
        .northbridge-map .leaflet-popup-content { margin: 0; }
        .northbridge-map .leaflet-tooltip {
          border: 0;
          border-radius: 7px;
          box-shadow: 0 2px 8px rgba(15,23,42,.18);
          padding: 5px 8px;
          color: #1e293b;
          font-size: 11px;
          font-weight: 600;
        }
      `}</style>

      <div className="northbridge-map absolute inset-0">
        <MapContainer
          center={NORTHBRIDGE_CENTER}
          zoom={15}
          minZoom={13}
          maxZoom={19}
          maxBounds={NORTHBRIDGE_BOUNDS}
          maxBoundsViscosity={0.75}
          scrollWheelZoom
          zoomControl={false}
          className="absolute inset-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
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
              <Tooltip direction="top" offset={[0, -28]} opacity={0.96}>
                {location.name}
              </Tooltip>
              <Popup closeButton={false}>
                <div className="w-[250px]">
                  <div className="px-3 pt-3 pb-2 border-b border-slate-100">
                    <div className="text-[9px] uppercase tracking-[0.12em] font-bold" style={{ color: markerColor(location.category) }}>
                      {location.category}
                    </div>
                    <div className="mt-0.5 text-sm font-semibold text-slate-900">{location.name}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{location.address} · {location.district}</div>
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] leading-4 text-slate-600">{location.description}</p>
                    <button
                      onClick={() => onNavigate(`map://location/${location.id}`)}
                      className="mt-3 w-full rounded-md bg-blue-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-blue-700"
                    >
                      Open case location
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          <CircleMarker
            center={NORTHBRIDGE_CENTER}
            radius={5}
            pathOptions={{ color: '#fff', weight: 2, fillColor: '#2563eb', fillOpacity: 1 }}
          />
        </MapContainer>
      </div>

      {/* Google/Yandex-style floating search */}
      <div className="absolute left-4 top-4 z-[1000] w-[min(430px,calc(100%-32px))]">
        <div className="flex items-center rounded-xl bg-white shadow-[0_2px_12px_rgba(15,23,42,.18)] border border-slate-200 overflow-hidden">
          <Icon name="Search" className="ml-4 h-4 w-4 shrink-0 text-slate-500" />
          <input
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Search Northbridge"
            className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mr-1 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Clear search"
            >
              <Icon name="X" className="h-4 w-4" />
            </button>
          )}
          <div className="h-7 w-px bg-slate-200" />
          <button
            onClick={() => setShowPlaces(value => !value)}
            className={`mx-1 rounded-lg p-2 ${showPlaces ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-100'}`}
            title={showPlaces ? 'Hide case locations' : 'Show case locations'}
          >
            <Icon name="MapPinned" className="h-4 w-4" />
          </button>
        </div>

        {searchQuery && (
          <div className="mt-2 max-h-72 overflow-auto rounded-xl bg-white shadow-[0_4px_18px_rgba(15,23,42,.18)] border border-slate-200">
            {filteredLocations.length === 0 ? (
              <div className="px-4 py-5 text-center text-xs text-slate-500">No locations found</div>
            ) : filteredLocations.map(location => (
              <button
                key={location.id}
                onClick={() => selectLocation(location)}
                className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-slate-50"
              >
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: markerColor(location.category) }}
                >
                  <Icon name="MapPin" className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-slate-900">{location.name}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-500">{location.address} · {location.district}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Familiar map controls */}
      <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={resetMap}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-[0_2px_10px_rgba(15,23,42,.16)] hover:bg-slate-50"
          title="Recenter map"
          aria-label="Recenter map"
        >
          <Icon name="LocateFixed" className="h-4 w-4" />
        </button>
      </div>

      {/* Location list, intentionally small so the map remains the primary surface. */}
      {!searchQuery && (
        <div className="absolute bottom-4 left-4 z-[1000] hidden w-[300px] overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-[0_4px_18px_rgba(15,23,42,.16)] backdrop-blur sm:block">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Case locations</div>
              <div className="text-[11px] text-slate-400">{filteredLocations.length} places on map</div>
            </div>
            <button onClick={() => setShowPlaces(value => !value)} className="text-[10px] font-semibold text-blue-600 hover:text-blue-700">
              {showPlaces ? 'Hide' : 'Show'} pins
            </button>
          </div>
          <div className="max-h-36 overflow-auto">
            {filteredLocations.slice(0, 5).map(location => (
              <button
                key={location.id}
                onClick={() => selectLocation(location)}
                className="flex w-full items-center gap-2 border-b border-slate-50 px-3 py-2 text-left hover:bg-slate-50 last:border-0"
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: markerColor(location.category) }} />
                <span className="truncate text-[10px] font-medium text-slate-700">{location.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
