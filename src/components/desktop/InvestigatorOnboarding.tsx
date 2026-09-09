import React, { useState } from 'react';
import { Icon } from '../common/Icon';

interface InvestigatorOnboardingProps {
  onComplete: () => void;
}

const PAGES = [
  {
    eyebrow: 'NORTHBRIDGE POLICE DEPARTMENT // RECORDS DIVISION',
    title: 'You have been assigned Case 27.',
    body: 'A routine archive audit found a post-closure modification in an old missing-person file. Your job is to review the record and determine why it was changed.',
    icon: 'Shield'
  },
  {
    eyebrow: 'YOUR WORKSTATION',
    title: 'Start with the evidence, not the answer.',
    body: 'PRIS contains police records. Files contains the local archive. Browser contains public records. Notebook keeps your findings together. More tools become useful as the case develops.',
    icon: 'FolderSearch'
  },
  {
    eyebrow: 'INVESTIGATIVE PROTOCOL',
    title: 'Nothing here tells you what to believe.',
    body: 'Compare sources, follow contradictions, and build your own theory. If you lose the thread, the small investigation guide can point you toward the next line of inquiry without revealing the conclusion.',
    icon: 'Compass'
  }
];

export const InvestigatorOnboarding: React.FC<InvestigatorOnboardingProps> = ({ onComplete }) => {
  const [page, setPage] = useState(0);
  const current = PAGES[page];
  const last = page === PAGES.length - 1;

  const finish = () => {
    try { sessionStorage.setItem('investigator_onboarding_seen', 'true'); } catch {}
    onComplete();
  };

  return (
    <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-slate-950/72 backdrop-blur-[2px] p-6">
      <div className="w-[min(620px,calc(100vw-2rem))] bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between">
          <div className="text-[10px] font-mono tracking-[0.18em] text-slate-500">SECURIX // INVESTIGATOR WORKSTATION</div>
          <button onClick={finish} className="text-[10px] uppercase tracking-wider text-slate-500 hover:text-slate-200">Skip briefing</button>
        </div>
        <div className="p-7 sm:p-9">
          <div className="flex items-start gap-5">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-950/70 border border-blue-800/70 flex items-center justify-center text-blue-400">
              <Icon name={current.icon} size={24} />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold tracking-[0.18em] text-blue-400">{current.eyebrow}</div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">{current.title}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-400 max-w-xl">{current.body}</p>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex gap-1.5">
              {PAGES.map((_, index) => <span key={index} className={`h-1.5 rounded-full transition-all ${index === page ? 'w-7 bg-blue-500' : 'w-1.5 bg-slate-700'}`} />)}
            </div>
            <button onClick={last ? finish : () => setPage((value) => value + 1)} className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider">
              {last ? 'Begin investigation' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
