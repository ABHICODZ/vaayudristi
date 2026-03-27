import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import App from './App';
import UserProfilePage from './pages/UserProfilePage';
import AdminGate from './admin/AdminGate';

export default function AppRouter() {
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data, error }) => {
          if (data) setUserProfile(data);
        });
    } else {
      setUserProfile(null);
    }
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
