export type Language = 'en' | 'ar';

export interface Translations {
  nav: {
    treatments: string;
    gallery: string;
    specialists: string;
    estimator: string;
    virtualAssessment: string;
    emergency: string;
    bookVisit: string;
    brandSub: string;
    toggleLangLabel: string;
    langSwitchText: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    scheduleConsultation: string;
    virtualSmileCheck: string;
  };
  services: {
    kicker: string;
    title: string;
    allTreatments: string;
    startingFrom: string;
    minutes: string;
    categories: {
      ALL: string;
      COSMETIC: string;
      ORTHODONTICS: string;
      RESTORATIVE: string;
      PREVENTIVE: string;
    };
  };
  gallery: {
    kicker: string;
    title: string;
    before: string;
    after: string;
    dragHint: string;
    caseLabel: string;
    ofLabel: string;
    specialistLabel: string;
    treatmentTimeLabel: string;
    protocolLabel: string;
    inquireBtn: string;
  };
  specialists: {
    kicker: string;
    title: string;
    bookWithAny: string;
    bookWithDoctor: string;
  };
  estimator: {
    kicker: string;
    title: string;
    subtitle: string;
    procedureLabel: string;
    insuranceLabel: string;
    estimatedOutOfPocket: string;
    baseProcedure: string;
    coverageText: string;
    financingLabel: string;
    financingSub: string;
    scheduleBtn: string;
    perMonth: string;
    directPay: string;
  };
  whyUs: {
    kicker: string;
    title: string;
    pillars: Array<{ number: string; title: string; description: string }>;
  };
  testimonials: {
    kicker: string;
    googleRating: string;
    items: Array<{ id: string; name: string; treatment: string; quote: string; year: string }>;
  };
  emergency: {
    kicker: string;
    title: string;
    description: string;
    callNow: string;
    urgentRequest: string;
    modalTitle: string;
    modalDesc: string;
    bookPriority: string;
  };
  footer: {
    address: string;
    hoursTitle: string;
    monFri: string;
    sat: string;
    sun: string;
    contactTitle: string;
    desk: string;
    emergency: string;
    accreditationsTitle: string;
    ada: string;
    aacd: string;
    invisalign: string;
    copyright: string;
    staffPortal: string;
    backToTop: string;
  };
  staffModal: {
    portalTitle: string;
    enterPin: string;
    quickDemo: string;
    scheduleTitle: string;
    signOut: string;
  };
  bookingModal: {
    kicker: string;
    title: string;
    steps: {
      procedure: string;
      doctor: string;
      schedule: string;
      patient: string;
      review: string;
    };
    newPatient: string;
    returningPatient: string;
    selectProcedureHint: string;
    selectDoctorHint: string;
    selectDate: string;
    availableSlots: string;
    patientDetails: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notesPlaceholder: string;
    back: string;
    continue: string;
    confirm: string;
    confirmedTitle: string;
    confirmedDesc: string;
    returnHome: string;
  };
  assessmentModal: {
    kicker: string;
    title: string;
    concernsTitle: string;
    photoTitle: string;
    photoDropHint: string;
    photoSub: string;
    notesTitle: string;
    notesPlaceholder: string;
    contactTitle: string;
    submitBtn: string;
    submittingBtn: string;
    submittedTitle: string;
    submittedDesc: string;
    bookInPerson: string;
    close: string;
    concernsList: string[];
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    nav: {
      treatments: 'Treatments',
      gallery: 'Smile Gallery',
      specialists: 'Specialists',
      estimator: 'Fee Estimator',
      virtualAssessment: 'Virtual Assessment',
      emergency: 'Emergency',
      bookVisit: 'Book Visit',
      brandSub: 'Dental Atelier',
      toggleLangLabel: 'Change language to Arabic',
      langSwitchText: 'AR',
    },
    hero: {
      kicker: 'San Francisco · Precision Dental Practice',
      title: 'Modern dentistry, crafted with quiet precision.',
      subtitle:
        'A serene clinical sanctuary for minimal-prep porcelain veneers, Invisalign® clear aligners, and 3D restorative surgery.',
      scheduleConsultation: 'Schedule Consultation',
      virtualSmileCheck: 'Virtual Smile Check',
    },
    services: {
      kicker: 'Clinical Services',
      title: 'Curated treatments and transparent fees.',
      allTreatments: 'All Treatments',
      startingFrom: 'Starting from',
      minutes: 'minutes',
      categories: {
        ALL: 'All Treatments',
        COSMETIC: 'Cosmetic',
        ORTHODONTICS: 'Aligners',
        RESTORATIVE: 'Restorative',
        PREVENTIVE: 'Preventive',
      },
    },
    gallery: {
      kicker: 'Aesthetic Gallery',
      title: 'Documented patient transformations.',
      before: 'BEFORE',
      after: 'AFTER',
      dragHint: 'Drag divider to compare transformation',
      caseLabel: 'Case',
      ofLabel: 'of',
      specialistLabel: 'Specialist:',
      treatmentTimeLabel: 'Treatment Time:',
      protocolLabel: 'Protocol:',
      inquireBtn: 'Inquire for Similar Results',
    },
    specialists: {
      kicker: 'Medical Faculty',
      title: 'Board-certified specialists.',
      bookWithAny: 'Schedule with any doctor',
      bookWithDoctor: 'Book with',
    },
    estimator: {
      kicker: 'Financial Transparency',
      title: 'Estimate your procedure investment.',
      subtitle:
        'Select a clinical service and your dental coverage network for an immediate out-of-pocket preview.',
      procedureLabel: 'Procedure',
      insuranceLabel: 'Insurance Network',
      estimatedOutOfPocket: 'Estimated Out-of-Pocket',
      baseProcedure: 'Base procedure',
      coverageText: 'Coverage',
      financingLabel: '0% APR Financing:',
      financingSub: 'Available via CareCredit with no prepayment penalties.',
      scheduleBtn: 'Schedule Initial Visit',
      perMonth: '/ month for 12 mos',
      directPay: 'Direct Pay / Member',
    },
    whyUs: {
      kicker: 'Clinical Standards',
      title: 'Care designed around quiet mastery and patient comfort.',
      pillars: [
        {
          number: '01',
          title: 'Digital Precision',
          description:
            '3D intraoral scanning and CAD/CAM milling provide sub-millimeter fit without silicone impressions.',
        },
        {
          number: '02',
          title: 'Minimal Intervention',
          description:
            'Conservative enamel preservation and biological ceramics designed to match natural tooth vitality.',
        },
        {
          number: '03',
          title: 'Calm Sanctuary',
          description:
            'Private treatment suites, ambient sound reduction, and gentle sedation for unhurried, comfortable care.',
        },
        {
          number: '04',
          title: 'Clear Stewardship',
          description:
            'Transparent treatment plans, comprehensive warranty, and direct in-network insurance coordination.',
        },
      ],
    },
    testimonials: {
      kicker: 'Patient Testimonials',
      googleRating: '4.9 on Google (2,800+ reviews)',
      items: [
        {
          id: 'rev-1',
          name: 'Jessica Reynolds',
          treatment: 'Invisalign® & Porcelain Veneers',
          quote:
            'The calmness of the clinic immediately relieved years of dental anxiety. Dr. Sarah Chen and her team took time to design every contour before touching a tooth. The outcome is seamlessly natural.',
          year: 'Patient since 2024',
        },
        {
          id: 'rev-2',
          name: 'Michael Callahan',
          treatment: 'Same-Day Ceramic Restoration',
          quote:
            'Having a precision ceramic crown measured, milled, and placed in a single 45-minute visit without temporary impressions was truly exceptional dentistry.',
          year: 'Patient since 2025',
        },
        {
          id: 'rev-3',
          name: 'Sophia Laurent',
          treatment: 'Minimal-Prep Smile Makeover',
          quote:
            'I appreciate the biological philosophy here. They preserved my natural enamel while correcting discoloration and alignment. It feels like an art studio as much as a medical practice.',
          year: 'Patient since 2023',
        },
      ],
    },
    emergency: {
      kicker: 'Emergency Care',
      title: 'Acute toothache, trauma, or fractured restoration?',
      description:
        'We reserve same-day clinical emergency visits daily. Call directly to speak with our triage coordinator.',
      callNow: 'Call (555) 911-SMILE',
      urgentRequest: 'Urgent Triage Request',
      modalTitle: 'Emergency Dental Triage',
      modalDesc:
        'If you have a knocked-out tooth, acute trauma, or severe facial swelling, our on-call dental surgeon is available immediately.',
      bookPriority: 'Book Priority Slot Online',
    },
    footer: {
      address: '740 Park Avenue, Suite 1200\nSan Francisco, CA 94108',
      hoursTitle: 'Practice Hours',
      monFri: 'Mon - Fri: 8:00 AM - 6:00 PM',
      sat: 'Saturday: 9:00 AM - 3:00 PM',
      sun: 'Sunday: Emergency on-call',
      contactTitle: 'Direct Contact',
      desk: 'Desk: (555) 321-SMILE',
      emergency: 'Emergency: (555) 911-SMILE',
      accreditationsTitle: 'Accreditations',
      ada: 'American Dental Association',
      aacd: 'AACD Cosmetic Dentistry',
      invisalign: 'Invisalign® Diamond Provider',
      copyright: '© 2026 LUMINA Dental Atelier. HIPAA & OSHA Compliant.',
      staffPortal: 'Director Portal',
      backToTop: 'Back to top ↑',
    },
    staffModal: {
      portalTitle: 'Clinical Portal',
      enterPin: 'Enter Staff PIN',
      quickDemo: 'Quick Demo Access',
      scheduleTitle: 'Practice Schedule',
      signOut: 'Sign Out',
    },
    bookingModal: {
      kicker: 'Reservation',
      title: 'Schedule your clinical visit.',
      steps: {
        procedure: 'Procedure',
        doctor: 'Doctor',
        schedule: 'Schedule',
        patient: 'Patient',
        review: 'Review',
      },
      newPatient: 'New Patient',
      returningPatient: 'Returning',
      selectProcedureHint: 'Select required clinical procedure',
      selectDoctorHint: 'Select your treating specialist',
      selectDate: 'Select Date',
      availableSlots: 'Available Consultation Slots',
      patientDetails: 'Patient Contact Details',
      firstName: 'First Name *',
      lastName: 'Last Name *',
      email: 'Email Address *',
      phone: 'Mobile Phone *',
      notesPlaceholder: 'Comfort notes or special medical considerations (optional)...',
      back: 'Back',
      continue: 'Continue',
      confirm: 'Confirm Appointment',
      confirmedTitle: 'Visit Confirmed',
      confirmedDesc: 'Your appointment is confirmed. A calendar confirmation has been sent to your email.',
      returnHome: 'Return to Clinic Home',
    },
    assessmentModal: {
      kicker: 'Clinical Smile Consultation',
      title: 'Direct specialist smile review.',
      concernsTitle: '1. What would you like to improve?',
      photoTitle: '2. Smile Photograph (Optional)',
      photoDropHint: 'Upload a clear smiling photo',
      photoSub: 'JPG or PNG under 10MB',
      notesTitle: '3. Specific Notes or Clinical History',
      notesPlaceholder: 'Tell our doctors about any sensitivity, upcoming dates, or past dental treatments...',
      contactTitle: '4. Contact Details',
      submitBtn: 'Submit Case to Specialist Doctor',
      submittingBtn: 'Sending to Specialist Doctor...',
      submittedTitle: 'Consultation Request Received',
      submittedDesc: 'Our clinical dental specialists will personally review your smile photos and contact you directly with a tailored treatment recommendation.',
      bookInPerson: 'Book In-Person Visit',
      close: 'Close',
      concernsList: [
        'Alignment & Crowding',
        'Discoloration & Staining',
        'Enamel Wear or Chips',
        'Spacing & Diastema',
        'Tooth Sensitivity',
        'Missing Tooth / Restoration',
      ],
    },
  },
  ar: {
    nav: {
      treatments: 'العلاجات',
      gallery: 'معرض الحالات',
      specialists: 'الفريق الطبي',
      estimator: 'حاسبة التكاليف',
      virtualAssessment: 'استشارة افتراضية',
      emergency: 'طوارئ الأسنان',
      bookVisit: 'حجز موعد',
      brandSub: 'أتيليه طب وتجميل الأسنان',
      toggleLangLabel: 'التحويل إلى الإنجليزية',
      langSwitchText: 'EN',
    },
    hero: {
      kicker: 'سان فرانسيسكو · عيادة التميز لطب وتجميل الأسنان',
      title: 'طب أسنان حديث، مصمم بدقة هادئة وإتقان.',
      subtitle:
        'ملاذ علاجي راقٍ ومريح لعدسات الفينير الدقيقة، تقويم الأسنان الشفاف إنفزلاين®، والجراحة الترميمية ثلاثية الأبعاد.',
      scheduleConsultation: 'حجز استشارة',
      virtualSmileCheck: 'فحص الابتسامة الذكي',
    },
    services: {
      kicker: 'الخدمات السريرية',
      title: 'علاجات متخصصة وأسعار شفافة ومحددة.',
      allTreatments: 'جميع العلاجات',
      startingFrom: 'ابتداءً من',
      minutes: 'دقيقة',
      categories: {
        ALL: 'جميع العلاجات',
        COSMETIC: 'تجميل الأسنان',
        ORTHODONTICS: 'التقويم الشفاف',
        RESTORATIVE: 'الترميم والزراعة',
        PREVENTIVE: 'الوقاية والصحة',
      },
    },
    gallery: {
      kicker: 'معرض الابتسامات',
      title: 'نتائج موثقة لتحولات ابتسامات مرضانا.',
      before: 'قبل',
      after: 'بعد',
      dragHint: 'اسحب الخط في المنتصف للمقارنة بين قبل وبعد',
      caseLabel: 'الحالة',
      ofLabel: 'من',
      specialistLabel: 'الطبيب المعالج:',
      treatmentTimeLabel: 'مدة العلاج:',
      protocolLabel: 'البروتوكول الطبي:',
      inquireBtn: 'استفسر لحالة مشابهة',
    },
    specialists: {
      kicker: 'الفريق الطبي',
      title: 'استشاريون وأطباء معتمدون دولياً.',
      bookWithAny: 'حجز موعد مع أي طبيب',
      bookWithDoctor: 'حجز مع',
    },
    estimator: {
      kicker: 'الشفافية المالية',
      title: 'احسب استثمار علاجك السني والتغطية التأمينية.',
      subtitle:
        'اختر الإجراء الطبي المطلوب وشبكة التأمين للحصول على معاينة فورية للحصة التقديرية المتبقية وخيارات التقسيط.',
      procedureLabel: 'الإجراء الطبي',
      insuranceLabel: 'شبكة التأمين المعتمدة',
      estimatedOutOfPocket: 'التكلفة التقديرية الصافية للمريض',
      baseProcedure: 'السعر الأساسي للإجراء',
      coverageText: 'تغطية التأمين',
      financingLabel: 'تقسيط بدون فوائد 0% APR:',
      financingSub: 'متاح بالتعاون مع برامج التمويل الطبي المعتمدة بدون رسوم مسبقة.',
      scheduleBtn: 'جدولة الزيارة الأولى',
      perMonth: 'شهرياً لمدة 12 شهراً',
      directPay: 'دفع مباشر / اشتراك لومينا',
    },
    whyUs: {
      kicker: 'المعايير السريرية',
      title: 'رعاية صحية مصممة حول الدقة الفائقة وراحة المريض.',
      pillars: [
        {
          number: '01',
          title: 'الدقة الرقمية',
          description:
            'المسح الضوئي الفموي ثلاثي الأبعاد والخرط الآلي CAD/CAM يوفران تطابقاً مجهرياً دقيقاً دون الحاجة لمعجون الطبعات التقليدي.',
        },
        {
          number: '02',
          title: 'التدخل المحافظ',
          description:
            'حفاظ صارم على طبقة المينا الطبيعية مع سيراميك حيوي مصمم ليطابق حيوية ونفاذية الأسنان الطبيعية.',
        },
        {
          number: '03',
          title: 'الملاذ الهادئ',
          description:
            'أجنحة علاج فردية خاصة، تقنيات عزل الصوت المحيط، وتخدير لطيف لجلسات علاجية مريحة وخالية تماماً من القلق.',
        },
        {
          number: '04',
          title: 'الشفافية والضمان',
          description:
            'خطط علاجية واضحة التكاليف، ضمان سريري شامل، وتنسيق مباشر وفوري مع شبكات التأمين الصحي المعتمدة.',
        },
      ],
    },
    testimonials: {
      kicker: 'تجارب المرضى',
      googleRating: 'تقييم 4.9 على Google (أكثر من 2,800 تقييم)',
      items: [
        {
          id: 'rev-1',
          name: 'جيسيكا رينولدز',
          treatment: 'تقويم إنفزلاين® وعدسات الفينير الخزفية',
          quote:
            'الهدوء والسكينة داخل العيادة أزالا على الفور سنوات من الخوف من طبيب الأسنان. الدكتورة سارة تشن وفريقها أخذوا كامل الوقت لدراسة كل تفصيل قبل لمس أي سن. النتيجة طبيعية للغاية وتفوق التوقعات.',
          year: 'مريضة منذ 2024',
        },
        {
          id: 'rev-2',
          name: 'مايكل كالاهان',
          treatment: 'تركيبة سيراميك في نفس اليوم',
          quote:
            'أخذ القياس الرقمي بدقة، تصنيع التاج الخزفي، وتركيبه في جلسة واحدة مدتها 45 دقيقة دون أي قوالب مؤقتة كانت تجربة طبية استثنائية بحق.',
          year: 'مريض منذ 2025',
        },
        {
          id: 'rev-3',
          name: 'صوفيا لوران',
          treatment: 'تجميل الابتسامة بالحد الأدنى من التحضير',
          quote:
            'أقدر جداً الفلسفة الحيوية المتبعة هنا؛ حافظوا على طبقة المينا الطبيعية مع تصحيح اللون والاصطفاف بالكامل. تشعر وكأنك في أتيليه فني راقٍ بقدر ما هي عيادة طبية متطورة.',
          year: 'مريضة منذ 2023',
        },
      ],
    },
    emergency: {
      kicker: 'طوارئ الأسنان',
      title: 'ألم حاد في الأسنان، إصابة طارئة، أو كسر سن؟',
      description:
        'نخصص يومياً أوقاتاً مسبقة لحالات الطوارئ السريرية العاجلة في نفس اليوم. اتصل فوراً للتحدث مع منسق الطوارئ الطبي.',
      callNow: 'اتصل الآن (555) 911-SMILE',
      urgentRequest: 'طلب فرز طارئ أونلاين',
      modalTitle: 'فرز طوارئ الأسنان الفوري',
      modalDesc:
        'إذا كنت تعاني من سقوط سن بالكامل نتيجة صدمة، نزيف حاد، أو انتفاخ شديد، فإن جراح الأسنان المناوب متاح للتدخل الفوري.',
      bookPriority: 'حجز موعد أولوية قصوى أونلاين',
    },
    footer: {
      address: '740 بارك أفينيو، جناح 1200\nسان فرانسيسكو، كاليفورنيا 94108',
      hoursTitle: 'ساعات العمل',
      monFri: 'الإثنين - الجمعة: 8:00 ص - 6:00 م',
      sat: 'السبت: 9:00 ص - 3:00 م',
      sun: 'الأحد: طوارئ تحت الطلب',
      contactTitle: 'التواصل المباشر',
      desk: 'الاستقبال: (555) 321-SMILE',
      emergency: 'الطوارئ: (555) 911-SMILE',
      accreditationsTitle: 'الاعتمادات الدولية',
      ada: 'الجمعية الأمريكية لطب الأسنان (ADA)',
      aacd: 'الأكاديمية الأمريكية لطب الأسنان التجميلي (AACD)',
      invisalign: 'مزود ماسي معتمد لإنفزلاين®',
      copyright: '© 2026 عيادة لومينا لطب وتجميل الأسنان. متوافق مع معايير HIPAA وOSHA.',
      staffPortal: 'بوابة الإدارة',
      backToTop: 'العودة للأعلى ↑',
    },
    staffModal: {
      portalTitle: 'بوابة الطاقم السريري',
      enterPin: 'أدخل رمز الدخول (PIN)',
      quickDemo: 'دخول تجريبي سريع',
      scheduleTitle: 'جدول مواعيد العيادة',
      signOut: 'تسجيل الخروج',
    },
    bookingModal: {
      kicker: 'حجز الموعد',
      title: 'جدولة زيارتك الطبية للعيادة.',
      steps: {
        procedure: 'الإجراء',
        doctor: 'الطبيب',
        schedule: 'الموعد',
        patient: 'المريض',
        review: 'التأكيد',
      },
      newPatient: 'مريض جديد',
      returningPatient: 'مريض سابق',
      selectProcedureHint: 'اختر الإجراء الطبي المطلوب',
      selectDoctorHint: 'اختر الطبيب المعالج المتخصص',
      selectDate: 'اختر التاريخ المناسب',
      availableSlots: 'المواعيد الشاغرة المتاحة',
      patientDetails: 'بيانات التواصل للمريض',
      firstName: 'الاسم الأول *',
      lastName: 'اسم العائلة *',
      email: 'البريد الإلكتروني *',
      phone: 'رقم الهاتف المحمول *',
      notesPlaceholder: 'أي ملاحظات خاصة بالراحة، الخوف، أو التاريخ الطبي (اختياري)...',
      back: 'السابق',
      continue: 'متابعة',
      confirm: 'تأكيد حجز الموعد',
      confirmedTitle: 'تم تأكيد الموعد بنجاح',
      confirmedDesc: 'تم تأكيد موعدك بنجاح. أُرسلت تفاصيل الحجز وتذكرة التقويم إلى بريدك الإلكتروني.',
      returnHome: 'العودة للرئيسية',
    },
    assessmentModal: {
      kicker: 'طلب استشارة سريرية مباشرة',
      title: 'تقييم الابتسامة المباشر من الطبيب الاستشاري.',
      concernsTitle: '1. ما الذي تود تحسينه في ابتسامتك؟',
      photoTitle: '2. صورة واضحة للابتسامة (اختياري)',
      photoDropHint: 'ارفع صورة واضحة لابتسامتك',
      photoSub: 'صيغة JPG أو PNG بحجم أقل من 10 ميغابايت',
      notesTitle: '3. تفاصيل أو تاريخ طبي تود ذكره',
      notesPlaceholder: 'أخبر أطباءنا عن أي حساسية، مناسبة قريبة، أو علاجات سابقة...',
      contactTitle: '4. بيانات التواصل',
      submitBtn: 'إرسال الحالة للدكتور الاستشاري',
      submittingBtn: 'جاري إرسال الحالة للطبيب المختص...',
      submittedTitle: 'تم إرسال حالتك للطبيب الاستشاري بنجاح',
      submittedDesc: 'تم تحويل صور ابتسامتك وملاحظاتك إلى الطبيب الاستشاري المختص مباشرة. سيقوم الطبيب بدراسة الحالة سريرياً والتواصل معك هاتفياً وعبر البريد الإلكتروني لإبلاغك بالتشخيص وخطة العلاج.',
      bookInPerson: 'حجز موعد كشف مباشر في العيادة',
      close: 'إغلاق',
      concernsList: [
        'اصطفاف الأسنان والتزاحم',
        'تصبغات واصفرار المينا',
        'تآكل أو كسور في أطراف الأسنان',
        'الفراغات والمسافات بين الأسنان',
        'حساسية الأسنان',
        'سن مفقود / تعويضات سابقة',
      ],
    },
  },
};

