export interface VFSNode {
  id: string;
  name: string;
  path: string; // Absolute path e.g. /home/investigator/Documents
  type: 'file' | 'dir';
  size: number; // in bytes
  content?: string; // Text or svg content
  mimeType: string; // e.g. text/plain, image/svg+xml, application/pdf, audio/wav, video/mp4
  createdAt: string;
  updatedAt: string;
  accessedAt: string;
  permissions: string; // e.g. "drwxr-xr-x" or "-rw-r--r--"
  owner: string;
  group: string;
  isHidden?: boolean;
  isTrash?: boolean;
  originalPath?: string; // For files in trash
  metadata?: Record<string, any>;
}

export interface OSWindow {
  id: string;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  params?: Record<string, any>;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'Accessories' | 'System' | 'Internet' | 'Media' | 'Office' | 'Utilities';
  defaultWidth: number;
  defaultHeight: number;
  minWidth?: number;
  minHeight?: number;
  singleInstance?: boolean;
}

export interface OSSettings {
  theme: 'dark' | 'light';
  accentColor: string;
  wallpaper: string;
  clockFormat: '12h' | '24h';
  timeZone: string;
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
  volume: number; // 0 - 100
  isMuted: boolean;
  networkState: 'connected' | 'offline';
  activeNetwork: string;
  resolutionScale: number;
  nightLight: boolean;
}

export interface OSNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  appIcon?: string;
  read: boolean;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
  isLoading?: boolean;
}

export interface SearchResult {
  url: string;
  title: string;
  snippet: string;
  category?: string;
}

export interface WebPageData {
  url: string;
  title: string;
  content: string;
  category?: string;
}

export interface ClipboardItem {
  type: 'file' | 'text';
  data: any;
  operation?: 'copy' | 'cut';
}

export type PowerState = 'running' | 'locked' | 'logging_out' | 'restarting' | 'shutdown' | 'booting';
