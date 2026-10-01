import React, { useState } from 'react';
import { Patient } from '../../types';
import { Search, UserCheck, ShieldCheck, Phone, Mail, Calendar, Edit3, X } from 'lucide-react';

interface PatientsManagerProps {
  patients: Patient[];
}

export const PatientsManager: React.FC<PatientsManagerProps> = ({ patients }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = patients.filter((p) => {
    const name = `${p.firstName} ${p.lastName}`.toLowerCase();
    const email = p.email.toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
          />
        </div>

        <span className="text-xs font-bold text-slate-500">
          Total Registered: <span className="text-[#0F2C59] font-data">{patients.length} Patients</span>
        </span>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-200 text-[#0F2C59] uppercase text-[11px] font-extrabold tracking-wider">
                <th className="p-4">Patient Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Insurance Provider</th>
                <th className="p-4">Total Visits</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <p className="font-extrabold text-[#0F2C59]">{p.firstName} {p.lastName}</p>
                    <p className="text-[11px] text-slate-400">DOB: {p.dob || '1990-01-01'}</p>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        p.type === 'NEW' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {p.type === 'NEW' ? 'New Patient' : 'Returning'}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-slate-800">{p.email}</p>
                    <p className="text-xs text-slate-400">{p.phone}</p>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">
                    {p.insuranceProvider || 'Self-Pay'}
                  </td>
                  <td className="p-4 font-bold text-[#0F2C59] font-data">
                    {p.visitsCount || 1} Visits
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedPatient(p)}
                      className="px-3 py-1.5 rounded-xl bg-[#0F2C59] text-white text-xs font-bold hover:bg-slate-800"
                    >
                      View Record
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Profile Drawer / Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-white h-full max-w-md w-full p-6 sm:p-8 shadow-2xl border-l border-slate-200 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-[#14B8A6]">
                Patient File #{selectedPatient.id}
              </span>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-1">
                <h3 className="text-2xl font-extrabold text-[#0F2C59]">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </h3>
                <p className="text-slate-500">{selectedPatient.email}</p>
                <p className="text-slate-500">{selectedPatient.phone}</p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-[#0F2C59] uppercase text-xs">Medical & Insurance Overview</p>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-slate-700">
                  <p><span className="font-bold">Insurance:</span> {selectedPatient.insuranceProvider}</p>
                  <p><span className="font-bold">Date of Birth:</span> {selectedPatient.dob}</p>
                  <p><span className="font-bold">Patient Type:</span> {selectedPatient.type}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-[#0F2C59] uppercase text-xs">Clinical Notes & History</p>
                <p className="text-xs text-slate-600 bg-teal-50/50 p-3 rounded-xl border border-teal-100 leading-relaxed">
                  {selectedPatient.dentalHistory || 'No prior dental alerts recorded. Patient prefers morning appointments and gentle ultrasonic cleaning.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedPatient(null)}
              className="w-full py-3 rounded-xl font-bold bg-[#D4AF37] text-[#0F2C59] hover:bg-[#c4a130]"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
