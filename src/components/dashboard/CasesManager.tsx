import React, { useState, useRef } from 'react';
import { SmileCase } from '../../types';
import { Plus, Trash2, Upload, Sparkles, Check, SplitSquareVertical, AlertCircle } from 'lucide-react';
import { compressImageFile } from '../../lib/imageCompressor';

interface CasesManagerProps {
  cases: SmileCase[];
  onAddCase: (newCase: SmileCase) => Promise<void> | void;
  onDeleteCase: (caseId: string) => Promise<void> | void;
  isRtl?: boolean;
}

export const CasesManager: React.FC<CasesManagerProps> = ({
  cases,
  onAddCase,
  onDeleteCase,
  isRtl = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [treatment, setTreatment] = useState('');
  const [category, setCategory] = useState('VENEERS');
  const [description, setDescription] = useState('');
  const [beforePreview, setBeforePreview] = useState('');
  const [afterPreview, setAfterPreview] = useState('');
  const [beforeUrl, setBeforeUrl] = useState('');
  const [afterUrl, setAfterUrl] = useState('');
  const [isCompressingBefore, setIsCompressingBefore] = useState(false);
  const [isCompressingAfter, setIsCompressingAfter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const beforeFileRef = useRef<HTMLInputElement>(null);
  const afterFileRef = useRef<HTMLInputElement>(null);

  const handleBeforeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressingBefore(true);
      setError('');
      const compressed = await compressImageFile(file, 900, 0.82);
      setBeforePreview(compressed);
      setBeforeUrl('');
    } catch {
      setError(isRtl ? 'فشل معالجة صورة (قبل)، يرجى تجربة ملف آخر' : 'Failed to compress Before image');
    } finally {
      setIsCompressingBefore(false);
    }
  };

  const handleAfterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressingAfter(true);
      setError('');
      const compressed = await compressImageFile(file, 900, 0.82);
      setAfterPreview(compressed);
      setAfterUrl('');
    } catch {
      setError(isRtl ? 'فشل معالجة صورة (بعد)، يرجى تجربة ملف آخر' : 'Failed to compress After image');
    } finally {
      setIsCompressingAfter(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalBefore = beforePreview || beforeUrl.trim();
    const finalAfter = afterPreview || afterUrl.trim();

    if (!treatment.trim() || !finalBefore || !finalAfter) {
      setError(isRtl ? 'يرجى إدخال اسم العلاج وإرفاق كل من صورتي (قبل) و (بعد)' : 'Please provide treatment title and both Before & After images.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newCase: SmileCase = {
        id: 'case_' + Date.now(),
        treatment: treatment.trim(),
        title: treatment.trim(),
        category,
        beforeImg: finalBefore,
        afterImg: finalAfter,
        description: description.trim() || (isRtl ? 'تحول ابتسامة مخصص بأحدث التقنيات الرقمية المتقدمة.' : 'Bespoke smile transformation using advanced clinical dentistry.')
      };

      await onAddCase(newCase);

      // Reset
      setTreatment('');
      setDescription('');
      setBeforePreview('');
      setAfterPreview('');
      setBeforeUrl('');
      setAfterUrl('');
      setModalOpen(false);
    } catch {
      setError(isRtl ? 'حدث خطأ أثناء حفظ الحالة' : 'Error saving smile transformation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">
            {isRtl ? 'إدارة معرض الابتسامات وحالات قبل / بعد' : 'Smile Transformations & Clinical Gallery'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {isRtl
              ? 'ارفع صور الحالات الجديدة قبل وبعد لتظهر فوراً في شريط المقارنة التفاعلي'
              : 'Upload Before & After smile cases to update the interactive comparison slider live'}
          </p>
        </div>
        <button
          onClick={() => { setError(''); setModalOpen(true); }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {isRtl ? 'إضافة حالة قبل / بعد جديدة' : 'Add Smile Transformation'}
        </button>
      </div>

      {/* Cases List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Dual image preview */}
              <div className="grid grid-cols-2 h-48 bg-stone-900 relative">
                <div className="relative h-full overflow-hidden border-r border-white/20">
                  <img
                    src={c.beforeImg}
                    alt="Before"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                    {isRtl ? 'قبل' : 'Before'}
                  </span>
                </div>
                <div className="relative h-full overflow-hidden">
                  <img
                    src={c.afterImg}
                    alt="After"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 right-2 bg-emerald-950/80 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                    {isRtl ? 'بعد' : 'After'}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#b15f2c] uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded">
                    {c.category}
                  </span>
                  <span className="text-[11px] text-stone-400">ID: {c.id}</span>
                </div>
                <h3 className="font-semibold text-sm text-stone-900">{c.treatment || c.title}</h3>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                {isRtl ? 'معروض في الموقع' : 'Active on site'}
              </span>
              <button
                onClick={() => {
                  if (confirm(isRtl ? `هل تريد بالتأكيد حذف هذه الحالة (${c.treatment})؟` : `Are you sure you want to delete ${c.treatment}?`)) {
                    onDeleteCase(c.id);
                  }
                }}
                className="text-stone-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                title="Delete Case"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
                  <SplitSquareVertical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    {isRtl ? 'إضافة تحول ابتسامة (قبل وبعد)' : 'Add New Smile Transformation'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {isRtl ? 'تظهر مباشرة في شريط المقارنة للزوار' : 'Instantly published to the public gallery slider'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isRtl ? 'عنوان أو نوع العلاج' : 'Treatment Title'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'قشور خزفية كاملة وتعديل اللثة بالليزر' : 'Full Porcelain Veneers & Laser Gum Sculpting'}
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isRtl ? 'التصنيف' : 'Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 bg-white"
                >
                  <option value="VENEERS">{isRtl ? 'قشور فينير (Veneers)' : 'Veneers'}</option>
                  <option value="INVISALIGN">{isRtl ? 'تقويم شفاف (Invisalign)' : 'Invisalign'}</option>
                  <option value="IMPLANTS">{isRtl ? 'زراعة الأسنان (Implants)' : 'Dental Implants'}</option>
                  <option value="WHITENING">{isRtl ? 'تبييض الأسنان (Whitening)' : 'Laser Whitening'}</option>
                  <option value="SMILE_DESIGN">{isRtl ? 'تصميم الابتسامة الشامل' : 'Full Smile Design'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isRtl ? 'تفاصيل الإجراء والنتيجة السريرية' : 'Clinical Details & Transformation Summary'}
                </label>
                <textarea
                  rows={2}
                  placeholder={isRtl ? 'تم تركيب 10 عدسات فينير إيماكس عالية الدقة مع استعادة خط الابتسامة...' : 'Engineered bespoke 10-unit ultrathin porcelain veneers correcting crowding and shade...'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 resize-none"
                />
              </div>

              {/* Upload Before & After side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* BEFORE */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-stone-700">
                    {isRtl ? 'صورة الحالة (قبل)' : 'Before Photo'} *
                  </label>
                  {beforePreview ? (
                    <div className="relative h-32 rounded-xl border border-stone-200 overflow-hidden bg-stone-50">
                      <img src={beforePreview} alt="Before" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setBeforePreview('')}
                        className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded cursor-pointer"
                      >
                        {isRtl ? 'تغيير' : 'Change'}
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded">
                        {isRtl ? 'قبل' : 'Before'}
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => beforeFileRef.current?.click()}
                      className="border-2 border-dashed border-stone-300 hover:border-stone-900 rounded-xl p-4 text-center cursor-pointer transition-colors bg-stone-50/50 flex flex-col items-center justify-center gap-1.5 h-32"
                    >
                      <input
                        ref={beforeFileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBeforeUpload}
                        className="hidden"
                      />
                      {isCompressingBefore ? (
                        <Sparkles className="w-4 h-4 animate-spin text-[#b15f2c]" />
                      ) : (
                        <Upload className="w-4 h-4 text-stone-500" />
                      )}
                      <span className="text-[11px] font-medium text-stone-700">
                        {isCompressingBefore ? (isRtl ? 'معالجة...' : 'Compressing...') : (isRtl ? 'اختر صورة (قبل)' : 'Upload Before Image')}
                      </span>
                      <span className="text-[9px] text-stone-400">JPG, PNG, WebP</span>
                    </div>
                  )}
                  {!beforePreview && (
                    <input
                      type="url"
                      placeholder={isRtl ? 'أو رابط صورة قبل...' : 'Or paste Before URL...'}
                      value={beforeUrl}
                      onChange={(e) => setBeforeUrl(e.target.value)}
                      className="w-full px-2.5 py-1 text-[11px] border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  )}
                </div>

                {/* AFTER */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-stone-700">
                    {isRtl ? 'صورة الحالة (بعد)' : 'After Photo'} *
                  </label>
                  {afterPreview ? (
                    <div className="relative h-32 rounded-xl border border-stone-200 overflow-hidden bg-stone-50">
                      <img src={afterPreview} alt="After" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setAfterPreview('')}
                        className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded cursor-pointer"
                      >
                        {isRtl ? 'تغيير' : 'Change'}
                      </button>
                      <div className="absolute bottom-1 left-1 bg-emerald-700 text-white text-[9px] px-1.5 py-0.5 rounded">
                        {isRtl ? 'بعد' : 'After'}
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => afterFileRef.current?.click()}
                      className="border-2 border-dashed border-stone-300 hover:border-stone-900 rounded-xl p-4 text-center cursor-pointer transition-colors bg-stone-50/50 flex flex-col items-center justify-center gap-1.5 h-32"
                    >
                      <input
                        ref={afterFileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAfterUpload}
                        className="hidden"
                      />
                      {isCompressingAfter ? (
                        <Sparkles className="w-4 h-4 animate-spin text-[#b15f2c]" />
                      ) : (
                        <Upload className="w-4 h-4 text-stone-500" />
                      )}
                      <span className="text-[11px] font-medium text-stone-700">
                        {isCompressingAfter ? (isRtl ? 'معالجة...' : 'Compressing...') : (isRtl ? 'اختر صورة (بعد)' : 'Upload After Image')}
                      </span>
                      <span className="text-[9px] text-stone-400">JPG, PNG, WebP</span>
                    </div>
                  )}
                  {!afterPreview && (
                    <input
                      type="url"
                      placeholder={isRtl ? 'أو رابط صورة بعد...' : 'Or paste After URL...'}
                      value={afterUrl}
                      onChange={(e) => setAfterUrl(e.target.value)}
                      className="w-full px-2.5 py-1 text-[11px] border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isCompressingBefore || isCompressingAfter}
                  className="px-5 py-2 text-xs font-medium bg-stone-900 hover:bg-black text-white rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>{isRtl ? 'جاري الحفظ...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <span>{isRtl ? 'حفظ ونشر الحالة' : 'Save & Publish Case'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
