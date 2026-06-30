import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import SearchBar from '@/components/SearchBar'
import StatsBand from '@/components/StatsBand'
import MarqueeBanner from '@/components/MarqueeBanner'
import RabbitsSection from '@/components/RabbitsSection'
import AboutSection from '@/components/AboutSection'
import TeamSection from '@/components/TeamSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import CommunitySection from '@/components/CommunitySection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <SearchBar />
      <StatsBand />
      <MarqueeBanner />
      <RabbitsSection />
      <AboutSection />
      <TeamSection />
      <TestimonialsSection />
      <CommunitySection />
      <ContactSection />
      <Footer />
    </main>
  )
}
