'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const TOTAL_DAYS = 280; // 40 weeks
const DAYS_LEFT = 68;
const DAYS_PASSED = TOTAL_DAYS - DAYS_LEFT;

export const PregnancyHero = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setProgress(DAYS_PASSED / TOTAL_DAYS);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 ambient-glow pointer-events-none z-0" />

      {/* Top header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
        <button className="w-10 h-10 glass-card rounded-2xl flex items-center justify-center">
          <div className="flex flex-col gap-1">
            <span className="w-4 h-0.5 bg-white/70 rounded" />
            <span className="w-3 h-0.5 bg-white/50 rounded" />
          </div>
        </button>

        <div className="w-10 h-10 glass-card rounded-2xl flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/60 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-accent-pink rounded-full" />
          </div>
        </div>

        <button className="w-10 h-10 glass-card rounded-2xl flex items-center justify-center relative">
          <div className="text-white/70 text-lg">🔔</div>
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent-pink rounded-full" />
        </button>
      </div>

      {/* Baby countdown */}
      <div className="relative z-10 px-6 pt-4 pb-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 glass-card rounded-xl flex items-center justify-center">
            <Calendar size={14} className="text-white/60" />
          </div>
          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Birth Date</span>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-white tracking-tight"
        >
          {DAYS_LEFT} Days Left
        </motion.h1>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
            className="h-full bg-gradient-to-r from-accent-pink to-accent-red rounded-full"
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest">Week 1</span>
          <span className="text-[9px] font-bold text-accent-pink/70 uppercase tracking-widest">
            Week {Math.round(DAYS_PASSED / 7)} of 40
          </span>
        </div>
      </div>

      {/* Fetus illustration */}
      <div className="relative z-10 flex justify-center mt-[-12px] mb-[-12px]">
        <div className="relative w-[280px] h-[280px]">
          {/* Glow ring behind fetus */}
          <div className="absolute inset-0 rounded-full bg-gradient-radial from-red-900/50 via-red-950/20 to-transparent blur-2xl" />
          <img
            src="https://www.transparentpng.com/thumb/baby/baby-fetus-png-transparent-image-1.png"
            alt="Baby"
            className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 40px rgba(200,80,80,0.4))' }}
            onError={(e) => {
              // Fallback SVG illustration
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* Fallback: abstract baby silhouette */}
          <div className="absolute inset-0 flex items-center justify-center z-5">
            <div className="text-[120px] select-none" style={{ filter: 'drop-shadow(0 0 40px rgba(200,80,80,0.6))' }}>
              🤰
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards row */}
      <div className="relative z-10 px-6 pb-6 space-y-3">
        {/* Heartbeat card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card-strong rounded-[24px] p-5 flex items-center gap-5"
        >
          <div className="w-12 h-12 rounded-2xl bg-accent-pink/15 border border-accent-pink/30 flex items-center justify-center">
            <div className="text-accent-pink text-xl">♀</div>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Heartbeat</p>
            <p className="text-2xl font-black text-white">
              148<span className="text-sm font-bold text-white/40 ml-1">bpm</span>
            </p>
          </div>
          {/* Animated wave */}
          <div className="heartwave flex items-end gap-[3px] h-10">
            <span style={{ height: '8px' }} />
            <span style={{ height: '14px' }} />
            <span style={{ height: '22px' }} />
            <span style={{ height: '32px' }} />
            <span style={{ height: '22px' }} />
            <span style={{ height: '14px' }} />
            <span style={{ height: '8px' }} />
            <span style={{ height: '4px' }} />
          </div>
        </motion.div>

        {/* Weight & Size */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card-strong rounded-[22px] p-5"
          >
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
              <span className="text-base">⚖️</span>
            </div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Weight</p>
            <p className="text-xl font-black text-white">
              2,40<span className="text-xs font-bold text-white/40 ml-0.5">kg</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card-strong rounded-[22px] p-5"
          >
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
              <span className="text-base">📏</span>
            </div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Size</p>
            <p className="text-xl font-black text-white">
              15,40<span className="text-xs font-bold text-white/40 ml-0.5">in</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
