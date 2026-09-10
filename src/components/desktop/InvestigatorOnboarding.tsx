import React, { useState } from 'react';
import { Icon } from '../common/Icon';

interface InvestigatorOnboardingProps {
  onComplete: () => void;
  onOpenPRIS?: () => void;
}

/**
 * Player-facing introduction.
 *
 * This is an orientation, not a mission briefing. It intentionally avoids
 * task lists, prescribed routes and explanations that reveal how the case is
 * supposed to be solved.
 */
const PAGES = [
  {
    eyebrow: 'NORTHBRIDGE POLICE DEPARTMENT // CASE 27',
    title: 'The archive was not supposed to change.',
    body: 'September 14, 1998. Anna Claire Bell disappeared. During a 2026 archive audit, someone found a modification inside the closed case file. You have been asked to review the record and determine what the existing evidence can actually establish.',
    icon: 'Shield'
  },
  {
    eyebrow: 'HOW TO INVESTIGATE // 01',
    title: 'You are not following a checklist.',
    body: 'Read the records. Compare what different sources claim. Pay attention to names, dates, locations and versions of the same event. When something does not fit, follow that inconsistency. The game will record important discoveries, but it will not tell you which lead to pursue.',
    icon: 'Search'
  },
  {
    eyebrow: 'YOUR WORKSTATION // 02',
    title: 'Use the tools when the evidence gives you a reason.',
    body: 'PRIS contains official records and their links. The Board is for relationships you choose to establish. The Notebook is for your own reasoning. Other workstation tools can contain useful information too; you are not expected to inspect everything just because it exists.',
    icon: 'Database'
  },
  {
    eyebrow: 'CASE 27 // BEGIN',
    title: 'Start with the case file. Then follow what interests you.',
    body: 'Open CASE-1998-027 in PRIS and read it carefully. You do not need to find a specific record after that. If a name, date, statement or piece of evidence raises a question, investigate it. Your discoveries will build the picture of what happened.',
    icon: 'FileSearch'
  }
];

