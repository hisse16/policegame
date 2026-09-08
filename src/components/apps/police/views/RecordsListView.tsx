import React, { useState, useMemo } from 'react';
import { Icon } from '../../../common/Icon';
import { AnyRecord, RecordType, CaseRecord, PersonRecord } from '../../../../types/police';
import { policeDatabase } from '../../../../services/police/databaseEngine';
import { PrisSectionId } from '../components/Sidebar';

interface RecordsListViewProps {
  sectionId: PrisSectionId;
  onSelectRecord: (id: string) => void;
  onExportRecord: (record: AnyRecord) => void;
}

export const RecordsListView: React.FC<RecordsListViewProps> = ({
  sectionId,
  onSelectRecord,
  onExportRecord
}) => {
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'id' | 'title' | 'date' | 'status'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Derive records based on current section
  const records = useMemo(() => {
    switch (sectionId) {
      case 'persons':
        return policeDatabase.getAllRecords('person');
      case 'cases':
        return policeDatabase.getAllRecords('case');
      case 'incidents':
        return policeDatabase.getAllRecords('incident');
      case 'arrests':
        return policeDatabase.getAllRecords('arrest');
      case 'missing_persons': {
        const persons = policeDatabase.getAllRecords('person') as PersonRecord[];
        return persons.filter((p) => p.isMissing || p.tags.includes('MISSING_PERSON'));
      }
      case 'warrants':
        return policeDatabase.getAllRecords('warrant');
      case 'evidence':
        return policeDatabase.getAllRecords('evidence');
      case 'traffic_vehicles':
        return policeDatabase.getAllRecords('vehicle');
      case 'officers':
        return policeDatabase.getAllRecords('officer');
      case 'reports':
        return policeDatabase.getAllRecords('report');
      case 'locations':
        return policeDatabase.getAllRecords('location');
      case 'organizations':
        return policeDatabase.getAllRecords('organization');

      // Crime categories (cases filtered by category)
      case 'homicide':
        return policeDatabase.getRecordsByCrimeCategory('HOMICIDE');
      case 'robbery':
        return policeDatabase.getRecordsByCrimeCategory('ROBBERY');
      case 'burglary':
        return policeDatabase.getRecordsByCrimeCategory('BURGLARY');
      case 'theft':
        return policeDatabase.getRecordsByCrimeCategory('THEFT');
      case 'assault':
        return policeDatabase.getRecordsByCrimeCategory('ASSAULT');
      case 'narcotics':
        return policeDatabase.getRecordsByCrimeCategory('NARCOTICS');
      case 'fraud':
        return policeDatabase.getRecordsByCrimeCategory('FRAUD');
      case 'cybercrime':
        return policeDatabase.getRecordsByCrimeCategory('CYBERCRIME');
      case 'organized_crime':
        return policeDatabase.getRecordsByCrimeCategory('ORGANIZED_CRIME');
      case 'sexual_offenses':
        return policeDatabase.getRecordsByCrimeCategory('SEXUAL_OFFENSE');
      case 'vandalism':
        return policeDatabase.getRecordsByCrimeCategory('VANDALISM');
      case 'weapons':
        return policeDatabase.getRecordsByCrimeCategory('WEAPONS');

      // Specialized groups
      case 'suspects': {
        const persons = policeDatabase.getAllRecords('person') as PersonRecord[];
        return persons.filter((p) => p.tags.includes('SUSPECT') || p.knownOffenses.length > 0);
      }
      case 'victims': {
        const persons = policeDatabase.getAllRecords('person') as PersonRecord[];
        return persons.filter((p) => p.tags.includes('VICTIM') || p.isMissing);
      }
      case 'witnesses': {
        const persons = policeDatabase.getAllRecords('person') as PersonRecord[];
        return persons.filter((p) => p.tags.includes('WITNESS'));
      }
      case 'communications': {
        return policeDatabase.getAllRecords('report').filter((r: any) => r.reportType === 'INTERNAL MEMO');
      }
      case 'archived_records': {
        return policeDatabase.getAllRecords().filter((r) => r.status === 'ARCHIVED' || r.status === 'COLD CASE' || r.tags.includes('ARCHIVED'));
      }
      case 'bookmarks': {
        const bms = policeDatabase.getAllBookmarks();
        return bms
          .map((b) => policeDatabase.getRecord(b.recordId))
          .filter((r): r is AnyRecord => Boolean(r));
      }
      default:
        return policeDatabase.getAllRecords();
    }
  }, [sectionId]);

  // Status options for filter dropdown
  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.status) set.add(r.status.toUpperCase());
    });
    return Array.from(set);
  }, [records]);

  // Filter and sort records
  const filtered = useMemo(() => {
    let result = records;

    if (statusFilter !== 'ALL') {
      result = result.filter((r) => r.status && r.status.toUpperCase() === statusFilter);
    }

    if (filterText.trim()) {
      const q = filterText.toLowerCase().trim();
      result = result.filter((r) => {
        return (
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          (r.status && r.status.toLowerCase().includes(q)) ||
          JSON.stringify(r).toLowerCase().includes(q)
        );
      });
    }

    // Sort
    return [...result].sort((a, b) => {
      let valA: any = '';
      let valB: any = '';
      if (sortField === 'id') {
        valA = a.id;
        valB = b.id;
      } else if (sortField === 'title') {
        valA = a.title;
        valB = b.title;
      } else if (sortField === 'status') {
        valA = a.status || '';
        valB = b.status || '';
      } else {
        valA = a.createdAt || '';
        valB = b.createdAt || '';
      }
      const cmp = String(valA).localeCompare(String(valB));
      return sortAsc ? cmp : -cmp;
    });
  }, [records, statusFilter, filterText, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: 'id' | 'title' | 'date' | 'status') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getSectionTitle = () => {
    return sectionId.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="flex-1 h-full flex flex-col select-none bg-slate-900/60 overflow-hidden">
      {/* 1. Header Toolbar with Filters and Counts */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
            {getSectionTitle()}
          </h2>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {filtered.length} RECORDS FOUND
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick filter input */}
          <div className="relative">
            <Icon name="Search" className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setPage(1);
              }}
              placeholder="Filter within list..."
              className="w-48 bg-slate-950 border border-slate-700 rounded pl-7 pr-2 py-1 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 font-mono focus:outline-hidden"
          >
            <option value="ALL">ALL STATUSES</option>
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Page Size */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 font-mono focus:outline-hidden"
          >
            <option value="15">15 / pg</option>
            <option value="25">25 / pg</option>
            <option value="50">50 / pg</option>
            <option value="100">100 / pg</option>
          </select>
        </div>
      </div>

      {/* 2. Main Data Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 sticky top-0 z-10 select-none">
            <tr>
              <th className="py-2.5 px-3 font-semibold w-10 text-center">#</th>
              <th
                onClick={() => handleSort('id')}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>RECORD ID</span>
                  {sortField === 'id' && (
                    <Icon name={sortAsc ? 'ChevronUp' : 'ChevronDown'} className="w-3 h-3 text-blue-400" />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('title')}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>TITLE / SUMMARY</span>
                  {sortField === 'title' && (
                    <Icon name={sortAsc ? 'ChevronUp' : 'ChevronDown'} className="w-3 h-3 text-blue-400" />
                  )}
                </div>
              </th>
              <th className="py-2.5 px-3 font-semibold">TYPE</th>
              <th
                onClick={() => handleSort('status')}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>STATUS</span>
                  {sortField === 'status' && (
                    <Icon name={sortAsc ? 'ChevronUp' : 'ChevronDown'} className="w-3 h-3 text-blue-400" />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('date')}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>LOG DATE</span>
                  {sortField === 'date' && (
                    <Icon name={sortAsc ? 'ChevronUp' : 'ChevronDown'} className="w-3 h-3 text-blue-400" />
                  )}
                </div>
              </th>
              <th className="py-2.5 px-3 font-semibold text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="space-y-1">
                    <Icon name="Search" className="w-6 h-6 mx-auto text-slate-600" />
                    <div>NO MATCHING RECORDS LOCATED IN CURRENT REGISTER</div>
                    <div className="text-[10px] text-slate-600">
                      Try clearing filters or checking other department subdivisions.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((rec, idx) => {
                const isSelected = selectedId === rec.id;
                const isBookmarked = policeDatabase.isBookmarked(rec.id);
                return (
                  <tr
                    key={rec.id}
                    onClick={() => setSelectedId(rec.id)}
                    onDoubleClick={() => onSelectRecord(rec.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-950/40 text-slate-100 font-medium'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-2 px-3 text-center text-[10px] text-slate-400">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="py-2 px-3 font-semibold text-blue-400 whitespace-nowrap">
                      {rec.id}
                    </td>
                    <td className="py-2 px-3 max-w-md truncate" title={rec.title}>
                      <div className="truncate text-slate-200 hover:text-blue-300">
                        {rec.title}
                      </div>
                      {rec.tags && rec.tags.length > 0 && (
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {rec.tags.slice(0, 3).join(' • ')}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-3 uppercase text-[10px] text-slate-400 whitespace-nowrap">
                      {rec.type}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                          rec.status === 'REOPENED'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold'
                            : rec.status === 'MISSING' || rec.status === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800 font-bold'
                            : rec.status === 'OPEN' || rec.status === 'ACTIVE'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {rec.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap text-[11px] text-slate-400">
                      {rec.createdAt.split(' ')[0]}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            policeDatabase.toggleBookmark(rec.id);
                          }}
                          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Record'}
                          className={`p-1 rounded hover:bg-slate-700 ${
                            isBookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <Icon name="Bookmark" className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onExportRecord(rec);
                          }}
                          title="Export to Virtual File System (/home/investigator/Documents/Police Records/)"
                          className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                        >
                          <Icon name="Download" className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRecord(rec.id);
                          }}
                          className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold transition-colors"
                        >
                          OPEN
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Bottom Pagination Bar */}
      <div className="p-2.5 px-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
        <div>
          Showing {filtered.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &laquo; First
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &lsaquo; Prev
          </button>
          <span className="px-3 py-1 font-semibold text-slate-200">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next &rsaquo;
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Last &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};
