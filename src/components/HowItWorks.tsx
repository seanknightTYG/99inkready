const steps = [
  {
    num: '01',
    tag: 'You · 60 seconds',
    title: 'Paste the snippet',
    body: 'One line of code on your site. Our script reads your brand colors and fonts and matches the widget automatically. No dev required.',
  },
  {
    num: '02',
    tag: 'Your Customer · Free',
    title: 'Customer designs',
    body: "They generate AI concepts directly on your website. Unlimited tries. All watermarked. They can't download anything — yet.",
  },
  {
    num: '03',
    tag: 'You + Customer · Together',
    title: 'You both approve',
    body: 'When you both love the concept, you go to your InkReady dashboard and hit Upscale. One click.',
  },
  {
    num: '04',
    tag: 'Your Dashboard · Instant',
    title: 'Download + invoice',
    body: 'A 300 DPI print-ready file lands in your vault. Invoice the customer whatever you want — $35, $50, $75. You keep 100%.',
  },
]

export default function HowItWorks() {
  return (
    <section className="how-section" id="how">
      <div className="max-w">
        <div className="section-label">The Solution</div>
        <h2 className="section-title">InkReady Flips<br />The Script.</h2>
        <p className="section-body">
          Your customers design on your website for free. You approve the final concept.
          One click gets you a 300 DPI print-ready file. That&apos;s the whole thing.
        </p>
        <div className="steps">
          {steps.map((step) => (
            <div key={step.num} className="step">
              <div className="step-num">{step.num}</div>
              <span className="mono-tag">{step.tag}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
