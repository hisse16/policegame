import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { vfs } from '../../services/vfs';
import { VFSNode } from '../../types/os';

interface TerminalAppProps {
  windowId: string;
  params?: { cwd?: string };
}

interface CommandOutput {
  id: string;
  type: 'command' | 'stdout' | 'stderr' | 'system';
  text: string;
  prompt?: string;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ windowId, params }) => {
  const { closeWindow, vfsVersion, sendNotification } = useOS();

  const [cwd, setCwd] = useState(params?.cwd || '/home/investigator');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [inputVal, setInputVal] = useState('');
  const [outputs, setOutputs] = useState<CommandOutput[]>([
    {
      id: 'init_1',
      type: 'system',
      text: 'Securix Linux 24.04 LTS (x86_64-pc-linux-gnu)\nType "help" for a list of built-in terminal commands.\n'
    }
  ]);

  // Terminal modes: 'shell', 'nano', 'python'
  const [mode, setMode] = useState<'shell' | 'nano' | 'python'>('shell');
  const [nanoFilePath, setNanoFilePath] = useState<string | null>(null);
  const [nanoContent, setNanoContent] = useState('');
  const [pythonEnv, setPythonEnv] = useState<Record<string, any>>({});

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nanoTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputs, mode]);

  const promptStr = `investigator@workstation:${
    cwd === '/home/investigator' ? '~' : cwd.startsWith('/home/investigator/') ? '~' + cwd.slice('/home/investigator'.length) : cwd
  }$ `;

  // Resolve relative paths
  const resolvePath = (target: string): string => {
    if (!target) return cwd;
    if (target.startsWith('/')) return vfs.normalizePath(target);
    if (target === '~' || target.startsWith('~/')) {
      return vfs.normalizePath('/home/investigator' + target.slice(1));
    }
    return vfs.normalizePath(cwd + '/' + target);
  };

  // Autocomplete on Tab key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (mode !== 'shell') return;

    if (e.key === 'Tab') {
      e.preventDefault();
      const parts = inputVal.split(' ');
      const lastToken = parts[parts.length - 1];
      if (!lastToken) return;

      // Find possible files matching prefix in cwd
      const allFilesInCwd = vfs.listDir(cwd, true);
      const matches = allFilesInCwd.filter((f) => f.name.startsWith(lastToken));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0].name + (matches[0].type === 'dir' ? '/' : '');
        setInputVal(parts.join(' '));
      } else if (matches.length > 1) {
        const outText = matches.map((m) => m.name).join('  ');
        setOutputs((prev) => [
          ...prev,
          { id: Math.random().toString(), type: 'command', text: inputVal, prompt: promptStr },
          { id: Math.random().toString(), type: 'stdout', text: outText }
        ]);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(history[nextIdx] || '');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx >= history.length) {
          setHistoryIdx(-1);
          setInputVal('');
        } else {
          setHistoryIdx(nextIdx);
          setInputVal(history[nextIdx]);
        }
      }
      return;
    }

    if (e.key === 'c' && e.ctrlKey) {
      // SIGINT
      setOutputs((prev) => [
        ...prev,
        { id: Math.random().toString(), type: 'command', text: inputVal + '^C', prompt: promptStr }
      ]);
      setInputVal('');
      return;
    }
  };

  // Command Execution Engine
  const executeCommandLine = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setOutputs((prev) => [
        ...prev,
        { id: Math.random().toString(), type: 'command', text: '', prompt: promptStr }
      ]);
      return;
    }

    // Add to command history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    // Record prompt line
    const promptId = Math.random().toString();
    const newOutputs: CommandOutput[] = [
      { id: promptId, type: 'command', text: trimmed, prompt: promptStr }
    ];

    // Handle command chaining ';' or '&&'
    const commandSegments = trimmed.split(/&&|;/).map((s) => s.trim()).filter(Boolean);

    for (const segment of commandSegments) {
      // Handle output redirection '>' or '>>'
      let redTarget = '';
      let isAppend = false;
      let cmdPart = segment;

      if (segment.includes('>>')) {
        const split = segment.split('>>');
        cmdPart = split[0].trim();
        redTarget = split[1].trim();
        isAppend = true;
      } else if (segment.includes('>')) {
        const split = segment.split('>');
        cmdPart = split[0].trim();
        redTarget = split[1].trim();
      }

      // Handle simple pipe '|'
      const pipeParts = cmdPart.split('|').map((p) => p.trim());
      let pipedInput = '';

      for (let pIdx = 0; pIdx < pipeParts.length; pIdx++) {
        const part = pipeParts[pIdx];
        const res = executeSingleCommand(part, pipedInput);
        if (res.exitCode !== 0 && !res.stdout) {
          newOutputs.push({
            id: Math.random().toString(),
            type: 'stderr',
            text: res.stderr || 'Command failed'
          });
          break;
        }

        if (pIdx === pipeParts.length - 1) {
          // Final command output
          if (redTarget) {
            // Write to file
            const fullPath = resolvePath(redTarget);
            const existing = vfs.getNode(fullPath);
            const contentToWrite = isAppend && existing ? (existing.content || '') + '\n' + res.stdout : res.stdout;
            vfs.createFile(fullPath, contentToWrite);
          } else {
            if (res.stdout) {
              newOutputs.push({
                id: Math.random().toString(),
                type: 'stdout',
                text: res.stdout
              });
            }
            if (res.stderr) {
              newOutputs.push({
                id: Math.random().toString(),
                type: 'stderr',
                text: res.stderr
              });
            }
          }
        } else {
          pipedInput = res.stdout;
        }
      }
    }

    setOutputs((prev) => [...prev, ...newOutputs]);
    setInputVal('');
  };

  const executeSingleCommand = (cmdStr: string, stdinText = ''): { stdout: string; stderr: string; exitCode: number } => {
    const tokens = cmdStr.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const cleanTokens = tokens.map((t) => t.replace(/^"|"$/g, ''));
    if (cleanTokens.length === 0) return { stdout: '', stderr: '', exitCode: 0 };

    const cmd = cleanTokens[0].toLowerCase();
    const args = cleanTokens.slice(1);

    switch (cmd) {
      case 'clear':
        setOutputs([]);
        return { stdout: '', stderr: '', exitCode: 0 };

      case 'pwd':
        return { stdout: cwd, stderr: '', exitCode: 0 };

      case 'whoami':
        return { stdout: 'investigator', stderr: '', exitCode: 0 };

      case 'date':
        return { stdout: new Date().toString(), stderr: '', exitCode: 0 };

      case 'history':
        return {
          stdout: history.map((h, i) => `  ${i + 1}  ${h}`).join('\n'),
          stderr: '',
          exitCode: 0
        };

      case 'cd': {
        const target = args[0] || '/home/investigator';
        const targetPath = resolvePath(target);
        const node = vfs.getNode(targetPath);
        if (!node) {
          return { stdout: '', stderr: `cd: ${target}: No such file or directory`, exitCode: 1 };
        }
        if (node.type !== 'dir') {
          return { stdout: '', stderr: `cd: ${target}: Not a directory`, exitCode: 1 };
        }
        setCwd(node.path);
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'ls': {
        const showAll = args.some((a) => a.startsWith('-') && a.includes('a'));
        const showLong = args.some((a) => a.startsWith('-') && a.includes('l'));
        const pathArg = args.find((a) => !a.startsWith('-')) || cwd;
        const targetPath = resolvePath(pathArg);

        const node = vfs.getNode(targetPath);
        if (!node) {
          return { stdout: '', stderr: `ls: cannot access '${pathArg}': No such file or directory`, exitCode: 2 };
        }

        if (node.type === 'file') {
          return { stdout: node.name, stderr: '', exitCode: 0 };
        }

        const items = vfs.listDir(targetPath, showAll);
        if (showLong) {
          const lines = items.map((item) => {
            const size = item.size.toString().padStart(6, ' ');
            const date = item.updatedAt.substring(0, 16);
            return `${item.permissions} 1 ${item.owner} ${item.group} ${size} ${date} ${item.name}`;
          });
          return { stdout: `total ${items.length}\n` + lines.join('\n'), stderr: '', exitCode: 0 };
        } else {
          return { stdout: items.map((i) => i.name).join('   '), stderr: '', exitCode: 0 };
        }
      }

      case 'mkdir': {
        if (args.length === 0) {
          return { stdout: '', stderr: 'mkdir: missing operand', exitCode: 1 };
        }
        for (const arg of args) {
          if (arg.startsWith('-')) continue;
          const target = resolvePath(arg);
          try {
            vfs.createDir(target);
          } catch (err: any) {
            return { stdout: '', stderr: `mkdir: cannot create directory '${arg}': ${err.message}`, exitCode: 1 };
          }
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'touch': {
        if (args.length === 0) {
          return { stdout: '', stderr: 'touch: missing file operand', exitCode: 1 };
        }
        for (const arg of args) {
          const target = resolvePath(arg);
          vfs.createFile(target, '');
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'cat': {
        if (args.length === 0 && stdinText) {
          return { stdout: stdinText, stderr: '', exitCode: 0 };
        }
        if (args.length === 0) {
          return { stdout: '', stderr: 'cat: missing operand', exitCode: 1 };
        }
        let out = '';
        for (const arg of args) {
          const target = resolvePath(arg);
          const node = vfs.getNode(target);
          if (!node) {
            return { stdout: '', stderr: `cat: ${arg}: No such file or directory`, exitCode: 1 };
          }
          if (node.type === 'dir') {
            return { stdout: '', stderr: `cat: ${arg}: Is a directory`, exitCode: 1 };
          }
          out += (node.content || '') + '\n';
        }
        return { stdout: out.trimEnd(), stderr: '', exitCode: 0 };
      }

      case 'echo': {
        const text = args.join(' ');
        return { stdout: text, stderr: '', exitCode: 0 };
      }

      case 'cp': {
        if (args.length < 2) {
          return { stdout: '', stderr: 'cp: missing destination file operand', exitCode: 1 };
        }
        const src = resolvePath(args[0]);
        const dest = resolvePath(args[1]);
        const result = vfs.copyNode(src, dest);
        if (!result) {
          return { stdout: '', stderr: `cp: cannot stat '${args[0]}': No such file`, exitCode: 1 };
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'mv': {
        if (args.length < 2) {
          return { stdout: '', stderr: 'mv: missing destination file operand', exitCode: 1 };
        }
        const src = resolvePath(args[0]);
        const dest = resolvePath(args[1]);
        const result = vfs.moveNode(src, dest);
        if (!result) {
          return { stdout: '', stderr: `mv: cannot stat '${args[0]}': No such file`, exitCode: 1 };
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'rm': {
        if (args.length === 0) {
          return { stdout: '', stderr: 'rm: missing operand', exitCode: 1 };
        }
        const recursive = args.some((a) => a.includes('r') || a.includes('f'));
        const files = args.filter((a) => !a.startsWith('-'));
        for (const f of files) {
          const target = resolvePath(f);
          const node = vfs.getNode(target);
          if (!node) {
            return { stdout: '', stderr: `rm: cannot remove '${f}': No such file or directory`, exitCode: 1 };
          }
          if (node.type === 'dir' && !recursive) {
            return { stdout: '', stderr: `rm: cannot remove '${f}': Is a directory`, exitCode: 1 };
          }
          vfs.deleteNode(target, true); // rm is permanent
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'grep': {
        if (args.length === 0) {
          return { stdout: '', stderr: 'grep: missing pattern', exitCode: 1 };
        }
        const pattern = args[0];
        let textToSearch = stdinText;
        if (args.length > 1) {
          const file = resolvePath(args[1]);
          const node = vfs.getNode(file);
          if (!node) {
            return { stdout: '', stderr: `grep: ${args[1]}: No such file or directory`, exitCode: 2 };
          }
          textToSearch = node.content || '';
        }
        const lines = textToSearch.split('\n');
        const matched = lines.filter((l) => l.toLowerCase().includes(pattern.toLowerCase()));
        return { stdout: matched.join('\n'), stderr: '', exitCode: matched.length > 0 ? 0 : 1 };
      }

      case 'find': {
        const searchBase = args[0] && !args[0].startsWith('-') ? resolvePath(args[0]) : cwd;
        const nameIdx = args.indexOf('-name');
        const namePat = nameIdx !== -1 ? args[nameIdx + 1] : '';
        const all = vfs.getAllNodes().filter((n) => n.path.startsWith(searchBase));
        const filtered = namePat ? all.filter((n) => n.name.includes(namePat.replace(/\*/g, ''))) : all;
        return { stdout: filtered.map((n) => n.path).join('\n'), stderr: '', exitCode: 0 };
      }

      case 'head': {
        let n = 10;
        const nIdx = args.indexOf('-n');
        if (nIdx !== -1 && args[nIdx + 1]) n = parseInt(args[nIdx + 1], 10) || 10;
        const file = args.find((a, i) => !a.startsWith('-') && i !== nIdx + 1);
        let src = stdinText;
        if (file) {
          const node = vfs.getNode(resolvePath(file));
          if (!node) return { stdout: '', stderr: `head: cannot open '${file}'`, exitCode: 1 };
          src = node.content || '';
        }
        const lines = src.split('\n').slice(0, n);
        return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
      }

      case 'tail': {
        let n = 10;
        const nIdx = args.indexOf('-n');
        if (nIdx !== -1 && args[nIdx + 1]) n = parseInt(args[nIdx + 1], 10) || 10;
        const file = args.find((a, i) => !a.startsWith('-') && i !== nIdx + 1);
        let src = stdinText;
        if (file) {
          const node = vfs.getNode(resolvePath(file));
          if (!node) return { stdout: '', stderr: `tail: cannot open '${file}'`, exitCode: 1 };
          src = node.content || '';
        }
        const lines = src.split('\n').slice(-n);
        return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
      }

      case 'sort': {
        const file = args.find((a) => !a.startsWith('-'));
        let src = stdinText;
        if (file) {
          const node = vfs.getNode(resolvePath(file));
          if (!node) return { stdout: '', stderr: `sort: cannot read: ${file}`, exitCode: 2 };
          src = node.content || '';
        }
        const lines = src.split('\n').sort();
        return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
      }

      case 'nano': {
        const file = args[0];
        if (!file) {
          return { stdout: '', stderr: 'nano: missing file operand', exitCode: 1 };
        }
        const targetPath = resolvePath(file);
        const node = vfs.getNode(targetPath);
        setNanoFilePath(targetPath);
        setNanoContent(node?.content || '');
        setMode('nano');
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'python':
      case 'python3': {
        if (args.length > 0) {
          // Execute python file
          const file = resolvePath(args[0]);
          const node = vfs.getNode(file);
          if (!node) return { stdout: '', stderr: `python: can't open file '${args[0]}': [Errno 2] No such file`, exitCode: 2 };
          try {
            // Simplified execution of print statements
            const lines = (node.content || '').split('\n');
            const outputs: string[] = [];
            for (const line of lines) {
              const printMatch = line.match(/print\((.*)\)/);
              if (printMatch) {
                const expr = printMatch[1].trim().replace(/^["']|["']$/g, '');
                outputs.push(expr);
              }
            }
            return { stdout: outputs.join('\n'), stderr: '', exitCode: 0 };
          } catch (e: any) {
            return { stdout: '', stderr: `Python Error: ${e.message}`, exitCode: 1 };
          }
        }
        setMode('python');
        return {
          stdout: 'Python 3.12.3 (main, Apr 10 2024, 05:33:47) [GCC 13.2.0] on linux\nType "help", "copyright", "credits" or "license" for more information.\nUse exit() or Ctrl-D to exit.',
          stderr: '',
          exitCode: 0
        };
      }

      case 'help':
        return {
          stdout: `Securix Investigation Workstation Shell
Built-in Commands:
  pwd, ls, cd, mkdir, touch, cp, mv, rm
  cat, echo, grep, find, head, tail, sort
  clear, whoami, date, history, nano, python, exit`,
          stderr: '',
          exitCode: 0
        };

      case 'exit':
        closeWindow(windowId);
        return { stdout: '', stderr: '', exitCode: 0 };

      default:
        return { stdout: '', stderr: `${cmd}: command not found`, exitCode: 127 };
    }
  };

  // Python REPL handler
  const handlePythonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = inputVal.trim();
    if (code === 'exit()' || code === 'quit()') {
      setMode('shell');
      setInputVal('');
      setOutputs((prev) => [
        ...prev,
        { id: Math.random().toString(), type: 'stdout', text: 'Exited Python REPL.' }
      ]);
      return;
    }

    const newOut: CommandOutput = {
      id: Math.random().toString(),
      type: 'command',
      prompt: '>>> ',
      text: code
    };

    let resultText = '';
    try {
      if (code.startsWith('print(') && code.endsWith(')')) {
        const inner = code.slice(6, -1);
        try {
          // eslint-disable-next-line no-eval
          resultText = String(eval(inner));
        } catch {
          resultText = inner.replace(/^["']|["']$/g, '');
        }
      } else if (code.includes('=')) {
        const [varName, expr] = code.split('=').map((s) => s.trim());
        // eslint-disable-next-line no-eval
        const val = eval(expr);
        setPythonEnv((prev) => ({ ...prev, [varName]: val }));
      } else {
        // Evaluate math or expression
        // eslint-disable-next-line no-eval
        const val = eval(code);
        if (val !== undefined) resultText = String(val);
      }
    } catch (err: any) {
      resultText = `Traceback (most recent call last):\n  File "<stdin>", line 1, in <module>\nNameError: ${err.message}`;
    }

    setOutputs((prev) => [
      ...prev,
      newOut,
      ...(resultText ? [{ id: Math.random().toString(), type: 'stdout' as const, text: resultText }] : [])
    ]);
    setInputVal('');
  };

  // NANO In-Terminal Editor Handlers
  const handleNanoSave = () => {
    if (nanoFilePath) {
      vfs.createFile(nanoFilePath, nanoContent);
      sendNotification('Nano', `Saved ${nanoFilePath.split('/').pop()}`, 'info');
    }
  };

  const handleNanoExit = () => {
    setMode('shell');
    setNanoFilePath(null);
  };

  if (mode === 'nano') {
    return (
      <div className="flex flex-col h-full bg-[#181818] text-slate-100 font-mono text-xs select-none">
        {/* Nano Header */}
        <div className="bg-slate-200 text-slate-900 px-3 py-0.5 flex justify-between font-bold text-[11px]">
          <span>GNU nano 7.2</span>
          <span>File: {nanoFilePath}</span>
          <span>Modified</span>
        </div>

        {/* Nano Editor body */}
        <textarea
          ref={nanoTextareaRef}
          autoFocus
          value={nanoContent}
          onChange={(e) => setNanoContent(e.target.value)}
          className="flex-1 w-full bg-transparent p-3 resize-none focus:outline-hidden text-slate-100 leading-relaxed font-mono"
        />

        {/* Nano Footer shortcuts */}
        <div className="bg-slate-950/90 border-t border-slate-800 p-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
          <button onClick={handleNanoSave} className="hover:text-white text-left">
            <span className="bg-slate-700 px-1 py-0.5 rounded font-bold mr-1">^O</span> WriteOut (Save)
          </button>
          <button onClick={handleNanoExit} className="hover:text-white text-left">
            <span className="bg-slate-700 px-1 py-0.5 rounded font-bold mr-1">^X</span> Exit
          </button>
          <div className="text-slate-500">
            <span className="bg-slate-800 px-1 py-0.5 rounded mr-1">^G</span> Get Help
          </div>
          <div className="text-slate-500">
            <span className="bg-slate-800 px-1 py-0.5 rounded mr-1">^R</span> Read File
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex flex-col h-full bg-[#0d1117] text-slate-200 font-mono text-xs p-3 overflow-y-auto cursor-text select-text"
    >
      <div className="space-y-1">
        {outputs.map((out) => (
          <div key={out.id} className="whitespace-pre-wrap break-all leading-relaxed">
            {out.type === 'command' && (
              <div>
                <span className="text-emerald-400 font-semibold">{out.prompt}</span>
                <span className="text-slate-100">{out.text}</span>
              </div>
            )}
            {out.type === 'stdout' && <div className="text-slate-300">{out.text}</div>}
            {out.type === 'stderr' && <div className="text-rose-400">{out.text}</div>}
            {out.type === 'system' && <div className="text-blue-400">{out.text}</div>}
          </div>
        ))}
      </div>

      {/* Interactive prompt input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (mode === 'python') {
            handlePythonSubmit(e);
          } else {
            executeCommandLine(inputVal);
          }
        }}
        className="flex items-center mt-1"
      >
        <span className="text-emerald-400 font-semibold shrink-0 select-none">
          {mode === 'python' ? '>>> ' : promptStr}
        </span>
        <input
          ref={inputRef}
          type="text"
          autoFocus
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none text-slate-100 focus:outline-hidden pl-1 font-mono text-xs"
        />
      </form>
      <div ref={terminalEndRef} />
    </div>
  );
};
