import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '../common/Icon';
import { useOS } from '../../context/OSContext';

interface WorkstationTutorialProps { onFinish: () => void; }

const STEPS = [
  { target: 'tutorial-applications', title: 'Applications', text: 'This opens every workstation application. Use it when you need a tool that is not pinned in the dock.', side: 'bottom' },
  { target: 'tutorial-status', title: 'Case status', text: 'This compact status area shows where you are in the investigation. It is information, not a task list.', side: 'bottom' },
  { target: 'tutorial-network', title: 'Network', text: 'Controls the simulated workstation connection. Some investigation systems require the network to be online.', side: 'bottom' },
  { target: 'tutorial-notifications', title: 'Notifications', text: 'Important discoveries, contradictions and newly unlocked tools appear here. You do not need to watch it constantly.', side: 'bottom' },
  { target: 'tutorial-power', title: 'System menu', text: 'Restart, shut down and workstation controls live here. It is not part of the investigation.', side: 'bottom' },
  { target: 'tutorial-dock-police-records', title: 'PRIS — Police Records', text: 'Your starting point. Cases, reports, people, officers, vehicles, locations and evidence are cross-linked here.', side: 'top' },
  { target: 'tutorial-dock-evidence-lab', title: 'Evidence Lab', text: 'Unlocked when the case reaches forensic evidence. Use it to inspect physical evidence and laboratory findings.', side: 'top' },
  { target: 'tutorial-dock-investigation-board', title: 'Investigation Board', text: 'Connect people, places, vehicles and evidence. This is where you build your own theory instead of following a checklist.', side: 'top' },
  { target: 'tutorial-dock-notebook', title: 'Notebook', text: 'Write your own conclusions, questions and suspicions. The game does not decide your theory for you.', side: 'top' },
  { target: 'tutorial-dock-police-mail', title: 'Police Mail', text: 'Internal correspondence and departmental messages. It becomes relevant later in the investigation.', side: 'top' },
  { target: 'tutorial-dock-map', title: 'Investigation Map', text: 'A geographic view for locations and movements. It becomes useful once the case has enough location evidence.', side: 'top' },
  { target: 'tutorial-dock-file-manager', title: 'Files', text: 'Your simulated filesystem. Later evidence may be stored as documents or archive files here.', side: 'top' },
  { target: 'tutorial-dock-terminal', title: 'Terminal', text: 'Digital investigation tool for logs, audit trails and system traces. It unlocks when the story requires it.', side: 'top' },
  { target: 'tutorial-dock-browser', title: 'Browser', text: 'Public research: newspapers, archives and web sources. It is deliberately unlocked later so the opening does not become a scavenger hunt.', side: 'top' },
  { target: 'tutorial-dock-final-deduction', title: 'Final Deduction', text: 'The official determination screen. You only use it after the evidence chain is complete.', side: 'top' },
  { target: 'tutorial-dock-settings', title: 'Settings', text: 'Workstation appearance, sound and accessibility options. These do not affect the case.', side: 'top' },
];

export const WorkstationTutorial: React.FC<WorkstationTutorialProps> = ({ onFinish }) => {
  const { openApp } = useOS();
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = STEPS[index];

  const refresh = () => {
    const el = document.querySelector(`[data-tutorial="${step.target}"]`) as HTMLElement | null;
    setRect(el?.getBoundingClientRect() || null);
  };
  useEffect(() => { refresh(); const t = window.setTimeout(refresh, 80); window.addEventListener('resize', refresh); return () => { window.clearTimeout(t); window.removeEventListener('resize', refresh); }; }, [index]);

  const spotlight = useMemo(() => rect ? { left: rect.left - 7, top: rect.top - 7, width: rect.width + 14, height: rect.height + 14 } : null, [rect]);
  const next = () => { if (index >= STEPS.length - 1) { onFinish(); return; } setIndex(i => i + 1); };
  const skip = () => onFinish();
  const openCurrent = () => {
    const appMap: Record<string, string> = { 'tutorial-dock-police-records': 'police-records', 'tutorial-dock-evidence-lab': 'evidence-lab', 'tutorial-dock-investigation-board': 'investigation-board', 'tutorial-dock-notebook': 'investigation-notebook', 'tutorial-dock-police-mail': 'police-mail', 'tutorial-dock-map': 'investigation-map', 'tutorial-dock-file-manager': 'file-manager', 'tutorial-dock-terminal': 'terminal', 'tutorial-dock-browser': 'browser', 'tutorial-dock-final-deduction': 'final-deduction', 'tutorial-dock-settings': 'settings' };
    const app = appMap[step.target]; if (app) openApp(app);
  };

  return <div className="fixed inset-0 z-[11000] pointer-events-none font-sans">
    <div className="absolute inset-0 bg-black/62" />
    {spotlight && <div className="absolute rounded-xl ring-2 ring-blue-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.62),0_0_30px_rgba(59,130,246,0.35)] transition-all duration-200 pointer-events-none" style={spotlight} />}
    {rect && <div className={`absolute z-10 w-[min(370px,calc(100vw-2rem))] pointer-events-auto transition-all duration-200 ${step.side === 'top' ? 'bottom-[92px]' : 'top-[48px]'} ${rect.left > window.innerWidth / 2 ? 'right-4' : 'left-4'}`}>
      <div className="relative rounded-2xl bg-slate-950/98 border border-blue-500/50 shadow-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-700 via-cyan-400 to-blue-700" />
        <div className="p-4">
          <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-300 shrink-0"><Icon name="MousePointer2" size={18} /></div><div><div className="text-[9px] uppercase tracking-[.18em] text-blue-400">WORKSTATION GUIDE · {index + 1}/{STEPS.length}</div><h2 className="mt-1 text-base font-semibold text-white">{step.title}</h2></div></div>
          <p className="mt-3 text-[11px] leading-5 text-slate-300">{step.text}</p>
          <div className="mt-4 flex items-center justify-between gap-2"><button onClick={skip} className="text-[10px] text-slate-500 hover:text-slate-300">Skip tutorial</button><div className="flex gap-2"><button onClick={openCurrent} className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-[10px] text-slate-300 hover:text-white">Open</button><button onClick={next} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider">{index === STEPS.length - 1 ? 'Finish' : 'Next'}</button></div></div>
        </div>
      </div>
    </div>}
  </div>;
};
