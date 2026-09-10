import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../common/Icon';
import { useOS } from '../../context/OSContext';

interface WorkstationTutorialProps { onFinish: () => void; }
type TutorialStep = { title: string; text: string; target?: () => HTMLElement | null; app?: string };

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

export const WorkstationTutorial: React.FC<WorkstationTutorialProps> = ({ onFinish }) => {
  const { openApp, closeWindow, windows } = useOS();
  const tutorialWindowRef = useRef<string | null>(null);

  const steps: TutorialStep[] = useMemo(() => [
    { title: 'Welcome', text: 'This is a guided tour of the workstation. Follow the blue highlight and arrow, then press Next. You never have to solve the case during the tutorial.', target: () => textButton('Applications') },
    { title: 'Applications', text: 'Open the application launcher from here.', target: () => textButton('Applications') },
    { title: 'Launcher search', text: 'Search the launcher when you know the tool name.', target: () => document.querySelector('#os-app-launcher input') as HTMLElement | null },
    { title: 'Launcher categories', text: 'Categories filter the available applications.', target: () => document.querySelector('#os-app-launcher .w-28 button') as HTMLElement | null },
    { title: 'Open an application', text: 'Application entries launch the selected tool.', target: () => document.querySelector('#os-app-launcher .flex-1 button') as HTMLElement | null },
    { title: 'Date & time', text: 'The top bar clock is workstation time. Case records contain the investigation timestamps.', target: () => labelButton('Date', 'Calendar') || document.querySelector('header button') as HTMLElement | null },
    { title: 'Network', text: 'Shows the simulated police network connection.', target: () => titleButton('Network:') },
    { title: 'Sound', text: 'Controls workstation volume and mute.', target: () => titleButton('Volume:') },
    { title: 'Battery', text: 'Shows workstation power status. It has no case effect.', target: () => titleButton('Battery:') },
    { title: 'Notifications', text: 'System and investigation alerts appear here.', target: () => titleButton('Notifications') || labelButton('Notifications') },
    { title: 'Account menu', text: 'Contains account and power controls. You normally do not need the power controls.', target: () => textButton('investigator') },
    { title: 'Dock', text: 'The bottom dock is your quick launcher. It must remain usable during this tutorial.', target: () => document.querySelector('[class*="fixed bottom-2"]') as HTMLElement | null },
    { title: 'PRIS Database', text: 'The main police records application. The dock icon opens or focuses it.', target: () => dockButton('PRIS Database'), app: 'police-records' },
    { title: 'PRIS — Case Overview', text: 'The case-focused landing page gives context without assigning a route.', target: () => textButton('Case Overview') },
    { title: 'PRIS — Cases', text: 'Browse case dockets and histories.', target: () => textButton('Cases') },
    { title: 'PRIS — Persons', text: 'Find victims, witnesses, suspects and other people.', target: () => textButton('Persons') },
    { title: 'PRIS — Evidence', text: 'Inspect evidence records and chain of custody.', target: () => textButton('Evidence') },
    { title: 'PRIS — Reports', text: 'Read original and supplemental police reports. Contradictions can matter.', target: () => textButton('Reports') },
    { title: 'PRIS — Locations', text: 'Locations are ordinary text records containing addresses, districts, directions and distances. There is no GIS map.', target: () => textButton('Locations') },
    { title: 'PRIS — Vehicles', text: 'Vehicle records contain plates, ownership and sightings.', target: () => textButton('Vehicles') },
    { title: 'PRIS — Officers', text: 'Officer records contain service history and assignments.', target: () => textButton('Officers') },
    { title: 'PRIS — Organizations', text: 'Organizations connect companies and institutions to records.', target: () => textButton('Organizations') },
    { title: 'PRIS — Search', text: 'Search by names, case numbers, addresses, IDs and other clues.', target: () => textButton('Search') },
    { title: 'Window controls', text: 'Every application window has Minimize, Maximize/Restore and Close controls in its title bar.', target: () => titleButton('Minimize') },
    { title: 'Maximize / Restore', text: 'Use this control to switch a window between floating and full workstation size.', target: () => titleButton('Maximize', 'Restore') },
    { title: 'Close window', text: 'Close the current application window here. The app can be reopened from the dock or launcher.', target: () => titleButton('Close') },
    { title: 'Case Notebook', text: 'The Notebook is your private working memory. Record observations and theories yourself.', target: () => dockButton('Case Notebook'), app: 'investigation-notebook' },
    { title: 'Notebook tabs', text: 'Use Notes, Bookmarks, Timeline and Contradictions to organize what you discovered.', target: () => document.querySelector('main button') as HTMLElement | null },
    { title: 'Investigation Board', text: 'The Board is your mental model. Pin records and connect them when you believe a relationship exists.', target: () => dockButton('Investigation Board'), app: 'investigation-board' },
    { title: 'Evidence & Forensics', text: 'Use the Evidence Lab for physical evidence, forensic findings and custody records.', target: () => dockButton('Evidence & Forensics'), app: 'evidence-lab' },
    { title: 'Terminal', text: 'Terminal is for digital traces, logs and system-level evidence when the case calls for it.', target: () => dockButton('Terminal'), app: 'Terminal' },
    { title: 'Browser', text: 'Browser is for public research and the fictional web sources in the case. It is not a map viewer.', target: () => dockButton('Browser'), app: 'Browser' },
    { title: 'Police Mail', text: 'Police Mail contains internal correspondence and departmental communication.', target: () => dockButton('Police Mail'), app: 'Police Mail' },
    { title: 'Files', text: 'Files is the workstation filesystem for recovered documents and supporting material.', target: () => dockButton('Files'), app: 'file-manager' },
    { title: 'Settings', text: 'Settings controls appearance, sound and accessibility. It does not change case progress.', target: () => dockButton('Settings'), app: 'Settings' },
    { title: 'Case Determination', text: 'Final Deduction is where you submit your conclusion after building a theory from the evidence.', target: () => dockButton('Case Determination'), app: 'final-deduction' },
    { title: 'Your judgment', text: 'There is no GIS map and no mandatory checklist. Read records, compare details, follow connections and build your own explanation.', target: () => document.querySelector('[class*="fixed bottom-2"]') as HTMLElement | null },
    { title: 'Start Case 27', text: 'The tour is complete. Open CASE-1998-027 in PRIS and investigate from the evidence.', target: () => dockButton('PRIS Database'), app: 'police-records' }
  ], []);

  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[index];

  const refresh = () => {
    const el = step.target?.();
    if (!el) { setRect(null); return; }
    el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
    window.requestAnimationFrame(() => setRect(el.getBoundingClientRect()));
  };

  useEffect(() => {
    const a = window.setTimeout(refresh, 120);
    const b = window.setTimeout(refresh, 450);
    window.addEventListener('resize', refresh);
    window.addEventListener('scroll', refresh, true);
    return () => {
      clearTimeout(a); clearTimeout(b);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('scroll', refresh, true);
    };
  }, [index]);

  useEffect(() => {
    if (!step.app) return;
    if (tutorialWindowRef.current) {
      closeWindow(tutorialWindowRef.current);
      tutorialWindowRef.current = null;
    }
    const existing = windows.find((w) => w.appId === step.app);
    const id = openApp(step.app);
    if (!existing && id) tutorialWindowRef.current = id;
    const timer = window.setTimeout(refresh, 350);
    return () => clearTimeout(timer);
  }, [index, step.app]);

  const finish = () => {
    if (tutorialWindowRef.current) closeWindow(tutorialWindowRef.current);
    tutorialWindowRef.current = null;
    onFinish();
  };

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
            <div className="min-w-0 flex-1"><div className="text-[9px] uppercase tracking-[.18em] text-blue-400">WORKSTATION TUTORIAL · {index + 1}/{steps.length}</div><h2 className="mt-1 text-base font-semibold text-white">{step.title}</h2></div>
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
