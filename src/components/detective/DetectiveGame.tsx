import React, { useEffect, useMemo, useState } from 'react';
import { CASE_001, CaseDocument, CasePerson } from '../../data/case001';

const STORAGE_KEY = 'blackwood_office_case_v2';
const INTRO_KEY = 'blackwood_agency_intro_seen_v1';
const FIELD_DELAY_MS = 60_000;

type Tab = 'office' | 'case' | 'documents' | 'people' | 'requests' | 'reports' | 'notes';
type RequestStatus = 'pending' | 'complete';
type Request = { id:number; location:string; focus:string; timeframe:string; instruction:string; status:RequestStatus; sentAt:number; readyAt:number; reportId?:number };
type FieldReport = { id:number; requestId:number; title:string; date:string; investigator:string; location:string; findings:string[]; witness:string[]; records:string[]; limitations:string[] };
type Save = { tab:Tab; opened:string[]; notes:string; requests:Request[]; reports:FieldReport[] };
const initial:Save = { tab:'office', opened:[], notes:'', requests:[], reports:[] };

const clean=(value:string)=>value.toLowerCase().trim();
const hasAny=(value:string,terms:string[])=>terms.some(term=>clean(value).includes(term));

// Arthur reports only what the requested assignment could establish. He never returns a verdict or a complete case summary.
const fieldEvidence = {
  '14 Harrow Lane': {
    findings:[
      {terms:['door','entry','forced'],text:'The front door and frame were intact. I found no visible sign of forced entry.'},
      {terms:['window','rain','weather'],text:'The kitchen window was open roughly twelve centimetres. There was a dried rain line along the sill.'},
      {terms:['coat','bag','handbag','belonging','belongings'],text:'Anna Bell’s blue coat, handbag, keys and glasses case were still inside the flat.'},
      {terms:['clock','time','timeline'],text:'The kitchen wall clock was showing 20:59 when I checked the scene.'},
      {terms:['receipt','market','mercer','purchase','card','transaction'],text:'The folded Mercer Market receipt in the kitchen records a purchase at 20:31 on October 12.'}
    ],
    witness:[
      {terms:['helen','neighbour','neighbor','witness','door'],text:'Helen Ward said she heard the door of Flat 3B close at about 21:10. She did not see who was at the door.'},
      {terms:['footstep','stairs','stair'],text:'Helen Ward later added that she heard heavy footsteps on the stairs after the door closed.'}
    ],
    records:[
      {terms:['cctv','camera','video','footage'],text:'There is no usable interior CCTV covering the relevant period.'},
      {terms:['market','receipt','card','transaction'],text:'Mercer Market’s transaction record shows Anna Bell’s debit card used at 20:31.'}
    ],
    limitations:['The scene alone does not establish who closed the door.','No usable interior CCTV was available.']
  },
  'St. Alden Primary': {
    findings:[
      {terms:['archive','record','ledger','1998','old'],text:'The basement archive contains a damaged 1998 attendance ledger with a handwritten correction beside Edward Ward’s name.'},
      {terms:['blue','ink','mark','correction'],text:'The correction uses an unusual blue-ink mark. A photocopied page kept with Anna’s material carries a matching mark.'},
      {terms:['photo','photograph','picture'],text:'A loose 1998 staff photograph was found inside the ledger rather than filed with the staff records.'},
      {terms:['anna','bell','school'],text:'Staff records place Anna Bell at the school until 18:12. She had asked about the old archive at approximately 17:40.'}
    ],
    witness:[
      {terms:['daniel','hayes','colleague','coworker'],text:'Daniel Hayes said he spoke with Anna at about 18:05. He remembered her being worried about an error in an old record.'},
      {terms:['admin','administration','archive','photo','photograph'],text:'School administration could not explain why the old photograph had been kept outside the normal archive file.'}
    ],
    records:[
      {terms:['maintenance','vehicle','car','sedan','plate','registration'],text:'The old school maintenance register lists Edward Ward with a blue sedan carrying the partial registration EW-19.'}
    ],
    limitations:['Several pages of the 1998 archive are damaged or missing.','The original reason for the blue-ink correction is not recorded.']
  },
  'Harrow Lane': {
    findings:[
      {terms:['tyre','tire','track','impression'],text:'I found a fresh-looking tyre impression beginning beside the entrance to Flat 3B. Its width is consistent with a mid-size sedan.'},
      {terms:['car','vehicle','sedan','blue'],text:'A dark blue sedan had reportedly been parked beside the entrance earlier that evening.'},
      {terms:['plate','registration','ew-19','number'],text:'A shop photograph across the road contains only a partial registration: EW-19.'},
      {terms:['helen','ward','witness'],text:'Helen Ward identified the dark blue sedan in the street as the vehicle she remembered seeing earlier that evening.'}
    ],
    witness:[
      {terms:['helen','ward','witness'],text:'Helen Ward remembered the dark blue sedan outside the building. She could not identify its driver.'},
      {terms:['shop','photograph','photo','camera'],text:'The shopkeeper’s photograph shows only part of the vehicle registration and does not identify the driver.'}
    ],
    records:[
      {terms:['school','maintenance','edward','ward','register'],text:'The old school maintenance register lists Edward Ward with a blue sedan carrying the same partial registration, EW-19.'}
    ],
    limitations:['The registration is partial.','The vehicle’s presence does not by itself establish who was driving it.']
  }
} as const;

