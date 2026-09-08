import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { Icon } from '../common/Icon';

export const SettingsApp: React.FC<{ windowId: string }> = () => {
  const { settings, updateSettings, availableNetworks } = useOS();

  const [activeSection, setActiveSection] = useState<'appearance' | 'sound' | 'network' | 'datetime' | 'about'>('appearance');

  const wallpapers = [
    {
      id: 'police-slate',
      name: 'Police Slate (Default)',
      preview: 'from-slate-950 via-slate-900 to-slate-800'
    },
    {
      id: 'dark-navy',
      name: 'Midnight Navy Badge',
      preview: 'from-slate-950 via-slate-900 to-indigo-950'
    },
    {
      id: 'classic-mountain',
      name: 'Minimal Peak',
      preview: 'from-slate-950 via-slate-900 to-sky-950'
    },
    {
      id: 'carbon-grid',
      name: 'Technical Carbon Grid',
      preview: 'from-slate-950 via-slate-900 to-cyan-950'
    }
  ];

  return (
    <div className="flex h-full bg-slate-900 text-slate-100 select-none text-xs">
      {/* Left Navigation Sidebar */}
      <div className="w-48 bg-slate-950/60 border-r border-slate-800 p-2 space-y-0.5 shrink-0">
        <div className="text-[10px] font-semibold text-slate-500 uppercase px-3 py-1.5 tracking-wider">
          Workstation Settings
        </div>

        <button
          onClick={() => setActiveSection('appearance')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left transition-colors ${
            activeSection === 'appearance'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Icon name="Image" className="w-4 h-4" />
          <span>Appearance</span>
        </button>

        <button
          onClick={() => setActiveSection('sound')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left transition-colors ${
            activeSection === 'sound'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Icon name="Volume2" className="w-4 h-4" />
          <span>Sound & Audio</span>
        </button>

        <button
          onClick={() => setActiveSection('network')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left transition-colors ${
            activeSection === 'network'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Icon name="Wifi" className="w-4 h-4" />
          <span>Network</span>
        </button>

        <button
          onClick={() => setActiveSection('datetime')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left transition-colors ${
            activeSection === 'datetime'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Icon name="Clock" className="w-4 h-4" />
          <span>Date & Time</span>
        </button>

        <div className="pt-2 border-t border-slate-800/60" />

        <button
          onClick={() => setActiveSection('about')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left transition-colors ${
            activeSection === 'about'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Icon name="Info" className="w-4 h-4" />
          <span>About System</span>
        </button>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Appearance Section */}
        {activeSection === 'appearance' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 mb-1">Desktop Background</h2>
              <p className="text-xs text-slate-400 mb-4">Choose a backdrop for the investigator's workstation.</p>

              <div className="grid grid-cols-2 gap-3">
                {wallpapers.map((w) => {
                  const isSelected = settings.wallpaper === w.id;
                  return (
                    <div
                      key={w.id}
                      onClick={() => updateSettings({ wallpaper: w.id })}
                      className={`cursor-pointer rounded-lg overflow-hidden border p-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500/30 bg-slate-800'
                          : 'border-slate-700/60 bg-slate-950/40 hover:border-slate-500'
                      }`}
                    >
                      <div className={`h-20 rounded bg-gradient-to-br ${w.preview} mb-2 shadow-inner`} />
                      <div className="font-medium text-xs text-slate-200 flex items-center justify-between">
                        <span>{w.name}</span>
                        {isSelected && <Icon name="Check" className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h2 className="text-sm font-semibold text-slate-100 mb-1">Interface Theme</h2>
              <p className="text-xs text-slate-400 mb-3">Workstation display color scheme.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`px-4 py-2 rounded border text-xs font-medium transition-colors ${
                    settings.theme === 'dark'
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  Dark High-Contrast (Default)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sound Section */}
        {activeSection === 'sound' && (
          <div className="space-y-6 max-w-lg">
            <h2 className="text-sm font-semibold text-slate-100 mb-1">Sound Output</h2>
            <p className="text-xs text-slate-400 mb-4">Master volume control and audio output devices.</p>

            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Master Volume</span>
                <span className="font-mono text-slate-400">
                  {settings.isMuted ? 'Muted' : `${settings.volume}%`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateSettings({ isMuted: !settings.isMuted })}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300"
                >
                  <Icon
                    name={settings.isMuted ? 'VolumeX' : 'Volume2'}
                    className="w-5 h-5 text-blue-400"
                  />
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.isMuted ? 0 : settings.volume}
                  onChange={(e) =>
                    updateSettings({ volume: parseInt(e.target.value, 10), isMuted: false })
                  }
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 font-mono">
                Active Output: Intel Sunrise Point-LP HD Audio (Built-in Speakers)
              </div>
            </div>
          </div>
        )}

        {/* Network Section */}
        {activeSection === 'network' && (
          <div className="space-y-6 max-w-lg">
            <h2 className="text-sm font-semibold text-slate-100 mb-1">Network & Connectivity</h2>
            <p className="text-xs text-slate-400 mb-4">Manage Wi-Fi and precinct Ethernet links.</p>

            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-medium text-slate-200">Network Interface State</span>
                <button
                  onClick={() =>
                    updateSettings({
                      networkState: settings.networkState === 'connected' ? 'offline' : 'connected'
                    })
                  }
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    settings.networkState === 'connected'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {settings.networkState === 'connected' ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] text-slate-400">Available Networks:</div>
                {availableNetworks.map((net) => {
                  const isSel = settings.activeNetwork === net && settings.networkState === 'connected';
                  return (
                    <button
                      key={net}
                      onClick={() => {
                        if (net === 'OFFLINE') {
                          updateSettings({ networkState: 'offline', activeNetwork: 'OFFLINE' });
                        } else {
                          updateSettings({ networkState: 'connected', activeNetwork: net });
                        }
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded transition-colors ${
                        isSel
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon name={net === 'OFFLINE' ? 'WifiOff' : 'Wifi'} className="w-4 h-4" />
                        <span className="font-mono text-xs">{net}</span>
                      </div>
                      {isSel && <Icon name="Check" className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Date & Time Section */}
        {activeSection === 'datetime' && (
          <div className="space-y-6 max-w-lg">
            <h2 className="text-sm font-semibold text-slate-100 mb-1">Time & Region</h2>
            <p className="text-xs text-slate-400 mb-4">Clock configuration for the top panel.</p>

            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Clock Display Format</span>
                <div className="flex rounded border border-slate-700 bg-slate-900 p-0.5">
                  <button
                    onClick={() => updateSettings({ clockFormat: '12h' })}
                    className={`px-3 py-1 rounded text-xs ${
                      settings.clockFormat === '12h' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    12-Hour (AM/PM)
                  </button>
                  <button
                    onClick={() => updateSettings({ clockFormat: '24h' })}
                    className={`px-3 py-1 rounded text-xs ${
                      settings.clockFormat === '24h' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    24-Hour (Military)
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Timezone: America/New_York (EST/EDT, UTC-05:00)
              </div>
            </div>
          </div>
        )}

        {/* About Section */}
        {activeSection === 'about' && (
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
              <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-blue-400 shadow-xl">
                <Icon name="Shield" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-100">Securix Linux 24.04 LTS</h1>
                <p className="text-xs text-slate-400 font-mono">Police Department Dedicated Secure Build</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-y-3 text-xs bg-slate-950/60 p-4 rounded-lg border border-slate-800 font-mono">
              <span className="text-slate-500">Device Name:</span>
              <span className="col-span-2 text-slate-200">POLICE-WS-07</span>

              <span className="text-slate-500">Hardware Model:</span>
              <span className="col-span-2 text-slate-200">Dell Precision 5820 Workstation</span>

              <span className="text-slate-500">Processor:</span>
              <span className="col-span-2 text-slate-200">Intel Core i7-13700H (14 Cores, 20 Threads)</span>

              <span className="text-slate-500">Memory:</span>
              <span className="col-span-2 text-slate-200">16.0 GB DDR5 ECC 4800MHz</span>

              <span className="text-slate-500">Storage:</span>
              <span className="col-span-2 text-slate-200">512 GB NVMe M.2 SSD (Encrypted LUKS2)</span>

              <span className="text-slate-500">OS Build:</span>
              <span className="col-span-2 text-slate-200">Securix OS 24.04 (Noble Numbat)</span>

              <span className="text-slate-500">Kernel Version:</span>
              <span className="col-span-2 text-slate-200">Linux 6.8.0-31-generic (x86_64)</span>

              <span className="text-slate-500">Window System:</span>
              <span className="col-span-2 text-slate-200">Wayland / Securix-WM</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
