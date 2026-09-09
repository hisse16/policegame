import React from 'react';
import { Icon } from '../../../common/Icon';

interface HelpModalProps { onClose: () => void; }

const Rule = ({ n, icon, title, children }: { n: string; icon: string; title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
    <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-900 flex items-center justify-center text-blue-400 shrink-0"><Icon name={icon} className="w-4 h-4" /></div><div><div className="text-[9px] text-blue-400 font-bold tracking-widest">{n}</div><h3 className="mt-1 text-xs font-bold text-slate-100 uppercase tracking-wide">{title}</h3><div className="mt-2 text-[11px] leading-5 text-slate-400">{children}</div></div></div>
  </div>
);

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => (
  <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-[100] select-none font-mono">
    <div className="bg-slate-950 border border-slate-700 rounded-2xl max-w-3xl w-full shadow-2xl max-h-[88vh] overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400"><Icon name="BookOpen" className="w-5 h-5" /></div><div><div className="text-[9px] tracking-[.18em] text-blue-400">SECURIX // FIELD GUIDE</div><h2 className="text-sm font-bold text-slate-100 uppercase">How to investigate Case 27</h2></div></div><button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"><Icon name="X" className="w-4 h-4" /></button></div>
      <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-3">
        <div className="rounded-xl border border-blue-900/60 bg-blue-950/15 p-4"><div className="text-[9px] text-blue-400 tracking-widest">THE GOLDEN RULE</div><div className="mt-1 text-sm font-semibold text-slate-100">The interface should tell you where evidence lives. Your job is to decide what the evidence means.</div><div className="mt-2 text-[10px] text-slate-500">You are never expected to guess an exact secret phrase just to progress.</div></div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Rule n="01" icon="FolderOpen" title="Start with PRIS">Open the reopened <strong className="text-slate-200">CASE-1998-027</strong>. Read the record instead of clicking randomly through the database.</Rule>
          <Rule n="02" icon="Link" title="Follow connections">Names, IDs, locations, reports and evidence are linked. When a record references another record, open it. That is how the case expands.</Rule>
          <Rule n="03" icon="Search" title="Search when a clue asks for it">Use the global search for a specific name, ID, plate, date or phrase. PRIS also has filters and an advanced search when you need them.</Rule>
          <Rule n="04" icon="GitCompare" title="Compare records">Dates and statements can disagree. A contradiction is often more valuable than a confirmation. Check the source and its timestamp.</Rule>
          <Rule n="05" icon="StickyNote" title="Keep your own theory">Use the Notebook for observations and the Investigation Board for relationships. The game records discoveries; your reasoning is yours.</Rule>
          <Rule n="06" icon="Map" title="Use the right tool">PRIS = official records. Evidence Lab = physical evidence. Browser = public archives. Map = places. Board = connections. Final Deduction = your conclusion.</Rule>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"><div className="text-[9px] text-slate-500 tracking-widest">WHEN YOU ARE STUCK</div><div className="mt-2 grid sm:grid-cols-3 gap-2 text-[10px]"><div className="p-3 rounded-lg bg-slate-950 border border-slate-800"><strong className="text-slate-200">1. Check the case guide</strong><div className="mt-1 text-slate-500">It points toward evidence already relevant to your current act.</div></div><div className="p-3 rounded-lg bg-slate-950 border border-slate-800"><strong className="text-slate-200">2. Review recent records</strong><div className="mt-1 text-slate-500">A newly discovered record often contains the next connection.</div></div><div className="p-3 rounded-lg bg-slate-950 border border-slate-800"><strong className="text-slate-200">3. Re-read contradictions</strong><div className="mt-1 text-slate-500">The answer is usually hidden in what does not line up.</div></div></div></div>
        <div className="rounded-xl border border-amber-900/50 bg-amber-950/10 p-4 text-[10px] text-amber-200/80"><strong className="text-amber-300">Important:</strong> Do not treat every database entry as part of Case 27. The archive is intentionally larger than the mystery. Relevance is something you establish through evidence.</div>
      </div>
      <div className="px-6 py-4 border-t border-slate-800 flex justify-end shrink-0"><button onClick={onClose} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider">Return to investigation</button></div>
    </div>
  </div>
);
