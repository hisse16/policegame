import React, { useEffect, useMemo, useState } from 'react';
import { CASE_001, CaseDocument } from '../../data/case001';
import { CASE_001_CLUES } from '../../data/case001Investigations';

const STORAGE_KEY = 'blackwood_case_001_v5';
type Phase = 'opening' | 'scene' | 'case' | 'document' | 'people' | 'notes' | 'report' | 'closed';
type SceneId = 'apartment' | 'school' | 'police' | 'street';
type Save = { phase: Exclude<Phase, 'opening' | 'closed'>; opened: string[]; marked: string[]; visited: SceneId[]; notes: string; selected: string | null };
const initial: Save = { phase: 'scene', opened: [], marked: [], visited: [], notes: '', selected: null };
const labels: Record<CaseDocument['type'], string> = { letter: 'LETTER', newspaper: 'NEWSPAPER', report: 'REPORT', photograph: 'PHOTOGRAPH', note: 'HANDWRITTEN NOTE' };

const scenes: Record<SceneId, { name: string; place: string; requirement?: string; reason?: string }> = {
 apartment: { name: 'THE EMPTY ROOM', place: '14 HARROW LANE · FLAT 3B' },
 school: { name: 'ST. ALDEN PRIMARY', place: 'BASEMENT ARCHIVE', requirement: 'clue-school', reason: 'Anna was investigating an old record at the school.' },
 police: { name: 'NORTH DISTRICT POLICE', place: 'MISSING PERSONS DESK', requirement: 'clue-clock', reason: 'The official timeline does not agree with the scene.' },
 street: { name: 'HARROW LANE', place: 'OUTSIDE FLAT 3B', requirement: 'clue-door', reason: 'A witness heard someone leave after Anna should already have been gone.' },
};

const hotspots = [
 { id: 'coat', title: 'Blue coat', x: 17, y: 57, clue: 'clue-coat', text: 'Anna’s coat is still hanging behind the door. It is cold outside.' },
 { id: 'clock', title: 'Wall clock', x: 72, y: 19, clue: 'clue-clock', text: 'The clock reads 20:59. The police report says officers arrived at 21:10.' },
 { id: 'desk', title: 'Kitchen desk', x: 45, y: 67, clue: 'clue-receipt', text: 'A supermarket receipt records a card payment at 20:31, only minutes before the reported door closing.' },
 { id: 'note', title: 'Folded note', x: 57, y: 76, clue: 'clue-note', text: 'Anna wrote: “Do not trust the wall clock. Check what happened before the rain. Ask why the photograph was kept.”' },
 { id: 'window', title: 'Open window', x: 84, y: 51, clue: 'clue-rain', text: 'The kitchen window is open about twelve centimetres. Rain has marked the sill.' },
 { id: 'photo', title: 'Scene photograph', x: 32, y: 31, clue: 'clue-photo', text: 'Margaret specifically told you Anna wanted the old photograph checked.' },
];

function readSave(): Save { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? { ...initial, ...JSON.parse(raw) } : initial; } catch { return initial; } }

