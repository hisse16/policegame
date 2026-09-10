import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../common/Icon';
import { useOS } from '../../context/OSContext';

interface WorkstationTutorialProps { onFinish: () => void; }

type Step = {
  title: string;
  text: string;
  app?: string;
  target: () => HTMLElement | null;
  prepare?: () => void;
};

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim().toLowerCase();
const buttons = () => Array.from(document.querySelectorAll('button')) as HTMLElement[];
const byText = (text: string) => {
  const wanted = normalize(text);
  return buttons().find((button) => normalize(button.textContent || '') === wanted) || null;
};
const byTextContains = (text: string) => {
  const wanted = normalize(text);
  return buttons().find((button) => normalize(button.textContent || '').includes(wanted)) || null;
};
const byTitle = (title: string) => document.querySelector(`button[title="${title}"]`) as HTMLElement | null;
const appLauncherButton = () => byText('Applications');
const windowByApp = (app: string) => {
  const names: Record<string, string> = {
    'police-records': 'PRIS Database',
    'investigation-notebook': 'Case Notebook',
    'investigation-board': 'Investigation Board',
    'evidence-lab': 'Evidence & Forensics'
  };
  const name = names[app];
  if (!name) return null;
  return Array.from(document.querySelectorAll('[id^="window-win_"]')).find((element) =>
    normalize(element.textContent || '').includes(normalize(name))
  ) as HTMLElement | null;
};
const click = (element: HTMLElement | null) => {
  if (element && !element.hasAttribute('disabled')) element.click();
};

