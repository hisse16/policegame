import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { storyEngine } from '../../services/story/storyEngine';

interface InvestigationStatusWidgetProps {
  onOpenNotebook: () => void;
  onOpenDeduction?: () => void;
}

export const InvestigationStatusWidget: React.FC<InvestigationStatusWidgetProps> = ({
  onOpenNotebook,
  onOpenDeduction
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [act, setAct] = useState(storyEngine.getCurrentAct());
  const [status, setStatus] = useState(storyEngine.getInvestigationStatus());

  useEffect(() => {
    const update = () => {
      setAct(storyEngine.getCurrentAct());
      setStatus(storyEngine.getInvestigationStatus());
    };
    const unsubscribe = storyEngine.subscribe(update);
    return () => unsubscribe();
  }, []);

  return (
    <div className="relative z-30 font-sans">
      {/* Compact Status Pill */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 rounded shadow text-xs text-slate-200 transition-colors"
        title="Click to view Current Investigation Status"
      >
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="font-mono text-[11px] font-bold text-blue-300 uppercase">
          {act.title}: {act.subtitle}
        </span>
        <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={12} className="text-slate-400" />
      </button>

      {/* Expanded Quick Status Flyout */}
      {isExpanded && (
        <div className="absolute top-full mt-2 left-0 w-80 sm:w-96 bg-slate-950 border border-slate-700/90 rounded-lg shadow-2xl p-4 text-xs space-y-3 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 font-bold text-slate-200 uppercase tracking-wide">
              <Icon name="Compass" size={14} className="text-blue-400" />
              <span>CASE-1998-027 STATUS</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1">
              <Icon name="CheckCircle2" size={12} />
              <span>What Has Been Established:</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300 font-sans leading-relaxed bg-slate-900/60 p-2 rounded border border-slate-800/60 max-h-24 overflow-y-auto">
              {status.whatWeKnow.map((item, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-mono">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-bold text-amber-400 uppercase flex items-center gap-1">
              <Icon name="HelpCircle" size={12} />
              <span>Unresolved Questions:</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300 font-sans leading-relaxed bg-slate-900/60 p-2 rounded border border-slate-800/60 max-h-24 overflow-y-auto">
              {status.unresolvedQuestions.map((q, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-mono">?</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setIsExpanded(false);
                onOpenNotebook();
              }}
              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Icon name="BookOpen" size={13} />
              <span>Open Notebook</span>
            </button>
            {onOpenDeduction && (
              <button
                onClick={() => {
                  setIsExpanded(false);
                  onOpenDeduction();
                }}
                className="py-1.5 px-3 bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 rounded text-[11px] font-bold transition-colors"
              >
                Determination
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
