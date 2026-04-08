'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';

export default function Dashboard() {
  const { getToken } = useAuth();
  const [designs, setDesigns] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [activeJob, setActiveJob] = useState<{ id: string, status: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const token = await getToken();
        if (!token) return;

        const [designsRes, leadsRes, creditsRes] = await Promise.all([
          fetchWithAuth('/api/v1/vault', token),
          fetchWithAuth('/api/v1/leads', token),
          fetchWithAuth('/api/v1/credits', token)
        ]);

        setDesigns(designsRes.designs || []);
        setLeads(leadsRes.leads || []);
        setCredits(creditsRes.balance || 0);
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [getToken]);

  const handleUnlock = async (designId: string) => {
    const token = await getToken();
    try {
      const { job_id } = await fetchWithAuth('/api/v1/vault/unlock', token, {
        method: 'POST',
        body: JSON.stringify({ design_id: designId })
      });
      
      setActiveJob({ id: designId, status: 'queued' });
      
      // Start SSE progress stream
      const source = new EventSource(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.inkready.99agents.agency'}/api/v1/vault/unlock/${job_id}/stream`);
      
      source.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setActiveJob({ id: designId, status: data.status });
        
        if (data.status === 'ready' || data.status === 'failed') {
          source.close();
          setActiveJob(null);
          // Quick reload to show updated designs & credits
          window.location.reload(); 
        }
      };
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handleBuyCredits = async () => {
    const token = await getToken();
    try {
      const { checkout_url } = await fetchWithAuth('/api/v1/credits/purchase', token, {
        method: 'POST',
        body: JSON.stringify({ pack_tier: 'shop' }) // default to 'shop' pack for quick test
      });
      if (checkout_url) window.location.href = checkout_url;
    } catch (e) {
      alert((e as Error).message);
    }
  };

  if (loading) return <div className="p-12 text-center text-white/50">Loading Secure Print Vault...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 space-y-12 max-w-7xl mx-auto">
      <header className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Print Vault</h1>
          <p className="text-zinc-400 mt-1">Manage designs, upscale requests, and lead captures.</p>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-end">
            <span className="text-sm text-zinc-400 uppercase tracking-widest font-semibold">Available</span>
            <span className="text-2xl font-bold font-mono text-zinc-100">{credits} Credits</span>
          </div>
          <button 
            onClick={handleBuyCredits} 
            className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-zinc-200 transition-colors shadow-lg"
          >
            Refill Credits
          </button>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          Customer Designs <span className="text-sm bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{designs.length}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map(d => (
            <div key={d.id} className="border border-white/10 rounded-xl overflow-hidden bg-zinc-900 shadow-xl flex flex-col">
              <div className="relative h-64 bg-zinc-950 flex items-center justify-center p-4">
                <img src={d.draft_url || d.hires_url || 'https://placehold.co/600x400/18181b/52525b?text=Preview+Loading'} alt="Design" className="max-h-full max-w-full object-contain rounded" />
                {activeJob?.id === d.id && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
                    <span className="loading loading-spinner text-white mb-4"></span>
                    <p className="font-mono text-sm uppercase tracking-widest animate-pulse">Running: {activeJob.status}</p>
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between border-t border-white/5">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg leading-tight truncate pr-4">{d.prompt || 'Untitled Print'}</h3>
                    <span className="text-xs bg-zinc-800 px-2 py-1 rounded-full text-zinc-400 uppercase font-semibold">{d.product_type || 'Unknown'}</span>
                  </div>
                  <p className="text-zinc-500 text-sm mb-4">Status: <span className="capitalize">{d.status}</span></p>
                </div>
                
                {d.status === 'draft' && (
                  <button 
                    onClick={() => handleUnlock(d.id)} 
                    disabled={activeJob?.id === d.id}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold text-sm transition-colors shadow disabled:opacity-50"
                  >
                    Unlock 4K Final (1 Credit)
                  </button>
                )}
                {d.status === 'upscaled' && (
                  <a 
                    href={d.hires_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex text-center justify-center w-full bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-lg font-bold text-sm transition-colors shadow"
                  >
                    Download Print File
                  </a>
                )}
                {d.status === 'processing' && (
                  <button disabled className="w-full bg-zinc-800 text-zinc-500 py-3 rounded-lg font-bold text-sm cursor-not-allowed">
                    Upscaling...
                  </button>
                )}
              </div>
            </div>
          ))}
          {designs.length === 0 && (
            <div className="col-span-full text-zinc-500 py-24 text-center border border-dashed border-white/10 rounded-xl bg-zinc-900/50">
              <p>No customer prints generated yet.</p>
              <p className="text-sm mt-2">When a customer finishes an AI design, it appears here.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          Captured CRM Leads <span className="text-sm bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{leads.length}</span>
        </h2>
        <div className="border border-white/10 rounded-xl bg-zinc-900 overflow-hidden shadow-xl">
          {leads.map(l => (
            <div key={l.id} className="p-5 border-b border-white/5 last:border-0 hover:bg-zinc-800/50 transition-colors flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">{l.name}</p>
                <div className="flex items-center gap-3 text-zinc-400 text-sm mt-1">
                  <span>{l.email}</span>
                  {l.phone && <><span>•</span><span>{l.phone}</span></>}
                </div>
              </div>
              <div className="text-xs text-zinc-500 bg-zinc-950 px-3 py-1 rounded font-mono">
                {new Date(l.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
          {leads.length === 0 && (
            <div className="p-12 text-zinc-500 text-center">
              No highly-activated leads captured yet. Lead gate fires at 10 drafts.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
