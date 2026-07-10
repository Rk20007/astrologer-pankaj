import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import SmartImage from '@/components/SmartImage';

export const metadata = {
  title: 'About Bhawna Ma\'am | Astrologer & Vastu Consultant',
  description: 'Meet Bhawna Ma\'am — TEDx speaker, astrologer and Vastu consultant with 15+ years of experience guiding people to shift their energies.',
};

// Photos of Bhawna Ma'am for the gallery.
const bhawnaGallery = [
  { src: '/bhawna-15.jpg', caption: 'TEDx: “Shift Your Energies”' },
  { src: '/bhawna-13.jpg', caption: 'On the TEDx stage' },
  { src: '/bhawna-14.jpg', caption: 'TEDx talk' },
  { src: '/bhawna-05.jpg', caption: 'At Kamakhya Temple' },
  { src: '/bhawna-04.jpg', caption: 'Ceremony & blessings' },
  { src: '/bhawna-12.jpg', caption: 'Honoured at the temple' },
  { src: '/bhawna-010.jpg', caption: 'With spiritual leaders' },
  { src: '/bhawna-09.jpg', caption: 'At a spiritual gathering' },
  { src: '/bhawna-11.jpg', caption: 'Meeting devotees' },
  { src: '/bhawna-07.jpg', caption: 'With clients' },
  { src: '/bhawna-06.jpg', caption: 'With clients' },
  { src: '/bhawna-01.jpg', caption: 'With clients' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Header */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-foreground mb-4">
              About Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Dedicated to providing authentic and accurate astrology guidance with over 20 years of combined experience.
            </p>
          </div>
        </section>

        {/* Featured: Bhawna Ma'am */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="relative rounded-2xl overflow-hidden ring-1 ring-border shadow-lg aspect-[4/5] bg-muted">
                <SmartImage
                  src="/bhawna-05.jpg"
                  alt="Bhawna Ma'am — Astrologer & Vastu Consultant"
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold uppercase tracking-wide shadow">
                  TEDx Speaker
                </span>
              </div>
              <div>
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 uppercase tracking-wide">
                  Meet Your Guide
                </span>
                <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Bhawna Ma&apos;am</h2>
                <p className="text-primary font-semibold mb-6">Astrologer &amp; Vastu Consultant • 15+ Years Experience</p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  A TEDx speaker and trusted astrologer, Bhawna Ma&apos;am combines traditional Vedic
                  astrology and Vastu Shastra with modern psychology to help people shift their energies
                  and transform their personal and professional lives.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  From temple ceremonies across India to the TEDx stage, her mission stays the same —
                  practical, compassionate guidance rooted in ancient wisdom.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bhawna Gallery */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-4xl font-bold text-foreground text-center mb-4">Gallery</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Moments from Bhawna Ma&apos;am&apos;s journey — talks, temple visits, and consultations.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bhawnaGallery.map((photo, i) => (
                <figure
                  key={i}
                  className="group relative rounded-xl overflow-hidden aspect-[3/4] bg-muted ring-1 ring-border"
                >
                  <SmartImage
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs font-medium text-white bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Our mission is to provide accurate, insightful, and transformative astrological guidance that helps individuals understand their life purpose, overcome challenges, and achieve their goals through the ancient wisdom of Vedic astrology.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that astrology is not about predicting the future, but about understanding yourself better and making informed decisions that align with your cosmic blueprint.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-12">Why Choose Us?</h2>

            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">Expert Consultants</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our consultants have dedicated their lives to mastering Vedic astrology, numerology, and Vastu Shastra with years of rigorous study and practice.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">Personalized Approach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every consultation is unique and tailored to your specific situation, birth chart, and life goals. We don't believe in one-size-fits-all readings.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">Confidentiality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy is paramount to us. All information shared during consultations is kept strictly confidential and protected.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">Proven Track Record</h3>
                <p className="text-muted-foreground leading-relaxed">
                  With thousands of satisfied clients from around the world, we have consistently delivered accurate insights and meaningful guidance.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">Affordable Services</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We offer flexible pricing options to make our services accessible to everyone. Choose between waiting period rates and urgent consultations.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">Practical Remedies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Beyond predictions, we provide practical remedies and guidance that you can implement in your daily life for positive results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-12">Our Values</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1 bg-gradient-to-b from-primary to-gold flex-shrink-0 rounded-full" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Integrity</h3>
                  <p className="text-muted-foreground">
                    We are honest, transparent, and ethical in all our consultations and dealings.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-1 bg-gradient-to-b from-primary to-gold flex-shrink-0 rounded-full" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Compassion</h3>
                  <p className="text-muted-foreground">
                    We approach every client with empathy and understanding, recognizing the challenges they face.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-1 bg-gradient-to-b from-primary to-gold flex-shrink-0 rounded-full" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Excellence</h3>
                  <p className="text-muted-foreground">
                    We continuously improve our knowledge and skills to provide the best guidance possible.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-1 bg-gradient-to-b from-primary to-gold flex-shrink-0 rounded-full" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Confidentiality</h3>
                  <p className="text-muted-foreground">
                    Your trust is sacred. We protect your information with the highest standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
