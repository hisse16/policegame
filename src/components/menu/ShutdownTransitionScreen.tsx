import React, { useState, useEffect } from 'react';
import { GAME_CONFIG } from '../../config/gameConfig';
import { Icon } from '../common/Icon';

export const ShutdownTransitionScreen: React.FC = () => {
  const [lines, setLines] = useState<string[]>([
    'Sending SIGTERM to active processes...',
    'Closing open investigation windows and applications...'
  ]);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setLines((prev) => [...prev, 'Saving investigation state and bookmarks...']);
    }, 600);

    const t2 = setTimeout(() => {
      setLines((prev) => [...prev, 'Flushing virtual filesystem buffers to disk...']);
    }, 1200);

    const t3 = setTimeout(() => {
      setLines((prev) => [...prev, 'Unmounting virtual volumes. Powering off workstation...']);
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black text-slate-300 font-mono text-xs p-10 flex flex-col items-center justify-center select-none space-y-6">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-rose-500/80 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="Power" className="w-5 h-5 text-rose-400" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-base font-bold text-slate-100 tracking-wider">
          SHUTTING DOWN WORKSTATION
        </h2>
        <div className="text-slate-500 text-xs">{GAME_CONFIG.systemName}</div>
      </div>

      <div className="w-full max-w-md bg-slate-950/80 border border-slate-900 rounded-lg p-4 space-y-1.5 text-[11px] text-slate-400">
        {lines.map((line, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-slate-600">›</span>
            <span>{line}</span>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-slate-600 tracking-widest uppercase">
        RETURNING TO MAIN ARCHIVE MENU...
      </div>
    </div>
  );
};
