import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOS } from '../../context/OSContext';
import { vfs } from '../../services/vfs';
import { VFSNode } from '../../types/os';
import { Icon } from '../common/Icon';
import { ContextMenu, ContextMenuItem } from './ContextMenu';
import { PropertiesModal } from './PropertiesModal';

export const Desktop: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    vfsVersion,
    settings,
    openApp,
    openFile,
    clipboard,
    setClipboard,
    sendNotification
  } = useOS();

  const [desktopFiles, setDesktopFiles] = useState<VFSNode[]>([]);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);
  const [propertiesNode, setPropertiesNode] = useState<VFSNode | null>(null);

  // Marquee selection
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  // Dragging desktop icon position override (stores icon positions)
  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    try {
      const saved = localStorage.getItem('investigator_desktop_icon_pos');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  const draggingIcon = useRef<{ path: string; startX: number; startY: number; initX: number; initY: number } | null>(null);

  // Refresh files in /home/investigator/Desktop
  const loadFiles = useCallback(() => {
    const files = vfs.listDir('/home/investigator/Desktop', false);
    setDesktopFiles(files);
  }, []);

  useEffect(() => {
    loadFiles();
  }, [vfsVersion, loadFiles]);

  const saveIconPositions = (positions: Record<string, { x: number; y: number }>) => {
    setIconPositions(positions);
    try {
      localStorage.setItem('investigator_desktop_icon_pos', JSON.stringify(positions));
    } catch {
      // ignore
    }
  };

  // Marquee Selection Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    // If clicked directly on the desktop background
    if (target.id === 'desktop-surface' || target.id === 'desktop-wallpaper') {
      setSelectedPaths(new Set());
      setRenamingPath(null);
      setIsSelecting(true);
      setSelectionBox({
        x1: e.clientX,
        y1: e.clientY,
        x2: e.clientX,
        y2: e.clientY
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSelecting && selectionBox) {
      setSelectionBox({
        ...selectionBox,
        x2: e.clientX,
        y2: e.clientY
      });

      // Calculate intersection with icons
      const boxLeft = Math.min(selectionBox.x1, e.clientX);
      const boxTop = Math.min(selectionBox.y1, e.clientY);
      const boxRight = Math.max(selectionBox.x1, e.clientX);
      const boxBottom = Math.max(selectionBox.y1, e.clientY);

      const newSelected = new Set<string>();
      const iconElements = document.querySelectorAll<HTMLElement>('.desktop-icon-item');
      iconElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (
          rect.left < boxRight &&
          rect.right > boxLeft &&
          rect.top < boxBottom &&
          rect.bottom > boxTop
        ) {
          const p = el.getAttribute('data-path');
          if (p) newSelected.add(p);
        }
      });
      setSelectedPaths(newSelected);
    } else if (draggingIcon.current) {
      const dx = e.clientX - draggingIcon.current.startX;
      const dy = e.clientY - draggingIcon.current.startY;
      const newX = Math.max(20, Math.min(window.innerWidth - 100, draggingIcon.current.initX + dx));
      const newY = Math.max(40, Math.min(window.innerHeight - 100, draggingIcon.current.initY + dy));
      setIconPositions((prev) => ({
        ...prev,
        [draggingIcon.current!.path]: { x: newX, y: newY }
      }));
    }
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
      setSelectionBox(null);
    }
    if (draggingIcon.current) {
      saveIconPositions(iconPositions);
      draggingIcon.current = null;
    }
  };

  // Right-click context menu for empty desktop
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;

    const items: ContextMenuItem[] = [
      {
        id: 'new_folder',
        label: 'New Folder',
        icon: 'FolderPlus',
        onClick: () => {
          let name = 'New Folder';
          let count = 1;
          while (vfs.getNode(`/home/investigator/Desktop/${name}`)) {
            count++;
            name = `New Folder (${count})`;
          }
          vfs.createDir(`/home/investigator/Desktop/${name}`);
          setRenamingPath(`/home/investigator/Desktop/${name}`);
          setRenameValue(name);
        }
      },
      {
        id: 'new_file',
        label: 'New Text File',
        icon: 'FilePlus',
        onClick: () => {
          let name = 'Untitled.txt';
          let count = 1;
          while (vfs.getNode(`/home/investigator/Desktop/${name}`)) {
            count++;
            name = `Untitled_${count}.txt`;
          }
          vfs.createFile(`/home/investigator/Desktop/${name}`, '');
          setRenamingPath(`/home/investigator/Desktop/${name}`);
          setRenameValue(name);
        }
      },
      {
        id: 'paste',
        label: 'Paste',
        icon: 'Clipboard',
        disabled: !clipboard || clipboard.type !== 'file',
        shortcut: 'Ctrl+V',
        onClick: () => {
          if (clipboard && clipboard.type === 'file') {
            const srcPath = clipboard.data;
            if (clipboard.operation === 'cut') {
              vfs.moveNode(srcPath, '/home/investigator/Desktop');
              setClipboard(null);
            } else {
              vfs.copyNode(srcPath, '/home/investigator/Desktop');
            }
          }
        }
      },
      { id: 'div_1', label: '', divider: true },
      {
        id: 'open_term',
        label: 'Open Terminal Here',
        icon: 'Terminal',
        onClick: () => openApp('terminal', { cwd: '/home/investigator/Desktop' })
      },
      {
        id: 'display_settings',
        label: 'Change Wallpaper...',
        icon: 'Image',
        onClick: () => openApp('settings')
      }
    ];

    setContextMenu({ x, y, items });
  };

  // Right-click context menu for a specific file/folder
  const handleItemContextMenu = (e: React.MouseEvent, node: VFSNode) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPaths(new Set([node.path]));

    const items: ContextMenuItem[] = [
      {
        id: 'open',
        label: 'Open',
        icon: 'FolderOpen',
        onClick: () => openFile(node.path)
      },
      {
        id: 'rename',
        label: 'Rename',
        icon: 'Edit2',
        shortcut: 'F2',
        onClick: () => {
          setRenamingPath(node.path);
          setRenameValue(node.name);
        }
      },
      {
        id: 'copy',
        label: 'Copy',
        icon: 'Copy',
        shortcut: 'Ctrl+C',
        onClick: () => setClipboard({ type: 'file', data: node.path, operation: 'copy' })
      },
      {
        id: 'cut',
        label: 'Cut',
        icon: 'Scissors',
        shortcut: 'Ctrl+X',
        onClick: () => setClipboard({ type: 'file', data: node.path, operation: 'cut' })
      },
      { id: 'div_2', label: '', divider: true },
      {
        id: 'delete',
        label: 'Move to Trash',
        icon: 'Trash2',
        danger: true,
        shortcut: 'Del',
        onClick: () => {
          vfs.deleteNode(node.path, false);
          sendNotification('File Deleted', `Moved "${node.name}" to Trash.`, 'info');
        }
      },
      { id: 'div_3', label: '', divider: true },
      {
        id: 'properties',
        label: 'Properties',
        icon: 'Info',
        onClick: () => setPropertiesNode(node)
      }
    ];

    setContextMenu({ x: e.clientX, y: e.clientY, items });
  };

  // Handle renaming submit
  const submitRename = (oldPath: string) => {
    if (!renameValue.trim() || renameValue.includes('/')) {
      setRenamingPath(null);
      return;
    }
    try {
      vfs.renameNode(oldPath, renameValue.trim());
    } catch (err: any) {
      sendNotification('Rename Failed', err.message || 'Could not rename file', 'error');
    }
    setRenamingPath(null);
  };

  // Wallpaper styles
  const getWallpaperBackground = () => {
    switch (settings.wallpaper) {
      case 'dark-navy':
        return 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950';
      case 'classic-mountain':
        return 'bg-gradient-to-t from-slate-950 via-slate-900 to-sky-950';
      case 'carbon-grid':
        return 'bg-[#0b0f19] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]';
      case 'police-slate':
      default:
        return 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800';
    }
  };

  return (
    <div
      ref={desktopRef}
      id="desktop-surface"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleDesktopContextMenu}
      className={`fixed inset-0 pt-7.5 overflow-hidden select-none ${getWallpaperBackground()}`}
    >
      {/* Subtle department watermarked seal */}
      <div
        id="desktop-wallpaper"
        className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none"
      >
        <Icon name="Shield" className="w-[540px] h-[540px] text-white" />
      </div>

      {/* Marquee Selection Rectangle */}
      {isSelecting && selectionBox && (
        <div
          className="absolute border border-blue-400 bg-blue-500/15 pointer-events-none z-30"
          style={{
            left: Math.min(selectionBox.x1, selectionBox.x2),
            top: Math.min(selectionBox.y1, selectionBox.y2),
            width: Math.abs(selectionBox.x2 - selectionBox.x1),
            height: Math.abs(selectionBox.y2 - selectionBox.y1)
          }}
        />
      )}

      {/* Desktop Icons Container */}
      <div className="absolute inset-0 pt-10 px-4 pointer-events-none">
        {/* Virtual Trash Icon */}
        <div
          data-path="trash"
          onDoubleClick={() => openApp('file-manager', { path: '/home/investigator/.trash' })}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setContextMenu({
              x: e.clientX,
              y: e.clientY,
              items: [
                {
                  id: 'open_trash',
                  label: 'Open Trash',
                  icon: 'FolderOpen',
                  onClick: () => openApp('file-manager', { path: '/home/investigator/.trash' })
                },
                {
                  id: 'empty_trash',
                  label: 'Empty Trash',
                  icon: 'Trash2',
                  danger: true,
                  onClick: () => {
                    vfs.emptyTrash();
                    sendNotification('Trash', 'Trash bin emptied.', 'info');
                  }
                }
              ]
            });
          }}
          className="desktop-icon-item pointer-events-auto absolute flex flex-col items-center justify-center w-24 p-2 rounded-md hover:bg-slate-800/40 cursor-default text-center group transition-colors"
          style={{
            left: iconPositions['trash']?.x ?? 20,
            top: iconPositions['trash']?.y ?? 50
          }}
          onMouseDown={(e) => {
            if (e.button === 0) {
              draggingIcon.current = {
                path: 'trash',
                startX: e.clientX,
                startY: e.clientY,
                initX: iconPositions['trash']?.x ?? 20,
                initY: iconPositions['trash']?.y ?? 50
              };
            }
          }}
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-900/60 border border-slate-700/60 text-slate-300 group-hover:border-blue-500 shadow-md">
            <Icon name="Trash2" className="w-7 h-7 text-slate-300" />
          </div>
          <span className="mt-1.5 text-[11px] font-medium text-slate-200 drop-shadow-md px-1 py-0.5 rounded group-hover:bg-blue-600">
            Trash
          </span>
        </div>

        {/* Files in /home/investigator/Desktop */}
        {desktopFiles.map((file, idx) => {
          const isSelected = selectedPaths.has(file.path);
          const isRenaming = renamingPath === file.path;

          // Default layout: column grid offset from trash icon
          const defaultX = 20;
          const defaultY = 145 + idx * 88;
          const pos = iconPositions[file.path] || { x: defaultX, y: defaultY };

          const getFileIcon = (node: VFSNode) => {
            if (node.type === 'dir') return 'Folder';
            const name = node.name.toLowerCase();
            if (name.endsWith('.txt') || name.endsWith('.log')) return 'FileText';
            if (name.endsWith('.pdf')) return 'BookOpen';
            if (name.endsWith('.svg') || name.endsWith('.png') || name.endsWith('.jpg')) return 'Image';
            if (name.endsWith('.wav') || name.endsWith('.mp3')) return 'Headphones';
            if (name.endsWith('.mp4')) return 'Film';
            return 'File';
          };

          const getFileColor = (node: VFSNode) => {
            if (node.type === 'dir') return 'text-amber-400';
            const name = node.name.toLowerCase();
            if (name.endsWith('.pdf')) return 'text-red-400';
            if (name.endsWith('.svg') || name.endsWith('.png')) return 'text-emerald-400';
            if (name.endsWith('.wav')) return 'text-purple-400';
            return 'text-blue-400';
          };

          return (
            <div
              key={file.id}
              data-path={file.path}
              onClick={(e) => {
                e.stopPropagation();
                if (e.ctrlKey || e.metaKey) {
                  const updated = new Set(selectedPaths);
                  if (updated.has(file.path)) updated.delete(file.path);
                  else updated.add(file.path);
                  setSelectedPaths(updated);
                } else {
                  setSelectedPaths(new Set([file.path]));
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                openFile(file.path);
              }}
              onContextMenu={(e) => handleItemContextMenu(e, file)}
              onMouseDown={(e) => {
                if (e.button === 0 && !isRenaming) {
                  draggingIcon.current = {
                    path: file.path,
                    startX: e.clientX,
                    startY: e.clientY,
                    initX: pos.x,
                    initY: pos.y
                  };
                }
              }}
              className={`desktop-icon-item pointer-events-auto absolute flex flex-col items-center justify-center w-24 p-2 rounded-md cursor-default text-center group transition-colors ${
                isSelected
                  ? 'bg-blue-600/30 ring-1 ring-blue-400'
                  : 'hover:bg-slate-800/40'
              }`}
              style={{ left: pos.x, top: pos.y }}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg bg-slate-900/60 border shadow-md ${
                  isSelected
                    ? 'border-blue-400'
                    : 'border-slate-700/60 group-hover:border-slate-500'
                }`}
              >
                <Icon name={getFileIcon(file)} className={`w-7 h-7 ${getFileColor(file)}`} />
              </div>

              {isRenaming ? (
                <input
                  type="text"
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitRename(file.path);
                    if (e.key === 'Escape') setRenamingPath(null);
                  }}
                  onBlur={() => submitRename(file.path)}
                  className="mt-1 text-[11px] bg-slate-900 border border-blue-500 text-slate-100 px-1 rounded text-center w-22"
                />
              ) : (
                <span
                  className={`mt-1.5 text-[11px] font-medium text-slate-200 drop-shadow-md px-1 py-0.5 rounded truncate max-w-[90px] ${
                    isSelected ? 'bg-blue-600 text-white' : ''
                  }`}
                  title={file.name}
                >
                  {file.name}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Windows Layer */}
      {children}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Properties Modal */}
      {propertiesNode && (
        <PropertiesModal
          node={propertiesNode}
          onClose={() => setPropertiesNode(null)}
        />
      )}
    </div>
  );
};
