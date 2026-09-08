import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { browserDb } from '../../services/browserDatabase';
import { TabItem, DownloadItem, Bookmark } from '../../types/browser';
import { BrowserTabBar } from './browser/BrowserTabBar';
import { BrowserNavbar } from './browser/BrowserNavbar';
import { BookmarksBar } from './browser/BookmarksBar';
import { DownloadsShelf } from './browser/DownloadsShelf';
import { BrowserContentRenderer } from './browser/BrowserContentRenderer';
import { storyEngine } from '../../services/story/storyEngine';

export const BrowserApp: React.FC<{ windowId: string; params?: { url?: string } }> = ({
  windowId,
  params
}) => {
  const {
    settings,
    openFile,
    openApp,
    sendNotification,
    setWindowTitle
  } = useOS();

  // Initial tab setup
  const initialUrl = params?.url || 'https://search.local/';
  const initialPage = browserDb.resolveUrl(initialUrl);
  const initialTitle = initialPage.title || 'Beacon Search';

  const [tabs, setTabs] = useState<TabItem[]>([
    {
      id: 'tab_init_1',
      title: initialTitle,
      url: initialUrl,
      favicon: 'Compass',
      isLoading: false,
      history: [initialUrl],
      historyIndex: 0,
      isPinned: false,
      isMuted: false
    }
  ]);

  const [activeTabId, setActiveTabId] = useState('tab_init_1');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([...browserDb.bookmarks]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([...browserDb.downloads]);
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false);
  const [adShieldActive, setAdShieldActive] = useState(true);
  const [adBlockedCount, setAdBlockedCount] = useState(14);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Active tab pointer
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Set OS notification callback on browserDb
  useEffect(() => {
    browserDb.setNotificationCallback((title, msg, type) => {
      sendNotification(title, msg, type, 'Compass');
    });
  }, [sendNotification]);

  // Subscribe to downloads updates
  useEffect(() => {
    const unsub = browserDb.subscribeDownloads((updated) => {
      setDownloads(updated);
    });
    return () => unsub();
  }, []);

  // Update OS window title when active tab changes
  useEffect(() => {
    if (activeTab) {
      setWindowTitle(windowId, `${activeTab.title} - Beacon Web Browser`);
    }
  }, [activeTab?.title, windowId, setWindowTitle]);

  // Navigation Logic
  const navigateTo = (targetUrl: string) => {
    let clean = targetUrl.trim();

    if (!clean.startsWith('http://') && !clean.startsWith('https://') && !clean.startsWith('about:')) {
      if (clean.includes('.') && !clean.includes(' ')) {
        clean = 'https://' + clean;
      } else {
        clean = `https://search.local/search?q=${encodeURIComponent(clean)}`;
      }
    }

    const resolved = browserDb.resolveUrl(clean);
    let tabTitle = resolved.title || 'Web Page';
    if (clean.startsWith('about:newtab')) tabTitle = 'New Tab';
    else if (clean.startsWith('about:history')) tabTitle = 'History';
    else if (clean.startsWith('about:bookmarks')) tabTitle = 'Bookmarks';
    else if (clean.startsWith('about:downloads')) tabTitle = 'Downloads';
    else if (clean.startsWith('about:settings')) tabTitle = 'Settings';

    // Track simulated ad blocks
    if (adShieldActive && !clean.startsWith('about:')) {
      setAdBlockedCount((c) => c + Math.floor(Math.random() * 2));
    }

    // Set loading state briefly
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== activeTabId) return t;

        const nextHistory = t.history.slice(0, t.historyIndex + 1);
        nextHistory.push(clean);

        return {
          ...t,
          url: clean,
          title: tabTitle,
          isLoading: true,
          history: nextHistory,
          historyIndex: nextHistory.length - 1
        };
      })
    );

    // Record into history
    browserDb.addHistoryEntry(clean, tabTitle);

    // Trigger story engine discovery
    try {
      storyEngine.onViewWebpage(clean);
      if (clean.includes('search?q=')) {
        const query = decodeURIComponent(clean.split('search?q=')[1].split('&')[0]);
        storyEngine.onSearchTerm(query);
      }
    } catch (e) {
      console.warn('Story trigger error:', e);
    }

    // Simulate page render delay (realistic snappiness)
    setTimeout(() => {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: false } : t))
      );
    }, 180);
  };

  // Back button
  const handleBack = () => {
    if (activeTab.historyIndex > 0) {
      const prevUrl = activeTab.history[activeTab.historyIndex - 1];
      const resolved = browserDb.resolveUrl(prevUrl);
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                url: prevUrl,
                title: resolved.title || t.title,
                historyIndex: t.historyIndex - 1
              }
            : t
        )
      );
    }
  };

  // Forward button
  const handleForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const nextUrl = activeTab.history[activeTab.historyIndex + 1];
      const resolved = browserDb.resolveUrl(nextUrl);
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                url: nextUrl,
                title: resolved.title || t.title,
                historyIndex: t.historyIndex + 1
              }
            : t
        )
      );
    }
  };

  // Reload button
  const handleReload = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: true } : t))
    );
    setTimeout(() => {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: false } : t))
      );
    }, 200);
  };

  // Home button
  const handleHome = () => {
    navigateTo('about:newtab');
  };

  // Tab operations
  const handleNewTab = (url = 'about:newtab') => {
    const newId = 'tab_' + Date.now().toString(36);
    const resolved = browserDb.resolveUrl(url);
    const newTab: TabItem = {
      id: newId,
      title: url === 'about:newtab' ? 'New Tab' : resolved.title || 'Page',
      url,
      favicon: 'Globe',
      isLoading: false,
      history: [url],
      historyIndex: 0,
      isPinned: false,
      isMuted: false
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (tabId: string) => {
    if (tabs.length === 1) {
      // If closing the very last tab, reset it to New Tab
      setTabs([
        {
          id: 'tab_' + Date.now().toString(36),
          title: 'New Tab',
          url: 'about:newtab',
          favicon: 'Compass',
          isLoading: false,
          history: ['about:newtab'],
          historyIndex: 0,
          isPinned: false,
          isMuted: false
        }
      ]);
      return;
    }

    const idx = tabs.findIndex((t) => t.id === tabId);
    const nextTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(nextTabs);

    if (activeTabId === tabId) {
      const nextActive = nextTabs[Math.max(0, idx - 1)] || nextTabs[0];
      setActiveTabId(nextActive.id);
    }
  };

  const handleCloseOtherTabs = (tabId: string) => {
    setTabs((prev) => prev.filter((t) => t.id === tabId || t.isPinned));
    setActiveTabId(tabId);
  };

  const handleCloseTabsToRight = (tabId: string) => {
    const idx = tabs.findIndex((t) => t.id === tabId);
    if (idx !== -1) {
      setTabs((prev) => prev.filter((t, i) => i <= idx || t.isPinned));
    }
  };

  const handleDuplicateTab = (tabId: string) => {
    const src = tabs.find((t) => t.id === tabId);
    if (!src) return;
    const newId = 'tab_' + Date.now().toString(36);
    const cloned: TabItem = {
      ...src,
      id: newId,
      history: [...src.history]
    };
    setTabs((prev) => [...prev, cloned]);
    setActiveTabId(newId);
  };

  const handlePinTab = (tabId: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  const handleMuteTab = (tabId: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, isMuted: !t.isMuted } : t))
    );
  };

  // Bookmarking
  const isCurrentBookmarked = bookmarks.some((b) => b.url === activeTab.url);

  const handleToggleBookmark = () => {
    browserDb.toggleBookmark(activeTab.url, activeTab.title);
    setBookmarks([...browserDb.bookmarks]);
  };

  const handleRemoveBookmark = (id: string) => {
    browserDb.removeBookmark(id);
    setBookmarks([...browserDb.bookmarks]);
  };

  // Downloads handlers
  const handleOpenFileFromDownload = (vfsPath: string) => {
    openFile(vfsPath);
  };

  const handleShowInFolderFromDownload = (vfsPath: string) => {
    openApp('files', { initialPath: '/home/investigator/Downloads' });
  };

  const handleCancelDownload = (id: string) => {
    browserDb.downloads = browserDb.downloads.filter((d) => d.id !== id);
    browserDb.save();
    setDownloads([...browserDb.downloads]);
  };

  const handleRemoveDownload = (id: string) => {
    browserDb.downloads = browserDb.downloads.filter((d) => d.id !== id);
    browserDb.save();
    setDownloads([...browserDb.downloads]);
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(1.5, z + 0.1));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.7, z - 0.1));
  const handleResetZoom = () => setZoomLevel(1);

  // Clear data
  const handleConfirmClearData = () => {
    browserDb.clearHistory();
    browserDb.downloads = [];
    browserDb.save();
    setDownloads([]);
    setShowClearConfirm(false);
    sendNotification('Browsing Data Cleared', 'Simulated cookies, history, and cache reset.', 'info', 'Trash2');
  };

  const isOnline = settings.networkState !== 'offline';

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 select-none overflow-hidden relative">
      {/* 1. Modern Chrome Tab Bar */}
      <BrowserTabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={handleCloseTab}
        onNewTab={() => handleNewTab('about:newtab')}
        onDuplicateTab={handleDuplicateTab}
        onPinTab={handlePinTab}
        onMuteTab={handleMuteTab}
        onCloseOtherTabs={handleCloseOtherTabs}
        onCloseTabsToRight={handleCloseTabsToRight}
      />

      {/* 2. Navigation & Omnibox Toolbar */}
      <BrowserNavbar
        url={activeTab.url}
        canGoBack={activeTab.historyIndex > 0}
        canGoForward={activeTab.historyIndex < activeTab.history.length - 1}
        isLoading={activeTab.isLoading}
        isBookmarked={isCurrentBookmarked}
        downloads={downloads}
        adShieldActive={adShieldActive}
        adBlockedCount={adBlockedCount}
        zoomLevel={zoomLevel}
        onNavigate={navigateTo}
        onBack={handleBack}
        onForward={handleForward}
        onReload={handleReload}
        onHome={handleHome}
        onToggleBookmark={handleToggleBookmark}
        onToggleAdShield={() => setAdShieldActive(!adShieldActive)}
        onOpenDownloads={() => setIsDownloadsOpen(!isDownloadsOpen)}
        onOpenHistory={() => navigateTo('about:history')}
        onOpenBookmarks={() => navigateTo('about:bookmarks')}
        onOpenSettings={() => navigateTo('about:settings')}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onClearData={() => setShowClearConfirm(true)}
      />

      {/* 3. Bookmarks Quick Bar */}
      <BookmarksBar
        bookmarks={bookmarks}
        onNavigate={navigateTo}
        onRemoveBookmark={handleRemoveBookmark}
      />

      {/* 4. Active Downloads Floating Shelf Popover */}
      <DownloadsShelf
        downloads={downloads}
        isOpen={isDownloadsOpen}
        onClose={() => setIsDownloadsOpen(false)}
        onOpenFile={handleOpenFileFromDownload}
        onShowInFolder={handleShowInFolderFromDownload}
        onCancelDownload={handleCancelDownload}
        onRemoveDownload={handleRemoveDownload}
      />

      {/* 5. Browser Viewport Content */}
      <div className="flex-1 overflow-hidden relative bg-slate-950">
        <BrowserContentRenderer
          url={activeTab.url}
          isLoading={activeTab.isLoading}
          isOnline={isOnline}
          adShieldActive={adShieldActive}
          zoomLevel={zoomLevel}
          onNavigate={navigateTo}
          onOpenFile={handleOpenFileFromDownload}
          onShowInFolder={handleShowInFolderFromDownload}
        />
      </div>

      {/* Clear Browsing Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-100">Clear Browsing Data?</h3>
            <p className="text-slate-400 leading-relaxed">
              This will clear the simulated browsing history, active download list, and local website caches. Saved bookmarks will be preserved.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClearData}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
