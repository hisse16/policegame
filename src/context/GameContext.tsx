import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { GameState, BootType, GameSettings, SaveMetadata } from '../types/game';
import { saveSystem } from '../services/saveSystem';
import { audioSystem } from '../services/audioSystem';

const GAME_SETTINGS_KEY = 'case27_game_settings';

const DEFAULT_GAME_SETTINGS: GameSettings = {
  fullscreen: false,
  uiScale: 1,
  crtScanlines: true,
  subtleGlow: true,
  masterVolume: 80,
  ambientVolume: 40,
  uiVolume: 65,
  ambientMuted: false,
  uiMuted: false,
  textSize: 'normal',
  reducedMotion: false,
  highContrast: false,
  autosaveEnabled: true,
  confirmBeforeQuit: true,
  confirmDestructiveDelete: true,
  language: 'English (US)'
};

interface GameContextValue {
  gameState: GameState;
  bootType: BootType;
  bootProgress: number;
  bootLogs: string[];
  gameSettings: GameSettings;
  saveMeta: SaveMetadata | null;
  isNewGameModalOpen: boolean;
  isExitModalOpen: boolean;
  
  // Navigation actions
  setGameState: (state: GameState) => void;
  handleStartGameClick: () => void;
  continueGame: () => void;
  startNewGameConfirmed: () => void;
  closeNewGameModal: () => void;
  openSettings: () => void;
  openHowToPlay: () => void;
  openCredits: () => void;
  returnToMainMenu: () => void;
  skipBoot: () => void;
  openExitModal: () => void;
  closeExitModal: () => void;
  
  // Computer hook actions
  onComputerShutdown: () => void;
  onComputerRestart: () => void;
  
  // Settings
  updateGameSettings: (partial: Partial<GameSettings>) => void;
  resetGameSettings: () => void;
  refreshSaveMetadata: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>('MAIN_MENU');
  const [bootType, setBootType] = useState<BootType>('normal');
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // Settings
  const [gameSettings, setGameSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(GAME_SETTINGS_KEY);
      if (saved) return { ...DEFAULT_GAME_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_GAME_SETTINGS;
  });

  // Save metadata
  const [saveMeta, setSaveMeta] = useState<SaveMetadata | null>(() => {
    return saveSystem.getSaveMetadata();
  });

  const refreshSaveMetadata = useCallback(() => {
    setSaveMeta(saveSystem.getSaveMetadata());
  }, []);

  // Update audio system whenever audio settings change
  useEffect(() => {
    audioSystem.updateVolumes(
      gameSettings.masterVolume,
      gameSettings.ambientVolume,
      gameSettings.uiVolume,
      gameSettings.ambientMuted,
      gameSettings.uiMuted
    );
  }, [
    gameSettings.masterVolume,
    gameSettings.ambientVolume,
    gameSettings.uiVolume,
    gameSettings.ambientMuted,
    gameSettings.uiMuted
  ]);

  // Save game settings
  useEffect(() => {
    try {
      localStorage.setItem(GAME_SETTINGS_KEY, JSON.stringify(gameSettings));
    } catch {}
  }, [gameSettings]);

  // Ambient sound management
  useEffect(() => {
    if (gameState === 'MAIN_MENU' || gameState === 'SETTINGS' || gameState === 'HOW_TO_PLAY' || gameState === 'CREDITS') {
      audioSystem.startAmbientHum();
    } else {
      audioSystem.stopAmbientHum();
    }
  }, [gameState]);

