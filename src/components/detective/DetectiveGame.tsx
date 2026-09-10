import React, { useEffect, useMemo, useState } from 'react';
import { CASE_001, CaseDocument, CasePerson } from '../../data/case001';

const STORAGE_KEY = 'blackwood_office_case_v3';
const INTRO_KEY = 'blackwood_agency_intro_seen_v2';
const FIELD_DELAY_MS = 60_000;

type Tab = 'office' | 'case' | 'documents' | 'people' | 'requests' | 'reports' | 'notes';
type RequestStatus = 'pending' | 'complete';
type Request = { id:number; investigationId:string; location:string; title:string; question:string; status:RequestStatus; sentAt:number; readyAt:number; reportId?:number };
type FieldReport = { id:number; requestId:number; title:string; date:string; investigator:string; location:string; findings:string[]; witness:string[]; records:string[]; limitations:string[] };
type Save = { tab:Tab; opened:string[]; notes:string; requests:Request[]; reports:FieldReport[] };
const initial:Save = { tab:'office', opened:[], notes:'', requests:[], reports:[] };

const investigations = [
  {
    id:'home-scene', location:'14 Harrow Lane', title:'Re-examine Anna’s apartment', subtitle:'The place Anna left behind.',
    question:'Re-examine the apartment for physical details that may clarify what happened after Anna disappeared.',
    requires:[] as string[], category:'SCENE'
  },
  {
    id:'home-door', location:'14 Harrow Lane', title:'Examine the front door and entry', subtitle:'Look for signs of entry or departure.',
    question:'Examine the front door, frame and immediate entry area for signs of forced entry or an unusual departure.',
    requires:['home-scene'], category:'SCENE'
  },
  {
    id:'home-clock', location:'14 Harrow Lane', title:'Check the wall clock', subtitle:'The clock does not agree with the police timeline.',
    question:'Check the kitchen wall clock and determine what can be established about its displayed time.',
    requires:['home-scene'], category:'TIMELINE'
  },
  {
    id:'home-market', location:'14 Harrow Lane', title:'Check the Mercer Market transaction', subtitle:'A receipt places Anna’s card at 20:31.',
    question:'Verify the Mercer Market transaction connected to Anna’s debit card and its timing.',
    requires:['home-scene'], category:'TIMELINE'
  },
  {
    id:'street-car', location:'Harrow Lane', title:'Investigate the dark blue sedan', subtitle:'A vehicle was seen outside the building.',
    question:'Investigate the dark blue sedan reported near 14 Harrow Lane and determine what can be established about the vehicle.',
    requires:['car-clue'], category:'VEHICLE'
  },
  {
    id:'street-plate', location:'Harrow Lane', title:'Investigate the partial plate EW-19', subtitle:'A partial registration may be enough to follow a lead.',
    question:'Check the available street evidence for the partial registration EW-19 and establish what records can be connected to it.',
    requires:['plate-clue'], category:'VEHICLE'
  },
  {
    id:'school-archive', location:'St. Alden Primary', title:'Inspect the old school archive', subtitle:'Anna was asking about an old record.',
    question:'Inspect the 1998 school archive and determine what remains around the disputed attendance record.',
    requires:['archive-clue'], category:'ARCHIVE'
  },
  {
    id:'school-photo', location:'St. Alden Primary', title:'Investigate the old photograph', subtitle:'Why was it kept outside the normal file?',
    question:'Find out why the old photograph was kept separately and what can be established from its context.',
    requires:['photo-clue'], category:'ARCHIVE'
  },
  {
    id:'school-witness', location:'St. Alden Primary', title:'Speak with school staff', subtitle:'Anna mentioned an old-record problem before leaving.',
    question:'Speak with relevant school staff about Anna’s conversation and her interest in the old records.',
    requires:['school-clue'], category:'WITNESS'
  }
] as const;

const clean=(value:string)=>value.toLowerCase();

