import { Doctor, Service, Patient, Appointment, Consultation } from '../types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Chen',
    title: 'DDS, MS',
    specialty: 'Cosmetic & Aesthetic Dentistry',
    bio: 'Pioneer in minimally invasive porcelain veneers, aesthetic smile makeovers, and laser smile contouring with over 14 years of clinical excellence in Beverly Hills and San Francisco.',
    education: [
      { degree: 'DDS', institution: 'UCLA School of Dentistry', year: '2010' },
      { degree: 'MS in Prosthodontics', institution: 'Columbia University', year: '2012' }
    ],
    photo: '/images/dr_sarah_chen.jpg',
    isActive: true,
    nextAvailable: 'Tomorrow at 10:00 AM'
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Vance',
    title: 'DMD',
    specialty: 'Orthodontics & Invisalign® Diamond Provider',
    bio: 'Specialist in accelerated clear aligner therapy, airway-centric facial development, and custom lingual orthodontic systems for teens and adults.',
    education: [
      { degree: 'DMD', institution: 'Harvard School of Dental Medicine', year: '2013' },
      { degree: 'Orthodontic Residency', institution: 'UCSF Dental Center', year: '2015' }
    ],
    photo: '/images/dr_marcus_vance.jpg',
    isActive: true,
    nextAvailable: 'Thursday at 2:30 PM'
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rostova',
    title: 'DDS, PhD',
    specialty: 'Implantology & Restorative Surgery',
    bio: 'Board-certified implant surgeon specializing in 3D guided same-day dental implants, complex bone regeneration, and full-arch monolithic zirconia restorations.',
    education: [
      { degree: 'DDS', institution: 'University of Michigan', year: '2011' },
      { degree: 'PhD in Biomaterials', institution: 'Johns Hopkins University', year: '2015' }
    ],
    photo: '/images/dr_elena_rostova.jpg',
    isActive: true,
    nextAvailable: 'Friday at 9:00 AM'
  },
  {
    id: 'doc-4',
    name: 'Dr. Eileen Sterling',
    title: 'DDS, FAGD',
    specialty: 'Pediatric & Preventative Care Specialist',
    bio: 'Renowned expert in gentle preventative dentistry, laser cavity prevention, and anxiety-free patient care with over 12 years of specialized practice.',
    education: [
      { degree: 'DDS', institution: 'Penn Dental Medicine', year: '2012' },
      { degree: 'Fellowship in General Dentistry', institution: 'AGD Academy', year: '2015' }
    ],
    photo: '/images/dr_eileen_sterling.jpg',
    isActive: true,
    nextAvailable: 'Tomorrow at 1:15 PM'
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'LUMINA Signature 3D Wellness Exam & Airflow Spa',
    category: 'PREVENTIVE',
    description: 'Comprehensive 3D intraoral digital scan, ultra-low-radiation panoramic imaging, oral cancer screening, and Swiss Airflow painless ultrasonic hygiene.',
    duration: 60,
    basePrice: 195,
    isPopular: true
  },
  {
    id: 'srv-2',
    name: 'Biolase Laser Teeth Whitening (Zoom Ultimate)',
    category: 'COSMETIC',
    description: 'In-office activation laser whitening lifting stubborn coffee and tea stains up to 8 VITA shades in 45 minutes with zero tooth enamel dehydration.',
    duration: 45,
    basePrice: 450,
    isPopular: true
  },
  {
    id: 'srv-3',
    name: 'Handcrafted Feldspathic Porcelain Veneers',
    category: 'COSMETIC',
    description: 'Master ceramist custom-crafted ultra-thin porcelain shells designed with digital 3D aesthetic previews to permanently perfect shape, shade, and alignment.',
    duration: 90,
    basePrice: 1250,
    isPopular: true
  },
  {
    id: 'srv-4',
    name: 'Invisalign® Diamond Clear Aligner Therapy',
    category: 'ORTHODONTICS',
    description: 'Full 3D iTero scan with simulated outcome visualization, custom transparent aligner sets, and weekly AI progress monitoring through patient app.',
    duration: 30,
    basePrice: 4800,
    isPopular: true
  },
  {
    id: 'srv-5',
    name: 'CEREC® 3D Same-Day Porcelain Crown',
    category: 'RESTORATIVE',
    description: 'Computer-guided precision milled high-translucency ceramic crown designed and placed in a single visit without unpleasant impression putty or temporaries.',
    duration: 75,
    basePrice: 980
  },
  {
    id: 'srv-6',
    name: '3D Guided Titanium Dental Implant & Zirconia Crown',
    category: 'RESTORATIVE',
    description: 'Computer-guided biocompatible titanium post with custom zirconia abutment and natural lifelike crown replacement engineered for lifetime durability.',
    duration: 90,
    basePrice: 2850
  },
  {
    id: 'srv-7',
    name: 'All-on-4 / All-on-6 Full Arch Zirconia Rehabilitation',
    category: 'RESTORATIVE',
    description: 'Permanent total arch replacement utilizing 4 to 6 titanium implants supporting a monolithic zirconia hybrid bridge with same-day functional smile.',
    duration: 180,
    basePrice: 14500
  },
  {
    id: 'srv-8',
    name: 'Urgent Emergency Dental Triage & Immediate Relief',
    category: 'EMERGENCY',
    description: 'Immediate same-day priority appointment for acute toothache, chipped or knocked-out tooth, dislodged crown, or traumatic facial injury.',
    duration: 45,
    basePrice: 220
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-101',
    type: 'RETURNING',
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.m@example.com',
    phone: '(555) 234-5678',
    dob: '1992-05-14',
    insuranceProvider: 'Delta Dental Premier',
    insuranceId: 'DEL-8849201',
    dentalHistory: 'Regular cleanings every 6 months. Completed Zoom Whitening with Dr. Chen.',
    createdAt: '2025-01-15T10:00:00Z',
    totalVisits: 4,
    lastVisit: '2026-02-10'
  },
  {
    id: 'pat-102',
    type: 'NEW',
    firstName: 'Alexander',
    lastName: 'Wright',
    email: 'alex.wright@example.com',
    phone: '(555) 345-6789',
    dob: '1988-11-23',
    insuranceProvider: 'Cigna Dental PPO',
    insuranceId: 'CIG-9938102',
    dentalHistory: 'Slight tooth sensitivity on upper left molars.',
    createdAt: '2026-08-01T14:30:00Z',
    totalVisits: 1,
    lastVisit: '2026-08-05'
  },
  {
    id: 'pat-103',
    type: 'NEW',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'emily.chen@example.com',
    phone: '(555) 876-5432',
    dob: '1995-03-08',
    insuranceProvider: 'Aetna Dental Options',
    insuranceId: 'AET-4491029',
    dentalHistory: 'Interested in Invisalign consultation for lower crowding.',
    createdAt: '2026-08-10T09:15:00Z',
    totalVisits: 0
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-501',
    patientId: 'pat-101',
    doctorId: 'doc-1',
    serviceId: 'srv-2',
    date: '2026-08-13',
    timeSlot: '09:00 AM',
    status: 'CONFIRMED',
    notes: 'Patient requested extra shade check before whitening.',
    reminderSent: true,
    createdAt: '2026-08-08T11:00:00Z',
    patient: INITIAL_PATIENTS[0],
    doctor: INITIAL_DOCTORS[0],
    service: INITIAL_SERVICES[1]
  },
  {
    id: 'apt-502',
    patientId: 'pat-102',
    doctorId: 'doc-2',
    serviceId: 'srv-4',
    date: '2026-08-13',
    timeSlot: '11:30 AM',
    status: 'PENDING',
    notes: 'Initial Invisalign 3D scan and simulation consultation.',
    reminderSent: false,
    createdAt: '2026-08-11T16:20:00Z',
    patient: INITIAL_PATIENTS[1],
    doctor: INITIAL_DOCTORS[1],
    service: INITIAL_SERVICES[3]
  }
];

export const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: 'csl-201',
    patientName: 'Hannah Davies',
    email: 'hannah.d@example.com',
    phone: '(555) 901-2345',
    concerns: ['Discoloration/Stains', 'Chipped or Broken Teeth'],
    notes: 'Planning a wedding in 4 months and would love porcelain veneer consultation for my front smile teeth.',
    status: 'REVIEWED',
    aiAssessment: {
      summary: 'Candidate presents moderate incisal chipping on upper central incisors and mild enamel chromogenic staining. Excellent candidate for minimal-prep porcelain veneers or laser whitening.',
      recommendedServices: ['Handcrafted Feldspathic Porcelain Veneers', 'Laser Teeth Whitening (Zoom Ultimate)'],
      urgency: 'Medium',
      advice: 'Schedule a 3D digital smile simulation with Dr. Sarah Chen to review mock-up before final fabrication.'
    },
    createdAt: '2026-08-12T13:45:00Z'
  }
];
