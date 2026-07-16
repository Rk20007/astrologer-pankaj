import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { services, consultants } from '@/data/services';
import ServiceCard from '@/components/ServiceCard';
import SmartImage from '@/components/SmartImage';

export const metadata = {
  title: 'Professional Astrology Services | Consultation & Readings',
  description: 'Expert astrology, numerology, Vastu, and kundli reading services from Pankaj Sir and Bhawna Upadhyay. Book your consultation today.',
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

        {/* Bhawna Upadhyay Services (Featured) */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/40 flex-shrink-0 bg-muted">
                  <SmartImage
                    src="/bhawna-01.jpg"
                    alt="Bhawna Upadhyay"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-serif text-3xl font-bold text-foreground">Bhawna Upadhyay</h2>
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wide">Featured</span>
                  </div>
                  <p className="text-muted-foreground">Astrologer & Vastu Consultant • TEDx Speaker • 15+ Years Experience</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {bhawnaServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* Pankaj Sir Services */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-border flex-shrink-0 bg-muted">
                  <SmartImage
                    src="/consultants/pankaj.jpg"
                    alt="Pankaj Sir"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-bold text-foreground">Pankaj Sir</h2>
                  <p className="text-muted-foreground">Vedic Astrologer & Numerologist • 20+ Years Experience</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pankajServices.map((service) => (
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
                  <div className="h-72 bg-gradient-to-br from-primary/10 via-gold/10 to-accent/10 relative">
                    <SmartImage
                      src={consultant.image}
                      alt={consultant.name}
                      className="w-full h-full object-cover object-top"
                    />
                    {consultant.featured && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-primary text-white rounded-full text-xs font-semibold uppercase tracking-wide shadow">Featured</span>
                    )}
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
