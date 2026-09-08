import React from 'react';
import { Icon } from '../../../common/Icon';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none font-mono">
      <div className="bg-slate-950 border border-slate-700 rounded-lg max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-blue-400">
            <Icon name="Shield" className="w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              PRIS OPERATIONAL MANUAL & REFERENCE GUIDE
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div>
            <h3 className="text-blue-300 font-bold uppercase mb-1">1. PURPOSE & ARCHIVE STRUCTURE</h3>
            <p>
              The Police Records & Investigation System (PRIS) is the municipal database for the Metropolitan Police Department. It maintains official registers of active and cold criminal investigations, person profiles, vehicle registrations, physical evidence vaults, and forensic incident reports.
            </p>
          </div>

          <div>
            <h3 className="text-blue-300 font-bold uppercase mb-1">2. SEARCH PROTOCOLS</h3>
            <p>
              Use the top Universal Search bar for instant lookups across all categories (e.g. entering "Anna Bell", "CASE-1998-027", "TXR-481", or "Willow Street"). For structured queries with date ranges and crime classifications, access the <strong>Advanced Search</strong> tool from the left navigation panel.
            </p>
          </div>

          <div>
            <h3 className="text-blue-300 font-bold uppercase mb-1">3. CASE 27 & COLD CASE PROTOCOLS</h3>
            <p>
              Pursuant to Directive CCU-2026-09, the 1998 disappearance of Anna Claire Bell has been reopened under lead investigator Detective S. Miller (#4081). Investigators are authorized to examine previously sealed evidence lockers, cross-check impound arrival logs, and file official annotations.
            </p>
          </div>

          <div>
            <h3 className="text-blue-300 font-bold uppercase mb-1">4. INVESTIGATION WALL & VFS EXPORT</h3>
            <p>
              The <strong>Investigation Board</strong> allows detectives to visually pin persons of interest, evidence items, and case dockets onto an interactive canvas connected with investigative yarn. Furthermore, any record may be exported directly to the local workstation filesystem in <code>/home/investigator/Documents/Police Records/</code>.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
          >
            ACKNOWLEDGE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
