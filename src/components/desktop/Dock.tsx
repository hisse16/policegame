import React from 'react';
import { useOS } from '../../context/OSContext';
import { APP_REGISTRY } from '../../config/apps';
import { Icon } from '../common/Icon';

const PINNED_APPS = ['police-records', 'file-manager', 'terminal', 'browser', 'text-editor', 'system-monitor', 'settings'];

export const Dock: React.FC = () => {
  const { windows, activeWindowId, openApp, focusWindow, minimizeWindow } = useOS();

  // Compute list of dock items: pinned apps + any other open app that isn't pinned
  const openAppIds = Array.from(new Set<string>(windows.map((w) => w.appId)));
  const dockAppIds: string[] = Array.from(new Set<string>([...PINNED_APPS, ...openAppIds]));

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 select-none">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/85 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-2xl">
        {dockAppIds.map((appId) => {
          const appDef = APP_REGISTRY[appId];
          if (!appDef) return null;

          // Find open windows for this app
          const appWindows = windows.filter((w) => w.appId === appId);
          const isOpen = appWindows.length > 0;
          const isActive = appWindows.some((w) => w.id === activeWindowId && !w.isMinimized);

          const handleClick = () => {
            if (!isOpen) {
              openApp(appId);
              return;
            }

            // If it's already active, minimize it
            const activeWin = appWindows.find((w) => w.id === activeWindowId && !w.isMinimized);
            if (activeWin) {
              minimizeWindow(activeWin.id);
            } else {
              // Focus the first minimized or background window
              const target = appWindows[0];
              focusWindow(target.id);
            }
          };

          return (
            <button
              key={appId}
              onClick={handleClick}
              title={`${appDef.name}${isOpen ? ` (${appWindows.length} open)` : ''}`}
              className={`relative group flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-slate-800/90 text-blue-400 shadow-inner'
                  : isOpen
                  ? 'bg-slate-900/60 text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
              }`}
            >
              <Icon
                name={appDef.icon}
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-blue-400' : ''
                }`}
              />

              {/* Running indicator dot */}
              {isOpen && (
                <div
                  className={`absolute -bottom-0.5 w-1.5 h-1.5 rounded-full transition-colors ${
                    isActive ? 'bg-blue-400' : 'bg-slate-400'
                  }`}
                />
              )}

              {/* Tooltip */}
              <div className="absolute -top-8 px-2 py-1 bg-slate-900 border border-slate-700 text-slate-200 text-[10px] rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {appDef.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
