import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import HomeHero from '@/components/home/Hero';
import HomeServices from '@/components/home/Services';
import HomeTestimonials from '@/components/home/Testimonials';
import HomeStats from '@/components/home/Stats';
import HomePodcasts from '@/components/home/Podcasts';
import HomeCTA from '@/components/home/CTA';

export const metadata = {
  title: 'Bhawna Upadhyay | TEDx Speaker & Vedic Astrologer',
  description:
    'Personalised Vedic astrology consultations, kundli readings, Vastu guidance, puja and anushthan, and the authentic remedies Bhawna Upadhyay is known for worldwide.',
};

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HomeHero />
        <HomeStats />
        <HomeServices />
        <HomePodcasts />
        <HomeTestimonials />
        <HomeCTA />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
