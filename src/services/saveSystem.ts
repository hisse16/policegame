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
      if (stored) this.accumulatedPlaytime = parseInt(stored, 10) || 0;
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
    return this.accumulatedPlaytime + Math.floor((Date.now() - this.sessionStartTime) / 1000);
  }

  private readStoryState(): any | null {
    try {
      const raw = localStorage.getItem(STORY_STATE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /** StoryEngine owns narrative state; SaveSystem derives progress from it. */
  private getCanonicalStoryProgress(): number {
    const parsed = this.readStoryState();
    if (!parsed || DISCOVERY_STEPS.length === 0) return 0;

    const discovered = Array.isArray(parsed.discoveredStepIds) ? parsed.discoveredStepIds : [];
    const validIds = new Set(
      discovered.filter((id: unknown) =>
        typeof id === 'string' && DISCOVERY_STEPS.some((step) => step.id === id)
      )
    );
    return Math.min(100, Math.round((validIds.size / DISCOVERY_STEPS.length) * 100));
  }

  private getCanonicalEvidenceCount(): number {
    try {
      const evidenceFiles = vfs.listDir('/home/investigator/Documents/Case_27_Evidence') || [];
      const evidenceRecords = policeDatabase.getEvidenceRecords();
      const ids = new Set<string>();
      evidenceFiles.forEach((file) => {
        if (file.type === 'file') ids.add(file.id);
      });
      evidenceRecords.forEach((record) => ids.add(record.id));
      return ids.size;
    } catch {
      return 0;
    }
  }

  public hasSave(): boolean {
    try {
      return Boolean(localStorage.getItem(SAVE_META_KEY));
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
        playtimeSeconds: typeof parsed.playtimeSeconds === 'number' ? parsed.playtimeSeconds : this.getPlaytimeSeconds(),
        storyProgress: this.getCanonicalStoryProgress(),
        evidenceCount: this.getCanonicalEvidenceCount()
      };
    } catch {
      return null;
    }
  }

  public saveCurrentGame(reason: string = 'autosave') {
    try {
      browserDb.save();
      policeDatabase.savePersistence();
      const totalPlaytime = this.savePlaytime();
      const meta: SaveMetadata = {
        hasSave: true,
        timestamp: new Date().toISOString(),
        caseTitle: GAME_CONFIG.title,
        caseNumber: GAME_CONFIG.caseNumber,
        playtimeSeconds: totalPlaytime,
        storyProgress: this.getCanonicalStoryProgress(),
        evidenceCount: this.getCanonicalEvidenceCount()
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
      vfs.resetToDefaults();
      browserDb.clearHistory();
      browserDb.downloads = [];
      browserDb.save();
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
        evidenceCount: 0
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

  public getStoryProgress(): number {
    return this.getCanonicalStoryProgress();
  }

  /** Deprecated compatibility shim. Narrative progress cannot be assigned externally. */
  public setStoryProgress(_val: number) {
    console.warn('[SaveSystem] setStoryProgress is deprecated; StoryEngine owns narrative progress.');
    this.saveCurrentGame('story_progress_sync');
  }
}

export const saveSystem = new SaveSystem();
