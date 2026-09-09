import React from 'react';
import { Icon } from '../common/Icon';

interface CaseResolvedEpilogueProps {
  onClose: () => void;
}

export const CaseResolvedEpilogue: React.FC<CaseResolvedEpilogueProps> = ({ onClose }) => (
  <div className="absolute inset-0 z-[11000] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-5">
    <div className="w-[min(760px,calc(100vw-2rem))] max-h-[calc(100vh-2.5rem)] overflow-y-auto bg-slate-950 border border-emerald-700/70 rounded-2xl shadow-2xl">
      <div className="px-6 py-5 border-b border-emerald-900/70 bg-emerald-950/20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400"><Icon name="ShieldCheck" size={24} /></div>
          <div>
            <div className="text-[10px] font-mono tracking-[0.2em] text-emerald-400">NORTHBRIDGE POLICE DEPARTMENT // FINAL DEBRIEF</div>
            <h1 className="mt-1 text-2xl font-semibold text-slate-100">CASE 27 — RESOLVED</h1>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <p className="text-sm leading-7 text-slate-300">The reconstructed record establishes what happened to Anna Claire Bell on September 14, 1998. The disappearance was not voluntary: Detective Daniel Hayes intercepted Anna after she left Bell Electronics and prevented her from delivering evidence of the freight operation to federal authorities.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800"><div className="text-[10px] font-mono text-slate-500 uppercase">Perpetrator</div><div className="mt-1 font-semibold text-slate-100">Detective Daniel Hayes</div><div className="mt-1 text-xs text-slate-400">Badge #3014</div></div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800"><div className="text-[10px] font-mono text-slate-500 uppercase">Interception</div><div className="mt-1 font-semibold text-slate-100">September 14, 1998 // 22:38</div><div className="mt-1 text-xs text-slate-400">42 Willow Street</div></div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800"><div className="text-[10px] font-mono text-slate-500 uppercase">Motive</div><div className="mt-1 font-semibold text-slate-100">Silence the audit exposure</div><div className="mt-1 text-xs text-slate-400">Bell Electronics / Crownline freight theft</div></div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800"><div className="text-[10px] font-mono text-slate-500 uppercase">Cover-up</div><div className="mt-1 font-semibold text-slate-100">Mercer & Vance</div><div className="mt-1 text-xs text-slate-400">Theft and obstruction of justice</div></div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-200"><Icon name="FileCheck2" size={15} className="text-emerald-400" /> Evidence chain accepted</div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 font-mono">
            <span>E-004821 // physical key & tape</span><span>E-004823 // forensic transcript</span><span>E-004829 // duplicate ledgers</span><span>R-1998-112 // altered report</span><span>CASE-1989-114 // IA docket</span>
          </div>
        </div>

        <div className="border-l-2 border-emerald-700 pl-4 text-sm leading-6 text-slate-300">The original case file is no longer treated as an unexplained disappearance. The investigative record has been reconstructed and the matter is referred for state-level prosecution review.</div>

        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-600">CASE-1998-027 // FINAL STATUS: CLOSED</div>
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider">Return to workstation</button>
        </div>
      </div>
    </div>
  </div>
);