function loadSave():Save {
  try { const raw=localStorage.getItem(STORAGE_KEY); if(!raw)return initial; const parsed=JSON.parse(raw) as Partial<Save>; return {...initial,...parsed,requests:parsed.requests||[],reports:parsed.reports||[]}; }
  catch { return initial; }
}
function doc(id:string){return CASE_001.documents.find(d=>d.id===id);}

function buildReport(request:Request):FieldReport {
  const key=(Object.keys(fieldEvidence) as Array<keyof typeof fieldEvidence>).find(k=>clean(k)===clean(request.location)) || '14 Harrow Lane';
  const data=fieldEvidence[key];
  const query=`${request.focus} ${request.instruction}`;
  const findings=data.findings.filter(x=>hasAny(query,x.terms)).map(x=>x.text);
  const witness=data.witness.filter(x=>hasAny(query,x.terms)).map(x=>x.text);
  const records=data.records.filter(x=>hasAny(query,x.terms)).map(x=>x.text);
  if(!findings.length&&!witness.length&&!records.length){ findings.push(data.findings[0].text); if(data.findings[1])findings.push(data.findings[1].text); }
  return {id:Date.now(),requestId:request.id,title:`FIELD REPORT — ${request.location.toUpperCase()}`,date:'October 17, 2026 · 16:40',investigator:'Arthur Vale · Field Investigator',location:request.location,findings:[...new Set(findings)],witness:[...new Set(witness)],records:[...new Set(records)],limitations:data.limitations};
}

