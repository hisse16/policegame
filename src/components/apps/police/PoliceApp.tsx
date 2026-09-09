import React, { useState, useEffect, useMemo } from 'react';
import { TopBar } from './components/TopBar';
import { Sidebar, PrisSectionId } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { RecordsListView } from './views/RecordsListView';
import { CaseDetailView } from './views/CaseDetailView';
import { PersonDetailView } from './views/PersonDetailView';
import { EvidenceDetailView } from './views/EvidenceDetailView';
import { ReportDetailView } from './views/ReportDetailView';
import { VehicleDetailView } from './views/VehicleDetailView';
import { OfficerView } from './views/OfficerView';
import { LocationDetailView } from './views/LocationDetailView';
import { GenericRecordView } from './views/GenericRecordView';
import { AdvancedSearchView } from './views/AdvancedSearchView';
import { InvestigationBoardView } from './views/InvestigationBoardView';
import { InvestigationNotebookApp } from '../notebook/InvestigationNotebookApp';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';
import { policeDatabase } from '../../../services/police/databaseEngine';
import { searchEngine } from '../../../services/police/searchEngine';
import { storyEngine } from '../../../services/story/storyEngine';
import { AnyRecord } from '../../../types/police';
import { Icon } from '../../common/Icon';

interface PoliceAppProps { initialCaseId?: string; windowId?: string; params?: Record<string, any>; }
interface HistoryEntry { recordId: string | null; section: PrisSectionId; searchQuery: string; }
interface PrisNavigationState { activeSection: PrisSectionId; selectedRecordId: string | null; historyStack: HistoryEntry[]; searchQuery: string; }

const NAVIGATION_STORAGE_KEY = 'pris_navigation_state_v3';

const loadNavigationState = (): PrisNavigationState => {
  try {
    const stored = localStorage.getItem(NAVIGATION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const legacyHistory = Array.isArray(parsed.historyStack) ? parsed.historyStack : [];
      return {
        activeSection: parsed.activeSection || 'dashboard',
        selectedRecordId: parsed.selectedRecordId || null,
        historyStack: legacyHistory.map((entry: any) => typeof entry === 'string'
          ? { recordId: entry, section: 'cases', searchQuery: '' }
          : { recordId: entry.recordId || null, section: entry.section || 'cases', searchQuery: entry.searchQuery || '' }),
        searchQuery: typeof parsed.searchQuery === 'string' ? parsed.searchQuery : ''
      };
    }
  } catch {}
  return { activeSection: 'dashboard', selectedRecordId: null, historyStack: [], searchQuery: '' };
};

