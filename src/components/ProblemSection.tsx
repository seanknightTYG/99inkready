const cards = [
  {
    num: '01',
    tag: 'The File',
    title: 'The Blurry Thumbnail',
    body: 'A 200px screenshot of a screenshot of their logo. For a 4-foot banner. At 72 DPI. You explain. They resend the same file.',
  },
  {
    num: '02',
    tag: 'The Time',
    title: 'The Free Design Hour',
    body: "45 minutes in Illustrator doing cleanup you'll never bill for. Because how do you charge someone for fixing art they think is finished?",
  },
  {
    num: '03',
    tag: 'The Emails',
    title: 'The Infinite Loop',
    body: '6 emails deep explaining what "vector" means. What "bleed" is. Why their 72 DPI logo won\'t scale. Still no printable file.',
  },
  {
    num: '04',
    tag: 'The Cost',
    title: '$26,000 a Year. Gone.',
    body: 'At $75/hr, 5 bad files a week = $500 in unbilled labor. Every week. That\'s $26,000 a year you\'re giving away for free.',
  },
  {
    num: '05',
    tag: 'The Competition',
    title: 'They Found It On Custom Ink.',
    body: "A screenshot from someone else's product page. \"Can you match this, but local?\" You can. But what they sent is a compressed JPEG of a finished product. That's not a file. That's a wish.",
  },
  {
    num: '06',
    tag: 'The Revision Loop',
    title: 'Round 8. "Go Back To The First One."',
    body: 'Round 1: "Perfect!" Round 3: "Can we try it in blue?" Round 8: "Actually, go back to the original." Three hours of your time. $0 billed. The first version was fine.',
  },
]

export default function ProblemSection() {
  return (
    <section className="problem-section" id="problem">
      <div className="max-w">
        <div className="section-label">The Problem</div>
        <h2 className="section-title">Your Clients Think<br />They&apos;re Helping.</h2>
        <p className="section-body">
          They spent 20 minutes on Canva and genuinely believe they handed you something printable.
          You know what you got. Here&apos;s the loop you&apos;re stuck in.
        </p>
        <div className="problem-grid">
          {cards.map((card) => (
            <div key={card.num} className="problem-card" data-num={card.num}>
              <div className="tag">{card.tag}</div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
