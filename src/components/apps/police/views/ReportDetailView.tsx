import React from 'react';
import { Icon } from '../../../common/Icon';
import { ReportRecord, AnyRecord } from '../../../../types/police';
import { policeDatabase } from '../../../../services/police/databaseEngine';
import { useOS } from '../../../../context/OSContext';

interface ReportDetailViewProps {
  report: ReportRecord;
  onSelectRecord: (id: string) => void;
  onExportRecord: (record: AnyRecord) => void;
  onBack: () => void;
}

export const ReportDetailView: React.FC<ReportDetailViewProps> = ({
  report,
  onSelectRecord,
  onExportRecord,
  onBack
}) => {
  const { openApp } = useOS();
  const isBookmarked = policeDatabase.isBookmarked(report.id);
  const officer = policeDatabase.getRecord(report.authorOfficerId);
  const linkedCase = report.caseId ? policeDatabase.getRecord(report.caseId) : null;

  return (
    <div className="flex-1 h-full flex flex-col select-none bg-slate-900/60 overflow-hidden font-mono">
      {/* Action Bar */}
      <div className="p-3 px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
          >
            <Icon name="ArrowLeft" className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <span>/</span>
          <span>POLICE REPORTS</span>
          <span>/</span>
          <span className="text-slate-200 font-bold">{report.reportNumber}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => openApp('investigation-board', { focusRecordId: report.id })}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-blue-950/80 border border-blue-700 text-blue-300 hover:bg-blue-900 transition-colors font-bold"
            title="Pin Report to Investigation Board"
          >
            <Icon name="GitMerge" className="w-3.5 h-3.5 text-blue-400" />
            <span>BOARD</span>
          </button>

          <button
            onClick={() => openApp('investigation-map', { search: report.location })}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-indigo-950/80 border border-indigo-700 text-indigo-300 hover:bg-indigo-900 transition-colors font-bold"
            title="Locate incident scene on GIS Map"
          >
            <Icon name="MapPin" className="w-3.5 h-3.5 text-indigo-400" />
            <span>GIS MAP</span>
          </button>

          <button
            onClick={() => openApp('police-mail', { search: report.reportNumber })}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-amber-950/70 border border-amber-800 text-amber-300 hover:bg-amber-900 transition-colors"
            title="Search related memos"
          >
            <Icon name="Mail" className="w-3.5 h-3.5 text-amber-400" />
            <span>MEMOS</span>
          </button>

          <button
            onClick={() => policeDatabase.toggleBookmark(report.id)}
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
            onClick={() => onExportRecord(report)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <Icon name="Download" className="w-3.5 h-3.5" />
            <span>EXPORT AS OFFICIAL RECORD</span>
          </button>
        </div>
      </div>

      {/* Official Form Parchment Container */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex justify-center bg-slate-900/40">
        <div className="w-full max-w-3xl bg-slate-950 border-2 border-slate-800 rounded-lg p-8 shadow-xl space-y-6">
          {/* Official Department Header */}
          <div className="border-b-2 border-slate-700 pb-4 text-center relative">
            <div className="text-[11px] tracking-widest text-slate-400 uppercase font-bold">
              METROPOLITAN POLICE DEPARTMENT // INVESTIGATIVE BUREAU
            </div>
            <div className="text-base font-bold text-slate-100 tracking-wider mt-1 uppercase">
              OFFICIAL INCIDENT & INVESTIGATIVE REPORT
            </div>
            <div className="text-[10px] text-blue-400 tracking-widest mt-0.5">
              CONFIDENTIAL LAW ENFORCEMENT RECORD // RESTRICTED ACCESS
            </div>
          </div>

          {/* Form Metadata Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-800 bg-slate-900/60 p-3 rounded">
            <div>
              <span className="text-[10px] text-slate-500 block">REPORT NUMBER</span>
              <span className="font-bold text-slate-200">{report.reportNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">DATE & TIME</span>
              <span className="font-bold text-slate-200">{report.date} {report.time}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">REPORT TYPE</span>
              <span className="font-bold text-amber-300">{report.reportType}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">ASSOCIATED CASE</span>
              {linkedCase ? (
                <button
                  onClick={() => onSelectRecord(linkedCase.id)}
                  className="font-bold text-blue-400 hover:underline"
                >
                  {(linkedCase as any).caseNumber || linkedCase.title || linkedCase.id}
                </button>
              ) : (
                <span className="text-slate-400">NONE</span>
              )}
            </div>
          </div>

          {/* Authorizing Personnel Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border border-slate-800 bg-slate-900/60 p-3 rounded">
            <div>
              <span className="text-[10px] text-slate-500 block">REPORTING OFFICER</span>
              <button
                onClick={() => officer && onSelectRecord(officer.id)}
                className="font-bold text-blue-400 hover:underline"
              >
                {report.authorRank} {report.authorName} ({report.authorOfficerId})
              </button>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">INCIDENT SCENE / LOCATION</span>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className="text-slate-200 font-semibold truncate">{report.location}</span>
                <button
                  type="button"
                  onClick={() => openApp('investigation-map', { search: report.location })}
                  className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors font-mono"
                  title="Plot on Map"
                >
                  <Icon name="MapPin" className="w-2.5 h-2.5 text-indigo-400" />
                  <span>Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Redaction Notice if active */}
          {report.isRedacted && (
            <div className="p-2.5 rounded bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="ShieldAlert" className="w-4 h-4 text-rose-400" />
                <span>
                  <strong>SECTIONAL REDACTION ACTIVE:</strong> Certain passages in this document have been suppressed pursuant to active court order or pending protective discovery.
                </span>
              </div>
            </div>
          )}

          {/* Narrative Body */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              INVESTIGATIVE NARRATIVE & STATEMENT OF FACTS
            </div>
            <div className="p-5 rounded bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-mono">
              {report.narrative}
            </div>
          </div>

          {/* Signatures and Validation Stamp */}
          <div className="pt-6 border-t border-slate-800 flex items-end justify-between">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">OFFICIAL INVESTIGATOR SIGNATURE</div>
              <div className="text-sm font-bold text-slate-300 font-mono italic mt-1">
                /s/ {report.signature}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                VERIFIED ARCHIVAL COPY // METRO POLICE ARCHIVES
              </div>
            </div>

            <div className="w-24 h-24 rounded border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-center p-1 text-[9px] text-slate-500">
              <Icon name="CheckCircle" className="w-6 h-6 text-emerald-500 mb-1" />
              <span>RECORD ARCHIVED</span>
              <span className="font-mono text-[8px] text-slate-600">MD5-VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
