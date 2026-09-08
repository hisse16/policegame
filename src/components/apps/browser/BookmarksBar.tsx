import React, { useState } from 'react';
import { Bookmark } from '../../../types/browser';
import { Icon } from '../../common/Icon';

interface BookmarksBarProps {
  bookmarks: Bookmark[];
  onNavigate: (url: string) => void;
  onRemoveBookmark: (id: string) => void;
}

export const BookmarksBar: React.FC<BookmarksBarProps> = ({
  bookmarks,
  onNavigate,
  onRemoveBookmark
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; bookmarkId: string } | null>(null);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  // Separate regular bookmarks and foldered bookmarks
  const regularBookmarks = bookmarks.filter((b) => !b.folder);
  const folders = Array.from(new Set(bookmarks.map((b) => b.folder).filter(Boolean))) as string[];

  const handleContextMenu = (e: React.MouseEvent, bookmarkId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, bookmarkId });
  };

  return (
    <div
      className="h-7 px-2 flex items-center gap-1 bg-slate-950/60 border-b border-slate-800 text-[11px] text-slate-300 select-none overflow-x-auto relative shrink-0"
      onClick={() => {
        setContextMenu(null);
        setActiveFolder(null);
      }}
    >
      {/* Folder items */}
      {folders.map((folderName) => {
        const folderItems = bookmarks.filter((b) => b.folder === folderName);
        const isOpen = activeFolder === folderName;

        return (
          <div key={folderName} className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveFolder(isOpen ? null : folderName);
              }}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors whitespace-nowrap"
            >
              <Icon name="Folder" className="w-3 h-3 text-amber-400" />
              <span>{folderName}</span>
              <Icon name="ChevronDown" className="w-2.5 h-2.5 text-slate-500" />
            </button>

            {/* Folder Dropdown */}
            {isOpen && (
              <div
                className="absolute left-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 min-w-[160px]"
                onClick={(e) => e.stopPropagation()}
              >
                {folderItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.url);
                      setActiveFolder(null);
                    }}
                    onContextMenu={(e) => handleContextMenu(e, item.id)}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2 text-slate-200 transition-colors"
                  >
                    <Icon name={item.icon || 'Globe'} className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Regular Bookmarks */}
      {regularBookmarks.map((bm) => (
        <button
          key={bm.id}
          onClick={() => onNavigate(bm.url)}
          onContextMenu={(e) => handleContextMenu(e, bm.id)}
          title={`${bm.title} - ${bm.url}`}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors whitespace-nowrap group"
        >
          <Icon name={bm.icon || 'Globe'} className="w-3 h-3 text-blue-400 shrink-0" />
          <span className="truncate max-w-[130px]">{bm.title}</span>
        </button>
      ))}

      {/* Context Menu for Bookmark */}
      {contextMenu && (
        <div
          className="fixed z-50 w-36 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 text-xs text-slate-200"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              onRemoveBookmark(contextMenu.bookmarkId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-red-600 hover:text-white flex items-center gap-2 text-rose-400"
          >
            <Icon name="Trash2" className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};
