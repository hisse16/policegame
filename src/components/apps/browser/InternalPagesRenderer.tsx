import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { browserDb } from '../../../services/browserDatabase';
import { HistoryEntry, Bookmark, DownloadItem } from '../../../types/browser';

interface InternalPagesRendererProps {
  pageType: 'history' | 'bookmarks' | 'downloads' | 'settings';
  onNavigate: (url: string) => void;
  onOpenFile?: (vfsPath: string) => void;
  onShowInFolder?: (vfsPath: string) => void;
}

export const InternalPagesRenderer: React.FC<InternalPagesRendererProps> = ({
  pageType,
  onNavigate,
  onOpenFile,
  onShowInFolder
}) => {
  const [history, setHistory] = useState<HistoryEntry[]>([...browserDb.history]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([...browserDb.bookmarks]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([...browserDb.downloads]);
  const [searchFilter, setSearchFilter] = useState('');

  // History Actions
  const handleClearHistory = () => {
    browserDb.clearHistory();
    setHistory([]);
  };

  const handleRemoveHistoryItem = (id: string) => {
    browserDb.history = browserDb.history.filter((h) => h.id !== id);
    browserDb.save();
    setHistory([...browserDb.history]);
  };

  // Bookmark Actions
  const handleRemoveBookmark = (id: string) => {
    browserDb.removeBookmark(id);
    setBookmarks([...browserDb.bookmarks]);
  };

  // Download Actions
  const handleClearDownloads = () => {
    browserDb.downloads = [];
    browserDb.save();
    setDownloads([]);
  };

  // Settings State
  const [homeUrl, setHomeUrl] = useState('about:newtab');
  const [defaultEngine, setDefaultEngine] = useState('Beacon Search');

  return (
    <div className="h-full w-full bg-slate-950 text-slate-200 overflow-y-auto font-sans select-none p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Tabs for about: pages */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-800 text-xs">
          <button
            onClick={() => onNavigate('about:history')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              pageType === 'history' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Icon name="History" className="w-4 h-4" />
            <span>History</span>
          </button>

          <button
            onClick={() => onNavigate('about:bookmarks')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              pageType === 'bookmarks' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Icon name="Star" className="w-4 h-4" />
            <span>Bookmarks</span>
          </button>

          <button
            onClick={() => onNavigate('about:downloads')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              pageType === 'downloads' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Icon name="Download" className="w-4 h-4" />
            <span>Downloads</span>
          </button>

          <button
            onClick={() => onNavigate('about:settings')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              pageType === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Icon name="Settings" className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* 1. HISTORY PAGE */}
        {pageType === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Browsing History</h2>
                <p className="text-xs text-slate-400">Pages you have visited on the simulated web</p>
              </div>
              <button
                onClick={handleClearHistory}
                disabled={history.length === 0}
                className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900/60 text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-40"
              >
                <Icon name="Trash2" className="w-3.5 h-3.5" />
                <span>Clear Browsing History</span>
              </button>
            </div>

            {/* Search Filter */}
            <div className="w-full max-w-sm">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search history..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* List */}
            <div className="space-y-2">
              {history.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">History is empty</div>
              ) : (
                history
                  .filter(
                    (h) =>
                      h.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                      h.url.toLowerCase().includes(searchFilter.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          {new Date(item.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="min-w-0">
                          <p
                            onClick={() => onNavigate(item.url)}
                            className="font-medium text-slate-200 hover:text-blue-400 cursor-pointer truncate"
                          >
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate font-mono">{item.url}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveHistoryItem(item.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                      >
                        <Icon name="X" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* 2. BOOKMARKS PAGE */}
        {pageType === 'bookmarks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Bookmarks Bar & Manager</h2>
                <p className="text-xs text-slate-400">Manage saved pages and folders</p>
              </div>
            </div>

            <div className="space-y-2">
              {bookmarks.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">No bookmarks saved yet</div>
              ) : (
                bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 rounded bg-slate-800 text-amber-400 shrink-0">
                        <Icon name={bm.icon || 'Star'} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p
                          onClick={() => onNavigate(bm.url)}
                          className="font-medium text-slate-200 hover:text-blue-400 cursor-pointer truncate"
                        >
                          {bm.title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate font-mono">{bm.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {bm.folder && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                          {bm.folder}
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveBookmark(bm.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                      >
                        <Icon name="Trash2" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 3. DOWNLOADS PAGE */}
        {pageType === 'downloads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Downloads Manager</h2>
                <p className="text-xs text-slate-400">
                  Files saved to Securix OS VFS (<span className="font-mono text-slate-300">/home/investigator/Downloads/</span>)
                </p>
              </div>
              <button
                onClick={handleClearDownloads}
                disabled={downloads.length === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Clear Downloads List
              </button>
            </div>

            <div className="space-y-3">
              {downloads.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">No downloads recorded</div>
              ) : (
                downloads.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 text-xs space-y-3 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800 shrink-0">
                          <Icon name="FileText" className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-100 text-sm truncate">{item.filename}</p>
                          <p className="text-[11px] text-slate-400 font-mono truncate">{item.sourceUrl}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                      <span>{(item.sizeBytes / 1024).toFixed(1)} KB • {item.dateAdded}</span>
                      <div className="flex items-center gap-2">
                        {onOpenFile && (
                          <button
                            onClick={() => onOpenFile(item.localVFSPath)}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1 transition-colors"
                          >
                            <Icon name="ExternalLink" className="w-3 h-3" />
                            <span>Open in Editor</span>
                          </button>
                        )}
                        {onShowInFolder && (
                          <button
                            onClick={() => onShowInFolder(item.localVFSPath)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1 transition-colors"
                          >
                            <Icon name="Folder" className="w-3 h-3" />
                            <span>Show in Folder</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 4. SETTINGS PAGE */}
        {pageType === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">Browser Settings</h2>
              <p className="text-xs text-slate-400">Configure simulated networking, search, and privacy</p>
            </div>

            <div className="space-y-4">
              {/* Search Engine Selector */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-200">Default Search Engine</h3>
                <p className="text-[11px] text-slate-400">Engine used when entering terms into the address bar</p>
                <select
                  value={defaultEngine}
                  onChange={(e) => setDefaultEngine(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Beacon Search">Beacon Search (https://search.local/)</option>
                  <option value="Direct Navigation">Direct Navigation Only</option>
                </select>
              </div>

              {/* Home page */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-200">Home Page</h3>
                <p className="text-[11px] text-slate-400">Page loaded on new tab and home button</p>
                <input
                  type="text"
                  value={homeUrl}
                  onChange={(e) => setHomeUrl(e.target.value)}
                  className="w-full max-w-md bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-blue-500 font-mono"
                />
              </div>

              {/* Security & Isolation */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-200">Sandboxing & Network Isolation</h3>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <Icon name="ShieldCheck" className="w-4 h-4" />
                  <span>External Internet Egress is Strictly Isolated (Securix Simulation Mode)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  All traffic is resolved internally by the Securix Intranet Engine. Real device IP addresses, external browsing history, and private accounts are never touched.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
