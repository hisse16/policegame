import React, { useMemo } from 'react';
import { Icon } from '../../common/Icon';
import { NorthbridgeMapLocation, HistoricalEra } from '../../../types/map';
import { useOS } from '../../../context/OSContext';
import { policeMailEngine } from '../../../services/police/policeMailEngine';

interface LocationDetailDrawerProps {
  location: NorthbridgeMapLocation;
  activeEra: HistoricalEra;
  onClose: () => void;
  onPinToBoard: (locId: string) => void;
}

export const LocationDetailDrawer: React.FC<LocationDetailDrawerProps> = ({
  location,
  activeEra,
  onClose,
  onPinToBoard
}) => {
  const { openApp, addNotification } = useOS();

  const currentHistoricalState =
    location.historicalStates.find((h) => h.era === activeEra) || location.historicalStates[0];

  // Cross-reference related emails mentioning this location
  const relatedEmails = useMemo(() => {
    return policeMailEngine.getAllEmails().filter(
      (e) =>
        e.relatedRecordIds?.includes(location.id) ||
        (location.recordId && e.relatedRecordIds?.includes(location.recordId)) ||
        e.body.toLowerCase().includes(location.name.toLowerCase()) ||
        e.body.toLowerCase().includes(location.address.toLowerCase())
    );
  }, [location.id, location.recordId, location.name, location.address]);

  const handlePin = () => {
    onPinToBoard(location.id);
    addNotification({
      title: 'Location Pinned to Board',
      message: `${location.name} added to Investigation Board canvas.`,
      type: 'info'
    });
  };

  const handleOpenRecord = (id: string) => {
    if (id.startsWith('CASE-')) {
      openApp('police-records', { recordId: id, tab: 'cases' });
    } else if (id.startsWith('EV-') || id.startsWith('E-')) {
      openApp('evidence-lab', { evidenceId: id });
    } else if (id.startsWith('MAIL-') || id.startsWith('EML-')) {
      openApp('police-mail', { emailId: id });
    } else if (id.startsWith('R-') || id.startsWith('INC-') || id.startsWith('P-') || id.startsWith('OFF-') || id.startsWith('VEH-')) {
      openApp('police-records', { recordId: id });
    }
  };

  return (
    <div className="w-80 sm:w-96 bg-slate-925 bg-slate-900/95 border-l border-slate-800 flex flex-col h-full overflow-hidden select-none font-sans text-slate-200 shadow-2xl">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow"
            style={{ backgroundColor: `${location.color}25`, border: `1px solid ${location.color}60` }}
          >
            <Icon name={location.icon} className="w-5 h-5" style={{ color: location.color }} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-100 truncate font-sans">
              {location.name}
            </h2>
            <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
              {location.districtName}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <Icon name="X" className="w-4 h-4" />
        </button>
      </div>

      {/* Action Bar */}
      <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handlePin}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-mono font-medium shadow transition-colors"
        >
          <Icon name="Pin" className="w-3.5 h-3.5" />
          <span>Pin to Board</span>
        </button>

        {location.recordId && (
          <button
            type="button"
            onClick={() => handleOpenRecord(location.recordId!)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono border border-slate-700 transition-colors"
          >
            <Icon name="Database" className="w-3.5 h-3.5 text-blue-400" />
            <span>PRIS Record</span>
          </button>
        )}
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Historical Status Card */}
        <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono mb-2">
            <span className="text-slate-400 uppercase">HISTORICAL STATUS:</span>
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800">
              ERA {activeEra}
            </span>
          </div>

          <div className="text-xs font-mono font-bold text-amber-300 tracking-wide uppercase">
            {currentHistoricalState?.statusDescription || 'ACTIVE MUNICIPAL RECORD'}
          </div>

          <div className="mt-2 text-xs font-mono text-slate-300">
            <span className="text-slate-400">Occupant / Entity: </span>
            <span>{currentHistoricalState?.occupantOrOwner || 'N/A'}</span>
          </div>

          <p className="mt-2 text-[11px] text-slate-400 leading-relaxed font-sans border-t border-slate-850 pt-2">
            {currentHistoricalState?.notes}
          </p>
        </div>

        {/* Location Metadata */}
        <div className="space-y-2 text-xs font-mono bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
          <div className="flex justify-between">
            <span className="text-slate-400">Address:</span>
            <span className="text-slate-200 text-right">{location.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Zone Type:</span>
            <span className="text-slate-200">{location.locationType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">GIS Grid Coord:</span>
            <span className="text-blue-400">
              X:{location.coordinates.x}, Y:{location.coordinates.y}
            </span>
          </div>
          {location.phone && (
            <div className="flex justify-between">
              <span className="text-slate-400">Phone Registry:</span>
              <span className="text-slate-200">{location.phone}</span>
            </div>
          )}
        </div>

        {/* Narrative Description */}
        <div>
          <h4 className="text-[11px] font-mono uppercase text-slate-400 mb-1">
            Site Description & Intelligence:
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-3 rounded border border-slate-800">
            {location.description}
          </p>
        </div>

        {/* Known Occupants / Businesses */}
        {(location.knownOccupants.length > 0 || location.knownBusinesses.length > 0) && (
          <div>
            <h4 className="text-[11px] font-mono uppercase text-slate-400 mb-1.5">
              Associated Persons & Entities:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {location.knownOccupants.map((occ, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300"
                >
                  {occ}
                </span>
              ))}
              {location.knownBusinesses.map((biz, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded bg-amber-950/60 border border-amber-800 text-[11px] font-mono text-amber-300"
                >
                  {biz}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cross-Referenced Evidence & Incidents */}
        {(location.caseIds.length > 0 ||
          location.incidentIds.length > 0 ||
          location.evidenceIds.length > 0 ||
          location.vehicleIds.length > 0 ||
          location.reportIds.length > 0) && (
          <div>
            <h4 className="text-[11px] font-mono uppercase text-slate-400 mb-1.5">
              Cross-Referenced Police Dockets:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {location.caseIds.map((cid) => (
                <button
                  key={cid}
                  type="button"
                  onClick={() => handleOpenRecord(cid)}
                  className="px-2 py-1 rounded bg-blue-950 hover:bg-blue-900 border border-blue-800 text-[11px] font-mono text-blue-300 transition-colors flex items-center gap-1"
                >
                  <span>{cid}</span>
                  <Icon name="ExternalLink" className="w-2.5 h-2.5" />
                </button>
              ))}

              {location.reportIds.map((rid) => (
                <button
                  key={rid}
                  type="button"
                  onClick={() => handleOpenRecord(rid)}
                  className="px-2 py-1 rounded bg-purple-950 hover:bg-purple-900 border border-purple-800 text-[11px] font-mono text-purple-300 transition-colors flex items-center gap-1"
                >
                  <span>{rid}</span>
                  <Icon name="ExternalLink" className="w-2.5 h-2.5" />
                </button>
              ))}

              {location.evidenceIds.map((eid) => (
                <button
                  key={eid}
                  type="button"
                  onClick={() => handleOpenRecord(eid)}
                  className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-[11px] font-mono text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <span>{eid}</span>
                  <Icon name="ExternalLink" className="w-2.5 h-2.5" />
                </button>
              ))}

              {location.vehicleIds.map((vid) => (
                <button
                  key={vid}
                  type="button"
                  onClick={() => handleOpenRecord(vid)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-slate-300 transition-colors flex items-center gap-1"
                >
                  <span>{vid}</span>
                  <Icon name="ExternalLink" className="w-2.5 h-2.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Related Department Memos & Correspondence */}
        {relatedEmails.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <Icon name="Mail" className="w-3.5 h-3.5 text-blue-400" />
                <span>Related Memos ({relatedEmails.length})</span>
              </h4>
              <button
                type="button"
                onClick={() => openApp('police-mail', { search: location.name })}
                className="text-[10px] font-mono text-blue-400 hover:underline flex items-center gap-0.5"
              >
                <span>Search in Mail</span>
                <Icon name="ExternalLink" className="w-2.5 h-2.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              {relatedEmails.slice(0, 3).map((em) => (
                <button
                  key={em.id}
                  type="button"
                  onClick={() => openApp('police-mail', { emailId: em.id })}
                  className="w-full text-left p-2 rounded bg-slate-950/70 hover:bg-slate-850/80 border border-slate-800 hover:border-slate-700 text-xs font-mono transition-colors flex items-center justify-between gap-2 group"
                >
                  <div className="min-w-0">
                    <span className="text-slate-200 group-hover:text-blue-300 font-medium block truncate text-[11px]">
                      {em.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                      {em.from.rank ? `${em.from.rank} ` : ''}{em.from.name} • {em.date.split(' ')[0]}
                    </span>
                  </div>
                  <Icon name="ChevronRight" className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
