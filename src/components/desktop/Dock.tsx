import React, { useEffect, useState } from 'react';
import { useOS } from '../../context/OSContext';
import { APP_REGISTRY } from '../../config/apps';
import { storyEngine } from '../../services/story/storyEngine';
import { Icon } from '../common/Icon';

const ACT_UNLOCKS: Record<number, string[]> = {
  1: ['police-records', 'file-manager', 'investigation-notebook', 'settings'],
  2: ['evidence-lab', 'terminal'],
  3: ['investigation-board'],
  4: ['browser'],
  5: ['police-mail'],
  6: ['final-deduction']
};

const PINNED_APPS = [
  'police-records',
  'evidence-lab',
  'investigation-board',
  'investigation-notebook',
  'police-mail',
  'file-manager',
  'terminal',
  'browser',
  'final-deduction',
  'settings'
];

export const Dock: React.FC = () => {
  const { windows, activeWindowId, openApp, focusWindow, minimizeWindow } = useOS();
  const [storyState, setStoryState] = useState(() => storyEngine.getState());

  useEffect(() => storyEngine.subscribe(setStoryState), []);

  const currentAct = storyState.currentAct;
  const unlockedApps = new Set(
    PINNED_APPS.filter((appId) =>
      Object.entries(ACT_UNLOCKS).some(([act, ids]) => Number(act) <= currentAct && ids.includes(appId))
    )
  );

  const openAppIds = Array.from(new Set<string>(windows.map((w) => w.appId)));
  const dockAppIds: string[] = Array.from(new Set([...PINNED_APPS.filter((id) => unlockedApps.has(id)), ...openAppIds]));

  return (
    <div data-os-dock="true" className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 select-none">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/88 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-2xl">
        {dockAppIds.map((appId) => {
          const appDef = APP_REGISTRY[appId];
          if (!appDef) return null;
          const appWindows = windows.filter((w) => w.appId === appId);
          const isOpen = appWindows.length > 0;
          const isActive = appWindows.some((w) => w.id === activeWindowId && !w.isMinimized);
          const handleClick = () => {
            if (!isOpen) { openApp(appId); return; }
            const activeWin = appWindows.find((w) => w.id === activeWindowId && !w.isMinimized);
            if (activeWin) minimizeWindow(activeWin.id); else focusWindow(appWindows[0].id);
          };
          return (
            <button key={appId} onClick={handleClick} title={`${appDef.name}${isOpen ? ` (${appWindows.length} open)` : ''}`} className={`relative group flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-all duration-150 ${isActive ? 'bg-slate-800/90 text-blue-400 shadow-inner' : isOpen ? 'bg-slate-900/60 text-slate-200 hover:bg-slate-800/60' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'}`}>
              <Icon name={appDef.icon} className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : ''}`} />
              {isOpen && <div className={`absolute -bottom-0.5 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-400' : 'bg-slate-400'}`} />}
              <div className="absolute -top-8 px-2 py-1 bg-slate-900 border border-slate-700 text-slate-200 text-[10px] rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">{appDef.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
