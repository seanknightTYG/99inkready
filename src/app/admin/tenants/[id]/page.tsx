'use client';
import { useAuth } from '@clerk/nextjs';
import { fetchWithAuth } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TenantDetail() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Adjustment state
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  async function load() {
    try {
       const token = await getToken();
       if (token) {
         const res = await fetchWithAuth(\`/api/v1/admin/tenants/\${id}\`, token);
         setData(res);
       }
    } catch (e) {
       console.error('Failed to load shop', e);
    } finally {
       setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id, getToken]);

  const handleAdjust = async () => {
    const amt = parseInt(adjustAmount, 10);
    if (!amt || isNaN(amt)) return alert('Invalid amount');
    setAdjusting(true);
    try {
      const token = await getToken();
      await fetchWithAuth(\`/api/v1/admin/tenants/\${id}/credits\`, token, {
        method: 'POST',
        body: JSON.stringify({ amount: amt })
      });
      setAdjustAmount('');
      load(); // reload
    } catch (e) {
      alert('Failed to adjust credits');
    } finally {
      setAdjusting(false);
    }
  };

  if (loading) return <div className="animate-pulse text-zinc-500">Loading shop profile...</div>;
  if (!data?.tenant) return <div>Shop not found.</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/admin/tenants" className="text-zinc-500 hover:text-white mb-6 inline-block font-bold mt-2">← Back to Shops</Link>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">{data.tenant.name || 'Unnamed Shop'}</h1>
          <p className="text-zinc-400 font-mono text-sm mt-1">{data.tenant.id}</p>
        </div>
        <div className="bg-zinc-900 border border-white/10 px-6 py-4 rounded-xl flex items-center gap-6">
          <div>
            <div className="text-xs uppercase font-bold text-zinc-500 mb-1 tracking-wider">Current Balance</div>
            <div className="text-3xl font-black text-emerald-400 font-mono">{data.balance}</div>
          </div>
          <div className="w-px h-12 bg-white/10 mx-2"></div>
          <div>
            <div className="text-xs uppercase font-bold text-zinc-500 mb-1 tracking-wider">Adjust Credits</div>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={adjustAmount} 
                onChange={e => setAdjustAmount(e.target.value)}
                placeholder="+50 or -10" 
                className="bg-zinc-950 border border-white/10 rounded px-3 py-1 w-32 outline-none focus:border-rose-500 h-10 font-mono"
              />
              <button 
                onClick={handleAdjust} 
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 rounded transition-colors text-sm uppercase tracking-widest disabled:opacity-50"
                disabled={adjusting || !adjustAmount}
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl">
          <h2 className="font-black text-xl mb-4 text-white">Full Design Log</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {data.designs?.length === 0 ? <p className="text-zinc-500 text-sm">No designs generated.</p> : null}
            {data.designs?.map((d: any) => (
              <div key={d.id} className="bg-zinc-950 p-4 rounded-lg border border-white/5 flex gap-4">
                {d.draft_url ? <img src={d.draft_url} className="w-16 h-16 object-cover rounded bg-zinc-800" /> : <div className="w-16 h-16 bg-zinc-800 rounded"></div>}
                <div className="flex-1">
                   <div className="font-bold text-sm truncate max-w-[200px]">{d.prompt}</div>
                   <div className="text-xs text-zinc-500 mt-1 uppercase font-semibold">{d.product_type}</div>
                   <div className="text-xs mt-2 font-mono" style={{ color: d.status === 'upscaled' ? '#34d399' : '#a1a1aa' }}>
                     Status: {d.status}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl">
          <h2 className="font-black text-xl mb-4 text-white">Captured Leads</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {data.leads?.length === 0 ? <p className="text-zinc-500 text-sm">No leads captured.</p> : null}
            {data.leads?.map((l: any) => (
              <div key={l.id} className="bg-zinc-950 p-4 rounded-lg border border-white/5">
                 <div className="font-bold">{l.name}</div>
                 <div className="text-zinc-400 text-sm mb-1">{l.email}</div>
                 {l.phone && <div className="text-zinc-500 text-xs">{l.phone}</div>}
                 <div className="text-xs text-zinc-600 mt-2">{new Date(l.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
