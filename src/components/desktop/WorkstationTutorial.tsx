import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../common/Icon';
import { useOS } from '../../context/OSContext';

interface WorkstationTutorialProps { onFinish: () => void; }
type TutorialStep = {
  title: string;
  text: string;
  target?: () => HTMLElement | null;
  app?: string;
};

const buttons = () => Array.from(document.querySelectorAll('button')) as HTMLElement[];
const byText = (...texts: string[]) => buttons().find((el) => texts.includes((el.textContent || '').trim())) || null;
const byTitle = (...titles: string[]) => buttons().find((el) => {
  const title = el.getAttribute('title') || '';
  return titles.some((wanted) => title === wanted || title.startsWith(wanted));
}) || null;
const byLabel = (...labels: string[]) => buttons().find((el) => {
  const label = el.getAttribute('aria-label') || '';
  return labels.some((wanted) => label === wanted || label.startsWith(wanted));
}) || null;
const byRoleText = (...texts: string[]) => {
  const wanted = texts.map((t) => t.toLowerCase());
  return Array.from(document.querySelectorAll('button, a, [role="button"]')).find((el) => {
    const value = (el.textContent || '').trim().toLowerCase();
    return wanted.includes(value);
  }) as HTMLElement | undefined || null;
};

export const WorkstationTutorial: React.FC<WorkstationTutorialProps> = ({ onFinish }) => {
  const { openApp, closeWindow, windows } = useOS();
  const tutorialWindowRef = useRef<string | null>(null);

  const steps: TutorialStep[] = useMemo(() => [
    { title: 'Welcome', text: 'This is a guided tour of the workstation controls. Follow the highlighted element and press Next. The tour never requires you to solve the case.', target: () => byText('Applications') },
    { title: 'Applications launcher', text: 'This opens the full application launcher. It is the main way to find tools that are not currently pinned.', target: () => byText('Applications') },
    { title: 'Launcher search', text: 'Use this field to quickly filter applications by name.', target: () => document.querySelector('#os-app-launcher input') as HTMLElement | null },
    { title: 'Launcher categories', text: 'Categories keep the workstation tools organized. They are only a navigation aid.', target: () => document.querySelector('#os-app-launcher .w-28 button') as HTMLElement | null },
    { title: 'Application entry', text: 'An application entry opens the selected tool in a normal workstation window.', target: () => document.querySelector('#os-app-launcher .flex-1 button') as HTMLElement | null },
    { title: 'Date and time', text: 'The top bar shows the workstation date and time. Record timestamps inside PRIS are the evidence you should trust for the case.', target: () => byLabel('Date', 'Calendar') || document.querySelector('header button') as HTMLElement | null },
    { title: 'Network status', text: 'This shows the simulated police network connection. Browser and internal services can depend on the network state.', target: () => byTitle('Network:') },
    { title: 'Sound control', text: 'Adjust or mute workstation sounds. Sound settings never change case progress.', target: () => byTitle('Volume:') },
    { title: 'Battery status', text: 'This is workstation status information only. It has no gameplay effect.', target: () => byTitle('Battery:') },
    { title: 'Notifications', text: 'System and investigation notifications appear here. Check this area when the indicator changes.', target: () => byTitle('Notifications') || byLabel('Notifications') },
    { title: 'Account menu', text: 'The account menu contains workstation account and power controls. Power controls are not part of normal investigation.', target: () => byText('investigator') },
    { title: 'Calendar', text: 'The date control opens a small calendar for orientation. It is not case evidence.', target: () => byLabel('Date', 'Calendar') || document.querySelector('header button') as HTMLElement | null },
    { title: 'Dock', text: 'The dock is the quick launcher at the bottom. Its icons appear as investigation tools become available.', target: () => document.querySelector('[class*="fixed bottom-2"]') as HTMLElement | null },
    { title: 'PRIS Database', text: 'PRIS is the core police records application. We will now walk through its actual navigation buttons.', app: 'police-records' },
    { title: 'Case Overview', text: 'Case Overview gives the current case context. It deliberately does not prescribe your next move.', target: () => byRoleText('Case Overview') },
    { title: 'Cases', text: 'Cases opens case dockets and case histories.', target: () => byRoleText('Cases') },
    { title: 'Persons', text: 'Persons contains victims, witnesses, suspects, family members and other people in PRIS.', target: () => byRoleText('Persons') },
    { title: 'Evidence', text: 'Evidence contains evidence records and chain-of-custody information.', target: () => byRoleText('Evidence') },
    { title: 'Reports', text: 'Reports contains original and supplemental police documentation. Different versions can contradict each other.', target: () => byRoleText('Reports') },
    { title: 'Locations', text: 'Locations are text-based records. Addresses, districts, directions and distances are written in the records. There is no GIS map.', target: () => byRoleText('Locations') },
    { title: 'Vehicles', text: 'Vehicles contains plates, ownership information and recorded sightings.', target: () => byRoleText('Vehicles') },
    { title: 'Officers', text: 'Officers contains service history, assignments and related records.', target: () => byRoleText('Officers') },
    { title: 'Organizations', text: 'Organizations connects companies and institutions to related records.', target: () => byRoleText('Organizations') },
    { title: 'PRIS Search', text: 'Search finds records by names, case numbers, addresses, IDs and other clues. It is one of the most important investigation controls.', target: () => byRoleText('Search') },
    { title: 'Record navigation', text: 'Inside records, use related-record links to follow connections you discover. The evidence itself is the navigation system.', target: () => document.querySelector('main button') as HTMLElement | null },
    { title: 'Bookmarks', text: 'Bookmark important records so you can return to them later. A bookmark is your memory aid, not a task.', target: () => byRoleText('Bookmarks') },
    { title: 'Case Notebook', text: 'The Notebook is your private working memory. Write observations, theories and details you do not want to lose.', app: 'investigation-notebook' },
    { title: 'Notebook tabs', text: 'The notebook separates your notes, bookmarks, timeline and contradictions. These are records of what you found, not instructions.', target: () => document.querySelector('main button') as HTMLElement | null },
    { title: 'Investigation Board', text: 'The Board is your mental model. Pin records and draw relationships yourself. It starts empty on purpose.', app: 'investigation-board' },
    { title: 'Evidence Lab', text: 'Evidence Lab is used when physical or forensic evidence becomes relevant.', app: 'evidence-lab' },
    { title: 'Terminal', text: 'Terminal is used for digital traces, logs and system-level evidence when the case gives you a reason to use it.', app: 'terminal' },
    { title: 'Browser', text: 'Browser is for public research and the fictional web sources used by the case. It is not a map viewer.', app: 'browser' },
    { title: 'Police Mail', text: 'Police Mail contains internal correspondence, memoranda and departmental communication.', app: 'police-mail' },
    { title: 'Files', text: 'Files is the workstation filesystem. Recovered documents and supporting material can appear here.', app: 'file-manager' },
    { title: 'Settings', text: 'Settings controls appearance, sound and accessibility. It does not alter case progress.', app: 'settings' },
    { title: 'Final Deduction', text: 'Final Deduction is where you submit your conclusion after you believe you understand what happened.', app: 'final-deduction' },
    { title: 'Your judgment', text: 'There is no GIS map, no mandatory checklist and no button that tells you what to think. Read, compare, connect and build your own explanation.', target: () => document.querySelector('[class*="fixed bottom-2"]') as HTMLElement | null },
    { title: 'Start Case 27', text: 'The workstation tour is complete. Open CASE-1998-027 in PRIS and investigate from the evidence.', app: 'police-records' }
  ], []);

  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[index];

  const refresh = () => {
    const el = step.target?.();
    if (el) {
      el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
      window.requestAnimationFrame(() => setRect(el.getBoundingClientRect()));
    } else {
      setRect(null);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(refresh, 120);
    const second = window.setTimeout(refresh, 400);
    window.addEventListener('resize', refresh);
    window.addEventListener('scroll', refresh, true);
    return () => {
      clearTimeout(timer);
      clearTimeout(second);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('scroll', refresh, true);
    };
  }, [index]);

  useEffect(() => {
    if (!step.app) return;

    // Close only the window opened by the previous tutorial step. This prevents
    // the tour from leaving ten application windows stacked on top of each other.
    if (tutorialWindowRef.current) {
      closeWindow(tutorialWindowRef.current);
      tutorialWindowRef.current = null;
    }

    const existing = windows.find((w) => w.appId === step.app);
    const id = openApp(step.app);
    if (!existing && id) tutorialWindowRef.current = id;

    const timer = window.setTimeout(refresh, 300);
    return () => clearTimeout(timer);
  }, [index, step.app]);

  const finish = () => {
    if (tutorialWindowRef.current) {
      closeWindow(tutorialWindowRef.current);
      tutorialWindowRef.current = null;
    }
    onFinish();
  };

  const next = () => {
    if (index === steps.length - 1) finish();
    else setIndex((i) => i + 1);
  };

  const spotlight = rect ? {
    left: Math.max(4, rect.left - 8),
    top: Math.max(34, rect.top - 8),
    width: Math.min(rect.width + 16, window.innerWidth - Math.max(4, rect.left - 8) - 4),
    height: Math.min(rect.height + 16, window.innerHeight - Math.max(34, rect.top - 8) - 4)
  } : null;

  // Keep the explanation away from the highlighted control. The old tutorial
  // always lived at the bottom, which covered the dock and lower controls.
  const cardAbove = rect ? rect.top > window.innerHeight * 0.58 : true;
  const cardStyle = cardAbove ? { top: 18 } : { bottom: 18 };

  const arrow = spotlight ? {
    left: Math.min(window.innerWidth - 28, Math.max(28, spotlight.left + spotlight.width / 2)),
    top: cardAbove ? Math.max(4, spotlight.top - 30) : Math.min(window.innerHeight - 28, spotlight.top + spotlight.height + 8)
  } : null;

  return <div className="fixed inset-0 z-[11000] pointer-events-none font-sans">
    {spotlight && <div className="absolute rounded-xl ring-2 ring-blue-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.62),0_0_35px_rgba(59,130,246,0.55)] transition-all duration-200 pointer-events-none" style={spotlight} />}
    {arrow && <div className="absolute -translate-x-1/2 text-blue-300 drop-shadow-[0_0_8px_rgba(59,130,246,.9)] text-xl leading-none pointer-events-none" style={arrow}>{cardAbove ? '↓' : '↑'}</div>}

    <div className="absolute left-1/2 -translate-x-1/2 w-[min(720px,calc(100vw-2rem))] pointer-events-auto" style={cardStyle}>
      <div className="rounded-2xl bg-slate-950/98 border border-blue-500/50 shadow-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-700 via-cyan-300 to-blue-700" />
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-300 shrink-0"><Icon name="MousePointer2" size={18} /></div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] uppercase tracking-[.18em] text-blue-400">WORKSTATION TUTORIAL · {index + 1}/{steps.length}</div>
              <h2 className="mt-1 text-base font-semibold text-white">{step.title}</h2>
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-slate-300">{step.text}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <button onClick={finish} className="text-[10px] text-slate-500 hover:text-slate-200">Skip tutorial</button>
            <button onClick={next} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider">{index === steps.length - 1 ? 'Finish & Start' : 'Next'}</button>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
