export default function Hero() {
  return (
    <section className="hero" id="main-content" aria-label="Hero">
      <div className="hero-bg" aria-hidden="true"></div>
      <div className="hero-eyebrow">A 99 Agents Agency Product · lostcoastsigns.com</div>
      <h1 className="fade-up">
        Stop<br />
        Printing<br />
        <span className="outline">Garbage</span><br />
        <span className="accent">Art.</span>
      </h1>
      <p className="hero-sub fade-up delay-1">
        <strong>InkReady</strong> is a free AI design widget that lives on your print shop&apos;s website.
        Customers generate concepts for free. You approve the one you love.{' '}
        <strong>Download a 300 DPI print-ready file in one click.</strong>
      </p>
      <div className="hero-actions fade-up delay-2">
        <a href="#embed" className="btn-primary">Get the Free Embed</a>
        <a href="#how" className="btn-ghost">See How It Works</a>
      </div>
      <div className="hero-proof fade-up delay-3">
        <div className="proof-dot" aria-hidden="true"></div>
        <div className="proof-text">
          Running live at <span>lostcoastsigns.com</span> · Built by shop owners · No monthly fee
        </div>
      </div>
    </section>
  )
}
