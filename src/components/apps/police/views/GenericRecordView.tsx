import React from 'react';
import { Icon } from '../../../common/Icon';
import { AnyRecord } from '../../../../types/police';
import { policeDatabase } from '../../../../services/police/databaseEngine';

interface GenericRecordViewProps {
  record: AnyRecord;
  onSelectRecord: (id: string) => void;
  onExportRecord: (record: AnyRecord) => void;
  onBack: () => void;
}

export const GenericRecordView: React.FC<GenericRecordViewProps> = ({
  record,
  onSelectRecord,
  onExportRecord,
  onBack
}) => {
  const isBookmarked = policeDatabase.isBookmarked(record.id);

  // Render specific properties dynamically
  const entries = Object.entries(record).filter(
    ([key]) => !['id', 'type', 'title', 'status', 'tags', 'createdAt', 'updatedAt', 'history'].includes(key)
  );

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
            <span className="uppercase">{record.type}S</span>
            <span>/</span>
            <span className="text-slate-200 font-bold">{record.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => policeDatabase.toggleBookmark(record.id)}
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
              onClick={() => onExportRecord(record)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              <Icon name="Download" className="w-3.5 h-3.5" />
              <span>EXPORT RECORD</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-100">{record.title}</span>
            <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300 border border-slate-700">
              STATUS: {record.status}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            RECORD ID: {record.id} • TYPE: {record.type.toUpperCase()} • LOGGED: {record.createdAt}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl custom-scrollbar bg-slate-900/40">
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Icon name="FileText" className="w-4 h-4 text-blue-400" />
            <span>Documented Record Attributes</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {entries.map(([k, v]) => {
              const valStr = typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v);
              return (
                <div key={k} className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">{k}</span>
                  <div className="text-slate-200 mt-1 font-mono break-words whitespace-pre-wrap">{valStr}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