export const DetectiveGame: React.FC = () => {
 const saved = useMemo(readSave, []);
 const [phase, setPhase] = useState<Phase>(() => localStorage.getItem(STORAGE_KEY) ? saved.phase : 'opening');
 const [openingStep, setOpeningStep] = useState(0);
 const [opened, setOpened] = useState(saved.opened);
 const [marked, setMarked] = useState(saved.marked);
 const [visited, setVisited] = useState(saved.visited);
 const [notes, setNotes] = useState(saved.notes);
 const [selected, setSelected] = useState<string | null>(saved.selected);
 const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
 const [scene, setScene] = useState<SceneId>('apartment');
 const [report, setReport] = useState('');
 const [reportEvidence, setReportEvidence] = useState<string[]>([]);
 const [selectedDoc, setSelectedDoc] = useState<CaseDocument | null>(null);
 const [notice, setNotice] = useState('');

 useEffect(() => { if (phase !== 'opening' && phase !== 'closed') localStorage.setItem(STORAGE_KEY, JSON.stringify({ phase, opened, marked, visited, notes, selected })); }, [phase, opened, marked, visited, notes, selected]);
 const clue = (id: string) => CASE_001_CLUES.find(c => c.id === id);
 const unlocks = useMemo(() => {
   const result: SceneId[] = ['apartment'];
   if (marked.includes('clue-school') || opened.includes('doc-school')) result.push('school');
   if (marked.includes('clue-clock') || opened.includes('doc-report')) result.push('police');
   if (marked.includes('clue-door') || opened.includes('doc-witness')) result.push('street');
   return result;
 }, [marked, opened]);
 const keepClue = (id: string) => { setMarked(v => v.includes(id) ? v : [...v, id]); setNotice('DETAIL KEPT IN CASEBOOK'); };
 const inspect = (h: typeof hotspots[number]) => { setActiveHotspot(h.id); keepClue(h.clue); };
 const go = (id: SceneId) => { if (!unlocks.includes(id)) { setNotice(scenes[id].reason || 'You have not found a reason to go there yet.'); return; } setScene(id); setActiveHotspot(null); setVisited(v => v.includes(id) ? v : [...v, id]); setPhase('scene'); };
 const openDoc = (id: string) => { const doc = CASE_001.documents.find(d => d.id === id); if (!doc) return; setSelectedDoc(doc); setOpened(v => v.includes(id) ? v : [...v, id]); setPhase('document'); };
 const start = () => { setPhase('scene'); setScene('apartment'); setVisited(v => v.includes('apartment') ? v : [...v, 'apartment']); };
 const sendReport = () => { if (report.trim().length < 120 || reportEvidence.length < 3) return; setPhase('closed'); };

 if (phase === 'opening') {
   const pages = [
    ['BLACKWOOD DETECTIVE AGENCY', 'THE FIRST CASE', 'Twelve days ago, you put a name on a door. Today, someone finally knocked.'],
    ['OCTOBER 14 · 10:55 AM', 'A BROWN ENVELOPE', 'Inside: a letter from Margaret Bell, an address, and one sentence that refuses to leave your mind: “Please look properly.”'],
    ['THE ADDRESS', '14 HARROW LANE · FLAT 3B', 'Anna Bell is missing. Police believe she left voluntarily. Her sister believes the room tells a different story.'],
   ];
   const p = pages[openingStep];
   return <main className="detective-opening"><div className="opening-grain"/><div className="opening-content"><div className="opening-kicker">{p[0]}</div><h1>{p[1]}</h1><p className="opening-copy">{p[2]}</p><div className="opening-progress">{openingStep + 1} / {pages.length}</div><button className="ink-button" onClick={() => openingStep < pages.length - 1 ? setOpeningStep(v => v + 1) : start()}>{openingStep < pages.length - 1 ? 'CONTINUE' : 'ENTER THE SCENE'}</button></div></main>;
 }
 if (phase === 'closed') return <main className="detective-opening"><div className="opening-content"><div className="opening-kicker">CASE 001 · OFFICIAL RESULT</div><h1>CASE CLOSED</h1><p className="opening-copy">Your findings and selected evidence have been submitted to North District Police. Anna Bell’s disappearance is no longer treated as voluntary.</p><div className="closing-stamp">FINDINGS SUBMITTED<br/>TO NORTH DISTRICT POLICE</div><button className="ink-button" onClick={() => setPhase('case')}>REOPEN CASEBOOK</button></div></main>;

 return <main className="detective-shell">
  <header className="agency-header"><div><div className="header-kicker">BLACKWOOD DETECTIVE AGENCY</div><div className="header-title">CASE 001 · THE EMPTY ROOM</div></div><div className="header-status"><span className="status-dot"/> INVESTIGATION ACTIVE</div></header>
  <div className="detective-nav"><button onClick={() => setPhase('scene')}>FIELD</button><button onClick={() => setPhase('case')}>CASEBOOK <b>{marked.length}</b></button><button onClick={() => setPhase('people')}>PEOPLE</button><button onClick={() => setPhase('notes')}>NOTES</button><button className="report-link" onClick={() => setPhase('report')}>FINAL REPORT</button></div>

  {phase === 'scene' && <section className="field-layout">
   <aside className="lead-rail"><div className="scene-kicker">FIELD FILE</div><div className="lead-title">{scenes[scene].name}</div><div className="lead-place">{scenes[scene].place}</div><div className="lead-rule"/><div className="lead-label">WHAT BROUGHT YOU HERE</div><p>{scene === 'apartment' ? 'Margaret’s letter. Nothing more.' : scenes[scene].reason}</p><div className="lead-label">CASEBOOK</div><p className="small-muted">{marked.length} details kept</p><button className="rail-button" onClick={() => setPhase('case')}>OPEN CASEBOOK →</button></aside>
   <section className={`room-scene room-${scene}`}>
    {scene === 'apartment' && <><div className="room-window"/><div className="room-clock"><span>20:59</span></div><div className="room-door"><span>3B</span></div><div className="room-desk"/><div className="room-coat"/><div className="room-frame"/><div className="room-rug"/></>}
    {scene !== 'apartment' && <div className="location-backdrop"><div className="location-symbol">{scene === 'school' ? 'ARCHIVE' : scene === 'police' ? 'RECORDS' : 'HARROW LANE'}</div><div className="location-copy"><div className="scene-kicker">FIELD LOCATION</div><h1>{scenes[scene].name}</h1><p>{scenes[scene].place}</p></div></div>}
    {scene === 'apartment' && hotspots.map(h => <button key={h.id} className={`hotspot ${activeHotspot === h.id ? 'active' : ''} ${marked.includes(h.clue) ? 'found' : ''}`} style={{ left: `${h.x}%`, top: `${h.y}%` }} onClick={() => inspect(h)} aria-label={`Inspect ${h.title}`}><span className="hotspot-ring"/><span className="hotspot-label">{h.title}{marked.includes(h.clue) ? ' · KEPT' : ''}</span></button>)}
    {scene !== 'apartment' && <div className="location-actions">
      {scene === 'school' && <><button onClick={() => openDoc('doc-school')}>STAFF STATEMENT</button><button onClick={() => openDoc('doc-archive')}>1998 ARCHIVE</button></>}
      {scene === 'police' && <><button onClick={() => openDoc('doc-report')}>ORIGINAL REPORT</button><button onClick={() => openDoc('doc-newspaper')}>PUBLIC VERSION</button></>}
      {scene === 'street' && <><button onClick={() => openDoc('doc-witness')}>HELEN WARD'S STATEMENT</button><button onClick={() => openDoc('doc-receipt')}>20:31 TRANSACTION</button></>}
    </div>}
    {activeHotspot && scene === 'apartment' && (() => { const h = hotspots.find(x => x.id === activeHotspot)!; return <div className="evidence-popover"><div className="evidence-type">OBSERVATION · {marked.includes(h.clue) ? 'KEPT' : 'NEW'}</div><h2>{h.title}</h2><p>{h.text}</p><div className="evidence-source">This detail has been added to your casebook.</div><button onClick={() => setActiveHotspot(null)}>CLOSE</button></div>; })()}
    {notice && <div className="field-notice">{notice}<button onClick={() => setNotice('')}>×</button></div>}
    <div className="scene-caption"><span>LOOK AROUND</span><strong>Click an object that deserves a closer look.</strong></div>
   </section>
   <aside className="lead-map"><div className="scene-kicker">YOUR LEADS</div><div className="lead-map-line"><div className="lead-node current">{scenes.apartment.name}<small>KNOWN</small></div>{(['police','school','street'] as SceneId[]).map(id => <React.Fragment key={id}><div className="lead-arrow">→</div><button className={`lead-node ${unlocks.includes(id) ? 'unlocked' : 'locked'}`} onClick={() => go(id)}>{unlocks.includes(id) ? scenes[id].name : 'UNKNOWN'}<small>{unlocks.includes(id) ? 'NEW LEAD' : 'LOCKED'}</small></button></React.Fragment>)}</div><p className="lead-help">New places appear only when the evidence gives you a reason to look there.</p></aside>
  </section>}

  {phase === 'case' && <div className="modal-stage"><section className="case-folder"><button className="close-button" onClick={() => setPhase('scene')}>×</button><div className="folder-tab">CASE 001</div><div className="folder-content"><div className="folder-heading"><span>BLACKWOOD PRIVATE INVESTIGATIONS</span><strong>THE EMPTY ROOM</strong><small>WORKING CASEBOOK</small></div><div className="case-tabs"><button className="active">EVIDENCE <b>{marked.length}</b></button><button onClick={() => setPhase('document')}>DOCUMENTS <b>{opened.length}</b></button></div><div className="case-evidence-grid">{marked.length ? marked.map(id => { const c = clue(id); return c ? <article key={id}><span>{c.kind.toUpperCase()}</span><h3>{c.title}</h3><p>{c.text}</p><small>{CASE_001.documents.find(d => d.id === c.sourceDocumentId)?.title}</small></article> : null; }) : <div className="empty-case"><h2>Nothing pinned yet.</h2><p>Return to the field. The apartment contains more than it first appears to.</p></div>}</div><div className="case-doc-strip"><span>DOCUMENTS EXAMINED</span>{CASE_001.documents.filter(d => opened.includes(d.id)).map(d => <button key={d.id} onClick={() => openDoc(d.id)}>{d.title}</button>)}</div><button className="case-footer-button" onClick={() => setPhase('scene')}>← BACK TO FIELD</button></div></section></div>}

  {phase === 'document' && selectedDoc && <div className="modal-stage"><article className={`document-viewer ${selectedDoc.type}`}><button className="close-button" onClick={() => setPhase('scene')}>×</button><div className="document-meta">{labels[selectedDoc.type]} · {selectedDoc.source} · {selectedDoc.date}</div><h1>{selectedDoc.title}</h1><div className="document-rule"/>{selectedDoc.content.split('\n').map((line, i) => <p key={i} className={line && line === line.toUpperCase() ? 'document-heading' : ''}>{line || '\u00a0'}</p>)}<div className="document-tags">{selectedDoc.tags?.map(t => <span key={t}>{t}</span>)}</div><button className="document-close" onClick={() => setPhase('scene')}>RETURN TO FIELD</button></article></div>}

  {phase === 'people' && <div className="modal-stage"><section className="people-panel"><button className="close-button" onClick={() => setPhase('scene')}>×</button><div className="panel-kicker">CASE INDEX</div><h1>PEOPLE</h1><p>Names are facts. Conclusions belong to you.</p>{CASE_001.people.map(p => <article key={p.id}><div className="person-initial">{p.name.split(' ').map(x => x[0]).join('').slice(0,2)}</div><div><h2>{p.name}</h2><span>{p.role}</span><p>{p.note}</p></div></article>)}</section></div>}

  {phase === 'notes' && <div className="modal-stage"><section className="notebook-panel"><button className="close-button" onClick={() => setPhase('scene')}>×</button><div className="panel-kicker">PRIVATE NOTES · CASE 001</div><h1>FIELD NOTES</h1><p>Observations, questions, contradictions. No objectives.</p><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="The thing that bothers me is..."/><div className="autosave">AUTOSAVED · PRIVATE CASEBOOK</div></section></div>}

  {phase === 'report' && <div className="modal-stage"><section className="report-panel"><button className="close-button" onClick={() => setPhase('scene')}>×</button><div className="panel-kicker">BLACKWOOD DETECTIVE AGENCY · CASE 001</div><h1>FINAL REPORT</h1><p className="report-intro">The investigation ends here. Explain what happened to Anna Bell in your own words and attach the evidence that supports your reconstruction.</p><div className="report-grid"><div><label>EVIDENCE</label>{marked.map(id => { const c = clue(id); return c ? <label className="evidence-check" key={id}><input type="checkbox" checked={reportEvidence.includes(id)} onChange={e => setReportEvidence(v => e.target.checked ? [...v, id] : v.filter(x => x !== id))}/><span>{c.title}</span></label> : null; })}</div><div><label>YOUR FINDINGS</label><textarea value={report} onChange={e => setReport(e.target.value)} placeholder="To North District Police...\n\nI believe Anna Bell did not leave voluntarily because..."/><small>{report.trim().length} characters · minimum 120</small></div></div><button className="ink-button" disabled={report.trim().length < 120 || reportEvidence.length < 3} onClick={sendReport}>SIGN & SUBMIT REPORT</button></section></div>}
 </main>;
};
