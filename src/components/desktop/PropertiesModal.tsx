import React from 'react';
import { VFSNode } from '../../types/os';
import { Icon } from '../common/Icon';

interface PropertiesModalProps {
  node: VFSNode;
  onClose: () => void;
}

export const PropertiesModal: React.FC<PropertiesModalProps> = ({ node, onClose }) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden text-slate-200 text-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Icon name={node.type === 'dir' ? 'Folder' : 'FileText'} className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-100 truncate">
              {node.name} Properties
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"
          >
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center text-blue-400 border border-slate-700">
              <Icon name={node.type === 'dir' ? 'Folder' : 'File'} className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <div className="font-medium text-slate-100 text-base truncate">{node.name}</div>
              <div className="text-xs text-slate-400">{node.mimeType}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-y-2 text-xs">
            <span className="text-slate-400">Type:</span>
            <span className="col-span-2 text-slate-200">
              {node.type === 'dir' ? 'Folder (directory)' : `${node.mimeType}`}
            </span>

            <span className="text-slate-400">Location:</span>
            <span className="col-span-2 text-slate-200 font-mono text-[11px] truncate">
              {node.path}
            </span>

            <span className="text-slate-400">Size:</span>
            <span className="col-span-2 text-slate-200">
              {formatBytes(node.size)} ({node.size.toLocaleString()} bytes)
            </span>

            <span className="text-slate-400">Permissions:</span>
            <span className="col-span-2 text-slate-200 font-mono bg-slate-800/80 px-2 py-0.5 rounded w-max">
              {node.permissions} ({node.owner}:{node.group})
            </span>

            <span className="text-slate-400">Created:</span>
            <span className="col-span-2 text-slate-300 font-mono text-[11px]">
              {node.createdAt}
            </span>

            <span className="text-slate-400">Modified:</span>
            <span className="col-span-2 text-slate-300 font-mono text-[11px]">
              {node.updatedAt}
            </span>

            <span className="text-slate-400">Accessed:</span>
            <span className="col-span-2 text-slate-300 font-mono text-[11px]">
              {node.accessedAt}
            </span>
          </div>

          {node.originalPath && (
            <div className="pt-2 border-t border-slate-800 text-xs">
              <span className="text-amber-400 font-semibold">Original Location in Trash: </span>
              <span className="font-mono text-[11px] text-slate-300">{node.originalPath}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-800/60 border-t border-slate-700/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
