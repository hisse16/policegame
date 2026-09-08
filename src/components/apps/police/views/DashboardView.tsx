import React from 'react';
import { Icon } from '../../../common/Icon';
import { policeDatabase } from '../../../../services/police/databaseEngine';
import { AnyRecord, CaseRecord, PersonRecord, WarrantRecord } from '../../../../types/police';

interface DashboardViewProps {
  onSelectRecord: (recordId: string) => void;
  onNavigateSection: (section: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectRecord,
  onNavigateSection
}) => {
  const stats = policeDatabase.getStats();
  const recentViews = policeDatabase.getRecentViews();
  const searchHistory = policeDatabase.getSearchHistory();

  // Get active/reopened cases
  const allCases = policeDatabase.getAllRecords('case') as CaseRecord[];
  const highPriorityCases = allCases
    .filter((c) => c.priority === 'CRITICAL' || c.priority === 'HIGH')
    .slice(0, 6);
  const reopenedCases = allCases.filter((c) => c.status === 'REOPENED');

  // Get missing persons
  const allPersons = policeDatabase.getAllRecords('person') as PersonRecord[];
  const missingPersons = allPersons
    .filter((p) => p.isMissing || p.tags.includes('MISSING_PERSON'))
    .slice(0, 5);

  // Get active warrants
  const allWarrants = policeDatabase.getAllRecords('warrant') as WarrantRecord[];
  const activeWarrants = allWarrants
    .filter((w) => w.warrantStatus === 'ACTIVE')
    .slice(0, 5);

  // Get recent reports
  const allReports = policeDatabase.getAllRecords('report').slice(0, 5);

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 space-y-6 select-none bg-slate-900/50">
      {/* 1. System Bulletin / Reopened Case Notice */}
      {reopenedCases.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-800/80 rounded-lg p-4 flex items-start justify-between shadow-md">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-amber-900/50 text-amber-300 mt-0.5">
              <Icon name="AlertTriangle" className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-amber-200 tracking-wider uppercase">
                  ACTIVE COLD CASE REOPENING NOTICE
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-900/80 text-amber-200">
                  REF: WORKSTATION #07
                </span>
              </div>
              <p className="text-xs text-amber-100/90 mt-1 leading-relaxed">
                <strong>CASE-1998-027 (Anna Claire Bell)</strong> was officially reopened by the Cold Case Review Unit. Uncataloged audio evidence and shipping manifests are now indexed and available for forensic comparison.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectRecord('CASE-1998-027')}
            className="px-3 py-1.5 rounded bg-amber-700 hover:bg-amber-600 text-white text-xs font-mono font-semibold transition-colors shrink-0 ml-4 shadow-sm"
          >
            OPEN CASE DOCKET
          </button>
        </div>
      )}

      {/* 2. Top Metric Counters (Calculated directly from Database) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {[
          { label: 'OPEN CASES', value: stats.openCases.toLocaleString(), color: 'text-blue-400', section: 'cases' },
          { label: 'CLOSED CASES', value: stats.closedCases.toLocaleString(), color: 'text-slate-400', section: 'cases' },
          { label: 'ACTIVE INVEST.', value: stats.activeInvestigations.toLocaleString(), color: 'text-emerald-400', section: 'cases' },
          { label: 'MISSING PERSONS', value: stats.missingPersons.toLocaleString(), color: 'text-amber-400', section: 'missing_persons' },
          { label: 'WANTED PERSONS', value: stats.wantedPersons.toLocaleString(), color: 'text-rose-400', section: 'warrants' },
          { label: 'UNIDENTIFIED', value: stats.unidentifiedPersons.toString(), color: 'text-purple-400', section: 'persons' },
          { label: 'RECENT INCIDENTS', value: stats.recentIncidents.toLocaleString(), color: 'text-cyan-400', section: 'incidents' },
          { label: 'EVIDENCE ITEMS', value: stats.evidenceItems.toLocaleString(), color: 'text-amber-300', section: 'evidence' }
        ].map((m, idx) => (
          <button
            key={idx}
            onClick={() => onNavigateSection(m.section)}
            className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-left hover:border-slate-700 hover:bg-slate-900 transition-all group"
          >
            <div className="text-[9px] font-mono tracking-wider text-slate-400 uppercase font-bold truncate">
              {m.label}
            </div>
            <div className={`text-xl font-bold font-mono mt-1 ${m.color} group-hover:scale-105 transition-transform`}>
              {m.value}
            </div>
          </button>
        ))}
      </div>

      {/* 3. Main Dashboard Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: High Priority Cases & Recently Viewed */}
        <div className="space-y-6">
          {/* High Priority Cases */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
                <Icon name="AlertCircle" className="w-3.5 h-3.5 text-rose-400" />
                <span>HIGH PRIORITY / UNRESOLVED CASES</span>
              </div>
              <button
                onClick={() => onNavigateSection('cases')}
                className="text-[10px] font-mono text-blue-400 hover:text-blue-300"
              >
                View All &rarr;
              </button>
            </div>
            <div className="divide-y divide-slate-800/80">
              {highPriorityCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectRecord(c.id)}
                  className="p-3 hover:bg-slate-900/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-100 hover:text-blue-400">
                      {c.caseNumber}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        c.status === 'REOPENED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : c.priority === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-1 truncate">
                    {c.title.replace(`${c.caseNumber}: `, '')}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-slate-400">
                    <span>{c.classification}</span>
                    <span>•</span>
                    <span>{c.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Viewed Records */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
                <Icon name="Clock" className="w-3.5 h-3.5 text-blue-400" />
                <span>RECENTLY ACCESSED RECORDS</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {recentViews.length} ITEMS
              </span>
            </div>
            <div className="divide-y divide-slate-800/80 max-h-56 overflow-y-auto">
              {recentViews.length === 0 ? (
                <div className="p-4 text-center text-xs font-mono text-slate-400">
                  No records viewed yet during this session.
                </div>
              ) : (
                recentViews.slice(0, 6).map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => onSelectRecord(rec.id)}
                    className="p-2.5 hover:bg-slate-900/60 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-mono font-semibold text-slate-200 hover:text-blue-300 truncate">
                        {rec.title}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {rec.id} // {rec.type.toUpperCase()}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 shrink-0">
                      {rec.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Missing Persons Bulletin & Active Warrants */}
        <div className="space-y-6">
          {/* Missing Persons */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
                <Icon name="UserX" className="w-3.5 h-3.5 text-amber-400" />
                <span>MISSING PERSONS BULLETIN</span>
              </div>
              <button
                onClick={() => onNavigateSection('missing_persons')}
                className="text-[10px] font-mono text-blue-400 hover:text-blue-300"
              >
                View Register &rarr;
              </button>
            </div>
            <div className="divide-y divide-slate-800/80">
              {missingPersons.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectRecord(p.id)}
                  className="p-3 hover:bg-slate-900/60 cursor-pointer transition-colors flex items-start justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-100 hover:text-blue-400">
                      {p.firstName} {p.lastName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      DOB: {p.dob} // {p.gender} // {p.height}
                    </div>
                    {p.missingPersonDetails && (
                      <div className="text-[11px] text-amber-300/80 font-mono mt-1">
                        Last Seen: {p.missingPersonDetails.lastSeenLocation}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold shrink-0">
                    MISSING
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Warrants */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
                <Icon name="FileWarning" className="w-3.5 h-3.5 text-rose-400" />
                <span>OUTSTANDING ACTIVE WARRANTS</span>
              </div>
              <button
                onClick={() => onNavigateSection('warrants')}
                className="text-[10px] font-mono text-blue-400 hover:text-blue-300"
              >
                All Warrants &rarr;
              </button>
            </div>
            <div className="divide-y divide-slate-800/80">
              {activeWarrants.map((w) => (
                <div
                  key={w.id}
                  onClick={() => onSelectRecord(w.id)}
                  className="p-2.5 hover:bg-slate-900/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {w.warrantNumber}
                    </span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-rose-950 text-rose-300 font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 font-medium">
                    {w.personName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                    Charges: {w.charges.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Recent Reports & Search History */}
        <div className="space-y-6">
          {/* Recent Reports */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
                <Icon name="FileText" className="w-3.5 h-3.5 text-cyan-400" />
                <span>OFFICIAL POLICE REPORTS</span>
              </div>
              <button
                onClick={() => onNavigateSection('reports')}
                className="text-[10px] font-mono text-blue-400 hover:text-blue-300"
              >
                View Archive &rarr;
              </button>
            </div>
            <div className="divide-y divide-slate-800/80">
              {allReports.map((r: any) => (
                <div
                  key={r.id}
                  onClick={() => onSelectRecord(r.id)}
                  className="p-2.5 hover:bg-slate-900/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-slate-200 hover:text-blue-300">
                      {r.reportNumber}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {r.date}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 truncate">
                    {r.reportType} // {r.authorName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    Case Ref: {r.caseId || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search History */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
                <Icon name="Search" className="w-3.5 h-3.5 text-slate-400" />
                <span>TERMINAL SEARCH LOGS</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">SESSION</span>
            </div>
            <div className="divide-y divide-slate-800/80 max-h-48 overflow-y-auto">
              {searchHistory.length === 0 ? (
                <div className="p-4 text-center text-xs font-mono text-slate-400">
                  No previous searches logged.
                </div>
              ) : (
                searchHistory.slice(0, 5).map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2 px-3 flex items-center justify-between text-xs font-mono text-slate-300 hover:bg-slate-900"
                  >
                    <span className="truncate pr-2">"{s.query}"</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{s.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