function loadSave():Save {
  try { const raw=localStorage.getItem(STORAGE_KEY); if(!raw)return initial; const parsed=JSON.parse(raw) as Partial<Save>; return {...initial,...parsed,requests:parsed.requests||[],reports:parsed.reports||[]}; }
  catch { return initial; }
}

function discoveredClues(opened:string[], reports:FieldReport[]) {
  const clues = new Set<string>();
  const text = opened.map(id=>CASE_001.documents.find(d=>d.id===id)?.content||'').join(' ').toLowerCase();
  const reportText = reports.map(r=>[...r.findings,...r.witness,...r.records].join(' ')).join(' ').toLowerCase();
  const all = `${text} ${reportText}`;
  if(opened.length > 0 || reports.some(r=>r.location==='14 Harrow Lane')) clues.add('home-scene');
  if(all.includes('blue sedan') || all.includes('dark blue sedan')) clues.add('car-clue');
  if(all.includes('ew-19') || all.includes('partial plate') || all.includes('partial registration')) clues.add('plate-clue');
  if(all.includes('1998') || all.includes('old archive') || all.includes('attendance archive')) clues.add('archive-clue');
  if(all.includes('photograph') || all.includes('old photograph')) clues.add('photo-clue');
  if(all.includes('school') && (all.includes('18:12') || all.includes('old record') || all.includes('archive'))) clues.add('school-clue');
  return clues;
}

function buildReport(request:Request):FieldReport {
  const inv=investigations.find(x=>x.id===request.investigationId)!;
  const reports:Record<string, Omit<FieldReport,'id'|'requestId'|'title'|'date'|'investigator'|'location'>> = {
    'home-scene': { findings:['The front door and frame were intact. I found no visible sign of forced entry.','The kitchen window was open roughly twelve centimetres. There was a dried rain line along the sill.','Anna Bell’s blue coat, handbag, keys and glasses case were still inside the flat.'], witness:[], records:[], limitations:['The scene alone does not establish who closed the door.'] },
    'home-door': { findings:['The front door and frame were intact. There was no visible damage consistent with forced entry.','The lock showed no obvious sign of being forced.'], witness:['Helen Ward said she heard the door of Flat 3B close at about 21:10. She did not see who was at the door.'], records:[], limitations:['I could not establish who operated the door.'] },
    'home-clock': { findings:['The kitchen wall clock was showing 20:59 when I checked the scene.','The clock is a physical wall clock; I found no reliable evidence at the scene establishing whether it was accurate at the relevant time.'], witness:[], records:[], limitations:['The displayed time should not be treated as proof of the actual time.'] },
    'home-market': { findings:['The folded Mercer Market receipt records a purchase at 20:31 on October 12.'], witness:[], records:['Mercer Market’s transaction record shows Anna Bell’s debit card used at 20:31.'], limitations:['The transaction establishes card use, not necessarily who physically made the purchase.'] },
    'street-car': { findings:['A dark blue sedan had been parked beside the entrance earlier that evening.','A fresh-looking tyre impression begins beside the building entrance and is consistent with a mid-size sedan.'], witness:['Helen Ward remembered the dark blue sedan outside the building. She could not identify its driver.'], records:[], limitations:['The vehicle’s presence does not establish who was driving it.'] },
    'street-plate': { findings:['A shop photograph across the road contains only a partial registration: EW-19.'], witness:['The shopkeeper’s photograph does not identify the driver.'], records:['The old school maintenance register lists Edward Ward with a blue sedan carrying the same partial registration, EW-19.'], limitations:['The registration is partial.'] },
    'school-archive': { findings:['The basement archive contains a damaged 1998 attendance ledger with a handwritten correction beside Edward Ward’s name.','The correction uses an unusual blue-ink mark. A photocopied page kept with Anna’s material carries a matching mark.'], witness:[], records:['The archive notes that Ward resigned after an internal dispute over missing attendance records.'], limitations:['Several pages of the 1998 archive are damaged or missing. The original reason for the correction is not recorded.'] },
    'school-photo': { findings:['A loose 1998 staff photograph was found inside the ledger rather than filed with the staff records.','The back of the photograph reads: “Do not file this under staff.”'], witness:['School administration could not explain why the old photograph had been kept outside the normal archive file.'], records:[], limitations:['The reason the photograph was kept separately remains unconfirmed.'] },
    'school-witness': { findings:['Staff records place Anna Bell at the school until 18:12. She had asked about the old archive at approximately 17:40.'], witness:['Daniel Hayes said he spoke with Anna at about 18:05. He remembered her being worried about an error in an old record.'], records:[], limitations:['Daniel could describe Anna’s concern but could not explain the underlying record error.'] }
  };
  const data=reports[request.investigationId] || reports['home-scene'];
  return {id:Date.now(),requestId:request.id,title:`FIELD REPORT — ${inv.location.toUpperCase()}`,date:'October 17, 2026 · 16:40',investigator:'Arthur Vale · Field Investigator',location:inv.location,...data};
}

