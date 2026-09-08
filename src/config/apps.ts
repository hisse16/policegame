import { AppDefinition } from '../types/os';

export const APP_REGISTRY: Record<string, AppDefinition> = {
  'police-records': {
    id: 'police-records',
    name: 'PRIS Database',
    icon: 'Shield',
    description: 'Police Records & Investigation System (Criminal Archives & Forensic Wall)',
    category: 'System',
    defaultWidth: 1040,
    defaultHeight: 680,
    minWidth: 720,
    minHeight: 480
  },
  'file-manager': {
    id: 'file-manager',
    name: 'Files',
    icon: 'Folder',
    description: 'Browse, manage, and organize files and directories',
    category: 'System',
    defaultWidth: 860,
    defaultHeight: 560,
    minWidth: 540,
    minHeight: 380
  },
  'browser': {
    id: 'browser',
    name: 'Browser',
    icon: 'Globe',
    description: 'Internal intranet browser and precinct search engine',
    category: 'Internet',
    defaultWidth: 920,
    defaultHeight: 620,
    minWidth: 600,
    minHeight: 400
  },
  'terminal': {
    id: 'terminal',
    name: 'Terminal',
    icon: 'Terminal',
    description: 'Securix command line shell and forensics toolkit',
    category: 'System',
    defaultWidth: 780,
    defaultHeight: 480,
    minWidth: 460,
    minHeight: 300
  },
  'text-editor': {
    id: 'text-editor',
    name: 'Text Editor',
    icon: 'FileText',
    description: 'Edit investigation notes, logs, and config files',
    category: 'Office',
    defaultWidth: 740,
    defaultHeight: 520,
    minWidth: 460,
    minHeight: 340
  },
  'image-viewer': {
    id: 'image-viewer',
    name: 'Image Viewer',
    icon: 'Image',
    description: 'View and inspect photographs, blueprints, and visual evidence',
    category: 'Media',
    defaultWidth: 760,
    defaultHeight: 540,
    minWidth: 440,
    minHeight: 320
  },
  'pdf-viewer': {
    id: 'pdf-viewer',
    name: 'Document Viewer',
    icon: 'BookOpen',
    description: 'Read department memos, police directives, and forensic briefs',
    category: 'Office',
    defaultWidth: 780,
    defaultHeight: 600,
    minWidth: 500,
    minHeight: 380
  },
  'audio-player': {
    id: 'audio-player',
    name: 'Audio Player',
    icon: 'Headphones',
    description: 'Playback police radio dispatch and 911 audio recordings',
    category: 'Media',
    defaultWidth: 520,
    defaultHeight: 380,
    minWidth: 400,
    minHeight: 280
  },
  'video-player': {
    id: 'video-player',
    name: 'Video Player',
    icon: 'Film',
    description: 'Review security cameras and surveillance footage archives',
    category: 'Media',
    defaultWidth: 720,
    defaultHeight: 510,
    minWidth: 480,
    minHeight: 340
  },
  'calculator': {
    id: 'calculator',
    name: 'Calculator',
    icon: 'Calculator',
    description: 'Perform arithmetic and statistical calculations',
    category: 'Utilities',
    defaultWidth: 360,
    defaultHeight: 480,
    minWidth: 320,
    minHeight: 420
  },
  'system-monitor': {
    id: 'system-monitor',
    name: 'System Monitor',
    icon: 'Activity',
    description: 'View running tasks, processes, CPU, memory, and disk usage',
    category: 'System',
    defaultWidth: 800,
    defaultHeight: 520,
    minWidth: 520,
    minHeight: 360
  },
  'settings': {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    description: 'Configure appearance, wallpaper, network, and sound settings',
    category: 'System',
    defaultWidth: 820,
    defaultHeight: 560,
    minWidth: 560,
    minHeight: 380
  },
  'investigation-notebook': {
    id: 'investigation-notebook',
    name: 'Case Notebook',
    icon: 'BookOpen',
    description: 'Investigation Notebook: facts, contradictions, questions, timeline & clues',
    category: 'System',
    defaultWidth: 960,
    defaultHeight: 640,
    minWidth: 640,
    minHeight: 440
  },
  'final-deduction': {
    id: 'final-deduction',
    name: 'Case Determination',
    icon: 'CheckSquare',
    description: 'Submit Formal Probable Cause Findings for Case 27',
    category: 'System',
    defaultWidth: 840,
    defaultHeight: 640,
    minWidth: 540,
    minHeight: 440
  }
};
