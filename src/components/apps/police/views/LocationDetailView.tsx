import React from 'react';
import { Icon } from '../../../common/Icon';
import { LocationRecord, AnyRecord } from '../../../../types/police';
import { policeDatabase } from '../../../../services/police/databaseEngine';

interface LocationDetailViewProps {
  location: LocationRecord;
  onSelectRecord: (id: string) => void;
  onExportRecord: (record: AnyRecord) => void;
  onBack: () => void;
}

export const LocationDetailView: React.FC<LocationDetailViewProps> = ({
  location,
  onSelectRecord,
  onExportRecord,
  onBack
}) => {
  const isBookmarked = policeDatabase.isBookmarked(location.id);

  return (
    <div className="flex-1 h-full flex flex-col select-none bg-slate-900/60 overflow-hidden font-mono">
      <div className="p-4 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={onBack} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold">
              <Icon name="ArrowLeft" className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span>/</span>
            <span>LOCATIONS</span>
            <span>/</span>
            <span className="text-slate-200 font-bold">{location.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => policeDatabase.toggleBookmark(location.id)}
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
              onClick={() => onExportRecord(location)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              <Icon name="Download" className="w-3.5 h-3.5" />
              <span>EXPORT PROPERTY DOSSIER</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-100">{location.address}</span>
            <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {location.locationType}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1">District: {location.district}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl custom-scrollbar bg-slate-900/40">
        {/* Occupants & Businesses */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Icon name="Users" className="w-4 h-4 text-blue-400" />
            <span>Documented Occupants & Registered Businesses</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-slate-400 mb-1 font-bold">KNOWN OCCUPANTS:</div>
              {location.knownOccupantNames.length === 0 ? (
                <div className="text-slate-400">None on record.</div>
              ) : (
                <div className="space-y-1">
                  {location.knownOccupantNames.map((n, i) => (
                    <div key={i} className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-200">
                      {n}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="text-slate-400 mb-1 font-bold">REGISTERED BUSINESSES:</div>
              {location.knownBusinessNames.length === 0 ? (
                <div className="text-slate-400">None on record.</div>
              ) : (
                <div className="space-y-1">
                  {location.knownBusinessNames.map((b, i) => (
                    <div key={i} className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-200 font-semibold">
                      {b}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Linked Cases */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Case Investigations Associated with Address ({location.caseIds.length})
          </h3>
          {location.caseIds.length === 0 ? (
            <div className="text-xs text-slate-400">No active cases associated.</div>
          ) : (
            <div className="space-y-2">
              {location.caseIds.map((cid) => {
                const c = policeDatabase.getRecord(cid);
                return (
                  <div
                    key={cid}
                    onClick={() => onSelectRecord(cid)}
                    className="p-3 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-blue-400 hover:underline">{c ? c.title : cid}</span>
                    <span className="text-slate-400">{c ? c.status : ''}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
