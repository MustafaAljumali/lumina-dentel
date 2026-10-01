import React, { useState } from 'react';
import {
  Appointment,
  Consultation,
  Patient,
  Doctor,
  Service,
  ClinicStats,
  UserRole,
  AppointmentStatus,
} from '../../types';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Settings,
  Lock,
  LogOut,
  Bell,
  Search,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Key,
} from 'lucide-react';
import { DashboardOverview } from './DashboardOverview';
import { AppointmentsManager } from './AppointmentsManager';
import { PatientsManager } from './PatientsManager';
import { ConsultationsManager } from './ConsultationsManager';
import { SettingsManager } from './SettingsManager';

interface AdminDashboardProps {
  stats: ClinicStats;
  appointments: Appointment[];
  consultations: Consultation[];
  patients: Patient[];
  doctors: Doctor[];
  services: Service[];
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  onUpdateConsultation: (csl: Consultation) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  appointments,
  consultations,
  patients,
  doctors,
  services,
  onUpdateAppointmentStatus,
  onUpdateConsultation,
}) => {
  // PIN / Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authRole, setAuthRole] = useState<UserRole>('ADMIN');
  const [authError, setAuthError] = useState(false);

  // Dashboard Nav State
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'patients' | 'consultations' | 'settings'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput.length >= 4) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    setAuthRole(role);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F2C59] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-[#0F2C59] text-[#D4AF37] mx-auto flex items-center justify-center font-bold text-2xl shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-[#0F2C59]">Staff Portal Access</h2>
            <p className="text-xs text-slate-500 mt-1">
              Apex Modern Dental Practice Management Console
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#0F2C59] mb-1">
                Enter Staff Security PIN (Default: 1234)
              </label>
              <input
                type="password"
                maxLength={8}
                placeholder="••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full p-3.5 text-center text-2xl font-bold font-data bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#14B8A6] focus:outline-none tracking-widest text-[#0F2C59]"
              />
              {authError && (
                <span className="text-xs text-red-500 font-bold block mt-1">
                  Invalid PIN. Try "1234"
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold bg-[#D4AF37] text-[#0F2C59] hover:bg-[#c4a130] transition-colors shadow-md text-sm"
            >
              Authenticate & Enter
            </button>
          </form>

          {/* Quick Role Demo Buttons */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Quick Demo Login Roles</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickRoleLogin('ADMIN')}
                className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-[#0F2C59]"
              >
                Admin
              </button>
              <button
                onClick={() => handleQuickRoleLogin('DOCTOR')}
                className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-[#0F2C59]"
              >
                Doctor
              </button>
              <button
                onClick={() => handleQuickRoleLogin('RECEPTIONIST')}
                className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-[#0F2C59]"
              >
                Reception
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patients File', icon: Users },
    { id: 'consultations', label: 'Virtual Queue', icon: FileText },
    { id: 'settings', label: 'Clinic Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0F2C59] text-white border-r border-slate-800 justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#14B8A6] text-white flex items-center justify-center font-black text-xl">
              A
            </div>
            <div>
              <p className="font-extrabold text-sm tracking-tight text-white leading-tight">
                APEX DENTAL
              </p>
              <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">
                Admin Console
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-[#14B8A6] text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Logout */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xs">
              {authRole[0]}
            </div>
            <div>
              <p className="font-bold text-xs text-white">Staff Member</p>
              <p className="text-[10px] text-teal-400 font-semibold uppercase">{authRole} Access</p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full py-2.5 rounded-xl font-bold bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 text-xs transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-700"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-xl font-extrabold text-[#0F2C59] capitalize">
              {activeTab === 'overview'
                ? 'Clinical Overview'
                : activeTab === 'patients'
                ? 'Patient Database'
                : activeTab}
            </h1>
          </div>

          <div className="flex items-center space-x-3 text-xs font-semibold text-slate-500">
            <span className="hidden sm:inline bg-slate-100 px-3 py-1.5 rounded-xl text-slate-700 font-data">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <div className="relative p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <DashboardOverview
              stats={stats}
              appointments={appointments}
              consultations={consultations}
              patients={patients}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsManager
              appointments={appointments}
              doctors={doctors}
              onUpdateStatus={onUpdateAppointmentStatus}
            />
          )}

          {activeTab === 'patients' && <PatientsManager patients={patients} />}

          {activeTab === 'consultations' && (
            <ConsultationsManager
              consultations={consultations}
              onUpdateConsultation={onUpdateConsultation}
            />
          )}

          {activeTab === 'settings' && <SettingsManager doctors={doctors} services={services} />}
        </main>
      </div>
    </div>
  );
};
