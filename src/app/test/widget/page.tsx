'use client';
import { useEffect } from 'react';

export default function WidgetTestPage() {
  const testTenantId = process.env.NEXT_PUBLIC_TEST_TENANT_ID || 'replace_with_real_id';
  
  useEffect(() => {
    // Inject the widget script to completely simulate client site installation
    const script = document.createElement('script');
    script.src = "/widget.js";
    script.setAttribute('data-tenant-id', testTenantId);
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Cleanup to prevent duplicate roots during fast reloads
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      const widgetRoot = document.getElementById('REZIFY-widget-root');
      if (widgetRoot && document.body.contains(widgetRoot)) {
        document.body.removeChild(widgetRoot);
      }
    };
  }, [testTenantId]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center pt-32 px-6">
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-center">ABC Print Shop — Widget Test</h1>
      <p className="text-zinc-400 mb-8 max-w-xl text-center">
        The widget snippet has been embedded below using Tenant ID: 
        <br/><strong className="text-emerald-400 font-mono mt-2 inline-block">{testTenantId}</strong>
      </p>
      
      <div className="border border-white/10 bg-[#121214] shadow-2xl rounded-xl p-8 max-w-2xl w-full flex flex-col gap-4">
        <div className="h-8 bg-zinc-800 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-zinc-800 rounded w-full"></div>
        <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
        <div className="h-4 bg-zinc-800 rounded w-4/6"></div>
        
        <p className="text-zinc-500 mt-8 italic text-sm text-center">
          Mock client website page. Widget should appear in the bottom right corner.
        </p>
      </div>
    </div>
  );
}
