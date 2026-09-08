import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../../common/Icon';
import { browserDb } from '../../../services/browserDatabase';
import { DownloadItem } from '../../../types/browser';

interface BrowserNavbarProps {
  url: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  isBookmarked: boolean;
  downloads: DownloadItem[];
  adShieldActive: boolean;
  adBlockedCount: number;
  zoomLevel: number;
  onNavigate: (targetUrl: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
  onToggleBookmark: () => void;
  onToggleAdShield: () => void;
  onOpenDownloads: () => void;
  onOpenHistory: () => void;
  onOpenBookmarks: () => void;
  onOpenSettings: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onClearData: () => void;
}

export const BrowserNavbar: React.FC<BrowserNavbarProps> = ({
  url,
  canGoBack,
  canGoForward,
  isLoading,
  isBookmarked,
  downloads,
  adShieldActive,
  adBlockedCount,
  zoomLevel,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onHome,
  onToggleBookmark,
  onToggleAdShield,
  onOpenDownloads,
  onOpenHistory,
  onOpenBookmarks,
  onOpenSettings,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onClearData
}) => {
  const [inputVal, setInputVal] = useState(url);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showShieldMenu, setShowShieldMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);

  // Sync input value when prop URL changes
  useEffect(() => {
    setInputVal(url);
  }, [url]);

