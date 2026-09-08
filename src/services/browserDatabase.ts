import {
  Bookmark,
  HistoryEntry,
  DownloadItem,
  AdItem,
  WebsiteData,
  NewsArticle,
  ForumThread,
  SocialPost,
  VideoItem,
  ProductItem,
  MapLocation,
  EmailMessage
} from '../types/browser';
import {
  CORE_WEBSITES,
  FICTIONAL_ADS,
  NEWS_ARTICLES,
  SOCIAL_POSTS,
  VIDEOS,
  FORUM_THREADS,
  PRODUCTS,
  MAP_LOCATIONS,
  INITIAL_EMAILS,
  LEXICON_ARTICLES,
  ARCHIVE_SNAPSHOTS
} from './fictionalWebData';
import { vfs } from './vfs';

export interface SearchFilter {
  category?: 'all' | 'news' | 'images' | 'videos' | 'forums' | 'shopping' | 'maps';
  timeFilter?: 'any' | 'day' | 'week' | 'year';
}

export interface RichSearchResult {
  url: string;
  title: string;
  snippet: string;
  category: string;
  sitename: string;
  icon?: string;
  type: 'web' | 'news' | 'video' | 'forum' | 'shop' | 'map';
  metaInfo?: string;
  score: number;
}

export interface InstantAnswer {
  type: 'weather' | 'calc' | 'definition' | 'time';
  title: string;
  details: string;
  data?: any;
}

class BrowserDatabase {
  public websites: Record<string, WebsiteData> = { ...CORE_WEBSITES };
  public bookmarks: Bookmark[] = [];
  public history: HistoryEntry[] = [];
  public downloads: DownloadItem[] = [];
  public searchHistory: string[] = ['transit expansion', 'horizonbook 15', 'harbor festival', 'police intranet'];
  
  // Interactive mock stores
  public newsArticles: NewsArticle[] = [...NEWS_ARTICLES];
  public socialPosts: SocialPost[] = [...SOCIAL_POSTS];
  public videos: VideoItem[] = [...VIDEOS];
  public forumThreads: ForumThread[] = [...FORUM_THREADS];
  public products: ProductItem[] = [...PRODUCTS];
  public mapLocations: MapLocation[] = [...MAP_LOCATIONS];
  public emails: EmailMessage[] = [...INITIAL_EMAILS];
  public cart: Array<{ product: ProductItem; quantity: number }> = [];
  public cookies: Record<string, Record<string, string>> = {};

  // Listeners for updates
  private downloadListeners: Array<(downloads: DownloadItem[]) => void> = [];
  private notificationCallback?: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;

  constructor() {
    this.loadState();
    this.ensureDefaultBookmarks();
    this.setupSampleDownloads();
    this.exposeStoryApi();
  }

  public setNotificationCallback(cb: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void) {
    this.notificationCallback = cb;
  }

  private loadState() {
    try {
      const savedBms = localStorage.getItem('securix_browser_bookmarks');
      if (savedBms) this.bookmarks = JSON.parse(savedBms);

      const savedHist = localStorage.getItem('securix_browser_history');
      if (savedHist) this.history = JSON.parse(savedHist);

      const savedDownloads = localStorage.getItem('securix_browser_downloads');
      if (savedDownloads) this.downloads = JSON.parse(savedDownloads);

      const savedSearches = localStorage.getItem('securix_search_history');
      if (savedSearches) this.searchHistory = JSON.parse(savedSearches);
    } catch {
      // Storage access fallback
    }
  }

  private saveBookmarks() {
    try {
      localStorage.setItem('securix_browser_bookmarks', JSON.stringify(this.bookmarks));
    } catch {}
  }

  private saveHistory() {
    try {
      localStorage.setItem('securix_browser_history', JSON.stringify(this.history));
    } catch {}
  }

