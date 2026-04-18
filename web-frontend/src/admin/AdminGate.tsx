import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Panels
import ComplaintsPanel from './ComplaintsPanel';
import TasksBoard from './TasksBoard';
import LiveMonitoring from './LiveMonitoring';
import ReportingPanel from './ReportingPanel';

// ── Passphrase fallback for when Supabase is unreachable ──────────────────────
const ADMIN_PASSPHRASE = import.meta.env.VITE_ADMIN_PASSPHRASE || 'VAYU2025';

function PassphraseScreen({ onSuccess }: { onSuccess: (name: string) => void }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toUpperCase() === ADMIN_PASSPHRASE.toUpperCase()) {
      onSuccess('Admin');
    } else {
      setError('Invalid passphrase. Access denied.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setInput('');
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0c0e12] flex items-center justify-center font-sans">
      <div className={`w-full max-w-sm mx-auto ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
        <div className="p-8 bg-slate-900 border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(0,242,255,0.07)]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-cyan-400 text-3xl">admin_panel_settings</span>
            </div>
            <h1 className="text-white font-black text-xl tracking-tight uppercase">Admin Console</h1>
            <p className="text-slate-500 text-[11px] tracking-[0.2em] uppercase mt-1">VayuDrishti — Restricted Access</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Security Passphrase
              </label>
              <input
                type="password"
                value={input}
                onChange={e => { setInput(e.target.value); setError(''); }}
                placeholder="Enter passphrase..."
                autoFocus
                className="w-full bg-slate-800 border border-white/10 focus:border-cyan-500/50 outline-none rounded-lg px-4 py-3 text-white text-sm font-mono tracking-widest placeholder:text-slate-600 transition-all"
              />
            </div>

            {error && (
              <p className="text-rose-400 text-[11px] font-bold uppercase tracking-widest text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs tracking-[0.2em] uppercase rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-95"
            >
              Authenticate
            </button>

            <a
              href="/"
              className="text-center text-slate-600 hover:text-slate-400 text-[10px] uppercase tracking-widest transition-all mt-1"
            >
              ← Return to Dashboard
            </a>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

export default function AdminGate() {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  // fallback: when Supabase is unreachable, show passphrase screen
  const [showPassphrase, setShowPassphrase] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      // Detect placeholder / unconfigured Supabase
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder');

      if (isPlaceholder) {
        console.warn('[AdminGate] Supabase not configured — showing passphrase fallback.');
        setShowPassphrase(true);
        setLoading(false);
        return;
      }

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.warn('[AdminGate] No session or session error:', sessionError?.message);
          setShowPassphrase(true);
          setLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        console.log('[AdminGate] Profile check result:', profile);
        if (profileError) console.error('[AdminGate] DB error:', profileError);

        if (profile && (
            profile.role?.toLowerCase() === 'admin' ||
            profile.role?.toLowerCase() === 'officer'
        )) {
          setUserProfile(profile);
          setLoading(false);
        } else {
          const foundRole = profile?.role || 'NOT FOUND';
          console.warn(`[AdminGate] Unauthorized role: '${foundRole}' — falling back to passphrase`);
          setShowPassphrase(true);
          setLoading(false);
        }
      } catch (err: any) {
        // Network failure (DNS error, timeout, etc.) — use passphrase fallback
        console.warn('[AdminGate] Supabase network error — using passphrase fallback:', err.message);
        setShowPassphrase(true);
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0c0e12] flex items-center justify-center font-sans">
        <div className="text-cyan-400 animate-pulse tracking-widest uppercase font-bold text-sm">Verifying Clearance...</div>
      </div>
    );
  }

  // Passphrase fallback — show PIN screen, on success create a synthetic profile
  if (showPassphrase && !userProfile) {
    return (
      <PassphraseScreen
        onSuccess={(name) =>
          setUserProfile({ role: 'admin', username: name, full_name: name })
        }
      />
    );
  }

  if (!userProfile) return null;

  return (
    <div className="h-screen w-screen bg-[#0c0e12] text-slate-200 font-sans flex overflow-hidden">
      {/* Sidebar Command Center */}
      <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col p-6 z-50 shrink-0">
        <div className="mb-10">
          <h2 className="text-xl font-bold tracking-tighter text-white">VayuDrishti</h2>
          <p className="text-[10px] text-cyan-500 tracking-[0.3em] font-black uppercase">{(userProfile.role || 'admin').toUpperCase()} CONSOLE</p>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm font-semibold text-slate-400 hover:text-white group">
            <span className="material-symbols-outlined text-[20px] group-hover:text-cyan-400">dashboard</span>
            Monitoring
          </Link>
          <Link to="/admin/complaints" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm font-semibold text-slate-400 hover:text-white group">
            <span className="material-symbols-outlined text-[20px] group-hover:text-cyan-400">chat_bubble</span>
            Complaints
          </Link>
          <Link to="/admin/tasks" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm font-semibold text-slate-400 hover:text-white group">
            <span className="material-symbols-outlined text-[20px] group-hover:text-cyan-400">task_alt</span>
            Tasks Board
          </Link>
          <Link to="/admin/reports" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm font-semibold text-slate-400 hover:text-white group">
            <span className="material-symbols-outlined text-[20px] group-hover:text-cyan-400">query_stats</span>
            Policy Hub
          </Link>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 font-bold border border-white/5">
              {(userProfile.username || userProfile.full_name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
               <span className="text-sm font-bold text-white truncate">
                 {(userProfile.username || userProfile.full_name || 'Admin')?.split('@')[0]}
               </span>
               <span className="text-[10px] text-slate-500 uppercase tracking-widest">{userProfile.role || 'admin'}</span>
            </div>
          </div>
          <button
            onClick={() => {
              supabase.auth.signOut().catch(() => {});
              window.location.href = '/';
            }}
            className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest rounded transition-all"
          >
            Exit Console
          </button>
        </div>
      </aside>

      {/* Dynamic Content Panel */}
      <main className="flex-1 overflow-auto relative">
        <Routes>
          <Route path="/" element={<LiveMonitoring user={userProfile} />} />
          <Route path="/complaints" element={<div className="p-8"><ComplaintsPanel user={userProfile} /></div>} />
          <Route path="/tasks" element={<div className="p-8"><TasksBoard user={userProfile} /></div>} />
          <Route path="/reports" element={<div className="p-8"><ReportingPanel user={userProfile} /></div>} />
          <Route path="*" element={<div className="p-12 text-rose-500 font-bold uppercase">404: Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}
