'use client';

import { testimonials } from '@/data/testimonials';
import TestimonialSlider from '@/components/TestimonialSlider';

export default function HomeTestimonials() {
  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <TestimonialSlider testimonials={testimonials} />
    </section>
  );
}
