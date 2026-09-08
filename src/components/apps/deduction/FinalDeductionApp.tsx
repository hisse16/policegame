import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { storyEngine } from '../../../services/story/storyEngine';
import { DeductionSubmission, DeductionResult } from '../../../types/story';

interface FinalDeductionAppProps {
  onClose?: () => void;
  onOpenRecord?: (recordId: string) => void;
}

export const FinalDeductionApp: React.FC<FinalDeductionAppProps> = ({ onClose, onOpenRecord }) => {
  const [who, setWho] = useState<string>('OFF-3014');
  const [what, setWhat] = useState<string>('HOMICIDE_ABDUCTION');
  const [when, setWhen] = useState<string>('1998-09-14 22:38');
  const [where, setWhere] = useState<string>('LOC-0042');
  const [why, setWhy] = useState<string>('SILENCE_AUDIT_EXPOSURE');
  const [how, setHow] = useState<string>('POLICE_PULLOVER_INTERCEPTION');
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([
    'E-004821',
    'E-004823',
    'E-004829'
  ]);
  const [result, setResult] = useState<DeductionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toggleEvidence = (id: string) => {
    if (selectedEvidence.includes(id)) {
      setSelectedEvidence(selectedEvidence.filter((e) => e !== id));
    } else {
      setSelectedEvidence([...selectedEvidence, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const submission: DeductionSubmission = {
        whoSuspectId: who,
        whatCrimeType: what,
        whenDate: when,
        whereLocationId: where,
        whyMotive: why,
        howMethod: how,
        keyEvidenceIds: selectedEvidence
      };

      const res = storyEngine.submitDeduction(submission);
      setResult(res);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-text overflow-y-auto">
      {/* Top Banner */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-950/80 border border-red-800 text-red-400 rounded">
            <Icon name="CheckSquare" size={16} />
          </div>
          <div>
            <div className="font-bold text-xs tracking-wide uppercase text-slate-200">
              OFFICIAL CASE DETERMINATION TERMINAL
            </div>
            <div className="text-[10px] text-slate-400">
              DOCKET CASE-1998-027 // PROSECUTORIAL REFERRAL FILING
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
          >
            Return to Workstation
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6 flex-1 w-full">
        {/* Intro Instructions */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
          <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Icon name="Shield" size={14} className="text-blue-400" />
            <span>INVESTIGATIVE DEDUCTION SYNTHESIS</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Submit your formalized probable cause determination to the State Attorney General Special
            Prosecutions Unit. All assertions must be supported by recovered physical evidence, CAD
            transmissions, and corroborated witness statements.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WHO */}
            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2">
              <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider">
                1. PRIMARY PERPETRATOR (WHO)
              </label>
              <select
                value={who}
                onChange={(e) => setWho(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="OFF-3014">Detective Daniel Hayes (OFF-3014) - Lead Investigator</option>
                <option value="P-006219">Daniel Mercer (P-006219) - Warehouse Operations Supervisor</option>
                <option value="OFF-1012">Captain Arthur Vance (OFF-1012) - Detective Bureau Commander</option>
                <option value="OFF-1044">Detective John Mercer (OFF-1044) - Retired 1987 Burglary Detective</option>
                <option value="P-004822">Michael Bell (P-004822) - Brother / Registered Vehicle Owner</option>
                <option value="P-003102">Leo Vance (P-003102) - Diner Witness</option>
              </select>
              <p className="text-[11px] text-slate-400">
                The primary actor who initiated the intercept and was physically present at the scene.
              </p>
            </div>

            {/* WHAT */}
            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2">
              <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider">
                2. PRIMARY OFFENSE CLASSIFICATION (WHAT)
              </label>
              <select
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="HOMICIDE_ABDUCTION">
                  Kidnapping, Homicide & Evidence Tampering
                </option>
                <option value="SIMPLE_MISSING_PERSON">Unexplained Voluntary Disappearance</option>
                <option value="COMMERCIAL_BURGLARY">Unrelated Warehouse Larceny</option>
                <option value="VEHICLE_THEFT">Joyriding & Vehicle Abandonment</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Statutory classification representing the criminal acts committed against Anna Claire Bell.
              </p>
            </div>

            {/* WHEN */}
            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2">
              <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider">
                3. CRITICAL TIMING INTERVAL (WHEN)
              </label>
              <select
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="1998-09-14 22:38">
                  September 14, 1998 (22:38 - 22:50 CAD dispatch window)
                </option>
                <option value="1998-09-14 21:30">September 14, 1998 (21:30 - Departure from Bell Electronics)</option>
                <option value="1998-09-15 09:15">September 15, 1998 (09:15 - Initial Welfare Check)</option>
                <option value="1998-10-02 08:20">October 2, 1998 (Vehicle Recovery at Canal Road)</option>
              </select>
              <p className="text-[11px] text-slate-400">
                The exact interval during which the unlawful traffic pullover and abduction took place.
              </p>
            </div>

            {/* WHERE */}
            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2">
              <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider">
                4. PRIMARY INTERCEPTION SITE (WHERE)
              </label>
              <select
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="LOC-0042">42 Willow Street / Willow & 4th Avenue</option>
                <option value="LOC-0400">Canal Road Culvert & Canal Storage</option>
                <option value="ORG-0012">104 Waterfront Way (Bell Electronics Parking Lot)</option>
                <option value="LOC-0001">Northbridge Central Station Rail Yard</option>
              </select>
              <p className="text-[11px] text-slate-400">
                The physical street coordinates where the victim was stopped and taken into custody.
              </p>
            </div>

            {/* WHY */}
            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2">
              <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider">
                5. MOTIVATING IMPULSE (WHY)
              </label>
              <select
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="SILENCE_AUDIT_EXPOSURE">
                  Prevent Exposure of Bell Electronics / Crownline Police Protection Ring
                </option>
                <option value="PERSONAL_DISPUTE">Domestic or Family Altercation with Brother</option>
                <option value="RANDOM_ROBBERY">Opportunistic Armed Robbery for Personal Valuables</option>
                <option value="LABOR_PROTEST">Disgruntled Former Factory Employees</option>
              </select>
              <p className="text-[11px] text-slate-400">
                The underlying corrupt enterprise that necessitated silencing the victim.
              </p>
            </div>

            {/* HOW */}
            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2">
              <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider">
                6. METHOD OF EXECUTION (HOW)
              </label>
              <select
                value={how}
                onChange={(e) => setHow(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="POLICE_PULLOVER_INTERCEPTION">
                  Pretextual Traffic Pullover in Marked Squad Car, Followed by Staging Vehicle
                </option>
                <option value="HOME_INVASION">Forced Entry through Rear Kitchen Window</option>
                <option value="PARKING_AMBUSH">Ambush inside Workplace Parking Lot</option>
                <option value="ROADSIDE_BREAKDOWN">Assistance given to Stalled Vehicle</option>
              </select>
              <p className="text-[11px] text-slate-400">
                How authority and police equipment were exploited to intercept the victim without public alarm.
              </p>
            </div>
          </div>

          {/* KEY EVIDENCE SELECTION */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg space-y-3">
            <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider">
              7. FOUNDATIONAL EVIDENCE DOCKETS (SELECT SUPPORTING EXHIBITS)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {[
                { id: 'E-004821', title: 'Brass Key "CS-14" & Cassette', type: 'Physical Evidence' },
                { id: 'E-004823', title: 'Lab Tape Dictation Transcript', type: 'Audio Analysis' },
                { id: 'E-004829', title: 'Canal Storage Duplicate Ledgers', type: 'Financial Exhibits' },
                { id: 'R-1998-112', title: 'Report R-1998-112 Audit Header', type: 'Tampered Document' },
                { id: 'CASE-1989-114', title: 'Classified 1989 IA Docket', type: 'Police Records' },
                { id: 'VEH-1987-0481', title: 'Taurus Impound Sheet (TXR-481)', type: 'Vehicle Recovery' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleEvidence(item.id)}
                  className={`p-2.5 text-left rounded border transition-colors flex items-start gap-2 ${
                    selectedEvidence.includes(item.id)
                      ? 'bg-blue-950/80 border-blue-600 text-blue-100'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 mt-0.5 rounded flex items-center justify-center border text-[10px] ${
                      selectedEvidence.includes(item.id)
                        ? 'bg-blue-600 border-blue-400 text-white font-bold'
                        : 'border-slate-700'
                    }`}
                  >
                    {selectedEvidence.includes(item.id) && '✓'}
                  </div>
                  <div>
                    <div className="font-bold text-xs">{item.title}</div>
                    <div className="text-[10px] font-mono text-slate-500">
                      [{item.id}] • {item.type}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 italic">
              Official filings are logged into the Northbridge Police Records System audit ledger.
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-colors disabled:opacity-50"
            >
              <Icon name="CheckSquare" size={15} />
              <span>{isSubmitting ? 'Evaluating Case Record...' : 'Submit Official Determination'}</span>
            </button>
          </div>
        </form>

        {/* RESULTS EVALUATION SCREEN */}
        {result && (
          <div
            className={`p-6 rounded-lg border space-y-5 ${
              result.isFullyCorrect
                ? 'bg-emerald-950/40 border-emerald-700/80 text-emerald-100'
                : 'bg-slate-900 border-amber-800/80 text-slate-200'
            }`}
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded ${
                    result.isFullyCorrect
                      ? 'bg-emerald-900 text-emerald-300'
                      : 'bg-amber-950 text-amber-400'
                  }`}
                >
                  <Icon name={result.isFullyCorrect ? 'Award' : 'AlertTriangle'} size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    {result.isFullyCorrect
                      ? 'PROSECUTORIAL DETERMINATION ACCEPTED // CASE RESOLVED'
                      : 'INCONCLUSIVE PROBABLE CAUSE // PARTIAL FINDINGS RETURNED'}
                  </h3>
                  <div className="text-xs font-mono opacity-80">
                    Confidence Metric: {result.accuracyPercentage}% • Evidence Weight: {result.evidenceScore}%
                  </div>
                </div>
              </div>

              <span className="text-xs font-mono px-2.5 py-1 bg-slate-950 rounded border border-slate-800">
                {result.isFullyCorrect ? 'STATUS: CLOSED (SOLVED)' : 'STATUS: REMANDED FOR REVIEW'}
              </span>
            </div>

            {/* Official Feedback Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div
                className={`p-3 rounded border ${
                  result.whoCorrect ? 'bg-emerald-950/30 border-emerald-800' : 'bg-red-950/30 border-red-900'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <span>{result.whoCorrect ? '✓' : '✗'} 1. PERPETRATOR:</span>
                </div>
                <p className="opacity-90">{result.feedback.who}</p>
              </div>

              <div
                className={`p-3 rounded border ${
                  result.whatCorrect ? 'bg-emerald-950/30 border-emerald-800' : 'bg-red-950/30 border-red-900'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <span>{result.whatCorrect ? '✓' : '✗'} 2. OFFENSE:</span>
                </div>
                <p className="opacity-90">{result.feedback.what}</p>
              </div>

              <div
                className={`p-3 rounded border ${
                  result.whenCorrect ? 'bg-emerald-950/30 border-emerald-800' : 'bg-red-950/30 border-red-900'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <span>{result.whenCorrect ? '✓' : '✗'} 3. TIMING:</span>
                </div>
                <p className="opacity-90">{result.feedback.when}</p>
              </div>

              <div
                className={`p-3 rounded border ${
                  result.whereCorrect ? 'bg-emerald-950/30 border-emerald-800' : 'bg-red-950/30 border-red-900'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <span>{result.whereCorrect ? '✓' : '✗'} 4. LOCATION:</span>
                </div>
                <p className="opacity-90">{result.feedback.where}</p>
              </div>

              <div
                className={`p-3 rounded border ${
                  result.whyCorrect ? 'bg-emerald-950/30 border-emerald-800' : 'bg-red-950/30 border-red-900'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <span>{result.whyCorrect ? '✓' : '✗'} 5. MOTIVE:</span>
                </div>
                <p className="opacity-90">{result.feedback.why}</p>
              </div>

              <div
                className={`p-3 rounded border ${
                  result.howCorrect ? 'bg-emerald-950/30 border-emerald-800' : 'bg-red-950/30 border-red-900'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <span>{result.howCorrect ? '✓' : '✗'} 6. METHOD:</span>
                </div>
                <p className="opacity-90">{result.feedback.how}</p>
              </div>
            </div>

            {/* Official Decree Summary */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded space-y-2 text-xs">
              <div className="font-bold text-slate-200 uppercase tracking-wide">
                JUDICIAL DETERMINATION SUMMARY
              </div>
              <p className="text-slate-300 leading-relaxed font-mono">
                {result.officialDetermination}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
