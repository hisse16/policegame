import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { FORUM_THREADS } from '../../../services/fictionalWebData';
import { browserDb } from '../../../services/browserDatabase';
import { ForumThread } from '../../../types/browser';

interface ForumRendererProps {
  path: string;
  onNavigate: (url: string) => void;
}

export const ForumRenderer: React.FC<ForumRendererProps> = ({ path, onNavigate }) => {
  const [threads, setThreads] = useState<ForumThread[]>([...browserDb.forumThreads]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(() => {
    if (path.startsWith('/thread/')) {
      return path.replace('/thread/', '');
    }
    return null;
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [replyText, setReplyText] = useState('');

  const activeThread = threads.find((t) => t.id === selectedThreadId);

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    browserDb.addForumReply(activeThread.id, replyText.trim());
    setThreads([...browserDb.forumThreads]);
    setReplyText('');
  };

  // Thread Reader View
  if (activeThread) {
    return (
      <div className="h-full w-full bg-slate-950 text-slate-200 overflow-y-auto font-sans select-none">
        {/* Forum Header */}
        <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-3 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedThreadId(null)}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white flex items-center gap-1 text-xs"
            >
              <Icon name="ArrowLeft" className="w-4 h-4" />
              <span>Back to Forums</span>
            </button>
            <span className="text-slate-700">|</span>
            <span className="text-xs font-bold text-slate-300">NetBoard Community</span>
          </div>
        </header>

        {/* Thread Content */}
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
          {/* Thread Title & Metas */}
          <div className="space-y-2 pb-4 border-b border-slate-800">
            <div className="flex flex-wrap gap-1.5">
              {activeThread.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-400 border border-blue-800/60 text-[10px] font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100">{activeThread.title}</h1>
            <p className="text-xs text-slate-400">
              Started by <span className="text-slate-200 font-medium">{activeThread.author}</span> • {activeThread.posts.length} replies • {activeThread.views} views
            </p>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {activeThread.posts.map((post, idx) => (
              <div
                key={post.id}
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/60 flex items-center justify-center font-bold text-xs">
                      {post.avatarText}
                    </div>
                    <div>
                      <span className="font-bold text-slate-200">{post.author}</span>
                      <span className="ml-2 px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400">
                        {post.role}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500">{post.postDate}</span>
                </div>

                {/* Post Content */}
                <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                  {post.content}
                </div>

                {/* Signature (if any) */}
                {post.signature && (
                  <div className="pt-2 border-t border-slate-800/40 text-[10px] text-slate-500 font-mono italic">
                    {post.signature}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Reply Box */}
          <form onSubmit={handlePostReply} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200">Post a Reply</h3>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your response as Investigator_07..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 resize-none font-sans"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Submit Reply
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Forum Main Categories and Threads
  return (
    <div className="h-full w-full bg-slate-950 text-slate-200 overflow-y-auto font-sans select-none">
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
            <Icon name="Users" className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">NetBoard Community</h1>
            <p className="text-[11px] text-slate-400">Metro City Tech, Hardware & Local Discussion</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 text-xs border-b border-slate-800 pb-3">
          {['all', 'hardware', 'community', 'gaming', 'photography'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Threads' : cat}
            </button>
          ))}
        </div>

        {/* Threads List */}
        <div className="space-y-3">
          {threads
            .filter((t) => activeCategory === 'all' || t.subforumId === activeCategory)
            .map((thread) => (
              <div
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between gap-4 transition-colors group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {thread.isPinned && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold">
                        PINNED
                      </span>
                    )}
                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                      {thread.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    By <span className="text-slate-300 font-medium">{thread.author}</span> • {thread.createdAt}
                  </p>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-400 shrink-0">
                  <div className="text-right">
                    <p className="font-bold text-slate-200">{thread.posts.length}</p>
                    <p className="text-[10px] text-slate-500">replies</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-200">{thread.views}</p>
                    <p className="text-[10px] text-slate-500">views</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};
