import React, { useEffect, useState } from 'react';

export default function TasksBoard({ user }: { user: any }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080";
        const tokenKey = Object.keys(localStorage).find(k => k.endsWith('-auth-token'));
        const tokenStr = tokenKey ? localStorage.getItem(tokenKey) : null;
        let token = '';
        if (tokenStr) token = JSON.parse(tokenStr).access_token;

        const res = await fetch(`${API_BASE}/api/v1/admin/tasks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          setTasks(await res.json());
        }
      } catch (e) {
        console.error("Error fetching tasks:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  if (loading) {
     return <div className="p-8 text-cyan-500 animate-pulse">Initializing Action Grid...</div>;
  }

  const pending = tasks.filter(t => t.status === 'PENDING');
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
  const completed = tasks.filter(t => t.status === 'COMPLETED');

  const Column = ({ title, items, color }: { title: string, items: any[], color: string }) => (
    <div className="flex-1 bg-slate-900/40 rounded-xl p-4 flex flex-col gap-4 border border-white/5">
      <div className="flex items-center justify-between border-b mx-2 pb-2" style={{ borderColor: `${color}30` }}>
        <h3 className="font-black text-sm tracking-widest uppercase" style={{ color }}>{title}</h3>
        <span className="text-xs font-bold text-slate-500 bg-black/40 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto">
        {items.map(t => (
          <div key={t.id} className="bg-slate-950/80 p-4 rounded-lg flex flex-col gap-2 hover:bg-slate-900 transition-colors border border-white/5 shadow-lg">
            <div className="flex items-center justify-between">
               <span className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">ACTION: {t.id.substring(0,6)}</span>
               <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${
                  t.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                  t.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                  t.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
               }`}>{t.priority}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">{t.title}</h4>
            {t.description && <p className="text-xs text-slate-400 line-clamp-2">{t.description}</p>}
            <div className="mt-2 text-[10px] text-cyan-500 font-mono">
               {t.deadline ? `DUE: ${new Date(t.deadline).toLocaleDateString()}` : 'NO DEADLINE'}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center p-8 text-xs text-slate-600 font-bold uppercase tracking-widest border-2 border-dashed border-white/5 rounded-lg mt-2">Empty</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight text-white">Action Matrix</h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time Officer Dispatch Tracker</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <Column title="Pending Validation" items={pending} color="#f43f5e" />
        <Column title="In Action" items={inProgress} color="#0ea5e9" />
        <Column title="Resolved Enforcement" items={completed} color="#10b981" />
      </div>
    </div>
  );
}
