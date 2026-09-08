import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { EvidenceRecord } from '../../../types/police';

interface EvidenceListViewProps {
  evidenceList: EvidenceRecord[];
  onSelectEvidence: (id: string) => void;
  onOpenAddModal: () => void;
  onAddToBoard: (evidence: EvidenceRecord) => void;
}

export const EvidenceListView: React.FC<EvidenceListViewProps> = ({
  evidenceList,
  onSelectEvidence,
  onOpenAddModal,
  onAddToBoard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('table');

  const filteredEvidence = evidenceList.filter((ev) => {
    if (selectedType !== 'ALL' && ev.evidenceType !== selectedType) return false;
    if (selectedStatus !== 'ALL' && ev.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = ev.id.toLowerCase().includes(q);
      const matchTitle = ev.title.toLowerCase().includes(q);
      const matchDesc = ev.description.toLowerCase().includes(q);
      const matchLoc = ev.collectionLocation.toLowerCase().includes(q);
      const matchTag = ev.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchId && !matchTitle && !matchDesc && !matchLoc && !matchTag) return false;
    }
    return true;
  });

  const getTypeIcon = (type: EvidenceRecord['evidenceType']) => {
    switch (type) {
      case 'Physical':
        return 'Box';
      case 'Document':
        return 'FileText';
      case 'Digital':
        return 'HardDrive';
      case 'Biological':
        return 'Dna';
      case 'Trace':
        return 'Sparkles';
      case 'Vehicle':
        return 'Car';
      default:
        return 'Shield';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Header & Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="Box" className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold font-mono text-slate-100 uppercase">
              Central Evidence Locker & Archival Repository
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Cataloged items: {evidenceList.length} | Filtered results: {filteredEvidence.length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-slate-400">
            <button
              onClick={() => setViewLayout('table')}
              className={`p-1.5 rounded ${viewLayout === 'table' ? 'bg-slate-800 text-blue-400' : 'hover:text-slate-200'}`}
              title="Table View"
            >
              <Icon name="List" className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 rounded ${viewLayout === 'grid' ? 'bg-slate-800 text-blue-400' : 'hover:text-slate-200'}`}
              title="Card Grid View"
            >
              <Icon name="Grid" className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Icon name="Plus" className="w-3.5 h-3.5" />
            Log New Evidence
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Icon name="Search" className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by item ID, title, description, location, tag..."
            className="w-full bg-slate-900/70 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Evidence Types</option>
          <option value="Physical">Physical</option>
          <option value="Document">Document</option>
          <option value="Digital">Digital / Media</option>
          <option value="Biological">Biological</option>
          <option value="Trace">Trace / Forensics</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="IN_STORAGE">In Storage</option>
          <option value="EXAMINED">Examined</option>
          <option value="LABORATORY">In Laboratory</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Main Content Area: Table vs Grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredEvidence.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
            <Icon name="SearchX" className="w-8 h-8 mb-2 opacity-50" />
            No evidence items match the specified query or filters.
          </div>
        ) : viewLayout === 'table' ? (
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/70 shadow-inner">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3">Item Docket</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Recovery Details</th>
                  <th className="p-3">Forensic Lab</th>
                  <th className="p-3">Vault Location</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {filteredEvidence.map((ev) => {
                  const hasDiscrepancy = (ev.chainOfCustody || []).some(
                    (c) => c.discrepancyNote || c.timestamp.startsWith('2004') || c.action.toLowerCase().includes('tampered')
                  );
                  const labReportCount = ev.forensicReports?.length || 0;
                  const photoCount = ev.photos?.length || 0;

                  return (
                    <tr
                      key={ev.id}
                      onClick={() => onSelectEvidence(ev.id)}
                      className="hover:bg-slate-900/60 cursor-pointer transition-colors group"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 flex-shrink-0">
                            <Icon name={getTypeIcon(ev.evidenceType)} className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-blue-400 group-hover:underline">
                                {ev.id}
                              </span>
                              {hasDiscrepancy && (
                                <span className="bg-amber-950/80 text-amber-300 border border-amber-700/60 px-1.5 py-0.2 rounded text-[9px] font-bold">
                                  DISCREPANCY
                                </span>
                              )}
                            </div>
                            <span className="font-sans font-medium text-slate-200 block truncate max-w-xs sm:max-w-sm">
                              {ev.title}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                          {ev.evidenceType}
                        </span>
                      </td>

                      <td className="p-3 text-slate-400">
                        <div>{ev.collectionDate}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                          {ev.collectionLocation}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded border ${
                              labReportCount > 0
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                                : 'bg-slate-900 text-slate-500 border-slate-800'
                            }`}
                          >
                            {labReportCount > 0 ? `${labReportCount} REPORT(S)` : 'NO REPORT'}
                          </span>
                          {photoCount > 0 && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              <Icon name="Camera" className="w-3 h-3 text-slate-500" />
                              {photoCount}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3 text-slate-400 text-[11px]">
                        {ev.storageLocation}
                      </td>

                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onAddToBoard(ev)}
                            title="Pin to Investigation Board"
                            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                          >
                            <Icon name="Pin" className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectEvidence(ev.id)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors"
                          >
                            Inspect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredEvidence.map((ev) => {
              const hasDiscrepancy = (ev.chainOfCustody || []).some(
                (c) => c.discrepancyNote || c.timestamp.startsWith('2004') || c.action.toLowerCase().includes('tampered')
              );
              const previewPhoto = ev.photos && ev.photos.length > 0 ? ev.photos[0] : null;

              return (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvidence(ev.id)}
                  className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-sm"
                >
                  <div className="space-y-2">
                    {/* Visual thumbnail if available */}
                    {previewPhoto && (
                      <div className="w-full h-32 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center relative">
                        <img
                          src={previewPhoto.url}
                          alt={previewPhoto.title}
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-300">
                          {ev.photos!.length} photo(s)
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-blue-400">{ev.id}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {ev.evidenceType}
                      </span>
                    </div>

                    <h4 className="text-xs font-mono font-bold text-slate-100 group-hover:text-blue-300 transition-colors uppercase">
                      {ev.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 font-sans">
                      {ev.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-2.5 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">{ev.collectionDate}</span>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {hasDiscrepancy && (
                        <span className="bg-amber-950/80 text-amber-300 border border-amber-700/60 px-1.5 py-0.5 rounded text-[9px] font-bold">
                          AUDIT FLAG
                        </span>
                      )}
                      <button
                        onClick={() => onAddToBoard(ev)}
                        title="Pin to Investigation Board"
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-blue-300"
                      >
                        <Icon name="Pin" className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
