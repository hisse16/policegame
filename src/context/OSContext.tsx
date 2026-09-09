import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { OSWindow, OSSettings, OSNotification, ClipboardItem, PowerState } from '../types/os';
import { APP_REGISTRY } from '../config/apps';
import { vfs } from '../services/vfs';
import { initStoryApi } from '../services/storyApi';

const DEFAULT_SETTINGS: OSSettings = {
  theme: 'dark',
  accentColor: '#3b82f6', // blue-500
  wallpaper: 'police-slate', // 'police-slate', 'dark-navy', 'classic-mountain', 'carbon-grid'
  clockFormat: '24h',
  timeZone: 'America/New_York (EST)',
  dateFormat: 'YYYY-MM-DD',
  volume: 80,
  isMuted: false,
  networkState: 'connected',
  activeNetwork: 'POLICE-NET',
  resolutionScale: 1,
  nightLight: false
};

interface OSContextValue {
  windows: OSWindow[];
  activeWindowId: string | null;
  settings: OSSettings;
  notifications: OSNotification[];
  powerState: PowerState;
  clipboard: ClipboardItem | null;
  vfsVersion: number;
  availableNetworks: string[];
  isLauncherOpen: boolean;
  isNetworkMenuOpen: boolean;
  isVolumeMenuOpen: boolean;
  isPowerMenuOpen: boolean;
  isNotificationCenterOpen: boolean;
  altTabOpen: boolean;
  altTabSelectedIndex: number;

  openApp: (appId: string, params?: Record<string, any>) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
  setWindowTitle: (id: string, title: string) => void;
  openFile: (path: string) => void;
  
  sendNotification: (title: string, message: string, type?: 'info' | 'warning' | 'error' | 'success', appIcon?: string) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  updateSettings: (partial: Partial<OSSettings>) => void;
  setPowerState: (state: PowerState) => void;
  setClipboard: (item: ClipboardItem | null) => void;
  
  setLauncherOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setNetworkMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setVolumeMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setPowerMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setNotificationCenterOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  
  executeRestart: () => void;
  executeShutdown: () => void;
  factoryResetOS: () => void;
}

const OSContext = createContext<OSContextValue | null>(null);

