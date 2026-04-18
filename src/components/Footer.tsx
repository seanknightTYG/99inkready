export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="footer-logo">Rezify<span>.io</span></div>
          <div className="footer-tagline">AI Design for Print Shops. Free to embed. Pay when you print.</div>

        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#problem">The Problem</a>
          <a href="#how">How It Works</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#pricing">Pricing</a>
          <a href="#embed">Get the Embed</a>
          <a href="#chat">Talk to Us</a>
        </nav>

      </div>
      <div className="max-w">
        <div className="footer-copy">
          <span>© 2025 Rezify.io</span>
          <span>Built by shop owners who got tired of bad files.</span>
        </div>
      </div>
    </footer>
  )
}
