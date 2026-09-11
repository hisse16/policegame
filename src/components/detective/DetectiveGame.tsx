import React, { useEffect, useMemo, useState } from 'react';
import { CASE_001, CaseDocument, CasePerson, Evidence } from '../../data/case001';

type Tab = 'desk' | 'case' | 'documents' | 'people' | 'evidence' | 'timeline' | 'requests' | 'reports' | 'notes' | 'conclusion';
type Request = { id: string; subject: string; question: string; documentId: string; readyAt: number; complete: boolean };
type Conclusion = { what: string; who: string; when: string; why: string; proof: string };

const SAVE = 'blackwood_case001_v6';
const FIELD_TIME = 12000;

const labels: Record<Tab, string> = {
  desk: 'Desk', case: 'Case file', documents: 'Documents', people: 'People', evidence: 'Evidence board',
  timeline: 'Timeline', requests: 'Arthur / fieldwork', reports: 'Field reports', notes: 'Notebook', conclusion: 'Final deduction'
};

const emptyConclusion: Conclusion = { what: '', who: '', when: '', why: '', proof: '' };

export const DetectiveGame: React.FC = () => {
  const [tab, setTab] = useState<Tab>('desk');
  const [opened, setOpened] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [conclusion, setConclusion] = useState<Conclusion>(emptyConclusion);
  const [modalDoc, setModalDoc] = useState<CaseDocument | null>(null);
  const [modalPerson, setModalPerson] = useState<CasePerson | null>(null);
  const [intro, setIntro] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [newspaper, setNewspaper] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE) || 'null');
      if (!saved) return;
      setTab(saved.tab || 'desk');
      setOpened(Array.isArray(saved.opened) ? saved.opened : []);
      setNotes(saved.notes || '');
      setRequests(Array.isArray(saved.requests) ? saved.requests : []);
      setSelectedEvidence(Array.isArray(saved.selectedEvidence) ? saved.selectedEvidence : []);
      setConclusion({ ...emptyConclusion, ...(saved.conclusion || {}) });
      setSubmitted(Boolean(saved.submitted));
      setNewspaper(Boolean(saved.newspaper));
      setIntro(false);
    } catch { /* ignore corrupt local saves */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(SAVE, JSON.stringify({ tab, opened, notes, requests, selectedEvidence, conclusion, submitted, newspaper }));
  }, [tab, opened, notes, requests, selectedEvidence, conclusion, submitted, newspaper]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setRequests(current => current.map(r => r.complete || r.readyAt > now ? r : { ...r, complete: true }));
  }, [now]);

  const completed = requests.filter(r => r.complete);
  const pending = requests.filter(r => !r.complete);
  const openedSet = useMemo(() => new Set(opened), [opened]);

  const openDocument = (doc: CaseDocument) => {
    setOpened(current => current.includes(doc.id) ? current : [...current, doc.id]);
    setModalDoc(doc);
  };

  const requestOptions = useMemo(() => {
    const options: Array<{ id: string; subject: string; question: string; documentId: string }> = [
      { id: 'scene', subject: 'Apartment / scene', question: 'Re-examine the apartment for details the original examination did not explain.', documentId: 'clock' },
    ];
    if (openedSet.has('note')) options.push({ id: 'weather', subject: 'Weather and the clock', question: 'Establish the relationship between the stopped wall clock and the beginning of the rain.', documentId: 'weather' });
    if (openedSet.has('helen')) options.push({ id: 'street', subject: 'Blue sedan / EW-19', question: 'Trace the blue sedan and determine what the partial registration can actually prove.', documentId: 'street' });
    if (openedSet.has('school')) options.push({ id: 'archive', subject: 'The 1998 archive', question: 'Examine the conflicting attendance records and the history of the missing pages.', documentId: 'archive' });
    if (openedSet.has('archive') || openedSet.has('note')) options.push({ id: 'photo-context', subject: 'The old photograph', question: 'Find out why the photograph was separated from the normal staff file.', documentId: 'photo-context' });
    if (openedSet.has('school')) options.push({ id: 'daniel', subject: 'Daniel Hayes', question: 'Clarify what Anna discovered and what she meant by the original record.', documentId: 'daniel' });
    if (openedSet.has('helen')) options.push({ id: 'helen2', subject: 'Helen Ward — follow-up', question: 'Clarify exactly what Helen saw, heard, and why she withheld Edward Ward’s name.', documentId: 'helen2' });
    if (openedSet.has('archive')) options.push({ id: 'maintenance', subject: 'Maintenance log', question: 'Check what was recorded near the rear entrance during the 1998 incident.', documentId: 'maintenance' });
    if (openedSet.has('vehicle')) options.push({ id: 'vehicle', subject: 'Vehicle history', question: 'Determine whether EW-19 identifies the current owner or only an historical association.', documentId: 'vehicle' });
    return options;
  }, [openedSet]);

  const sendRequest = (option: typeof requestOptions[number]) => {
    if (pending.length >= 2) return;
    if (requests.some(r => r.id === option.id)) return;
    setRequests(current => [...current, { id: option.id, subject: option.subject, question: option.question, documentId: option.documentId, readyAt: Date.now() + FIELD_TIME, complete: false }]);
  };

  const visibleDocuments = CASE_001.documents.filter(doc => doc.id === 'police' || doc.id === 'kitchen' || doc.id === 'note' || openedSet.has(doc.id));
  const unlockedEvidence = CASE_001.evidence.filter(e => evidenceUnlocked(e, openedSet));
  const canSubmit = selectedEvidence.length >= 3 && Object.values(conclusion).every(value => value.trim().length >= 20);

  const submitConclusion = () => {
    if (canSubmit) {
      setSubmitted(true);
      setTab('desk');
    }
  };

  if (newspaper) return <Newspaper />;
  if (submitted) return <Submitted onContinue={() => setNewspaper(true)} />;

  return (
    <div className="blackwood-app">
      <header className="blackwood-header">
        <div><strong>BLACKWOOD</strong><small> DETECTIVE AGENCY</small></div>
        <div className="header-case">CASE-001 · THE EMPTY ROOM</div>
        <div className="header-date">PRIVATE INVESTIGATION</div>
      </header>

      <div className="blackwood-layout">
        <aside className="blackwood-sidebar">
          <div className="sidebar-heading">ACTIVE FILE</div>
          <h1>THE EMPTY ROOM</h1>
          <p>CASE-001</p>
          <div className="sidebar-rule" />
          <nav>
            {(Object.keys(labels) as Tab[]).map(item => (
              <button key={item} className={tab === item ? 'nav-button active' : 'nav-button'} onClick={() => setTab(item)}>{labels[item]}</button>
            ))}
          </nav>
          <div className="sidebar-footer">You decide what matters.<br />Arthur follows the questions you choose.</div>
        </aside>

        <main className="blackwood-main">
          {tab === 'desk' && <Desk opened={opened} pending={pending} completed={completed} setTab={setTab} />}
          {tab === 'case' && <CaseFile openDocument={openDocument} />}
          {tab === 'documents' && <Documents docs={visibleDocuments} opened={openedSet} openDocument={openDocument} />}
          {tab === 'people' && <People onOpen={setModalPerson} />}
          {tab === 'evidence' && <EvidenceBoard evidence={unlockedEvidence} selected={selectedEvidence} toggle={id => setSelectedEvidence(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id])} />}
          {tab === 'timeline' && <Timeline />}
          {tab === 'requests' && <Fieldwork options={requestOptions} requests={requests} now={now} send={sendRequest} openDocument={openDocument} />}
          {tab === 'reports' && <Reports requests={completed} openDocument={openDocument} />}
          {tab === 'notes' && <Notebook notes={notes} setNotes={setNotes} />}
          {tab === 'conclusion' && <FinalDeduction conclusion={conclusion} setConclusion={setConclusion} selected={selectedEvidence} evidence={unlockedEvidence} submit={submitConclusion} ready={canSubmit} />}
        </main>
      </div>

      {intro && <Intro close={() => setIntro(false)} />}
      {modalDoc && <Modal title={modalDoc.title} close={() => setModalDoc(null)}><div className="modal-meta">{modalDoc.date} · {modalDoc.source}</div><pre>{modalDoc.content}</pre></Modal>}
      {modalPerson && <Modal title={modalPerson.name} close={() => setModalPerson(null)}><div className="modal-meta">{modalPerson.role}</div><p className="modal-copy">{modalPerson.note}</p></Modal>}
    </div>
  );
};

