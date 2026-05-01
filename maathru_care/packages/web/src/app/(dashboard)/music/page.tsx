'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Play, Pause, SkipBack, SkipForward, Music, Heart, Volume2, Search, Sliders } from 'lucide-react';
import { useSidebar } from '@/components/shared/SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const TRACKS = [
  { id: 1, title: 'Morning Calm', artist: 'Zen Pregnancy', duration: '3:45', mood: 0, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', color: '#A8E6CF' },
  { id: 2, title: 'Baby Lullaby', artist: 'Sweet Dreams', duration: '4:20', mood: 0, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', color: '#DCEDC1' },
  { id: 3, title: 'Deep Relaxation', artist: 'Maternal Peace', duration: '5:10', mood: 1, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', color: '#FFD3B6' },
  { id: 4, title: 'Ocean Waves', artist: 'Nature Sounds', duration: '10:00', mood: 0, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', color: '#FFAAA5' },
  { id: 5, title: 'Uplifting Spirit', artist: 'Happy Mom', duration: '3:15', mood: 2, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', color: '#FF8B94' },
];

export default function MusicPage() {
  const { toggleSidebar } = useSidebar();
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, []);

  const handleTrackSelect = (track: typeof TRACKS[0]) => {
    if (currentTrack.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FFF9F5] h-full overflow-hidden">
      <audio ref={audioRef} src={currentTrack.url} />

      {/* Header */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between bg-[#FFF9F5]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <Menu size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Soothing Sounds</h1>
        </div>
        <button className="p-2 text-gray-400 hover:text-brand-primary transition-colors">
          <Search size={22} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-32">
        {/* Featured Player Card */}
        <div className="w-full bg-white rounded-[40px] p-8 shadow-xl border border-gray-50 mb-10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
          
          <motion.div 
            key={currentTrack.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-48 h-48 rounded-[48px] shadow-lg mb-8 flex items-center justify-center relative"
            style={{ backgroundColor: currentTrack.color }}
          >
            <Music size={64} className="text-white/80" strokeWidth={1.5} />
            {isPlaying && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-[48px] border-4 border-white"
              />
            )}
          </motion.div>

          <h2 className="text-2xl font-black text-gray-900 mb-1">{currentTrack.title}</h2>
          <p className="text-brand-textSecondary font-bold mb-8 uppercase tracking-widest text-[10px]">{currentTrack.artist}</p>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-100 rounded-full mb-8 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-brand-primary rounded-full" 
              style={{ width: `${progress}%` }} 
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-10">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <SkipBack size={28} fill="currentColor" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <SkipForward size={28} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Playlists / Recent */}
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Recommended for You</h3>
          <button className="text-brand-primary text-xs font-bold flex items-center gap-1">
            Show all <Sliders size={12} />
          </button>
        </div>

        <div className="space-y-4">
          {TRACKS.map((track) => (
            <motion.div 
              key={track.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTrackSelect(track)}
              className={clsx(
                "p-4 rounded-3xl flex items-center gap-4 transition-all border cursor-pointer",
                currentTrack.id === track.id 
                  ? "bg-white border-brand-primary/10 shadow-md" 
                  : "bg-transparent border-transparent hover:bg-white/50"
              )}
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: track.color }}
              >
                <Music size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-[15px] truncate">{track.title}</h4>
                <p className="text-xs text-gray-400 font-medium">{track.artist}</p>
              </div>
              <div className="text-xs font-bold text-gray-300">
                {track.duration}
              </div>
              <button className={clsx(
                "p-2 rounded-full transition-colors",
                currentTrack.id === track.id && isPlaying ? "text-brand-primary" : "text-gray-300 hover:text-gray-400"
              )}>
                {currentTrack.id === track.id && isPlaying ? <Volume2 size={18} /> : <Heart size={18} />}
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
