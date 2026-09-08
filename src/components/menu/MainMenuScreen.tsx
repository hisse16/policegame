import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { GAME_CONFIG } from '../../config/gameConfig';
import { audioSystem } from '../../services/audioSystem';
import { Icon } from '../common/Icon';

export const MainMenuScreen: React.FC = () => {
  const {
    saveMeta,
    handleStartGameClick,
    continueGame,
    startNewGameConfirmed,
    closeNewGameModal,
    isNewGameModalOpen,
    openSettings,
    openHowToPlay,
    openCredits,
    openExitModal,
    closeExitModal,
    isExitModalOpen
  } = useGame();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const hasSave = Boolean(saveMeta && saveMeta.hasSave);

  // Menu items list
  const menuItems = [
    {
      id: 'start',
      label: 'START GAME',
      action: handleStartGameClick,
      disabled: false,
      hint: hasSave ? 'Begin fresh investigation or choose case' : 'Initialize police workstation'
    },
    {
      id: 'continue',
      label: hasSave ? 'CONTINUE INVESTIGATION' : 'CONTINUE',
      action: continueGame,
      disabled: !hasSave,
      hint: hasSave
        ? `Case 27 • Last recorded: ${new Date(saveMeta?.timestamp || '').toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}`
        : 'NO SAVED INVESTIGATION'
    },
    {
      id: 'how_to_play',
      label: 'HOW TO PLAY',
      action: openHowToPlay,
      disabled: false,
      hint: 'Workstation operational guide & manual'
    },
    {
      id: 'settings',
      label: 'SETTINGS',
      action: openSettings,
      disabled: false,
      hint: 'Display, audio, and shell configuration'
    },
    {
      id: 'credits',
      label: 'CREDITS',
      action: openCredits,
      disabled: false,
      hint: 'Project attributions & acknowledgments'
    },
    {
      id: 'exit',
      label: 'EXIT GAME',
      action: openExitModal,
      disabled: false,
      hint: 'Halt runtime and return to operating system'
    }
  ];

  // Keyboard navigation: Arrow Up / Down, Enter, Escape
  useEffect(() => {
    if (isNewGameModalOpen || isExitModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        audioSystem.playMenuHover();
        setSelectedIndex((prev) => {
          let next = (prev + 1) % menuItems.length;
          if (menuItems[next].disabled) next = (next + 1) % menuItems.length;
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        audioSystem.playMenuHover();
        setSelectedIndex((prev) => {
          let next = (prev - 1 + menuItems.length) % menuItems.length;
          if (menuItems[next].disabled) next = (next - 1 + menuItems.length) % menuItems.length;
          return next;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeItem = menuItems[selectedIndex];
        if (activeItem && !activeItem.disabled) {
          activeItem.action();
        } else {
          audioSystem.playMenuError();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, isNewGameModalOpen, isExitModalOpen, menuItems]);

  return (
    <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 md:p-16 select-none max-w-5xl mx-auto text-slate-200">
      {/* 1. Header & Official Case Docket Banner */}
      <div className="flex items-start justify-between border-b border-slate-800/80 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>{GAME_CONFIG.department}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono tracking-wider">
            SYSTEM: {GAME_CONFIG.systemName} // {GAME_CONFIG.version}
          </div>
        </div>

        <div className="text-right font-mono text-[11px] text-slate-400 space-y-0.5">
          <div className="text-slate-300 font-semibold tracking-wider">{GAME_CONFIG.caseNumber}</div>
          <div className="text-[10px] text-slate-500 uppercase">{GAME_CONFIG.classification}</div>
        </div>
      </div>

      {/* 2. Main Center Hero: Minimalist Title & Menu Options */}
      <div className="flex-1 flex flex-col justify-center items-center my-8 text-center">
        {/* Title & Subtitle */}
        <div className="mb-10 md:mb-14 space-y-2">
          <h1 className="text-4xl md:text-6xl font-black tracking-wider text-slate-100 uppercase font-sans drop-shadow-sm">
            {GAME_CONFIG.title}
          </h1>
          <p className="text-xs md:text-sm tracking-[0.28em] text-blue-400/90 font-mono uppercase font-medium">
            {GAME_CONFIG.subtitle}
          </p>
          <div className="w-12 h-px bg-slate-700 mx-auto mt-4" />
        </div>

        {/* Menu Buttons List */}
        <div className="w-full max-w-md space-y-2">
          {menuItems.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => {
                    if (item.disabled) {
                      audioSystem.playMenuError();
                      return;
                    }
                    setSelectedIndex(idx);
                    item.action();
                  }}
                  onMouseEnter={() => {
                    if (!item.disabled) {
                      audioSystem.playMenuHover();
                      setSelectedIndex(idx);
                    }
                  }}
                  disabled={item.disabled}
                  className={`w-full relative px-6 py-3 rounded-lg text-xs font-semibold tracking-widest uppercase transition-all duration-150 flex items-center justify-between border ${
                    item.disabled
                      ? 'bg-slate-950/40 border-slate-900/60 text-slate-600 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-600/15 border-blue-500/70 text-slate-100 shadow-[0_0_15px_rgba(59,130,246,0.15)] translate-x-1'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 hover:border-slate-700'
                  }`}
                >
                  {/* Left indicator marker */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        item.disabled
                          ? 'bg-slate-800'
                          : isSelected
                          ? 'bg-blue-400 scale-125'
                          : 'bg-transparent group-hover:bg-slate-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {/* Right subtle arrow or status */}
                  <div className="flex items-center gap-2">
                    {item.id === 'continue' && hasSave && (
                      <span className="hidden sm:inline-block text-[10px] font-mono text-emerald-400/90 lowercase tracking-normal">
                        • saved
                      </span>
                    )}
                    {item.disabled && (
                      <span className="text-[10px] font-mono text-slate-600 tracking-normal">
                        none
                      </span>
                    )}
                    {!item.disabled && (
                      <Icon
                        name="ChevronRight"
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected ? 'text-blue-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                        }`}
                      />
                    )}
                  </div>
                </button>

                {/* Scannable subtle description / timestamp hint */}
                {isSelected && (
                  <div className="text-[10px] font-mono text-slate-400/80 mt-1 pl-6 text-left transition-all">
                    {item.hint}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Footer Docket Stamp & Navigation Tips */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-4">
          <span>NAVIGATION: [↑/↓] SELECT</span>
          <span>[ENTER] CONFIRM</span>
        </div>
        <div className="text-right">
          <span>ALL EVIDENCE PRESERVED LOCALLY</span>
        </div>
      </div>

      {/* MODAL: Existing Investigation Conflict Modal */}
      {isNewGameModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl space-y-4 text-xs">
            {!confirmResetOpen ? (
              <>
                <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm">
                  <Icon name="AlertCircle" className="w-4 h-4" />
                  <span>AN EXISTING INVESTIGATION WAS FOUND</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Active forensic records exist for <strong className="text-slate-100">{saveMeta?.caseNumber || GAME_CONFIG.caseNumber}</strong>. You can resume your ongoing investigation or initiate a clean workstation case.
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                  <div>CASE DOCKET: {saveMeta?.caseNumber}</div>
                  <div>LAST ACCESSED: {new Date(saveMeta?.timestamp || '').toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={continueGame}
                    className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="Play" className="w-3.5 h-3.5" />
                    <span>CONTINUE EXISTING CASE</span>
                  </button>
                  <button
                    onClick={() => {
                      audioSystem.playMenuClick();
                      setConfirmResetOpen(true);
                    }}
                    className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-900/50 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="RotateCcw" className="w-3.5 h-3.5" />
                    <span>START NEW INVESTIGATION</span>
                  </button>
                  <button
                    onClick={closeNewGameModal}
                    className="w-full py-2 rounded-lg hover:bg-slate-800 text-slate-400 text-xs transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5 text-rose-400 font-semibold text-sm">
                  <Icon name="Trash2" className="w-4 h-4" />
                  <span>CONFIRM CASE RESET</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-medium">
                  ALL CURRENT INVESTIGATION PROGRESS WILL BE RESET.
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  This action clears all unfiled investigator notes, downloaded files, bookmarks, and case progression, returning the workstation to factory state.
                </p>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setConfirmResetOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => {
                      setConfirmResetOpen(false);
                      startNewGameConfirmed();
                    }}
                    className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
                  >
                    START NEW
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Exit Game Environment Notice */}
      {isExitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl space-y-4 text-xs text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <Icon name="Power" className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 tracking-wide uppercase">
              EXIT GAME RUNTIME
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              THE GAME CAN ONLY BE CLOSED BY CLOSING THE APPLICATION WINDOW OR BROWSER TAB.
            </p>
            <p className="text-[11px] text-slate-500">
              All investigation progress and workstation state are already saved.
            </p>
            <div className="pt-2">
              <button
                onClick={closeExitModal}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
              >
                RETURN TO MENU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
