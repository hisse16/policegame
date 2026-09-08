import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { BoardNode, BoardEdge } from '../../../types/police';
import { storyEngine } from '../../../services/story/storyEngine';

interface BoardHypothesisPanelProps {
  nodes: BoardNode[];
  edges: BoardEdge[];
  onFocusNode: (nodeId: string) => void;
  onOpenAddModal: () => void;
  onUpdateNode: (nodeId: string, partial: Partial<BoardNode>) => void;
}

export const BoardHypothesisPanel: React.FC<BoardHypothesisPanelProps> = ({
  nodes,
  edges,
  onFocusNode,
  onOpenAddModal,
  onUpdateNode
}) => {
  const hypothesisNodes = nodes.filter((n) => n.nodeType === 'hypothesis');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredHypotheses = hypothesisNodes.filter((h) => {
    if (filterStatus !== 'ALL' && h.hypothesisStatus !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status?: BoardNode['hypothesisStatus']) => {
    switch (status) {
      case 'SUPPORTED':
        return (
          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1">
            <Icon name="CheckCircle2" className="w-3 h-3 text-emerald-400" />
            SUPPORTED
          </span>
        );
      case 'DISPROVEN':
        return (
          <span className="bg-red-950/80 text-red-300 border border-red-700/50 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1">
            <Icon name="XCircle" className="w-3 h-3 text-red-400" />
            DISPROVEN
          </span>
        );
      case 'WEAKENED':
        return (
          <span className="bg-amber-950/80 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1">
            <Icon name="AlertTriangle" className="w-3 h-3 text-amber-400" />
            WEAKENED
          </span>
        );
      default:
        return (
          <span className="bg-purple-950/80 text-purple-300 border border-purple-700/50 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1">
            <Icon name="HelpCircle" className="w-3 h-3 text-purple-400" />
            OPEN INQUIRY
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="Lightbulb" className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold font-mono text-slate-100 uppercase">
              Working Hypotheses & Investigative Theories
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Form hypotheses, link corroborating evidence, identify fatal contradictions, and refine deduction probability.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Icon name="Plus" className="w-3.5 h-3.5" />
          Add Working Hypothesis
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-500"
        >
          <option value="ALL">All Theories ({hypothesisNodes.length})</option>
          <option value="OPEN">Open Inquiries</option>
          <option value="SUPPORTED">Supported by Evidence</option>
          <option value="WEAKENED">Weakened by Contradictions</option>
          <option value="DISPROVEN">Disproven</option>
        </select>
      </div>

      {/* Hypothesis Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {filteredHypotheses.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
            <Icon name="Lightbulb" className="w-8 h-8 mb-2 opacity-50" />
            No working hypotheses currently indexed. Click "Add Working Hypothesis" to form a theory.
          </div>
        ) : (
          filteredHypotheses.map((h) => {
            // Find connected edges
            const connectedEdges = edges.filter((e) => e.from === h.id || e.to === h.id);
            const contradictions = connectedEdges.filter((e) => e.isContradiction);
            const supports = connectedEdges.filter((e) => e.isSupport);

            return (
              <div
                key={h.id}
                className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wide">
                        {h.label}
                      </h4>
                      {getStatusBadge(h.hypothesisStatus)}
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {h.noteText}
                    </p>
                  </div>

                  <button
                    onClick={() => onFocusNode(h.id)}
                    className="px-2.5 py-1 bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-700/50 rounded text-xs font-mono transition-colors flex items-center gap-1"
                  >
                    <Icon name="Crosshair" className="w-3 h-3" />
                    Locate on Corkboard
                  </button>
                </div>

                {/* Metrics & Confidence */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">THEORY CONFIDENCE</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-500 h-full transition-all"
                          style={{ width: `${h.confidenceScore || 50}%` }}
                        />
                      </div>
                      <span className="font-bold text-purple-400">{h.confidenceScore || 50}%</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">CORROBORATING PINS</span>
                    <span className="text-emerald-400 font-semibold">{supports.length} connected</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">CONTRADICTION FLAGS</span>
                    <span className="text-red-400 font-semibold">{contradictions.length} conflicts</span>
                  </div>
                </div>

                {/* Quick Status Adjuster */}
                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="text-slate-500 text-[11px]">Update Status:</span>
                  <div className="flex items-center gap-1.5">
                    {(['OPEN', 'SUPPORTED', 'WEAKENED', 'DISPROVEN'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          const color = st === 'SUPPORTED' ? '#22c55e' : st === 'DISPROVEN' ? '#ef4444' : st === 'WEAKENED' ? '#f59e0b' : '#a855f7';
                          onUpdateNode(h.id, { hypothesisStatus: st, color });
                          storyEngine.updateHypothesis(h.id, { hypothesisStatus: st, color });
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                          h.hypothesisStatus === st
                            ? 'bg-slate-700 text-white font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
