import React, { useState } from 'react';
import { Icon } from '../../../common/Icon';
import { EvidenceRecord, AnyRecord } from '../../../../types/police';
import { policeDatabase } from '../../../../services/police/databaseEngine';

interface EvidenceDetailViewProps {
  evidence: EvidenceRecord;
  onSelectRecord: (id: string) => void;
  onExportRecord: (record: AnyRecord) => void;
  onBack: () => void;
}

export const EvidenceDetailView: React.FC<EvidenceDetailViewProps> = ({
  evidence,
  onSelectRecord,
  onExportRecord,
  onBack
}) => {
  const [newNote, setNewNote] = useState('');
  const isBookmarked = policeDatabase.isBookmarked(evidence.id);
  const notes = policeDatabase.getNotesForRecord(evidence.id);
  const officer = policeDatabase.getRecord(evidence.collectedByOfficerId);
  const linkedCase = policeDatabase.getRecord(evidence.caseId);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    policeDatabase.addNote(evidence.id, 'Det. S. Miller (#4081)', newNote.trim());
    setNewNote('');
  };

  return (
    <div className="flex-1 h-full flex flex-col select-none bg-slate-900/60 overflow-hidden font-mono">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
            >
              <Icon name="ArrowLeft" className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span>/</span>
            <span>EVIDENCE REPOSITORY</span>
            <span>/</span>
            <span className="text-slate-200 font-bold">{evidence.evidenceId}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => policeDatabase.toggleBookmark(evidence.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-colors ${
                isBookmarked
                  ? 'bg-amber-950/60 border-amber-700 text-amber-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon name="Bookmark" className="w-3.5 h-3.5" />
              <span>{isBookmarked ? 'BOOKMARKED' : 'BOOKMARK'}</span>
            </button>

            <button
              onClick={() => onExportRecord(evidence)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            >
              <Icon name="Download" className="w-3.5 h-3.5" />
              <span>EXPORT PROPERTY FORM</span>
            </button>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-slate-100">{evidence.evidenceId}</span>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-800">
                {evidence.evidenceType}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                STATUS: {evidence.status}
              </span>
            </div>
            <h1 className="text-sm font-semibold text-slate-300 mt-1">{evidence.title}</h1>
          </div>

          <div className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1">
            <div>
              <span className="text-slate-500">VAULT / LOCKER: </span>
              <span className="text-emerald-400 font-bold">{evidence.storageLocation}</span>
            </div>
            <div>
              <span className="text-slate-500">ATTACHED TO: </span>
              <button
                onClick={() => linkedCase && onSelectRecord(linkedCase.id)}
                className="text-blue-400 hover:underline font-bold"
              >
                {evidence.caseId}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-900/40 max-w-5xl">
        {/* Physical Description Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Icon name="FileText" className="w-4 h-4 text-blue-400" />
            <span>Physical Evidence Description & Intake</span>
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded border border-slate-800">
            {evidence.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">COLLECTED BY</span>
              <button
                onClick={() => officer && onSelectRecord(officer.id)}
                className="text-blue-400 font-bold hover:underline"
              >
                {officer ? officer.title : evidence.collectedByOfficerId}
              </button>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">DATE & TIME SECURED</span>
              <span className="text-slate-200 font-semibold">{evidence.collectionDate}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">COLLECTION LOCATION</span>
              <span className="text-slate-200 font-semibold">{evidence.collectionLocation}</span>
            </div>
          </div>
        </div>

        {/* Chain of Custody Ledger */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Icon name="ShieldCheck" className="w-4 h-4 text-emerald-400" />
            <span>Chain of Custody Transfer Ledger</span>
          </h3>
          <div className="border border-slate-800 rounded-md overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3 font-semibold">TIMESTAMP</th>
                  <th className="py-2 px-3 font-semibold">ACTION</th>
                  <th className="py-2 px-3 font-semibold">TRANSFERRED FROM</th>
                  <th className="py-2 px-3 font-semibold">TRANSFERRED TO</th>
                  <th className="py-2 px-3 font-semibold">PURPOSE / NOTES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950/60">
                {evidence.chainOfCustody.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2 px-3 text-slate-300 whitespace-nowrap">{c.timestamp}</td>
                    <td className="py-2 px-3 font-bold text-blue-400">{c.action}</td>
                    <td className="py-2 px-3 text-slate-300">{c.fromOfficerOrLocation}</td>
                    <td className="py-2 px-3 text-slate-200 font-medium">{c.toOfficerOrLocation}</td>
                    <td className="py-2 px-3 text-slate-400">{c.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forensic / Lab Analysis if present */}
        {evidence.labAnalysis && (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Icon name="Activity" className="w-4 h-4 text-cyan-400" />
              <span>Crime Laboratory Forensic Analysis Report</span>
            </h3>
            <div className="p-4 rounded bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">
                  EXAMINING SCIENTIST: <strong className="text-slate-200">{evidence.labAnalysis.analyst}</strong>
                </span>
                <span className="text-slate-400 font-mono">{evidence.labAnalysis.completedDate}</span>
              </div>
              <p className="text-slate-200 leading-relaxed pt-1 whitespace-pre-line">
                {evidence.labAnalysis.findings}
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Detective Observations & Chain Inquiries
          </h3>
          <form onSubmit={handleAddNote} className="space-y-3 mb-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Record forensic discrepancy, custody verification or testing request..."
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-hidden focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
            >
              SAVE NOTE
            </button>
          </form>

          <div className="space-y-2">
            {notes.map((n) => (
              <div key={n.id} className="p-3 rounded bg-slate-900 border border-slate-800 text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-bold text-slate-300">{n.author}</span>
                  <span>{n.timestamp}</span>
                </div>
                <p className="text-slate-200">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
