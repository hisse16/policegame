import React from 'react';
import { DownloadItem } from '../../../types/browser';
import { Icon } from '../../common/Icon';

interface DownloadsShelfProps {
  downloads: DownloadItem[];
  isOpen: boolean;
  onClose: () => void;
  onOpenFile: (vfsPath: string) => void;
  onShowInFolder: (vfsPath: string) => void;
  onCancelDownload: (id: string) => void;
  onRemoveDownload: (id: string) => void;
}

export const DownloadsShelf: React.FC<DownloadsShelfProps> = ({
  downloads,
  isOpen,
  onClose,
  onOpenFile,
  onShowInFolder,
  onCancelDownload,
  onRemoveDownload
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-3 top-20 w-84 max-h-[380px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col z-50 text-xs overflow-hidden">
      {/* Header */}
      <div className="px-3.5 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium text-slate-200">
          <Icon name="Download" className="w-4 h-4 text-blue-400" />
          <span>Browser Downloads</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <Icon name="X" className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {downloads.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            <Icon name="Download" className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No downloads yet</p>
          </div>
        ) : (
          downloads.map((item) => {
            const isDownloading = item.status === 'downloading';
            const percent = item.sizeBytes > 0 ? Math.round((item.downloadedBytes / item.sizeBytes) * 100) : 0;

            return (
              <div
                key={item.id}
                className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded bg-slate-800 text-blue-400 shrink-0">
                      <Icon
                        name={item.mimeType.includes('pdf') ? 'FileText' : item.mimeType.includes('image') ? 'Image' : 'File'}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-200 truncate text-[11px]">{item.filename}</p>
                      <p className="text-[10px] text-slate-400">
                        {(item.sizeBytes / 1024).toFixed(1)} KB • {item.dateAdded}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {isDownloading ? (
                      <button
                        onClick={() => onCancelDownload(item.id)}
                        title="Cancel"
                        className="p-1 text-rose-400 hover:bg-slate-800 rounded"
                      >
                        <Icon name="X" className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onRemoveDownload(item.id)}
                        title="Remove from history"
                        className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded"
                      >
                        <Icon name="Trash2" className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar if active */}
                {isDownloading && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                      <span>Downloading... {percent}%</span>
                      <span>{(item.downloadedBytes / 1024).toFixed(0)} / {(item.sizeBytes / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>
                )}

                {/* Completed Actions */}
                {item.status === 'completed' && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[10px]">
                    <button
                      onClick={() => onOpenFile(item.localVFSPath)}
                      className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 transition-colors font-medium flex items-center gap-1"
                    >
                      <Icon name="ExternalLink" className="w-2.5 h-2.5" />
                      <span>Open file</span>
                    </button>
                    <button
                      onClick={() => onShowInFolder(item.localVFSPath)}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-1"
                    >
                      <Icon name="Folder" className="w-2.5 h-2.5" />
                      <span>Show in folder</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-2 bg-slate-950/90 border-t border-slate-800 text-center text-[10px] text-slate-400">
        Saved to <span className="font-mono text-slate-300">/home/investigator/Downloads/</span>
      </div>
    </div>
  );
};
