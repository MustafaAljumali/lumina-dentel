import React, { useState, useRef } from 'react';
import { Doctor } from '../../types';
import { Plus, Trash2, Upload, User, Sparkles, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { compressImageFile } from '../../lib/imageCompressor';

interface DoctorsManagerProps {
  doctors: Doctor[];
  onAddDoctor: (doctor: Doctor) => Promise<void> | void;
  onDeleteDoctor: (doctorId: string) => Promise<void> | void;
  isRtl?: boolean;
}

export const DoctorsManager: React.FC<DoctorsManagerProps> = ({
  doctors,
  onAddDoctor,
  onDeleteDoctor,
  isRtl = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [nextAvailable, setNextAvailable] = useState('Tomorrow');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setError('');
      const compressedDataUrl = await compressImageFile(file, 800, 0.85);
      setPhotoPreview(compressedDataUrl);
      setPhotoUrlInput('');
    } catch {
      setError(isRtl ? 'فشل معالجة الصورة، يرجى تجربة صورة أخرى' : 'Failed to process image, please try another file.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPhoto = photoPreview || photoUrlInput.trim();
    if (!name.trim() || !specialty.trim() || !finalPhoto) {
      setError(isRtl ? 'يرجى ملء الاسم والتخصص وإضافة صورة الطبيب' : 'Please provide name, specialty, and a photo.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newDoctor: Doctor = {
        id: 'doc_' + Date.now(),
        name: name.trim(),
        title: 'DDS, Clinical Specialist',
        specialty: specialty.trim(),
        bio: bio.trim() || (isRtl ? 'أخصائي معتمد في طب وتجميل الأسنان المتقدم.' : 'Certified specialist in modern aesthetic and clinical dentistry.'),
        education: [
          { degree: 'Doctor of Dental Surgery (DDS)', institution: 'Faculty of Dentistry', year: '2016' }
        ],
        photo: finalPhoto,
        isActive: true,
        nextAvailable: nextAvailable.trim() || 'Tomorrow'
      };

      await onAddDoctor(newDoctor);
      // Reset form
      setName('');
      setSpecialty('');
      setBio('');
      setPhotoPreview('');
      setPhotoUrlInput('');
      setModalOpen(false);
    } catch {
      setError(isRtl ? 'حدث خطأ أثناء حفظ الطبيب في قاعدة البيانات' : 'An error occurred while saving the doctor.');
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
            {isRtl ? 'إدارة الكادر الطبي والأطباء' : 'Doctors & Specialists Directory'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {isRtl
              ? 'أضف أطباء جدد وارفع صورهم لتظهر فوراً في الواجهة الرئيسية للموقع'
              : 'Add doctors, upload portraits, and manage their availability on the live website'}
          </p>
        </div>
        <button
          onClick={() => { setError(''); setModalOpen(true); }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {isRtl ? 'إضافة طبيب جديد' : 'Add New Doctor'}
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="relative h-64 bg-stone-100 overflow-hidden">
                <img
                  src={doc.photo}
                  alt={doc.name}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-semibold text-emerald-800 border border-stone-200/60 shadow-xs">
                  {doc.nextAvailable}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-sm text-stone-900">{doc.name}</h3>
                <p className="text-xs font-medium text-[#b15f2c]">{doc.specialty}</p>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {doc.bio}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between text-xs mt-3">
              <span className="text-[11px] text-stone-400">ID: {doc.id}</span>
              <button
                onClick={() => {
                  if (confirm(isRtl ? `هل أنت متأكد من حذف الطبيب ${doc.name}؟` : `Are you sure you want to delete ${doc.name}?`)) {
                    onDeleteDoctor(doc.id);
                  }
                }}
                className="text-stone-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                title="Delete Doctor"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    {isRtl ? 'إضافة طبيب جديد للعيادة' : 'Add New Clinical Specialist'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {isRtl ? 'سيظهر الطبيب فوراً في الموقع للمرضى' : 'Instant live update on public site'}
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
                  {isRtl ? 'اسم الطبيب الكامل' : 'Doctor Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'د. سارة المنصور' : 'Dr. Sarah Al-Mansour, DDS'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isRtl ? 'التخصص الطبي' : 'Clinical Specialty'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'أخصائي تجميل الأسنان والابتسامة الرقمية' : 'Cosmetic & Digital Smile Design Specialist'}
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isRtl ? 'نبذة عن الطبيب والخبرة' : 'Professional Biography'}
                </label>
                <textarea
                  rows={2}
                  placeholder={isRtl ? 'خبرة أكثر من 12 عاماً في القشور الخزفية وتجميل الأسنان...' : 'Over 12 years of clinical excellence in cosmetic restorations...'}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isRtl ? 'أقرب موعد متاح' : 'Next Available Slot'}
                </label>
                <input
                  type="text"
                  placeholder={isRtl ? 'اليوم، 4:00 مساءً' : 'Tomorrow, 10:00 AM'}
                  value={nextAvailable}
                  onChange={(e) => setNextAvailable(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  {isRtl ? 'صورة الطبيب (رفع مباشر من جهازك أو رابط)' : 'Doctor Portrait (Device Upload or URL)'} *
                </label>

                {photoPreview ? (
                  <div className="relative w-full h-44 rounded-xl border border-stone-200 overflow-hidden bg-stone-50 group">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover object-top"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview('')}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      {isRtl ? 'تغيير الصورة' : 'Change'}
                    </button>
                    <div className="absolute bottom-2 left-2 bg-emerald-600/90 text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                      <Check className="w-3 h-3" /> {isRtl ? 'تم تجهيز الصورة' : 'Ready'}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-stone-300 hover:border-stone-900 rounded-xl p-6 text-center cursor-pointer transition-colors bg-stone-50/50 hover:bg-stone-50 flex flex-col items-center justify-center gap-2"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-600">
                        {isCompressing ? (
                          <Sparkles className="w-5 h-5 animate-spin text-[#b15f2c]" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-stone-800">
                          {isCompressing
                            ? (isRtl ? 'جاري ضغط ومعالجة الصورة...' : 'Processing image...')
                            : (isRtl ? 'اضغط لاختيار صورة من جهازك / هاتفك' : 'Click to upload portrait from device')}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">JPG, PNG, WebP</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-400 uppercase font-medium">{isRtl ? 'أو عبر رابط' : 'Or via URL'}:</span>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={photoUrlInput}
                        onChange={(e) => setPhotoUrlInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>
                )}
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
                  disabled={isSubmitting || isCompressing}
                  className="px-5 py-2 text-xs font-medium bg-stone-900 hover:bg-black text-white rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>{isRtl ? 'جاري الحفظ...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <span>{isRtl ? 'حفظ ونشر الطبيب' : 'Save & Publish Doctor'}</span>
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
