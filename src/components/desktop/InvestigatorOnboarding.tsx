import React, { useState } from 'react';
import { Icon } from '../common/Icon';

interface InvestigatorOnboardingProps { onComplete: () => void; onOpenPRIS?: () => void; }

const PAGES = [
  { eyebrow: 'NORTHBRIDGE POLICE DEPARTMENT // CASE 27', title: 'The archive was not supposed to change.', body: 'September 14, 1998. Anna Claire Bell disappeared. A routine 2026 audit found a post-closure modification inside her old case file. You are reopening the investigation.', icon: 'Shield' },
  { eyebrow: 'HOW THE GAME WORKS // 01', title: 'You are investigating a trail, not completing a checklist.', body: 'Read records, notice contradictions, follow names and dates, then decide what they mean. The case should make you curious. The workstation should never make you guess what button to press.', icon: 'Search' },
  { eyebrow: 'YOUR WORKSTATION // 02', title: 'PRIS is your evidence index.', body: 'Police Records (PRIS) is where the investigation begins. Cases, reports, people, officers, vehicles, locations and evidence are linked. Open a record, read it, then follow the links that matter.', icon: 'Database' },
  { eyebrow: 'YOUR WORKSTATION // 03', title: 'Every other tool has a job.', body: 'Evidence Lab = physical evidence. Terminal = digital traces and logs. Investigation Board = connections. Browser = public archives. Police Mail = internal correspondence. Map = locations. Notebook = your reasoning. Final Deduction = your conclusion.', icon: 'Monitor' },
  { eyebrow: 'YOUR WORKSTATION // 04', title: 'Tools unlock when the story needs them.', body: 'You do not need to search the whole workstation. Early on, only PRIS matters. Later, new evidence opens new tools. If a tool is not unlocked yet, ignore it — the case is not asking for it.', icon: 'LockOpen' },
  { eyebrow: 'CASE 27 // FIRST INVESTIGATION', title: 'Here is exactly where to begin.', body: 'Open PRIS and read CASE-1998-027. From there, follow the case’s attached records. Do not rush to the answer. The first important discovery is hidden in what the old file says — and what it should not say.', icon: 'FileSearch' },
  { eyebrow: 'FIELD RULES // 05', title: 'When you feel lost, stop and read.', body: 'Use the Case Desk only as a gentle reminder of the current lead. Use the Notebook to keep your own theory. There are no secret commands, no speedrun route and no need to memorize the 60 discoveries. The evidence itself moves the case forward.', icon: 'Compass' }
];

const TOOL_CARDS = [
  ['PRIS', 'Official police records', 'Database'],
  ['EVIDENCE LAB', 'Inspect physical evidence', 'Microscope'],
  ['TERMINAL', 'Read system traces & logs', 'Terminal'],
  ['BOARD', 'Connect people, places & evidence', 'Network'],
  ['BROWSER', 'Research public archives', 'Globe'],
  ['POLICE MAIL', 'Read internal correspondence', 'Mail'],
  ['MAP', 'Locate case sites', 'MapPin'],
  ['NOTEBOOK', 'Keep your theory', 'BookOpen'],
  ['FINAL DEDUCTION', 'Make the official determination', 'Gavel']
];

