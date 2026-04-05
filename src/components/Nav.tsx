export default function Nav() {
  return (
    <nav className="nav" aria-label="Main navigation">
      <div className="nav-logo">Ink<span>Ready</span></div>
      <ul className="nav-links">
        <li><a href="#problem">The Problem</a></li>
        <li><a href="#how">How It Works</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#embed">Embed</a></li>
        <li><a href="#chat">Talk to Us</a></li>
      </ul>
      <a href="#embed" className="nav-cta">Get the Embed →</a>
    </nav>
  )
}
