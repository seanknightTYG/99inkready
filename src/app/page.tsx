import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ProblemBand from '@/components/ProblemBand'
import ProblemSection from '@/components/ProblemSection'
import IndustriesSection from '@/components/IndustriesSection'
import HowItWorks from '@/components/HowItWorks'
import Screenshots from '@/components/Screenshots'
import VideoSection from '@/components/VideoSection'
import Pricing from '@/components/Pricing'
import EmbedSection from '@/components/EmbedSection'
import ChatSection from '@/components/ChatSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <main>
        <Hero />
        <ProblemBand />
        <ProblemSection />
        <IndustriesSection />
        <HowItWorks />
        <Screenshots />
        <VideoSection />
        <Pricing />
        <EmbedSection />
        <ChatSection />
      </main>
      <Footer />
    </>
  )
}