  private saveDownloads() {
    try {
      localStorage.setItem('securix_browser_downloads', JSON.stringify(this.downloads));
    } catch {}
  }

  private saveSearchHistory() {
    try {
      localStorage.setItem('securix_search_history', JSON.stringify(this.searchHistory));
    } catch {}
  }

  public save() {
    this.saveBookmarks();
    this.saveHistory();
    this.saveDownloads();
    this.saveSearchHistory();
  }

  private ensureDefaultBookmarks() {
    if (this.bookmarks.length === 0) {
      this.bookmarks = [
        { id: 'bm_search', title: 'Beacon Search', url: 'https://search.local/', icon: 'Search', dateAdded: new Date().toISOString() },
        { id: 'bm_news', title: 'Metro Chronicle', url: 'https://metrodaily.local/', icon: 'Newspaper', dateAdded: new Date().toISOString() },
        { id: 'bm_pulse', title: 'Pulse Social', url: 'https://pulse.local/', icon: 'MessageSquare', dateAdded: new Date().toISOString() },
        { id: 'bm_tube', title: 'ViewTube', url: 'https://viewtube.local/', icon: 'Video', dateAdded: new Date().toISOString() },
        { id: 'bm_forum', title: 'NetBoard Forums', url: 'https://discourse.local/', icon: 'Users', dateAdded: new Date().toISOString() },
        { id: 'bm_shop', title: 'NovaMart Store', url: 'https://novamart.local/', icon: 'ShoppingBag', dateAdded: new Date().toISOString() },
        { id: 'bm_maps', title: 'OmniMaps City', url: 'https://omnimaps.local/', icon: 'MapPin', dateAdded: new Date().toISOString() },
        { id: 'bm_mail', title: 'MetroMail', url: 'https://inbox.local/', icon: 'Mail', dateAdded: new Date().toISOString() },
        { id: 'bm_intra', title: 'Police Intranet', url: 'http://intranet.local/', icon: 'Shield', folder: 'Work', dateAdded: new Date().toISOString() },
        { id: 'bm_manuals', title: 'OS Documentation', url: 'http://manuals.local/', icon: 'BookOpen', folder: 'Work', dateAdded: new Date().toISOString() }
      ];
      this.saveBookmarks();
    }
  }

  private setupSampleDownloads() {
    if (this.downloads.length === 0) {
      this.downloads = [
        {
          id: 'dl_init_1',
          filename: 'Securix_Investigator_Handbook.txt',
          url: 'http://manuals.local/investigator-handbook.txt',
          sizeBytes: 1024 * 4,
          downloadedBytes: 1024 * 4,
          status: 'completed',
          mimeType: 'text/plain',
          localVFSPath: '/home/investigator/Downloads/Securix_Investigator_Handbook.txt',
          dateAdded: '2026-09-07 10:15:00',
          content: `SECURIX OS INVESTIGATOR HANDBOOK - 24.04 LTS
============================================
Welcome to the digital investigation suite.
Verify hash signatures on all ingested files.
Keep downloads organized in /home/investigator/Downloads/`
        }
      ];
      // Ensure file exists in VFS
      try {
        if (!vfs.getNode('/home/investigator/Downloads/Securix_Investigator_Handbook.txt')) {
          vfs.createFile('/home/investigator/Downloads/Securix_Investigator_Handbook.txt', this.downloads[0].content, 'text/plain');
        }
      } catch {}
    }
  }

