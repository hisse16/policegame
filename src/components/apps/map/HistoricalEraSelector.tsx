import React from 'react';
import { HistoricalEra } from '../../../types/map';
import { Icon } from '../../common/Icon';

interface HistoricalEraSelectorProps {
  activeEra: HistoricalEra;
  onSelectEra: (era: HistoricalEra) => void;
}

export const HistoricalEraSelector: React.FC<HistoricalEraSelectorProps> = ({
  activeEra,
  onSelectEra
}) => {
  const eras: { era: HistoricalEra; label: string; subtitle: string; icon: string }[] = [
    {
      era: '1998',
      label: '1998',
      subtitle: 'Disappearance & Initial Case 27',
      icon: 'Clock'
    },
    {
      era: '2003',
      label: '2003',
      subtitle: 'Probate & Liquidation',
      icon: 'FileText'
    },
    {
      era: '2004',
      label: '2004',
      subtitle: 'Archive Purge (SEC-VANCE-89)',
      icon: 'Archive'
    },
    {
      era: '2026',
      label: '2026',
      subtitle: 'Modern Cold Case Audit',
      icon: 'Search'
    }
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 select-none">
      {eras.map((item) => {
        const isSelected = activeEra === item.era;
        return (
          <button
            key={item.era}
            type="button"
            onClick={() => onSelectEra(item.era)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono transition-all duration-150 ${
              isSelected
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title={`${item.label}: ${item.subtitle}`}
          >
            <Icon name={item.icon} className="w-3 h-3" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
