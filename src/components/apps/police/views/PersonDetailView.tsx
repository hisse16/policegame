import React, { useState } from 'react';
import { Icon } from '../../../common/Icon';
import { PersonRecord, AnyRecord } from '../../../../types/police';
import { policeDatabase } from '../../../../services/police/databaseEngine';
import { useOS } from '../../../../context/OSContext';

interface PersonDetailViewProps {
  person: PersonRecord;
  onSelectRecord: (id: string) => void;
  onExportRecord: (record: AnyRecord) => void;
  onBack: () => void;
}

export const PersonDetailView: React.FC<PersonDetailViewProps> = ({
  person,
  onSelectRecord,
  onExportRecord,
  onBack
}) => {
  const { openApp } = useOS();
  const [activeTab, setActiveTab] = useState<'profile' | 'criminal' | 'associated' | 'timeline' | 'notes'>('profile');
  const [newNote, setNewNote] = useState('');
  const isBookmarked = policeDatabase.isBookmarked(person.id);
  const notes = policeDatabase.getNotesForRecord(person.id);
  const relationships = policeDatabase.getRelationshipsForRecord(person.id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    policeDatabase.addNote(person.id, 'Det. S. Miller (#4081)', newNote.trim());
    setNewNote('');
  };

  return (
    <div className="flex-1 h-full flex flex-col select-none bg-slate-900/60 overflow-hidden font-mono">
      {/* 1. Top Bar / Dossier Header */}
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
            <span>PERSONS</span>
            <span>/</span>
            <span className="text-slate-200 font-bold">{person.id}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => openApp('investigation-board', { focusRecordId: person.id })}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-blue-950/80 border border-blue-700 text-blue-300 hover:bg-blue-900 transition-colors font-bold"
              title="Pin Person to Investigation Board"
            >
              <Icon name="GitMerge" className="w-3.5 h-3.5 text-blue-400" />
              <span>BOARD</span>
            </button>

            <button
              onClick={() => openApp('investigation-map', { search: person.addresses?.[0] || person.lastName })}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-indigo-950/80 border border-indigo-700 text-indigo-300 hover:bg-indigo-900 transition-colors font-bold"
              title="Locate registered address on GIS Map"
            >
              <Icon name="MapPin" className="w-3.5 h-3.5 text-indigo-400" />
              <span>GIS MAP</span>
            </button>

            <button
              onClick={() => openApp('police-mail', { search: person.lastName })}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-amber-950/70 border border-amber-800 text-amber-300 hover:bg-amber-900 transition-colors"
              title="Search emails and memos mentioning this person"
            >
              <Icon name="Mail" className="w-3.5 h-3.5 text-amber-400" />
              <span>MEMOS</span>
            </button>

            <button
              onClick={() => policeDatabase.toggleBookmark(person.id)}
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
              onClick={() => onExportRecord(person)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            >
              <Icon name="Download" className="w-3.5 h-3.5" />
              <span>EXPORT DOSSIER</span>
            </button>
          </div>
        </div>

        {/* Person Identity Header */}
        <div className="flex items-start gap-5">
          {/* Mugshot / Avatar Silhouette */}
          <div className="w-20 h-24 rounded bg-slate-900 border-2 border-slate-700 flex flex-col items-center justify-center text-slate-400 shrink-0 shadow-inner relative overflow-hidden">
            <Icon name="User" className="w-12 h-12 text-slate-400" />
            <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 text-[8px] text-center font-mono py-0.5 text-slate-400 border-t border-slate-800">
              PRIS FILE
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-slate-100 uppercase tracking-wide">
                {person.firstName} {person.lastName}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-blue-300 border border-slate-700">
                {person.id}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-bold border ${
                  person.isMissing
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : person.riskLevel === 'HIGH' || person.riskLevel === 'EXTREME'
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                STATUS: {person.status}
              </span>
              {person.riskLevel && (
                <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  RISK: {person.riskLevel}
                </span>
              )}
            </div>

            {person.aliases && person.aliases.length > 0 && (
              <div className="text-xs text-amber-300/90 mt-1">
                <strong>ALIASES / AKA:</strong> {person.aliases.join(', ')}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 mt-3 pt-3 border-t border-slate-850">
              <div>
                <span className="text-slate-400">DOB: </span>
                <span className="font-semibold">{person.dob}</span>
              </div>
              <div>
                <span className="text-slate-400">POB: </span>
                <span className="font-semibold">{person.pob}</span>
              </div>
              <div>
                <span className="text-slate-400">OCCUPATION: </span>
                <span className="font-semibold">{person.occupation}</span>
              </div>
              <div>
                <span className="text-slate-400">DL NUMBER: </span>
                <span className="font-semibold text-blue-400">{person.driverLicenseId || 'NONE'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Missing Person Alert Banner */}
        {person.isMissing && person.missingPersonDetails && (
          <div className="mt-4 p-3 rounded bg-amber-950/50 border border-amber-800 text-amber-200 text-xs">
            <div className="flex items-center gap-2 font-bold mb-1">
              <Icon name="AlertTriangle" className="w-4 h-4 text-amber-400" />
              <span>ACTIVE MISSING PERSON INVESTIGATION</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1 text-[11px] text-amber-100/90">
              <div>Reported: {person.missingPersonDetails.dateReported}</div>
              <div>Last Seen: {person.missingPersonDetails.lastSeenLocation}</div>
              <div>Last Seen Date: {person.missingPersonDetails.lastSeenDate}</div>
            </div>
            {person.missingPersonDetails.circumstances && (
              <p className="mt-1.5 text-xs text-amber-100">
                {person.missingPersonDetails.circumstances}
              </p>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-4 border-b border-slate-800 -mb-4">
          {[
            { id: 'profile' as const, label: 'BIOMETRICS & RESIDENCE', icon: 'User' },
            { id: 'criminal' as const, label: `CRIMINAL RECORD (${person.knownOffenses?.length || 0})`, icon: 'ShieldAlert' },
            { id: 'associated' as const, label: `LINKED RECORDS & CASES`, icon: 'GitBranch' },
            { id: 'timeline' as const, label: `TIMELINE (${person.timeline?.length || 0})`, icon: 'Clock' },
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

      {/* 2. Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-900/40">
        {/* Tab 1: Profile / Biometrics */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon name="Fingerprint" className="w-4 h-4 text-blue-400" />
                <span>Physical Characteristics & Biometrics</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">HEIGHT</div>
                  <div className="text-slate-200 font-bold mt-0.5">{person.height}</div>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">WEIGHT</div>
                  <div className="text-slate-200 font-bold mt-0.5">{person.weight}</div>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">HAIR COLOR</div>
                  <div className="text-slate-200 font-bold mt-0.5">{person.hair}</div>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">EYE COLOR</div>
                  <div className="text-slate-200 font-bold mt-0.5">{person.eyes}</div>
                </div>
              </div>
            </div>

            {/* Addresses & Contact */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon name="MapPin" className="w-4 h-4 text-emerald-400" />
                <span>Contact & Residential Locations</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Known Addresses</h4>
                  <div className="space-y-1.5">
                    {person.addresses && person.addresses.length > 0 ? (
                      person.addresses.map((addr, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200 flex items-center justify-between gap-2">
                          <span className="truncate">{addr}</span>
                          <button
                            type="button"
                            onClick={() => openApp('investigation-map', { search: addr })}
                            className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                            title="View location on map"
                          >
                            <Icon name="MapPin" className="w-2.5 h-2.5 text-indigo-400" />
                            <span>Map</span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400">No confirmed addresses on record.</div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Phone Numbers & Comms</h4>
                  <div className="space-y-1.5">
                    {person.phones && person.phones.length > 0 ? (
                      person.phones.map((ph, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">
                          {ph}
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400">No phones cataloged.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Criminal History */}
        {activeTab === 'criminal' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Icon name="ShieldAlert" className="w-4 h-4 text-rose-400" />
                <span>Documented Offenses & Police Contacts</span>
              </h3>
              {(!person.knownOffenses || person.knownOffenses.length === 0) ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-900/60 rounded border border-slate-800">
                  NO PRIOR ARRESTS OR CONVICTIONS RECORDED IN METROPOLITAN JURISDICTION.
                </div>
              ) : (
                <div className="space-y-2">
                  {person.knownOffenses.map((off, idx) => (
                    <div key={idx} className="p-3 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center justify-between">
                      <span className="font-semibold">{off}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        CONVICTION / DOCKET
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Associated Records */}
        {activeTab === 'associated' && (
          <div className="space-y-6 max-w-4xl">
            {/* Relational connections */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon name="GitMerge" className="w-4 h-4 text-blue-400" />
                <span>Direct Entity Relationships ({relationships.length})</span>
              </h3>
              {relationships.length === 0 ? (
                <div className="text-xs text-slate-400">No explicit entity links recorded.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relationships.map((rel) => {
                    const targetId = rel.sourceId === person.id ? rel.targetId : rel.sourceId;
                    const targetRec = policeDatabase.getRecord(targetId);
                    return (
                      <div
                        key={rel.id}
                        onClick={() => targetRec && onSelectRecord(targetRec.id)}
                        className="p-3 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-blue-400 hover:underline">
                            {targetRec ? targetRec.title : targetId}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {rel.description || rel.type}
                          </div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                          {rel.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-4 max-w-4xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              Biographical & Case Timeline
            </h3>
            <div className="relative border-l-2 border-slate-800 ml-3 space-y-6">
              {(person.timeline || []).map((t, idx) => (
                <div key={t.id || idx} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-500" />
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{t.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-blue-400 border border-slate-800">
                        {t.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{t.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Add Detective Annotation
              </h3>
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record interview observations, behavioral notes, alibi verifications..."
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

            <div className="space-y-3">
              {notes.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/60 border border-slate-800 rounded-lg">
                  No notes recorded on this individual.
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