function evidenceUnlocked(e: Evidence, opened: Set<string>) {
  if (e.id === 'clock') return opened.has('note') || opened.has('clock');
  if (e.id === 'card') return opened.has('market');
  if (e.id === 'rain') return opened.has('weather');
  if (e.id === 'car') return opened.has('street') || opened.has('vehicle');
  if (e.id === 'archive') return opened.has('archive');
  if (e.id === 'photo') return opened.has('photo') || opened.has('photo-context');
  if (e.id === 'edward') return opened.has('edward') || opened.has('archive');
  if (e.id === 'helen') return opened.has('helen2');
  return false;
}

const Intro: React.FC<{ close: () => void }> = ({ close }) => <div className="intro-overlay"><article className="intro-card"><div className="eyebrow">BLACKWOOD DETECTIVE AGENCY</div><h1>CASE-001<br /><em>The Empty Room</em></h1><p>A case the police closed before the important questions were answered.</p><p className="intro-small">Read the client's letter. Examine the police file. Follow contradictions. Ask Arthur to investigate the questions you choose. Build a timeline. Decide what the evidence actually proves.</p><button className="dark-button" onClick={close}>Open the file</button></article></div>;

const Desk: React.FC<{ opened: string[]; pending: Request[]; completed: Request[]; setTab: (t: Tab) => void }> = ({ opened, pending, completed, setTab }) => <Page><div className="eyebrow">BLACKWOOD DETECTIVE AGENCY · ACTIVE CASE</div><h2>The Empty Room</h2><p className="lede">Anna Bell is missing. The police believe she left voluntarily. Her sister believes the police stopped asking questions too soon.</p><div className="stat-grid"><Stat label="FILE ITEMS" value={opened.length} /><Stat label="ARTHUR IN FIELD" value={pending.length} /><Stat label="FIELD REPORTS" value={completed.length} /></div><section className="question-panel"><div className="eyebrow">UNRESOLVED QUESTIONS</div><ul><li>Why did the police classify the disappearance as voluntary?</li><li>What happened between Anna's last confirmed sighting and the door sound?</li><li>Why did Anna say: “Look at the old photograph”?</li><li>What was wrong with the 1998 school record?</li><li>What can the blue sedan actually prove?</li></ul><button className="dark-button" onClick={() => setTab('case')}>Read the client's letter</button></section></Page>;

