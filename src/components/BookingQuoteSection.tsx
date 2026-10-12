import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_SERVICES } from '../data/initialData';
import { Calendar, FileText, CheckCircle2, Copy, ArrowRight, Video, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

export const BookingQuoteSection: React.FC = () => {
  const { language, t, addAppointment, addQuote, setActiveView, setActiveProjectCode, services, systemSettings, openLegalModal } = useApp();
  const [activeTab, setActiveTab] = useState<'appointment' | 'quote'>('appointment');

  // Appointment Form State
  const [aptService, setAptService] = useState('srv-web');
  const [aptDate, setAptDate] = useState('2026-10-15');
  const [aptTime, setAptTime] = useState('14:00');
  const [aptChannel, setAptChannel] = useState<'google_meet' | 'zoom' | 'office'>('google_meet');
  const [aptName, setAptName] = useState('');
  const [aptCompany, setAptCompany] = useState('');
  const [aptEmail, setAptEmail] = useState('');
  const [aptPhone, setAptPhone] = useState('');
  const [aptNotes, setAptNotes] = useState('');
  const [aptNdaAccepted, setAptNdaAccepted] = useState(false);
  const [quoteNdaAccepted, setQuoteNdaAccepted] = useState(false);

  // Quote Form State
  const [quoteServices, setQuoteServices] = useState<string[]>(['srv-web']);
  const [quoteBudget, setQuoteBudget] = useState('₺75.000 - ₺150.000');
  const [quoteTimeline, setQuoteTimeline] = useState('2 - 3 Ay');
  const [quoteFeatures, setQuoteFeatures] = useState<string[]>([
    'Çoklu Dil Desteği',
    'Güvenli Ödeme Entegrasyonu',
    'Admin Yönetim Paneli',
  ]);
  const [quoteDescription, setQuoteDescription] = useState('');
  const [quoteName, setQuoteName] = useState('');
  const [quoteCompany, setQuoteCompany] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quotePhone, setQuotePhone] = useState('');

  // Success Modal
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const timeSlots = ['10:00', '11:30', '14:00', '15:30', '17:00'];
  const featureOptions = [
    'Çoklu Dil Desteği',
    'Güvenli Ödeme & 3D Secure',
    'Otomatik e-Fatura Entegrasyonu',
    'Admin Yönetim Paneli',
    'Kullanıcı Rol & Yetkilendirme',
    'Yapay Zeka / LLM Entegrasyonu',
    'Canlı Müşteri Sohbeti',
    'SEO & Core Web Vitals',
  ];

  const handleToggleService = (id: string) => {
    setQuoteServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleToggleFeature = (feat: string) => {
    setQuoteFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptName || !aptEmail || !aptPhone) return;

    const matchedService = services.find((s) => s.id === aptService);
    const code = addAppointment({
      clientName: aptName,
      companyName: aptCompany || 'Bireysel / Girişimci',
      email: aptEmail,
      phone: aptPhone,
      serviceId: aptService,
      serviceName: matchedService ? matchedService.title[language] : 'Özel Yazılım',
      date: aptDate,
      timeSlot: aptTime,
      meetingType: aptChannel,
      notes: aptNotes,
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setGeneratedCode(code);
    setIsSuccessModalOpen(true);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteName || !quoteEmail || !quotePhone) return;

    const code = addQuote({
      clientName: quoteName,
      companyName: quoteCompany || 'Girişim',
      email: quoteEmail,
      phone: quotePhone,
      selectedServices: quoteServices,
      budgetRange: quoteBudget,
      targetTimeline: quoteTimeline,
      features: quoteFeatures,
      description: quoteDescription,
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setGeneratedCode(code);
    setIsSuccessModalOpen(true);
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGoToTracker = () => {
    if (generatedCode) {
      setActiveProjectCode(generatedCode);
    }
    setIsSuccessModalOpen(false);
    setActiveView('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="booking" className="py-24 bg-[#050506] border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-14"
        >
          <div className="text-xs uppercase tracking-widest text-[#8a8f98] font-semibold mb-2">
            İŞ BİRLİĞİ & BAŞLANGIÇ
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f7f8f8] tracking-tight text-balance">
            {t.booking.sectionTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#8a8f98] leading-relaxed">
            {t.booking.sectionSubtitle}
          </p>
        </motion.div>

        {/* Tab Selection */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-1.5 p-1 bg-[#0a0b0e] border border-white/[0.08] rounded-xl max-w-md mb-8"
        >
          <button
            onClick={() => setActiveTab('appointment')}
            className={`flex-1 py-2 px-4 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'appointment'
                ? 'bg-white text-black shadow-xs'
                : 'text-[#8a8f98] hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t.booking.tabAppointment}</span>
          </button>
          <button
            onClick={() => setActiveTab('quote')}
            className={`flex-1 py-2 px-4 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'quote'
                ? 'bg-white text-black shadow-xs'
                : 'text-[#8a8f98] hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.booking.tabQuote}</span>
          </button>
        </motion.div>

        {/* Form Container with Linear Card Frame */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="linear-card rounded-2xl p-6 sm:p-10 shadow-2xl max-w-4xl"
        >
          {activeTab === 'appointment' ? (
            /* ================= APPOINTMENT SCHEDULER ================= */
            <form onSubmit={handleAppointmentSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-2">
                    {t.booking.serviceSelectLabel}
                  </label>
                  <select
                    value={aptService}
                    onChange={(e) => setAptService(e.target.value)}
                    className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25] cursor-pointer"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#050506] text-white">
                        {s.number}. {s.title[language]} ({s.startingPrice})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Meeting Channel */}
                <div>
                  <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-2">
                    {t.booking.meetingTypeLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setAptChannel('google_meet')}
                      className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${
                        aptChannel === 'google_meet'
                          ? 'bg-white text-black border-white'
                          : 'bg-[#050506] border-white/[0.08] text-[#8a8f98] hover:text-white'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span className="truncate">Google Meet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAptChannel('zoom')}
                      className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${
                        aptChannel === 'zoom'
                          ? 'bg-white text-black border-white'
                          : 'bg-[#050506] border-white/[0.08] text-[#8a8f98] hover:text-white'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span className="truncate">Zoom</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAptChannel('office')}
                      className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${
                        aptChannel === 'office'
                          ? 'bg-white text-black border-white'
                          : 'bg-[#050506] border-white/[0.08] text-[#8a8f98] hover:text-white'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span className="truncate">Ofis (Levent)</span>
                    </button>
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-2">
                    {t.booking.dateLabel}
                  </label>
                  <input
                    type="date"
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25] cursor-pointer font-mono"
                  />
                </div>

                {/* Time Slot Picker */}
                <div>
                  <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-2">
                    {t.booking.timeLabel}
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setAptTime(slot)}
                        className={`py-2 text-xs font-mono font-medium rounded-lg border transition-colors cursor-pointer ${
                          aptTime === slot
                            ? 'bg-white text-black border-white'
                            : 'bg-[#050506] border-white/[0.08] text-[#8a8f98] hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="pt-4 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1.5">
                    {t.booking.nameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={aptName}
                    onChange={(e) => setAptName(e.target.value)}
                    placeholder="Adınız Soyadınız"
                    className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1.5">
                    {t.booking.companyLabel}
                  </label>
                  <input
                    type="text"
                    value={aptCompany}
                    onChange={(e) => setAptCompany(e.target.value)}
                    placeholder="Şirket / Kuruluş"
                    className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1.5">
                    {t.booking.emailLabel} *
                  </label>
                  <input
                    type="email"
                    required
                    value={aptEmail}
                    onChange={(e) => setAptEmail(e.target.value)}
                    placeholder="ornek@sirket.com"
                    className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1.5">
                    {t.booking.phoneLabel} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={aptPhone}
                    onChange={(e) => setAptPhone(e.target.value)}
                    placeholder="+90 5XX XXX XX XX"
                    className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1.5">
                  {t.booking.notesLabel}
                </label>
                <textarea
                  rows={2}
                  value={aptNotes}
                  onChange={(e) => setAptNotes(e.target.value)}
                  placeholder={t.booking.notesPlaceholder}
                  className="w-full bg-[#050506] border border-white/[0.08] rounded-xl p-3 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25]"
                ></textarea>
              </div>

              {systemSettings.requireNdaBeforeDiscovery && (
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    required
                    checked={aptNdaAccepted}
                    onChange={(e) => setAptNdaAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-emerald-500 cursor-pointer shrink-0"
                  />
                  <div>
                    <span className="font-semibold text-white block">
                      Keşif Toplantısı Öncesi Zorunlu Gizlilik Sözleşmesi (NDA) *
                    </span>
                    <span className="text-[#8a8f98] text-[11px] leading-relaxed">
                      Toplantıda paylaşılacak proje fikirleri, veri yapıları ve ticari sırların korunmasını taahhüt eden{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          openLegalModal('terms');
                        }}
                        className="text-emerald-400 underline hover:text-emerald-300 cursor-pointer font-medium"
                      >
                        Hizmet Koşulları & Gizlilik Protokolü
                      </button>
                      'nü okudum ve kabul ediyorum.
                    </span>
                  </div>
                </label>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="btn-linear-primary px-6 py-3 text-sm font-semibold rounded-lg cursor-pointer"
                >
                  {t.booking.submitAppointment}
                </button>
              </div>
            </form>
          ) : (
            /* ================= CUSTOM QUOTE REQUEST ================= */
            <form onSubmit={handleQuoteSubmit} className="space-y-6">
              {/* Service Multiple Checklist */}
              <div>
                <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-2">
                  İhtiyaç Duyulan Hizmetler (Çoklu Seçim)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {services.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => handleToggleService(s.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                        quoteServices.includes(s.id)
                          ? 'bg-white/[0.08] border-white text-white'
                          : 'bg-[#050506] border-white/[0.08] text-[#8a8f98] hover:text-white'
                      }`}
                    >
                      <span className="truncate">{s.title[language]}</span>
                      {quoteServices.includes(s.id) && (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget & Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-2">
                    {t.booking.budgetLabel}
                  </label>
                  <select
                    value={quoteBudget}
                    onChange={(e) => setQuoteBudget(e.target.value)}
                    className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25] cursor-pointer"
                  >
                    <option value="₺40.000 - ₺75.000">₺40.000 - ₺75.000</option>
                    <option value="₺75.000 - ₺150.000">₺75.000 - ₺150.000 (Önerilen MVP)</option>
                    <option value="₺150.000 - ₺300.000">₺150.000 - ₺300.000 (Genişletilmiş)</option>
                    <option value="₺300.000+">₺300.000+ (Kurumsal Ölçek)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-2">
                    {t.booking.timelineLabel}
                  </label>
                  <select
                    value={quoteTimeline}
                    onChange={(e) => setQuoteTimeline(e.target.value)}
                    className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25] cursor-pointer"
                  >
                    <option value="3 - 4 Hafta (Acil MVP)">3 - 4 Hafta (Hızlı MVP)</option>
                    <option value="2 - 3 Ay">2 - 3 Ay (Standart Kapsam)</option>
                    <option value="3 - 6 Ay">3 - 6 Ay (Kapsamlı Sistem)</option>
                    <option value="Esnek / Fazlı">Esnek / Aşamalı Dağıtım</option>
                  </select>
                </div>
              </div>

              {/* Desired Capabilities Checklist */}
              <div>
                <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-2">
                  {t.booking.featuresLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {featureOptions.map((feat) => (
                    <button
                      type="button"
                      key={feat}
                      onClick={() => handleToggleFeature(feat)}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-colors cursor-pointer truncate ${
                        quoteFeatures.includes(feat)
                          ? 'bg-white/[0.08] border-white text-white'
                          : 'bg-[#050506] border-white/[0.08] text-[#8a8f98] hover:text-white'
                      }`}
                    >
                      {feat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1.5">
                  {t.booking.descriptionLabel} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={quoteDescription}
                  onChange={(e) => setQuoteDescription(e.target.value)}
                  placeholder={t.booking.descriptionPlaceholder}
                  className="w-full bg-[#050506] border border-white/[0.08] rounded-xl p-3 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25]"
                ></textarea>
              </div>

              {/* Contact Info */}
              <div className="pt-4 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1.5">
                    {t.booking.nameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={quoteName}
                    onChange={(e) => setQuoteName(e.target.value)}
                    placeholder="Adınız Soyadınız"
                    className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1.5">
                    {t.booking.companyLabel}
                  </label>
                  <input
                    type="text"
                    value={quoteCompany}
                    onChange={(e) => setQuoteCompany(e.target.value)}
                    placeholder="Şirket / Kuruluş"
                    className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1.5">
                    {t.booking.emailLabel} *
                  </label>
                  <input
                    type="email"
                    required
                    value={quoteEmail}
                    onChange={(e) => setQuoteEmail(e.target.value)}
                    placeholder="ornek@sirket.com"
                    className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1.5">
                    {t.booking.phoneLabel} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    placeholder="+90 5XX XXX XX XX"
                    className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25]"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] cursor-pointer text-xs text-zinc-300">
                <input
                  type="checkbox"
                  required
                  checked={quoteNdaAccepted}
                  onChange={(e) => setQuoteNdaAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-emerald-500 cursor-pointer shrink-0"
                />
                <div>
                  <span className="font-semibold text-white block">
                    Teklif ve Gizlilik Sözleşmesi Onayı *
                  </span>
                  <span className="text-[#8a8f98] text-[11px] leading-relaxed">
                    Tarafıma sunulacak bütçe ve mimari teklif sürecinde{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        openLegalModal('privacy');
                      }}
                      className="text-emerald-400 underline hover:text-emerald-300 cursor-pointer font-medium"
                    >
                      Gizlilik Politikası
                    </button>
                    {' '}ve{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        openLegalModal('kvkk');
                      }}
                      className="text-emerald-400 underline hover:text-emerald-300 cursor-pointer font-medium"
                    >
                      KVKK Aydınlatma Metni
                    </button>
                    'ni okudum, kabul ediyorum.
                  </span>
                </div>
              </label>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="btn-linear-primary px-6 py-3 text-sm font-semibold rounded-lg cursor-pointer"
                >
                  {t.booking.submitQuote}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      {isSuccessModalOpen && generatedCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0a0b0e] border border-white/[0.12] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-white/[0.06] text-white flex items-center justify-center mx-auto mb-4 border border-white/[0.1]">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>

            <h3 className="text-xl font-bold text-[#f7f8f8] mb-2">
              {t.booking.successTitle}
            </h3>

            <p className="text-xs sm:text-sm text-[#8a8f98] mb-6 leading-relaxed">
              {activeTab === 'appointment'
                ? t.booking.successMessageAppointment
                : t.booking.successMessageQuote}
            </p>

            {/* Reference Tracking Code Box */}
            <div className="bg-[#050506] border border-white/[0.08] rounded-xl p-4 mb-6">
              <div className="text-xs text-[#8a8f98] mb-1 font-mono">
                {activeTab === 'appointment' ? t.booking.appointmentCodeLabel : t.booking.quoteCodeLabel}
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-xl font-bold text-white tracking-wider">
                  {generatedCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1.5 text-[#8a8f98] hover:text-white rounded-md bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
                  title="Kopyala"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <div className="text-xs text-emerald-400 mt-1">{t.common.copied}</div>}
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleGoToTracker}
                className="btn-linear-primary w-full py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.booking.trackNow}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-2 px-4 text-xs font-medium text-[#8a8f98] hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                {t.booking.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