  // ==================== URL RESOLUTION ====================
  public resolveUrl(rawUrl: string): {
    found: boolean;
    domain?: string;
    path?: string;
    website?: WebsiteData;
    title?: string;
    isCustomRenderer?: boolean;
    content?: string;
    error?: 'NXDOMAIN' | 'OFFLINE' | 'INVALID_URL' | 'HTTP_404';
  } {
    let url = rawUrl.trim();
    if (!url) return { found: false, error: 'INVALID_URL' };

    // Support internal about: pages
    if (url.startsWith('about:')) {
      const pageName = url.substring(6).toLowerCase();
      const titles: Record<string, string> = {
        'newtab': 'New Tab',
        'blank': 'about:blank',
        'history': 'Browsing History',
        'bookmarks': 'Bookmarks Manager',
        'downloads': 'Downloads',
        'settings': 'Browser Settings'
      };
      return {
        found: true,
        domain: 'about',
        path: `/${pageName}`,
        title: titles[pageName] || 'Browser Page',
        isCustomRenderer: true
      };
    }

    // Auto prepend protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // If it contains a dot, assume simulated web address
      if (url.includes('.')) {
        url = 'https://' + url;
      } else {
        // Not a URL, treat as search query
        return {
          found: true,
          domain: 'search.local',
          path: `/search?q=${encodeURIComponent(url)}`,
          title: `Search: ${url}`,
          isCustomRenderer: true
        };
      }
    }

    try {
      const clean = url.replace(/^https?:\/\//, '');
      const slashIdx = clean.indexOf('/');
      const domain = (slashIdx !== -1 ? clean.substring(0, slashIdx) : clean).toLowerCase();
      let path = slashIdx !== -1 ? clean.substring(slashIdx) : '/';
      if (!path) path = '/';

      const website = this.websites[domain];
      if (!website) {
        return { found: false, domain, path, error: 'NXDOMAIN' };
      }

      // Special handling for dynamic routes (e.g. /article/waterfront-transit-expansion or /product/laptop-apex-15)
      const page = website.pages[path];
      if (page) {
        return {
          found: true,
          domain,
          path,
          website,
          title: page.title,
          isCustomRenderer: page.isCustomRenderer,
          content: page.content
        };
      }

      // Check if this website has custom root renderer that handles sub-routes
      if (website.pages['/']?.isCustomRenderer) {
        return {
          found: true,
          domain,
          path,
          website,
          title: website.name,
          isCustomRenderer: true
        };
      }

      return { found: false, domain, path, error: 'HTTP_404' };
    } catch {
      return { found: false, error: 'INVALID_URL' };
    }
  }

  // ==================== SEARCH ENGINE ====================
  public search(query: string, filter?: SearchFilter): {
    results: RichSearchResult[];
    instantAnswer?: InstantAnswer;
    sponsoredAds: AdItem[];
    relatedQueries: string[];
    totalCount: number;
  } {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { results: [], sponsoredAds: [], relatedQueries: [], totalCount: 0 };
    }

    // Save search history
    if (!this.searchHistory.includes(query.trim())) {
      this.searchHistory.unshift(query.trim());
      if (this.searchHistory.length > 25) this.searchHistory.pop();
      this.saveSearchHistory();
    }

