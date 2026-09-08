import React from 'react';
import { useOS } from '../../context/OSContext';
import { Icon } from '../common/Icon';

export const AltTabSwitcher: React.FC = () => {
  const { windows, altTabOpen, altTabSelectedIndex } = useOS();

  if (!altTabOpen) return null;

  const validWindows = windows.filter((w) => !w.isMinimized);
  if (validWindows.length === 0) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-xs select-none pointer-events-none">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl p-4 flex items-center gap-3">
        {validWindows.map((win, idx) => {
          const isSelected = idx === altTabSelectedIndex;
          return (
            <div
              key={win.id}
              className={`flex flex-col items-center justify-center w-24 h-24 p-2 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-500/50 scale-105'
                  : 'bg-slate-800/60 border-slate-700/50 opacity-70'
              }`}
            >
              <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center mb-2 text-blue-400">
                <Icon name={win.icon} className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-200 text-center truncate w-full">
                {win.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
