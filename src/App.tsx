/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { OSProvider, useOS } from './context/OSContext';
import { Desktop } from './components/desktop/Desktop';
import { TopPanel } from './components/desktop/TopPanel';
import { Dock } from './components/desktop/Dock';
import { WindowManager } from './components/desktop/WindowManager';
import { LockScreen } from './components/desktop/LockScreen';
import { AltTabSwitcher } from './components/desktop/AltTabSwitcher';
import { NotificationToasts } from './components/desktop/NotificationToasts';
import { MenuBackground } from './components/menu/MenuBackground';
import { MainMenuScreen } from './components/menu/MainMenuScreen';
import { BootTransitionScreen } from './components/menu/BootTransitionScreen';
import { ShutdownTransitionScreen } from './components/menu/ShutdownTransitionScreen';
import { RestartTransitionScreen } from './components/menu/RestartTransitionScreen';
import { HowToPlayScreen } from './components/menu/HowToPlayScreen';
import { GameSettingsScreen } from './components/menu/GameSettingsScreen';
import { CreditsScreen } from './components/menu/CreditsScreen';
import { InvestigatorOnboarding } from './components/desktop/InvestigatorOnboarding';
import { WorkstationTutorial } from './components/desktop/WorkstationTutorial';
import { CaseResolvedEpilogue } from './components/desktop/CaseResolvedEpilogue';
import { storyEngine } from './services/story/storyEngine';
import { playSound } from './services/soundService';
import { DeductionResult, StoryState } from './types/story';
import { Icon } from './components/common/Icon';

