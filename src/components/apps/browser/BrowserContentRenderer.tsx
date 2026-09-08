import React from 'react';
import { browserDb } from '../../../services/browserDatabase';
import { NewTabPage } from './NewTabPage';
import { SearchEngineView } from './SearchEngineView';
import { NewsRenderer } from './NewsRenderer';
import { SocialRenderer } from './SocialRenderer';
import { VideoRenderer } from './VideoRenderer';
import { ForumRenderer } from './ForumRenderer';
import { ShopRenderer } from './ShopRenderer';
import { MapRenderer } from './MapRenderer';
import { WebmailRenderer } from './WebmailRenderer';
import { InternalPagesRenderer } from './InternalPagesRenderer';
import { BrowserErrorPage } from './BrowserErrorPage';
import { Icon } from '../../common/Icon';

interface BrowserContentRendererProps {
  url: string;
  isLoading: boolean;
  isOnline: boolean;
  adShieldActive: boolean;
  zoomLevel: number;
  onNavigate: (url: string) => void;
  onOpenFile?: (vfsPath: string) => void;
  onShowInFolder?: (vfsPath: string) => void;
}

export const BrowserContentRenderer: React.FC<BrowserContentRendererProps> = ({
  url,
  isLoading,
  isOnline,
  adShieldActive,
  zoomLevel,
  onNavigate,
  onOpenFile,
  onShowInFolder
}) => {
  // If OS is offline and not an internal about: page
  if (!isOnline && !url.startsWith('about:')) {
    return (
      <BrowserErrorPage
        errorType="OFFLINE"
        url={url}
        onReload={() => onNavigate(url)}
        onSearch={(q) => onNavigate(`https://search.local/search?q=${encodeURIComponent(q)}`)}
        onGoHome={() => onNavigate('about:newtab')}
      />
    );
  }

  // Loading spinner state (brief visual cue)
  if (isLoading) {
    return (
      <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center text-slate-400 select-none">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono">Resolving host {url.replace(/^https?:\/\//, '').split('/')[0]}...</p>
      </div>
    );
  }

  // Handle Internal about: pages
  if (url === 'about:newtab' || url === 'about:blank' || !url) {
    return (
      <div style={{ zoom: zoomLevel }} className="h-full w-full">
        <NewTabPage
          onNavigate={onNavigate}
          onSearch={(q) => onNavigate(`https://search.local/search?q=${encodeURIComponent(q)}`)}
        />
      </div>
    );
  }

  if (url === 'about:history') {
    return (
      <div style={{ zoom: zoomLevel }} className="h-full w-full">
        <InternalPagesRenderer
          pageType="history"
          onNavigate={onNavigate}
          onOpenFile={onOpenFile}
          onShowInFolder={onShowInFolder}
        />
      </div>
    );
  }

  if (url === 'about:bookmarks') {
    return (
      <div style={{ zoom: zoomLevel }} className="h-full w-full">
        <InternalPagesRenderer
          pageType="bookmarks"
          onNavigate={onNavigate}
          onOpenFile={onOpenFile}
          onShowInFolder={onShowInFolder}
        />
      </div>
    );
  }

  if (url === 'about:downloads') {
    return (
      <div style={{ zoom: zoomLevel }} className="h-full w-full">
        <InternalPagesRenderer
          pageType="downloads"
          onNavigate={onNavigate}
          onOpenFile={onOpenFile}
          onShowInFolder={onShowInFolder}
        />
      </div>
    );
  }

  if (url === 'about:settings') {
    return (
      <div style={{ zoom: zoomLevel }} className="h-full w-full">
        <InternalPagesRenderer
          pageType="settings"
          onNavigate={onNavigate}
          onOpenFile={onOpenFile}
          onShowInFolder={onShowInFolder}
        />
      </div>
    );
  }

  // Parse Domain and Path
  let cleanUrl = url.replace(/^https?:\/\//, '');
  const slashIdx = cleanUrl.indexOf('/');
  const domain = (slashIdx !== -1 ? cleanUrl.substring(0, slashIdx) : cleanUrl).toLowerCase();
  const path = slashIdx !== -1 ? cleanUrl.substring(slashIdx) : '/';

  // Search Engine Domain: search.local
  if (domain === 'search.local' || domain === 'beacon.local') {
    let initialQuery = '';
    if (path.includes('q=')) {
      const match = path.match(/[?&]q=([^&]+)/);
      if (match) {
        initialQuery = decodeURIComponent(match[1]);
      }
    }
    return (
      <div style={{ zoom: zoomLevel }} className="h-full w-full">
        <SearchEngineView
          initialQuery={initialQuery}
          adShieldActive={adShieldActive}
          onNavigate={onNavigate}
        />
      </div>
    );
  }

  // News Domain: metrodaily.local
  if (domain === 'metrodaily.local' || domain === 'metrochronicle.local') {
    return (
      <div style={{ zoom: zoomLevel }} className="h-full w-full">
        <NewsRenderer path={path} onNavigate={onNavigate} />
      </div>
    );
  }

  // Social Domain: pulse.local
  if (domain === 'pulse.local') {
    return (
      <div style={{ zoom: zoomLevel }} className="h-full w-full">
        <SocialRenderer onNavigate={onNavigate} />
      </div>
    );
  }

  // Video Domain: viewtube.local
  if (domain === 'viewtube.local') {
    return (
      <div style={{ zoom: zoomLevel }} className="h-full w-full">
        <VideoRenderer path={path} onNavigate={onNavigate} />
      </div>
    );
  }

  // Forum Domain: discourse.local or netboard.local
  if (domain === 'discourse.local' || domain === 'netboard.local') {
    return (
      <div style={{ zoom: zoomLevel }} className="h-full w-full">
        <ForumRenderer path={path} onNavigate={onNavigate} />
      </div>
    );
  }

  // Shopping Domain: novamart.local
  if (domain === 'novamart.local') {
    return (
      <div style={{ zoom: zoomLevel }} className="h-full w-full">
        <ShopRenderer path={path} onNavigate={onNavigate} />
      </div>
    );
  }

  // Maps Domain: omnimaps.local
  if (domain === 'omnimaps.local') {
    return (
      <div style={{ zoom: zoomLevel }} className="h-full w-full">
        <MapRenderer onNavigate={onNavigate} />
      </div>
    );
  }

  // Webmail Domain: inbox.local or metromail.local
  if (domain === 'inbox.local' || domain === 'metromail.local') {
    return (
      <div style={{ zoom: zoomLevel }} className="h-full w-full">
        <WebmailRenderer onNavigate={onNavigate} />
      </div>
    );
  }

  // Check if domain exists in the generic browserDatabase website registry
  // This allows future game scripts / InvestigatorWeb API to add any custom site
  const site = browserDb.getWebsite(domain);
  if (site) {
    const page = site.pages[path] || site.pages['/'];
    if (!page && path !== '/') {
      return (
        <BrowserErrorPage
          errorType="HTTP_404"
          url={url}
          onReload={() => onNavigate(url)}
          onSearch={(q) => onNavigate(`https://search.local/search?q=${encodeURIComponent(q)}`)}
          onGoHome={() => onNavigate('about:newtab')}
        />
      );
    }

    if (page?.renderCustom) {
      return (
        <div style={{ zoom: zoomLevel }} className="h-full w-full">
          {page.renderCustom()}
        </div>
      );
    }

    if (page?.content) {
      return (
        <div style={{ zoom: zoomLevel }} className="h-full w-full bg-slate-950 text-slate-200 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-slate-100">{page.title}</h1>
            <div className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
              {page.content}
            </div>
          </div>
        </div>
      );
    }
  }

  // Domain not found on fictional network: NXDOMAIN
  return (
    <BrowserErrorPage
      errorType="NXDOMAIN"
      url={url}
      onReload={() => onNavigate(url)}
      onSearch={(q) => onNavigate(`https://search.local/search?q=${encodeURIComponent(q)}`)}
      onGoHome={() => onNavigate('about:newtab')}
    />
  );
};
