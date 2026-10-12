import React from 'react';
import { useApp } from '../context/AppContext';
import { Printer, X, CheckCircle, Clock } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const {
    t,
    activeInvoiceModal,
    setActiveInvoiceModal,
    openPaymentModal,
    systemSettings,
  } = useApp();

  if (!activeInvoiceModal) return null;

  const inv = activeInvoiceModal;

  const handlePrint = () => {
    window.print();
  };

  const handlePay = () => {
    setActiveInvoiceModal(null);
    openPaymentModal({
      amount: inv.totalAmount,
      title: `${inv.invoiceNumber} Nolu Fatura`,
      invoiceId: inv.id,
      projectCode: inv.projectCode,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0a0b0e] border border-white/[0.12] rounded-2xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl relative my-8 print:border-none print:shadow-none print:bg-white print:text-black print:p-0">
        {/* Close Button (hidden in print) */}
        <button
          onClick={() => setActiveInvoiceModal(null)}
          className="no-print absolute top-5 right-5 text-[#8a8f98] hover:text-white p-1 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-white/[0.08] print:border-neutral-300">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-5 h-5 rounded-md bg-white text-black font-bold text-xs flex items-center justify-center">
                L
              </div>
              <span className="text-xl font-bold tracking-tight text-white print:text-black">
                Lodonsoft
              </span>
            </div>
            <div className="text-xs text-[#8a8f98] print:text-neutral-600 space-y-0.5">
              <div className="font-semibold text-white print:text-neutral-900">
                {t.invoice.companyTitle}
              </div>
              <div>{t.invoice.address}</div>
              <div>{t.invoice.taxOffice} · {t.invoice.taxNumber}</div>
              <div className="font-mono">info@lodonsoft.com · +90 (212) 809 45 00</div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs font-mono uppercase tracking-wider text-white print:text-blue-700 font-bold">
              {t.invoice.title}
            </div>
            <div className="font-mono text-lg font-bold text-white print:text-black mt-1">
              {inv.invoiceNumber}
            </div>
            <div className="text-xs text-[#8a8f98] print:text-neutral-600 mt-2 space-y-0.5 font-mono">
              <div>{t.invoice.date} {inv.issueDate}</div>
              <div>{t.invoice.dueDate} {inv.dueDate}</div>
            </div>
          </div>
        </div>

        {/* Client Details & Status Badge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-white/[0.08] print:border-neutral-300 text-xs">
          <div>
            <span className="text-[#62666d] print:text-neutral-500 block mb-1">
              {t.invoice.billTo}
            </span>
            <div className="font-bold text-sm text-white print:text-black">
              {inv.clientCompany}
            </div>
            <div className="text-[#8a8f98] print:text-neutral-700 mt-1">
              Yetkili: {inv.clientName}
            </div>
            {inv.clientTaxNo && (
              <div className="text-[#8a8f98] print:text-neutral-600 font-mono mt-0.5">
                {inv.clientTaxNo}
              </div>
            )}
            <div className="text-[#8a8f98] print:text-neutral-600 mt-0.5">
              {inv.clientAddress}
            </div>
            <div className="text-[#8a8f98] print:text-neutral-600 mt-0.5 font-mono">
              {inv.clientEmail}
            </div>
          </div>

          <div className="flex flex-col sm:items-end justify-center">
            <div className="text-[#62666d] print:text-neutral-500 text-xs mb-1">
              {t.invoice.status}
            </div>
            {inv.status === 'paid' ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-800 text-emerald-400 font-bold font-mono print:border-emerald-600 print:text-emerald-700">
                <CheckCircle className="w-4 h-4" />
                <span>{t.invoice.statusPaid}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/30 border border-amber-800 text-amber-400 font-bold font-mono print:border-amber-600 print:text-amber-700">
                <Clock className="w-4 h-4" />
                <span>{t.invoice.statusPending}</span>
              </div>
            )}
            {inv.paidAt && (
              <div className="text-[11px] text-[#62666d] print:text-neutral-500 font-mono mt-1">
                Ödeme Tarihi: {inv.paidAt} ({inv.paymentMethod})
              </div>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] print:border-neutral-300 text-[#8a8f98] print:text-neutral-600 pb-2">
                <th className="py-2 font-semibold">{t.invoice.description}</th>
                <th className="py-2 text-center font-semibold">{t.invoice.quantity}</th>
                <th className="py-2 text-right font-semibold">{t.invoice.unitPrice}</th>
                <th className="py-2 text-right font-semibold">{t.invoice.total}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] print:divide-neutral-200">
              {inv.items.map((item, idx) => (
                <tr key={idx} className="text-[#f7f8f8] print:text-neutral-900">
                  <td className="py-3 font-medium">{item.description}</td>
                  <td className="py-3 text-center font-mono">{item.quantity}</td>
                  <td className="py-3 text-right font-mono text-[#8a8f98]">₺{item.unitPrice.toLocaleString('tr-TR')}</td>
                  <td className="py-3 text-right font-mono font-semibold">₺{item.total.toLocaleString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="pt-4 border-t border-white/[0.08] print:border-neutral-300 flex justify-end">
          <div className="w-64 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-[#8a8f98] print:text-neutral-600">
              <span>{t.invoice.subtotal}</span>
              <span>₺{inv.subtotal.toLocaleString('tr-TR')}</span>
            </div>
            <div className="flex justify-between text-[#8a8f98] print:text-neutral-600">
              <span>{t.invoice.vat}</span>
              <span>₺{inv.taxAmount.toLocaleString('tr-TR')}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white print:text-neutral-900 pt-2 border-t border-white/[0.08] print:border-neutral-300">
              <span>{t.invoice.grandTotal}</span>
              <span className="text-emerald-400 print:text-neutral-900">
                ₺{inv.totalAmount.toLocaleString('tr-TR')}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Legal Footnote */}
        <div className="pt-4 border-t border-white/[0.04] text-[11px] text-[#62666d] print:text-neutral-500 space-y-1">
          <div>* Ödemeler sistemde belirtilen banka IBAN hesabına veya portal üzerinden 256-bit SSL korumalı kart ile yapılmalıdır.</div>
          {systemSettings.ipTransferClauseEnabled && (
            <div className="text-emerald-400/90 print:text-emerald-700">
              * Fikri Mülkiyet (IP) Maddesi: Fatura bedeli ödendiğinde projeye ait kaynak kodlar ve tasarım hakları eksiksiz devredilir.
            </div>
          )}
        </div>

        {/* Footer Actions (no-print) */}
        <div className="no-print mt-6 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          {systemSettings.allowClientInvoiceDownload ? (
            <button
              onClick={handlePrint}
              className="btn-linear-secondary px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#8a8f98]" />
              <span>{t.invoice.printPdf}</span>
            </button>
          ) : (
            <div className="text-xs text-zinc-500 italic flex items-center gap-1.5">
              <span>(Fatura indirme izni kısıtlanmıştır)</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {inv.status === 'pending' && (
              <button
                onClick={handlePay}
                className="btn-linear-primary px-5 py-2 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Hemen Öde
              </button>
            )}
            <button
              onClick={() => setActiveInvoiceModal(null)}
              className="px-4 py-2 text-xs font-medium text-[#8a8f98] hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              {t.invoice.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
