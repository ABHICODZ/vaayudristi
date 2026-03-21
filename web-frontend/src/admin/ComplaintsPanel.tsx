import React, { useEffect, useState } from 'react';

export default function ComplaintsPanel({ user }: { user: any }) {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080";
        // To secure the backend, we extract the Supabase JWT from local storage.
        // Supabase stores tokens in localStorage based on the project ref.
        const tokenKey = Object.keys(localStorage).find(k => k.endsWith('-auth-token'));
        const tokenStr = tokenKey ? localStorage.getItem(tokenKey) : null;
        let token = '';
        if (tokenStr) {
           const sessionObj = JSON.parse(tokenStr);
           token = sessionObj.access_token;
        }

        const res = await fetch(`${API_BASE}/api/v1/admin/complaints`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          setComplaints(await res.json());
        }
      } catch (e) {
        console.error("Error fetching complaints:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchComplaints();
  }, []);

  if (loading) {
     return <div className="p-8 text-cyan-500 animate-pulse">Synchronizing Regional Intakes...</div>;
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight text-white">CITIZEN INTAKE STREAM</h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Regional Grievance Network Overview</p>
      </div>

      <div className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-white/5 text-[10px] uppercase font-black tracking-widest text-slate-500">
                <th className="p-4">Reference ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Location (Ward)</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {complaints.length > 0 ? complaints.map(c => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-xs font-mono text-slate-400">{c.id.substring(0, 8)}</td>
                  <td className="p-4 text-slate-300">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                     <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-xs font-bold text-slate-200 uppercase">{c.ward}</span>
                  </td>
                  <td className="p-4 text-slate-300 font-semibold">{c.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                      c.status === 'NEW' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      c.status === 'UNDER_REVIEW' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      c.status === 'IN_ACTION' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                     <button className="text-xs font-bold bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded hover:bg-cyan-500 mt-1 hover:text-white transition-all">
                       INVESTIGATE
                     </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500 font-medium italic">
                    No active complaints recorded in the sector.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
