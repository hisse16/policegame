import React, { useEffect, useMemo, useState } from 'react';
import { CASE_001, CaseDocument } from '../../data/case001';

const STORAGE_KEY = 'detective_agency_case_001_v1';

type Phase = 'opening' | 'office' | 'case' | 'document' | 'people' | 'notes';

type SaveState = {
  phase: Exclude<Phase, 'opening'>;
  openedDocuments: string[];
  notes: string;
  selectedDocumentId: string | null;
};

const initialSave: SaveState = {
  phase: 'office',
  openedDocuments: [],
  notes: '',
  selectedDocumentId: null,
};

function loadSave(): SaveState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialSave;
    return { ...initialSave, ...JSON.parse(raw) };
  } catch {
    return initialSave;
  }
}

const typeLabel: Record<CaseDocument['type'], string> = {
  letter: 'LETTER',
  newspaper: 'NEWSPAPER',
  report: 'REPORT',
  photograph: 'PHOTOGRAPH',
  note: 'HANDWRITTEN NOTE',
};

export const DetectiveGame: React.FC = () => {
  const [phase, setPhase] = useState<Phase>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ? loadSave().phase : 'opening';
    } catch {
      return 'opening';
    }
  });
  const [openedDocuments, setOpenedDocuments] = useState<string[]>(() => loadSave().openedDocuments);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(() => loadSave().selectedDocumentId);
  const [notes, setNotes] = useState(() => loadSave().notes);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (phase === 'opening') return;
    const save: SaveState = { phase: phase as Exclude<Phase, 'opening'>, openedDocuments, notes, selectedDocumentId };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(save)); } catch {}
  }, [phase, openedDocuments, notes, selectedDocumentId]);

  const selectedDocument = useMemo(
    () => CASE_001.documents.find((doc) => doc.id === selectedDocumentId) ?? null,
    [selectedDocumentId]
  );

  const openDocument = (doc: CaseDocument) => {
    setSelectedDocumentId(doc.id);
    setOpenedDocuments((current) => current.includes(doc.id) ? current : [...current, doc.id]);
    setPhase('document');
  };

  const beginCase = () => {
    setPhase('office');
    setShowIntro(true);
  };

  if (phase === 'opening') {
    return (
      <main className="detective-opening">
        <div className="opening-grain" />
        <div className="opening-content">
          <div className="agency-mark">PRIVATE INVESTIGATION</div>
          <h1>BLACKWOOD<br /><span>DETECTIVE AGENCY</span></h1>
          <p className="opening-rule">EST. 2026 · CASES WORTH LOOKING INTO</p>
          <div className="opening-copy">
            <p>The office has been open for twelve days.</p>
            <p>The sign outside is new. The carpet still smells like varnish.</p>
            <p>No one has called.</p>
            <p>Until this morning.</p>
          </div>
          <button className="ink-button" onClick={beginCase}>OPEN THE OFFICE</button>
        </div>
      </main>
    );
  }

  return (
    <main className="detective-shell">
      <div className="room-light" />
      <header className="agency-header">
        <div>
          <div className="header-kicker">BLACKWOOD DETECTIVE AGENCY</div>
          <div className="header-title">PRIVATE CASEBOOK</div>
        </div>
        <div className="header-status"><span className="status-dot" /> OFFICE OPEN</div>
      </header>

      {showIntro && (
        <div className="letter-overlay">
          <div className="arrival-letter">
            <div className="letter-top">DELIVERED BY HAND · OCTOBER 14, 2026</div>
            <h2>A FIRST CLIENT</h2>
            <p className="letter-lead">The envelope is still warm from the courier's hand.</p>
            <p>Your first case has no police referral attached to it. No insurance company. No legal firm. Just a name, an address, and a sister who believes something is wrong.</p>
            <blockquote>“Please don't tell me to wait another forty-eight hours. I have already waited too long.”</blockquote>
            <div className="letter-signature">— Margaret Bell</div>
            <button className="paper-button" onClick={() => setShowIntro(false)}>PUT THE LETTER ON THE DESK</button>
          </div>
        </div>
      )}

      <section className="office-grid">
        <div className="wall wall-left">
          <div className="agency-plaque">BLACKWOOD<br />PRIVATE INVESTIGATIONS</div>
          <div className="wall-clock">10:55</div>
          <div className="framed-note">“The obvious answer is<br />usually the first thing<br />someone wants you to believe.”</div>
        </div>

        <div className="desk-area">
          <div className="desk-backdrop" />
          <div className="desk-surface">
            <div className="desk-object lamp" />
            <button className="desk-object case-file" onClick={() => setPhase('case')} aria-label="Open Case 001">
              <span>CASE</span><strong>001</strong><small>THE EMPTY ROOM</small>
            </button>
            <button className="desk-object newspaper-stack" onClick={() => openDocument(CASE_001.documents[1])} aria-label="Read newspaper">
              <span>THE EVENING</span><strong>REGISTER</strong><small>OCT 14 · 2026</small>
            </button>
            <button className="desk-object notebook" onClick={() => setPhase('notes')} aria-label="Open notebook">
              <span>FIELD</span><strong>NOTES</strong><small>BLACKWOOD</small>
            </button>
            <button className="desk-object people-file" onClick={() => setPhase('people')} aria-label="Review people">
              <span>INDEX</span><strong>PEOPLE</strong><small>4 ENTRIES</small>
            </button>
            <div className="coffee-cup" />
            <div className="desk-nameplate">BLACKWOOD</div>
          </div>
        </div>

        <aside className="case-sidebar">
          <div className="sidebar-label">CURRENT FILE</div>
          <div className="sidebar-case">CASE 001</div>
          <h2>{CASE_001.title}</h2>
          <p>{CASE_001.subtitle}</p>
          <div className="sidebar-rule" />
          <div className="sidebar-meta"><span>CLIENT</span><b>{CASE_001.client}</b></div>
          <div className="sidebar-meta"><span>DOCUMENTS</span><b>{openedDocuments.length} / {CASE_001.documents.length} READ</b></div>
          <button className="sidebar-button" onClick={() => setPhase('case')}>OPEN CASE FILE →</button>
        </aside>
      </section>

      {phase === 'case' && (
        <div className="modal-stage">
          <div className="case-folder">
            <button className="close-button" onClick={() => setPhase('office')}>×</button>
            <div className="folder-tab">CASE 001</div>
            <div className="folder-content">
              <div className="folder-heading">
                <span>BLACKWOOD PRIVATE INVESTIGATIONS</span>
                <strong>THE EMPTY ROOM</strong>
                <small>OPEN CASE · OCTOBER 14, 2026</small>
              </div>
              <p className="case-premise">{CASE_001.premise}</p>
              <div className="document-grid">
                {CASE_001.documents.map((doc) => (
                  <button key={doc.id} className={`document-card ${openedDocuments.includes(doc.id) ? 'read' : ''}`} onClick={() => openDocument(doc)}>
                    <span>{typeLabel[doc.type]}</span>
                    <strong>{doc.title}</strong>
                    <small>{doc.date}</small>
                    {openedDocuments.includes(doc.id) && <em>READ</em>}
                  </button>
                ))}
              </div>
              <p className="case-hint">There is no list of things to find. Read what interests you. Compare what people say with what the paper says. Keep anything that doesn't sit right.</p>
            </div>
          </div>
        </div>
      )}

      {phase === 'document' && selectedDocument && (
        <div className="modal-stage paper-stage">
          <article className={`document-viewer ${selectedDocument.type}`}>
            <button className="close-button" onClick={() => setPhase('case')}>×</button>
            <div className="document-meta">{typeLabel[selectedDocument.type]} · {selectedDocument.source} · {selectedDocument.date}</div>
            <h1>{selectedDocument.title}</h1>
            <div className="document-rule" />
            <div className="document-body">
              {selectedDocument.content.split('\n').map((line, index) => <p key={index} className={line.length < 45 && line === line.toUpperCase() ? 'document-heading' : ''}>{line || '\u00a0'}</p>)}
            </div>
            {selectedDocument.tags && <div className="document-tags">{selectedDocument.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
            <div className="document-nav">
              <button onClick={() => setPhase('case')}>← CASE FILE</button>
              <button onClick={() => setPhase('notes')}>ADD TO NOTES →</button>
            </div>
          </article>
        </div>
      )}

      {phase === 'people' && (
        <div className="modal-stage">
          <section className="people-panel">
            <button className="close-button" onClick={() => setPhase('office')}>×</button>
            <div className="panel-kicker">CASE INDEX</div>
            <h1>PEOPLE</h1>
            <p>Names you have encountered so far. Nothing here tells you what to think.</p>
            <div className="people-list">{CASE_001.people.map((person) => <article key={person.id}><div className="person-number">{person.id.slice(0, 2).toUpperCase()}</div><div><h2>{person.name}</h2><span>{person.role}</span><p>{person.note}</p></div></article>)}</div>
          </section>
        </div>
      )}

      {phase === 'notes' && (
        <div className="modal-stage">
          <section className="notebook-panel">
            <button className="close-button" onClick={() => setPhase('office')}>×</button>
            <div className="notebook-label">PRIVATE NOTES · CASE 001</div>
            <h1>FIELD NOTES</h1>
            <p className="notebook-instruction">Write what you notice. Not what the game tells you.</p>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Something doesn't add up..." />
            <div className="notes-footer">AUTOSAVED · YOUR NOTES ARE YOURS</div>
          </section>
        </div>
      )}
    </main>
  );
};