export const DetectiveGame:React.FC=()=>{
  const saved=useMemo(loadSave,[]);
  const [tab,setTab]=useState<Tab>(saved.tab||'office'); const [opened,setOpened]=useState<string[]>(saved.opened||[]); const [notes,setNotes]=useState(saved.notes||'');
  const [requests,setRequests]=useState<Request[]>(saved.requests||[]); const [reports,setReports]=useState<FieldReport[]>(saved.reports||[]);
  const [selectedDoc,setSelectedDoc]=useState<CaseDocument|null>(null); const [selectedPerson,setSelectedPerson]=useState<CasePerson|null>(null); const [selectedReport,setSelectedReport]=useState<FieldReport|null>(null); const [selectedRequest,setSelectedRequest]=useState<Request|null>(null);
  const [location,setLocation]=useState(''); const [focus,setFocus]=useState(''); const [timeframe,setTimeframe]=useState(''); const [instruction,setInstruction]=useState(''); const [notice,setNotice]=useState(''); const [now,setNow]=useState(Date.now());
  const [showIntro,setShowIntro]=useState(()=>localStorage.getItem(INTRO_KEY)!=='1');

  useEffect(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify({tab,opened,notes,requests,reports}));},[tab,opened,notes,requests,reports]);
  useEffect(()=>{const timer=window.setInterval(()=>setNow(Date.now()),1000);return()=>window.clearInterval(timer);},[]);
  useEffect(()=>{
    const ready=requests.filter(r=>r.status==='pending'&&r.readyAt<=Date.now()); if(!ready.length)return;
    ready.forEach(r=>{const report=buildReport(r);setReports(v=>v.some(x=>x.requestId===r.id)?v:[report,...v]);setRequests(v=>v.map(x=>x.id===r.id?{...x,status:'complete',reportId:report.id}:x));setSelectedReport(report);setNotice('ARTHUR VALE — REPORT RECEIVED');});
  },[now,requests]);

  const openDocument=(d:CaseDocument)=>{setSelectedDoc(d);setOpened(v=>v.includes(d.id)?v:[...v,d.id]);};
  const sendRequest=()=>{
    if(!location.trim()||!instruction.trim()){setNotice('LOCATION AND INVESTIGATION QUESTION ARE REQUIRED');return;}
    const sentAt=Date.now(); const request:Request={id:sentAt,location:location.trim(),focus:focus.trim(),timeframe:timeframe.trim(),instruction:instruction.trim(),status:'pending',sentAt,readyAt:sentAt+FIELD_DELAY_MS};
    setRequests(v=>[request,...v]);setSelectedRequest(request);setTab('requests');setNotice('ARTHUR VALE HAS LEFT FOR THE FIELD');setLocation('');setFocus('');setTimeframe('');setInstruction('');
  };
  const closeIntro=()=>{localStorage.setItem(INTRO_KEY,'1');setShowIntro(false);}; const pending=requests.filter(r=>r.status==='pending');

  return <main className="blackwood-office"><div className="office-backdrop" aria-hidden="true"/><div className="office-vignette" aria-hidden="true"/>
    <header className="office-topbar"><div className="agency-mark"><span>BLACKWOOD</span><small>DETECTIVE AGENCY · PRIVATE INVESTIGATIONS</small></div><div className="case-strip"><i/> CASE 001 <b>THE EMPTY ROOM</b></div><div className="clock-strip">MON · OCT 17, 2026&nbsp;&nbsp; 16:47</div></header>
    <section className="office-workspace"><aside className="office-left"><div className="folder-label">ACTIVE CASE</div><h1>Anna Bell</h1><p className="muted">Missing person · 34 · Teacher</p><div className="paper-rule"/>
      {([['office','Desk','01'],['case','Case file','02'],['documents','Documents',String(opened.length)],['people','People',String(CASE_001.people.length)],['requests','Field requests',String(pending.length||'—')],['reports','Field reports',String(reports.length||'—')],['notes','Notebook','∞']] as [Tab,string,string][]).map(([id,label,count])=><button key={id} className={`desk-nav ${tab===id?'active':''}`} onClick={()=>setTab(id)}>{label}<span>{count}</span></button>)}
      <div className="left-bottom"><div className="folder-label">OFFICE</div><div>BLACKWOOD · ROOM 3</div><div className="muted">You stay here. Arthur travels.</div></div></aside>
      <section className="office-content">{notice&&<button className="notice" onClick={()=>setNotice('')}>{notice} ×</button>}
        {tab==='office'&&<Home pending={pending} reports={reports} onAssign={()=>setTab('requests')} onReport={r=>{setSelectedReport(r);setTab('reports');}}/>}{tab==='case'&&<CaseFile onOpen={openDocument}/>} {tab==='documents'&&<Documents opened={opened} onOpen={openDocument}/>} {tab==='people'&&<People onOpen={setSelectedPerson}/>} {tab==='requests'&&<Requests requests={requests} selected={selectedRequest} setSelected={setSelectedRequest} onAssign={sendRequest} location={location} setLocation={setLocation} focus={focus} setFocus={setFocus} timeframe={timeframe} setTimeframe={setTimeframe} instruction={instruction} setInstruction={setInstruction} now={now}/>} {tab==='reports'&&<Reports reports={reports} selected={selectedReport} setSelected={setSelectedReport}/>} {tab==='notes'&&<Notebook notes={notes} setNotes={setNotes}/>}</section>
    </section>
    {selectedDoc&&<DocumentModal d={selectedDoc} close={()=>setSelectedDoc(null)}/>} {selectedPerson&&<PersonModal p={selectedPerson} close={()=>setSelectedPerson(null)}/>} {showIntro&&<AgencyIntro close={closeIntro}/>} 
  </main>;
};

