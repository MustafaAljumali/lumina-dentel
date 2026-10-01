import React, { useState } from 'react';
import { Appointment, Doctor, AppointmentStatus } from '../../types';
import { Calendar, Search, Filter, Clock, CheckCircle2, XCircle, AlertCircle, Phone, Mail, Edit3 } from 'lucide-react';

interface AppointmentsManagerProps {
  appointments: Appointment[];
  doctors: Doctor[];
  onUpdateStatus: (aptId: string, status: AppointmentStatus) => void;
}

export const AppointmentsManager: React.FC<AppointmentsManagerProps> = ({
  appointments,
  doctors,
  onUpdateStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterDoctor, setFilterDoctor] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter((apt) => {
    if (filterStatus !== 'ALL' && apt.status !== filterStatus) return false;
    if (filterDoctor !== 'ALL' && apt.doctorId !== filterDoctor) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const patientName = `${apt.patient?.firstName} ${apt.patient?.lastName}`.toLowerCase();
      const serviceName = apt.service?.name.toLowerCase() || '';
      return patientName.includes(q) || serviceName.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient or treatment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Doctor Filter */}
          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="p-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Specialists</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-200 text-[#0F2C59] uppercase text-[11px] font-extrabold tracking-wider">
                <th className="p-4">Date & Time</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Treatment</th>
                <th className="p-4">Doctor</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-[#0F2C59] font-data">
                    {apt.date} at {apt.timeSlot}
                  </td>
                  <td className="p-4">
                    <p className="font-extrabold text-[#0F2C59]">
                      {apt.patient?.firstName} {apt.patient?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{apt.patient?.phone}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{apt.service?.name}</p>
                    <p className="text-xs text-slate-400 font-data">${apt.service?.basePrice}</p>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{apt.doctor?.name}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        apt.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : apt.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedApt(apt)}
                      className="px-3 py-1.5 rounded-xl bg-[#0F2C59] text-white text-xs font-bold hover:bg-slate-800"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-[#14B8A6]">
                Manage Appointment #{selectedApt.id}
              </span>
              <button
                onClick={() => setSelectedApt(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-extrabold text-base text-[#0F2C59]">
                  {selectedApt.patient?.firstName} {selectedApt.patient?.lastName}
                </p>
                <p className="text-slate-600">Email: {selectedApt.patient?.email}</p>
                <p className="text-slate-600">Phone: {selectedApt.patient?.phone}</p>
                <p className="text-slate-600">Insurance: {selectedApt.patient?.insuranceProvider}</p>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-bold text-slate-700">Treatment:</span>
                <span className="font-semibold text-[#0F2C59]">{selectedApt.service?.name}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-bold text-slate-700">Specialist:</span>
                <span className="font-semibold text-[#0F2C59]">{selectedApt.doctor?.name}</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#0F2C59] mb-1">
                  Update Appointment Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'] as AppointmentStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateStatus(selectedApt.id, st);
                        setSelectedApt({ ...selectedApt, status: st });
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedApt.status === st
                          ? 'bg-[#0F2C59] text-white border-[#0F2C59]'
                          : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedApt(null)}
                className="px-6 py-2.5 rounded-xl font-bold bg-[#D4AF37] text-[#0F2C59] hover:bg-[#c4a130] text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
