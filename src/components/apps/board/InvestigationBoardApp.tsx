import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '../../common/Icon';
import { useOS } from '../../../context/OSContext';
import { BoardNode, BoardEdge, BoardTimelineEvent } from '../../../types/police';
import { policeDatabase } from '../../../services/police/databaseEngine';
import { storyEngine } from '../../../services/story/storyEngine';
import { BoardCanvas } from './BoardCanvas';
import { NodeDetailDrawer } from './NodeDetailDrawer';
import { AddNodeModal } from './AddNodeModal';
import { ConnectNodesModal } from './ConnectNodesModal';
import { BoardTimelineView } from './BoardTimelineView';
import { BoardHypothesisPanel } from './BoardHypothesisPanel';
import { vfs } from '../../../services/vfs';

interface InvestigationBoardAppProps {
  windowId: string;
  params?: Record<string, any>;
}

export const InvestigationBoardApp: React.FC<InvestigationBoardAppProps> = ({ params }) => {
  const { openApp, sendNotification } = useOS();

  const [nodes, setNodes] = useState<BoardNode[]>(() => policeDatabase.getBoardNodes());
  const [edges, setEdges] = useState<BoardEdge[]>(() => policeDatabase.getBoardEdges());
  const [timelineEvents, setTimelineEvents] = useState<BoardTimelineEvent[]>(() =>
    policeDatabase.getBoardTimeline()
  );

  const [activeView, setActiveView] = useState<'canvas' | 'timeline' | 'hypotheses'>('canvas');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Modals
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectSourceId, setConnectSourceId] = useState<string | undefined>(undefined);
  const [connectTargetId, setConnectTargetId] = useState<string | undefined>(undefined);

  // Export status notification
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Sync state from policeDatabase
  const reloadBoardState = useCallback(() => {
    setNodes([...policeDatabase.getBoardNodes()]);
    setEdges([...policeDatabase.getBoardEdges()]);
    setTimelineEvents([...policeDatabase.getBoardTimeline()]);
  }, []);

  useEffect(() => {
    const unsub = policeDatabase.subscribe(() => {
      reloadBoardState();
    });
    return () => unsub();
  }, [reloadBoardState]);

  // Handle deep-linking to focus on a particular record
  useEffect(() => {
    if (params?.focusRecordId) {
      const match = nodes.find((n) => n.recordId === params.focusRecordId);
      if (match) {
        setSelectedNodeId(match.id);
        setActiveView('canvas');
      } else {
        // If not already on board, offer or auto-pin it
        const rec = policeDatabase.getRecord(params.focusRecordId);
        if (rec) {
          const newNode = storyEngine.createBoardNode({
            recordId: rec.id,
            label: rec.title.toUpperCase(),
            noteText: (rec as any).summary || (rec as any).description || 'Docket pinned to board.',
            nodeType: rec.type === 'evidence' ? 'evidence' : rec.type === 'person' ? 'person' : 'record'
          });
          setSelectedNodeId(newNode.id);
        }
      }
    }
  }, [params, nodes]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const handleUpdateNodePos = (nodeId: string, x: number, y: number) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n))
    );
  };

  const handleDeleteNode = (nodeId: string) => {
    policeDatabase.removeBoardNode(nodeId);
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
    reloadBoardState();
    sendNotification('Pin Removed', 'Node removed from Investigation Board.', 'info');
  };

  const handleDeleteEdge = (edgeId: string) => {
    policeDatabase.removeBoardEdge(edgeId);
    reloadBoardState();
    sendNotification('Connection Severed', 'String connection removed.', 'info');
  };

  const handleExportDeductions = () => {
    try {
      const targetDir = '/home/investigator/Documents/Investigation';
      if (!vfs.getNode(targetDir)) {
        vfs.createDir(targetDir);
      }
      const filePath = `${targetDir}/CASE_27_INVESTIGATION_BOARD_AUDIT.txt`;

      let report = `=========================================================================\n`;
      report += `INVESTIGATION BOARD DEDUCTIONS & CONTRADICTION MATRIX // CASE 27\n`;
      report += `DATE OF AUDIT: ${new Date().toISOString()}\n`;
      report += `TOTAL PINNED NODES: ${nodes.length} | TOTAL CONNECTIONS: ${edges.length}\n`;
      report += `=========================================================================\n\n`;

      report += `-------------------------------------------------------------------------\n`;
      report += `1. ACTIVE WORKING HYPOTHESES & STATUS:\n`;
      report += `-------------------------------------------------------------------------\n`;
      const hyps = nodes.filter((n) => n.nodeType === 'hypothesis');
      if (hyps.length === 0) {
        report += `No formal hypotheses entered.\n\n`;
      } else {
        hyps.forEach((h, idx) => {
          report += `[HYPOTHESIS ${idx + 1}] ${h.label}\n`;
          report += `STATUS: ${h.hypothesisStatus || 'OPEN'} | CONFIDENCE: ${h.confidenceScore || 50}%\n`;
          report += `THEORY: ${h.noteText}\n\n`;
        });
      }

      report += `-------------------------------------------------------------------------\n`;
      report += `2. CRITICAL CONTRADICTIONS & EVIDENCE CONFLICTS (RED STRINGS):\n`;
      report += `-------------------------------------------------------------------------\n`;
      const contradictions = edges.filter((e) => e.isContradiction);
      if (contradictions.length === 0) {
        report += `No direct contradiction strings pinned.\n\n`;
      } else {
        contradictions.forEach((c, idx) => {
          const fromNode = nodes.find((n) => n.id === c.from);
          const toNode = nodes.find((n) => n.id === c.to);
          report += `[CONFLICT ${idx + 1}] "${c.label}"\n`;
          report += `    BETWEEN: ${fromNode ? fromNode.label : c.from} <===> ${toNode ? toNode.label : c.to}\n\n`;
        });
      }

      report += `-------------------------------------------------------------------------\n`;
      report += `3. INDEXED BOARD ITEMS:\n`;
      report += `-------------------------------------------------------------------------\n`;
      nodes.forEach((n) => {
        report += `• [${n.nodeType?.toUpperCase() || 'ITEM'}] ${n.label} (${n.recordId || 'NO DOCKET'})\n`;
        if (n.noteText) report += `    ${n.noteText.replace(/\n/g, ' ')}\n`;
      });

      vfs.createFile(filePath, report);
      setExportNotice(`Exported investigation matrix to ${filePath}`);
      setTimeout(() => setExportNotice(null), 5000);
    } catch (e) {
      console.error(e);
      setExportNotice('Failed to export report.');
    }
  };

  const handleOpenRecordInApp = (recordId: string) => {
    if (recordId.startsWith('MAIL-') || recordId.startsWith('EML-')) {
      openApp('police-mail', { emailId: recordId });
      return;
    }
    if (recordId.startsWith('LOC-')) {
      openApp('investigation-map', { locationId: recordId });
      return;
    }
    if (recordId.startsWith('EV-') || recordId.startsWith('E-')) {
      openApp('evidence-lab', { evidenceId: recordId });
      return;
    }
    if (recordId.startsWith('CASE-')) {
      openApp('police-records', { recordId, tab: 'cases' });
      return;
    }
    const rec = policeDatabase.getRecord(recordId);
    if (rec && rec.type === 'evidence') {
      openApp('evidence-lab', { evidenceId: recordId });
    } else {
      openApp('police-records', { recordId });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* Top App Header */}
      <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center">
            <Icon name="GitMerge" className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <span>INVESTIGATION CORKBOARD & DEDUCTIONS</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                CASE-1998-027
              </span>
            </h1>
            <p className="text-[10px] font-mono text-slate-400">
              PHYSICAL EVIDENCE CORRELATION // TIMELINE // HYPOTHESIS ENGINE
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveView('canvas')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeView === 'canvas'
                ? 'bg-red-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon name="LayoutGrid" className="w-3.5 h-3.5" />
            <span>Corkboard ({nodes.length})</span>
          </button>

          <button
            onClick={() => setActiveView('timeline')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeView === 'timeline'
                ? 'bg-red-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon name="Clock" className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => setActiveView('hypotheses')}
            className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeView === 'hypotheses'
                ? 'bg-red-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon name="Lightbulb" className="w-3.5 h-3.5" />
            <span>Hypotheses</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddNodeModal(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Icon name="Pin" className="w-3.5 h-3.5" />
            Pin Item
          </button>

          <button
            onClick={() => {
              setConnectSourceId(undefined);
              setConnectTargetId(undefined);
              setShowConnectModal(true);
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Icon name="Link" className="w-3.5 h-3.5" />
            Connect String
          </button>

          <button
            onClick={handleExportDeductions}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 border border-slate-700"
            title="Export full deductive audit to Documents"
          >
            <Icon name="Download" className="w-3.5 h-3.5" />
            Export Audit
          </button>
        </div>
      </div>

      {/* Export notification alert */}
      {exportNotice && (
        <div className="bg-red-950/80 border-b border-red-800 px-5 py-2 text-xs font-mono text-red-300 flex items-center gap-2">
          <Icon name="CheckCircle" className="w-4 h-4 text-red-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeView === 'canvas' ? (
          <div className="flex-1 h-full relative">
            <BoardCanvas
              nodes={nodes}
              edges={edges}
              selectedNodeId={selectedNodeId}
              onSelectNode={(id) => setSelectedNodeId(id)}
              onOpenConnectModal={(sourceId, targetId) => {
                setConnectSourceId(sourceId);
                setConnectTargetId(targetId);
                setShowConnectModal(true);
              }}
              onUpdateNodePos={handleUpdateNodePos}
              onDeleteEdge={handleDeleteEdge}
            />
          </div>
        ) : activeView === 'timeline' ? (
          <div className="flex-1 h-full p-6 overflow-hidden">
            <BoardTimelineView
              timelineEvents={timelineEvents}
              nodes={nodes}
              onOpenRecord={handleOpenRecordInApp}
              onFocusNode={(nodeId) => {
                setSelectedNodeId(nodeId);
                setActiveView('canvas');
              }}
            />
          </div>
        ) : (
          <div className="flex-1 h-full p-6 overflow-hidden">
            <BoardHypothesisPanel
              nodes={nodes}
              edges={edges}
              onFocusNode={(nodeId) => {
                setSelectedNodeId(nodeId);
                setActiveView('canvas');
              }}
              onOpenAddModal={() => setShowAddNodeModal(true)}
              onUpdateNode={(nodeId, partial) => {
                policeDatabase.updateBoardNode(nodeId, partial);
                reloadBoardState();
              }}
            />
          </div>
        )}

        {/* Right Drawer Inspector */}
        {selectedNode && activeView === 'canvas' && (
          <NodeDetailDrawer
            node={selectedNode}
            edges={edges}
            allNodes={nodes}
            onClose={() => setSelectedNodeId(null)}
            onOpenRecord={handleOpenRecordInApp}
            onOpenConnectModal={(sourceId) => {
              setConnectSourceId(sourceId);
              setShowConnectModal(true);
            }}
            onDeleteNode={handleDeleteNode}
            onDeleteEdge={handleDeleteEdge}
          />
        )}
      </div>

      {/* Modals */}
      {showAddNodeModal && (
        <AddNodeModal
          onClose={() => setShowAddNodeModal(false)}
          onAdded={(newNode) => {
            reloadBoardState();
            setSelectedNodeId(newNode.id);
            sendNotification('Pinned to Board', `Added ${newNode.label} to your investigation corkboard.`, 'success');
          }}
        />
      )}

      {showConnectModal && (
        <ConnectNodesModal
          nodes={nodes}
          initialSourceId={connectSourceId}
          initialTargetId={connectTargetId}
          onClose={() => setShowConnectModal(false)}
          onConnected={(newEdge) => {
            reloadBoardState();
            sendNotification(
              newEdge.isContradiction ? 'Contradiction Pinned' : 'Connection Pinned',
              `Pinned string "${newEdge.label}" between evidence nodes.`,
              newEdge.isContradiction ? 'warning' : 'success'
            );
          }}
        />
      )}
    </div>
  );
};
