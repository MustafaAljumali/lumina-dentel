import React, { useState } from 'react';
import { Doctor } from '../../types';
import { GraduationCap, Calendar, ChevronDown, ChevronUp, Sparkles, CheckCircle } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onBookWithDoctor: (doctorId: string) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBookWithDoctor }) => {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [eduExpanded, setEduExpanded] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1 relative">
      <div>
        {/* Photo Container */}
        <div className="relative mx-auto w-32 h-32 mb-5">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-[#14B8A6] shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Active Specialist" />
        </div>

        {/* Doctor Header */}
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-[#0F2C59]">{doctor.name}</h3>
          <p className="text-xs font-bold text-[#64748B] tracking-wider uppercase">{doctor.title}</p>
          <div className="pt-1">
            <span className="inline-block bg-[#D4AF37]/20 text-[#0F2C59] text-xs font-extrabold px-3 py-1 rounded-full border border-[#D4AF37]/40">
              {doctor.specialty}
            </span>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            {bioExpanded ? doctor.bio : `${doctor.bio.slice(0, 130)}...`}
          </p>
          {doctor.bio.length > 130 && (
            <button
              onClick={() => setBioExpanded(!bioExpanded)}
              className="text-xs font-bold text-[#14B8A6] hover:underline mt-1 focus:outline-none"
            >
              {bioExpanded ? 'Show Less' : 'Read Full Bio'}
            </button>
          )}
        </div>

        {/* Education Accordion */}
        <div className="mt-4 pt-2 border-t border-slate-100">
          <button
            onClick={() => setEduExpanded(!eduExpanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-[#0F2C59] py-2 hover:text-[#14B8A6] transition-colors"
          >
            <div className="flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4 text-[#14B8A6]" />
              <span>Education & Residency</span>
            </div>
            {eduExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {eduExpanded && (
            <ul className="space-y-2 pt-1 text-xs text-slate-600 animate-in fade-in duration-200">
              {doctor.education.map((edu, idx) => (
                <li key={idx} className="flex items-start space-x-2 bg-[#F8FAFC] p-2 rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#0F2C59]">{edu.degree}</span> — {edu.institution} ({edu.year})
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer Booking CTA */}
      <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
        <p className="text-[11px] text-center text-emerald-600 font-bold">
          Next Available: {doctor.nextAvailable}
        </p>
        <button
          onClick={() => onBookWithDoctor(doctor.id)}
          className="w-full py-3 rounded-xl font-bold bg-[#D4AF37] text-[#0F2C59] hover:bg-[#c4a130] transition-colors shadow-md flex items-center justify-center space-x-2 text-xs sm:text-sm"
        >
          <Calendar className="w-4 h-4" />
          <span>Book with {doctor.name.split(' ')[1]}</span>
        </button>
      </div>
    </div>
  );
};
