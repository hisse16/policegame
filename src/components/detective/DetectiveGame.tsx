import React, { useEffect, useMemo, useState } from 'react';
import { CASE_001, CaseDocument } from '../../data/case001';
import { CASE_001_CLUES, CASE_001_HYPOTHESES, CASE_001_VALID_CONNECTIONS } from '../../data/case001Investigations';

const STORAGE_KEY = 'blackwood_case_001_v5';
type Phase = 'opening' | 'office' | 'scene' | 'case' | 'document' | 'people' | 'notes' | 'report' | 'closed';
type SceneId = 'apartment' | 'school' | 'police' | 'street';
type CaseTab = 'documents' | 'clues' | 'board' | 'theories';
type SaveState = { phase: Exclude<Phase, 'opening' | 'closed'>; openedDocuments: string[]; markedClues: string[]; connections: string[]; notes: string; selectedDocumentId: string | null; visitedScenes: SceneId[]; unlockedScenes: SceneId[] };
const initialSave: SaveState = { phase: 'office', openedDocuments: [], markedClues: [], connections: [], notes: '', selectedDocumentId: null, visitedScenes: [], unlockedScenes: ['apartment'] };
function loadSave(): SaveState { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? { ...initialSave, ...JSON.parse(raw) } : initialSave; } catch { return initialSave; } }
const typeLabel: Record<CaseDocument['type'], string> = { letter: 'LETTER', newspaper: 'NEWSPAPER', report: 'REPORT', photograph: 'PHOTOGRAPH', note: 'HANDWRITTEN NOTE' };
const sceneData: Record<SceneId, { title: string; location: string; body: string; detail: string; lockedReason: string }> = {
  apartment: { title: 'THE EMPTY ROOM', location: '14 HARROW LANE · FLAT 3B', body: 'Nothing looks stolen. Nothing is overturned. The room has the unnerving calm of a place someone expected to return to.', detail: 'Anna’s coat hangs behind the door. Her handbag is in the kitchen. Her glasses are beside the bed. The kitchen window is open.', lockedReason: '' },
  school: { title: 'ST. ALDEN PRIMARY', location: 'BASEMENT ARCHIVE', body: 'The secretary leads you downstairs. Dust, old paper and a locked cabinet fill the room Anna was asking about before she vanished.', detail: 'The 1998 attendance archive contains a damaged page and an unusual blue-ink correction. Something was deliberately removed from the record.', lockedReason: 'Anna’s note and the old photograph point here.' },
  police: { title: 'NORTH DISTRICT POLICE', location: 'MISSING PERSONS DESK', body: 'Inspector Martin Vale gives you the original file. He is courteous, but he has no interest in reopening a case without something concrete.', detail: 'The official timeline depends heavily on the 21:10 door sound and the kitchen clock reading 20:59.', lockedReason: 'The apartment timeline needs to be challenged first.' },
  street: { title: 'HARROW LANE', location: 'OUTSIDE FLAT 3B', body: 'The rain has stopped. The street looks ordinary enough to make you doubt your instincts.', detail: 'Helen Ward remembers heavy footsteps after the door closed and a dark blue sedan outside earlier that evening.', lockedReason: 'The witness account becomes relevant once the apartment timeline stops making sense.' },
};

