import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { NEWS_ARTICLES } from '../../../services/fictionalWebData';
import { NewsArticle } from '../../../types/browser';

interface NewsRendererProps {
  path: string;
  onNavigate: (url: string) => void;
}

export const NewsRenderer: React.FC<NewsRendererProps> = ({ path, onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(() => {
    if (path.startsWith('/article/')) {
      return path.replace('/article/', '');
    }
    return null;
  });

  const [commentInput, setCommentInput] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>(NEWS_ARTICLES);

  const selectedArticle = articles.find((a) => a.slug === selectedArticleSlug);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedArticle) return;

    const newComment = {
      id: 'c_' + Date.now(),
      author: 'Investigator_07',
      date: 'Just now',
      text: commentInput.trim(),
      upvotes: 1
    };

    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === selectedArticle.id) {
          return {
            ...art,
            commentsCount: art.commentsCount + 1,
            comments: [newComment, ...(art.comments || [])]
          };
        }
        return art;
      })
    );
    setCommentInput('');
  };

  const categories = ['All', 'Local', 'Tech', 'Culture', 'Sports'];
  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  // Detail View of an Article
  if (selectedArticle) {
    return (
      <div className="h-full w-full bg-slate-950 text-slate-200 overflow-y-auto font-sans select-none">
        {/* Newspaper Masthead Mini */}
        <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-3 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedArticleSlug(null)}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white flex items-center gap-1 text-xs"
            >
              <Icon name="ArrowLeft" className="w-4 h-4" />
              <span>Back to Chronicle</span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-serif font-bold tracking-wide text-slate-300">
              The Metropolitan Daily Chronicle
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{selectedArticle.category}</span>
            <span>•</span>
            <span>{selectedArticle.readTime}</span>
          </div>
        </header>

        {/* Article Body */}
        <article className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          <div className="space-y-3">
            <div className="inline-block px-2.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 text-[11px] font-semibold">
              {selectedArticle.category}
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-100 leading-tight">
              {selectedArticle.headline}
            </h1>
            <p className="text-base font-serif italic text-slate-400">
              {selectedArticle.subtitle}
            </p>
          </div>

          {/* Byline */}
          <div className="flex items-center justify-between py-3 border-y border-slate-800 text-xs text-slate-400">
            <div>
              <span className="font-semibold text-slate-300">By {selectedArticle.author}</span>
              <span className="mx-2">•</span>
              <span>{selectedArticle.authorRole}</span>
            </div>
            <span>Published {selectedArticle.date}</span>
          </div>

          {/* Lead & Paragraphs */}
          <div className="space-y-4 text-sm leading-relaxed text-slate-300 font-serif">
            <p className="text-base font-semibold text-slate-200 leading-relaxed">
              {selectedArticle.leadParagraph}
            </p>
            {selectedArticle.bodyParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-1.5">
            {selectedArticle.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Comments Section */}
          <section className="pt-8 border-t border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-sans">
                <Icon name="MessageSquare" className="w-5 h-5 text-blue-400" />
                <span>Discussion ({selectedArticle.comments?.length || 0})</span>
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="space-y-2">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Join the conversation as Lead Investigator..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-sans resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors font-sans"
                >
                  Post Comment
                </button>
              </div>
            </form>

            {/* Existing Comments */}
            <div className="space-y-3 font-sans">
              {(selectedArticle.comments || []).map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold text-slate-200">{c.author}</span>
                    <span>{c.date}</span>
                  </div>
                  <p className="text-slate-300 leading-normal">{c.text}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    );
  }

  // News Portal Homepage
  return (
    <div className="h-full w-full bg-slate-950 text-slate-200 overflow-y-auto font-sans select-none">
      {/* Masthead */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">
              The Voice of Metro City • Founded 1892 • Vol. CXXXIV No. 248
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-black tracking-tight text-slate-100 mt-1">
              THE METROPOLITAN DAILY CHRONICLE
            </h1>
          </div>

          <div className="text-right text-xs text-slate-400 font-mono hidden md:block">
            <p>Tuesday, September 8, 2026</p>
            <p className="text-emerald-400 font-sans">🌤️ Metro City 71°F • AQI 32</p>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="max-w-5xl mx-auto mt-4 pt-2 border-t border-slate-800 flex items-center justify-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pb-1 transition-colors ${
                activeCategory === cat ? 'text-blue-400 border-b-2 border-blue-400' : 'hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Newspaper Layout */}
      <main className="max-w-5xl mx-auto px-6 py-6 space-y-8">
        {/* Top Story Hero */}
        {filteredArticles.length > 0 && (
          <div
            onClick={() => setSelectedArticleSlug(filteredArticles[0].slug)}
            className="group grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all"
          >
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-bold uppercase">
                  {filteredArticles[0].category}
                </span>
                <span className="text-xs text-slate-400">{filteredArticles[0].date}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-100 group-hover:text-blue-400 transition-colors leading-snug">
                {filteredArticles[0].headline}
              </h2>
              <p className="text-sm font-serif text-slate-300 leading-relaxed line-clamp-3">
                {filteredArticles[0].leadParagraph}
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>By {filteredArticles[0].author}</span>
                <span>•</span>
                <span>{filteredArticles[0].readTime}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Icon name="MessageSquare" className="w-3.5 h-3.5" />
                  {filteredArticles[0].commentsCount}
                </span>
              </div>
            </div>

            {/* Visual Feature Block */}
            <div className="md:col-span-4 rounded-xl bg-gradient-to-br from-blue-900/40 via-slate-800 to-indigo-950/40 border border-slate-700/60 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-blue-300 font-mono">
                <span>SPECIAL DISPATCH</span>
                <Icon name="Newspaper" className="w-4 h-4" />
              </div>
              <div className="py-8 text-center space-y-1">
                <Icon name="TrendingUp" className="w-10 h-10 mx-auto text-blue-400 opacity-80" />
                <p className="text-xs font-semibold text-slate-200">Metropolitan Civic Development</p>
                <p className="text-[10px] text-slate-400">Read the comprehensive council briefing</p>
              </div>
              <button className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors">
                Read Full Coverage
              </button>
            </div>
          </div>
        )}

        {/* Secondary Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredArticles.slice(1).map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticleSlug(article.slug)}
              className="group p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-blue-400">{article.category}</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="font-serif font-bold text-base text-slate-100 group-hover:text-blue-400 transition-colors leading-snug">
                  {article.headline}
                </h3>
                <p className="text-xs font-serif text-slate-400 line-clamp-3 leading-relaxed">
                  {article.leadParagraph}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>{article.author}</span>
                <span className="flex items-center gap-1">
                  <Icon name="MessageSquare" className="w-3 h-3" />
                  {article.commentsCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
