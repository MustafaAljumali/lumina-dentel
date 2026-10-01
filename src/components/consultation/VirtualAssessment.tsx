import React, { useState } from 'react';
import { Camera, X, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Consultation } from '../../types';
import { Translations } from '../../data/translations';

interface VirtualAssessmentProps {
  onConsultationSubmitted: (csl: Consultation) => void;
  onNavigateToBooking: () => void;
  onCloseModal?: () => void;
  content?: Translations['assessmentModal'];
}

export const VirtualAssessment: React.FC<VirtualAssessmentProps> = ({
  onConsultationSubmitted,
  onNavigateToBooking,
  onCloseModal,
  content,
}) => {
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const concernOptions = content?.concernsList || [
    'Alignment & Crowding',
    'Discoloration & Staining',
    'Enamel Wear or Chips',
    'Spacing & Diastema',
    'Tooth Sensitivity',
    'Missing Tooth / Restoration',
  ];

  const toggleConcern = (label: string) => {
    setErrorMessage(null);
    if (selectedConcerns.includes(label)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== label));
    } else {
      setSelectedConcerns([...selectedConcerns, label]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File size exceeds 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!patientName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please complete your contact details.');
      return;
    }

    setIsSubmitting(true);
    try {
      let aiData = {
        summary: `Preliminary clinical preview for ${patientName}: Indication for ${selectedConcerns.join(', ') || 'aesthetic evaluation'}. Recommended for comprehensive 3D scan with Dr. Sarah Chen.`,
        recommendedServices: ['Porcelain Veneers', 'Invisalign Aligners'],
        urgency: 'Medium',
        advice: 'A high-resolution 3D scan at LUMINA will confirm enamel thickness and bite harmony.'
      };

      try {
        const aiRes = await fetch('/api/consultations/ai-assess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            concerns: selectedConcerns.length > 0 ? selectedConcerns : ['General Aesthetic Check'],
            notes,
            patientName,
            photoUrl: photoPreview,
          }),
        });
        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          if (aiJson.data) aiData = aiJson.data;
        }
      } catch (err) {
        // use fallback
      }

      const cslPayload = {
        patientName,
        email,
        phone,
        photoUrl: photoPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
        concerns: selectedConcerns.length > 0 ? selectedConcerns : ['General Checkup'],
        notes,
        aiAssessment: aiData,
      };

      const cslRes = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cslPayload),
      });

      const cslJson = await cslRes.json();
      if (cslJson.success && cslJson.data) {
        onConsultationSubmitted(cslJson.data);
      }
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage('Network error during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh] sm:max-h-[88vh] bg-white w-full overflow-hidden">
      {/* Sticky Header */}
      <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-[#ebe9e4] bg-white z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#9c5828]">
            {content?.kicker || 'Virtual Assessment'}
          </p>
          <h2 className="text-xl sm:text-2xl font-normal text-[#161616] mt-0.5">
            {content?.title || 'Pre-clinical smile consultation.'}
          </h2>
        </div>
        {onCloseModal && (
          <button
            type="button"
            onClick={onCloseModal}
            className="p-2 rounded-full border border-[#ebe9e4] hover:bg-[#faf9f6] text-[#161616] cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scrollable Body with Clean Visible Scrollbar */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-7 overscroll-contain">
        {errorMessage && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!isSuccess ? (
          <form id="assessment-form" onSubmit={handleSubmit} className="space-y-6 text-sm">
            {/* 1. Concerns */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#161616] mb-3">
                {content?.concernsTitle || '1. What would you like to improve?'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {concernOptions.map((opt) => {
                  const isSelected = selectedConcerns.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleConcern(opt)}
                      className={`p-3 rounded-lg border text-left rtl:text-right text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#161616] bg-[#faf9f6] text-[#161616] font-medium'
                          : 'border-[#ebe9e4] text-[#5a5854] hover:border-[#161616]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Photo */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#161616] mb-3">
                {content?.photoTitle || '2. Smile Photograph (Optional)'}
              </label>
              {photoPreview ? (
                <div className="relative w-48 h-36 rounded-lg overflow-hidden border border-[#ebe9e4]">
                  <img src={photoPreview} alt="Smile preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-2 right-2 bg-black/75 text-white p-1 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="border border-dashed border-[#ebe9e4] hover:border-[#161616] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#faf9f6]">
                  <Camera className="w-5 h-5 text-[#5a5854] mb-2" />
                  <span className="text-xs text-[#161616]">
                    {content?.photoDropHint || 'Upload a clear smiling photo'}
                  </span>
                  <span className="text-[11px] text-[#76736d] mt-0.5">
                    {content?.photoSub || 'JPG or PNG under 10MB'}
                  </span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* 3. Notes */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#161616] mb-2">
                {content?.notesTitle || '3. Specific Notes or Clinical History'}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={content?.notesPlaceholder || 'Tell our doctors about any sensitivity, upcoming dates, or past dental treatments...'}
                className="w-full p-3 border border-[#ebe9e4] rounded-lg text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
              />
            </div>

            {/* 4. Contact Details */}
            <div className="space-y-3 pt-4 border-t border-[#ebe9e4]">
              <label className="block text-xs font-medium uppercase tracking-wider text-[#161616]">
                {content?.contactTitle || '4. Contact Details'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="p-3 border border-[#ebe9e4] rounded-lg text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 border border-[#ebe9e4] rounded-lg text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="p-3 border border-[#ebe9e4] rounded-lg text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                />
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-normal text-[#161616]">
              {content?.submittedTitle || 'Assessment Submitted'}
            </h3>
            <p className="text-xs text-[#5a5854] max-w-sm mx-auto leading-relaxed">
              {content?.submittedDesc || 'Our clinical team will review your photos and respond within one business day.'}
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={onNavigateToBooking}
                className="px-6 py-2.5 rounded-lg bg-[#161616] text-white text-xs font-medium cursor-pointer"
              >
                {content?.bookInPerson || 'Book In-Person Scan'}
              </button>
              {onCloseModal && (
                <button
                  onClick={onCloseModal}
                  className="px-6 py-2.5 rounded-lg border border-[#ebe9e4] text-[#161616] text-xs font-medium cursor-pointer"
                >
                  {content?.close || 'Close'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Submit Button */}
      {!isSuccess && (
        <div className="shrink-0 p-4 sm:p-5 border-t border-[#ebe9e4] bg-white z-10">
          <button
            type="submit"
            form="assessment-form"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-[#161616] hover:bg-[#2c2b29] text-white text-xs font-medium tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
          >
            <span>
              {isSubmitting
                ? content?.submittingBtn || 'Evaluating with Clinical AI...'
                : content?.submitBtn || 'Submit Virtual Assessment'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#c28458] rtl:rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
};