    // 1. Instant Answer detection
    let instantAnswer: InstantAnswer | undefined;
    if (q === 'weather' || q.includes('forecast') || q.includes('rain') || q.includes('temperature')) {
      instantAnswer = {
        type: 'weather',
        title: 'Metro City Current Weather',
        details: '71°F (22°C) • Mostly Sunny • Humidity 45% • Wind 8 mph NW',
        data: { temp: 71, condition: 'Mostly Sunny', high: 74, low: 58 }
      };
    } else if (q === 'time' || q.includes('what time is it') || q.includes('clock')) {
      instantAnswer = {
        type: 'time',
        title: 'Metro City Standard Time',
        details: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
    } else if (/^[\d\s+\-*/().^]+$/.test(q) && /[+\-*/]/.test(q)) {
      try {
        // Safe math evaluation
        const sanitized = q.replace(/[^0-9+\-*/().]/g, '');
        // eslint-disable-next-line no-eval
        const calcRes = Function(`'use strict'; return (${sanitized})`)();
        if (typeof calcRes === 'number' && !isNaN(calcRes)) {
          instantAnswer = {
            type: 'calc',
            title: `Calculation: ${q}`,
            details: `= ${calcRes}`
          };
        }
      } catch {}
    }

    // 2. Sponsored Ads matching
    const sponsoredAds = FICTIONAL_ADS.filter((ad) =>
      ad.keywords.some((kw) => q.includes(kw) || kw.includes(q))
    ).slice(0, 2);

    // 3. Search indexing and ranking
    const matched: RichSearchResult[] = [];

    // Search News Articles
    this.newsArticles.forEach((art) => {
      let score = 0;
      const text = `${art.headline} ${art.subtitle} ${art.leadParagraph} ${art.tags.join(' ')}`.toLowerCase();
      if (art.headline.toLowerCase().includes(q)) score += 20;
      if (art.subtitle.toLowerCase().includes(q)) score += 12;
      if (text.includes(q)) score += 6;

      const words = q.split(/\s+/);
      words.forEach((w) => {
        if (w.length > 2 && text.includes(w)) score += 3;
      });

      if (score > 0) {
        matched.push({
          url: `https://metrodaily.local/article/${art.slug}`,
          title: art.headline,
          snippet: art.leadParagraph.substring(0, 150) + '...',
          category: 'News',
          sitename: 'Metro Chronicle',
          icon: 'Newspaper',
          type: 'news',
          metaInfo: `${art.date} • by ${art.author}`,
          score
        });
      }
    });

    // Search Products (NovaMart)
    this.products.forEach((prod) => {
      let score = 0;
      const text = `${prod.name} ${prod.category} ${prod.description} ${Object.values(prod.specs).join(' ')}`.toLowerCase();
      if (prod.name.toLowerCase().includes(q)) score += 25;
      if (prod.category.toLowerCase().includes(q)) score += 15;
      if (text.includes(q)) score += 8;

      if (score > 0) {
        matched.push({
          url: `https://novamart.local/product/${prod.id}`,
          title: `${prod.name} - $${prod.price}`,
          snippet: prod.description.substring(0, 140) + '...',
          category: 'Shopping',
          sitename: 'NovaMart',
          icon: 'ShoppingBag',
          type: 'shop',
          metaInfo: `★ ${prod.rating} (${prod.reviewCount} reviews) • In Stock`,
          score
        });
      }
    });

    // Search Forum Threads (Discourse)
    this.forumThreads.forEach((thread) => {
      let score = 0;
      const allText = `${thread.title} ${thread.tags.join(' ')} ${thread.posts.map((p) => p.content).join(' ')}`.toLowerCase();
      if (thread.title.toLowerCase().includes(q)) score += 18;
      if (allText.includes(q)) score += 6;

      if (score > 0) {
        matched.push({
          url: `https://discourse.local/thread/${thread.id}`,
          title: thread.title,
          snippet: (thread.posts[0]?.content.substring(0, 140) || '') + '...',
          category: 'Community',
          sitename: 'NetBoard Forums',
          icon: 'Users',
          type: 'forum',
          metaInfo: `${thread.posts.length} replies • ${thread.views} views`,
          score
        });
      }
    });

    // Search Videos (ViewTube)
    this.videos.forEach((vid) => {
      let score = 0;
      const text = `${vid.title} ${vid.channel} ${vid.category} ${vid.description}`.toLowerCase();
      if (vid.title.toLowerCase().includes(q)) score += 22;
      if (text.includes(q)) score += 7;

      if (score > 0) {
        matched.push({
          url: `https://viewtube.local/watch/${vid.id}`,
          title: vid.title,
          snippet: vid.description.substring(0, 140) + '...',
          category: 'Media',
          sitename: 'ViewTube',
          icon: 'Video',
          type: 'video',
          metaInfo: `${vid.channel} • ${vid.views} • ${vid.duration}`,
          score
        });
      }
    });

    // Search Map Locations (OmniMaps)
    this.mapLocations.forEach((loc) => {
      let score = 0;
      const text = `${loc.name} ${loc.district} ${loc.category} ${loc.description} ${loc.address}`.toLowerCase();
      if (loc.name.toLowerCase().includes(q)) score += 25;
      if (text.includes(q)) score += 8;

      if (score > 0) {
        matched.push({
          url: `https://omnimaps.local/location/${loc.id}`,
          title: loc.name,
          snippet: `${loc.address}, ${loc.district}. ${loc.description}`,
          category: 'Maps',
          sitename: 'OmniMaps',
          icon: 'MapPin',
          type: 'map',
          metaInfo: `${loc.category} • ${loc.district}`,
          score
        });
      }
    });

    // Search Core Websites and manual pages
    Object.values(this.websites).forEach((site) => {
      Object.values(site.pages).forEach((pg) => {
        let score = 0;
        const titleLower = pg.title.toLowerCase();
        const contentLower = (pg.content || '').toLowerCase();
        if (titleLower.includes(q)) score += 15;
        if (contentLower.includes(q)) score += 5;
        if (site.domain.toLowerCase().includes(q)) score += 12;

        if (score > 0) {
          matched.push({
            url: pg.url,
            title: pg.title,
            snippet: (pg.content ? pg.content.substring(0, 150).replace(/\n/g, ' ') : site.name) + '...',
            category: pg.category || site.category,
            sitename: site.name,
            icon: site.icon,
            type: 'web',
            metaInfo: site.domain,
            score
          });
        }
      });
    });

    // Filter by category if requested
    let filtered = matched;
    if (filter?.category && filter.category !== 'all') {
      if (filter.category === 'news') filtered = matched.filter((m) => m.type === 'news');
      else if (filter.category === 'videos') filtered = matched.filter((m) => m.type === 'video');
      else if (filter.category === 'forums') filtered = matched.filter((m) => m.type === 'forum');
      else if (filter.category === 'shopping') filtered = matched.filter((m) => m.type === 'shop');
      else if (filter.category === 'maps') filtered = matched.filter((m) => m.type === 'map');
    }

    // Sort by relevance score
    filtered.sort((a, b) => b.score - a.score);

    // Dynamic Related Queries
    const relatedQueries = [
      `${query} reviews`,
      `${query} metro city`,
      `${query} prices`,
      `best ${query} 2026`
    ];

    return {
      results: filtered,
      instantAnswer,
      sponsoredAds,
      relatedQueries,
      totalCount: filtered.length
    };
  }

