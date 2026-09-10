import React, { useEffect, useState } from 'react';
import { Icon } from '../../common/Icon';
import { storyEngine } from '../../../services/story/storyEngine';
import { policeDatabase } from '../../../services/police/databaseEngine';

export type NotebookTab = 'notes' | 'bookmarks' | 'timelines' | 'contradictions';

interface InvestigationNotebookAppProps {
  onOpenRecord?: (recordId: string) => void;
}

export const InvestigationNotebookApp: React.FC<InvestigationNotebookAppProps> = ({ onOpenRecord }) => {
  const [activeTab, setActiveTab] = useState<NotebookTab>('notes');
  const [playerNotes, setPlayerNotes] = useState(storyEngine.getPlayerNotes());
  const [timelineEvents, setTimelineEvents] = useState<any[]>(storyEngine.getDiscoveredTimelineEvents());
  const [contradictions, setContradictions] = useState<any[]>(storyEngine.getDiscoveredContradictions());
  const [bookmarks, setBookmarks] = useState<any[]>(policeDatabase.getAllBookmarks());

  useEffect(() => {
    const refresh = () => {
      setPlayerNotes(storyEngine.getPlayerNotes());
      setTimelineEvents(storyEngine.getDiscoveredTimelineEvents());
      setContradictions(storyEngine.getDiscoveredContradictions());
      setBookmarks(policeDatabase.getAllBookmarks());
    };

    const unsubscribeStory = storyEngine.subscribe(refresh);
    const unsubscribeDatabase = policeDatabase.subscribe(refresh);
    refresh();

    return () => {
      unsubscribeStory();
      unsubscribeDatabase();
    };
  }, []);

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setPlayerNotes(value);
    storyEngine.setPlayerNotes(value);
  };

  const tabs: Array<{ id: NotebookTab; label: string; icon: string; count?: number }> = [
    { id: 'notes', label: 'MY NOTES', icon: 'Edit3' },
    { id: 'bookmarks', label: 'BOOKMARKS', icon: 'Bookmark', count: bookmarks.length },
    { id: 'timelines', label: 'TIMELINE', icon: 'Clock', count: timelineEvents.length },
    { id: 'contradictions', label: 'CONTRADICTIONS', icon: 'AlertTriangle', count: contradictions.length }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-text">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-950/80 border border-blue-800 text-blue-400 rounded">
            <Icon name="BookOpen" size={16} />
          </div>
          <div>
            <div className="font-bold tracking-wide uppercase text-slate-200 text-xs">CASE NOTEBOOK // CASE-1998-027</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Your working memory. The notebook does not tell you what to investigate.</div>
          </div>
        </div>
        <div className="text-[10px] font-mono text-slate-500">PLAYER NOTES</div>
      </div>

      <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs overflow-x-auto shrink-0">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-1.5 rounded flex items-center gap-1.5 text-xs whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}`}>
            <Icon name={tab.icon} size={13} />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-mono ${activeTab === tab.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-300'}`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-950">
        {activeTab === 'notes' && (
          <div className="max-w-4xl mx-auto h-full flex flex-col gap-3">
            <div>
              <div className="text-xs font-bold text-slate-200">Your investigation notes</div>
              <div className="text-[11px] text-slate-500 mt-1">Write theories, names, questions, times or anything you want to remember.</div>
            </div>
            <textarea value={playerNotes} onChange={handleNotesChange} placeholder="Start writing..." className="flex-1 min-h-[320px] w-full resize-none bg-slate-900/70 border border-slate-800 rounded-lg p-4 text-sm text-slate-200 leading-relaxed placeholder-slate-600 focus:outline-none focus:border-blue-700/70 font-mono" />
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className="max-w-4xl mx-auto space-y-3">
            <div>
              <div className="text-xs font-bold text-slate-200">Records you chose to keep</div>
              <div className="text-[11px] text-slate-500 mt-1">Bookmarks are player-controlled. Nothing here is presented as your next task.</div>
            </div>
            {bookmarks.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-800 rounded-lg text-center text-xs text-slate-600">No bookmarked records yet.</div>
            ) : bookmarks.map((record) => (
              <button key={record.recordId} onClick={() => onOpenRecord?.(record.recordId)} className="w-full p-3 bg-slate-900/70 border border-slate-800 hover:border-blue-700/50 rounded-lg text-left transition-colors">
                <div className="text-xs font-mono font-semibold text-slate-200">{record.title || record.recordId}</div>
                <div className="text-[10px] text-slate-500 mt-1">{record.recordId} // {(record.recordType || 'record').toUpperCase()}</div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'timelines' && (
          <div className="max-w-4xl mx-auto space-y-3">
            <div>
              <div className="text-xs font-bold text-slate-200">Timeline anchors</div>
              <div className="text-[11px] text-slate-500 mt-1">Observations surfaced by records you have actually examined.</div>
            </div>
            {timelineEvents.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-800 rounded-lg text-center text-xs text-slate-600">No timeline anchors recorded yet.</div>
            ) : timelineEvents.map((event, index) => (
              <div key={event.id || index} className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
                <div className="flex items-center gap-2 text-[10px] font-mono text-blue-400"><span>{event.date || 'DATE UNKNOWN'}</span>{event.time && <span>{event.time}</span>}</div>
                <div className="text-xs text-slate-200 mt-1 leading-relaxed">{event.description || event.title || String(event)}</div>
                {event.source && <div className="text-[10px] text-slate-600 mt-2 font-mono">SOURCE: {event.source}</div>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contradictions' && (
          <div className="max-w-4xl mx-auto space-y-3">
            <div>
              <div className="text-xs font-bold text-slate-200">Contradictions you uncovered</div>
              <div className="text-[11px] text-slate-500 mt-1">The notebook records conflicts; it does not decide which source is truthful.</div>
            </div>
            {contradictions.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-800 rounded-lg text-center text-xs text-slate-600">No contradictions recorded yet.</div>
            ) : contradictions.map((item, index) => (
              <div key={item.id || index} className="p-4 bg-amber-950/20 border border-amber-900/50 rounded-lg">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300"><Icon name="AlertTriangle" size={14} />{item.title || 'Record conflict'}</div>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">{item.description || item.text || String(item)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
