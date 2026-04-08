'use client';
import { useAuth } from '@clerk/nextjs';
import { fetchWithAuth } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function AdminOverview() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
         const token = await getToken();
         if (token) {
           const res = await fetchWithAuth('/api/v1/admin/stats', token);
           setStats(res);
         }
      } catch (e) {
         console.error('Failed to load admin stats', e);
      }
    }
    load();
  }, [getToken]);

  if (!stats) return <div className="text-zinc-500 animate-pulse">Loading core metrics...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-black mb-8">Mission Control</h1>
      
      <div className="grid grid-cols-4 gap-6 mb-12">
        <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl">
          <div className="text-zinc-400 text-sm font-semibold uppercase mb-2 tracking-wider">Total Shops</div>
          <div className="text-4xl font-black text-rose-400">{stats.total_shops}</div>
        </div>
        
        <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl">
          <div className="text-zinc-400 text-sm font-semibold uppercase mb-2 tracking-wider">Gross Revenue</div>
          <div className="text-4xl font-black text-emerald-400">
            ${(stats.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl">
          <div className="text-zinc-400 text-sm font-semibold uppercase mb-2 tracking-wider">Designs Gen'd</div>
          <div className="text-4xl font-black text-white">{stats.total_designs}</div>
        </div>

        <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl border-rose-500/20">
          <div className="text-zinc-400 text-sm font-semibold uppercase mb-2 tracking-wider">Est. GPU Cost</div>
          <div className="text-4xl font-black text-rose-500">
            ${(stats.gemini_cost_estimated || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
}
