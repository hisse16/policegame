import React from 'react';
import { Icon } from '../../../common/Icon';
import { OfficerRecord, AnyRecord } from '../../../../types/police';
import { policeDatabase } from '../../../../services/police/databaseEngine';

interface OfficerViewProps {
  officer: OfficerRecord;
  onSelectRecord: (id: string) => void;
  onExportRecord: (record: AnyRecord) => void;
  onBack: () => void;
}

export const OfficerView: React.FC<OfficerViewProps> = ({
  officer,
  onSelectRecord,
  onExportRecord,
  onBack
}) => {
  const isBookmarked = policeDatabase.isBookmarked(officer.id);

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
            <span>OFFICERS</span>
            <span>/</span>
            <span className="text-slate-200 font-bold">{officer.badgeNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => policeDatabase.toggleBookmark(officer.id)}
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
              onClick={() => onExportRecord(officer)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              <Icon name="Download" className="w-3.5 h-3.5" />
              <span>EXPORT SERVICE RECORD</span>
            </button>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400 shrink-0">
            <Icon name="Award" className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-100">{officer.title}</span>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-blue-950 text-blue-300 border border-blue-800">
                BADGE #{officer.badgeNumber}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {officer.status}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {officer.department} • {officer.assignment} • Service: {officer.employmentDates}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl custom-scrollbar bg-slate-900/40">
        {/* Service Record Details */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Icon name="Shield" className="w-4 h-4 text-blue-400" />
            <span>Departmental Personnel Record</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] block">RANK</span>
              <span className="text-slate-200 font-bold">{officer.rank}</span>
            </div>
            <div className="p-3 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] block">DIVISION</span>
              <span className="text-slate-200 font-semibold">{officer.department}</span>
            </div>
            <div className="p-3 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] block">SERVICE DATES</span>
              <span className="text-slate-200 font-semibold">{officer.employmentDates}</span>
            </div>
          </div>
        </div>

        {/* Authored Reports or Assigned Cases */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Assigned Case Dockets ({officer.assignedCaseIds.length})
          </h3>
          {officer.assignedCaseIds.length === 0 ? (
            <div className="text-xs text-slate-400">No active cases assigned in current roster.</div>
          ) : (
            <div className="space-y-2">
              {officer.assignedCaseIds.map((cid) => {
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
