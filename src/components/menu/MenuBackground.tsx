import React from 'react';
import { useGame } from '../../context/GameContext';
import { GAME_CONFIG } from '../../config/gameConfig';

export const MenuBackground: React.FC = () => {
  const { gameSettings } = useGame();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-slate-950">
      {/* 1. Deep charcoal vignette background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.6)_0%,rgba(2,6,23,0.95)_85%)]" />

      {/* 2. Delicate investigation grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="menu-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#menu-grid)" />
      </svg>

      {/* 3. Archival dossier watermark stamp (faint, serious, restrained) */}
      <div className="absolute right-8 bottom-8 md:right-16 md:bottom-16 opacity-[0.04] text-slate-400 font-mono flex flex-col items-end tracking-widest text-xs uppercase leading-loose border-r-2 border-slate-600 pr-4">
        <div>{GAME_CONFIG.department}</div>
        <div>RECORD ID: {GAME_CONFIG.caseNumber}</div>
        <div>STATUS: EVIDENCE ARCHIVE LOCKED</div>
        <div>SECURIX WORKSTATION 07 // RESTRICTED</div>
      </div>

      <div className="absolute left-8 top-8 opacity-[0.03] text-slate-400 font-mono text-[10px] tracking-widest uppercase">
        <div>SEC-DIV // CLASSIFIED EVIDENCE RECORD</div>
        <div>NODE: 192.168.4.12 // LOCALHOST ONLY</div>
      </div>

      {/* 4. Subtle CRT scanlines (configurable) */}
      {gameSettings.crtScanlines && (
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)',
            backgroundSize: '100% 3px'
          }}
        />
      )}

      {/* 5. Extremely subtle screen edge glow */}
      {gameSettings.subtleGlow && (
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(30,41,59,0.4)]" />
      )}
    </div>
  );
};
