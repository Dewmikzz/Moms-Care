import Dexie, { type Table } from 'dexie';

export interface Message {
  id?: number;
  userId?: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
  mood: number; // 0, 1, 2
  language: 'si' | 'en';
  status: 'sent' | 'queued' | 'error';
}

export interface MoodEntry {
  id?: number;
  userId?: string;
  timestamp: number;
  mood: number;
  signals: {
    face: number;
    text: number;
    behavior: number;
  };
}

export interface SavedMusic {
  id?: string;
  userId?: string;
  title: string;
  url: string;
  savedAt: number;
}

export interface Notification {
  id?: number;
  userId?: string;
  title: string;
  description: string;
  type: 'mood' | 'milestone' | 'info';
  timestamp: number;
  isRead: boolean;
}

export class MaathruCareDB extends Dexie {
  messages!: Table<Message>;
  moodHistory!: Table<MoodEntry>;
  savedMusic!: Table<SavedMusic>;
  notifications!: Table<Notification>;

  constructor() {
    super('MaathruCareDB');
    this.version(1).stores({
      messages: '++id, timestamp, status',
      moodHistory: '++id, timestamp, mood',
      savedMusic: 'id, title'
    });
    this.version(2).stores({
      messages: '++id, userId, timestamp, status',
      moodHistory: '++id, userId, timestamp, mood',
      savedMusic: 'id, userId, title'
    });
    this.version(3).stores({
      messages: '++id, userId, timestamp, status',
      moodHistory: '++id, userId, timestamp, mood',
      savedMusic: 'id, userId, title',
      notifications: '++id, userId, timestamp, type, isRead'
    });
  }
}

export const db = new MaathruCareDB();
