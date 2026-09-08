import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { audioSystem } from '../../services/audioSystem';
import { Icon } from '../common/Icon';

type TabKey = 'display' | 'audio' | 'accessibility' | 'gameplay' | 'controls';

export const GameSettingsScreen: React.FC = () => {
  const { gameSettings, updateGameSettings, resetGameSettings, returnToMainMenu } = useGame();
  const [activeTab, setActiveTab] = useState<TabKey>('display');
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        returnToMainMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [returnToMainMenu]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {}
  };

  const tabs: { key: TabKey; title: string; icon: string }[] = [
    { key: 'display', title: 'Display', icon: 'Tv' },
    { key: 'audio', title: 'Audio', icon: 'Volume2' },
    { key: 'accessibility', title: 'Accessibility', icon: 'Eye' },
    { key: 'gameplay', title: 'Gameplay', icon: 'Sliders' },
    { key: 'controls', title: 'Controls', icon: 'Keyboard' }
  ];

  return (
    <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-12 max-w-5xl mx-auto text-slate-200 select-none animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest">
            <Icon name="Settings" className="w-3.5 h-3.5" />
            <span>GAME CONFIGURATION // SYSTEM SHELL</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">
            Game Settings
          </h1>
          <div className="text-[11px] text-slate-500">
            Note: These control the overarching game environment, separate from in-OS computer settings.
          </div>
        </div>

        <button
          onClick={returnToMainMenu}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300 hover:text-white text-xs transition-all shadow-md"
        >
          <Icon name="ArrowLeft" className="w-3.5 h-3.5" />
          <span>Back to Menu (Esc)</span>
        </button>
      </div>

      {/* Tabs & Main Config Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 my-6 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-52 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  audioSystem.playMenuClick();
                  setActiveTab(tab.key);
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-left transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon
                  name={tab.icon}
                  className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`}
                />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-slate-900/70 border border-slate-800/90 rounded-xl p-6 md:p-8 overflow-y-auto backdrop-blur-xs flex flex-col justify-between">
          <div className="space-y-6">
            {/* DISPLAY TAB */}
            {activeTab === 'display' && (
              <div className="space-y-5 text-xs">
                <h3 className="text-sm font-semibold text-slate-100 border-b border-slate-800 pb-2">
                  Display & Resolution Settings
                </h3>

                {/* Fullscreen Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="font-medium text-slate-200">Fullscreen Mode</div>
                    <div className="text-[11px] text-slate-500">Toggle borderless browser fullscreen display</div>
                  </div>
                  <button
                    onClick={toggleFullscreen}
                    className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700"
                  >
                    {isFullscreen ? 'Exit Fullscreen' : 'Enable Fullscreen'}
                  </button>
                </div>

                {/* UI Scale */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="font-medium text-slate-200">Interface Scale</div>
                    <div className="text-[11px] text-slate-500">Scale factor for workstation icons and UI components</div>
                  </div>
                  <div className="flex gap-2">
                    {[1, 1.1, 1.25].map((scale) => (
                      <button
                        key={scale}
                        onClick={() => {
                          audioSystem.playMenuClick();
                          updateGameSettings({ uiScale: scale as any });
                        }}
                        className={`px-3 py-1 rounded-md text-xs font-mono border ${
                          gameSettings.uiScale === scale
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {scale * 100}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* CRT Scanline Filter */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="font-medium text-slate-200">CRT Scanline Overlay</div>
                    <div className="text-[11px] text-slate-500">Subtle horizontal scanlines for retro forensic monitor feel</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={gameSettings.crtScanlines}
                    onChange={(e) => {
                      audioSystem.playMenuClick();
                      updateGameSettings({ crtScanlines: e.target.checked });
                    }}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                  />
                </div>

                {/* Subtle Ambient Glow */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="font-medium text-slate-200">Screen Edge Glow</div>
                    <div className="text-[11px] text-slate-500">Soft vignette lighting around display borders</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={gameSettings.subtleGlow}
                    onChange={(e) => {
                      audioSystem.playMenuClick();
                      updateGameSettings({ subtleGlow: e.target.checked });
                    }}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                  />
                </div>
              </div>
            )}

            {/* AUDIO TAB */}
            {activeTab === 'audio' && (
              <div className="space-y-5 text-xs">
                <h3 className="text-sm font-semibold text-slate-100 border-b border-slate-800 pb-2">
                  Audio & Synthesis Settings
                </h3>

                {/* Master Volume */}
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-200">Master Volume</span>
                    <span className="font-mono text-blue-400">{gameSettings.masterVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={gameSettings.masterVolume}
                    onChange={(e) =>
                      updateGameSettings({ masterVolume: parseInt(e.target.value, 10) })
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Ambient Hum Volume */}
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-200">Archive Ambient Hum</div>
                      <div className="text-[11px] text-slate-500">Low 52Hz synthesized workstation drone</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-blue-400">{gameSettings.ambientVolume}%</span>
                      <button
                        onClick={() => {
                          audioSystem.playMenuClick();
                          updateGameSettings({ ambientMuted: !gameSettings.ambientMuted });
                        }}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400"
                        title={gameSettings.ambientMuted ? 'Unmute' : 'Mute'}
                      >
                        <Icon name={gameSettings.ambientMuted ? 'VolumeX' : 'Volume2'} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    disabled={gameSettings.ambientMuted}
                    value={gameSettings.ambientVolume}
                    onChange={(e) =>
                      updateGameSettings({ ambientVolume: parseInt(e.target.value, 10) })
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-30"
                  />
                </div>

                {/* UI Sound Effects */}
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-200">Interface & Feedback Sounds</div>
                      <div className="text-[11px] text-slate-500">Tactile menu clicks, keyboard feedback, and boot tones</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-blue-400">{gameSettings.uiVolume}%</span>
                      <button
                        onClick={() => {
                          audioSystem.playMenuClick();
                          updateGameSettings({ uiMuted: !gameSettings.uiMuted });
                        }}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400"
                        title={gameSettings.uiMuted ? 'Unmute' : 'Mute'}
                      >
                        <Icon name={gameSettings.uiMuted ? 'VolumeX' : 'Volume2'} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    disabled={gameSettings.uiMuted}
                    value={gameSettings.uiVolume}
                    onChange={(e) =>
                      updateGameSettings({ uiVolume: parseInt(e.target.value, 10) })
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-30"
                  />
                </div>
              </div>
            )}

            {/* ACCESSIBILITY TAB */}
            {activeTab === 'accessibility' && (
              <div className="space-y-5 text-xs">
                <h3 className="text-sm font-semibold text-slate-100 border-b border-slate-800 pb-2">
                  Accessibility Options
                </h3>

                {/* Text Size */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="font-medium text-slate-200">Text Readability Scale</div>
                    <div className="text-[11px] text-slate-500">Enlarge document and terminal typography</div>
                  </div>
                  <div className="flex gap-2">
                    {(['normal', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          audioSystem.playMenuClick();
                          updateGameSettings({ textSize: size });
                        }}
                        className={`px-3 py-1 rounded-md text-xs uppercase border ${
                          gameSettings.textSize === size
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="font-medium text-slate-200">Reduced Motion</div>
                    <div className="text-[11px] text-slate-500">Minimize animations and transition effects</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={gameSettings.reducedMotion}
                    onChange={(e) => {
                      audioSystem.playMenuClick();
                      updateGameSettings({ reducedMotion: e.target.checked });
                    }}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                  />
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="font-medium text-slate-200">High Contrast Mode</div>
                    <div className="text-[11px] text-slate-500">Increase border and text contrast across menus</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={gameSettings.highContrast}
                    onChange={(e) => {
                      audioSystem.playMenuClick();
                      updateGameSettings({ highContrast: e.target.checked });
                    }}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                  />
                </div>
              </div>
            )}

            {/* GAMEPLAY TAB */}
            {activeTab === 'gameplay' && (
              <div className="space-y-5 text-xs">
                <h3 className="text-sm font-semibold text-slate-100 border-b border-slate-800 pb-2">
                  Investigation & State Saving
                </h3>

                {/* Autosave */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="font-medium text-slate-200">Automatic Investigation Save</div>
                    <div className="text-[11px] text-slate-500">Automatically save on workstation shutdown and milestones</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={gameSettings.autosaveEnabled}
                    onChange={(e) => {
                      audioSystem.playMenuClick();
                      updateGameSettings({ autosaveEnabled: e.target.checked });
                    }}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                  />
                </div>

                {/* Confirm Delete */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="font-medium text-slate-200">Confirm Evidence Deletion</div>
                    <div className="text-[11px] text-slate-500">Prompt confirmation dialog before deleting files into Trash</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={gameSettings.confirmDestructiveDelete}
                    onChange={(e) => {
                      audioSystem.playMenuClick();
                      updateGameSettings({ confirmDestructiveDelete: e.target.checked });
                    }}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                  />
                </div>

                {/* Language selection */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="font-medium text-slate-200">System Language</div>
                    <div className="text-[11px] text-slate-500">Display language for system shell and case docket</div>
                  </div>
                  <select
                    value={gameSettings.language}
                    onChange={(e) => {
                      audioSystem.playMenuClick();
                      updateGameSettings({ language: e.target.value });
                    }}
                    className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-slate-200"
                  >
                    <option value="English (US)">English (US)</option>
                  </select>
                </div>
              </div>
            )}

            {/* CONTROLS TAB */}
            {activeTab === 'controls' && (
              <div className="space-y-4 text-xs">
                <h3 className="text-sm font-semibold text-slate-100 border-b border-slate-800 pb-2">
                  Workstation Keyboard Shortcuts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">Switch Windows</span>
                    <kbd className="px-2 py-1 rounded bg-slate-800 font-mono text-[10px] text-blue-400">Alt + Tab</kbd>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">Close Active Window</span>
                    <kbd className="px-2 py-1 rounded bg-slate-800 font-mono text-[10px] text-blue-400">Alt + F4</kbd>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">Close Menus / Cancel</span>
                    <kbd className="px-2 py-1 rounded bg-slate-800 font-mono text-[10px] text-blue-400">Escape</kbd>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">Skip Boot Screen</span>
                    <kbd className="px-2 py-1 rounded bg-slate-800 font-mono text-[10px] text-blue-400">Space</kbd>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reset button */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => {
                audioSystem.playMenuClick();
                resetGameSettings();
              }}
              className="text-[11px] text-rose-400 hover:text-rose-300 underline"
            >
              Reset Settings to Defaults
            </button>
            <span className="text-[11px] text-slate-500">Changes take effect immediately</span>
          </div>
        </div>
      </div>
    </div>
  );
};
