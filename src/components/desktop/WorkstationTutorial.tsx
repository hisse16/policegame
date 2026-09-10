import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../common/Icon';
import { useOS } from '../../context/OSContext';

interface WorkstationTutorialProps { onFinish: () => void; }
type Step = { title: string; text: string; app?: string; target: () => HTMLElement | null; prepare?: () => void };

const buttons = () => Array.from(document.querySelectorAll('button')) as HTMLElement[];
const normalize = (value: string) => value.replace(/\s+/g, ' ').trim().toLowerCase();
const byText = (text: string) => {
  const wanted = normalize(text);
  return buttons().find((b) => normalize(b.textContent || '') === wanted) || null;
};
const byTitlePrefix = (prefix: string) => document.querySelector(`button[title^="${prefix}"]`) as HTMLElement | null;
const top = () => document.querySelector('header') as HTMLElement | null;
const appButton = () => byText('Applications') || top()?.querySelector('button') as HTMLElement | null;
const clockButton = () => top()?.querySelector('div.absolute button') as HTMLElement | null;
const launcher = () => document.querySelector('#os-app-launcher') as HTMLElement | null;
const dock = () => document.querySelector('[data-os-dock="true"]') as HTMLElement | null || document.querySelector('.fixed.bottom-2') as HTMLElement | null;

const windowByApp = (app: string) => {
  const names: Record<string, string> = {
    'police-records': 'PRIS Database',
    'investigation-notebook': 'Case Notebook',
    'investigation-board': 'Investigation Board',
    'evidence-lab': 'Evidence & Forensics',
    terminal: 'Terminal',
    browser: 'Browser',
    'police-mail': 'Police Mail',
    'file-manager': 'Files',
    settings: 'Settings',
    'final-deduction': 'Case Determination'
  };
  const name = names[app];
  if (!name) return null;
  return Array.from(document.querySelectorAll('[id^="window-win_"]')).find((e) => normalize(e.textContent || '').includes(normalize(name))) as HTMLElement | null;
};

const click = (element: HTMLElement | null) => {
  if (element && !element.hasAttribute('disabled')) element.click();
};
const openLauncher = () => { if (!launcher()) click(appButton()); };

