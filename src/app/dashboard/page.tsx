'use client';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';

export default function VaultPage() {
  const { getToken } = useAuth();
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeJob, setActiveJob] = useState<{ id: string, status: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        if (token) {
          const res = await fetchWithAuth('/api/v1/vault', token);
          setDesigns(res?.designs || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  const handleUnlock = async (designId: string) => {
    const token = await getToken();
    try {
      const { job_id } = await fetchWithAuth('/api/v1/vault/unlock', token, {
        method: 'POST',
        body: JSON.stringify({ design_id: designId })
      });
      setActiveJob({ id: designId, status: 'queued' });
      
      const source = new EventSource(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.REZIFY.99agents.agency'}/api/v1/vault/unlock/${job_id}/stream`);
      source.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setActiveJob({ id: designId, status: data.status });
        if (data.status === 'ready' || data.status === 'failed') {
          source.close();
          setActiveJob(null);
          // Wait briefly before reloading so backend state has fully committed
          setTimeout(() => window.location.reload(), 1000); 
        }
      };
      source.onerror = (e) => {
        console.error("SSE Error:", e);
        source.close();
        setActiveJob(null);
      };
    } catch (e) {
      alert((e as Error).message);
    }
  };

  if (loading) return <div className="text-zinc-500 animate-pulse text-lg">Loading Art Vault...</div>;

  return (
    <div className="max-w-7xl">
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Art Vault</h2>
        <span className="text-zinc-500">{designs.length} Generation{designs.length !== 1 ? 's' : ''}</span>
      </div>

      {designs.length === 0 ? (
        <div className="text-zinc-500 mt-12 py-32 text-center border border-dashed border-white/10 rounded-xl bg-zinc-900/40 shadow-inner">
          <p className="text-lg">No designs yet</p>
          <p className="text-sm mt-2 opacity-60">When customers generate concepts, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {designs.map(d => (
             <div key={d.id} className="border border-white/10 rounded-xl overflow-hidden bg-zinc-900 shadow-2xl flex flex-col group">
              <div className="relative h-72 bg-[#121214] flex items-center justify-center p-6 border-b border-white/5">
                <img src={d.draft_url || d.hires_url || 'https://placehold.co/600x400/121214/52525b?text=Image+Loading'} alt="Design" className="max-h-full max-w-full object-contain rounded drop-shadow-xl" />
                
                {activeJob?.id === d.id && (
                  <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center backdrop-blur-md">
                    <span className="loading loading-spinner loading-lg text-emerald-500 mb-6"></span>
                    <p className="font-mono text-sm uppercase tracking-[0.2em] text-emerald-400 animate-pulse">{activeJob?.status}</p>
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white mb-2 leading-tight">{d.prompt || 'Untitled Print'}</h3>
                  <div className="flex gap-2 text-xs font-semibold uppercase tracking-wider mb-6">
                    <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded">{d.product_type}</span>
                    <span className={`px-2 py-1 rounded ${d.status === 'upscaled' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>{d.status}</span>
                  </div>
                </div>
                
                {d.status === 'draft' && (
                  <button onClick={() => handleUnlock(d.id)} disabled={activeJob?.id === d.id} className="w-full bg-white hover:bg-zinc-200 text-black py-3.5 rounded-lg font-bold text-sm shadow transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Unlock 4K Final <span className="opacity-60 font-normal ml-1">(1 Credit)</span>
                  </button>
                )}
                {d.status === 'upscaled' && (
                  <a href={d.hires_url} target="_blank" rel="noopener noreferrer" className="flex text-center justify-center w-full bg-emerald-500 hover:bg-emerald-400 text-black py-3.5 rounded-lg font-bold text-sm shadow transition-colors gap-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Download Print File
                  </a>
                )}
                {d.status === 'processing' && (
                  <button disabled className="w-full bg-zinc-800 text-zinc-500 py-3.5 rounded-lg font-bold text-sm cursor-not-allowed border border-white/5">
                    Job running in background...
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
