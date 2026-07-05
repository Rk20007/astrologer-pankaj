import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

export const metadata = {
  title: 'About Us | Astrology Consultation Services',
  description: 'Learn about our expert astrology consultants and their experience.',
};

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
