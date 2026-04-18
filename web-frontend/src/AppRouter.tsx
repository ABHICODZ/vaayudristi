import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import App from './App';
import UserProfilePage from './pages/UserProfilePage';
import AdminGate from './admin/AdminGate';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_OK = !!(SUPABASE_URL && !SUPABASE_URL.includes('placeholder') && SUPABASE_URL.startsWith('https://'));

export default function AppRouter() {
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (!SUPABASE_OK) return; // skip entirely if Supabase not configured

    // Add timeout so DNS failure doesn't hang the app
    const timeout = setTimeout(() => {
      console.warn('[AppRouter] Supabase getSession timed out');
    }, 5000);

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        clearTimeout(timeout);
        setSession(session);
      })
      .catch(err => {
        clearTimeout(timeout);
        console.warn('[AppRouter] Supabase getSession failed:', err.message);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user || !SUPABASE_OK) {
      setUserProfile(null);
      return;
    }
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data) setUserProfile(data);
      })
      .catch(() => {});
  }, [session]);

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminGate />} />
      <Route
        path="/profile"
        element={
          <UserProfilePage
            session={session}
            userProfile={userProfile}
            onProfileUpdate={setUserProfile}
          />
        }
      />
      <Route
        path="/*"
        element={
          <App
            session={session}
            setSession={setSession}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        }
      />
    </Routes>
  );
}
