import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="mb-8">
            <div className="text-9xl font-bold bg-gradient-to-r from-primary via-gold-light to-accent bg-clip-text text-transparent mb-4">
              404
            </div>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            We couldn't find the page you're looking for. It might have moved or been removed. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" size="lg">
                Go Home
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg">
                View Services
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-16 pt-12 border-t border-border">
            <p className="text-muted-foreground mb-6">Popular pages:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/about" className="text-primary hover:text-gold transition-colors">
                About
              </Link>
              <Link href="/services" className="text-primary hover:text-gold transition-colors">
                Services
              </Link>
              <Link href="/pricing" className="text-primary hover:text-gold transition-colors">
                Pricing
              </Link>
              <Link href="/faq" className="text-primary hover:text-gold transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