export const OSProvider: React.FC<{
  children: React.ReactNode;
  onShutdown?: () => void;
  onRestart?: () => void;
}> = ({ children, onShutdown, onRestart }) => {
  const [windows, setWindows] = useState<OSWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [vfsVersion, setVfsVersion] = useState(0);
  const highestZIndex = useRef(100);

  // Persistence for settings
  const [settings, setSettings] = useState<OSSettings>(() => {
    try {
      const saved = localStorage.getItem('investigator_os_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [notifications, setNotifications] = useState<OSNotification[]>([
    {
      id: 'notif_welcome',
      title: 'Securix OS Initialized',
      message: 'Investigator Workstation #07 connected to POLICE-NET.',
      timestamp: 'Just now',
      type: 'info',
      read: false
    }
  ]);

  const [powerState, setPowerState] = useState<PowerState>('running');
  const [clipboard, setClipboard] = useState<ClipboardItem | null>(null);

  // Menus
  const [isLauncherOpen, setLauncherOpen] = useState(false);
  const [isNetworkMenuOpen, setNetworkMenuOpen] = useState(false);
  const [isVolumeMenuOpen, setVolumeMenuOpen] = useState(false);
  const [isPowerMenuOpen, setPowerMenuOpen] = useState(false);
  const [isNotificationCenterOpen, setNotificationCenterOpen] = useState(false);

  // Alt+Tab
  const [altTabOpen, setAltTabOpen] = useState(false);
  const [altTabSelectedIndex, setAltTabSelectedIndex] = useState(0);

  const availableNetworks = ['POLICE-NET', 'INVESTIGATION', 'GUEST', 'OFFLINE'];

  // Subscribe to VFS modifications
  useEffect(() => {
    const unsub = vfs.subscribe(() => {
      setVfsVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  // Save settings when changed
  useEffect(() => {
    try {
      localStorage.setItem('investigator_os_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }, [settings]);

  const sendNotification = useCallback(
    (title: string, message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info', appIcon?: string) => {
      const newNotif: OSNotification = {
        id: 'notif_' + Math.random().toString(36).substring(2, 9),
        title,
        message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type,
        appIcon,
        read: false
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateSettings = useCallback((partial: Partial<OSSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial };
      return updated;
    });
  }, []);

  // Initialize Story API
  useEffect(() => {
    initStoryApi(
      (title, msg, type) => sendNotification(title, msg, type),
      (connected, netName) => {
        updateSettings({
          networkState: connected ? 'connected' : 'offline',
          activeNetwork: netName || 'POLICE-NET'
        });
      }
    );
  }, [sendNotification, updateSettings]);

  // Window operations
  const focusWindow = useCallback((id: string) => {
    highestZIndex.current += 1;
    const newZ = highestZIndex.current;
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, isMinimized: false, zIndex: newZ };
        }
        return w;
      })
    );
  }, []);

  const openApp = useCallback((appId: string, params?: Record<string, any>): string => {
    const appDef = APP_REGISTRY[appId];
    if (!appDef) {
      console.error(`App ${appId} not found in registry`);
      return '';
    }

    // Check if single instance and already open
    if (appDef.singleInstance) {
      const existing = windows.find((w) => w.appId === appId);
      if (existing) {
        focusWindow(existing.id);
        return existing.id;
      }
    }

    highestZIndex.current += 1;
    const windowId = 'win_' + Math.random().toString(36).substring(2, 9);
    
    // Stagger window position
    const offset = (windows.length % 8) * 28;
    const initialX = Math.max(40, Math.min(window.innerWidth - appDef.defaultWidth - 60, 100 + offset));
    const initialY = Math.max(40, Math.min(window.innerHeight - appDef.defaultHeight - 80, 50 + offset));

    const newWindow: OSWindow = {
      id: windowId,
      appId,
      title: (params?.title as string) || appDef.name,
      icon: appDef.icon,
      x: initialX,
      y: initialY,
      width: appDef.defaultWidth,
      height: appDef.defaultHeight,
      isMinimized: false,
      isMaximized: false,
      zIndex: highestZIndex.current,
      params
    };

    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(windowId);
    setLauncherOpen(false);

    return windowId;
  }, [windows, focusWindow]);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindowId((prevActive) => {
      if (prevActive === id) {
        const remaining = windows.filter((w) => w.id !== id && !w.isMinimized);
        if (remaining.length > 0) {
          const topWindow = remaining.sort((a, b) => b.zIndex - a.zIndex)[0];
          return topWindow.id;
        }
        return null;
      }
      return prevActive;
    });
  }, [windows]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setActiveWindowId((prevActive) => {
      if (prevActive === id) {
        const remaining = windows.filter((w) => w.id !== id && !w.isMinimized);
        if (remaining.length > 0) {
          const topWindow = remaining.sort((a, b) => b.zIndex - a.zIndex)[0];
          return topWindow.id;
        }
        return null;
      }
      return prevActive;
    });
  }, [windows]);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
    focusWindow(id);
  }, [focusWindow]);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    );
  }, []);

  const resizeWindow = useCallback((id: string, width: number, height: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, width, height } : w))
    );
  }, []);

  const setWindowTitle = useCallback((id: string, title: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, title } : w))
    );
  }, []);

  const openFile = useCallback((filePath: string) => {
    const node = vfs.getNode(filePath);
    if (!node) {
      sendNotification('Error', `File not found: ${filePath}`, 'error');
      return;
    }

    if (node.type === 'dir') {
      openApp('file-manager', { path: node.path });
      return;
    }

    const name = node.name.toLowerCase();
    if (name.endsWith('.desktop')) {
      const content = node.content || '';
      const execMatch = content.match(/Exec=([a-zA-Z0-9_-]+)/);
      if (execMatch && execMatch[1]) {
        openApp(execMatch[1]);
        return;
      }
    }
    if (name.endsWith('.txt') || name.endsWith('.log') || name.endsWith('.md') || 
        name.endsWith('.json') || name.endsWith('.csv') || name.endsWith('.conf') || 
        name.endsWith('.js') || name.endsWith('.css')) {
      openApp('text-editor', { path: node.path, title: node.name });
    } else if (name.endsWith('.svg') || name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg')) {
      openApp('image-viewer', { path: node.path, title: node.name });
    } else if (name.endsWith('.pdf')) {
      openApp('pdf-viewer', { path: node.path, title: node.name });
    } else if (name.endsWith('.wav') || name.endsWith('.mp3')) {
      openApp('audio-player', { path: node.path, title: node.name });
    } else if (name.endsWith('.mp4') || name.endsWith('.webm')) {
      openApp('video-player', { path: node.path, title: node.name });
    } else if (name.endsWith('.html') || name.endsWith('.htm')) {
      openApp('browser', { initialUrl: `file://${node.path}`, title: node.name });
    } else {
      // Default to text editor
      openApp('text-editor', { path: node.path, title: node.name });
    }
  }, [openApp, sendNotification]);

  const executeRestart = useCallback(() => {
    setLauncherOpen(false);
    setPowerMenuOpen(false);
    if (onRestart) {
      onRestart();
    } else {
      setPowerState('restarting');
      setTimeout(() => {
        setWindows([]);
        setActiveWindowId(null);
        setPowerState('booting');
        setTimeout(() => {
          setPowerState('running');
          sendNotification('System Boot', 'Securix OS restarted successfully.', 'info');
        }, 2500);
      }, 1500);
    }
  }, [onRestart, sendNotification]);

  const executeShutdown = useCallback(() => {
    setLauncherOpen(false);
    setPowerMenuOpen(false);
    if (onShutdown) {
      onShutdown();
    } else {
      setPowerState('shutdown');
    }
  }, [onShutdown]);

  const factoryResetOS = useCallback(() => {
    vfs.resetToDefaults();
    localStorage.removeItem('investigator_os_settings');
    localStorage.removeItem('investigator_search_history');
    setSettings(DEFAULT_SETTINGS);
    setWindows([]);
    setActiveWindowId(null);
    sendNotification('System Reset', 'Operating system state restored to factory defaults.', 'warning');
  }, [sendNotification]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + F4 (close active window)
      if (e.altKey && e.key === 'F4' && activeWindowId) {
        e.preventDefault();
        closeWindow(activeWindowId);
        return;
      }

      // Alt + Tab
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        const nonMinimized = windows.filter((w) => !w.isMinimized);
        if (nonMinimized.length > 0) {
          setAltTabOpen(true);
          setAltTabSelectedIndex((prev) => (prev + 1) % nonMinimized.length);
        }
        return;
      }

      // Escape closes menus
      if (e.key === 'Escape') {
        setLauncherOpen(false);
        setNetworkMenuOpen(false);
        setVolumeMenuOpen(false);
        setPowerMenuOpen(false);
        setNotificationCenterOpen(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt' && altTabOpen) {
        setAltTabOpen(false);
        const nonMinimized = windows.filter((w) => !w.isMinimized);
        if (nonMinimized.length > 0 && nonMinimized[altTabSelectedIndex]) {
          focusWindow(nonMinimized[altTabSelectedIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeWindowId, closeWindow, windows, altTabOpen, altTabSelectedIndex, focusWindow]);

  return (
    <OSContext.Provider
      value={{
        windows,
        activeWindowId,
        settings,
        notifications,
        powerState,
        clipboard,
        vfsVersion,
        availableNetworks,
        isLauncherOpen,
        isNetworkMenuOpen,
        isVolumeMenuOpen,
        isPowerMenuOpen,
        isNotificationCenterOpen,
        altTabOpen,
        altTabSelectedIndex,
        openApp,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        moveWindow,
        resizeWindow,
        setWindowTitle,
        openFile,
        sendNotification,
        dismissNotification,
        clearAllNotifications,
        updateSettings,
        setPowerState,
        setClipboard,
        setLauncherOpen,
        setNetworkMenuOpen,
        setVolumeMenuOpen,
        setPowerMenuOpen,
        setNotificationCenterOpen,
        executeRestart,
        executeShutdown,
        factoryResetOS
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error('useOS must be used within an OSProvider');
  return ctx;
};
