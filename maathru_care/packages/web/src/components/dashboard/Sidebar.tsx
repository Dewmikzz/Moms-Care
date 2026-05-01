import React from 'react';
import { 
  Home, 
  User, 
  Calendar, 
  MessageSquare, 
  Activity, 
  Bell, 
  Settings, 
  LogOut,
  PlusSquare,
  Video
} from 'lucide-react';
import { clsx } from 'clsx';

const menuItems = [
  { icon: Home, label: 'Dashboard', active: false },
  { icon: MessageSquare, label: 'Chat', active: true },
  { icon: User, label: 'Profile', active: false },
  { icon: Calendar, label: 'Appointments', active: false },
  { icon: Activity, label: 'Health', active: false },
  { icon: Bell, label: 'Alerts', active: false },
  { icon: Video, label: 'Telehealth', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export const Sidebar = () => {
  return (
    <aside className="w-24 bg-[#1A1C29] h-screen flex flex-col items-center py-8 fixed left-0 top-0 z-50">
      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-12">
        <div className="w-6 h-6 bg-indigo-500 rounded-lg rotate-45" />
      </div>

      <nav className="flex-1 flex flex-col gap-6">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className={clsx(
              "p-3 rounded-2xl transition-all duration-300 group relative",
              item.active 
                ? "bg-[#F06292] text-white shadow-lg shadow-rose-500/30" 
                : "text-slate-500 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={22} />
            {item.active && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#F06292] rounded-r-full -translate-x-full" />
            )}
          </button>
        ))}
      </nav>

      <button className="p-3 text-slate-500 hover:text-white transition-colors mt-auto">
        <LogOut size={22} />
      </button>
    </aside>
  );
};
