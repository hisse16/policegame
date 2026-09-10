import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { storyEngine } from '../../services/story/storyEngine';

interface InvestigationStatusWidgetProps {
  onOpenNotebook: () => void;
  onOpenDeduction?: () => void;
}

/**
 * Player-facing investigation guidance.
 *
 * This is deliberately NOT a task/objective list. It only exposes things the
 * investigator has already discovered and the questions that remain open.
 * The story engine may use hidden progression rules, but those rules are never
 * presented as a checklist to the player.
 */
export const InvestigationStatusWidget: React.FC<InvestigationStatusWidgetProps> = ({
  onOpenNotebook,
  onOpenDeduction
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [act, setAct] = useState(storyEngine.getCurrentAct());
  const [status, setStatus] = useState(storyEngine.getInvestigationStatus());
  const [contradictions, setContradictions] = useState(storyEngine.getDiscoveredContradictions());

  useEffect(() => {
    const update = () => {
      setAct(storyEngine.getCurrentAct());
      setStatus(storyEngine.getInvestigationStatus());
      setContradictions(storyEngine.getDiscoveredContradictions());
    };
    const unsubscribe = storyEngine.subscribe(update);
    return () => unsubscribe();
  }, []);

  return (
    <div className="relative z-30 font-sans">
      <button
        onClick={() => setIsExpanded((value) => !value)}
        className="flex items-center gap-2 px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 rounded shadow text-xs text-slate-200 transition-colors"
        title="View discoveries"
      >
        <Icon name="Compass" size={13} className="text-blue-400" />
        <span className="font-mono text-[11px] font-bold text-blue-300 uppercase">
          {act.title}: {act.subtitle}
        </span>
        <span className="text-[9px] text-slate-500">
          {status.recentDiscoveriesCount} discoveries
        </span>
        <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={12} className="text-slate-400" />
      </button>

      {isExpanded && (
        <div className="absolute top-full mt-2 left-0 w-80 sm:w-96 bg-slate-950 border border-slate-700/90 rounded-lg shadow-2xl p-4 text-xs space-y-3 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-200 uppercase tracking-wide">
                <Icon name="Compass" size={14} className="text-blue-400" />
                <span>CASE 27 · DISCOVERIES</span>
              </div>
              <div className="text-[9px] text-slate-600 mt-1">
                Your investigation record — not a list of tasks.
              </div>
            </div>
            <button onClick={() => setIsExpanded(false)} className="text-slate-500 hover:text-slate-300 text-xs">✕</button>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1">
              <Icon name="Search" size={12} />
              <span>Discoveries</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/60 max-h-36 overflow-y-auto">
              {status.whatWeKnow.map((item, idx) => (
                <div key={`${item}-${idx}`} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-mono">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {contradictions.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-orange-400 uppercase flex items-center gap-1">
                <Icon name="AlertTriangle" size={12} />
                <span>Conflicts Found</span>
              </div>
              <div className="space-y-1 text-[10px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/60 max-h-28 overflow-y-auto">
                {contradictions.slice(-4).map((item) => (
                  <div key={item.id}>
                    <div className="text-orange-300 font-semibold">{item.title}</div>
                    <div className="text-slate-500 mt-0.5">Compare the sources before deciding what happened.</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-[11px] font-bold text-amber-400 uppercase flex items-center gap-1">
              <Icon name="HelpCircle" size={12} />
              <span>Questions You Have Not Answered</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/60 max-h-28 overflow-y-auto">
              {status.unresolvedQuestions.map((question, idx) => (
                <div key={`${question}-${idx}`} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-mono">?</span>
                  <span>{question}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="text-[9px] text-slate-600 leading-relaxed mb-2">
              There is no required route. Follow whatever detail, contradiction, or connection seems important to you.
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setIsExpanded(false); onOpenNotebook(); }}
                className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Icon name="BookOpen" size={13} />
                <span>Open Notebook</span>
              </button>
              {onOpenDeduction && (
                <button
                  onClick={() => { setIsExpanded(false); onOpenDeduction(); }}
                  className="py-1.5 px-3 bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 rounded text-[11px] font-bold transition-colors"
                >
                  Determination
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
