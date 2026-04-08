'use client';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';

export default function LeadsPage() {
  const { getToken } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        if (token) {
          const res = await fetchWithAuth('/api/v1/leads', token);
          setLeads(res?.leads || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  if (loading) return <div className="text-zinc-500 animate-pulse text-lg">Loading leads...</div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Lead Tracker</h2>
        <p className="text-zinc-400 mt-2">Customers who reached the 10-draft limit.</p>
      </div>
      
      {leads.length === 0 ? (
        <div className="text-zinc-500 py-32 text-center border border-dashed border-white/10 rounded-xl bg-zinc-900/40 shadow-inner">
          <p className="text-lg">No leads yet</p>
          <p className="text-sm mt-2 opacity-60">High-intent customers will appear here automatically.</p>
        </div>
      ) : (
        <div className="border border-white/10 rounded-xl bg-zinc-900 overflow-hidden shadow-2xl">
          {leads.map(l => (
            <div key={l.id} className="p-6 border-b border-white/5 last:border-0 hover:bg-zinc-800/50 transition-colors flex items-center justify-between group">
              <div>
                <p className="font-bold text-xl text-white mb-1">{l.name}</p>
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> {l.email}</span>
                  {l.phone && <><span className="text-white/20">•</span><span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> {l.phone}</span></>}
                </div>
              </div>
              <div className="text-xs text-zinc-500 bg-zinc-950/80 px-3 py-1.5 rounded font-mono border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                {new Date(l.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