const CaseFile: React.FC<{ openDocument: (d: CaseDocument) => void }> = ({ openDocument }) => <Page><div className="eyebrow">CASE FILE · CLIENT LETTER</div><h2>Margaret Bell</h2><pre className="letter">{CASE_001.openingLetter}</pre><section className="case-position"><div className="eyebrow">POLICE POSITION</div><p>{CASE_001.premise}</p><button className="dark-button" onClick={() => openDocument(CASE_001.documents[0])}>Read initial police report</button></section></Page>;

const Documents: React.FC<{ docs: CaseDocument[]; opened: Set<string>; openDocument: (d: CaseDocument) => void }> = ({ docs, opened, openDocument }) => <Page><div className="eyebrow">DOCUMENTS</div><h2>The file grows as you investigate.</h2><p className="lede">The important distinction is between what a document proves and what you assume from it.</p><div className="document-list">{docs.map(doc => <button className={opened.has(doc.id) ? 'document-card read' : 'document-card'} key={doc.id} onClick={() => openDocument(doc)}><div className="document-type">{doc.type}</div><div><strong>{doc.title}</strong><small>{doc.date} · {doc.source}</small></div><span>OPEN</span></button>)}</div></Page>;

const People: React.FC<{ onOpen: (p: CasePerson) => void }> = ({ onOpen }) => <Page><div className="eyebrow">PEOPLE</div><h2>People connected to the file</h2><p className="lede">A person being connected to evidence does not make them guilty.</p><div className="people-grid">{CASE_001.people.map(person => <button className="person-card" key={person.id} onClick={() => onOpen(person)}><strong>{person.name}</strong><small>{person.role}</small><span>VIEW RECORD</span></button>)}</div></Page>;

