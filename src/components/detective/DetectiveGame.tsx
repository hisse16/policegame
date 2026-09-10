import React, { useEffect, useMemo, useState } from 'react';
import { CASE_001, CaseDocument, CasePerson } from '../../data/case001';

const STORAGE_KEY = 'blackwood_office_case_v1';
type Tab = 'office' | 'case' | 'documents' | 'people' | 'requests' | 'reports' | 'notes';
type Request = { id: number; location: string; focus: string; timeframe: string; instruction: string; status: 'pending' | 'complete'; reportId?: number };
type FieldReport = { id: number; requestId: number; title: string; date: string; investigator: string; location: string; findings: string[]; witness: string[]; timeline: string[]; links: string[]; limitations: string[] };
type Save = { tab: Tab; opened: string[]; notes: string; requests: Request[]; reports: FieldReport[] };
const initial: Save = { tab: 'office', opened: [], notes: '', requests: [], reports: [] };

const fieldData: Record<string, Omit<FieldReport, 'id'|'requestId'|'title'|'date'|'investigator'|'location'>> = {
  '14 Harrow Lane': {
    findings: ['The front door showed no sign of forced entry. The lock and frame were intact.', 'The kitchen window was open approximately twelve centimetres. A narrow dried rain line was visible along the sill.', 'Anna Bell’s handbag, keys, glasses case and blue coat remained inside the flat.', 'Anna Bell’s debit card was used at Mercer Market at 20:31.', 'The kitchen wall clock displayed 20:59 when officers arrived at 21:10.'],
    witness: ['Helen Ward reported hearing the front door close at approximately 21:10.', 'No witness reported seeing Anna leave the building.'],
    timeline: ['18:12 — Anna leaves St. Alden Primary School.', '20:31 — Anna Bell debit card used at Mercer Market.', '21:10 — Helen Ward hears the flat door close.', '21:10 — Police later record the kitchen clock as 20:59.'],
    links: ['Anna Bell', 'Helen Ward', 'Mercer Market', 'Initial Missing Person Report', 'Anna’s Handwritten Note'],
    limitations: ['No usable interior CCTV was available.', 'The clock discrepancy could not be explained from the scene alone.'],
  },
  'St. Alden Primary': {
    findings: ['Anna asked about the old attendance archive at approximately 17:40.', 'Daniel Hayes spoke with Anna at approximately 18:05 and described her as worried about a mistake in an old record.', 'The 1998 basement archive contains a damaged attendance ledger with a correction beside former caretaker Edward Ward.', 'The correction uses an unusual blue-ink mark matching a mark Anna had photocopied.', 'A loose 1998 staff photograph was hidden inside the ledger rather than filed with staff records.'],
    witness: ['Daniel Hayes confirmed that Anna was investigating an old record before leaving.', 'School administration could not explain why the photograph had been kept outside the official archive.'],
    timeline: ['17:40 — Anna asks about the basement archive.', '18:05 — Daniel Hayes speaks with Anna.', '18:12 — Anna leaves school.', '1998 — Edward Ward appears beside a disputed attendance correction.'],
    links: ['Anna Bell', 'Daniel Hayes', 'Edward Ward', 'The Old Photograph', 'St. Alden Attendance Archive — 1998'],
    limitations: ['Several 1998 archive pages are damaged or missing.', 'The original reason for the blue-ink correction is not recorded.'],
  },
  'Harrow Lane': {
    findings: ['A fresh-looking tyre impression begins beside the entrance to Flat 3B.', 'The impression is consistent with a mid-size sedan.', 'A shop photograph taken across the road contains a partial registration: EW-19.', 'Helen Ward identifies the dark blue sedan she saw that evening as the same vehicle parked beside the building.', 'The old school maintenance register lists Edward Ward with a blue sedan carrying the same partial registration.'],
    witness: ['Helen Ward remembers a dark blue sedan outside the building earlier that evening.', 'The shopkeeper’s photograph provides only a partial registration and does not identify the driver.'],
    timeline: ['Earlier evening — dark blue sedan seen outside Flat 3B.', '21:10 — Helen hears the flat door close.', 'Afterward — heavy footsteps are heard on the stairs.', 'Later — tyre impression remains beside the entrance.'],
    links: ['Helen Ward', 'Edward Ward', 'EW-19', 'Street Inspection — Harrow Lane'],
    limitations: ['The registration is only partially visible.', 'The original street CCTV was unavailable for review.'],
  },
};

