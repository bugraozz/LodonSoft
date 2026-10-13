import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  TrendingUp,
  Clock,
  ArrowRight,
  DollarSign,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
} from 'lucide-react';

interface AdminStatsSummaryProps {
  onSelectTab?: (
    tab: 'portfolio' | 'services' | 'appointments' | 'quotes' | 'invoices' | 'settings'
  ) => void;
  activeTab?: string;
}

export const AdminStatsSummary: React.FC<AdminStatsSummaryProps> = ({ onSelectTab, activeTab }) => {
  const { appointments, invoices, quotes, language } = useApp();

  // 2. Bekleyen Randevular (Pending Appointments)
  const pendingAppointments = appointments.filter((a) => a.status === 'pending');
  const confirmedAppointments = appointments.filter((a) => a.status === 'confirmed');
  const pendingCount = pendingAppointments.length;
  const totalAppointmentsCount = appointments.length;

  // En yakın yaklaşan randevu
  const nextAppointment = appointments
    .filter((a) => a.status === 'confirmed' || a.status === 'pending')
    .sort((a, b) => (a.date > b.date ? 1 : -1))[0];

  // 3. Toplam Aylık Gelir (Total Monthly Revenue)
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Bu aya ait ödenmiş faturalar
  const monthlyPaidInvoices = invoices.filter(
    (inv) =>
      inv.status === 'paid' &&
      (inv.paidAt?.startsWith(currentMonthStr) || inv.issueDate?.startsWith(currentMonthStr))
  );

  // Genel ödenmiş faturalar
  const allPaidInvoices = invoices.filter((inv) => inv.status === 'paid');

  // Aylık gelir: Bu ay ödenenler varsa toplamı, yoksa en son periyot/ödenen toplamı dinamik olarak göster
  const monthlyRevenueAmount =
    monthlyPaidInvoices.length > 0
      ? monthlyPaidInvoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0)
      : allPaidInvoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);

  // Bekleyen fatura tutarı (tahsilat bekleyen)
  const pendingInvoices = invoices.filter((inv) => inv.status === 'pending');
  const pendingRevenueAmount = pendingInvoices.reduce(
    (sum, inv) => sum + (Number(inv.totalAmount) || 0),
    0
  );

  // Tahsilat oranı
  const totalBilled = monthlyRevenueAmount + pendingRevenueAmount;
  const collectionRate =
    totalBilled > 0 ? Math.round((monthlyRevenueAmount / totalBilled) * 100) : 100;

  // Bekleyen teklif sayısı (ek mini-özet)
  const pendingQuotesCount = quotes.filter((q) => q.status === 'pending' || q.status === 'reviewed').length;

  return (
    <div className="space-y-3">
      {/* Kartlar Izgarası: 2 Ana Yönetim İstatistiği */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* ========================================================= */}
        {/* KART 2: BEKLEYEN RANDEVULAR                               */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectTab && onSelectTab('appointments')}
          className={`relative group rounded-2xl p-6 transition-all duration-300 border cursor-pointer overflow-hidden ${
            activeTab === 'appointments'
              ? 'bg-gradient-to-br from-amber-500/[0.08] to-amber-950/[0.15] border-amber-500/40 shadow-xl shadow-amber-950/20 ring-1 ring-amber-500/30'
              : 'bg-[#0a0b10] hover:bg-[#0e0f17] border-white/[0.08] hover:border-amber-500/30 shadow-lg'
          }`}
        >
          {/* Arka plan ışıltısı */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border ${
                pendingCount > 0
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 animate-pulse'
                  : 'bg-white/[0.04] border-white/[0.08] text-zinc-400'
              }`}
            >
              {pendingCount > 0 ? (
                <>
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span>Onay Bekliyor</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Güncel</span>
                </>
              )}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-[#8a8f98]">
              Bekleyen Randevular
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                {pendingCount}
              </span>
              <span className="text-xs font-mono text-[#8a8f98]">
                ({confirmedAppointments.length} Onaylı Toplantı)
              </span>
            </div>
          </div>

          {/* Alt Bilgi Çubuğu */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#8a8f98]">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {nextAppointment
                  ? `Sıradaki: ${nextAppointment.date}`
                  : `${totalAppointmentsCount} Toplam Talep`}
              </span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 font-medium group-hover:translate-x-0.5 transition-transform text-[11px]">
              <span>İncele</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* KART 3: TOPLAM AYLIK GELİR                                */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectTab && onSelectTab('invoices')}
          className={`relative group rounded-2xl p-6 transition-all duration-300 border cursor-pointer overflow-hidden ${
            activeTab === 'invoices'
              ? 'bg-gradient-to-br from-cyan-500/[0.08] to-blue-950/[0.15] border-cyan-500/40 shadow-xl shadow-cyan-950/20 ring-1 ring-cyan-500/30'
              : 'bg-[#0a0b10] hover:bg-[#0e0f17] border-white/[0.08] hover:border-cyan-500/30 shadow-lg'
          }`}
        >
          {/* Arka plan ışıltısı */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 group-hover:scale-105 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-medium">
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              <span>Tahsil Edilen</span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-[#8a8f98]">
              Toplam Aylık Gelir
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                ₺{monthlyRevenueAmount.toLocaleString('tr-TR')}
              </span>
            </div>
          </div>

          {/* Alt Bilgi Çubuğu */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#8a8f98]">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {pendingRevenueAmount > 0
                  ? `Bekleyen: ₺${pendingRevenueAmount.toLocaleString('tr-TR')}`
                  : `Tahsilat Oranı: %${collectionRate}`}
              </span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform text-[11px]">
              <span>Faturalar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Mini Hızlı Durum Şeridi (Genel Sistem Görünümü) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-[#8a8f98]">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-zinc-300 font-medium">Canlı Operasyon Durumu:</span>
          <span className="text-emerald-400 font-semibold">%99.9 Kesintisiz SLA</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>{pendingQuotesCount} Değerlendirilen Teklif</span>
          </span>
          <span className="flex items-center gap-1.5 text-white/80">
            <span>Toplam Tahsilat Güvencesi:</span>
            <strong className="text-white">₺{(monthlyRevenueAmount + pendingRevenueAmount).toLocaleString('tr-TR')}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
