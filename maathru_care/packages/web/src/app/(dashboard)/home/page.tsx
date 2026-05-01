'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/components/shared/SidebarContext';
import { Menu, UserCircle, Bell, PenSquare, Droplets, Moon, Footprints, MessageSquare, Activity, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const RingChart = ({ value, max, color, icon: Icon, unit }: any) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[68px] h-[68px]">
        <svg className="w-full h-full -rotate-90">
          <circle cx="34" cy="34" r={radius} stroke="#F3F4F6" strokeWidth="6" fill="transparent" />
          <circle
            cx="34" cy="34" r={radius}
            stroke={color} strokeWidth="6" fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon size={16} color={color} className="mb-0.5" strokeWidth={2.5} />
          <span className="text-[10px] font-bold text-gray-700">{Math.round((value / max) * 100)}%</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-[13px] font-extrabold text-gray-900">{value}</span>
        <span className="text-[11px] font-medium text-gray-500 ml-1">{unit}</span>
      </div>
    </div>
  );
};

import { NotificationCenter } from '@/components/shared/NotificationCenter';
import { useMoodDetection } from '@/components/chat/useMoodDetection';

export default function HomePage() {
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);

  // Initialize Real-time AI Monitoring
  const { mood, videoRef, isListening, isCameraEnabled } = useMoodDetection(false, user?.uid);

  const firstName = user?.displayName?.split(' ')[0] || 'Mom';

  const getMoodStatus = (m: number) => {
    switch(m) {
      case 0: return { label: 'Feeling Calm', sub: 'Emotional signals are stable' };
      case 1: return { label: 'Mildly Distressed', sub: 'Take a deep breath, Mom' };
      case 2: return { label: 'Highly Distressed', sub: 'MiaKalifa is here for you' };
      default: return { label: 'Analyzing...', sub: 'Syncing with sensors' };
    }
  };

  const status = getMoodStatus(mood);

  return (
    <div className="flex-1 flex flex-col bg-[#FFFDFB] h-full overflow-y-auto relative">
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      
      {/* Hidden AI Sensor */}
      <video ref={videoRef} className="hidden" aria-hidden="true" />
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -left-10 w-72 h-72 bg-brand-primary/10 rounded-full blur-[80px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -right-20 w-80 h-80 bg-[#FFE4E1] rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/4 w-64 h-64 bg-[#E0F2F1] rounded-full blur-[80px]"
        />
      </div>

      {/* Top Bar */}
      <div className="px-5 pt-6 pb-3 flex items-center justify-between sticky top-0 bg-white/60 backdrop-blur-2xl z-20 border-b border-white/20 shadow-sm">
        <button onClick={toggleSidebar} className="p-2 -ml-2 text-gray-800 hover:bg-white/80 rounded-full transition-colors">
          <Menu size={22} strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNotifOpen(true)}
            className="p-2 text-brand-primary bg-white shadow-sm rounded-full border border-gray-100 relative"
          >
            <Bell size={18} strokeWidth={2.5} />
            <div className="absolute top-1 right-1 w-2 h-2 bg-brand-primary rounded-full border border-white" />
          </button>
          <div className="w-9 h-9 rounded-full bg-brand-primary border-2 border-white shadow-md overflow-hidden relative">
            {user?.photoURL ? (
                <Image src={user.photoURL} alt="User" fill className="object-cover" />
              ) : (
                <UserCircle className="w-full h-full text-white" />
              )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-20 relative z-10">
        {/* Greeting Section with Icon */}
        <div className="mt-6 mb-6 flex items-end justify-between">
          <div>
            <p className="text-brand-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-1.5 opacity-70">Morning, Beautiful</p>
            <h1 className="text-[30px] font-black text-gray-900 tracking-tight leading-none">
              Hello, {firstName} 🌸
            </h1>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-14 h-14 bg-white rounded-2xl shadow-soft border border-white flex items-center justify-center text-3xl"
          >
            👶
          </motion.div>
        </div>

        {/* Hero Card - High Polish Gradient */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full rounded-[48px] bg-gradient-to-br from-brand-primary via-brand-primary to-[#ff9aa2] p-8 shadow-2xl shadow-brand-primary/20 mb-8 relative overflow-hidden text-white"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
               <div className="px-4 py-1.5 bg-white/20 rounded-full text-[11px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20">
                 Week 1 Journey
               </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-[72px] font-black tracking-tighter leading-none">1</h2>
                  <span className="text-2xl font-bold opacity-90">Week</span>
                </div>
                <p className="text-white/90 font-bold mt-4 text-[16px] flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                   Starting your journey
                </p>
              </div>
              
              <div className="text-right">
                 <div className="w-20 h-20 bg-white/30 rounded-[32px] backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl mb-3 shadow-inner">
                   🌱
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Size: Seed</p>
              </div>
            </div>
          </div>
          
          {/* Decorative glass elements */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl" />
        </motion.div>

        {/* Live Mood Detection - Glassmorphism style */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-xl rounded-[40px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 mb-8 relative overflow-hidden group hover:bg-white/80 transition-all"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className={clsx(
                  "w-2.5 h-2.5 rounded-full",
                  isListening ? "bg-brand-primary animate-pulse" : "bg-gray-300"
                )} />
                {isListening && (
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-brand-primary rounded-full animate-ping opacity-75" />
                )}
              </div>
              <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">
                {isListening ? 'AI Analyzing' : 'Monitoring Idle'}
              </span>
            </div>
            <div className={clsx(
              "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase",
              isCameraEnabled ? "bg-brand-primary/10 text-brand-primary" : "bg-gray-100 text-gray-400"
            )}>
              {isCameraEnabled ? 'MiaKalifa Active' : 'Sensor Paused'}
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className={clsx(
              "w-16 h-16 rounded-[24px] flex items-center justify-center shadow-inner transition-colors",
              mood === 0 ? "bg-brand-primary/10 text-brand-primary" : 
              mood === 1 ? "bg-amber-50 text-amber-500" : "bg-red-50 text-red-500"
            )}>
              <Activity size={32} className={isListening ? "animate-pulse" : ""} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{status.label}</h3>
              <p className="text-[13px] text-gray-400 font-bold mt-0.5">{status.sub}</p>
            </div>
            <button 
              onClick={() => router.push('/mood')}
              className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-400 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-soft border border-gray-100"
            >
              <ArrowLeft size={20} className="rotate-180" />
            </button>
          </div>
        </motion.div>

        {/* Chat Call to Action */}
        <div className="bg-white rounded-[40px] p-7 shadow-sm border border-gray-50 mb-8 flex items-center justify-between relative overflow-hidden">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-[#FFF0F3] flex items-center justify-center text-brand-primary">
                <MessageSquare size={26} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-lg">Need to Talk?</h4>
                <p className="text-[13px] text-gray-400 font-bold">MiaKalifa is here to listen.</p>
              </div>
           </div>
           <button 
             onClick={() => router.push('/chat')}
             className="px-7 py-3.5 bg-brand-primary rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all"
           >
             Chat
           </button>
        </div>

        {/* Health Snapshot Section */}
        <div className="mb-6 flex items-center justify-between px-2">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Health Snapshot</h3>
          <div className="flex items-center gap-1.5 text-[11px] font-black text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
             <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
             Live
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-md rounded-[48px] p-10 shadow-sm border border-white/60 flex justify-between items-center">
          <RingChart value={0} max={8} color="#3B82F6" icon={Droplets} unit="/8 Cups" />
          <RingChart value={0} max={8} color="#A855F7" icon={Moon} unit="/8 hrs" />
          <RingChart value={0} max={8} color="#F97316" icon={Footprints} unit="k/8k Steps" />
        </div>
      </div>

    </div>
  );
}
