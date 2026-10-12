import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ProcessSection } from './components/ProcessSection';
import { BookingQuoteSection } from './components/BookingQuoteSection';
import { ProjectTrackerSection } from './components/ProjectTrackerSection';
import { AdminDashboard } from './components/AdminDashboard';
import { PaymentModal } from './components/PaymentModal';
import { InvoiceModal } from './components/InvoiceModal';
import { ChatDrawer } from './components/ChatDrawer';
import { ClientSurveyModal } from './components/ClientSurveyModal';
import { LegalModal } from './components/LegalModal';
import { Footer } from './components/Footer';
import { ShieldAlert, LogIn, Mail, Phone } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeView, setActiveView, systemSettings } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#050506] text-[#ffffff] selection:bg-white/20 selection:text-white font-sans antialiased">
      {/* Maintenance Mode Alert Banner for Admin */}
      {systemSettings.maintenanceMode && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold">SİTE BAKIM MODUNDA:</span>
            <span className="text-amber-200/90 truncate">{systemSettings.maintenanceMessage}</span>
          </div>
        </div>
      )}

      {/* When maintenanceMode is active and user is not admin, show maintenance screen */}
      {systemSettings.maintenanceMode && activeView !== 'admin' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto my-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest px-2.5 py-1 rounded bg-amber-950/40 border border-amber-500/20">
              Planlı Bakım & Güçlendirme
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight pt-2">
              Lodonsoft Sistem Bakımı
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-md mx-auto">
              {systemSettings.maintenanceMessage || 'Sistemlerimizde planlı altyapı güçlendirmesi yapılmaktadır. Kısa süre sonra yeniden yayındayız.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-[#8a8f98] w-full space-y-2">
            <div className="text-white font-medium">Acil İletişim & Proje Desteği:</div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                {systemSettings.supportEmail || 'destek@lodonsoft.com'}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                {systemSettings.phone || '+90 (212) 809 45 00'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveView('admin')}
              className="btn-linear-secondary px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Yönetici Paneli Girişi</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <Navbar />

          <main className="flex-1 bg-[#050506]">
            {activeView === 'home' && (
              <>
                <Hero />
                <ServicesSection />
                <ProjectsSection />
                <TestimonialsSection />
                <ProcessSection />
                <BookingQuoteSection />
              </>
            )}

            {activeView === 'tracker' && (
              <div className="pt-4 bg-[#050506]">
                <ProjectTrackerSection />
              </div>
            )}

            {activeView === 'booking' && (
              <div className="pt-4 bg-[#050506]">
                <BookingQuoteSection />
              </div>
            )}

            {activeView === 'admin' && (
              <div className="bg-[#050506]">
                <AdminDashboard />
              </div>
            )}
          </main>
        </>
      )}

      {/* Global Modals & Live Communication */}
      <PaymentModal />
      <InvoiceModal />
      <ChatDrawer />
      <ClientSurveyModal />
      <LegalModal />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
