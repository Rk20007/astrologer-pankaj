'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import Button from '@/components/Button';
import { pujasData } from '@/data/puja';
import { IndianRupee, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PujaPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(pujasData.map((p) => p.category))];
  const filteredPujas =
    selectedCategory === 'all'
      ? pujasData
      : pujasData.filter((p) => p.category === selectedCategory);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Header */}
        <section className="py-12 bg-gradient-to-b from-secondary/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-foreground mb-4">
              Puja & Anushthan
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Sacred remedial rituals performed at holy temples to align your life with cosmic energies and divine blessings.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-secondary text-white shadow-lg'
                      : 'bg-muted text-foreground hover:bg-muted-foreground'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Puja Grid */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPujas.map((puja) => (
                <div
                  key={puja.id}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-secondary/50 transition-all group"
                >
                  {/* Color Band */}
                  <div className="h-2 bg-gradient-to-r from-secondary via-dark-red to-secondary" />

                  <div className="p-8">
                    {/* Category Badge */}
                    <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold uppercase tracking-wide mb-4">
                      {puja.category}
                    </span>

                    {/* Title */}
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">
                      {puja.name}
                    </h3>

                    {/* Temple */}
                    <p className="text-muted-foreground mb-6 text-sm">{puja.temple}</p>

                    {/* Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span className="text-sm text-foreground">{puja.duration}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span className="text-lg font-bold text-foreground">₹{puja.price}</span>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-6">
                      <p className="text-xs font-bold text-secondary uppercase tracking-wide mb-3">
                        Benefits
                      </p>
                      <ul className="space-y-2">
                        {puja.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                            <CheckCircle className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Includes */}
                    <div className="mb-6">
                      <p className="text-xs font-bold text-secondary uppercase tracking-wide mb-3">
                        Includes
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {puja.includes.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <Link href="/contact" className="block w-full">
                      <Button variant="primary" size="md" className="w-full">
                        Book Puja Service
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-8">
              About Puja Services
            </h2>

            <div className="space-y-6 text-foreground leading-relaxed">
              <p>
                Puja (worship) is a sacred ritual performed to invoke divine blessings and cosmic energies. Our certified priests perform these rituals at the most auspicious temples across India, ensuring authentic and powerful ceremonies.
              </p>

              <p>
                Each puja is customized based on your astrological chart and personal needs. Whether you seek planetary harmony, protection, prosperity, or spiritual growth, we have the right ceremony for you.
              </p>

              <div className="bg-card border border-border rounded-lg p-6 mt-8">
                <h3 className="font-semibold text-lg text-foreground mb-4">How It Works</h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">1.</span>
                    <span>Consultation to understand your needs</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">2.</span>
                    <span>Astrological analysis for auspicious timing</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">3.</span>
                    <span>Expert priest performs the ritual ceremony</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">4.</span>
                    <span>Video documentation and Prasad delivery</span>
                  </li>
                </ol>
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
