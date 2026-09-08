import React, { useState, useRef } from 'react';
import { Icon } from '../../../common/Icon';
import { BoardNode, BoardEdge, AnyRecord } from '../../../../types/police';
import { policeDatabase } from '../../../../services/police/databaseEngine';

interface InvestigationBoardViewProps {
  onSelectRecord: (id: string) => void;
}

export const InvestigationBoardView: React.FC<InvestigationBoardViewProps> = ({
  onSelectRecord
}) => {
  const [boardState, setBoardState] = useState(policeDatabase.getBoardState());
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const boardRef = useRef<HTMLDivElement>(null);

  const handleMouseDownNode = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const node = boardState.nodes.find((n) => n.id === id);
    if (!node) return;
    setActiveDragId(id);
    setDragOffset({
      x: e.clientX / scale - node.x,
      y: e.clientY / scale - node.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!activeDragId) return;
    const newX = Math.round(e.clientX / scale - dragOffset.x);
    const newY = Math.round(e.clientY / scale - dragOffset.y);

    const updatedNodes = boardState.nodes.map((n) => {
      if (n.id === activeDragId) {
        return { ...n, x: Math.max(20, newX), y: Math.max(20, newY) };
      }
      return n;
    });

    const newState = { ...boardState, nodes: updatedNodes };
    setBoardState(newState);
  };

  const handleMouseUp = () => {
    if (activeDragId) {
      policeDatabase.updateBoardState(boardState);
      setActiveDragId(null);
    }
  };

  const handleAddCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    const newNode: BoardNode = {
      id: `bn_custom_${Date.now()}`,
      label: noteTitle.trim().toUpperCase(),
      noteText: noteContent.trim(),
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      color: '#f59e0b'
    };

    const newState = {
      ...boardState,
      nodes: [...boardState.nodes, newNode]
    };

    setBoardState(newState);
    policeDatabase.updateBoardState(newState);
    setNoteTitle('');
    setNoteContent('');
    setShowAddNoteModal(false);
  };

  const handleDeleteNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedNodes = boardState.nodes.filter((n) => n.id !== id);
    const updatedEdges = boardState.edges.filter((ed) => ed.from !== id && ed.to !== id);
    const newState = { nodes: updatedNodes, edges: updatedEdges };
    setBoardState(newState);
    policeDatabase.updateBoardState(newState);
  };

  // Quick pin dropdown record picker
  const [pinSearch, setPinSearch] = useState('');
  const [showPinDropdown, setShowPinDropdown] = useState(false);
  const searchResults = pinSearch.trim()
    ? policeDatabase.getAllRecords().filter((r) => r.title.toLowerCase().includes(pinSearch.toLowerCase()) || r.id.toLowerCase().includes(pinSearch.toLowerCase())).slice(0, 8)
    : [];

  const handlePinRecord = (rec: AnyRecord) => {
    const existing = boardState.nodes.find((n) => n.recordId === rec.id);
    if (existing) {
      setShowPinDropdown(false);
      setPinSearch('');
      return;
    }

    const newNode: BoardNode = {
      id: `bn_rec_${rec.id}`,
      recordId: rec.id,
      recordType: rec.type,
      label: rec.title.substring(0, 32),
      subtitle: `${rec.id} • ${rec.status}`,
      x: 200 + Math.random() * 200,
      y: 150 + Math.random() * 150,
      color: rec.type === 'person' ? '#3b82f6' : rec.type === 'evidence' ? '#ef4444' : rec.type === 'case' ? '#eab308' : '#10b981'
    };

    const newState = {
      ...boardState,
      nodes: [...boardState.nodes, newNode]
    };
    setBoardState(newState);
    policeDatabase.updateBoardState(newState);
    setShowPinDropdown(false);
    setPinSearch('');
  };

  return (
    <div
      ref={boardRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="flex-1 h-full flex flex-col select-none bg-stone-900 overflow-hidden font-mono relative"
    >
      {/* 1. Board Toolbar */}
      <div className="h-12 bg-slate-950/90 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-2">
          <Icon name="GitMerge" className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            CASE 27 INVESTIGATION WALL & EVIDENCE GRAPH
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
            {boardState.nodes.length} PINNED NODES
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Note Button */}
          <button
            onClick={() => setShowAddNoteModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Icon name="Plus" className="w-3.5 h-3.5" />
            <span>PIN NOTE</span>
          </button>

          {/* Pin Record Picker */}
          <div className="relative">
            <button
              onClick={() => setShowPinDropdown(!showPinDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Icon name="Pin" className="w-3.5 h-3.5" />
              <span>PIN RECORD</span>
            </button>

            {showPinDropdown && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-slate-950 border border-slate-700 rounded-lg shadow-2xl p-2 z-50">
                <input
                  type="text"
                  value={pinSearch}
                  onChange={(e) => setPinSearch(e.target.value)}
                  placeholder="Search record to pin..."
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden"
                  autoFocus
                />
                <div className="mt-2 divide-y divide-slate-800 max-h-56 overflow-y-auto">
                  {searchResults.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => handlePinRecord(r)}
                      className="p-1.5 hover:bg-slate-900 cursor-pointer text-xs text-slate-200 flex items-center justify-between"
                    >
                      <span className="truncate pr-2">{r.title}</span>
                      <span className="text-[10px] text-slate-400">{r.type}</span>
                    </div>
                  ))}
                  {pinSearch.trim() && searchResults.length === 0 && (
                    <div className="p-2 text-center text-xs text-slate-400">No records found.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
            <button
              onClick={() => setScale((s) => Math.max(0.6, s - 0.1))}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300"
              title="Zoom Out"
            >
              <Icon name="Minus" className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-slate-400 w-10 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(1.5, s + 0.1))}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300"
              title="Zoom In"
            >
              <Icon name="Plus" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Canvas with Corkboard Background */}
      <div
        className="flex-1 overflow-hidden relative cursor-crosshair"
        style={{
          backgroundImage: `radial-gradient(circle, #292524 1px, transparent 1px), radial-gradient(circle, #1c1917 1px, #141312 100%)`,
          backgroundSize: '24px 24px'
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
            width: '2400px',
            height: '1800px',
            position: 'absolute'
          }}
        >
          {/* SVG Yarn Lines connecting nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {boardState.edges.map((edge) => {
              const fromNode = boardState.nodes.find((n) => n.id === edge.from);
              const toNode = boardState.nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.x + 95;
              const y1 = fromNode.y + 40;
              const x2 = toNode.x + 95;
              const y2 = toNode.y + 40;

              return (
                <g key={edge.id}>
                  {/* Shadow yarn line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#000000"
                    strokeWidth="3"
                    strokeOpacity="0.4"
                  />
                  {/* Red detective yarn */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  {/* Midpoint Label */}
                  {edge.label && (
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 - 6}
                      fill="#fca5a5"
                      fontSize="9px"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="bg-slate-900"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Draggable Pinned Nodes */}
          {boardState.nodes.map((node) => {
            const isNote = Boolean(node.noteText);

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDownNode(e, node.id)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: isNote ? '190px' : '200px'
                }}
                className={`absolute rounded-md shadow-2xl z-10 cursor-move transition-shadow select-none group border ${
                  isNote
                    ? 'bg-amber-100/90 text-stone-900 border-amber-300 p-3 rotate-[-1deg]'
                    : 'bg-slate-950/95 text-slate-200 border-slate-700 p-3 hover:border-blue-400'
                }`}
              >
                {/* Visual Pushpin */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-600 border border-rose-300 shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => handleDeleteNode(node.id, e)}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-800 text-slate-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px]"
                >
                  <Icon name="X" className="w-2.5 h-2.5" />
                </button>

                {/* Content */}
                {isNote ? (
                  <div>
                    <div className="text-xs font-bold font-mono tracking-wide text-amber-950 uppercase border-b border-amber-300 pb-1 mb-1">
                      {node.label}
                    </div>
                    <p className="text-[11px] font-mono text-amber-900 leading-tight whitespace-pre-wrap">
                      {node.noteText}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-[9px] text-slate-400 uppercase font-mono pb-1 border-b border-slate-800">
                      <span>{node.recordType || 'RECORD'}</span>
                      {node.recordId && <span>{node.recordId}</span>}
                    </div>
                    <div className="text-xs font-bold text-slate-100 mt-1 truncate hover:text-blue-400">
                      {node.label}
                    </div>
                    {node.subtitle && (
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate font-mono">
                        {node.subtitle}
                      </div>
                    )}
                    {node.recordId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRecord(node.recordId!);
                        }}
                        className="mt-2 w-full py-0.5 rounded bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-[10px] font-bold font-mono border border-blue-500/40 transition-colors"
                      >
                        OPEN DOCKET
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Note Modal */}
      {showAddNoteModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-950 border border-slate-700 rounded-lg p-5 w-full max-w-md shadow-2xl">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Pin Custom Investigative Sticky Note
            </h3>
            <form onSubmit={handleAddCustomNote} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">NOTE TITLE / HEADER</label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. DISCREPANCY: 9:40 PM DISPATCH"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 focus:outline-hidden focus:border-amber-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">NOTE OBSERVATION</label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write investigative thoughts, timestamp clashes, suspect motives..."
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 focus:outline-hidden focus:border-amber-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="px-3 py-1 rounded bg-slate-900 text-slate-400 hover:text-slate-200"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  PIN TO WALL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
