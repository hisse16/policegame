import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../../common/Icon';
import { MAP_LOCATIONS } from '../../../services/fictionalWebData';
import { MapLocation } from '../../../types/browser';

declare global { interface Window { google?: any; } }
interface MapRendererProps { onNavigate: (url: string) => void; }

const NORTHBRIDGE_CENTER = { lat: 40.7128, lng: -74.0060 };
const toLatLng = (loc: MapLocation) => ({ lat: NORTHBRIDGE_CENTER.lat + (loc.y - 50) * 0.00085, lng: NORTHBRIDGE_CENTER.lng + (loc.x - 50) * 0.00105 });

let googleMapsPromise: Promise<void> | null = null;
const loadGoogleMaps = () => {
  if (window.google?.maps) return Promise.resolve();
  if (googleMapsPromise) return googleMapsPromise;
  const key = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  if (!key) return Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY is not configured'));
  googleMapsPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById('northbridge-google-maps');
    if (existing) { existing.addEventListener('load', () => resolve(), { once: true }); existing.addEventListener('error', () => reject(new Error('Google Maps failed to load')), { once: true }); return; }
    const script = document.createElement('script'); script.id = 'northbridge-google-maps'; script.async = true; script.defer = true; script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly`; script.onload = () => resolve(); script.onerror = () => reject(new Error('Google Maps failed to load')); document.head.appendChild(script);
  });
  return googleMapsPromise;
};

export const MapRenderer: React.FC<MapRendererProps> = ({ onNavigate }) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState('');
  const filteredLocations = useMemo(() => { const q = searchQuery.trim().toLowerCase(); return q ? MAP_LOCATIONS.filter(l => `${l.name} ${l.address} ${l.district} ${l.category}`.toLowerCase().includes(q)) : MAP_LOCATIONS; }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then(() => {
      if (cancelled || !mapElement.current || !window.google?.maps) return;
      mapRef.current = new window.google.maps.Map(mapElement.current, { center: NORTHBRIDGE_CENTER, zoom: 13, mapTypeControl: false, streetViewControl: false, fullscreenControl: false, clickableIcons: false, gestureHandling: 'greedy', styles: [{ featureType: 'poi.business', stylers: [{ visibility: 'off' }] }] });
      setMapReady(true);
    }).catch(error => { if (!cancelled) setMapError(error instanceof Error ? error.message : 'Google Maps unavailable'); });
    return () => { cancelled = true; markersRef.current.forEach(m => m.setMap(null)); markersRef.current = []; };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.google?.maps) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = filteredLocations.map(loc => {
      const marker = new window.google.maps.Marker({ map: mapRef.current, position: toLatLng(loc), title: loc.name, label: { text: loc.category === 'Emergency' ? '!' : '•', color: '#ffffff', fontWeight: '700' }, optimized: true });
      marker.addListener('click', () => setSelectedLocation(loc));
      return marker;
    });
    if (filteredLocations.length === 1) mapRef.current.panTo(toLatLng(filteredLocations[0]));
  }, [filteredLocations, mapReady]);

  const locate = () => { if (mapRef.current) { mapRef.current.panTo(NORTHBRIDGE_CENTER); mapRef.current.setZoom(13); } };
  return <div className="h-full w-full bg-white text-slate-800 overflow-hidden flex flex-col font-sans select-none">
    <header className="h-14 bg-white border-b border-slate-200 flex items-center gap-3 px-4 z-30 shadow-sm shrink-0"><div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm"><Icon name="Map" className="w-5 h-5" /></div><div className="min-w-[150px]"><div className="font-semibold text-sm text-slate-900">Northbridge Maps</div><div className="text-[10px] text-slate-500">Case locations · live map interface</div></div><div className="flex-1 max-w-xl relative"><Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search places, addresses, districts" className="w-full h-10 rounded-full bg-slate-100 border border-slate-200 pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-blue-400" /></div><button onClick={locate} className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 shadow-sm flex items-center justify-center" title="Center map"><Icon name="LocateFixed" className="w-4 h-4 text-slate-600" /></button></header>
    <div className="flex-1 relative min-h-0"><div ref={mapElement} className="absolute inset-0 bg-slate-100" />
      {!mapReady && !mapError && <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 backdrop-blur-sm"><div className="bg-white rounded-xl shadow-lg border border-slate-200 px-5 py-4 flex items-center gap-3 text-sm text-slate-600"><span className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin" />Loading Northbridge map…</div></div>}
      {mapError && <div className="absolute inset-0 flex items-center justify-center bg-slate-100"><div className="max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6"><div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Icon name="MapPinOff" size={20} /></div><h2 className="mt-4 text-base font-semibold text-slate-900">Map API not connected</h2><p className="mt-2 text-xs leading-5 text-slate-500">Add <code className="px-1 py-0.5 rounded bg-slate-100">VITE_GOOGLE_MAPS_API_KEY</code> to the deployment environment. The map component is ready to use Google Maps once the key is present.</p></div></div>}
      {selectedLocation && <aside className="absolute right-4 top-4 w-[320px] max-w-[calc(100%-2rem)] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"><div className="p-4 border-b border-slate-100 flex items-start justify-between"><div><div className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">{selectedLocation.category}</div><h2 className="mt-1 text-base font-semibold text-slate-900">{selectedLocation.name}</h2><p className="text-xs text-slate-500 mt-1">{selectedLocation.address} · {selectedLocation.district}</p></div><button onClick={() => setSelectedLocation(null)} className="p-1.5 rounded-full hover:bg-slate-100"><Icon name="X" className="w-4 h-4" /></button></div><div className="p-4"><p className="text-xs leading-5 text-slate-600">{selectedLocation.description}</p><button onClick={() => onNavigate(`map://location/${selectedLocation.id}`)} className="w-full mt-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">Open case location</button></div></aside>}
      <div className="absolute left-4 bottom-4 bg-white/95 border border-slate-200 rounded-lg shadow-sm px-3 py-2 text-[10px] text-slate-500">Northbridge · {filteredLocations.length} locations shown · Google Maps</div>
    </div>
  </div>;
};
