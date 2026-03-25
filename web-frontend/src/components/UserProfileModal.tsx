import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfileModalProps {
  userProfile: any;
  session: any;
  onClose: () => void;
  onProfileUpdate: (updatedProfile: any) => void;
}

const DELHI_WARDS = [
  'Punjabi Bagh', 'Rohini', 'Dwarka', 'Janakpuri', 'Rajouri Garden',
  'Karol Bagh', 'Chandni Chowk', 'Sadar Bazaar', 'Civil Lines',
  'Connaught Place', 'ITO', 'Mandir Marg', 'Nehru Place', 'Lajpat Nagar',
  'Kalkaji', 'Greater Kailash', 'Hauz Khas', 'Vasant Vihar', 'R.K. Puram',
  'Narela', 'Alipur', 'Model Town', 'Sarai Rohilla', 'Shakur Basti',
  'Tri Nagar', 'Wazirpur', 'Moti Nagar', 'Madipur', 'Rajinder Nagar',
  'Patel Nagar', 'Hari Nagar', 'Tilak Nagar', 'Janakpuri', 'Vikaspuri',
  'Uttam Nagar', 'Dwarka', 'Matiala', 'Najafgarh', 'Mehrauli',
  'Chhatarpur', 'Deoli', 'Ambedkar Nagar', 'Sangam Vihar', 'Kalkaji',
  'Tughlakabad', 'Badarpur', 'Okhla', 'Trilokpuri', 'Kondli',
  'Patparganj', 'Laxmi Nagar', 'Vishwas Nagar', 'Krishna Nagar', 'Gandhi Nagar',
  'Shahdara', 'Seemapuri', 'Rohtas Nagar', 'Seelampur', 'Ghonda',
  'Babarpur', 'Gokalpur', 'Mustafabad', 'Karawal Nagar', 'Burari',
  'Timarpur', 'Adarsh Nagar', 'Badli', 'Rithala', 'Bawana',
  'Mundka', 'Kirari', 'Sultanpur Majra', 'Nangloi Jat', 'Mangol Puri',
  'Rohini', 'Shalimar Bagh', 'Shakur Pur', 'Tri Nagar', 'Sadar Bazar'
];

const HEALTH_CONDITIONS = [
  { value: 'none', label: 'No respiratory conditions' },
  { value: 'asthma', label: 'Asthma' },
  { value: 'copd', label: 'COPD (Chronic Obstructive Pulmonary Disease)' },
  { value: 'bronchitis', label: 'Chronic Bronchitis' },
  { value: 'emphysema', label: 'Emphysema' },
  { value: 'allergies', label: 'Severe Allergies' },
  { value: 'other', label: 'Other respiratory condition' }
];

export default function UserProfileModal({ userProfile, session, onClose, onProfileUpdate }: UserProfileModalProps) {
  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || '',
    age: userProfile?.age || 30,
    home_ward: userProfile?.home_ward || 'Punjabi Bagh',
    health_condition: userProfile?.has_asthma ? 'asthma' : 'none',
    has_asthma: userProfile?.has_asthma || false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Update has_asthma based on health_condition selection
    setFormData(prev => ({
      ...prev,
      has_asthma: prev.health_condition === 'asthma'
    }));
  }, [formData.health_condition]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080";
      const token = session?.access_token;

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_BASE}/api/v1/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          age: formData.age,
          home_ward: formData.home_ward,
          has_asthma: formData.has_asthma
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile');
      }

      const updatedProfile = await response.json();
      setSuccess(true);
      onProfileUpdate(updatedProfile);
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 p-6 flex items-center justify-between border-b border-slate-700 z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold uppercase">
                {userProfile?.full_name?.charAt(0) || userProfile?.email?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">User Profile</h2>
                <p className="text-xs text-cyan-100 uppercase tracking-wider">{userProfile?.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-white">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                <span className="text-emerald-400 font-bold text-sm">Profile updated successfully!</span>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-rose-400">error</span>
                <span className="text-rose-400 font-bold text-sm">{error}</span>
              </motion.div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="1"
                  max="120"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <p className="text-xs text-slate-500 mt-1">Used for personalized air quality recommendations</p>
              </div>

              {/* Home Ward */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Home Ward
                </label>
                <select
                  name="home_ward"
                  value={formData.home_ward}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  {DELHI_WARDS.sort().map(ward => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Your primary residential area in Delhi</p>
              </div>

              {/* Health Condition */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Respiratory Health Condition
                </label>
                <select
                  name="health_condition"
                  value={formData.health_condition}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  {HEALTH_CONDITIONS.map(condition => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Helps provide personalized health alerts and safe exposure recommendations
                </p>
              </div>

              {/* Role Display (Read-only) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Account Role
                </label>
                <div className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-400 flex items-center justify-between">
                  <span className="uppercase font-bold tracking-wider">{userProfile?.role || 'citizen'}</span>
                  <span className="text-xs text-slate-500">Read-only</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Contact administrator to change your role</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">save</span>
                    Save Changes
                  </>
                )}
              </button>
            </form>

            {/* Password Change Section */}
            <div className="border-t border-slate-700 pt-6">
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-bold text-sm uppercase tracking-wider"
              >
                <span className="material-symbols-outlined">lock</span>
                {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
              </button>

              {showPasswordChange && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handlePasswordUpdate}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Enter new password"
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Confirm new password"
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">lock_reset</span>
                        Update Password
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
