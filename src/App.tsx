import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import { Doctor, Service, Appointment, Consultation, Patient, SmileCase, ClinicStats } from './types';
import { INITIAL_DOCTORS, INITIAL_SERVICES, INITIAL_APPOINTMENTS, INITIAL_CONSULTATIONS, INITIAL_PATIENTS } from './data/initialData';
import {
  Language,
  TRANSLATIONS,
  ARABIC_SERVICES_MAP,
  ARABIC_DOCTORS_MAP,
  ARABIC_CASES_MAP,
} from './data/translations';
import { BookingWizard } from './components/booking/BookingWizard';
import { VirtualAssessment } from './components/consultation/VirtualAssessment';
import { CostEstimator } from './components/services/CostEstimator';
import { PatientTestimonials } from './components/home/PatientTestimonials';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { PatientReportPortal } from './components/consultation/PatientReportPortal';
import { db } from './lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  X,
  Menu,
  Check,
  Globe,
  Lock,
  FileCheck2,
} from 'lucide-react';

// High-performance responsive hero smile image (fast loading on mobile and desktop)
const HERO_SMILE_IMAGE = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=82&w=1920';
const HERO_SMILE_SRCSET = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=720 720w, https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1280 1280w, https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=82&w=1920 1920w';

const INITIAL_BASE_SMILE_CASES: SmileCase[] = [
  {
    id: 'case-1',
    title: 'Handcrafted Porcelain Veneers',
    treatment: 'Handcrafted Porcelain Veneers',
    category: 'Cosmetic',
    doctor: 'Dr. Sarah Chen',
    duration: '2 visits (8 days)',
    technique: '0.3mm minimal-prep feldspathic ceramics',
    beforeImg: '/images/veneers_before.jpg',
    afterImg: '/images/veneers_after.jpg',
    description: 'Placed 8 ultra-thin veneers to correct fluorosis staining, minor edge chipping, and subtle arch asymmetry with lifelike light transmission.'
  },
  {
    id: 'case-2',
    title: 'Invisalign® Clear Aligner Therapy',
    treatment: 'Invisalign® Clear Aligner Therapy',
    category: 'Orthodontics',
    doctor: 'Dr. Marcus Vance',
    duration: '6 months',
    technique: 'Accelerated clear aligners',
    beforeImg: '/images/invisalign_before.jpg',
    afterImg: '/images/invisalign_after.jpg',
    description: 'Corrected deep overbite and anterior crowding without metal brackets or tooth extractions using weekly custom transparent aligners.'
  },
  {
    id: 'case-3',
    title: 'Laser Teeth Whitening (Zoom Ultimate)',
    treatment: 'Laser Teeth Whitening (Zoom Ultimate)',
    category: 'Whitening',
    doctor: 'Dr. Sarah Chen',
    duration: '45 minutes',
    technique: 'In-office photoactivation laser whitening',
    beforeImg: '/images/whitening_before.jpg',
    afterImg: '/images/whitening_after.jpg',
    description: 'Lifted stubborn coffee and tea stains by 8 full VITA shades in a single comfortable laser session with customized enamel desensitizer.'
  },
  {
    id: 'case-4',
    title: '3D Guided All-on-4 Implant Rehabilitation',
    treatment: '3D Guided All-on-4 Implant Rehabilitation',
    category: 'Restorative',
    doctor: 'Dr. Elena Rostova',
    duration: 'Same-day teeth',
    technique: 'Titanium implants with monolithic zirconia bridge',
    beforeImg: '/images/implants_before.jpg',
    afterImg: '/images/implants_after.jpg',
    description: 'Total arch replacement using 4 precision-guided titanium implants and fixed monolithic zirconia bridge for permanent function and youthful smile line.'
  }
];

