import { AppDefinition } from '../types/os';

export const APP_REGISTRY: Record<string, AppDefinition> = {
  'police-records': {
    id: 'police-records', name: 'PRIS Database', icon: 'Shield',
    description: 'Case Intelligence: records, people, reports, vehicles, locations and institutional history', category: 'System',
    defaultWidth: 1040, defaultHeight: 680, minWidth: 720, minHeight: 480, singleInstance: true
  },
  'evidence-lab': {
    id: 'evidence-lab', name: 'Evidence & Forensics', icon: 'Microscope',
    description: 'Forensic examination, chain of custody, laboratory findings and disputed evidence', category: 'System',
    defaultWidth: 1080, defaultHeight: 700, minWidth: 760, minHeight: 480, singleInstance: true
  },
  'investigation-board': {
    id: 'investigation-board', name: 'Investigation Board', icon: 'GitMerge',
    description: 'Build your own evidence relationships, competing theories and reconstructed timelines', category: 'System',
    defaultWidth: 1120, defaultHeight: 720, minWidth: 800, minHeight: 500, singleInstance: true
  },
  'file-manager': {
    id: 'file-manager', name: 'Evidence Archive', icon: 'Folder',
    description: 'Recovered documents, archived material and workstation evidence', category: 'System',
    defaultWidth: 860, defaultHeight: 560, minWidth: 540, minHeight: 380, singleInstance: true
  },
  'browser': {
    id: 'browser', name: 'Open Source Research', icon: 'Globe',
    description: 'Public records, historical research, news archives and external sources', category: 'Internet',
    defaultWidth: 920, defaultHeight: 620, minWidth: 600, minHeight: 400, singleInstance: true
  },
  'terminal': {
    id: 'terminal', name: 'Digital Forensics Terminal', icon: 'Terminal',
    description: 'Low-level logs, audit traces, metadata and digital forensic utilities', category: 'System',
    defaultWidth: 780, defaultHeight: 480, minWidth: 460, minHeight: 300, singleInstance: false
  },
  'text-editor': {
    id: 'text-editor', name: 'Working Notes', icon: 'FileText',
    description: 'Draft notes, reconstructed timelines and private investigative analysis', category: 'Office',
    defaultWidth: 740, defaultHeight: 520, minWidth: 460, minHeight: 340
  },
  'image-viewer': {
    id: 'image-viewer', name: 'Evidence Viewer', icon: 'Image',
    description: 'Photographs, scans, blueprints and visual evidence', category: 'Media',
    defaultWidth: 760, defaultHeight: 540, minWidth: 440, minHeight: 320
  },
  'calculator': {
    id: 'calculator', name: 'Calculator', icon: 'Calculator',
    description: 'Calculations for distances, timelines and investigative comparisons', category: 'Utilities',
    defaultWidth: 360, defaultHeight: 480, minWidth: 320, minHeight: 420
  },
  'system-monitor': {
    id: 'system-monitor', name: 'System Monitor', icon: 'Activity',
    description: 'Workstation diagnostics and running processes', category: 'System',
    defaultWidth: 800, defaultHeight: 520, minWidth: 520, minHeight: 360
  },
  'settings': {
    id: 'settings', name: 'Workstation Settings', icon: 'Settings',
    description: 'Configure the investigative workstation', category: 'System',
    defaultWidth: 820, defaultHeight: 560, minWidth: 560, minHeight: 380
  },
  'investigation-notebook': {
    id: 'investigation-notebook', name: 'Detective Notebook', icon: 'BookOpen',
    description: 'Private facts, contradictions, questions, timelines, bookmarks and theories', category: 'System',
    defaultWidth: 960, defaultHeight: 640, minWidth: 640, minHeight: 440, singleInstance: true
  },
  'final-deduction': {
    id: 'final-deduction', name: 'Case Determination', icon: 'CheckSquare',
    description: 'Build and submit a supported reconstruction of Case 27', category: 'System',
    defaultWidth: 840, defaultHeight: 640, minWidth: 540, minHeight: 440, singleInstance: true
  },
  'police-mail': {
    id: 'police-mail', name: 'Department Communications', icon: 'Mail',
    description: 'Internal correspondence, memoranda and sworn personnel communications', category: 'Office',
    defaultWidth: 1040, defaultHeight: 680, minWidth: 740, minHeight: 480, singleInstance: true
  }
};
