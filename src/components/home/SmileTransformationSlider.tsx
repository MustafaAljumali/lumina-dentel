import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MoveHorizontal, CheckCircle2 } from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  treatment: string;
  duration: string;
  beforeImg: string;
  afterImg: string;
  doctor: string;
}

export const SmileTransformationSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const caseStudies: CaseStudy[] = [
    {
      id: 'whitening',
      title: 'Laser Teeth Whitening',
      subtitle: '8-Shade Lift in 45 Minutes',
      treatment: 'Zoom Ultimate In-Office Laser Whitening',
      duration: 'Single Visit (45 mins)',
      beforeImg: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1000',
      afterImg: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1000',
      doctor: 'Dr. Sarah Chen, DDS',
    },
    {
      id: 'veneers',
      title: 'Porcelain Veneers',
      subtitle: 'Complete Smile Aesthetic Rejuvenation',
      treatment: '10 Handcrafted Minimal-Prep Veneers',
      duration: '2 Weeks (2 Visits)',
      beforeImg: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=1000',
      afterImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000',
      doctor: 'Dr. Sarah Chen, DDS',
    },
    {
      id: 'invisalign',
      title: 'Invisalign® Aligners',
      subtitle: 'Crowding & Diastema Correction',
      treatment: 'Invisalign® Full Clear Aligner Therapy',
      duration: '7 Months',
      beforeImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1000',
      afterImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000',
      doctor: 'Dr. Marcus Vance, DMD',
    },
  ];

  const currentCase = caseStudies[activeCaseIndex];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 5) percentage = 5;
    if (percentage > 95) percentage = 95;
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#0F2C59] text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Interactive Smile Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2C59]">
            Real Patient Transformations
          </h2>
          <p className="text-[#64748B] mt-2 text-base">
            Drag the slider horizontally to view the instant aesthetic results achieved by our clinical team.
          </p>

          {/* Case Study Selection Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {caseStudies.map((cs, index) => (
              <button
                key={cs.id}
                onClick={() => {
                  setActiveCaseIndex(index);
                  setSliderPos(50);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCaseIndex === index
                    ? 'bg-[#0F2C59] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cs.title}
              </button>
            ))}
          </div>
        </div>

        {/* Before / After Interactive Card Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200/80">
          <div
            ref={containerRef}
            onMouseDown={(e) => {
              setIsDragging(true);
              handleMove(e.clientX);
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              if (e.touches[0]) handleMove(e.touches[0].clientX);
            }}
            className="relative h-[380px] sm:h-[480px] rounded-2xl overflow-hidden select-none cursor-ew-resize bg-slate-900"
          >
            {/* After Image (Full background layer) */}
            <img
              src={currentCase.afterImg}
              alt={`${currentCase.title} After`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute top-4 right-4 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              After Treatment
            </span>

            {/* Before Image Layer (Clipped via clip-path percentage) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
              }}
            >
              <img
                src={currentCase.beforeImg}
                alt={`${currentCase.title} Before`}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.92]"
              />
              <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Before
              </span>
            </div>

            {/* Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-2xl border-2 border-[#14B8A6] flex items-center justify-center text-[#0F2C59]">
                <MoveHorizontal className="w-5 h-5 text-[#0F2C59]" />
              </div>
            </div>
          </div>

          {/* Case Detail Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-700 gap-4">
            <div>
              <p className="font-extrabold text-[#0F2C59] text-base">{currentCase.treatment}</p>
              <p className="text-xs text-[#64748B]">Designed by {currentCase.doctor}</p>
            </div>
            <div className="flex items-center space-x-6 text-xs font-semibold">
              <div className="flex items-center space-x-1.5 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Duration: {currentCase.duration}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[#0F2C59]">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>100% Pain-Free Procedure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
