'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { Mail, Lock, User as UserIcon, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Check if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/home');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (view === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/home');
      } else if (view === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name && userCredential.user) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        router.push('/home');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/home');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-100 flex items-center justify-center font-sans">
      <div className="w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-white sm:rounded-[40px] sm:shadow-2xl sm:border sm:border-slate-200 overflow-hidden relative flex flex-col">
        
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col pt-16 relative z-10"
            >
              {/* Content top */}
              <div className="px-6 flex flex-col items-center text-center z-20">
                <h1 className="text-[26px] font-bold text-gray-900 mb-3 tracking-tight font-sans">
                  Welcome to Maathru Care
                </h1>
                <p className="text-[15px] text-gray-600 leading-relaxed max-w-[280px]">
                  Create an Account to get started on your Health and Happiness Journey
                </p>

                {/* Dots */}
                <div className="flex items-center gap-1.5 mt-8 mb-10">
                  <div className="w-6 h-1.5 bg-brand-primary rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-brand-primary/50 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-brand-primary/50 rounded-full"></div>
                </div>

                {/* Buttons */}
                <button 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-brand-primary text-white rounded-full py-4 font-bold text-[15px] flex items-center justify-center gap-3 mb-4 shadow-sm active:scale-[0.98] transition-transform disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5 bg-white rounded-full p-0.5">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Continue With Google
                    </>
                  )}
                </button>

                <button 
                  onClick={() => setView('signup')}
                  className="w-full bg-white border border-gray-200 text-gray-700 rounded-full py-4 font-bold text-[15px] flex items-center justify-center gap-3 mb-10 active:bg-gray-50 transition-colors"
                >
                  <Mail className="text-brand-primary" size={20} strokeWidth={2.5} />
                  Continue With Email
                </button>

                {/* Login text */}
                <p className="text-[15px] text-gray-600 font-medium">
                  Already have an account?{' '}
                  <button onClick={() => setView('login')} className="font-bold text-gray-900 hover:text-brand-primary transition-colors">
                    log in
                  </button>
                </p>
              </div>

              {/* Illustration Bottom */}
              <div className="absolute bottom-0 left-0 w-full h-[400px] z-0 pointer-events-none">
                <Image 
                  src="/images/cute_mom_illustration.png" 
                  alt="Illustration" 
                  fill 
                  className="object-cover object-top scale-110 translate-y-16" 
                  priority 
                />
                {/* Gradient fade to white at top of image */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="flex-1 flex flex-col bg-white z-20 relative h-full overflow-y-auto"
            >
              {/* Header */}
              <header className="px-5 py-4 flex items-center justify-between shrink-0">
                <button 
                  onClick={() => setView('landing')}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors -ml-2"
                >
                  <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <div className="font-bold text-gray-900 text-lg">
                  {view === 'login' ? 'Log In' : 'Sign Up'}
                </div>
                <div className="w-10"></div> {/* Spacer for centering */}
              </header>

              <div className="flex-1 px-6 py-6 flex flex-col">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                  {view === 'login' ? 'Welcome back' : 'Create account'}
                </h1>
                <p className="text-gray-500 text-base mb-8">
                  {view === 'login' ? 'Enter your details to access your dashboard.' : 'Start your personalized pregnancy journey today.'}
                </p>

                {error && (
                  <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-2xl flex items-start gap-3 text-sm font-medium">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                  {view === 'signup' && (
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-gray-50 border-transparent focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20 rounded-[20px] pl-12 pr-4 py-4 text-[15px] font-medium text-gray-900 transition-all outline-none"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-gray-50 border-transparent focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20 rounded-[20px] pl-12 pr-4 py-4 text-[15px] font-medium text-gray-900 transition-all outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-gray-50 border-transparent focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20 rounded-[20px] pl-12 pr-4 py-4 text-[15px] font-medium text-gray-900 transition-all outline-none"
                    />
                  </div>

                  {view === 'login' && (
                    <div className="flex justify-end pt-2">
                      <button type="button" className="text-sm font-bold text-gray-500 hover:text-brand-primary transition-colors">
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-primary text-white rounded-full py-4 text-[16px] font-bold transition-all active:scale-[0.98] disabled:opacity-70 mt-6 flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (view === 'login' ? 'Log In' : 'Sign Up')}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