export const DetectiveGame:React.FC=()=>{
  const saved=useMemo(loadSave,[]);
  const [tab,setTab]=useState<Tab>(saved.tab||'office');
  const [opened,setOpened]=useState<string[]>(saved.opened||[]);
  const [notes,setNotes]=useState(saved.notes||'');
  const [requests,setRequests]=useState<Request[]>(saved.requests||[]);
  const [reports,setReports]=useState<FieldReport[]>(saved.reports||[]);
  const [selectedDoc,setSelectedDoc]=useState<CaseDocument|null>(null);
  const [selectedPerson,setSelectedPerson]=useState<CasePerson|null>(null);
  const [selectedReport,setSelectedReport]=useState<FieldReport|null>(null);
  const [selectedRequest,setSelectedRequest]=useState<Request|null>(null);
  const [selectedInvestigation,setSelectedInvestigation]=useState<string|null>(null);
  const [notice,setNotice]=useState('');
  const [now,setNow]=useState(Date.now());
  const [showIntro,setShowIntro]=useState(()=>localStorage.getItem(INTRO_KEY)!=='1');

  useEffect(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify({tab,opened,notes,requests,reports}));},[tab,opened,notes,requests,reports]);
  useEffect(()=>{const t=window.setInterval(()=>setNow(Date.now()),1000);return()=>window.clearInterval(t);},[]);
  useEffect(()=>{
    const ready=requests.filter(r=>r.status==='pending'&&r.readyAt<=Date.now());
    ready.forEach(r=>{
      if(reports.some(x=>x.requestId===r.id)) return;
      const report=buildReport(r);
      setReports(v=>v.some(x=>x.requestId===r.id)?v:[report,...v]);
      setRequests(v=>v.map(x=>x.id===r.id?{...x,status:'complete',reportId:report.id}:x));
      setSelectedReport(report); setNotice('ARTHUR VALE — REPORT RECEIVED');
    });
  },[now,requests,reports]);

  const clues=discoveredClues(opened,reports);
  const completed=new Set(requests.filter(r=>r.status==='complete').map(r=>r.investigationId));
  const available=investigations.filter(i=>i.requires.every(r=>clues.has(r)) && !completed.has(i.id));
  const pending=requests.filter(r=>r.status==='pending');

  const openDocument=(d:CaseDocument)=>{setSelectedDoc(d);setOpened(v=>v.includes(d.id)?v:[...v,d.id]);};
  const sendInvestigation=()=>{
    if(!selectedInvestigation) return;
    if(pending.length>=2){setNotice('ARTHUR IS ALREADY HANDLING TWO ASSIGNMENTS');return;}
    const inv=investigations.find(x=>x.id===selectedInvestigation)!;
    const sentAt=Date.now();
    const request:Request={id:sentAt,investigationId:inv.id,location:inv.location,title:inv.title,question:inv.question,status:'pending',sentAt,readyAt:sentAt+FIELD_DELAY_MS};
    setRequests(v=>[request,...v]); setSelectedRequest(request); setSelectedInvestigation(null); setTab('requests'); setNotice('ARTHUR VALE HAS LEFT FOR THE FIELD');
  };
  const closeIntro=()=>{localStorage.setItem(INTRO_KEY,'1');setShowIntro(false);};

  return <main className="blackwood-office"><div className="office-backdrop" aria-hidden="true"/><div className="office-vignette" aria-hidden="true"/>
    <header className="office-topbar"><div className="agency-mark"><span>BLACKWOOD</span><small>DETECTIVE AGENCY · PRIVATE INVESTIGATIONS</small></div><div className="case-strip"><i/> CASE 001 <b>THE EMPTY ROOM</b></div><div className="clock-strip">MON · OCT 17, 2026&nbsp;&nbsp; 16:47</div></header>
    <section className="office-workspace"><aside className="office-left"><div className="folder-label">ACTIVE CASE</div><h1>Anna Bell</h1><p className="muted">Missing person · 34 · Teacher</p><div className="paper-rule"/>
      {([['office','Desk','01'],['case','Case file','02'],['documents','Documents',String(opened.length)],['people','People',String(CASE_001.people.length)],['requests','Field requests',String(pending.length||'—')],['reports','Field reports',String(reports.length||'—')],['notes','Notebook','∞']] as [Tab,string,string][]).map(([id,label,count])=><button key={id} className={`desk-nav ${tab===id?'active':''}`} onClick={()=>setTab(id)}>{label}<span>{count}</span></button>)}
      <div className="left-bottom"><div className="folder-label">OFFICE</div><div>BLACKWOOD · ROOM 3</div><div className="muted">You stay here. Arthur travels.</div></div></aside>
      <section className="office-content">{notice&&<button className="notice" onClick={()=>setNotice('')}>{notice} ×</button>}
        {tab==='office'&&<Home pending={pending} reports={reports} onAssign={()=>setTab('requests')} onReport={r=>{setSelectedReport(r);setTab('reports');}}/>}
        {tab==='case'&&<CaseFile onOpen={openDocument}/>} {tab==='documents'&&<Documents opened={opened} onOpen={openDocument}/>} {tab==='people'&&<People onOpen={setSelectedPerson}/>} 
        {tab==='requests'&&<Requests available={available} clues={clues} requests={requests} selected={selectedRequest} setSelected={setSelectedRequest} selectedInvestigation={selectedInvestigation} setSelectedInvestigation={setSelectedInvestigation} onAssign={sendInvestigation} now={now}/>} 
        {tab==='reports'&&<Reports reports={reports} selected={selectedReport} setSelected={setSelectedReport}/>} {tab==='notes'&&<Notebook notes={notes} setNotes={setNotes}/>}</section>
    </section>
    {selectedDoc&&<DocumentModal d={selectedDoc} close={()=>setSelectedDoc(null)}/>} {selectedPerson&&<PersonModal p={selectedPerson} close={()=>setSelectedPerson(null)}/>} {showIntro&&<AgencyIntro close={closeIntro}/>} 
  </main>;
};

