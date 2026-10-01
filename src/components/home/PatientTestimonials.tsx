import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Translations } from '../../data/translations';

interface PatientTestimonialsProps {
  content?: Translations['testimonials'];
}

export const PatientTestimonials: React.FC<PatientTestimonialsProps> = ({ content }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const defaultReviews = [
    {
      id: 'rev-1',
      name: 'Jessica Reynolds',
      treatment: 'Invisalign® & Porcelain Veneers',
      quote:
        'The calmness of the clinic immediately relieved years of dental anxiety. Dr. Sarah Chen and her team took time to design every contour before touching a tooth. The outcome is seamlessly natural.',
      year: 'Patient since 2024',
    },
    {
      id: 'rev-2',
      name: 'Michael Callahan',
      treatment: 'Same-Day Ceramic Restoration',
      quote:
        'Having a precision ceramic crown measured, milled, and placed in a single 45-minute visit without temporary impressions was truly exceptional dentistry.',
      year: 'Patient since 2025',
    },
    {
      id: 'rev-3',
      name: 'Sophia Laurent',
      treatment: 'Minimal-Prep Smile Makeover',
      quote:
        'I appreciate the biological philosophy here. They preserved my natural enamel while correcting discoloration and alignment. It feels like an art studio as much as a medical practice.',
      year: 'Patient since 2023',
    },
  ];

  const kicker = content?.kicker || 'Patient Testimonials';
  const googleRating = content?.googleRating || '4.9 on Google (2,800+ reviews)';
  const reviews = content?.items || defaultReviews;

  const current = reviews[activeIdx] || reviews[0];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#9c5828]">
            <span>{kicker}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#5a5854]">{googleRating}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveIdx((prev) => (prev - 1 + reviews.length) % reviews.length)}
              className="p-2 rounded-full border border-[#ebe9e4] hover:bg-[#faf9f6] text-[#161616] transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
            <button
              onClick={() => setActiveIdx((prev) => (prev + 1) % reviews.length)}
              className="p-2 rounded-full border border-[#ebe9e4] hover:bg-[#faf9f6] text-[#161616] transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

        <blockquote className="space-y-8">
          <p className="text-xl sm:text-2xl lg:text-3xl font-light text-[#161616] leading-relaxed">
            "{current.quote}"
          </p>

          <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-6 border-t border-[#ebe9e4] text-xs text-[#5a5854]">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#161616]">{current.name}</span>
              <span aria-hidden="true">·</span>
              <span>{current.treatment}</span>
            </div>
            <span>{current.year}</span>
          </footer>
        </blockquote>
      </div>
    </section>
  );
};
