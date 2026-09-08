import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { Icon } from '../common/Icon';

export const LockScreen: React.FC = () => {
  const { setPowerState, settings } = useOS();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const hours = settings.clockFormat === '24h' ? currentTime.getHours() : currentTime.getHours() % 12 || 12;
    const mins = currentTime.getMinutes().toString().padStart(2, '0');
    const ampm = settings.clockFormat === '12h' ? (currentTime.getHours() >= 12 ? ' PM' : ' AM') : '';
    return `${hours}:${mins}${ampm}`;
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Default account password is "investigator" or empty submit allows unlock
    if (password === '' || password === 'investigator' || password === '1234') {
      setPowerState('running');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-12 text-slate-100 select-none">
      {/* Top Center: Time & Date */}
      <div className="flex flex-col items-center pt-8">
        <div className="text-7xl font-light tracking-tight font-mono text-slate-100">
          {formatTime()}
        </div>
        <div className="text-lg text-slate-400 mt-2 font-medium">
          {formatDate()}
        </div>
      </div>

      {/* Middle: User & Unlock Form */}
      <div className="flex flex-col items-center w-full max-w-xs">
        <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 shadow-2xl mb-4">
          <Icon name="Shield" className="w-12 h-12 text-blue-400" />
        </div>

        <div className="text-lg font-semibold text-slate-100">Investigator</div>
        <div className="text-xs text-slate-400 font-mono mb-6">4th District Squad Room</div>

        <form onSubmit={handleUnlock} className="w-full space-y-3">
          <div className="relative">
            <input
              type="password"
              autoFocus
              placeholder="Enter password (or press Enter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-slate-900 border rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden transition-all ${
                error
                  ? 'border-red-500 ring-2 ring-red-500/20'
                  : 'border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white transition-colors"
            >
              <Icon name="ArrowRight" className="w-4 h-4" />
            </button>
          </div>

          {error ? (
            <div className="text-xs text-red-400 text-center animate-shake">
              Authentication failed. Try again.
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 text-center">
              Hint: Default password is <span className="font-mono text-slate-300">investigator</span> (or press Enter)
            </div>
          )}
        </form>
      </div>

      {/* Bottom Bar: System & Power */}
      <div className="flex items-center justify-between w-full text-xs text-slate-400 max-w-3xl">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <Icon name="Cpu" className="w-3.5 h-3.5 text-slate-400" />
          <span>Securix Linux 24.04 (Kernel 6.8.0)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPowerState('restarting')}
            className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
          >
            <Icon name="RotateCw" className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
          <button
            onClick={() => setPowerState('shutdown')}
            className="flex items-center gap-1.5 hover:text-red-400 transition-colors"
          >
            <Icon name="Power" className="w-3.5 h-3.5" />
            <span>Shut Down</span>
          </button>
        </div>
      </div>
    </div>
  );
};
