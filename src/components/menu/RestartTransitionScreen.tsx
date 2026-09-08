import React from 'react';
import { GAME_CONFIG } from '../../config/gameConfig';
import { Icon } from '../common/Icon';

export const RestartTransitionScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-black text-slate-300 font-mono text-xs p-10 flex flex-col items-center justify-center select-none space-y-6">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-amber-500/80 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="RotateCw" className="w-5 h-5 text-amber-400" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-base font-bold text-slate-100 tracking-wider">
          RESTARTING WORKSTATION
        </h2>
        <div className="text-slate-500 text-xs">{GAME_CONFIG.systemName}</div>
      </div>

      <div className="w-full max-w-md bg-slate-950/80 border border-slate-900 rounded-lg p-4 space-y-1.5 text-[11px] text-slate-400">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-amber-400">›</span>
          <span>Flushing memory buffers to persistent storage...</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-slate-600">›</span>
          <span>Broadcasting reboot signal to kernel subsystems...</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-slate-600">›</span>
          <span>Preparing cold hardware bootloader...</span>
        </div>
      </div>

      <div className="text-[10px] text-amber-400/70 tracking-widest uppercase">
        REBOOTING WORKSTATION OPERATING SYSTEM...
      </div>
    </div>
  );
};
