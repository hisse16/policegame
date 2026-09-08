import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOS } from '../../context/OSContext';
import { vfs } from '../../services/vfs';
import { VFSNode } from '../../types/os';
import { Icon } from '../common/Icon';
import { ContextMenu, ContextMenuItem } from '../desktop/ContextMenu';
import { PropertiesModal } from '../desktop/PropertiesModal';

interface FileManagerAppProps {
  windowId: string;
  params?: { path?: string };
}

type SortField = 'name' | 'size' | 'type' | 'modified';

export const FileManagerApp: React.FC<FileManagerAppProps> = ({ params }) => {
  const { vfsVersion, openFile, clipboard, setClipboard, sendNotification, openApp } = useOS();

  const [currentPath, setCurrentPath] = useState<string>(
    params?.path || '/home/investigator'
  );
  const [history, setHistory] = useState<string[]>([params?.path || '/home/investigator']);
  const [historyIdx, setHistoryIdx] = useState(0);

  const [isEditingPath, setIsEditingPath] = useState(false);
  const [pathInput, setPathInput] = useState(currentPath);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortField>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);
  const [propertiesNode, setPropertiesNode] = useState<VFSNode | null>(null);

  // Dragging file between folders
  const [draggedNodePath, setDraggedNodePath] = useState<string | null>(null);

  const navigateTo = useCallback((targetPath: string) => {
    const norm = vfs.normalizePath(targetPath);
    const node = vfs.getNode(norm);
    if (!node || node.type !== 'dir') {
      sendNotification('Navigation Error', `Directory not found: ${norm}`, 'error');
      return;
    }
    setCurrentPath(norm);
    setPathInput(norm);
    setSelectedPaths(new Set());
    setRenamingPath(null);
    setSearchQuery('');

    // Update history
    setHistory((prev) => {
      const next = prev.slice(0, historyIdx + 1);
      next.push(norm);
      return next;
    });
    setHistoryIdx((prev) => prev + 1);
  }, [historyIdx, sendNotification]);

  const goBack = () => {
    if (historyIdx > 0) {
      const target = history[historyIdx - 1];
      setHistoryIdx((prev) => prev - 1);
      setCurrentPath(target);
      setPathInput(target);
      setSelectedPaths(new Set());
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const target = history[historyIdx + 1];
      setHistoryIdx((prev) => prev + 1);
      setCurrentPath(target);
      setPathInput(target);
      setSelectedPaths(new Set());
    }
  };

  const goUp = () => {
    if (currentPath === '/') return;
    const parent = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
    navigateTo(parent);
  };

  // Get directory contents or search results
  const items = useMemo(() => {
    // depend on vfsVersion to reactively recompute
    if (searchQuery.trim()) {
      return vfs.search(searchQuery.trim(), currentPath);
    }
    return vfs.listDir(currentPath, false);
  }, [currentPath, searchQuery, vfsVersion]);

  // Sorted items
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'dir' ? -1 : 1;
      }
      let cmp = 0;
      if (sortBy === 'name') {
        cmp = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      } else if (sortBy === 'size') {
        cmp = a.size - b.size;
      } else if (sortBy === 'type') {
        cmp = a.mimeType.localeCompare(b.mimeType);
      } else if (sortBy === 'modified') {
        cmp = a.updatedAt.localeCompare(b.updatedAt);
      }
      return sortAsc ? cmp : -cmp;
    });
  }, [items, sortBy, sortAsc]);

  const isTrash = currentPath === '/home/investigator/.trash';

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (node: VFSNode) => {
    if (node.type === 'dir') return 'Folder';
    const name = node.name.toLowerCase();
    if (name.endsWith('.txt') || name.endsWith('.log')) return 'FileText';
    if (name.endsWith('.pdf')) return 'BookOpen';
    if (name.endsWith('.svg') || name.endsWith('.png') || name.endsWith('.jpg')) return 'Image';
    if (name.endsWith('.wav') || name.endsWith('.mp3')) return 'Headphones';
    if (name.endsWith('.mp4')) return 'Film';
    if (name.endsWith('.json') || name.endsWith('.csv') || name.endsWith('.conf')) return 'FileCode';
    return 'File';
  };

  const getFileColor = (node: VFSNode) => {
    if (node.type === 'dir') return 'text-amber-400';
    const name = node.name.toLowerCase();
    if (name.endsWith('.pdf')) return 'text-red-400';
    if (name.endsWith('.svg') || name.endsWith('.png')) return 'text-emerald-400';
    if (name.endsWith('.wav') || name.endsWith('.mp3')) return 'text-purple-400';
    if (name.endsWith('.mp4')) return 'text-blue-400';
    return 'text-slate-300';
  };

  const handleEmptyAreaContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isTrash) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        items: [
          {
            id: 'empty_trash',
            label: 'Empty Trash',
            icon: 'Trash2',
            danger: true,
            onClick: () => vfs.emptyTrash()
          }
        ]
      });
      return;
    }

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        {
          id: 'new_folder',
          label: 'New Folder',
          icon: 'FolderPlus',
          onClick: () => {
            let name = 'New Folder';
            let count = 1;
            while (vfs.getNode(`${currentPath}/${name}`)) {
              count++;
              name = `New Folder (${count})`;
            }
            vfs.createDir(`${currentPath}/${name}`);
            setRenamingPath(`${currentPath}/${name}`);
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
            while (vfs.getNode(`${currentPath}/${name}`)) {
              count++;
              name = `Untitled_${count}.txt`;
            }
            vfs.createFile(`${currentPath}/${name}`, '');
            setRenamingPath(`${currentPath}/${name}`);
            setRenameValue(name);
          }
        },
        {
          id: 'paste',
          label: 'Paste',
          icon: 'Clipboard',
          disabled: !clipboard || clipboard.type !== 'file',
          onClick: () => {
            if (clipboard && clipboard.type === 'file') {
              if (clipboard.operation === 'cut') {
                vfs.moveNode(clipboard.data, currentPath);
                setClipboard(null);
              } else {
                vfs.copyNode(clipboard.data, currentPath);
              }
            }
          }
        },
        { id: 'd1', label: '', divider: true },
        {
          id: 'open_terminal',
          label: 'Open Terminal Here',
          icon: 'Terminal',
          onClick: () => openApp('terminal', { cwd: currentPath })
        },
        {
          id: 'props',
          label: 'Folder Properties',
          icon: 'Info',
          onClick: () => {
            const currentDirNode = vfs.getNode(currentPath);
            if (currentDirNode) setPropertiesNode(currentDirNode);
          }
        }
      ]
    });
  };

  const handleItemContextMenu = (e: React.MouseEvent, node: VFSNode) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPaths(new Set([node.path]));

    if (isTrash) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        items: [
          {
            id: 'restore',
            label: 'Restore from Trash',
            icon: 'RotateCcw',
            onClick: () => {
              vfs.restoreFromTrash(node.path);
              sendNotification('Restored', `Restored ${node.name} to original location.`, 'info');
            }
          },
          {
            id: 'delete_perm',
            label: 'Delete Permanently',
            icon: 'Trash2',
            danger: true,
            onClick: () => vfs.deleteNode(node.path, true)
          },
          { id: 'd1', label: '', divider: true },
          {
            id: 'props',
            label: 'Properties',
            icon: 'Info',
            onClick: () => setPropertiesNode(node)
          }
        ]
      });
      return;
    }

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        {
          id: 'open',
          label: 'Open',
          icon: 'FolderOpen',
          onClick: () => {
            if (node.type === 'dir') navigateTo(node.path);
            else openFile(node.path);
          }
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
        { id: 'd2', label: '', divider: true },
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
        { id: 'd3', label: '', divider: true },
        {
          id: 'properties',
          label: 'Properties',
          icon: 'Info',
          onClick: () => setPropertiesNode(node)
        }
      ]
    });
  };

  const submitRename = (oldPath: string) => {
    if (!renameValue.trim() || renameValue.includes('/')) {
      setRenamingPath(null);
      return;
    }
    try {
      vfs.renameNode(oldPath, renameValue.trim());
    } catch (err: any) {
      sendNotification('Rename Failed', err.message || 'Could not rename', 'error');
    }
    setRenamingPath(null);
  };

  const sidebarLinks = [
    { label: 'Home', path: '/home/investigator', icon: 'Home' },
    { label: 'Desktop', path: '/home/investigator/Desktop', icon: 'Monitor' },
    { label: 'Documents', path: '/home/investigator/Documents', icon: 'FileText' },
    { label: 'Downloads', path: '/home/investigator/Downloads', icon: 'Download' },
    { label: 'Pictures', path: '/home/investigator/Pictures', icon: 'Image' },
    { label: 'Videos', path: '/home/investigator/Videos', icon: 'Film' },
    { label: 'Music', path: '/home/investigator/Music', icon: 'Music' },
    { label: 'Trash', path: '/home/investigator/.trash', icon: 'Trash2' },
    { label: 'File System', path: '/', icon: 'HardDrive' }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 select-none text-xs">
      {/* Top Toolbar */}
      <div className="h-10 px-3 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 shrink-0 gap-2">
        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={goBack}
            disabled={historyIdx === 0}
            title="Back"
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 transition-colors"
          >
            <Icon name="ArrowLeft" className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIdx >= history.length - 1}
            title="Forward"
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 transition-colors"
          >
            <Icon name="ArrowRight" className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={goUp}
            disabled={currentPath === '/'}
            title="Parent Folder"
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 transition-colors"
          >
            <Icon name="ArrowUp" className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentPath((p) => p)}
            title="Refresh"
            className="p-1.5 rounded hover:bg-slate-800 transition-colors ml-1"
          >
            <Icon name="RotateCw" className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address / Breadcrumbs bar */}
        <div className="flex-1 max-w-xl mx-2">
          {isEditingPath ? (
            <input
              type="text"
              autoFocus
              value={pathInput}
              onChange={(e) => setPathInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigateTo(pathInput);
                  setIsEditingPath(false);
                }
                if (e.key === 'Escape') setIsEditingPath(false);
              }}
              onBlur={() => {
                navigateTo(pathInput);
                setIsEditingPath(false);
              }}
              className="w-full bg-slate-950 border border-blue-500 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:outline-hidden"
            />
          ) : (
            <div
              onClick={() => setIsEditingPath(true)}
              className="flex items-center gap-1 bg-slate-950/70 border border-slate-700/60 rounded px-2.5 py-1 text-xs text-slate-300 font-mono hover:border-slate-500 cursor-text overflow-x-auto whitespace-nowrap"
            >
              <Icon name="Folder" className="w-3.5 h-3.5 text-blue-400 shrink-0 mr-1" />
              {currentPath.split('/').filter(Boolean).map((part, i, arr) => {
                const subPath = '/' + arr.slice(0, i + 1).join('/');
                return (
                  <span key={subPath} className="flex items-center">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo(subPath);
                      }}
                      className="hover:underline hover:text-white cursor-pointer"
                    >
                      {part}
                    </span>
                    {i < arr.length - 1 && <span className="text-slate-600 mx-1">/</span>}
                  </span>
                );
              })}
              {currentPath === '/' && <span>/</span>}
            </div>
          )}
        </div>

        {/* Search & View Mode */}
        <div className="flex items-center gap-2">
          <div className="relative w-40">
            <Icon name="Search" className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/70 rounded pl-7 pr-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex items-center border border-slate-700 rounded bg-slate-950/50 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
              title="Grid View"
            >
              <Icon name="LayoutGrid" className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
              title="List View"
            >
              <Icon name="List" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Split: Sidebar & File Explorer */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-slate-950/50 border-r border-slate-800 p-2 space-y-0.5 shrink-0 overflow-y-auto">
          <div className="text-[10px] font-semibold text-slate-500 uppercase px-2.5 py-1 tracking-wider">
            Places
          </div>
          {sidebarLinks.map((item) => {
            const isSelected = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (draggedNodePath && draggedNodePath !== item.path) {
                    vfs.moveNode(draggedNodePath, item.path);
                    setDraggedNodePath(null);
                    sendNotification('Moved', `Moved item to ${item.label}`, 'info');
                  }
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-left transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon
                  name={item.icon}
                  className={`w-4 h-4 ${isSelected ? 'text-white' : item.label === 'Trash' ? 'text-slate-400' : 'text-blue-400'}`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div
          onContextMenu={handleEmptyAreaContextMenu}
          className="flex-1 flex flex-col overflow-hidden bg-slate-900/60"
        >
          {/* Trash banner */}
          {isTrash && (
            <div className="px-4 py-2 bg-amber-950/40 border-b border-amber-900/50 flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <Icon name="Trash2" className="w-4 h-4 text-amber-400" />
                <span>Deleted files are preserved in the Trash bin.</span>
              </div>
              <button
                onClick={() => {
                  vfs.emptyTrash();
                  sendNotification('Trash', 'Trash bin emptied.', 'info');
                }}
                className="px-3 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded text-xs transition-colors"
              >
                Empty Trash
              </button>
            </div>
          )}

          {/* Sort bar in list view */}
          {viewMode === 'list' && (
            <div className="flex items-center px-4 py-1.5 bg-slate-950/60 border-b border-slate-800 text-[11px] font-semibold text-slate-400">
              <button
                onClick={() => {
                  if (sortBy === 'name') setSortAsc(!sortAsc);
                  else { setSortBy('name'); setSortAsc(true); }
                }}
                className="flex-1 text-left flex items-center gap-1 hover:text-white"
              >
                Name {sortBy === 'name' && (sortAsc ? '▲' : '▼')}
              </button>
              <button
                onClick={() => {
                  if (sortBy === 'size') setSortAsc(!sortAsc);
                  else { setSortBy('size'); setSortAsc(true); }
                }}
                className="w-24 text-right pr-4 hover:text-white"
              >
                Size {sortBy === 'size' && (sortAsc ? '▲' : '▼')}
              </button>
              <button
                onClick={() => {
                  if (sortBy === 'type') setSortAsc(!sortAsc);
                  else { setSortBy('type'); setSortAsc(true); }
                }}
                className="w-28 text-left hover:text-white"
              >
                Type {sortBy === 'type' && (sortAsc ? '▲' : '▼')}
              </button>
              <button
                onClick={() => {
                  if (sortBy === 'modified') setSortAsc(!sortAsc);
                  else { setSortBy('modified'); setSortAsc(true); }
                }}
                className="w-36 text-left hover:text-white"
              >
                Modified {sortBy === 'modified' && (sortAsc ? '▲' : '▼')}
              </button>
            </div>
          )}

          {/* Files container */}
          <div
            onClick={() => {
              setSelectedPaths(new Set());
              setRenamingPath(null);
            }}
            className="flex-1 p-3 overflow-y-auto"
          >
            {sortedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <Icon name="FolderOpen" className="w-12 h-12 mb-2 opacity-30" />
                <span>Folder is empty</span>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
                {sortedItems.map((node) => {
                  const isSelected = selectedPaths.has(node.path);
                  const isRenaming = renamingPath === node.path;

                  return (
                    <div
                      key={node.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', node.path);
                        setDraggedNodePath(node.path);
                      }}
                      onDragOver={(e) => {
                        if (node.type === 'dir' && draggedNodePath && draggedNodePath !== node.path) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (node.type === 'dir' && draggedNodePath && draggedNodePath !== node.path) {
                          vfs.moveNode(draggedNodePath, node.path);
                          setDraggedNodePath(null);
                          sendNotification('Moved', `Moved item into ${node.name}`, 'info');
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (e.ctrlKey || e.metaKey) {
                          const next = new Set(selectedPaths);
                          if (next.has(node.path)) next.delete(node.path);
                          else next.add(node.path);
                          setSelectedPaths(next);
                        } else {
                          setSelectedPaths(new Set([node.path]));
                        }
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        if (node.type === 'dir') navigateTo(node.path);
                        else openFile(node.path);
                      }}
                      onContextMenu={(e) => handleItemContextMenu(e, node)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-default group transition-colors text-center ${
                        isSelected
                          ? 'bg-blue-600/30 ring-1 ring-blue-500'
                          : 'hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="w-12 h-12 flex items-center justify-center mb-1">
                        <Icon name={getFileIcon(node)} className={`w-8 h-8 ${getFileColor(node)}`} />
                      </div>

                      {isRenaming ? (
                        <input
                          type="text"
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') submitRename(node.path);
                            if (e.key === 'Escape') setRenamingPath(null);
                          }}
                          onBlur={() => submitRename(node.path)}
                          className="text-[11px] bg-slate-950 border border-blue-500 text-slate-100 px-1 rounded text-center w-full"
                        />
                      ) : (
                        <span
                          className={`text-[11px] truncate max-w-full px-1 rounded ${
                            isSelected ? 'bg-blue-600 text-white' : 'text-slate-200'
                          }`}
                          title={node.name}
                        >
                          {node.name}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-0.5">
                {sortedItems.map((node) => {
                  const isSelected = selectedPaths.has(node.path);
                  return (
                    <div
                      key={node.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPaths(new Set([node.path]));
                      }}
                      onDoubleClick={() => {
                        if (node.type === 'dir') navigateTo(node.path);
                        else openFile(node.path);
                      }}
                      onContextMenu={(e) => handleItemContextMenu(e, node)}
                      className={`flex items-center px-4 py-1.5 rounded cursor-default transition-colors text-xs ${
                        isSelected ? 'bg-blue-600 text-white' : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex-1 flex items-center gap-2 truncate">
                        <Icon name={getFileIcon(node)} className={`w-4 h-4 shrink-0 ${getFileColor(node)}`} />
                        <span className="truncate">{node.name}</span>
                      </div>
                      <div className="w-24 text-right pr-4 text-[11px] font-mono opacity-70">
                        {node.type === 'dir' ? '--' : formatBytes(node.size)}
                      </div>
                      <div className="w-28 text-left text-[11px] truncate opacity-70">
                        {node.type === 'dir' ? 'Folder' : node.mimeType.split('/')[1] || node.mimeType}
                      </div>
                      <div className="w-36 text-left text-[11px] font-mono opacity-70">
                        {node.updatedAt.substring(0, 16)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="h-6 px-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <span>{items.length} items</span>
            {selectedPaths.size > 0 && (
              <span>{selectedPaths.size} item(s) selected</span>
            )}
          </div>
        </div>
      </div>

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
