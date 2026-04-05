const industries = [
  {
    icon: '🎯',
    name: 'Sign & Print Shops',
    desc: 'Banners, yard signs, window graphics, vehicle magnets. Stop fixing low-res files and start delivering print-ready art in one click.',
  },
  {
    icon: '👕',
    name: 'Apparel Shops',
    desc: 'T-shirts, screen print, DTF, DTG — it doesn\'t matter how you apply it. InkReady gets you print-ready art at the right dimensions every time. Your press stays busy. Your inbox doesn\'t.',
  },
  {
    icon: '🚗',
    name: 'Wrap Shops',
    desc: 'Vehicle wraps need massive files and precise dimensions. Customers concept their wrap on your site. You upscale to spec and send them to the plotter.',
  },
]

export default function IndustriesSection() {
  return (
    <section className="industries-section" id="industries">
      <div className="max-w">
        <div className="section-label">Who It&apos;s For</div>
        <h2 className="section-title">Built for Every<br />Shop That Prints.</h2>
        <p className="section-body">
          If your customers hand you art files, InkReady is for you.
          Any shop type. Any product. Any platform.
        </p>
        <div className="industries-grid">
          {industries.map((ind) => (
            <div key={ind.name} className="industry-card">
              <div className="industry-icon" aria-hidden="true">{ind.icon}</div>
              <h3 className="industry-name">{ind.name}</h3>
              <p className="industry-desc">{ind.desc}</p>
            </div>
          ))}
        </div>
        <div className="industries-cta">
          <span className="industries-cta-text">Don&apos;t see your shop type?</span>
          <a href="#chat" className="btn-ghost" style={{ fontSize: '12px', padding: '10px 20px' }}>
            Ask Us →
          </a>
        </div>
      </div>
    </section>
  )
}
