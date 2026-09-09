/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { OSProvider, useOS } from './context/OSContext';
import { Desktop } from './components/desktop/Desktop';
import { TopPanel } from './components/desktop/TopPanel';
import { Dock } from './components/desktop/Dock';
import { WindowManager } from './components/desktop/WindowManager';
import { LockScreen } from './components/desktop/LockScreen';
import { AltTabSwitcher } from './components/desktop/AltTabSwitcher';
import { NotificationToasts } from './components/desktop/NotificationToasts';
import { MenuBackground } from './components/menu/MenuBackground';
import { MainMenuScreen } from './components/menu/MainMenuScreen';
import { BootTransitionScreen } from './components/menu/BootTransitionScreen';
import { ShutdownTransitionScreen } from './components/menu/ShutdownTransitionScreen';
import { RestartTransitionScreen } from './components/menu/RestartTransitionScreen';
import { HowToPlayScreen } from './components/menu/HowToPlayScreen';
import { GameSettingsScreen } from './components/menu/GameSettingsScreen';
import { CreditsScreen } from './components/menu/CreditsScreen';
import { InvestigatorOnboarding } from './components/desktop/InvestigatorOnboarding';
import { CaseResolvedEpilogue } from './components/desktop/CaseResolvedEpilogue';
import { storyEngine } from './services/story/storyEngine';
import { DISCOVERY_STEPS } from './services/story/storyData';
import { InvestigationAction, StoryState } from './types/story';
import { Icon } from './components/common/Icon';

const ACT_NAMES: Record<number, string> = {
  1: 'THE ARCHIVE',
  2: 'THE ORIGINAL INVESTIGATION',
  3: 'THE PEOPLE AROUND ANNA',
  4: 'THE MISSING YEARS',
  5: 'THE COVERED RECORD',
  6: 'THE TRUTH'
};

const getStepAct = (stepId: string, fallback: number) => stepId === 'step_39' ? 4 : fallback;

const getActProgress = (state: StoryState) => {
  const actSteps = DISCOVERY_STEPS.filter((step) => getStepAct(step.id, step.act) === state.currentAct);
  const completed = actSteps.filter((step) => state.discoveredStepIds.includes(step.id)).length;
  return { completed, total: actSteps.length };
};

const getFallbackAction = (state: StoryState): InvestigationAction | null => {
  if (state.currentAct !== 4 || state.discoveredStepIds.includes('step_39')) return null;
  const step = DISCOVERY_STEPS.find((candidate) => candidate.id === 'step_39');
  if (!step) return null;
  return {
    stepId: step.id,
    title: step.title,
    description: step.description,
    actionType: step.trigger.type,
    targetId: undefined,
    searchTerm: step.trigger.searchTerm,
    hintLevel: 1,
    hintText: step.hintLevel1,
    isOptional: false
  };
};