export const PoliceApp: React.FC<PoliceAppProps> = ({ initialCaseId, params }) => {
  const saved = useMemo(loadNavigationState, []);
  const [activeSection, setActiveSection] = useState<PrisSectionId>((params?.section as PrisSectionId) || (initialCaseId ? 'cases' : saved.activeSection));
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(params?.recordId || params?.caseId || initialCaseId || saved.selectedRecordId);
  const [historyStack, setHistoryStack] = useState<HistoryEntry[]>(saved.historyStack);
  const [searchQuery, setSearchQuery] = useState(params?.search || saved.searchQuery);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [, setVersion] = useState(0);

  useEffect(() => {
    try { localStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify({ activeSection, selectedRecordId, historyStack, searchQuery })); } catch {}
  }, [activeSection, selectedRecordId, historyStack, searchQuery]);

  useEffect(() => policeDatabase.subscribe(() => setVersion(v => v + 1)), []);

  const routeSignature = JSON.stringify({ section: params?.section || null, recordId: params?.recordId || null, caseId: params?.caseId || null, personId: params?.personId || null, evidenceId: params?.evidenceId || null, reportId: params?.reportId || null, locationId: params?.locationId || null, vehicleId: params?.vehicleId || null, search: params?.search || null });

  useEffect(() => {
    if (!params) return;
    const targetId = params.recordId || params.caseId || params.personId || params.evidenceId || params.reportId || params.locationId || params.vehicleId;
    if (targetId) handleSelectRecord(targetId, true);
    else if (params.section) handleSelectSection(params.section as PrisSectionId, true);
    if (params.search) { setSearchQuery(params.search); handleSearchSubmit(params.search, true); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeSignature]);

  const handleSelectRecord = (recordId: string, fromRoute = false) => {
    if (!recordId) return;
    policeDatabase.recordView(recordId);
    try { storyEngine.onViewRecord(recordId); } catch (e) { console.warn('[PoliceApp] Story trigger error:', e); }
    if (!fromRoute && selectedRecordId && selectedRecordId !== recordId) {
      setHistoryStack(prev => [...prev, { recordId: selectedRecordId, section: activeSection, searchQuery }]);
    } else if (!fromRoute && !selectedRecordId) {
      // Leaving a register for the first record: preserve that register as the return target.
      setHistoryStack(prev => [...prev, { recordId: null, section: activeSection, searchQuery }]);
    }
    setSelectedRecordId(recordId);
  };

  const handleBack = () => {
    const previous = historyStack[historyStack.length - 1];
    if (previous) {
      setHistoryStack(h => h.slice(0, -1));
      setActiveSection(previous.section);
      setSearchQuery(previous.searchQuery || '');
      setSelectedRecordId(previous.recordId);
      return;
    }
    setSelectedRecordId(null);
  };

  const handleSelectSection = (section: PrisSectionId, fromRoute = false) => {
    if (!fromRoute && (selectedRecordId || activeSection !== section)) {
      setHistoryStack(prev => [...prev, { recordId: selectedRecordId, section: activeSection, searchQuery }]);
    }
    setSelectedRecordId(null);
    setActiveSection(section);
  };

  const handleSearchSubmit = (query: string, fromRoute = false) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    try { storyEngine.onSearchTerm(cleanQuery); } catch (e) { console.warn('[PoliceApp] Story search trigger error:', e); }
    const results = searchEngine.search(cleanQuery);
    if (results.length > 0) handleSelectRecord(results[0].record.id, fromRoute);
    else { setSelectedRecordId(null); setActiveSection('advanced_search'); }
  };

  const handleExportRecord = (record: AnyRecord) => {
    const path = policeDatabase.exportRecordToVfs(record);
    setToastMessage(`Exported official file to: ${path}`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const currentRecord = selectedRecordId ? policeDatabase.getRecord(selectedRecordId) : null;
  const bookmarkCount = policeDatabase.getAllBookmarks().length;

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-mono select-none overflow-hidden relative">
      <TopBar onOpenHelp={() => setShowHelp(true)} onOpenSettings={() => setShowSettings(true)} onSearchSubmit={handleSearchSubmit} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSelectRecord={handleSelectRecord} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeSection={activeSection} onSelectSection={handleSelectSection} bookmarkCount={bookmarkCount} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentRecord ? (
            currentRecord.type === 'case' ? <CaseDetailView caseRecord={currentRecord as any} onSelectRecord={handleSelectRecord} onExportRecord={handleExportRecord} onBack={handleBack} /> :
            currentRecord.type === 'person' ? <PersonDetailView person={currentRecord as any} onSelectRecord={handleSelectRecord} onExportRecord={handleExportRecord} onBack={handleBack} /> :
            currentRecord.type === 'evidence' ? <EvidenceDetailView evidence={currentRecord as any} onSelectRecord={handleSelectRecord} onExportRecord={handleExportRecord} onBack={handleBack} /> :
            currentRecord.type === 'report' ? <ReportDetailView report={currentRecord as any} onSelectRecord={handleSelectRecord} onExportRecord={handleExportRecord} onBack={handleBack} /> :
            currentRecord.type === 'vehicle' ? <VehicleDetailView vehicle={currentRecord as any} onSelectRecord={handleSelectRecord} onExportRecord={handleExportRecord} onBack={handleBack} /> :
            currentRecord.type === 'officer' ? <OfficerView officer={currentRecord as any} onSelectRecord={handleSelectRecord} onExportRecord={handleExportRecord} onBack={handleBack} /> :
            currentRecord.type === 'location' ? <LocationDetailView location={currentRecord as any} onSelectRecord={handleSelectRecord} onExportRecord={handleExportRecord} onBack={handleBack} /> :
            <GenericRecordView record={currentRecord} onSelectRecord={handleSelectRecord} onExportRecord={handleExportRecord} onBack={handleBack} />
          ) : activeSection === 'dashboard' ? <DashboardView onSelectRecord={handleSelectRecord} onNavigateSection={handleSelectSection} />
            : activeSection === 'investigation_notebook' ? <InvestigationNotebookApp onOpenRecord={handleSelectRecord} />
            : activeSection === 'investigation_board' ? <InvestigationBoardView onSelectRecord={handleSelectRecord} />
            : activeSection === 'advanced_search' ? <AdvancedSearchView onSelectRecord={handleSelectRecord} onExportRecord={handleExportRecord} />
            : <RecordsListView sectionId={activeSection} onSelectRecord={handleSelectRecord} onExportRecord={handleExportRecord} />}
        </div>
      </div>
      {toastMessage && <div className="absolute bottom-4 right-4 bg-emerald-950/90 border border-emerald-600/80 text-emerald-200 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50 text-xs"><Icon name="CheckCircle" className="w-5 h-5 text-emerald-400 shrink-0" /><div><div className="font-bold uppercase tracking-wider">OFFICIAL RECORD EXPORTED</div><div className="text-[11px] text-emerald-300/90 font-mono mt-0.5">{toastMessage}</div></div></div>}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};
