const plans = [
  {
    tier: 'Shop',
    monthly: '$19',
    annual: '$209',
    saveBadge: 'Save $19',
  },
  {
    tier: 'Studio',
    monthly: '$29',
    annual: '$319',
    saveBadge: 'Save $29',
  },
]

const packs = [
  {
    name: 'Starter',
    files: '10 downloads',
    bonus: null,
    price: '$69',
    cents: '.00',
    per: '$6.90 per file',
    featured: false,
    badge: null,
  },
  {
    name: 'Shop Pack',
    files: '25 downloads',
    bonus: null,
    price: '$149',
    cents: '.00',
    per: '$5.96 per file',
    featured: false,
    badge: null,
  },
  {
    name: 'Pro Pack',
    files: '50 downloads + ',
    bonus: '10 FREE',
    price: '$229',
    cents: '.00',
    per: '$3.82 per file effective',
    featured: true,
    badge: 'Most Popular · First-Time Bonus',
  },
  {
    name: 'Bulk Pack',
    files: '100 downloads + ',
    bonus: '25 FREE',
    price: '$399',
    cents: '.00',
    per: '$3.19 per file effective',
    featured: false,
    badge: 'First-Time Bonus',
  },
  {
    name: 'Studio Pack',
    files: '250 downloads + ',
    bonus: '50 FREE',
    price: '$849',
    cents: '.00',
    per: '$2.83 per file effective',
    featured: false,
    badge: 'First-Time Bonus',
  },
]

export default function Pricing() {
  return (
    <section className="pricing-section" id="pricing">
      <div className="max-w">
        <div className="section-label">Pricing</div>
        <h2 className="section-title">Subscribe +<br />Pay What You Print.</h2>
        <p className="section-body">
          Pick <strong style={{color: 'var(--paper)'}}>Shop ($19/mo)</strong> or <strong style={{color: 'var(--paper)'}}>Studio ($29/mo)</strong> to
          keep your widget live and your dashboard running. Go annual and get <strong style={{color: 'var(--paper)'}}>1 month free</strong>.
          Then buy a credit pack — credits fire only when you and your customer
          approve a final design and you download the print-ready file. No seat fees. No surprises.
        </p>

        {/* Subscription Plans */}
        <div className="pricing-plans-row">
          {plans.map((plan) => (
            <div key={plan.tier} className="pricing-plan-card">
              <div className="plan-tier">{plan.tier}</div>
              <div className="plan-prices">
                <span className="plan-monthly">{plan.monthly}<span className="plan-period">/mo</span></span>
                <span className="plan-divider">or</span>
                <span className="plan-annual">{plan.annual}<span className="plan-period">/yr</span></span>
              </div>
              <div className="plan-save-badge">{plan.saveBadge} — 1 month free</div>
              <a href="#embed" className="pack-cta">Get Started</a>
            </div>
          ))}
        </div>

        {/* Credit Packs */}
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
          <span>Shop ($19/mo) or Studio ($29/mo) keeps your widget active and dashboard running. Annual saves 1 month.</span><br />
          First-time bonus applies to Pro, Bulk, and Studio packs on your first purchase only.<br />
          <span>Customers always generate free. Credits fire only on approved final downloads.</span><br />
          Invoice your customer whatever you want — $35, $50, $75. You keep 100%.
        </div>
      </div>
    </section>
  )
}
