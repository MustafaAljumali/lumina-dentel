import React from 'react';
import { Shield, Phone, Mail, MapPin, Clock, Award, CheckCircle2, Instagram, Facebook, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string, options?: { category?: string }) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0F2C59] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center text-[#0F2C59] font-black text-xl">
                A✦
              </div>
              <div>
                <h3 className="font-bold text-xl text-white tracking-tight">APEX MODERN</h3>
                <p className="text-xs text-[#14B8A6] font-bold tracking-widest uppercase">DENTAL & AESTHETICS</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Experience gentle, state-of-the-art dental care combining advanced 3D technology with compassionate aesthetic craftsmanship.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-[#D4AF37] hover:bg-slate-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-[#D4AF37] hover:bg-slate-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-[#D4AF37] hover:bg-slate-700 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#14B8A6] transition-colors">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#14B8A6] transition-colors">
                  Services & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('team')} className="hover:text-[#14B8A6] transition-colors">
                  Meet Our Doctors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('book')} className="hover:text-[#14B8A6] transition-colors">
                  Schedule Appointment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('consultation')} className="hover:text-[#14B8A6] transition-colors">
                  Virtual Smile Assessment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#14B8A6] transition-colors">
                  Emergency Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Service Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">Treatments</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate('services', { category: 'PREVENTIVE' })} className="hover:text-[#14B8A6] transition-colors">
                  Preventive & Cleanings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services', { category: 'COSMETIC' })} className="hover:text-[#14B8A6] transition-colors">
                  Laser Whitening & Veneers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services', { category: 'ORTHODONTICS' })} className="hover:text-[#14B8A6] transition-colors">
                  Invisalign® Clear Aligners
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services', { category: 'RESTORATIVE' })} className="hover:text-[#14B8A6] transition-colors">
                  Same-Day CEREC Crowns
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services', { category: 'EMERGENCY' })} className="hover:text-[#14B8A6] transition-colors">
                  Urgent 24/7 Dental Care
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">Clinic Information</h4>
            <div className="space-y-2.5 text-sm text-slate-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#14B8A6] shrink-0 mt-1" />
                <span>450 Medical Center Plaza, Suite 300, Palo Alto, CA 94301</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#14B8A6] shrink-0" />
                <a href="tel:5559113368" className="font-semibold text-white hover:text-[#D4AF37]">
                  (555) 911-DENT
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#14B8A6] shrink-0" />
                <span>care@apexmoderndental.com</span>
              </div>
              <div className="flex items-start space-x-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#14B8A6] shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-white">Mon - Fri: 8:00 AM - 6:00 PM</p>
                  <p className="text-xs text-slate-400">Sat: 9:00 AM - 2:00 PM (Emergency 24/7)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom HIPAA & Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[#14B8A6]" />
            <span>🔒 Encrypted HIPAA-Aware Patient Portal</span>
          </div>
          <p>© 2026 Apex Modern Dental & Aesthetics. All Rights Reserved.</p>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-slate-200">Privacy Policy</a>
            <a href="#" className="hover:text-slate-200">Terms of Care</a>
            <a href="#" className="hover:text-slate-200">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
