import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Copy,
  Check,
  Send,
  Zap,
  Navigation,
  AlertTriangle,
  Info,
  ShieldAlert,
} from 'lucide-react';

export const EmergencyTriage: React.FC = () => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const addressText = '450 Medical Center Plaza, Suite 300, Palo Alto, CA 94301';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(addressText);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const isCurrentlyOpen = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    return day >= 1 && day <= 5 && hour >= 8 && hour < 18;
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage('Thank you! Your message has been sent to our reception team.');
      setContactForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setToastMessage(null), 4000);
    }, 1000);
  };

  const emergencyCards = [
    {
      title: 'Severe Toothache or Throbbing Pain',
      action: 'Rinse gently with warm salt water and take over-the-counter pain relievers. Never place aspirin directly on gums.',
      cta: 'Call Emergency Line Now',
    },
    {
      title: 'Knocked-Out (Avulsed) Tooth',
      action: 'Hold tooth by crown (never touch root). Rinse gently in milk or saline. Keep in milk or mouth and reach clinic within 60 mins!',
      cta: 'Call Emergency Line Now',
    },
    {
      title: 'Broken or Fractured Tooth',
      action: 'Save any broken tooth fragments. Rinse mouth with warm water and apply cold compress to outer cheek to minimize swelling.',
      cta: 'Call Emergency Line Now',
    },
    {
      title: 'Lost Filling, Crown or Veneer',
      action: 'Apply temporary dental cement or soft sugarless gum over exposed area. Avoid hot or ice-cold drinks until evaluated.',
      cta: 'Call Emergency Line Now',
    },
  ];

  return (
    <div className="py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-4 z-50 bg-[#0F2C59] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 border border-[#14B8A6] animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
            Get In Touch & Urgent Care
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2C59] mt-1">
            Contact Apex Modern Dental
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2">
            Reach our reception desk or connect directly to our 24/7 on-call emergency dental team.
          </p>
        </div>

        {/* Two-Column Grid: Contact Form + Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80">
            <h3 className="text-xl font-bold text-[#0F2C59] mb-4">Send Us a Direct Message</h3>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#0F2C59] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Michael Smith"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full p-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#0F2C59] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="michael@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full p-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#0F2C59] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 234-5678"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full p-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#0F2C59] mb-1">
                    Subject
                  </label>
                  <select
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full p-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm font-medium"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Appointment Reschedule">Appointment Reschedule</option>
                    <option value="Insurance Question">Insurance Question</option>
                    <option value="Feedback / Review">Feedback / Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#0F2C59] mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can our clinical team assist you today?"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full p-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold bg-[#0F2C59] text-white hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>

          {/* Right: Contact Info Card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-[#0F2C59]">Direct Contact</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  isCurrentlyOpen() ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isCurrentlyOpen() ? '● Open Now' : '○ Closed Currently'}
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              {/* Address with Copy */}
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px] mb-1">Address</span>
                <div className="flex items-center justify-between bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                    <span className="font-medium text-[#0F2C59]">{addressText}</span>
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
                    title="Copy Address"
                  >
                    {copiedAddress ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px] mb-1">Phone (Tap to Call)</span>
                <a
                  href="tel:5559113368"
                  className="flex items-center space-x-2 bg-red-50 p-3 rounded-xl border border-red-200 font-bold text-[#EF4444] hover:bg-red-100 transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>(555) 911-DENT — 24/7 Urgent Line</span>
                </a>
              </div>

              {/* Email */}
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px] mb-1">Email</span>
                <a
                  href="mailto:care@apexmoderndental.com"
                  className="flex items-center space-x-2 bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 font-medium text-[#0F2C59] hover:bg-slate-100 transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#14B8A6] shrink-0" />
                  <span>care@apexmoderndental.com</span>
                </a>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=450+Medical+Center+Plaza+Palo+Alto+CA"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl font-bold bg-[#D4AF37] text-[#0F2C59] hover:bg-[#c4a130] transition-colors shadow-md flex items-center justify-center space-x-2 text-xs"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions on Google Maps</span>
            </a>
          </div>
        </div>

        {/* 🚨 Emergency Triage Section (Full-width) */}
        <div className="bg-gradient-to-r from-[#0F2C59] via-[#0b2246] to-[#0F2C59] text-white p-8 sm:p-12 rounded-3xl shadow-2xl border-2 border-red-500/30 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-2 border border-red-500/30">
                <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
                <span>24/7 Dental Emergency Protocols</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Experiencing a Dental Emergency?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                If you are experiencing severe pain, trauma, bleeding, or a knocked-out tooth, follow these triage steps and call us immediately.
              </p>
            </div>

            <a
              href="tel:5559113368"
              className="px-6 py-3.5 rounded-2xl bg-[#EF4444] text-white font-black hover:bg-red-600 transition-all shadow-xl flex items-center space-x-2 text-sm shrink-0"
            >
              <Phone className="w-5 h-5" />
              <span>Call (555) 911-DENT</span>
            </a>
          </div>

          {/* 4 Emergency Triage Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyCards.map((card, idx) => (
              <div key={idx} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold mb-3">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">{card.title}</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed font-normal">{card.action}</p>
                </div>

                <a
                  href="tel:5559113368"
                  className="w-full py-2 rounded-xl text-[11px] font-bold text-center bg-red-500/30 hover:bg-red-500 text-red-200 hover:text-white transition-colors border border-red-500/40 block mt-3"
                >
                  {card.cta}
                </a>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs text-slate-400 flex items-center space-x-2">
            <Info className="w-4 h-4 text-[#14B8A6] shrink-0" />
            <span>
              After-Hours Notice: If our main clinic is closed, calling (555) 911-DENT automatically connects to Dr. Sarah Chen’s direct emergency line.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
