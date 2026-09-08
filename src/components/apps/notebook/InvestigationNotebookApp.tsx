import React, { useState, useEffect } from 'react';
import { Icon } from '../../common/Icon';
import { storyEngine } from '../../../services/story/storyEngine';
import {
  StoryFact,
  UnresolvedQuestion,
  Contradiction,
  InvestigationTimelineEvent,
  InvestigationLead
} from '../../../types/story';

export type NotebookTab =
  | 'status'
  | 'facts'
  | 'questions'
  | 'people'
  | 'locations'
  | 'cases'
  | 'evidence'
  | 'timelines'
  | 'contradictions'
  | 'leads'
  | 'notes';

interface InvestigationNotebookAppProps {
  onOpenRecord?: (recordId: string) => void;
  onOpenApp?: (appId: string) => void;
}

export const InvestigationNotebookApp: React.FC<InvestigationNotebookAppProps> = ({
  onOpenRecord,
  onOpenApp
}) => {
  const [activeTab, setActiveTab] = useState<NotebookTab>('status');
  const [facts, setFacts] = useState<StoryFact[]>([]);
  const [openQuestions, setOpenQuestions] = useState<UnresolvedQuestion[]>([]);
  const [resolvedQuestions, setResolvedQuestions] = useState<UnresolvedQuestion[]>([]);
  const [contradictions, setContradictions] = useState<Contradiction[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<InvestigationTimelineEvent[]>([]);
  const [leads, setLeads] = useState<InvestigationLead[]>([]);
  const [playerNotes, setPlayerNotes] = useState<string>('');
  const [factFilter, setFactFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [currentAct, setCurrentAct] = useState(storyEngine.getCurrentAct());

  useEffect(() => {
    const updateState = () => {
      setFacts(storyEngine.getDiscoveredFacts());
      setOpenQuestions(storyEngine.getOpenQuestions());
      setResolvedQuestions(storyEngine.getResolvedQuestions());
      setContradictions(storyEngine.getDiscoveredContradictions());
      setTimelineEvents(storyEngine.getDiscoveredTimelineEvents());
      setLeads(storyEngine.getActiveLeads());
      setPlayerNotes(storyEngine.getPlayerNotes());
      setCurrentAct(storyEngine.getCurrentAct());
    };

    const unsubscribe = storyEngine.subscribe(updateState);
    return () => unsubscribe();
  }, []);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPlayerNotes(text);
    storyEngine.setPlayerNotes(text);
  };

  const handleRequestHint = () => {
    const hint = storyEngine.getNextAvailableHint();
    if (hint) {
      const text = storyEngine.unlockHint(hint.stepId);
      setHintMessage(`[Clue Reference (${hint.stepTitle}) - Tier ${hint.currentLevel}]: ${text}`);
    } else {
      setHintMessage('All primary archival threads in the current phase have been uncovered.');
    }
  };

  // Filtered facts
  const filteredFacts = facts.filter((f) => {
    const matchesCategory = factFilter === 'ALL' || f.category === factFilter;
    const matchesSearch =
      !searchQuery ||
      f.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const status = storyEngine.getInvestigationStatus();

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-text">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-950/80 border border-blue-800 text-blue-400 rounded">
            <Icon name="BookOpen" size={16} />
          </div>
          <div>
            <div className="font-bold tracking-wide uppercase text-slate-200">
              INVESTIGATION NOTEBOOK // CASE-1998-027
            </div>
            <div className="text-[10px] text-slate-400">
              Northbridge Police Department • Cold Case Review Bureau
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded text-[11px] font-mono text-blue-300">
            {currentAct.title}: {currentAct.subtitle}
          </div>
          <button
            onClick={handleRequestHint}
            title="Request subtle investigative observation"
            className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/60 text-amber-300 rounded text-[11px] flex items-center gap-1.5 transition-colors"
          >
            <Icon name="HelpCircle" size={13} />
            <span>Investigative Lead</span>
          </button>
          {onOpenApp && (
            <button
              onClick={() => onOpenApp('final-deduction')}
              className="px-3 py-1 bg-red-950/60 hover:bg-red-900/80 border border-red-700 text-red-200 rounded text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Icon name="CheckSquare" size={13} />
              <span>Submit Findings</span>
            </button>
          )}
        </div>
      </div>

      {/* Optional Hint Banner */}
      {hintMessage && (
        <div className="px-4 py-2 bg-amber-950/40 border-b border-amber-800/50 text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="AlertCircle" size={14} className="text-amber-400 shrink-0" />
            <span className="font-mono">{hintMessage}</span>
          </div>
          <button
            onClick={() => setHintMessage(null)}
            className="text-amber-400 hover:text-amber-200 text-xs px-1.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Notebook Navigation Ribbon */}
      <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs overflow-x-auto shrink-0">
        {[
          { id: 'status', label: 'STATUS', icon: 'Compass', count: null },
          { id: 'facts', label: 'KNOWN FACTS', icon: 'CheckCircle2', count: facts.length },
          { id: 'questions', label: 'OPEN QUESTIONS', icon: 'HelpCircle', count: openQuestions.length },
          { id: 'timelines', label: 'TIMELINES', icon: 'Clock', count: timelineEvents.length },
          { id: 'contradictions', label: 'CONTRADICTIONS', icon: 'AlertTriangle', count: contradictions.length },
          { id: 'leads', label: 'LEADS', icon: 'Flag', count: leads.length },
          { id: 'people', label: 'PEOPLE', icon: 'Users', count: null },
          { id: 'locations', label: 'LOCATIONS', icon: 'MapPin', count: null },
          { id: 'cases', label: 'CASES', icon: 'Folder', count: null },
          { id: 'evidence', label: 'EVIDENCE', icon: 'Shield', count: null },
          { id: 'notes', label: 'MY NOTES', icon: 'Edit3', count: null }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as NotebookTab)}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 text-xs whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Icon name={tab.icon as any} size={13} />
            <span>{tab.label}</span>
            {tab.count !== null && tab.count > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                  activeTab === tab.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-950">
        {/* ================= TAB: STATUS & SOFT GUIDANCE ================= */}
        {activeTab === 'status' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Investigator Executive Briefing Card */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <Icon name="Compass" size={16} className="text-blue-400" />
                  <span>CURRENT INVESTIGATIVE POSTURE</span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Audited Records: {facts.length} • Discovered Flags: {status.recentDiscoveriesCount}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* What We Know */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded p-3 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <Icon name="CheckCircle2" size={14} />
                    <span>Established Facts</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    {status.whatWeKnow.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-mono mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Unresolved Questions */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded p-3 space-y-2">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <Icon name="HelpCircle" size={14} />
                    <span>Unresolved Lines of Inquiry</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    {status.unresolvedQuestions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-mono mt-0.5">?</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Current Active Leads */}
              <div className="bg-slate-950/50 border border-slate-800/60 rounded p-3 space-y-2 mt-3">
                <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <Icon name="Flag" size={14} />
                  <span>Immediate Leads Under Review</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {status.activeLeads.map((lead, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-slate-900 border border-slate-800 rounded text-slate-300 flex items-center gap-2"
                    >
                      <Icon name="ArrowRight" size={12} className="text-blue-400 shrink-0" />
                      <span className="truncate">{lead}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Act Narrative Summary */}
            <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-lg space-y-2">
              <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                Phase Narrative // {currentAct.title}
              </div>
              <h3 className="text-base font-bold text-slate-100">{currentAct.subtitle}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{currentAct.description}</p>
              <div className="mt-3 p-3 bg-blue-950/30 border border-blue-900/50 rounded text-xs text-blue-200">
                <span className="font-semibold text-blue-300 block mb-1">
                  Primary Revelation Target: {currentAct.revelationTitle}
                </span>
                <span className="text-slate-300">{currentAct.revelationText}</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: KNOWN FACTS ================= */}
        {activeTab === 'facts' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded">
              <div className="flex items-center gap-1 overflow-x-auto text-xs">
                {['ALL', 'CASE', 'PERSON', 'VEHICLE', 'EVIDENCE', 'LOCATION', 'TIMELINE', 'ARCHIVE'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setFactFilter(cat)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors ${
                        factFilter === cat
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter discovered facts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-3 py-1 text-xs text-slate-200 placeholder-slate-500 w-64 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Facts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredFacts.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-slate-500 text-xs italic">
                  No facts recorded under this filter criteria. Cross-reference PRIS records to expand findings.
                </div>
              ) : (
                filteredFacts.map((fact) => (
                  <div
                    key={fact.id}
                    className="p-3.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-lg space-y-2 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="px-2 py-0.5 bg-blue-950 border border-blue-800/80 text-blue-400 rounded">
                        {fact.category}
                      </span>
                      <span className="text-slate-400 text-[10px]">{fact.source}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{fact.text}</p>
                    {fact.relatedRecordIds && fact.relatedRecordIds.length > 0 && onOpenRecord && (
                      <div className="pt-2 border-t border-slate-800/60 flex flex-wrap gap-1.5">
                        {fact.relatedRecordIds.map((rid) => (
                          <button
                            key={rid}
                            onClick={() => onOpenRecord(rid)}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded text-[10px] font-mono transition-colors"
                          >
                            🔗 {rid}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB: OPEN QUESTIONS ================= */}
        {activeTab === 'questions' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Icon name="HelpCircle" size={14} />
                <span>ACTIVE UNRESOLVED QUESTIONS ({openQuestions.length})</span>
              </h3>
              <div className="space-y-3">
                {openQuestions.length === 0 ? (
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded text-center text-xs text-slate-500 italic">
                    All currently flagged questions have been resolved or investigated.
                  </div>
                ) : (
                  openQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-100">{q.text}</span>
                        <span className="text-[10px] font-mono text-amber-400/80 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-900/40">
                          ACT {q.act}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 italic font-mono">{q.context}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {resolvedQuestions.length > 0 && (
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Icon name="CheckCircle2" size={14} />
                  <span>RESOLVED QUESTIONS ({resolvedQuestions.length})</span>
                </h3>
                <div className="space-y-2">
                  {resolvedQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="p-3 bg-slate-900/40 border border-slate-800/60 rounded text-xs space-y-1"
                    >
                      <div className="text-slate-300 font-medium line-through opacity-75">{q.text}</div>
                      {q.resolutionSummary && (
                        <div className="text-emerald-400/90 text-[11px] font-sans">
                          Resolution: {q.resolutionSummary}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: TIMELINES & CLASHES ================= */}
        {activeTab === 'timelines' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 flex items-center justify-between">
              <span>CHRONOLOGICAL FIELD EVENT RECONSTRUCTION</span>
              <span className="text-[10px] font-mono text-blue-400">
                Clashes Detected: {timelineEvents.filter((e) => e.hasConflict).length}
              </span>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 py-2">
              {timelineEvents.map((evt) => (
                <div key={evt.id} className="relative space-y-1.5">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                      evt.hasConflict
                        ? 'bg-red-500 border-red-300'
                        : evt.confidence === 'OFFICIAL_LOG'
                        ? 'bg-blue-500 border-blue-300'
                        : 'bg-slate-700 border-slate-500'
                    }`}
                  />

                  <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                    <span className="font-mono font-bold text-blue-400">
                      {evt.timestampFormatted}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                        evt.hasConflict
                          ? 'bg-red-950/80 border-red-800 text-red-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {evt.confidence}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-200">
                    📍 {evt.location}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>Source: {evt.source}</span>
                    {evt.sourceRecordId && onOpenRecord && (
                      <button
                        onClick={() => onOpenRecord(evt.sourceRecordId!)}
                        className="text-blue-400 hover:underline font-mono text-[10px]"
                      >
                        [Open Record {evt.sourceRecordId}]
                      </button>
                    )}
                  </div>

                  {evt.hasConflict && evt.conflictDetails && (
                    <div className="p-2.5 bg-red-950/40 border border-red-800/60 rounded text-red-200 text-xs mt-1">
                      ⚠️ <strong className="font-semibold">CONFLICT DETECTED:</strong> {evt.conflictDetails}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: CONTRADICTIONS ================= */}
        {activeTab === 'contradictions' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="text-xs text-slate-400">
              DISCOVERED FACTUAL & TIMELINE CONTRADICTIONS ({contradictions.length})
            </div>

            <div className="space-y-4">
              {contradictions.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs italic bg-slate-900/40 border border-slate-800 rounded">
                  No explicit contradictions have been registered yet. Cross-reference incident dispatch times with detective notes to locate discrepancies.
                </div>
              ) : (
                contradictions.map((contra) => (
                  <div
                    key={contra.id}
                    className="p-4 bg-slate-900 border border-amber-900/50 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="font-bold text-amber-300 text-xs flex items-center gap-2">
                        <Icon name="AlertTriangle" size={15} className="text-amber-400" />
                        <span>{contra.title}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
                        {contra.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* Source A */}
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                        <div className="text-[11px] font-mono text-blue-400 font-bold">
                          SOURCE A: {contra.sourceA.label}
                        </div>
                        <p className="text-slate-300 text-xs italic">"{contra.sourceA.statement}"</p>
                        {contra.sourceA.timestamp && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            Time: {contra.sourceA.timestamp}
                          </div>
                        )}
                      </div>

                      {/* Source B */}
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                        <div className="text-[11px] font-mono text-purple-400 font-bold">
                          SOURCE B: {contra.sourceB.label}
                        </div>
                        <p className="text-slate-300 text-xs italic">"{contra.sourceB.statement}"</p>
                        {contra.sourceB.timestamp && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            Time: {contra.sourceB.timestamp}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 bg-amber-950/30 border border-amber-900/30 rounded text-xs text-amber-200">
                      <strong className="text-amber-300">Investigative Deduction: </strong>
                      {contra.explanation}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB: LEADS ================= */}
        {activeTab === 'leads' && (
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="text-xs text-slate-400">ACTIVE INVESTIGATIVE LEADS ({leads.length})</div>
            <div className="space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-bold text-slate-100 flex items-center gap-2">
                      <Icon name="Flag" size={14} className="text-blue-400" />
                      <span>{lead.title}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                        lead.priority === 'CRITICAL'
                          ? 'bg-red-950 border border-red-800 text-red-300'
                          : 'bg-blue-950 border border-blue-800 text-blue-300'
                      }`}
                    >
                      {lead.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{lead.description}</p>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                    <span className="text-[11px] text-slate-400 italic">
                      Recommended: {lead.suggestedAction}
                    </span>
                    {lead.relatedRecordId && onOpenRecord && (
                      <button
                        onClick={() => onOpenRecord(lead.relatedRecordId!)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded text-[11px] font-mono"
                      >
                        Inspect {lead.relatedRecordId}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: PEOPLE ================= */}
        {activeTab === 'people' && (
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="text-xs text-slate-400">PERSONS OF INTEREST & ASSOCIATES</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'P-004821', name: 'Anna Claire Bell', role: 'Victim / Lead Auditor', status: 'Missing (Cold Case)' },
                { id: 'OFF-3014', name: 'Detective Daniel Hayes', role: 'Lead Investigator (1998)', status: 'Transferred / Retired 2008' },
                { id: 'P-004822', name: 'Michael Bell', role: 'Brother / Registered Vehicle Owner', status: 'Questioned & Cleared' },
                { id: 'P-006219', name: 'Daniel Mercer', role: 'Bell Electronics Warehouse Supervisor', status: 'Prior Theft Record' },
                { id: 'OFF-1044', name: 'Detective John Mercer', role: 'Burglary Investigator (Retired)', status: 'Uncle of Daniel Mercer' },
                { id: 'P-005118', name: 'Evelyn Reed', role: 'Assistant Comptroller & Auditor', status: 'Grand Jury Witness' },
                { id: 'OFF-1012', name: 'Captain Arthur Vance', role: 'Detective Bureau Commander', status: 'Supervised Case 27' },
                { id: 'P-002891', name: 'Martha Gable', role: 'Neighbor at 40 Willow Street', status: 'Witness' }
              ].map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-900 border border-slate-800 rounded flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-100 flex items-center gap-2">
                      <span>{p.name}</span>
                      <span className="font-mono text-[10px] text-blue-400 bg-blue-950 px-1.5 py-0.2 rounded">
                        {p.id}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px]">{p.role}</div>
                    <div className="text-slate-500 text-[10px] font-mono">{p.status}</div>
                  </div>
                  {onOpenRecord && (
                    <button
                      onClick={() => onOpenRecord(p.id)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded text-[11px] font-mono"
                    >
                      Dossier
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: LOCATIONS ================= */}
        {activeTab === 'locations' && (
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="text-xs text-slate-400">DOCUMENTED LOCATIONS & SCENES</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'LOC-0042', name: '42 Willow Street', desc: 'Anna Bell residence; 1987 burglary scene; 1998 abduction site' },
                { id: 'ORG-0012', name: '104 Waterfront Way (Bell Electronics)', desc: 'Victim employment; warehouse shipping hub' },
                { id: 'LOC-0400', name: 'Canal Road Turnoff & Canal Storage', desc: 'Abandoned Taurus recovery site; Locker CS-14' },
                { id: 'LOC-0001', name: 'Northbridge Police Central Station', desc: 'Precinct headquarters; archives and evidence vaults' }
              ].map((loc) => (
                <div key={loc.id} className="p-3 bg-slate-900 border border-slate-800 rounded space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">{loc.name}</span>
                    <span className="font-mono text-[10px] text-blue-400">{loc.id}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{loc.desc}</p>
                  {onOpenRecord && (
                    <button
                      onClick={() => onOpenRecord(loc.id)}
                      className="text-blue-400 hover:underline font-mono text-[11px] block mt-1"
                    >
                      View Location Docket →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: CASES ================= */}
        {activeTab === 'cases' && (
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="text-xs text-slate-400">RELATED CASE DOCKETS</div>
            <div className="space-y-3">
              {[
                {
                  id: 'CASE-1998-027',
                  title: 'Suspicious Disappearance of Anna Claire Bell',
                  date: '1998-09-14',
                  status: 'COLD CASE // REOPENED 2026',
                  summary: 'Disappearance of 26-year-old auditor following work shift. Subject vehicle found abandoned 18 days later.'
                },
                {
                  id: 'CASE-1987-014',
                  title: 'Crownline Warehouse Larceny & Burglary',
                  date: '1987-02-14',
                  status: 'CLOSED // UNPROSECUTED',
                  summary: 'Theft of freight manifests from 42 Willow Street; Daniel Mercer arrested then released without charges.'
                },
                {
                  id: 'CASE-1989-114',
                  title: 'Internal Affairs: 3rd Precinct Freight Escort Inquiry',
                  date: '1989-06-20',
                  status: 'SEALED // CLASSIFIED',
                  summary: 'Investigated officers Hayes and Mercer for providing unauthorized police escorts to Crownline trucks.'
                }
              ].map((c) => (
                <div key={c.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">{c.title}</span>
                    <span className="font-mono text-[11px] text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                      {c.id}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs">{c.summary}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                    <span>Date: {c.date} • Status: {c.status}</span>
                    {onOpenRecord && (
                      <button
                        onClick={() => onOpenRecord(c.id)}
                        className="text-blue-400 hover:underline font-sans font-medium"
                      >
                        Open Case File →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: EVIDENCE ================= */}
        {activeTab === 'evidence' && (
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="text-xs text-slate-400">PHYSICAL & DIGITAL EVIDENCE REPOSITORY</div>
            <div className="space-y-3">
              {[
                {
                  id: 'E-004821',
                  name: 'Brass Locker Key "CS-14" & Dictation Micro-Cassette',
                  location: 'Recovered from floor of 1987 Ford Taurus TXR-481',
                  status: 'Vault B, Shelf 01'
                },
                {
                  id: 'E-004823',
                  name: 'Crime Lab Forensic Tape Transcript',
                  location: 'Forensics analysis of micro-cassette E-004821',
                  status: 'Forensic Archives'
                },
                {
                  id: 'E-004829',
                  name: 'Canal Storage CS-14 Duplicate Ledgers',
                  location: 'Recovered from off-site locker during 2026 review',
                  status: 'Cold Case Unit Secure Locker'
                }
              ].map((item) => (
                <div key={item.id} className="p-3 bg-slate-900 border border-slate-800 rounded flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-100 flex items-center gap-2">
                      <span>{item.name}</span>
                      <span className="font-mono text-[10px] text-blue-400 bg-blue-950 px-1.5 py-0.2 rounded">
                        {item.id}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px]">{item.location}</div>
                    <div className="text-slate-500 text-[10px] font-mono">Location: {item.status}</div>
                  </div>
                  {onOpenRecord && (
                    <button
                      onClick={() => onOpenRecord(item.id)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded text-[11px] font-mono"
                    >
                      Evidence Log
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: PERSONAL NOTES ================= */}
        {activeTab === 'notes' && (
          <div className="max-w-4xl mx-auto space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>DETECTIVE SCRATCHPAD // AUTOSAVED</span>
              <span className="text-[10px] font-mono text-slate-500">
                Char Count: {playerNotes.length}
              </span>
            </div>
            <textarea
              value={playerNotes}
              onChange={handleNotesChange}
              placeholder="Record your personal investigative theories, timeline notes, suspects, and cross-references here..."
              className="flex-1 w-full min-h-[350px] p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
            />
          </div>
        )}
      </div>
    </div>
  );
};
