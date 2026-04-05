export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="footer-logo">Ink<span>Ready</span></div>
          <div className="footer-tagline">AI Design for Print Shops. Free to embed. Pay when you print.</div>
          <div className="footer-by">
            A product by{' '}
            <a href="https://99agents.agency" target="_blank" rel="noopener noreferrer">
              99 Agents Agency
            </a>{' '}
            ·{' '}
            <a href="https://lostcoastsigns.com" target="_blank" rel="noopener noreferrer">
              Lost Coast Signs &amp; Swag
            </a>
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#problem">The Problem</a>
          <a href="#how">How It Works</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#pricing">Pricing</a>
          <a href="#embed">Get the Embed</a>
          <a href="#chat">Talk to Us</a>
        </nav>
        <div className="footer-links">
          <a href="https://99agents.agency" target="_blank" rel="noopener noreferrer">99agents.agency</a>
          <a href="https://lostcoastsigns.com" target="_blank" rel="noopener noreferrer">lostcoastsigns.com</a>
          <a href="mailto:hello@99agents.agency">hello@99agents.agency</a>
        </div>
      </div>
      <div className="max-w">
        <div className="footer-copy">
          <span>© 2025 InkReady · 99 Agents Agency · Eureka, CA</span>
          <span>Built by shop owners who got tired of bad files.</span>
        </div>
      </div>
    </footer>
  )
}
