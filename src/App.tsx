import React, { useMemo, useState } from 'react';
import { Search, FileText, Users, GitBranch, Lightbulb, Check, X, ChevronRight, Eye, RotateCcw } from 'lucide-react';

type Evidence = {
  id: string;
  title: string;
  type: string;
  date: string;
  summary: string;
  detail: string;
  tags: string[];
  unlocks?: string[];
};

type Person = {
  id: string;
  name: string;
  role: string;
  statement: string;
  note: string;
};

type Thread = {
  id: string;
  title: string;
  description: string;
  evidence: string[];
  question: string;
};

const EVIDENCE: Evidence[] = [
  {
    id: 'r-112', title: 'Original Disappearance Report', type: 'POLICE REPORT', date: '15 SEP 1998',
    summary: 'Anna Claire Bell was reported missing after failing to return home. The report places her last known movements near Willow Street.',
    detail: 'Filed at 08:14. The report says Anna left Bell Electronics shortly after 22:00 and was expected home within minutes. A vehicle described as a dark sedan was noted near 42 Willow Street. The report contains no explanation for the later change in the official timeline.',
    tags: ['Anna Bell', 'Willow Street', '22:00'], unlocks: ['timeline']
  },
  {
    id: 'inc-0914', title: 'CAD Incident Log', type: 'DISPATCH RECORD', date: '14 SEP 1998',
    summary: 'The emergency call was logged at 22:17, while the responding detective later recorded a substantially different arrival time.',
    detail: 'Raw dispatch data records the call at 22:17. The first field note attributed to Detective Hayes begins at 22:40. No corresponding explanation appears in the surviving dispatch record. The gap is small enough to matter and large enough to require an explanation.',
    tags: ['22:17', '22:40', 'Hayes'], unlocks: ['timeline']
  },
  {
    id: 'r-114', title: 'Supplemental Report', type: 'POLICE REPORT', date: '18 SEP 1998',
    summary: 'A later report quietly changes the description of Anna’s final known location and adds Detective Hayes as the primary author.',
    detail: 'The supplemental narrative says Anna was last seen closer to Willow Street than the original report indicates. It was filed three days after the disappearance. The document references an interview that is absent from the main case index.',
    tags: ['Hayes', 'last sighting', 'missing interview']
  },
  {
    id: 'gable', title: 'Witness Statement — Martha Gable', type: 'WITNESS STATEMENT', date: '15 SEP 1998',
    summary: 'A neighbor heard a car door and an argument shortly before 22:30.',
    detail: 'Martha Gable, resident of 40 Willow Street, says she heard a vehicle stop outside, followed by a single car door and raised voices. She could not see the people involved. Her statement places the event before the time given in Hayes’s supplemental report.',
    tags: ['22:30', 'vehicle', 'voices']
  },
  {
    id: 'leo', title: 'Witness Statement — Leo Vance', type: 'WITNESS STATEMENT', date: '16 SEP 1998',
    summary: 'A diner clerk remembers seeing Anna’s car leave the industrial district at approximately 22:15.',
    detail: 'Leo Vance worked the night counter on Grand Avenue. He remembers Anna because he recognized the Bell Electronics parking permit on her windshield. His estimate puts her departure earlier than the later police timeline.',
    tags: ['22:15', 'Anna Bell', 'Bell Electronics']
  },
  {
    id: 'hayes', title: 'Officer Profile — Daniel Hayes', type: 'PERSONNEL FILE', date: '1998',
    summary: 'Hayes was the lead detective on Case 27 and authored the supplemental report.',
    detail: 'Badge 3014. Assigned to the Case 27 investigation in September 1998. The personnel file records a transfer in 2008 but does not explain it. His name also appears on an older 1991 case involving Crownline-linked freight.',
    tags: ['Badge 3014', 'Case 27', 'Crownline']
  },
  {
    id: 'case-87', title: 'Case 1987-014', type: 'HISTORICAL CASE', date: '03 NOV 1987',
    summary: 'An older burglary at 42 Willow Street involved a warehouse connected to Crownline Logistics.',
    detail: 'The case concerns missing freight records and equipment from a warehouse at the same address later connected to Case 27. One name in the old report is partially obscured in the surviving copy. Crownline Logistics appears in the property and transport records.',
    tags: ['1987', 'Willow Street', 'Crownline']
  },
  {
    id: 'crownline', title: 'Crownline Logistics — Cross-reference', type: 'BUSINESS RECORD', date: '1987–1998',
    summary: 'Crownline appears in both the 1987 warehouse investigation and Bell Electronics shipping records.',
    detail: 'The company handled freight for Bell Electronics. The surviving cross-reference does not establish a crime by itself. It establishes a relationship worth testing against the people, dates and movements already in the case.',
    tags: ['Crownline', 'Bell Electronics', 'freight']
  }
];

