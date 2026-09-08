import React from 'react';
import { Icon } from '../../../common/Icon';
import { VehicleRecord, AnyRecord } from '../../../../types/police';
import { policeDatabase } from '../../../../services/police/databaseEngine';

interface VehicleDetailViewProps {
  vehicle: VehicleRecord;
  onSelectRecord: (id: string) => void;
  onExportRecord: (record: AnyRecord) => void;
  onBack: () => void;
}

export const VehicleDetailView: React.FC<VehicleDetailViewProps> = ({
  vehicle,
  onSelectRecord,
  onExportRecord,
  onBack
}) => {
  const isBookmarked = policeDatabase.isBookmarked(vehicle.id);
  const owner = vehicle.ownerId ? policeDatabase.getRecord(vehicle.ownerId) : null;

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
            <span>VEHICLES</span>
            <span>/</span>
            <span className="text-slate-200 font-bold">{vehicle.licensePlate}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => policeDatabase.toggleBookmark(vehicle.id)}
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
              onClick={() => onExportRecord(vehicle)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              <Icon name="Download" className="w-3.5 h-3.5" />
              <span>EXPORT VEHICLE RECORD</span>
            </button>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-100">{vehicle.year} {vehicle.make} {vehicle.model}</span>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-800">
                PLATE: {vehicle.licensePlate}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {vehicle.vehicleStatus}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1">VIN: {vehicle.vin} • Color: {vehicle.color}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl custom-scrollbar bg-slate-900/40">
        {/* Registration & Owner */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Icon name="User" className="w-4 h-4 text-blue-400" />
            <span>Registered Owner Information</span>
          </h3>
          {owner ? (
            <div
              onClick={() => onSelectRecord(owner.id)}
              className="p-4 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-blue-400 hover:underline">{owner.title}</div>
                <span className="text-xs text-slate-400">ID: {owner.id}</span>
              </div>
              <div className="text-xs text-slate-300 mt-1">Registered Address: {vehicle.registeredAddress}</div>
            </div>
          ) : (
            <div className="text-xs text-slate-400">Owner identity unlisted or pending transfer verification.</div>
          )}
        </div>

        {/* Impound / Towing Details if applicable */}
        {vehicle.impoundDetails && (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Icon name="AlertTriangle" className="w-4 h-4 text-amber-400" />
              <span>Municipal Impound & Towing Ledger</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">LOT LOCATION</span>
                <span className="text-slate-200 font-semibold">{vehicle.impoundDetails.lot}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">DATE IMPOUNDED</span>
                <span className="text-slate-200 font-semibold">{vehicle.impoundDetails.date}</span>
              </div>
            </div>
            <div className="mt-3 p-3 bg-slate-900 rounded border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-500 text-[10px] block mb-1">IMPOUND REASON</span>
              {vehicle.impoundDetails.reason}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
