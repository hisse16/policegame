import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '../common/Icon';
import { useOS } from '../../context/OSContext';

interface WorkstationTutorialProps { onFinish: () => void; }
type TutorialStep = { title: string; text: string; side: 'top' | 'bottom'; find: () => HTMLElement | null; app?: string };

const byTitle = (title: string) => Array.from(document.querySelectorAll('button')).find((el) => el.getAttribute('title')?.startsWith(title)) as HTMLElement | undefined || null;
const byText = (text: string) => Array.from(document.querySelectorAll('button')).find((el) => el.textContent?.trim() === text) as HTMLElement | undefined || null;

export const WorkstationTutorial: React.FC<WorkstationTutorialProps> = ({ onFinish }) => {
  const { openApp } = useOS();
  const steps: TutorialStep[] = useMemo(() => [
    { title: 'Applications', text: 'This is the workstation launcher. It contains every application. You can always return here when you forget where a tool lives.', side: 'bottom', find: () => byText('Applications') },
    { title: 'Case status', text: 'This small area shows the current investigation state. It is a status display, not a checklist you have to blindly follow.', side: 'bottom', find: () => document.querySelector('[data-tutorial="case-status"]') as HTMLElement | null },
    { title: 'Network', text: 'The simulated network connection. Keep it online when an investigation system asks for network access.', side: 'bottom', find: () => byTitle('Network:') },
    { title: 'Notifications', text: 'Important discoveries, contradictions and unlocks appear here. These are signals from the case, not random UI noise.', side: 'bottom', find: () => byTitle('Notifications') },
    { title: 'System menu', text: 'Your investigator account and power controls. Restarting the workstation does not reset the case.', side: 'bottom', find: () => byText('investigator') },
    { title: 'PRIS — Police Records', text: 'This is where the investigation starts. Cases contain links to reports, people, officers, vehicles, locations and evidence.', side: 'top', find: () => byTitle('PRIS') || byTitle('Police Records'), app: 'police-records' },
    { title: 'Evidence Lab', text: 'Physical evidence and forensic findings. It becomes relevant after the original investigation material points you toward the lab.', side: 'top', find: () => byTitle('Evidence Lab'), app: 'evidence-lab' },
    { title: 'Investigation Board', text: 'Your reasoning space. Connect evidence and people yourself instead of treating the case as a sequence of tasks.', side: 'top', find: () => byTitle('Investigation Board'), app: 'investigation-board' },
    { title: 'Notebook', text: 'Your private investigation notes. Write what you think happened and why; the game should not tell you what to believe.', side: 'top', find: () => byTitle('Notebook'), app: 'investigation-notebook' },
    { title: 'Police Mail', text: 'Internal correspondence, memos and departmental communication. It becomes useful when the investigation reaches the department trail.', side: 'top', find: () => byTitle('Police Mail'), app: 'police-mail' },
    { title: 'Investigation Map', text: 'Geographic evidence and case locations. Later it helps you understand how the locations in the records relate to one another.', side: 'top', find: () => byTitle('Investigation Map'), app: 'investigation-map' },
    { title: 'Files', text: 'The simulated filesystem. Archive documents and recovered files can appear here as the case develops.', side: 'top', find: () => byTitle('Files'), app: 'file-manager' },
    { title: 'Terminal', text: 'Digital traces: logs, audit trails and system evidence. It is intentionally not needed at the beginning.', side: 'top', find: () => byTitle('Terminal'), app: 'terminal' },
    { title: 'Browser', text: 'Public research. Newspapers, archives and web sources become available when the story leaves the police database.', side: 'top', find: () => byTitle('Browser'), app: 'browser' },
    { title: 'Final Deduction', text: 'The official conclusion. This is where you submit who, what, when, where, why, how and the evidence supporting your theory.', side: 'top', find: () => byTitle('Final Deduction'), app: 'final-deduction' },
    { title: 'Settings', text: 'Appearance, sound and accessibility. These options change the workstation, not the case.', side: 'top', find: () => byTitle('Settings'), app: 'settings' },
  ], []);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[index];
  const refresh = () => { const el = step.find(); setRect(el?.getBoundingClientRect() || null); };
  useEffect(() => { refresh(); const t = window.setTimeout(refresh, 100); window.addEventListener('resize', refresh); return () => { clearTimeout(t); window.removeEventListener('resize', refresh); }; }, [index]);
  const spotlight = useMemo(() => rect ? { left: rect.left - 8, top: rect.top - 8, width: rect.width + 16, height: rect.height + 16 } : null, [rect]);
  const next = () => { if (index === steps.length - 1) onFinish(); else setIndex((i) => i + 1); };
  const open = () => { if (step.app) openApp(step.app); };

  return <div className="fixed inset-0 z-[11000] pointer-events-none font-sans">
    <div className="absolute inset-0 bg-black/65" />
    {spotlight && <div className="absolute rounded-xl ring-2 ring-blue-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.65),0_0_35px_rgba(59,130,246,0.5)] transition-all duration-200" style={spotlight} />}
    {rect && <div className={`absolute z-20 w-[min(390px,calc(100vw-2rem))] pointer-events-auto transition-all duration-200 ${step.side === 'top' ? 'bottom-[92px]' : 'top-[46px]'} ${rect.left > window.innerWidth / 2 ? 'right-5' : 'left-5'}`}><div className="rounded-2xl bg-slate-950/98 border border-blue-500/60 shadow-2xl overflow-hidden"><div className="h-1 bg-gradient-to-r from-blue-700 via-cyan-300 to-blue-700" /><div className="p-4"><div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-300"><Icon name="MousePointer2" size={18} /></div><div><div className="text-[9px] uppercase tracking-[.18em] text-blue-400">WORKSTATION TUTORIAL · {index + 1}/{steps.length}</div><h2 className="mt-1 text-base font-semibold text-white">{step.title}</h2></div></div><p className="mt-3 text-[11px] leading-5 text-slate-300">{step.text}</p><div className="mt-4 flex items-center justify-between gap-3"><button onClick={onFinish} className="text-[10px] text-slate-500 hover:text-slate-200">Skip tutorial</button><div className="flex gap-2"><button disabled={!step.app} onClick={open} className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-[10px] text-slate-300 hover:text-white disabled:opacity-30">Open tool</button><button onClick={next} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider">{index === steps.length - 1 ? 'Finish' : 'Next'}</button></div></div></div></div></div>}
  </div>;
};
