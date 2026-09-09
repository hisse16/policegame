import React, { useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { Icon } from '../common/Icon';
import { playSound } from '../../services/soundService';

export const NotificationToasts: React.FC = () => {
  const { notifications, dismissNotification } = useOS();
  const activeToasts = notifications.filter((n) => !n.read).slice(-2);

  useEffect(() => {
    const newest = activeToasts[activeToasts.length - 1];
    if (!newest) return;
    playSound(newest.type === 'error' ? 'error' : newest.type === 'warning' ? 'warning' : newest.type === 'success' ? 'success' : 'notify');
  }, [activeToasts.map((n) => n.id).join('|')]);

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed top-9 right-3 z-[9999] flex flex-col gap-1.5 pointer-events-none select-none max-w-[360px] w-full">
      {activeToasts.map((notif) => {
        const getIcon = () => {
          if (notif.type === 'error') return { icon: 'AlertCircle', color: 'text-rose-400' };
          if (notif.type === 'warning') return { icon: 'AlertTriangle', color: 'text-amber-400' };
          if (notif.type === 'success') return { icon: 'CheckCircle2', color: 'text-emerald-400' };
          return { icon: 'Info', color: 'text-blue-400' };
        };
        const { icon, color } = getIcon();
        return (
          <div key={notif.id} className="pointer-events-auto bg-slate-950/96 border border-slate-800 rounded-md px-3 py-2.5 shadow-xl backdrop-blur-md flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="p-1 rounded bg-slate-900 shrink-0"><Icon name={icon} className={`w-3.5 h-3.5 ${color}`} /></div>
            <div className="flex-1 overflow-hidden">
              <div className="font-medium text-slate-200 text-[11px] truncate">{notif.title}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{notif.message}</div>
            </div>
            <button onClick={() => dismissNotification(notif.id)} aria-label="Dismiss" className="text-slate-600 hover:text-slate-300 p-0.5 rounded"><Icon name="X" className="w-3 h-3" /></button>
          </div>
        );
      })}
    </div>
  );
};
