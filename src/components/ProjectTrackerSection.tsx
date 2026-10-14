import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MessageSquare,
  CreditCard,
  FileText,
  Shield,
  KeyRound,
  ArrowRight,
  Lock,
  CheckCircle2,
} from 'lucide-react';

export const ProjectTrackerSection: React.FC = () => {
  const {
    language,
    t,
    projects,
    invoices,
    chatMessages,
    activeProjectCode,
    setActiveProjectCode,
    openPaymentModal,
    setActiveInvoiceModal,
    setIsChatOpen,
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

  const projectInvoices = activeProjectCode
    ? invoices.filter((inv) => inv.projectCode?.toLowerCase() === activeProjectCode.toLowerCase())
    : [];
  const projectMessages = activeProjectCode
    ? chatMessages.filter((message) => message.projectCode.toLowerCase() === activeProjectCode.toLowerCase())
    : [];
  const latestTeamMessages = projectMessages.filter((message) => message.sender === 'team').slice(-3).reverse();
  const hasResult = Boolean(currentProject);

  return (
    <section id="tracker" className="py-20 lg:py-28 bg-[#050506]  min-h-[750px] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="linear-card rounded-2xl p-6 sm:p-8 mb-12 shadow-2xl max-w-3xl">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <KeyRound className="w-4 h-4 text-white" />
            <span>Proje Kodunuzu Girin</span>
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
              LOD-2026-02 <span className="text-[11px] text-emerald-400/80 ml-1">(Örnek Proje)</span>
            </button>
          </div>
        </div>

        {!hasSearched && (
          <div className="linear-card rounded-2xl p-8 sm:p-12 max-w-3xl text-center border border-white/[0.08]">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.1] mx-auto flex items-center justify-center mb-5 text-white">
              <KeyRound className="w-7 h-7 text-zinc-300" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Müşteri Proje Alanı
            </h3>
            <p className="text-sm text-[#8a8f98] max-w-lg mx-auto leading-relaxed mb-6">
              Projenize ait teknik ekip mesajlarını, faturaları ve hakediş ödeme seçeneğini görüntülemek için proje kodunuzu girin.
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

        {hasSearched && currentProject && (
          <div className="space-y-6">
            <div className="linear-card rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="pb-5 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8a8f98] mb-1.5">
                  <span className="text-white font-semibold">{currentProject.projectCode}</span>
                  <span>·</span>
                  <span>{currentProject.clientName}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#f7f8f8]">{currentProject.title}</h3>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 pt-5">
                <section className="rounded-xl border border-white/[0.08] bg-[#050506] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Teknik ekiple mesajlaşma</h4>
                      <p className="text-[11px] text-[#8a8f98] mt-1">Mesaj gönderin ve teknik ekipten gelen yanıtları görüntüleyin.</p>
                    </div>
                    <MessageSquare className="w-5 h-5 text-sky-400 shrink-0" />
                  </div>

                  {latestTeamMessages.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {latestTeamMessages.map((message) => (
                        <div key={message.id} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                          <div className="flex items-center justify-between gap-2 text-[10px] text-[#8a8f98]">
                            <span className="font-semibold text-zinc-300">{message.senderName} · Teknik Ekip</span>
                            <span>{message.timestamp}</span>
                          </div>
                          <p className="text-xs leading-relaxed text-zinc-200 mt-1.5">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-xs text-[#8a8f98]">
                      Henüz teknik ekip mesajı yok.
                    </p>
                  )}

                  {systemSettings.allowClientDirectChat ? (
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="btn-linear-secondary w-full mt-4 px-4 py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{t.tracker.chatWithTeam}</span>
                    </button>
                  ) : (
                    <div
                      className="mt-4 px-3.5 py-2.5 text-xs font-semibold rounded-lg bg-white/[0.02] border border-white/[0.06] text-zinc-500 flex items-center justify-center gap-1.5"
                      title="Teknik ekibe yeni mesaj göndermek yönetici ayarlarından kapatılmıştır."
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Yeni mesaj gönderme kapalı</span>
                    </div>
                  )}
                </section>

                <section className="rounded-xl border border-white/[0.08] bg-[#050506] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Faturalar</h4>
                      <p className="text-[11px] text-[#8a8f98] mt-1">Bu projeye ait faturaları görüntüleyin.</p>
                    </div>
                    <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                  </div>

                  {projectInvoices.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {projectInvoices.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white">{invoice.invoiceNumber}</div>
                            <div className="text-[10px] text-[#8a8f98] mt-1">
                              {invoice.status === 'paid' ? 'Ödendi' : invoice.status === 'overdue' ? 'Vadesi geçti' : 'Ödeme bekliyor'}
                              {' · '}₺{invoice.totalAmount.toLocaleString('tr-TR')}
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveInvoiceModal(invoice)}
                            className="btn-linear-secondary px-3 py-2 text-[11px] font-semibold rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{t.tracker.viewInvoice}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-xs text-[#8a8f98]">
                      Bu proje için henüz fatura oluşturulmamış.
                    </p>
                  )}
                </section>

                <section className="rounded-xl border border-white/[0.08] bg-[#050506] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Hakediş / Faz ödemesi</h4>
                      <p className="text-[11px] text-[#8a8f98] mt-1">Ödeme için kalan tutarı görüntüleyip güvenli ödeme adımına geçin.</p>
                    </div>
                    <CreditCard className="w-5 h-5 text-emerald-400 shrink-0" />
                  </div>
                  <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="text-[11px] text-[#8a8f98]">Ödenecek hakediş tutarı</div>
                    <div className="mt-1 text-2xl font-bold font-mono text-white">
                      ₺{Math.max(0, currentProject.totalBudget - currentProject.paidAmount).toLocaleString('tr-TR')}
                    </div>
                  </div>
                  {currentProject.totalBudget > currentProject.paidAmount ? (
                    <button
                      onClick={() =>
                        openPaymentModal({
                          amount: currentProject.totalBudget - currentProject.paidAmount,
                          title: `${currentProject.title} – Hakediş / Faz Ödemesi`,
                          projectCode: currentProject.projectCode,
                        })
                      }
                      className="btn-linear-primary w-full mt-4 px-4 py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-black" />
                      <span>{t.tracker.payMilestone}</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 mt-4 px-4 py-2.5 text-xs font-semibold text-emerald-300 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ödenecek bakiye bulunmuyor</span>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        )}

        {hasSearched && !hasResult && (
          <div className="linear-card rounded-2xl p-10 max-w-xl mx-auto text-center">
            <h4 className="text-lg font-bold text-white mb-2">Proje bulunamadı</h4>
            <p className="text-xs sm:text-sm text-[#8a8f98] leading-relaxed mb-6">
              Girdiğiniz proje kodunu kontrol edip tekrar deneyin.
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
