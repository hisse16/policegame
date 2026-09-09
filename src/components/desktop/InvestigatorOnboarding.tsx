import React, { useState } from 'react';
import { Icon } from '../common/Icon';

interface InvestigatorOnboardingProps {
  onComplete: () => void;
  onOpenPRIS?: () => void;
}

const PAGES = [
  {
    eyebrow: 'NORTHBRIDGE POLICE DEPARTMENT // RECORDS DIVISION',
    title: 'CASE 27 has been reopened.',
    body: 'A routine archive audit found a post-closure modification in an old missing-person file. You have been assigned to review the original record and determine what happened.',
    icon: 'Shield'
  },
  {
    eyebrow: 'YOUR WORKSTATION',
    title: 'Four places matter at the start.',
    body: 'PRIS is the department record system. Files holds the local archive. Browser covers public records. Your Case Notebook is where you can keep your own findings. Other tools will become relevant when the evidence points there.',
    icon: 'FolderSearch'
  },
  {
    eyebrow: 'INVESTIGATIVE PROTOCOL',
    title: 'Follow the record. Form your own theory.',
    body: 'Compare sources rather than trusting a single entry. When two records disagree, treat the disagreement as evidence. The case guide can point you toward an open line of inquiry, but it will never tell you the answer.',
    icon: 'Compass'
  }
];

export const InvestigatorOnboarding: React.FC<InvestigatorOnboardingProps> = ({ onComplete, onOpenPRIS }) => {
  const [page, setPage] = useState(0);
  const current = PAGES[page];
  const last = page === PAGES.length - 1;

  const finish = (openPRIS = false) => {
    try { sessionStorage.setItem('investigator_onboarding_seen', 'true'); } catch {}
    onComplete();
    if (openPRIS) onOpenPRIS?.();
  };

  return (
    <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-slate-950/72 backdrop-blur-[2px] p-6">
      <div className="w-[min(640px,calc(100vw-2rem))] bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between">
          <div className="text-[10px] font-mono tracking-[0.18em] text-slate-500">SECURIX // CASE ASSIGNMENT</div>
          <button onClick={() => finish()} className="text-[10px] uppercase tracking-wider text-slate-500 hover:text-slate-200">Skip briefing</button>
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
            <div className="flex gap-1.5" aria-label={`Briefing page ${page + 1} of ${PAGES.length}`}>
              {PAGES.map((_, index) => <span key={index} className={`h-1.5 rounded-full transition-all ${index === page ? 'w-7 bg-blue-500' : 'w-1.5 bg-slate-700'}`} />)}
            </div>
            <button onClick={last ? () => finish(true) : () => setPage((value) => value + 1)} className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider">
              {last ? 'Open PRIS' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