export const WorkstationTutorial: React.FC<WorkstationTutorialProps> = ({ onFinish }) => {
  const { openApp, closeWindow, windows, setLauncherOpen, setNetworkMenuOpen, setVolumeMenuOpen, setPowerMenuOpen, setNotificationCenterOpen } = useOS();
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const createdWindows = useRef<string[]>([]);
  const baselineWindowIds = useRef<string[]>(windows.map((w) => w.id));

  const closeTransientMenus = () => {
    setLauncherOpen(false);
    setNetworkMenuOpen(false);
    setVolumeMenuOpen(false);
    setPowerMenuOpen(false);
    setNotificationCenterOpen(false);
    // TopPanel does not expose calendar state. It is harmless to leave it
    // closed normally; if open, clicking the clock is the only supported path.
    const calendar = Array.from(document.querySelectorAll('div.fixed')).find((e) => {
      const text = normalize(e.textContent || '');
      return /january|february|march|april|may|june|july|august|september|october|november|december/.test(text);
    }) as HTMLElement | undefined;
    if (calendar) click(clockButton());
  };

  const steps = useMemo<Step[]>(() => {
    const pris = (tab: string, text: string): Step => ({
      title: `PRIS — ${tab}`,
      text,
      app: 'police-records',
      target: () => byText(tab),
      prepare: () => window.setTimeout(() => click(byText(tab)), 120)
    });
    const appStep = (title: string, app: string, text: string): Step => ({ title, text, app, target: () => windowByApp(app) || dock() });

    return [
      { title:'Welcome', text:'This is the workstation. The tutorial explains the interface; it does not prescribe how to solve Case 27.', target:appButton },
      { title:'Applications', text:'Applications opens the full application launcher.', target:appButton, prepare:openLauncher },
      { title:'Launcher search', text:'Use this field to filter applications by name.', target:() => launcher()?.querySelector('input[placeholder="Type to search applications..."]') as HTMLElement | null, prepare:openLauncher },
      { title:'Launcher categories', text:'These categories filter the launcher. They do not represent case objectives.', target:() => launcher()?.querySelector('.w-28 button') as HTMLElement | null, prepare:openLauncher },
      { title:'Open an application', text:'Application entries launch tools. The tutorial opens tools automatically later.', target:() => launcher()?.querySelector('.flex-1 > button') as HTMLElement | null, prepare:openLauncher },
      { title:'Date & time', text:'The centered clock shows workstation date and time. Case records have their own timestamps.', target:clockButton, prepare:() => click(clockButton()) },
      { title:'Network', text:'The Wi-Fi icon shows the simulated police-network state. Click it to inspect available networks.', target:() => byTitlePrefix('Network:'), prepare:() => click(byTitlePrefix('Network:')) },
      { title:'Sound', text:'The speaker icon controls workstation volume and mute.', target:() => byTitlePrefix('Volume:'), prepare:() => click(byTitlePrefix('Volume:')) },
      { title:'Battery', text:'The battery indicator shows simulated workstation power status.', target:() => byTitlePrefix('Battery:') },
      { title:'Notifications', text:'The bell opens system and investigation notifications.', target:() => document.querySelector('button[title="Notifications"]') as HTMLElement | null, prepare:() => click(document.querySelector('button[title="Notifications"]') as HTMLElement | null) },
      { title:'Account menu', text:'The investigator menu contains the workstation account and power controls.', target:() => top()?.querySelector('button:last-child') as HTMLElement | null, prepare:() => click(top()?.querySelector('button:last-child') as HTMLElement | null) },
      { title:'Dock', text:'The bottom dock provides quick access to available applications.', target:dock },
      appStep('PRIS Database','police-records','PRIS is the main police-records application.'),
      pris('Case Overview','The case-focused landing view provides context without assigning a route.'),
      pris('Cases','Browse case dockets and histories.'),
      pris('Persons','Find victims, witnesses, suspects and other people.'),
      pris('Evidence','Inspect evidence records and chain of custody.'),
      pris('Reports','Read original and supplemental reports; conflicting versions can matter.'),
      pris('Locations','Locations are text records containing addresses, intersections, directions and distances. There is no GIS map.'),
      pris('Vehicles','Vehicle records contain identifiers, ownership and sightings.'),
      pris('Officers','Officer records contain personnel information, service history and assignments.'),
      pris('Organizations','Organization records connect companies and institutions to records.'),
      pris('Search','Search indexed records by names, IDs, case numbers, addresses and other text.'),
      { title:'Window controls', text:'Every application window has Minimize, Maximize / Restore and Close controls in its title bar.', app:'police-records', target:() => windowByApp('police-records')?.querySelector('button[title="Minimize"]') as HTMLElement | null },
      { title:'Maximize / Restore', text:'This control switches a window between floating and workstation size.', app:'police-records', target:() => windowByApp('police-records')?.querySelector('button[title="Maximize"],button[title="Restore"]') as HTMLElement | null },
      { title:'Close window', text:'This closes the current application window. The tutorial does not click it automatically.', app:'police-records', target:() => windowByApp('police-records')?.querySelector('button[title="Close"]') as HTMLElement | null },
      appStep('Case Notebook','investigation-notebook','The Notebook is your private working memory for notes, questions and theories.'),
      { title:'Notebook tabs', text:'The Notebook separates your notes, bookmarks, timeline and contradictions.', app:'investigation-notebook', target:() => windowByApp('investigation-notebook')?.querySelector('main button') as HTMLElement | null },
      appStep('Investigation Board','investigation-board','The Board is your mental model. Create relationships when you believe a connection is meaningful.'),
      appStep('Evidence & Forensics','evidence-lab','Use the Evidence Lab for physical evidence, forensic findings and custody information.'),
      appStep('Terminal','terminal','Terminal provides command-line access to digital traces and logs.'),
      appStep('Browser','browser','Browser is for public research and the web sources represented in the case.'),
      appStep('Police Mail','police-mail','Police Mail contains internal correspondence and department communication.'),
      appStep('Files','file-manager','Files is the workstation filesystem for recovered documents and supporting material.'),
      appStep('Settings','settings','Settings controls workstation preferences; it does not change case progress.'),
      appStep('Case Determination','final-deduction','Case Determination is where the final conclusion is submitted after building a supported theory.'),
      { title:'Your judgment', text:'There is no mandatory checklist or GIS map. Read, compare, notice contradictions and build your own explanation.', target:dock },
      { title:'Start Case 27', text:'The tour is complete. PRIS is opened automatically; begin with CASE-1998-027 and investigate from the evidence.', app:'police-records', target:() => windowByApp('police-records') || dock() }
    ];
  }, []);

  const step = steps[index];

  const refresh = () => {
    const element = step.target();
    if (!element || !element.isConnected) { setRect(null); return; }
    const r = element.getBoundingClientRect();
    setRect(r.width > 0 || r.height > 0 ? r : null);
  };

  useEffect(() => {
    let stopped = false;
    closeTransientMenus();

    if (step.app) {
      const existing = windows.find((w) => w.appId === step.app);
      const id = openApp(step.app);
      if (!existing && id && !baselineWindowIds.current.includes(id) && !createdWindows.current.includes(id)) createdWindows.current.push(id);
    }

    step.prepare?.();
    setRect(null);

    const started = Date.now();
    const poll = () => {
      if (stopped) return;
      refresh();
      if (Date.now() - started < 5000) window.setTimeout(poll, 80);
    };
    poll();
    return () => { stopped = true; };
    // The tutorial advances by index. OS state is deliberately sampled when
    // entering each step rather than causing the step itself to restart.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, step.app]);

  const cleanup = () => {
    closeTransientMenus();
    createdWindows.current.forEach((id) => closeWindow(id));
    createdWindows.current = [];
  };

  const finish = () => { cleanup(); onFinish(); };
  const next = () => index === steps.length - 1 ? finish() : setIndex((i) => i + 1);

  const spotlight = rect ? { left:Math.max(3,rect.left-7), top:Math.max(30,rect.top-7), width:Math.min(rect.width+14,window.innerWidth), height:Math.min(rect.height+14,window.innerHeight-30) } : null;
  const above = rect ? rect.top > window.innerHeight * .55 : true;
  const card = above ? { top:18 } : { bottom:18 };
  const arrow = spotlight ? { left:Math.max(15,Math.min(window.innerWidth-15,spotlight.left+spotlight.width/2)), top:above?Math.max(5,spotlight.top-24):Math.min(window.innerHeight-20,spotlight.top+spotlight.height+4) } : null;

  return <div className="fixed inset-0 z-[11000] pointer-events-none font-sans">
    {spotlight && <div className="absolute rounded-xl ring-2 ring-blue-400 shadow-[0_0_0_9999px_rgba(0,0,0,.62),0_0_35px_rgba(59,130,246,.55)] pointer-events-none" style={spotlight}/>} 
    {arrow && <div className="absolute -translate-x-1/2 text-blue-300 text-xl font-bold" style={arrow}>{above?'↓':'↑'}</div>}
    <div className="absolute left-1/2 -translate-x-1/2 w-[min(720px,calc(100vw-2rem))] pointer-events-auto" style={card}>
      <div className="rounded-2xl bg-slate-950/98 border border-blue-500/50 shadow-2xl overflow-hidden"><div className="h-1 bg-gradient-to-r from-blue-700 via-cyan-300 to-blue-700"/><div className="p-5">
        <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-300"><Icon name="MousePointer2" size={18}/></div><div><div className="text-[9px] uppercase tracking-[.18em] text-blue-400">WORKSTATION TUTORIAL · {index+1}/{steps.length}</div><h2 className="mt-1 text-base font-semibold text-white">{step.title}</h2></div></div>
        <p className="mt-3 text-[11px] leading-5 text-slate-300">{step.text}</p>
        {!rect && <div className="mt-2 text-[9px] text-amber-400">Waiting for this control to appear…</div>}
        <div className="mt-4 flex items-center justify-between"><button onClick={finish} className="text-[10px] text-slate-500 hover:text-slate-200">Skip tutorial</button><button onClick={next} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider">{index===steps.length-1?'Finish & Start':'Next'}</button></div>
      </div></div>
    </div>
  </div>;
};