const DEFAULT_CLINIC_STATS: ClinicStats = {
  todayAppointments: 4,
  pendingConfirmations: 2,
  newPatientsThisMonth: 18,
  consultationRequests: 5,
  trend: {
    appointments: '+14% this month',
    patients: '+22% new smiles',
  }
};

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);

  // Language state: 'ar' or 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('lumina_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'ar';
  });

  const t = TRANSLATIONS[language];

  // Update HTML dir and lang
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('lumina_lang', language);
  }, [language]);

  // Modals & Navigation Drawer
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [staffPortalOpen, setStaffPortalOpen] = useState(false);
  const [patientPortalOpen, setPatientPortalOpen] = useState(false);

  // Dynamic Data (synced with Firebase Firestore)
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [smileCases, setSmileCases] = useState<SmileCase[]>(INITIAL_BASE_SMILE_CASES);
  const [services] = useState<Service[]>(INITIAL_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_consultations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CONSULTATIONS;
  });
  const [patients] = useState<Patient[]>(INITIAL_PATIENTS);

  // Real-time Firestore sync with resilient merging
  useEffect(() => {
    // 1. Doctors realtime sync: merge with INITIAL_DOCTORS so adding one never wipes defaults
    const unsubDocs = onSnapshot(collection(db, 'doctors'), (snapshot) => {
      const loaded: Doctor[] = [];
      if (!snapshot.empty) {
        snapshot.forEach((docSnap) => loaded.push(docSnap.data() as Doctor));
      }

      const deleted: string[] = JSON.parse(localStorage.getItem('lumina_deleted_docs') || '[]');
      const loadedIds = new Set(loaded.map((d) => d.id));
      const remainingInitial = INITIAL_DOCTORS.filter(
        (d) => !loadedIds.has(d.id) && !deleted.includes(d.id)
      );

      setDoctors([...loaded, ...remainingInitial]);
    }, () => {});

    // 2. Smile Cases realtime sync: merge with INITIAL_BASE_SMILE_CASES
    const unsubCases = onSnapshot(collection(db, 'smileCases'), (snapshot) => {
      const loaded: SmileCase[] = [];
      if (!snapshot.empty) {
        snapshot.forEach((docSnap) => loaded.push(docSnap.data() as SmileCase));
      }

      const deleted: string[] = JSON.parse(localStorage.getItem('lumina_deleted_cases') || '[]');
      const loadedIds = new Set(loaded.map((c) => c.id));
      const remainingInitial = INITIAL_BASE_SMILE_CASES.filter(
        (c) => !loadedIds.has(c.id) && !deleted.includes(c.id)
      );

      setSmileCases([...loaded, ...remainingInitial]);
    }, () => {});

    // 3. Appointments realtime sync
    const unsubAppts = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded: Appointment[] = [];
        snapshot.forEach((docSnap) => loaded.push(docSnap.data() as Appointment));
        setAppointments(loaded);
      }
    }, () => {});

    // 4. Consultations realtime sync
    const unsubCsls = onSnapshot(collection(db, 'consultations'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded: Consultation[] = [];
        snapshot.forEach((docSnap) => loaded.push(docSnap.data() as Consultation));
        setConsultations(loaded);
        try {
          localStorage.setItem('lumina_consultations', JSON.stringify(loaded));
        } catch {}
      }
    }, () => {});

    return () => {
      unsubDocs();
      unsubCases();
      unsubAppts();
      unsubCsls();
    };
  }, []);

  // Listen for #admin or #portal URL hash for private admin access
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#portal') {
        setStaffPortalOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Handlers for Admin actions
  const handleAddDoctor = async (newDoc: Doctor) => {
    setDoctors((prev) => [newDoc, ...prev]);
    try {
      await setDoc(doc(db, 'doctors', newDoc.id), newDoc);
    } catch (e) {
      console.error('Firestore save doctor error:', e);
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    const deleted: string[] = JSON.parse(localStorage.getItem('lumina_deleted_docs') || '[]');
    if (!deleted.includes(doctorId)) {
      localStorage.setItem('lumina_deleted_docs', JSON.stringify([...deleted, doctorId]));
    }
    setDoctors((prev) => prev.filter((d) => d.id !== doctorId));
    try {
      await deleteDoc(doc(db, 'doctors', doctorId));
    } catch (e) {
      console.error('Firestore delete doctor error:', e);
    }
  };

  const handleAddCase = async (newCase: SmileCase) => {
    setSmileCases((prev) => [newCase, ...prev]);
    try {
      await setDoc(doc(db, 'smileCases', newCase.id), newCase);
    } catch (e) {
      console.error('Firestore save case error:', e);
    }
  };

  const handleDeleteCase = async (caseId: string) => {
    const deleted: string[] = JSON.parse(localStorage.getItem('lumina_deleted_cases') || '[]');
    if (!deleted.includes(caseId)) {
      localStorage.setItem('lumina_deleted_cases', JSON.stringify([...deleted, caseId]));
    }
    setSmileCases((prev) => prev.filter((c) => c.id !== caseId));
    try {
      await deleteDoc(doc(db, 'smileCases', caseId));
    } catch (e) {
      console.error('Firestore delete case error:', e);
    }
  };

  // Selections for booking
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();

  // Filter for treatments
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Before/After Slider State
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Header Scroll State
  const [scrolled, setScrolled] = useState(false);

  // Preload all gallery and doctor images in background after first paint for instantaneous interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      smileCases.forEach((c) => {
        const i1 = new Image();
        i1.src = c.beforeImg;
        const i2 = new Image();
        i2.src = c.afterImg;
      });
      doctors.forEach((d) => {
        const i = new Image();
        i.src = d.photo;
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [smileCases, doctors]);

  // Localized data
  const localizedServices = services.map((srv) => {
    if (language === 'ar' && ARABIC_SERVICES_MAP[srv.id]) {
      return {
        ...srv,
        name: ARABIC_SERVICES_MAP[srv.id].name,
        description: ARABIC_SERVICES_MAP[srv.id].description,
      };
    }
    return srv;
  });

  const localizedDoctors = doctors.map((doc) => {
    if (language === 'ar' && ARABIC_DOCTORS_MAP[doc.id]) {
      return {
        ...doc,
        name: ARABIC_DOCTORS_MAP[doc.id].name,
        specialty: ARABIC_DOCTORS_MAP[doc.id].specialty,
        bio: ARABIC_DOCTORS_MAP[doc.id].bio,
        nextAvailable: ARABIC_DOCTORS_MAP[doc.id].nextAvailable,
      };
    }
    return doc;
  });

  const localizedCases = smileCases.map((c) => {
    if (language === 'ar' && ARABIC_CASES_MAP[c.id]) {
      return {
        ...c,
        title: ARABIC_CASES_MAP[c.id].title,
        category: ARABIC_CASES_MAP[c.id].category,
        doctor: ARABIC_CASES_MAP[c.id].doctor,
        duration: ARABIC_CASES_MAP[c.id].duration,
        technique: ARABIC_CASES_MAP[c.id].technique,
        description: ARABIC_CASES_MAP[c.id].description,
      };
    }
    return c;
  });

  // Initialize Lenis
  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = new Lenis({ smoothWheel: true, duration: 1.1 });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(t: number) {
      lenis.raf(t);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Scroll detection for transparent header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stopScroll = useCallback(() => {
    lenisRef.current?.stop();
    document.documentElement.style.overflow = 'hidden';
  }, []);

  const startScroll = useCallback(() => {
    lenisRef.current?.start();
    document.documentElement.style.removeProperty('overflow');
  }, []);

  const scrollTo = useCallback((id: string) => {
    setBookingModalOpen(false);
    setAssessmentModalOpen(false);
    setEmergencyModalOpen(false);
    setStaffPortalOpen(false);
    setNavMenuOpen(false);
    startScroll();

    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el, { offset: -70, duration: 0.9 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 60);
  }, [startScroll]);

  // Modal triggers
  const openBooking = (srvId?: string, docId?: string) => {
    setSelectedServiceId(srvId);
    setSelectedDoctorId(docId);
    stopScroll();
    setBookingModalOpen(true);
  };

  const closeBooking = () => {
    setBookingModalOpen(false);
    startScroll();
  };

  const openAssessment = () => {
    stopScroll();
    setAssessmentModalOpen(true);
  };

  const closeAssessment = () => {
    setAssessmentModalOpen(false);
    startScroll();
  };

  const openEmergency = () => {
    stopScroll();
    setEmergencyModalOpen(true);
  };

  const closeEmergency = () => {
    setEmergencyModalOpen(false);
    startScroll();
  };

  const openStaffPortal = () => {
    stopScroll();
    setStaffPortalOpen(true);
  };

  const closeStaffPortal = () => {
    setStaffPortalOpen(false);
    if (window.location.hash === '#admin' || window.location.hash === '#portal') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    startScroll();
  };

  // Keyboard Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (bookingModalOpen) closeBooking();
        else if (assessmentModalOpen) closeAssessment();
        else if (emergencyModalOpen) closeEmergency();
        else if (patientPortalOpen) setPatientPortalOpen(false);
        else if (staffPortalOpen) closeStaffPortal();
        else if (navMenuOpen) setNavMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bookingModalOpen, assessmentModalOpen, emergencyModalOpen, patientPortalOpen, staffPortalOpen, navMenuOpen]);

  // Slider handlers
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  // Filter services
  const filteredServices = localizedServices.filter((srv) => {
    if (activeCategory === 'ALL') return true;
    return srv.category === activeCategory;
  });

  const currentCase = localizedCases[activeCaseIdx] || localizedCases[0];

  const currentTreatingDoctor = localizedDoctors.find((d) =>
    (currentCase.id === 'case-1' && d.id === 'doc-1') ||
    (currentCase.id === 'case-2' && d.id === 'doc-2') ||
    (currentCase.id === 'case-3' && d.id === 'doc-1') ||
    (currentCase.id === 'case-4' && d.id === 'doc-3') ||
    (currentCase.doctor && d.name && d.name.toLowerCase() === currentCase.doctor.toLowerCase())
  ) || localizedDoctors[0];

  return (
    <div className="min-h-screen bg-white text-[#161616] font-sans antialiased selection:bg-[#9c5828]/20 selection:text-[#161616]">
      {/* ==========================================
          HEADER (TRANSPARENT, BORDERLESS & BILINGUAL)
         ========================================== */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 border-0 border-none ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div
          className={`max-w-6xl mx-auto px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between transition-colors duration-300 bg-transparent border-0 border-none shadow-none ${
            scrolled ? 'text-[#161616]' : 'text-white'
          }`}
        >
          {/* Wordmark Logo */}
          <button
            onClick={() => scrollTo('home')}
            className="flex items-center gap-2 text-left rtl:text-right cursor-pointer group bg-transparent border-0 outline-none"
          >
            <span
              className={`font-medium text-lg tracking-tight transition-colors ${
                scrolled ? 'text-[#161616]' : 'text-white'
              }`}
            >
              LUMINA
            </span>
            <span
              className={`text-xs tracking-wide font-normal uppercase transition-colors ${
                scrolled ? 'text-[#5a5854]' : 'text-white/75'
              }`}
            >
              {t.nav.brandSub}
            </span>
          </button>

          {/* Desktop Nav */}
          <nav
            className={`hidden md:flex items-center gap-7 text-xs font-medium transition-colors border-0 ${
              scrolled ? 'text-[#5a5854]' : 'text-white/90'
            }`}
          >
            <button
              onClick={() => scrollTo('services')}
              className={`transition-colors cursor-pointer border-0 outline-none ${
                scrolled ? 'hover:text-[#161616]' : 'hover:text-white'
              }`}
            >
              {t.nav.treatments}
            </button>
            <button
              onClick={() => scrollTo('gallery')}
              className={`transition-colors cursor-pointer border-0 outline-none ${
                scrolled ? 'hover:text-[#161616]' : 'hover:text-white'
              }`}
            >
              {t.nav.gallery}
            </button>
            <button
              onClick={() => scrollTo('specialists')}
              className={`transition-colors cursor-pointer border-0 outline-none ${
                scrolled ? 'hover:text-[#161616]' : 'hover:text-white'
              }`}
            >
              {t.nav.specialists}
            </button>
            <button
              onClick={() => scrollTo('estimator')}
              className={`transition-colors cursor-pointer border-0 outline-none ${
                scrolled ? 'hover:text-[#161616]' : 'hover:text-white'
              }`}
            >
              {t.nav.estimator}
            </button>
            <button
              onClick={openAssessment}
              className={`transition-colors cursor-pointer border-0 outline-none ${
                scrolled ? 'hover:text-[#9c5828]' : 'text-[#f5bd98] hover:text-white'
              }`}
            >
              {t.nav.virtualAssessment}
            </button>
            <button
              onClick={() => {
                stopScroll();
                setPatientPortalOpen(true);
              }}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer border-0 outline-none ${
                scrolled ? 'text-[#9c5828] hover:text-[#161616]' : 'text-[#f5bd98] hover:text-white'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'سجل الفحص الطبي' : 'Checkup Tracker'}</span>
            </button>
            <button
              onClick={openEmergency}
              className={`transition-colors cursor-pointer border-0 outline-none ${
                scrolled ? 'text-red-700 hover:text-red-800' : 'text-red-400 hover:text-red-300'
              }`}
            >
              {t.nav.emergency}
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 sm:gap-4 bg-transparent border-0">
            {/* 1-Click Language Switcher (EN / AR) */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className={`flex items-center gap-1.5 text-xs font-semibold tracking-wider cursor-pointer border-0 outline-none px-2.5 py-1.5 rounded-full transition-all ${
                scrolled
                  ? 'hover:bg-[#f2efe9] text-[#161616]'
                  : 'hover:bg-white/10 text-white'
              }`}
              title={t.nav.toggleLangLabel}
              aria-label="Toggle Language EN/AR"
            >
              <Globe className="w-3.5 h-3.5 opacity-70" />
              <span className={language === 'en' ? 'font-bold underline underline-offset-4' : 'opacity-50'}>EN</span>
              <span className="opacity-30">/</span>
              <span className={language === 'ar' ? 'font-bold underline underline-offset-4' : 'opacity-50'}>AR</span>
            </button>

            {/* Book Visit Button */}
            <button
              onClick={() => openBooking()}
              className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer border-0 outline-none ${
                scrolled
                  ? 'bg-[#161616] hover:bg-[#2c2b29] text-white'
                  : 'bg-[#9c5828] hover:bg-[#854b22] text-white'
              }`}
            >
              {t.nav.bookVisit}
            </button>

            <button
              onClick={() => setNavMenuOpen(!navMenuOpen)}
              className={`md:hidden p-2 transition-colors cursor-pointer border-0 outline-none ${
                scrolled ? 'text-[#161616]' : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          MOBILE NAVIGATION DRAWER
         ========================================== */}
      {navMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white p-8 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#ebe9e4] pb-6">
            <span className="font-medium text-lg text-[#161616]">LUMINA Dental Atelier</span>
            <button onClick={() => setNavMenuOpen(false)} className="p-2 text-[#161616] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-6 text-xl font-light text-[#161616] my-auto">
            {/* Mobile Language Switcher */}
            <button
              onClick={() => {
                setLanguage(language === 'en' ? 'ar' : 'en');
                setNavMenuOpen(false);
              }}
              className="text-left rtl:text-right font-medium text-sm text-[#9c5828] flex items-center gap-2 cursor-pointer border-0 outline-none"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'التحويل إلى العربية (AR)' : 'Switch to English (EN)'}</span>
            </button>

            <button onClick={() => scrollTo('home')} className="text-left rtl:text-right hover:text-[#9c5828] cursor-pointer">
              {language === 'ar' ? 'الرئيسية' : 'Home'}
            </button>
            <button onClick={() => scrollTo('services')} className="text-left rtl:text-right hover:text-[#9c5828] cursor-pointer">
              {t.nav.treatments}
            </button>
            <button onClick={() => scrollTo('gallery')} className="text-left rtl:text-right hover:text-[#9c5828] cursor-pointer">
              {t.nav.gallery}
            </button>
            <button onClick={() => scrollTo('specialists')} className="text-left rtl:text-right hover:text-[#9c5828] cursor-pointer">
              {t.nav.specialists}
            </button>
            <button onClick={() => scrollTo('estimator')} className="text-left rtl:text-right hover:text-[#9c5828] cursor-pointer">
              {t.nav.estimator}
            </button>
            <button onClick={() => { openAssessment(); setNavMenuOpen(false); }} className="text-left rtl:text-right text-[#9c5828] cursor-pointer">
              {t.nav.virtualAssessment}
            </button>
            <button
              onClick={() => {
                setPatientPortalOpen(true);
                setNavMenuOpen(false);
              }}
              className="text-left rtl:text-right text-stone-900 font-normal flex items-center gap-2.5 cursor-pointer border-0 outline-none"
            >
              <FileCheck2 className="w-5 h-5 text-[#9c5828]" />
              <span>{language === 'ar' ? 'سجل الفحص الطبي ومتابعة الاستشارة' : 'Medical Consultation Tracker'}</span>
            </button>
            <button onClick={() => { openEmergency(); setNavMenuOpen(false); }} className="text-left rtl:text-right text-red-700 cursor-pointer">
              {t.nav.emergency}
            </button>
          </div>

          <div className="pt-6 border-t border-[#ebe9e4] flex items-center justify-between">
            <span className="text-xs text-[#76736d]">San Francisco, CA</span>
            <button
              onClick={() => { openBooking(); setNavMenuOpen(false); }}
              className="px-6 py-2.5 rounded-full bg-[#161616] text-white text-xs font-medium cursor-pointer"
            >
              {t.nav.bookVisit}
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          MAIN HERO SECTION (SIMPLIFIED & ELEGANT)
         ========================================== */}
      <section id="home" className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-[#161616] pt-24 sm:pt-28">
        {/* The beloved high-res 4K photograph - pristine and unblurred */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={HERO_SMILE_IMAGE}
            srcSet={HERO_SMILE_SRCSET}
            sizes="100vw"
            fetchPriority="high"
            decoding="async"
            alt="LUMINA Dental Aesthetic Smile"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient for effortless typography contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto w-full px-6 lg:px-8 pb-6 sm:pb-8 relative z-10 text-white">
          <div className="max-w-xl space-y-5">
            <p className="text-xs font-medium uppercase tracking-widest text-[#d89f78]">
              {t.hero.kicker}
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.12]">
              {t.hero.title}
            </h1>

            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-lg">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => openBooking()}
                className="px-6 py-3 rounded-full bg-[#9c5828] hover:bg-[#854b22] text-white text-xs font-medium tracking-wide transition-colors cursor-pointer"
              >
                {t.hero.scheduleConsultation}
              </button>

              <button
                onClick={openAssessment}
                className="px-6 py-3 rounded-full border border-white/40 hover:bg-white/10 text-white text-xs font-medium tracking-wide transition-colors cursor-pointer backdrop-blur-xs"
              >
                {t.hero.virtualSmileCheck}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          TREATMENTS & PROCEDURES (MINIMAL & CLEAR)
         ========================================== */}
      <section id="services" className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#ebe9e4]">
            <div className="max-w-lg">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9c5828] mb-2">
                {t.services.kicker}
              </p>
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#161616]">
                {t.services.title}
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { id: 'ALL', label: t.services.categories.ALL },
                { id: 'COSMETIC', label: t.services.categories.COSMETIC },
                { id: 'ORTHODONTICS', label: t.services.categories.ORTHODONTICS },
                { id: 'RESTORATIVE', label: t.services.categories.RESTORATIVE },
                { id: 'PREVENTIVE', label: t.services.categories.PREVENTIVE },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-[#161616] text-white'
                      : 'text-[#5a5854] hover:text-[#161616] bg-[#faf9f6]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Procedures */}
          <div className="divide-y divide-[#ebe9e4]">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                onClick={() => openBooking(srv.id)}
                className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer hover:bg-[#faf9f6] px-4 rounded-xl transition-colors -mx-4"
              >
                <div className="max-w-xl space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#5a5854]">
                    <span>{srv.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{srv.duration} {t.services.minutes}</span>
                  </div>
                  <h3 className="text-lg font-medium text-[#161616] group-hover:text-[#9c5828] transition-colors">
                    {srv.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5a5854] leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="flex items-center gap-6 self-end md:self-center">
                  <div className="text-right rtl:text-left">
                    <span className="text-xs text-[#76736d] block">{t.services.startingFrom}</span>
                    <span className="text-lg font-normal text-[#161616]">${srv.basePrice}</span>
                  </div>
                  <span className="w-8 h-8 rounded-full border border-[#ebe9e4] group-hover:border-[#161616] flex items-center justify-center text-[#161616] transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-90" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SMILE GALLERY (BEFORE & AFTER SLIDER)
         ========================================== */}
      <section id="gallery" className="py-20 lg:py-28 bg-[#faf9f6] border-y border-[#ebe9e4]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#ebe9e4]">
            <div className="max-w-lg">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9c5828] mb-2">
                {t.gallery.kicker}
              </p>
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#161616]">
                {t.gallery.title}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {localizedCases.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCaseIdx(idx);
                    setSliderPos(50);
                  }}
                  className={`px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                    activeCaseIdx === idx
                      ? 'bg-[#161616] text-white'
                      : 'text-[#5a5854] hover:text-[#161616] bg-white border border-[#ebe9e4]'
                  }`}
                >
                  {c.category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Interactive Before / After Viewer */}
            <div className="lg:col-span-7">
              <div
                ref={sliderRef}
                onPointerDown={() => { isDragging.current = true; }}
                onPointerUp={() => { isDragging.current = false; }}
                onPointerMove={(e) => { if (isDragging.current) handleSliderMove(e.clientX); }}
                className="relative h-80 sm:h-96 rounded-xl overflow-hidden cursor-ew-resize select-none border border-[#ebe9e4] bg-slate-900 shadow-sm"
              >
                {/* After Image */}
                <img
                  src={currentCase.afterImg}
                  alt="After"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-black/75 text-white text-[10px] font-medium px-2.5 py-1 rounded">
                  {t.gallery.after}
                </span>

                {/* Before Image (clipped) */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={currentCase.beforeImg}
                    alt="Before"
                    className="absolute inset-y-0 left-0 h-full max-w-none w-full object-cover"
                    style={{ width: sliderRef.current?.getBoundingClientRect().width || '100%' }}
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-white/90 text-[#161616] text-[10px] font-medium px-2.5 py-1 rounded">
                    {t.gallery.before}
                  </span>
                </div>

                {/* Divider Line */}
                <div
                  className="absolute inset-y-0 z-20 w-0.5 bg-white shadow flex items-center justify-center"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="w-7 h-7 rounded-full bg-white text-[#161616] shadow border border-[#ebe9e4] flex items-center justify-center text-[10px] font-bold">
                    ↔
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#76736d] text-center mt-2.5">
                {t.gallery.dragHint}
              </p>
            </div>

            {/* Case Details */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs text-[#9c5828] font-medium block mb-1">
                  {t.gallery.caseLabel} {activeCaseIdx + 1} {t.gallery.ofLabel} {localizedCases.length}
                </span>
                <h3 className="text-2xl font-normal text-[#161616]">
                  {currentCase.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5a5854] mt-2 leading-relaxed">
                  {currentCase.description}
                </p>
              </div>

              {/* Treating Doctor Badge with authentic portrait */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-[#ebe9e4] shadow-xs">
                <img
                  src={currentTreatingDoctor.photo}
                  alt={currentTreatingDoctor.name}
                  className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#ebe9e4]"
                  referrerPolicy="no-referrer"
                />
                <div className="text-xs space-y-0.5">
                  <span className="text-[#76736d] block text-[11px]">{t.gallery.specialistLabel}</span>
                  <span className="font-medium text-[#161616] text-sm block">{currentTreatingDoctor.name}</span>
                  <span className="text-[#9c5828] block text-[11px] font-medium">{currentTreatingDoctor.specialty}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-[#ebe9e4] pt-4 text-[#5a5854]">
                <div className="flex justify-between">
                  <span>{t.gallery.treatmentTimeLabel}</span>
                  <span className="text-[#161616] font-medium">{currentCase.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.gallery.protocolLabel}</span>
                  <span className="text-[#161616] font-medium">{currentCase.technique}</span>
                </div>
              </div>

              <button
                onClick={() => openBooking(undefined, currentTreatingDoctor.id)}
                className="px-6 py-2.5 rounded-full bg-[#161616] text-white text-xs font-medium hover:bg-[#2c2b29] transition-colors cursor-pointer"
              >
                {t.gallery.inquireBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SPECIALISTS & MEDICAL FACULTY
         ========================================== */}
      <section id="specialists" className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#ebe9e4]">
            <div className="max-w-lg">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9c5828] mb-2">
                {t.specialists.kicker}
              </p>
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#161616]">
                {t.specialists.title}
              </h2>
            </div>
            <button
              onClick={() => openBooking()}
              className="text-xs text-[#161616] font-medium hover:text-[#9c5828] flex items-center gap-1 cursor-pointer"
            >
              <span>{t.specialists.bookWithAny}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {localizedDoctors.map((doc) => (
              <div key={doc.id} className="space-y-4 group">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 border border-[#ebe9e4]">
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-medium text-[#161616]">{doc.name}</h3>
                  <p className="text-xs text-[#9c5828] font-medium">{doc.specialty}</p>
                  <p className="text-xs text-[#5a5854] line-clamp-2 leading-relaxed pt-1">
                    {doc.bio}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => openBooking(undefined, doc.id)}
                    className="text-xs font-medium text-[#161616] hover:text-[#9c5828] flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t.specialists.bookWithDoctor} {doc.name.split(' ')[1] || doc.name}</span>
                    <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          COST & INSURANCE ESTIMATOR
         ========================================== */}
      <section id="estimator">
        <CostEstimator
          services={localizedServices}
          onBookService={(srvId) => openBooking(srvId)}
          content={t.estimator}
        />
      </section>

      {/* ==========================================
          CLINICAL STANDARDS & HOSPITALITY
         ========================================== */}
      <WhyChooseUs content={t.whyUs} />

      {/* ==========================================
          PATIENT TESTIMONIALS
         ========================================== */}
      <PatientTestimonials content={t.testimonials} />

      {/* ==========================================
          EMERGENCY TRIAGE BANNER
         ========================================== */}
      <section className="py-16 bg-white border-t border-[#ebe9e4]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-700">
            {t.emergency.kicker}
          </p>
          <h2 className="text-2xl sm:text-3xl font-normal text-[#161616]">
            {t.emergency.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#5a5854] max-w-lg mx-auto">
            {t.emergency.description}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href="tel:5559117645"
              className="px-6 py-2.5 rounded-full bg-red-700 hover:bg-red-800 text-white text-xs font-medium inline-flex items-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t.emergency.callNow}</span>
            </a>
            <button
              onClick={openEmergency}
              className="px-6 py-2.5 rounded-full border border-[#ebe9e4] hover:bg-[#faf9f6] text-[#161616] text-xs font-medium cursor-pointer"
            >
              {t.emergency.urgentRequest}
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          FOOTER (MINIMALIST & REFINED)
         ========================================== */}
      <footer className="py-16 bg-[#faf9f6] border-t border-[#ebe9e4] text-xs text-[#5a5854]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <span className="font-medium text-sm text-[#161616] block">LUMINA Dental Atelier</span>
              <p className="leading-relaxed whitespace-pre-line">
                {t.footer.address}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-medium text-[#161616] block mb-2">{t.footer.hoursTitle}</span>
              <p>{t.footer.monFri}</p>
              <p>{t.footer.sat}</p>
              <p>{t.footer.sun}</p>
            </div>

            <div className="space-y-1">
              <span className="font-medium text-[#161616] block mb-2">{t.footer.contactTitle}</span>
              <p>{t.footer.desk}</p>
              <p>{t.footer.emergency}</p>
              <p>concierge@luminadental.com</p>
            </div>

            <div className="space-y-1">
              <span className="font-medium text-[#161616] block mb-2">{t.footer.accreditationsTitle}</span>
              <p>{t.footer.ada}</p>
              <p>{t.footer.aacd}</p>
              <p>{t.footer.invisalign}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#ebe9e4] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#76736d]">
            <div className="flex items-center gap-2">
              <span>{t.footer.copyright}</span>
              <button
                onClick={openStaffPortal}
                className="text-stone-300 hover:text-stone-700 transition-colors cursor-pointer p-0.5"
                title=""
                aria-label="Director Access"
              >
                <Lock className="w-2.5 h-2.5 opacity-25 hover:opacity-90" />
              </button>
            </div>
            <div className="flex gap-4">
              <button onClick={() => scrollTo('home')} className="hover:text-[#161616] cursor-pointer">
                {t.footer.backToTop}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ==========================================
          MODALS
         ========================================== */}

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs p-3 sm:p-6 flex items-center justify-center overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-[#ebe9e4] max-h-[90vh] flex flex-col">
            <BookingWizard
              doctors={localizedDoctors}
              services={localizedServices}
              preselectedDoctorId={selectedDoctorId}
              preselectedServiceId={selectedServiceId}
              onBookingComplete={(apt) => {
                setAppointments((prev) => [apt, ...prev]);
                setDoc(doc(db, 'appointments', apt.id), apt).catch((e) => console.log('Local booking saved:', e));
              }}
              onNavigateHome={closeBooking}
              content={t.bookingModal}
            />
          </div>
        </div>
      )}

      {/* Virtual Assessment Modal */}
      {assessmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs p-3 sm:p-6 flex items-center justify-center overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-[#ebe9e4] max-h-[90vh] flex flex-col">
            <VirtualAssessment
              onConsultationSubmitted={(csl) => {
                setConsultations((prev) => {
                  const updated = [csl, ...prev];
                  try {
                    localStorage.setItem('lumina_consultations', JSON.stringify(updated));
                  } catch {}
                  return updated;
                });
                setDoc(doc(db, 'consultations', csl.id), csl).catch((e) => console.log('Local consultation saved:', e));
              }}
              onNavigateToBooking={() => {
                closeAssessment();
                openBooking();
              }}
              onCloseModal={closeAssessment}
              content={t.assessmentModal}
            />
          </div>
        </div>
      )}

      {/* Emergency Modal */}
      {emergencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs p-4 flex items-center justify-center">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-5 shadow-xl border border-red-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#ebe9e4]">
              <span className="font-medium text-red-700 text-sm">{t.emergency.modalTitle}</span>
              <button onClick={closeEmergency} className="text-[#5a5854] hover:text-[#161616] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#5a5854] leading-relaxed">
              {t.emergency.modalDesc}
            </p>
            <div className="space-y-2 pt-2">
              <a
                href="tel:5559117645"
                className="w-full py-3 rounded-lg font-medium bg-red-700 text-white hover:bg-red-800 text-center text-xs flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t.emergency.callNow}</span>
              </a>
              <button
                onClick={() => {
                  closeEmergency();
                  openBooking(services.find((s) => s.category === 'EMERGENCY')?.id);
                }}
                className="w-full py-2.5 rounded-lg border border-[#ebe9e4] hover:bg-[#faf9f6] text-[#161616] text-xs font-medium cursor-pointer"
              >
                {t.emergency.bookPriority}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Report & Consultation Tracker Portal */}
      <PatientReportPortal
        consultations={consultations}
        isOpen={patientPortalOpen}
        onClose={() => {
          setPatientPortalOpen(false);
          startScroll();
        }}
        onBookAppointment={(doctorId, serviceId) => {
          setPatientPortalOpen(false);
          openBooking(serviceId, doctorId);
        }}
        isRtl={language === 'ar'}
      />

      {/* Staff Portal / Admin Dashboard */}
      {staffPortalOpen && (
        <AdminDashboard
          stats={DEFAULT_CLINIC_STATS}
          appointments={appointments}
          consultations={consultations}
          patients={patients}
          doctors={doctors}
          cases={smileCases}
          services={services}
          onUpdateAppointmentStatus={(id, status) => {
            setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
            setDoc(doc(db, 'appointments', id), { status }, { merge: true }).catch(() => {});
          }}
          onUpdateConsultation={(csl) => {
            setConsultations((prev) => {
              const updated = prev.map((c) => (c.id === csl.id ? csl : c));
              try {
                localStorage.setItem('lumina_consultations', JSON.stringify(updated));
              } catch {}
              return updated;
            });
            setDoc(doc(db, 'consultations', csl.id), csl, { merge: true }).catch(() => {});
            fetch(`/api/consultations/${csl.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(csl),
            }).catch(() => {});
          }}
          onAddDoctor={handleAddDoctor}
          onDeleteDoctor={handleDeleteDoctor}
          onAddCase={handleAddCase}
          onDeleteCase={handleDeleteCase}
          onClose={closeStaffPortal}
          isRtl={language === 'ar'}
        />
      )}
    </div>
  );
}