const PEOPLE: Person[] = [
  { id: 'anna', name: 'Anna Claire Bell', role: 'Missing person · Bell Electronics auditor', statement: 'No surviving statement.', note: 'Her disappearance is the central event. Several records concern what she discovered at work shortly before she vanished.' },
  { id: 'hayes', name: 'Daniel Hayes', role: 'Detective · Badge 3014', statement: 'Primary investigator on Case 27.', note: 'Authored the supplemental report and later transferred departments.' },
  { id: 'gable', name: 'Martha Gable', role: 'Neighbor · Witness', statement: 'Heard a vehicle, a door and raised voices.', note: 'Her timing conflicts with the later police narrative.' },
  { id: 'leo', name: 'Leo Vance', role: 'Diner clerk · Witness', statement: 'Saw Anna’s car leave around 22:15.', note: 'His statement is referenced indirectly but is difficult to find in the original case index.' }
];

const THREADS: Thread[] = [
  { id: 'timeline', title: 'The missing 20 minutes', description: 'The surviving records disagree about when Anna was last seen and when police arrived.', evidence: ['r-112', 'inc-0914', 'gable', 'leo'], question: 'Which timestamp can be trusted, and what happened during the gap?' },
  { id: 'hayes', title: 'Hayes and the altered narrative', description: 'The lead detective appears at the exact point where the timeline changes.', evidence: ['r-114', 'hayes', 'inc-0914'], question: 'Why did the supplemental report change the sequence of events?' },
  { id: 'willow', title: 'Why Willow Street?', description: 'The disappearance happened at a location that already appears in an older investigation.', evidence: ['r-112', 'case-87', 'crownline'], question: 'What connects the 1987 warehouse case to Anna?' },
  { id: 'crownline', title: 'The freight connection', description: 'Crownline links an old property case to Anna’s workplace, but the connection is not yet a conclusion.', evidence: ['hayes', 'case-87', 'crownline'], question: 'Who had a reason to keep this relationship out of the case?' }
];

const INITIAL_DISCOVERED = ['r-112', 'inc-0914', 'r-114', 'gable', 'leo', 'hayes', 'case-87', 'crownline'];