  public getAutocompleteSuggestions(partial: string): string[] {
    const p = partial.trim().toLowerCase();
    if (!p) return [];

    const suggestions = new Set<string>();

    // From search history
    this.searchHistory.forEach((item) => {
      if (item.toLowerCase().includes(p)) suggestions.add(item);
    });

    // From websites
    Object.keys(this.websites).forEach((domain) => {
      if (domain.toLowerCase().includes(p)) suggestions.add(domain);
    });

    // From news headlines
    this.newsArticles.forEach((art) => {
      if (art.headline.toLowerCase().includes(p)) {
        suggestions.add(art.headline);
      }
    });

    // From products
    this.products.forEach((prod) => {
      if (prod.name.toLowerCase().includes(p)) {
        suggestions.add(prod.name);
      }
    });

    return Array.from(suggestions).slice(0, 7);
  }

  // ==================== BOOKMARKS ====================
  public getBookmarks(): Bookmark[] {
    return [...this.bookmarks];
  }

  public isBookmarked(url: string): boolean {
    return this.bookmarks.some((b) => b.url.toLowerCase() === url.toLowerCase());
  }

  public toggleBookmark(url: string, title?: string, icon?: string): boolean {
    const cleanUrl = url.trim();
    const idx = this.bookmarks.findIndex((b) => b.url.toLowerCase() === cleanUrl.toLowerCase());
    if (idx !== -1) {
      this.bookmarks.splice(idx, 1);
      this.saveBookmarks();
      return false; // removed
    } else {
      this.bookmarks.push({
        id: 'bm_' + Date.now(),
        title: title || cleanUrl,
        url: cleanUrl,
        icon: icon || 'Globe',
        dateAdded: new Date().toISOString()
      });
      this.saveBookmarks();
      return true; // added
    }
  }

