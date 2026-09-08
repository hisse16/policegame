import React from 'react';
import { Icon } from '../../../common/Icon';
import { policeDatabase } from '../../../../services/police/databaseEngine';

interface TopBarProps {
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  onSearchSubmit: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectRecord: (recordId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenHelp,
  onOpenSettings,
  onSearchSubmit,
  searchQuery,
  setSearchQuery
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      policeDatabase.recordSearch(searchQuery.trim());
      onSearchSubmit(searchQuery.trim());
    }
  };

  return (
    <div className="h-13 bg-slate-900 border-b border-slate-700/80 px-4 flex items-center justify-between select-none shrink-0 shadow-sm">
      {/* Left Identity */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-slate-800 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
          <Icon name="Shield" className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono tracking-wider text-slate-100 uppercase">
              POLICE RECORDS & INVESTIGATIONS
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-950/70 border border-blue-700/50 text-blue-300 font-semibold">
              PRIS v4.2
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Criminal Records & Forensic Investigation Database
          </div>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Icon name="Search" className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Universal Search (Name, Case #, Plate, VIN, Evidence ID, Address)..."
            className="w-full bg-slate-950/90 border border-slate-700 rounded-md pl-8 pr-16 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
              }}
              className="absolute right-9 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <Icon name="X" className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => {
              if (searchQuery.trim()) {
                policeDatabase.recordSearch(searchQuery.trim());
                onSearchSubmit(searchQuery.trim());
              }
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-mono text-white transition-colors"
          >
            GO
          </button>
        </div>
      </div>

      {/* Right User & Controls */}
      <div className="flex items-center gap-3">
        {/* System Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-2 py-1 rounded bg-slate-950/60 border border-slate-800 text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400">NETWORK:</span>
          <span className="text-emerald-400 font-medium">METRO-SECURE</span>
        </div>

        {/* Logged in Officer */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-xs">
          <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
            <Icon name="User" className="w-3.5 h-3.5" />
          </div>
          <div className="text-left font-mono">
            <div className="text-[11px] font-semibold text-slate-200 leading-tight">
              Det. S. Miller #4081
            </div>
            <div className="text-[9px] text-blue-400 leading-tight">
              COLD CASE REVIEW UNIT
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 border-l border-slate-700/60 pl-2">
          <button
            onClick={onOpenHelp}
            title="System Operation Guide & Reference"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Icon name="HelpCircle" className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            title="Database Preferences & View Scale"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Icon name="Settings" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
