import React, { useState } from 'react';
import { Icon } from '../common/Icon';

interface InvestigatorOnboardingProps { onComplete: () => void; onOpenPRIS?: () => void; }

const PAGES = [
  { eyebrow: 'NORTHBRIDGE POLICE DEPARTMENT // CASE 27', title: 'The archive was not supposed to change.', body: 'September 14, 1998. Anna Claire Bell disappeared. The case was closed years ago. Tonight, a routine records audit found a modification that should not exist.', icon: 'Shield' },
  { eyebrow: 'CASE BRIEF // REOPENED 2026', title: 'Someone touched the file after closure.', body: 'Your assignment is not to solve a murder from a single clue. Reconstruct what happened by following the paper trail left across police records, evidence, people and places.', icon: 'FileSearch' },
  { eyebrow: 'INVESTIGATIVE METHOD', title: 'The mystery is complicated. The interface is not.', body: 'Start with the case. Read the record. Follow links that matter. Compare dates, names and reports. Important discoveries will open the next part of the investigation without requiring you to guess secret commands.', icon: 'Compass' },
  { eyebrow: 'YOUR WORKSTATION', title: 'Everything you need is here.', body: 'PRIS holds official records. Evidence Lab handles physical evidence. The Browser contains public archives. The Board connects your theory. Your Notebook keeps your own reasoning. More tools become available as the case develops.', icon: 'Monitor' }
];

export const InvestigatorOnboarding: React.FC<InvestigatorOnboardingProps> = ({ onComplete, onOpenPRIS }) => {
  const [page, setPage] = useState(0);
  const current = PAGES[page];
  const last = page === PAGES.length - 1;
  const finish = (open = false) => { try { sessionStorage.setItem('investigator_onboarding_seen', 'true'); } catch {} onComplete(); if (open) onOpenPRIS?.(); };

  return <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 font-mono">
    <div className="w-[min(820px,calc(100vw-2rem))] bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />
      <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between"><div className="flex items-center gap-2 text-[10px] tracking-[.18em] text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-400" /> SECURIX // INVESTIGATOR WORKSTATION</div><button onClick={() => finish()} className="text-[10px] text-slate-600 hover:text-slate-300 uppercase">Skip briefing</button></div>
      <div className="grid md:grid-cols-[240px_1fr] min-h-[420px]">
        <div className="relative overflow-hidden bg-slate-900 border-r border-slate-800 p-5">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,#3b82f6,transparent_45%),radial-gradient(circle_at_80%_80%,#0ea5e9,transparent_40%)]" />
          <div className="relative h-full flex flex-col justify-between">
            <div><div className="text-[9px] tracking-[.2em] text-slate-500">ACTIVE FILE</div><div className="mt-2 text-2xl font-bold text-white">CASE 27</div><div className="mt-1 text-[11px] text-blue-300">ANNA CLAIRE BELL</div><div className="mt-8 space-y-2"><div className="flex items-center gap-2 text-[10px] text-slate-400"><span className="w-2 h-2 rounded-full bg-amber-400" /> REOPENED</div><div className="flex items-center gap-2 text-[10px] text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-600" /> 14 SEP 1998</div><div className="flex items-center gap-2 text-[10px] text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-600" /> MISSING PERSON</div></div></div>
            <div className="border-t border-slate-800 pt-4"><div className="text-[9px] text-slate-600">FILE STATUS</div><div className="mt-1 text-[10px] text-emerald-400">OPEN FOR REVIEW</div></div>
          </div>
        </div>
        <div className="p-7 sm:p-9 flex flex-col">
          <div className="flex items-start gap-5"><div className="shrink-0 w-14 h-14 rounded-2xl bg-blue-950/70 border border-blue-700/60 flex items-center justify-center text-blue-400"><Icon name={current.icon} size={27} /></div><div><div className="text-[10px] font-bold tracking-[.18em] text-blue-400">{current.eyebrow}</div><h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-100">{current.title}</h1><p className="mt-4 text-sm leading-7 text-slate-300 max-w-xl">{current.body}</p></div></div>
          {page === 0 && <div className="mt-7 rounded-xl border border-slate-800 bg-slate-900/60 p-4"><div className="text-[9px] text-slate-500 tracking-wider">LAST KNOWN RECORD</div><div className="mt-2 flex items-center justify-between"><span className="text-xs text-slate-200">CASE-1998-027</span><span className="text-[9px] text-amber-400">POST-CLOSURE MODIFICATION</span></div></div>}
          {page === 1 && <div className="mt-7 grid grid-cols-3 gap-2">{[['01','CASE','Start with the reopened docket'],['02','TRACE','Follow linked records'],['03','RECONSTRUCT','Build the timeline']].map(([n,t,d]) => <div key={n} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3"><div className="text-[9px] text-blue-400">{n}</div><div className="mt-1 text-[10px] font-bold text-slate-200">{t}</div><div className="mt-1 text-[9px] leading-4 text-slate-500">{d}</div></div>)}</div>}
          {page === 2 && <div className="mt-7 flex items-center gap-2 text-[10px] text-slate-400"><span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">READ</span><span>→</span><span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">COMPARE</span><span>→</span><span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">FOLLOW</span></div>}
          {page === 3 && <div className="mt-7 p-4 rounded-xl border border-blue-900/60 bg-blue-950/15"><div className="text-[10px] font-bold text-blue-300">FIRST MOVE</div><div className="mt-2 flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white"><Icon name="Search" size={16} /></div><div><div className="text-xs font-semibold text-slate-100">Open PRIS → CASE-1998-027</div><div className="text-[10px] text-slate-500 mt-1">Look for the inconsistency. Do not try to guess the ending.</div></div></div></div>}
          <div className="mt-auto pt-8 flex items-center justify-between gap-4"><div className="flex items-center gap-2">{PAGES.map((_,i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i===page ? 'w-9 bg-blue-500' : 'w-1.5 bg-slate-700'}`} />)}<span className="ml-1 text-[9px] text-slate-600">{page+1}/{PAGES.length}</span></div><div className="flex gap-2"><button onClick={() => page > 0 && setPage(p => p-1)} disabled={page===0} className="px-4 py-2.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-white disabled:opacity-20">Back</button><button onClick={last ? () => finish(true) : () => setPage(p => p+1)} className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider">{last ? 'Open PRIS — Start Case' : 'Continue'}</button></div></div>
        </div>
      </div>
    </div>
  </div>;
};
