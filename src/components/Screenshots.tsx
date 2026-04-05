const screens = [
  {
    icon: '🎨',
    label: 'Screenshot Coming Soon\nCustomer Widget View',
    title: 'The Customer Widget',
    desc: 'Live on your site. Matches your brand automatically. Customers generate concepts until they love one.',
  },
  {
    icon: '📥',
    label: 'Screenshot Coming Soon\nPrint Vault Dashboard',
    title: 'The Print Vault',
    desc: 'Approved concepts queue up here. Hit Upscale — get a 300 DPI file. Your credit fires. Done.',
  },
  {
    icon: '⬆️',
    label: 'Screenshot Coming Soon\nUpscale + Download Flow',
    title: 'One-Click Upscale',
    desc: '4K output → 300 DPI print-ready. TIFF or high-quality PDF. Ready to rip straight to your printer.',
  },
  {
    icon: '📊',
    label: 'Screenshot Coming Soon\nCredits + Pack Manager',
    title: 'Credit Pack Manager',
    desc: 'See your balance, buy packs, track usage. Buy bigger packs for a lower per-file cost.',
  },
]

export default function Screenshots() {
  return (
    <section className="screenshots-section" id="dashboard">
      <div className="max-w">
        <div className="section-label">The Dashboard</div>
        <h2 className="section-title">Your Print Vault.<br />Clean. Fast. Yours.</h2>
        <p className="section-body">
          Every approved concept lives in your dashboard. Upscale, download, and manage your jobs from one place.
        </p>
        <div className="screenshots-grid">
          {screens.map((s) => (
            <div key={s.title} className="screenshot-card">
              <div className="screenshot-placeholder" aria-label={s.title}>
                <div className="screenshot-icon" aria-hidden="true">{s.icon}</div>
                <div className="screenshot-placeholder-text">
                  {s.label.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < 1 && <br />}</span>
                  ))}
                </div>
              </div>
              <div className="screenshot-caption">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
