import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { EvidenceRecord, ForensicReport } from '../../../types/police';

interface ForensicAnalysesHubProps {
  evidenceList: EvidenceRecord[];
  onSelectEvidence: (id: string) => void;
  onRequestNewAnalysis: () => void;
  onAddToBoard: (evidence: EvidenceRecord, report?: ForensicReport) => void;
}

export const ForensicAnalysesHub: React.FC<ForensicAnalysesHubProps> = ({
  evidenceList,
  onSelectEvidence,
  onRequestNewAnalysis,
  onAddToBoard
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all forensic reports alongside their evidence item
  const allReports: Array<{ evidence: EvidenceRecord; report: ForensicReport }> = [];
  evidenceList.forEach((ev) => {
    (ev.forensicReports || []).forEach((rep) => {
      allReports.push({ evidence: ev, report: rep });
    });
  });

  // Sort by date conducted descending
  allReports.sort((a, b) => b.report.dateConducted.localeCompare(a.report.dateConducted));

  const filteredReports = allReports.filter(({ evidence, report }) => {
    if (selectedDiscipline !== 'ALL' && report.reportType !== selectedDiscipline) return false;
    if (selectedStatus !== 'ALL' && report.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEv = evidence.title.toLowerCase().includes(q) || evidence.id.toLowerCase().includes(q);
      const matchRep = report.id.toLowerCase().includes(q) || report.findings.toLowerCase().includes(q) || report.analystName.toLowerCase().includes(q);
      if (!matchEv && !matchRep) return false;
    }
    return true;
  });

  const getDisciplineIcon = (type: ForensicReport['reportType']) => {
    switch (type) {
      case 'DNA':
        return 'Dna';
      case 'Fingerprint':
        return 'Fingerprint';
      case 'Ballistics':
        return 'Target';
      case 'Chemical':
        return 'FlaskConical';
      case 'Document':
        return 'FileText';
      case 'Audio':
        return 'Volume2';
      case 'Digital':
        return 'HardDrive';
      default:
        return 'Microscope';
    }
  };

  const getStatusBadge = (status: ForensicReport['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1">
            <Icon name="CheckCircle2" className="w-3 h-3 text-emerald-400" />
            COMPLETED
          </span>
        );
      case 'INCONCLUSIVE':
        return (
          <span className="bg-amber-950/80 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1">
            <Icon name="HelpCircle" className="w-3 h-3 text-amber-400" />
            INCONCLUSIVE
          </span>
        );
      case 'PENDING':
        return (
          <span className="bg-sky-950/80 text-sky-300 border border-sky-700/50 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1">
            <Icon name="Clock" className="w-3 h-3 text-sky-400" />
            IN QUEUE
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="Microscope" className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold font-mono text-slate-100 uppercase">
              Forensic Science Division & Laboratory Reports Repository
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Indexed laboratory examinations: {allReports.length} | Filtered: {filteredReports.length}
          </p>
        </div>

        <button
          onClick={onRequestNewAnalysis}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Icon name="PlusCircle" className="w-3.5 h-3.5" />
          Request Lab Examination
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Icon name="Search" className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search findings, criminalist, cert #, comparison..."
            className="w-full bg-slate-900/70 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={selectedDiscipline}
          onChange={(e) => setSelectedDiscipline(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Disciplines ({allReports.length})</option>
          <option value="DNA">DNA / Serology</option>
          <option value="Fingerprint">Latent Fingerprints / AFIS</option>
          <option value="Ballistics">Ballistics & Toolmarks</option>
          <option value="Chemical">Chemical / Toxicology</option>
          <option value="Document">Questioned Documents</option>
          <option value="Audio">Audio / Signal Analysis</option>
          <option value="Digital">Digital Storage</option>
          <option value="Other">Trace Materials</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="INCONCLUSIVE">Inconclusive</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {/* Reports Grid */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
            <Icon name="Microscope" className="w-8 h-8 mb-2 opacity-50" />
            No laboratory reports match the selected filters.
          </div>
        ) : (
          filteredReports.map(({ evidence, report }) => (
            <div
              key={report.id}
              className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all shadow-sm space-y-3"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name={getDisciplineIcon(report.reportType)} className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-slate-200 uppercase tracking-wide">
                        CERTIFICATE {report.id}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {report.reportType.toUpperCase()}
                      </span>
                      {getStatusBadge(report.status)}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 font-mono">
                      <span>FOR ITEM:</span>
                      <button
                        onClick={() => onSelectEvidence(evidence.id)}
                        className="text-blue-400 hover:text-blue-300 underline font-semibold"
                      >
                        [{evidence.id}] {evidence.title}
                      </button>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAddToBoard(evidence, report)}
                    className="px-2.5 py-1 bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-700/40 rounded text-xs font-mono transition-colors flex items-center gap-1"
                    title="Pin lab finding to the Investigation Board"
                  >
                    <Icon name="Pin" className="w-3 h-3" />
                    Pin to Board
                  </button>
                  <button
                    onClick={() => onSelectEvidence(evidence.id)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono transition-colors flex items-center gap-1"
                  >
                    <Icon name="FileSearch" className="w-3 h-3" />
                    Inspect Docket
                  </button>
                </div>
              </div>

              {/* Lab Metadata Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">FACILITY</span>
                  <span className="truncate block" title={report.labName}>
                    {report.labName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">EXAMINER</span>
                  <span className="truncate block" title={report.analystName}>
                    {report.analystName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">DATE CONDUCTED</span>
                  <span>{report.dateConducted}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">CONFIDENCE SCORE</span>
                  <span className="text-emerald-400 font-bold">
                    {report.confidenceScore ? `${report.confidenceScore}% (Statistically Valid)` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Methodology */}
              {report.methodology && (
                <div className="text-xs font-mono text-slate-400">
                  <span className="text-slate-500 font-semibold">METHODOLOGY: </span>
                  {report.methodology}
                </div>
              )}

              {/* Comparison target */}
              {report.comparisonReference && (
                <div className="text-xs font-mono text-amber-300/90 bg-amber-950/30 px-2.5 py-1.5 rounded border border-amber-900/40 flex items-center gap-2">
                  <Icon name="GitCompare" className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>
                    <strong>REFERENCE EXEMPLAR:</strong> {report.comparisonReference}
                  </span>
                </div>
              )}

              {/* Scientific Findings */}
              <div className="text-xs text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap leading-relaxed">
                <span className="text-[10px] font-mono text-slate-500 block mb-1">
                  OFFICIAL SCIENTIFIC FINDINGS & OPINION:
                </span>
                {report.findings}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
