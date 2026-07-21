import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import HomeHero from '@/components/home/Hero';
import HomeServices from '@/components/home/Services';
import HomeTestimonials from '@/components/home/Testimonials';
import HomeStats from '@/components/home/Stats';
import HomeAchievements from '@/components/home/Achievements';
import HomePodcasts from '@/components/home/Podcasts';
import HomeCTA from '@/components/home/CTA';
import { getContent } from '@/lib/content';

// Render on each request so edits made in the admin panel show up immediately.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Bhawna Upadhyay | TEDx Speaker & Vedic Astrologer',
  description:
    'Personalised Vedic astrology consultations, kundli readings, Vastu guidance, puja and anushthan, and the authentic remedies Bhawna Upadhyay is known for worldwide.',
};

export default async function Page() {
  // Content is loaded from the CMS (MongoDB) with a fall back to the defaults
  // baked into /data, so the page renders even if the DB is unreachable.
  const [statsData, achievementsData] = await Promise.all([
    getContent('stats'),
    getContent('achievements'),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HomeHero />
        <HomeStats stats={statsData} />
        <HomeServices />
        <HomeAchievements data={achievementsData} />
        <HomePodcasts />
        <HomeTestimonials />
        <HomeCTA />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
