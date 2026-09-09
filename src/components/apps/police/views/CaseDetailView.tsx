import React, { useState } from 'react';
import { Icon } from '../../../common/Icon';
import { CaseRecord, AnyRecord } from '../../../../types/police';
import { policeDatabase } from '../../../../services/police/databaseEngine';
import { useOS } from '../../../../context/OSContext';

interface CaseDetailViewProps {
  caseRecord: CaseRecord;
  onSelectRecord: (id: string) => void;
  onExportRecord: (record: AnyRecord) => void;
  onBack: () => void;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({
  caseRecord,
  onSelectRecord,
  onExportRecord,
  onBack
}) => {
  const { openApp } = useOS();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'persons' | 'evidence' | 'reports' | 'timeline' | 'history' | 'notes'
  >('overview');

  const [newNote, setNewNote] = useState('');
  const isBookmarked = policeDatabase.isBookmarked(caseRecord.id);
  const notes = policeDatabase.getNotesForRecord(caseRecord.id);
  const relationships = policeDatabase.getRelationshipsForRecord(caseRecord.id);

  // Fetch linked entities
  const victims = caseRecord.victimIds.map((id) => policeDatabase.getRecord(id)).filter(Boolean);
  const suspects = caseRecord.suspectIds.map((id) => policeDatabase.getRecord(id)).filter(Boolean);
  const witnesses = caseRecord.witnessIds.map((id) => policeDatabase.getRecord(id)).filter(Boolean);
  const evidenceItems = caseRecord.evidenceIds.map((id) => policeDatabase.getRecord(id)).filter(Boolean);
  const vehicles = caseRecord.vehicleIds.map((id) => policeDatabase.getRecord(id)).filter(Boolean);
  const reports = caseRecord.reportIds.map((id) => policeDatabase.getRecord(id)).filter(Boolean);
  const leadInvestigator = policeDatabase.getRecord(caseRecord.leadInvestigatorId);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    policeDatabase.addNote(caseRecord.id, 'Det. S. Miller (#4081)', newNote.trim());
    setNewNote('');
  };

