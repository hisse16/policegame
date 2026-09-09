import { vfs } from './vfs';
import { browserDb } from './browserDatabase';
import { VFSNode } from '../types/os';

export interface StoryAPI {
  createFile: (path: string, content?: string, mimeType?: string) => VFSNode;
  deleteFile: (path: string, permanent?: boolean) => boolean;
  modifyFile: (path: string, content: string) => VFSNode | null;
  hideFile: (path: string) => boolean;
  revealFile: (path: string) => boolean;
  createNotification: (title: string, message: string, type?: 'info' | 'warning' | 'error' | 'success') => void;
  setNetworkState: (connected: boolean, networkName?: string) => void;
  addWebsite: (domain: string, title: string, content: string, category?: string) => void;
  addWebPage: (url: string, title: string, content: string, category?: string) => void;
  vfs: typeof vfs;
  browserDb: typeof browserDb;
}

declare global {
  interface Window {
    InvestigatorOS?: StoryAPI;
  }
}

export function initStoryApi(
  notifyHandler: (title: string, message: string, type?: 'info' | 'warning' | 'error' | 'success') => void,
  networkHandler: (connected: boolean, networkName?: string) => void
): StoryAPI {
  const api: StoryAPI = {
    createFile: (path, content = '', mimeType = 'text/plain') => {
      return vfs.createFile(path, content, mimeType);
    },
    deleteFile: (path, permanent = false) => {
      return vfs.deleteNode(path, permanent);
    },
    modifyFile: (path, content) => {
      const node = vfs.getNode(path);
      if (!node) return null;
      return vfs.createFile(path, content, node.mimeType);
    },
    hideFile: (path) => {
      const node = vfs.getNode(path);
      if (!node) return false;
      const parent = path.substring(0, path.lastIndexOf('/')) || '/';
      const newName = node.name.startsWith('.') ? node.name : '.' + node.name;
      vfs.moveNode(path, parent === '/' ? `/${newName}` : `${parent}/${newName}`);
      return true;
    },
    revealFile: (path) => {
      const node = vfs.getNode(path);
      if (!node) return false;
      if (!node.name.startsWith('.')) return true;
      const parent = path.substring(0, path.lastIndexOf('/')) || '/';
      const newName = node.name.substring(1);
      vfs.moveNode(path, parent === '/' ? `/${newName}` : `${parent}/${newName}`);
      return true;
    },
    createNotification: (title, message, type = 'info') => {
      notifyHandler(title, message, type);
    },
    setNetworkState: (connected, networkName = 'POLICE-NET') => {
      networkHandler(connected, networkName);
    },
    addWebsite: (domain, title, content, category = 'Custom') => {
      browserDb.registerWebsite({
        domain,
        name: title,
        category,
        icon: 'Globe',
        isHttps: false,
        pages: {
          '/': {
            url: `http://${domain}/`,
            title,
            content,
            category
          }
        }
      });
    },
    addWebPage: (url, title, content, category = 'Custom') => {
      browserDb.registerPage(url, title, content, category);
    },
    vfs,
    browserDb
  };

  // Expose the story API only during development for debugging.
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    window.InvestigatorOS = api;
  }

  return api;
}
