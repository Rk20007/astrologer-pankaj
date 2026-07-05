import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import HomeHero from '@/components/home/Hero';
import HomeServices from '@/components/home/Services';
import HomeTestimonials from '@/components/home/Testimonials';
import HomeStats from '@/components/home/Stats';
import HomeCTA from '@/components/home/CTA';

export const metadata = {
  title: 'Premium Astrology Consultation | Expert Guidance',
  description: 'Discover your destiny with expert astrology, numerology, and Vastu consultation from Pankaj Sir and Bhawna Ma\'am. Book your personalized reading today.',
};

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HomeHero />
        <HomeStats />
        <HomeServices />
        <HomeTestimonials />
        <HomeCTA />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
