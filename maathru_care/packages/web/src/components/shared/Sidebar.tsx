'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageCircle, Activity, Music, Settings, LogOut, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useSidebar } from './SidebarContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/mood', label: 'Mood Analysis', icon: Activity },
  { href: '/music', label: 'Music', icon: Music },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { isOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      closeSidebar();
      router.push('/login');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="absolute top-0 left-0 bottom-0 w-[280px] bg-bg-primary shadow-2xl z-50 flex flex-col sm:rounded-l-[40px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-2 text-brand-primary font-black text-lg">
                <div className="relative w-8 h-8 flex items-center justify-center bg-brand-primary/10 rounded-lg">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand-primary">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 10C12.5523 10 13 9.55228 13 9C13 8.44772 12.5523 8 12 8C11.4477 8 11 8.44772 11 9C11 9.55228 11.4477 10 12 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M12 16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                Maathru Care
              </div>
              <button 
                onClick={closeSidebar}
                className="p-2 -mr-2 text-brand-textSecondary hover:text-brand-textPrimary transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSidebar}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium",
                      isActive 
                        ? "bg-brand-primary/10 text-brand-primary" 
                        : "text-brand-textSecondary hover:bg-gray-50 hover:text-brand-textPrimary"
                    )}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Profile & Signout Footer */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'M')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-brand-textPrimary truncate">{user?.displayName || 'Mother'}</p>
                  <p className="text-xs text-brand-textSecondary truncate">{user?.email || 'Welcome'}</p>
                </div>
              </div>
              
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-medium"
              >
                <LogOut size={20} strokeWidth={2} />
                Sign Out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
