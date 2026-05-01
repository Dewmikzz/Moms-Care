'use client';

import React from 'react';
import { LayoutGrid, MessageSquare, BarChart2, User, Bell } from 'lucide-react';
import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/chat' },
  { icon: BarChart2, label: 'Stats', href: '/stats' },
  { icon: MessageSquare, label: 'Chat', href: '/chat#chat' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-6">
      <nav className="flex items-center gap-2 glass-card-strong rounded-[28px] px-6 py-3 shadow-2xl shadow-black/60">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className={clsx(
              'flex flex-col items-center gap-1 px-5 py-2 rounded-[18px] transition-all duration-300 group',
              idx === 0
                ? 'bg-white/10 text-white'
                : 'text-white/30 hover:text-white/60'
            )}
          >
            <item.icon size={20} strokeWidth={idx === 0 ? 2.5 : 1.8} />
          </Link>
        ))}
      </nav>
    </div>
  );
};