const App: React.FC = () => {
  const [view, setView] = useState<'case' | 'evidence' | 'people' | 'threads' | 'deduction'>('case');
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<string>('timeline');
  const [query, setQuery] = useState('');
  const [examined, setExamined] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('case27_examined') || '[]'); } catch { return []; }
  });
  const [killer, setKiller] = useState('');
  const [motive, setMotive] = useState('');
  const [method, setMethod] = useState('');
  const [time, setTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const visibleEvidence = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return EVIDENCE;
    return EVIDENCE.filter(e => `${e.title} ${e.type} ${e.summary} ${e.detail} ${e.tags.join(' ')}`.toLowerCase().includes(q));
  }, [query]);

  const examine = (id: string) => {
    setSelectedEvidence(id);
    if (!examined.includes(id)) {
      const next = [...examined, id];
      setExamined(next);
      try { localStorage.setItem('case27_examined', JSON.stringify(next)); } catch {}
    }
  };

  const resetCase = () => {
    setExamined([]); setSubmitted(false); setKiller(''); setMotive(''); setMethod(''); setTime('');
    try { localStorage.removeItem('case27_examined'); } catch {}
  };

  const selected = EVIDENCE.find(e => e.id === selectedEvidence);
  const thread = THREADS.find(t => t.id === activeThread) || THREADS[0];
  const score = [killer.toLowerCase().includes('hayes'), motive.toLowerCase().includes('ledger'), method.toLowerCase().includes('car'), time.includes('22:')].filter(Boolean).length;

  return (
    <div className="game-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">27</span><div><strong>CASE 27</strong><span>INVESTIGATION FILE</span></div></div>
        <div className="case-status"><span className="status-dot" /> OPEN CASE <span className="divider" /> 14 SEP 1998</div>
        <button className="icon-button" title="Reset investigation" onClick={resetCase}><RotateCcw size={16} /></button>
      </header>

      <main className="workspace">
        <aside className="sidebar">
          <div className="case-heading"><span>CASE FILE</span><h1>Anna Claire Bell</h1><p>Missing person · Case-1998-027</p></div>
          <nav>
            <button className={view === 'case' ? 'nav-item active' : 'nav-item'} onClick={() => setView('case')}><FileText size={17}/> Overview</button>
            <button className={view === 'evidence' ? 'nav-item active' : 'nav-item'} onClick={() => setView('evidence')}><Search size={17}/> Evidence <b>{examined.length}</b></button>
            <button className={view === 'people' ? 'nav-item active' : 'nav-item'} onClick={() => setView('people')}><Users size={17}/> People</button>
            <button className={view === 'threads' ? 'nav-item active' : 'nav-item'} onClick={() => setView('threads')}><GitBranch size={17}/> Investigation Threads</button>
            <button className={view === 'deduction' ? 'nav-item active' : 'nav-item'} onClick={() => setView('deduction')}><Lightbulb size={17}/> Your Deduction</button>
          </nav>
          <div className="sidebar-note"><span>CASE PRINCIPLE</span><p>Evidence gives you questions. The case does not give you tasks.</p></div>
        </aside>

        <section className="content">
          {view === 'case' && <Overview onNavigate={setView} />}
          {view === 'evidence' && <EvidenceView evidence={visibleEvidence} query={query} setQuery={setQuery} examined={examined} onExamine={examine} selected={selected} />}
          {view === 'people' && <PeopleView />}
          {view === 'threads' && <ThreadsView thread={thread} activeThread={activeThread} setActiveThread={setActiveThread} onEvidence={examine} />}
          {view === 'deduction' && <DeductionView killer={killer} motive={motive} method={method} time={time} setKiller={setKiller} setMotive={setMotive} setMethod={setMethod} setTime={setTime} submitted={submitted} setSubmitted={setSubmitted} score={score} />}
        </section>
      </main>
    </div>
  );
};

const Overview = ({ onNavigate }: { onNavigate: (v: any) => void }) => (
  <div className="page fade-in">
    <div className="eyebrow">CASE FILE · 1998-027</div>
    <h2>Something in the official story is wrong.</h2>
    <p className="lede">Anna Claire Bell disappeared on the night of September 14, 1998. The original case was closed. Years later, an audit found discrepancies in the record. You are reviewing the surviving evidence without a prescribed line of investigation.</p>
    <div className="fact-grid">
      <div><span>KNOWN</span><strong>Last confirmed activity</strong><p>Bell Electronics, shortly after 22:00.</p></div>
      <div><span>KNOWN</span><strong>Emergency call</strong><p>CAD log records 22:17.</p></div>
      <div><span>UNRESOLVED</span><strong>Last known location</strong><p>Records disagree about Willow Street.</p></div>
      <div><span>UNRESOLVED</span><strong>Missing record</strong><p>A referenced interview is absent from the index.</p></div>
    </div>
    <div className="section-head"><div><span className="eyebrow">START WITH A QUESTION</span><h3>What bothers you?</h3></div></div>
    <div className="question-cards">
      <button onClick={() => onNavigate('evidence')}><span>01</span><strong>The timeline doesn't fit.</strong><small>Compare the raw dispatch log with witness accounts.</small><ChevronRight size={17}/></button>
      <button onClick={() => onNavigate('threads')}><span>02</span><strong>Why does Willow Street matter?</strong><small>An older case happened at the same address.</small><ChevronRight size={17}/></button>
      <button onClick={() => onNavigate('people')}><span>03</span><strong>Who shaped the record?</strong><small>Follow the people whose statements changed the case.</small><ChevronRight size={17}/></button>
    </div>
    <div className="warning"><strong>There are no objectives.</strong> Read what interests you. Form a theory when you think you have one.</div>
  </div>
);