const AgencyIntro:React.FC<{close:()=>void}>=({close})=><div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(12,10,8,.78)',display:'grid',placeItems:'center',padding:24}}><article style={{width:'min(760px,100%)',background:'#eee5d4',color:'#211d18',padding:'44px 48px',boxShadow:'0 28px 80px rgba(0,0,0,.45)',border:'1px solid #c9b99e'}}><div style={{fontSize:11,letterSpacing:3,fontWeight:700,opacity:.6}}>BLACKWOOD DETECTIVE AGENCY · DAY ONE</div><h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(30px,5vw,52px)',margin:'12px 0 22px',fontWeight:500}}>The door is finally open.</h2><p style={{fontFamily:'Georgia,serif',fontSize:18,lineHeight:1.7}}>You have spent years solving problems other people thought were too complicated to solve. People remember you for noticing what everyone else misses. Now, for the first time, the name on the door is yours.</p><p style={{fontFamily:'Georgia,serif',fontSize:18,lineHeight:1.7}}>Blackwood Detective Agency is new. There is no long client list, no reputation to protect and no department waiting to tell you where to look. There is only a desk, a telephone, your notes — and your judgment.</p><div style={{margin:'28px 0',padding:'20px 22px',borderLeft:'3px solid #786a55',background:'rgba(120,106,85,.08)'}}><strong>Arthur Vale</strong><br/><span style={{opacity:.75}}>Old friend. Field investigator. The one person you trust to go where you cannot.</span><p style={{margin:'12px 0 0',fontFamily:'Georgia,serif',fontStyle:'italic'}}>“You wanted an office. I found you a case. Try not to solve it before I get back.”</p></div><p style={{fontSize:14,lineHeight:1.6,opacity:.72}}>This is your first case. You remain in the office. When you need something from the outside world, you decide what Arthur should investigate. He will take time, return with what he actually found, and nothing more.</p><button onClick={close} style={{marginTop:16,border:0,padding:'13px 22px',background:'#2b2823',color:'#fff',cursor:'pointer',letterSpacing:1,fontWeight:700}}>OPEN THE CASE</button></article></div>;

const Home:React.FC<{pending:Request[];reports:FieldReport[];onAssign:()=>void;onReport:(r:FieldReport)=>void}>=({pending,reports,onAssign,onReport})=><div className="home-view"><div className="view-kicker">BLACKWOOD · PRIVATE OFFICE</div><h2>The desk is the scene.</h2><p className="lede">You do not leave the office. You read, compare, form theories and decide what is worth asking Arthur to check. The case never tells you what to do next.</p><div className="paper-stack"><article className="desk-paper letter-paper"><div className="paper-type">CLIENT LETTER · OCT 13</div><h3>Margaret Bell</h3><p>“Please look properly. Anna would not leave without her coat, handbag and glasses.”</p><button onClick={onAssign}>Open the field desk →</button></article><article className="desk-paper newspaper-paper"><div className="paper-type">THE EVENING REGISTER</div><h3>TEACHER REPORTED MISSING</h3><p>Police currently describe the disappearance as voluntary. Last confirmed sighting: 18:12.</p><span className="red-pencil">SOMETHING DOES NOT FIT</span></article><article className="desk-paper report-paper"><div className="paper-type">ARTHUR VALE</div><h3>{reports.length?`${reports.length} field report${reports.length>1?'s':''}`:'Arthur is standing by'}</h3><p>{pending.length?`${pending.length} assignment${pending.length>1?'s':''} currently in the field.`:'No one is currently in the field.'}</p>{reports[0]&&<button onClick={()=>onReport(reports[0])}>Read latest report →</button>}</article></div><div className="home-footer"><span>CASE 001</span><b>Read. Compare. Ask. Connect.</b><span>{pending.length?'ARTHUR IN THE FIELD':'ARTHUR AVAILABLE'}</span></div></div>;