const InvestigationGuide: React.FC = () => {
  const { openApp } = useOS();
  const [action, setAction] = useState<InvestigationAction | null>(() => {
    const state = storyEngine.getState();
    return storyEngine.getNextInvestigationAction() || getFallbackAction(state);
  });
  const [collapsed, setCollapsed] = useState(false);
  const [completionFlash, setCompletionFlash] = useState<{ title: string; message: string } | null>(null);
  const previousStateRef = useRef<StoryState | null>(null);

  useEffect(() => storyEngine.subscribe((nextState) => {
    const previous = previousStateRef.current;
    setAction(storyEngine.getNextInvestigationAction() || getFallbackAction(nextState));

    if (previous) {
      const completedIds = nextState.discoveredStepIds.filter((id) => !previous.discoveredStepIds.includes(id));
      if (completedIds.length > 0) {
        const completedStep = DISCOVERY_STEPS.find((step) => step.id === completedIds[completedIds.length - 1]);
        if (completedStep) {
          const completedAct = getStepAct(completedStep.id, completedStep.act);
          const progressState = previous.currentAct === completedAct ? nextState : previous;
          const { completed: completedCount, total } = getActProgress(progressState);
          const actComplete = previous.currentAct !== nextState.currentAct;
          setCompletionFlash({
            title: actComplete ? `ACT ${completedAct} COMPLETE` : 'INVESTIGATION TASK COMPLETE',
            message: actComplete
              ? `${ACT_NAMES[completedAct]} // ${completedCount}/${total} tasks completed. A new investigative thread is now open.`
              : `${completedStep.title} // ${completedCount}/${total} tasks completed in this act.`
          });
          window.setTimeout(() => setCompletionFlash(null), 4200);
        }
      }
    }
    previousStateRef.current = nextState;
  }), []);

  const state = storyEngine.getState();
  const act = storyEngine.getCurrentAct();
  const progress = getActProgress(state);
  const progressPercent = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  const openLead = () => {
    if (!action) return;
    if (action.actionType === 'view_record') { openApp('police-records'); return; }
    if (action.actionType === 'view_file' && action.targetId) { openApp('file-manager', { path: action.targetId }); return; }
    if (action.actionType === 'view_webpage' && action.targetId) { openApp('browser', { initialUrl: action.targetId }); return; }
    if (action.actionType === 'search_term') { openApp('police-records'); return; }
    openApp('investigation-notebook');
  };

  const guidanceText = action?.hintText || action?.description || 'No further lead is currently available.';
  const label = action?.actionType === 'search_term' ? 'Search the records' : action?.actionType === 'view_file' ? 'Check the file system' : action?.actionType === 'view_webpage' ? 'Open the archive' : 'Review the records';

  return (
    <>
      {completionFlash && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[9000] w-[min(520px,calc(100vw-2rem))]">
          <div className="bg-slate-950/98 border border-emerald-500/50 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-800 bg-emerald-950/30 flex items-center gap-2">
              <Icon name="CheckCircle2" size={16} className="text-emerald-400" />
              <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-300">{completionFlash.title}</span>
            </div>
            <div className="px-4 py-3 text-sm text-slate-200">{completionFlash.message}</div>
          </div>
        </div>
      )}

      {action && (
        <div className={`absolute left-4 bottom-16 z-[8000] ${collapsed ? 'w-auto' : 'w-[340px] max-w-[calc(100vw-2rem)]'}`}>
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} className="bg-slate-900/95 border border-slate-700 rounded-lg px-3 py-2 shadow-2xl text-xs text-slate-200 flex items-center gap-2">
              <Icon name="Compass" size={14} className="text-blue-400" /> {act.title} • {progress.completed}/{progress.total}
            </button>
          ) : (
            <div className="bg-slate-950/95 backdrop-blur border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
              <div className="px-3 py-2 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-slate-300"><Icon name="Compass" size={13} className="text-blue-400" /> {act.title} // {act.subtitle}</div>
                  <button onClick={() => setCollapsed(true)} className="text-slate-500 hover:text-slate-200">—</button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} /></div>
                  <span className="text-[10px] font-bold text-slate-400 tabular-nums">{progress.completed}/{progress.total}</span>
                </div>
                <div className="mt-1 text-[9px] text-slate-500 uppercase tracking-wider">Investigation progress</div>
              </div>
              <div className="p-3 space-y-2.5">
                <div className="text-sm font-semibold text-slate-100">{label}</div>
                <p className="text-[11px] leading-relaxed text-slate-400">{guidanceText}</p>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">Follow the evidence. The lead points toward a line of inquiry, not the conclusion.</div>
                <div className="flex gap-2 pt-1">
                  <button onClick={openLead} className="flex-1 px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold">Open lead</button>
                  <button onClick={() => openApp('investigation-notebook')} className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[11px]">Notebook</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const WorkstationOS: React.FC = () => {
  const { powerState, openApp } = useOS();
  const { gameSettings } = useGame();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showEpilogue, setShowEpilogue] = useState(false);

  useEffect(() => {
    const hasBooted = sessionStorage.getItem('securix_initial_boot');
    if (!hasBooted && powerState === 'running') {
      sessionStorage.setItem('securix_initial_boot', 'true');
      openApp('text-editor', { path: '/home/investigator/Desktop/readme.txt' });
      const alreadySeen = sessionStorage.getItem('investigator_onboarding_seen');
      if (!alreadySeen) window.setTimeout(() => setShowOnboarding(true), 650);
    }
  }, [powerState, openApp]);

  useEffect(() => storyEngine.subscribe((state) => {
    if (state.caseResolved && !sessionStorage.getItem('case_27_epilogue_seen')) setShowEpilogue(true);
  }), []);

  if (powerState === 'locked' || powerState === 'logging_out') return <LockScreen />;
  return (
    <div className={`relative w-screen h-screen overflow-hidden select-none bg-slate-950 font-sans text-slate-100 ${gameSettings.highContrast ? 'contrast-125' : ''}`} style={{ transform: gameSettings.uiScale !== 1 ? `scale(${gameSettings.uiScale})` : undefined, transformOrigin: 'top left', width: gameSettings.uiScale !== 1 ? `${100 / gameSettings.uiScale}vw` : '100vw', height: gameSettings.uiScale !== 1 ? `${100 / gameSettings.uiScale}vh` : '100vh' }}>
      <TopPanel /><Desktop><WindowManager /></Desktop><Dock /><AltTabSwitcher /><NotificationToasts /><InvestigationGuide />
      {showOnboarding && <InvestigatorOnboarding onComplete={() => setShowOnboarding(false)} />}
      {showEpilogue && <CaseResolvedEpilogue onClose={() => { sessionStorage.setItem('case_27_epilogue_seen', 'true'); setShowEpilogue(false); }} />}
      {gameSettings.crtScanlines && <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-9999" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)', backgroundSize: '100% 3px' }} />}
    </div>
  );
};

const GameShell: React.FC = () => {
  const { gameState, onComputerShutdown, onComputerRestart } = useGame();
  switch (gameState) {
    case 'MAIN_MENU': return <div className="relative w-screen h-screen overflow-hidden bg-slate-950"><MenuBackground /><MainMenuScreen /></div>;
    case 'HOW_TO_PLAY': return <div className="relative w-screen h-screen overflow-hidden bg-slate-950"><MenuBackground /><HowToPlayScreen /></div>;
    case 'SETTINGS': return <div className="relative w-screen h-screen overflow-hidden bg-slate-950"><MenuBackground /><GameSettingsScreen /></div>;
    case 'CREDITS': return <div className="relative w-screen h-screen overflow-hidden bg-slate-950"><MenuBackground /><CreditsScreen /></div>;
    case 'BOOTING': return <BootTransitionScreen />;
    case 'COMPUTER_SHUTTING_DOWN': return <ShutdownTransitionScreen />;
    case 'COMPUTER_RESTARTING': return <RestartTransitionScreen />;
    case 'COMPUTER_RUNNING': return <OSProvider onShutdown={onComputerShutdown} onRestart={onComputerRestart}><WorkstationOS /></OSProvider>;
    default: return null;
  }
};

export default function App() { return <GameProvider><GameShell /></GameProvider>; }