export const ARABIC_SERVICES_MAP: Record<string, { name: string; description: string }> = {
  'srv-1': {
    name: 'فحص لومينا الشامل ثلاثي الأبعاد مع جلسة تنظيف سويسرية Airflow',
    description: 'مسح فموي رقمي متكامل 3D، تصوير بانورامي بأقل إشعاع، فحص شامل لصحة اللثة والأنسجة، وتنظيف بالموجات فوق الصوتية بدون ألم.'
  },
  'srv-2': {
    name: 'تبييض الأسنان بالليزر الحيوي (Zoom Ultimate)',
    description: 'تبييض بالليزر داخل العيادة يزيل التصبغات العميقة حتى 8 درجات بمقياس VITA خلال 45 دقيقة فقط بدون حساسية المينا.'
  },
  'srv-3': {
    name: 'عدسات الفينير الخزفية الفاخرة (Porcelain Veneers)',
    description: 'عدسات بورسلين مجهرية فائقة الرقة تصنع يدوياً في المعمل لضبط استقامة ولون وحيوية الابتسامة بأعلى دقة.'
  },
  'srv-4': {
    name: 'تقويم الأسنان الشفاف إنفزلاين® (Invisalign Diamond)',
    description: 'مسح ضوئي ثلاثي الأبعاد iTero مع محاكاة فورية للابتسامة النهائية، ومجموعات تقويم شفافة ومريحة مع متابعة دورية ذكية.'
  },
  'srv-5': {
    name: 'زراعة الأسنان الرقمية الفورية ثلاثية الأبعاد (3D Guided Implant)',
    description: 'تثبيت الغرسة التيتانيومية بالدليل الجراحي الرقمي وتركيب التاج الخزفي في نفس الجلسة بدقة متناهية وبدون جراحة تقليدية.'
  },
  'srv-6': {
    name: 'التاج الخزفي في نفس اليوم (Same-Day CEREC Crown)',
    description: 'مسح رقمي وخرط آلي للتاج من كتلة زركونيا أو إيماكس عالية النقاوة وتركيبه خلال 45 دقيقة بدون طبعات سيليكون.'
  },
  'srv-7': {
    name: 'طوارئ الأسنان السريرية العاجلة (Same-Day Emergency)',
    description: 'تشخيص فوري وعلاج تسكين الألم، معالجة كسور الأسنان، أو سقوط التركيبات مع جراح الأسنان المناوب في نفس اليوم.'
  }
};

