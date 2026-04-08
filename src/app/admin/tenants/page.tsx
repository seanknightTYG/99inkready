'use client';
import { useAuth } from '@clerk/nextjs';
import { fetchWithAuth } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminTenants() {
  const { getToken } = useAuth();
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
         const token = await getToken();
         if (token) {
           const res = await fetchWithAuth('/api/v1/admin/tenants', token);
           setTenants(res.tenants || []);
         }
      } catch (e) {
         console.error('Failed to load tenants', e);
      } finally {
         setLoading(false);
      }
    }
    load();
  }, [getToken]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-black mb-8">Registered Shops</h1>

      <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950 border-b border-white/5 uppercase font-black text-zinc-500 text-xs">
            <tr>
              <th className="px-6 py-4">Shop</th>
              <th className="px-6 py-4">Credit Balance</th>
              <th className="px-6 py-4">Unlocks</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-500">Loading...</td></tr>
            ) : tenants.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No shops registered yet.</td></tr>
            ) : (
              tenants.map(t => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{t.name || 'Unnamed Shop'}</div>
                    <div className="text-zinc-500 text-xs">{t.email || t.id}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-emerald-400 font-bold">
                    {parseInt(t.balance, 10).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-mono text-zinc-300">
                    {t.unlocks}
                  </td>
                  <td className="px-6 py-4">
                    {parseInt(t.balance, 10) > 0 ? (
                      <span className="inline-block px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold uppercase tracking-wider">Active</span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-rose-500/20 text-rose-400 rounded text-xs font-bold uppercase tracking-wider">Empty</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={\`/admin/tenants/\${t.id}\`} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded transition-colors text-xs uppercase cursor-pointer inline-block">
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