const CaseDesk: React.FC = () => {
  const { openApp } = useOS();
  const [open, setOpen] = useState(false);
  const [showDetermination, setShowDetermination] = useState(false);
  const [state, setState] = useState<StoryState>(() => storyEngine.getState());
  const [suspect, setSuspect] = useState('');
  const [crime, setCrime] = useState('');
  const [when, setWhen] = useState('');
  const [where, setWhere] = useState('');
  const [motive, setMotive] = useState('');
  const [method, setMethod] = useState('');
  const [evidence, setEvidence] = useState<string[]>([]);
  const [result, setResult] = useState<DeductionResult | null>(null);

  useEffect(() => storyEngine.subscribe(setState), []);

  const submit = () => {
    playSound('click');
    const next = storyEngine.submitDeduction({
      whoSuspectId: suspect,
      whatCrimeType: crime,
      whenDate: when,
      whereLocationId: where,
      whyMotive: motive,
      howMethod: method,
      keyEvidenceIds: evidence,
    });
    setResult(next);
  };

  const toggleEvidence = (id: string) => {
    setEvidence((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const resetDraft = () => {
    setSuspect(''); setCrime(''); setWhen(''); setWhere(''); setMotive(''); setMethod(''); setEvidence([]); setResult(null);
  };

  return (
    <>
      <div className="fixed left-4 bottom-16 z-[8000]">
        {!open ? (
          <button
            onClick={() => { playSound('click'); setOpen(true); }}
            className="bg-slate-950/95 border border-slate-700 rounded-lg px-3 py-2 shadow-2xl text-xs text-slate-200 flex items-center gap-2"
          >
            <Icon name="Scale" size={14} className="text-amber-300" />
            CASE 27 · YOUR DEDUCTION
          </button>
        ) : (
          <div className="w-[360px] max-w-[calc(100vw-2rem)] bg-slate-950/98 backdrop-blur border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-300">CASE 27 · DEDUCTION</div>
                <div className="text-[9px] text-slate-500 mt-1">No objective. No prescribed route.</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-200">×</button>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-[11px] text-slate-400 leading-relaxed">
                Read the records, search the workstation, follow the browser leads and build your own explanation. When you believe you know what happened, submit it.
              </div>
              <div className="text-[10px] text-slate-600 font-mono">CURRENT FILE · {state.currentAct >= 6 ? 'FINAL RECONSTRUCTION' : 'INVESTIGATION IN PROGRESS'}</div>
              <button
                onClick={() => { setShowDetermination(true); setResult(null); }}
                className="w-full px-3 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold"
              >
                Make a determination
              </button>
              <button
                onClick={() => openApp('investigation-notebook')}
                className="w-full px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[11px]"
              >
                Open investigation notebook
              </button>
            </div>
          </div>
        )}
      </div>

      {showDetermination && (
        <div className="fixed inset-0 z-[9500] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-[min(760px,100%)] max-h-[92vh] overflow-y-auto bg-slate-950 border border-slate-700 rounded-xl shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">FORMAL DETERMINATION</div>
                <h2 className="text-lg font-semibold text-slate-100 mt-1">What do you think happened?</h2>
              </div>
              <button onClick={() => setShowDetermination(false)} className="text-slate-500 hover:text-slate-200 text-xl">×</button>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="WHO" value={suspect} onChange={setSuspect} options={[['OFF-3014','Daniel Hayes'],['P-002891','Martha Gable'],['P-003102','Leo Vance'],['','Someone else / not established']]} />
              <Field label="WHAT" value={crime} onChange={setCrime} options={[['HOMICIDE_ABDUCTION','Abduction / homicide / tampering'],['MISSING_PERSON','Disappearance with unknown cause'],['EVIDENCE_TAMPERING','Evidence tampering only'],['','Not established']]} />
              <TextField label="WHEN" value={when} onChange={setWhen} placeholder="YYYY-MM-DD HH:MM" />
              <Field label="WHERE" value={where} onChange={setWhere} options={[['LOC-0042','42 Willow Street'],['CANAL-ROAD','Canal Road'],['BELL-ELECTRONICS','Bell Electronics'],['','Not established']]} />
              <Field label="WHY" value={motive} onChange={setMotive} options={[['SILENCE_AUDIT_EXPOSURE','Silence exposure of the audit / freight operation'],['PERSONAL_CONFLICT','Personal conflict'],['FINANCIAL_GAIN','Direct financial gain'],['','Not established']]} />
              <Field label="HOW" value={method} onChange={setMethod} options={[['POLICE_PULLOVER_INTERCEPTION','Police pull-over / interception'],['FORCED_ENTRY','Forced entry'],['VOLUNTARY_MEETING','Voluntary meeting'],['','Not established']]} />
              <div className="md:col-span-2 border-t border-slate-800 pt-4">
                <div className="text-[9px] uppercase tracking-widest text-slate-500 mb-3">KEY EXHIBITS YOU BELIEVE SUPPORT THE THEORY</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    ['E-004821','Physical / vehicle evidence'],
                    ['E-004823','Recovered documentary evidence'],
                    ['E-004829','Audit / timeline evidence'],
                    ['R-1998-112','Original disappearance report'],
                    ['CASE-1989-114','Internal Affairs cross-reference'],
                  ].map(([id, label]) => (
                    <label key={id} className="flex items-center gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-400 cursor-pointer hover:border-slate-600">
                      <input type="checkbox" checked={evidence.includes(id)} onChange={() => toggleEvidence(id)} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 flex gap-2 pt-2">
                <button onClick={submit} className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold">Submit determination</button>
                <button onClick={resetDraft} className="px-4 py-2 rounded bg-slate-800 border border-slate-700 text-slate-400 text-[11px]">Clear</button>
              </div>
            </div>
            {result && <DeductionResultPanel result={result} />}
          </div>
        </div>
      )}
    </>
  );
};

const TextField = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) => (
  <label className="block">
    <span className="text-[9px] uppercase tracking-widest text-slate-500">{label}</span>
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full bg-transparent border-b border-slate-700 focus:border-amber-500 outline-none text-sm text-slate-200 py-2" />
  </label>
);

const Field = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[][] }) => (
  <label className="block">
    <span className="text-[9px] uppercase tracking-widest text-slate-500">{label}</span>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-2 text-xs text-slate-200 outline-none focus:border-amber-500">
      <option value="">Select your theory...</option>
      {options.map(([id, text]) => <option key={id || text} value={id}>{text}</option>)}
    </select>
  </label>
);

const DeductionResultPanel = ({ result }: { result: DeductionResult }) => (
  <div className={`m-5 mt-0 border rounded-lg p-4 ${result.isFullyCorrect ? 'border-emerald-700 bg-emerald-950/20' : 'border-slate-700 bg-slate-900'}`}>
    <div className="flex items-center justify-between gap-3">
      <strong className="text-sm text-slate-100">{result.isFullyCorrect ? 'CASE RESOLVED' : `DETERMINATION · ${result.accuracyPercentage}%`}</strong>
      <span className="text-[9px] uppercase tracking-widest text-slate-500">Attempt recorded</span>
    </div>
    <p className="text-[10px] leading-relaxed text-slate-400 mt-2">{result.officialDetermination}</p>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
      {Object.entries(result.feedback).map(([key, text]) => <div key={key} className="p-2.5 bg-black/20 border border-slate-800 rounded"><div className="text-[8px] uppercase tracking-widest text-slate-600">{key}</div><div className="text-[10px] text-slate-400 mt-1 leading-relaxed">{text}</div></div>)}
    </div>
  </div>
);

const WorkstationOS: React.FC = () => {
  const { powerState, openApp } = useOS();
  const { gameSettings } = useGame();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showEpilogue, setShowEpilogue] = useState(false);

  useEffect(() => {
    if (powerState !== 'running') return;
    let onboardingTimer: number | undefined;
    let tutorialTimer: number | undefined;

    try {
      if (
        localStorage.getItem('investigator_os_story_state_v1') &&
        !localStorage.getItem('investigator_os_story_migrated_v2')
      ) {
        storyEngine.resetState();
        localStorage.removeItem('investigator_os_story_state_v1');
        localStorage.setItem('investigator_os_story_migrated_v2', 'true');
      }
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }

    if (!sessionStorage.getItem('investigator_onboarding_seen')) {
      onboardingTimer = window.setTimeout(() => setShowOnboarding(true), 500);
    } else if (!sessionStorage.getItem('investigator_workstation_tutorial_v3')) {
      tutorialTimer = window.setTimeout(() => setShowTutorial(true), 450);
    }

    return () => {
      if (onboardingTimer) window.clearTimeout(onboardingTimer);
      if (tutorialTimer) window.clearTimeout(tutorialTimer);
    };
  }, [powerState]);

  useEffect(() => {
    return storyEngine.subscribe((nextState) => {
      if (nextState.caseResolved && !sessionStorage.getItem('case_27_epilogue_seen')) {
        const timer = window.setTimeout(() => {
          if (!sessionStorage.getItem('case_27_epilogue_seen')) {
            playSound('success');
            setShowEpilogue(true);
          }
        }, 2200);
        return () => window.clearTimeout(timer);
      }
      return undefined;
    });
  }, []);

  const finishOnboarding = () => {
    setShowOnboarding(false);
    window.setTimeout(() => setShowTutorial(true), 350);
  };

  const finishTutorial = () => {
    try { sessionStorage.setItem('investigator_workstation_tutorial_v3', 'true'); } catch {}
    setShowTutorial(false);
  };

  if (powerState === 'locked' || powerState === 'logging_out') return <LockScreen />;

  return (
    <div className={`relative w-screen h-screen overflow-hidden select-none bg-slate-950 font-sans text-slate-100 ${gameSettings.highContrast ? 'contrast-125' : ''}`} style={{ transform: gameSettings.uiScale !== 1 ? `scale(${gameSettings.uiScale})` : undefined, transformOrigin: 'top left', width: gameSettings.uiScale !== 1 ? `${100 / gameSettings.uiScale}vw` : '100vw', height: gameSettings.uiScale !== 1 ? `${100 / gameSettings.uiScale}vh` : '100vh' }}>
      <TopPanel />
      <Desktop><WindowManager /></Desktop>
      <Dock />
      <AltTabSwitcher />
      <NotificationToasts />
      <CaseDesk />

      {showOnboarding && (
        <InvestigatorOnboarding
          onComplete={finishOnboarding}
          onOpenPRIS={() => { playSound('click'); openApp('police-records'); }}
        />
      )}
      {!showOnboarding && showTutorial && <WorkstationTutorial onFinish={finishTutorial} />}
      {showEpilogue && <CaseResolvedEpilogue onClose={() => { sessionStorage.setItem('case_27_epilogue_seen', 'true'); setShowEpilogue(false); }} />}

      {gameSettings.crtScanlines && <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-[9999]" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)', backgroundSize: '100% 3px' }} />}
    </div>
  );
};

const GameShell: React.FC = () => {
  const { powerState } = useOS();
  return powerState === 'off' ? <MainMenuScreen /> : <WorkstationOS />;
};

export const App: React.FC = () => (
  <GameProvider>
    <OSProvider>
      <GameShell />
    </OSProvider>
  </GameProvider>
);