const CaseFile:React.FC<{onOpen:(d:CaseDocument)=>void}>=({onOpen})=><div className="view"><div className="view-kicker">CASE FILE · CASE-001</div><h2>The Empty Room</h2><p className="lede">A woman vanished. The room tells a different story.</p><div className="case-grid"><div><label>CLIENT</label><strong>Margaret Bell</strong><p>Anna’s sister. She hired Blackwood after the police treated the disappearance as voluntary.</p></div><div><label>SUBJECT</label><strong>Anna Bell</strong><p>34 · Primary school teacher · Missing since October 12.</p></div><div><label>POLICE POSITION</label><strong>Voluntary absence</strong><p>The initial classification was made before several details were reconciled.</p></div><div><label>YOUR POSITION</label><strong>Unresolved</strong><p>No prescribed route. You decide what matters and what deserves another question.</p></div></div><button className="primary-paper-button" onClick={()=>{const d=doc('doc-client-letter');if(d)onOpen(d);}}>Read Margaret’s letter</button></div>;
const Documents:React.FC<{opened:string[];onOpen:(d:CaseDocument)=>void}>=({opened,onOpen})=><div className="view"><div className="view-kicker">DESK ARCHIVE</div><h2>Documents</h2><p className="lede">Everything currently in the case file. Reading a document does not mean it is important.</p><div className="document-list">{CASE_001.documents.map(d=><button key={d.id} className={`document-row ${opened.includes(d.id)?'read':''}`} onClick={()=>onOpen(d)}><span className="doc-type">{d.type.toUpperCase()}</span><span><b>{d.title}</b><small>{d.date} · {d.source}</small></span><em>{opened.includes(d.id)?'READ':'UNREAD'}</em></button>)}</div></div>;
const People:React.FC<{onOpen:(p:CasePerson)=>void}>=({onOpen})=><div className="view"><div className="view-kicker">CASE INDEX</div><h2>People</h2><p className="lede">Names are leads, not conclusions.</p><div className="people-grid">{CASE_001.people.map(p=><button key={p.id} className="person-card" onClick={()=>onOpen(p)}><span>{p.name.split(' ').map(n=>n[0]).join('')}</span><b>{p.name}</b><small>{p.role}</small></button>)}</div></div>;

interface RequestProps {requests:Request[];selected:Request|null;setSelected:(r:Request|null)=>void;onAssign:()=>void;location:string;setLocation:(v:string)=>void;focus:string;setFocus:(v:string)=>void;timeframe:string;setTimeframe:(v:string)=>void;instruction:string;setInstruction:(v:string)=>void;now:number}
const Requests:React.FC<RequestProps>=p=><div className="view"><div className="view-kicker">ARTHUR VALE · FIELD DESK</div><h2>Ask Arthur.</h2><p className="lede">You decide what deserves an outside investigation. Arthur reports observations, statements and records he actually obtained. He does not solve the case for you.</p><div className="request-layout"><div className="assignment-card"><div className="form-label">DESTINATION / SUBJECT</div><input value={p.location} onChange={e=>p.setLocation(e.target.value)} placeholder="e.g. 14 Harrow Lane"/><div className="form-label">FOCUS</div><input value={p.focus} onChange={e=>p.setFocus(e.target.value)} placeholder="e.g. door, clock, witnesses"/><div className="form-label">TIME WINDOW</div><input value={p.timeframe} onChange={e=>p.setTimeframe(e.target.value)} placeholder="e.g. October 12, 20:00–22:00"/><div className="form-label">WHAT DO YOU WANT TO KNOW?</div><textarea value={p.instruction} onChange={e=>p.setInstruction(e.target.value)} rows={7} placeholder="Ask one precise question. Arthur will investigate that question, not the whole case."/><button className="send-button" onClick={p.onAssign}>SEND ARTHUR INTO THE FIELD →</button><small style={{display:'block',marginTop:12,opacity:.6}}>Field work takes time. Arthur will return when the assignment is ready.</small></div><div className="request-history"><div className="form-label">ARTHUR’S ASSIGNMENTS</div>{p.requests.length===0&&<div className="empty-slip">No assignments yet. Start with something you cannot establish from the desk.</div>}{p.requests.map(r=>{const remaining=Math.max(0,r.readyAt-p.now);const mins=Math.floor(remaining/60000);const secs=Math.floor((remaining%60000)/1000);return <button key={r.id} className={`request-row ${p.selected?.id===r.id?'selected':''}`} onClick={()=>p.setSelected(r)}><span className={r.status==='complete'?'check':'spinner'}>{r.status==='complete'?'✓':'…'}</span><span><b>{r.location}</b><small>{r.focus||'General observation'} · {r.timeframe||'No time window specified'}</small></span><em>{r.status==='complete'?'REPORT READY':`${mins}:${String(secs).padStart(2,'0')}`}</em></button>})}{p.selected&&<div className="request-detail"><b>YOUR QUESTION</b><p>{p.selected.instruction}</p><small>{p.selected.status==='complete'?'Arthur returned what he found — nothing has been added beyond his assignment.':`Arthur is still working. ${Math.max(0,Math.ceil((p.selected.readyAt-p.now)/1000))} seconds remaining.`}</small></div>}</div></div></div>;