function loadSave(): Save { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? { ...initial, ...JSON.parse(raw) } : initial; } catch { return initial; } }
function doc(id: string) { return CASE_001.documents.find(d => d.id === id); }

export const DetectiveGame: React.FC = () => {
  const saved = useMemo(loadSave, []);
  const [tab, setTab] = useState<Tab>(saved.tab || 'office');
  const [opened, setOpened] = useState<string[]>(saved.opened || []);
  const [notes, setNotes] = useState(saved.notes || '');
  const [requests, setRequests] = useState<Request[]>(saved.requests || []);
  const [reports, setReports] = useState<FieldReport[]>(saved.reports || []);
  const [selectedDoc, setSelectedDoc] = useState<CaseDocument | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<CasePerson | null>(null);
  const [selectedReport, setSelectedReport] = useState<FieldReport | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [location, setLocation] = useState('14 Harrow Lane');
  const [focus, setFocus] = useState('CCTV / witnesses / vehicles');
  const [timeframe, setTimeframe] = useState('October 12 · evening');
  const [instruction, setInstruction] = useState('Find anything that can clarify what happened after Anna Bell left the school. Check witnesses, vehicles and any available records.');
  const [notice, setNotice] = useState('');
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ tab, opened, notes, requests, reports })); }, [tab, opened, notes, requests, reports]);

  const openDocument = (d: CaseDocument) => { setSelectedDoc(d); setOpened(v => v.includes(d.id) ? v : [...v, d.id]); };
  const finishRequest = (r: Request) => {
    const data = fieldData[r.location] || fieldData['14 Harrow Lane'];
    const report: FieldReport = { ...data, id: Date.now(), requestId: r.id, title: `FIELD REPORT — ${r.location.toUpperCase()}`, date: 'October 17, 2026 · 16:40', investigator: 'A. Miller · Field Investigator', location: r.location };
    setReports(v => [report, ...v]); setRequests(v => v.map(x => x.id === r.id ? { ...x, status: 'complete', reportId: report.id } : x)); setSelectedReport(report); setTab('reports'); setNotice('FIELD REPORT RECEIVED');
  };
  const sendRequest = () => {
    if (!location.trim() || !instruction.trim()) { setNotice('LOCATION AND INVESTIGATION QUESTION ARE REQUIRED'); return; }
    const r: Request = { id: Date.now(), location: location.trim(), focus: focus.trim(), timeframe: timeframe.trim(), instruction: instruction.trim(), status: 'pending' };
    setRequests(v => [r, ...v]); setTab('requests'); setNotice('FIELD INVESTIGATOR ASSIGNED'); window.setTimeout(() => finishRequest(r), 1400);
  };
  const pending = requests.filter(r => r.status === 'pending').length;

  return <main className="blackwood-office">
    <div className="office-backdrop" aria-hidden="true" /><div className="office-vignette" aria-hidden="true" />
    <header className="office-topbar"><div className="agency-mark"><span>BLACKWOOD</span><small>DETECTIVE AGENCY · PRIVATE INVESTIGATIONS</small></div><div className="case-strip"><i /> CASE 001 <b>THE EMPTY ROOM</b></div><div className="clock-strip">MON · OCT 17, 2026&nbsp;&nbsp; 16:47</div></header>
    <section className="office-workspace">
      <aside className="office-left"><div className="folder-label">ACTIVE CASE</div><h1>Anna Bell</h1><p className="muted">Missing person · 34 · Teacher</p><div className="paper-rule" />
        {([['office','Desk','01'],['case','Case file','02'],['documents','Documents',String(opened.length)],['people','People',String(CASE_001.people.length)],['requests','Field requests',String(pending || '—')],['reports','Field reports',String(reports.length || '—')],['notes','Notebook','∞']] as [Tab,string,string][]).map(([id,label,count]) => <button key={id} className={`desk-nav ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{label}<span>{count}</span></button>)}
        <div className="left-bottom"><div className="folder-label">OFFICE</div><div>BLACKWOOD · ROOM 3</div><div className="muted">You stay here. The field team travels.</div></div>
      </aside>
      <section className="office-content">{notice && <button className="notice" onClick={() => setNotice('')}>{notice} ×</button>}
        {tab === 'office' && <Home pending={pending} reports={reports} onAssign={() => setTab('requests')} onReport={r => { setSelectedReport(r); setTab('reports'); }} />}
        {tab === 'case' && <CaseFile onOpen={openDocument} />}
        {tab === 'documents' && <Documents opened={opened} onOpen={openDocument} />}
        {tab === 'people' && <People onOpen={setSelectedPerson} />}
        {tab === 'requests' && <Requests requests={requests} selected={selectedRequest} setSelected={setSelectedRequest} onAssign={sendRequest} location={location} setLocation={setLocation} focus={focus} setFocus={setFocus} timeframe={timeframe} setTimeframe={setTimeframe} instruction={instruction} setInstruction={setInstruction} />}
        {tab === 'reports' && <Reports reports={reports} selected={selectedReport} setSelected={setSelectedReport} />}
        {tab === 'notes' && <Notebook notes={notes} setNotes={setNotes} />}
      </section>
    </section>
    {selectedDoc && <DocumentModal d={selectedDoc} close={() => setSelectedDoc(null)} />}{selectedPerson && <PersonModal p={selectedPerson} close={() => setSelectedPerson(null)} />}
  </main>;
};

const Home: React.FC<{pending:number;reports:FieldReport[];onAssign:()=>void;onReport:(r:FieldReport)=>void}> = ({pending,reports,onAssign,onReport}) => <div className="home-view"><div className="view-kicker">BLACKWOOD · PRIVATE OFFICE</div><h2>The desk is the scene.</h2><p className="lede">You never need to leave the office. Read what arrives, follow connections, ask the right questions, and send someone into the field when you need facts you cannot obtain from the desk.</p><div className="paper-stack"><article className="desk-paper letter-paper"><div className="paper-type">LETTER · OCT 13</div><h3>Margaret Bell</h3><p>“Please look properly. Anna would not leave without her coat, handbag and glasses.”</p><button onClick={onAssign}>Investigate the lead →</button></article><article className="desk-paper newspaper-paper"><div className="paper-type">THE EVENING REGISTER</div><h3>TEACHER REPORTED MISSING</h3><p>Police currently describe the disappearance as voluntary. Last confirmed sighting: 18:12.</p><span className="red-pencil">QUESTION THE TIMELINE</span></article><article className="desk-paper report-paper"><div className="paper-type">FIELD DESK</div><h3>{reports.length ? `${reports.length} report${reports.length>1?'s':''} received` : 'No field reports yet'}</h3><p>{pending ? `${pending} investigator is currently working.` : 'Nothing is waiting on your desk.'}</p>{reports[0] && <button onClick={() => onReport(reports[0])}>Read latest report →</button>}</article></div><div className="home-footer"><span>ACTIVE LEADS</span><b>Read. Compare. Ask. Connect.</b><span>FIELD TEAM {pending?'IN PROGRESS':'AVAILABLE'}</span></div></div>;

const CaseFile: React.FC<{onOpen:(d:CaseDocument)=>void}> = ({onOpen}) => <div className="view"><div className="view-kicker">CASE FILE · CASE-001</div><h2>The Empty Room</h2><p className="lede">A woman vanished. The room tells a different story.</p><div className="case-grid"><div><label>CLIENT</label><strong>Margaret Bell</strong><p>Anna’s sister. Received a worrying call the night before the disappearance.</p></div><div><label>SUBJECT</label><strong>Anna Bell</strong><p>34 · Primary school teacher · Missing since October 12.</p></div><div><label>POLICE POSITION</label><strong>Voluntary absence</strong><p>North District Police classified the case low risk before contradictions were reconciled.</p></div><div><label>YOUR POSITION</label><strong>Unresolved</strong><p>No prescribed route. The case changes as you connect evidence.</p></div></div><button className="primary-paper-button" onClick={() => { const d=doc('doc-client-letter'); if(d) onOpen(d); }}>Read Margaret’s letter</button></div>;

const Documents: React.FC<{opened:string[];onOpen:(d:CaseDocument)=>void}> = ({opened,onOpen}) => <div className="view"><div className="view-kicker">DESK ARCHIVE</div><h2>Documents</h2><p className="lede">Letters, newspapers and reports stay on the desk. Nothing here tells you what to think.</p><div className="document-list">{CASE_001.documents.map(d=><button key={d.id} className={`document-row ${opened.includes(d.id)?'read':''}`} onClick={()=>onOpen(d)}><span className="doc-type">{d.type.toUpperCase()}</span><span><b>{d.title}</b><small>{d.date} · {d.source}</small></span><em>{opened.includes(d.id)?'READ':'UNREAD'}</em></button>)}</div></div>;
const People: React.FC<{onOpen:(p:CasePerson)=>void}> = ({onOpen}) => <div className="view"><div className="view-kicker">CASE INDEX</div><h2>People</h2><p className="lede">Names are leads, not conclusions.</p><div className="people-grid">{CASE_001.people.map(p=><button key={p.id} className="person-card" onClick={()=>onOpen(p)}><span>{p.name.split(' ').map(n=>n[0]).join('')}</span><b>{p.name}</b><small>{p.role}</small></button>)}</div></div>;

interface RequestProps {requests:Request[];selected:Request|null;setSelected:(r:Request|null)=>void;onAssign:()=>void;location:string;setLocation:(v:string)=>void;focus:string;setFocus:(v:string)=>void;timeframe:string;setTimeframe:(v:string)=>void;instruction:string;setInstruction:(v:string)=>void}
const Requests: React.FC<RequestProps> = p => <div className="view"><div className="view-kicker">FIELD OPERATIONS</div><h2>Ask. They investigate.</h2><p className="lede">Give the field investigator a question worth answering. Reports return with facts, contradictions and limitations — never a verdict.</p><div className="request-layout"><div className="assignment-card"><div className="form-label">DESTINATION / SUBJECT</div><input value={p.location} onChange={e=>p.setLocation(e.target.value)} placeholder="e.g. 14 Harrow Lane"/><div className="form-label">FOCUS</div><input value={p.focus} onChange={e=>p.setFocus(e.target.value)} placeholder="CCTV, witnesses, vehicles..."/><div className="form-label">TIME WINDOW</div><input value={p.timeframe} onChange={e=>p.setTimeframe(e.target.value)}/><div className="form-label">WHAT DO YOU WANT TO KNOW?</div><textarea value={p.instruction} onChange={e=>p.setInstruction(e.target.value)} rows={7}/><button className="send-button" onClick={p.onAssign}>SEND FIELD REQUEST →</button></div><div className="request-history"><div className="form-label">OUTSTANDING & COMPLETED</div>{p.requests.length===0&&<div className="empty-slip">No requests. Start from a question you cannot answer from the desk.</div>}{p.requests.map(r=><button key={r.id} className={`request-row ${p.selected?.id===r.id?'selected':''}`} onClick={()=>p.setSelected(r)}><span className={r.status==='complete'?'check':'spinner'}>{r.status==='complete'?'✓':'…'}</span><span><b>{r.location}</b><small>{r.focus} · {r.timeframe}</small></span><em>{r.status==='complete'?'REPORT READY':'IN FIELD'}</em></button>)}{p.selected&&<div className="request-detail"><b>YOUR QUESTION</b><p>{p.selected.instruction}</p><small>{p.selected.status==='complete'?'The investigator returned a report.':'Field investigator is still working.'}</small></div>}</div></div></div>;

const Reports: React.FC<{reports:FieldReport[];selected:FieldReport|null;setSelected:(r:FieldReport|null)=>void}> = ({reports,selected,setSelected}) => <div className="view"><div className="view-kicker">FIELD INTELLIGENCE</div><h2>Reports</h2><p className="lede">The useful part may be a contradiction, a name, a time, or a detail that was almost missed.</p>{reports.length===0?<div className="empty-report"><b>YOUR FIELD DESK IS EMPTY.</b><span>Assign an investigation from Field Requests.</span></div>:<div className="report-list">{reports.map(r=><button key={r.id} className="report-row" onClick={()=>setSelected(r)}><span className="report-stamp">FIELD<br/>REPORT</span><span><b>{r.title}</b><small>{r.date} · {r.investigator}</small><p>{r.findings[0]}</p></span><em>OPEN →</em></button>)}</div>}{selected&&<div className="inline-report"><div className="report-head"><span>{selected.investigator}</span><b>{selected.location}</b></div><h3>{selected.title}</h3><ReportSection title="FINDINGS" items={selected.findings}/><ReportSection title="WITNESS / SOURCES" items={selected.witness}/><ReportSection title="TIMELINE" items={selected.timeline}/><ReportSection title="LIMITATIONS" items={selected.limitations}/><section><h4>LINKED LEADS</h4><div className="linked-chips">{selected.links.map(x=><span key={x}>{x}</span>)}</div></section></div>}</div>;
const ReportSection: React.FC<{title:string;items:string[]}> = ({title,items}) => <section><h4>{title}</h4>{items.map((x,i)=><p key={i}>• {x}</p>)}</section>;
const Notebook: React.FC<{notes:string;setNotes:(v:string)=>void}> = ({notes,setNotes}) => <div className="view notebook-view"><div className="view-kicker">PRIVATE NOTES</div><h2>Notebook</h2><p className="lede">Write your own theory, questions and contradictions. The game never marks a theory correct for you.</p><textarea className="big-notebook" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="What do you think is happening? What does not fit yet? Which question should you ask next?"/><div className="notebook-hint">Saved automatically.</div></div>;
const DocumentModal: React.FC<{d:CaseDocument;close:()=>void}> = ({d,close}) => <div className="modal-backdrop" onClick={close}><article className="paper-modal" onClick={e=>e.stopPropagation()}><button className="close-paper" onClick={close}>×</button><div className="paper-type">{d.type.toUpperCase()} · {d.date}</div><h2>{d.title}</h2><div className="modal-source">{d.source}</div><div className="document-content">{d.content.split('\n').map((x,i)=><p key={i}>{x||'\u00a0'}</p>)}</div><div className="tag-row">{d.tags?.map(x=><span key={x}>{x}</span>)}</div></article></div>;
const PersonModal: React.FC<{p:CasePerson;close:()=>void}> = ({p,close}) => <div className="modal-backdrop" onClick={close}><article className="person-modal" onClick={e=>e.stopPropagation()}><button className="close-paper" onClick={close}>×</button><div className="initial-badge">{p.name.split(' ').map(n=>n[0]).join('')}</div><div className="paper-type">CASE PERSON</div><h2>{p.name}</h2><h3>{p.role}</h3><p>{p.note}</p></article></div>;
