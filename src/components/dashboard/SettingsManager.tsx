import React, { useState } from 'react';
import { Doctor, Service } from '../../types';
import { Save, Building, UserCheck, Tag, Check } from 'lucide-react';

interface SettingsManagerProps {
  doctors: Doctor[];
  services: Service[];
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ doctors, services }) => {
  const [clinicName, setClinicName] = useState('Apex Modern Dental & Aesthetics');
  const [phone, setPhone] = useState('(555) 911-3368');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {saved && (
        <div className="p-4 bg-emerald-100 text-emerald-800 rounded-2xl font-bold text-xs flex items-center space-x-2 border border-emerald-300">
          <Check className="w-4 h-4" />
          <span>Clinic Configuration Saved Successfully!</span>
        </div>
      )}

      {/* Clinic General Details */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-extrabold text-lg text-[#0F2C59] flex items-center space-x-2">
          <Building className="w-5 h-5 text-[#14B8A6]" />
          <span>General Clinic Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Practice Name</label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full p-3 bg-[#F8FAFC] border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Primary Reception Line</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-[#F8FAFC] border border-slate-200 rounded-xl font-medium"
            />
          </div>
        </div>
      </div>

      {/* Doctors Roster */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-extrabold text-lg text-[#0F2C59] flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-[#14B8A6]" />
          <span>Clinical Staff Roster</span>
        </h3>

        <div className="space-y-3">
          {doctors.map((doc) => (
            <div key={doc.id} className="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <img src={doc.photo} alt={doc.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-[#0F2C59]">{doc.name}</p>
                  <p className="text-slate-500">{doc.specialty}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold uppercase text-[10px]">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="px-8 py-3.5 rounded-xl font-bold bg-[#D4AF37] text-[#0F2C59] hover:bg-[#c4a130] transition-colors shadow-lg flex items-center space-x-2 text-xs"
      >
        <Save className="w-4 h-4" />
        <span>Save All Settings</span>
      </button>
    </div>
  );
};
