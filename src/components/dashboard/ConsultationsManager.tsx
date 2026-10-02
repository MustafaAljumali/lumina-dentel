import React, { useState } from 'react';
import { Consultation } from '../../types';
import {
  Stethoscope,
  CheckCircle2,
  Phone,
  Mail,
  FileText,
  X,
  MessageSquare,
  Send,
  ExternalLink,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
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
  const [examiningDoctor, setExaminingDoctor] = useState('د. سارة تشن (Dr. Sarah Chen)');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const handleOpenReview = (csl: Consultation) => {
    setSelectedCsl(csl);
    setDoctorNotes(csl.doctorNotes || csl.adminNotes || '');
    setTreatmentPlan(csl.treatmentPlan || '');
    setExaminingDoctor(csl.examiningDoctor || 'د. سارة تشن (Dr. Sarah Chen)');
    setSaveSuccess(false);
    setCopiedNotice(false);
  };

  const handleSaveDoctorReview = async (newStatus: 'REVIEWED' | 'RESPONDED') => {
    if (!selectedCsl) return;

    try {
      setIsSaving(true);
      const updated: Consultation = {
        ...selectedCsl,
        status: newStatus,
        doctorNotes: doctorNotes.trim() || 'تم فحص الحالة وإعداد التقرير الطبي وخطة العلاج.',
        treatmentPlan: treatmentPlan.trim() || '',
        examiningDoctor: examiningDoctor.trim(),
        reviewedAt: new Date().toISOString(),
      };

      // 1. Direct Firestore update
      try {
        await setDoc(doc(db, 'consultations', updated.id), updated, { merge: true });
      } catch (err) {
        console.warn('Firestore consultation update notice:', err);
      }

      // 2. Direct localStorage instant sync
      try {
        const local = localStorage.getItem('lumina_consultations');
        let list: Consultation[] = local ? JSON.parse(local) : [];
        const idx = list.findIndex((c) => c.id === updated.id);
        if (idx !== -1) {
          list[idx] = updated;
        } else {
          list.unshift(updated);
        }
        localStorage.setItem('lumina_consultations', JSON.stringify(list));
      } catch {}

      // 3. Local API sync
      try {
        await fetch(`/api/consultations/${updated.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      } catch {}

      onUpdateConsultation(updated);
      setSelectedCsl(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch {
      alert('Error updating consultation record.');
    } finally {
      setIsSaving(false);
    }
  };

  // Generate Notification Text for WhatsApp / SMS / Email
  const getNotificationText = (csl: Consultation) => {
    const docName = csl.examiningDoctor || examiningDoctor || 'الطبيب الاستشاري';
    if (isRtl) {
      return `مرحباً ${csl.patientName}، تحية طيبة من عيادة لومينا لطب الأسنان (LUMINA Dental Atelier).\n\nنود إعلامك بأنه تم الانتهاء من مراجعة استشارتك السريرية وتحليل صور الابتسامة واعتماد التقرير الطبي وخطة العلاج من قبل: ${docName}.\n\nيمكنك الآن الاطلاع على التقرير الطبي السريري الكامل مباشرة عبر موقعنا الرسمي من خلال النقر على "سجل الفحص الطبي" وإدخال اسمك الكريم (${csl.patientName}) ورقم هاتفك المسجل.\n\nنتمنى لك دوام الصحة والعافية!`;
    }
    return `Hello ${csl.patientName}, greetings from LUMINA Dental Atelier.\n\nYour clinical smile consultation and treatment plan have been officially reviewed and completed by: ${docName}.\n\nYou can now view your full clinical report on our website by clicking "Medical Consultation Tracker" and verifying your name and mobile number.\n\nWe look forward to welcoming you!`;
  };

  const handleSendWhatsApp = (csl: Consultation) => {
    const cleanPhone = csl.phone.replace(/\D/g, '');
    const message = encodeURIComponent(getNotificationText(csl));
    const url = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(url, '_blank');
  };

  const handleSendEmail = (csl: Consultation) => {
    const subject = encodeURIComponent(
      isRtl
        ? `عيادة لومينا لطب الأسنان: صدور تقرير الاستشارة الطبية الخاص بك (${csl.patientName})`
        : `LUMINA Dental Atelier: Your Clinical Consultation Report is Ready (${csl.patientName})`
    );
    const body = encodeURIComponent(getNotificationText(csl));
    window.location.href = `mailto:${csl.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyNotice = (csl: Consultation) => {
    navigator.clipboard.writeText(getNotificationText(csl));
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
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
              ? 'مراجعة صور ابتسامات المرضى، وكتابة تقرير الطبيب وخطة العلاج، وإرسال الإشعارات عبر واتساب والإيميل'
              : 'Review patient smile submissions, enter doctor diagnoses & treatment plans, and notify patients via WhatsApp/Email.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-3 py-1.5 bg-stone-100 text-stone-800 rounded-xl">
            {consultations.length} {isRtl ? 'حالة مسجلة' : 'Total Cases'}
          </span>
          <span className="text-xs font-medium px-3 py-1.5 bg-amber-50 text-amber-800 rounded-xl">
            {consultations.filter((c) => c.status === 'NEW').length} {isRtl ? 'بانتظار الفحص' : 'Pending'}
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
                          : isRtl ? 'معتمد ومنشور للمريض' : 'Published to Patient'}
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
                        {isRtl ? 'شكوى المريض' : 'Concerns'}
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
                  <span>{isRtl ? 'مراجعة الحالة وكتابة تقرير الطبيب' : 'Clinical Review & Diagnosis'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Case Review Modal */}
      {selectedCsl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 pb-3 border-b border-stone-100 flex items-center justify-between shrink-0 bg-[#faf9f6]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-[#d89f78]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    {isRtl ? 'ملف فحص الحالة السريرية للمريض' : 'Clinical Patient Review & Prescription'}
                  </h3>
                  <p className="text-[11px] text-stone-500 font-mono">
                    ID: {selectedCsl.id} • {selectedCsl.patientName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCsl(null)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 overscroll-contain">
              {saveSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {isRtl
                        ? 'تم اعتماد ونشر التقرير بنجاح! أصبح متاحاً الآن للمريض في "سجل الفحص الطبي" على الموقع.'
                        : 'Diagnosis report successfully published to patient portal!'}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    {isRtl
                      ? 'يمكنك الآن إرسال إشعار فوري للمريض عبر الواتساب أو الإيميل بنقرة زر واحدة أدناه:'
                      : 'You can now notify the patient instantly via WhatsApp or Email below:'}
                  </p>
                </div>
              )}

              {/* Photo & Patient Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedCsl.photoUrl ? (
                  <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 h-52">
                    <img
                      src={selectedCsl.photoUrl}
                      alt="Smile clinical view"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-52 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 text-xs">
                    {isRtl ? 'لم يرفق المريض صورة' : 'No photo uploaded'}
                  </div>
                )}

                <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                      {isRtl ? 'اسم المريض' : 'Patient Name'}
                    </span>
                    <span className="font-semibold text-stone-900 text-sm">
                      {selectedCsl.patientName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="text-stone-700 font-mono">{selectedCsl.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="text-stone-900 font-mono font-medium">{selectedCsl.phone}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
                      {isRtl ? 'شكوى المريض المحددة' : 'Reported Concerns'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedCsl.concerns?.map((c, i) => (
                        <span
                          key={i}
                          className="bg-white border border-stone-200 px-2 py-0.5 rounded text-[11px] font-medium text-stone-700"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedCsl.notes && (
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                        {isRtl ? 'ملاحظات المريض' : 'Patient Notes'}
                      </span>
                      <p className="text-stone-700 mt-0.5 bg-white p-2 rounded border border-stone-200 text-[11px]">
                        {selectedCsl.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Form Inputs */}
              <div className="space-y-4 pt-3 border-t border-stone-100">
                {/* Examining Doctor Name */}
                <div>
                  <label className="block text-xs font-semibold text-stone-900 mb-1">
                    {isRtl ? 'اسم الطبيب الاستشاري المعالج' : 'Examining Specialist Doctor Name *'}
                  </label>
                  <input
                    type="text"
                    value={examiningDoctor}
                    onChange={(e) => setExaminingDoctor(e.target.value)}
                    placeholder={isRtl ? 'مثال: د. سارة تشن' : 'e.g. Dr. Sarah Chen, DDS'}
                    className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900"
                  />
                </div>

                {/* Doctor Diagnosis */}
                <div>
                  <label className="block text-xs font-semibold text-stone-900 mb-1">
                    {isRtl ? 'التحليل والتشخيص الطبي السريري للحالة' : 'Clinical Diagnosis & Case Analysis *'}
                  </label>
                  <textarea
                    rows={3}
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    placeholder={
                      isRtl
                        ? 'اكتب تشخيصك الطبي للحالة، وتقييم شكل ولون واصطفاف الأسنان، وإمكانية المعالجة...'
                        : 'Enter your clinical diagnosis and assessment of tooth alignment, color, enamel...'
                    }
                    className="w-full p-3 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 resize-none"
                  />
                </div>

                {/* Doctor Treatment Plan */}
                <div>
                  <label className="block text-xs font-semibold text-stone-900 mb-1">
                    {isRtl ? 'خطة العلاج والإجراءات الموصى بها للمريض' : 'Proposed Treatment Plan & Procedures'}
                  </label>
                  <textarea
                    rows={2}
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    placeholder={
                      isRtl
                        ? 'مثال: نوصي بتركيب 8 عدسات فينير إيماكس، مع جلسة تبييض ليزر زووم للفك السفلي، أو تقويم شفاف إنفزلاين...'
                        : 'e.g. Recommend 8-unit minimal prep veneers, paired with Zoom laser whitening...'
                    }
                    className="w-full p-3 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 resize-none"
                  />
                </div>
              </div>

              {/* PATIENT NOTIFICATION SHORTCUTS (WHATSAPP & EMAIL) */}
              <div className="p-4 rounded-2xl bg-[#faf9f6] border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#b15f2c]" />
                    <span className="text-xs font-semibold text-stone-900">
                      {isRtl ? 'قنوات إشعار المريض الفورية' : 'Instant Patient Notification Channels'}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {selectedCsl.phone}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {/* WhatsApp button */}
                  <button
                    type="button"
                    onClick={() => handleSendWhatsApp(selectedCsl)}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'إرسال عبر واتساب' : 'WhatsApp Notice'}</span>
                  </button>

                  {/* Email button */}
                  <button
                    type="button"
                    onClick={() => handleSendEmail(selectedCsl)}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'إرسال عبر الإيميل' : 'Email Notice'}</span>
                  </button>

                  {/* Copy message button */}
                  <button
                    type="button"
                    onClick={() => handleCopyNotice(selectedCsl)}
                    className="py-2.5 px-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNotice ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ نص الإشعار' : 'Copy Text')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer / Save Buttons */}
            <div className="p-4 sm:p-5 border-t border-stone-100 bg-[#faf9f6] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-stone-500">
                {isRtl ? 'الحالة الحالية:' : 'Status:'}{' '}
                <span className="font-semibold text-stone-900 uppercase">{selectedCsl.status}</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSaveDoctorReview('REVIEWED')}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-medium bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl transition-colors cursor-pointer"
                >
                  {isRtl ? 'حفظ كمسودة فحص' : 'Save Draft'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveDoctorReview('RESPONDED')}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-semibold bg-stone-900 hover:bg-black text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-[#d89f78]" />
                  <span>{isRtl ? 'اعتماد التقرير ونشره في سجل المريض' : 'Approve & Publish to Patient'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
