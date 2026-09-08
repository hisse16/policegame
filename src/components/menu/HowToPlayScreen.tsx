import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { audioSystem } from '../../services/audioSystem';
import { Icon } from '../common/Icon';

type SectionKey = 'basic' | 'computer' | 'files' | 'browser' | 'terminal' | 'investigation';

export const HowToPlayScreen: React.FC = () => {
  const { returnToMainMenu } = useGame();
  const [activeSection, setActiveSection] = useState<SectionKey>('basic');

  // Mini interactive demonstrations state
  const [demoWindowStatus, setDemoWindowStatus] = useState<'normal' | 'minimized' | 'maximized'>('normal');
  const [demoFileDropped, setDemoFileDropped] = useState(false);
  const [demoBrowserUrl, setDemoBrowserUrl] = useState('https://search.local/');
  const [demoBrowserInput, setDemoBrowserInput] = useState('');
  const [demoTerminalInput, setDemoTerminalInput] = useState('');
  const [demoTerminalOutput, setDemoTerminalOutput] = useState<string[]>(['Type "help" or "ls" to test...']);

  // Handle ESC key to return
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        returnToMainMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [returnToMainMenu]);

  const sections: { key: SectionKey; title: string; icon: string }[] = [
    { key: 'basic', title: 'Basic Controls', icon: 'MousePointer' },
    { key: 'computer', title: 'Computer & Windows', icon: 'Monitor' },
    { key: 'files', title: 'File Management', icon: 'Folder' },
    { key: 'browser', title: 'Web Browser', icon: 'Globe' },
    { key: 'terminal', title: 'Terminal Shell', icon: 'Terminal' },
    { key: 'investigation', title: 'Investigation Protocol', icon: 'Shield' }
  ];

  const handleDemoTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = demoTerminalInput.trim().toLowerCase();
    if (!cmd) return;

    audioSystem.playMenuClick();
    let res = '';
    if (cmd === 'help') {
      res = 'Available demo commands: help, ls, cat, clear, date';
    } else if (cmd === 'ls') {
      res = 'case_notes.txt  evidence_log.csv  suspect_photo.svg';
    } else if (cmd === 'cat case_notes.txt' || cmd.startsWith('cat')) {
      res = 'CASE 27 NOTE: Inspect timestamps in browser history.';
    } else if (cmd === 'date') {
      res = 'Tue Sep 08 03:00:00 EST 2026';
    } else if (cmd === 'clear') {
      setDemoTerminalOutput([]);
      setDemoTerminalInput('');
      return;
    } else {
      res = `bash: ${cmd}: command not found. Try "help".`;
    }

    setDemoTerminalOutput((prev) => [...prev, `investigator@workstation:~$ ${cmd}`, res]);
    setDemoTerminalInput('');
  };

  return (
    <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-12 max-w-6xl mx-auto text-slate-200 select-none animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest">
            <Icon name="BookOpen" className="w-3.5 h-3.5" />
            <span>OPERATIONAL MANUAL // WORKSTATION GUIDE</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">
            How to Operate the Workstation
          </h1>
        </div>

        <button
          onClick={returnToMainMenu}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300 hover:text-white text-xs transition-all shadow-md"
        >
          <Icon name="ArrowLeft" className="w-3.5 h-3.5" />
          <span>Back to Menu (Esc)</span>
        </button>
      </div>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 my-6 overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-56 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {sections.map((sec) => {
            const isActive = activeSection === sec.key;
            return (
              <button
                key={sec.key}
                onClick={() => {
                  audioSystem.playMenuClick();
                  setActiveSection(sec.key);
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-left transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon
                  name={sec.icon}
                  className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`}
                />
                <span>{sec.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Display Area */}
        <div className="flex-1 bg-slate-900/70 border border-slate-800/90 rounded-xl p-6 md:p-8 overflow-y-auto backdrop-blur-xs flex flex-col justify-between space-y-6">
          {/* 1. Basic Controls */}
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Icon name="MousePointer" className="w-4 h-4 text-blue-400" />
                <span>Primary Interface & Pointer Controls</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Left Click</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Select files, focus active windows, click hyperlinks in the browser, and interact with menus and toolbars.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Double Click</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Open desktop icons, launch applications, open folders in File Manager, or view documents in text editor.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Right Click</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Open contextual actions (file options, renaming, bookmarks management, tab controls, copy and paste).
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Drag & Drop</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Relocate windows by dragging titlebars, move files between directories or into the Trash, and select multiple items.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Computer & Windows */}
          {activeSection === 'computer' && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Icon name="Monitor" className="w-4 h-4 text-blue-400" />
                <span>Window Management & Multitasking</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                The workstation runs a multitasking environment with standard Linux-style window controls. Windows can be moved, stacked, minimized to the bottom dock, and maximized.
              </p>

              {/* Interactive Window Demonstration */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>INTERACTIVE DEMO: TRY THE WINDOW CONTROLS</span>
                  <span className="text-blue-400 font-semibold uppercase">{demoWindowStatus}</span>
                </div>
                <div
                  className={`bg-slate-900 border border-slate-700 rounded-lg overflow-hidden transition-all duration-200 shadow-lg ${
                    demoWindowStatus === 'minimized'
                      ? 'h-10 opacity-60'
                      : demoWindowStatus === 'maximized'
                      ? 'w-full h-36'
                      : 'w-72 h-32'
                  }`}
                >
                  <div className="h-8 bg-slate-800 px-3 flex items-center justify-between border-b border-slate-700">
                    <span className="text-[11px] font-medium text-slate-200 truncate">
                      Sample Case File Window
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          audioSystem.playMenuClick();
                          setDemoWindowStatus(demoWindowStatus === 'minimized' ? 'normal' : 'minimized');
                        }}
                        title="Minimize"
                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                      >
                        <Icon name="Minus" className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          audioSystem.playMenuClick();
                          setDemoWindowStatus(demoWindowStatus === 'maximized' ? 'normal' : 'maximized');
                        }}
                        title="Maximize"
                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                      >
                        <Icon name="Square" className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={() => {
                          audioSystem.playMenuClick();
                          setDemoWindowStatus('normal');
                        }}
                        title="Reset Window"
                        className="p-1 hover:bg-rose-900/60 rounded text-slate-400 hover:text-rose-300"
                      >
                        <Icon name="X" className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  {demoWindowStatus !== 'minimized' && (
                    <div className="p-3 text-[11px] text-slate-400 space-y-1">
                      <div>Status: Window responsive and active.</div>
                      <div className="text-[10px] text-slate-500">Shortcut: Use Alt+Tab to switch active applications.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. File System */}
          {activeSection === 'files' && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Icon name="Folder" className="w-4 h-4 text-blue-400" />
                <span>Forensic File System (VFS)</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                All documents, system logs, evidence photos, and downloaded files live in the virtual file system. Files persist between sessions and can be organized freely.
              </p>

              {/* Interactive File Drop Demonstration */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-[11px] font-mono text-slate-400">
                  INTERACTIVE DEMO: FILE RELOCATION
                </div>
                <div className="flex items-center gap-6 p-4 rounded-lg bg-slate-900/60 border border-dashed border-slate-700">
                  <button
                    onClick={() => {
                      audioSystem.playMenuClick();
                      setDemoFileDropped(!demoFileDropped);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-all text-xs"
                  >
                    <Icon name="FileText" className="w-4 h-4 text-blue-400" />
                    <span>{demoFileDropped ? 'evidence_tape.txt (Moved)' : 'evidence_tape.txt'}</span>
                  </button>
                  <Icon name="ArrowRight" className="w-4 h-4 text-slate-500" />
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs ${
                      demoFileDropped
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon name="Folder" className="w-4 h-4" />
                    <span>/home/investigator/Documents/Case_27_Evidence/</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500">
                  Click the file to toggle simulated transfer into the archive folder.
                </div>
              </div>
            </div>
          )}

          {/* 4. Web Browser */}
          {activeSection === 'browser' && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Icon name="Globe" className="w-4 h-4 text-blue-400" />
                <span>Beacon Web Browser & Digital Records</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                The browser accesses fictional municipal web domains, online newspaper archives, discussion boards, and police intranets. Downloads save automatically into your <code className="text-blue-400 font-mono bg-slate-950 px-1 py-0.5 rounded">~/Downloads</code> folder.
              </p>

              {/* Interactive Omnibox Demo */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-[11px] font-mono text-slate-400">
                  INTERACTIVE DEMO: OMNIBOX URL SIMULATION
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (demoBrowserInput.trim()) {
                      audioSystem.playMenuClick();
                      setDemoBrowserUrl(demoBrowserInput.trim());
                      setDemoBrowserInput('');
                    }
                  }}
                  className="flex gap-2"
                >
                  <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono">
                    <Icon name="Lock" className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Type a search query or URL (e.g. metrodaily.local)..."
                      value={demoBrowserInput}
                      onChange={(e) => setDemoBrowserInput(e.target.value)}
                      className="w-full bg-transparent text-slate-200 outline-hidden placeholder-slate-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium"
                  >
                    Go
                  </button>
                </form>
                <div className="text-[11px] text-slate-400">
                  Resolved destination: <span className="font-mono text-blue-400">{demoBrowserUrl}</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. Terminal */}
          {activeSection === 'terminal' && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Icon name="Terminal" className="w-4 h-4 text-blue-400" />
                <span>Forensic Command Line Shell</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                The terminal provides authentic Unix command line inspection tools. Common commands include <code className="text-blue-400 font-mono">ls</code>, <code className="text-blue-400 font-mono">cd</code>, <code className="text-blue-400 font-mono">cat</code>, <code className="text-blue-400 font-mono">grep</code>, <code className="text-blue-400 font-mono">find</code>, and <code className="text-blue-400 font-mono">history</code>.
              </p>

              {/* Interactive Mini Terminal */}
              <div className="p-3.5 rounded-xl bg-black border border-slate-800 font-mono text-xs space-y-2">
                <div className="max-h-24 overflow-y-auto space-y-1 text-slate-400">
                  {demoTerminalOutput.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                <form onSubmit={handleDemoTerminalSubmit} className="flex items-center gap-2 pt-1 border-t border-slate-900">
                  <span className="text-emerald-400">›</span>
                  <input
                    type="text"
                    placeholder="Try 'ls', 'help', or 'cat'..."
                    value={demoTerminalInput}
                    onChange={(e) => setDemoTerminalInput(e.target.value)}
                    className="w-full bg-transparent text-slate-100 outline-hidden placeholder-slate-700"
                  />
                </form>
              </div>
            </div>
          )}

          {/* 6. Investigation Concept */}
          {activeSection === 'investigation' && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Icon name="Shield" className="w-4 h-4 text-blue-400" />
                <span>Investigation Protocol</span>
              </h2>
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-slate-300 leading-relaxed space-y-3">
                <p className="text-slate-200 font-medium">
                  "You are investigating an unresolved case using the information available on the workstation."
                </p>
                <p>
                  Pieces of evidence, witness reports, communication logs, and external digital records are scattered throughout the computer environment.
                </p>
                <p>
                  Carefully read case files, cross-reference incident timestamps with browser news archives, inspect system logfiles, and take notes as you uncover contradictory testimonies.
                </p>
              </div>
              <div className="text-[11px] text-slate-500 italic">
                * Note: Specific case puzzles and clues unfold through gameplay. No story solutions are revealed in this guide.
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>SECURIX WORKSTATION USER DOCUMENTATION // REV 24.04</span>
            <span>PRESS ESCAPE TO RETURN TO MENU</span>
          </div>
        </div>
      </div>
    </div>
  );
};
