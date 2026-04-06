const packs = [
  {
    name: 'Starter',
    files: '10 downloads',
    bonus: null,
    price: '$49',
    cents: '.90',
    per: '$4.99 per file',
    featured: false,
    badge: null,
  },
  {
    name: 'Shop Pack',
    files: '25 downloads',
    bonus: null,
    price: '$99',
    cents: '.75',
    per: '$3.99 per file',
    featured: false,
    badge: null,
  },
  {
    name: 'Pro Pack',
    files: '50 downloads + ',
    bonus: '10 FREE',
    price: '$174',
    cents: '.50',
    per: '$2.91 per file effective',
    featured: true,
    badge: 'Most Popular · First-Time Bonus',
  },
  {
    name: 'Bulk Pack',
    files: '100 downloads + ',
    bonus: '25 FREE',
    price: '$299',
    cents: '.00',
    per: '$2.39 per file effective',
    featured: false,
    badge: 'First-Time Bonus',
  },
  {
    name: 'Studio Pack',
    files: '250 downloads + ',
    bonus: '50 FREE',
    price: '$622',
    cents: '.50',
    per: '$2.07 per file effective',
    featured: false,
    badge: 'First-Time Bonus',
  },
]

export default function Pricing() {
  return (
    <section className="pricing-section" id="pricing">
      <div className="max-w">
        <div className="section-label">Pricing</div>
        <h2 className="section-title">$9.99/mo +<br />Pay What You Print.</h2>
        <p className="section-body">
          <strong style={{color: 'var(--paper)'}}>$9.99/month</strong> keeps your widget live and your dashboard running.
          Then buy a credit pack — credits fire only when you and your customer
          approve a final design and you download the print-ready file. No seat fees. No surprises.
        </p>
        <div className="pricing-grid">
          {packs.map((pack) => (
            <div key={pack.name} className={`pricing-card${pack.featured ? ' featured' : ''}`}>
              {pack.badge && (
                <div className="featured-badge">{pack.badge}</div>
              )}
              <div className="pack-name">{pack.name}</div>
              <div className="pack-files">
                {pack.files}
                {pack.bonus && <span className="bonus">{pack.bonus}</span>}
              </div>
              <div className="pack-price">
                {pack.price}<span className="cents">{pack.cents}</span>
              </div>
              <div className="pack-per">{pack.per}</div>
              <a href="#embed" className="pack-cta">Get Started</a>
            </div>
          ))}
        </div>
        <div className="pricing-note">
          <span>$9.99/month platform fee keeps your widget active and dashboard running.</span><br />
          First-time bonus applies to Pro, Bulk, and Studio packs on your first purchase only.<br />
          <span>Customers always generate free. Credits fire only on approved final downloads.</span><br />
          Invoice your customer whatever you want — $35, $50, $75. You keep 100%.
        </div>
      </div>
    </section>
  )
}
