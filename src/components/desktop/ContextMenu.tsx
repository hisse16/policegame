import React, { useEffect, useRef } from 'react';
import { Icon } from '../common/Icon';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Adjust position to stay within viewport
  const menuWidth = 210;
  const menuHeight = items.length * 28 + 20;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 10);
  const adjustedY = Math.min(y, window.innerHeight - menuHeight - 10);

  return (
    <div
      ref={menuRef}
      id="os-context-menu"
      className="fixed z-9999 bg-slate-900/95 border border-slate-700/80 backdrop-blur-md rounded-md shadow-2xl py-1 text-xs text-slate-200 min-w-[200px] select-none animate-in fade-in zoom-in-95 duration-100"
      style={{ left: Math.max(10, adjustedX), top: Math.max(10, adjustedY) }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, idx) => {
        if (item.divider) {
          return <div key={`div_${idx}`} className="my-1 border-t border-slate-700/60" />;
        }

        return (
          <button
            key={item.id}
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return;
              item.onClick?.();
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors cursor-default ${
              item.disabled
                ? 'opacity-40 cursor-not-allowed'
                : item.danger
                ? 'hover:bg-red-500/20 hover:text-red-300 text-red-400'
                : 'hover:bg-blue-600 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {item.icon && <Icon name={item.icon} className="w-3.5 h-3.5 shrink-0 opacity-80" />}
              <span className="truncate">{item.label}</span>
            </div>
            {item.shortcut && (
              <span className="text-[10px] text-slate-400 opacity-70 ml-3 shrink-0">
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