const AgencyIntro:React.FC<{close:()=>void}>=({close})=><div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(12,10,8,.78)',display:'grid',placeItems:'center',padding:24}}><article style={{width:'min(760px,100%)',background:'#eee5d4',color:'#211d18',padding:'44px 48px',boxShadow:'0 28px 80px rgba(0,0,0,.45)',border:'1px solid #c9b99e'}}><div style={{fontSize:11,letterSpacing:3,fontWeight:700,opacity:.6}}>BLACKWOOD DETECTIVE AGENCY · DAY ONE</div><h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(30px,5vw,52px)',margin:'12px 0 22px',fontWeight:500}}>The door is finally open.</h2><p style={{fontFamily:'Georgia,serif',fontSize:18,lineHeight:1.7}}>You have spent years solving problems other people thought were too complicated to solve. People remember you for noticing what everyone else misses. Now, for the first time, the name on the door is yours.</p><p style={{fontFamily:'Georgia,serif',fontSize:18,lineHeight:1.7}}>Blackwood Detective Agency is new. There is no long client list, no reputation to protect and no department waiting to tell you where to look. There is only a desk, a telephone, your notes — and your judgment.</p><div style={{margin:'28px 0',padding:'20px 22px',borderLeft:'3px solid #786a55',background:'rgba(120,106,85,.08)'}}><strong>Arthur Vale</strong><br/><span style={{opacity:.75}}>Old friend. Field investigator. The one person you trust to go where you cannot.</span><p style={{margin:'12px 0 0',fontFamily:'Georgia,serif',fontStyle:'italic'}}>“You wanted an office. I found you a case. Try not to solve it before I get back.”</p></div><p style={{fontSize:14,lineHeight:1.6,opacity:.72}}>This is your first case. You remain in the office. When you need something from the outside world, you choose an investigation Arthur can actually perform. New leads become available only when you discover them.</p><button onClick={close} style={{marginTop:16,border:0,padding:'13px 22px',background:'#2b2823',color:'#fff',cursor:'pointer',letterSpacing:1,fontWeight:700}}>OPEN THE CASE</button></article></div>;

