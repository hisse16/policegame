import React from 'react';
import { useOS } from '../../context/OSContext';
import { Icon } from '../common/Icon';

export const NotificationToasts: React.FC = () => {
  const { notifications, dismissNotification } = useOS();

  // Show only unread notifications created within the last 15 seconds as transient popups
  const activeToasts = notifications.filter((n) => !n.read).slice(-3);

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed top-9 right-3 z-9999 flex flex-col gap-2 pointer-events-none select-none max-w-sm w-full">
      {activeToasts.map((notif) => {
        const getIcon = () => {
          if (notif.type === 'error') return { icon: 'AlertCircle', color: 'text-rose-400' };
          if (notif.type === 'warning') return { icon: 'AlertTriangle', color: 'text-amber-400' };
          if (notif.type === 'success') return { icon: 'CheckCircle2', color: 'text-emerald-400' };
          return { icon: 'Info', color: 'text-blue-400' };
        };

        const { icon, color } = getIcon();

        return (
          <div
            key={notif.id}
            className="pointer-events-auto bg-slate-900/95 border border-slate-700/80 rounded-lg p-3 shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all animate-in slide-in-from-top-2 duration-200"
          >
            <div className="p-1 rounded bg-slate-800 shrink-0">
              <Icon name={icon} className={`w-4 h-4 ${color}`} />
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="font-semibold text-slate-100 text-xs truncate">
                {notif.title}
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                {notif.message}
              </div>
            </div>

            <button
              onClick={() => dismissNotification(notif.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800 transition-colors"
            >
              <Icon name="X" className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
