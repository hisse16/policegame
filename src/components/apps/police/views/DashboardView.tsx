import React from 'react';
import { Icon } from '../../../common/Icon';
import { policeDatabase } from '../../../../services/police/databaseEngine';
import { CaseRecord } from '../../../../types/police';

interface DashboardViewProps {
  onSelectRecord: (recordId: string) => void;
  onNavigateSection: (section: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectRecord, onNavigateSection }) => {
  const allCases = policeDatabase.getAllRecords('case') as CaseRecord[];
  const case27 = policeDatabase.getRecord('CASE-1998-027') as CaseRecord | null;
  const reopenedCases = allCases.filter((c) => c.status === 'REOPENED');
  const recentViews = policeDatabase.getRecentViews().slice(0, 6);

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 bg-slate-900/50 select-none">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">PRIS // Cold Case Review</div>
            <h1 className="text-xl font-bold text-slate-100 mt-1">Case 27</h1>
            <p className="text-xs text-slate-400 mt-1">Anna Claire Bell • CASE-1998-027</p>
          </div>
          {case27 && (
            <button onClick={() => onSelectRecord(case27.id)} className="px-4 py-2 bg-blue-700 hover:bg-blue-600 border border-blue-500/70 rounded text-xs font-mono font-semibold text-white transition-colors">
              OPEN CASE
            </button>
          )}
        </div>

        <div className="p-5 bg-slate-950/85 border border-amber-800/70 rounded-xl shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-amber-950/70 border border-amber-800/70 text-amber-300">
              <Icon name="Archive" className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-amber-200">REOPENED CASE</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">CASE-1998-027</span>
              </div>
              <h2 className="text-base font-semibold text-slate-100 mt-2">Anna Claire Bell — disappearance</h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-3xl">
                A post-closure audit found irregularities in the original record. Archived reports, evidence and linked records are available for independent review.
              </p>
              <p className="text-[11px] text-slate-500 mt-3 font-mono">There is no assigned route. Follow whatever connection you think matters.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button onClick={() => onSelectRecord('CASE-1998-027')} className="p-4 bg-slate-950/80 border border-slate-800 hover:border-blue-700/60 rounded-lg text-left transition-colors">
            <Icon name="FolderArchive" className="w-4 h-4 text-blue-400" />
            <div className="text-xs font-semibold text-slate-200 mt-3">Case file</div>
            <div className="text-[11px] text-slate-500 mt-1">Original docket, linked people, evidence and reports.</div>
          </button>
          <button onClick={() => onNavigateSection('advanced_search')} className="p-4 bg-slate-950/80 border border-slate-800 hover:border-blue-700/60 rounded-lg text-left transition-colors">
            <Icon name="Search" className="w-4 h-4 text-cyan-400" />
            <div className="text-xs font-semibold text-slate-200 mt-3">Search records</div>
            <div className="text-[11px] text-slate-500 mt-1">Search names, case numbers, vehicles, locations and evidence.</div>
          </button>
          <button onClick={() => onNavigateSection('investigation_notebook')} className="p-4 bg-slate-950/80 border border-slate-800 hover:border-blue-700/60 rounded-lg text-left transition-colors">
            <Icon name="BookOpen" className="w-4 h-4 text-emerald-400" />
            <div className="text-xs font-semibold text-slate-200 mt-3">Your notebook</div>
            <div className="text-[11px] text-slate-500 mt-1">Keep your own notes and review contradictions you discovered.</div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="bg-slate-950/70 border border-slate-800 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-200">Reopened records</div>
              <span className="text-[10px] font-mono text-slate-500">{reopenedCases.length}</span>
            </div>
            <div className="divide-y divide-slate-800/80">
              {reopenedCases.slice(0, 5).map((c) => (
                <button key={c.id} onClick={() => onSelectRecord(c.id)} className="w-full p-3 text-left hover:bg-slate-900/70 transition-colors">
                  <div className="text-xs font-mono font-semibold text-slate-200">{c.caseNumber}</div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">{c.title.replace(`${c.caseNumber}: `, '')}</div>
                </button>
              ))}
              {reopenedCases.length === 0 && <div className="p-4 text-xs text-slate-500">No reopened records.</div>}
            </div>
          </section>

          <section className="bg-slate-950/70 border border-slate-800 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-200">Recent records</div>
              <span className="text-[10px] font-mono text-slate-500">{recentViews.length}</span>
            </div>
            <div className="divide-y divide-slate-800/80">
              {recentViews.map((rec) => (
                <button key={rec.id} onClick={() => onSelectRecord(rec.id)} className="w-full p-3 text-left hover:bg-slate-900/70 transition-colors">
                  <div className="text-xs font-mono font-semibold text-slate-200 truncate">{rec.title}</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">{rec.id} // {rec.type.toUpperCase()}</div>
                </button>
              ))}
              {recentViews.length === 0 && <div className="p-4 text-xs text-slate-500">Your recently opened records will appear here.</div>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