  return (
    <div className="flex-1 h-full flex flex-col select-none bg-slate-900/60 overflow-hidden font-mono">
      {/* 1. Header with Breadcrumb, Actions, and Case Identity */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
            >
              <Icon name="ArrowLeft" className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span>/</span>
            <span>CASES</span>
            <span>/</span>
            <span className="text-slate-200 font-bold">{caseRecord.caseNumber}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => openApp('investigation-board', { focusRecordId: caseRecord.id })}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-blue-950/80 border border-blue-700 text-blue-300 hover:bg-blue-900 transition-colors font-bold"
              title="Pin Case to Investigation Board"
            >
              <Icon name="GitMerge" className="w-3.5 h-3.5 text-blue-400" />
              <span>BOARD</span>
            </button>

            <button
              onClick={() => openApp('investigation-map', { caseId: caseRecord.id, search: caseRecord.location })}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-indigo-950/80 border border-indigo-700 text-indigo-300 hover:bg-indigo-900 transition-colors font-bold"
              title="Locate incident scene on GIS Map"
            >
              <Icon name="MapPin" className="w-3.5 h-3.5 text-indigo-400" />
              <span>GIS MAP</span>
            </button>

            <button
              onClick={() => openApp('police-mail', { search: caseRecord.caseNumber })}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-amber-950/70 border border-amber-800 text-amber-300 hover:bg-amber-900 transition-colors"
              title="Find related department emails and dispatch memos"
            >
              <Icon name="Mail" className="w-3.5 h-3.5 text-amber-400" />
              <span>MEMOS</span>
            </button>

            <button
              onClick={() => openApp('evidence-lab', { caseId: caseRecord.id })}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-emerald-950/80 border border-emerald-700 text-emerald-300 hover:bg-emerald-900 transition-colors font-bold"
              title="Open Evidence Lab for this case"
            >
              <Icon name="Microscope" className="w-3.5 h-3.5 text-emerald-400" />
              <span>LAB</span>
            </button>

            <button
              onClick={() => policeDatabase.toggleBookmark(caseRecord.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-colors ${
                isBookmarked
                  ? 'bg-amber-950/60 border-amber-700 text-amber-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon name="Bookmark" className="w-3.5 h-3.5" />
              <span>{isBookmarked ? 'BOOKMARKED' : 'BOOKMARK'}</span>
            </button>

            <button
              onClick={() => onExportRecord(caseRecord)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            >
              <Icon name="Download" className="w-3.5 h-3.5" />
              <span>EXPORT DOCKET</span>
            </button>
          </div>
        </div>

        {/* Case Title Banner */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-lg font-bold text-slate-100 font-mono tracking-wide">
                {caseRecord.caseNumber}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-bold border ${
                  caseRecord.status === 'REOPENED'
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : caseRecord.status === 'OPEN' || caseRecord.status === 'ACTIVE'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {caseRecord.status}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-bold border ${
                  caseRecord.priority === 'CRITICAL'
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                PRIORITY: {caseRecord.priority}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/80 text-blue-300 font-semibold">
                {caseRecord.classification.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-sm font-semibold text-slate-300 mt-1">
              {caseRecord.title}
            </h1>
          </div>

          {/* Key Metadata Table in Header */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded border border-slate-800/80">
            <div>
              <span className="text-slate-500">LEAD: </span>
              <button
                onClick={() => leadInvestigator && onSelectRecord(leadInvestigator.id)}
                className="text-blue-400 hover:underline font-semibold"
              >
                {leadInvestigator ? leadInvestigator.title : caseRecord.leadInvestigatorId}
              </button>
            </div>
            <div>
              <span className="text-slate-500">DEPT: </span>
              <span className="text-slate-200">{caseRecord.department}</span>
            </div>
            <div>
              <span className="text-slate-500">OPENED: </span>
              <span className="text-slate-200">{caseRecord.dateOpened}</span>
            </div>
            <div>
              <span className="text-slate-500">LOCATION: </span>
              <span className="text-slate-200">{caseRecord.location}</span>
            </div>
          </div>
        </div>

        {/* Reopened Banner Notice */}
        {caseRecord.status === 'REOPENED' && (
          <div className="mt-3 p-2 px-3 rounded bg-amber-950/40 border border-amber-800/70 text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="AlertTriangle" className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>COLD CASE REVIEW MANDATE:</strong> This historic docket was reopened pursuant to Directive CCU-2026-09. All sealed physical evidence and forensic manifests are available for re-examination.
              </span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mt-4 border-b border-slate-800 -mb-4">
          {[
            { id: 'overview' as const, label: 'OVERVIEW & SUMMARY', icon: 'FileText' },
            { id: 'persons' as const, label: `PERSONS (${victims.length + suspects.length + witnesses.length})`, icon: 'Users' },
            { id: 'evidence' as const, label: `EVIDENCE & VEHICLES (${evidenceItems.length + vehicles.length})`, icon: 'Box' },
            { id: 'reports' as const, label: `REPORTS (${reports.length})`, icon: 'FolderArchive' },
            { id: 'timeline' as const, label: `TIMELINE (${caseRecord.timeline?.length || 0})`, icon: 'Clock' },
            { id: 'history' as const, label: `VERSIONS (${caseRecord.history?.length || 1})`, icon: 'History' },
            { id: 'notes' as const, label: `NOTES (${notes.length})`, icon: 'Edit3' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-300 bg-slate-900/80'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Icon name={tab.icon} className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-900/40">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-5xl">
            {/* Investigative Summary */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-5">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Icon name="AlignLeft" className="w-4 h-4 text-blue-400" />
                <span>Case Investigative Summary</span>
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-900/60 p-4 rounded border border-slate-800">
                {caseRecord.summary}
              </p>
            </div>

            {/* Quick Entity Cross-Reference Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Victims */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Icon name="UserMinus" className="w-3.5 h-3.5 text-amber-400" />
                  <span>Victims / Subjects</span>
                </h4>
                {victims.length === 0 ? (
                  <div className="text-xs text-slate-400">None logged.</div>
                ) : (
                  <div className="space-y-2">
                    {victims.map((v: any) => (
                      <div
                        key={v.id}
                        onClick={() => onSelectRecord(v.id)}
                        className="p-2 rounded bg-slate-900 hover:bg-slate-800 cursor-pointer border border-slate-800/80 transition-colors"
                      >
                        <div className="text-xs font-bold text-slate-200 hover:text-blue-300">
                          {v.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          ID: {v.id} • Status: {v.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Suspects */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Icon name="UserCheck" className="w-3.5 h-3.5 text-rose-400" />
                  <span>Named Suspects</span>
                </h4>
                {suspects.length === 0 ? (
                  <div className="text-xs text-slate-400">No suspects currently named in open docket.</div>
                ) : (
                  <div className="space-y-2">
                    {suspects.map((s: any) => (
                      <div
                        key={s.id}
                        onClick={() => onSelectRecord(s.id)}
                        className="p-2 rounded bg-slate-900 hover:bg-slate-800 cursor-pointer border border-slate-800/80 transition-colors"
                      >
                        <div className="text-xs font-bold text-slate-200 hover:text-blue-300">
                          {s.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          ID: {s.id} • Risk: {s.riskLevel}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Key Evidence */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Icon name="Box" className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Secured Evidence</span>
                </h4>
                {evidenceItems.length === 0 ? (
                  <div className="text-xs text-slate-400">No evidence items attached.</div>
                ) : (
                  <div className="space-y-2">
                    {evidenceItems.slice(0, 4).map((e: any) => (
                      <div
                        key={e.id}
                        onClick={() => onSelectRecord(e.id)}
                        className="p-2 rounded bg-slate-900 hover:bg-slate-800 cursor-pointer border border-slate-800/80 transition-colors"
                      >
                        <div className="text-xs font-bold text-slate-200 hover:text-blue-300 truncate">
                          {e.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {e.evidenceType} • {e.storageLocation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Case Relationships Diagram / Links */}
            {relationships.length > 0 && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Icon name="GitBranch" className="w-4 h-4 text-emerald-400" />
                  <span>Relational Cross-Links ({relationships.length})</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {relationships.map((rel) => {
                    const targetId = rel.sourceId === caseRecord.id ? rel.targetId : rel.sourceId;
                    const targetRec = policeDatabase.getRecord(targetId);
                    return (
                      <div
                        key={rel.id}
                        onClick={() => targetRec && onSelectRecord(targetRec.id)}
                        className="p-2.5 rounded bg-slate-900 hover:bg-slate-850 border border-slate-850 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-blue-400 hover:underline">
                            {targetRec ? targetRec.title : targetId}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {rel.description || rel.type}
                          </div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-bold">
                          {rel.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Persons */}
        {activeTab === 'persons' && (
          <div className="space-y-4 max-w-5xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Persons Linked to Investigation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...victims, ...suspects, ...witnesses].map((p: any) => (
                <div
                  key={p.id}
                  onClick={() => onSelectRecord(p.id)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-blue-500/50 cursor-pointer transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-100 hover:text-blue-400">
                        {p.firstName} {p.lastName}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        ID: {p.id} • DOB: {p.dob}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        p.isMissing
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : p.riskLevel === 'HIGH'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-slate-400 space-y-1">
                    <div>Address: {p.addresses?.[0] || 'Unknown'}</div>
                    <div>Phone: {p.phones?.[0] || 'Unknown'}</div>
                    <div>Occupation: {p.occupation || 'N/A'}</div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-blue-400 font-semibold">
                    <span>View Full Personnel Dossier</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Evidence & Vehicles */}
        {activeTab === 'evidence' && (
          <div className="space-y-6 max-w-5xl">
            {/* Physical Evidence Items */}
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Secured Physical & Digital Evidence ({evidenceItems.length})
              </h3>
              <div className="space-y-3">
                {evidenceItems.map((e: any) => (
                  <div
                    key={e.id}
                    onClick={() => onSelectRecord(e.id)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-blue-500/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-blue-400 hover:underline">
                        {e.title}
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {e.storageLocation}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2">{e.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400">
                      <span>Type: {e.evidenceType}</span>
                      <span>Collected: {e.collectionDate}</span>
                      <span>Location: {e.collectionLocation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicles */}
            {vehicles.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Linked Vehicles ({vehicles.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vehicles.map((v: any) => (
                    <div
                      key={v.id}
                      onClick={() => onSelectRecord(v.id)}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-blue-500/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-100">
                          {v.year} {v.make} {v.model}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                          {v.licensePlate}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-2 space-y-0.5">
                        <div>VIN: {v.vin}</div>
                        <div>Color: {v.color}</div>
                        <div>Status: {v.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4 max-w-5xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Investigative Reports & Field Memos ({reports.length})
            </h3>
            <div className="space-y-3">
              {reports.map((r: any) => (
                <div
                  key={r.id}
                  onClick={() => onSelectRecord(r.id)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-blue-500/50 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-blue-400 hover:underline">
                      {r.title}
                    </div>
                    <span className="text-[10px] text-slate-400">{r.date}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Filed by {r.authorRank} {r.authorName} ({r.authorOfficerId})
                  </div>
                  <div className="text-xs text-slate-300 mt-2 line-clamp-2 bg-slate-900/60 p-2 rounded">
                    {r.narrative}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-4 max-w-4xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              Chronological Case Event Timeline
            </h3>
            <div className="relative border-l-2 border-slate-800 ml-3 space-y-6">
              {(caseRecord.timeline || []).map((t, idx) => (
                <div key={t.id || idx} className="relative pl-6">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-500" />
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{t.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-blue-400 border border-slate-800">
                        {t.date} {t.time || ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{t.description}</p>
                    {t.linkedRecordId && (
                      <button
                        onClick={() => onSelectRecord(t.linkedRecordId!)}
                        className="mt-2 text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Icon name="Link" className="w-3 h-3" />
                        <span>View Linked Record ({t.linkedRecordId})</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Version History */}
        {activeTab === 'history' && (
          <div className="space-y-4 max-w-4xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Case Docket Version Audit Trail
            </h3>
            <div className="bg-slate-950 border border-slate-800 rounded-lg divide-y divide-slate-800/80">
              {(caseRecord.history || [
                { version: 1, date: caseRecord.createdAt, modifiedBy: 'System Archival Engine', changeSummary: 'Initial electronic case docket generated.' }
              ]).map((v) => (
                <div key={v.version} className="p-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-400">
                        VERSION {v.version}.0
                      </span>
                      <span className="text-xs text-slate-300 font-semibold">
                        Modified by {v.modifiedBy}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{v.changeSummary}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{v.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Add Official Investigative Annotation
              </h3>
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Type investigative observation, discrepancy, or lead hypothesis..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-hidden focus:border-blue-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-colors shadow-xs"
                  >
                    APPEND NOTE
                  </button>
                </div>
              </form>
            </div>

            {/* Notes List */}
            <div className="space-y-3">
              {notes.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/60 border border-slate-800 rounded-lg">
                  No notes recorded for this case docket yet.
                </div>
              ) : (
                notes.map((n) => (
                  <div key={n.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-850 mb-2">
                      <span className="font-bold text-slate-300">{n.author}</span>
                      <span>{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                      {n.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
