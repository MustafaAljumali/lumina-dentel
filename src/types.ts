export type ServiceCategory = 'PREVENTIVE' | 'COSMETIC' | 'RESTORATIVE' | 'ORTHODONTICS' | 'EMERGENCY';

export interface Doctor {
  id: string;
  name: string;
  title: string; // "DDS", "DMD", "MS"
  specialty: string;
  bio: string;
  education: Array<{ degree: string; institution: string; year: string }>;
  photo: string;
  isActive: boolean;
  nextAvailable: string; // e.g. "Tomorrow" or "Aug 15"
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  duration: number; // minutes
  basePrice: number;
  isPopular?: boolean;
}

export type PatientType = 'NEW' | 'RETURNING';

export interface Patient {
  id: string;
  type: PatientType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  insuranceProvider?: string;
  insuranceId?: string;
  dentalHistory?: string;
  createdAt: string;
  totalVisits?: number;
  lastVisit?: string;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  serviceId: string;
  date: string; // ISO string or YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 AM"
  status: AppointmentStatus;
  notes?: string;
  reminderSent: boolean;
  createdAt: string;
  // Included populated objects for UI convenience
  patient?: Patient;
  doctor?: Doctor;
  service?: Service;
}

export type ConsultationStatus = 'NEW' | 'REVIEWED' | 'RESPONDED';

export interface Consultation {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  photoUrl?: string;
  concerns: string[]; // e.g., ["crowding", "discoloration", "gaps", "pain"]
  notes?: string;
  status: ConsultationStatus;
  adminNotes?: string;
  aiAssessment?: {
    summary: string;
    recommendedServices: string[];
    urgency: 'Low' | 'Medium' | 'High' | 'Immediate';
    advice: string;
  };
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  isBlocked: boolean;
}

export interface ClinicStats {
  todayAppointments: number;
  pendingConfirmations: number;
  newPatientsThisMonth: number;
  consultationRequests: number;
  trend: {
    appointments: string;
    patients: string;
  };
}

export type StaffRole = 'admin' | 'receptionist' | 'doctor';
export type UserRole = 'ADMIN' | 'RECEPTIONIST' | 'DOCTOR';

export interface StaffUser {
  id: string;
  name: string;
  role: StaffRole;
  avatar: string;
}
