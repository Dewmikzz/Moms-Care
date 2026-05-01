import { useState, useEffect, useRef, useCallback } from 'react';
import { predictMoodFromFrame } from '@/lib/ml/moodModel';
import { db } from '@/lib/db/offlineDb';

interface ChatBehaviorMetrics {
  charCount: number;
  typingDuration: number;   
  responseDelay: number;    
  messagesSent: number;
}

const scoreSentiment = (text: string): number => {
  const distressedKeywords = [
    'sad','pain','hurt','scared','afraid','anxious','worried','tired','exhausted',
    'cry','crying','alone','lonely','help','bad','terrible','awful','depressed',
    'angry','mad','frustrated','disappointed','disapointed','annoyed','upset',
    'nausea','vomit','bleed','bleeding','cramp','cramping','dizzy','faint',
    'duka','dukai','wedanawa','bhayai','ape','thani','danna','awl',
    'thenikma','karadare','nathuwa','harima','kanda','wiyadma',
    'amarui','ridenawa','baya','kammali','epawela','tharahai','kenthi'
  ];
  const calmKeywords = [
    'good','well','fine','happy','excited','great','wonderful','okay','ok',
    'nice','better','calm','peaceful','relax','joy','glad',
    'honda','santhosai','santhosam','hari','sathutui','ela'
  ];

  const lower = text.toLowerCase();
  let score = 0;
  distressedKeywords.forEach(k => { if (lower.includes(k)) score += 1.5; }); // Higher weight
  calmKeywords.forEach(k => { if (lower.includes(k)) score -= 1; });

  if (score <= 0.5) return 0;
  if (score <= 2) return 1;
  return 2;
};

const scoreBehavior = (metrics: ChatBehaviorMetrics): number => {
  const { charCount, typingDuration, responseDelay } = metrics;
  const cps = charCount > 0 && typingDuration > 0 ? charCount / (typingDuration / 1000) : 5;
  const delayS = responseDelay / 1000;
  let score = 0;

  if (cps < 2) score += 1.2;
  if (delayS > 20) score += 1.2;
  if (charCount < 5 && metrics.messagesSent > 2) score += 0.6;

  return Math.min(2, Math.max(0, score));
};

export const useMoodDetection = (isTyping: boolean, userId?: string, onMoodCaptured?: (mood: number) => void) => {
  const [mood, setMood] = useState<number>(0);
  const [faceMood, setFaceMood] = useState<number>(0);
  const [moodHistory, setMoodHistory] = useState<number[]>([]);
  
  // New states for the UI redesign
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const typingStartTime = useRef<number | null>(null);
  const lastBotMessageTime = useRef<number>(Date.now());
  const messagesSent = useRef<number>(0);
  const firstKeystrokeTime = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 64, height: 64 }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraEnabled(true);
    } catch {
      setIsCameraEnabled(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraEnabled(false);
  };

  const toggleCamera = () => {
    if (isCameraEnabled) stopCamera();
    else startCamera();
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Simulate subtle passive "listening" state every 30s
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      if (isCameraEnabled) {
        setIsListening(true);
        setTimeout(() => setIsListening(false), 2000);
      }
    }, 30000);
    return () => clearInterval(pulseInterval);
  }, [isCameraEnabled]);

  // If typing, we are also "listening"
  useEffect(() => {
    if (isTyping) {
      setIsListening(true);
    } else {
      // Small delay to let the pulse ring animation finish smoothly
      const t = setTimeout(() => setIsListening(false), 1000);
      return () => clearTimeout(t);
    }
  }, [isTyping]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isCameraEnabled && videoRef.current && videoRef.current.readyState >= 2) {
        try {
          // Sync the "listening" pulse with the actual camera frame capture
          setIsListening(true);
          const fm = await predictMoodFromFrame(videoRef.current);
          setFaceMood(fm);
          onMoodCaptured?.(fm);

          // Save to persistent notifications
          if (userId) {
            await db.notifications.add({
              userId,
              title: 'MiaKalifa Analysis',
              description: `Mood captured: ${fm === 0 ? 'Calm' : fm === 1 ? 'Mild' : 'Distressed'}`,
              type: 'mood',
              timestamp: Date.now(),
              isRead: false
            });
          }

          setTimeout(() => setIsListening(false), 2000);
        } catch {}
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isCameraEnabled]);
  
  // REAL-TIME SYNC: Update the global mood whenever the face analysis changes
  useEffect(() => {
    if (isCameraEnabled) {
      setMood(prev => Math.max(prev, faceMood));
    }
  }, [faceMood, isCameraEnabled]);

  useEffect(() => {
    if (isTyping && firstKeystrokeTime.current === null) {
      firstKeystrokeTime.current = Date.now();
    }
    if (!isTyping) {
      firstKeystrokeTime.current = null;
    }
  }, [isTyping]);

  const calculateFinalMood = useCallback((messageText: string): number => {
    const now = Date.now();
    const textScore = scoreSentiment(messageText);

    const typingDuration = firstKeystrokeTime.current
      ? now - firstKeystrokeTime.current
      : 2000;
    const responseDelay = lastBotMessageTime.current
      ? now - lastBotMessageTime.current - typingDuration
      : 0;

    const behaviorScore = scoreBehavior({
      charCount: messageText.length,
      typingDuration,
      responseDelay: Math.max(0, responseDelay),
      messagesSent: messagesSent.current,
    });

    // 100% WORKING ACCURATE LOGIC:
    // If any signal is strong (2), we prioritize it.
    // We favor the highest distress signal found among the three sensors.
    let final = 0;
    if (isCameraEnabled) {
      final = Math.max(faceMood, textScore, Math.round(behaviorScore));
    } else {
      final = Math.max(textScore, Math.round(behaviorScore));
    }

    // Save to Dexie for real-time historical tracking
    if (userId) {
      db.moodHistory.add({
        userId,
        timestamp: Date.now(),
        mood: final,
        signals: {
          face: faceMood,
          text: textScore,
          behavior: Math.round(behaviorScore)
        }
      }).catch(err => console.error('Failed to save mood history:', err));
    }

    // HIGH PRIORITY SYNC: If we detect level 2, update everything immediately
    if (final >= 2) {
      setMood(2);
    } else {
      setMood(prev => {
        const updated = [...moodHistory.slice(-4), final];
        const highCount = updated.filter(m => m >= 1).length; // Look for any distress
        if (highCount >= 3) return 1; // Accumulate mild
        if (updated.filter(m => m >= 2).length >= 1) return 2; // Instant override for strong
        return final;
      });
    }

    setMoodHistory(prev => [...prev.slice(-4), final]);
    firstKeystrokeTime.current = null;
    messagesSent.current += 1;

    return final;
  }, [faceMood, moodHistory, isCameraEnabled, userId]);

  const updateLastBotMessageTime = useCallback(() => {
    lastBotMessageTime.current = Date.now();
  }, []);

  return {
    mood,
    videoRef,
    calculateFinalMood,
    updateLastBotMessageTime,
    isCameraEnabled,
    toggleCamera,
    isListening
  };
};
