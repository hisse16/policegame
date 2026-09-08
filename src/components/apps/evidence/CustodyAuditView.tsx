import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { EvidenceRecord, CustodyTransfer } from '../../../types/police';

interface CustodyAuditViewProps {
  evidenceList: EvidenceRecord[];
  onSelectEvidence: (id: string) => void;
  onLogTransfer: (evidence: EvidenceRecord) => void;
}

export const CustodyAuditView: React.FC<CustodyAuditViewProps> = ({
  evidenceList,
  onSelectEvidence,
  onLogTransfer
}) => {
  const [filterDiscrepanciesOnly, setFilterDiscrepanciesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all custody events with evidence metadata
  const allCustodyEvents: Array<{
    evidence: EvidenceRecord;
    transfer: CustodyTransfer;
    isDiscrepancy: boolean;
    discrepancyNote?: string;
  }> = [];

  evidenceList.forEach((ev) => {
    (ev.chainOfCustody || []).forEach((c) => {
      let isDiscrepancy = Boolean(c.discrepancyNote);
      let discrepancyNote = c.discrepancyNote;

      // Check for year 2004 unauthorized alteration
      if (c.timestamp.startsWith('2004') || c.action.toLowerCase().includes('tampered') || c.action.toLowerCase().includes('retroactive')) {
        isDiscrepancy = true;
        discrepancyNote = discrepancyNote || 'CRITICAL: Post-closure record modification outside standard judicial retention cycle.';
      }

      // Check for missing officer signature or not found
      if (c.toOfficerOrLocation.toLowerCase().includes('not found') || c.reason.toLowerCase().includes('gap') || c.reason.toLowerCase().includes('missing')) {
        isDiscrepancy = true;
        discrepancyNote = discrepancyNote || 'AUDIT FLAGGED: Chain-of-custody transfer location unaccounted for.';
      }

      allCustodyEvents.push({
        evidence: ev,
        transfer: c,
        isDiscrepancy,
        discrepancyNote
      });
    });
  });

  // Sort chronologically descending
  allCustodyEvents.sort((a, b) => b.transfer.timestamp.localeCompare(a.transfer.timestamp));

  const filteredEvents = allCustodyEvents.filter((item) => {
    if (filterDiscrepanciesOnly && !item.isDiscrepancy) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEv = item.evidence.title.toLowerCase().includes(q) || item.evidence.id.toLowerCase().includes(q);
      const matchAction = item.transfer.action.toLowerCase().includes(q);
      const matchParty = (item.transfer.fromOfficerOrLocation + item.transfer.toOfficerOrLocation).toLowerCase().includes(q);
      if (!matchEv && !matchAction && !matchParty) return false;
    }
    return true;
  });

  const discrepancyCount = allCustodyEvents.filter((e) => e.isDiscrepancy).length;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="ShieldAlert" className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold font-mono text-slate-100 uppercase">
              Chain-of-Custody Chronological Audit Ledger
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Total custody actions logged: {allCustodyEvents.length} | Audit flags detected: {discrepancyCount}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-slate-300 select-none">
            <input
              type="checkbox"
              checked={filterDiscrepanciesOnly}
              onChange={(e) => setFilterDiscrepanciesOnly(e.target.checked)}
              className="accent-amber-500 rounded"
            />
            <span>Show Discrepancies Only ({discrepancyCount})</span>
          </label>
        </div>
      </div>

      {/* Filter / Search input */}
      <div className="relative">
        <Icon name="Search" className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter custody ledger by evidence item, officer, location, action..."
          className="w-full bg-slate-900/60 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Audit Table / Timeline */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/60 shadow-inner">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500 font-mono text-xs">
            <Icon name="FileCheck" className="w-8 h-8 mb-2 opacity-50" />
            No custody events match the current filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 text-xs">
            {filteredEvents.map((item, idx) => (
              <div
                key={`${item.evidence.id}_${item.transfer.id}_${idx}`}
                className={`p-3.5 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                  item.isDiscrepancy
                    ? 'bg-amber-950/20 hover:bg-amber-950/30 border-l-4 border-l-amber-500'
                    : 'hover:bg-slate-900/40 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-slate-400 font-semibold">{item.transfer.timestamp}</span>
                    <span className="font-mono font-bold text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/50">
                      {item.evidence.id}
                    </span>
                    <button
                      onClick={() => onSelectEvidence(item.evidence.id)}
                      className="font-medium text-slate-200 hover:text-blue-300 hover:underline text-left truncate max-w-sm"
                    >
                      {item.evidence.title}
                    </button>
                    {item.isDiscrepancy && (
                      <span className="bg-amber-900/60 text-amber-300 border border-amber-600/50 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1">
                        <Icon name="AlertTriangle" className="w-3 h-3" />
                        AUDIT DISCREPANCY
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span>
                      <strong className="text-slate-500">ACTION:</strong> {item.transfer.action}
                    </span>
                    <span>
                      <strong className="text-slate-500">FROM:</strong> {item.transfer.fromOfficerOrLocation}
                    </span>
                    <span>
                      <strong className="text-slate-500">TO:</strong> {item.transfer.toOfficerOrLocation}
                    </span>
                    {item.transfer.authorizedBy && (
                      <span>
                        <strong className="text-slate-500">AUTH:</strong> {item.transfer.authorizedBy}
                      </span>
                    )}
                  </div>

                  {item.transfer.reason && (
                    <p className="text-[11px] text-slate-400 font-sans italic">
                      "{item.transfer.reason}"
                    </p>
                  )}

                  {item.discrepancyNote && (
                    <div className="bg-amber-950/50 border border-amber-800/60 rounded-lg p-2 text-[11px] text-amber-200 font-mono flex items-start gap-2 mt-1">
                      <Icon name="AlertCircle" className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>{item.discrepancyNote}</span>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onSelectEvidence(item.evidence.id)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono transition-colors flex items-center gap-1"
                  >
                    <Icon name="FileText" className="w-3 h-3" />
                    Inspect
                  </button>
                  <button
                    onClick={() => onLogTransfer(item.evidence)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs font-mono transition-colors flex items-center gap-1"
                  >
                    <Icon name="ArrowRightLeft" className="w-3 h-3" />
                    Transfer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
