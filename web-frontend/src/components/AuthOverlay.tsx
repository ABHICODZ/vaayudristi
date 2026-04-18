import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// Detect if Supabase is actually configured
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_OK = !!(SUPABASE_URL && !SUPABASE_URL.includes('placeholder') && SUPABASE_URL.startsWith('https://'));

export default function AuthOverlay({ session, setSession, userProfile, setUserProfile }: any) {
  const [checking, setChecking] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (!SUPABASE_OK) {
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!error) setSession(session);
      setChecking(false);
    }).catch(() => {
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, [setSession]);

  useEffect(() => {
    if (!session?.user || !SUPABASE_OK) { setUserProfile(null); return; }
    supabase.from('profiles').select('*').eq('id', session.user.id).single()
      .then(({ data }) => { if (data) setUserProfile(data); })
      .catch(() => {});
  }, [session, setUserProfile]);

  // Brief spinner only while checking session
  if (checking) {
    return (
      <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm pointer-events-none">
        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Authenticated — nothing to render
  if (session) return null;

  // Not authenticated — show a small floating sign-in button (non-blocking)
  if (!showPanel) {
    return (
      <div className="absolute top-24 right-8 z-[500]">
        <button
          onClick={() => setShowPanel(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-700/80 hover:border-cyan-500/30 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-cyan-400 text-base">login</span>
          Sign In
        </button>
      </div>
    );
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!SUPABASE_OK) { setAuthError('Authentication service not configured.'); return; }
    setAuthLoading(true);
    setAuthError('');
    try {
      const result = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        setAuthError(result.error.message);
      } else {
        setShowPanel(false);
      }
    } catch (_err) {
      setAuthError('Connection failed. Network may be unavailable.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative">

        <button
          onClick={() => setShowPanel(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-white transition-all rounded-lg hover:bg-white/5"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-blue-400 text-2xl">air</span>
          </div>
          <h2 className="text-white font-black text-lg uppercase tracking-widest">VayuDrishti</h2>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-0.5">Secure Citizen Portal</p>
        </div>

        {!SUPABASE_OK && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <p className="text-amber-400 text-[11px] font-bold uppercase tracking-wide">Auth service offline</p>
            <p className="text-amber-400/70 text-[10px] mt-1">Supabase not configured in this environment. Use Guest access below.</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            required
            disabled={!SUPABASE_OK}
            className="w-full bg-slate-800 border border-white/10 focus:border-blue-500/50 outline-none rounded-lg px-4 py-3 text-white text-sm placeholder:text-slate-600 transition-all disabled:opacity-40"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={!SUPABASE_OK}
            className="w-full bg-slate-800 border border-white/10 focus:border-blue-500/50 outline-none rounded-lg px-4 py-3 text-white text-sm placeholder:text-slate-600 transition-all disabled:opacity-40"
          />

          {authError && (
            <p className="text-rose-400 text-[11px] font-bold uppercase tracking-widest text-center">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={authLoading || !SUPABASE_OK}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 text-white font-black text-xs tracking-[0.2em] uppercase rounded-lg transition-all active:scale-95"
          >
            {authLoading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-slate-600 text-[10px] uppercase">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={() => setShowPanel(false)}
          className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs tracking-widest uppercase rounded-lg transition-all"
        >
          Continue as Guest
        </button>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-3 text-slate-600 hover:text-slate-400 text-[10px] uppercase tracking-widest text-center transition-all"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}
