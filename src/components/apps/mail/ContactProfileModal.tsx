import React from 'react';
import { Icon } from '../../common/Icon';
import { DirectoryContact } from '../../../types/mail';
import { useOS } from '../../../context/OSContext';
import { storyEngine } from '../../../services/story/storyEngine';

interface ContactProfileModalProps {
  contact: DirectoryContact;
  onClose: () => void;
  onComposeTo?: (contact: DirectoryContact) => void;
  onFilterEmailHistory?: (query: string) => void;
}

export const ContactProfileModal: React.FC<ContactProfileModalProps> = ({
  contact,
  onClose,
  onComposeTo,
  onFilterEmailHistory
}) => {
  const { openApp, addNotification } = useOS();

  const handleOpenPoliceRecord = () => {
    if (contact.officerId) {
      openApp('police-records', { recordId: contact.officerId });
      onClose();
    } else {
      openApp('police-records', { search: contact.name });
      onClose();
    }
  };

  const handleOpenCaseAssociations = () => {
    openApp('police-records', { caseId: 'CASE-1998-027', tab: 'cases' });
    onClose();
  };

  const handleOpenOrgRecord = () => {
    // If contact is from Crownline or Bell Electronics or Metro Police
    if (contact.department.toLowerCase().includes('crownline')) {
      openApp('police-records', { recordId: 'ORG-CROWNLINE' });
    } else if (contact.department.toLowerCase().includes('bell')) {
      openApp('police-records', { recordId: 'ORG-BELL-ELEC' });
    } else {
      openApp('police-records', { search: 'Metropolitan Police Department' });
    }
    onClose();
  };

  const handleViewEmailHistory = () => {
    if (onFilterEmailHistory) {
      onFilterEmailHistory(contact.email || contact.name);
    }
    onClose();
  };

  const handleAddToBoard = () => {
    storyEngine.createBoardNode({
      recordId: contact.officerId || `CONT-${contact.id}`,
      label: `${contact.rank ? `${contact.rank} ` : ''}${contact.name}`.toUpperCase(),
      subtitle: `${contact.department} • Badge #${contact.badgeNumber || 'N/A'}`,
      noteText: `[PERSONNEL DOSSIER]\nRole: ${contact.role}\nDivision: ${contact.division}\nClearance: ${contact.clearanceLevel}\nOffice: ${contact.officeLocation}\nEmail: ${contact.email}\nPhone: ${contact.directPhone} (Ext: ${contact.phoneExt})\n\nNotes: ${contact.notes || 'None logged.'}`,
      nodeType: 'person',
      color: '#3b82f6'
    });

    addNotification({
      title: 'Pinned to Investigation Board',
      message: `${contact.name} (${contact.role}) added to investigation corkboard.`,
      type: 'info'
    });
  };

  const handleSendMemo = () => {
    if (onComposeTo) {
      onComposeTo(contact);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col text-slate-200 select-text">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-slate-300 font-bold">
              NPD PERSONNEL DOSSIER // DIRECTORY CARD
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Identity banner */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-mono font-bold text-xl text-blue-400 flex-shrink-0 shadow-inner">
              {contact.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-100 tracking-wide">
                  {contact.rank ? `${contact.rank} ` : ''}
                  {contact.name}
                </h2>
                {contact.badgeNumber && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    Badge #{contact.badgeNumber}
                  </span>
                )}
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    contact.status === 'ACTIVE'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : contact.status === 'TRANSFERRED'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {contact.status}
                </span>
              </div>

              <div className="text-xs font-mono text-blue-400 mt-1">
                {contact.role}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {contact.department} • {contact.division}
              </div>
            </div>
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/80 p-4 rounded-lg border border-slate-800/80">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Clearance Rating</span>
              <span className="text-amber-400 font-bold">{contact.clearanceLevel}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Station / Office</span>
              <span className="text-slate-200">{contact.officeLocation}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Direct Line & Ext</span>
              <span className="text-slate-200">{contact.directPhone} (Ext: {contact.phoneExt})</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Supervisor</span>
              <span className="text-slate-200">{contact.supervisor || 'Office of Chief of Police'}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Department Email</span>
              <span className="text-blue-300 font-semibold select-all">{contact.email}</span>
            </div>
          </div>

          {/* Notes */}
          {contact.notes && (
            <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                Personnel Remarks & Administrative Record:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
                "{contact.notes}"
              </p>
            </div>
          )}

          {/* Action Links Bar */}
          <div className="space-y-2 pt-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
              Cross-System Investigative Actions:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={handleOpenPoliceRecord}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-left"
              >
                <Icon name="Database" className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-white">Open Police Record</div>
                  <div className="text-[10px] text-slate-400 truncate">Inspect full PRIS officer file</div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleOpenCaseAssociations}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-left"
              >
                <Icon name="Briefcase" className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-white">Case Associations</div>
                  <div className="text-[10px] text-slate-400 truncate">Related Case 27 filings</div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleOpenOrgRecord}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-left"
              >
                <Icon name="Building" className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-white">Organization Record</div>
                  <div className="text-[10px] text-slate-400 truncate">Parent division or agency</div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleViewEmailHistory}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-left"
              >
                <Icon name="Mail" className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-white">View Email History</div>
                  <div className="text-[10px] text-slate-400 truncate">Filter inbox for messages</div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleAddToBoard}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-left"
              >
                <Icon name="Pin" className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-white">Add to Board</div>
                  <div className="text-[10px] text-slate-400 truncate">Pin person to corkboard</div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleSendMemo}
                className="flex items-center gap-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 transition-colors text-left shadow"
              >
                <Icon name="Send" className="w-4 h-4 text-blue-100 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold">Send Dispatch Memo</div>
                  <div className="text-[10px] text-blue-200 truncate">Open composer addressed here</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
