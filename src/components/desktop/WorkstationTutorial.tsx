import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../common/Icon';
import { useOS } from '../../context/OSContext';

interface WorkstationTutorialProps { onFinish: () => void; }
type TutorialStep = { title: string; text: string; target?: () => HTMLElement | null; app?: string; prepare?: () => void };

const allButtons = () => Array.from(document.querySelectorAll('button')) as HTMLElement[];
const textButton = (...names: string[]) => allButtons().find((el) => names.includes((el.textContent || '').trim())) || null;
const titleButton = (...names: string[]) => allButtons().find((el) => {
  const title = el.getAttribute('title') || '';
  return names.some((name) => title === name || title.startsWith(name));
}) || null;
const labelButton = (...names: string[]) => allButtons().find((el) => {
  const label = el.getAttribute('aria-label') || '';
  return names.some((name) => label === name || label.startsWith(name));
}) || null;
const dockButton = (name: string) => titleButton(name);
const clickButton = (button: HTMLElement | null) => { if (button) button.click(); };
const ensureLauncher = () => {
  if (!document.querySelector('#os-app-launcher')) clickButton(textButton('Applications'));
};
const openTopMenu = (...names: string[]) => clickButton(titleButton(...names) || labelButton(...names) || textButton(...names));
const openPRISTab = (name: string) => clickButton(textButton(name));

