'use client';
import { UserButton, useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { getToken, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const isLoaded = authLoaded && userLoaded;
  const [balance, setBalance] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        const token = await getToken();
        if (token && user) {
          // Idempotent registration
          await fetchWithAuth('/api/v1/tenants/register', token, {
            method: 'POST',
            body: JSON.stringify({ 
              tenant_id: user.id,
              name: '',
              email: ''
            })
          });

          // Check credits/purchases
          const res = await fetchWithAuth('/api/v1/credits', token);
          setBalance(res?.balance || 0);

          if (res && res.has_purchased === false && !pathname.includes('/onboarding')) {
            window.location.href = '/dashboard/onboarding';
            return;
          }
        }
      } catch (e) {
         console.error('Failed to load dashboard data', e);
      } finally {
        setIsReady(true);
      }
    }
    if (isLoaded) loadData();
  }, [getToken, user, isLoaded, pathname]);

  if (!isReady) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white"><span className="loading loading-spinner loading-lg"></span></div>;

  const navs = [
    { label: 'Art Vault', path: '/dashboard' },
    { label: 'Leads', path: '/dashboard/leads' },
    { label: 'Credits', path: '/dashboard/credits' },
    { label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col pt-8 bg-black/20">
        <h1 className="text-2xl font-black tracking-tight mb-10 px-6 text-white">Rezify.io</h1>
        <nav className="flex-1 space-y-1 px-4">
          {navs.map(n => (
            <Link 
              key={n.path} 
              href={n.path}
              className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${
                pathname === n.path ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-[72px] border-b border-white/10 flex items-center justify-end px-8 gap-6 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
          <Link href="/dashboard/credits" className="bg-zinc-900 border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm hover:bg-zinc-800 transition-colors">
            <span className="text-zinc-400 text-sm font-semibold uppercase tracking-wider">Credits</span>
            <span className="font-bold font-mono text-emerald-400">{balance}</span>
          </Link>
          <div className="border-l border-white/10 h-6"></div>
          <UserButton />
        </header>
        <main className="flex-1 p-10 overflow-y-auto max-h-[calc(100vh-72px)] bg-zinc-950 flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <footer className="mt-20 border border-rose-500/30 bg-rose-500/5 p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
            <div className="text-rose-400 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest pl-2">
              ⚠️ Testing Links — Remove Before Launch
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm pl-2">
              <Link href="/test/widget" className="text-zinc-400 hover:text-white transition-colors hover:underline underline-offset-4">ABC Print Shop Studio</Link>
              <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors hover:underline underline-offset-4">Admin Dashboard</Link>
              <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors hover:underline underline-offset-4">Client Dashboard</Link>
              <Link href="/sign-in?redirect=/admin" className="text-zinc-400 hover:text-white transition-colors hover:underline underline-offset-4">Admin Login</Link>
              <span className="w-px bg-white/10 h-4 self-center mx-2"></span>
              <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors hover:underline underline-offset-4">Art Vault</Link>
              <Link href="/dashboard/leads" className="text-zinc-400 hover:text-white transition-colors hover:underline underline-offset-4">Leads</Link>
              <Link href="/dashboard/credits" className="text-zinc-400 hover:text-white transition-colors hover:underline underline-offset-4">Credits</Link>
              <Link href="/dashboard/settings" className="text-zinc-400 hover:text-white transition-colors hover:underline underline-offset-4">Settings</Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
