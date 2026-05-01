'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { useMoodDetection } from './useMoodDetection';
import { MessageBubble } from './MessageBubble';
import { MoodIndicator } from './MoodIndicator';
import { MusicRecommendationBanner } from './MusicRecommendationBanner';
import { Send, Menu, Camera, CameraOff, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useSidebar } from '../shared/SidebarContext';

export const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [showMusicBanner, setShowMusicBanner] = useState(false);
  const [showCaptureToast, setShowCaptureToast] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openSidebar } = useSidebar();

  const {
    messages, language, isOffline, isTyping, isBotThinking, isLoading,
    setIsTyping, sendMessage, toggleLanguage
  } = useChat();
  const { user } = useAuth();

  const {
    mood, videoRef, isCameraEnabled, toggleCamera,
    calculateFinalMood, updateLastBotMessageTime, isListening
  } = useMoodDetection(isTyping, user?.uid, (m) => {
    setShowCaptureToast(true);
    setTimeout(() => setShowCaptureToast(false), 4000);
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isBotThinking]);

  useEffect(() => {
    if (mood === 2) setShowMusicBanner(true);
  }, [mood]);

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isBotThinking) return;
    setInput('');
    setIsTyping(false);

    const finalMood = calculateFinalMood(msg);

    await sendMessage(msg, finalMood, () => {
      updateLastBotMessageTime();
    });
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-bg-primary text-brand-textPrimary">
      {/* Hidden camera */}
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />

      {/* Top Notification Toast */}
      <AnimatePresence>
        {showCaptureToast && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-0 left-5 right-5 z-50 pointer-events-none"
          >
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-brand-primary/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <div className="relative">
                   <Camera size={20} />
                   <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-brand-primary rounded-full"
                   />
                </div>
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-900">MiaKalifa Analysis</p>
                <p className="text-[11px] text-gray-400 font-medium">Mood captured & health trends updated</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 shrink-0 bg-bg-primary z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={openSidebar}
            className="text-brand-textPrimary p-1 -ml-1 transition-colors hover:text-brand-primary"
          >
            <Menu size={24} strokeWidth={2.5} />
          </button>
          {/* Creative Mother & Child Logo */}
          <div className="flex items-center gap-2">
             <div className="relative w-10 h-10 flex items-center justify-center bg-brand-primary/10 rounded-xl">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-brand-primary">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 10C12.5523 10 13 9.55228 13 9C13 8.44772 12.5523 8 12 8C11.4477 8 11 8.44772 11 9C11 9.55228 11.4477 10 12 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
             </div>
             <span className="text-[18px] font-black text-gray-900 tracking-tight">Maathru<span className="text-brand-primary">Care</span></span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Toggle Pill */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center bg-white border border-gray-100 rounded-full p-1 shadow-sm transition-all"
          >
            <div className={clsx(
              "px-3 py-1 rounded-full text-[11px] font-bold transition-all",
              language === 'si' ? "bg-brand-primary text-white" : "text-brand-textSecondary"
            )}>සිංහල</div>
            <div className={clsx(
              "px-3 py-1 rounded-full text-[11px] font-bold transition-all",
              language === 'en' ? "bg-brand-primary text-white" : "text-brand-textSecondary"
            )}>EN</div>
          </button>
          
          {/* Mood Indicator Top Right */}
          <MoodIndicator mood={mood} isListening={isListening} />
        </div>
      </header>

      {/* Offline Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-100 text-brand-textSecondary px-5 py-2 flex items-center gap-2 text-[11px] font-medium shrink-0 z-10"
          >
            <div className="w-2 h-2 rounded-full bg-brand-distressed" />
            {language === 'si' ? 'ඔබ නොබැඳිව සිටියි. පණිවිඩ local වල සුරකිනු ඇත.' : 'Offline. Messages saved locally.'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area with Premium Background */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto relative z-0">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 z-[-1] overflow-hidden bg-[#FFFDFB]">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              x: [0, 50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -left-1/4 w-[100%] h-[100%] bg-brand-primary/5 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [0, -90, 0],
              x: [0, -50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 -right-1/4 w-[100%] h-[100%] bg-[#FFE4E1]/40 rounded-full blur-[120px]"
          />
          
          {/* Subtle Floating Hearts/Bubbles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: '100vh', x: Math.random() * 100 + '%' }}
              animate={{ y: '-20vh' }}
              transition={{ 
                duration: 15 + Math.random() * 10, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 2
              }}
              className="absolute text-brand-primary/10 select-none pointer-events-none"
              style={{ fontSize: 20 + Math.random() * 30 + 'px' }}
            >
              ❤️
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
            </motion.div>
          ) : messages.length === 0 && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col pt-12 px-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                   <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-brand-primary">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M12 10C12.5523 10 13 9.55228 13 9C13 8.44772 12.5523 8 12 8C11.4477 8 11 8.44772 11 9C11 9.55228 11.4477 10 12 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M12 16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <Menu size={20} />
                </div>
              </div>

              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[34px] leading-[1.1] font-extrabold text-gray-900 mb-4 tracking-tight"
              >
                Your Pregnancy <br/>Companion
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[15px] text-gray-500 leading-relaxed max-w-[240px] mb-12"
              >
                Ask anything about your health and receive maternal care.
              </motion.p>

              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring', bounce: 0.4 }}
                className="relative w-full aspect-square max-w-[300px] mx-auto"
              >
                <Image 
                  src="/images/cute_mom_illustration.png" 
                  alt="Companion" 
                  fill 
                  className="object-contain" 
                  priority
                />
              </motion.div>

              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-8 left-8 right-8"
              >
                <button 
                  onClick={() => inputRef.current?.focus()}
                  className="w-full bg-white shadow-xl border border-gray-100 rounded-full py-4 px-6 flex items-center justify-between group hover:border-brand-primary/30 transition-all"
                >
                  <span className="text-[16px] font-bold text-gray-900">Start Chatting</span>
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white group-hover:bg-brand-primary transition-colors">
                    <Send size={18} className="ml-0.5" />
                  </div>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-5 py-6 space-y-4">
          {messages.map((msg, idx) => (
            <MessageBubble key={msg.id || idx} message={msg} language={language} currentMood={mood} />
          ))}

          {/* Bot thinking */}
          <AnimatePresence>
            {isBotThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="flex justify-start mb-4"
              >
                <div className="bg-brand-botBubble px-5 py-4 rounded-tr-[24px] rounded-br-[24px] rounded-bl-[24px] rounded-tl-[8px] flex items-center gap-1.5 shadow-soft">
                  <span className="w-[6px] h-[6px] bg-brand-primary/60 rounded-full animate-typingBounce" />
                  <span className="w-[6px] h-[6px] bg-brand-primary/60 rounded-full animate-typingBounce animation-delay-200" />
                  <span className="w-[6px] h-[6px] bg-brand-primary/60 rounded-full animate-typingBounce animation-delay-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Music Banner */}
      <MusicRecommendationBanner
        isVisible={showMusicBanner}
        onClose={() => setShowMusicBanner(false)}
        onSave={() => setShowMusicBanner(false)}
        language={language}
      />

      {/* Input */}
      <footer className="shrink-0 px-5 pb-6 pt-2 bg-bg-primary z-20">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); setIsTyping(true); }}
              placeholder={language === 'si' ? 'මෙහි ටයිප් කරන්න...' : 'Type here...'}
              disabled={isBotThinking}
              className="w-full bg-white border border-[#E0E0E0] rounded-[40px] pl-5 pr-12 py-[14px] text-[15px] font-medium text-brand-textPrimary outline-none focus:border-brand-primary/50 transition-all placeholder:text-brand-textSecondary disabled:opacity-50 shadow-sm"
              style={{ fontFamily: language === 'si' ? 'var(--font-sinhala)' : 'var(--font-nunito)' }}
            />
            {/* Camera consent badge */}
            <button 
              type="button"
              onClick={toggleCamera}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-textSecondary hover:text-brand-primary transition-colors"
              title="Camera access for passive mood detection"
            >
              {isCameraEnabled ? <Camera size={20} strokeWidth={2} /> : <CameraOff size={20} strokeWidth={2} />}
            </button>
          </div>
          <motion.button
            type="submit"
            disabled={!input.trim() || isBotThinking}
            whileTap={{ scale: 0.92 }}
            className="w-[50px] h-[50px] rounded-full bg-brand-primary flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity shadow-md shadow-brand-primary/30"
          >
            <Send size={20} className="text-white ml-0.5" strokeWidth={2.5} />
          </motion.button>
        </form>
      </footer>
    </div>
  );
};
