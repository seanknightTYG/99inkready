export default function ChatSection() {
  return (
    <section className="chat-section" id="chat">
      <div className="max-w">
        <div className="section-label">Talk to Us</div>
        <div className="chat-layout">
          {/* Chat mockup */}
          <div className="chat-mock">
            <div className="chat-topbar">
              <div className="chat-avatar" aria-hidden="true">IR</div>
              <div>
                <div className="chat-name">InkReady Team</div>
                <div className="chat-status">Online now</div>
              </div>
            </div>
            <div className="chat-messages" aria-live="polite">
              <div>
                <div className="msg them">
                  Hey! We&apos;re Sean and Matthew — we run a sign shop in Humboldt County and built
                  InkReady for ourselves first. What questions do you have?
                </div>
                <div className="msg-time">Sean · just now</div>
              </div>
              <div>
                <div className="msg us">Do you install it for us?</div>
                <div className="msg-time" style={{ textAlign: 'right' }}>You · just now</div>
              </div>
              <div>
                <div className="msg them">
                  100%. If you&apos;re on WordPress, Shopify, or anything else — we&apos;ll handle
                  the install. Takes less than an hour. No charge for the embed setup.
                </div>
                <div className="msg-time">Matthew · just now</div>
              </div>
            </div>
            <div className="chat-input">
              <input
                className="chat-input-field"
                type="text"
                placeholder="Ask us anything..."
                aria-label="Chat message"
              />
              <button className="chat-send" aria-label="Send message">Send</button>
            </div>
          </div>

          {/* Copy */}
          <div className="chat-copy">
            <h3>Real Shop Owners.<br />Real Answers.</h3>
            <p>
              We&apos;re not a call center. We&apos;re Sean Knight and Matthew McMahon — we run Lost
              Coast Signs &amp; Swag in Eureka, CA and 99 Agents Agency. We built InkReady for our own
              shop. We know your questions because we had them first.
            </p>
            <div className="team-cards">
              <div className="team-card">
                <div className="t-name">Sean Knight</div>
                <div className="t-role">Co-Founder</div>
                <div className="t-bio">Lost Coast Signs &amp; Swag · 99 Agents Agency · Eureka, CA</div>
              </div>
              <div className="team-card">
                <div className="t-name">Matthew McMahon</div>
                <div className="t-role">Co-Founder</div>
                <div className="t-bio">Lost Coast Signs &amp; Swag · Print &amp; Sign Industry · Eureka, CA</div>
              </div>
            </div>
            <a
              href="mailto:hello@99agents.agency"
              className="btn-primary"
              style={{ marginTop: '0.5rem', textAlign: 'center' }}
            >
              Email Us Directly →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
