'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Initial loading simulation
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#FFF9F5] flex flex-col items-center justify-center"
        >
          {/* Central Logo Animation */}
          <div className="relative w-40 h-40">
            {/* Pulsing Outer Rings */}
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-brand-primary/20 rounded-full blur-2xl"
            />
            
            {/* Mother and Child Silhouette Icon */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative z-10 w-full h-full flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-brand-primary">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.2"/>
                <motion.path 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z" 
                  fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2"
                />
                <path d="M12 10C12.5523 10 13 9.55228 13 9C13 8.44772 12.5523 8 12 8C11.4477 8 11 8.44772 11 9C11 9.55228 11.4477 10 12 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M12 16V22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </motion.div>
          </div>

          {/* Branding */}
          <div className="mt-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-black text-gray-900 tracking-tight"
            >
              Maathru <span className="text-brand-primary">Care</span>
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8 }}
              className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 mt-2"
            >
              System Initializing
            </motion.p>
          </div>

          {/* Loading bar */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="w-full h-full bg-brand-primary"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
