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
import { MenuBackground } from './components/menu/MenuBackground';
import { MainMenuScreen } from './components/menu/MainMenuScreen';
import { BootTransitionScreen } from './components/menu/BootTransitionScreen';
import { ShutdownTransitionScreen } from './components/menu/ShutdownTransitionScreen';
import { RestartTransitionScreen } from './components/menu/RestartTransitionScreen';
import { HowToPlayScreen } from './components/menu/HowToPlayScreen';
import { GameSettingsScreen } from './components/menu/GameSettingsScreen';
import { CreditsScreen } from './components/menu/CreditsScreen';
import { storyEngine } from './services/story/storyEngine';
import { InvestigationAction } from './types/story';
import { Icon } from './components/common/Icon';

const InvestigationGuide: React.FC = () => {
  const { openApp } = useOS();
  const [action, setAction] = useState<InvestigationAction | null>(() => storyEngine.getNextInvestigationAction());
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => storyEngine.subscribe(() => setAction(storyEngine.getNextInvestigationAction())), []);
  if (!action) return null;

  const openLead = () => {
    if (action.actionType === 'view_record') {
      openApp('police-records');
      return;
    }
    if (action.actionType === 'view_file' && action.targetId) {
      openApp('file-manager', { path: action.targetId });
      return;
    }
    openApp('investigation-notebook');
  };

  const guidanceText = action.hintText || action.description;
  const label = action.actionType === 'search_term' ? 'Search the records' : action.actionType === 'view_file' ? 'Check the file system' : 'Review the records';

  return (
    <div className={`absolute left-4 bottom-16 z-[8000] ${collapsed ? 'w-auto' : 'w-[340px] max-w-[calc(100vw-2rem)]'}`}>
      {collapsed ? (
        <button onClick={() => setCollapsed(false)} className="bg-slate-900/95 border border-slate-700 rounded-lg px-3 py-2 shadow-2xl text-xs text-slate-200 flex items-center gap-2"><Icon name="Compass" size={14} className="text-blue-400" /> Investigation lead</button>
      ) : (
        <div className="bg-slate-950/95 backdrop-blur border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-slate-300"><Icon name="Compass" size={13} className="text-blue-400" /> Current investigative lead</div>
            <button onClick={() => setCollapsed(true)} className="text-slate-500 hover:text-slate-200">—</button>
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
  );
};

const WorkstationOS: React.FC = () => {
  const { powerState, openApp } = useOS();
  const { gameSettings } = useGame();
  useEffect(() => {
    const hasBooted = sessionStorage.getItem('securix_initial_boot');
    if (!hasBooted && powerState === 'running') {
      sessionStorage.setItem('securix_initial_boot', 'true');
      openApp('text-editor', { path: '/home/investigator/Desktop/readme.txt' });
    }
  }, [powerState, openApp]);
  if (powerState === 'locked' || powerState === 'logging_out') return <LockScreen />;
  return (
    <div className={`relative w-screen h-screen overflow-hidden select-none bg-slate-950 font-sans text-slate-100 ${gameSettings.highContrast ? 'contrast-125' : ''}`} style={{ transform: gameSettings.uiScale !== 1 ? `scale(${gameSettings.uiScale})` : undefined, transformOrigin: 'top left', width: gameSettings.uiScale !== 1 ? `${100 / gameSettings.uiScale}vw` : '100vw', height: gameSettings.uiScale !== 1 ? `${100 / gameSettings.uiScale}vh` : '100vh' }}>
      <TopPanel /><Desktop><WindowManager /></Desktop><Dock /><AltTabSwitcher /><NotificationToasts /><InvestigationGuide />
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
