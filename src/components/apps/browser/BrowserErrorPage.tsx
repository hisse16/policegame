import React from 'react';
import { Icon } from '../../common/Icon';

interface BrowserErrorPageProps {
  errorType: 'NXDOMAIN' | 'OFFLINE' | 'HTTP_404' | 'CONNECTION_REFUSED';
  url: string;
  onReload: () => void;
  onSearch: (q: string) => void;
  onGoHome: () => void;
}

export const BrowserErrorPage: React.FC<BrowserErrorPageProps> = ({
  errorType,
  url,
  onReload,
  onSearch,
  onGoHome
}) => {
  const cleanDomain = url.replace(/^https?:\/\//, '').split('/')[0] || url;

  if (errorType === 'OFFLINE') {
    return (
      <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-200 select-none">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-950/50 border border-rose-800/60 flex items-center justify-center mx-auto text-rose-400">
            <Icon name="WifiOff" className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-100">No Internet Connection</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">ERR_INTERNET_DISCONNECTED</p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Securix OS network adapter is currently offline or disconnected from the departmental gateway. Check your system network settings in the top panel.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={onReload}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-2"
            >
              <Icon name="RotateCw" className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
            <button
              onClick={onGoHome}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              Go to Home Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (errorType === 'HTTP_404') {
    return (
      <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-200 select-none">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-950/50 border border-amber-800/60 flex items-center justify-center mx-auto text-amber-400">
            <Icon name="FileQuestion" className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-100">404 - Page Not Found</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">HTTP ERROR 404</p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            The requested path on <span className="font-mono text-slate-300">{cleanDomain}</span> could not be located on the server.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => onSearch(cleanDomain)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-2"
            >
              <Icon name="Search" className="w-3.5 h-3.5" />
              <span>Search Beacon</span>
            </button>
            <button
              onClick={onGoHome}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              New Tab
            </button>
          </div>
        </div>
      </div>
    );
  }

  // NXDOMAIN (Site can't be reached)
  return (
    <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-200 select-none">
      <div className="max-w-md w-full space-y-4">
        <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
          <Icon name="Globe" className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-100">This site can’t be reached</h2>
          <p className="text-xs text-slate-400 mt-1">
            <span className="font-mono text-slate-300">{cleanDomain}</span>’s server IP address could not be found.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 space-y-1.5">
          <p className="font-medium text-slate-300">Try:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
            <li>Checking the address for typos</li>
            <li>Searching for this domain on Beacon Search</li>
            <li>Checking network DNS configuration</li>
          </ul>
          <p className="pt-2 text-[10px] font-mono text-slate-500">
            DNS_PROBE_FINISHED_NXDOMAIN
          </p>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={() => onSearch(cleanDomain)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-2"
          >
            <Icon name="Search" className="w-3.5 h-3.5" />
            <span>Search Beacon</span>
          </button>
          <button
            onClick={onReload}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
};
