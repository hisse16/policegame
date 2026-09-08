import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { Icon } from '../common/Icon';

export const BootScreen: React.FC = () => {
  const [bootLog, setBootLog] = useState<string[]>([
    '[    0.000000] Linux version 6.8.0-31-generic (buildd@securix-lts) #31-Ubuntu SMP',
    '[    0.002401] Command line: BOOT_IMAGE=/vmlinuz-6.8.0-31 root=/dev/nvme0n1p2 ro quiet splash',
    '[    0.142019] Loading initial ramdisk...',
    '[    0.849102] systemd[1]: Starting systemd-udevd.service...',
    '[    1.120391] systemd[1]: Mounted /sys/kernel/security.',
    '[    1.490123] systemd[1]: Reached target Local File Systems.',
    '[    1.821940] NetworkManager[580]: <info> NetworkManager state is now CONNECTED_GLOBAL',
    '[    2.110294] Starting Securix Desktop Manager (gdm3)...',
    '[    2.340112] User session 1 active: investigator'
  ]);

  return (
    <div className="fixed inset-0 z-9999 bg-black text-slate-300 font-mono text-xs p-8 flex flex-col justify-between select-none">
      <div className="space-y-1">
        <div className="text-blue-400 font-bold mb-4 flex items-center gap-2">
          <Icon name="Shield" className="w-4 h-4" />
          <span>SECURIX SECURE KERNEL BOOT SEQUENCE v24.04</span>
        </div>
        {bootLog.map((line, i) => (
          <div key={i} className="text-slate-400">
            {line}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 text-slate-500 text-sm">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span>Initializing desktop environment...</span>
      </div>
    </div>
  );
};

export const ShutdownScreen: React.FC = () => {
  const { executeRestart } = useOS();
  const [isPoweredOff, setIsPoweredOff] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPoweredOff(true);
      // Attempt window.close() if allowed by browser tab
      try {
        window.close();
      } catch {
        // expected to fail in iframe/tab without user opener
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isPoweredOff) {
    return (
      <div className="fixed inset-0 z-9999 bg-black flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-20 h-20 rounded-full border border-slate-800 flex items-center justify-center text-slate-600 mb-6">
          <Icon name="Power" className="w-10 h-10" />
        </div>

        <h1 className="text-xl font-bold text-slate-400 mb-2">
          SYSTEM POWERED OFF
        </h1>
        <p className="text-xs text-slate-600 max-w-md mb-6 leading-relaxed">
          The simulated police workstation has cleanly terminated all active daemons, unmounted virtual volumes, and halted.
          (In a desktop wrapper, the application window closes here).
        </p>

        <button
          onClick={executeRestart}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs transition-all shadow-lg hover:border-blue-500 group"
        >
          <Icon name="Power" className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          <span>Press Power Button to Boot</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-9999 bg-black text-slate-300 font-mono text-xs p-10 flex flex-col items-center justify-center select-none">
      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
      <div className="text-sm font-bold text-slate-200 mb-1">Shutting down Securix OS...</div>
      <div className="text-xs text-slate-500">Unmounting virtual filesystem and terminating processes</div>
    </div>
  );
};
