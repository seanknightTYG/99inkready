'use client';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';

// ── Credit Pack definitions (Pricing V2) ────────────────────
const PACKS = [
  { id: 'starter',     name: 'Starter Pack',  downloads: 10,  bonus: 0,  price: '$69',     perFile: '$6.90' },
  { id: 'shop_pack',   name: 'Shop Pack',     downloads: 25,  bonus: 0,  price: '$149',    perFile: '$5.96', popular: true },
  { id: 'pro_pack',    name: 'Pro Pack',       downloads: 50,  bonus: 10, price: '$229',    perFile: '$3.82' },
  { id: 'bulk_pack',   name: 'Bulk Pack',      downloads: 100, bonus: 25, price: '$399',    perFile: '$3.19' },
  { id: 'studio_pack', name: 'Studio Pack',    downloads: 250, bonus: 50, price: '$849',    perFile: '$2.83' },
];

// ── Subscription Plan definitions ───────────────────────────
const PLANS = [
  { id: 'shop_monthly',   tier: 'Shop',   cycle: 'Monthly', price: '$19',  period: '/mo',  badge: null },
  { id: 'shop_annual',    tier: 'Shop',   cycle: 'Annual',  price: '$209', period: '/yr',  badge: 'Save $19 — 1 month free' },
  { id: 'studio_monthly', tier: 'Studio', cycle: 'Monthly', price: '$29',  period: '/mo',  badge: null },
  { id: 'studio_annual',  tier: 'Studio', cycle: 'Annual',  price: '$319', period: '/yr',  badge: 'Save $29 — 1 month free' },
];

// Status pill colors
const STATUS_COLORS: Record<string, string> = {
  active:   'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  past_due: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  canceled: 'bg-red-500/20 text-red-400 border-red-500/30',
  trialing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  none:     'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
};

interface SubStatus {
  subscription_status: string;
  billing_cycle: string;
  plan_name: string | null;
  current_period_end: string | null;
  has_subscription: boolean;
  bonus_credited: boolean;
}

export default function CreditsPage() {
  const { getToken } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [subStatus, setSubStatus] = useState<SubStatus | null>(null);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        if (token) {
          const [credits, sub] = await Promise.all([
            fetchWithAuth('/api/v1/credits', token),
            fetchWithAuth('/api/v1/subscribe/status', token).catch(() => null),
          ]);
          setBalance(credits?.balance || 0);
          if (sub) setSubStatus(sub);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  // ── Handlers ────────────────────────────────────────────
  const handleSubscribe = async (planId: string) => {
    setSubscribing(planId);
    try {
      const token = await getToken();
      const { checkoutUrl } = await fetchWithAuth('/api/v1/subscribe', token, {
        method: 'POST',
        body: JSON.stringify({ planId }),
      });
      if (checkoutUrl) window.location.href = checkoutUrl;
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSubscribing(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const token = await getToken();
      const { portalUrl } = await fetchWithAuth('/api/v1/subscribe/portal', token, {
        method: 'POST',
      });
      if (portalUrl) window.location.href = portalUrl;
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handleBuyPack = async (packId: string) => {
    const token = await getToken();
    try {
      const { checkout_url } = await fetchWithAuth('/api/v1/credits/purchase', token, {
        method: 'POST',
        body: JSON.stringify({ pack_tier: packId }),
      });
      if (checkout_url) window.location.href = checkout_url;
    } catch (e) {
      alert((e as Error).message);
    }
  };

  if (loading) return <div className="text-zinc-500 animate-pulse text-lg">Loading billing…</div>;

  const isActive = subStatus?.subscription_status === 'active';
  const hasSubscription = subStatus?.has_subscription && subStatus?.subscription_status !== 'none';
  const statusKey = subStatus?.subscription_status || 'none';

  // ── Format plan display name ────────────────────────────
  const formatPlanName = (planId: string | null) => {
    if (!planId) return 'Unknown';
    const map: Record<string, string> = {
      shop_monthly: 'Shop',
      shop_annual: 'Shop',
      studio_monthly: 'Studio',
      studio_annual: 'Studio',
    };
    return map[planId] || planId;
  };

  return (
    <div className="max-w-6xl space-y-10">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4A — SUBSCRIPTION MANAGER
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {hasSubscription ? (
        <section className="bg-zinc-900 border border-white/5 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent p-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1 tracking-tight">Subscription</h2>
                <p className="text-zinc-400 text-sm">Manage your Rezify plan and billing cycle.</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${STATUS_COLORS[statusKey] || STATUS_COLORS.none}`}>
                {statusKey === 'past_due' ? 'Past Due' : statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="bg-black/30 rounded-xl p-5 border border-white/5">
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.15em] mb-1">Plan</p>
                <p className="text-xl font-bold text-white">{formatPlanName(subStatus?.plan_name || null)}</p>
              </div>
              <div className="bg-black/30 rounded-xl p-5 border border-white/5">
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.15em] mb-1">Billing Cycle</p>
                <p className="text-xl font-bold text-white capitalize">{subStatus?.billing_cycle || '—'}</p>
              </div>
              <div className="bg-black/30 rounded-xl p-5 border border-white/5">
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.15em] mb-1">Next Billing Date</p>
                <p className="text-xl font-bold text-white">
                  {subStatus?.current_period_end
                    ? new Date(subStatus.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—'}
                </p>
              </div>
            </div>

            <button
              onClick={handleManageBilling}
              className="mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all backdrop-blur-md border border-white/10 uppercase tracking-wider"
            >
              Manage Billing →
            </button>
          </div>
        </section>
      ) : (
        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           4B — PLAN SELECTION CARDS (no active subscription)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Choose Your Plan</h2>
            <p className="text-zinc-400 mt-1">Subscribe to keep your widget live and your dashboard running.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PLANS.map(plan => {
              const isAnnual = plan.cycle === 'Annual';
              return (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-2xl border transition-all hover:-translate-y-0.5 ${
                    isAnnual
                      ? 'bg-gradient-to-br from-blue-900/30 to-zinc-900 border-blue-500/40 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]'
                      : 'bg-zinc-900 border-white/5 shadow-xl'
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 left-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      {plan.badge}
                    </span>
                  )}

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.15em]">{plan.tier} · {plan.cycle}</p>
                      <div className="mt-2">
                        <span className="text-4xl font-black text-white">{plan.price}</span>
                        <span className="text-zinc-400 text-lg font-medium">{plan.period}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={subscribing === plan.id}
                      className={`px-6 py-3 rounded-xl font-bold text-sm transition-all uppercase tracking-wider shadow-lg disabled:opacity-50 ${
                        isAnnual
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-white hover:bg-zinc-200 text-black'
                      }`}
                    >
                      {subscribing === plan.id ? 'Loading…' : 'Subscribe'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BALANCE HEADER + 4C — CREDIT PACKS (updated prices)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex justify-between items-end bg-zinc-900 border border-white/5 p-8 rounded-2xl shadow-xl bg-gradient-to-br from-zinc-900 to-zinc-950">
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
              <p className="text-4xl font-black text-white mb-1">{p.price}</p>
              <p className="text-zinc-500 text-sm font-medium mb-8">{p.perFile} per file</p>
              
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
            
            <button onClick={() => handleBuyPack(p.id)} className={`w-full py-4 rounded-xl font-bold text-sm transition-colors shadow-lg uppercase tracking-widest ${p.popular ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-white hover:bg-zinc-200 text-black'}`}>
              Select Pack
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
