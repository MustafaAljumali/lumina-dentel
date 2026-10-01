import React from 'react';
import { Shield, Sparkles, Activity, Smile, Zap, ChevronRight } from 'lucide-react';
import { ServiceCategory } from '../../types';

interface QuickServiceSelectorProps {
  onSelectCategory: (category: ServiceCategory) => void;
}

export const QuickServiceSelector: React.FC<QuickServiceSelectorProps> = ({ onSelectCategory }) => {
  const categories: Array<{
    id: ServiceCategory;
    title: string;
    description: string;
    icon: React.ElementType;
    badgeColor: string;
    textColor: string;
    iconBg: string;
  }> = [
    {
      id: 'PREVENTIVE',
      title: 'Preventive & Cleanings',
      description: '3D digital x-rays, intraoral cancer screening & gentle ultrasonic cleanings.',
      icon: Shield,
      badgeColor: 'bg-[#14B8A6]',
      textColor: 'text-[#14B8A6]',
      iconBg: 'bg-[#14B8A6]/10',
    },
    {
      id: 'COSMETIC',
      title: 'Cosmetic & Whitening',
      description: 'Zoom laser whitening & handcrafted porcelain veneers for red-carpet smiles.',
      icon: Sparkles,
      badgeColor: 'bg-[#D4AF37]',
      textColor: 'text-[#D4AF37]',
      iconBg: 'bg-[#D4AF37]/20',
    },
    {
      id: 'RESTORATIVE',
      title: 'Restorative & CEREC',
      description: 'Same-day 3D milled ceramic crowns & guided titanium implant replacements.',
      icon: Activity,
      badgeColor: 'bg-[#0F2C59]',
      textColor: 'text-[#0F2C59]',
      iconBg: 'bg-[#0F2C59]/10',
    },
    {
      id: 'ORTHODONTICS',
      title: 'Invisalign® Ortho',
      description: '3D iTero simulated aligner therapy with transparent custom trays.',
      icon: Smile,
      badgeColor: 'bg-purple-600',
      textColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
    {
      id: 'EMERGENCY',
      title: '24/7 Urgent Emergency',
      description: 'Immediate same-day pain triage, severe toothache & trauma care.',
      icon: Zap,
      badgeColor: 'bg-red-500',
      textColor: 'text-red-500',
      iconBg: 'bg-red-100',
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
              Explore Our Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2C59] mt-1">
              Precision Dental Specialties
            </h2>
          </div>
          <p className="text-sm text-[#64748B] mt-2 md:mt-0 max-w-md">
            Click any specialty below to view detailed treatment options, transparent pricing, and instant online scheduling.
          </p>
        </div>

        {/* Categories Grid / Horizontal Scroll */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group relative bg-[#F8FAFC] hover:bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-[#14B8A6] hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between h-full transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${cat.iconBg} flex items-center justify-center`}>
                      <IconComp className={`w-6 h-6 ${cat.textColor}`} />
                    </div>
                    <span className={`w-2 h-2 rounded-full ${cat.badgeColor}`} />
                  </div>
                  <h3 className="font-bold text-base text-[#0F2C59] group-hover:text-[#14B8A6] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-2 leading-relaxed font-normal">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs font-bold text-[#0F2C59] group-hover:text-[#14B8A6] transition-colors">
                  <span>View Treatments</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
