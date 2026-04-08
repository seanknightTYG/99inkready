'use client';
import { UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { getToken } = useAuth();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    async function loadBalance() {
      try {
        const token = await getToken();
        if (token) {
          const res = await fetchWithAuth('/api/v1/credits', token);
          setBalance(res?.balance || 0);
        }
      } catch (e) {
         console.error('Failed to load balance', e);
      }
    }
    loadBalance();
  }, [getToken]);

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
        <h1 className="text-2xl font-black tracking-tight mb-10 px-6 text-white">InkReady</h1>
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
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="flex-1 p-10 overflow-y-auto max-h-[calc(100vh-72px)] bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  );
}
