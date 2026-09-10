import React, { useEffect, useMemo, useState } from 'react';
import { CASE_001, CaseDocument } from '../../data/case001';
import { CASE_001_CLUES } from '../../data/case001Investigations';

const STORAGE_KEY = 'blackwood_case_001_v7';
type Phase = 'opening' | 'scene' | 'case' | 'document' | 'people' | 'notes' | 'reconstruction' | 'report' | 'closed';
type SceneId = 'apartment' | 'police' | 'school' | 'street';
type Save = { phase: Exclude<Phase, 'opening' | 'closed'>; opened: string[]; marked: string[]; visited: SceneId[]; notes: string; reconstructed: boolean };
type SceneObject = { id: string; title: string; clueIds: string[]; text: string; documentId?: string; x?: number; y?: number; shape?: string };

const initial: Save = { phase: 'scene', opened: [], marked: [], visited: [], notes: '', reconstructed: false };
const labels: Record<CaseDocument['type'], string> = { letter: 'LETTER', newspaper: 'NEWSPAPER', report: 'REPORT', photograph: 'PHOTOGRAPH', note: 'HANDWRITTEN NOTE' };

const scenes: Record<SceneId, { name: string; place: string; reason: string }> = {
  apartment: { name: 'THE EMPTY ROOM', place: '14 HARROW LANE · FLAT 3B', reason: 'Margaret’s letter is the only lead you have.' },
  police: { name: 'NORTH DISTRICT POLICE', place: 'MISSING PERSONS DESK', reason: 'The official timeline does not agree with what you found.' },
  school: { name: 'ST. ALDEN PRIMARY', place: 'BASEMENT ARCHIVE', reason: 'Anna was looking into an old school record before she disappeared.' },
  street: { name: 'HARROW LANE', place: 'OUTSIDE FLAT 3B', reason: 'A witness heard someone leave and remembered a dark blue sedan.' },
};

const apartmentObjects: SceneObject[] = [
  { id: 'window', title: 'Open kitchen window', clueIds: ['clue-rain'], text: 'The window is open roughly twelve centimetres. Rain has dried in a narrow line along the sill.', x: 13, y: 30 },
  { id: 'coat', title: 'Anna’s blue coat', clueIds: ['clue-coat'], text: 'Anna’s coat is still hanging behind the front door. The evening outside was cold and wet.', x: 23, y: 60 },
  { id: 'clock', title: 'Wall clock', clueIds: ['clue-clock'], text: 'The clock reads 20:59. The police report says officers arrived at 21:10. Anna’s note warned you not to trust this clock.', x: 77, y: 18 },
  { id: 'photo', title: 'Old photograph', clueIds: ['clue-photo'], text: 'This is the photograph Margaret told you about. Someone deliberately kept it instead of throwing it away.', x: 69, y: 42, documentId: 'doc-photo' },
  { id: 'desk', title: 'Kitchen table', clueIds: ['clue-receipt'], text: 'A supermarket receipt shows Anna’s card being used at 20:31, only about seven minutes from home.', x: 55, y: 69, documentId: 'doc-receipt' },
  { id: 'note', title: 'Folded handwritten note', clueIds: ['clue-note', 'clue-rain'], text: '“Do not trust the wall clock. Check what happened before the rain. Ask why the photograph was kept.”', x: 47, y: 78, documentId: 'doc-note' },
  { id: 'door', title: 'Front door', clueIds: ['clue-door'], text: 'There is no damage around the lock. Whoever closed this door did not need to force it.', x: 40, y: 42 },
  { id: 'bag', title: 'Handbag', clueIds: ['clue-bag'], text: 'Anna’s everyday handbag remains inside. Her keys and glasses case are still with it.', x: 39, y: 68 },
];

