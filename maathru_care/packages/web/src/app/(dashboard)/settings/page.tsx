'use client';

import React, { useState, useRef } from 'react';
import { Menu, User, Camera, Bell, Shield, ArrowLeft, Save, Check } from 'lucide-react';
import { useSidebar } from '@/components/shared/SidebarContext';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { clsx } from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync state when user object changes (e.g. after initial load)
  React.useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const [settings, setSettings] = useState({
    cameraAccess: true,
    notifications: true,
    aiAnalysis: true,
    anonymousData: false
  });

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName, photoURL });
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
        setIsEditing(true); // Trigger edit mode so they can save
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FFF9F5] h-full overflow-y-auto">
      {/* Header */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-[#FFF9F5]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <Menu size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Settings</h1>
        </div>
      </header>

      <div className="px-6 py-6 pb-24 space-y-8">
        {/* Profile Section */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Profile</h2>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col items-center">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
            />
            
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-3xl font-black overflow-hidden relative">
                {photoURL ? (
                  <Image src={photoURL} alt="Profile" fill className="object-cover" />
                ) : (
                  displayName.charAt(0).toUpperCase() || 'M'
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 border border-gray-100 hover:bg-gray-50 z-10"
              >
                <Camera size={16} />
              </button>
            </div>

            {isEditing ? (
              <div className="w-full space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1">DISPLAY NAME</label>
                  <input 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-gray-50 rounded-2xl px-4 py-3 mt-1 text-[15px] font-medium outline-none border-2 border-transparent focus:border-brand-primary/20 focus:bg-white transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setDisplayName(user?.displayName || '');
                      setPhotoURL(user?.photoURL || '');
                    }}
                    className="flex-1 py-3 bg-gray-100 rounded-2xl text-[14px] font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 py-3 bg-brand-primary rounded-2xl text-[14px] font-bold text-white shadow-sm hover:bg-brand-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSaving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Save size={18} /></motion.div> : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{displayName || 'Anonymous Mom'}</h3>
                <p className="text-gray-400 text-sm mb-6">{user?.email}</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 bg-gray-50 rounded-2xl text-[14px] font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
          <AnimatePresence>
            {saved && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 bg-teal-50 text-teal-600 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold"
              >
                <Check size={18} />
                Profile updated successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* AI Companion Settings */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">AI Companion</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
            <SettingToggle 
              icon={Camera} 
              label="Camera Access" 
              description="Allow passive mood detection from selfie camera" 
              active={settings.cameraAccess}
              onToggle={() => toggleSetting('cameraAccess')}
            />
            <SettingToggle 
              icon={Shield} 
              label="Smart Analysis" 
              description="Automatically analyze your wellbeing every 30s" 
              active={settings.aiAnalysis}
              onToggle={() => toggleSetting('aiAnalysis')}
              noBorder
            />
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">System</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
            <SettingToggle 
              icon={Bell} 
              label="Push Notifications" 
              description="Stay updated with baby's growth and health tips" 
              active={settings.notifications}
              onToggle={() => toggleSetting('notifications')}
              noBorder
            />
          </div>
        </section>

        {/* Weekly Report Button */}
        <section>
          <button 
            onClick={() => router.push('/mood')}
            className="w-full bg-gradient-to-r from-brand-primary to-[#ffcad2] rounded-3xl p-6 text-white text-left relative overflow-hidden group active:scale-[0.98] transition-all"
          >
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1">Weekly Report</h3>
              <p className="text-white/80 text-sm font-medium">Analyze your mood and health patterns from last week.</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <ArrowLeft className="rotate-180" />
            </div>
          </button>
        </section>
      </div>
    </div>
  );
}

function SettingToggle({ icon: Icon, label, description, active, onToggle, noBorder }: any) {
  return (
    <div className={clsx(
      "p-5 flex items-center justify-between",
      !noBorder && "border-b border-gray-50"
    )}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500">
          <Icon size={20} />
        </div>
        <div>
          <h4 className="text-[15px] font-bold text-gray-900">{label}</h4>
          <p className="text-xs text-gray-400 font-medium">{description}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={clsx(
          "w-12 h-6 rounded-full relative transition-colors duration-300",
          active ? "bg-brand-primary" : "bg-gray-200"
        )}
      >
        <motion.div 
          animate={{ x: active ? 24 : 4 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
