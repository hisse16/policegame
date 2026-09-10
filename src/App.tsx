/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { OSProvider, useOS } from './context/OSContext';
import { Desktop } from './components/desktop/Desktop';
import { TopPanel } from './components/desktop/TopPanel';
import { Dock } from './components/desktop/Dock';
import { WindowManager } from './components/desktop/WindowManager';
import { LockScreen } from './components/desktop/LockScreen';
import { AltTabSwitcher } from './components/desktop/AltTabSwitcher';
import { NotificationToasts } from './components/desktop/NotificationToasts';
import { MainMenuScreen } from './components/menu/MainMenuScreen';
import { InvestigatorOnboarding } from './components/desktop/InvestigatorOnboarding';
import { WorkstationTutorial } from './components/desktop/WorkstationTutorial';
import { CaseResolvedEpilogue } from './components/desktop/CaseResolvedEpilogue';
import { storyEngine } from './services/story/storyEngine';
import { playSound } from './services/soundService';

const WorkstationOS: React.FC = () => {
  const { powerState, openApp } = useOS();
  const { gameSettings } = useGame();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showEpilogue, setShowEpilogue] = useState(false);

  useEffect(() => {
    if (powerState !== 'running') return;
    let onboardingTimer: number | undefined;
    let tutorialTimer: number | undefined;

    try {
      if (
        localStorage.getItem('investigator_os_story_state_v1') &&
        !localStorage.getItem('investigator_os_story_migrated_v2')
      ) {
        storyEngine.resetState();
        localStorage.removeItem('investigator_os_story_state_v1');
        localStorage.setItem('investigator_os_story_migrated_v2', 'true');
      }
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }

    if (!sessionStorage.getItem('investigator_onboarding_seen')) {
      onboardingTimer = window.setTimeout(() => setShowOnboarding(true), 500);
    } else if (!sessionStorage.getItem('investigator_workstation_tutorial_v3')) {
      tutorialTimer = window.setTimeout(() => setShowTutorial(true), 450);
    }

    return () => {
      if (onboardingTimer) window.clearTimeout(onboardingTimer);
      if (tutorialTimer) window.clearTimeout(tutorialTimer);
    };
  }, [powerState]);

  useEffect(() => {
    return storyEngine.subscribe((nextState) => {
      if (nextState.caseResolved && !sessionStorage.getItem('case_27_epilogue_seen')) {
        const timer = window.setTimeout(() => {
          if (!sessionStorage.getItem('case_27_epilogue_seen')) {
            playSound('success');
            setShowEpilogue(true);
          }
        }, 2200);
        return () => window.clearTimeout(timer);
      }
      return undefined;
    });
  }, []);

  const finishOnboarding = () => {
    setShowOnboarding(false);
    window.setTimeout(() => setShowTutorial(true), 350);
  };

  const finishTutorial = () => {
    try { sessionStorage.setItem('investigator_workstation_tutorial_v3', 'true'); } catch {}
    setShowTutorial(false);
  };

  if (powerState === 'locked' || powerState === 'logging_out') return <LockScreen />;

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden select-none bg-slate-950 font-sans text-slate-100 ${gameSettings.highContrast ? 'contrast-125' : ''}`}
      style={{
        transform: gameSettings.uiScale !== 1 ? `scale(${gameSettings.uiScale})` : undefined,
        transformOrigin: 'top left',
        width: gameSettings.uiScale !== 1 ? `${100 / gameSettings.uiScale}vw` : '100vw',
        height: gameSettings.uiScale !== 1 ? `${100 / gameSettings.uiScale}vh` : '100vh'
      }}
    >
      <TopPanel />
      <Desktop><WindowManager /></Desktop>
      <Dock />
      <AltTabSwitcher />
      <NotificationToasts />

      {showOnboarding && (
        <InvestigatorOnboarding
          onComplete={finishOnboarding}
          onOpenPRIS={() => { playSound('click'); openApp('police-records'); }}
        />
      )}
      {!showOnboarding && showTutorial && <WorkstationTutorial onFinish={finishTutorial} />}
      {showEpilogue && <CaseResolvedEpilogue onClose={() => { sessionStorage.setItem('case_27_epilogue_seen', 'true'); setShowEpilogue(false); }} />}

      {gameSettings.crtScanlines && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05] z-[9999]"
          style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)', backgroundSize: '100% 3px' }}
        />
      )}
    </div>
  );
};

const GameShell: React.FC = () => {
  const { powerState } = useOS();
  return powerState === 'off' ? <MainMenuScreen /> : <WorkstationOS />;
};

export const App: React.FC = () => (
  <GameProvider>
    <OSProvider>
      <GameShell />
    </OSProvider>
  </GameProvider>
);
