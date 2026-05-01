'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Camera, TrendingUp, Info } from 'lucide-react';
import { db, Notification } from '@/lib/db/offlineDb';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

export const NotificationCenter = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !isOpen) return;

    const fetchNotifications = async () => {
      const data = await db.notifications
        .where('userId').equals(user.uid)
        .reverse()
        .limit(20)
        .toArray();
      setNotifications(data);

      // Mark all as read when opening
      await db.notifications
        .where('userId').equals(user.uid)
        .modify({ isRead: true });
    };

    fetchNotifications();
  }, [user, isOpen]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'mood': return <Camera size={18} />;
      case 'milestone': return <TrendingUp size={18} />;
      default: return <Info size={18} />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'mood': return 'bg-brand-primary/10 text-brand-primary';
      case 'milestone': return 'bg-teal-50 text-teal-600';
      default: return 'bg-blue-50 text-blue-500';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[350px] bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Bell size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Notifications</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
                    <Bell size={32} />
                  </div>
                  <p className="text-gray-400 font-medium">No previous notifications yet.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="p-4 rounded-3xl bg-gray-50 border border-gray-100 flex gap-4"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getColors(n.type)}`}>
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-[14px] font-bold text-gray-900 leading-tight">{n.title}</h4>
                        <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">
                          {formatDistanceToNow(n.timestamp)} ago
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-500 leading-snug">{n.description}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
