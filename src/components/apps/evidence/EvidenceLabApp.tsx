import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '../../common/Icon';
import { useOS } from '../../../context/OSContext';
import { EvidenceRecord, ForensicReport } from '../../../types/police';
import { policeDatabase } from '../../../services/police/databaseEngine';
import { storyEngine } from '../../../services/story/storyEngine';
import { EvidenceListView } from './EvidenceListView';
import { EvidenceDetailView } from './EvidenceDetailView';
import { ForensicAnalysesHub } from './ForensicAnalysesHub';
import { CustodyAuditView } from './CustodyAuditView';
import { AddEvidenceModal } from './AddEvidenceModal';
import { AddAnalysisModal } from './AddAnalysisModal';
import { LogTransferModal } from './LogTransferModal';

interface EvidenceLabAppProps {
  windowId: string;
  params?: Record<string, any>;
}

export const EvidenceLabApp: React.FC<EvidenceLabAppProps> = ({ params }) => {
  const { openApp, sendNotification } = useOS();
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>(() => policeDatabase.getEvidenceRecords());
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(
    params?.evidenceId || params?.recordId || null
  );
  const [activeMainTab, setActiveMainTab] = useState<'inventory' | 'forensics' | 'audit'>('inventory');

  // Modals
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [showAddAnalysis, setShowAddAnalysis] = useState(false);
  const [targetEvidenceForModal, setTargetEvidenceForModal] = useState<EvidenceRecord | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Sync from policeDatabase
  const reloadData = useCallback(() => {
    setEvidenceList([...policeDatabase.getEvidenceRecords()]);
  }, []);

  useEffect(() => {
    const unsub = policeDatabase.subscribe(() => {
      reloadData();
    });
    return () => unsub();
  }, [reloadData]);

  useEffect(() => {
    if (params?.evidenceId) {
      setSelectedEvidenceId(params.evidenceId);
    } else if (params?.recordId) {
      const rec = policeDatabase.getRecord(params.recordId);
      if (rec && rec.type === 'evidence') {
        setSelectedEvidenceId(params.recordId);
      }
    }
  }, [params]);

  const selectedEvidence = selectedEvidenceId
    ? (evidenceList.find((e) => e.id === selectedEvidenceId) || (policeDatabase.getRecord(selectedEvidenceId) as EvidenceRecord | null))
    : null;

  // When investigator views evidence, track view in storyEngine
  useEffect(() => {
    if (selectedEvidenceId) {
      storyEngine.onViewRecord(selectedEvidenceId);
    }
  }, [selectedEvidenceId]);

  const handleAddToBoard = (evidence: EvidenceRecord, report?: ForensicReport) => {
    const reportTypeStr = (report?.reportType || report?.type || 'REPORT').toUpperCase();
    const facilityStr = report ? (report.labName || report.laboratory || 'Forensics Lab') : '';
    const label = report ? `LAB: ${reportTypeStr} (${evidence.id})` : `ITEM ${evidence.id}`;
    const noteText = report
      ? `CERTIFICATE ${report.id} [${report.status}]\n${report.findings}\nFacility: ${facilityStr}`
      : `${evidence.title}\nStatus: ${evidence.status || evidence.currentStatus || 'IN_STORAGE'}\nLocation: ${evidence.collectionLocation}\nVault: ${evidence.storageLocation}`;

    storyEngine.createBoardNode({
      recordId: evidence.id,
      label,
      noteText,
      nodeType: report ? 'analysis' : 'evidence',
      evidenceId: evidence.id,
      color: report ? '#10b981' : '#3b82f6'
    });

    sendNotification(
      'Pinned to Board',
      `Evidence item [${evidence.id}] was pinned to your Investigation Board corkboard.`,
      'success'
    );
  };

  const handleOpenInBoard = (evidenceId: string) => {
    openApp('investigation-board', { focusRecordId: evidenceId });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* Top Application Bar */}
      <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Icon name="Microscope" className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <span>EVIDENCE & FORENSICS LAB</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                CRIMINAL ARCHIVE SEC-07
              </span>
            </h1>
            <p className="text-[10px] font-mono text-slate-400">
              PHYSICAL EVIDENCE LOCKER // CHAIN OF CUSTODY // SCIENTIFIC ANALYSIS
            </p>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => {
              setSelectedEvidenceId(null);
              setActiveMainTab('inventory');
            }}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeMainTab === 'inventory' && !selectedEvidence
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon name="Box" className="w-3.5 h-3.5" />
            <span>Locker ({evidenceList.length})</span>
          </button>

          <button
            onClick={() => {
              setSelectedEvidenceId(null);
              setActiveMainTab('forensics');
            }}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeMainTab === 'forensics' && !selectedEvidence
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon name="FlaskConical" className="w-3.5 h-3.5" />
            <span>Forensics Hub</span>
          </button>

          <button
            onClick={() => {
              setSelectedEvidenceId(null);
              setActiveMainTab('audit');
            }}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeMainTab === 'audit' && !selectedEvidence
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon name="ShieldAlert" className="w-3.5 h-3.5" />
            <span>Custody Audit</span>
          </button>
        </div>

        {/* Quick Launch Board Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openApp('investigation-board')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 border border-slate-700"
            title="Open standalone Investigation Board"
          >
            <Icon name="GitMerge" className="w-3.5 h-3.5 text-amber-400" />
            <span>Investigation Board</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden p-4">
        {selectedEvidence ? (
          <EvidenceDetailView
            evidence={selectedEvidence}
            onBack={() => setSelectedEvidenceId(null)}
            onSelectRecord={(recId) => {
              const rec = policeDatabase.getRecord(recId);
              if (rec && rec.type === 'evidence') {
                setSelectedEvidenceId(recId);
              } else {
                openApp('police-records', { recordId: recId });
              }
            }}
            onAddToBoard={handleAddToBoard}
            onOpenInBoard={handleOpenInBoard}
            onRefresh={reloadData}
          />
        ) : activeMainTab === 'inventory' ? (
          <EvidenceListView
            evidenceList={evidenceList}
            onSelectEvidence={(id) => setSelectedEvidenceId(id)}
            onOpenAddModal={() => setShowAddEvidence(true)}
            onAddToBoard={handleAddToBoard}
          />
        ) : activeMainTab === 'forensics' ? (
          <ForensicAnalysesHub
            evidenceList={evidenceList}
            onSelectEvidence={(id) => setSelectedEvidenceId(id)}
            onRequestNewAnalysis={() => {
              if (evidenceList.length > 0) {
                setTargetEvidenceForModal(evidenceList[0]);
                setShowAddAnalysis(true);
              }
            }}
            onAddToBoard={handleAddToBoard}
          />
        ) : (
          <CustodyAuditView
            evidenceList={evidenceList}
            onSelectEvidence={(id) => setSelectedEvidenceId(id)}
            onLogTransfer={(ev) => {
              setTargetEvidenceForModal(ev);
              setShowTransferModal(true);
            }}
          />
        )}
      </div>

      {/* Global Modals */}
      {showAddEvidence && (
        <AddEvidenceModal
          onClose={() => setShowAddEvidence(false)}
          onCreated={(ev) => {
            reloadData();
            setSelectedEvidenceId(ev.id);
            sendNotification('Evidence Docket Created', `Registered ${ev.id} in PRIS.`, 'success');
          }}
        />
      )}

      {showAddAnalysis && targetEvidenceForModal && (
        <AddAnalysisModal
          evidenceId={targetEvidenceForModal.id}
          evidenceTitle={targetEvidenceForModal.title}
          onClose={() => {
            setShowAddAnalysis(false);
            setTargetEvidenceForModal(null);
          }}
          onAdded={() => {
            reloadData();
            sendNotification('Laboratory Report Filed', `Forensic analysis filed for ${targetEvidenceForModal.id}`, 'success');
          }}
        />
      )}

      {showTransferModal && targetEvidenceForModal && (
        <LogTransferModal
          evidenceId={targetEvidenceForModal.id}
          evidenceTitle={targetEvidenceForModal.title}
          onClose={() => {
            setShowTransferModal(false);
            setTargetEvidenceForModal(null);
          }}
          onLogged={() => {
            reloadData();
            sendNotification('Custody Transfer Recorded', `Movement logged for ${targetEvidenceForModal.id}`, 'info');
          }}
        />
      )}
    </div>
  );
};
