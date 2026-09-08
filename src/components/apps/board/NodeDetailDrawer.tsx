import React from 'react';
import { Icon } from '../../common/Icon';
import { BoardNode, BoardEdge } from '../../../types/police';
import { policeDatabase } from '../../../services/police/databaseEngine';
import { storyEngine } from '../../../services/story/storyEngine';

interface NodeDetailDrawerProps {
  node: BoardNode | null;
  edges: BoardEdge[];
  allNodes: BoardNode[];
  onClose: () => void;
  onOpenRecord: (recordId: string) => void;
  onOpenConnectModal: (sourceId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  edges,
  allNodes,
  onClose,
  onOpenRecord,
  onOpenConnectModal,
  onDeleteNode,
  onDeleteEdge
}) => {
  if (!node) return null;

  // Find all edges connected to this node
  const connectedEdges = edges.filter((e) => e.from === node.id || e.to === node.id);

  const getOtherNode = (edge: BoardEdge) => {
    const otherId = edge.from === node.id ? edge.to : edge.from;
    return allNodes.find((n) => n.id === otherId);
  };

  return (
    <div className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full z-20 shadow-2xl overflow-hidden flex-shrink-0">
      {/* Drawer Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: node.color || '#3b82f6' }}
          />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
            [{node.nodeType?.toUpperCase() || 'NODE'}] PIN INSPECTOR
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <Icon name="X" className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
        {/* Visual photo if available */}
        {node.photoUrl && (
          <div className="w-full h-44 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center relative">
            <img
              src={node.photoUrl}
              alt={node.label}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}

        {/* Title & Type */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            {node.label}
          </h3>
          {node.recordId && (
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-semibold">{node.recordId}</span>
              <button
                onClick={() => onOpenRecord(node.recordId!)}
                className="text-[10px] text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
              >
                <Icon name="ExternalLink" className="w-2.5 h-2.5" />
                Open Original File
              </button>
            </div>
          )}
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2">
          {node.questionStatus && (
            <span
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                node.questionStatus === 'RESOLVED'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : 'bg-orange-950 text-orange-400 border-orange-800'
              }`}
            >
              Status: {node.questionStatus}
            </span>
          )}

          {node.hypothesisStatus && (
            <span
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                node.hypothesisStatus === 'SUPPORTED'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : node.hypothesisStatus === 'DISPROVEN'
                  ? 'bg-red-950 text-red-400 border-red-800'
                  : 'bg-purple-950 text-purple-400 border-purple-800'
              }`}
            >
              Hypothesis: {node.hypothesisStatus} ({node.confidenceScore || 50}%)
            </span>
          )}
        </div>

        {/* Notes / Narrative */}
        {node.noteText && (
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">
              OBSERVATIONS & DETAILS:
            </span>
            {node.noteText}
          </div>
        )}

        {/* Connected Strings */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
              Connected Strings ({connectedEdges.length})
            </span>
            <button
              onClick={() => onOpenConnectModal(node.id)}
              className="text-[10px] text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
            >
              <Icon name="Plus" className="w-3 h-3" />
              Add Connection
            </button>
          </div>

          {connectedEdges.length === 0 ? (
            <p className="text-[11px] text-slate-500 italic">No connection strings pinned to this item yet.</p>
          ) : (
            <div className="space-y-2">
              {connectedEdges.map((edge) => {
                const other = getOtherNode(edge);
                if (!other) return null;

                return (
                  <div
                    key={edge.id}
                    className={`p-2.5 rounded-lg border text-[11px] flex items-start justify-between gap-2 ${
                      edge.isContradiction
                        ? 'bg-red-950/30 border-red-800/80 text-red-300'
                        : edge.isSupport
                        ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold truncate max-w-[170px]">{other.label}</span>
                        {edge.isContradiction && (
                          <span className="text-[9px] bg-red-900 text-red-200 px-1 rounded font-bold">
                            CONFLICT
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] opacity-80 italic">"{edge.label}"</p>
                    </div>

                    <button
                      onClick={() => onDeleteEdge(edge.id)}
                      title="Sever connection string"
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800"
                    >
                      <Icon name="Trash2" className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenConnectModal(node.id)}
          className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1.5"
        >
          <Icon name="Link" className="w-3.5 h-3.5" />
          Connect
        </button>

        <button
          onClick={() => onDeleteNode(node.id)}
          className="px-3 py-2 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/60 rounded-lg text-xs font-mono transition-colors flex items-center justify-center gap-1.5"
          title="Remove pin from corkboard"
        >
          <Icon name="Trash2" className="w-3.5 h-3.5" />
          Unpin
        </button>
      </div>
    </div>
  );
};
