import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { ForensicReport } from '../../../types/police';
import { storyEngine } from '../../../services/story/storyEngine';

interface AddAnalysisModalProps {
  evidenceId: string;
  evidenceTitle: string;
  onClose: () => void;
  onAdded: (report: ForensicReport) => void;
}

export const AddAnalysisModal: React.FC<AddAnalysisModalProps> = ({
  evidenceId,
  evidenceTitle,
  onClose,
  onAdded
}) => {
  const [reportType, setReportType] = useState<ForensicReport['reportType']>('Fingerprint');
  const [labName, setLabName] = useState('State Police Forensic Laboratory - Forensic Chemistry & Serology Unit');
  const [analystName, setAnalystName] = useState('Dr. Eleanor Ward, Senior Criminalist (PhD)');
  const [methodology, setMethodology] = useState('Gas chromatography–mass spectrometry (GC-MS) & comparative microscopic assay');
  const [findings, setFindings] = useState('');
  const [status, setStatus] = useState<ForensicReport['status']>('COMPLETED');
  const [confidenceScore, setConfidenceScore] = useState<number>(92);
  const [comparisonReference, setComparisonReference] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findings.trim()) return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newReport: ForensicReport = {
      id: `LAB-${Date.now().toString().slice(-6)}`,
      reportType,
      title: `${reportType} Forensic Analysis - Item ${evidenceId}`,
      dateConducted: now.split(' ')[0],
      labName,
      analystName,
      status,
      confidenceScore,
      methodology,
      findings: findings.trim(),
      comparisonReference: comparisonReference.trim() || undefined
    };

    storyEngine.addEvidenceAnalysis(evidenceId, newReport);
    onAdded(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Icon name="FlaskConical" className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
                Log Forensic Laboratory Analysis
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-sm">
                Target: {evidenceId} — {evidenceTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1 font-mono">Analysis Discipline *</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="Fingerprint">Latent Fingerprint / AFIS</option>
                <option value="DNA">DNA / Serology STR Profile</option>
                <option value="Ballistics">Ballistics & Toolmarks</option>
                <option value="Chemical">Toxicology / Chemical Assay</option>
                <option value="Document">Questioned Document & Handwriting</option>
                <option value="Audio">Audio / Signal Analysis</option>
                <option value="Digital">Digital Storage Extraction</option>
                <option value="Other">Trace Materials & Microscopy</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 font-mono">Examination Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="COMPLETED">COMPLETED (Conclusive)</option>
                <option value="INCONCLUSIVE">INCONCLUSIVE (Partial Match)</option>
                <option value="PENDING">PENDING (In Process)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Laboratory Facility</label>
            <input
              type="text"
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1 font-mono">Examiner / Forensic Criminalist</label>
              <input
                type="text"
                value={analystName}
                onChange={(e) => setAnalystName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1 font-mono">Confidence Level ({confidenceScore}%)</label>
              <input
                type="range"
                min="10"
                max="99"
                value={confidenceScore}
                onChange={(e) => setConfidenceScore(Number(e.target.value))}
                className="w-full accent-emerald-500 mt-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Methodology & Instruments</label>
            <input
              type="text"
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Comparison Target / Reference Standard</label>
            <input
              type="text"
              value={comparisonReference}
              onChange={(e) => setComparisonReference(e.target.value)}
              placeholder="e.g. Reference Exemplar: Anna Bell dental chart / Officer Hayes patrol log"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Scientific Findings & Conclusions *</label>
            <textarea
              rows={4}
              required
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              placeholder="Detail observable metrics, striations, allele loci, chemical signatures, or inconsistencies..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-1.5 font-mono"
            >
              <Icon name="Check" className="w-3.5 h-3.5" />
              File Lab Certificate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
