import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { browserDb } from '../../../services/browserDatabase';
import { EmailMessage } from '../../../types/browser';

interface WebmailRendererProps {
  onNavigate: (url: string) => void;
}

export const WebmailRenderer: React.FC<WebmailRendererProps> = ({ onNavigate }) => {
  const [emails, setEmails] = useState<EmailMessage[]>([...browserDb.emails]);
  const [selectedFolder, setSelectedFolder] = useState<'inbox' | 'sent' | 'starred' | 'trash'>('inbox');
  const [activeEmailId, setActiveEmailId] = useState<string | null>(emails[0]?.id || null);
  const [isComposing, setIsComposing] = useState(false);
  const [toInput, setToInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [bodyInput, setBodyInput] = useState('');

  const activeEmail = emails.find((e) => e.id === activeEmailId);

  const filteredEmails = emails.filter((e) => {
    if (selectedFolder === 'starred') return e.isStarred;
    return e.folder === selectedFolder;
  });

  const unreadInboxCount = emails.filter((e) => e.folder === 'inbox' && !e.isRead).length;

  const handleSelectEmail = (email: EmailMessage) => {
    setActiveEmailId(email.id);
    if (!email.isRead) {
      email.isRead = true;
      setEmails([...emails]);
    }
  };

  const handleToggleStar = (e: React.MouseEvent, email: EmailMessage) => {
    e.stopPropagation();
    email.isStarred = !email.isStarred;
    setEmails([...emails]);
  };

  const handleDelete = (id: string) => {
    const item = emails.find((e) => e.id === id);
    if (item) {
      item.folder = 'trash';
      setEmails([...emails]);
      if (activeEmailId === id) {
        const next = filteredEmails.find((e) => e.id !== id);
        setActiveEmailId(next ? next.id : null);
      }
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toInput.trim() || !subjectInput.trim()) return;

    browserDb.sendEmail(toInput.trim(), subjectInput.trim(), bodyInput.trim());
    setEmails([...browserDb.emails]);
    setIsComposing(false);
    setToInput('');
    setSubjectInput('');
    setBodyInput('');
  };

  const handleDownloadAttachment = (att: { name: string; size: string; mimeType: string; fileContent?: string }) => {
    browserDb.startDownload(
      att.name,
      `http://inbox.local/attachments/${att.name}`,
      1024 * 2,
      att.mimeType,
      att.fileContent || `ATTACHMENT FILE: ${att.name}\nExported from MetroMail.`
    );
  };

  return (
    <div className="h-full w-full bg-slate-950 text-slate-200 overflow-hidden font-sans select-none flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-4 py-3 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Icon name="Mail" className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100">MetroMail Web Client</h1>
            <p className="text-[10px] text-slate-400">investigator@metro.gov</p>
          </div>
        </div>

        <button
          onClick={() => setIsComposing(true)}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Icon name="Plus" className="w-3.5 h-3.5" />
          <span>Compose</span>
        </button>
      </header>

      {/* Main Mail Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Folders */}
        <div className="w-48 bg-slate-900/40 border-r border-slate-800 p-2 space-y-1 shrink-0">
          <button
            onClick={() => setSelectedFolder('inbox')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              selectedFolder === 'inbox'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="Inbox" className="w-4 h-4" />
              <span>Inbox</span>
            </div>
            {unreadInboxCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${selectedFolder === 'inbox' ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>
                {unreadInboxCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setSelectedFolder('starred')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              selectedFolder === 'starred'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Icon name="Star" className="w-4 h-4" />
            <span>Starred</span>
          </button>

          <button
            onClick={() => setSelectedFolder('sent')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              selectedFolder === 'sent'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Icon name="Send" className="w-4 h-4" />
            <span>Sent</span>
          </button>

          <button
            onClick={() => setSelectedFolder('trash')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              selectedFolder === 'trash'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Icon name="Trash2" className="w-4 h-4" />
            <span>Trash</span>
          </button>
        </div>

        {/* Email List */}
        <div className="w-80 border-r border-slate-800 overflow-y-auto bg-slate-950/60 shrink-0">
          {filteredEmails.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">No emails in {selectedFolder}</div>
          ) : (
            filteredEmails.map((em) => {
              const isSelected = em.id === activeEmailId;
              return (
                <div
                  key={em.id}
                  onClick={() => handleSelectEmail(em)}
                  className={`p-3 border-b border-slate-800/80 cursor-pointer transition-colors space-y-1 ${
                    isSelected
                      ? 'bg-slate-800/80 border-slate-700'
                      : !em.isRead
                      ? 'bg-slate-900/60 font-semibold'
                      : 'hover:bg-slate-900/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="truncate font-medium text-slate-200">{em.fromName}</span>
                    <span className="text-[10px] text-slate-500 shrink-0">{em.date.split(',')[0]}</span>
                  </div>
                  <p className="text-xs text-slate-300 truncate">{em.subject}</p>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{em.body}</p>
                    <button
                      onClick={(e) => handleToggleStar(e, em)}
                      className={`p-1 text-xs ${em.isStarred ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                      <Icon name="Star" className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Reader */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {activeEmail ? (
            <div className="max-w-3xl space-y-6">
              {/* Actions & Subject */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <h2 className="text-xl font-bold text-slate-100">{activeEmail.subject}</h2>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDelete(activeEmail.id)}
                    title="Delete Email"
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 hover:text-rose-400 text-slate-400"
                  >
                    <Icon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sender Details */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-900/80 text-blue-300 border border-blue-700/60 flex items-center justify-center font-bold text-sm">
                  {activeEmail.fromName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-200">{activeEmail.fromName}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    &lt;{activeEmail.fromEmail}&gt; to {activeEmail.toEmail}
                  </p>
                </div>
                <div className="ml-auto text-right text-[11px] text-slate-500">
                  {activeEmail.date}
                </div>
              </div>

              {/* Body */}
              <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans p-4 rounded-xl bg-slate-900/30 border border-slate-800/80">
                {activeEmail.body}
              </div>

              {/* Attachments (if any) */}
              {activeEmail.attachments && activeEmail.attachments.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-300">Attachments ({activeEmail.attachments.length})</h4>
                  <div className="flex flex-wrap gap-3">
                    {activeEmail.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-xs"
                      >
                        <Icon name="FileText" className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="font-medium text-slate-200">{att.name}</p>
                          <p className="text-[10px] text-slate-500">{att.size}</p>
                        </div>
                        <button
                          onClick={() => handleDownloadAttachment(att)}
                          className="ml-2 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <Icon name="Download" className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select an email to view its contents
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {isComposing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleSendEmail}
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-100">New Message</h3>
              <button
                type="button"
                onClick={() => setIsComposing(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-12">To:</span>
                <input
                  type="email"
                  value={toInput}
                  onChange={(e) => setToInput(e.target.value)}
                  placeholder="recipient@metro.gov"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-12">Subject:</span>
                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="Subject line..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <textarea
                value={bodyInput}
                onChange={(e) => setBodyInput(e.target.value)}
                placeholder="Write your email here..."
                rows={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-hidden focus:border-blue-500 resize-none font-sans"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-500">From: investigator@metro.gov</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Icon name="Send" className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
