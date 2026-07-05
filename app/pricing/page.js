'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import Button from '@/components/Button';
import { pricingPlans, pricingFAQ } from '@/data/pricing';
import FAQAccordion from '@/components/FAQAccordion';
import { Check, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
  const [category, setCategory] = useState('all');

  const filteredPlans =
    category === 'all' ? pricingPlans : pricingPlans.filter((p) => p.category === category);

  const categories = ['all', ...new Set(pricingPlans.map((p) => p.category))];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Header */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-foreground mb-4">
              Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Flexible consultation packages for everyone. Choose waiting period rates for better value or urgent slots for immediate guidance.
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
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    category === cat
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-muted text-foreground hover:bg-muted-foreground'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-xl overflow-hidden transition-all ${
                    plan.popular
                      ? 'border-primary shadow-xl scale-105 md:scale-100 lg:scale-105'
                      : 'border-border hover:shadow-lg'
                  } ${plan.popular ? 'bg-primary/5' : 'bg-card'}`}
                >
                  {/* Header */}
                  <div
                    className={`p-6 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary to-gold text-white'
                        : 'bg-muted'
                    }`}
                  >
                    {plan.popular && (
                      <div className="inline-block px-3 py-1 bg-white text-primary rounded-full text-sm font-bold mb-3">
                        POPULAR
                      </div>
                    )}
                    <h3 className="font-serif text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm opacity-90">{plan.description}</p>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Duration */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Duration</p>
                      <p className="font-semibold text-foreground">{plan.duration}</p>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">
                          ₹{plan.price}
                        </span>
                        <span className="text-muted-foreground text-sm">waiting period</span>
                      </div>
                      {plan.urgent && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-secondary">
                            ₹{plan.urgent}
                          </span>
                          <span className="text-muted-foreground text-sm">urgent</span>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link href="/contact" className="block w-full">
                      <Button
                        variant={plan.popular ? 'primary' : 'outline'}
                        size="md"
                        className="w-full"
                      >
                        Choose Plan
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-muted/30">
          <FAQAccordion faqs={pricingFAQ} />
        </section>

        {/* CTA */}
        <section className="py-16 bg-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gold-light/90 mb-8">
              Book your consultation today and unlock the cosmic secrets of your birth chart.
            </p>
            <Link href="/contact">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-dark hover:bg-gold-light"
              >
                Book Your Consultation Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
