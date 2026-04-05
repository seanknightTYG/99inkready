const problems = [
  'Blurry 72 DPI JPEGs',
  '45 Min Free Design Work',
  'Infinite Email Loops',
  'Canva Exports for Banners',
  'ChatGPT Cartoon Art',
]

export default function ProblemBand() {
  return (
    <div className="problem-band" aria-label="Common print shop problems">
      {problems.map((item) => (
        <div key={item} className="problem-band-item">{item}</div>
      ))}
    </div>
  )
}