const EvidenceBoard: React.FC<{ evidence: Evidence[]; selected: string[]; toggle: (id: string) => void }> = ({ evidence, selected, toggle }) => <Page><div className="eyebrow">EVIDENCE BOARD</div><h2>What can you actually prove?</h2><p className="lede">Select evidence you would be prepared to cite in your report. Weak evidence is not useless; it simply needs support.</p><div className="evidence-grid">{evidence.map(e => { const active = selected.includes(e.id); return <button key={e.id} className={active ? 'evidence-card selected' : 'evidence-card'} onClick={() => toggle(e.id)}><div className="evidence-top"><strong>{e.title}</strong><span>{e.strength}</span></div><small>{e.source}</small><p>{e.description}</p></button>; })}</div><div className="selection-count">{selected.length} evidence item{selected.length === 1 ? '' : 's'} selected</div></Page>;

const Timeline: React.FC = () => <Page><div className="eyebrow">TIMELINE</div><h2>Separate fact from assumption.</h2><p className="lede">A reported time is not automatically a confirmed time. The clock is an object with a condition; it is not a witness.</p><div className="timeline">{CASE_001.timeline.map(event => <article key={event.id}><div className="time">{event.time}</div><div><strong>{event.title}</strong><span className={`certainty ${event.certainty}`}>{event.certainty}</span><p>{event.description}</p></div></article>)}</div></Page>;

const Fieldwork: React.FC<{ options: Array<{ id: string; subject: string; question: string; documentId: string }>; requests: Request[]; now: number; send: (o: any) => void; openDocument: (d: CaseDocument) => void }> = ({ options, requests, now, send, openDocument }) => <Page><div className="eyebrow">FIELDWORK · ARTHUR VALE</div><h2>Ask a question, not a quest.</h2><p className="lede">Arthur is your research partner. You decide which uncertainty deserves an answer. He returns evidence; he does not solve the case for you.</p>{requests.length > 0 && <div className="field-history">{requests.map(r => { const remaining = Math.max(0, Math.ceil((r.readyAt - now) / 1000)); const doc = CASE_001.documents.find(d => d.id === r.documentId); return <div className="field-row" key={r.id}><div><strong>{r.subject}</strong><small>{r.question}</small></div>{r.complete ? <button className="text-button" onClick={() => doc && openDocument(doc)}>READ REPORT</button> : <span>{remaining}s</span>}</div>; })}</div>}<div className="request-grid">{options.filter(o => !requests.some(r => r.id === o.id)).map(option => <button disabled={requests.filter(r => !r.complete).length >= 2} className="request-card" key={option.id} onClick={() => send(option)}><strong>{option.subject}</strong><p>{option.question}</p><span>ASK ARTHUR</span></button>)}</div></Page>;

const Reports: React.FC<{ requests: Request[]; openDocument: (d: CaseDocument) => void }> = ({ requests, openDocument }) => <Page><div className="eyebrow">FIELD REPORTS</div><h2>What Arthur found.</h2><div className="document-list">{requests.length === 0 && <p className="empty">No field reports yet. Start with a question that bothers you.</p>}{requests.map(r => { const doc = CASE_001.documents.find(d => d.id === r.documentId); return <button className="document-card read" key={r.id} disabled={!r.complete} onClick={() => doc && openDocument(doc)}><div className="document-type">REPORT</div><div><strong>{r.subject}</strong><small>{r.complete ? 'Investigation complete' : 'Still in the field'}</small></div><span>{r.complete ? 'OPEN' : 'WAIT'}</span></button>; })}</div></Page>;

