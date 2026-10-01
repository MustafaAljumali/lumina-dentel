import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Sparkles, Menu, X, ShieldCheck, Clock, MapPin, UserCheck, Lock } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, options?: { category?: string; doctorId?: string }) => void;
  isEmergencyBannerVisible: boolean;
  onDismissEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  isEmergencyBannerVisible,
  onDismissEmergency,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services & Rates' },
    { id: 'team', label: 'Specialists' },
    { id: 'consultation', label: 'Virtual Smile' },
    { id: 'contact', label: 'Contact & Emergency' },
  ];

  // Live status check (Mon-Fri 8am-6pm)
  const isCurrentlyOpen = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    return day >= 1 && day <= 5 && hour >= 8 && hour < 18;
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* 🚨 Emergency Banner */}
      {isEmergencyBannerVisible && (
        <div className="bg-[#EF4444] text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm font-medium animate-pulse">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-white text-[#EF4444] font-bold px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wider">
                24/7 Urgent Line
              </span>
              <p className="truncate">
                <span className="font-semibold">Dental Emergency?</span> Severe pain or trauma? Call us immediately at{' '}
                <a href="tel:5559113368" className="underline font-bold hover:text-slate-100">
                  (555) 911-DENT
                </a>
              </p>
            </div>
            <button
              onClick={onDismissEmergency}
              className="ml-3 p-1 rounded hover:bg-white/20 transition-colors text-white"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Glassmorphism Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8FAFC]/90 backdrop-blur-xl shadow-lg border-b border-slate-200/80 py-3'
            : 'bg-[#F8FAFC]/80 backdrop-blur-md border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center space-x-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F2C59] to-[#14B8A6] p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0F2C59] rounded-[10px] flex items-center justify-center">
                <span className="text-[#D4AF37] font-extrabold text-xl tracking-tight">A</span>
                <span className="text-white font-light text-sm -ml-0.5">✦</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg sm:text-xl text-[#0F2C59] tracking-tight">APEX</span>
                <span className="text-xs uppercase tracking-widest text-[#14B8A6] font-extrabold px-1.5 py-0.5 bg-[#14B8A6]/10 rounded-md">
                  MODERN
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] font-medium tracking-wide">DENTAL & AESTHETICS</p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 bg-white/80 p-1.5 rounded-full shadow-inner border border-slate-200/60">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  currentTab === item.id
                    ? 'bg-[#0F2C59] text-white shadow-sm'
                    : 'text-[#1E293B] hover:text-[#0F2C59] hover:bg-slate-100/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Live Status Pill */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/60 text-xs font-semibold">
              <span className={`w-2 h-2 rounded-full ${isCurrentlyOpen() ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span className="text-slate-700">{isCurrentlyOpen() ? 'Open Now' : 'Closed'}</span>
            </div>

            {/* Virtual Smile Assessment CTA */}
            <button
              onClick={() => onNavigate('consultation')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0F2C59] border border-[#0F2C59]/20 hover:bg-[#0F2C59]/5 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Virtual Smile</span>
            </button>

            {/* Main Book Button */}
            <button
              onClick={() => onNavigate('book')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#D4AF37] text-[#0F2C59] hover:bg-[#c4a130] hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            {/* Admin Dashboard Portal Link */}
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 rounded-xl text-slate-500 hover:text-[#0F2C59] hover:bg-slate-200/60 transition-colors"
              title="Staff Portal Login"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => onNavigate('book')}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-[#D4AF37] text-[#0F2C59]"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-200/60"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-in Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 mt-2 space-y-3 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-xl text-base font-semibold ${
                    currentTab === item.id
                      ? 'bg-[#0F2C59] text-white'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
              <button
                onClick={() => {
                  onNavigate('consultation');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold text-[#0F2C59] border border-[#0F2C59]/20"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Virtual Smile Assessment</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('book');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold bg-[#D4AF37] text-[#0F2C59]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Staff Portal Access</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
