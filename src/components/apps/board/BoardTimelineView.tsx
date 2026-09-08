import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { BoardTimelineEvent, BoardNode } from '../../../types/police';
import { storyEngine } from '../../../services/story/storyEngine';

interface BoardTimelineViewProps {
  timelineEvents: BoardTimelineEvent[];
  nodes: BoardNode[];
  onOpenRecord: (recordId: string) => void;
  onFocusNode: (nodeId: string) => void;
}

export const BoardTimelineView: React.FC<BoardTimelineViewProps> = ({
  timelineEvents,
  nodes,
  onOpenRecord,
  onFocusNode
}) => {
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventDate, setEventDate] = useState('1998-09-14');
  const [eventTime, setEventTime] = useState('22:38:00');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [reliability, setReliability] = useState<BoardTimelineEvent['reliability']>('VERIFIED');
  const [hasContradiction, setHasContradiction] = useState(false);
  const [contradictionNote, setContradictionNote] = useState('');

  // Sort chronological
  const sortedEvents = [...timelineEvents].sort((a, b) => {
    const dtA = `${a.date} ${a.time || '00:00:00'}`;
    const dtB = `${b.date} ${b.time || '00:00:00'}`;
    return dtA.localeCompare(dtB);
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    storyEngine.addTimelineEvent({
      date: eventDate,
      time: eventTime,
      title: eventTitle.trim(),
      description: eventDesc.trim(),
      reliability,
      hasContradiction,
      contradictionNote: hasContradiction ? contradictionNote.trim() : undefined
    });

    setEventTitle('');
    setEventDesc('');
    setHasContradiction(false);
    setContradictionNote('');
    setShowAddEventModal(false);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="Clock" className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold font-mono text-slate-100 uppercase">
              Chronological Case Timeline & Contradiction Sequence
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Cross-reference movements, dispatch radio logs, witness accounts, and post-closure file alterations.
          </p>
        </div>

        <button
          onClick={() => setShowAddEventModal(true)}
          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Icon name="Plus" className="w-3.5 h-3.5" />
          Add Timeline Milestone
        </button>
      </div>

      {/* Timeline Flow */}
      <div className="flex-1 overflow-y-auto pr-1">
        {sortedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
            <Icon name="Calendar" className="w-8 h-8 mb-2 opacity-50" />
            No chronological timeline events logged yet.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {sortedEvents.map((ev) => (
              <div key={ev.id} className="relative group">
                {/* Timeline node dot */}
                <div
                  className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    ev.hasContradiction
                      ? 'bg-red-500 border-red-300 ring-2 ring-red-900 animate-pulse'
                      : ev.reliability === 'VERIFIED'
                      ? 'bg-sky-500 border-sky-300'
                      : 'bg-amber-500 border-amber-300'
                  }`}
                />

                {/* Event Card */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    ev.hasContradiction
                      ? 'bg-red-950/20 border-red-800/80 shadow-red-950/20 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-sky-400">
                        {ev.date} {ev.time && `@ ${ev.time}`}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                          ev.reliability === 'VERIFIED'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                            : 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                        }`}
                      >
                        {ev.reliability}
                      </span>
                      {ev.hasContradiction && (
                        <span className="bg-red-900/60 text-red-300 border border-red-600/50 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1">
                          <Icon name="AlertTriangle" className="w-3 h-3 text-red-400" />
                          CONTRADICTED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {ev.relatedRecordId && (
                        <button
                          onClick={() => onOpenRecord(ev.relatedRecordId!)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded text-xs font-mono transition-colors flex items-center gap-1"
                        >
                          <Icon name="ExternalLink" className="w-3 h-3" />
                          View Docket
                        </button>
                      )}
                      {ev.nodeId && (
                        <button
                          onClick={() => onFocusNode(ev.nodeId!)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono transition-colors flex items-center gap-1"
                        >
                          <Icon name="Crosshair" className="w-3 h-3" />
                          Show on Board
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wide">
                    {ev.title}
                  </h4>

                  <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                    {ev.description}
                  </p>

                  {ev.hasContradiction && ev.contradictionNote && (
                    <div className="mt-2.5 p-2.5 bg-red-950/50 border border-red-700/60 rounded-lg text-xs font-mono text-red-200 flex items-start gap-2">
                      <Icon name="AlertCircle" className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block text-red-300 mb-0.5">CRITICAL TIMELINE DISCREPANCY:</strong>
                        <span>{ev.contradictionNote}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Milestone Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Clock" className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold font-mono text-slate-100 uppercase">
                  Add Timeline Milestone
                </h3>
              </div>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-200"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-mono mb-1">Date (YYYY-MM-DD) *</label>
                  <input
                    type="text"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-mono mb-1">Time (HH:MM:SS)</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">Milestone Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Unofficial Radio Stop at Willow Street"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">Reliability Assessment</label>
                <select
                  value={reliability}
                  onChange={(e) => setReliability(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                >
                  <option value="VERIFIED">VERIFIED (Supported by official logs)</option>
                  <option value="UNVERIFIED">UNVERIFIED (Single witness statement)</option>
                  <option value="CONTRADICTED">CONTRADICTED (Physical conflict)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">Chronological Narrative</label>
                <textarea
                  rows={3}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Detail verifiable movements, communications, or occurrences..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <input
                    type="checkbox"
                    checked={hasContradiction}
                    onChange={(e) => setHasContradiction(e.target.checked)}
                    className="accent-red-500 rounded"
                  />
                  <span className="text-slate-300 font-mono text-[11px]">
                    Flag as <strong className="text-red-400">Timeline Contradiction</strong>
                  </span>
                </label>

                {hasContradiction && (
                  <div>
                    <label className="block text-red-300 font-mono mb-1">Contradiction Explanation</label>
                    <textarea
                      rows={2}
                      value={contradictionNote}
                      onChange={(e) => setContradictionNote(e.target.value)}
                      placeholder="Explain conflicting alibis or impossible transit times..."
                      className="w-full bg-slate-950 border border-red-900 rounded-lg p-2.5 text-red-200 text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-mono flex items-center gap-1.5"
                >
                  <Icon name="Check" className="w-3.5 h-3.5" />
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