export const InvestigatorOnboarding: React.FC<InvestigatorOnboardingProps> = ({ onComplete, onOpenPRIS }) => {
  const [page, setPage] = useState(0);
  const current = PAGES[page];
  const last = page === PAGES.length - 1;
  const finish = (open = false) => { try { sessionStorage.setItem('investigator_onboarding_seen', 'true'); } catch {} onComplete(); if (open) onOpenPRIS?.(); };

  return <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 font-mono">
    <div className="w-[min(980px,calc(100vw-2rem))] max-h-[92vh] bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      <div className="h-1 bg-gradient-to-r from-blue-700 via-cyan-400 to-blue-700 shrink-0" />
      <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0"><div className="flex items-center gap-2 text-[10px] tracking-[.18em] text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-400" /> SECURIX // NEW INVESTIGATOR BRIEFING</div><button onClick={() => finish()} className="text-[10px] text-slate-600 hover:text-slate-300 uppercase">Skip briefing</button></div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid lg:grid-cols-[230px_1fr] min-h-[560px]">
          <aside className="bg-slate-900 border-r border-slate-800 p-5 flex flex-col">
            <div><div className="text-[9px] tracking-[.2em] text-slate-500">ACTIVE FILE</div><div className="mt-2 text-3xl font-bold text-white">CASE 27</div><div className="mt-1 text-[11px] text-blue-300">ANNA CLAIRE BELL</div><div className="mt-7 space-y-2.5"><div className="flex items-center gap-2 text-[10px] text-slate-400"><span className="w-2 h-2 rounded-full bg-amber-400" /> REOPENED</div><div className="flex items-center gap-2 text-[10px] text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-600" /> 14 SEP 1998</div><div className="flex items-center gap-2 text-[10px] text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-600" /> MISSING PERSON</div></div></div>
            <div className="mt-8 border-t border-slate-800 pt-4"><div className="text-[9px] text-slate-600">BRIEFING</div><div className="mt-2 space-y-1.5">{PAGES.map((p, i) => <button key={p.eyebrow} onClick={() => setPage(i)} className={`w-full text-left px-2.5 py-2 rounded-lg text-[9px] transition-colors ${i === page ? 'bg-blue-950/60 text-blue-300 border border-blue-900/60' : 'text-slate-500 hover:text-slate-300'}`}><span className="mr-2 tabular-nums">0{i + 1}</span>{p.title}</button>)}</div></div>
            <div className="mt-auto pt-5 border-t border-slate-800"><div className="text-[9px] text-slate-600">FILE STATUS</div><div className="mt-1 text-[10px] text-emerald-400">OPEN FOR REVIEW</div></div>
          </aside>
          <main className="p-6 sm:p-9 flex flex-col">
            <div className="flex items-start gap-5"><div className="shrink-0 w-14 h-14 rounded-2xl bg-blue-950/70 border border-blue-700/60 flex items-center justify-center text-blue-400"><Icon name={current.icon} size={27} /></div><div><div className="text-[10px] font-bold tracking-[.18em] text-blue-400">{current.eyebrow}</div><h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-100">{current.title}</h1><p className="mt-4 text-sm leading-7 text-slate-300 max-w-2xl">{current.body}</p></div></div>
            {page === 0 && <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5"><div className="text-[9px] text-slate-500 tracking-wider">CASE OPENING</div><div className="mt-3 grid sm:grid-cols-3 gap-3">{[['1998','DISAPPEARANCE','Anna Bell'],['2026','AUDIT ALERT','Case file altered'],['NOW','YOUR ASSIGNMENT','Reconstruct the truth']].map(([n,t,d]) => <div key={n} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-lg font-bold text-slate-100">{n}</div><div className="mt-1 text-[9px] tracking-wider text-blue-400">{t}</div><div className="mt-2 text-[10px] text-slate-500">{d}</div></div>)}</div></div>}
            {page === 1 && <div className="mt-8 grid sm:grid-cols-3 gap-3">{[['READ','Read what the record actually says.'],['COMPARE','Look for conflicting dates, names and versions.'],['FOLLOW','Open the linked record that explains the conflict.']].map(([t,d]) => <div key={t} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"><div className="text-[10px] font-bold text-blue-300">{t}</div><div className="mt-2 text-[10px] leading-5 text-slate-500">{d}</div></div>)}</div>}
            {page === 2 && <div className="mt-8 rounded-xl border border-slate-800 overflow-hidden"><div className="px-4 py-3 bg-slate-900 text-[10px] font-bold text-slate-300">PRIS // WHAT YOU WILL SEE</div><div className="p-4 grid sm:grid-cols-2 gap-2">{[['CASE','Case dockets and history'],['REPORTS','Original and supplemental reports'],['PEOPLE','Witnesses, family and associates'],['OFFICERS','Investigators and service history'],['VEHICLES','Plates, ownership and sightings'],['LOCATIONS','Addresses and prior incidents']].map(([t,d]) => <div key={t} className="flex gap-3 rounded-lg bg-slate-900/50 p-3"><div className="text-[9px] font-bold text-blue-400 w-20">{t}</div><div className="text-[10px] text-slate-500">{d}</div></div>)}</div></div>}
            {page === 3 && <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">{TOOL_CARDS.map(([t,d,icon]) => <div key={t} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3"><div className="flex items-center gap-2 text-[10px] font-bold text-slate-200"><Icon name={icon} size={14} className="text-blue-400" />{t}</div><div className="mt-1.5 text-[9px] leading-4 text-slate-500">{d}</div></div>)}</div>}
            {page === 4 && <div className="mt-8 rounded-xl border border-amber-900/50 bg-amber-950/10 p-5"><div className="text-[10px] font-bold text-amber-300">DO NOT SEARCH EVERYTHING</div><div className="mt-2 text-[11px] leading-6 text-slate-400">The game reveals tools in story order. If the Browser or Map is not available, you are not missing anything. Follow the evidence in the current act.</div></div>}
            {page === 5 && <div className="mt-8 rounded-xl border border-blue-900/60 bg-blue-950/15 p-5"><div className="text-[10px] font-bold text-blue-300">FIRST MOVE</div><div className="mt-2 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white"><Icon name="Search" size={18} /></div><div><div className="text-sm font-semibold text-slate-100">Open PRIS → CASE-1998-027</div><div className="text-[10px] text-slate-500 mt-1">Read first. Click linked records. Let the evidence create the next question.</div></div></div></div>}
            {page === 6 && <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5"><div className="text-[10px] font-bold text-slate-300">FIELD RULE</div><div className="mt-2 text-[11px] leading-6 text-slate-400">You are never expected to know the next answer in advance. If a lead looks unclear, open the relevant record and read it again before searching for something else.</div></div>}
            <div className="mt-auto pt-8 flex items-center justify-between gap-4"><div className="flex items-center gap-2">{PAGES.map((_, i) => <button aria-label={`Briefing page ${i + 1}`} key={i} onClick={() => setPage(i)} className={`h-1.5 rounded-full transition-all ${i === page ? 'w-9 bg-blue-500' : 'w-1.5 bg-slate-700 hover:bg-slate-500'}`} />)}<span className="ml-1 text-[9px] text-slate-600">{page + 1}/{PAGES.length}</span></div><div className="flex gap-2"><button onClick={() => page > 0 && setPage(p => p - 1)} disabled={page === 0} className="px-4 py-2.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-white disabled:opacity-20">Back</button><button onClick={last ? () => finish(true) : () => setPage(p => p + 1)} className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider">{last ? 'Open PRIS — Start Case' : 'Continue'}</button></div></div>
          </main>
        </div>
      </div>
    </div>
  </div>;
};
