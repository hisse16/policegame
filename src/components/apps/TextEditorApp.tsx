import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { vfs } from '../../services/vfs';
import { Icon } from '../common/Icon';

interface TextEditorAppProps {
  windowId: string;
  params?: { path?: string; content?: string };
}

export const TextEditorApp: React.FC<TextEditorAppProps> = ({ windowId, params }) => {
  const { sendNotification, setWindowTitle } = useOS();

  const [currentPath, setCurrentPath] = useState<string | null>(params?.path || null);
  const [content, setContent] = useState<string>(() => {
    if (params?.path) {
      const node = vfs.getNode(params.path);
      return node?.content || '';
    }
    return params?.content || '';
  });
  const [savedContent, setSavedContent] = useState<string>(content);
  const [wordWrap, setWordWrap] = useState(true);
  const [saveAsOpen, setSaveAsOpen] = useState(false);
  const [saveAsPath, setSaveAsPath] = useState('/home/investigator/Documents/notes.txt');

  const isDirty = content !== savedContent;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync window title with dirty status
  useEffect(() => {
    const filename = currentPath ? currentPath.split('/').pop() : 'Untitled Document';
    const title = `${isDirty ? '• ' : ''}${filename} - Text Editor`;
    if (windowId) {
      setWindowTitle(windowId, title);
    }
  }, [currentPath, isDirty, setWindowTitle, windowId]);

  const handleSave = () => {
    if (!currentPath) {
      setSaveAsOpen(true);
      return;
    }
    try {
      vfs.createFile(currentPath, content);
      setSavedContent(content);
      sendNotification('Saved', `File saved: ${currentPath.split('/').pop()}`, 'info');
    } catch (err: any) {
      sendNotification('Save Failed', err.message || 'Error saving file', 'error');
    }
  };

  const handleSaveAsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveAsPath.trim()) return;
    try {
      vfs.createFile(saveAsPath.trim(), content);
      setCurrentPath(saveAsPath.trim());
      setSavedContent(content);
      setSaveAsOpen(false);
      sendNotification('Saved', `File saved to ${saveAsPath.trim()}`, 'info');
    } catch (err: any) {
      sendNotification('Save Failed', err.message || 'Error saving file', 'error');
    }
  };

  const handleNewFile = () => {
    setCurrentPath(null);
    setContent('');
    setSavedContent('');
  };

  // Metrics
  const lineCount = content.split('\n').length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none text-xs">
      {/* Top Menu Toolbar */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleNewFile}
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Icon name="FilePlus" className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Icon name="Save" className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
          <button
            onClick={() => setSaveAsOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Icon name="FolderInput" className="w-3.5 h-3.5" />
            <span>Save As...</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={() => setWordWrap(!wordWrap)}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              wordWrap ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon name="WrapText" className="w-3.5 h-3.5" />
            <span>Wrap</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-400 truncate max-w-xs">
            {currentPath || 'Untitled Document'}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              isDirty ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}
          >
            {isDirty ? 'Unsaved' : 'Saved'}
          </span>
        </div>
      </div>

      {/* Editor Main Canvas with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative font-mono bg-slate-950">
        {/* Line Numbers Column */}
        <div className="w-12 bg-slate-900/60 border-r border-slate-800/80 p-3 text-right text-slate-600 select-none text-xs leading-relaxed overflow-hidden">
          {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          wrap={wordWrap ? 'soft' : 'off'}
          placeholder="Start typing notes, evidence observations, or reports..."
          className="flex-1 p-3 bg-transparent text-slate-200 resize-none focus:outline-hidden text-xs leading-relaxed overflow-auto select-text font-mono"
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 px-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
        <div className="flex items-center gap-4">
          <span>Lines: {lineCount}</span>
          <span>Words: {wordCount}</span>
          <span>Chars: {charCount}</span>
        </div>
        <div className="text-slate-500">UTF-8 • Plain Text</div>
      </div>

      {/* Save As Modal */}
      {saveAsOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 w-full max-w-sm shadow-2xl space-y-3">
            <div className="font-semibold text-slate-100 text-xs flex items-center gap-2">
              <Icon name="Save" className="w-4 h-4 text-blue-400" />
              <span>Save Document As</span>
            </div>
            <form onSubmit={handleSaveAsSubmit} className="space-y-3">
              <input
                type="text"
                autoFocus
                value={saveAsPath}
                onChange={(e) => setSaveAsPath(e.target.value)}
                placeholder="/home/investigator/Documents/file.txt"
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs font-mono text-slate-100 focus:outline-hidden focus:border-blue-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSaveAsOpen(false)}
                  className="px-3 py-1.5 rounded hover:bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
