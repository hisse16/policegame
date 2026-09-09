import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { DirectoryContact, PoliceEmailContact, PoliceEmailPriority, SecurityClassification } from '../../../types/mail';

interface ComposeMailModalProps {
  initialRecipient?: DirectoryContact | null;
  initialSubject?: string;
  initialThreadId?: string;
  directory: DirectoryContact[];
  onClose: () => void;
  onSend: (data: {
    to: PoliceEmailContact[];
    subject: string;
    body: string;
    priority: PoliceEmailPriority;
    classification: SecurityClassification;
    threadId?: string;
  }) => void;
}

export const ComposeMailModal: React.FC<ComposeMailModalProps> = ({
  initialRecipient,
  initialSubject = '',
  initialThreadId,
  directory,
  onClose,
  onSend
}) => {
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(
    initialRecipient?.id || directory[0]?.id || ''
  );
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState<PoliceEmailPriority>('NORMAL');
  const [classification, setClassification] = useState<SecurityClassification>('LAW ENFORCEMENT SENSITIVE');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    const recipient = directory.find((c) => c.id === selectedRecipientId);
    if (!recipient) return;

    onSend({
      to: [
        {
          name: recipient.name,
          email: recipient.email,
          rank: recipient.rank,
          badge: recipient.badgeNumber,
          department: recipient.department
        }
      ],
      subject: subject.trim(),
      body: body.trim(),
      priority,
      classification,
      threadId: initialThreadId
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Icon name="Mail" className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-100 font-mono">
              COMPOSE OFFICIAL POLICE MEMORANDUM
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="flex-1 flex flex-col overflow-y-auto p-5 space-y-3.5">
          {/* Recipient */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Recipient (NPD Roster):
            </label>
            <select
              value={selectedRecipientId}
              onChange={(e) => setSelectedRecipientId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
            >
              {directory.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.rank} {c.name} — {c.role} ({c.department})
                </option>
              ))}
            </select>
          </div>

          {/* Classification & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Security Classification:
              </label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value as SecurityClassification)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="UNCLASSIFIED">UNCLASSIFIED</option>
                <option value="LAW ENFORCEMENT SENSITIVE">LAW ENFORCEMENT SENSITIVE</option>
                <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                <option value="RESTRICTED / INTERNAL AFFAIRS">RESTRICTED / INTERNAL AFFAIRS</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Priority:
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PoliceEmailPriority)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="LOW">LOW</option>
                <option value="NORMAL">NORMAL</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Subject Line:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. INQUIRY: Canal Road Dispatch CAD Tape Recovery..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col">
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Memorandum Text:
            </label>
            <textarea
              required
              rows={8}
              placeholder="Enter official statement, investigative query, or audit finding. References to records (e.g. CASE-1998-027, EV-1998-027-014, LOC-0042) will be hyperlinked."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full flex-1 p-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="text-[10px] font-mono text-slate-500">
              Sender: Det. S. Miller #4081 (Workstation 07)
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-mono transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium shadow-md transition-colors flex items-center gap-1.5"
              >
                <Icon name="Send" className="w-3.5 h-3.5" />
                <span>Transmit Memo</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