  // Update settings helper
  const updateGameSettings = useCallback((partial: Partial<GameSettings>) => {
    setGameSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetGameSettings = useCallback(() => {
    setGameSettings(DEFAULT_GAME_SETTINGS);
  }, []);

  // Start Boot Sequence
  const beginBootSequence = useCallback((type: BootType = 'normal') => {
    setBootType(type);
    setGameState('BOOTING');
    setBootProgress(0);
    setBootLogs([
      'SECURIX KERNEL v24.04-LTS ARCHIVE SYSTEM',
      'INITIALIZING WORKSTATION...',
      'VERIFYING CASE ENCRYPTION...'
    ]);

    audioSystem.playBootHum();

    const logSteps = [
      { p: 25, msg: 'LOADING SYSTEM RUNTIME...' },
      { p: 50, msg: 'VERIFYING FORENSIC FILE SYSTEM (EXT4-SEC)...' },
      { p: 75, msg: 'RESTORING INVESTIGATOR DESKTOP ENVIRONMENT...' },
      { p: 95, msg: 'STARTING BACKGROUND AUDIT DAEMONS...' },
      { p: 100, msg: 'WORKSTATION READY. LAUNCHING SHELL.' }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < logSteps.length) {
        const step = logSteps[stepIndex];
        setBootProgress(step.p);
        setBootLogs((prev) => [...prev, step.msg]);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setGameState('COMPUTER_RUNNING');
          refreshSaveMetadata();
        }, 350);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [refreshSaveMetadata]);

  // Skip boot option
  const skipBoot = useCallback(() => {
    if (gameState === 'BOOTING') {
      setBootProgress(100);
      setGameState('COMPUTER_RUNNING');
      refreshSaveMetadata();
    }
  }, [gameState, refreshSaveMetadata]);

  // Start Game Button Handler
  const handleStartGameClick = useCallback(() => {
    audioSystem.playMenuSelect();
    const hasExistingSave = saveSystem.hasSave();
    if (hasExistingSave) {
      // Prompt modal to choose continue vs new
      setIsNewGameModalOpen(true);
    } else {
      // First-time start
      saveSystem.startNewInvestigation();
      refreshSaveMetadata();
      beginBootSequence('normal');
    }
  }, [beginBootSequence, refreshSaveMetadata]);

  // Continue Game
  const continueGame = useCallback(() => {
    audioSystem.playMenuSelect();
    setIsNewGameModalOpen(false);
    beginBootSequence('normal');
  }, [beginBootSequence]);

  // Start New Game Confirmed (resets previous progress)
  const startNewGameConfirmed = useCallback(() => {
    audioSystem.playMenuSelect();
    setIsNewGameModalOpen(false);
    saveSystem.startNewInvestigation();
    refreshSaveMetadata();
    beginBootSequence('normal');
  }, [beginBootSequence, refreshSaveMetadata]);

  const closeNewGameModal = useCallback(() => {
    audioSystem.playMenuBack();
    setIsNewGameModalOpen(false);
  }, []);

  const openSettings = useCallback(() => {
    audioSystem.playMenuSelect();
    setGameState('SETTINGS');
  }, []);

  const openHowToPlay = useCallback(() => {
    audioSystem.playMenuSelect();
    setGameState('HOW_TO_PLAY');
  }, []);

  const openCredits = useCallback(() => {
    audioSystem.playMenuSelect();
    setGameState('CREDITS');
  }, []);

  const returnToMainMenu = useCallback(() => {
    audioSystem.playMenuBack();
    setGameState('MAIN_MENU');
    refreshSaveMetadata();
  }, [refreshSaveMetadata]);

  const openExitModal = useCallback(() => {
    audioSystem.playMenuClick();
    setIsExitModalOpen(true);
  }, []);

  const closeExitModal = useCallback(() => {
    audioSystem.playMenuBack();
    setIsExitModalOpen(false);
  }, []);

  // Shutdown sequence:
  // COMPUTER_RUNNING -> COMPUTER_SHUTTING_DOWN -> MAIN_MENU
  const onComputerShutdown = useCallback(() => {
    setGameState('COMPUTER_SHUTTING_DOWN');
    audioSystem.playShutdownRelay();

    // Autosave state
    if (gameSettings.autosaveEnabled) {
      saveSystem.saveCurrentGame('shutdown');
    }

    setTimeout(() => {
      setGameState('MAIN_MENU');
      refreshSaveMetadata();
    }, 2400);
  }, [gameSettings.autosaveEnabled, refreshSaveMetadata]);

  // Restart sequence:
  // COMPUTER_RUNNING -> COMPUTER_RESTARTING -> BOOTING -> COMPUTER_RUNNING
  // MUST NOT return to MAIN_MENU!
  const onComputerRestart = useCallback(() => {
    setGameState('COMPUTER_RESTARTING');
    audioSystem.playShutdownRelay();

    if (gameSettings.autosaveEnabled) {
      saveSystem.saveCurrentGame('restart');
    }

    setTimeout(() => {
      beginBootSequence('restart');
    }, 1800);
  }, [gameSettings.autosaveEnabled, beginBootSequence]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        bootType,
        bootProgress,
        bootLogs,
        gameSettings,
        saveMeta,
        isNewGameModalOpen,
        isExitModalOpen,
        setGameState,
        handleStartGameClick,
        continueGame,
        startNewGameConfirmed,
        closeNewGameModal,
        openSettings,
        openHowToPlay,
        openCredits,
        returnToMainMenu,
        skipBoot,
        openExitModal,
        closeExitModal,
        onComputerShutdown,
        onComputerRestart,
        updateGameSettings,
        resetGameSettings,
        refreshSaveMetadata
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
};
