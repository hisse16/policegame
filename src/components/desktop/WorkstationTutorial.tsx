import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '../common/Icon';
import { useOS } from '../../context/OSContext';

interface WorkstationTutorialProps { onFinish: () => void; }
type TutorialStep = { title: string; text: string; target?: () => HTMLElement | null; app?: string; action?: string };

const byTitle = (title: string) => Array.from(document.querySelectorAll('button')).find((el) => el.getAttribute('title')?.startsWith(title)) as HTMLElement | undefined || null;
const byText = (text: string) => Array.from(document.querySelectorAll('button')).find((el) => el.textContent?.trim() === text) as HTMLElement | undefined || null;
const byAnyText = (...texts: string[]) => Array.from(document.querySelectorAll('button')).find((el) => texts.some((text) => el.textContent?.trim() === text)) as HTMLElement | undefined || null;

export const WorkstationTutorial: React.FC<WorkstationTutorialProps> = ({ onFinish }) => {
  const { openApp } = useOS();
  const steps: TutorialStep[] = useMemo(() => [
    { title: 'Welcome to the workstation', text: 'This short tour explains the controls you will actually use. It does not solve Case 27 for you.', target: () => byText('Applications') },
    { title: 'Applications launcher', text: 'Click Applications to see the programs installed on this workstation. You can also search for an application by name.', target: () => byText('Applications') },
    { title: 'Launcher search', text: 'The search field filters applications. It is useful when the workstation has several tools available.', target: () => document.querySelector('#os-app-launcher input') as HTMLElement | null },
    { title: 'Application categories', text: 'The launcher groups tools by category. You do not need to memorize these categories.', target: () => document.querySelector('#os-app-launcher .w-28 button') as HTMLElement | null },
    { title: 'Opening an application', text: 'Selecting an application opens its window. The same application can usually be reopened from the dock later.', target: () => document.querySelector('#os-app-launcher .flex-1 button') as HTMLElement | null },
    { title: 'Date and time', text: 'The center of the top bar shows the workstation date and time. Case records use their own recorded timestamps.', target: () => document.querySelector('header button') as HTMLElement | null },
    { title: 'Network', text: 'This controls the simulated police network connection. Some browser and internal services require the workstation to be online.', target: () => byTitle('Network:') },
    { title: 'Sound', text: 'Use this control to mute or adjust workstation sounds. It has no effect on the investigation.', target: () => byTitle('Volume:') },
    { title: 'Battery', text: 'The battery indicator is only workstation status information. It does not affect the case.', target: () => document.querySelector('header [title^="Battery:"]') as HTMLElement | null },
    { title: 'Notifications', text: 'Important system and investigation events can appear here. Open it when you see the notification indicator.', target: () => byTitle('Notifications') },
    { title: 'Investigator account menu', text: 'This contains workstation account and power controls. Do not use power controls as part of normal investigation flow.', target: () => byText('investigator') },
    { title: 'Calendar popover', text: 'Clicking the date opens a small calendar. It is informational and is not part of the case evidence.', target: () => document.querySelector('header button') as HTMLElement | null },
    { title: 'The dock', text: 'The dock is your quick launcher. Tools appear here as they become relevant to the investigation.', target: () => document.querySelector('.fixed.bottom-2') as HTMLElement | null },
    { title: 'PRIS Database', text: 'PRIS is the main police records system: cases, reports, people, officers, vehicles, locations and evidence.', app: 'police-records' },
    { title: 'PRIS: Case Overview', text: 'This is the case-focused landing page. It gives context without telling you a mandatory next step.', target: () => byAnyText('Case Overview') },
    { title: 'PRIS: Cases', text: 'Use Cases to browse case dockets and their histories.', target: () => byText('Cases') },
    { title: 'PRIS: Persons', text: 'Use Persons for witnesses, victims, suspects, family members and other people in the database.', target: () => byText('Persons') },
    { title: 'PRIS: Evidence', text: 'Use Evidence to inspect evidence records and chain-of-custody information.', target: () => byText('Evidence') },
    { title: 'PRIS: Reports', text: 'Reports contain original and supplemental police documentation. Conflicting versions can be important.', target: () => byText('Reports') },
    { title: 'PRIS: Locations', text: 'Locations are normal text records. Addresses, districts, intersections, directions and distances are described in the records—there is no GIS map.', target: () => byText('Locations') },
    { title: 'PRIS: Vehicles', text: 'Vehicles contain plates, ownership information and recorded sightings.', target: () => byText('Vehicles') },
    { title: 'PRIS: Officers', text: 'Officers contain service history, assignments and related records.', target: () => byText('Officers') },
    { title: 'PRIS: Organizations', text: 'Organizations connect companies and institutions to records in the case.', target: () => byText('Organizations') },
    { title: 'PRIS: Search', text: 'Search is the fastest way to find a record when you already have a name, case number, address or other clue.', target: () => byText('Search') },
    { title: 'Case records', text: 'Inside a record, read the actual text before following a link. The evidence is the navigation system.', app: 'police-records' },
    { title: 'Record links', text: 'Linked IDs and related records let you move from one piece of evidence to another without a prescribed route.', target: () => document.querySelector('main button') as HTMLElement | null },
    { title: 'Bookmarks', text: 'Bookmark a record when you want to return to it. Bookmarks are memory aids, not objectives.', target: () => byText('Bookmarks') },
    { title: 'Case Notebook', text: 'The Notebook is your private memory: write your observations, theories and important details yourself.', app: 'investigation-notebook' },
    { title: 'Notebook tabs', text: 'Use notes, bookmarks, timeline and contradictions to organize what you personally discovered.', target: () => document.querySelector('button') as HTMLElement | null },
    { title: 'Investigation Board', text: 'The Board is your mental model. Pin records and connect them when you believe a relationship exists. It starts empty on purpose.', app: 'investigation-board' },
    { title: 'Evidence Lab', text: 'The Evidence Lab is for physical evidence and forensic findings. It becomes useful when the story points toward it.', app: 'evidence-lab' },
    { title: 'Terminal', text: 'The Terminal is for digital traces, logs and system-level evidence. It is not required at the beginning.', app: 'terminal' },
    { title: 'Browser', text: 'The Browser is for public research and the fictional web sources used by the case. It is not a map viewer.', app: 'browser' },
    { title: 'Police Mail', text: 'Police Mail contains internal correspondence, memoranda and departmental communication.', app: 'police-mail' },
    { title: 'Files', text: 'Files is the workstation filesystem. Recovered documents and supporting material can appear here.', app: 'file-manager' },
    { title: 'Settings', text: 'Settings controls appearance, sound and accessibility options. Changing them does not alter case progress.', app: 'settings' },
    { title: 'Final Deduction', text: 'When you have built a theory, the final determination is where you submit your conclusion and supporting evidence.', app: 'final-deduction' },
    { title: 'The most important control: your judgment', text: 'There is no map, no mandatory checklist and no button telling you what to think. Read, compare, connect, question—and build the case yourself.', target: () => document.querySelector('.fixed.bottom-2') as HTMLElement | null },
    { title: 'Start Case 27', text: 'The tour is complete. Open PRIS, read CASE-1998-027, and follow the evidence wherever it leads.', app: 'police-records' }
  ], []);

  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[index];

  const refresh = () => {
    const el = step.target?.();
    setRect(el?.getBoundingClientRect() || null);
  };

  useEffect(() => {
    refresh();
    const t = window.setTimeout(refresh, 150);
    window.addEventListener('resize', refresh);
    return () => { clearTimeout(t); window.removeEventListener('resize', refresh); };
  }, [index]);

  useEffect(() => {
    if (!step.app) return;
    openApp(step.app);
    const t = window.setTimeout(refresh, 250);
    return () => clearTimeout(t);
  }, [index, step.app]);

  const next = () => {
    if (index === steps.length - 1) onFinish();
    else setIndex((i) => i + 1);
  };

  const spotlight = rect ? {
    left: Math.max(4, rect.left - 8),
    top: Math.max(30, rect.top - 8),
    width: rect.width + 16,
    height: rect.height + 16
  } : null;

  return <div className="fixed inset-0 z-[11000] pointer-events-none font-sans">
    {spotlight && <div className="absolute rounded-xl ring-2 ring-blue-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.58),0_0_35px_rgba(59,130,246,0.5)] transition-all duration-200" style={spotlight} />}
    <div className="absolute left-1/2 -translate-x-1/2 bottom-5 w-[min(720px,calc(100vw-2rem))] pointer-events-auto">
      <div className="rounded-2xl bg-slate-950/98 border border-blue-500/50 shadow-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-700 via-cyan-300 to-blue-700" />
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-300 shrink-0"><Icon name="MousePointer2" size={18} /></div>
            <div className="min-w-0"><div className="text-[9px] uppercase tracking-[.18em] text-blue-400">WORKSTATION TUTORIAL · {index + 1}/{steps.length}</div><h2 className="mt-1 text-base font-semibold text-white">{step.title}</h2></div>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-slate-300">{step.text}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <button onClick={onFinish} className="text-[10px] text-slate-500 hover:text-slate-200">Skip tutorial</button>
            <button onClick={next} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider">{index === steps.length - 1 ? 'Finish & Start' : 'Next'}</button>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