const sceneObjects: Record<Exclude<SceneId, 'apartment'>, SceneObject[]> = {
  police: [
    { id: 'desk', title: 'Missing-persons desk', clueIds: ['clue-police'], text: 'The file was classified voluntary before the unexplained details had been reconciled.' },
    { id: 'report', title: 'Initial police report', clueIds: ['clue-clock'], text: 'Arrival: 21:10. Kitchen clock: 20:59. Both times appear in the same report.', documentId: 'doc-report' },
    { id: 'newspaper', title: 'Press clipping', clueIds: [], text: 'The newspaper repeats the voluntary-disappearance theory but leaves out the clock discrepancy.', documentId: 'doc-newspaper' },
    { id: 'timeline', title: 'Timeline board', clueIds: ['clue-receipt'], text: '18:12 — Anna leaves school. 20:31 — her card is used at Mercer Market. 21:10 — Helen hears the flat door close. The sequence needs explanation.' },
  ],
  school: [
    { id: 'archive-door', title: 'Basement archive cabinet', clueIds: ['clue-school'], text: 'The cabinet contains the 1998 attendance records Anna had asked about before leaving.', documentId: 'doc-school' },
    { id: 'ledger', title: 'Damaged 1998 ledger', clueIds: ['clue-blue-ink'], text: 'A correction beside Edward Ward’s name carries the same unusual blue-ink mark Anna had copied.', documentId: 'doc-archive' },
    { id: 'photo', title: 'Staff photograph', clueIds: ['clue-e-ward'], text: 'The person circled in blue is E. Ward. The school inventory identifies him as Edward Ward, former caretaker.', documentId: 'doc-photograph' },
    { id: 'maintenance', title: 'Maintenance register', clueIds: ['clue-sedan'], text: 'The old register lists Edward Ward with a dark blue sedan. The partial registration is recorded as EW-19.' },
  ],
  street: [
    { id: 'witness', title: 'Helen Ward’s statement', clueIds: ['clue-footsteps', 'clue-door', 'clue-sedan'], text: 'Helen heard the door close at 21:10, then heavy footsteps. She also remembers a dark blue sedan outside earlier that evening.', documentId: 'doc-witness' },
    { id: 'tyre', title: 'Fresh tyre impression', clueIds: ['clue-tyre'], text: 'A fresh tyre impression starts beside the entrance. Its width is consistent with a mid-size sedan.', documentId: 'doc-street' },
    { id: 'shop', title: 'Shopkeeper’s photograph', clueIds: ['clue-plate'], text: 'A photograph from across the road captures part of the registration: EW-19.', documentId: 'doc-street' },
  ],
};

function readSave(): Save {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? { ...initial, ...JSON.parse(raw) } : initial; } catch { return initial; }
}

