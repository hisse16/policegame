import React, { useRef, useState, useCallback, useEffect } from 'react';
import { OSWindow } from '../../types/os';
import { useOS } from '../../context/OSContext';
import { Icon } from '../common/Icon';
import { APP_REGISTRY } from '../../config/apps';

interface WindowProps {
  window: OSWindow;
  children: React.ReactNode;
}

export const WindowComponent: React.FC<WindowProps> = ({ window: win, children }) => {
  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    moveWindow,
    resizeWindow
  } = useOS();

  const isActive = activeWindowId === win.id;
  const appDef = APP_REGISTRY[win.appId];
  const minW = appDef?.minWidth || 360;
  const minH = appDef?.minHeight || 260;

  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0, winX: 0, winY: 0 });

  const [isResizing, setIsResizing] = useState(false);
  const resizeDir = useRef<string>('');
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, winX: 0, winY: 0 });

  // Handle Dragging
  const handleTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 || win.isMaximized) return;
    focusWindow(win.id);
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      winX: win.x,
      winY: win.y
    };
    e.preventDefault();
  }, [win.id, win.isMaximized, win.x, win.y, focusWindow]);

  // Handle Resizing
  const handleResizeMouseDown = useCallback((direction: string) => (e: React.MouseEvent) => {
    if (e.button !== 0 || win.isMaximized) return;
    focusWindow(win.id);
    setIsResizing(true);
    resizeDir.current = direction;
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: win.width,
      height: win.height,
      winX: win.x,
      winY: win.y
    };
    e.preventDefault();
    e.stopPropagation();
  }, [win.id, win.isMaximized, win.width, win.height, win.x, win.y, focusWindow]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        const newX = Math.max(0, Math.min(window.innerWidth - 60, dragStartPos.current.winX + dx));
        const newY = Math.max(30, Math.min(window.innerHeight - 60, dragStartPos.current.winY + dy));
        moveWindow(win.id, newX, newY);
      } else if (isResizing) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        const dir = resizeDir.current;

        let newW = resizeStart.current.width;
        let newH = resizeStart.current.height;
        let newX = resizeStart.current.winX;
        let newY = resizeStart.current.winY;

        if (dir.includes('e')) {
          newW = Math.max(minW, resizeStart.current.width + dx);
        }
        if (dir.includes('s')) {
          newH = Math.max(minH, resizeStart.current.height + dy);
        }
        if (dir.includes('w')) {
          const possibleW = resizeStart.current.width - dx;
          if (possibleW >= minW) {
            newW = possibleW;
            newX = resizeStart.current.winX + dx;
          }
        }
        if (dir.includes('n')) {
          const possibleH = resizeStart.current.height - dy;
          if (possibleH >= minH) {
            newH = possibleH;
            newY = resizeStart.current.winY + dy;
          }
        }

        resizeWindow(win.id, newW, newH);
        if (newX !== win.x || newY !== win.y) {
          moveWindow(win.id, newX, newY);
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
      if (isResizing) setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, win.id, win.x, win.y, minW, minH, moveWindow, resizeWindow]);

  if (win.isMinimized) {
    return null;
  }

  // Styles for Maximized vs Floating
  const windowStyle: React.CSSProperties = win.isMaximized
    ? {
        position: 'fixed',
        top: 30, // below top panel
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 84px)', // top panel (30px) + bottom dock (~54px)
        zIndex: win.zIndex,
        borderRadius: 0
      }
    : {
        position: 'fixed',
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex
      };

  return (
    <div
      id={`window-${win.id}`}
      style={windowStyle}
      onMouseDown={() => focusWindow(win.id)}
      className={`flex flex-col bg-slate-900 border rounded-lg shadow-2xl overflow-hidden transition-all duration-75 select-none ${
        isActive
          ? 'border-slate-600 ring-1 ring-blue-500/30 shadow-slate-950/80'
          : 'border-slate-800/80 shadow-slate-950/50 opacity-95'
      }`}
    >
      {/* Title bar */}
      <div
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={() => maximizeWindow(win.id)}
        className={`h-9 px-3 flex items-center justify-between shrink-0 cursor-default border-b transition-colors ${
          isActive
            ? 'bg-slate-800/95 border-slate-700/80 text-slate-100'
            : 'bg-slate-900/90 border-slate-800 text-slate-400'
        }`}
      >
        {/* Left: Icon & Title */}
        <div className="flex items-center gap-2 overflow-hidden pointer-events-none">
          <Icon
            name={win.icon}
            className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`}
          />
          <span className="text-xs font-medium tracking-wide truncate max-w-[400px]">
            {win.title}
          </span>
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {/* Minimize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            title="Minimize"
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-700/70 transition-colors"
          >
            <Icon name="Minus" className="w-3.5 h-3.5" />
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(win.id);
            }}
            title={win.isMaximized ? 'Restore' : 'Maximize'}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-700/70 transition-colors"
          >
            <Icon name={win.isMaximized ? 'Minimize2' : 'Square'} className="w-3 h-3" />
          </button>

          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            title="Close"
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 transition-colors"
          >
            <Icon name="X" className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Window Body (Content) */}
      <div className="flex-1 overflow-hidden relative select-text cursor-auto bg-slate-950/90 text-slate-200">
        {children}
      </div>

      {/* Resize handles (only when not maximized) */}
      {!win.isMaximized && (
        <>
          <div
            onMouseDown={handleResizeMouseDown('n')}
            className="absolute -top-1 left-2 right-2 h-2 cursor-n-resize z-10"
          />
          <div
            onMouseDown={handleResizeMouseDown('s')}
            className="absolute -bottom-1 left-2 right-2 h-2 cursor-s-resize z-10"
          />
          <div
            onMouseDown={handleResizeMouseDown('w')}
            className="absolute -left-1 top-2 bottom-2 w-2 cursor-w-resize z-10"
          />
          <div
            onMouseDown={handleResizeMouseDown('e')}
            className="absolute -right-1 top-2 bottom-2 w-2 cursor-e-resize z-10"
          />
          <div
            onMouseDown={handleResizeMouseDown('nw')}
            className="absolute -top-1 -left-1 w-3 h-3 cursor-nw-resize z-20"
          />
          <div
            onMouseDown={handleResizeMouseDown('ne')}
            className="absolute -top-1 -right-1 w-3 h-3 cursor-ne-resize z-20"
          />
          <div
            onMouseDown={handleResizeMouseDown('sw')}
            className="absolute -bottom-1 -left-1 w-3 h-3 cursor-sw-resize z-20"
          />
          <div
            onMouseDown={handleResizeMouseDown('se')}
            className="absolute -bottom-1 -right-1 w-3 h-3 cursor-se-resize z-20"
          />
        </>
      )}
    </div>
  );
};
