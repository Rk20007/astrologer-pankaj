import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { services, consultants } from '@/data/services';
import ServiceCard from '@/components/ServiceCard';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export const metadata = {
  title: 'Professional Astrology Services | Consultation & Readings',
  description: 'Expert astrology, numerology, Vastu, and kundli reading services from Pankaj Sir and Bhawna Ma\'am. Book your consultation today.',
};

export default function ServicesPage() {
  const pankajServices = services.filter((s) => s.consultantId === 'pankaj');
  const bhawnaServices = services.filter((s) => s.consultantId === 'bhawna');

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Header */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-foreground mb-4">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Comprehensive astrology, numerology, and Vastu consultation services tailored to your unique needs and life circumstances.
            </p>
          </div>
        </section>

        {/* Pankaj Sir Services */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center text-white font-serif font-bold text-lg">
                  ♂
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-bold text-foreground">Pankaj Sir</h2>
                  <p className="text-muted-foreground">Vedic Astrologer & Numerologist • 20+ Years Experience</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {pankajServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* Bhawna Ma'am Services */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-dark-red flex items-center justify-center text-white font-serif font-bold text-lg">
                  ♀
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-bold text-foreground">Bhawna Ma&apos;am</h2>
                  <p className="text-muted-foreground">Astrologer & Life Coach • 15+ Years Experience</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bhawnaServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* About Consultants */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-4xl font-bold text-foreground text-center mb-12">
              Meet Our Expert Consultants
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {consultants.map((consultant) => (
                <div key={consultant.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-64 bg-gradient-to-br from-primary/10 via-gold/10 to-accent/10 flex items-center justify-center text-6xl">
                    {consultant.id === 'pankaj' ? '♂' : '♀'}
                  </div>
                  <div className="p-8">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                      {consultant.name}
                    </h3>
                    <p className="text-primary font-semibold mb-4">{consultant.title}</p>
                    <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                      <p>
                        <span className="font-semibold">Experience:</span> {consultant.experience}
                      </p>
                      <p>
                        <span className="font-semibold">Specialization:</span> {consultant.specialization}
                      </p>
                    </div>
                    <p className="text-foreground leading-relaxed">{consultant.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
