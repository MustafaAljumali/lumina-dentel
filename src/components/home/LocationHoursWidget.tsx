import React, { useState } from 'react';
import { MapPin, Clock, Navigation, Car, ChevronDown, ChevronUp, Phone, CheckCircle2 } from 'lucide-react';

export const LocationHoursWidget: React.FC = () => {
  const [parkingOpen, setParkingOpen] = useState(false);

  const isCurrentlyOpen = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    return day >= 1 && day <= 5 && hour >= 8 && hour < 18;
  };

  const hours = [
    { day: 'Monday – Thursday', time: '8:00 AM – 6:00 PM', status: 'Open' },
    { day: 'Friday', time: '8:00 AM – 5:00 PM', status: 'Open' },
    { day: 'Saturday', time: '9:00 AM – 2:00 PM', status: 'By Appointment' },
    { day: 'Sunday', time: 'Emergency Triage Line Only', status: '24/7 Phone' },
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
            Visit Apex Dental
          </span>
          <h2 className="text-3xl font-extrabold text-[#0F2C59] mt-1">
            Location & Hours
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            Conveniently located at Medical Center Plaza with validated executive parking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Map Frame */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 relative min-h-[360px] flex flex-col justify-between">
            {/* Visual Styled Map Embed Canvas */}
            <div className="relative w-full h-[320px] bg-slate-200 overflow-hidden">
              <iframe
                title="Apex Dental Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.4231804829!2d-122.1620!3d37.4419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fbabbb1!2sPalo+Alto%2C+CA!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                className="w-full h-full border-0 filter grayscale-[20%] contrast-[1.05]"
                loading="lazy"
                allowFullScreen
              />

              {/* Custom Map Pin Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0F2C59] text-white px-4 py-2.5 rounded-2xl shadow-2xl border-2 border-[#14B8A6] flex items-center space-x-2 animate-bounce">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <p className="text-xs font-bold leading-tight">Apex Modern Dental</p>
                  <p className="text-[10px] text-teal-300 font-medium">Suite 300, Palo Alto</p>
                </div>
              </div>
            </div>

            {/* Map Footer Bar */}
            <div className="bg-[#0F2C59] text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-left">
                <p className="font-bold text-sm">450 Medical Center Plaza, Suite 300</p>
                <p className="text-xs text-slate-300">Palo Alto, CA 94301</p>
              </div>
              <a
                href="https://maps.google.com/?q=450+Medical+Center+Plaza+Palo+Alto+CA"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0F2C59] text-xs font-bold hover:bg-[#c4a130] transition-all shadow-md shrink-0"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Right: Hours & Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Hours Card */}
            <div className="bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#14B8A6]" />
                  <h3 className="font-bold text-lg text-[#0F2C59]">Operating Hours</h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    isCurrentlyOpen()
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {isCurrentlyOpen() ? '● Open Now' : '○ Closed Currently'}
                </span>
              </div>

              {/* Hours Table */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                {hours.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                    <span className="font-semibold text-[#0F2C59]">{h.day}</span>
                    <span className="text-[#64748B] font-data">{h.time}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center space-x-2 text-xs font-medium text-slate-500">
                <Phone className="w-4 h-4 text-[#EF4444]" />
                <span>24/7 Doctor On-Call Line for Registered Patients</span>
              </div>
            </div>

            {/* Parking Instructions Accordion */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 overflow-hidden">
              <button
                onClick={() => setParkingOpen(!parkingOpen)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <Car className="w-5 h-5 text-[#14B8A6]" />
                  <span className="font-bold text-sm text-[#0F2C59]">Validated Parking & Arrival Info</span>
                </div>
                {parkingOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {parkingOpen && (
                <div className="p-4 pt-0 text-xs text-[#64748B] space-y-2 border-t border-slate-100 leading-relaxed">
                  <p className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Free 2-hour validated parking in Medical Center Structure B (enter via El Camino Real).</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Take Elevator B to the 3rd floor. Suite 300 is located directly opposite the elevator lobby.</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Wheelchair accessible entrances and dedicated patient lounge with complimentary refreshments.</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