const Reports:React.FC<{reports:FieldReport[];selected:FieldReport|null;setSelected:(r:FieldReport|null)=>void}>=({reports,selected,setSelected})=><div className="view"><div className="view-kicker">ARTHUR VALE · FIELD INTELLIGENCE</div><h2>Reports</h2><p className="lede">These are field notes, not conclusions. Arthur tells you what he saw, what someone said, and what records he could obtain.</p>{reports.length===0?<div className="empty-report"><b>ARTHUR HAS NOT RETURNED YET.</b><span>Send an assignment from the field desk.</span></div>:<div className="report-list">{reports.map(r=><button key={r.id} className="report-row" onClick={()=>setSelected(r)}><span className="report-stamp">FIELD<br/>REPORT</span><span><b>{r.title}</b><small>{r.date} · {r.investigator}</small><p>{r.findings[0]}</p></span><em>OPEN →</em></button>)}</div>}{selected&&<div className="inline-report"><div className="report-head"><span>{selected.investigator}</span><b>{selected.location}</b></div><h3>{selected.title}</h3><ReportSection title="OBSERVATIONS" items={selected.findings}/><ReportSection title="STATEMENTS" items={selected.witness}/><ReportSection title="RECORDS CHECKED" items={selected.records}/><ReportSection title="LIMITATIONS" items={selected.limitations}/></div>}</div>;
const ReportSection:React.FC<{title:string;items:string[]}>=({title,items})=><section><h4>{title}</h4>{items.length?items.map((x,i)=><p key={i}>• {x}</p>):<p className="muted">Nothing matching this part of the assignment was found.</p>}</section>;
const Notebook:React.FC<{notes:string;setNotes:(v:string)=>void}>=({notes,setNotes})=><div className="view notebook-view"><div className="view-kicker">PRIVATE NOTES</div><h2>Notebook</h2><p className="lede">Your reasoning belongs here. The notebook never tells you whether your theory is correct.</p><textarea className="big-notebook" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="What do you think happened? What contradicts it? What should Arthur check next?"/><div className="notebook-hint">Saved automatically.</div></div>;
const DocumentModal:React.FC<{d:CaseDocument;close:()=>void}>=({d,close})=><div className="modal-backdrop" onClick={close}><article className="paper-modal" onClick={e=>e.stopPropagation()}><button className="close-paper" onClick={close}>×</button><div className="paper-type">{d.type.toUpperCase()} · {d.date}</div><h2>{d.title}</h2><div className="modal-source">{d.source}</div><div className="document-content">{d.content.split('\n').map((x,i)=><p key={i}>{x||'\u00a0'}</p>)}</div><div className="tag-row">{d.tags?.map(x=><span key={x}>{x}</span>)}</div></article></div>;
const PersonModal:React.FC<{p:CasePerson;close:()=>void}>=({p,close})=><div className="modal-backdrop" onClick={close}><article className="person-modal" onClick={e=>e.stopPropagation()}><button className="close-paper" onClick={close}>×</button><div className="initial-badge">{p.name.split(' ').map(n=>n[0]).join('')}</div><div className="paper-type">CASE PERSON</div><h2>{p.name}</h2><h3>{p.role}</h3><p>{p.note}</p></article></div>;