export const ARABIC_DOCTORS_MAP: Record<string, { name: string; specialty: string; bio: string; nextAvailable: string }> = {
  'doc-1': {
    name: 'د. سارة تشن',
    specialty: 'استشارية تجميل الأسنان وعدسات الفينير',
    bio: 'رائدة في تقنيات الفينير المحافظ بأقل قدر من التحضير، وتصميم الابتسامة الرقمي بخبرة سريرية تزيد عن 14 عاماً في بيفرلي هيلز وسان فرانسيسكو.',
    nextAvailable: 'غداً الساعة 10:00 صباحاً'
  },
  'doc-2': {
    name: 'د. ماركوس فانس',
    specialty: 'استشاري تقويم الأسنان ومزود ماسي لإنفزلاين®',
    bio: 'أخصائي علاج التقويم الشفاف المتسارع، وتناسق ملامح الوجه ومجرى التنفس، وتقويم الأسنان المخصص للبالغين والمراهقين.',
    nextAvailable: 'الخميس الساعة 2:30 ظهراً'
  },
  'doc-3': {
    name: 'د. إيلينا روستوفا',
    specialty: 'استشارية جراحة وزراعة الأسنان والترميم الشامل',
    bio: 'استشارية معتمدة متخصصة في الزراعة الموجهة ثلاثية الأبعاد في نفس اليوم، وتجديد العظام المعقد، وإعادة بناء الفك الكامل بالزركونيا.',
    nextAvailable: 'الجمعة الساعة 9:00 صباحاً'
  },
  'doc-4': {
    name: 'د. إيلين ستيرلينغ',
    specialty: 'أخصائية الرعاية الوقائية وطب الأسنان الهادئ',
    bio: 'خبيرة بارزة في طب الأسنان الوقائي اللطيف، علاج التسوس بالليزر، وتقديم جلسات علاجية خالية تماماً من الخوف والقلق للأطفال والبالغين.',
    nextAvailable: 'غداً الساعة 1:15 ظهراً'
  }
};