  // Autocomplete suggestions
  useEffect(() => {
    if (isFocused && inputVal.trim().length > 1) {
      const res = browserDb.getAutocompleteSuggestions(inputVal);
      setSuggestions(res);
    } else {
      setSuggestions([]);
    }
  }, [inputVal, isFocused]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
      if (shieldRef.current && !shieldRef.current.contains(e.target as Node)) {
        setShowShieldMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFocused(false);
    onNavigate(inputVal);
  };

  const activeDownloads = downloads.filter((d) => d.status === 'downloading');
  const hasActiveDownloads = activeDownloads.length > 0;

  // Security badge calculation
  const isHttps = url.startsWith('https://');
  const isAbout = url.startsWith('about:');

  return (
    <div className="h-10 px-2 flex items-center gap-1.5 border-b border-slate-800 bg-slate-900 select-none relative z-20 shrink-0">
      {/* Navigation Buttons */}
      <button
        onClick={onBack}
        disabled={!canGoBack}
        title="Click to go back (Alt+Left)"
        className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      >
        <Icon name="ArrowLeft" className="w-4 h-4" />
      </button>

      <button
        onClick={onForward}
        disabled={!canGoForward}
        title="Click to go forward (Alt+Right)"
        className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      >
        <Icon name="ArrowRight" className="w-4 h-4" />
      </button>

      <button
        onClick={onReload}
        title={isLoading ? 'Stop loading' : 'Reload page (Ctrl+R)'}
        className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 transition-colors"
      >
        {isLoading ? (
          <Icon name="X" className="w-4 h-4 text-rose-400" />
        ) : (
          <Icon name="RotateCw" className="w-4 h-4" />
        )}
      </button>

      <button
        onClick={onHome}
        title="Open Home Page"
        className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 transition-colors"
      >
        <Icon name="Home" className="w-4 h-4" />
      </button>

      {/* Omnibox / Address Bar */}
      <div className="flex-1 relative">
        <form
          onSubmit={handleSubmit}
          className={`flex items-center bg-slate-950 border rounded-lg px-2.5 py-1 text-xs transition-colors ${
            isFocused
              ? 'border-blue-500 shadow-sm shadow-blue-500/10'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          {/* Security Indicator */}
          <div className="flex items-center gap-1 mr-2 shrink-0 cursor-default">
            {isAbout ? (
              <span title="Internal Browser Page" className="flex items-center text-slate-400">
                <Icon name="Info" className="w-3.5 h-3.5" />
              </span>
            ) : isHttps ? (
              <span title="Simulated TLS 1.3 - Secure Connection" className="flex items-center text-emerald-400">
                <Icon name="Lock" className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span title="Not Secure (Simulated HTTP)" className="flex items-center text-amber-400">
                <Icon name="AlertTriangle" className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {/* URL Input */}
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onFocus={(e) => {
              setIsFocused(true);
              e.target.select();
            }}
            onBlur={() => {
              // delay to let suggestions click register
              setTimeout(() => setIsFocused(false), 200);
            }}
            placeholder="Search Beacon or enter web address"
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-hidden font-mono text-[11px]"
          />

          {/* Bookmark Star Button */}
          <button
            type="button"
            onClick={onToggleBookmark}
            title={isBookmarked ? 'Bookmark added' : 'Bookmark this tab'}
            className={`p-1 rounded-sm transition-colors ${
              isBookmarked
                ? 'text-amber-400 hover:text-amber-300'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon name="Star" className="w-3.5 h-3.5 fill-current" />
          </button>
        </form>

        {/* Autocomplete Suggestions Dropdown */}
        {isFocused && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1.5 z-50 text-xs overflow-hidden">
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                onMouseDown={() => {
                  setInputVal(s);
                  onNavigate(s);
                }}
                className="px-3 py-1.5 hover:bg-slate-800 text-slate-200 cursor-pointer flex items-center gap-2.5 transition-colors"
              >
                <Icon
                  name={s.includes('.') ? 'Globe' : 'Search'}
                  className="w-3.5 h-3.5 text-slate-400 shrink-0"
                />
                <span className="truncate">{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AdShield Extension Indicator */}
      <div className="relative" ref={shieldRef}>
        <button
          onClick={() => setShowShieldMenu(!showShieldMenu)}
          title={`AdShield Lite: ${adShieldActive ? 'Active' : 'Disabled'} (${adBlockedCount} blocked)`}
          className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
            adShieldActive
              ? 'bg-blue-950/60 text-blue-400 border border-blue-800/60 hover:bg-blue-900/60'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Icon name="Shield" className="w-4 h-4" />
          {adBlockedCount > 0 && (
            <span className="text-[10px] font-bold px-1 bg-blue-600 text-white rounded-full">
              {adBlockedCount}
            </span>
          )}
        </button>

        {showShieldMenu && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-3 z-50 text-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-medium text-slate-200">
                <Icon name="ShieldCheck" className="w-4 h-4 text-blue-400" />
                <span>AdShield Lite v2.1</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${adShieldActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
                {adShieldActive ? 'ON' : 'OFF'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Blocks fictional network trackers and promotional banners across simulated websites.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-slate-300">Total Filtered:</span>
              <span className="font-mono font-bold text-blue-400">{adBlockedCount} items</span>
            </div>
            <button
              onClick={() => {
                onToggleAdShield();
                setShowShieldMenu(false);
              }}
              className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors text-center"
            >
              {adShieldActive ? 'Pause AdShield' : 'Enable AdShield'}
            </button>
          </div>
        )}
      </div>

      {/* Downloads Button */}
      <button
        onClick={onOpenDownloads}
        title="View Downloads"
        className={`p-1.5 rounded-md relative text-slate-300 hover:bg-slate-800 transition-colors ${
          hasActiveDownloads ? 'text-blue-400' : ''
        }`}
      >
        <Icon name="Download" className="w-4 h-4" />
        {hasActiveDownloads && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
        )}
      </button>

      {/* Browser 3-Dots Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          title="Customize and control browser"
          className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 transition-colors"
        >
          <Icon name="MoreVertical" className="w-4 h-4" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 text-xs text-slate-200">
            <button
              onClick={() => {
                onHome();
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Icon name="Plus" className="w-3.5 h-3.5 text-slate-400" />
                <span>New Tab</span>
              </div>
              <span className="text-[10px] text-slate-500">Ctrl+T</span>
            </button>

            <button
              onClick={() => {
                onOpenBookmarks();
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Icon name="Star" className="w-3.5 h-3.5 text-slate-400" />
                <span>Bookmarks</span>
              </div>
              <span className="text-[10px] text-slate-500">Ctrl+B</span>
            </button>

            <button
              onClick={() => {
                onOpenHistory();
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Icon name="History" className="w-3.5 h-3.5 text-slate-400" />
                <span>History</span>
              </div>
              <span className="text-[10px] text-slate-500">Ctrl+H</span>
            </button>

            <button
              onClick={() => {
                onOpenDownloads();
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Icon name="Download" className="w-3.5 h-3.5 text-slate-400" />
                <span>Downloads</span>
              </div>
              <span className="text-[10px] text-slate-500">Ctrl+J</span>
            </button>

            <div className="h-px bg-slate-800 my-1" />

            {/* Zoom Controls */}
            <div className="px-3 py-1.5 flex items-center justify-between text-slate-300">
              <span className="text-[11px]">Zoom</span>
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded px-1 py-0.5">
                <button
                  onClick={onZoomOut}
                  className="px-1 hover:text-white text-slate-400"
                  title="Zoom out"
                >
                  -
                </button>
                <button
                  onClick={onResetZoom}
                  className="px-1 text-[10px] font-mono hover:text-white text-slate-300"
                  title="Reset zoom"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  onClick={onZoomIn}
                  className="px-1 hover:text-white text-slate-400"
                  title="Zoom in"
                >
                  +
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-800 my-1" />

            <button
              onClick={() => {
                onOpenSettings();
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2"
            >
              <Icon name="Settings" className="w-3.5 h-3.5 text-slate-400" />
              <span>Browser Settings</span>
            </button>

            <button
              onClick={() => {
                onClearData();
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-rose-950 hover:text-rose-200 flex items-center gap-2 text-rose-400"
            >
              <Icon name="Trash2" className="w-3.5 h-3.5" />
              <span>Clear Browsing Data</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
