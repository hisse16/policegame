import { AppDefinition } from '../types/os';

export const APP_REGISTRY: Record<string, AppDefinition> = {
  'police-records': {
    id: 'police-records', name: 'PRIS Database', icon: 'Shield',
    description: 'Police Records & Investigation System (Criminal Archives & Forensic Wall)', category: 'System',
    defaultWidth: 1040, defaultHeight: 680, minWidth: 720, minHeight: 480, singleInstance: true
  },
  'evidence-lab': {
    id: 'evidence-lab', name: 'Evidence & Forensics', icon: 'Microscope',
    description: 'Forensics Laboratory, Chain of Custody, Lab Reports & Evidence Photography', category: 'System',
    defaultWidth: 1080, defaultHeight: 700, minWidth: 760, minHeight: 480, singleInstance: true
  },
  'investigation-board': {
    id: 'investigation-board', name: 'Investigation Board', icon: 'GitMerge',
    description: 'Interactive Corkboard, Connections, Hypotheses & Chronological Timeline', category: 'System',
    defaultWidth: 1120, defaultHeight: 720, minWidth: 800, minHeight: 500, singleInstance: true
  },
  'file-manager': {
    id: 'file-manager', name: 'Files', icon: 'Folder',
    description: 'Browse, manage, and organize files and directories', category: 'System',
    defaultWidth: 860, defaultHeight: 560, minWidth: 540, minHeight: 380, singleInstance: true
  },
  'browser': {
    id: 'browser', name: 'Browser', icon: 'Globe',
    description: 'Internal intranet browser and precinct search engine', category: 'Internet',
    defaultWidth: 920, defaultHeight: 620, minWidth: 600, minHeight: 400, singleInstance: true
  },
  'terminal': {
    id: 'terminal', name: 'Terminal', icon: 'Terminal',
    description: 'Securix command line shell and forensics toolkit', category: 'System',
    defaultWidth: 780, defaultHeight: 480, minWidth: 460, minHeight: 300, singleInstance: false
  },
  'text-editor': {
    id: 'text-editor', name: 'Text Editor', icon: 'FileText',
    description: 'Edit investigation notes, logs, and config files', category: 'Office',
    defaultWidth: 740, defaultHeight: 520, minWidth: 460, minHeight: 340
  },
  'image-viewer': {
    id: 'image-viewer', name: 'Image Viewer', icon: 'Image',
    description: 'View and inspect photographs, blueprints, and visual evidence', category: 'Media',
    defaultWidth: 760, defaultHeight: 540, minWidth: 440, minHeight: 320
  },
  'calculator': {
    id: 'calculator', name: 'Calculator', icon: 'Calculator',
    description: 'Perform arithmetic and statistical calculations', category: 'Utilities',
    defaultWidth: 360, defaultHeight: 480, minWidth: 320, minHeight: 420
  },
  'system-monitor': {
    id: 'system-monitor', name: 'System Monitor', icon: 'Activity',
    description: 'View running tasks, processes, CPU, memory, and disk usage', category: 'System',
    defaultWidth: 800, defaultHeight: 520, minWidth: 520, minHeight: 360
  },
  'settings': {
    id: 'settings', name: 'Settings', icon: 'Settings',
    description: 'Configure appearance, wallpaper, network, and sound settings', category: 'System',
    defaultWidth: 820, defaultHeight: 560, minWidth: 560, minHeight: 380
  },
  'investigation-notebook': {
    id: 'investigation-notebook', name: 'Case Notebook', icon: 'BookOpen',
    description: 'Investigation Notebook: facts, contradictions, questions, timeline & clues', category: 'System',
    defaultWidth: 960, defaultHeight: 640, minWidth: 640, minHeight: 440, singleInstance: true
  },
  'final-deduction': {
    id: 'final-deduction', name: 'Case Determination', icon: 'CheckSquare',
    description: 'Submit Formal Probable Cause Findings for Case 27', category: 'System',
    defaultWidth: 840, defaultHeight: 640, minWidth: 540, minHeight: 440, singleInstance: true
  },
  'police-mail': {
    id: 'police-mail', name: 'Police Mail', icon: 'Mail',
    description: 'Internal NPD department email, official memos, and sworn personnel directory', category: 'Office',
    defaultWidth: 1040, defaultHeight: 680, minWidth: 740, minHeight: 480, singleInstance: true
  },
  'investigation-map': {
    id: 'investigation-map', name: 'Investigation Map', icon: 'Map',
    description: 'Northbridge GIS crime mapping, historical timelines, and vehicle trajectory analysis', category: 'System',
    defaultWidth: 1080, defaultHeight: 700, minWidth: 760, minHeight: 500, singleInstance: true
  }
};
