import React, { useEffect, useState } from 'react';
import { Icon } from '../common/Icon';
import { storyEngine } from '../../services/story/storyEngine';

export const InvestigationCommandStrip: React.FC = () => {
  const [state, setState] = useState(storyEngine.getState());
  const [act, setAct] = useState(storyEngine.getCurrentAct());

  useEffect(() => storyEngine.subscribe((next) => {
    setState(next);
    setAct(storyEngine.getCurrentAct());
  }), []);

  const discovered = state.discoveredFactIds.length;
  const conflicts = state.discoveredContradictionIds.length;
  const questions = state.openQuestionIds.filter((id) => !state.resolvedQuestionIds.includes(id)).length;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none hidden lg:block">
      <div className="flex items-center gap-3 px-4 py-2 rounded-b-xl border-x border-b border-slate-800/90 bg-slate-950/90 shadow-lg backdrop-blur-md text-[9px] uppercase tracking-[.13em] text-slate-500">
        <div className="flex items-center gap-2 text-slate-300">
          <Icon name="Shield" size={12} className="text-blue-400" />
          <span className="font-mono font-bold">CASE 27</span>
          <span className="text-slate-700">/</span>
          <span>REOPENED COLD CASE</span>
        </div>
        <div className="h-3 w-px bg-slate-800" />
        <div className="text-blue-300">{act.title} · {act.subtitle}</div>
        <div className="h-3 w-px bg-slate-800" />
        <div className="flex items-center gap-3">
          <span><b className="text-slate-300">{discovered}</b> evidence links</span>
          <span><b className="text-orange-300">{conflicts}</b> conflicts</span>
          <span><b className="text-amber-300">{questions}</b> open questions</span>
        </div>
      </div>
    </div>
  );
};
