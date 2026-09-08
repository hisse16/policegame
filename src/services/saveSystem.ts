import { GAME_CONFIG } from '../config/gameConfig';
import { SaveMetadata } from '../types/game';
import { vfs } from './vfs';
import { browserDb } from './browserDatabase';
import { policeDatabase } from './police/databaseEngine';

const SAVE_META_KEY = 'case27_investigation_meta';
const PLAYTIME_KEY = 'case27_investigation_playtime';

class SaveSystem {
  private storyProgress = 0;
  private evidenceCount = 4; // Initial case documents on workstation
  private sessionStartTime = Date.now();
  private accumulatedPlaytime = 0;

  constructor() {
    this.loadPlaytime();
  }

  private loadPlaytime() {
    try {
      const stored = localStorage.getItem(PLAYTIME_KEY);
      if (stored) {
        this.accumulatedPlaytime = parseInt(stored, 10) || 0;
      }
    } catch {}
  }

  private savePlaytime() {
    try {
      const currentSessionSeconds = Math.floor((Date.now() - this.sessionStartTime) / 1000);
      const total = this.accumulatedPlaytime + currentSessionSeconds;
      localStorage.setItem(PLAYTIME_KEY, total.toString());
      return total;
    } catch {
      return this.accumulatedPlaytime;
    }
  }

  public getPlaytimeSeconds(): number {
    const currentSessionSeconds = Math.floor((Date.now() - this.sessionStartTime) / 1000);
    return this.accumulatedPlaytime + currentSessionSeconds;
  }

  public hasSave(): boolean {
    try {
      const meta = localStorage.getItem(SAVE_META_KEY);
      return Boolean(meta);
    } catch {
      return false;
    }
  }

  public getSaveMetadata(): SaveMetadata | null {
    try {
      const raw = localStorage.getItem(SAVE_META_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return {
        hasSave: true,
        timestamp: parsed.timestamp || new Date().toISOString(),
        caseTitle: parsed.caseTitle || GAME_CONFIG.title,
        caseNumber: parsed.caseNumber || GAME_CONFIG.caseNumber,
        playtimeSeconds: parsed.playtimeSeconds || this.getPlaytimeSeconds(),
        storyProgress: parsed.storyProgress ?? 0,
        evidenceCount: parsed.evidenceCount ?? 4
      };
    } catch {
      return null;
    }
  }

  public saveCurrentGame(reason: string = 'autosave') {
    try {
      // 1. Sync browser and police databases
      browserDb.save();
      policeDatabase.savePersistence();

      // 2. Count current case documents/evidence files in VFS
      const evidenceFiles = vfs.listDir('/home/investigator/Documents/Case_27_Evidence');
      const totalEvidence = (evidenceFiles ? evidenceFiles.length : 0) + policeDatabase.getEvidenceRecords().length;

      // 3. Update playtime
      const totalPlaytime = this.savePlaytime();

      // 4. Save metadata
      const meta: SaveMetadata = {
        hasSave: true,
        timestamp: new Date().toISOString(),
        caseTitle: GAME_CONFIG.title,
        caseNumber: GAME_CONFIG.caseNumber,
        playtimeSeconds: totalPlaytime,
        storyProgress: this.storyProgress,
        evidenceCount: totalEvidence
      };

      localStorage.setItem(SAVE_META_KEY, JSON.stringify(meta));
      console.log(`[SaveSystem] Investigation state saved (${reason})`);
      return true;
    } catch (e) {
      console.error('[SaveSystem] Failed to save state:', e);
      return false;
    }
  }

  public startNewInvestigation(): void {
    try {
      // Reset VFS to clean initial state
      vfs.resetToDefaults();

      // Reset browser state
      browserDb.clearHistory();
      browserDb.downloads = [];
      browserDb.save();

      // Reset OS settings & police database
      localStorage.removeItem('investigator_os_settings');
      localStorage.removeItem('pris_database_persistence_v2');
      localStorage.removeItem('investigator_os_story_state_v1');

      // Reset playtime & story
      this.accumulatedPlaytime = 0;
      this.sessionStartTime = Date.now();
      localStorage.removeItem(PLAYTIME_KEY);
      this.storyProgress = 0;

      // Create fresh initial save record
      const meta: SaveMetadata = {
        hasSave: true,
        timestamp: new Date().toISOString(),
        caseTitle: GAME_CONFIG.title,
        caseNumber: GAME_CONFIG.caseNumber,
        playtimeSeconds: 0,
        storyProgress: 0,
        evidenceCount: 4
      };
      localStorage.setItem(SAVE_META_KEY, JSON.stringify(meta));
      sessionStorage.removeItem('securix_initial_boot');
    } catch (e) {
      console.error('[SaveSystem] Error creating new investigation:', e);
    }
  }

  public resetAllProgress(): void {
    try {
      localStorage.removeItem(SAVE_META_KEY);
      localStorage.removeItem(PLAYTIME_KEY);
      vfs.resetToDefaults();
      browserDb.clearHistory();
      browserDb.downloads = [];
      browserDb.save();
      localStorage.removeItem('investigator_os_settings');
      localStorage.removeItem('pris_database_persistence_v2');
      localStorage.removeItem('investigator_os_story_state_v1');
      sessionStorage.removeItem('securix_initial_boot');
    } catch {}
  }

  public getStoryProgress(): number {
    return this.storyProgress;
  }

  public setStoryProgress(val: number) {
    this.storyProgress = val;
    this.saveCurrentGame(`story_progress_${val}`);
  }
}

export const saveSystem = new SaveSystem();
