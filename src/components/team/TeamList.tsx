import React from 'react';
import { Doctor } from '../../types';
import { DoctorCard } from './DoctorCard';

interface TeamListProps {
  doctors: Doctor[];
  onBookWithDoctor: (doctorId: string) => void;
}

export const TeamList: React.FC<TeamListProps> = ({ doctors, onBookWithDoctor }) => {
  return (
    <div className="py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
            Clinical Excellence
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2C59] mt-1">
            Meet Our World-Class Specialists
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] mt-2">
            Ivy League trained dentists and board-certified prosthodontists dedicated to compassionate, state-of-the-art care.
          </p>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} onBookWithDoctor={onBookWithDoctor} />
          ))}
        </div>
      </div>
    </div>
  );
};
