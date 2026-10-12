import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MessageSquare,
  CreditCard,
  FileText,
  ExternalLink,
  GitBranch,
  Shield,
  KeyRound,
  ArrowRight,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Lock,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

const formatDateLocalized = (dateStr?: string, lang: 'tr' | 'en' = 'tr'): string => {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    try {
      const parts = dateStr.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
    } catch {
      // fallback
    }
  }
  return dateStr;
};

export const ProjectTrackerSection: React.FC = () => {
  const {
    language,
    t,
    projects,
    appointments,
    quotes,
    invoices,
    activeProjectCode,
    setActiveProjectCode,
    toggleSprintTask,
    openPaymentModal,
    setActiveInvoiceModal,
    setIsChatOpen,
    openSurveyModal,
    systemSettings,
  } = useApp();

  const [inputCode, setInputCode] = useState(activeProjectCode || '');
  const [hasSearched, setHasSearched] = useState(Boolean(activeProjectCode));

  useEffect(() => {
    if (activeProjectCode) {
      setInputCode(activeProjectCode);
      setHasSearched(true);
    }
  }, [activeProjectCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setActiveProjectCode(inputCode.trim());
      setHasSearched(true);
    }
  };

  const handleSelectCode = (code: string) => {
    setInputCode(code);
    setActiveProjectCode(code);
    setHasSearched(true);
  };

  const currentProject = activeProjectCode
    ? projects.find((p) => p.projectCode.toLowerCase() === activeProjectCode.toLowerCase())
    : null;

  const currentAppointment =
    activeProjectCode && !currentProject
      ? appointments.find((a) => a.trackingCode.toLowerCase() === activeProjectCode.toLowerCase())
      : null;

  const currentQuote =
    activeProjectCode && !currentProject && !currentAppointment
      ? quotes.find((q) => q.trackingCode.toLowerCase() === activeProjectCode.toLowerCase())
      : null;

  const projectInvoice = activeProjectCode
    ? invoices.find((inv) => inv.projectCode?.toLowerCase() === activeProjectCode.toLowerCase())
    : null;

  const hasResult = Boolean(currentProject || currentAppointment || currentQuote);

  return (
    <section id="tracker" className="py-20 lg:py-28 bg-[#050506] border-b border-white/[0.08] min-h-[750px] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs uppercase tracking-widest text-[#8a8f98] font-semibold mb-3">
            <Shield className="w-3.5 h-3.5 text-zinc-300" />
            <span>MÜŞTERİ YÖNETİM MERKEZİ & TAKİP SİSTEMİ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f7f8f8] tracking-tight text-balance">
            {t.tracker.sectionTitle}
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-[#8a8f98] leading-relaxed">
            {t.tracker.sectionSubtitle}
          </p>
        </div>

        {/* Tracking Code Entry Form Card */}
        <div className="linear-card rounded-2xl p-6 sm:p-8 mb-12 shadow-2xl max-w-3xl">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <KeyRound className="w-4 h-4 text-white" />
            <span>Proje veya Takip Kodunuzu Girin</span>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#8a8f98] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder={t.tracker.inputPlaceholder}
                className="w-full bg-[#050506] border border-white/[0.1] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[#f7f8f8] placeholder:text-[#62666d] focus:outline-hidden focus:border-white/40 focus:shadow-[0_0_20px_rgba(255,255,255,0.06)] font-mono transition-all"
              />
            </div>
            <button
              type="submit"
              className="btn-linear-primary px-7 py-3.5 text-sm font-semibold rounded-xl transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <span>{t.tracker.searchBtn}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </form>

          {/* Quick Demo Code Selector */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-4 border-t border-white/[0.06] text-xs text-[#8a8f98]">
            <span className="font-medium text-[#62666d]">{t.tracker.demoCodesHint}</span>
            <button
              type="button"
              onClick={() => handleSelectCode('LOD-2026-01')}
              className="px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-white border border-white/[0.08] hover:border-white/[0.2] font-mono cursor-pointer transition-colors"
            >
              LOD-2026-01 <span className="text-[11px] text-[#8a8f98] ml-1">(Aktif Proje)</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectCode('LOD-2026-02')}
              className="px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-emerald-300 border border-white/[0.08] hover:border-white/[0.2] font-mono cursor-pointer transition-colors"
            >
              LOD-2026-02 <span className="text-[11px] text-emerald-400/80 ml-1">(Tamamlanan)</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectCode('LOD-APP-8391')}
              className="px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-[#8a8f98] hover:text-white border border-white/[0.08] hover:border-white/[0.2] font-mono cursor-pointer transition-colors"
            >
              LOD-APP-8391 <span className="text-[11px] text-[#62666d] ml-1">(Randevu)</span>
            </button>
          </div>
        </div>

        {/* ================= INITIAL STATE (No code entered yet) ================= */}
        {!hasSearched && (
          <div className="linear-card rounded-2xl p-8 sm:p-12 max-w-3xl text-center border border-white/[0.08]">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.1] mx-auto flex items-center justify-center mb-5 text-white">
              <KeyRound className="w-7 h-7 text-zinc-300" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Müşteri Yönetim Merkezi Kilitli
            </h3>
            <p className="text-sm text-[#8a8f98] max-w-lg mx-auto leading-relaxed mb-6">
              Müşteri yönetim paneli, aktif sprint durumları, hakediş ödemeleri ve teknik ekiple canlı sohbet modülüne erişmek için lütfen size tahsis edilen proje kodunuzu yukarıdaki alana girin.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleSelectCode('LOD-2026-01')}
                className="btn-linear-primary px-5 py-2.5 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Örnek Projeyi Aç (LOD-2026-01)
              </button>
            </div>
          </div>
        )}

        {/* ================= 1. ACTIVE PROJECT DISPLAY ================= */}
        {hasSearched && currentProject && (
          <div className="space-y-8">
            {/* Top Project Dashboard Header Card */}
            <div className="linear-card rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8a8f98] mb-1.5">
                    <span className="text-white font-semibold">{currentProject.projectCode}</span>
                    <span>·</span>
                    <span>{currentProject.clientName}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#f7f8f8]">
                    {currentProject.title}
                  </h3>
                </div>

                {/* Quick Action CTA Island */}
                <div className="flex flex-wrap items-center gap-3">
                  {systemSettings.allowClientDirectChat ? (
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="btn-linear-secondary px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-[#8a8f98]" />
                      <span>{t.tracker.chatWithTeam}</span>
                    </button>
                  ) : (
                    <div
                      className="px-3.5 py-2.5 text-xs font-semibold rounded-lg bg-white/[0.02] border border-white/[0.06] text-zinc-500 flex items-center gap-1.5 cursor-not-allowed"
                      title="Teknik ekiple doğrudan canlı sohbet yönetici ayarları gereğince geçici olarak kapalıdır."
                    >
                      <Lock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Canlı Sohbet Kapalı</span>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      openPaymentModal({
                        amount: currentProject.totalBudget - currentProject.paidAmount,
                        title: `${currentProject.title} – Hakediş Ödemesi`,
                        projectCode: currentProject.projectCode,
                      })
                    }
                    className="btn-linear-primary px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-black" />
                    <span>{t.tracker.payMilestone}</span>
                  </button>

                  {projectInvoice && (
                    systemSettings.allowClientInvoiceDownload ? (
                      <button
                        onClick={() => setActiveInvoiceModal(projectInvoice)}
                        className="btn-linear-secondary px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-amber-400" />
                        <span>{t.tracker.viewInvoice}</span>
                      </button>
                    ) : (
                      <div
                        className="px-3.5 py-2.5 text-xs font-semibold rounded-lg bg-white/[0.02] border border-white/[0.06] text-zinc-500 flex items-center gap-1.5 cursor-not-allowed"
                        title="Fatura PDF indirme ve görüntüleme yönetici tarafından kısıtlanmıştır."
                      >
                        <Lock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Fatura İndirme Kısıtlı</span>
                      </div>
                    )
                  )}

                  <button
                    onClick={() => openSurveyModal(currentProject.projectCode)}
                    className="btn-linear-secondary px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer text-amber-300 border-amber-400/30 hover:border-amber-400/60 bg-amber-950/20"
                    title="Proje Teslimi Sonrası Değerlendirme & Yorum"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Projeyi Değerlendir & Yorum Yap</span>
                  </button>
                </div>

                {/* Legal & SLA Guarantees Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                  {systemSettings.ipTransferClauseEnabled ? (
                    <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Fikri Mülkiyet (IP Devri):</strong> Kalan bakiye ödendiğinde tüm kaynak kodlar ve tasarım hakları şirketinize devredilecektir.</span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-zinc-400 flex items-center gap-2 text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span>Lisans ve fikri mülkiyet standart sözleşme şartlarına tabidir.</span>
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-blue-300 flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-400" />
                      <span>SLA Uptime: %{systemSettings.slaUptimeGuaranteePercent || 99.9}</span>
                    </span>
                    <span className="text-zinc-300">Garanti: {systemSettings.warrantyDurationMonths || 6} Ay</span>
                  </div>
                </div>
              </div>

              {/* Post-Delivery / Active Evaluation Banner */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-emerald-950/20 to-black border border-amber-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Projeniz İçin Memnuniyet Anketi & Web Sitesi Yorumu Bırakın
                    </div>
                    <div className="text-[11px] text-[#8a8f98]">
                      Görüşleriniz ve başarı metrikleriniz ana sayfamızdaki Referanslar vitrininde şirketinizle birlikte yayınlansın.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openSurveyModal(currentProject.projectCode)}
                  className="btn-linear-primary px-3.5 py-1.5 text-xs font-semibold rounded-lg shrink-0 cursor-pointer"
                >
                  Anketi Doldur
                </button>
              </div>

              {/* Progress & KPIs Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
                {/* Overall Progress */}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#8a8f98]">{t.tracker.overallProgress}</span>
                    <span className="font-mono text-white text-sm">
                      %{currentProject.overallProgress}
                    </span>
                  </div>
                  <div className="w-full bg-[#050506] h-2.5 rounded-full overflow-hidden border border-white/[0.08]">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${currentProject.overallProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#8a8f98] font-mono pt-1">
                    <span>Başlangıç: {currentProject.startDate}</span>
                    <span>{t.tracker.estDelivery}: {currentProject.estimatedDeliveryDate}</span>
                  </div>
                </div>

                {/* Lead Architect */}
                <div className="p-4 bg-[#050506] rounded-xl border border-white/[0.08]">
                  <div className="text-xs text-[#8a8f98] mb-1">{t.tracker.projectManager}</div>
                  <div className="text-sm font-bold text-[#f7f8f8]">{currentProject.leadArchitect}</div>
                  {currentProject.stagingUrl && (
                    <a
                      href={currentProject.stagingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-white hover:underline font-mono"
                    >
                      <span>Staging Demo</span>
                      <ExternalLink className="w-3 h-3 text-[#8a8f98]" />
                    </a>
                  )}
                </div>

                {/* Budget Status */}
                <div className="p-4 bg-[#050506] rounded-xl border border-white/[0.08] font-mono">
                  <div className="text-xs text-[#8a8f98] mb-1">{t.tracker.budgetPaid}</div>
                  <div className="text-sm font-bold text-[#f7f8f8]">
                    ₺{currentProject.paidAmount.toLocaleString('tr-TR')} / ₺{currentProject.totalBudget.toLocaleString('tr-TR')}
                  </div>
                  <div className="text-xs text-[#8a8f98] mt-1">
                    Kalan: ₺{(currentProject.totalBudget - currentProject.paidAmount).toLocaleString('tr-TR')}
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones & Sprint Tasks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Connected Dynamic Timeline (7 cols) */}
              <div className="lg:col-span-7 linear-card rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                  <h4 className="text-base font-bold text-[#f7f8f8] flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-emerald-400" />
                    <span>{t.tracker.milestonesTitle}</span>
                  </h4>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>
                      {language === 'tr' ? 'Mevcut Aşama:' : 'Current:'}{' '}
                      <strong>{currentProject.currentStageName || currentProject.currentStage}</strong>
                    </span>
                  </div>
                </div>

                {/* Timeline Strip */}
                <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-white/[0.08] before:h-[92%] before:top-4">
                  {currentProject.milestones.map((m, idx) => {
                    const isActive =
                      !m.completed &&
                      (m.title.tr.toLowerCase() === currentProject.currentStageName?.toLowerCase() ||
                        m.stage === currentProject.currentStage ||
                        m.progress > 0);

                    return (
                      <div key={m.id} className="relative pl-10 group">
                        {/* Timeline Node */}
                        <div
                          className={`absolute left-2.5 top-3.5 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center transition-all z-10 ${
                            m.completed
                              ? 'bg-emerald-500 text-black ring-4 ring-emerald-500/20'
                              : isActive
                              ? 'bg-emerald-400 ring-4 ring-emerald-400/30 animate-pulse'
                              : 'bg-[#121318] border-2 border-white/20'
                          }`}
                        >
                          {m.completed && <CheckCircle2 className="w-3.5 h-3.5 text-black stroke-[3]" />}
                        </div>

                        {/* Milestone Card */}
                        <div
                          className={`p-4 sm:p-5 rounded-xl border transition-all ${
                            isActive
                              ? 'bg-emerald-500/[0.05] border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                              : m.completed
                              ? 'bg-white/[0.02] border-emerald-500/20'
                              : 'bg-[#050506] border-white/[0.06] opacity-75'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs text-[#8a8f98]">
                                  #{idx + 1}
                                </span>
                                <span className="text-sm font-bold text-white">
                                  {language === 'tr' ? m.title.tr : m.title.en}
                                </span>
                                {isActive && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold animate-pulse">
                                    {language === 'tr' ? 'ŞU AN BU AŞAMADA' : 'CURRENT STAGE'}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#8a8f98] leading-relaxed">
                                {language === 'tr' ? m.description.tr : m.description.en}
                              </p>

                              {/* Progress bar if active */}
                              {isActive && (
                                <div className="pt-2 max-w-sm">
                                  <div className="flex justify-between text-[11px] font-mono mb-1 text-emerald-400">
                                    <span>{language === 'tr' ? 'Aşama İlerlemesi:' : 'Stage Progress:'}</span>
                                    <span>%{m.progress}</span>
                                  </div>
                                  <div className="w-full bg-[#050506] h-1.5 rounded-full overflow-hidden border border-white/10">
                                    <div
                                      className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                                      style={{ width: `${m.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Dynamic Dates Grid: Beklenen Bitiş & Tamamlanma Tarihi */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2.5 mt-2 border-t border-white/[0.06] text-xs">
                                {/* 1. Beklenen Bitiş Tarihi */}
                                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                                  <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#8a8f98]">
                                      {language === 'tr' ? 'Beklenen Bitiş Tarihi' : 'Target Due Date'}
                                    </span>
                                    <span className="font-mono font-semibold text-white text-xs truncate">
                                      {formatDateLocalized(m.dueDate, language) || (language === 'tr' ? 'Belirtilmedi' : 'Not set')}
                                    </span>
                                  </div>
                                </div>

                                {/* 2. Tamamlanma Tarihi */}
                                <div
                                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all ${
                                    m.completed
                                      ? 'bg-emerald-500/[0.08] border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-950/20'
                                      : 'bg-white/[0.02] border-white/[0.06] text-[#8a8f98]'
                                  }`}
                                >
                                  {m.completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                                  )}
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] uppercase font-mono tracking-wider">
                                      {language === 'tr' ? 'Tamamlanma Tarihi' : 'Completion Date'}
                                    </span>
                                    <span
                                      className={`font-mono text-xs font-semibold truncate ${
                                        m.completed ? 'text-emerald-300' : 'text-zinc-400'
                                      }`}
                                    >
                                      {m.completed
                                        ? (formatDateLocalized(m.completedDate, language) ||
                                           formatDateLocalized(m.dueDate, language) ||
                                           (language === 'tr' ? 'Tamamlandı' : 'Completed'))
                                        : isActive
                                        ? (language === 'tr' ? 'Devam Ediyor' : 'In Progress')
                                        : (language === 'tr' ? 'Planlandı' : 'Upcoming')}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Additional Start Date Note if available */}
                              {m.startDate && (
                                <div className="text-[10px] font-mono text-[#62666d] pt-0.5 flex items-center gap-1.5">
                                  <span>{language === 'tr' ? 'Aşama Başlangıcı:' : 'Phase Started:'}</span>
                                  <span className="text-zinc-400 font-medium">
                                    {formatDateLocalized(m.startDate, language)}
                                  </span>
                                </div>
                              )}
                            </div>

                            <span
                              className={`px-2.5 py-1 text-[10px] font-mono font-semibold rounded-md uppercase tracking-wider shrink-0 self-start ${
                                m.completed
                                  ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/25'
                                  : isActive
                                  ? 'bg-white text-black font-bold shadow'
                                  : 'bg-white/[0.04] text-[#8a8f98] border border-white/[0.08]'
                              }`}
                            >
                              {m.completed
                                ? language === 'tr' ? 'Tamamlandı' : 'Completed'
                                : isActive
                                ? language === 'tr' ? 'Devam Ediyor' : 'In Progress'
                                : language === 'tr' ? 'Planlandı' : 'Upcoming'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Sprint Tasks Checklist & Live Activity */}
              <div className="lg:col-span-5 space-y-6">
                {/* Sprint Tasks */}
                <div className="linear-card rounded-2xl p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-[#f7f8f8] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-white" />
                      <span>{t.tracker.activeSprintTitle}</span>
                    </h4>
                    {!systemSettings.hideInternalTasksFromClient && (
                      <span className="text-xs font-mono text-[#8a8f98]">
                        {currentProject.sprintTasks.filter((st) => st.status === 'done').length} /{' '}
                        {currentProject.sprintTasks.length}
                      </span>
                    )}
                  </div>

                  {systemSettings.hideInternalTasksFromClient ? (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-[#8a8f98] space-y-2 text-center py-6">
                      <Lock className="w-5 h-5 text-zinc-500 mx-auto" />
                      <div className="text-white font-medium">İç Mühendislik Görevleri Gizli</div>
                      <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                        Şirket gizlilik ve güvenlik politikası uyarınca detaylı sprint alt görevleri müşteri panelinde listelenmez. Süreç kilometre taşları üzerinden şeffafça takip edilmektedir.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {currentProject.sprintTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => toggleSprintTask(currentProject.projectCode, task.id)}
                          className="flex items-center justify-between p-3 rounded-lg bg-[#050506] hover:bg-white/[0.04] border border-white/[0.08] cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={task.status === 'done'}
                              onChange={() => {}}
                              className="rounded border-white/20 text-white focus:ring-0 cursor-pointer"
                            />
                            <span
                              className={`text-xs ${
                                task.status === 'done'
                                  ? 'line-through text-[#62666d]'
                                  : 'text-zinc-200 font-medium'
                              }`}
                            >
                              {language === 'tr' ? task.title.tr : task.title.en}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#8a8f98] px-1.5 py-0.5 rounded bg-white/[0.03]">
                            {task.assignee}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Live Activity Feed */}
                <div className="linear-card rounded-2xl p-6 sm:p-8 space-y-4">
                  <h4 className="text-base font-bold text-[#f7f8f8] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>{t.tracker.activityLogTitle}</span>
                  </h4>

                  <div className="space-y-3">
                    {currentProject.activities.map((act) => (
                      <div
                        key={act.id}
                        className="p-3 rounded-lg bg-[#050506] border border-white/[0.08] space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{act.actor}</span>
                          <span className="text-[10px] font-mono text-[#8a8f98]">
                            {act.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-[#8a8f98]">
                          {language === 'tr' ? act.action.tr : act.action.en}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. APPOINTMENT TRACKER DISPLAY ================= */}
        {hasSearched && currentAppointment && (
          <div className="linear-card rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono text-[#8a8f98]">
                {currentAppointment.trackingCode}
              </span>
              <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                {currentAppointment.status === 'confirmed' ? 'Onaylandı' : 'Beklemede'}
              </span>
            </div>

            <div className="mt-4 space-y-3 text-sm text-[#8a8f98]">
              <div>
                <span className="text-[#62666d] text-xs block">Görüşme Hizmeti</span>
                <span className="font-semibold text-white">{currentAppointment.serviceName}</span>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[#62666d] text-xs block">Tarih</span>
                  <span className="font-mono text-white">{currentAppointment.date}</span>
                </div>
                <div>
                  <span className="text-[#62666d] text-xs block">Saat</span>
                  <span className="font-mono text-white">{currentAppointment.timeSlot}</span>
                </div>
              </div>
              <div>
                <span className="text-[#62666d] text-xs block">Danışan</span>
                <span className="text-white">{currentAppointment.clientName}</span> (
                {currentAppointment.companyName})
              </div>
              <div className="pt-2 text-xs text-[#8a8f98]">
                Toplantı Formatı: {currentAppointment.meetingType === 'google_meet' ? 'Google Meet' : currentAppointment.meetingType === 'zoom' ? 'Zoom' : 'Lodonsoft Ofisi'}
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. QUOTE TRACKER DISPLAY ================= */}
        {hasSearched && currentQuote && (
          <div className="linear-card rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono text-[#8a8f98]">
                {currentQuote.trackingCode}
              </span>
              <span className="px-2.5 py-1 text-xs rounded-full bg-white/[0.06] border border-white/[0.1] text-white font-medium">
                {currentQuote.status === 'proposal_sent' ? 'Teklif İletildi' : 'İnceleniyor'}
              </span>
            </div>

            <div className="mt-4 space-y-3 text-sm text-[#8a8f98]">
              <div>
                <span className="text-[#62666d] text-xs block">Müşteri / Şirket</span>
                <span className="font-semibold text-white">{currentQuote.clientName}</span> ({currentQuote.companyName})
              </div>
              <div>
                <span className="text-[#62666d] text-xs block">Bütçe & Zaman Planı</span>
                <span className="font-mono text-white">{currentQuote.budgetRange} · {currentQuote.targetTimeline}</span>
              </div>
              {currentQuote.estimatedCost && (
                <div className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-xl">
                  <span className="text-xs text-[#8a8f98] font-medium block">Mühendislik Ön Fiyat Tahmini:</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">{currentQuote.estimatedCost}</span>
                </div>
              )}
              <div className="pt-2 border-t border-white/[0.08]">
                <span className="text-[#62666d] text-xs block">Kapsam Özeti</span>
                <p className="text-xs text-[#8a8f98] mt-1">{currentQuote.description}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setIsChatOpen(true)}
                className="btn-linear-primary px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-black" />
                <span>Teklif Detayları İçin Görüş</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= 4. NOT FOUND FALLBACK ================= */}
        {hasSearched && !hasResult && (
          <div className="linear-card rounded-2xl p-10 max-w-xl mx-auto text-center">
            <h4 className="text-lg font-bold text-white mb-2">{t.tracker.notFoundTitle}</h4>
            <p className="text-xs sm:text-sm text-[#8a8f98] leading-relaxed mb-6">
              {t.tracker.notFoundDesc}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleSelectCode('LOD-2026-01')}
                className="btn-linear-primary px-5 py-2.5 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Demo Projeyi Yükle (LOD-2026-01)
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
