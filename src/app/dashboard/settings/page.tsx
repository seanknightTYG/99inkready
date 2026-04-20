'use client';
import { useAuth } from '@clerk/nextjs';

export default function SettingsPage() {
  const { userId } = useAuth();
  
  const embedCode = `<script src="https://api.rezify.io/widget.js" data-tenant-id="${userId || 'YOUR_SHOP_ID'}"></script>`;

  return (
    <div className="max-w-3xl space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Rezify Studio Settings</h2>
        <p className="text-zinc-400">Configure your website integration and look/feel.</p>
      </div>

      <section className="bg-zinc-900 border border-white/5 p-8 rounded-2xl shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-1 border-b-2 border-emerald-500 inline-block pb-1">Embed Installation</h3>
            <p className="text-zinc-400 text-sm mt-3">Copy and paste this script right before the closing <code className="text-blue-400 font-mono bg-blue-400/10 px-1 rounded">&lt;/body&gt;</code> tag of your website.</p>
          </div>
        </div>
        
        <div className="relative group">
          <pre className="bg-[#09090b] p-5 rounded-xl overflow-x-auto text-sm text-emerald-400 border border-white/5 font-mono leading-relaxed shadow-inner">
            {embedCode}
          </pre>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(embedCode);
              alert("Copied to clipboard!");
            }}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md"
          >
            Copy Snippet
          </button>
        </div>
      </section>

      <section className="bg-zinc-900 border border-white/5 p-8 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold mb-1 border-b-2 border-blue-500 inline-block pb-1">Brand Customization</h3>
        <p className="text-zinc-400 text-sm mt-3 mb-8">Customize the look and feel of the Rezify Studio to match your website natively.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wider text-white mb-3">Primary Action Color</label>
            <div className="flex items-center gap-4 bg-black/50 p-4 rounded-xl border border-white/5 w-fit">
              <input type="color" defaultValue="#3b82f6" className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
              <span className="text-zinc-400 font-mono text-lg">#3b82f6</span>
            </div>
            <p className="text-sm text-zinc-500 mt-3">Used for the main generation button bounds.</p>
          </div>
          <button className="bg-white hover:bg-zinc-200 text-black px-8 py-3 rounded-xl font-bold text-sm shadow-xl transition-colors">
            Save Preferences
          </button>
        </div>
      </section>
    </div>
  );
}
