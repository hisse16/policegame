import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { BoardNode, AnyRecord } from '../../../types/police';
import { policeDatabase } from '../../../services/police/databaseEngine';
import { storyEngine } from '../../../services/story/storyEngine';

interface AddNodeModalProps {
  onClose: () => void;
  onAdded: (node: BoardNode) => void;
}

export const AddNodeModal: React.FC<AddNodeModalProps> = ({ onClose, onAdded }) => {
  const [tab, setTab] = useState<'record' | 'note' | 'question' | 'hypothesis'>('record');

  // Record picker state
  const [searchQuery, setSearchQuery] = useState('');
  const allRecords = policeDatabase.getAllRecords();
  const filteredRecords = searchQuery.trim()
    ? allRecords.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.type.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10)
    : allRecords.slice(0, 8);

  // Custom note state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Question state
  const [questionText, setQuestionText] = useState('');

  // Hypothesis state
  const [hypTitle, setHypTitle] = useState('');
  const [hypSummary, setHypSummary] = useState('');
  const [hypConfidence, setHypConfidence] = useState(50);
  const [hypStatus, setHypStatus] = useState<BoardNode['hypothesisStatus']>('OPEN');

  const handlePinRecord = (rec: AnyRecord) => {
    let nodeType: BoardNode['nodeType'] = 'record';
    let color = '#3b82f6';
    let photoUrl: string | undefined;

    if (rec.type === 'person') {
      nodeType = 'person';
      color = '#e11d48';
      photoUrl = (rec as any).mugshotUrl;
    } else if (rec.type === 'evidence') {
      nodeType = 'evidence';
      color = '#0284c7';
      const ev = rec as any;
      if (ev.photos && ev.photos.length > 0) {
        photoUrl = ev.photos[0].url;
      }
    } else if (rec.type === 'case') {
      nodeType = 'case';
      color = '#9333ea';
    } else if (rec.type === 'vehicle') {
      nodeType = 'vehicle';
      color = '#ea580c';
    } else if (rec.type === 'location') {
      nodeType = 'location';
      color = '#0d9488';
    } else if (rec.type === 'report') {
      nodeType = 'report';
      color = '#4f46e5';
    }

    const newNode = storyEngine.createBoardNode({
      recordId: rec.id,
      label: rec.title.toUpperCase(),
      noteText: (rec as any).summary || (rec as any).description || (rec as any).narrative?.substring(0, 140) || 'Pinned official docket record.',
      nodeType,
      color,
      photoUrl
    });

    onAdded(newNode);
    onClose();
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    const node = storyEngine.createInvestigationNote(noteTitle.trim(), noteContent.trim());
    onAdded(node);
    onClose();
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    const node = storyEngine.createInvestigationQuestion(questionText.trim());
    onAdded(node);
    onClose();
  };

  const handleCreateHypothesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hypTitle.trim()) return;
    const node = storyEngine.createHypothesis(hypTitle.trim(), hypSummary.trim(), hypStatus, hypConfidence);
    onAdded(node);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Icon name="Pin" className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
                Pin Item to Investigation Board
              </h3>
              <p className="text-xs text-slate-400">Add Case Records, Clues, Questions & Hypotheses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-950 border-b border-slate-800 text-xs font-mono">
          <button
            onClick={() => setTab('record')}
            className={`py-2 px-1 rounded text-center transition-colors ${
              tab === 'record' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Docket Record
          </button>
          <button
            onClick={() => setTab('note')}
            className={`py-2 px-1 rounded text-center transition-colors ${
              tab === 'note' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sticky Note
          </button>
          <button
            onClick={() => setTab('question')}
            className={`py-2 px-1 rounded text-center transition-colors ${
              tab === 'question' ? 'bg-orange-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Question
          </button>
          <button
            onClick={() => setTab('hypothesis')}
            className={`py-2 px-1 rounded text-center transition-colors ${
              tab === 'hypothesis' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hypothesis
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {tab === 'record' && (
            <div className="space-y-3">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search PRIS records by name, ID, or category..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {filteredRecords.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => handlePinRecord(rec)}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-400">{rec.id}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">
                          {rec.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium truncate max-w-sm mt-0.5">
                        {rec.title}
                      </p>
                    </div>
                    <button className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-mono flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Icon name="Pin" className="w-3 h-3" />
                      Pin
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'note' && (
            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1 font-mono">Note Title *</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. WITNESS INTERVIEW CLUE"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 font-mono">Observations & Clues</label>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write investigative thoughts, deductions, or cross-references..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-mono font-medium rounded-lg flex items-center gap-1.5"
                >
                  <Icon name="Check" className="w-3.5 h-3.5" />
                  Pin Sticky Note
                </button>
              </div>
            </form>
          )}

          {tab === 'question' && (
            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1 font-mono">
                  Investigative Question / Unresolved Lead *
                </label>
                <textarea
                  rows={4}
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. Why was the Crownline freight manifest missing from report R-1998-112?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-mono font-medium rounded-lg flex items-center gap-1.5"
                >
                  <Icon name="HelpCircle" className="w-3.5 h-3.5" />
                  Pin Open Question
                </button>
              </div>
            </form>
          )}

          {tab === 'hypothesis' && (
            <form onSubmit={handleCreateHypothesis} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1 font-mono">Hypothesis Premise *</label>
                <input
                  type="text"
                  required
                  value={hypTitle}
                  onChange={(e) => setHypTitle(e.target.value)}
                  placeholder="e.g. TRAFFIC STOP AT 42 WILLOW WAS UNREGISTERED"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1 font-mono">Working Status</label>
                  <select
                    value={hypStatus}
                    onChange={(e) => setHypStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                  >
                    <option value="OPEN">OPEN (Under Investigation)</option>
                    <option value="SUPPORTED">SUPPORTED (Corroborated)</option>
                    <option value="WEAKENED">WEAKENED (Doubtful)</option>
                    <option value="DISPROVEN">DISPROVEN (Contradicted)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1 font-mono">Confidence ({hypConfidence}%)</label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={hypConfidence}
                    onChange={(e) => setHypConfidence(Number(e.target.value))}
                    className="w-full accent-purple-500 mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 font-mono">Theoretical Reasoning & Theory</label>
                <textarea
                  rows={3}
                  value={hypSummary}
                  onChange={(e) => setHypSummary(e.target.value)}
                  placeholder="Explain how the timeline, witness sightings, and physical evidence converge..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono font-medium rounded-lg flex items-center gap-1.5"
                >
                  <Icon name="Lightbulb" className="w-3.5 h-3.5" />
                  Pin Working Hypothesis
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
