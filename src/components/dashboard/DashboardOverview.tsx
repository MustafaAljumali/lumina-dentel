import React from 'react';
import { Appointment, Consultation, Patient, ClinicStats } from '../../types';
import { Calendar, Users, FileText, CheckCircle2, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface DashboardOverviewProps {
  stats: ClinicStats;
  appointments: Appointment[];
  consultations: Consultation[];
  patients: Patient[];
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  appointments,
  consultations,
  patients,
  onNavigateTab,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(
    (a) => a.date === todayStr || a.date === '2026-08-13'
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Today's Appointments</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-black text-[#0F2C59] font-data">{stats.todayAppointments}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {stats.trend.appointments}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Pending Confirmations</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-black text-[#0F2C59] font-data">{stats.pendingConfirmations}</span>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs font-bold text-amber-600 hover:underline"
            >
              Review List
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">New Patients (Month)</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#14B8A6] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-black text-[#0F2C59] font-data">{stats.newPatientsThisMonth}</span>
            <span className="text-xs font-bold text-teal-600">{stats.trend.patients}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Specialists & Doctors</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-black text-[#0F2C59] font-data">Active</span>
            <button
              onClick={() => onNavigateTab('doctors')}
              className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
            >
              Manage Doctors →
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Visual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Appointments Volume Chart Simulation */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-[#0F2C59]">Appointment Analytics (Last 30 Days)</h3>
              <p className="text-xs text-slate-500">Patient booking trends across specialties</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">Monthly</span>
          </div>

          {/* Visual Bar Chart */}
          <div className="pt-4 flex items-end justify-between h-48 px-2 border-b border-slate-100">
            {[
              { day: 'Mon', count: 12, height: '60%' },
              { day: 'Tue', count: 18, height: '85%' },
              { day: 'Wed', count: 14, height: '70%' },
              { day: 'Thu', count: 22, height: '95%' },
              { day: 'Fri', count: 16, height: '80%' },
              { day: 'Sat', count: 8, height: '40%' },
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 group">
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#0F2C59]">{bar.count}</span>
                <div
                  className="w-10 rounded-t-lg bg-gradient-to-t from-[#0F2C59] to-[#14B8A6] group-hover:opacity-90 transition-all duration-300"
                  style={{ height: bar.height }}
                />
                <span className="text-xs font-bold text-slate-600">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Distribution */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-[#0F2C59]">Requested Services</h3>
          <p className="text-xs text-slate-500">Breakdown of procedure volume</p>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Preventive Exam & Cleanings</span>
                <span>42%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#14B8A6] w-[42%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Invisalign® Orthodontics</span>
                <span>28%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-600 w-[28%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Teeth Whitening & Veneers</span>
                <span>18%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#D4AF37] w-[18%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>CEREC Same-Day Crowns</span>
                <span>12%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#0F2C59] w-[12%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Timeline Schedule */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-[#0F2C59]">Today's Operational Schedule</h3>
          <button
            onClick={() => onNavigateTab('appointments')}
            className="text-xs font-bold text-[#14B8A6] hover:underline"
          >
            View Full Calendar →
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          {todayAppointments.map((apt) => (
            <div key={apt.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-[#0F2C59] w-20 font-data">{apt.timeSlot}</span>
                <div>
                  <p className="font-extrabold text-[#0F2C59]">{apt.patient?.firstName} {apt.patient?.lastName}</p>
                  <p className="text-xs text-slate-500">{apt.service?.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-slate-600">{apt.doctor?.name}</span>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    apt.status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : apt.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
