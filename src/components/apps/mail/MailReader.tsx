import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { EmailThread, PoliceEmail, DirectoryContact } from '../../../types/mail';
import { useOS } from '../../../context/OSContext';
import { policeMailEngine } from '../../../services/police/policeMailEngine';
import { ContactProfileModal } from './ContactProfileModal';

interface MailReaderProps {
  thread: EmailThread;
  onToggleStar: (emailId: string) => void;
  onPinToBoard: (emailId: string) => void;
  onDeleteThread: (threadId: string) => void;
  onArchiveThread: (threadId: string) => void;
  onReply: (toEmail: PoliceEmail) => void;
  onForward?: (thread: EmailThread) => void;
  onComposeTo?: (contact: DirectoryContact) => void;
  onFilterEmailHistory?: (query: string) => void;
}

export const MailReader: React.FC<MailReaderProps> = ({
  thread,
  onToggleStar,
  onPinToBoard,
  onDeleteThread,
  onArchiveThread,
  onReply,
  onForward,
  onComposeTo,
  onFilterEmailHistory
}) => {
  const { openApp, addNotification } = useOS();
  const [pinnedMap, setPinnedMap] = useState<Record<string, boolean>>({});
  const [activeContactModal, setActiveContactModal] = useState<DirectoryContact | null>(null);

  const handleOpenContact = (person: { name: string; email: string; rank?: string; badge?: string; department?: string }) => {
    const existing = policeMailEngine.getDirectoryContact(person.email);
    if (existing) {
      setActiveContactModal(existing);
    } else {
      setActiveContactModal({
        id: `TEMP-${person.email}`,
        name: person.name,
        email: person.email,
        rank: person.rank || 'Officer',
        department: person.department || 'Northbridge Police Department',
        division: 'Internal Review',
        role: person.rank ? `${person.rank} / Investigator` : 'Department Personnel',
        badgeNumber: person.badge,
        phoneExt: '401',
        directPhone: '(555) 382-3400',
        officeLocation: 'NPD Headquarters',
        status: 'ACTIVE',
        supervisor: 'Command Staff',
        employmentPeriod: '1995 - Present',
        deskAssignment: 'Station Desk',
        clearanceLevel: 'LEVEL 3'
      });
    }
  };

  const handleRecordClick = (recordId: string) => {
    if (recordId.startsWith('CASE-')) {
      openApp('police-records', { recordId, tab: 'cases' });
    } else if (recordId.startsWith('EV-') || recordId.startsWith('E-')) {
      openApp('evidence-lab', { evidenceId: recordId });
    } else if (recordId.startsWith('LOC-')) {
      openApp('investigation-map', { locationId: recordId });
    } else {
      openApp('police-records', { recordId });
    }
  };

  const handlePin = (emailId: string) => {
    onPinToBoard(emailId);
    setPinnedMap((prev) => ({ ...prev, [emailId]: true }));
    addNotification({
      title: 'Pinned to Investigation Board',
      message: `Email "${thread.subject}" added as investigative evidence node.`,
      type: 'info'
    });
  };

  const renderBodyWithLinks = (text: string) => {
    // Regex matches common ID formats in PRIS & NPD files:
    // CASE-1998-027, R-1998-112, INC-1998-1142, EV-1998-027-014, OFF-3014, VEH-TXR481, LOC-CANAL-RD, etc.
    const tokenRegex = /\b(CASE-\d{4}-\d+|R-\d{4}-\d+|INC-\d{4}-\d+|EV-\d{4}-\d+-\d+|E-\d+|OFF-\d+|P-\d+|VEH-[A-Z0-9]+|LOC-[A-Z0-9-]+|SEC-[A-Z0-9-]+|FA-\d{4}-\d+)\b/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[1];
      parts.push(
        <button
          key={`${match.index}-${token}`}
          type="button"
          onClick={() => handleRecordClick(token)}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 my-0.5 text-blue-400 bg-blue-950/60 hover:bg-blue-900/80 border border-blue-800/80 rounded font-mono font-semibold transition-colors text-[11px] underline decoration-blue-500/50 hover:decoration-blue-300"
          title={`Click to inspect ${token} in Police System`}
        >
          <Icon name="ExternalLink" className="w-2.5 h-2.5 opacity-70" />
          {token}
        </button>
      );
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/90 text-slate-200 overflow-hidden font-sans relative">
      {/* Top Action Header */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-800/80 bg-slate-900/70 select-none">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onReply(thread.messages[thread.messages.length - 1])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow transition-colors"
          >
            <Icon name="Reply" className="w-3.5 h-3.5" />
            <span>Reply</span>
          </button>

          {onForward && (
            <button
              type="button"
              onClick={() => onForward(thread)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <Icon name="Share2" className="w-3.5 h-3.5 text-slate-400" />
              <span>Forward</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handlePin(thread.messages[thread.messages.length - 1].id)}
            disabled={pinnedMap[thread.messages[thread.messages.length - 1].id]}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-colors ${
              pinnedMap[thread.messages[thread.messages.length - 1].id]
                ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300 cursor-default'
                : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200'
            }`}
          >
            <Icon name="Pin" className="w-3.5 h-3.5" />
            <span>
              {pinnedMap[thread.messages[thread.messages.length - 1].id]
                ? 'Pinned to Board'
                : 'Pin to Board'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onToggleStar(thread.messages[thread.messages.length - 1].id)}
            className={`p-1.5 rounded hover:bg-slate-800 text-slate-400 ${
              thread.isStarred ? 'text-amber-400' : ''
            }`}
            title="Star Thread"
          >
            <Icon name="Star" className="w-4 h-4 fill-current" />
          </button>

          <button
            type="button"
            onClick={() => onArchiveThread(thread.threadId)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            title="Archive Thread"
          >
            <Icon name="Archive" className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDeleteThread(thread.threadId)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400"
            title="Move to Trash"
          >
            <Icon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security Classification Banner */}
      {thread.classification !== 'UNCLASSIFIED' && (
        <div
          className={`py-1 px-4 text-center font-mono text-[10px] tracking-widest uppercase font-bold border-b select-none ${
            thread.classification === 'RESTRICTED / INTERNAL AFFAIRS'
              ? 'bg-red-950/90 text-red-300 border-red-800'
              : 'bg-amber-950/80 text-amber-200 border-amber-800'
          }`}
        >
          *** {thread.classification} — LAW ENFORCEMENT INTERNAL USE ONLY ***
        </div>
      )}

      {/* Thread Title & Case Metadata */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-base font-semibold text-slate-100 font-sans tracking-wide">
            {thread.subject}
          </h2>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {thread.relatedCaseIds?.map((cid) => (
              <button
                key={cid}
                type="button"
                onClick={() => handleRecordClick(cid)}
                className="px-2 py-0.5 bg-blue-950/80 border border-blue-800 text-blue-300 rounded font-mono text-xs hover:bg-blue-900 transition-colors"
                title="Open Case File in PRIS"
              >
                {cid}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {thread.messages.map((email) => {
          const isLatest = email.id === thread.messages[thread.messages.length - 1].id;

          return (
            <div
              key={email.id}
              className={`rounded-lg border transition-all ${
                isLatest
                  ? 'border-slate-750 bg-slate-900/80 shadow-md'
                  : 'border-slate-800/80 bg-slate-900/40'
              }`}
            >
              {/* Message Header */}
              <div className="p-4 border-b border-slate-800/80 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenContact(email.from)}
                    className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-blue-400 cursor-pointer transition-transform active:scale-95"
                    title={`Inspect ${email.from.name} Dossier`}
                  >
                    {email.from.name.charAt(0)}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenContact(email.from)}
                        className="font-semibold text-sm text-slate-200 hover:text-blue-400 underline decoration-dotted transition-colors text-left"
                        title={`Click to view ${email.from.name} profile & investigative actions`}
                      >
                        {email.from.rank ? `${email.from.rank} ` : ''}
                        {email.from.name}
                      </button>
                      {email.from.badge && (
                        <button
                          type="button"
                          onClick={() => handleOpenContact(email.from)}
                          className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded border border-slate-700 transition-colors"
                        >
                          Badge #{email.from.badge}
                        </button>
                      )}
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      <span className="text-blue-400 hover:underline cursor-pointer" onClick={() => handleOpenContact(email.from)}>
                        &lt;{email.from.email}&gt;
                      </span>
                      {email.from.department && ` • ${email.from.department}`}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-400">To:</span>
                      {email.to.map((to, i) => (
                        <span
                          key={i}
                          onClick={() => handleOpenContact(to)}
                          className="font-mono text-slate-300 hover:text-blue-300 cursor-pointer underline decoration-slate-600 hover:decoration-blue-400"
                          title="Click to view recipient dossier"
                        >
                          {to.name} &lt;{to.email}&gt;
                          {i < email.to.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                      {email.cc && email.cc.length > 0 && (
                        <>
                          <span className="text-slate-400 ml-2">Cc:</span>
                          {email.cc.map((cc, i) => (
                            <span
                              key={i}
                              onClick={() => handleOpenContact(cc)}
                              className="font-mono text-slate-400 hover:text-blue-300 cursor-pointer"
                              title="Click to view CC recipient dossier"
                            >
                              {cc.name}
                              {i < email.cc.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs font-mono text-slate-400">{email.date}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {email.id}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-5 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line select-text">
                {renderBodyWithLinks(email.body)}
              </div>

              {/* Attachments */}
              {email.attachments && email.attachments.length > 0 && (
                <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 rounded-b-lg">
                  <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center gap-1.5">
                    <Icon name="Paperclip" className="w-3.5 h-3.5" />
                    <span>SECURE EVIDENCE ATTACHMENTS ({email.attachments.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {email.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon name="FileText" className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-mono font-medium text-slate-200 truncate">
                              {att.name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {att.size} • {att.mimeType}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {att.relatedRecordId && (
                            <button
                              type="button"
                              onClick={() => handleRecordClick(att.relatedRecordId!)}
                              className="px-2 py-1 rounded bg-blue-900/60 hover:bg-blue-800 border border-blue-700 text-[10px] font-mono text-blue-200 transition-colors"
                            >
                              Inspect
                            </button>
                          )}
                          {att.filePath && (
                            <button
                              type="button"
                              onClick={() => openApp('text-editor', { path: att.filePath })}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-mono text-slate-300 transition-colors"
                            >
                              Open
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Personnel Dossier Modal */}
      {activeContactModal && (
        <ContactProfileModal
          contact={activeContactModal}
          onClose={() => setActiveContactModal(null)}
          onComposeTo={(contact) => {
            setActiveContactModal(null);
            onComposeTo?.(contact);
          }}
          onFilterEmailHistory={(query) => {
            setActiveContactModal(null);
            onFilterEmailHistory?.(query);
          }}
        />
      )}
    </div>
  );
};
