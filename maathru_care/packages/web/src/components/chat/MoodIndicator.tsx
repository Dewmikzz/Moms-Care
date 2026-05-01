import React from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodIndicatorProps {
  mood: number;
  className?: string;
  isListening?: boolean;
}

const MOOD_CONFIG = [
  {
    color: '#A8E6CF', // Mint / Calm
    label: 'Calm',
  },
  {
    color: '#FFD93D', // Yellow / Mildly distressed
    label: 'Mildly distressed',
  },
  {
    color: '#FF6B6B', // Red / Significantly distressed
    label: 'Significantly distressed',
  },
];

export const MoodIndicator: React.FC<MoodIndicatorProps> = ({
  mood,
  className,
  isListening = false,
}) => {
  const config = MOOD_CONFIG[mood] ?? MOOD_CONFIG[0];
  const isRed = mood === 2;

  return (
    <div 
      className={clsx('relative flex items-center justify-center w-8 h-8 group cursor-help', className)}
      title={`Your mood: ${config.label}`}
    >
      {/* Listening Pulse Ring */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div 
              className="w-3 h-3 rounded-full animate-pulseRing"
              style={{ border: `1.5px solid ${config.color}` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Mood Dot */}
      <motion.div
        layout
        className={clsx(
          "w-3 h-3 rounded-full relative z-10 transition-colors duration-700 shadow-sm",
          isRed ? "animate-breathe" : ""
        )}
        style={{ 
          backgroundColor: config.color,
          boxShadow: `0 2px 6px ${config.color}60`
        }}
        initial={false}
        animate={{ backgroundColor: config.color }}
      />
    </div>
  );
};
