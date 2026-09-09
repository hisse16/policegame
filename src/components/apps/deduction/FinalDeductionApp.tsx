import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../common/Icon';
import { storyEngine } from '../../../services/story/storyEngine';
import { DeductionSubmission, DeductionResult, DeductionReadiness } from '../../../types/story';

interface FinalDeductionAppProps {
  onClose?: () => void;
  onOpenRecord?: (recordId: string) => void;
}

const EMPTY = '';

export const FinalDeductionApp: React.FC<FinalDeductionAppProps> = ({ onClose, onOpenRecord }) => {
  const [who, setWho] = useState(EMPTY);
  const [what, setWhat] = useState(EMPTY);
  const [when, setWhen] = useState(EMPTY);
  const [where, setWhere] = useState(EMPTY);
  const [why, setWhy] = useState(EMPTY);
  const [how, setHow] = useState(EMPTY);
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [result, setResult] = useState<DeductionResult | null>(null);
  const [readiness, setReadiness] = useState<DeductionReadiness>(() => storyEngine.getDeductionReadiness());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => storyEngine.subscribe(() => setReadiness(storyEngine.getDeductionReadiness())), []);

  const evidenceItems = useMemo(() => [
    { id: 'E-004821', title: 'CS-14 key & micro-cassette', type: 'Physical evidence' },
    { id: 'E-004823', title: 'Forensic tape transcript', type: 'Audio analysis' },
    { id: 'E-004829', title: 'Canal storage duplicate ledgers', type: 'Financial evidence' },
    { id: 'R-1998-112', title: 'Report R-1998-112 audit header', type: 'Document' },
    { id: 'CASE-1989-114', title: 'Internal Affairs docket', type: 'Restricted record' },
    { id: 'VEH-1987-0481', title: 'Taurus impound sheet TXR-481', type: 'Vehicle record' }
  ], []);

  const requiredEvidenceSelected = readiness.requiredEvidenceIds.length > 0 && readiness.requiredEvidenceIds.every((id) => selectedEvidence.includes(id));

  const toggleEvidence = (id: string) => setSelectedEvidence((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);

  const resetDraft = () => {
    setWho(EMPTY); setWhat(EMPTY); setWhen(EMPTY); setWhere(EMPTY); setWhy(EMPTY); setHow(EMPTY);
    setSelectedEvidence([]); setResult(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!readiness.ready || !requiredEvidenceSelected || !who || !what || !when || !where || !why || !how) return;
    setIsSubmitting(true);
    window.setTimeout(() => {
      const submission: DeductionSubmission = { whoSuspectId: who, whatCrimeType: what, whenDate: when, whereLocationId: where, whyMotive: why, howMethod: how, keyEvidenceIds: selectedEvidence };
      setResult(storyEngine.submitDeduction(submission));
      setIsSubmitting(false);
    }, 350);
  };

  const fieldClass = 'w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500';

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-text overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-950/80 border border-red-800 text-red-400 rounded"><Icon name="CheckSquare" size={16} /></div>
          <div><div className="font-bold text-xs tracking-wide uppercase">FINAL CASE RECONSTRUCTION</div><div className="text-[10px] text-slate-400">CASE-1998-027 // EVIDENCE-LED DETERMINATION</div></div>
        </div>
        {onClose && <button onClick={onClose} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs">Return to Workstation</button>}
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-5 w-full">
        <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between gap-3">
            <div><div className="text-xs font-bold text-slate-200 uppercase tracking-wide">Build the case you believe the evidence proves</div><p className="text-[11px] text-slate-400 mt-1">There is no default answer. Every assertion must be supported by the reconstructed record.</p></div>
            <div className={`shrink-0 px-2 py-1 rounded border text-[10px] font-mono ${readiness.ready ? 'bg-emerald-950 border-emerald-800 text-emerald-300' : 'bg-amber-950 border-amber-800 text-amber-300'}`}>{readiness.ready ? 'RECONSTRUCTION READY' : `ACT ${readiness.currentAct} // INCOMPLETE`}</div>
          </div>
          {!readiness.ready && <div className="mt-3 space-y-1 text-[11px] text-amber-200">{readiness.reasons.map((reason, index) => <div key={index}>• {reason}</div>)}</div>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="p-3 bg-slate-900/70 border border-slate-800 rounded space-y-2"><span className="block text-[10px] font-bold text-blue-400 uppercase">Who</span><select value={who} onChange={(e) => setWho(e.target.value)} className={fieldClass}><option value="">Select the person established by the evidence…</option><option value="OFF-3014">Detective Daniel Hayes</option><option value="P-006219">Daniel Mercer</option><option value="OFF-1012">Captain Arthur Vance</option><option value="OFF-1044">Detective John Mercer</option><option value="P-004822">Michael Bell</option><option value="P-003102">Leo Vance</option></select></label>
            <label className="p-3 bg-slate-900/70 border border-slate-800 rounded space-y-2"><span className="block text-[10px] font-bold text-blue-400 uppercase">What</span><select value={what} onChange={(e) => setWhat(e.target.value)} className={fieldClass}><option value="">Select the offense…</option><option value="HOMICIDE_ABDUCTION">Kidnapping, homicide & evidence tampering</option><option value="SIMPLE_MISSING_PERSON">Unexplained voluntary disappearance</option><option value="COMMERCIAL_BURGLARY">Commercial burglary</option><option value="VEHICLE_THEFT">Vehicle theft</option></select></label>
            <label className="p-3 bg-slate-900/70 border border-slate-800 rounded space-y-2"><span className="block text-[10px] font-bold text-blue-400 uppercase">When</span><select value={when} onChange={(e) => setWhen(e.target.value)} className={fieldClass}><option value="">Select the reconstructed date…</option><option value="1998-09-14 22:38">September 14, 1998 — late-night dispatch window</option><option value="1998-09-14 21:30">September 14, 1998 — departure from Bell Electronics</option><option value="1998-09-15 09:15">September 15, 1998 — welfare check</option><option value="1998-10-02 08:20">October 2, 1998 — vehicle recovery</option></select></label>
            <label className="p-3 bg-slate-900/70 border border-slate-800 rounded space-y-2"><span className="block text-[10px] font-bold text-blue-400 uppercase">Where</span><select value={where} onChange={(e) => setWhere(e.target.value)} className={fieldClass}><option value="">Select the primary site…</option><option value="LOC-0042">42 Willow Street</option><option value="LOC-0400">Canal Road / Canal Storage</option><option value="ORG-0012">Bell Electronics — 104 Waterfront Way</option><option value="LOC-0001">Northbridge Central Station</option></select></label>
            <label className="p-3 bg-slate-900/70 border border-slate-800 rounded space-y-2"><span className="block text-[10px] font-bold text-blue-400 uppercase">Why</span><select value={why} onChange={(e) => setWhy(e.target.value)} className={fieldClass}><option value="">Select the motive established by the chain…</option><option value="SILENCE_AUDIT_EXPOSURE">Prevent exposure of the Bell Electronics / Crownline operation</option><option value="PERSONAL_DISPUTE">Personal or family dispute</option><option value="RANDOM_ROBBERY">Opportunistic robbery</option><option value="LABOR_PROTEST">Labor dispute</option></select></label>
            <label className="p-3 bg-slate-900/70 border border-slate-800 rounded space-y-2"><span className="block text-[10px] font-bold text-blue-400 uppercase">How</span><select value={how} onChange={(e) => setHow(e.target.value)} className={fieldClass}><option value="">Select the method established by the records…</option><option value="POLICE_PULLOVER_INTERCEPTION">Pretextual traffic stop followed by interception</option><option value="HOME_INVASION">Forced entry at the residence</option><option value="PARKING_AMBUSH">Workplace parking ambush</option><option value="ROADSIDE_BREAKDOWN">Roadside assistance deception</option></select></label>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between"><div><div className="text-[10px] font-bold text-blue-400 uppercase">Evidence chain</div><div className="text-[11px] text-slate-400">Select the exhibits that make your conclusion defensible. All five required exhibits must be selected.</div></div><span className="text-[10px] font-mono text-slate-500">{selectedEvidence.length} selected</span></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {evidenceItems.map((item) => {
                const selected = selectedEvidence.includes(item.id);
                const required = readiness.requiredEvidenceIds.includes(item.id);
                return <button type="button" key={item.id} onClick={() => toggleEvidence(item.id)} className={`p-2.5 text-left rounded border transition-colors ${selected ? 'bg-blue-950/70 border-blue-600 text-blue-100' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}><div className="flex gap-2"><span className={`w-3.5 h-3.5 mt-0.5 rounded border flex items-center justify-center text-[9px] ${selected ? 'bg-blue-600 border-blue-400 text-white' : 'border-slate-700'}`}>{selected ? '✓' : ''}</span><span><span className="block text-xs font-bold">{item.title}{required && <span className="ml-1 text-[9px] uppercase text-amber-400">Required</span>}</span><span className="block text-[10px] font-mono text-slate-500">{item.id} • {item.type}</span></span></div></button>;
              })}
            </div>
            {!requiredEvidenceSelected && readiness.ready && <div className="text-[11px] text-amber-300">Complete the required evidence chain before submitting the reconstruction.</div>}
          </div>

          <div className="flex items-center justify-between gap-3 pt-1"><button type="button" onClick={resetDraft} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300">Clear draft</button><button type="submit" disabled={!readiness.ready || !requiredEvidenceSelected || isSubmitting || !who || !what || !when || !where || !why || !how} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded font-bold text-xs uppercase tracking-wider">{isSubmitting ? 'Evaluating…' : 'Submit Reconstruction'}</button></div>
        </form>

        {result && <div className={`p-5 rounded-lg border space-y-4 ${result.isFullyCorrect ? 'bg-emerald-950/40 border-emerald-700/80' : 'bg-slate-900 border-amber-800/80'}`}>
          <div className="flex items-center justify-between"><div><div className="text-sm font-bold uppercase tracking-wide">{result.isFullyCorrect ? 'Reconstruction accepted' : 'Reconstruction returned'}</div><div className="text-[10px] font-mono text-slate-400">Confidence {result.accuracyPercentage}% • Evidence {result.evidenceScore}%</div></div><span className="text-xs font-mono">{result.isFullyCorrect ? 'CASE RESOLVED' : 'REVIEW REQUIRED'}</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">{[['WHO', result.whoCorrect, result.feedback.who], ['WHAT', result.whatCorrect, result.feedback.what], ['WHEN', result.whenCorrect, result.feedback.when], ['WHERE', result.whereCorrect, result.feedback.where], ['WHY', result.whyCorrect, result.feedback.why], ['HOW', result.howCorrect, result.feedback.how]].map(([label, ok, text]) => <div key={String(label)} className={`p-3 rounded border ${ok ? 'bg-emerald-950/30 border-emerald-800' : 'bg-red-950/30 border-red-900'}`}><div className="font-bold mb-1">{ok ? '✓' : '✗'} {label}</div><p className="text-slate-300">{String(text)}</p></div>)}</div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 font-mono">{result.officialDetermination}</div>
          {!result.isFullyCorrect && <div className="text-[11px] text-slate-400">Do not treat a failed submission as a game-over. Return to the records, compare the conflicting sources, and reconstruct the chain again.</div>}
        </div>}
      </div>
    </div>
  );
};