export const WorkstationTutorial: React.FC<WorkstationTutorialProps> = ({ onFinish }) => {
  const {
    openApp,
    closeWindow,
    windows,
    setLauncherOpen,
    setNetworkMenuOpen,
    setVolumeMenuOpen,
    setPowerMenuOpen,
    setNotificationCenterOpen
  } = useOS();
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const createdWindows = useRef<string[]>([]);
  const baselineWindowIds = useRef<string[]>(windows.map((window) => window.id));

  const closeTransientMenus = () => {
    setLauncherOpen(false);
    setNetworkMenuOpen(false);
    setVolumeMenuOpen(false);
    setPowerMenuOpen(false);
    setNotificationCenterOpen(false);
  };

  const steps = useMemo<Step[]>(() => {
    const openPRIS = () => openApp('police-records');
    const openNotebook = () => openApp('investigation-notebook');
    const openBoard = () => openApp('investigation-board');

    return [
      {
        title: 'Start with the case',
        text: 'Your investigation begins with evidence, not a checklist. Open CASE-1998-027 and read what the record actually says before deciding where to go next.',
        app: 'police-records',
        target: () => byTextContains('CASE-1998-027'),
        prepare: openPRIS
      },
      {
        title: 'Read before you assume',
        text: 'Important clues are embedded in reports, names, dates and record history. A record can be incomplete or contradicted later. Do not treat the summary as the whole truth.',
        app: 'police-records',
        target: () => byTextContains('OVERVIEW & SUMMARY'),
        prepare: openPRIS
      },
      {
        title: 'Follow connections',
        text: 'When a record gives you a person, report, vehicle or location, you can open that connected record. This is how the investigation branches naturally.',
        app: 'police-records',
        target: () => windowByApp('police-records')?.querySelector('button.text-blue-400') as HTMLElement | null,
        prepare: openPRIS
      },
      {
        title: 'Compare, don’t just collect',
        text: 'Contradictions are one of the main ways you uncover what happened. Compare dates, statements, versions and timelines. When two records disagree, investigate why.',
        app: 'police-records',
        target: () => byTextContains('TIMELINE'),
        prepare: openPRIS
      },
      {
        title: 'Search when you have a clue',
        text: 'You do not need to browse every register. If a name, case number, plate, evidence ID or address appears in a clue, use Universal Search to find the records connected to it.',
        app: 'police-records',
        target: () => document.querySelector('input[placeholder^="Universal Search"]') as HTMLElement | null,
        prepare: openPRIS
      },
      {
        title: 'Keep what matters',
        text: 'Bookmark records you think you will need again. A bookmark is your choice, not a mission marker. Use it to build your own evidence trail.',
        app: 'police-records',
        target: () => byText('BOOKMARK') || byText('BOOKMARKED'),
        prepare: openPRIS
      },
      {
        title: 'Write down your theory',
        text: 'Use the Investigation Notebook for names, times, questions and theories. The Notebook remembers your reasoning; it does not tell you what to investigate.',
        app: 'investigation-notebook',
        target: () => document.querySelector('textarea[placeholder="Start writing..."]') as HTMLElement | null,
        prepare: openNotebook
      },
      {
        title: 'Build connections yourself',
        text: 'The Investigation Board is where you can turn separate discoveries into a relationship you believe is meaningful. The game will not draw the conclusion for you.',
        app: 'investigation-board',
        target: () => document.querySelector('svg')?.parentElement as HTMLElement | null,
        prepare: openBoard
      },
      {
        title: 'Investigate the evidence',
        text: 'When a case contains physical or forensic material, use the Evidence Lab to inspect it. Treat forensic findings as evidence to interpret alongside the records, not as an automatic answer.',
        app: 'police-records',
        target: () => byText('LAB'),
        prepare: openPRIS
      },
      {
        title: 'You are in control',
        text: 'There is no prescribed route. Read, compare, follow connections, search when you have a reason, and form your own explanation. Case 27 is now yours to solve.',
        app: 'police-records',
        target: () => byTextContains('CASE-1998-027'),
        prepare: openPRIS
      }
    ];
  }, [openApp]);

  const step = steps[index];

  useEffect(() => {
    let stopped = false;
    let pollTimer: number | undefined;
    closeTransientMenus();

    if (step.app) {
      const existing = windows.find((window) => window.appId === step.app);
      const id = openApp(step.app);
      if (!existing && id && !baselineWindowIds.current.includes(id) && !createdWindows.current.includes(id)) {
        createdWindows.current.push(id);
      }
    }

    step.prepare?.();
    setRect(null);

    const started = Date.now();
    const poll = () => {
      if (stopped) return;
      const element = step.target();
      if (element?.isConnected) {
        const nextRect = element.getBoundingClientRect();
        setRect(nextRect.width > 0 || nextRect.height > 0 ? nextRect : null);
      } else {
        setRect(null);
      }
      if (Date.now() - started < 5000) pollTimer = window.setTimeout(poll, 80);
    };
    poll();

    return () => {
      stopped = true;
      if (pollTimer) window.clearTimeout(pollTimer);
    };
    // The tutorial samples the OS when each step begins instead of restarting
    // the step whenever unrelated desktop state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, step.app]);

  const cleanup = () => {
    closeTransientMenus();
    createdWindows.current.forEach((id) => closeWindow(id));
    createdWindows.current = [];
  };

  const finish = () => {
    cleanup();
    onFinish();
  };

  const next = () => {
    if (index === steps.length - 1) finish();
    else setIndex((current) => current + 1);
  };

  const spotlight = rect
    ? {
        left: Math.max(3, rect.left - 7),
        top: Math.max(30, rect.top - 7),
        width: Math.min(rect.width + 14, window.innerWidth),
        height: Math.min(rect.height + 14, window.innerHeight - 30)
      }
    : null;
  const above = rect ? rect.top > window.innerHeight * 0.55 : true;
  const card = above ? { top: 18 } : { bottom: 18 };
  const arrow = spotlight
    ? {
        left: Math.max(15, Math.min(window.innerWidth - 15, spotlight.left + spotlight.width / 2)),
        top: above ? Math.max(5, spotlight.top - 24) : Math.min(window.innerHeight - 20, spotlight.top + spotlight.height + 4)
      }
    : null;

  return (
    <div className="fixed inset-0 z-[11000] pointer-events-none font-sans">
      {spotlight && (
        <div
          className="absolute rounded-xl ring-2 ring-blue-400 shadow-[0_0_0_9999px_rgba(0,0,0,.62),0_0_35px_rgba(59,130,246,.55)] pointer-events-none"
          style={spotlight}
        />
      )}
      {arrow && (
        <div className="absolute -translate-x-1/2 text-blue-300 text-xl font-bold" style={arrow}>
          {above ? '↓' : '↑'}
        </div>
      )}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[min(720px,calc(100vw-2rem))] pointer-events-auto"
        style={card}
      >
        <div className="rounded-2xl bg-slate-950/98 border border-blue-500/50 shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-700 via-cyan-300 to-blue-700" />
          <div className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-300">
                <Icon name="Search" size={18} />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[.18em] text-blue-400">
                  INVESTIGATION TUTORIAL · {index + 1}/{steps.length}
                </div>
                <h2 className="mt-1 text-base font-semibold text-white">{step.title}</h2>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-slate-300">{step.text}</p>
            {!rect && <div className="mt-2 text-[9px] text-amber-400">Waiting for the investigation element to appear…</div>}
            <div className="mt-4 flex items-center justify-between">
              <button onClick={finish} className="text-[10px] text-slate-500 hover:text-slate-200">
                Skip tutorial
              </button>
              <button
                onClick={next}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider"
              >
                {index === steps.length - 1 ? 'Start Investigating' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
