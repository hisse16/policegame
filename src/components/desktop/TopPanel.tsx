import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { Icon } from '../common/Icon';
import { APP_REGISTRY } from '../../config/apps';
import { InvestigationStatusWidget } from '../common/InvestigationStatusWidget';

export const TopPanel: React.FC = () => {
  const {
    windows,
    activeWindowId,
    settings,
    updateSettings,
    notifications,
    dismissNotification,
    clearAllNotifications,
    openApp,
    isLauncherOpen,
    setLauncherOpen,
    isNetworkMenuOpen,
    setNetworkMenuOpen,
    isVolumeMenuOpen,
    setVolumeMenuOpen,
    isPowerMenuOpen,
    setPowerMenuOpen,
    isNotificationCenterOpen,
    setNotificationCenterOpen,
    availableNetworks,
    setPowerState,
    executeRestart,
    executeShutdown
  } = useOS();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [launcherSearch, setLauncherSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeWindow = windows.find((w) => w.id === activeWindowId);

  const formatTime = () => {
    const hours = settings.clockFormat === '24h' ? currentTime.getHours() : currentTime.getHours() % 12 || 12;
    const mins = currentTime.getMinutes().toString().padStart(2, '0');
    const ampm = settings.clockFormat === '12h' ? (currentTime.getHours() >= 12 ? ' PM' : ' AM') : '';
    return `${hours}:${mins}${ampm}`;
  };

  // The simulated workstation has a fixed English locale. Never inherit the
  // player's browser/OS locale (which previously rendered Turkish dates).
  const formatDate = () => currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const categories = ['All', 'System', 'Office', 'Media', 'Internet', 'Utilities'];
  const filteredApps = Object.values(APP_REGISTRY).filter((app) => {
    const matchesCat = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(launcherSearch.toLowerCase()) || app.description.toLowerCase().includes(launcherSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <header className="h-7.5 w-full bg-slate-950/95 border-b border-slate-800/80 px-2.5 flex items-center justify-between text-xs text-slate-300 select-none z-50 fixed top-0 left-0">
      <div className="flex items-center gap-2">
        <button onClick={() => { setLauncherOpen((prev) => !prev); setNetworkMenuOpen(false); setVolumeMenuOpen(false); setPowerMenuOpen(false); setNotificationCenterOpen(false); setIsCalendarOpen(false); }} className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors font-medium ${isLauncherOpen ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-800 text-slate-200'}`}>
          <Icon name="ShieldAlert" className="w-3.5 h-3.5 text-blue-400" />
          <span>Applications</span>
        </button>
        {activeWindow && <div className="flex items-center gap-1.5 px-2 py-0.5 text-slate-400 border-l border-slate-800 pl-3"><Icon name={activeWindow.icon} className="w-3.5 h-3.5 text-blue-400" /><span className="font-semibold text-slate-200 truncate max-w-[180px] lg:max-w-[220px]">{activeWindow.title}</span></div>}
        <div className="hidden md:block ml-2 border-l border-slate-800 pl-2"><InvestigationStatusWidget onOpenNotebook={() => openApp('investigation-notebook')} onOpenDeduction={() => openApp('final-deduction')} /></div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <button onClick={() => { setIsCalendarOpen((prev) => !prev); setLauncherOpen(false); setNetworkMenuOpen(false); setVolumeMenuOpen(false); setPowerMenuOpen(false); setNotificationCenterOpen(false); }} className="flex items-center gap-2 px-2.5 py-0.5 rounded hover:bg-slate-800/80 transition-colors font-mono text-[11px] text-slate-200 tracking-wide">
          <span>{formatDate()}</span>
          <span className="font-bold text-slate-100">{formatTime()}</span>
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => { setNetworkMenuOpen((prev) => !prev); setVolumeMenuOpen(false); setPowerMenuOpen(false); setNotificationCenterOpen(false); setLauncherOpen(false); setIsCalendarOpen(false); }} title={`Network: ${settings.networkState === 'connected' ? settings.activeNetwork : 'Disconnected'}`} className={`p-1.5 rounded transition-colors ${isNetworkMenuOpen ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800 text-slate-300'}`}><Icon name={settings.networkState === 'connected' ? 'Wifi' : 'WifiOff'} className={`w-3.5 h-3.5 ${settings.networkState === 'connected' ? 'text-emerald-400' : 'text-rose-400'}`} /></button>
        <button onClick={() => { setVolumeMenuOpen((prev) => !prev); setNetworkMenuOpen(false); setPowerMenuOpen(false); setNotificationCenterOpen(false); setLauncherOpen(false); setIsCalendarOpen(false); }} title={`Volume: ${settings.isMuted ? 'Muted' : settings.volume + '%'}`} className={`p-1.5 rounded transition-colors ${isVolumeMenuOpen ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800 text-slate-300'}`}><Icon name={settings.isMuted || settings.volume === 0 ? 'VolumeX' : settings.volume < 50 ? 'Volume1' : 'Volume2'} className="w-3.5 h-3.5" /></button>
        <div title="Battery: 94% (Charging via AC adapter)" className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] text-slate-400 cursor-default"><Icon name="BatteryCharging" className="w-3.5 h-3.5 text-emerald-400" /><span className="font-mono text-[10px]">94%</span></div>
        <button onClick={() => { setNotificationCenterOpen((prev) => !prev); setLauncherOpen(false); setNetworkMenuOpen(false); setVolumeMenuOpen(false); setPowerMenuOpen(false); setIsCalendarOpen(false); }} title="Notifications" className={`relative p-1.5 rounded transition-colors ${isNotificationCenterOpen ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800 text-slate-300'}`}><Icon name="Bell" className="w-3.5 h-3.5" />{unreadNotifs > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-950" />}</button>
        <button onClick={() => { setPowerMenuOpen((prev) => !prev); setLauncherOpen(false); setNetworkMenuOpen(false); setVolumeMenuOpen(false); setNotificationCenterOpen(false); setIsCalendarOpen(false); }} className={`flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded transition-colors ${isPowerMenuOpen ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-300'}`}><div className="w-4 h-4 rounded-full bg-blue-700 flex items-center justify-center text-[10px] font-bold text-white">I</div><span className="text-[11px] font-medium">investigator</span><Icon name="ChevronDown" className="w-3 h-3 opacity-60" /></button>
      </div>

      {isLauncherOpen && (
        <div id="os-app-launcher" className="fixed top-8 left-2 w-96 bg-slate-900/98 border border-slate-700/80 rounded-lg shadow-2xl backdrop-blur-md z-999 flex flex-col overflow-hidden text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2.5 border-b border-slate-800 bg-slate-950/60"><div className="relative"><Icon name="Search" className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" /><input type="text" autoFocus placeholder="Type to search applications..." value={launcherSearch} onChange={(e) => setLauncherSearch(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div></div>
          <div className="flex h-80"><div className="w-28 bg-slate-950/40 border-r border-slate-800 p-1.5 space-y-0.5">{categories.map((cat) => <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-2 py-1.5 rounded text-[11px] transition-colors ${selectedCategory === cat ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}`}>{cat}</button>)}</div><div className="flex-1 p-2 overflow-y-auto space-y-1">{filteredApps.length === 0 ? <div className="py-8 text-center text-slate-500 text-xs">No applications match your search.</div> : filteredApps.map((app) => <button key={app.id} onClick={() => { openApp(app.id); setLauncherOpen(false); }} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-slate-800/80 transition-colors text-left group"><div className="w-8 h-8 rounded bg-slate-800 border border-slate-700/60 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0"><Icon name={app.icon} className="w-4 h-4" /></div><div className="overflow-hidden"><div className="font-medium text-slate-100 group-hover:text-blue-300 truncate">{app.name}</div><div className="text-[10px] text-slate-400 truncate">{app.description}</div></div></button>)}</div></div>
          <div className="px-3 py-2 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400"><span>Securix Linux 24.04 LTS</span><button onClick={() => { openApp('settings'); setLauncherOpen(false); }} className="flex items-center gap-1 text-slate-300 hover:text-white"><Icon name="Settings" className="w-3 h-3" /><span>Settings</span></button></div>
        </div>
      )}

      {isCalendarOpen && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 w-64 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl p-3 z-999 text-slate-200 text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800"><span className="font-semibold text-slate-100">{currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span><span className="font-mono text-blue-400 font-bold">{formatTime()}</span></div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] mb-1 font-semibold text-slate-400"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px]">{Array.from({ length: 31 }, (_, i) => { const day = i + 1; const isToday = day === currentTime.getDate(); return <div key={day} className={`py-1 rounded ${isToday ? 'bg-blue-600 font-bold text-white' : 'text-slate-300 hover:bg-slate-800'}`}>{day}</div>; })}</div>
        </div>
      )}

      {isNetworkMenuOpen && (
        <div className="fixed top-8 right-24 w-64 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl p-2.5 z-999 text-xs text-slate-200"><div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800"><span className="font-semibold text-slate-100">Network Connections</span><span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${settings.networkState === 'connected' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>{settings.networkState.toUpperCase()}</span></div><div className="space-y-1"><div className="text-[11px] text-slate-400 mb-1">Simulated Available Networks:</div>{availableNetworks.map((net) => { const isSelected = settings.activeNetwork === net && settings.networkState === 'connected'; return <button key={net} onClick={() => { if (net === 'OFFLINE') updateSettings({ networkState: 'offline', activeNetwork: 'OFFLINE' }); else updateSettings({ networkState: 'connected', activeNetwork: net }); setNetworkMenuOpen(false); }} className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}><div className="flex items-center gap-2"><Icon name={net === 'OFFLINE' ? 'WifiOff' : 'Wifi'} className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} /><span className="font-mono text-[11px]">{net}</span></div>{isSelected && <Icon name="Check" className="w-3.5 h-3.5" />}</button>; })}</div><div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono">IP: 10.24.110.84 / Subnet: 255.255.255.0</div></div>
      )}

      {isVolumeMenuOpen && (
        <div className="fixed top-8 right-16 w-56 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl p-3 z-999 text-xs text-slate-200"><div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800"><span className="font-semibold text-slate-100">Sound Output</span><span className="font-mono text-slate-400">{settings.isMuted ? 'Muted' : `${settings.volume}%`}</span></div><div className="flex items-center gap-3 my-2"><button onClick={() => updateSettings({ isMuted: !settings.isMuted })} className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"><Icon name={settings.isMuted ? 'VolumeX' : 'Volume2'} className="w-4 h-4 text-blue-400" /></button><input type="range" min="0" max="100" value={settings.isMuted ? 0 : settings.volume} onChange={(e) => updateSettings({ volume: parseInt(e.target.value, 10), isMuted: false })} className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg" /></div></div>
      )}

      {isNotificationCenterOpen && (
        <div className="fixed top-8 right-2 w-80 bg-slate-900/98 border border-slate-700/80 rounded-lg shadow-2xl backdrop-blur-md p-3 z-999 text-xs text-slate-200"><div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800"><div className="flex items-center gap-1.5"><Icon name="Bell" className="w-3.5 h-3.5 text-blue-400" /><span className="font-semibold text-slate-100">Notifications</span><span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">{notifications.length}</span></div>{notifications.length > 0 && <button onClick={clearAllNotifications} className="text-[10px] text-blue-400 hover:underline">Clear All</button>}</div><div className="max-h-80 overflow-y-auto space-y-2">{notifications.length === 0 ? <div className="py-8 text-center text-slate-500 text-xs">No new notifications</div> : notifications.map((notif) => <div key={notif.id} className="p-2.5 rounded bg-slate-800/70 border border-slate-700/50 hover:border-slate-600 transition-colors relative group"><div className="flex items-center justify-between mb-1"><span className="font-medium text-slate-200 text-xs">{notif.title}</span><span className="text-[10px] text-slate-400">{notif.timestamp}</span></div><div className="text-[11px] text-slate-300 pr-4">{notif.message}</div><button onClick={() => dismissNotification(notif.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-slate-100 transition-opacity"><Icon name="X" className="w-3 h-3" /></button></div>)}</div></div>
      )}

      {isPowerMenuOpen && (
        <div className="fixed top-8 right-2 w-56 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl p-1.5 z-999 text-xs text-slate-200"><div className="px-3 py-2 border-b border-slate-800 mb-1"><div className="font-semibold text-slate-100">Lead Investigator</div><div className="text-[10px] text-slate-400 font-mono">investigator@workstation-07</div></div><button onClick={() => { setPowerState('locked'); setPowerMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-slate-800 text-left transition-colors"><Icon name="Lock" className="w-3.5 h-3.5 text-slate-400" /><span>Lock Screen</span></button><button onClick={() => { setPowerState('logging_out'); setPowerMenuOpen(false); setTimeout(() => setPowerState('locked'), 1000); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-slate-800 text-left transition-colors"><Icon name="LogOut" className="w-3.5 h-3.5 text-slate-400" /><span>Log Out</span></button><div className="my-1 border-t border-slate-800" /><button onClick={executeRestart} className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-amber-500/20 text-amber-300 text-left transition-colors"><Icon name="RotateCw" className="w-3.5 h-3.5 text-amber-400" /><span>Restart...</span></button><button onClick={executeShutdown} className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-red-500/20 text-red-300 text-left transition-colors"><Icon name="Power" className="w-3.5 h-3.5 text-red-400" /><span>Shut Down...</span></button></div>
      )}
    </header>
  );
};
