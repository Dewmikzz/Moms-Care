import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, X, Music } from 'lucide-react';

interface MusicRecommendationBannerProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
  language: 'si' | 'en';
}

export const MusicRecommendationBanner: React.FC<MusicRecommendationBannerProps> = ({
  isVisible, onClose, onSave, language
}) => {
  // Auto-collapse logic (simulated by calling onClose after 10s if we wanted to fully unmount)
  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => {
        // Just keeping it simple and letting user dismiss manually for now,
        // or we could trigger a minimized state.
      }, 10000);
      return () => clearTimeout(t);
    }
  }, [isVisible]);

  const fontClass = language === 'si' ? 'font-sinhala' : 'font-sans';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 22, stiffness: 150 }}
          className="absolute bottom-[90px] left-4 right-4 z-40 mx-auto max-w-[360px]"
        >
          <div className="bg-[#FFE5E5] rounded-[24px] p-3 flex items-center gap-3 shadow-float border border-white/50 backdrop-blur-md">
            
            {/* Music Icon */}
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
              <Music size={20} className="text-brand-distressed" />
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <p className={`text-[12px] text-brand-distressed font-bold leading-tight ${fontClass}`}>
                {language === 'si' ? 'අපි ඔබට නිර්දේශ කරමු:' : 'We recommend:'}
              </p>
              <p className={`text-[14px] font-bold text-brand-textPrimary truncate ${fontClass}`}>
                {language === 'si' ? 'සුවපත් ගීතය - සිනාමිය' : 'Healing Song - Relax'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button 
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors shadow-sm"
                aria-label="Play"
              >
                <Play size={14} className="ml-0.5" fill="currentColor" />
              </button>
              <button 
                onClick={onSave}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors shadow-sm"
                aria-label="Save"
              >
                <Heart size={14} />
              </button>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center text-brand-textSecondary hover:bg-black/5 transition-colors"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
