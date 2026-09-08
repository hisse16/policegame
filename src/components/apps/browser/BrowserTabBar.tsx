import React, { useState } from 'react';
import { BrowserTab } from '../../../types/browser';
import { Icon } from '../../common/Icon';

interface BrowserTabBarProps {
  tabs: BrowserTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string, e?: React.MouseEvent) => void;
  onNewTab: () => void;
  onPinTab?: (id: string) => void;
  onMuteTab?: (id: string) => void;
  onDuplicateTab?: (id: string) => void;
  onCloseOtherTabs?: (id: string) => void;
  onCloseTabsToRight?: (id: string) => void;
}

export const BrowserTabBar: React.FC<BrowserTabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onPinTab,
  onMuteTab,
  onDuplicateTab,
  onCloseOtherTabs,
  onCloseTabsToRight
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tabId: string } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, tabId });
  };

  return (
    <div
      className="h-9 px-2 pt-1 flex items-end gap-1 bg-slate-950/80 border-b border-slate-800 select-none overflow-x-auto relative"
      onClick={() => setContextMenu(null)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            onContextMenu={(e) => handleContextMenu(e, tab.id)}
            title={tab.title}
            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-t-lg border-t border-x cursor-pointer transition-all duration-150 text-xs ${
              tab.isPinned ? 'w-10 justify-center px-2' : 'min-w-[120px] max-w-[200px] flex-1'
            } ${
              isActive
                ? 'bg-slate-900 border-slate-700/90 text-slate-100 font-medium shadow-xs z-10'
                : 'bg-slate-950/40 border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
            }`}
          >
            {/* Loading or Favicon */}
            {tab.isLoading ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
            ) : (
              <Icon
                name={tab.icon || 'Globe'}
                className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`}
              />
            )}

            {/* Title (hidden if pinned) */}
            {!tab.isPinned && (
              <span className="truncate flex-1 text-[11px] leading-tight select-none">
                {tab.title}
              </span>
            )}

            {/* Mute indicator if active */}
            {tab.isMuted && (
              <Icon name="VolumeX" className="w-3 h-3 text-slate-400 shrink-0" />
            )}

            {/* Close Tab Button */}
            {!tab.isPinned && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id, e);
                }}
                title="Close Tab (Ctrl+W)"
                className={`p-0.5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-opacity ${
                  isActive ? 'opacity-70' : ''
                }`}
              >
                <Icon name="X" className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}

      {/* New Tab Button */}
      <button
        onClick={onNewTab}
        title="New Tab (Ctrl+T)"
        className="p-1.5 mb-0.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-0.5 shrink-0"
      >
        <Icon name="Plus" className="w-3.5 h-3.5" />
      </button>

      {/* Tab Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 text-xs text-slate-200"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              onDuplicateTab?.(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2"
          >
            <Icon name="Copy" className="w-3.5 h-3.5" />
            <span>Duplicate Tab</span>
          </button>
          <button
            onClick={() => {
              onPinTab?.(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2"
          >
            <Icon name="Pin" className="w-3.5 h-3.5" />
            <span>Toggle Pin Tab</span>
          </button>
          <button
            onClick={() => {
              onMuteTab?.(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2"
          >
            <Icon name="Volume2" className="w-3.5 h-3.5" />
            <span>Toggle Mute Audio</span>
          </button>
          {onCloseOtherTabs && (
            <button
              onClick={() => {
                onCloseOtherTabs(contextMenu.tabId);
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2"
            >
              <Icon name="Layers" className="w-3.5 h-3.5" />
              <span>Close Other Tabs</span>
            </button>
          )}
          {onCloseTabsToRight && (
            <button
              onClick={() => {
                onCloseTabsToRight(contextMenu.tabId);
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2"
            >
              <Icon name="ArrowRight" className="w-3.5 h-3.5" />
              <span>Close Tabs to Right</span>
            </button>
          )}
          <div className="h-px bg-slate-800 my-1" />
          <button
            onClick={(e) => {
              onCloseTab(contextMenu.tabId, e);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-red-600 hover:text-white flex items-center gap-2 text-rose-400"
          >
            <Icon name="X" className="w-3.5 h-3.5" />
            <span>Close Tab</span>
          </button>
        </div>
      )}
    </div>
  );
};
