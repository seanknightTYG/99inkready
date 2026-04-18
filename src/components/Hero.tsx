import Image from 'next/image'

export default function Hero() {
  return (
    <section className="hero hero-split" id="main-content" aria-label="Hero">
      <div className="hero-bg" aria-hidden="true"></div>

      {/* Left — copy */}
      <div className="hero-content">
        <div className="hero-eyebrow">A 99 Agents Agency Product · lostcoastsigns.com</div>
        <h1 className="fade-up">
          Stop<br />
          Printing<br />
          <span className="outline">Garbage</span><br />
          <span className="accent">Art.</span>
        </h1>
        <p className="hero-sub fade-up delay-1">
          <strong>99agents REZIFY</strong> tool is a free AI design widget that lives on your print shop&apos;s website.
          Your customers bring the ideas — your shop brings the print. They generate concepts until they nail it.
          You both agree on the final design. One click gets you a 300 DPI print-ready file.{' '}
          <strong>From your customer&apos;s imagination to your embellishment — no bad files, no free design hours, no infinite email loops.</strong>
        </p>
        <p className="hero-sub hero-sub-model fade-up delay-2">
          Powered by benchmark-tested AI image models — we run the latest, highest-performing generation
          engine available. Currently: <strong>Gemini 3.1 Flash Image.</strong> We update automatically
          as better models ship. Your shop always gets the best.
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
      </div>

      {/* Right — rocket art */}
      <div className="hero-visual fade-up delay-2" aria-hidden="true">
        <Image
          src="/rocket_art2.png"
          alt="An astronaut riding a creative rocket with paint brushes — REZIFY hero illustration"
          width={600}
          height={338}
          priority
          className="hero-rocket"
        />
      </div>
    </section>
  )
}
