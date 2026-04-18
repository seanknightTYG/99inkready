'use client';

import { useAuth, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, sessionClaims } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoaded) {
      if (sessionClaims?.metadata?.role === 'admin') {
        setIsAdmin(true);
      } else {
        router.push('/dashboard');
      }
    }
  }, [isLoaded, sessionClaims, router]);

  if (!isLoaded || isAdmin === null) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white"><span className="loading loading-spinner text-emerald-500 loading-lg"></span></div>;
  }

  const navs = [
    { label: 'Overview', path: '/admin' },
    { label: 'Shops & Tenants', path: '/admin/tenants' }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <aside className="w-64 border-r border-white/10 bg-zinc-950 p-6 flex flex-col">
        <div className="font-black text-2xl tracking-tighter mb-1 mt-2 text-rose-500">
          REZIFY<span className="text-zinc-600 font-light">ADMIN</span>
        </div>
        <div className="text-xs text-rose-500/50 uppercase tracking-widest font-bold mb-10">Superuser</div>

        <nav className="flex-1 space-y-2">
          {navs.map(n => {
            const active = pathname === n.path || (n.path !== '/admin' && pathname.startsWith(n.path));
            return (
              <Link 
                key={n.path} 
                href={n.path}
                className={\`block px-4 py-3 rounded-lg text-sm font-semibold transition-all \${
                  active 
                    ? 'bg-rose-500/10 text-rose-400' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }\`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-white/10 bg-zinc-950/50 backdrop-blur flex items-center justify-end px-8 gap-6">
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-white transition-colors">Exit to Standard App</Link>
          <div className="border-l border-white/10 h-6"></div>
          <UserButton />
        </header>
        <main className="flex-1 p-10 overflow-y-auto max-h-[calc(100vh-64px)] bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  );
}
