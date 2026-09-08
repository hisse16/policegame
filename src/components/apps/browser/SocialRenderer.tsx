import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { browserDb } from '../../../services/browserDatabase';
import { SocialPost } from '../../../types/browser';

interface SocialRendererProps {
  onNavigate: (url: string) => void;
}

export const SocialRenderer: React.FC<SocialRendererProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<SocialPost[]>([...browserDb.socialPosts]);
  const [composerText, setComposerText] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim()) return;

    const newPost = browserDb.addSocialPost(composerText.trim());
    setPosts([newPost, ...posts]);
    setComposerText('');
  };

  const handleLike = (id: string) => {
    browserDb.likeSocialPost(id);
    setPosts([...browserDb.socialPosts]);
  };

  const trendingTopics = [
    { tag: '#WaterfrontLightRail', posts: '1.4K posts' },
    { tag: '#HorizonBookPro', posts: '890 posts' },
    { tag: '#HarborJazzFest', posts: '620 posts' },
    { tag: '#MetroFC', posts: '3.1K posts' },
    { tag: '#SecurixOS', posts: '410 posts' }
  ];

  return (
    <div className="h-full w-full bg-slate-950 text-slate-200 overflow-y-auto font-sans select-none flex justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-6">
        {/* Main Feed Column */}
        <div className="md:col-span-8 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Icon name="MessageSquare" className="w-5 h-5 text-indigo-400" />
              <span>Pulse / Feed</span>
            </h2>
            <span className="text-xs text-slate-400">Metro City Timeline</span>
          </div>

          {/* Post Composer */}
          <form onSubmit={handleCreatePost} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                LI
              </div>
              <textarea
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder="What's happening in Metro City?"
                rows={3}
                className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm focus:outline-hidden resize-none"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-3 text-slate-400">
                <button type="button" className="hover:text-indigo-400" title="Add Image">
                  <Icon name="Image" className="w-4 h-4" />
                </button>
                <button type="button" className="hover:text-indigo-400" title="Location Tag">
                  <Icon name="MapPin" className="w-4 h-4" />
                </button>
              </div>
              <button
                type="submit"
                disabled={!composerText.trim()}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-full transition-colors"
              >
                Pulse Post
              </button>
            </div>
          </form>

          {/* Posts List */}
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-3"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${post.avatarColor} flex items-center justify-center font-bold text-white text-xs shrink-0`}>
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-slate-200">{post.author}</span>
                        <span className="text-[11px] text-slate-500">{post.handle}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">{post.timeAgo}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-6 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.isLiked ? 'text-rose-400' : 'hover:text-rose-400'
                    }`}
                  >
                    <Icon name="Heart" className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
                    <Icon name="Repeat" className="w-3.5 h-3.5" />
                    <span>{post.reposts}</span>
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                    <Icon name="MessageCircle" className="w-3.5 h-3.5" />
                    <span>{post.commentsCount}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="md:col-span-4 space-y-4">
          {/* User Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                LI
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-100">Lead Investigator</h4>
                <p className="text-[11px] text-slate-400">@investigator_07</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              4th District Squad Room Terminal • Securix OS 24.04
            </p>
          </div>

          {/* Trending Topics */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-slate-200">What’s Trending</h4>
            <div className="space-y-2.5">
              {trendingTopics.map((trend) => (
                <div
                  key={trend.tag}
                  onClick={() => onNavigate(`https://search.local/search?q=${encodeURIComponent(trend.tag)}`)}
                  className="cursor-pointer hover:bg-slate-800/60 p-1.5 rounded-lg -mx-1.5 transition-colors"
                >
                  <p className="text-xs font-semibold text-indigo-400">{trend.tag}</p>
                  <p className="text-[10px] text-slate-500">{trend.posts}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
