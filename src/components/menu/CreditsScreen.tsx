import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { GAME_CONFIG, CREDITS_DATA } from '../../config/gameConfig';
import { Icon } from '../common/Icon';

export const CreditsScreen: React.FC = () => {
  const { returnToMainMenu } = useGame();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        returnToMainMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [returnToMainMenu]);

  return (
    <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-12 max-w-4xl mx-auto text-slate-200 select-none animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest">
            <Icon name="Users" className="w-3.5 h-3.5" />
            <span>ARCHIVE CREDITS & ATTRIBUTION</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">
            {GAME_CONFIG.title}
          </h1>
          <div className="text-[11px] text-slate-500 font-mono">
            {GAME_CONFIG.subtitle} // {GAME_CONFIG.department}
          </div>
        </div>

        <button
          onClick={returnToMainMenu}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300 hover:text-white text-xs transition-all shadow-md"
        >
          <Icon name="ArrowLeft" className="w-3.5 h-3.5" />
          <span>Back to Menu (Esc)</span>
        </button>
      </div>

      {/* Credits Roll Content */}
      <div className="flex-1 my-8 bg-slate-900/60 border border-slate-800/80 rounded-xl p-8 overflow-y-auto backdrop-blur-xs space-y-8">
        {CREDITS_DATA.map((section, idx) => (
          <div key={idx} className="text-center space-y-2 border-b border-slate-800/40 pb-6 last:border-b-0">
            <div className="text-[11px] font-mono tracking-widest text-blue-400/90 uppercase font-semibold">
              {section.role}
            </div>
            <div className="space-y-1">
              {section.members.map((member, mIdx) => (
                <div key={mIdx} className="text-sm font-medium text-slate-200">
                  {member}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center pt-4 text-[11px] text-slate-500 font-mono space-y-1">
          <div>{GAME_CONFIG.systemName} // {GAME_CONFIG.version}</div>
          <div>All characters, investigations, and entities portrayed in this software are fictional.</div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 text-center text-xs text-slate-500 font-mono">
        PRESS ESCAPE TO RETURN TO MAIN MENU
      </div>
    </div>
  );
};