  public removeBookmark(id: string) {
    this.bookmarks = this.bookmarks.filter((b) => b.id !== id);
    this.saveBookmarks();
  }

  // ==================== HISTORY ====================
  public getHistory(): HistoryEntry[] {
    return [...this.history];
  }

  public addHistoryEntry(url: string, title: string) {
    if (url.startsWith('about:blank')) return;

    const existingIdx = this.history.findIndex((h) => h.url === url);
    if (existingIdx !== -1) {
      const item = this.history[existingIdx];
      item.title = title || item.title;
      item.timestamp = new Date().toISOString();
      item.visitCount += 1;
      this.history.splice(existingIdx, 1);
      this.history.unshift(item);
    } else {
      this.history.unshift({
        id: 'hist_' + Date.now(),
        url,
        title: title || url,
        timestamp: new Date().toISOString(),
        visitCount: 1
      });
      if (this.history.length > 200) this.history.pop();
    }
    this.saveHistory();
  }

  public clearHistory() {
    this.history = [];
    this.saveHistory();
  }

  public removeHistoryItem(id: string) {
    this.history = this.history.filter((h) => h.id !== id);
    this.saveHistory();
  }

  // ==================== DOWNLOADS ====================
  public getDownloads(): DownloadItem[] {
    return [...this.downloads];
  }

  public subscribeDownloads(listener: (downloads: DownloadItem[]) => void): () => void {
    this.downloadListeners.push(listener);
    return () => {
      this.downloadListeners = this.downloadListeners.filter((l) => l !== listener);
    };
  }

  private notifyDownloads() {
    this.downloadListeners.forEach((l) => l([...this.downloads]));
    this.saveDownloads();
  }

