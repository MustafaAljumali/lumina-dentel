import React, { useState } from 'react';
import { Service, ServiceCategory } from '../../types';
import { Clock, Tag, Sparkles, Check, ArrowRight } from 'lucide-react';
import { CostEstimator } from './CostEstimator';

interface ServicesGridProps {
  services: Service[];
  initialCategory?: ServiceCategory | 'ALL';
  onBookService: (serviceId: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  services,
  initialCategory = 'ALL',
  onBookService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'ALL'>(initialCategory);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<Service | null>(null);

  const categoryPills: Array<{ id: ServiceCategory | 'ALL'; label: string; badge: string }> = [
    { id: 'ALL', label: 'All Treatments', badge: 'bg-[#0F2C59] text-white' },
    { id: 'PREVENTIVE', label: 'Preventive', badge: 'bg-[#14B8A6] text-white' },
    { id: 'COSMETIC', label: 'Cosmetic & Aesthetic', badge: 'bg-[#D4AF37] text-slate-900' },
    { id: 'RESTORATIVE', label: 'Restorative & CEREC', badge: 'bg-[#0F2C59] text-white' },
    { id: 'ORTHODONTICS', label: 'Orthodontics', badge: 'bg-purple-600 text-white' },
    { id: 'EMERGENCY', label: 'Emergency', badge: 'bg-red-500 text-white' },
  ];

  const filteredServices =
    selectedCategory === 'ALL'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  const getCategoryBadgeClass = (category: ServiceCategory) => {
    switch (category) {
      case 'PREVENTIVE':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'COSMETIC':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'RESTORATIVE':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'ORTHODONTICS':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'EMERGENCY':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
            Comprehensive Clinical Care
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2C59] mt-1">
            Dental Treatments & Transparent Rates
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] mt-2">
            Explore our state-of-the-art preventive, cosmetic, and restorative services. Every treatment includes 3D digital intraoral scanning.
          </p>

          {/* Category Pill Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categoryPills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setSelectedCategory(pill.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm ${
                  selectedCategory === pill.id
                    ? 'bg-[#0F2C59] text-white shadow-md scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1 relative overflow-hidden"
            >
              {srv.isPopular && (
                <div className="absolute top-4 right-4 bg-[#D4AF37] text-[#0F2C59] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  <span>Most Popular</span>
                </div>
              )}

              <div>
                <span
                  className={`inline-block text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border mb-4 ${getCategoryBadgeClass(
                    srv.category
                  )}`}
                >
                  {srv.category}
                </span>

                <h3 className="text-xl font-bold text-[#0F2C59] group-hover:text-[#14B8A6] transition-colors leading-snug">
                  {srv.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#64748B] mt-3 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center space-x-1.5 text-slate-500">
                    <Clock className="w-4 h-4 text-[#14B8A6]" />
                    <span>{srv.duration} mins</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-normal">Base Fee</span>
                    <span className="text-xl font-black text-[#0F2C59] font-data">
                      ${srv.basePrice}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedServiceDetail(srv)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-[#0F2C59] bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Learn More
                  </button>
                  <button
                    onClick={() => onBookService(srv.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#D4AF37] text-[#0F2C59] hover:bg-[#c4a130] transition-colors shadow-sm flex items-center justify-center space-x-1"
                  >
                    <span>Book This</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Estimator Section */}
        <CostEstimator services={services} onBookService={onBookService} />
      </div>

      {/* Detail Modal */}
      {selectedServiceDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase ${getCategoryBadgeClass(
                  selectedServiceDetail.category
                )}`}
              >
                {selectedServiceDetail.category}
              </span>
              <button
                onClick={() => setSelectedServiceDetail(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="py-4 space-y-4">
              <h3 className="text-2xl font-extrabold text-[#0F2C59]">{selectedServiceDetail.name}</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">{selectedServiceDetail.description}</p>

              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Procedure Duration:</span>
                  <span className="font-data">{selectedServiceDetail.duration} Minutes</span>
                </div>
                <div className="flex justify-between font-bold text-[#0F2C59]">
                  <span>Estimated Fee:</span>
                  <span className="text-base font-data">${selectedServiceDetail.basePrice}</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Includes full 3D intraoral scan, topical numbing gel, and personal post-procedure oral care guide.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedServiceDetail(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const id = selectedServiceDetail.id;
                  setSelectedServiceDetail(null);
                  onBookService(id);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#D4AF37] text-[#0F2C59] hover:bg-[#c4a130]"
              >
                Proceed to Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
