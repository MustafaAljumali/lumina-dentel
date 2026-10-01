import React from 'react';
import { Translations } from '../../data/translations';

interface WhyChooseUsProps {
  content?: Translations['whyUs'];
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ content }) => {
  const defaultPillars = [
    {
      number: '01',
      title: 'Digital Precision',
      description: '3D intraoral scanning and CAD/CAM milling provide sub-millimeter fit without silicone impressions.',
    },
    {
      number: '02',
      title: 'Minimal Intervention',
      description: 'Conservative enamel preservation and biological ceramics designed to match natural tooth vitality.',
    },
    {
      number: '03',
      title: 'Calm Sanctuary',
      description: 'Private treatment suites, ambient sound reduction, and gentle sedation for unhurried, comfortable care.',
    },
    {
      number: '04',
      title: 'Clear Stewardship',
      description: 'Transparent treatment plans, comprehensive warranty, and direct in-network insurance coordination.',
    },
  ];

  const kicker = content?.kicker || 'Clinical Standards';
  const title = content?.title || 'Care designed around quiet mastery and patient comfort.';
  const pillars = content?.pillars || defaultPillars;

  return (
    <section className="py-20 lg:py-28 bg-[#faf9f6] border-y border-[#ebe9e4]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="max-w-xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#9c5828] mb-3">
            {kicker}
          </p>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#161616]">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item) => (
            <div key={item.number} className="flex flex-col justify-between pt-6 border-t border-[#e2dfd7]">
              <div>
                <span className="text-xs font-mono font-medium text-[#9c5828] block mb-4">
                  {item.number}
                </span>
                <h3 className="text-lg font-medium text-[#161616] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#5a5854] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