  public startDownload(
    filename: string,
    url: string,
    sizeBytes: number,
    mimeType: string,
    content: string
  ): DownloadItem {
    const vfsPath = `/home/investigator/Downloads/${filename}`;
    const id = 'dl_' + Date.now();

    const newDownload: DownloadItem = {
      id,
      filename,
      url,
      sizeBytes,
      downloadedBytes: 0,
      status: 'downloading',
      mimeType,
      localVFSPath: vfsPath,
      dateAdded: new Date().toISOString().replace('T', ' ').substring(0, 19),
      content
    };

    this.downloads.unshift(newDownload);
    this.notifyDownloads();

    // Progress simulation
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(sizeBytes * 0.35);
      if (progress >= sizeBytes) {
        progress = sizeBytes;
        clearInterval(interval);

        newDownload.downloadedBytes = sizeBytes;
        newDownload.status = 'completed';

        // Write directly to VFS!
        try {
          vfs.createFile(vfsPath, content, mimeType);
        } catch (err) {
          console.error('Failed writing downloaded file to VFS:', err);
        }

        // Notify user
        if (this.notificationCallback) {
          this.notificationCallback(
            'Download Complete',
            `${filename} saved to /home/investigator/Downloads/`,
            'success'
          );
        }
        this.notifyDownloads();
      } else {
        newDownload.downloadedBytes = progress;
        this.notifyDownloads();
      }
    }, 400);

    return newDownload;
  }

  public cancelDownload(id: string) {
    const dl = this.downloads.find((d) => d.id === id);
    if (dl && dl.status === 'downloading') {
      dl.status = 'cancelled';
      this.notifyDownloads();
    }
  }

  public removeDownload(id: string) {
    this.downloads = this.downloads.filter((d) => d.id !== id);
    this.notifyDownloads();
  }

  // ==================== INTERACTIVE ACTIONS ====================
  public addSocialPost(content: string, handle = '@investigator_07', author = 'Lead Investigator') {
    const newPost: SocialPost = {
      id: 'pulse_user_' + Date.now(),
      author,
      handle,
      avatarColor: 'bg-indigo-600',
      timeAgo: 'Just now',
      content,
      likes: 0,
      reposts: 0,
      commentsCount: 0
    };
    this.socialPosts.unshift(newPost);
    return newPost;
  }

  public likeSocialPost(id: string) {
    const post = this.socialPosts.find((p) => p.id === id);
    if (post) {
      if (post.isLiked) {
        post.likes = Math.max(0, post.likes - 1);
        post.isLiked = false;
      } else {
        post.likes += 1;
        post.isLiked = true;
      }
    }
  }

  public addForumReply(threadId: string, content: string, author = 'Investigator_07') {
    const thread = this.forumThreads.find((t) => t.id === threadId);
    if (thread) {
      thread.posts.push({
        id: 'p_' + Date.now(),
        author,
        avatarText: 'IN',
        role: 'Member',
        postDate: 'Just now',
        content,
        likes: 0
      });
    }
  }

  public addToCart(product: ProductItem) {
    const item = this.cart.find((c) => c.product.id === product.id);
    if (item) {
      item.quantity += 1;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
  }

  public removeFromCart(productId: string) {
    this.cart = this.cart.filter((c) => c.product.id !== productId);
  }

  public sendEmail(toEmail: string, subject: string, body: string) {
    const newMail: EmailMessage = {
      id: 'mail_' + Date.now(),
      fromName: 'Lead Investigator',
      fromEmail: 'investigator@metro.gov',
      toEmail,
      subject,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      folder: 'sent',
      isRead: true,
      isStarred: false,
      body
    };
    this.emails.unshift(newMail);
  }

  // ==================== EXTENSIBILITY / STORY API ====================
  public registerWebsite(site: WebsiteData) {
    this.websites[site.domain] = site;
  }

  public registerPage(url: string, title: string, content: string, category = 'General') {
    const cleanUrl = url.replace(/^https?:\/\//, '');
    const slashIdx = cleanUrl.indexOf('/');
    const domain = slashIdx !== -1 ? cleanUrl.substring(0, slashIdx) : cleanUrl;
    const path = slashIdx !== -1 ? cleanUrl.substring(slashIdx) : '/';

    if (!this.websites[domain]) {
      this.websites[domain] = {
        domain,
        name: domain,
        category,
        icon: 'Globe',
        isHttps: true,
        pages: {}
      };
    }

    this.websites[domain].pages[path] = {
      url,
      title,
      content,
      category
    };
  }

  public getWebsite(domain: string): WebsiteData | undefined {
    return this.websites[domain.toLowerCase()];
  }

  public getAllWebsites(): WebsiteData[] {
    return Object.values(this.websites);
  }

  private exposeStoryApi() {
    if (typeof window !== 'undefined') {
      (window as any).InvestigatorWeb = {
        registerWebsite: (site: WebsiteData) => this.registerWebsite(site),
        registerPage: (url: string, title: string, content: string, cat?: string) => this.registerPage(url, title, content, cat),
        search: (q: string) => this.search(q),
        addNewsArticle: (art: NewsArticle) => this.newsArticles.unshift(art),
        addForumThread: (th: ForumThread) => this.forumThreads.unshift(th),
        addSocialPost: (content: string) => this.addSocialPost(content),
        startDownload: (fn: string, url: string, size: number, mime: string, content: string) =>
          this.startDownload(fn, url, size, mime, content),
        getHistory: () => this.getHistory(),
        clearHistory: () => this.clearHistory(),
        getBookmarks: () => this.getBookmarks()
      };
    }
  }
}

export const browserDb = new BrowserDatabase();
