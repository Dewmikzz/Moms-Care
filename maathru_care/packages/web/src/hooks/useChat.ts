import { useState, useEffect } from 'react';
import { db, type Message } from '@/lib/db/offlineDb';
import { useAuth } from './useAuth';

export const useChat = (initialLanguage: 'si' | 'en' = 'en') => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [language, setLanguage] = useState<'si' | 'en'>(initialLanguage);
  const [isOffline, setIsOffline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    // Load messages from Dexie
    const loadMessages = async () => {
      if (!user) {
        setMessages([]);
        setIsLoading(false);
        return;
      }
      
      try {
        const history = await db.messages
          .where('userId')
          .equals(user.uid)
          .sortBy('timestamp');
        setMessages(history);
      } catch (err) {
        // Fallback for older db versions without the index
        const allHistory = await db.messages.orderBy('timestamp').toArray();
        setMessages(allHistory.filter(m => m.userId === user.uid));
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  const addMessage = async (content: string, sender: 'user' | 'bot', mood: number) => {
    const newMessage: Message = {
      content,
      sender,
      timestamp: Date.now(),
      mood,
      language,
      status: isOffline && sender === 'user' ? 'queued' : 'sent',
      userId: user?.uid
    };
    const id = await db.messages.add(newMessage);
    newMessage.id = id as number;
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const sendMessage = async (
    content: string,
    mood: number,
    onBotReply: (reply: string) => void
  ) => {
    // Add user message immediately
    await addMessage(content, 'user', mood);

    if (isOffline) {
      const offlineMsg = language === 'si'
        ? 'ඔබ නොබැඳිව සිටී. නැවත සබැඳි වූ පසු මම ප්‍රතිචාර දෙන්නම්.'
        : "You're offline. I'll reply once you're back online.";
      await addMessage(offlineMsg, 'bot', mood);
      onBotReply(offlineMsg);
      return;
    }

    setIsBotThinking(true);
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, mood, language })
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      const reply = data.reply || (language === 'si' ? 'ප්‍රතිචාරය ලැබිය නොහැකිය.' : 'Unable to get a response.');
      await addMessage(reply, 'bot', mood);
      onBotReply(reply);
    } catch (err) {
      console.error('Send message error:', err);
      const errMsg = language === 'si'
        ? 'සමාවෙනවා, දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.'
        : 'Sorry, something went wrong. Please try again.';
      await addMessage(errMsg, 'bot', mood);
    } finally {
      setIsBotThinking(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'si' ? 'en' : 'si'));
  };

  return {
    messages,
    language,
    isOffline,
    isTyping,
    isBotThinking,
    isLoading,
    setIsTyping,
    addMessage,
    sendMessage,
    toggleLanguage
  };
};