export const ARABIC_CASES_MAP: Record<string, { title: string; category: string; doctor: string; duration: string; technique: string; description: string }> = {
  'case-1': {
    title: 'عدسات فينير خزفية مصنوعة يدوياً',
    category: 'تجميل الأسنان',
    doctor: 'د. سارة تشن',
    duration: 'جلستان (8 أيام)',
    technique: 'سيراميك فلسباثيك فائق النحافة بسماكة 0.3 مم',
    description: 'تركيب 8 عدسات رقيقة جداً لعلاج التصبغات وتكسر الحواف وتعديل تماثل القوس السني بانعكاس ضوئي طبيعي.'
  },
  'case-2': {
    title: 'علاج التقويم الشفاف إنفزلاين®',
    category: 'التقويم الشفاف',
    doctor: 'د. ماركوس فانس',
    duration: '6 أشهر',
    technique: 'قوالب شفافة متسارعة',
    description: 'تصحيح العضة العميقة وتزاحم الأسنان الأمامية دون أي أقواس معدنية أو خلع أسنان باستخدام قوالب شفافة أسبوعية مريحة.'
  },
  'case-3': {
    title: 'تبييض الأسنان بالليزر (Zoom Ultimate)',
    category: 'التبييض',
    doctor: 'د. سارة تشن',
    duration: '45 دقيقة',
    technique: 'تبييض بالليزر والتنشيط الضوئي',
    description: 'تفتيح تصبغات القهوة والشاي بمقدار 8 درجات كاملة على مقياس VITA في جلسة ليزر واحدة مع جل واقٍ لحماية المينا.'
  },
  'case-4': {
    title: 'إعادة تأهيل كامل بالزراعة الموجهة All-on-4',
    category: 'الترميم والزراعة',
    doctor: 'د. إيلينا روستوفا',
    duration: 'أسنان في نفس اليوم',
    technique: 'غرسات تيتانيوم مع جسر زركونيا متراص',
    description: 'استبدال كامل للقوس السني باستخدام 4 غرسات تيتانيوم موجهة رقمياً وجسر زركونيا ثابت لوظيفة دائمة وابتسامة شابة.'
  }
};