const Home:React.FC<{pending:Request[];reports:FieldReport[];onAssign:()=>void;onReport:(r:FieldReport)=>void}>=({pending,reports,onAssign,onReport})=><div className="home-view"><div className="view-kicker">BLACKWOOD · PRIVATE OFFICE</div><h2>The desk is the scene.</h2><p className="lede">You do not leave the office. You read, compare, form theories and decide what is worth asking Arthur to check. The case never gives you a task list.</p><div className="paper-stack"><article className="desk-paper letter-paper"><div className="paper-type">CLIENT LETTER · OCT 13</div><h3>Margaret Bell</h3><p>“Please look properly. Anna would not leave without her coat, handbag and glasses.”</p><button onClick={onAssign}>Open Arthur’s field desk →</button></article><article className="desk-paper newspaper-paper"><div className="paper-type">THE EVENING REGISTER</div><h3>TEACHER REPORTED MISSING</h3><p>Police currently describe the disappearance as voluntary. Last confirmed sighting: 18:12.</p><span className="red-pencil">SOMETHING DOES NOT FIT</span></article><article className="desk-paper report-paper"><div className="paper-type">ARTHUR VALE</div><h3>{reports.length?`${reports.length} field report${reports.length>1?'s':''}`:'Arthur is standing by'}</h3><p>{pending.length?`${pending.length} assignment${pending.length>1?'s':''} currently in the field.`:'No one is currently in the field.'}</p>{reports[0]&&<button onClick={()=>onReport(reports[0])}>Read latest report →</button>}</article></div><div className="home-footer"><span>CASE 001</span><b>Read. Compare. Ask. Connect.</b><span>{pending.length?'ARTHUR IN THE FIELD':'ARTHUR AVAILABLE'}</span></div></div>;

