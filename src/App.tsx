/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
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

const WorkstationOS: React.FC = () => {
  const { powerState, openApp } = useOS();
  const { gameSettings } = useGame();

  // On first load, automatically open the welcome text note and terminal or file manager if clean
  useEffect(() => {
    // Only open if running and no windows are active
    const hasBooted = sessionStorage.getItem('securix_initial_boot');
    if (!hasBooted && powerState === 'running') {
      sessionStorage.setItem('securix_initial_boot', 'true');
      openApp('text-editor', { path: '/home/investigator/Desktop/readme.txt' });
    }
  }, [powerState, openApp]);

  if (powerState === 'locked' || powerState === 'logging_out') {
    return <LockScreen />;
  }

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden select-none bg-slate-950 font-sans text-slate-100 ${
        gameSettings.highContrast ? 'contrast-125' : ''
      }`}
      style={{
        transform: gameSettings.uiScale !== 1 ? `scale(${gameSettings.uiScale})` : undefined,
        transformOrigin: 'top left',
        width: gameSettings.uiScale !== 1 ? `${100 / gameSettings.uiScale}vw` : '100vw',
        height: gameSettings.uiScale !== 1 ? `${100 / gameSettings.uiScale}vh` : '100vh'
      }}
    >
      {/* Top Panel (Panel Bar, Clock, Indicators, Menus) */}
      <TopPanel />

      {/* Desktop Canvas (Icons, Wallpaper, Marquee, Drag-Drop) */}
      <Desktop>
        {/* Active Windows Layer */}
        <WindowManager />
      </Desktop>

      {/* Bottom Taskbar / App Dock */}
      <Dock />

      {/* Alt+Tab Task Switcher Overlay */}
      <AltTabSwitcher />

      {/* Toast Notifications */}
      <NotificationToasts />

      {/* CRT Scanline Filter overlay if enabled */}
      {gameSettings.crtScanlines && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05] z-9999"
          style={{
            backgroundImage:
              'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)',
            backgroundSize: '100% 3px'
          }}
        />
      )}
    </div>
  );
};

const GameShell: React.FC = () => {
  const { gameState, onComputerShutdown, onComputerRestart } = useGame();

  switch (gameState) {
    case 'MAIN_MENU':
      return (
        <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
          <MenuBackground />
          <MainMenuScreen />
        </div>
      );

    case 'HOW_TO_PLAY':
      return (
        <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
          <MenuBackground />
          <HowToPlayScreen />
        </div>
      );

    case 'SETTINGS':
      return (
        <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
          <MenuBackground />
          <GameSettingsScreen />
        </div>
      );

    case 'CREDITS':
      return (
        <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
          <MenuBackground />
          <CreditsScreen />
        </div>
      );

    case 'BOOTING':
      return <BootTransitionScreen />;

    case 'COMPUTER_SHUTTING_DOWN':
      return <ShutdownTransitionScreen />;

    case 'COMPUTER_RESTARTING':
      return <RestartTransitionScreen />;

    case 'COMPUTER_RUNNING':
      return (
        <OSProvider onShutdown={onComputerShutdown} onRestart={onComputerRestart}>
          <WorkstationOS />
        </OSProvider>
      );

    default:
      return null;
  }
};

export default function App() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}