const EvidenceView = ({ evidence, query, setQuery, examined, onExamine, selected }: any) => (
  <div className="page fade-in">
    <div className="page-title"><div><span className="eyebrow">CASE FILE</span><h2>Evidence</h2><p>Nothing is marked as the "right" clue. Decide what matters.</p></div><div className="search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search the case file..." /></div></div>
    <div className="evidence-layout">
      <div className="evidence-list">{evidence.map((e: Evidence) => <button key={e.id} className={`evidence-card ${selected?.id === e.id ? 'selected' : ''}`} onClick={() => onExamine(e.id)}><div className="evidence-meta"><span>{e.type}</span><time>{e.date}</time>{examined.includes(e.id) && <Check size={14}/>}</div><strong>{e.title}</strong><p>{e.summary}</p><div className="tags">{e.tags.map(t => <em key={t}>{t}</em>)}</div></button>)}</div>
      <div className="evidence-detail">{selected ? <><div className="eyebrow">DOCUMENT VIEW</div><h3>{selected.title}</h3><span className="doc-type">{selected.type} · {selected.date}</span><p className="detail-text">{selected.detail}</p><div className="margin-note"><Eye size={15}/><span><b>Why might this matter?</b><br/>The game will not answer that for you. Compare this record with other evidence.</span></div></> : <div className="empty"><Search size={28}/><strong>Select a record</strong><span>Read it closely. Contradictions are often more useful than confirmations.</span></div>}</div>
    </div>
  </div>
);

const PeopleView = () => (
  <div className="page fade-in"><div className="eyebrow">CASE FILE</div><h2>People</h2><p className="lede">People are not objectives. They are sources, witnesses and possible explanations. Decide whose account deserves another look.</p><div className="people-grid">{PEOPLE.map(p => <article className="person-card" key={p.id}><div className="person-initial">{p.name.split(' ').map(x => x[0]).slice(0,2).join('')}</div><span className="eyebrow">{p.role}</span><h3>{p.name}</h3><blockquote>“{p.statement}”</blockquote><p>{p.note}</p></article>)}</div></div>
);

const ThreadsView = ({ thread, activeThread, setActiveThread, onEvidence }: any) => (
  <div className="page fade-in"><div className="eyebrow">INVESTIGATION</div><h2>Threads</h2><p className="lede">A thread is a question you choose to pursue. It is deliberately not a task list.</p><div className="threads-layout"><div className="thread-list">{THREADS.map(t => <button key={t.id} className={activeThread === t.id ? 'thread-item active' : 'thread-item'} onClick={() => setActiveThread(t.id)}><span>{t.title}</span><small>{t.evidence.length} related records</small></button>)}</div><div className="thread-detail"><span className="eyebrow">OPEN THREAD</span><h3>{thread.title}</h3><p>{thread.description}</p><div className="question-box"><span>QUESTION</span><strong>{thread.question}</strong></div><span className="eyebrow">RELATED EVIDENCE</span><div className="related">{thread.evidence.map((id: string) => { const e = EVIDENCE.find(x => x.id === id); return e ? <button key={id} onClick={() => onEvidence(id)}><FileText size={15}/>{e.title}<ChevronRight size={14}/></button> : null; })}</div></div></div></div>
);

const DeductionView = ({ killer, motive, method, time, setKiller, setMotive, setMethod, setTime, submitted, setSubmitted, score }: any) => (
  <div className="page fade-in deduction"><div className="eyebrow">YOUR NOTEBOOK</div><h2>Your deduction</h2><p className="lede">When you think the evidence supports a theory, commit it. You are not being asked to guess—you are being asked to explain.</p><div className="deduction-form"><label>WHO IS RESPONSIBLE?<input value={killer} onChange={e => setKiller(e.target.value)} placeholder="Name or role" /></label><label>WHY?<input value={motive} onChange={e => setMotive(e.target.value)} placeholder="What was the motive?" /></label><label>HOW?<input value={method} onChange={e => setMethod(e.target.value)} placeholder="How did it happen?" /></label><label>WHEN?<input value={time} onChange={e => setTime(e.target.value)} placeholder="Approximate time" /></label><button className="submit-theory" onClick={() => setSubmitted(true)}>Submit theory</button></div>{submitted && <div className={`result ${score === 4 ? 'correct' : ''}`}>{score === 4 ? <Check size={22}/> : <X size={22}/>}<div><strong>{score === 4 ? 'Your reconstruction holds.' : 'Something in the reconstruction is inconsistent.'}</strong><p>{score === 4 ? 'Hayes · the missing ledger · the vehicle · the 22:xx window.' : `${score}/4 elements align with the surviving evidence. The case does not reveal which element is wrong. Go back to the evidence.`}</p></div></div>}</div>
);

export default App;