export const DetectiveGame: React.FC = () => {
  const saved = useMemo(loadSave, []);
  const [phase, setPhase] = useState<Phase>(() => localStorage.getItem(STORAGE_KEY) ? saved.phase : 'opening');
  const [openingStep, setOpeningStep] = useState(0);
  const [openedDocuments, setOpenedDocuments] = useState(saved.openedDocuments);
  const [markedClues, setMarkedClues] = useState(saved.markedClues);
  const [connections, setConnections] = useState(saved.connections);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(saved.selectedDocumentId);
  const [notes, setNotes] = useState(saved.notes);
  const [visitedScenes, setVisitedScenes] = useState<SceneId[]>(saved.visitedScenes);
  const [unlockedScenes, setUnlockedScenes] = useState<SceneId[]>(saved.unlockedScenes.includes('apartment') ? saved.unlockedScenes : ['apartment']);
  const [sceneId, setSceneId] = useState<SceneId>('apartment');
  const [showLetter, setShowLetter] = useState(false);
  const [caseTab, setCaseTab] = useState<CaseTab>('documents');
  const [selectedClue, setSelectedClue] = useState<string | null>(null);
  const [secondClue, setSecondClue] = useState('');
  const [connectionMessage, setConnectionMessage] = useState('');
  const [theoryText, setTheoryText] = useState('');
  const [theorySubmitted, setTheorySubmitted] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportEvidence, setReportEvidence] = useState<string[]>([]);
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    if (phase !== 'opening' && phase !== 'closed') {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ phase, openedDocuments, markedClues, connections, notes, selectedDocumentId, visitedScenes, unlockedScenes })); } catch { /* storage is optional */ }
    }
  }, [phase, openedDocuments, markedClues, connections, notes, selectedDocumentId, visitedScenes, unlockedScenes]);

  const selectedDocument = useMemo(() => CASE_001.documents.find(d => d.id === selectedDocumentId) ?? null, [selectedDocumentId]);
  const selectedClueObject = CASE_001_CLUES.find(c => c.id === selectedClue) ?? null;
  const markedObjects = CASE_001_CLUES.filter(c => markedClues.includes(c.id));
  const connectionKey = (a: string, b: string) => [a, b].sort().join('::');

  const unlock = (id: SceneId) => setUnlockedScenes(current => current.includes(id) ? current : [...current, id]);
  const visitScene = (id: SceneId) => {
    if (!unlockedScenes.includes(id)) return;
    setSceneId(id);
    setVisitedScenes(current => current.includes(id) ? current : [...current, id]);
    setPhase('scene');
  };
  const openDocument = (doc: CaseDocument) => {
    setSelectedDocumentId(doc.id);
    setOpenedDocuments(current => current.includes(doc.id) ? current : [...current, doc.id]);
    setPhase('document');
  };
  const markClue = (id: string) => {
    setMarkedClues(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  };
  const connectClues = () => {
    if (!selectedClue || !secondClue || selectedClue === secondClue) return;
    const key = connectionKey(selectedClue, secondClue);
    if (connections.includes(key)) { setConnectionMessage('Already recorded in the casebook.'); return; }
    const valid = CASE_001_VALID_CONNECTIONS.some(([a, b]) => connectionKey(a, b) === key);
    setConnections(current => [...current, key]);
    setConnectionMessage(valid ? 'The two details strengthen each other. This is a lead worth following.' : 'The connection is inconclusive. Keeping it may still help later.');
  };

  const processDiscoveries = (docId: string) => {
    if (docId === 'doc-note' || docId === 'doc-client-letter' || docId === 'doc-photo') unlock('school');
    if (docId === 'doc-report' || docId === 'doc-receipt') unlock('police');
    if (docId === 'doc-witness' || docId === 'doc-receipt') unlock('street');
  };
  const begin = () => { setShowLetter(true); setPhase('office'); };
  const sendReport = () => {
    const enoughEvidence = reportEvidence.length >= 3;
    const enoughWriting = reportText.trim().length >= 120;
    const enoughProgress = markedClues.length >= 5 && connections.length >= 2;
    if (!enoughEvidence || !enoughWriting || !enoughProgress) return;
    setReportSent(true); setPhase('closed');
  };

  if (phase === 'opening') {
    const pages = [
      <><div className="opening-kicker">BLACKWOOD DETECTIVE AGENCY · 2026</div><h1>THE FIRST CASE</h1><p>Twelve days ago, you put a name on a door.</p><p>No clients. No witnesses. No dramatic late-night calls.</p><p>Just rent, paperwork, and a desk that still smells of fresh varnish.</p></>,
      <><div className="opening-kicker">OCTOBER 14 · 10:55 AM</div><h1>THEN SOMEONE KNOCKED</h1><p>Three knocks.</p><p>When you opened the door, nobody was there.</p><p>Only a brown envelope lay on the floor.</p><p className="opening-emphasis">PRIVATE · MR. BLACKWOOD</p></>,
      <><div className="opening-kicker">THE ENVELOPE</div><h1>A WOMAN IS MISSING</h1><p>Anna Bell disappeared two nights ago.</p><p>The police believe she left voluntarily.</p><p>Her sister believes someone made her disappear.</p><p>There is no police referral. No guarantee of payment. Only a request to look at the apartment before you believe the report.</p></>,
      <><div className="opening-kicker">YOUR FIRST CLIENT</div><h1>MARGARET BELL</h1><p>“Please don't tell me to wait another forty-eight hours.”</p><p>“I have already waited too long.”</p><p className="opening-emphasis">This is not a police investigation.</p><p>It is yours.</p></>
    ];
    return <main className="detective-opening cinematic-opening"><div className="opening-grain"/><div className="opening-content">{pages[openingStep]}<div className="opening-progress">{openingStep + 1} / {pages.length}</div><button className="ink-button" onClick={() => openingStep < pages.length - 1 ? setOpeningStep(s => s + 1) : begin()}>{openingStep < pages.length - 1 ? 'CONTINUE' : 'ENTER THE OFFICE'}</button></div></main>;
  }

  if (phase === 'closed') return <main className="detective-opening"><div className="opening-content"><div className="opening-kicker">CASE 001 · OFFICIAL RESULT</div><h1>CASE CLOSED</h1><p>Your report has been delivered to North District Police with the evidence you selected.</p><div className="closing-stamp">FINDINGS SUBMITTED<br/>TO NORTH DISTRICT POLICE</div><p>Anna Bell's disappearance has been reconstructed and the voluntary-absence classification has been challenged with evidence.</p><button className="ink-button" onClick={() => setPhase('office')}>RETURN TO THE OFFICE</button></div></main>;

  const unlockedCount = unlockedScenes.length;
  return <main className="detective-shell">
    <header className="agency-header"><div><div className="header-kicker">BLACKWOOD DETECTIVE AGENCY</div><div className="header-title">PRIVATE CASEBOOK</div></div><div className="header-status"><span className="status-dot"/> CASE 001 · ACTIVE</div></header>

    {showLetter && <div className="letter-overlay"><div className="arrival-letter"><div className="letter-top">DELIVERED BY HAND · OCTOBER 14, 2026</div><h2>THE LETTER</h2><p>Margaret Bell's handwriting becomes less steady toward the end.</p><blockquote>“Anna called me Sunday. She said she had found something at work that frightened her. Then she said, ‘If I stop answering, look at the old photograph.’”</blockquote><p>There is an address beneath the signature.</p><p className="letter-address">14 HARROW LANE · FLAT 3B</p><button className="paper-button" onClick={() => { setShowLetter(false); visitScene('apartment'); }}>GO TO THE APARTMENT</button></div></div>}

    <section className="detective-command"><div><span>CASE 001</span><strong>THE EMPTY ROOM</strong></div><nav><button onClick={() => setPhase('office')}>OFFICE</button><button onClick={() => setPhase('case')}>CASEBOOK</button><button onClick={() => setPhase('people')}>PEOPLE</button><button onClick={() => setPhase('notes')}>NOTES</button><button className="report-link" onClick={() => setPhase('report')}>WRITE REPORT</button></nav></section>

    {phase === 'office' && <section className="office-experience"><div className="office-copy"><div className="scene-kicker">BLACKWOOD OFFICE · ACTIVE FILE</div><h1>Follow the evidence.</h1><p>There is no list of things you are supposed to do. New places appear only when the evidence gives you a reason to go there.</p><div className="lead-strip"><span>CASE PROGRESS</span><strong>{unlockedCount} LOCATION{unlockedCount !== 1 ? 'S' : ''} AVAILABLE</strong><small>{markedClues.length} details kept · {connections.length} connections made</small></div><div className="location-grid">{(['apartment', 'school', 'police', 'street'] as SceneId[]).map(id => { const open = unlockedScenes.includes(id); return <button key={id} disabled={!open} onClick={() => visitScene(id)} className={`${open ? 'unlocked' : 'locked'} ${visitedScenes.includes(id) ? 'visited' : ''}`}><span>{open ? (visitedScenes.includes(id) ? 'VISITED' : 'NEW LEAD') : 'LOCKED'}</span><strong>{open ? sceneData[id].title : 'UNKNOWN LOCATION'}</strong><small>{open ? sceneData[id].location : sceneData[id].lockedReason}</small></button>; })}</div></div><aside className="case-sidebar"><div className="sidebar-label">CURRENT FILE</div><div className="sidebar-case">CASE 001</div><h2>{CASE_001.title}</h2><p>{CASE_001.subtitle}</p><div className="sidebar-rule"/><div className="sidebar-meta"><span>LOCATIONS FOUND</span><b>{unlockedCount} / 4</b></div><div className="sidebar-meta"><span>DETAILS KEPT</span><b>{markedClues.length}</b></div><div className="sidebar-meta"><span>CONNECTIONS</span><b>{connections.length}</b></div><button className="sidebar-button" onClick={() => setPhase('case')}>OPEN CASEBOOK →</button></aside></section>}

    {phase === 'scene' && <div className="scene-stage"><div className={`investigation-scene scene-${sceneId}`}><div className="scene-overlay"><div className="scene-kicker">FIELD INVESTIGATION · {sceneData[sceneId].location}</div><h1>{sceneData[sceneId].title}</h1><p className="scene-body">{sceneData[sceneId].body}</p><div className="scene-detail"><span>WHAT YOU NOTICE</span><p>{sceneData[sceneId].detail}</p></div><div className="scene-actions">{sceneId === 'apartment' && <><button onClick={() => { const d = CASE_001.documents.find(x => x.id === 'doc-report'); if (d) { openDocument(d); processDiscoveries(d.id); } }}>READ THE POLICE REPORT</button><button onClick={() => { const d = CASE_001.documents.find(x => x.id === 'doc-photo'); if (d) { openDocument(d); processDiscoveries(d.id); } }}>EXAMINE THE SCENE PHOTOGRAPH</button><button onClick={() => { const d = CASE_001.documents.find(x => x.id === 'doc-note'); if (d) { openDocument(d); processDiscoveries(d.id); } }}>READ ANNA'S NOTE</button></>}{sceneId === 'school' && <><button onClick={() => { const d = CASE_001.documents.find(x => x.id === 'doc-school'); if (d) { openDocument(d); } }}>READ THE STAFF STATEMENT</button><button onClick={() => { const d = CASE_001.documents.find(x => x.id === 'doc-archive'); if (d) { openDocument(d); } }}>OPEN THE 1998 ARCHIVE</button><button onClick={() => { const d = CASE_001.documents.find(x => x.id === 'doc-photograph'); if (d) { openDocument(d); } }}>EXAMINE THE OLD PHOTOGRAPH</button></>}{sceneId === 'police' && <><button onClick={() => { const d = CASE_001.documents.find(x => x.id === 'doc-report'); if (d) openDocument(d); }}>REVIEW ORIGINAL REPORT</button><button onClick={() => { const d = CASE_001.documents.find(x => x.id === 'doc-newspaper'); if (d) openDocument(d); }}>COMPARE THE PUBLIC VERSION</button></>}{sceneId === 'street' && <><button onClick={() => { const d = CASE_001.documents.find(x => x.id === 'doc-witness'); if (d) openDocument(d); }}>REVIEW HELEN WARD'S STATEMENT</button><button onClick={() => { const d = CASE_001.documents.find(x => x.id === 'doc-receipt'); if (d) { openDocument(d); processDiscoveries(d.id); } }}>CHECK THE 20:31 RECORD</button></>}</div><button className="scene-back" onClick={() => setPhase('office')}>← RETURN TO OFFICE</button></div></div></div>}

    {phase === 'document' && selectedDocument && <div className="document-stage"><article className="document-viewer"><div className="document-meta"><span>{typeLabel[selectedDocument.type]}</span><span>{selectedDocument.date}</span><span>{selectedDocument.source}</span></div><h1>{selectedDocument.title}</h1><pre>{selectedDocument.content}</pre><div className="document-tags">{selectedDocument.tags?.map(tag => <span key={tag}>{tag}</span>)}</div><div className="document-actions"><button onClick={() => { if (selectedDocument.id === 'doc-note' || selectedDocument.id === 'doc-client-letter' || selectedDocument.id === 'doc-photo') unlock('school'); if (selectedDocument.id === 'doc-report' || selectedDocument.id === 'doc-receipt') unlock('police'); if (selectedDocument.id === 'doc-witness' || selectedDocument.id === 'doc-receipt') unlock('street'); setPhase('scene'); }}>RETURN TO FIELD</button><button onClick={() => setPhase('case')}>ADD TO CASEBOOK</button></div></article></div>}

    {phase === 'case' && <div className="modal-stage"><div className="case-folder"><button className="close-button" onClick={() => setPhase('office')}>×</button><div className="folder-tab">CASE 001</div><div className="folder-content"><div className="folder-heading"><span>BLACKWOOD PRIVATE INVESTIGATIONS</span><strong>THE EMPTY ROOM</strong><small>ACTIVE INVESTIGATION</small></div><p className="case-premise">{CASE_001.premise}</p><div className="case-tabs"><button className={caseTab === 'documents' ? 'active' : ''} onClick={() => setCaseTab('documents')}>DOCUMENTS <b>{openedDocuments.length}</b></button><button className={caseTab === 'clues' ? 'active' : ''} onClick={() => setCaseTab('clues')}>YOUR CLUES <b>{markedClues.length}</b></button><button className={caseTab === 'board' ? 'active' : ''} onClick={() => setCaseTab('board')}>CONNECTIONS <b>{connections.length}</b></button><button className={caseTab === 'theories' ? 'active' : ''} onClick={() => setCaseTab('theories')}>THEORIES</button></div>
      {caseTab === 'documents' && <div className="document-grid">{CASE_001.documents.map(doc => <button key={doc.id} className={`document-card ${openedDocuments.includes(doc.id) ? 'read' : ''}`} onClick={() => { openDocument(doc); processDiscoveries(doc.id); }}><span>{typeLabel[doc.type]}</span><strong>{doc.title}</strong><small>{doc.date}</small>{openedDocuments.includes(doc.id) && <em>READ</em>}</button>)}</div>}
      {caseTab === 'clues' && <div className="clue-workspace"><div className="clue-list">{CASE_001_CLUES.map(clue => <button key={clue.id} className={`clue-card ${markedClues.includes(clue.id) ? 'marked' : ''} ${selectedClue === clue.id ? 'selected' : ''}`} onClick={() => setSelectedClue(clue.id)}><span>{clue.kind.toUpperCase()}</span><strong>{clue.title}</strong><small>{clue.text}</small>{markedClues.includes(clue.id) && <em>KEPT</em>}</button>)}</div><div className="clue-detail">{selectedClueObject ? <><div className="detail-label">INVESTIGATOR'S VIEW</div><h3>{selectedClueObject.title}</h3><p>{selectedClueObject.text}</p><div className="detail-source">SOURCE · {CASE_001.documents.find(d => d.id === selectedClueObject.sourceDocumentId)?.title}</div><button className="mark-button" onClick={() => markClue(selectedClueObject.id)}>{markedClues.includes(selectedClueObject.id) ? 'REMOVE FROM CASEBOOK' : 'KEEP THIS DETAIL'}</button></> : <p>Select a detail that you think matters.</p>}</div></div>}
      {caseTab === 'board' && <div className="connection-board"><div className="board-intro"><span>PRIVATE WORKING BOARD</span><h2>Put two facts beside each other.</h2><p>No correct-answer button. You are testing your own theory.</p></div><div className="board-columns"><div><label>FIRST DETAIL</label><select value={selectedClue ?? ''} onChange={e => setSelectedClue(e.target.value || null)}><option value="">Select a kept detail…</option>{markedObjects.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div><div><label>SECOND DETAIL</label><select value={secondClue} onChange={e => setSecondClue(e.target.value)}><option value="">Select a kept detail…</option>{markedObjects.filter(c => c.id !== selectedClue).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div></div><button className="ink-button small" onClick={connectClues}>TEST CONNECTION</button>{connectionMessage && <p className="connection-message">{connectionMessage}</p>}{connections.length > 0 && <div className="saved-connections">{connections.map(key => { const [a, b] = key.split('::'); const ca = CASE_001_CLUES.find(c => c.id === a); const cb = CASE_001_CLUES.find(c => c.id === b); return <div key={key}><span>{ca?.title}</span><b>↔</b><span>{cb?.title}</span></div>; })}</div>}</div>}
      {caseTab === 'theories' && <div className="theory-space"><div className="theory-list">{CASE_001_HYPOTHESES.map(h => <article key={h.id} className={`theory-card ${h.status}`}><span>{h.status.toUpperCase()}</span><h3>{h.title}</h3><p>{h.description}</p><small>{h.clueIds.filter(id => markedClues.includes(id)).length} supporting details in your casebook</small></article>)}</div><textarea value={theoryText} onChange={e => setTheoryText(e.target.value)} placeholder="Write what you currently believe happened. You can change your mind later."/><button className="paper-button" disabled={theoryText.trim().length < 30} onClick={() => setTheorySubmitted(true)}>{theorySubmitted ? 'THEORY SAVED' : 'SAVE WORKING THEORY'}</button></div>}
    </div></div></div>}

    {phase === 'people' && <section className="simple-page"><div className="scene-kicker">CASE 001 · PEOPLE</div><h1>People connected to the file.</h1><div className="people-grid">{CASE_001.people.map(person => <article key={person.id}><span>{person.role}</span><h2>{person.name}</h2><p>{person.note}</p></article>)}</div><button className="scene-back" onClick={() => setPhase('office')}>← RETURN TO OFFICE</button></section>}
    {phase === 'notes' && <section className="simple-page notes-page"><div className="scene-kicker">PRIVATE FIELD NOTES</div><h1>Write what you think.</h1><p>These are your notes, not objectives. Follow a thought, record a doubt, or write down a contradiction.</p><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Something about the case doesn't fit…"/><button className="paper-button" onClick={() => setPhase('office')}>SAVE AND RETURN</button></section>}

    {phase === 'report' && <section className="report-page"><div className="report-paper"><div className="scene-kicker">NORTH DISTRICT POLICE · PRIVATE INVESTIGATOR'S REPORT</div><h1>CASE 001 — THE EMPTY ROOM</h1><p className="report-instruction">The case is yours to explain now. Write the sequence of events in your own words and attach the evidence that supports it.</p><textarea value={reportText} onChange={e => setReportText(e.target.value)} placeholder="To North District Police…"/><div className="evidence-picker"><h3>ATTACH EVIDENCE</h3>{CASE_001_CLUES.map(clue => <label key={clue.id}><input type="checkbox" checked={reportEvidence.includes(clue.id)} onChange={() => setReportEvidence(current => current.includes(clue.id) ? current.filter(x => x !== clue.id) : [...current, clue.id])}/><span>{clue.title}</span></label>)}</div><div className="report-status"><span>{reportEvidence.length} evidence attached</span><span>{reportText.trim().length} characters</span><span>{markedClues.length >= 5 && connections.length >= 2 ? 'CASE RECONSTRUCTED' : 'MORE INVESTIGATION NEEDED'}</span></div><button className="ink-button" disabled={reportText.trim().length < 120 || reportEvidence.length < 3 || markedClues.length < 5 || connections.length < 2} onClick={sendReport}>{reportSent ? 'REPORT SENT' : 'SUBMIT REPORT TO POLICE'}</button><button className="scene-back" onClick={() => setPhase('office')}>← RETURN TO CASE</button></div></section>}
  </main>;
};
