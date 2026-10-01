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
  SmileCase,
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
  Stethoscope,
  SplitSquareVertical,
  X,
  Menu,
  ArrowLeft,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { DashboardOverview } from './DashboardOverview';
import { AppointmentsManager } from './AppointmentsManager';
import { PatientsManager } from './PatientsManager';
import { ConsultationsManager } from './ConsultationsManager';
import { SettingsManager } from './SettingsManager';
import { DoctorsManager } from './DoctorsManager';
import { CasesManager } from './CasesManager';

interface AdminDashboardProps {
  stats: ClinicStats;
  appointments: Appointment[];
  consultations: Consultation[];
  patients: Patient[];
  doctors: Doctor[];
  cases: SmileCase[];
  services: Service[];
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  onUpdateConsultation: (csl: Consultation) => void;
  onAddDoctor: (doctor: Doctor) => Promise<void> | void;
  onDeleteDoctor: (doctorId: string) => Promise<void> | void;
  onAddCase: (newCase: SmileCase) => Promise<void> | void;
  onDeleteCase: (caseId: string) => Promise<void> | void;
  onClose: () => void;
  isRtl?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  appointments,
  consultations,
  patients,
  doctors,
  cases,
  services,
  onUpdateAppointmentStatus,
  onUpdateConsultation,
  onAddDoctor,
  onDeleteDoctor,
  onAddCase,
  onDeleteCase,
  onClose,
  isRtl = false,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMethod, setAuthMethod] = useState<'pin' | 'email'>('pin');
  const [pinInput, setPinInput] = useState('');
  const [emailInput, setEmailInput] = useState('admin@lumina-dental.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [authRole, setAuthRole] = useState<UserRole>('ADMIN');
  const [authError, setAuthError] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'appointments' | 'doctors' | 'cases' | 'patients' | 'consultations' | 'settings'
  >('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle Login
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput.length >= 4) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError(isRtl ? 'رمز المرور غير صحيح. جرب 1234' : 'Invalid PIN. Try "1234"');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim() && passwordInput.length >= 4) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError(isRtl ? 'يرجى إدخال بريد إلكتروني صحيح وكلمة مرور' : 'Please provide a valid email and password');
    }
  };

  const handleQuickRole = (role: UserRole) => {
    setAuthRole(role);
    setIsAuthenticated(true);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#161616] text-white flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white text-stone-900 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-stone-200 text-center space-y-6 animate-in zoom-in-95 duration-200 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
            title="Return to Website"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-[#161616] text-white mx-auto flex items-center justify-center font-serif text-2xl shadow-md">
            L
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#b15f2c]">
              {isRtl ? 'لوحة التحكم الإدارية الحية' : 'Live Practice Management'}
            </span>
            <h2 className="text-xl font-semibold text-stone-900 mt-1">
              LUMINA Clinical Console
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {isRtl
                ? 'إدارة الحجوزات، رفع صور الأطباء، وحالات الابتسامة قبل وبعد'
                : 'Manage bookings, upload doctor portraits, and add Before/After smile cases'}
            </p>
          </div>

          {/* Toggle between PIN and Email */}
          <div className="flex rounded-xl bg-stone-100 p-1 text-xs">
            <button
              onClick={() => { setAuthMethod('pin'); setAuthError(''); }}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                authMethod === 'pin' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
              }`}
            >
              {isRtl ? 'رمز الأمان السريع (PIN)' : 'Security PIN (1234)'}
            </button>
            <button
              onClick={() => { setAuthMethod('email'); setAuthError(''); }}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                authMethod === 'email' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
              }`}
            >
              {isRtl ? 'البريد الإلكتروني' : 'Admin Email'}
            </button>
          </div>

          {authMethod === 'pin' ? (
            <form onSubmit={handlePinSubmit} className="space-y-4 text-left rtl:text-right">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-1 text-center">
                  {isRtl ? 'أدخل رمز الدخول (الافتراضي: 1234)' : 'Enter PIN (Default: 1234)'}
                </label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-36 mx-auto block p-3 text-center text-2xl font-mono border border-stone-200 rounded-xl tracking-widest focus:outline-none focus:border-stone-900"
                />
              </div>

              {authError && (
                <p className="text-xs text-rose-600 font-medium text-center">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-black text-white transition-all shadow-xs cursor-pointer"
              >
                {isRtl ? 'تسجيل الدخول والتحكم' : 'Sign In to Console'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3 text-left rtl:text-right">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isRtl ? 'كلمة المرور' : 'Password'}
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900"
                  required
                />
              </div>

              {authError && (
                <p className="text-xs text-rose-600 font-medium text-center">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-black text-white transition-all shadow-xs cursor-pointer"
              >
                {isRtl ? 'تسجيل الدخول' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Quick Demo Access Roles */}
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
              {isRtl ? 'دخول سريع للتجربة والتعلم' : 'Quick Demo Roles'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickRole('ADMIN')}
                className="py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[11px] font-medium text-stone-800 transition-colors cursor-pointer"
              >
                {isRtl ? 'المدير العام' : 'Director (Admin)'}
              </button>
              <button
                onClick={() => handleQuickRole('DOCTOR')}
                className="py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[11px] font-medium text-stone-800 transition-colors cursor-pointer"
              >
                {isRtl ? 'طبيب' : 'Specialist'}
              </button>
              <button
                onClick={() => handleQuickRole('RECEPTIONIST')}
                className="py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[11px] font-medium text-stone-800 transition-colors cursor-pointer"
              >
                {isRtl ? 'الاستقبال' : 'Reception'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: isRtl ? 'نظرة عامة وإحصائيات' : 'Overview & Stats', icon: LayoutDashboard },
    { id: 'appointments', label: isRtl ? 'جدول الحجوزات والمواعيد' : 'Appointments', icon: Calendar },
    { id: 'doctors', label: isRtl ? 'إدارة الأطباء ورفع الصور' : 'Doctors & Portraits', icon: Stethoscope },
    { id: 'cases', label: isRtl ? 'معرض حالات قبل / بعد' : 'Before & After Cases', icon: SplitSquareVertical },
    { id: 'consultations', label: isRtl ? 'استشارات الذكاء الاصطناعي' : 'Virtual AI Queue', icon: FileText },
    { id: 'patients', label: isRtl ? 'ملفات المرضى' : 'Patients File', icon: Users },
    { id: 'settings', label: isRtl ? 'إعدادات العيادة' : 'Clinic Settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#faf9f6] flex text-stone-900 font-sans overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#161616] text-white border-r border-stone-800 justify-between p-5 shrink-0">
        <div className="space-y-6">
          {/* Logo & Close to Live Site */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white text-stone-900 flex items-center justify-center font-serif text-sm font-semibold">
                L
              </div>
              <div>
                <p className="font-semibold text-xs tracking-wider text-white uppercase">
                  LUMINA Admin
                </p>
                <p className="text-[10px] text-[#d89f78] uppercase font-mono tracking-widest">
                  Live Cloud DB
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              title={isRtl ? 'العودة للموقع' : 'Return to Website'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-stone-900 shadow-sm font-semibold'
                      : 'text-stone-400 hover:bg-stone-800/60 hover:text-stone-200'
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer in Sidebar */}
        <div className="pt-4 border-t border-stone-800 space-y-2">
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-stone-300">Firebase Active</span>
            </div>
            <span className="text-[10px] text-[#d89f78] uppercase font-semibold">{authRole}</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isRtl ? 'العودة للموقع الرئيسي' : 'Return to Live Website'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#faf9f6]">
        {/* Header Bar */}
        <header className="bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-stone-100 text-stone-700 cursor-pointer"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-base font-semibold text-stone-900 capitalize">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h1>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                LUMINA Dental & Facial Aesthetics Practice Control Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isRtl ? 'الموقع الرئيسي' : 'View Public Site'}</span>
            </button>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex">
            <div className="w-64 bg-[#161616] text-white p-5 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <p className="font-semibold text-xs tracking-wider uppercase">LUMINA Menu</p>
                  <button onClick={() => setSidebarOpen(false)} className="text-stone-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium ${
                        activeTab === item.id ? 'bg-white text-stone-900 font-semibold' : 'text-stone-400'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2 rounded-xl bg-stone-800 text-stone-200 text-xs font-medium"
              >
                {isRtl ? 'العودة للموقع' : 'Return to Website'}
              </button>
            </div>
          </div>
        )}

        {/* Main Body */}
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

          {activeTab === 'doctors' && (
            <DoctorsManager
              doctors={doctors}
              onAddDoctor={onAddDoctor}
              onDeleteDoctor={onDeleteDoctor}
              isRtl={isRtl}
            />
          )}

          {activeTab === 'cases' && (
            <CasesManager
              cases={cases}
              onAddCase={onAddCase}
              onDeleteCase={onDeleteCase}
              isRtl={isRtl}
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
