import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { browserDb, RichSearchResult, InstantAnswer } from '../../../services/browserDatabase';
import { AdItem } from '../../../types/browser';

interface SearchEngineViewProps {
  initialQuery?: string;
  adShieldActive: boolean;
  onNavigate: (url: string) => void;
}

export const SearchEngineView: React.FC<SearchEngineViewProps> = ({
  initialQuery = '',
  adShieldActive,
  onNavigate
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'videos' | 'forums' | 'shopping' | 'maps'>('all');
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

  const searchData = submittedQuery
    ? browserDb.search(submittedQuery, { category: activeTab })
    : { results: [], sponsoredAds: [], relatedQueries: [], totalCount: 0 };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSubmittedQuery(query.trim());
    }
  };

  const categories: Array<{ id: 'all' | 'news' | 'videos' | 'forums' | 'shopping' | 'maps'; label: string; icon: string }> = [
    { id: 'all', label: 'All', icon: 'Search' },
    { id: 'news', label: 'News', icon: 'Newspaper' },
    { id: 'videos', label: 'Videos', icon: 'Video' },
    { id: 'forums', label: 'Forums', icon: 'Users' },
    { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag' },
    { id: 'maps', label: 'Maps', icon: 'MapPin' }
  ];

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col text-slate-200 select-none overflow-hidden">
      {/* Top Search Header */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-6 pt-4 pb-0 shrink-0">
        <div className="flex items-center gap-4 max-w-4xl">
          {/* Logo */}
          <div
            onClick={() => {
              setQuery('');
              setSubmittedQuery('');
            }}
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Icon name="Compass" className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
              Beacon
            </span>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-full px-3.5 py-1.5 focus-within:border-blue-500 transition-colors">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the web..."
                className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-white mr-1"
                >
                  <Icon name="X" className="w-3 h-3" />
                </button>
              )}
              <button
                type="submit"
                className="p-1 text-blue-400 hover:text-blue-300"
              >
                <Icon name="Search" className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-6 mt-4 max-w-4xl text-xs overflow-x-auto">
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-1.5 pb-2.5 border-b-2 font-medium transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon name={cat.icon} className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl space-y-6">
          {/* Results Count */}
          {submittedQuery && (
            <p className="text-[11px] text-slate-500 font-mono">
              About {searchData.totalCount} results for "{submittedQuery}"
            </p>
          )}

          {/* Instant Answer (if available) */}
          {searchData.instantAnswer && (
            <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 shadow-md space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
                <Icon
                  name={
                    searchData.instantAnswer.type === 'weather'
                      ? 'CloudSun'
                      : searchData.instantAnswer.type === 'calc'
                      ? 'Calculator'
                      : 'Info'
                  }
                  className="w-4 h-4"
                />
                <span>Instant Answer</span>
              </div>
              <p className="text-sm font-bold text-slate-100">{searchData.instantAnswer.title}</p>
              <p className="text-base text-slate-300 font-medium">{searchData.instantAnswer.details}</p>
            </div>
          )}

          {/* Sponsored Advertisements (Filtered by AdShield) */}
          {!adShieldActive && searchData.sponsoredAds.length > 0 && (
            <div className="space-y-3 pb-2 border-b border-slate-800/80">
              {searchData.sponsoredAds.map((ad: AdItem) => (
                <div
                  key={ad.id}
                  onClick={() => onNavigate(ad.url)}
                  className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-amber-400">Sponsored</span>
                    <span>•</span>
                    <span className="text-slate-300 font-medium">{ad.sponsor}</span>
                    <span className="text-slate-500 truncate">{ad.url}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-blue-400 hover:underline">
                    {ad.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {ad.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Organic Search Results */}
          {searchData.results.length > 0 ? (
            <div className="space-y-6">
              {searchData.results.map((result: RichSearchResult, idx: number) => (
                <div key={idx} className="group">
                  {/* Site Header / Breadcrumb */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                    <div className="w-4 h-4 rounded bg-slate-800 flex items-center justify-center text-blue-400">
                      <Icon name={result.icon || 'Globe'} className="w-2.5 h-2.5" />
                    </div>
                    <span className="font-medium text-slate-300">{result.sitename}</span>
                    <span>›</span>
                    <span className="text-slate-500 truncate max-w-xs">{result.url}</span>
                    {result.metaInfo && (
                      <>
                        <span>•</span>
                        <span className="text-[10px] text-slate-400">{result.metaInfo}</span>
                      </>
                    )}
                  </div>

                  {/* Title Link */}
                  <h3
                    onClick={() => onNavigate(result.url)}
                    className="text-base font-medium text-blue-400 group-hover:underline cursor-pointer leading-snug"
                  >
                    {result.title}
                  </h3>

                  {/* Snippet */}
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {result.snippet}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            submittedQuery && (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <Icon name="Search" className="w-10 h-10 mx-auto text-slate-600" />
                <h3 className="text-base font-semibold text-slate-200">
                  No results found for "{submittedQuery}"
                </h3>
                <p className="text-xs max-w-md mx-auto text-slate-400 leading-relaxed">
                  Make sure all words are spelled correctly, or try different keywords such as <span className="font-mono text-blue-400 cursor-pointer" onClick={() => { setQuery('transit'); setSubmittedQuery('transit'); }}>transit</span>, <span className="font-mono text-blue-400 cursor-pointer" onClick={() => { setQuery('laptop'); setSubmittedQuery('laptop'); }}>laptop</span>, or <span className="font-mono text-blue-400 cursor-pointer" onClick={() => { setQuery('manuals'); setSubmittedQuery('manuals'); }}>manuals</span>.
                </p>
              </div>
            )
          )}

          {/* Related Searches */}
          {submittedQuery && searchData.relatedQueries.length > 0 && (
            <div className="pt-6 border-t border-slate-800/80">
              <h4 className="text-xs font-semibold text-slate-400 mb-3">Related Searches</h4>
              <div className="flex flex-wrap gap-2">
                {searchData.relatedQueries.map((rq, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(rq);
                      setSubmittedQuery(rq);
                    }}
                    className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-xs text-slate-300 transition-colors flex items-center gap-1.5"
                  >
                    <Icon name="Search" className="w-3 h-3 text-slate-500" />
                    <span>{rq}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