export const WorkstationTutorial: React.FC<WorkstationTutorialProps> = ({ onFinish }) => {
  const { openApp } = useOS();
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const steps = useMemo<TutorialStep[]>(() => [
    { title: 'Welcome', text: 'This is a guided tour of the workstation. The tour shows where things are; it does not teach you how to solve Case 27.', target: () => textButton('Applications'), prepare: ensureLauncher },
    { title: 'Applications', text: 'The Applications button opens the full application launcher. You can use it whenever you need a tool.', target: () => textButton('Applications'), prepare: ensureLauncher },
    { title: 'Launcher search', text: 'Use this field to filter applications by name instead of browsing the whole launcher.', target: () => document.querySelector('#os-app-launcher input') as HTMLElement | null, prepare: ensureLauncher },
    { title: 'Launcher categories', text: 'Categories narrow the launcher list by type. They are a convenience, not part of case progression.', target: () => document.querySelector('#os-app-launcher .w-28 button') as HTMLElement | null, prepare: ensureLauncher },
    { title: 'Open an application', text: 'Click an application entry to launch it. The launcher can be reopened later from Applications.', target: () => document.querySelector('#os-app-launcher .flex-1 button') as HTMLElement | null, prepare: ensureLauncher },
    { title: 'Date & time', text: 'The clock shows workstation time. Investigation records contain their own event timestamps, so always read the source of a time.', target: () => labelButton('Date', 'Calendar') || document.querySelector('header button') as HTMLElement | null, prepare: () => openTopMenu('Date', 'Calendar') },
    { title: 'Network', text: 'This menu shows the simulated workstation network state. It is system information, not a case clue by itself.', target: () => titleButton('Network:') || labelButton('Network'), prepare: () => openTopMenu('Network:', 'Network') },
    { title: 'Sound', text: 'This control changes workstation volume and mute state. It has no effect on case evidence.', target: () => titleButton('Volume:') || labelButton('Volume'), prepare: () => openTopMenu('Volume:', 'Volume') },
    { title: 'Battery', text: 'This shows simulated workstation power status. It does not change investigation progress.', target: () => titleButton('Battery:') || labelButton('Battery'), prepare: () => openTopMenu('Battery:', 'Battery') },
    { title: 'Notifications', text: 'System and investigation notifications appear here. Read them as information, not as a task list.', target: () => titleButton('Notifications') || labelButton('Notifications'), prepare: () => openTopMenu('Notifications') },
    { title: 'Account menu', text: 'The account menu contains profile and system controls. The power controls are not needed for investigating the case.', target: () => textButton('investigator') || labelButton('Account', 'User'), prepare: () => openTopMenu('Account', 'User', 'investigator') },
    { title: 'Dock', text: 'The bottom dock provides quick access to installed applications. It remains available while you investigate.', target: () => document.querySelector('[class*="fixed bottom-2"]') as HTMLElement | null },
    { title: 'PRIS Database', text: 'PRIS is the main police-records application. This step opens it automatically so you can see the real application.', target: () => dockButton('PRIS Database'), app: 'police-records' },
    { title: 'PRIS — Case Overview', text: 'The Case Overview is the case-focused landing view. It provides context without assigning an investigation route.', target: () => textButton('Case Overview'), app: 'police-records', prepare: () => openPRISTab('Case Overview') },
    { title: 'PRIS — Cases', text: 'Cases contains case dockets and histories. Open records when you have a reason to examine them.', target: () => textButton('Cases'), app: 'police-records', prepare: () => openPRISTab('Cases') },
    { title: 'PRIS — Persons', text: 'Persons contains people connected to records: victims, witnesses, suspects and other relevant individuals.', target: () => textButton('Persons'), app: 'police-records', prepare: () => openPRISTab('Persons') },
    { title: 'PRIS — Evidence', text: 'Evidence contains evidence records and chain-of-custody information. Read provenance as carefully as the item itself.', target: () => textButton('Evidence'), app: 'police-records', prepare: () => openPRISTab('Evidence') },
    { title: 'PRIS — Reports', text: 'Reports contain original and supplemental accounts. Different versions of an event can be important when they disagree.', target: () => textButton('Reports'), app: 'police-records', prepare: () => openPRISTab('Reports') },
    { title: 'PRIS — Locations', text: 'Locations are text records containing addresses, districts, intersections, directions and distances. There is no GIS map to follow.', target: () => textButton('Locations'), app: 'police-records', prepare: () => openPRISTab('Locations') },
    { title: 'PRIS — Vehicles', text: 'Vehicle records contain identifiers, ownership information and sightings. Compare those details with other records when useful.', target: () => textButton('Vehicles'), app: 'police-records', prepare: () => openPRISTab('Vehicles') },
    { title: 'PRIS — Officers', text: 'Officer records contain personnel information, service history and assignments.', target: () => textButton('Officers'), app: 'police-records', prepare: () => openPRISTab('Officers') },
    { title: 'PRIS — Organizations', text: 'Organization records connect companies, institutions and departments to other records.', target: () => textButton('Organizations'), app: 'police-records', prepare: () => openPRISTab('Organizations') },
    { title: 'PRIS — Search', text: 'Search can locate records by names, case numbers, addresses, identifiers and other indexed text.', target: () => textButton('Search'), app: 'police-records', prepare: () => openPRISTab('Search') },
    { title: 'Window controls', text: 'Application windows have Minimize, Maximize/Restore and Close controls in their title bar. The tutorial only highlights them; it never clicks destructive controls for you.', target: () => titleButton('Minimize'), app: 'police-records' },
    { title: 'Maximize / Restore', text: 'This control switches a window between its floating size and the available workstation size.', target: () => titleButton('Maximize', 'Restore'), app: 'police-records' },
    { title: 'Close window', text: 'This closes the current application window. The application can be reopened from the dock or launcher.', target: () => titleButton('Close'), app: 'police-records' },
    { title: 'Case Notebook', text: 'The Notebook is your private working memory. Write down observations, questions and theories yourself.', target: () => dockButton('Case Notebook'), app: 'investigation-notebook' },
    { title: 'Notebook tabs', text: 'The Notebook separates your notes, bookmarks, timeline and contradictions so you can organize what you discovered.', target: () => document.querySelector('main button') as HTMLElement | null, app: 'investigation-notebook' },
    { title: 'Investigation Board', text: 'The Board is your mental model. Pin records and create relationships only when you believe the connection is meaningful.', target: () => dockButton('Investigation Board'), app: 'investigation-board' },
    { title: 'Evidence & Forensics', text: 'Evidence & Forensics is used for physical evidence, forensic findings and custody information.', target: () => dockButton('Evidence & Forensics'), app: 'evidence-lab' },
    { title: 'Terminal', text: 'Terminal provides command-line access to digital traces, logs and other system-level evidence when relevant.', target: () => dockButton('Terminal'), app: 'terminal' },
    { title: 'Browser', text: 'Browser is for public research and the web sources represented in the case. It is not a GIS map viewer.', target: () => dockButton('Browser'), app: 'browser' },
    { title: 'Police Mail', text: 'Police Mail contains internal correspondence, department messages and official communication.', target: () => dockButton('Police Mail'), app: 'police-mail' },
    { title: 'Files', text: 'Files is the workstation filesystem for recovered documents and supporting material.', target: () => dockButton('Files'), app: 'file-manager' },
    { title: 'Settings', text: 'Settings controls workstation preferences such as appearance, sound and accessibility. It does not change case progress.', target: () => dockButton('Settings'), app: 'settings' },
    { title: 'Case Determination', text: 'Case Determination is where you submit your final conclusion after you have built and supported your own explanation.', target: () => dockButton('Case Determination'), app: 'final-deduction' },
    { title: 'Your judgment', text: 'There is no GIS map and no mandatory checklist. Read records, compare details, follow connections and build your own explanation.', target: () => document.querySelector('[class*="fixed bottom-2"]') as HTMLElement | null },
    { title: 'Start Case 27', text: 'The tour is complete. PRIS opens automatically; from there you can begin with CASE-1998-027 and investigate from the evidence.', target: () => dockButton('PRIS Database'), app: 'police-records' }
  ], []);

  const currentStep = steps[index];
  const retryTimerRef = useRef<number | null>(null);

  const refresh = () => {
    const el = currentStep.target?.();
    if (!el) { setRect(null); return false; }
    el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
    setRect(el.getBoundingClientRect());
    return true;
  };

  useEffect(() => {
    let stopped = false;
    const started = Date.now();
    if (currentStep.app) openApp(currentStep.app);
    currentStep.prepare?.();

    const poll = () => {
      if (stopped) return;
      refresh();
      if (Date.now() - started < 3000) retryTimerRef.current = window.setTimeout(poll, 100);
    };
    poll();

    const onViewportChange = () => refresh();
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, true);
    return () => {
      stopped = true;
      if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', onViewportChange, true);
    };
  }, [index, currentStep.app, currentStep.prepare]);

  const finish = () => onFinish();
  const next = () => index === steps.length - 1 ? finish() : setIndex((i) => i + 1);

  const spotlight = rect ? {
    left: Math.max(4, rect.left - 8),
    top: Math.max(34, rect.top - 8),
    width: Math.max(12, Math.min(rect.width + 16, window.innerWidth - Math.max(4, rect.left - 8) - 4)),
    height: Math.max(12, Math.min(rect.height + 16, window.innerHeight - Math.max(34, rect.top - 8) - 4))
  } : null;
  const cardAbove = rect ? rect.top > window.innerHeight * 0.58 : true;
  const cardStyle = cardAbove ? { top: 18 } : { bottom: 18 };
  const arrow = spotlight ? {
    left: Math.min(window.innerWidth - 20, Math.max(20, spotlight.left + spotlight.width / 2)),
    top: cardAbove ? Math.max(4, spotlight.top - 27) : Math.min(window.innerHeight - 25, spotlight.top + spotlight.height + 5)
  } : null;

  return <div className="fixed inset-0 z-[11000] pointer-events-none font-sans">
    {spotlight && <div className="absolute rounded-xl ring-2 ring-blue-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.62),0_0_35px_rgba(59,130,246,0.55)] transition-all duration-200 pointer-events-none" style={spotlight} />}
    {arrow && <div className="absolute -translate-x-1/2 text-blue-300 text-xl leading-none font-bold drop-shadow-[0_0_8px_rgba(59,130,246,.9)]" style={arrow}>{cardAbove ? '↓' : '↑'}</div>}
    <div className="absolute left-1/2 -translate-x-1/2 w-[min(720px,calc(100vw-2rem))] pointer-events-auto" style={cardStyle}>
      <div className="rounded-2xl bg-slate-950/98 border border-blue-500/50 shadow-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-700 via-cyan-300 to-blue-700" />
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-300 shrink-0"><Icon name="MousePointer2" size={18} /></div>
            <div className="min-w-0 flex-1"><div className="text-[9px] uppercase tracking-[.18em] text-blue-400">WORKSTATION TUTORIAL · {index + 1}/{steps.length}</div><h2 className="mt-1 text-base font-semibold text-white">{currentStep.title}</h2></div>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-slate-300">{currentStep.text}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <button onClick={finish} className="text-[10px] text-slate-500 hover:text-slate-200">Skip tutorial</button>
            <button onClick={next} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider">{index === steps.length - 1 ? 'Finish & Start' : 'Next'}</button>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
