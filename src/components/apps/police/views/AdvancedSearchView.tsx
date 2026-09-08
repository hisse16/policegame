import React, { useState } from 'react';
import { Icon } from '../../../common/Icon';
import { AdvancedSearchFilters, AnyRecord, CrimeCategory, RecordType } from '../../../../types/police';
import { searchEngine } from '../../../../services/police/searchEngine';
import { policeDatabase } from '../../../../services/police/databaseEngine';

interface AdvancedSearchViewProps {
  onSelectRecord: (id: string) => void;
  onExportRecord: (record: AnyRecord) => void;
}

export const AdvancedSearchView: React.FC<AdvancedSearchViewProps> = ({
  onSelectRecord,
  onExportRecord
}) => {
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    query: '',
    recordType: 'all',
    crimeCategory: 'all',
    status: 'all',
    priority: 'all',
    dateFrom: '',
    dateTo: '',
    location: ''
  });

  const [results, setResults] = useState<AnyRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const hits = searchEngine.advancedSearch(filters);
    setResults(hits);
    setHasSearched(true);
    if (filters.query) {
      policeDatabase.recordSearch(`ADV: ${filters.query}`);
    }
  };

  const handleReset = () => {
    setFilters({
      query: '',
      recordType: 'all',
      crimeCategory: 'all',
      status: 'all',
      priority: 'all',
      dateFrom: '',
      dateTo: '',
      location: ''
    });
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="flex-1 h-full flex flex-col select-none bg-slate-900/60 overflow-hidden font-mono">
      {/* Search Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Sliders" className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              PRIS MULTI-PARAMETER ADVANCED SEARCH
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            METROPOLITAN RELATIONAL ARCHIVES
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
        {/* Search Filter Form */}
        <form onSubmit={handleSearch} className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. Universal Keywords */}
            <div className="lg:col-span-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Keyword / Phrase / Exact ID
              </label>
              <input
                type="text"
                value={filters.query || ''}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                placeholder="e.g. Anna Bell, Taurus, 42 Willow, tape, Hayes..."
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* 2. Record Type */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Record Category
              </label>
              <select
                value={filters.recordType || 'all'}
                onChange={(e) => setFilters({ ...filters, recordType: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-hidden"
              >
                <option value="all">ALL REGISTERS</option>
                <option value="person">Persons (Dossiers)</option>
                <option value="case">Cases (Investigations)</option>
                <option value="incident">Incidents</option>
                <option value="evidence">Evidence</option>
                <option value="vehicle">Vehicles</option>
                <option value="report">Police Reports</option>
                <option value="officer">Officers</option>
                <option value="location">Locations</option>
                <option value="warrant">Warrants</option>
              </select>
            </div>

            {/* 3. Crime Category */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Crime Classification
              </label>
              <select
                value={filters.crimeCategory || 'all'}
                onChange={(e) => setFilters({ ...filters, crimeCategory: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-hidden"
              >
                <option value="all">ALL CRIMES</option>
                <option value="HOMICIDE">Homicide</option>
                <option value="MISSING_PERSON">Missing Person</option>
                <option value="BURGLARY">Burglary</option>
                <option value="ROBBERY">Robbery</option>
                <option value="THEFT">Theft</option>
                <option value="NARCOTICS">Narcotics</option>
                <option value="FRAUD">Fraud</option>
                <option value="CYBERCRIME">Cybercrime</option>
                <option value="ORGANIZED_CRIME">Organized Crime</option>
                <option value="WEAPONS">Weapons</option>
              </select>
            </div>

            {/* 4. Status */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Investigation Status
              </label>
              <select
                value={filters.status || 'all'}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-hidden"
              >
                <option value="all">ANY STATUS</option>
                <option value="OPEN">OPEN / ACTIVE</option>
                <option value="REOPENED">REOPENED (COLD CASE)</option>
                <option value="CLOSED">CLOSED</option>
                <option value="SOLVED">SOLVED</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="MISSING">MISSING</option>
                <option value="IN_STORAGE">IN STORAGE (EVIDENCE)</option>
              </select>
            </div>

            {/* 5. Priority */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Priority Level
              </label>
              <select
                value={filters.priority || 'all'}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-hidden"
              >
                <option value="all">ANY PRIORITY</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="NORMAL">NORMAL</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            {/* 6. Date Range From */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Logged From (YYYY-MM-DD)
              </label>
              <input
                type="text"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                placeholder="1998-01-01"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-hidden"
              />
            </div>

            {/* 7. Date Range To */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Logged To (YYYY-MM-DD)
              </label>
              <input
                type="text"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                placeholder="2026-12-31"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              RESET FILTERS
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Icon name="Search" className="w-3.5 h-3.5" />
              <span>RUN QUERY</span>
            </button>
          </div>
        </form>

        {/* Results Section */}
        {hasSearched && (
          <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
            <div className="p-3 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                QUERY RESULTS ({results.length} MATCHES)
              </span>
            </div>

            {results.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                NO RECORDS MATCHED THE SPECIFIED SEARCH CRITERIA.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto">
                {results.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => onSelectRecord(rec.id)}
                    className="p-3 hover:bg-slate-900/60 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-400 hover:underline">
                          {rec.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-100">
                          {rec.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase">
                          {rec.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Status: {rec.status} • Logged: {rec.createdAt}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRecord(rec.id);
                      }}
                      className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold shrink-0 ml-4"
                    >
                      VIEW
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
