import React from 'react';
import { Calendar, Sparkles, Star, Award, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (tab: string, options?: { category?: string }) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24 bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9]/60 to-[#F8FAFC]">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#14B8A6]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#0F2C59]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content (55% on desktop -> 7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F2C59]">
                Palo Alto's Premier Dental & Cosmetic Center
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F2C59] tracking-tight leading-[1.15]">
              Gentle, State-of-the-Art <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F2C59] via-[#14B8A6] to-[#0F2C59]">
                Dental Care
              </span>{' '}
              for Your Smile.
            </h1>

            {/* Subhead */}
            <p className="text-lg sm:text-xl text-[#64748B] max-w-2xl leading-relaxed font-normal">
              Experience the Apex difference — where advanced 3D intraoral imaging meets gentle, compassionate aesthetic craftsmanship for total mouth wellness.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => onNavigate('book')}
                className="inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl text-base font-bold bg-[#D4AF37] text-[#0F2C59] hover:bg-[#c4a130] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-5 h-5 text-[#0F2C59]" />
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onNavigate('consultation')}
                className="inline-flex items-center justify-center space-x-2.5 px-7 py-4 rounded-xl text-base font-bold text-[#0F2C59] bg-white border-2 border-[#0F2C59]/15 hover:border-[#0F2C59]/40 hover:bg-slate-50 transition-all duration-300 shadow-sm"
              >
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <span>Virtual Smile Assessment</span>
              </button>
            </div>

            {/* Trust Badges Row */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-xl">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                </div>
                <div>
                  <p className="font-extrabold text-sm text-[#0F2C59]">4.9 / 5.0</p>
                  <p className="text-xs text-[#64748B] font-medium">500+ Google Reviews</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-[#14B8A6]" />
                </div>
                <div>
                  <p className="font-extrabold text-sm text-[#0F2C59]">Top Dentist</p>
                  <p className="text-xs text-[#64748B] font-medium">2024 & 2025 Winner</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-extrabold text-sm text-[#0F2C59]">100% HIPAA</p>
                  <p className="text-xs text-[#64748B] font-medium">Encrypted & Private</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual Container (45% on desktop -> 5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image Card with subtle gradient frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000"
                  alt="Modern Dental Operatory Room"
                  className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C59]/80 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#14B8A6] text-[11px] font-extrabold uppercase tracking-wider">
                    Next-Gen Facility
                  </span>
                  <p className="font-bold text-lg">Ultra-Quiet 3D Scanners & Pain-Free Laser Tech</p>
                  <p className="text-xs text-slate-200">Zero messy impression trays. 100% digital precision.</p>
                </div>
              </div>

              {/* Floating Floating Stat Badge 1 */}
              <div className="absolute -top-4 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Same-Day Care</p>
                  <p className="font-extrabold text-sm text-[#0F2C59]">CEREC 3D Crowns in 1 Visit</p>
                </div>
              </div>

              {/* Floating Stat Badge 2 */}
              <div className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#0F2C59]">
                  <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invisalign® Diamond</p>
                  <p className="font-extrabold text-sm text-[#0F2C59]">1,200+ Smiles Transformed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
