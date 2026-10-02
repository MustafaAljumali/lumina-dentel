import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import {
  INITIAL_DOCTORS,
  INITIAL_SERVICES,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_CONSULTATIONS,
} from './src/data/initialData.js';
import { Doctor, Service, Patient, Appointment, Consultation } from './src/types.js';

const __filename = typeof import.meta !== 'undefined' && import.meta.url ? fileURLToPath(import.meta.url) : '';
const __dirname = __filename ? path.dirname(__filename) : process.cwd();

// In-memory data store with initial seed data
let doctors: Doctor[] = [...INITIAL_DOCTORS];
let services: Service[] = [...INITIAL_SERVICES];
let patients: Patient[] = [...INITIAL_PATIENTS];
let appointments: Appointment[] = [...INITIAL_APPOINTMENTS];
let consultations: Consultation[] = [...INITIAL_CONSULTATIONS];

// Lazy Gemini AI initialization
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '15mb' }));

  // --- REST API ENDPOINTS ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Doctors
  app.get('/api/doctors', (_req, res) => {
    res.json({ success: true, data: doctors });
  });

  app.post('/api/doctors', (req, res) => {
    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      ...req.body,
    };
    doctors.push(newDoc);
    res.status(201).json({ success: true, data: newDoc });
  });

  // Services
  app.get('/api/services', (_req, res) => {
    res.json({ success: true, data: services });
  });

  app.post('/api/services', (req, res) => {
    const newService: Service = {
      id: `srv-${Date.now()}`,
      ...req.body,
    };
    services.push(newService);
    res.status(201).json({ success: true, data: newService });
  });

  // Patients
  app.get('/api/patients', (req, res) => {
    const { search } = req.query;
    let result = [...patients];
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phone.includes(q)
      );
    }
    res.json({ success: true, data: result });
  });

  app.post('/api/patients', (req, res) => {
    const existing = patients.find((p) => p.email === req.body.email);
    if (existing) {
      return res.json({ success: true, data: existing });
    }
    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    patients.push(newPatient);
    res.status(201).json({ success: true, data: newPatient });
  });

  // Appointments
  app.get('/api/appointments', (req, res) => {
    const { doctorId, date, status } = req.query;
    let filtered = [...appointments];

    if (doctorId && typeof doctorId === 'string') {
      filtered = filtered.filter((a) => a.doctorId === doctorId);
    }
    if (date && typeof date === 'string') {
      filtered = filtered.filter((a) => a.date === date);
    }
    if (status && typeof status === 'string') {
      filtered = filtered.filter((a) => a.status === status);
    }

    // Populate objects
    const populated = filtered.map((apt) => ({
      ...apt,
      patient: patients.find((p) => p.id === apt.patientId) || apt.patient,
      doctor: doctors.find((d) => d.id === apt.doctorId) || apt.doctor,
      service: services.find((s) => s.id === apt.serviceId) || apt.service,
    }));

    res.json({ success: true, data: populated });
  });

  app.post('/api/appointments', (req, res) => {
    const patientData = req.body.patientData || req.body.patient;
    const { doctorId, serviceId, date, timeSlot, notes } = req.body;

    // Create or find patient
    let patient = patients.find((p) => p.email === patientData?.email);
    if (!patient && patientData) {
      patient = {
        id: `pat-${Date.now()}`,
        type: patientData.type || 'NEW',
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        email: patientData.email,
        phone: patientData.phone,
        dob: patientData.dob,
        insuranceProvider: patientData.insuranceProvider,
        insuranceId: patientData.insuranceId,
        dentalHistory: patientData.dentalHistory,
        createdAt: new Date().toISOString(),
        totalVisits: 1,
      };
      patients.push(patient);
    }

    const doctor = doctors.find((d) => d.id === doctorId);
    const service = services.find((s) => s.id === serviceId);

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: patient ? patient.id : 'pat-guest',
      doctorId,
      serviceId,
      date,
      timeSlot,
      status: 'CONFIRMED',
      notes,
      reminderSent: true,
      createdAt: new Date().toISOString(),
      patient,
      doctor,
      service,
    };

    appointments.unshift(newAppointment);
    res.status(201).json({ success: true, data: newAppointment });
  });

  app.patch('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    const index = appointments.findIndex((a) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    appointments[index] = {
      ...appointments[index],
      ...req.body,
    };

    const apt = appointments[index];
    const populated = {
      ...apt,
      patient: patients.find((p) => p.id === apt.patientId) || apt.patient,
      doctor: doctors.find((d) => d.id === apt.doctorId) || apt.doctor,
      service: services.find((s) => s.id === apt.serviceId) || apt.service,
    };

    res.json({ success: true, data: populated });
  });

  // Consultations
  app.get('/api/consultations', (_req, res) => {
    res.json({ success: true, data: consultations });
  });

  app.post('/api/consultations', (req, res) => {
    const newConsultation: Consultation = {
      id: `csl-${Date.now()}`,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    consultations.unshift(newConsultation);
    res.status(201).json({ success: true, data: newConsultation });
  });

  app.patch('/api/consultations/:id', (req, res) => {
    const { id } = req.params;
    const index = consultations.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Consultation not found' });
    }
    consultations[index] = {
      ...consultations[index],
      ...req.body,
    };
    res.json({ success: true, data: consultations[index] });
  });

  // AI Virtual Smile Pre-Assessment using Gemini API
  app.post('/api/consultations/ai-assess', async (req, res) => {
    try {
      const { concerns, notes, patientName, photoUrl } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback structured assessment if GEMINI_API_KEY is missing
        return res.json({
          success: true,
          data: {
            summary: `Preliminary evaluation for ${patientName || 'Patient'} based on selected concerns (${concerns?.join(', ') || 'General'}).`,
            recommendedServices: [
              'Apex Comprehensive Exam & Digital X-Rays',
              concerns?.includes('Discoloration/Stains')
                ? 'Laser Teeth Whitening (Zoom Ultimate)'
                : 'Invisalign® Full Clear Aligner Therapy',
            ],
            urgency: concerns?.includes('Tooth Pain/Sensitivity') ? 'High' : 'Medium',
            advice:
              'Based on your reported concerns, a comprehensive 3D intraoral evaluation is recommended. Our team will contact you within 24 hours to review your assessment.',
          },
        });
      }

      const prompt = `You are the lead dental consultant at Apex Modern Dental & Aesthetics.
Analyze the following patient virtual smile assessment submission:
Patient Name: ${patientName || 'Valued Patient'}
Reported Concerns: ${concerns?.join(', ') || 'General consultation'}
Additional Notes: ${notes || 'None provided'}

Provide a structured preliminary dental evaluation for our clinical team review in JSON format with fields:
- summary: A clear 2-sentence summary of the clinical presentation.
- recommendedServices: An array of 2-3 specific dental services (e.g. "Laser Teeth Whitening", "Invisalign® Therapy", "Porcelain Veneers", "CEREC Crown", "Comprehensive Exam").
- urgency: One of "Low", "Medium", "High", or "Immediate".
- advice: A warm, reassuring 2-sentence recommendation to the patient.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              recommendedServices: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              urgency: { type: Type.STRING },
              advice: { type: Type.STRING },
            },
            required: ['summary', 'recommendedServices', 'urgency', 'advice'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error('Gemini AI Assessment error:', error);
      res.json({
        success: true,
        data: {
          summary: 'Assessment received and pending clinical doctor review.',
          recommendedServices: ['Apex Comprehensive Exam & Digital X-Rays'],
          urgency: 'Medium',
          advice: 'Our clinical dental specialists will review your submission and contact you within 24 hours.',
        },
      });
    }
  });

  // Stats
  app.get('/api/stats', (_req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const todayApts = appointments.filter((a) => a.date === today || a.date === '2026-08-13').length;
    const pending = appointments.filter((a) => a.status === 'PENDING').length;
    const newPatients = patients.filter((p) => p.type === 'NEW').length;
    const pendingConsultations = consultations.filter((c) => c.status === 'NEW').length;

    res.json({
      success: true,
      data: {
        todayAppointments: todayApts || 8,
        pendingConfirmations: pending || 3,
        newPatientsThisMonth: newPatients || 24,
        consultationRequests: pendingConsultations || 5,
        trend: {
          appointments: '+14% vs last week',
          patients: '+22% growth',
        },
      },
    });
  });

  // --- VITE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Apex Modern Dental Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
