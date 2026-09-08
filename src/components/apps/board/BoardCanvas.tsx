import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../../common/Icon';
import { BoardNode, BoardEdge } from '../../../types/police';
import { storyEngine } from '../../../services/story/storyEngine';

interface BoardCanvasProps {
  nodes: BoardNode[];
  edges: BoardEdge[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onOpenConnectModal: (sourceId?: string, targetId?: string) => void;
  onUpdateNodePos: (nodeId: string, x: number, y: number) => void;
  onDeleteEdge: (edgeId: string) => void;
}

export const BoardCanvas: React.FC<BoardCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onOpenConnectModal,
  onUpdateNodePos,
  onDeleteEdge
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Dragging a node
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Quick connect drag line state
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle canvas mouse down for pan
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      onSelectNode(null);
    }
  };

  // Handle mouse move for pan or drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (draggingNodeId) {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const newX = Math.round((e.clientX - containerRect.left - pan.x) / zoom - dragOffset.x);
      const newY = Math.round((e.clientY - containerRect.top - pan.y) / zoom - dragOffset.y);

      onUpdateNodePos(draggingNodeId, Math.max(20, newX), Math.max(20, newY));
    }

    if (connectingSourceId) {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        setMousePos({
          x: (e.clientX - containerRect.left - pan.x) / zoom,
          y: (e.clientY - containerRect.top - pan.y) / zoom
        });
      }
    }
  };

  const handleMouseUp = () => {
    if (draggingNodeId) {
      const draggedNode = nodes.find((n) => n.id === draggingNodeId);
      if (draggedNode) {
        storyEngine.updateBoardNode(draggedNode.id, { x: draggedNode.x, y: draggedNode.y });
      }
      setDraggingNodeId(null);
    }
    setIsPanning(false);
    setConnectingSourceId(null);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(2.0, Math.max(0.4, prev * zoomFactor)));
  };

  const startDraggingNode = (e: React.MouseEvent, node: BoardNode) => {
    e.stopPropagation();
    onSelectNode(node.id);

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const mouseCanvasX = (e.clientX - containerRect.left - pan.x) / zoom;
    const mouseCanvasY = (e.clientY - containerRect.top - pan.y) / zoom;

    setDragOffset({
      x: mouseCanvasX - node.x,
      y: mouseCanvasY - node.y
    });
    setDraggingNodeId(node.id);
  };

  const getNodeCenter = (nodeId: string) => {
    const n = nodes.find((item) => item.id === nodeId);
    if (!n) return { x: 0, y: 0 };
    // width ~ 200, height ~ 140
    return { x: n.x + 100, y: n.y + 70 };
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className="relative w-full h-full overflow-hidden bg-[#161311] select-none cursor-grab active:cursor-grabbing"
      style={{
        backgroundImage: `radial-gradient(circle, #2a221c 1px, transparent 1px)`,
        backgroundSize: `${28 * zoom}px ${28 * zoom}px`,
        backgroundPosition: `${pan.x}px ${pan.y}px`
      }}
    >
      {/* Zoom / Canvas Controls */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-xl shadow-xl backdrop-blur-sm text-xs font-mono text-slate-200">
        <button
          onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
          title="Zoom In"
        >
          <Icon name="Plus" className="w-3.5 h-3.5" />
        </button>
        <span className="px-1 text-[11px] font-semibold text-slate-400 w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
          title="Zoom Out"
        >
          <Icon name="Minus" className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-slate-700 mx-1" />
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="px-2 py-1 rounded-lg hover:bg-slate-800 text-[11px] text-slate-400 hover:text-white"
        >
          Reset View
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute bottom-4 left-4 z-30 hidden md:flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl shadow-lg text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-red-500 inline-block border-t border-dashed border-red-300" />
          <span className="text-red-300 font-semibold">Conflict / Contradiction</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-emerald-500 inline-block" />
          <span className="text-emerald-300 font-semibold">Corroborating Pin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-red-800 inline-block" />
          <span>General Link</span>
        </div>
      </div>

      {/* Scaled and Panned Workspace Layer */}
      <div
        className="absolute top-0 left-0 origin-top-left pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: '5000px',
          height: '5000px'
        }}
      >
        {/* SVG Strings / Edges Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-auto overflow-visible">
          <defs>
            <marker
              id="arrow-contradiction"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
            </marker>
            <marker
              id="arrow-support"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
            </marker>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#b91c1c" />
            </marker>
          </defs>

          {edges.map((edge) => {
            const start = getNodeCenter(edge.from);
            const end = getNodeCenter(edge.to);
            if (start.x === 0 && start.y === 0) return null;
            if (end.x === 0 && end.y === 0) return null;

            // Midpoint for label tag
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;

            const isContradiction = edge.isContradiction;
            const isSupport = edge.isSupport;

            const strokeColor = isContradiction ? '#ef4444' : isSupport ? '#10b981' : '#b91c1c';
            const strokeWidth = isContradiction ? 3 : isSupport ? 2.5 : 2;
            const strokeDasharray = isContradiction ? '6,4' : undefined;

            return (
              <g key={edge.id} className="group cursor-pointer">
                {/* Visual String Line */}
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                  className="transition-all opacity-85 group-hover:opacity-100"
                />

                {/* Connection Label Pill */}
                {edge.label && (
                  <foreignObject
                    x={midX - 75}
                    y={midY - 14}
                    width={150}
                    height={28}
                    className="overflow-visible"
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        // Open quick action
                      }}
                      className={`px-2 py-0.5 rounded border text-[10px] font-mono text-center truncate shadow-md backdrop-blur-sm transition-transform hover:scale-105 ${
                        isContradiction
                          ? 'bg-red-950/90 text-red-200 border-red-700/80 font-bold'
                          : isSupport
                          ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/80 font-semibold'
                          : 'bg-slate-950/90 text-slate-300 border-slate-800'
                      }`}
                      title={edge.label}
                    >
                      {isContradiction && '⚠️ '}
                      {edge.label}
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}

          {/* Active quick connection line */}
          {connectingSourceId && (
            <line
              x1={getNodeCenter(connectingSourceId).x}
              y1={getNodeCenter(connectingSourceId).y}
              x2={mousePos.x}
              y2={mousePos.y}
              stroke="#fbbf24"
              strokeWidth={2}
              strokeDasharray="4,4"
            />
          )}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isHypothesis = node.nodeType === 'hypothesis';
          const isQuestion = node.nodeType === 'question';
          const isNote = node.nodeType === 'note';

          return (
            <div
              key={node.id}
              onMouseDown={(e) => startDraggingNode(e, node)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node.id);
              }}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: '210px'
              }}
              className={`absolute pointer-events-auto cursor-pointer rounded-lg transition-shadow select-none ${
                isSelected
                  ? 'ring-2 ring-blue-400 shadow-2xl shadow-blue-500/20 z-20 scale-[1.02]'
                  : 'hover:shadow-xl shadow-md z-10'
              } ${
                isHypothesis
                  ? 'bg-purple-950/90 border border-purple-800/80 text-purple-100'
                  : isQuestion
                  ? 'bg-amber-950/90 border border-amber-800/80 text-amber-100'
                  : isNote
                  ? 'bg-[#fef08a] border border-amber-300 text-slate-900 shadow-amber-900/10'
                  : 'bg-slate-900 border border-slate-700/80 text-slate-100'
              }`}
            >
              {/* Pushpin at top center */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                <div
                  className={`w-5 h-5 rounded-full border-2 shadow-md flex items-center justify-center ${
                    isHypothesis
                      ? 'bg-purple-500 border-purple-200'
                      : isQuestion
                      ? 'bg-orange-500 border-orange-200'
                      : isNote
                      ? 'bg-amber-600 border-amber-200'
                      : 'bg-red-600 border-red-200'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                </div>
              </div>

              {/* Node Card Content */}
              <div className="p-3 pt-3.5 space-y-2">
                {/* Photo if available */}
                {node.photoUrl && (
                  <div className="w-full h-24 bg-black/40 rounded overflow-hidden flex items-center justify-center border border-black/30">
                    <img
                      src={node.photoUrl}
                      alt={node.label}
                      className="max-w-full max-h-full object-cover"
                    />
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                      isNote
                        ? 'bg-amber-300/80 text-amber-900'
                        : 'bg-black/40 text-slate-300 border border-white/10'
                    }`}
                  >
                    {node.nodeType || 'RECORD'}
                  </span>

                  {node.recordId && (
                    <span className="text-[10px] font-mono font-bold opacity-75">
                      {node.recordId}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4
                  className={`text-xs font-mono font-bold uppercase line-clamp-2 ${
                    isNote ? 'text-slate-900' : 'text-slate-100'
                  }`}
                >
                  {node.label}
                </h4>

                {/* Text excerpt */}
                {node.noteText && (
                  <p
                    className={`text-[11px] line-clamp-2 font-sans leading-snug ${
                      isNote ? 'text-slate-800' : 'text-slate-300 opacity-90'
                    }`}
                  >
                    {node.noteText}
                  </p>
                )}

                {/* Status indicator badges */}
                {node.hypothesisStatus && (
                  <div className="pt-1 border-t border-purple-800/40 flex items-center justify-between text-[10px] font-mono font-semibold">
                    <span>{node.hypothesisStatus}</span>
                    <span>{node.confidenceScore || 50}%</span>
                  </div>
                )}
              </div>

              {/* Quick Connect Trigger Button on Bottom-Right */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenConnectModal(node.id);
                }}
                className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg border border-blue-400 transition-transform hover:scale-110"
                title="Connect string to another pin"
              >
                <Icon name="Link" className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
