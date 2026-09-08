import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { Icon } from '../common/Icon';
import { APP_REGISTRY } from '../../config/apps';

interface ProcessItem {
  pid: number;
  name: string;
  user: string;
  cpu: number;
  mem: number;
  windowId?: string;
}

export const SystemMonitorApp: React.FC<{ windowId: string }> = () => {
  const { windows, closeWindow, sendNotification } = useOS();

  const [activeTab, setActiveTab] = useState<'resources' | 'processes'>('resources');
  const [cpuUsage, setCpuUsage] = useState(18);
  const [cpuHistory, setCpuHistory] = useState<number[]>([12, 15, 14, 19, 22, 18, 16, 20, 18]);
  const [memUsage, setMemUsage] = useState(3.4); // GB
  const totalMem = 16.0;
  const [diskUsage] = useState(142.6); // GB
  const totalDisk = 512.0;

  // Real simulated process list synced with open windows
  const [processes, setProcesses] = useState<ProcessItem[]>([]);

  useEffect(() => {
    // Generate dynamic process list
    const systemProcesses: ProcessItem[] = [
      { pid: 1, name: 'systemd', user: 'root', cpu: 0.1, mem: 42.1 },
      { pid: 480, name: 'dbus-daemon', user: 'messagebus', cpu: 0.2, mem: 18.4 },
      { pid: 820, name: 'NetworkManager', user: 'root', cpu: 0.1, mem: 24.8 },
      { pid: 1042, name: 'securix-desktop', user: 'investigator', cpu: 2.1, mem: 184.2 },
      { pid: 1105, name: 'pulseaudio', user: 'investigator', cpu: 0.4, mem: 36.5 }
    ];

    const windowProcesses: ProcessItem[] = windows.map((w, idx) => {
      const appDef = APP_REGISTRY[w.appId];
      return {
        pid: 2000 + idx * 37,
        name: appDef?.name.toLowerCase().replace(/\s+/g, '-') || w.appId,
        user: 'investigator',
        cpu: Math.floor(Math.random() * 4) + 0.8,
        mem: Math.floor(Math.random() * 120) + 90,
        windowId: w.id
      };
    });

    setProcesses([...systemProcesses, ...windowProcesses]);
  }, [windows]);

  // Fluctuations in CPU history
  useEffect(() => {
    const timer = setInterval(() => {
      const newCpu = Math.floor(Math.random() * 15) + 12;
      setCpuUsage(newCpu);
      setCpuHistory((prev) => [...prev.slice(-19), newCpu]);
      setMemUsage(parseFloat((3.2 + Math.random() * 0.4).toFixed(1)));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleKillProcess = (proc: ProcessItem) => {
    if (proc.user === 'root') {
      sendNotification('Permission Denied', 'Cannot terminate root system process.', 'error');
      return;
    }
    if (proc.windowId) {
      closeWindow(proc.windowId);
      sendNotification('Process Terminated', `Killed process ${proc.name} [PID ${proc.pid}]`, 'info');
    } else {
      setProcesses((prev) => prev.filter((p) => p.pid !== proc.pid));
      sendNotification('Process Terminated', `Killed process ${proc.name} [PID ${proc.pid}]`, 'info');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none text-xs">
      {/* Tab Navigation */}
      <div className="h-9 px-3 flex items-center gap-2 border-b border-slate-800 bg-slate-950/80 shrink-0">
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors text-xs ${
            activeTab === 'resources'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Icon name="Activity" className="w-3.5 h-3.5" />
          <span>Resource Usage</span>
        </button>
        <button
          onClick={() => setActiveTab('processes')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors text-xs ${
            activeTab === 'processes'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Icon name="List" className="w-3.5 h-3.5" />
          <span>Processes ({processes.length})</span>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'resources' ? (
          <div className="space-y-4 max-w-2xl mx-auto">
            {/* CPU Monitor */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="Cpu" className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-slate-200">CPU History (Intel Core i7-13700H @ 3.40GHz)</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">{cpuUsage}%</span>
              </div>

              {/* Graphical Trend Bar */}
              <div className="h-16 flex items-end gap-1 bg-slate-900/90 p-2 rounded border border-slate-800">
                {cpuHistory.map((val, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${Math.max(8, (val / 100) * 100)}%` }}
                    className="flex-1 bg-emerald-500/70 hover:bg-emerald-400 rounded-xs transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Memory Monitor */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon name="HardDrive" className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-slate-200">Memory & Swap</span>
                </div>
                <span className="font-mono text-blue-400 font-bold">
                  {memUsage} GB / {totalMem} GB ({Math.round((memUsage / totalMem) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${(memUsage / totalMem) * 100}%` }}
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                />
              </div>
            </div>

            {/* Disk Storage */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon name="Database" className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-slate-200">NVMe SSD Storage (/dev/nvme0n1p2)</span>
                </div>
                <span className="font-mono text-purple-400 font-bold">
                  {diskUsage} GB / {totalDisk} GB ({Math.round((diskUsage / totalDisk) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${(diskUsage / totalDisk) * 100}%` }}
                  className="bg-purple-500 h-full rounded-full"
                />
              </div>
            </div>

            {/* Network Traffic */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon name="Wifi" className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-slate-200">Network Interface (wlan0)</span>
                </div>
                <span className="font-mono text-xs text-slate-400">10.24.110.84</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-300">
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-500 mb-0.5">RECEIVING</div>
                  <div className="text-emerald-400 font-bold">14.8 KB/s (Total: 482 MB)</div>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-500 mb-0.5">SENDING</div>
                  <div className="text-blue-400 font-bold">3.2 KB/s (Total: 129 MB)</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Processes Table */
          <div className="bg-slate-950/80 rounded-lg border border-slate-800 overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-slate-900 border-b border-slate-800 text-[11px] font-semibold text-slate-400">
              <div className="col-span-2">PID</div>
              <div className="col-span-4">Process Name</div>
              <div className="col-span-2">User</div>
              <div className="col-span-1 text-right">CPU %</div>
              <div className="col-span-1 text-right">Mem (MB)</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            <div className="divide-y divide-slate-800/60 font-mono text-xs">
              {processes.map((proc) => (
                <div
                  key={proc.pid}
                  className="grid grid-cols-12 gap-2 px-3 py-1.5 items-center hover:bg-slate-900/50 transition-colors"
                >
                  <div className="col-span-2 text-slate-400">{proc.pid}</div>
                  <div className="col-span-4 font-medium text-slate-200 truncate flex items-center gap-1.5">
                    {proc.name}
                    {proc.windowId && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Active Window" />
                    )}
                  </div>
                  <div className="col-span-2 text-slate-400">{proc.user}</div>
                  <div className="col-span-1 text-right text-emerald-400">{proc.cpu}%</div>
                  <div className="col-span-1 text-right text-blue-400">{proc.mem}</div>
                  <div className="col-span-2 text-right">
                    <button
                      onClick={() => handleKillProcess(proc)}
                      disabled={proc.user === 'root'}
                      className="px-2 py-0.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded text-[10px] disabled:opacity-20 transition-colors"
                    >
                      Kill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