export const InvestigatorOnboarding: React.FC<InvestigatorOnboardingProps> = ({ onComplete, onOpenPRIS }) => {
  const [page, setPage] = useState(0);
  const current = PAGES[page];
  const last = page === PAGES.length - 1;

  const finish = (open = false) => {
    try {
      sessionStorage.setItem('investigator_onboarding_seen_v2', 'true');
    } catch {
      // Storage can be unavailable in private/restricted browser contexts.
    }
    onComplete();
    if (open) onOpenPRIS?.();
  };

  return (
    <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 font-mono">
      <div className="w-[min(900px,calc(100vw-2rem))] max-h-[92vh] bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="h-1 bg-gradient-to-r from-blue-700 via-cyan-400 to-blue-700 shrink-0" />

        <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[10px] tracking-[.18em] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            SECURIX // INVESTIGATOR BRIEFING
          </div>
          <button
            onClick={() => finish()}
            className="text-[10px] text-slate-600 hover:text-slate-300 uppercase"
          >
            Skip briefing
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="grid lg:grid-cols-[210px_1fr] min-h-[500px]">
            <aside className="bg-slate-900 border-r border-slate-800 p-5 flex flex-col">
              <div>
                <div className="text-[9px] tracking-[.2em] text-slate-500">ACTIVE FILE</div>
                <div className="mt-2 text-3xl font-bold text-white">CASE 27</div>
                <div className="mt-1 text-[11px] text-blue-300">ANNA CLAIRE BELL</div>
                <div className="mt-7 space-y-2.5">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> REOPENED
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-slate-600" /> 14 SEP 1998
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-slate-600" /> MISSING PERSON
                  </div>
                </div>
              </div>

              <div className="mt-auto border-t border-slate-800 pt-4">
                <div className="text-[9px] text-slate-600">BRIEFING</div>
                <div className="mt-2 space-y-1.5">
                  {PAGES.map((p, i) => (
                    <button
                      key={p.eyebrow}
                      onClick={() => setPage(i)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-[9px] transition-colors ${
                        i === page
                          ? 'bg-blue-950/60 text-blue-300 border border-blue-900/60'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <span className="mr-2 tabular-nums">0{i + 1}</span>
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <main className="p-6 sm:p-9 flex flex-col">
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-blue-950/70 border border-blue-700/60 flex items-center justify-center text-blue-400">
                  <Icon name={current.icon} size={27} />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-[.18em] text-blue-400">{current.eyebrow}</div>
                  <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-100">{current.title}</h1>
                  <p className="mt-4 text-sm leading-7 text-slate-300 max-w-2xl">{current.body}</p>
                </div>
              </div>

              {page === 0 && (
                <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="text-[9px] text-slate-500 tracking-wider">WHAT YOU HAVE</div>
                  <div className="mt-3 grid sm:grid-cols-3 gap-3">
                    {[
                      ['1998', 'ORIGINAL CASE', 'A closed missing-person investigation'],
                      ['2026', 'AUDIT ALERT', 'A post-closure change was detected'],
                      ['NOW', 'YOUR REVIEW', 'Determine what the record can establish']
                    ].map(([n, t, d]) => (
                      <div key={n} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                        <div className="text-lg font-bold text-slate-100">{n}</div>
                        <div className="mt-1 text-[9px] tracking-wider text-blue-400">{t}</div>
                        <div className="mt-2 text-[10px] text-slate-500">{d}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {page === 1 && (
                <div className="mt-8 grid sm:grid-cols-3 gap-3">
                  {[
                    ['READ', 'Read the source itself before deciding what it means.'],
                    ['COMPARE', 'Check other records when names, dates or accounts do not agree.'],
                    ['FOLLOW', 'Follow a connection because you found a reason, not because the game assigned it.']
                  ].map(([t, d]) => (
                    <div key={t} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                      <div className="text-[10px] font-bold text-blue-300">{t}</div>
                      <div className="mt-2 text-[10px] leading-5 text-slate-500">{d}</div>
                    </div>
                  ))}
                </div>
              )}

              {page === 2 && (
                <div className="mt-8 rounded-xl border border-slate-800 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-900 text-[10px] font-bold text-slate-300">WORKSTATION // CORE TOOLS</div>
                  <div className="p-4 space-y-2">
                    {[
                      ['PRIS', 'Official records. Cases, reports, people, officers, vehicles, locations and evidence.'],
                      ['BOARD', 'Your own reasoning space. Add relationships when you believe two things are connected.'],
                      ['NOTEBOOK', 'Your own notes and theory. Nothing here is an instruction from the game.']
                    ].map(([t, d]) => (
                      <div key={t} className="flex gap-3 rounded-lg bg-slate-900/50 p-3">
                        <div className="text-[9px] font-bold text-blue-400 w-20 shrink-0">{t}</div>
                        <div className="text-[10px] leading-5 text-slate-500">{d}</div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pb-4 text-[9px] text-slate-600 leading-5">
                    Other tools may contain useful evidence. You do not need to learn every tool before you start investigating.
                  </div>
                </div>
              )}

              {page === 3 && (
                <div className="mt-8 rounded-xl border border-blue-900/60 bg-blue-950/15 p-5">
                  <div className="text-[10px] font-bold text-blue-300">BEGIN THE INVESTIGATION</div>
                  <div className="mt-3 flex items-start gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                      <Icon name="Search" size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-100">Open PRIS and read CASE-1998-027.</div>
                      <div className="text-[10px] text-slate-500 mt-1 leading-5">
                        That is the starting point, not a route. Once you are in the records, follow the detail that gives you a reason to keep looking.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {PAGES.map((_, i) => (
                    <button
                      aria-label={`Briefing page ${i + 1}`}
                      key={i}
                      onClick={() => setPage(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === page ? 'w-9 bg-blue-500' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-[9px] text-slate-600">{page + 1}/{PAGES.length}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => page > 0 && setPage(p => p - 1)}
                    disabled={page === 0}
                    className="px-4 py-2.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-white disabled:opacity-20"
                  >
                    Back
                  </button>
                  <button
                    onClick={last ? () => finish(true) : () => setPage(p => p + 1)}
                    className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    {last ? 'Open PRIS — Start Case' : 'Continue'}
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
