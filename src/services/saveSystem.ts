import { GAME_CONFIG } from '../config/gameConfig';
import { SaveMetadata } from '../types/game';
import { vfs } from './vfs';
import { browserDb } from './browserDatabase';
import { policeDatabase } from './police/databaseEngine';
import { DISCOVERY_STEPS } from './story/storyData';

const SAVE_META_KEY = 'case27_investigation_meta';
const PLAYTIME_KEY = 'case27_investigation_playtime';
const STORY_STATE_KEY = 'investigator_os_story_state_v1';

class SaveSystem {
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

  /**
   * StoryEngine owns narrative state. SaveSystem derives the displayed
   * progress from that canonical state instead of keeping a second counter.
   */
  private getCanonicalStoryProgress(): number {
    try {
      const raw = localStorage.getItem(STORY_STATE_KEY);
      if (!raw || DISCOVERY_STEPS.length === 0) return 0;

      const parsed = JSON.parse(raw);
      const discovered = Array.isArray(parsed.discoveredStepIds) ? parsed.discoveredStepIds : [];
      const validDiscoveredCount = discovered.filter((id: unknown) =>
        typeof id === 'string' && DISCOVERY_STEPS.some((step) => step.id === id)
      ).length;

      return Math.min(100, Math.round((validDiscoveredCount / DISCOVERY_STEPS.length) * 100));
    } catch {
      return 0;
    }
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
        storyProgress: this.getCanonicalStoryProgress(),
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

      // 2. Count unique evidence IDs across VFS and PRIS.
      const evidenceFiles = vfs.listDir('/home/investigator/Documents/Case_27_Evidence') || [];
      const evidenceRecords = policeDatabase.getEvidenceRecords();
      const evidenceIds = new Set<string>();

      evidenceFiles.forEach((file) => {
        if (file.type === 'file') evidenceIds.add(`vfs:${file.id}`);
      });
      evidenceRecords.forEach((record) => evidenceIds.add(`pris:${record.id}`));

      const totalEvidence = evidenceIds.size;

      // 3. Update playtime
      const totalPlaytime = this.savePlaytime();

      // 4. Save metadata. Narrative progress is derived from StoryEngine state.
      const meta: SaveMetadata = {
        hasSave: true,
        timestamp: new Date().toISOString(),
        caseTitle: GAME_CONFIG.title,
        caseNumber: GAME_CONFIG.caseNumber,
        playtimeSeconds: totalPlaytime,
        storyProgress: this.getCanonicalStoryProgress(),
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
      // Reset case data while preserving player preferences/settings.
      vfs.resetToDefaults();

      browserDb.clearHistory();
      browserDb.downloads = [];
      browserDb.save();

      // Reset case-specific state only. Settings are intentionally preserved.
      localStorage.removeItem('pris_database_persistence_v2');
      localStorage.removeItem(STORY_STATE_KEY);

      this.accumulatedPlaytime = 0;
      this.sessionStartTime = Date.now();
      localStorage.removeItem(PLAYTIME_KEY);

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
      localStorage.removeItem(STORY_STATE_KEY);
      sessionStorage.removeItem('securix_initial_boot');
    } catch {}
  }

  /** Returns the canonical narrative progress as a percentage. */
  public getStoryProgress(): number {
    return this.getCanonicalStoryProgress();
  }

  /**
   * Kept for API compatibility with older callers. Narrative progress is no
   * longer writable from SaveSystem; StoryEngine is the single source of truth.
   */
  public setStoryProgress(_val: number) {
    this.saveCurrentGame('story_progress_sync');
  }
}

export const saveSystem = new SaveSystem();
