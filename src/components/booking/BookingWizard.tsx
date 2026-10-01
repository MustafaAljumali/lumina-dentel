import React, { useState, useEffect } from 'react';
import { Doctor, Service, PatientType, Appointment } from '../../types';
import { Check, X } from 'lucide-react';
import { Translations } from '../../data/translations';

interface BookingWizardProps {
  doctors: Doctor[];
  services: Service[];
  preselectedDoctorId?: string;
  preselectedServiceId?: string;
  onBookingComplete: (newApt: Appointment) => void;
  onNavigateHome: () => void;
  content?: Translations['bookingModal'];
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  doctors,
  services,
  preselectedDoctorId,
  preselectedServiceId,
  onBookingComplete,
  onNavigateHome,
  content,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [patientType, setPatientType] = useState<PatientType>('NEW');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedServiceId || services[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(preselectedDoctorId || doctors[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-18');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:30 AM');

  const [patientForm, setPatientForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '1995-06-15',
    insuranceProvider: 'Delta Dental Premier',
    dentalHistory: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (preselectedDoctorId) setSelectedDoctorId(preselectedDoctorId);
    if (preselectedServiceId) setSelectedServiceId(preselectedServiceId);
  }, [preselectedDoctorId, preselectedServiceId]);

  const availableSlots = ['09:00 AM', '10:30 AM', '11:15 AM', '01:30 PM', '02:45 PM', '04:00 PM'];

  const selectedServiceObj = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedDoctorObj = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const handleNext = () => {
    setErrorMessage(null);
    if (currentStep === 4) {
      if (!patientForm.firstName.trim() || !patientForm.lastName.trim() || !patientForm.email.trim() || !patientForm.phone.trim()) {
        setErrorMessage(content?.phone ? 'Please complete required fields.' : 'Please fill in your name, email, and mobile phone.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        patient: {
          firstName: patientForm.firstName,
          lastName: patientForm.lastName,
          email: patientForm.email,
          phone: patientForm.phone,
          dob: patientForm.dob,
          insuranceProvider: patientForm.insuranceProvider,
          type: patientType,
        },
        doctorId: selectedDoctorId,
        serviceId: selectedServiceId,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        notes: patientForm.dentalHistory,
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        onBookingComplete(json.data);
        setIsSuccess(true);
      } else {
        setErrorMessage('Unable to finalize appointment. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Network error during confirmation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: content?.steps.procedure || 'Procedure' },
    { num: 2, label: content?.steps.doctor || 'Doctor' },
    { num: 3, label: content?.steps.schedule || 'Schedule' },
    { num: 4, label: content?.steps.patient || 'Patient' },
    { num: 5, label: content?.steps.review || 'Review' },
  ];

  return (
    <div className="flex flex-col h-full max-h-[85vh] sm:max-h-[88vh] bg-white w-full overflow-hidden">
      {/* Sticky Header */}
      <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-[#ebe9e4] bg-white z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9c5828]">
              {content?.kicker || 'Reservation'}
            </p>
            <h2 className="text-xl sm:text-2xl font-normal text-[#161616] mt-0.5">
              {content?.title || 'Schedule your clinical visit.'}
            </h2>
          </div>
          <button
            onClick={onNavigateHome}
            className="p-2 rounded-full border border-[#ebe9e4] hover:bg-[#faf9f6] text-[#161616] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subtle Step Bar */}
        <div className="flex items-center justify-between pt-1">
          {steps.map((st) => (
            <div key={st.num} className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono transition-colors ${
                  currentStep >= st.num ? 'bg-[#161616] text-white' : 'bg-[#ebe9e4] text-[#76736d]'
                }`}
              >
                {st.num}
              </span>
              <span
                className={`text-xs hidden sm:inline ${
                  currentStep === st.num ? 'text-[#161616] font-medium' : 'text-[#76736d]'
                }`}
              >
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Body with Clean Visible Scrollbar */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-7 overscroll-contain">
        {errorMessage && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        {!isSuccess ? (
          <div className="space-y-6">
            {/* STEP 1: PROCEDURE */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#5a5854] mb-2">
                  <span>{content?.selectProcedureHint || 'Select required clinical procedure'}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPatientType('NEW')}
                      className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-colors ${
                        patientType === 'NEW' ? 'bg-[#161616] text-white' : 'bg-[#faf9f6] text-[#5a5854] hover:bg-[#ebe9e4]'
                      }`}
                    >
                      {content?.newPatient || 'New Patient'}
                    </button>
                    <button
                      onClick={() => setPatientType('RETURNING')}
                      className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-colors ${
                        patientType === 'RETURNING' ? 'bg-[#161616] text-white' : 'bg-[#faf9f6] text-[#5a5854] hover:bg-[#ebe9e4]'
                      }`}
                    >
                      {content?.returningPatient || 'Returning'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {services.map((srv) => (
                    <button
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`w-full p-4 rounded-lg border text-left rtl:text-right transition-colors cursor-pointer flex items-center justify-between ${
                        selectedServiceId === srv.id
                          ? 'border-[#161616] bg-[#faf9f6]'
                          : 'border-[#ebe9e4] hover:border-[#161616]'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium text-[#161616]">{srv.name}</div>
                        <div className="text-xs text-[#5a5854] mt-0.5">{srv.description}</div>
                      </div>
                      <div className="text-right rtl:text-left pl-4 rtl:pr-4 rtl:pl-0 shrink-0">
                        <div className="text-sm font-medium text-[#161616]">${srv.basePrice}</div>
                        <div className="text-[11px] text-[#76736d]">{srv.duration}m</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: DOCTOR */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <span className="text-xs text-[#5a5854] block mb-2">
                  {content?.selectDoctorHint || 'Select your treating specialist'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctors.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`p-4 rounded-lg border text-left rtl:text-right transition-colors cursor-pointer flex gap-3 items-center ${
                        selectedDoctorId === doc.id
                          ? 'border-[#161616] bg-[#faf9f6]'
                          : 'border-[#ebe9e4] hover:border-[#161616]'
                      }`}
                    >
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#ebe9e4]"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-sm font-medium text-[#161616]">{doc.name}</div>
                        <div className="text-xs text-[#9c5828]">{doc.specialty}</div>
                        <div className="text-[11px] text-[#76736d] mt-1">{doc.nextAvailable}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: SCHEDULE */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#161616] mb-2">
                    {content?.selectDate || 'Select Date'}
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min="2026-08-13"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 border border-[#ebe9e4] rounded-lg text-sm text-[#161616] focus:outline-none focus:border-[#161616]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#161616] mb-2">
                    {content?.availableSlots || 'Available Consultation Slots'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`p-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                          selectedTimeSlot === slot
                            ? 'border-[#161616] bg-[#161616] text-white'
                            : 'border-[#ebe9e4] hover:border-[#161616] text-[#161616]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PATIENT DETAILS */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder={content?.firstName || 'First Name *'}
                    value={patientForm.firstName}
                    onChange={(e) => setPatientForm({ ...patientForm, firstName: e.target.value })}
                    className="p-3 border border-[#ebe9e4] rounded-lg text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                  />
                  <input
                    type="text"
                    required
                    placeholder={content?.lastName || 'Last Name *'}
                    value={patientForm.lastName}
                    onChange={(e) => setPatientForm({ ...patientForm, lastName: e.target.value })}
                    className="p-3 border border-[#ebe9e4] rounded-lg text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                  />
                  <input
                    type="email"
                    required
                    placeholder={content?.email || 'Email Address *'}
                    value={patientForm.email}
                    onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                    className="p-3 border border-[#ebe9e4] rounded-lg text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder={content?.phone || 'Mobile Phone *'}
                    value={patientForm.phone}
                    onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                    className="p-3 border border-[#ebe9e4] rounded-lg text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                  />
                </div>

                <select
                  value={patientForm.insuranceProvider}
                  onChange={(e) => setPatientForm({ ...patientForm, insuranceProvider: e.target.value })}
                  className="w-full p-3 border border-[#ebe9e4] rounded-lg text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                >
                  <option value="Delta Dental Premier">Delta Dental Premier</option>
                  <option value="Cigna Dental PPO">Cigna Dental PPO</option>
                  <option value="Aetna Dental Options">Aetna Dental Options</option>
                  <option value="MetLife PDP">MetLife PDP</option>
                  <option value="Direct Pay">Direct Pay / Self-Pay</option>
                </select>

                <textarea
                  rows={2}
                  placeholder={content?.notesPlaceholder || 'Comfort notes or special medical considerations (optional)...'}
                  value={patientForm.dentalHistory}
                  onChange={(e) => setPatientForm({ ...patientForm, dentalHistory: e.target.value })}
                  className="w-full p-3 border border-[#ebe9e4] rounded-lg text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                />
              </div>
            )}

            {/* STEP 5: REVIEW */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="p-5 rounded-lg bg-[#faf9f6] border border-[#ebe9e4] space-y-3 text-xs">
                  <div className="flex justify-between pb-3 border-b border-[#ebe9e4]">
                    <span className="text-[#5a5854]">{content?.steps.procedure || 'Procedure'}</span>
                    <span className="font-medium text-[#161616]">{selectedServiceObj.name} (${selectedServiceObj.basePrice})</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-[#ebe9e4]">
                    <span className="text-[#5a5854]">{content?.steps.doctor || 'Treating Doctor'}</span>
                    <span className="font-medium text-[#161616]">{selectedDoctorObj.name}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-[#ebe9e4]">
                    <span className="text-[#5a5854]">{content?.steps.schedule || 'Appointment Time'}</span>
                    <span className="font-medium text-[#161616]">{selectedDate} at {selectedTimeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5a5854]">{content?.steps.patient || 'Patient'}</span>
                    <span className="font-medium text-[#161616]">{patientForm.firstName} {patientForm.lastName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-normal text-[#161616]">
              {content?.confirmedTitle || 'Visit Confirmed'}
            </h3>
            <p className="text-xs text-[#5a5854] max-w-sm mx-auto leading-relaxed">
              {content?.confirmedDesc || `Your appointment with ${selectedDoctorObj.name} is confirmed for ${selectedDate} at ${selectedTimeSlot}.`}
            </p>
            <div className="pt-4">
              <button
                onClick={onNavigateHome}
                className="px-6 py-2.5 rounded-lg bg-[#161616] text-white text-xs font-medium cursor-pointer"
              >
                {content?.returnHome || 'Return to Clinic Home'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions Bar (Always visible without zooming or shrinking) */}
      {!isSuccess && (
        <div className="shrink-0 p-4 sm:p-5 border-t border-[#ebe9e4] bg-white flex items-center justify-between z-10">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-xs font-medium text-[#5a5854] hover:text-[#161616] cursor-pointer transition-colors"
            >
              {content?.back || 'Back'}
            </button>
          ) : <div />}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg bg-[#161616] hover:bg-[#2c2b29] text-white text-xs font-medium cursor-pointer transition-colors"
            >
              {content?.continue || 'Continue'}
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 rounded-lg bg-[#9c5828] hover:bg-[#854b22] text-white text-xs font-medium cursor-pointer transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '...' : (content?.confirm || 'Confirm Appointment')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
