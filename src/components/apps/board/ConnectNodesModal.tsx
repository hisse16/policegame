import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { BoardNode, BoardEdge } from '../../../types/police';
import { storyEngine } from '../../../services/story/storyEngine';

interface ConnectNodesModalProps {
  nodes: BoardNode[];
  initialSourceId?: string;
  initialTargetId?: string;
  onClose: () => void;
  onConnected: (edge: BoardEdge) => void;
}

const COMMON_RELATIONS = [
  'Associated with',
  'Contradicts statement',
  'Corroborates alibi',
  'Witnessed at scene',
  'Physical custody of',
  'DNA / Biometric match',
  'Radio dispatched to',
  'Operated vehicle',
  'Suppressed evidence',
  'Financial kickback',
  'Suspect in disappearance'
];

export const ConnectNodesModal: React.FC<ConnectNodesModalProps> = ({
  nodes,
  initialSourceId,
  initialTargetId,
  onClose,
  onConnected
}) => {
  const [sourceId, setSourceId] = useState(initialSourceId || (nodes[0]?.id || ''));
  const [targetId, setTargetId] = useState(
    initialTargetId || (nodes.find((n) => n.id !== sourceId)?.id || '')
  );
  const [label, setLabel] = useState('Contradicts statement');
  const [isContradiction, setIsContradiction] = useState(true);
  const [isSupport, setIsSupport] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) return;

    const edge = storyEngine.createBoardConnection(
      sourceId,
      targetId,
      label.trim() || 'Connected to',
      label.trim(),
      isContradiction,
      isSupport
    );

    onConnected(edge);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <Icon name="GitMerge" className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
                Connect Evidence Nodes
              </h3>
              <p className="text-xs text-slate-400">Pin String Connection & Deductive Relationship</p>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Source Node (From) *</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500 font-mono"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  [{n.nodeType?.toUpperCase() || 'NODE'}] {n.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Target Node (To) *</label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500 font-mono"
            >
              {nodes
                .filter((n) => n.id !== sourceId)
                .map((n) => (
                  <option key={n.id} value={n.id}>
                    [{n.nodeType?.toUpperCase() || 'NODE'}] {n.label}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Connection Meaning / Description *</label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Contradicts radio log timestamp"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500 font-mono"
            />
            {/* Common quick tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {COMMON_RELATIONS.slice(0, 6).map((rel) => (
                <button
                  type="button"
                  key={rel}
                  onClick={() => {
                    setLabel(rel);
                    if (rel.toLowerCase().includes('contradict')) {
                      setIsContradiction(true);
                      setIsSupport(false);
                    } else if (rel.toLowerCase().includes('corroborat') || rel.toLowerCase().includes('match')) {
                      setIsSupport(true);
                      setIsContradiction(false);
                    }
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[10px] font-mono transition-colors"
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>

          {/* Conflict flags */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={isContradiction}
                onChange={(e) => {
                  setIsContradiction(e.target.checked);
                  if (e.target.checked) setIsSupport(false);
                }}
                className="accent-red-500 rounded"
              />
              <span className="text-slate-300 font-mono text-[11px]">
                Flag as <strong className="text-red-400">Direct Contradiction / Conflict</strong> (Red String)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={isSupport}
                onChange={(e) => {
                  setIsSupport(e.target.checked);
                  if (e.target.checked) setIsContradiction(false);
                }}
                className="accent-emerald-500 rounded"
              />
              <span className="text-slate-300 font-mono text-[11px]">
                Flag as <strong className="text-emerald-400">Corroborating Evidence</strong> (Green String)
              </span>
            </label>
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
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-1.5 font-mono"
            >
              <Icon name="Link" className="w-3.5 h-3.5" />
              Pin Connection String
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
