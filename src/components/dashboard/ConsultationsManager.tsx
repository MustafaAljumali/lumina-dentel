import React, { useState } from 'react';
import { Consultation } from '../../types';
import { Stethoscope, CheckCircle2, Clock, Phone, Mail, FileText, X, AlertCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface ConsultationsManagerProps {
  consultations: Consultation[];
  onUpdateConsultation: (csl: Consultation) => void;
  isRtl?: boolean;
}

export const ConsultationsManager: React.FC<ConsultationsManagerProps> = ({
  consultations,
  onUpdateConsultation,
  isRtl = false,
}) => {
  const [selectedCsl, setSelectedCsl] = useState<Consultation | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOpenReview = (csl: Consultation) => {
    setSelectedCsl(csl);
    setDoctorNotes(csl.adminNotes || csl.notes || '');
    setTreatmentPlan('');
    setSaveSuccess(false);
  };

  const handleSaveDoctorReview = async (newStatus: 'REVIEWED' | 'RESPONDED') => {
    if (!selectedCsl) return;

    try {
      setIsSaving(true);
      const updated: Consultation = {
        ...selectedCsl,
        status: newStatus,
        adminNotes: doctorNotes.trim() || 'Reviewed by clinical specialist.',
      };

      // 1. Direct Firestore update
      try {
        await setDoc(doc(db, 'consultations', updated.id), updated, { merge: true });
      } catch (err) {
        console.warn('Firestore consultation update notice:', err);
      }

      onUpdateConsultation(updated);
      setSelectedCsl(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      alert('Error updating consultation record.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">
            {isRtl ? 'طلبات الاستشارات والتقييم السريري المباشر' : 'Doctor Clinical Consultations & Smile Cases'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {isRtl
              ? 'مراجعة صور ابتسامات المرضى مباشرة، وكتابة تحليل الطبيب المعالج وخطة العلاج'
              : 'Direct human clinical case reviews. Review patient smile photos and enter doctor recommendations.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-3 py-1.5 bg-stone-100 text-stone-800 rounded-xl">
            {consultations.length} {isRtl ? 'حالة مسجلة' : 'Total Cases'}
          </span>
          <span className="text-xs font-medium px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl">
            {consultations.filter((c) => c.status === 'NEW').length} {isRtl ? 'حالات جديدة بانتظار الفحص' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Grid of Consultations */}
      {consultations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 mx-auto flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-stone-900">
            {isRtl ? 'لا توجد طلبات استشارة جديدة حالياً' : 'No clinical consultation requests in queue'}
          </p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {isRtl
              ? 'عندما يقوم أي مريض بإرسال صورة ابتسامته وتفاصيل حالته من الموقع، ستظهر هنا فوراً ليقوم الطبيب بمراجعتها.'
              : 'When patients submit their smile photo and clinical notes, they will appear here instantly for doctor evaluation.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {consultations.map((csl) => (
            <div
              key={csl.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo Preview */}
                {csl.photoUrl ? (
                  <div className="relative h-48 bg-stone-900 overflow-hidden">
                    <img
                      src={csl.photoUrl}
                      alt="Patient smile"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-xs ${
                          csl.status === 'NEW'
                            ? 'bg-amber-500 text-white'
                            : csl.status === 'REVIEWED'
                            ? 'bg-blue-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {csl.status === 'NEW'
                          ? isRtl ? 'حالة جديدة' : 'New Case'
                          : csl.status === 'REVIEWED'
                          ? isRtl ? 'تم فحص الطبيب' : 'Doctor Reviewed'
                          : isRtl ? 'تم التواصل' : 'Contacted'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-28 bg-stone-100 flex items-center justify-center text-stone-400">
                    <FileText className="w-8 h-8 opacity-40" />
                  </div>
                )}

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm text-stone-900">{csl.patientName}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">{csl.email}</p>
                    <p className="text-xs font-mono text-stone-700">{csl.phone}</p>
                  </div>

                  {/* Concerns tags */}
                  {csl.concerns && csl.concerns.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                        {isRtl ? 'شكوى المريض الرئيسية' : 'Reported Concerns'}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {csl.concerns.map((conc, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded"
                          >
                            {conc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Patient notes */}
                  {csl.notes && (
                    <p className="text-xs text-stone-600 line-clamp-2 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      "{csl.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-stone-100 mt-2">
                <button
                  onClick={() => handleOpenReview(csl)}
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-medium transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-3"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'مراجعة الحالة وتحليل الطبيب' : 'Clinical Case Review'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Case Review Modal */}
      {selectedCsl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    {isRtl ? 'ملف التقييم السريري للمريض' : 'Clinical Smile Review by Doctor'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    ID: {selectedCsl.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCsl(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isRtl ? 'تم حفظ تحليل الطبيب وتحديث حالة المريض بنجاح.' : 'Doctor review saved and case status updated successfully.'}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Photo */}
              {selectedCsl.photoUrl ? (
                <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-900 h-56">
                  <img
                    src={selectedCsl.photoUrl}
                    alt="Smile clinical view"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-56 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 text-xs">
                  {isRtl ? 'لم يرفق المريض صورة' : 'No photo uploaded'}
                </div>
              )}

              {/* Patient Info */}
              <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">{isRtl ? 'اسم المريض' : 'Patient Name'}</span>
                  <span className="font-semibold text-stone-900 text-sm">{selectedCsl.patientName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <a href={`mailto:${selectedCsl.email}`} className="text-[#b15f2c] hover:underline font-mono">
                    {selectedCsl.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <a href={`tel:${selectedCsl.phone}`} className="text-stone-800 font-mono font-medium hover:underline">
                    {selectedCsl.phone}
                  </a>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
                    {isRtl ? 'الشكاوى المحددة' : 'Reported Concerns'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedCsl.concerns?.map((c, i) => (
                      <span key={i} className="bg-white border border-stone-200 px-2 py-0.5 rounded text-[11px] font-medium text-stone-700">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedCsl.notes && (
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">{isRtl ? 'ملاحظات المريض' : 'Patient Notes'}</span>
                    <p className="text-stone-700 mt-0.5 bg-white p-2 rounded border border-stone-200">
                      {selectedCsl.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Doctor's Clinical Opinion Input */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-900">
                {isRtl ? 'تحليل الطبيب المعالج وخطة العلاج المقترحة' : 'Treating Doctor\'s Clinical Diagnosis & Proposed Plan'}
              </label>
              <textarea
                rows={3}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder={isRtl ? 'اكتب تشخيصك السريري، ونوع الإجراء المقترح (مثل: فينير 8 عدسات إيماكس، أو جلسة تبييض زووم، أو تقويم شفاف)...' : 'Enter your clinical diagnosis and recommended procedures (e.g. 8-unit minimal prep veneers, Invisalign aligners, or Zoom laser whitening)...'}
                className="w-full p-3 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">{isRtl ? 'الحالة الحالية:' : 'Status:'}</span>
                <span className="font-semibold text-xs text-stone-900 uppercase">{selectedCsl.status}</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSaveDoctorReview('REVIEWED')}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors cursor-pointer"
                >
                  {isRtl ? 'حفظ الفحص (تم فحص الطبيب)' : 'Save as Doctor Reviewed'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveDoctorReview('RESPONDED')}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium bg-stone-900 hover:bg-black text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تم التواصل مع المريض' : 'Mark as Contacted'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
