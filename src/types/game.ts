export type GameState =
  | 'MAIN_MENU'
  | 'BOOTING'
  | 'COMPUTER_RUNNING'
  | 'COMPUTER_SHUTTING_DOWN'
  | 'COMPUTER_RESTARTING'
  | 'SETTINGS'
  | 'HOW_TO_PLAY'
  | 'CREDITS';

export type BootType = 'normal' | 'restart' | 'recovery';

export interface GameSettings {
  // Display
  fullscreen: boolean;
  uiScale: 1 | 1.1 | 1.25;
  crtScanlines: boolean;
  subtleGlow: boolean;

  // Audio
  masterVolume: number; // 0 - 100
  ambientVolume: number; // 0 - 100
  uiVolume: number; // 0 - 100
  ambientMuted: boolean;
  uiMuted: boolean;

  // Accessibility
  textSize: 'normal' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;

  // Gameplay
  autosaveEnabled: boolean;
  confirmBeforeQuit: boolean;
  confirmDestructiveDelete: boolean;

  // Locale
  language: string;
}

export interface SaveMetadata {
  hasSave: boolean;
  timestamp: string;
  caseTitle: string;
  caseNumber: string;
  playtimeSeconds: number;
  storyProgress: number;
  evidenceCount: number;
}
