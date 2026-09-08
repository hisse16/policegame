import React, { useState, useEffect } from 'react';
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

interface PoliceAppProps {
  initialCaseId?: string;
}

export const PoliceApp: React.FC<PoliceAppProps> = ({ initialCaseId }) => {
  const [activeSection, setActiveSection] = useState<PrisSectionId>('dashboard');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(initialCaseId || null);
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [, setVersion] = useState(0);

  // Subscribe to database engine updates (bookmarks, notes, story events)
  useEffect(() => {
    const unsub = policeDatabase.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  const handleSelectRecord = (recordId: string) => {
    policeDatabase.recordView(recordId);
    try {
      storyEngine.onViewRecord(recordId);
    } catch (e) {
      console.warn('[PoliceApp] Story trigger error:', e);
    }
    if (selectedRecordId && selectedRecordId !== recordId) {
      setHistoryStack((prev) => [...prev, selectedRecordId]);
    }
    setSelectedRecordId(recordId);
  };

  const handleBack = () => {
    if (historyStack.length > 0) {
      const prev = historyStack[historyStack.length - 1];
      setHistoryStack((h) => h.slice(0, h.length - 1));
      setSelectedRecordId(prev);
    } else {
      setSelectedRecordId(null);
    }
  };

  const handleSelectSection = (section: PrisSectionId) => {
    setSelectedRecordId(null);
    setHistoryStack([]);
    setActiveSection(section);
  };

  const handleSearchSubmit = (query: string) => {
    try {
      storyEngine.onSearchTerm(query);
    } catch (e) {
      console.warn('[PoliceApp] Story search trigger error:', e);
    }
    const results = searchEngine.search(query);
    if (results.length > 0) {
      handleSelectRecord(results[0].record.id);
    } else {
      setActiveSection('advanced_search');
    }
  };

  const handleExportRecord = (record: AnyRecord) => {
    const path = policeDatabase.exportRecordToVfs(record);
    setToastMessage(`Exported official file to: ${path}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Resolve selected record
  const currentRecord = selectedRecordId ? policeDatabase.getRecord(selectedRecordId) : null;
  const bookmarkCount = policeDatabase.getAllBookmarks().length;

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-mono select-none overflow-hidden relative">
      {/* Top Application Bar */}
      <TopBar
        onOpenHelp={() => setShowHelp(true)}
        onOpenSettings={() => setShowSettings(true)}
        onSearchSubmit={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectRecord={handleSelectRecord}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
          bookmarkCount={bookmarkCount}
        />

        {/* Dynamic Main Stage View */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentRecord ? (
            // Render specific record detail view based on type
            currentRecord.type === 'case' ? (
              <CaseDetailView
                caseRecord={currentRecord as any}
                onSelectRecord={handleSelectRecord}
                onExportRecord={handleExportRecord}
                onBack={handleBack}
              />
            ) : currentRecord.type === 'person' ? (
              <PersonDetailView
                person={currentRecord as any}
                onSelectRecord={handleSelectRecord}
                onExportRecord={handleExportRecord}
                onBack={handleBack}
              />
            ) : currentRecord.type === 'evidence' ? (
              <EvidenceDetailView
                evidence={currentRecord as any}
                onSelectRecord={handleSelectRecord}
                onExportRecord={handleExportRecord}
                onBack={handleBack}
              />
            ) : currentRecord.type === 'report' ? (
              <ReportDetailView
                report={currentRecord as any}
                onSelectRecord={handleSelectRecord}
                onExportRecord={handleExportRecord}
                onBack={handleBack}
              />
            ) : currentRecord.type === 'vehicle' ? (
              <VehicleDetailView
                vehicle={currentRecord as any}
                onSelectRecord={handleSelectRecord}
                onExportRecord={handleExportRecord}
                onBack={handleBack}
              />
            ) : currentRecord.type === 'officer' ? (
              <OfficerView
                officer={currentRecord as any}
                onSelectRecord={handleSelectRecord}
                onExportRecord={handleExportRecord}
                onBack={handleBack}
              />
            ) : currentRecord.type === 'location' ? (
              <LocationDetailView
                location={currentRecord as any}
                onSelectRecord={handleSelectRecord}
                onExportRecord={handleExportRecord}
                onBack={handleBack}
              />
            ) : (
              <GenericRecordView
                record={currentRecord}
                onSelectRecord={handleSelectRecord}
                onExportRecord={handleExportRecord}
                onBack={handleBack}
              />
            )
          ) : activeSection === 'dashboard' ? (
            <DashboardView
              onSelectRecord={handleSelectRecord}
              onNavigateSection={handleSelectSection}
            />
          ) : activeSection === 'investigation_notebook' ? (
            <InvestigationNotebookApp onOpenRecord={handleSelectRecord} />
          ) : activeSection === 'investigation_board' ? (
            <InvestigationBoardView onSelectRecord={handleSelectRecord} />
          ) : activeSection === 'advanced_search' ? (
            <AdvancedSearchView
              onSelectRecord={handleSelectRecord}
              onExportRecord={handleExportRecord}
            />
          ) : (
            <RecordsListView
              sectionId={activeSection}
              onSelectRecord={handleSelectRecord}
              onExportRecord={handleExportRecord}
            />
          )}
        </div>
      </div>

      {/* Floating VFS Export Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-4 right-4 bg-emerald-950/90 border border-emerald-600/80 text-emerald-200 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50 text-xs animate-in fade-in slide-in-from-bottom-2">
          <Icon name="CheckCircle" className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold uppercase tracking-wider">OFFICIAL RECORD EXPORTED</div>
            <div className="text-[11px] text-emerald-300/90 font-mono mt-0.5">{toastMessage}</div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};
