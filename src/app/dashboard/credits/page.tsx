'use client';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';

const PACKS = [
  { id: 'starter', name: 'Starter Pack', downloads: 10, bonus: 0, price: '$49.90' },
  { id: 'shop', name: 'Shop Pack', downloads: 25, bonus: 0, price: '$99.75', popular: true },
  { id: 'pro', name: 'Pro Pack', downloads: 50, bonus: 10, price: '$174.50' },
  { id: 'bulk', name: 'Bulk Pack', downloads: 100, bonus: 25, price: '$299.00' },
  { id: 'studio', name: 'Studio Pack', downloads: 250, bonus: 50, price: '$622.50' },
];

export default function CreditsPage() {
  const { getToken } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        if (token) {
          const res = await fetchWithAuth('/api/v1/credits', token);
          setBalance(res?.balance || 0);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  const handleBuy = async (packId: string) => {
    const token = await getToken();
    try {
      const { checkout_url } = await fetchWithAuth('/api/v1/credits/purchase', token, {
        method: 'POST',
        body: JSON.stringify({ pack_tier: packId })
      });
      if (checkout_url) window.location.href = checkout_url;
    } catch (e) {
      alert((e as Error).message);
    }
  };

  if (loading) return <div className="text-zinc-500 animate-pulse text-lg">Loading credit options...</div>;

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-end mb-12 bg-zinc-900 border border-white/5 p-8 rounded-2xl shadow-xl bg-gradient-to-br from-zinc-900 to-zinc-950">
        <div>
          <h2 className="text-3xl font-bold mb-2">Credit Packs</h2>
          <p className="text-zinc-400">Unlock print-ready 4K files directly to your machine.</p>
        </div>
        <div className="text-right">
          <p className="text-zinc-500 text-sm font-semibold uppercase tracking-[0.2em] mb-1">Current Balance</p>
          <p className="text-5xl font-mono font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">{balance}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PACKS.map(p => (
          <div key={p.id} className={`relative p-8 rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xl transition-transform hover:-translate-y-1 ${p.popular ? 'bg-gradient-to-b from-blue-900/40 to-[#121214] border border-blue-500/50' : 'bg-zinc-900 border border-white/5'}`}>
            {p.popular && <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg uppercase tracking-wider shadow-lg">Most Popular</span>}
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{p.name}</h3>
              <p className="text-4xl font-black text-white mb-8">{p.price}</p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex gap-3 text-zinc-300 font-medium items-center">
                  <span className="text-emerald-500 flex-shrink-0 bg-emerald-500/10 p-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> 
                  {p.downloads} Unlock Credits
                </li>
                {p.bonus > 0 && (
                  <li className="flex gap-3 text-emerald-400 font-bold items-center">
                    <span className="flex-shrink-0 bg-emerald-400/20 p-1 rounded-full text-emerald-400"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg></span> 
                    +{p.bonus} First-time Bonus
                  </li>
                )}
              </ul>
            </div>
            
            <button onClick={() => handleBuy(p.id)} className={`w-full py-4 rounded-xl font-bold text-sm transition-colors shadow-lg uppercase tracking-widest ${p.popular ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-white hover:bg-zinc-200 text-black'}`}>
              Select Pack
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