const CaseFile:React.FC<{onOpen:(d:CaseDocument)=>void}>=({onOpen})=><div className="view"><div className="view-kicker">CASE FILE · CASE-001</div><h2>The Empty Room</h2><p className="lede">A woman vanished. The room tells a different story.</p><div className="case-grid"><div><label>CLIENT</label><strong>Margaret Bell</strong><p>Anna’s sister. She hired Blackwood after the police treated the disappearance as voluntary.</p></div><div><label>SUBJECT</label><strong>Anna Bell</strong><p>34 · Primary school teacher · Missing since October 12.</p></div><div><label>POLICE POSITION</label><strong>Voluntary absence</strong><p>The initial classification was made before several details were reconciled.</p></div><div><label>YOUR POSITION</label><strong>Unresolved</strong><p>No prescribed route. You decide what matters and what deserves another question.</p></div></div><button className="primary-paper-button" onClick={()=>{const d=CASE_001.documents.find(x=>x.id==='doc-client-letter');if(d)onOpen(d);}}>Read Margaret’s letter</button></div>;
const Documents:React.FC<{opened:string[];onOpen:(d:CaseDocument)=>void}>=({opened,onOpen})=><div className="view"><div className="view-kicker">DESK ARCHIVE</div><h2>Documents</h2><p className="lede">Everything currently in the case file. Reading a document does not mean it is important.</p><div className="document-list">{CASE_001.documents.map(d=><button key={d.id} className={`document-row ${opened.includes(d.id)?'read':''}`} onClick={()=>onOpen(d)}><span className="doc-type">{d.type.toUpperCase()}</span><span><b>{d.title}</b><small>{d.date} · {d.source}</small></span><em>{opened.includes(d.id)?'READ':'UNREAD'}</em></button>)}</div></div>;
const People:React.FC<{onOpen:(p:CasePerson)=>void}>=({onOpen})=><div className="view"><div className="view-kicker">CASE INDEX</div><h2>People</h2><p className="lede">Names are leads, not conclusions.</p><div className="people-grid">{CASE_001.people.map(p=><button key={p.id} className="person-card" onClick={()=>onOpen(p)}><span>{p.name.split(' ').map(n=>n[0]).join('')}</span><b>{p.name}</b><small>{p.role}</small></button>)}</div></div>;

interface RequestProps {available:typeof investigations;clues:Set<string>;requests:Request[];selected:Request|null;setSelected:(r:Request|null)=>void;selectedInvestigation:string|null;setSelectedInvestigation:(id:string|null)=>void;onAssign:()=>void;now:number}
const Requests:React.FC<RequestProps>=p=><div className="view"><div className="view-kicker">ARTHUR VALE · FIELD DESK</div><h2>Ask Arthur.</h2><p className="lede">Arthur does not receive free-form orders. You choose from investigations you have actually uncovered. New possibilities appear as the case gives you new leads.</p><div className="request-layout"><div className="assignment-card"><div className="form-label">AVAILABLE INVESTIGATIONS</div>{p.available.length===0?<div className="empty-slip">Nothing new is available yet. Read the case, look for a detail you can follow, and return here when you have something worth sending Arthur after.</div>:<div className="investigation-options">{p.available.map(i=><button key={i.id} className={`investigation-option ${p.selectedInvestigation===i.id?'selected':''}`} onClick={()=>p.setSelectedInvestigation(i.id)}><span className="investigation-category">{i.category}</span><b>{i.title}</b><small>{i.location} · {i.subtitle}</small></button>)}</div>}{p.selectedInvestigation&&<div className="selected-assignment"><div className="form-label">ARTHUR WILL INVESTIGATE</div><b>{investigations.find(x=>x.id===p.selectedInvestigation)?.title}</b><p>{investigations.find(x=>x.id===p.selectedInvestigation)?.question}</p><button className="send-button" onClick={p.onAssign}>SEND ARTHUR INTO THE FIELD →</button><small style={{display:'block',marginTop:12,opacity:.6}}>Arthur will take one minute. He will return only what this investigation actually establishes.</small></div>}</div><div className="request-history"><div className="form-label">ARTHUR’S ASSIGNMENTS</div>{p.requests.length===0&&<div className="empty-slip">No assignments yet.</div>}{p.requests.map(r=>{const remaining=Math.max(0,r.readyAt-p.now);const mins=Math.floor(remaining/60000);const secs=Math.floor((remaining%60000)/1000);return <button key={r.id} className={`request-row ${p.selected?.id===r.id?'selected':''}`} onClick={()=>p.setSelected(r)}><span className={r.status==='complete'?'check':'spinner'}>{r.status==='complete'?'✓':'…'}</span><span><b>{r.title}</b><small>{r.location}</small></span><em>{r.status==='complete'?'REPORT READY':`${mins}:${String(secs).padStart(2,'0')}`}</em></button>})}{p.selected&&<div className="request-detail"><b>YOUR ASSIGNMENT</b><p>{p.selected.question}</p><small>{p.selected.status==='complete'?'Arthur returned what he found.':`Arthur is still working. ${Math.max(0,Math.ceil((p.selected.readyAt-p.now)/1000))} seconds remaining.`}</small></div>}</div></div></div>;

