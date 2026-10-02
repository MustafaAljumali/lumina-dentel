import React, { useState, useEffect } from 'react';
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
  Copy,
  Check,
  Share2,
  Archive,
  RotateCcw,
  Trash2,
  Clock,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

interface ConsultationsManagerProps {
  consultations: Consultation[];
  onUpdateConsultation: (csl: Consultation) => void;
  onDeleteConsultation?: (cslId: string) => Promise<void> | void;
  isRtl?: boolean;
}

export const ConsultationsManager: React.FC<ConsultationsManagerProps> = ({
  consultations,
  onUpdateConsultation,
  onDeleteConsultation,
  isRtl = false,
}) => {
  const [selectedCsl, setSelectedCsl] = useState<Consultation | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [examiningDoctor, setExaminingDoctor] = useState('د. سارة تشن (Dr. Sarah Chen)');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState<'ACTIVE' | 'ARCHIVED'>('ACTIVE');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [archiveNotice, setArchiveNotice] = useState<string | null>(null);

  // Automatic 45-day purge logic
  useEffect(() => {
    const FORTY_FIVE_DAYS_MS = 45 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const expired = consultations.filter((c) => {
      if (c.status === 'ARCHIVED' || c.isArchived) {
        const time = c.archivedAt ? new Date(c.archivedAt).getTime() : new Date(c.createdAt).getTime();
        return !isNaN(time) && now - time > FORTY_FIVE_DAYS_MS;
      }
      return false;
    });

    if (expired.length > 0 && onDeleteConsultation) {
      expired.forEach((exp) => {
        onDeleteConsultation(exp.id);
      });
    }
  }, [consultations, onDeleteConsultation]);

  // Calculate remaining days until 45-day auto-deletion
  const getRemainingDays = (csl: Consultation) => {
    const FORTY_FIVE_DAYS_MS = 45 * 24 * 60 * 60 * 1000;
    const archivedTime = csl.archivedAt ? new Date(csl.archivedAt).getTime() : new Date(csl.createdAt).getTime();
    if (isNaN(archivedTime)) return 45;
    const elapsed = Date.now() - archivedTime;
    const remaining = Math.max(0, Math.ceil((FORTY_FIVE_DAYS_MS - elapsed) / (1000 * 60 * 60 * 24)));
    return remaining;
  };

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

  // Move consultation to Archive
  const handleArchiveConsultation = async (csl: Consultation) => {
    try {
      setIsSaving(true);
      const updated: Consultation = {
        ...csl,
        status: 'ARCHIVED',
        isArchived: true,
        archivedAt: new Date().toISOString(),
      };

      // Save to Firestore
      try {
        await setDoc(doc(db, 'consultations', updated.id), updated, { merge: true });
      } catch (err) {
        console.warn('Firestore archive notice:', err);
      }

      // Save to localStorage
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

      onUpdateConsultation(updated);
      if (selectedCsl?.id === csl.id) {
        setSelectedCsl(null);
      }

      setArchiveNotice(
        isRtl
          ? `تم نقل استشارة (${csl.patientName}) إلى الأرشيف بنجاح. سيتم حذفها تلقائياً بعد 45 يوماً، أو يمكنك حذفها يدوياً الآن.`
          : `Case (${csl.patientName}) moved to archive! It will be automatically deleted after 45 days, or you can delete it manually anytime.`
      );
      setTimeout(() => setArchiveNotice(null), 6000);
    } catch {
      alert('Failed to archive consultation.');
    } finally {
      setIsSaving(false);
    }
  };

  // Restore consultation from Archive
  const handleRestoreConsultation = async (csl: Consultation) => {
    try {
      setIsSaving(true);
      const updated: Consultation = {
        ...csl,
        status: csl.doctorNotes ? 'REVIEWED' : 'NEW',
        isArchived: false,
        archivedAt: undefined,
      };

      try {
        await setDoc(doc(db, 'consultations', updated.id), updated, { merge: true });
      } catch (err) {
        console.warn('Firestore restore notice:', err);
      }

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

      onUpdateConsultation(updated);
      if (selectedCsl?.id === csl.id) {
        setSelectedCsl(updated);
      }

      setArchiveNotice(
        isRtl
          ? `تمت استعادة استشارة (${csl.patientName}) إلى قائمة الحالات النشطة بنجاح!`
          : `Case (${csl.patientName}) restored to active consultations list!`
      );
      setTimeout(() => setArchiveNotice(null), 5000);
    } catch {
      alert('Failed to restore consultation.');
    } finally {
      setIsSaving(false);
    }
  };

  // Permanent Delete Immediately
  const handlePermanentDelete = async (cslId: string) => {
    try {
      if (onDeleteConsultation) {
        await onDeleteConsultation(cslId);
      } else {
        await deleteDoc(doc(db, 'consultations', cslId));
      }
      setConfirmDeleteId(null);
      if (selectedCsl?.id === cslId) {
        setSelectedCsl(null);
      }
      setArchiveNotice(
        isRtl
          ? 'تم حذف السجل بشكل نهائي وفوري من قاعدة البيانات والموقع.'
          : 'Consultation permanently deleted from the database.'
      );
      setTimeout(() => setArchiveNotice(null), 4000);
    } catch (err) {
      console.error('Delete consultation error:', err);
      alert('Failed to delete consultation.');
    }
  };

  // Filter consultations into Active vs Archived
  const activeConsultations = consultations.filter((c) => c.status !== 'ARCHIVED' && !c.isArchived);
  const archivedConsultations = consultations.filter((c) => c.status === 'ARCHIVED' || c.isArchived);

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
      {/* Top Header bar with Stats & Tabs */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#b15f2c]" />
            <span>{isRtl ? 'طلبات الاستشارات والتقييم السريري للأطباء' : 'Clinical Consultations & Case Archive'}</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {isRtl
              ? 'مراجعة صور المرضى، كتابة التشخيص، إرسال خطط العلاج، وإدارة أرشفة الحالات مع الحذف التلقائي بعد 45 يوماً'
              : 'Review patient submissions, author medical plans, notify patients, and manage archived cases with 45-day auto-purge.'}
          </p>
        </div>

        {/* Tab Toggle: Active Cases vs Archive */}
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTabFilter('ACTIVE')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabFilter === 'ACTIVE'
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>{isRtl ? 'الحالات النشطة' : 'Active Cases'}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTabFilter === 'ACTIVE' ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {activeConsultations.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabFilter('ARCHIVED')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTabFilter === 'ARCHIVED'
                ? 'bg-[#161616] text-white shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-[#d89f78]" />
            <span>{isRtl ? 'الأرشيف' : 'Archive'}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTabFilter === 'ARCHIVED' ? 'bg-[#b15f2c] text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {archivedConsultations.length}
            </span>
          </button>
        </div>
      </div>

      {/* Global Archive Notice Banner */}
      {archiveNotice && (
        <div className="p-4 rounded-2xl bg-stone-900 text-white text-xs flex items-center justify-between gap-3 shadow-lg border border-stone-800 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-[#d89f78] shrink-0" />
            <span className="leading-relaxed">{archiveNotice}</span>
          </div>
          <button
            onClick={() => setArchiveNotice(null)}
            className="text-stone-400 hover:text-white p-1 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ACTIVE CASES TAB */}
      {activeTabFilter === 'ACTIVE' && (
        <div>
          {activeConsultations.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 mx-auto flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-stone-900">
                {isRtl ? 'لا توجد حالات استشارة نشطة حالياً' : 'No active clinical consultation requests in queue'}
              </p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {isRtl
                  ? 'عندما يقوم أي مريض بإرسال صورة ابتسامته وتفاصيل حالته من الموقع، ستظهر هنا فوراً ليقوم الطبيب بفحصها.'
                  : 'When patients submit their smile photo and clinical notes, they will appear here instantly for doctor evaluation.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeConsultations.map((csl) => (
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
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-sm text-stone-900">{csl.patientName}</h3>
                          <p className="text-xs text-stone-500 mt-0.5">{csl.email}</p>
                          <p className="text-xs font-mono text-stone-700">{csl.phone}</p>
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {csl.createdAt ? new Date(csl.createdAt).toLocaleDateString() : ''}
                        </span>
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

                  <div className="p-4 pt-0 border-t border-stone-100 mt-2 space-y-2">
                    <button
                      onClick={() => handleOpenReview(csl)}
                      className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-medium transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-3"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-[#d89f78]" />
                      <span>{isRtl ? 'فحص الحالة وكتابة تقرير الطبيب' : 'Clinical Review & Diagnosis'}</span>
                    </button>

                    <button
                      onClick={() => handleArchiveConsultation(csl)}
                      className="w-full py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Archive className="w-3.5 h-3.5 text-stone-500" />
                      <span>{isRtl ? 'نقل إلى الأرشيف' : 'Move to Archive'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ARCHIVED CASES TAB */}
      {activeTabFilter === 'ARCHIVED' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-xs text-amber-900">
                {isRtl ? 'نظام الحذف التلقائي بعد 45 يوماً' : 'Automatic 45-Day Archive Purge'}
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {isRtl
                  ? 'يتم الاحتفاظ بجميع الحالات المنقولة إلى الأرشيف هنا لمدة 45 يوماً فقط، ثم تُحذف تلقائياً ونهائياً من الموقع وقاعدة البيانات لحماية خصوصية المرضى. كما يمكنك حذف أي حالة يدوياً في أي وقت أو استعادتها.'
                  : 'All archived consultations are retained for exactly 45 days, after which they are automatically and permanently deleted from the database. You can also manually delete or restore any case at any time.'}
              </p>
            </div>
          </div>

          {archivedConsultations.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <Archive className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-stone-900">
                {isRtl ? 'الأرشيف فارغ حالياً' : 'Archive is currently empty'}
              </p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {isRtl
                  ? 'عندما تنتهي من مراجعة أي حالة طبية وتضغط على "نقل إلى الأرشيف"، ستنتقل إلى هنا مباشرة.'
                  : 'When you archive any reviewed patient consultation, it will appear here.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {archivedConsultations.map((csl) => {
                const remainingDays = getRemainingDays(csl);
                return (
                  <div
                    key={csl.id}
                    className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Photo or Header */}
                      {csl.photoUrl ? (
                        <div className="relative h-44 bg-stone-900 overflow-hidden opacity-90">
                          <img
                            src={csl.photoUrl}
                            alt="Archived Smile"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-stone-900/90 text-white backdrop-blur-xs flex items-center gap-1">
                              <Archive className="w-3 h-3 text-[#d89f78]" />
                              <span>{isRtl ? 'مؤرشفة' : 'Archived'}</span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-24 bg-stone-100 flex items-center justify-center text-stone-400">
                          <Archive className="w-7 h-7 opacity-40" />
                        </div>
                      )}

                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-sm text-stone-900">{csl.patientName}</h3>
                            <p className="text-xs font-mono text-stone-700">{csl.phone}</p>
                            <p className="text-xs text-stone-500 mt-0.5">{csl.email}</p>
                          </div>

                          {/* Countdown Badge */}
                          <div className="text-right rtl:text-left">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-bold">
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>
                                {isRtl
                                  ? `حذف تلقائي بعد ${remainingDays} يوم`
                                  : `Auto-purge in ${remainingDays}d`}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Doctor Notes Preview */}
                        {csl.doctorNotes && (
                          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                            <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-0.5">
                              {isRtl ? 'تشخيص الطبيب المحفوظ:' : 'Saved Doctor Notes:'}
                            </span>
                            <p className="text-stone-700 line-clamp-2">{csl.doctorNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons in Archive */}
                    <div className="p-4 pt-0 border-t border-stone-100 mt-2 space-y-2">
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {/* Restore button */}
                        <button
                          type="button"
                          onClick={() => handleRestoreConsultation(csl)}
                          className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                          <span>{isRtl ? 'استعادة للحالات' : 'Restore'}</span>
                        </button>

                        {/* Delete Permanently button */}
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(csl.id)}
                          className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>{isRtl ? 'حذف نهائي الآن' : 'Delete Now'}</span>
                        </button>
                      </div>

                      {/* Confirmation dialog if clicked delete */}
                      {confirmDeleteId === csl.id && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs text-rose-900 mt-2">
                          <div className="flex items-center gap-1.5 font-bold">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>{isRtl ? 'هل أنت متأكد من الحذف النهائي الفوري؟' : 'Confirm permanent deletion?'}</span>
                          </div>
                          <p className="text-[11px] text-rose-800">
                            {isRtl
                              ? 'سيتم حذف سجل الفحص وصورة المريض تماماً من قاعدة البيانات ولن يمكن استرجاعها.'
                              : 'This record and patient smile photo will be permanently deleted.'}
                          </p>
                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handlePermanentDelete(csl.id)}
                              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              {isRtl ? 'نعم، احذف فوراً' : 'Yes, Delete'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-3 py-1.5 bg-white border border-stone-200 text-stone-700 rounded-lg text-xs cursor-pointer"
                            >
                              {isRtl ? 'إلغاء' : 'Cancel'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Doctor Case Review Modal */}
      {selectedCsl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto" data-lenis-prevent="true">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden" data-lenis-prevent="true">
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
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 overscroll-contain" data-lenis-prevent="true">
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
                    {isRtl ? 'التحليل والتشخيص الطبي السريري للحالة (كلمة الطبيب)' : 'Clinical Diagnosis & Case Analysis *'}
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

            {/* Modal Footer / Save & Archive Buttons */}
            <div className="p-4 sm:p-5 border-t border-stone-100 bg-[#faf9f6] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Archive Button in Review Modal */}
                {selectedCsl.status === 'ARCHIVED' || selectedCsl.isArchived ? (
                  <button
                    type="button"
                    onClick={() => handleRestoreConsultation(selectedCsl)}
                    disabled={isSaving}
                    className="px-3.5 py-2.5 text-xs font-semibold bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                    <span>{isRtl ? 'استعادة للحالات النشطة' : 'Restore from Archive'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleArchiveConsultation(selectedCsl)}
                    disabled={isSaving}
                    className="px-3.5 py-2.5 text-xs font-semibold bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    title={isRtl ? 'نقل الحالة إلى الأرشيف والحذف التلقائي بعد 45 يوماً' : 'Archive and auto-delete in 45 days'}
                  >
                    <Archive className="w-3.5 h-3.5 text-stone-600" />
                    <span>{isRtl ? 'نقل إلى الأرشيف' : 'Move to Archive'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
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
                  <span>{isRtl ? 'اعتماد التقرير ونشره للمريض' : 'Approve & Publish to Patient'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
