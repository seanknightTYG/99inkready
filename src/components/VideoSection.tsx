export default function VideoSection() {
  return (
    <section className="video-section" id="video">
      <div className="max-w">
        <div className="section-label">See It Live</div>
        <h2 className="section-title">Watch It Work<br />In 90 Seconds.</h2>
        <p className="section-body">
          From paste-the-snippet to 300 DPI download. The whole flow, no fluff.
        </p>
        <div className="video-placeholder" role="button" tabIndex={0} aria-label="Play video walkthrough">
          <div className="play-btn" aria-hidden="true"></div>
          <div className="video-placeholder-text">Video walkthrough — coming soon</div>
        </div>
      </div>
    </section>
  )
}
