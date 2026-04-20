'use client';
import { useAuth } from '@clerk/nextjs';
import { fetchWithAuth } from '@/lib/api';
import { useState } from 'react';

export default function OnboardingPage() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const { checkout_url } = await fetchWithAuth('/api/v1/credits/purchase', token, {
        method: 'POST',
        body: JSON.stringify({ pack_tier: 'starter' })
      });
      if (checkout_url) window.location.href = checkout_url;
    } catch (e) {
      alert((e as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-24 text-center">
      <div className="bg-zinc-900 border border-white/10 p-12 rounded-2xl shadow-2xl">
        <div className="w-20 h-20 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tight">Secure Your Realm</h1>
        <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
          Your shop is registered. To activate your API keys and unlock your raw Rezify Studio embed script, you must secure a Starter Pack. This ensures only highly-motivated print shops access our AI GPUs.
        </p>
        
        <div className="bg-zinc-950 border border-white/5 p-6 rounded-xl mb-10 text-left">
          <h3 className="font-bold text-white mb-2 text-xl">Starter Pack</h3>
          <p className="text-zinc-500 text-sm mb-4">You get 10 high-resolution print unlock credits with zero expiration.</p>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-black text-white">$49.90</span>
            <span className="bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded text-sm uppercase tracking-wider">No Subscription</span>
          </div>
        </div>

        <button 
          onClick={handleActivate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white font-bold py-4 rounded-xl text-lg shadow-xl shadow-blue-900/20 transition-all transform active:scale-95"
        >
          {loading ? 'Securing Gateway...' : 'Activate Rezify Studio & Buy Starter Pack'}
        </button>
      </div>
    </div>
  );
}
