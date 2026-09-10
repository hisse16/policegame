import React from 'react';
import { Icon } from '../../../common/Icon';
import { policeDatabase } from '../../../../services/police/databaseEngine';

export type PrisSectionId =
  | 'dashboard'
  | 'investigation_notebook'
  | 'investigation_board'
  | 'bookmarks'
  | 'advanced_search'
  | 'persons'
  | 'cases'
  | 'incidents'
  | 'arrests'
  | 'missing_persons'
  | 'homicide'
  | 'robbery'
  | 'burglary'
  | 'theft'
  | 'assault'
  | 'narcotics'
  | 'fraud'
  | 'cybercrime'
  | 'organized_crime'
  | 'sexual_offenses'
  | 'vandalism'
  | 'traffic_vehicles'
  | 'weapons'
  | 'evidence'
  | 'witnesses'
  | 'suspects'
  | 'victims'
  | 'warrants'
  | 'officers'
  | 'locations'
  | 'organizations'
  | 'reports'
  | 'communications'
  | 'archived_records';

interface SidebarProps {
  activeSection: PrisSectionId;
  onSelectSection: (section: PrisSectionId) => void;
  bookmarkCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSelectSection, bookmarkCount }) => {
  const stats = policeDatabase.getStats();

  // Keep the primary navigation focused on actions the player actually uses
  // to investigate. Specialized registers remain reachable through linked records/search.
  const investigationTools = [
    { id: 'dashboard' as const, label: 'Case 27', icon: 'FileSearch', badge: null },
    { id: 'investigation_notebook' as const, label: 'Notebook', icon: 'BookOpen', badge: null },
    { id: 'investigation_board' as const, label: 'Board', icon: 'GitMerge', badge: null },
    { id: 'bookmarks' as const, label: 'Bookmarks', icon: 'Bookmark', badge: bookmarkCount || null },
    { id: 'advanced_search' as const, label: 'Search', icon: 'Search', badge: null }
  ];

  const coreRegisters = [
    { id: 'cases' as const, label: 'Cases', icon: 'FolderArchive', badge: stats.openCases + stats.closedCases },
    { id: 'persons' as const, label: 'People', icon: 'Users', badge: stats.totalPersons },
    { id: 'evidence' as const, label: 'Evidence', icon: 'Box', badge: stats.evidenceItems },
    { id: 'reports' as const, label: 'Reports', icon: 'FileText', badge: stats.totalReports },
    { id: 'locations' as const, label: 'Locations', icon: 'MapPin', badge: null }
  ];

  const renderSectionItem = (item: { id: PrisSectionId; label: string; icon: string; badge: any }) => {
    const isActive = activeSection === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onSelectSection(item.id)}
        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors text-left ${
          isActive
            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold shadow-xs'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <Icon name={item.icon} className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
          <span className="truncate">{item.label}</span>
        </div>
        {item.badge !== null && (
          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono shrink-0 ml-1 ${isActive ? 'bg-blue-900/60 text-blue-200' : 'bg-slate-800 text-slate-400'}`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-52 bg-slate-950/95 border-r border-slate-800 flex flex-col h-full select-none shrink-0 overflow-y-auto custom-scrollbar">
      <div className="p-2 space-y-0.5 border-b border-slate-800/80">
        <div className="px-2 py-1 text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">Investigation</div>
        {investigationTools.map(renderSectionItem)}
      </div>
      <div className="p-2 space-y-0.5">
        <div className="px-2 py-1 text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">Records</div>
        {coreRegisters.map(renderSectionItem)}
      </div>
      <div className="mt-auto p-3 border-t border-slate-800/80 text-[10px] leading-relaxed text-slate-600 font-mono">
        Other registers appear through linked records or Search when the investigation gives you a reason to open them.
      </div>
    </div>
  );
};
