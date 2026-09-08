import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { CustodyTransfer } from '../../../types/police';
import { storyEngine } from '../../../services/story/storyEngine';

interface LogTransferModalProps {
  evidenceId: string;
  evidenceTitle: string;
  onClose: () => void;
  onLogged: (transfer: CustodyTransfer) => void;
}

export const LogTransferModal: React.FC<LogTransferModalProps> = ({
  evidenceId,
  evidenceTitle,
  onClose,
  onLogged
}) => {
  const [action, setAction] = useState('Transfer for Secondary Forensic Examination');
  const [fromLocation, setFromLocation] = useState('Vault B - Cold Case Section');
  const [toLocation, setToLocation] = useState('State Crime Lab - DNA Serology Unit');
  const [reason, setReason] = useState('Comparative STR DNA profiling against victim family reference samples');
  const [authorizedBy, setAuthorizedBy] = useState('Capt. A. Vance (#1042)');
  const [discrepancyNote, setDiscrepancyNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!action.trim()) return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newTransfer: CustodyTransfer = {
      id: `cust_${Date.now()}`,
      timestamp: now,
      action: action.trim(),
      fromOfficerOrLocation: fromLocation.trim(),
      toOfficerOrLocation: toLocation.trim(),
      reason: reason.trim(),
      authorizedBy: authorizedBy.trim(),
      discrepancyNote: discrepancyNote.trim() || undefined
    };

    storyEngine.addCustodyEvent(evidenceId, newTransfer);
    onLogged(newTransfer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Icon name="ArrowRightLeft" className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
                Log Chain-of-Custody Movement
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-sm">
                Item: [{evidenceId}] {evidenceTitle}
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
          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Action / Custody Operation *</label>
            <input
              type="text"
              required
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="e.g. Relocated to Forensic Vault for Audit"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1 font-mono">From (Officer / Facility)</label>
              <input
                type="text"
                required
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 font-mono">To (Officer / Facility)</label>
              <input
                type="text"
                required
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Authorizing Officer / Warrant / Order</label>
            <input
              type="text"
              value={authorizedBy}
              onChange={(e) => setAuthorizedBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Legal Justification / Examination Purpose</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-amber-300 font-medium mb-1 font-mono">
              Audit Note / Noted Discrepancy (Optional)
            </label>
            <textarea
              rows={2}
              value={discrepancyNote}
              onChange={(e) => setDiscrepancyNote(e.target.value)}
              placeholder="Record broken seal, missing counter-signature, or timeline mismatch..."
              className="w-full bg-slate-950 border border-amber-900/60 rounded-lg p-3 text-amber-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-1.5 font-mono"
            >
              <Icon name="Check" className="w-3.5 h-3.5" />
              Certify Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