export const DetectiveGame: React.FC = () => {
  const saved = useMemo(readSave, []);
  const [phase, setPhase] = useState<Phase>(() => localStorage.getItem(STORAGE_KEY) ? saved.phase : 'opening');
  const [openingStep, setOpeningStep] = useState(0);
  const [opened, setOpened] = useState(saved.opened);
  const [marked, setMarked] = useState(saved.marked);
  const [visited, setVisited] = useState(saved.visited);
  const [notes, setNotes] = useState(saved.notes);
  const [selectedDoc, setSelectedDoc] = useState<CaseDocument | null>(null);
  const [activeObject, setActiveObject] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [reconstructed, setReconstructed] = useState(saved.reconstructed);
  const [culprit, setCulprit] = useState('');
  const [method, setMethod] = useState('');
  const [motive, setMotive] = useState('');
  const [report, setReport] = useState('');
  const [reportEvidence, setReportEvidence] = useState<string[]>([]);
  const [scene, setScene] = useState<SceneId>('apartment');

  useEffect(() => {
    if (phase !== 'opening' && phase !== 'closed') localStorage.setItem(STORAGE_KEY, JSON.stringify({ phase, opened, marked, visited, notes, reconstructed }));
  }, [phase, opened, marked, visited, notes, reconstructed]);

  const clue = (id: string) => CASE_001_CLUES.find(c => c.id === id);
  const keepClues = (ids: string[]) => {
    if (!ids.length) return;
    const fresh = ids.filter(id => !marked.includes(id));
    setMarked(current => Array.from(new Set([...current, ...ids])));
    if (fresh.length) setNotice('NEW DETAIL KEPT IN CASEBOOK');
  };
  const unlocks = useMemo<SceneId[]>(() => {
    const result: SceneId[] = ['apartment'];
    if (marked.includes('clue-clock')) result.push('police');
    if (marked.includes('clue-photo') || marked.includes('clue-note')) result.push('school');
    if (marked.includes('clue-door')) result.push('street');
    return result;
  }, [marked]);
  const proofReady = ['clue-clock', 'clue-footsteps', 'clue-e-ward', 'clue-plate', 'clue-tyre'].every(id => marked.includes(id)) && ['police', 'school', 'street'].every(id => visited.includes(id as SceneId));

  const openDoc = (id: string) => {
    const doc = CASE_001.documents.find(item => item.id === id);
    if (!doc) return;
    setSelectedDoc(doc); setOpened(current => current.includes(id) ? current : [...current, id]); setPhase('document');
  };
  const inspect = (object: SceneObject) => { setActiveObject(object.id); keepClues(object.clueIds); if (object.documentId) openDoc(object.documentId); };
  const go = (id: SceneId) => {
    if (!unlocks.includes(id)) { setNotice('You have not found a reason to go there yet.'); return; }
    setScene(id); setActiveObject(null); setVisited(current => current.includes(id) ? current : [...current, id]); setPhase('scene');
  };
  const start = () => { setScene('apartment'); setVisited(current => current.includes('apartment') ? current : [...current, 'apartment']); setPhase('scene'); };
  const beginReconstruction = () => { if (!proofReady) { setNotice('There are still contradictions you have not resolved.'); return; } setPhase('reconstruction'); };
  const submitReconstruction = () => {
    if (culprit !== 'edward' || method !== 'staged' || motive !== 'archive') { setNotice('That reconstruction does not fit all the evidence. Reconsider the timeline.'); return; }
    setReconstructed(true); setPhase('report');
  };
  const sendReport = () => { if (reconstructed && report.trim().length >= 180 && reportEvidence.length >= 4) setPhase('closed'); };

  if (phase === 'opening') {
    const pages = [
      ['BLACKWOOD DETECTIVE AGENCY', 'THE FIRST CASE', 'Twelve days ago, you put a name on a door. Today, someone finally knocked.'],
      ['OCTOBER 14 · 10:55 AM', 'A BROWN ENVELOPE', 'Inside: a letter from Margaret Bell, an address, and one sentence that refuses to leave your mind: “Please look properly.”'],
      ['THE ADDRESS', '14 HARROW LANE · FLAT 3B', 'Anna Bell is missing. Police believe she left voluntarily. Her sister believes the room tells a different story.'],
    ];
    const page = pages[openingStep];
    return <main className="detective-opening"><div className="opening-grain"/><div className="opening-content"><div className="opening-kicker">{page[0]}</div><h1>{page[1]}</h1><p className="opening-copy">{page[2]}</p><div className="opening-progress">{openingStep + 1} / {pages.length}</div><button className="ink-button" onClick={() => openingStep < 2 ? setOpeningStep(s => s + 1) : start()}>{openingStep < 2 ? 'CONTINUE' : 'ENTER THE SCENE'}</button></div></main>;
  }
  if (phase === 'closed') return <main className="detective-opening"><div className="opening-content"><div className="opening-kicker">CASE 001 · OFFICIAL RESULT</div><h1>CASE CLOSED</h1><p className="opening-copy">Your findings have been submitted to North District Police. Anna Bell’s disappearance is no longer treated as voluntary.</p><div className="closing-stamp">FINDINGS SUBMITTED<br/>TO NORTH DISTRICT POLICE</div><p className="opening-copy">The Blackwood Detective Agency remains open.</p><button className="ink-button" onClick={() => setPhase('case')}>OPEN CASEBOOK</button></div></main>;

  const objects = scene === 'apartment' ? apartmentObjects : sceneObjects[scene];
  const documents = CASE_001.documents.filter(doc => opened.includes(doc.id));

  return <main className="detective-shell">
    <header className="agency-header"><div><div className="header-kicker">BLACKWOOD DETECTIVE AGENCY</div><div className="header-title">CASE 001 · THE EMPTY ROOM</div></div><div className="header-status"><span className="status-dot"/> INVESTIGATION ACTIVE</div></header>
    <nav className="detective-nav"><button onClick={() => setPhase('scene')}>FIELD</button><button onClick={() => setPhase('case')}>CASEBOOK <b>{marked.length}</b></button><button onClick={() => setPhase('people')}>PEOPLE</button><button onClick={() => setPhase('notes')}>NOTES</button><button className="report-link" disabled={!proofReady} onClick={beginReconstruction}>{reconstructed ? 'REPORT' : 'RECONSTRUCT'}{proofReady ? '' : ' · LOCKED'}</button></nav>

    {phase === 'scene' && <section className="field-layout">
      <aside className="lead-rail"><div className="scene-kicker">FIELD FILE</div><div className="lead-title">{scenes[scene].name}</div><div className="lead-place">{scenes[scene].place}</div><div className="lead-rule"/><div className="lead-label">WHAT BROUGHT YOU HERE</div><p>{scenes[scene].reason}</p><div className="lead-label">DISCOVERED</div><p className="small-muted">{marked.length} details kept in casebook</p><button className="rail-button" onClick={() => setPhase('case')}>OPEN CASEBOOK →</button></aside>
      <section className={`room-scene room-${scene}`}>
        <div className={`scene-architecture architecture-${scene}`}>
          {scene === 'apartment' && <><div className="room-window"/><div className="room-clock"><span>20:59</span></div><div className="room-door"><span>3B</span></div><div className="room-desk"/><div className="room-coat"/><div className="room-frame"/><div className="room-rug"/><div className="room-lamp"/><div className="room-chair"/></>}
          {scene === 'police' && <><div className="prop-counter"/><div className="prop-filing"/><div className="prop-board"><i/><i/><i/><i/></div><div className="prop-desk"/><div className="prop-chair"/><div className="prop-clock"/></>}
          {scene === 'school' && <><div className="prop-archive-wall"/><div className="prop-cabinet"/><div className="prop-ledger"/><div className="prop-photo-grid"><i/><i/><i/></div><div className="prop-basement-lamp"/></>}
          {scene === 'street' && <><div className="street-building"/><div className="street-door"/><div className="street-curb"/><div className="street-car"/><div className="street-lamp"/><div className="street-rain"/></>}
        </div>
        <div className="location-title"><div className="scene-kicker">FIELD LOCATION</div><strong>{scenes[scene].name}</strong><span>{scenes[scene].place}</span></div>
        <div className={`scene-object-layer layer-${scene}`}>
          {objects.map((object, index) => <button key={object.id} className={`scene-object scene-object-${index + 1} ${object.clueIds.some(id => marked.includes(id)) ? 'found' : ''}`} onClick={() => inspect(object)}><span className="scene-object-dot"/><strong>{object.title}</strong><small>{object.documentId ? 'INSPECT' : 'EXAMINE'}</small></button>)}
        </div>
        {scene === 'apartment' && apartmentObjects.map(object => <button key={`hot-${object.id}`} className={`hotspot ${activeObject === object.id ? 'active' : ''} ${object.clueIds.some(id => marked.includes(id)) ? 'found' : ''}`} style={{ left: `${object.x}%`, top: `${object.y}%` }} onClick={() => inspect(object)} aria-label={`Inspect ${object.title}`}><span className="hotspot-ring"/><span className="hotspot-label">{object.title}{object.clueIds.some(id => marked.includes(id)) ? ' · KEPT' : ''}</span></button>)}
        {activeObject && (() => { const object = objects.find(item => item.id === activeObject); if (!object) return null; return <div className="evidence-popover"><div className="evidence-type">FIELD DETAIL · {object.documentId ? 'DOCUMENT' : 'OBSERVATION'}</div><h2>{object.title}</h2><p>{object.text}</p><div className="evidence-source">The relevant detail has been kept in your casebook.</div><button onClick={() => setActiveObject(null)}>CLOSE</button></div>; })()}
        {notice && <div className="field-notice">{notice}<button onClick={() => setNotice('')}>×</button></div>}
        <div className="scene-caption"><span>INVESTIGATE</span><strong>Look closely. The important detail may not be the obvious one.</strong></div>
      </section>
      <aside className="lead-map"><div className="scene-kicker">LEADS</div><div className="lead-map-line"><div className="lead-node current">THE EMPTY ROOM<small>KNOWN</small></div>{(['police','school','street'] as SceneId[]).map(id => <React.Fragment key={id}><div className="lead-arrow">→</div><button className={`lead-node ${unlocks.includes(id) ? 'unlocked' : 'locked'}`} onClick={() => go(id)}>{unlocks.includes(id) ? scenes[id].name : 'UNKNOWN'}<small>{unlocks.includes(id) ? 'NEW LEAD' : 'LOCKED'}</small></button></React.Fragment>)}</div><p className="lead-help">Places become available when the evidence gives you a reason to look there.</p></aside>
    </section>}

    {phase === 'case' && <div className="modal-stage"><section className="case-folder"><button className="close-button" onClick={() => setPhase('scene')}>×</button><div className="folder-tab">CASE 001</div><div className="folder-content"><div className="folder-heading"><span>BLACKWOOD PRIVATE INVESTIGATIONS</span><strong>THE EMPTY ROOM</strong><small>WORKING CASEBOOK</small></div><div className="case-tabs"><button className="active">EVIDENCE <b>{marked.length}</b></button><button onClick={() => documents[0] ? openDoc(documents[0].id) : setNotice('No documents have been examined yet.')}>DOCUMENTS <b>{opened.length}</b></button></div><div className="case-evidence-grid">{marked.length ? marked.map(id => { const item = clue(id); return item ? <article key={id}><span>{item.kind.toUpperCase()}</span><h3>{item.title}</h3><p>{item.text}</p><small>{CASE_001.documents.find(doc => doc.id === item.sourceDocumentId)?.title}</small></article> : null; }) : <div className="empty-case"><h2>Nothing pinned yet.</h2><p>The room is waiting. Look before you conclude.</p></div>}</div><div className="case-doc-strip"><span>DOCUMENTS EXAMINED</span>{documents.map(doc => <button key={doc.id} onClick={() => openDoc(doc.id)}>{doc.title}</button>)}</div>{proofReady && <button className="case-footer-button" onClick={beginReconstruction}>BEGIN FINAL RECONSTRUCTION →</button>}<button className="case-footer-button" onClick={() => setPhase('scene')}>← BACK TO FIELD</button></div></section></div>}

    {phase === 'document' && selectedDoc && <div className="modal-stage"><article className={`document-viewer ${selectedDoc.type}`}><button className="close-button" onClick={() => setPhase('scene')}>×</button><div className="document-meta">{labels[selectedDoc.type]} · {selectedDoc.source} · {selectedDoc.date}</div><h1>{selectedDoc.title}</h1><div className="document-rule"/>{selectedDoc.content.split('\n').map((line, i) => <p key={i} className={line && line === line.toUpperCase() ? 'document-heading' : ''}>{line || '\u00a0'}</p>)}<div className="document-tags">{selectedDoc.tags?.map(tag => <span key={tag}>{tag}</span>)}</div><button className="document-close" onClick={() => setPhase('scene')}>RETURN TO FIELD</button></article></div>}

    {phase === 'people' && <div className="modal-stage"><section className="people-panel"><button className="close-button" onClick={() => setPhase('scene')}>×</button><div className="panel-kicker">CASE INDEX</div><h1>PEOPLE</h1><p>Names are facts. Conclusions belong to you.</p>{CASE_001.people.map(person => <article key={person.id}><div className="person-initial">{person.name.split(' ').map(part => part[0]).join('').slice(0,2)}</div><div><h2>{person.name}</h2><span>{person.role}</span><p>{person.note}</p></div></article>)}</section></div>}

    {phase === 'notes' && <div className="modal-stage"><section className="notebook-panel"><button className="close-button" onClick={() => setPhase('scene')}>×</button><div className="panel-kicker">PRIVATE NOTES · CASE 001</div><h1>FIELD NOTES</h1><p>Observations, questions, contradictions. No objectives.</p><textarea value={notes} onChange={event => setNotes(event.target.value)} placeholder="Write what you think matters..."/><div className="autosave">SAVED LOCALLY</div></section></div>}

    {phase === 'reconstruction' && <div className="modal-stage"><section className="reconstruction-panel"><button className="close-button" onClick={() => setPhase('scene')}>×</button><div className="panel-kicker">CASE 001 · FINAL DEDUCTION</div><h1>RECONSTRUCT THE DISAPPEARANCE</h1><p className="reconstruction-intro">You have enough evidence to form a complete theory. Explain the case as a sequence of events, not as a task.</p><label>WHO IS RESPONSIBLE<select value={culprit} onChange={e => setCulprit(e.target.value)}><option value="">Choose from the evidence</option><option value="edward">Edward Ward</option><option value="daniel">Daniel Hayes</option><option value="helen">Helen Ward</option></select></label><label>WHAT HAPPENED<select value={method} onChange={e => setMethod(e.target.value)}><option value="">Choose the sequence</option><option value="staged">The disappearance was staged</option><option value="voluntary">Anna left voluntarily</option><option value="accident">Anna left and vanished accidentally</option></select></label><label>WHY<select value={motive} onChange={e => setMotive(e.target.value)}><option value="">Choose the motive</option><option value="archive">Anna had uncovered the old attendance-record dispute</option><option value="personal">A private dispute unrelated to the school</option><option value="travel">Anna wanted to disappear</option></select></label><div className="reconstruction-evidence">{['clue-clock','clue-footsteps','clue-e-ward','clue-plate','clue-tyre'].map(id => { const item = clue(id); return item ? <span key={id}>{item.title}</span> : null; })}</div><button className="ink-button" onClick={submitReconstruction}>LOCK IN RECONSTRUCTION</button>{notice && <p className="reconstruction-feedback">{notice}</p>}</section></div>}

    {phase === 'report' && <div className="modal-stage"><section className="report-panel"><button className="close-button" onClick={() => setPhase('scene')}>×</button><div className="panel-kicker">CASE 001 · FORMAL SUBMISSION</div><h1>REPORT TO NORTH DISTRICT POLICE</h1><p className="report-intro">Write the conclusion in your own words. Then attach the evidence that supports it.</p><div className="report-grid"><textarea value={report} onChange={e => setReport(e.target.value)} placeholder="Describe what happened, who was responsible, and how the evidence supports your conclusion..."/><div className="report-evidence-select">{['clue-coat','clue-clock','clue-footsteps','clue-e-ward','clue-plate','clue-tyre','clue-blue-ink','clue-police'].filter(id => marked.includes(id)).map(id => { const item = clue(id); if (!item) return null; return <label key={id}><input type="checkbox" checked={reportEvidence.includes(id)} onChange={e => setReportEvidence(current => e.target.checked ? [...current, id] : current.filter(value => value !== id))}/><span>{item.title}</span></label>; })}</div></div><div className="report-submit-row"><span>{report.trim().length}/180 characters · {reportEvidence.length}/4 evidence</span><button className="ink-button" disabled={report.trim().length < 180 || reportEvidence.length < 4} onClick={sendReport}>SUBMIT FINDINGS</button></div></section></div>}
  </main>;
};
