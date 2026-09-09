import React from 'react';
import { Icon } from '../../common/Icon';
import { VehicleSightingPoint } from '../../../types/map';
import { useOS } from '../../../context/OSContext';

interface VehicleRouteTimelineProps {
  sightings: VehicleSightingPoint[];
  selectedSightingId: string | null;
  onSelectSighting: (id: string) => void;
  onFocusCoordinates: (x: number, y: number) => void;
}

export const VehicleRouteTimeline: React.FC<VehicleRouteTimelineProps> = ({
  sightings,
  selectedSightingId,
  onSelectSighting,
  onFocusCoordinates
}) => {
  const { openApp } = useOS();

  return (
    <div className="flex flex-col h-full bg-slate-950/90 text-slate-200 overflow-hidden font-sans border-t border-slate-800/80">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="Navigation" className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            VEHICLE TRAJECTORY & CAD LOG TIMELINE
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
          SEPT 14 - OCT 2, 1998
        </span>
      </div>

      {/* Sighting sequence */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sightings.map((sighting) => {
          const isSelected = sighting.id === selectedSightingId;

          return (
            <div
              key={sighting.id}
              onClick={() => {
                onSelectSighting(sighting.id);
                onFocusCoordinates(sighting.coordinates.x, sighting.coordinates.y);
              }}
              className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-slate-850 bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                  : sighting.isConflict
                  ? 'bg-amber-950/20 border-amber-900/60 hover:border-amber-700'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Row: Time, Step, Vehicle */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 font-mono text-[10px] font-bold flex items-center justify-center text-blue-400">
                    {sighting.stepOrder}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-100">
                    {sighting.time}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {sighting.date}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold border ${
                    sighting.vehicleId === 'VEH-TXR481'
                      ? 'bg-blue-950 text-blue-300 border-blue-800'
                      : 'bg-red-950 text-red-300 border-red-800'
                  }`}
                >
                  {sighting.licensePlate}
                </span>
              </div>

              {/* Location Name */}
              <div className="text-xs font-medium text-slate-200 font-sans">
                {sighting.locationName}
              </div>

              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                {sighting.address}
              </div>

              {/* Narrative */}
              <p className="text-[11px] text-slate-300/90 mt-2 leading-relaxed font-sans">
                {sighting.narrative}
              </p>

              {/* Contradiction Flag */}
              {sighting.isConflict && (
                <div className="mt-2 p-2 rounded bg-amber-950/60 border border-amber-800 text-[11px] text-amber-200 font-sans flex items-start gap-1.5">
                  <Icon name="AlertTriangle" className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase font-mono text-[10px] text-amber-400 block">
                      INVESTIGATIVE CONTRADICTION:
                    </span>
                    {sighting.conflictDetails}
                  </div>
                </div>
              )}

              {/* Footer info & cross-reference button */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>SRC: {sighting.source}</span>
                {sighting.reportId && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (sighting.reportId?.startsWith('R-')) {
                        openApp('police-records', { recordId: sighting.reportId });
                      } else if (sighting.reportId?.startsWith('INC-')) {
                        openApp('police-records', { recordId: sighting.reportId, tab: 'incidents' });
                      }
                    }}
                    className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                  >
                    <span>{sighting.reportId}</span>
                    <Icon name="ExternalLink" className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
