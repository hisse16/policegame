import React, { useState, useEffect } from 'react';
import { Icon } from '../../common/Icon';
import { VIDEOS } from '../../../services/fictionalWebData';
import { VideoItem } from '../../../types/browser';

interface VideoRendererProps {
  path: string;
  onNavigate: (url: string) => void;
}

export const VideoRenderer: React.FC<VideoRendererProps> = ({ path, onNavigate }) => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(() => {
    if (path.startsWith('/watch/')) {
      return path.replace('/watch/', '');
    }
    return null;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; user: string; text: string; time: string }>>([
    { id: '1', user: 'TechNerd_42', text: 'The thermal performance on this board is honestly crazy compared to last year’s model.', time: '2 days ago' },
    { id: '2', user: 'MetroCommuter', text: 'Appreciate the honest breakdown! Really helped me decide what to pick up at NovaMart.', time: '1 day ago' }
  ]);

  const activeVideo = VIDEOS.find((v) => v.id === selectedVideoId);

  // Playback timer simulation
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments([
      { id: 'c_' + Date.now(), user: 'Investigator_07', text: commentInput.trim(), time: 'Just now' },
      ...comments
    ]);
    setCommentInput('');
  };

  // Single Video Watch View
  if (activeVideo) {
    return (
      <div className="h-full w-full bg-slate-950 text-slate-200 overflow-y-auto font-sans select-none">
        {/* Navigation Bar */}
        <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedVideoId(null);
                setIsPlaying(false);
              }}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white flex items-center gap-1 text-xs"
            >
              <Icon name="ArrowLeft" className="w-4 h-4" />
              <span>Back to ViewTube</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white">
                <Icon name="Play" className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white">ViewTube</span>
            </div>
          </div>
        </header>

        {/* Video Player & Details */}
        <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Player Column */}
          <div className="lg:col-span-8 space-y-4">
            {/* Screen Player */}
            <div className={`relative aspect-video rounded-2xl bg-gradient-to-br ${activeVideo.color} border border-slate-800 flex flex-col justify-between p-4 overflow-hidden shadow-2xl`}>
              <div className="flex justify-between items-center text-xs text-white/80">
                <span className="font-medium bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                  {activeVideo.category}
                </span>
                <span className="font-mono bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                  1080p HD • 60fps
                </span>
              </div>

              {/* Center Play Button Overlay */}
              <div className="my-auto text-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-red-500/50 transition-transform active:scale-95"
                >
                  <Icon name={isPlaying ? 'Pause' : 'Play'} className="w-7 h-7 fill-current ml-0.5" />
                </button>
                <p className="text-xs text-white/90 font-medium mt-3 drop-shadow-md">
                  {isPlaying ? 'Playing...' : 'Click to Play'}
                </p>
              </div>

              {/* Bottom Scrubber & Controls */}
              <div className="space-y-2 bg-gradient-to-t from-black/80 to-transparent p-2 -m-4">
                {/* Timeline Bar */}
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    setProgress(Math.round((clickX / rect.width) * 100));
                  }}
                  className="h-1.5 w-full bg-slate-700/60 rounded-full cursor-pointer overflow-hidden"
                >
                  <div
                    className="h-full bg-red-600 rounded-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-red-400">
                      <Icon name={isPlaying ? 'Pause' : 'Play'} className="w-4 h-4 fill-current" />
                    </button>
                    <span className="font-mono text-[11px]">
                      {Math.floor((progress / 100) * 14)}:
                      {String(Math.floor(((progress / 100) * 60) % 60)).padStart(2, '0')} / {activeVideo.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Volume2" className="w-4 h-4" />
                    <Icon name="Maximize2" className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Video Headline & Metas */}
            <div className="space-y-3">
              <h1 className="text-xl font-bold text-slate-100">{activeVideo.title}</h1>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pb-3 border-b border-slate-800">
                <span>{activeVideo.views} • {activeVideo.timeAgo}</span>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200">
                    <Icon name="ThumbsUp" className="w-3.5 h-3.5" />
                    <span>{activeVideo.upvotes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200">
                    <Icon name="Share2" className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Channel Info & Description */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-950 text-red-400 border border-red-800 flex items-center justify-center font-bold text-sm">
                    {activeVideo.channel.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-slate-200">{activeVideo.channel}</h3>
                    <p className="text-[10px] text-slate-400">124K Subscribers</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    isSubscribed
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-white text-black hover:bg-slate-200'
                  }`}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/60">
                {activeVideo.description}
              </p>
            </div>

            {/* Comments Section */}
            <section className="space-y-4 pt-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Comments ({comments.length})</span>
              </h3>

              <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add a public comment..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl"
                >
                  Comment
                </button>
              </form>

              <div className="space-y-3 pt-2">
                {comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-200">{c.user}</span>
                      <span>{c.time}</span>
                    </div>
                    <p className="text-slate-300">{c.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Related Videos Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 mb-2">Up Next</h3>
            {VIDEOS.filter((v) => v.id !== activeVideo.id).map((v) => (
              <div
                key={v.id}
                onClick={() => {
                  setSelectedVideoId(v.id);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 cursor-pointer flex gap-3 transition-colors group"
              >
                <div className={`w-28 aspect-video rounded-lg bg-gradient-to-br ${v.color} flex items-center justify-center text-white shrink-0 relative overflow-hidden`}>
                  <Icon name="Play" className="w-5 h-5 fill-current opacity-80 group-hover:scale-110 transition-transform" />
                  <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.2 rounded text-[9px] font-mono">
                    {v.duration}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                    {v.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">{v.channel}</p>
                  <p className="text-[9px] text-slate-500">{v.views}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ViewTube Homepage / Browse Grid
  return (
    <div className="h-full w-full bg-slate-950 text-slate-200 overflow-y-auto font-sans select-none">
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
            <Icon name="Play" className="w-4 h-4 fill-current ml-0.5" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">ViewTube</span>
        </div>
        <div className="text-xs text-slate-400">Metro City Video Network</div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Icon name="Flame" className="w-5 h-5 text-red-500" />
          <span>Recommended Videos</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEOS.map((video) => (
            <div
              key={video.id}
              onClick={() => {
                setSelectedVideoId(video.id);
                setProgress(0);
                setIsPlaying(true);
              }}
              className="group cursor-pointer space-y-3"
            >
              {/* Thumbnail */}
              <div className={`aspect-video rounded-2xl bg-gradient-to-br ${video.color} border border-slate-800 flex items-center justify-center text-white relative overflow-hidden group-hover:border-red-500/50 transition-colors`}>
                <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon name="Play" className="w-6 h-6 fill-current ml-0.5 text-white" />
                </div>
                <span className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono">
                  {video.duration}
                </span>
                <span className="absolute top-2 left-2 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded text-[10px]">
                  {video.category}
                </span>
              </div>

              {/* Meta */}
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300 shrink-0">
                  {video.channel.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">{video.channel}</p>
                  <p className="text-[10px] text-slate-500">{video.views} • {video.timeAgo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
