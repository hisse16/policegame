import React, { useState } from 'react';
import { Icon } from '../common/Icon';

interface InvestigatorOnboardingProps {
  onComplete: () => void;
  onOpenPRIS?: () => void;
}

const PAGES = [
  { eyebrow: 'NORTHBRIDGE POLICE DEPARTMENT // NEW ASSIGNMENT', title: 'CASE 27 has been reopened.', body: 'A routine archive audit found a change inside an old missing-person case. Your job is simple: find out what the records are hiding.', icon: 'Shield' },
  { eyebrow: 'START HERE // STEP 1 OF 3', title: 'Open PRIS first.', body: 'PRIS is the police records system. You do not need to understand every tool yet. Start with the case file, read what was officially recorded, and look for anything that does not make sense.', icon: 'Search' },
  { eyebrow: 'START HERE // STEP 2 OF 3', title: 'Read. Compare. Follow the clue.', body: 'You will find a small case guide on the desktop. It tells you what to look at next. When you find something important, the guide updates. If two records disagree, that disagreement may be a clue.', icon: 'Compass' },
  { eyebrow: 'START HERE // STEP 3 OF 3', title: 'You are not expected to guess.', body: 'You are expected to investigate. Open the lead, read the evidence, and build your own theory. New tools unlock as the case develops. If you get lost, use the guide or your Notebook.', icon: 'BookOpen' }
];

export const InvestigatorOnboarding: React.FC<InvestigatorOnboardingProps> = ({ onComplete, onOpenPRIS }) => {
  const [page, setPage] = useState(0);
  const current = PAGES[page];
  const last = page === PAGES.length - 1;
  const finish = (openPRIS = false) => { try { sessionStorage.setItem('investigator_onboarding_seen', 'true'); } catch {} onComplete(); if (openPRIS) onOpenPRIS?.(); };

  return (
    <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-slate-950/80 backdrop-blur-[3px] p-4 sm:p-6">
      <div className="w-[min(700px,calc(100vw-2rem))] bg-slate-950 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /><div className="text-[10px] font-mono tracking-[0.18em] text-slate-400">SECURIX // INVESTIGATOR BRIEFING</div></div><button onClick={() => finish()} className="text-[10px] uppercase tracking-wider text-slate-600 hover:text-slate-300">Skip briefing</button></div>
        <div className="p-6 sm:p-9">
          <div className="flex items-start gap-5"><div className="shrink-0 w-14 h-14 rounded-2xl bg-blue-950/70 border border-blue-700/60 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-950/30"><Icon name={current.icon} size={27} /></div><div className="min-w-0"><div className="text-[10px] font-mono font-bold tracking-[0.18em] text-blue-400">{current.eyebrow}</div><h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-100">{current.title}</h1><p className="mt-4 text-sm sm:text-[15px] leading-7 text-slate-300 max-w-xl">{current.body}</p></div></div>
          {page === 1 && <div className="mt-6 p-4 rounded-xl border border-blue-900/70 bg-blue-950/20"><div className="text-[10px] font-mono uppercase tracking-wider text-blue-400">Your first move</div><div className="mt-2 flex items-center gap-3"><span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-blue-400">1</span><span className="text-sm text-slate-200">Open <strong>PRIS</strong> and review <strong>CASE-1998-027</strong>.</span></div><div className="mt-2 ml-10 text-[11px] text-slate-500">You are looking for the first inconsistency — not the solution.</div></div>}
          {page === 2 && <div className="mt-6 grid grid-cols-3 gap-2">{[['01', 'READ', 'the record'], ['02', 'COMPARE', 'the sources'], ['03', 'FOLLOW', 'the lead']].map(([number, title, text]) => <div key={number} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><div className="text-[9px] font-mono text-slate-600">{number}</div><div className="mt-1 text-[10px] font-bold text-slate-200">{title}</div><div className="text-[10px] text-slate-500">{text}</div></div>)}</div>}
          <div className="mt-8 flex items-center justify-between gap-4"><div className="flex items-center gap-2" aria-label={`Briefing page ${page + 1} of ${PAGES.length}`}>{PAGES.map((_, index) => <span key={index} className={`h-1.5 rounded-full transition-all ${index === page ? 'w-8 bg-blue-500' : 'w-1.5 bg-slate-700'}`} />)}<span className="ml-1 text-[9px] font-mono text-slate-600">{page + 1}/{PAGES.length}</span></div><button onClick={last ? () => finish(true) : () => setPage((value) => value + 1)} className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-950/30">{last ? 'Open PRIS — Start Case' : 'Continue'}</button></div>
        </div>
      </div>
    </div>
  );
};