const Notebook: React.FC<{ notes: string; setNotes: (v: string) => void }> = ({ notes, setNotes }) => <Page><div className="eyebrow">PRIVATE NOTEBOOK</div><h2>Your observations.</h2><p className="lede">Write contradictions, possible explanations and questions. The notebook never marks an answer correct for you.</p><textarea className="notebook" value={notes} onChange={e => setNotes(e.target.value)} placeholder="What does the evidence actually tell you? What does it not tell you?" /></Page>;

const FinalDeduction: React.FC<{ conclusion: Conclusion; setConclusion: React.Dispatch<React.SetStateAction<Conclusion>>; selected: string[]; evidence: Evidence[]; submit: () => void; ready: boolean }> = ({ conclusion, setConclusion, selected, evidence, submit, ready }) => { const set = (key: keyof Conclusion, value: string) => setConclusion(c => ({ ...c, [key]: value })); return <Page><div className="eyebrow">FINAL DEDUCTION</div><h2>Tell the police what you believe happened.</h2><p className="lede">Do not write what the game wants. Write the chain of reasoning you can defend.</p><div className="deduction-grid"><label>1 · WHAT HAPPENED<textarea value={conclusion.what} onChange={e => set('what', e.target.value)} placeholder="Reconstruct the disappearance." /></label><label>2 · WHO WAS INVOLVED<textarea value={conclusion.who} onChange={e => set('who', e.target.value)} placeholder="Name the person or role you believe is responsible, and why." /></label><label>3 · WHEN<textarea value={conclusion.when} onChange={e => set('when', e.target.value)} placeholder="Build the critical part of the timeline." /></label><label>4 · WHY THE 1998 RECORD MATTERS<textarea value={conclusion.why} onChange={e => set('why', e.target.value)} placeholder="Explain the connection between Anna and the old record." /></label><label>5 · YOUR PROOF<textarea value={conclusion.proof} onChange={e => set('proof', e.target.value)} placeholder="Explain how the evidence supports your conclusion and which assumptions you rejected." /></label></div><div className="final-evidence"><strong>Evidence cited: {selected.length}</strong>{evidence.filter(e => selected.includes(e.id)).map(e => <span key={e.id}>{e.title}</span>)}</div><button className="dark-button" disabled={!ready} onClick={submit}>{ready ? 'Send report to police' : 'Complete all five sections and cite at least three evidence items'}</button></Page>; };

const Submitted: React.FC<{ onContinue: () => void }> = ({ onContinue }) => <div className="ending"><div className="eyebrow">CASE-001 · REPORT SUBMITTED</div><h1>The file leaves Blackwood.</h1><p>Your evidence and deduction have been sent to North District Police.</p><p>The case is no longer yours to close. For the first time, it is theirs to reopen.</p><button className="dark-button" onClick={onContinue}>Seven days later</button></div>;

const Newspaper: React.FC = () => <div className="ending newspaper"><div className="eyebrow">SEVEN DAYS LATER · THE EVENING REGISTER</div><article><div className="paper-masthead">THE EVENING REGISTER</div><h1>MISSING TEACHER CASE REOPENED</h1><p className="paper-subtitle">New evidence challenges the original voluntary-absence classification.</p><p>North District Police have arrested a former St. Alden school administrator after investigators reopened the disappearance of teacher Anna Bell.</p><p>Police said the new evidence raised questions about the original timeline and about a disputed attendance record from 1998 that had previously been considered unrelated.</p><p>The investigation remains open.</p></article><div className="next-file"><div className="eyebrow">NEXT FILE</div><h2>CASE-002</h2><p>A completely separate case has arrived at Blackwood Detective Agency.</p><span>INCOMING FILE · INDEPENDENT CASE</span></div></div>;

const Modal: React.FC<{ title: string; close: () => void; children: React.ReactNode }> = ({ title, close, children }) => <div className="modal-backdrop" onMouseDown={close}><article className="modal-card" onMouseDown={e => e.stopPropagation()}><button className="modal-close" onClick={close}>×</button><div className="eyebrow">BLACKWOOD FILE</div><h3>{title}</h3>{children}</article></div>;

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => <section className="page">{children}</section>;
const Stat: React.FC<{ label: string; value: number }> = ({ label, value }) => <div className="stat"><span>{label}</span><strong>{value}</strong></div>;
