const options = [
  {
    tag: 'Option 1 · DIY',
    icon: '⚡',
    title: 'Copy. Paste. Done.',
    body: "If you or your developer can edit your website's HTML, paste the snippet before the closing body tag. Takes 60 seconds. We'll send you your Shop ID when you sign up.",
  },
  {
    tag: 'Option 2 · White Glove · $99 One-Time',
    icon: '🤝',
    title: 'We Install It For You',
    body: '99 Agents Agency builds websites. We can drop InkReady into any existing site — WordPress, Shopify, Squarespace, custom HTML — in under an hour. One-time $99 install fee. Chat with us below.',
  },
  {
    tag: 'Option 3 · WordPress',
    icon: '🔌',
    title: 'Plugin Coming Soon',
    body: "A one-click WordPress plugin is in development. Join the list and we will notify you on launch. No code required at all.",
  },
]

export default function EmbedSection() {
  return (
    <section className="embed-section" id="embed">
      <div className="max-w">
        <div className="section-label">Get Started</div>
        <h2 className="section-title">One Line.<br />That&apos;s The Install.</h2>
        <p className="section-body">
          Drop the snippet into your site and InkReady is live. Our CSS Chameleon script reads your brand
          automatically — buttons, fonts, colors — and matches the widget to your site. Zero config.
        </p>
        <div className="embed-layout">
          <div>
            <div className="embed-code-block">
              <div className="code-header">
                <div className="code-dot red"></div>
                <div className="code-dot yellow"></div>
                <div className="code-dot green"></div>
                <span className="code-filename">your-website.html</span>
              </div>
              <div className="code-body">
                <span className="comment">{`<!-- Paste before </body> -->`}</span><br /><br />
                <span className="tag-c">{`<script`}</span><br />
                &nbsp;&nbsp;<span className="attr">src</span>=<span className="val">{`"https://inkready.99agnts.agency/widget.js"`}</span><br />
                &nbsp;&nbsp;<span className="attr">data-shop</span>=<span className="val">{`"YOUR-SHOP-ID"`}</span><br />
                &nbsp;&nbsp;<span className="attr">async</span><br />
                <span className="tag-c">{`></script>`}</span>
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="#chat" className="btn-primary" style={{ fontSize: '12px', padding: '11px 22px' }}>
                Get My Shop ID →
              </a>
              <a href="#chat" className="btn-ghost" style={{ fontSize: '12px', padding: '11px 22px' }}>
                Our Team Will Install It
              </a>
            </div>
          </div>
          <div className="embed-options">
            {options.map((opt) => (
              <div key={opt.title} className="embed-option">
                <div className="opt-tag">{opt.tag}</div>
                <h4>
                  <span className="opt-icon" aria-hidden="true">{opt.icon}</span>
                  {opt.title}
                </h4>
                <p>{opt.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
