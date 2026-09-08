import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { NEWS_ARTICLES } from '../../../services/fictionalWebData';
import { browserDb } from '../../../services/browserDatabase';

interface NewTabPageProps {
  onNavigate: (url: string) => void;
  onSearch: (q: string) => void;
}

export const NewTabPage: React.FC<NewTabPageProps> = ({ onNavigate, onSearch }) => {
  const [searchInput, setSearchInput] = useState('');

  const topSites = [
    { title: 'Beacon Search', url: 'https://search.local/', icon: 'Search', color: 'bg-blue-600/20 text-blue-400 border-blue-500/30' },
    { title: 'Metro Chronicle', url: 'https://metrodaily.local/', icon: 'Newspaper', color: 'bg-slate-700/30 text-slate-300 border-slate-600/30' },
    { title: 'Pulse Social', url: 'https://pulse.local/', icon: 'MessageSquare', color: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' },
    { title: 'ViewTube', url: 'https://viewtube.local/', icon: 'Video', color: 'bg-rose-600/20 text-rose-400 border-rose-500/30' },
    { title: 'NetBoard Forums', url: 'https://discourse.local/', icon: 'Users', color: 'bg-sky-600/20 text-sky-400 border-sky-500/30' },
    { title: 'NovaMart', url: 'https://novamart.local/', icon: 'ShoppingBag', color: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' },
    { title: 'OmniMaps', url: 'https://omnimaps.local/', icon: 'MapPin', color: 'bg-teal-600/20 text-teal-400 border-teal-500/30' },
    { title: 'MetroMail', url: 'https://inbox.local/', icon: 'Mail', color: 'bg-amber-600/20 text-amber-400 border-amber-500/30' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const handleDownloadHandbook = () => {
    browserDb.startDownload(
      'Securix_Investigator_Handbook.txt',
      'http://manuals.local/investigator-handbook.txt',
      1024 * 6,
      'text/plain',
      `SECURIX OS INVESTIGATOR HANDBOOK - 24.04 LTS\n============================================\nOfficial workstation documentation and guidelines.`
    );
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-y-auto p-6 flex flex-col items-center select-none text-slate-200">
      <div className="max-w-3xl w-full flex flex-col items-center space-y-8 my-auto py-6">
        {/* Logo / Brand */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <Icon name="Compass" className="w-6 h-6" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Beacon
            </span>
          </div>
          <p className="text-xs text-slate-400">Metropolitan Intranet & Web Explorer</p>
        </div>

        {/* Central Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-xl">
          <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-xl shadow-black/40 hover:border-slate-600 focus-within:border-blue-500 transition-all p-1.5 px-4">
            <Icon name="Search" className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Beacon or type a URL..."
              className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm focus:outline-hidden py-2"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Shortcuts Grid */}
        <div className="w-full max-w-xl grid grid-cols-4 gap-3">
          {topSites.map((site) => (
            <button
              key={site.url}
              onClick={() => onNavigate(site.url)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${site.color}`}>
                <Icon name={site.icon} className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-slate-300 font-medium truncate max-w-full">
                {site.title}
              </span>
            </button>
          ))}
        </div>

        {/* Informational Cards (Weather + News Ticker) */}
        <div className="w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Live Weather Widget */}
          <div
            onClick={() => onNavigate('https://skywatch.local/')}
            className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <Icon name="CloudSun" className="w-4 h-4 text-amber-400" />
                <span>Metro City Weather</span>
              </div>
              <span className="text-[10px] text-slate-500">Live Forecast</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold text-slate-100">71°F</span>
                <span className="text-xs text-slate-400 ml-1.5">Mostly Sunny</span>
              </div>
              <div className="text-[11px] text-slate-400 text-right">
                <p>H: 74° L: 58°</p>
                <p className="text-[10px] text-emerald-400">AQI: 32 (Good)</p>
              </div>
            </div>
          </div>

          {/* Featured Headline */}
          <div
            onClick={() => onNavigate(`https://metrodaily.local/article/${NEWS_ARTICLES[0].slug}`)}
            className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <Icon name="Newspaper" className="w-4 h-4 text-blue-400" />
                <span>Metro Chronicle</span>
              </div>
              <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-800 px-1.5 py-0.2 rounded">
                Top Story
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-snug">
              {NEWS_ARTICLES[0].headline}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">4 min read • Updated today</p>
          </div>
        </div>

        {/* Quick Handbook Download helper */}
        <div className="w-full max-w-xl pt-2">
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Icon name="FileText" className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <p className="text-xs font-medium text-slate-200">Securix OS Reference Handbook</p>
                <p className="text-[10px] text-slate-400">Official precinct workstation documentation</p>
              </div>
            </div>
            <button
              onClick={handleDownloadHandbook}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Icon name="Download" className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
