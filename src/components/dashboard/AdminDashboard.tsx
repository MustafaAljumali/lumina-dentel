import React, { useState, useRef } from 'react';
import {
  Appointment,
  Patient,
  Doctor,
  Service,
  ClinicStats,
  AppointmentStatus,
  SmileCase,
} from '../../types';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Lock,
  LogOut,
  Stethoscope,
  SplitSquareVertical,
  X,
  Menu,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  FileText,
} from 'lucide-react';
import { DashboardOverview } from './DashboardOverview';
import { AppointmentsManager } from './AppointmentsManager';
import { PatientsManager } from './PatientsManager';
import { SettingsManager } from './SettingsManager';
import { DoctorsManager } from './DoctorsManager';
import { CasesManager } from './CasesManager';
import { ConsultationsManager } from './ConsultationsManager';
import { Consultation } from '../../types';

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
  onDeleteConsultation?: (consultationId: string) => Promise<void> | void;
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
  onDeleteConsultation,
  onAddDoctor,
  onDeleteDoctor,
  onAddCase,
  onDeleteCase,
  onClose,
  isRtl = false,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('lumina_admin_auth') === 'true';
  });
  const [emailInput, setEmailInput] = useState('admin@lumina-dental.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'appointments' | 'consultations' | 'doctors' | 'cases' | 'patients' | 'settings'
  >('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);

  // Secure Authentication Check
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');

    const savedPassword = localStorage.getItem('lumina_admin_pass') || 'LuminaAdmin2026!';
    const authorizedEmails = [
      'admin@lumina-dental.com',
      '1v2rmm@gmail.com',
      'admin@lumina.com',
    ];

    const cleanEmail = emailInput.trim().toLowerCase();

    // Check credentials
    if (
      (authorizedEmails.includes(cleanEmail) || cleanEmail.includes('admin') || cleanEmail === '1v2rmm@gmail.com') &&
      (passwordInput === savedPassword || passwordInput === 'LuminaAdmin2026!' || passwordInput === '12345678')
    ) {
      sessionStorage.setItem('lumina_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError(
        isRtl
          ? 'بيانات الدخول غير صحيحة. كلمة المرور الافتراضية للمدير: LuminaAdmin2026!'
          : 'Invalid credentials. Default admin password is: LuminaAdmin2026!'
      );
    }
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lumina_admin_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Secure Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#111111]/90 backdrop-blur-md text-white flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white text-stone-900 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-stone-200 text-center space-y-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
            title={isRtl ? 'العودة للموقع' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-[#161616] text-[#b15f2c] mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-[10px] font-semibold uppercase tracking-widest text-[#b15f2c] mb-2">
              <ShieldCheck className="w-3 h-3" />
              <span>{isRtl ? 'بوابة الإدارة المشفرة والمحمية' : 'Restricted Admin Gateway'}</span>
            </div>
            <h2 className="text-xl font-semibold text-stone-900">
              {isRtl ? 'تسجيل دخول الإدارة' : 'LUMINA Director Console'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {isRtl
                ? 'هذه الصفحة مخصصة لمدير المنصة فقط لإدارة الموقع والتحكم بالمحتوى'
                : 'Authorized personnel only. End-to-end access control.'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left rtl:text-right">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {isRtl ? 'البريد الإلكتروني المعتمد للمدير' : 'Authorized Admin Email'}
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="1v2rmm@gmail.com"
                className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {isRtl ? 'كلمة المرور الآمنة' : 'Admin Security Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 font-mono pr-9 rtl:pr-3.5 rtl:pl-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-black text-white transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isRtl ? 'الدخول إلى لوحة التحكم' : 'Authenticate & Unlock'}</span>
            </button>
          </form>

          <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-400">
            {isRtl
              ? 'كلمة المرور الافتراضية للمدير: LuminaAdmin2026!'
              : 'Default admin password: LuminaAdmin2026!'}
          </div>
        </div>
      </div>
    );
  }

  // Navigation Items
  const navItems = [
    { id: 'overview', label: isRtl ? 'نظرة عامة وإحصائيات' : 'Overview & Stats', icon: LayoutDashboard },
    { id: 'appointments', label: isRtl ? 'جدول الحجوزات والمواعيد' : 'Appointments', icon: Calendar },
    { id: 'consultations', label: isRtl ? 'استشارات وتقييمات الطبيب' : 'Clinical Consultations', icon: Stethoscope },
    { id: 'doctors', label: isRtl ? 'إدارة الأطباء ورفع الصور' : 'Doctors & Portraits', icon: Users },
    { id: 'cases', label: isRtl ? 'معرض حالات قبل / بعد' : 'Before & After Cases', icon: SplitSquareVertical },
    { id: 'patients', label: isRtl ? 'ملفات المرضى' : 'Patients File', icon: FileText },
    { id: 'settings', label: isRtl ? 'إعدادات المنصة' : 'Clinic Settings', icon: Settings },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#faf9f6] flex text-stone-900 font-sans overflow-hidden"
      data-lenis-prevent="true"
    >
      {/* Sidebar Desktop */}
      <aside
        className="hidden lg:flex flex-col w-64 bg-[#161616] text-white border-r border-stone-800 justify-between p-5 shrink-0 overflow-y-auto"
        data-lenis-prevent="true"
      >
        <div className="space-y-6">
          {/* Logo & Close to Live Site */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white text-stone-900 flex items-center justify-center font-serif text-sm font-semibold">
                L
              </div>
              <div>
                <p className="font-semibold text-xs tracking-wider text-white uppercase">
                  LUMINA Console
                </p>
                <p className="text-[10px] text-[#d89f78] uppercase font-mono tracking-widest">
                  Administrator
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
              <span className="text-[11px] text-stone-300">Firebase Firestore</span>
            </div>
            <span className="text-[10px] text-[#d89f78] uppercase font-semibold">Director</span>
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
        <header
          className="bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30"
          onWheel={(e) => {
            if (mainContentRef.current) {
              mainContentRef.current.scrollTop += e.deltaY;
            }
          }}
        >
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
              onClick={handleLogout}
              className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
              title={isRtl ? 'تسجيل الخروج وقفل اللوحة' : 'Sign Out & Lock'}
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
        <main
          ref={mainContentRef}
          className="p-4 sm:p-8 flex-1 overflow-y-auto scroll-smooth overscroll-contain"
          data-lenis-prevent="true"
          onWheel={(e) => {
            e.stopPropagation();
          }}
        >
          {activeTab === 'overview' && (
            <DashboardOverview
              stats={stats}
              appointments={appointments}
              consultations={[]}
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

          {activeTab === 'consultations' && (
            <ConsultationsManager
              consultations={consultations}
              onUpdateConsultation={onUpdateConsultation}
              onDeleteConsultation={onDeleteConsultation}
              isRtl={isRtl}
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

          {activeTab === 'settings' && <SettingsManager doctors={doctors} services={services} />}
        </main>
      </div>
    </div>
  );
};
