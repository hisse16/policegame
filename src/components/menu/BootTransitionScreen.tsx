import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { GAME_CONFIG } from '../../config/gameConfig';
import { Icon } from '../common/Icon';

export const BootTransitionScreen: React.FC = () => {
  const { bootProgress, bootLogs, skipBoot, bootType } = useGame();

  // Keyboard shortcut: Space or Enter to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        skipBoot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skipBoot]);

  return (
    <div
      onClick={skipBoot}
      className="fixed inset-0 z-50 bg-black text-slate-300 font-mono text-xs p-8 md:p-14 flex flex-col justify-between select-none cursor-pointer"
      title="Click or press Space to skip"
    >
      {/* Top Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <span className="font-bold text-slate-200 tracking-wider text-sm">
              {GAME_CONFIG.systemName}
            </span>
            <span className="text-slate-500 text-xs font-normal">
              [{bootType === 'restart' ? 'SYSTEM RESTART' : 'COLD BOOT'}]
            </span>
          </div>
          <div className="text-[11px] text-slate-500 hidden sm:block">
            KERNEL 6.8.0-31-GENERIC // SEC-X86_64
          </div>
        </div>

        {/* Boot Console Output */}
        <div className="space-y-1.5 max-h-[55vh] overflow-hidden">
          {bootLogs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-slate-600 select-none">
                [ {((idx + 1) * 0.42).toFixed(4)} ]
              </span>
              <span
                className={
                  idx === bootLogs.length - 1
                    ? 'text-blue-400 font-semibold'
                    : 'text-slate-400'
                }
              >
                {log}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-slate-500 pt-1">
            <span className="inline-block w-2 h-3.5 bg-blue-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar & Skip Hint */}
      <div className="space-y-3 pt-6 border-t border-slate-900">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Icon name="HardDrive" className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>MOUNTING NVME0N1P2 (EXT4-ENCRYPTED)...</span>
          </div>
          <span className="font-bold text-slate-200">{bootProgress}%</span>
        </div>

        {/* Bar */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${bootProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1">
          <span>PRESS [SPACE] OR CLICK TO SKIP</span>
          <span>{GAME_CONFIG.caseNumber}</span>
        </div>
      </div>
    </div>
  );
};
