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

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  bookmarkCount
}) => {
  const stats = policeDatabase.getStats();

  const primaryTools = [
    { id: 'dashboard' as const, label: 'Dashboard Overview', icon: 'LayoutDashboard', badge: null },
    { id: 'investigation_notebook' as const, label: 'Case 27 Notebook', icon: 'BookOpen', badge: 'ACTIVE' },
    { id: 'investigation_board' as const, label: 'Investigation Board', icon: 'GitMerge', badge: 'CANVAS' },
    { id: 'bookmarks' as const, label: 'Bookmarks & Flagged', icon: 'Bookmark', badge: bookmarkCount || null },
    { id: 'advanced_search' as const, label: 'Advanced Search', icon: 'Sliders', badge: null }
  ];

  const coreRegisters = [
    { id: 'persons' as const, label: 'Persons Registry', icon: 'Users', badge: stats.totalPersons },
    { id: 'cases' as const, label: 'Case Investigations', icon: 'FolderArchive', badge: stats.openCases + stats.closedCases },
    { id: 'incidents' as const, label: 'Incident Records', icon: 'Radio', badge: stats.recentIncidents },
    { id: 'arrests' as const, label: 'Arrest & Bookings', icon: 'UserX', badge: null },
    { id: 'missing_persons' as const, label: 'Missing Persons', icon: 'HelpCircle', badge: stats.missingPersons, alert: true },
    { id: 'warrants' as const, label: 'Active Warrants', icon: 'FileWarning', badge: stats.wantedPersons },
    { id: 'evidence' as const, label: 'Evidence Repository', icon: 'Box', badge: stats.evidenceItems },
    { id: 'traffic_vehicles' as const, label: 'Vehicle Database', icon: 'Truck', badge: stats.totalVehicles },
    { id: 'officers' as const, label: 'Officers Directory', icon: 'Award', badge: stats.totalOfficers },
    { id: 'reports' as const, label: 'Police Reports', icon: 'FileText', badge: stats.totalReports },
    { id: 'locations' as const, label: 'Locations / Addresses', icon: 'MapPin', badge: null },
    { id: 'organizations' as const, label: 'Organizations & Corps', icon: 'Building2', badge: null }
  ];

  const crimeDivisions = [
    { id: 'homicide' as const, label: 'Homicide Division', icon: 'Skull', badge: null },
    { id: 'robbery' as const, label: 'Robbery', icon: 'Zap', badge: null },
    { id: 'burglary' as const, label: 'Burglary & Break-In', icon: 'Key', badge: null },
    { id: 'theft' as const, label: 'Theft & Larceny', icon: 'ShoppingBag', badge: null },
    { id: 'assault' as const, label: 'Assault & Battery', icon: 'Activity', badge: null },
    { id: 'narcotics' as const, label: 'Narcotics & Vice', icon: 'Pill', badge: null },
    { id: 'fraud' as const, label: 'Financial Fraud', icon: 'CreditCard', badge: null },
    { id: 'cybercrime' as const, label: 'Cybercrime & Digital', icon: 'Cpu', badge: null },
    { id: 'organized_crime' as const, label: 'Organized Crime', icon: 'Network', badge: null },
    { id: 'sexual_offenses' as const, label: 'Sexual Offenses', icon: 'ShieldAlert', badge: null },
    { id: 'vandalism' as const, label: 'Vandalism & Property', icon: 'SprayCan', badge: null },
    { id: 'weapons' as const, label: 'Weapons & Ballistics', icon: 'Crosshair', badge: null }
  ];

  const specializedLists = [
    { id: 'suspects' as const, label: 'Suspects Index', icon: 'UserCheck', badge: null },
    { id: 'victims' as const, label: 'Victims Index', icon: 'UserMinus', badge: null },
    { id: 'witnesses' as const, label: 'Witness Statements', icon: 'Eye', badge: null },
    { id: 'communications' as const, label: 'Internal Communications', icon: 'MessageSquare', badge: null },
    { id: 'archived_records' as const, label: 'Archived & Cold Cases', icon: 'Archive', badge: 'HISTORIC' }
  ];

  const renderSectionItem = (item: {
    id: PrisSectionId;
    label: string;
    icon: string;
    badge: any;
    alert?: boolean;
  }) => {
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
          <Icon
            name={item.icon}
            className={`w-3.5 h-3.5 shrink-0 ${
              isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'
            }`}
          />
          <span className="truncate">{item.label}</span>
        </div>
        {item.badge !== null && (
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded font-mono shrink-0 ml-1 ${
              item.alert
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60 font-bold'
                : isActive
                ? 'bg-blue-900/60 text-blue-200'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-56 bg-slate-950/95 border-r border-slate-800 flex flex-col h-full select-none shrink-0 overflow-y-auto custom-scrollbar">
      {/* Primary Investigation Tools */}
      <div className="p-2 space-y-0.5 border-b border-slate-800/80">
        <div className="px-2 py-1 text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">
          Investigation Tools
        </div>
        {primaryTools.map(renderSectionItem)}
      </div>

      {/* Core Law Enforcement Registers */}
      <div className="p-2 space-y-0.5 border-b border-slate-800/80">
        <div className="px-2 py-1 text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">
          Master Registers
        </div>
        {coreRegisters.map(renderSectionItem)}
      </div>

      {/* Crime Divisions */}
      <div className="p-2 space-y-0.5 border-b border-slate-800/80">
        <div className="px-2 py-1 text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">
          Crime Divisions
        </div>
        {crimeDivisions.map(renderSectionItem)}
      </div>

      {/* Special Investigative Groups */}
      <div className="p-2 space-y-0.5 pb-6">
        <div className="px-2 py-1 text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">
          Special Investigative
        </div>
        {specializedLists.map(renderSectionItem)}
      </div>
    </div>
  );
};
