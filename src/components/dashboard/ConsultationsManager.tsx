import React, { useState } from 'react';
import { Consultation } from '../../types';
import { Sparkles, Bot, CheckCircle, Clock, AlertCircle, MessageSquare, Send } from 'lucide-react';

interface ConsultationsManagerProps {
  consultations: Consultation[];
  onUpdateConsultation: (csl: Consultation) => void;
}

export const ConsultationsManager: React.FC<ConsultationsManagerProps> = ({
  consultations,
  onUpdateConsultation,
}) => {
  const [selectedCsl, setSelectedCsl] = useState<Consultation | null>(null);
  const [responseNote, setResponseNote] = useState('');

  const handleSendResponse = () => {
    if (!selectedCsl) return;
    const updated = {
      ...selectedCsl,
      status: 'RESPONDED' as const,
      doctorNotes: responseNote || 'Reviewed by clinical staff.',
    };
    onUpdateConsultation(updated);
    setSelectedCsl(updated);
    alert('Response sent to patient email queue!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-[#0F2C59] text-lg">Virtual Smile Assessment Queue</h3>
          <p className="text-xs text-slate-500">Review patient photos and AI pre-diagnostics</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-900 rounded-full">
          {consultations.length} Pending Evaluations
        </span>
      </div>

      {/* Grid of Consultations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultations.map((csl) => (
          <div
            key={csl.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                    csl.status === 'NEW'
                      ? 'bg-purple-100 text-purple-800'
                      : csl.status === 'REVIEWED'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {csl.status}
                </span>
                <span className="text-[11px] text-slate-400 font-data">{csl.date.split('T')[0]}</span>
              </div>

              {csl.photoUrl && (
                <div className="w-full h-40 rounded-2xl overflow-hidden mb-3 bg-slate-100">
                  <img src={csl.photoUrl} alt="Patient smile" className="w-full h-full object-cover" />
                </div>
              )}

              <h4 className="font-bold text-[#0F2C59] text-base">{csl.patientName}</h4>
              <p className="text-xs text-slate-500">{csl.email}</p>

              <div className="flex flex-wrap gap-1 mt-3">
                {csl.concerns.map((conc, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold bg-[#F8FAFC] text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                  >
                    {conc}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCsl(csl);
                setResponseNote(csl.doctorNotes || '');
              }}
              className="w-full py-2.5 rounded-xl font-bold bg-[#0F2C59] text-white hover:bg-slate-800 text-xs shadow-sm"
            >
              Evaluate Request
            </button>
          </div>
        ))}
      </div>

      {/* Consultation Review Drawer */}
      {selectedCsl && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  Clinical Assessment Review
                </span>
                <h3 className="text-xl font-extrabold text-[#0F2C59]">{selectedCsl.patientName}</h3>
              </div>
              <button
                onClick={() => setSelectedCsl(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {selectedCsl.photoUrl && (
              <div className="max-w-xs mx-auto h-52 rounded-2xl overflow-hidden border border-slate-200">
                <img src={selectedCsl.photoUrl} alt="Patient smile" className="w-full h-full object-cover" />
              </div>
            )}

            {/* AI Report Summary */}
            {selectedCsl.aiAssessment && (
              <div className="bg-[#0F2C59] text-white p-5 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center space-x-2 font-bold text-[#D4AF37]">
                  <Bot className="w-4 h-4" />
                  <span>Gemini Clinical Diagnostic Insight</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{selectedCsl.aiAssessment.summary}</p>
                <p className="text-teal-300 font-bold">
                  Recommended Services: {selectedCsl.aiAssessment.recommendedServices?.join(', ')}
                </p>
              </div>
            )}

            {/* Doctor Notes Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-[#0F2C59]">
                Doctor Clinical Recommendation / Response
              </label>
              <textarea
                rows={3}
                placeholder="Enter doctor feedback to be emailed directly to patient..."
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                className="w-full p-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedCsl(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSendResponse}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#D4AF37] text-[#0F2C59] hover:bg-[#c4a130] flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Response to Patient</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
