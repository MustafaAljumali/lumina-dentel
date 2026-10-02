import React, { useState, useRef, useEffect } from 'react';
import { Consultation } from '../../types';
import {
  ShieldCheck,
  Search,
  Lock,
  X,
  Stethoscope,
  Calendar,
  Phone,
  Mail,
  Printer,
  ArrowRight,
  AlertCircle,
  FileCheck2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface PatientReportPortalProps {
  consultations: Consultation[];
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment: (doctorId?: string, serviceId?: string) => void;
  isRtl?: boolean;
}

export const PatientReportPortal: React.FC<PatientReportPortalProps> = ({
  consultations,
  isOpen,
  onClose,
  onBookAppointment,
  isRtl = false,
}) => {
  const [patientNameInput, setPatientNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [unlockedConsultation, setUnlockedConsultation] = useState<Consultation | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !isOpen) return;

    const onWheelNative = (e: WheelEvent) => {
      e.stopPropagation();
    };

    el.addEventListener('wheel', onWheelNative, { passive: true });
    return () => el.removeEventListener('wheel', onWheelNative);
  }, [isOpen, unlockedConsultation]);

  if (!isOpen) return null;

  const normalizePhone = (p: string) => p.replace(/\D/g, '');
  const normalizeText = (t: string) => t.trim().toLowerCase();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);

    const nameQuery = normalizeText(patientNameInput);
    const phoneQuery = normalizePhone(phoneInput);

    if (!nameQuery || !phoneQuery) {
      setSearchError(
        isRtl
          ? 'يرجى إدخال كلٍ من الاسم ورقم الهاتف للتحقق من هويتك الطبية.'
          : 'Please enter both your full name and registered phone number.'
      );
      return;
    }

    if (phoneQuery.length < 6) {
      setSearchError(
        isRtl
          ? 'يرجى إدخال رقم هاتف صالح يتكون من 6 أرقام على الأقل.'
          : 'Please enter a valid phone number with at least 6 digits.'
      );
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      // Gather freshest list from both props and localStorage
      let list = [...consultations];
      try {
        const local = localStorage.getItem('lumina_consultations');
        if (local) {
          const parsed: Consultation[] = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const map = new Map<string, Consultation>();
            list.forEach((c) => map.set(c.id, c));
            parsed.forEach((c) => {
              const existing = map.get(c.id);
              map.set(c.id, existing ? { ...existing, ...c } : c);
            });
            list = Array.from(map.values());
          }
        }
      } catch {}

      // Find matching consultation by BOTH phone AND name
      const match = list.find((c) => {
        const cPhone = normalizePhone(c.phone);
        const cName = normalizeText(c.patientName);

        const phoneMatches = cPhone.includes(phoneQuery) || phoneQuery.includes(cPhone);
        
        // Name check: exact or query includes parts of the name
        const nameParts = nameQuery.split(/\s+/).filter(Boolean);
        const nameMatches =
          cName.includes(nameQuery) ||
          nameQuery.includes(cName) ||
          nameParts.some((part) => part.length >= 2 && cName.includes(part));

        return phoneMatches && nameMatches;
      });

      setIsVerifying(false);

      if (match) {
        setUnlockedConsultation(match);
      } else {
        setSearchError(
          isRtl
            ? 'لم يتم العثور على سجل استشارة متطابق مع الاسم ورقم الهاتف المدخلين. يرجى التأكد من كتابة نفس الاسم ورقم الهاتف المستخدمين أثناء تقديم الاستشارة.'
            : 'No matching medical record was found for this name and phone number. Please verify your details.'
        );
      }
    }, 350);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetSearch = () => {
    setUnlockedConsultation(null);
    setSearchError(null);
  };

  const isCaseReviewed = Boolean(
    unlockedConsultation && (
      unlockedConsultation.status === 'RESPONDED' ||
      unlockedConsultation.status === 'REVIEWED' ||
      (unlockedConsultation.doctorNotes && unlockedConsultation.doctorNotes.trim().length > 0) ||
      (unlockedConsultation.treatmentPlan && unlockedConsultation.treatmentPlan.trim().length > 0) ||
      (unlockedConsultation.adminNotes && unlockedConsultation.adminNotes.trim().length > 0)
    )
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      data-lenis-prevent="true"
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        data-lenis-prevent="true"
        onWheel={(e) => {
          e.stopPropagation();
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop += e.deltaY;
          }
        }}
      >
        {/* Header */}
        <div
          className="p-5 sm:p-6 pb-4 border-b border-stone-100 flex items-center justify-between shrink-0 bg-[#faf9f6]"
          onWheel={(e) => {
            e.stopPropagation();
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop += e.deltaY;
            }
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#d89f78]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9c5828]">
                {isRtl ? 'بوابة المرضى الآمنة' : 'Patient Clinical Portal'}
              </p>
              <h2 className="text-lg sm:text-xl font-normal text-stone-900 mt-0.5">
                {isRtl ? 'سجل الفحص والاستشارة السريرية' : 'Consultation & Smile Review Record'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-5 sm:p-7 overscroll-contain focus:outline-none"
          data-lenis-prevent="true"
          tabIndex={0}
          onWheel={(e) => {
            e.stopPropagation();
          }}
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          {!unlockedConsultation ? (
            /* Secure Access Gate (Name + Phone) */
            <div className="max-w-md mx-auto space-y-6 py-2">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-800 mx-auto flex items-center justify-center mb-1">
                  <Lock className="w-5 h-5 text-[#b15f2c]" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-stone-900">
                  {isRtl ? 'التحقق من هوية المريض' : 'Patient Identity Verification'}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {isRtl
                    ? 'حفاظاً على سرية وخصوصية بياناتك وسجلاتك الطبية، يُرجى إدخال اسمك ورقم هاتفك المسجل لدينا للكشف عن تقرير الطبيب.'
                    : 'To protect medical confidentiality and HIPAA standards, enter your registered name and mobile number to unlock your doctor\'s report.'}
                </p>
              </div>

              {searchError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{searchError}</span>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    {isRtl ? 'الاسم الثلاثي أو الكامل المسجل' : 'Full Registered Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isRtl ? 'مثال: محمد عبدالله أحمد' : 'e.g. Eleanor Vance'}
                    value={patientNameInput}
                    onChange={(e) => setPatientNameInput(e.target.value)}
                    className="w-full px-3.5 py-3 text-xs border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-stone-900 bg-[#faf9f6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    {isRtl ? 'رقم الهاتف المسجل' : 'Registered Mobile Phone *'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={isRtl ? 'مثال: 07701234567 أو 0501234567' : '+1 (555) 000-0000'}
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full px-3.5 py-3 text-xs border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-stone-900 bg-[#faf9f6] font-mono"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    {isRtl
                      ? 'أدخل نفس رقم الهاتف الذي وضعته عند طلب الاستشارة.'
                      : 'Use the same mobile phone you provided when submitting the consultation.'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                >
                  {isVerifying ? (
                    <span>{isRtl ? 'جاري التحقق من السجل الطبي...' : 'Verifying medical credentials...'}</span>
                  ) : (
                    <>
                      <Search className="w-4 h-4 text-[#d89f78]" />
                      <span>{isRtl ? 'عرض سجل الفحص والتقرير الطبي' : 'Unlock & View Clinical Report'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Unlocked Clinical Consultation Report */
            <div className="space-y-6">
              {/* Back to search link */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <button
                  onClick={handleResetSearch}
                  className="text-xs font-medium text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-0 rotate-180" />
                  <span>{isRtl ? 'استعلام عن سجل آخر' : 'Search Another Record'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="text-xs font-medium text-stone-700 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'طباعة التقرير' : 'Print Report'}</span>
                </button>
              </div>

              {/* Formal Report Card */}
              <div className="bg-[#faf9f6] rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-5">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                  <div>
                    <span className="text-[10px] font-mono text-[#b15f2c] uppercase font-bold tracking-wider">
                      LUMINA CLINICAL CONSULTATION REPORT
                    </span>
                    <h3 className="text-lg font-semibold text-stone-900 mt-0.5">
                      {unlockedConsultation.patientName}
                    </h3>
                    <p className="text-xs text-stone-500 font-mono mt-0.5">
                      {isRtl ? 'الرقم المرجعي:' : 'Reference No:'}{' '}
                      <span className="font-semibold text-stone-800">
                        LUM-{unlockedConsultation.id.slice(-6).toUpperCase()}
                      </span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {!isCaseReviewed ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                        <span>{isRtl ? 'قيد دراسة وفحص الطبيب ⏳' : 'Under Doctor Clinical Review ⏳'}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold">
                        <FileCheck2 className="w-4 h-4 text-emerald-600" />
                        <span>{isRtl ? 'معتمد ومفحوص من الطبيب ✔️' : 'Doctor Reviewed & Approved ✔️'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Patient Case Snapshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Photo if exists */}
                  {unlockedConsultation.photoUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 h-48 sm:h-52">
                      <img
                        src={unlockedConsultation.photoUrl}
                        alt="Patient Smile"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        {isRtl ? 'صورة الفحص السريري' : 'Clinical Smile Photo'}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-stone-200 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                        {isRtl ? 'الشكاوى المحددة من المريض' : 'Reported Dental Concerns'}
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {unlockedConsultation.concerns?.map((c, idx) => (
                          <span
                            key={idx}
                            className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded-md text-[11px] font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {unlockedConsultation.notes && (
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                          {isRtl ? 'ملاحظات المريض السابقة' : 'Patient Submitted Notes'}
                        </span>
                        <p className="text-stone-700 mt-0.5 text-xs bg-stone-50 p-2 rounded border border-stone-100">
                          "{unlockedConsultation.notes}"
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                      {isRtl ? 'تاريخ تقديم الطلب:' : 'Submission Date:'}{' '}
                      <span className="text-stone-600 font-mono">
                        {new Date(unlockedConsultation.createdAt).toLocaleDateString(
                          isRtl ? 'ar-EG' : 'en-US',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* DOCTOR CLINICAL REPORT SECTION */}
                {!isCaseReviewed ? (
                  <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-center space-y-2">
                    <Stethoscope className="w-6 h-6 text-amber-700 mx-auto" />
                    <h4 className="text-xs font-semibold text-amber-900">
                      {isRtl
                        ? 'استشارتك قيد الدراسة الشخصية من الطبيب المختص'
                        : 'Your consultation is being personally evaluated by our specialist'}
                    </h4>
                    <p className="text-[11px] text-amber-800/90 max-w-md mx-auto leading-relaxed">
                      {isRtl
                        ? 'يقوم الطبيب بدراسة صور ابتسامتك وشكواك بدقة لإعداد الخطة العلاجية والتكلفة التقديرية. ستصلك رسالة إشعار فور اعتماد التقرير ويمكنك العودة لهذه الصفحة للاطلاع عليه.'
                        : 'Our clinical team is currently analyzing your smile aesthetics and clinical history. Once the evaluating doctor finalizes your diagnosis, your formal report will appear here.'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-5 rounded-xl border-2 border-stone-900 space-y-4 shadow-xs">
                    <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                      <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
                        <Stethoscope className="w-4 h-4 text-[#d89f78]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                          {isRtl ? 'تقرير وتشخيص الطبيب المعالج المعتمد' : 'Treating Doctor\'s Official Diagnosis'}
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          {unlockedConsultation.examiningDoctor
                            ? isRtl
                              ? `الفحص معتمد من: ${unlockedConsultation.examiningDoctor}`
                              : `Evaluated by: ${unlockedConsultation.examiningDoctor}`
                            : isRtl
                            ? 'الفحص معتمد من الطبيب الاستشاري في عيادة لومينا'
                            : 'Evaluated by LUMINA Specialist Dental Board'}
                        </p>
                      </div>
                    </div>

                    {/* Diagnosis text */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                        {isRtl ? 'التشخيص الطبي والتحليل السريري' : 'Clinical Diagnosis & Case Analysis'}
                      </span>
                      <p className="text-xs text-stone-800 leading-relaxed font-normal bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                        {unlockedConsultation.doctorNotes ||
                          unlockedConsultation.adminNotes ||
                          (isRtl
                            ? 'تمت مراجعة الحالة من الطبيب المختص، وأظهرت الصور إمكانية تحقيق نتائج جمالية فائقة الدقة.'
                            : 'Case evaluated by attending clinician. Favorable prognosis for aesthetic rehabilitation.')}
                      </p>
                    </div>

                    {/* Treatment Plan if provided */}
                    {unlockedConsultation.treatmentPlan && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                          {isRtl ? 'خطة العلاج المقترحة' : 'Recommended Treatment Plan'}
                        </span>
                        <p className="text-xs text-stone-800 leading-relaxed font-normal bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200">
                          {unlockedConsultation.treatmentPlan}
                        </p>
                      </div>
                    )}

                    {/* Official stamp signoff */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                      <span>
                        {isRtl ? 'ختم الاعتماد الطبي:' : 'Digital Medical Seal:'}{' '}
                        <span className="font-mono text-stone-800">LUMINA-CLINIC-VERIFIED</span>
                      </span>
                      <span>
                        {unlockedConsultation.reviewedAt
                          ? new Date(unlockedConsultation.reviewedAt).toLocaleDateString(
                              isRtl ? 'ar-EG' : 'en-US'
                            )
                          : new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Call to action: Book clinical visit to execute the plan */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onBookAppointment();
                    }}
                    className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <span>{isRtl ? 'حجز موعد في العيادة لتنفيذ خطة العلاج' : 'Book Clinical Visit to Begin Treatment'}</span>
                    <ArrowRight className="w-4 h-4 text-[#d89f78] rtl:rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
