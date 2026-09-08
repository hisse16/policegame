import React, { useState } from 'react';
import { Icon } from '../../../common/Icon';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'compact' | 'large'>('normal');

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none font-mono">
      <div className="bg-slate-950 border border-slate-700 rounded-lg max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-slate-200">
            <Icon name="Settings" className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider">
              PRIS TERMINAL PREFERENCES
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400">
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">
              INTERFACE DENSITY & SCALE
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['compact', 'normal', 'large'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFontSize(s)}
                  className={`py-1.5 rounded border text-center uppercase font-bold transition-colors ${
                    fontSize === s
                      ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-slate-900 border border-slate-800">
            <div>
              <div className="text-slate-200 font-bold">HIGH CONTRAST MODE</div>
              <div className="text-[10px] text-slate-500">Enhanced CRT phosphorescent borders</div>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-blue-600"
            />
          </div>

          <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <div>TERMINAL ID: PRIS-NODE-07</div>
            <div>OPERATING SUBSYSTEM: LINUX WORKSTATION EMULATOR</div>
            <div>DATABASE ENGINE: PRIS IN-MEMORY RELATIONAL V4.2</div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
          >
            SAVE PREFERENCES
          </button>
        </div>
      </div>
    </div>
  );
};
