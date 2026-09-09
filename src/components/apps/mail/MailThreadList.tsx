import React, { useState, useEffect } from 'react';
import { Icon } from '../../common/Icon';
import { EmailThread, MailFolder, PoliceEmail } from '../../../types/mail';
import { useOS } from '../../../context/OSContext';

interface MailThreadListProps {
  threads: EmailThread[];
  selectedThreadId: string | null;
  activeFolder: MailFolder;
  onSelectThread: (threadId: string) => void;
  onToggleStar: (e: React.MouseEvent, emailId: string) => void;
  onReply?: (email: PoliceEmail) => void;
  onForward?: (thread: EmailThread) => void;
  onArchive?: (threadId: string) => void;
  onPinToBoard?: (emailId: string) => void;
}

interface ContextMenuState {
  x: number;
  y: number;
  thread: EmailThread;
}

export const MailThreadList: React.FC<MailThreadListProps> = ({
  threads,
  selectedThreadId,
  activeFolder,
  onSelectThread,
  onToggleStar,
  onReply,
  onForward,
  onArchive,
  onPinToBoard
}) => {
  const { openApp, addNotification } = useOS();
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  useEffect(() => {
    const handleClose = () => setContextMenu(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, thread: EmailThread) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      thread
    });
  };

  const handleCopyReference = (thread: EmailThread) => {
    const ref = `[EMAIL-REF: ${thread.threadId} // "${thread.subject}"]`;
    navigator.clipboard?.writeText(ref);
    addNotification({
      title: 'Reference Copied',
      message: `Copied ${thread.threadId} reference to clipboard.`,
      type: 'info'
    });
  };

  const handleOpenSenderRecord = (thread: EmailThread) => {
    const latest = thread.messages[thread.messages.length - 1];
    if (latest.from.badge) {
      openApp('police-records', { search: latest.from.name });
    } else {
      openApp('police-records', { search: latest.from.name });
    }
  };

  const handleOpenCase = (thread: EmailThread) => {
    const caseId = thread.relatedCaseIds?.[0] || 'CASE-1998-027';
    openApp('police-records', { caseId, tab: 'cases' });
  };

  const handleOpenAttachment = (thread: EmailThread) => {
    const msgWithAtt = thread.messages.find((m) => m.attachments && m.attachments.length > 0);
    const att = msgWithAtt?.attachments?.[0];
    if (att) {
      if (att.relatedRecordId) {
        if (att.relatedRecordId.startsWith('EV-') || att.relatedRecordId.startsWith('E-')) {
          openApp('evidence-lab', { evidenceId: att.relatedRecordId });
        } else {
          openApp('police-records', { recordId: att.relatedRecordId });
        }
      } else if (att.filePath) {
        openApp('text-editor', { path: att.filePath });
      }
    }
  };

  if (threads.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 font-mono text-xs">
        <Icon name="Inbox" className="w-8 h-8 mb-2 opacity-30 text-slate-400" />
        <p className="font-semibold uppercase tracking-wider text-slate-400">NO CORRESPONDENCE FOUND</p>
        <p className="text-[11px] text-slate-500 mt-1">No messages recorded in folder [{activeFolder.toUpperCase()}].</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 bg-slate-950/70 select-none relative">
      {threads.map((thread) => {
        const isSelected = thread.threadId === selectedThreadId;
        const latestMsg = thread.messages[thread.messages.length - 1];
        const hasUnread = thread.unreadCount > 0;
        const sender = latestMsg.from;
        const hasAttachment = thread.messages.some((m) => m.attachments && m.attachments.length > 0);

        return (
          <div
            key={thread.threadId}
            onClick={() => onSelectThread(thread.threadId)}
            onContextMenu={(e) => handleContextMenu(e, thread)}
            className={`p-3.5 cursor-pointer transition-all duration-150 relative group ${
              isSelected
                ? 'bg-slate-850 bg-slate-800/90 border-l-4 border-l-blue-500 text-slate-100 shadow-inner'
                : hasUnread
                ? 'bg-slate-900/90 font-semibold hover:bg-slate-850/80 text-slate-200'
                : 'hover:bg-slate-900/50 text-slate-300'
            }`}
          >
            {/* Top row: Sender, Badges, Date */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                {hasUnread && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" title="Unread message" />
                )}
                <span
                  className={`text-xs truncate font-mono ${
                    hasUnread ? 'font-bold text-blue-300' : 'text-slate-200'
                  }`}
                >
                  {sender.rank ? `${sender.rank} ` : ''}
                  {sender.name}
                </span>

                {thread.messageCount > 1 && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-400 font-mono">
                    {thread.messageCount}
                  </span>
                )}
              </div>

              <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
                {thread.lastMessageDate.split(' ')[0]}
              </span>
            </div>

            {/* Subject */}
            <div className="flex items-center justify-between gap-2">
              <h4
                className={`text-xs truncate ${
                  hasUnread ? 'font-bold text-slate-100' : 'font-medium text-slate-300'
                }`}
              >
                {thread.subject}
              </h4>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {hasAttachment && (
                  <Icon name="Paperclip" className="w-3 h-3 text-slate-400" />
                )}
                <button
                  type="button"
                  onClick={(e) => onToggleStar(e, latestMsg.id)}
                  className={`p-0.5 rounded transition-colors ${
                    thread.isStarred
                      ? 'text-amber-400'
                      : 'text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100'
                  }`}
                  title={thread.isStarred ? 'Unstar' : 'Star'}
                >
                  <Icon name="Star" className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-[11px] text-slate-400/90 truncate mt-1 line-clamp-1 font-sans">
              {latestMsg.body.replace(/\n+/g, ' ')}
            </p>

            {/* Classification and Case Tags */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {latestMsg.classification !== 'UNCLASSIFIED' && (
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase border ${
                    latestMsg.classification === 'RESTRICTED / INTERNAL AFFAIRS'
                      ? 'bg-red-950/80 text-red-300 border-red-800/80'
                      : 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                  }`}
                >
                  {latestMsg.classification === 'RESTRICTED / INTERNAL AFFAIRS' ? 'RESTRICTED' : 'LE SENSITIVE'}
                </span>
              )}

              {latestMsg.priority === 'URGENT' && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase bg-rose-950 text-rose-300 border border-rose-800">
                  URGENT
                </span>
              )}

              {latestMsg.relatedCaseIds?.map((cid) => (
                <span
                  key={cid}
                  className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60"
                >
                  {cid}
                </span>
              ))}

              <span className="text-[9px] font-mono text-slate-500 ml-auto">
                ERA: {latestMsg.historicalEra}
              </span>
            </div>
          </div>
        );
      })}

      {/* Right-Click Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 text-xs font-mono text-slate-200 min-w-[200px]"
          style={{
            left: Math.min(contextMenu.x, window.innerWidth - 220),
            top: Math.min(contextMenu.y, window.innerHeight - 340)
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 text-[10px] text-slate-400 font-bold uppercase border-b border-slate-800 flex items-center justify-between">
            <span>Actions: {contextMenu.thread.threadId}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectThread(contextMenu.thread.threadId);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Icon name="MailOpen" className="w-3.5 h-3.5" />
            <span>Open</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const latest = contextMenu.thread.messages[contextMenu.thread.messages.length - 1];
              onReply?.(latest);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Icon name="Reply" className="w-3.5 h-3.5" />
            <span>Reply</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onForward?.(contextMenu.thread);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Icon name="Share2" className="w-3.5 h-3.5" />
            <span>Forward</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onArchive?.(contextMenu.thread.threadId);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Icon name="Archive" className="w-3.5 h-3.5" />
            <span>Archive</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const latest = contextMenu.thread.messages[contextMenu.thread.messages.length - 1];
              onPinToBoard?.(latest.id);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Icon name="Pin" className="w-3.5 h-3.5 text-blue-400" />
            <span>Add to Board</span>
          </button>

          <div className="h-px bg-slate-800 my-1" />

          <button
            type="button"
            onClick={() => {
              handleOpenSenderRecord(contextMenu.thread);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Icon name="User" className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Sender</span>
          </button>

          {contextMenu.thread.relatedCaseIds && contextMenu.thread.relatedCaseIds.length > 0 && (
            <button
              type="button"
              onClick={() => {
                handleOpenCase(contextMenu.thread);
                setContextMenu(null);
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
            >
              <Icon name="Briefcase" className="w-3.5 h-3.5 text-amber-400" />
              <span>Open Case</span>
            </button>
          )}

          {contextMenu.thread.messages.some((m) => m.attachments && m.attachments.length > 0) && (
            <button
              type="button"
              onClick={() => {
                handleOpenAttachment(contextMenu.thread);
                setContextMenu(null);
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
            >
              <Icon name="Paperclip" className="w-3.5 h-3.5 text-indigo-400" />
              <span>Open Attachment</span>
            </button>
          )}

          <div className="h-px bg-slate-800 my-1" />

          <button
            type="button"
            onClick={() => {
              handleCopyReference(contextMenu.thread);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Icon name="Copy" className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy Reference</span>
          </button>
        </div>
      )}
    </div>
  );
};
