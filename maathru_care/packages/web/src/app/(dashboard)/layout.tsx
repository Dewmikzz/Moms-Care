'use client';

import React from 'react';
import { SidebarProvider } from '@/components/shared/SidebarContext';
import { Sidebar } from '@/components/shared/Sidebar';
import { PWAInstallPrompt } from '@/components/dashboard/PWAInstallPrompt';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#FFF9F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useAuth hook
  }

  return (
    <SidebarProvider>
      <div className="min-h-[100dvh] bg-slate-100 flex items-center justify-center">
        {/* Mobile-first constraint container */}
        <div className="w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-bg-primary sm:rounded-[40px] sm:shadow-2xl sm:border sm:border-slate-200 overflow-hidden relative flex flex-col">
          {children}
          <Sidebar />
        </div>
        
        {/* PWA Install Prompt (only shows if conditions met) */}
        <PWAInstallPrompt />
      </div>
    </SidebarProvider>
  );
}