const Reports:React.FC<{reports:FieldReport[];selected:FieldReport|null;setSelected:(r:FieldReport|null)=>void}>=({reports,selected,setSelected})=><div className="view"><div className="view-kicker">ARTHUR VALE · FIELD INTELLIGENCE</div><h2>Reports</h2><p className="lede">These are field notes, not conclusions. Arthur tells you what he found, not what you should think about it.</p>{reports.length===0?<div className="empty-report"><b>ARTHUR HAS NOT RETURNED YET.</b><span>Send an investigation from the field desk.</span></div>:<div className="report-list">{reports.map(r=><button key={r.id} className="report-row" onClick={()=>setSelected(r)}><span className="report-stamp">FIELD<br/>REPORT</span><span><b>{r.title}</b><small>{r.date} · {r.investigator}</small><p>{r.findings[0]}</p></span><em>OPEN →</em></button>)}</div>}{selected&&<div className="inline-report"><div className="report-head"><span>{selected.investigator}</span><b>{selected.location}</b></div><h3>{selected.title}</h3><ReportSection title="OBSERVATIONS" items={selected.findings}/><ReportSection title="STATEMENTS" items={selected.witness}/><ReportSection title="RECORDS CHECKED" items={selected.records}/><ReportSection title="LIMITATIONS" items={selected.limitations}/></div>}</div>;
const ReportSection:React.FC<{title:string;items:string[]}>=({title,items})=><section><h4>{title}</h4>{items.length?items.map((x,i)=><p key={i}>• {x}</p>):<p className="muted">Nothing matching this investigation was found.</p>}</section>;
const Notebook:React.FC<{notes:string;setNotes:(v:string)=>void}>=({notes,setNotes})=><div className="view notebook-view"><div className="view-kicker">PRIVATE NOTES</div><h2>Notebook</h2><p className="lede">Your reasoning belongs here. The notebook never tells you whether your theory is correct.</p><textarea className="big-notebook" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="What do you think happened? What contradicts it? What should Arthur check next?"/><div className="notebook-hint">Saved automatically.</div></div>;
const DocumentModal:React.FC<{d:CaseDocument;close:()=>void}>=({d,close})=><div className="modal-backdrop" onClick={close}><article className="paper-modal" onClick={e=>e.stopPropagation()}><button className="close-paper" onClick={close}>×</button><div className="paper-type">{d.type.toUpperCase()} · {d.date}</div><h2>{d.title}</h2><div className="modal-source">{d.source}</div><div className="document-content">{d.content.split('\n').map((x,i)=><p key={i}>{x||'\u00a0'}</p>)}</div><div className="tag-row">{d.tags?.map(x=><span key={x}>{x}</span>)}</div></article></div>;
const PersonModal:React.FC<{p:CasePerson;close:()=>void}>=({p,close})=><div className="modal-backdrop" onClick={close}><article className="person-modal" onClick={e=>e.stopPropagation()}><button className="close-paper" onClick={close}>×</button><div className="initial-badge">{p.name.split(' ').map(n=>n[0]).join('')}</div><div className="paper-type">CASE PERSON</div><h2>{p.name}</h2><h3>{p.role}</h3><p>{p.note}</p></article></div>;
