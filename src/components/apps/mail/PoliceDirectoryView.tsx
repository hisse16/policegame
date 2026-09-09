import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { DirectoryContact } from '../../../types/mail';
import { useOS } from '../../../context/OSContext';
import { ContactProfileModal } from './ContactProfileModal';

interface PoliceDirectoryViewProps {
  directory: DirectoryContact[];
  onComposeTo: (contact: DirectoryContact) => void;
  onFilterEmailHistory?: (query: string) => void;
}

export const PoliceDirectoryView: React.FC<PoliceDirectoryViewProps> = ({
  directory,
  onComposeTo,
  onFilterEmailHistory
}) => {
  const { openApp } = useOS();
  const [search, setSearch] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [activeProfileContact, setActiveProfileContact] = useState<DirectoryContact | null>(null);

  const divisions = [
    'ALL',
    'Detective Bureau',
    'Records & Archive Division',
    'Forensic Sciences Division',
    'Communications & 911 CAD',
    'Property & Evidence Vault',
    'Historic Squad'
  ];

  const filtered = directory.filter((c) => {
    const matchesSearch =
      search.trim() === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.rank.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.badgeNumber && c.badgeNumber.includes(search));

    const matchesDivision =
      selectedDivision === 'ALL' ||
      c.division.toLowerCase().includes(selectedDivision.toLowerCase()) ||
      c.department.toLowerCase().includes(selectedDivision.toLowerCase());

    return matchesSearch && matchesDivision;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/90 text-slate-200 overflow-hidden font-sans relative">
      {/* Search and Division Toolbar */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Icon name="Search" className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search roster by officer name, badge #, rank, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {divisions.map((div) => (
            <button
              key={div}
              type="button"
              onClick={() => setSelectedDivision(div)}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors ${
                selectedDivision === div
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((contact) => (
          <div
            key={contact.id}
            className="bg-slate-900/70 border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setActiveProfileContact(contact)}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-slate-700 border border-slate-700 flex items-center justify-center font-mono font-bold text-sm text-blue-400 transition-colors">
                    {contact.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100 group-hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                      <span>{contact.name}</span>
                      {contact.badgeNumber && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          #{contact.badgeNumber}
                        </span>
                      )}
                    </h3>
                    <div className="text-xs text-blue-400 font-mono">
                      {contact.rank} • {contact.role}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    contact.status === 'ACTIVE'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : contact.status === 'TRANSFERRED'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {contact.status}
                </span>
              </div>

              {/* Department & Office Info */}
              <div className="mt-3 space-y-1 text-xs text-slate-300 font-mono bg-slate-950/60 p-2.5 rounded border border-slate-850">
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="text-slate-200">{contact.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Division:</span>
                  <span className="text-slate-200">{contact.division}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Clearance:</span>
                  <span className="text-amber-400 font-semibold">{contact.clearanceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Office / Post:</span>
                  <span className="text-slate-200">{contact.officeLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone / Ext:</span>
                  <span className="text-slate-200">
                    {contact.directPhone} ({contact.phoneExt})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-blue-300 select-all">{contact.email}</span>
                </div>
              </div>

              {contact.notes && (
                <p className="mt-2 text-[11px] text-slate-400 leading-relaxed font-sans italic">
                  "{contact.notes}"
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveProfileContact(contact)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1"
                title="View full personnel profile and investigative actions"
              >
                <Icon name="FileText" className="w-3 h-3 text-slate-400" />
                <span>Dossier</span>
              </button>

              {contact.officerId && (
                <button
                  type="button"
                  onClick={() => openApp('police-records', { recordId: contact.officerId })}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1"
                >
                  <Icon name="Database" className="w-3 h-3 text-blue-400" />
                  <span>PRIS File</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onComposeTo(contact)}
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium shadow transition-colors flex items-center gap-1"
              >
                <Icon name="Mail" className="w-3 h-3" />
                <span>Send Memo</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      {activeProfileContact && (
        <ContactProfileModal
          contact={activeProfileContact}
          onClose={() => setActiveProfileContact(null)}
          onComposeTo={(c) => {
            setActiveProfileContact(null);
            onComposeTo(c);
          }}
          onFilterEmailHistory={(q) => {
            setActiveProfileContact(null);
            onFilterEmailHistory?.(q);
          }}
        />
      )}
    </div>
  );
};
