import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { EvidenceRecord, ForensicReport, CustodyTransfer } from '../../../types/police';
import { EvidenceMediaGallery } from './EvidenceMediaGallery';
import { LogTransferModal } from './LogTransferModal';
import { AddAnalysisModal } from './AddAnalysisModal';
import { policeDatabase } from '../../../services/police/databaseEngine';
import { vfs } from '../../../services/vfs';
import { useOS } from '../../../context/OSContext';

interface EvidenceDetailViewProps {
  evidence: EvidenceRecord;
  onBack: () => void;
  onSelectRecord?: (recordId: string) => void;
  onAddToBoard: (evidence: EvidenceRecord, report?: ForensicReport) => void;
  onOpenInBoard: (evidenceId: string) => void;
  onRefresh: () => void;
}

export const EvidenceDetailView: React.FC<EvidenceDetailViewProps> = ({
  evidence,
  onBack,
  onSelectRecord,
  onAddToBoard,
  onOpenInBoard,
  onRefresh
}) => {
  const { openApp } = useOS();
  const [activeTab, setActiveTab] = useState<'overview' | 'custody' | 'forensics' | 'photos' | 'links'>('overview');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Check for discrepancies in chain of custody
  const hasDiscrepancy = (evidence.chainOfCustody || []).some(
    (c) => c.discrepancyNote || c.timestamp.startsWith('2004') || c.action.toLowerCase().includes('tampered')
  );

  const handleExportReceipt = () => {
    try {
      const targetDir = '/home/investigator/Documents/Police Records';
      if (!vfs.getNode(targetDir)) {
        vfs.createDir(targetDir);
      }
      const safeTitle = evidence.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
      const filePath = `${targetDir}/PROPERTY_RECEIPT_${evidence.id}_${safeTitle}.txt`;

      let content = `=========================================================================\n`;
      content += `METROPOLITAN POLICE DEPARTMENT — PROPERTY & EVIDENCE CLERK RECEIPT\n`;
      content += `CERTIFIED CHAIN OF CUSTODY DOCKET // OFFICIAL JUDICIAL RECORD\n`;
      content += `ITEM IDENTIFIER: ${evidence.id}  |  CASE NO: ${evidence.caseId}\n`;
      content += `TIMESTAMP: ${new Date().toISOString()}\n`;
      content += `=========================================================================\n\n`;
      content += `TITLE: ${evidence.title}\n`;
      content += `TYPE: ${evidence.evidenceType}  |  STATUS: ${evidence.status}\n`;
      content += `COLLECTED BY: ${evidence.collectedByOfficerId}\n`;
      content += `DATE / TIME: ${evidence.collectionDate} ${evidence.collectionTime}\n`;
      content += `LOCATION RECOVERED: ${evidence.collectionLocation}\n`;
      content += `STORAGE VAULT: ${evidence.storageLocation}\n\n`;
      content += `PHYSICAL DESCRIPTION:\n${evidence.description}\n\n`;

      content += `-------------------------------------------------------------------------\n`;
      content += `CHRONOLOGICAL CHAIN OF CUSTODY AUDIT TRAIL:\n`;
      content += `-------------------------------------------------------------------------\n`;
      (evidence.chainOfCustody || []).forEach((c, idx) => {
        content += `[${idx + 1}] ${c.timestamp} | ACTION: ${c.action}\n`;
        content += `    FROM: ${c.fromOfficerOrLocation} --> TO: ${c.toOfficerOrLocation}\n`;
        content += `    REASON: ${c.reason}\n`;
        if (c.authorizedBy) content += `    AUTH: ${c.authorizedBy}\n`;
        if (c.discrepancyNote) content += `    *** AUDIT FLAG: ${c.discrepancyNote} ***\n`;
        content += `\n`;
      });

      if (evidence.forensicReports && evidence.forensicReports.length > 0) {
        content += `-------------------------------------------------------------------------\n`;
        content += `CERTIFIED FORENSIC LABORATORY EXAMINATIONS:\n`;
        content += `-------------------------------------------------------------------------\n`;
        evidence.forensicReports.forEach((rep) => {
          content += `REPORT ID: ${rep.id} (${rep.reportType}) | STATUS: ${rep.status}\n`;
          content += `FACILITY: ${rep.labName} | EXAMINER: ${rep.analystName}\n`;
          content += `CONFIDENCE SCORE: ${rep.confidenceScore || 'N/A'}%\n`;
          content += `FINDINGS: ${rep.findings}\n\n`;
        });
      }

      vfs.createFile(filePath, content);
      setExportNotice(`Exported official property receipt to ${filePath}`);
      setTimeout(() => setExportNotice(null), 5000);
    } catch (e) {
      console.error(e);
      setExportNotice('Failed to export receipt.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden select-text">
      {/* Top Action Bar */}
      <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-mono"
          >
            <Icon name="ArrowLeft" className="w-3.5 h-3.5" />
            <span>Repository</span>
          </button>
          <div className="w-px h-5 bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
              {evidence.id}
            </span>
            <span className="font-mono text-xs text-slate-400">
              CASE REF: {evidence.caseId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onAddToBoard(evidence)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Icon name="Pin" className="w-3.5 h-3.5" />
            Pin to Board
          </button>
          <button
            onClick={() => onOpenInBoard(evidence.id)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <Icon name="GitMerge" className="w-3.5 h-3.5" />
            Open in Board
          </button>
          <button
            onClick={() => setShowTransferModal(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <Icon name="ArrowRightLeft" className="w-3.5 h-3.5" />
            Log Transfer
          </button>
          <button
            onClick={() => setShowAnalysisModal(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <Icon name="FlaskConical" className="w-3.5 h-3.5" />
            Add Lab Test
          </button>
          <button
            onClick={handleExportReceipt}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
            title="Generate official property receipt txt file in Documents"
          >
            <Icon name="Download" className="w-3.5 h-3.5" />
            Export Receipt
          </button>
        </div>
      </div>

      {/* Export notification alert */}
      {exportNotice && (
        <div className="bg-blue-950/80 border-b border-blue-800 px-5 py-2 text-xs font-mono text-blue-300 flex items-center gap-2">
          <Icon name="CheckCircle" className="w-4 h-4 text-blue-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Discrepancy Warning Banner */}
      {hasDiscrepancy && (
        <div className="bg-amber-950/40 border-b border-amber-900/60 px-5 py-2.5 flex items-center gap-3">
          <Icon name="AlertTriangle" className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-mono font-bold text-amber-300 uppercase">
              Chain-of-Custody Discrepancy Detected:
            </span>{' '}
            <span className="text-amber-200/90 font-sans">
              This evidence docket contains retroactive entries or post-closure archive modifications (June 2004 audit alteration). Compare against police dispatch records.
            </span>
          </div>
        </div>
      )}

      {/* Evidence Summary Header Card */}
      <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold font-mono text-slate-100 uppercase tracking-wide">
              {evidence.title}
            </h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
              {evidence.evidenceType}
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/50 uppercase">
              {evidence.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans max-w-2xl">
            {evidence.description}
          </p>
        </div>

        {/* Barcode & Storage Coordinates */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-right flex flex-col items-end">
          <div className="text-[10px] text-slate-500">STORAGE VAULT LOCATION</div>
          <div className="text-xs font-bold text-slate-200">{evidence.storageLocation}</div>
          <div className="mt-1 font-mono tracking-widest text-[11px] text-slate-400 border-t border-slate-800/80 pt-1">
            |||||| |||| ||||| |||||||
          </div>
          <div className="text-[9px] text-slate-500">TAG: {evidence.id}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 bg-slate-900/30 border-b border-slate-800 flex items-center gap-6 text-xs font-mono">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Icon name="Info" className="w-3.5 h-3.5" />
          Overview & Recovery
        </button>

        <button
          onClick={() => setActiveTab('custody')}
          className={`py-3 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'custody'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Icon name="ArrowRightLeft" className="w-3.5 h-3.5" />
          Chain of Custody ({evidence.chainOfCustody?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('forensics')}
          className={`py-3 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'forensics'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Icon name="FlaskConical" className="w-3.5 h-3.5" />
          Forensic Lab Reports ({evidence.forensicReports?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`py-3 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'photos'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Icon name="Camera" className="w-3.5 h-3.5" />
          Photographs ({evidence.photos?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('links')}
          className={`py-3 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'links'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Icon name="Link2" className="w-3.5 h-3.5" />
          Cross-References
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-4xl">
            {/* Recovery Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Collection Date & Time</span>
                <p className="text-xs font-mono font-semibold text-slate-200">
                  {evidence.collectionDate} at {evidence.collectionTime}
                </p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Recovery Location</span>
                  <button
                    type="button"
                    onClick={() => openApp('investigation-map', { search: evidence.collectionLocation })}
                    className="text-[10px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                    title="Plot on Northbridge GIS Map"
                  >
                    <Icon name="MapPin" className="w-2.5 h-2.5" />
                    <span>GIS Map</span>
                  </button>
                </div>
                <p className="text-xs font-mono font-semibold text-slate-200">
                  {evidence.collectionLocation}
                </p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Collecting Officer / Tech</span>
                <p className="text-xs font-mono font-semibold text-slate-200">
                  {evidence.collectedByOfficerId}
                </p>
              </div>
            </div>

            {/* Detailed Circumstances */}
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 space-y-3">
              <h3 className="text-xs font-mono font-semibold uppercase text-slate-300 flex items-center gap-2">
                <Icon name="FileText" className="w-4 h-4 text-blue-400" />
                Physical Description & Intake Circumstances
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                {evidence.description}
              </p>
            </div>

            {/* Tags */}
            {evidence.tags && evidence.tags.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400">INDEXED CLASSIFICATION TAGS:</span>
                <div className="flex flex-wrap gap-1.5">
                  {evidence.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Chain of Custody */}
        {activeTab === 'custody' && (
          <div className="space-y-4 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono font-semibold uppercase text-slate-200">
                  Chronological Transfer Log
                </h3>
                <p className="text-[11px] text-slate-400">
                  Every legal movement, extraction, and inspection recorded for this item.
                </p>
              </div>

              <button
                onClick={() => setShowTransferModal(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Icon name="Plus" className="w-3.5 h-3.5" />
                Add Transfer Entry
              </button>
            </div>

            <div className="space-y-3">
              {(evidence.chainOfCustody || []).map((c, index) => (
                <div
                  key={c.id || index}
                  className={`p-4 rounded-xl border transition-all ${
                    c.discrepancyNote
                      ? 'bg-amber-950/20 border-amber-800/80'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-300">
                        {c.timestamp}
                      </span>
                      <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {c.action}
                      </span>
                    </div>
                    {c.authorizedBy && (
                      <span className="font-mono text-[11px] text-slate-400">
                        AUTH: {c.authorizedBy}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">RELINQUISHED BY (FROM):</span>
                      <span>{c.fromOfficerOrLocation}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">RECEIVED BY (TO):</span>
                      <span>{c.toOfficerOrLocation}</span>
                    </div>
                  </div>

                  {c.reason && (
                    <div className="mt-2 text-xs text-slate-400 font-sans italic border-t border-slate-800/40 pt-2">
                      Purpose: {c.reason}
                    </div>
                  )}

                  {c.discrepancyNote && (
                    <div className="mt-2 p-2 bg-amber-950/50 border border-amber-700/50 rounded-lg text-xs font-mono text-amber-300 flex items-start gap-2">
                      <Icon name="AlertTriangle" className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>{c.discrepancyNote}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Forensics */}
        {activeTab === 'forensics' && (
          <div className="space-y-4 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono font-semibold uppercase text-slate-200">
                  Forensic Laboratory Certificates
                </h3>
                <p className="text-[11px] text-slate-400">
                  Chemical assays, latent prints, ballistic striations, and digital recoveries.
                </p>
              </div>

              <button
                onClick={() => setShowAnalysisModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Icon name="Plus" className="w-3.5 h-3.5" />
                Submit New Lab Examination
              </button>
            </div>

            {(!evidence.forensicReports || evidence.forensicReports.length === 0) ? (
              <div className="p-8 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-xl">
                <Icon name="FlaskConical" className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-mono text-slate-400">NO LABORATORY EXAMINATIONS ON FILE</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                  This item has not yet undergone formal forensic scientific testing. Click "Submit New Lab Examination" above to file findings.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {evidence.forensicReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-200">
                          CERTIFICATE #{rep.id}
                        </span>
                        <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 uppercase">
                          {rep.reportType}
                        </span>
                        <span className="font-mono text-[10px] bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/60 uppercase">
                          {rep.status}
                        </span>
                      </div>

                      <button
                        onClick={() => onAddToBoard(evidence, rep)}
                        className="px-2.5 py-1 bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-700/40 rounded text-xs font-mono transition-colors flex items-center gap-1"
                      >
                        <Icon name="Pin" className="w-3 h-3" />
                        Pin Finding to Board
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                      <div>
                        <span className="text-slate-500 block text-[10px]">FACILITY</span>
                        <span className="truncate block">{rep.labName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">EXAMINER</span>
                        <span className="truncate block">{rep.analystName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">DATE</span>
                        <span>{rep.dateConducted}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">CONFIDENCE</span>
                        <span className="text-emerald-400 font-bold">{rep.confidenceScore || 'N/A'}%</span>
                      </div>
                    </div>

                    {rep.methodology && (
                      <div className="text-xs font-mono text-slate-400">
                        <strong className="text-slate-500">METHODOLOGY: </strong>
                        {rep.methodology}
                      </div>
                    )}

                    {rep.comparisonReference && (
                      <div className="text-xs font-mono text-amber-300/90 bg-amber-950/30 p-2 rounded border border-amber-900/40">
                        <strong>REFERENCE STANDARD: </strong> {rep.comparisonReference}
                      </div>
                    )}

                    <div className="text-xs text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap leading-relaxed">
                      <span className="text-[10px] font-mono text-slate-500 block mb-1">
                        EXAMINER'S FORMAL OPINION & METRICS:
                      </span>
                      {rep.findings}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Photographs */}
        {activeTab === 'photos' && (
          <div className="max-w-4xl">
            <EvidenceMediaGallery photos={evidence.photos || []} evidenceTitle={evidence.title} />
          </div>
        )}

        {/* Tab 5: Cross References */}
        {activeTab === 'links' && (
          <div className="space-y-4 max-w-4xl">
            <h3 className="text-xs font-mono font-semibold uppercase text-slate-200">
              Cross-Referenced Cases, Persons & Reports
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Linked Case */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Primary Docket</span>
                <button
                  onClick={() => onSelectRecord && onSelectRecord(evidence.caseId)}
                  className="text-xs font-mono font-bold text-blue-400 hover:text-blue-300 underline text-left block"
                >
                  {evidence.caseId}
                </button>
              </div>

              {/* Linked Persons */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Related Persons of Interest</span>
                {evidence.relatedPersonIds && evidence.relatedPersonIds.length > 0 ? (
                  <div className="space-y-1">
                    {evidence.relatedPersonIds.map((pId) => (
                      <button
                        key={pId}
                        onClick={() => onSelectRecord && onSelectRecord(pId)}
                        className="text-xs font-mono text-blue-400 hover:text-blue-300 underline block"
                      >
                        {pId}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 font-mono">No direct person associations cataloged.</p>
                )}
              </div>

              {/* Linked Reports */}
              {evidence.relatedReportIds && evidence.relatedReportIds.length > 0 && (
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Related Incident Reports</span>
                  <div className="space-y-1">
                    {evidence.relatedReportIds.map((rId) => (
                      <button
                        key={rId}
                        onClick={() => onSelectRecord && onSelectRecord(rId)}
                        className="text-xs font-mono text-blue-400 hover:text-blue-300 underline block"
                      >
                        {rId}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Vehicles */}
              {evidence.relatedVehicleId && (
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Related Vehicle Record</span>
                  <button
                    onClick={() => onSelectRecord && onSelectRecord(evidence.relatedVehicleId!)}
                    className="text-xs font-mono text-blue-400 hover:text-blue-300 underline block"
                  >
                    {evidence.relatedVehicleId}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showTransferModal && (
        <LogTransferModal
          evidenceId={evidence.id}
          evidenceTitle={evidence.title}
          onClose={() => setShowTransferModal(false)}
          onLogged={() => onRefresh()}
        />
      )}

      {showAnalysisModal && (
        <AddAnalysisModal
          evidenceId={evidence.id}
          evidenceTitle={evidence.title}
          onClose={() => setShowAnalysisModal(false)}
          onAdded={() => onRefresh()}
        />
      )}
    </div>
  );
};
