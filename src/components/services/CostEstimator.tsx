import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Service } from '../../types';
import { Translations } from '../../data/translations';

interface CostEstimatorProps {
  services: Service[];
  onBookService: (serviceId: string) => void;
  content?: Translations['estimator'];
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({ services, onBookService, content }) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || 'srv-1');
  const [selectedInsurance, setSelectedInsurance] = useState<string>('delta');

  const insuranceNetworks = [
    { id: 'delta', name: 'Delta Dental Premier', coverage: 80 },
    { id: 'cigna', name: 'Cigna Dental Network', coverage: 70 },
    { id: 'aetna', name: 'Aetna Dental Options', coverage: 75 },
    { id: 'metlife', name: 'MetLife PDP Plus', coverage: 70 },
    { id: 'self_pay', name: content?.directPay || 'LUMINA Member (Direct Pay)', coverage: 15 },
  ];

  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const currentNetwork = insuranceNetworks.find((n) => n.id === selectedInsurance) || insuranceNetworks[0];

  const basePrice = Number(currentService?.basePrice || 195);
  const estimatedCoverage = Math.round((basePrice * currentNetwork.coverage) / 100);
  const patientTotal = Math.max(0, basePrice - estimatedCoverage);
  const monthlyEstimate = Math.round(patientTotal / 12);

  const kicker = content?.kicker || 'Financial Transparency';
  const title = content?.title || 'Estimate your procedure investment.';
  const subtitle =
    content?.subtitle ||
    'Select a clinical service and your dental coverage network for an immediate out-of-pocket preview.';

  return (
    <section className="py-20 lg:py-28 bg-[#faf9f6] border-y border-[#ebe9e4]">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="max-w-xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#9c5828] mb-3">
            {kicker}
          </p>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#161616]">
            {title}
          </h2>
          <p className="text-sm text-[#5a5854] mt-2">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label className="block text-xs font-medium text-[#161616] mb-2 uppercase tracking-wide">
                {content?.procedureLabel || 'Procedure'}
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full p-3.5 bg-white border border-[#ebe9e4] rounded-lg text-sm text-[#161616] focus:outline-none focus:border-[#9c5828] cursor-pointer"
              >
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} (${srv.basePrice})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#161616] mb-2 uppercase tracking-wide">
                {content?.insuranceLabel || 'Insurance Network'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {insuranceNetworks.map((net) => (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => setSelectedInsurance(net.id)}
                    className={`p-3 rounded-lg border text-left rtl:text-right text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      selectedInsurance === net.id
                        ? 'border-[#161616] bg-white text-[#161616]'
                        : 'border-[#ebe9e4] bg-[#faf9f6] text-[#5a5854] hover:bg-white'
                    }`}
                  >
                    <span>{net.name}</span>
                    {selectedInsurance === net.id && <Check className="w-3.5 h-3.5 text-[#9c5828]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 bg-white p-8 rounded-xl border border-[#ebe9e4] space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-[#5a5854] uppercase tracking-wide">
                {content?.estimatedOutOfPocket || 'Estimated Out-of-Pocket'}
              </span>
              <div className="text-4xl font-normal text-[#161616] tracking-tight">
                ${patientTotal}
              </div>
              <p className="text-xs text-[#5a5854] pt-1">
                {content?.baseProcedure || 'Base procedure'} ${basePrice} · {content?.coverageText || 'Coverage'} ~{currentNetwork.coverage}% (${estimatedCoverage})
              </p>
            </div>

            <div className="pt-4 border-t border-[#ebe9e4] space-y-1 text-xs text-[#5a5854]">
              <div className="flex justify-between font-medium text-[#161616]">
                <span>{content?.financingLabel || '0% APR Financing:'}</span>
                <span>${monthlyEstimate} {content?.perMonth || '/ month for 12 mos'}</span>
              </div>
              <p className="text-[11px] text-[#76736d]">
                {content?.financingSub || 'Available via CareCredit with no prepayment penalties.'}
              </p>
            </div>

            <button
              onClick={() => onBookService(currentService.id)}
              className="w-full py-3 rounded-lg bg-[#161616] hover:bg-[#2c2b29] text-white text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{content?.scheduleBtn || 'Schedule Initial Visit'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c28458] rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
