import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface UserProfilePageProps {
  session: any;
  userProfile: any;
  onProfileUpdate: (profile: any) => void;
}

export default function UserProfilePage({ session, userProfile, onProfileUpdate }: UserProfilePageProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [homeWard, setHomeWard] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [healthCondition, setHealthCondition] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setAge(userProfile.age?.toString() || '');
      setHomeWard(userProfile.home_ward || '');
      setPhoneNumber(userProfile.phone_number || '');
      setHealthCondition(userProfile.health_condition || '');
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
      const token = session?.access_token;

      const profileData = {
        full_name: fullName || null,
        age: age ? parseInt(age) : null,
        home_ward: homeWard || null,
        phone_number: phoneNumber || null,
        health_condition: healthCondition || null,
      };

      const res = await fetch(`${API_BASE}/api/v1/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to update profile');
      }

      const updated = await res.json();
      onProfileUpdate(updated);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 text-slate-100">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,242,255,0.15)] flex items-center justify-between px-8 h-20">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined text-cyan-400">arrow_back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl font-bold">person</span>
            </div>
            <div>
              <h1 className="font-headline font-black text-2xl tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">User Profile</h1>
              <p className="font-label text-[10px] tracking-[0.3em] text-cyan-400/60 uppercase">Account Management</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-12 px-8 max-w-4xl mx-auto">
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${message.includes('success') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
            <p className="text-sm font-bold">{message}</p>
          </div>
        )}

        {/* Profile Information Section */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400">badge</span>
            Profile Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
                placeholder="Enter your age"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Home Ward</label>
              <input
                type="text"
                value={homeWard}
                onChange={(e) => setHomeWard(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
                placeholder="e.g., Punjabi Bagh"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Health Condition</label>
              <select
                value={healthCondition}
                onChange={(e) => setHealthCondition(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
              >
                <option value="">None</option>
                <option value="asthma">Asthma</option>
                <option value="copd">COPD</option>
                <option value="heart_disease">Heart Disease</option>
                <option value="respiratory">Respiratory Issues</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="mt-6 w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        {/* Password Change Section */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400">lock</span>
            Change Password
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={loading || !newPassword || !confirmPassword}
            className="mt-6 w-full bg-gradient-to-r from-rose-600 to-rose-800 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-rose-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </main>
    </div>
  );
}
