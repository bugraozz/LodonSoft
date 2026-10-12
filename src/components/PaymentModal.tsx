import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, CreditCard, X, CheckCircle, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentModal: React.FC = () => {
  const {
    t,
    paymentModal,
    closePaymentModal,
    markInvoicePaid,
    createInvoice,
    setActiveInvoiceModal,
    invoices,
    projects,
  } = useApp();

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [installment, setInstallment] = useState('single');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('482910');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedInvoiceObj, setGeneratedInvoiceObj] = useState<any>(null);

  if (!paymentModal || !paymentModal.isOpen) return null;

  const handleFillTestCard = () => {
    setCardNumber('5428 9201 4410 7823');
    setCardHolder('Ceyda Adil');
    setExpiry('11/29');
    setCvv('428');
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !expiry || !cvv) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsOtpStep(true);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsOtpStep(false);
      setIsSuccess(true);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

      let createdInv;
      if (paymentModal.invoiceId) {
        markInvoicePaid(paymentModal.invoiceId, 'Mastercard 3D Secure (*7823)');
        createdInv = invoices.find((i) => i.id === paymentModal.invoiceId);
      } else {
        const targetProj = projects.find((p) => p.projectCode === paymentModal.projectCode);
        createdInv = createInvoice({
          projectCode: paymentModal.projectCode || 'LOD-2026-01',
          clientName: targetProj?.clientName || 'Aura Capital AG',
          clientCompany: targetProj?.clientName || 'Aura Capital AG',
          clientAddress: 'Büyükdere Cad. No: 198 Levent / İstanbul',
          clientEmail: targetProj?.clientEmail || 'billing@auracapital.com',
          dueDate: new Date().toISOString().split('T')[0],
          items: [
            {
              description: paymentModal.title || 'Kurumsal Yazılım Geliştirme Hakediş Bedeli',
              quantity: 1,
              unitPrice: Math.round(paymentModal.amount / 1.2),
              total: Math.round(paymentModal.amount / 1.2),
            },
          ],
        });
        markInvoicePaid(createdInv.id, 'Mastercard 3D Secure (*7823)');
      }
      setGeneratedInvoiceObj(createdInv);
    }, 1200);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsOtpStep(false);
    setIsProcessing(false);
    closePaymentModal();
  };

  const handleViewInvoice = () => {
    handleClose();
    if (generatedInvoiceObj) {
      setActiveInvoiceModal(generatedInvoiceObj);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0a0b0e] border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-[#8a8f98] hover:text-white p-1 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= 1. SUCCESS STATE ================= */}
        {isSuccess ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-white/[0.04] text-white flex items-center justify-center mx-auto mb-4 border border-white/[0.1]">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            </div>

            <h3 className="text-xl font-bold text-[#f7f8f8] mb-1.5">{t.payment.successTitle}</h3>
            <p className="text-xs sm:text-sm text-[#8a8f98] mb-6">{t.payment.successDesc}</p>

            <div className="p-4 bg-[#050506] rounded-xl border border-white/[0.08] mb-6 text-left space-y-2 text-xs">
              <div className="flex justify-between text-[#8a8f98]">
                <span>İşlem Referansı:</span>
                <span className="font-mono text-[#f7f8f8]">TXN-3DSEC-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between text-[#8a8f98]">
                <span>Ödenen Tutar:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  ₺{paymentModal.amount.toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="flex justify-between text-[#8a8f98]">
                <span>Ödeme Yöntemi:</span>
                <span className="text-[#f7f8f8]">3D Secure / Kart (*7823)</span>
              </div>
              <div className="flex justify-between text-[#8a8f98]">
                <span>E-Fatura Durumu:</span>
                <span className="text-emerald-400 font-semibold">Düzenlendi & Onaylandı</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={handleViewInvoice}
                className="btn-linear-primary w-full py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-black" />
                <span>{t.payment.viewGeneratedInvoice}</span>
              </button>
              <button
                onClick={handleClose}
                className="w-full py-2 px-4 text-xs font-medium text-[#8a8f98] hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        ) : isOtpStep ? (
          /* ================= 2. 3D SECURE OTP STEP ================= */
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-white/[0.04] text-white flex items-center justify-center mx-auto mb-2 border border-white/[0.1]">
              <Shield className="w-6 h-6 text-zinc-200" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#f7f8f8]">3D Secure Doğrulama Kodu</h3>
              <p className="text-xs text-[#8a8f98] mt-1">
                Bankanız tarafından kayıtlı cep telefonunuza iletilen 6 haneli güvenlik şifresini girin.
              </p>
            </div>

            <div className="bg-[#050506] p-3 rounded-xl border border-white/[0.08] text-xs text-[#8a8f98]">
              İşlem Tutarı: <span className="font-mono font-bold text-white">₺{paymentModal.amount.toLocaleString('tr-TR')}</span>
            </div>

            <div>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-48 mx-auto text-center font-mono text-2xl font-bold tracking-widest bg-[#050506] border border-white/[0.2] rounded-xl py-3 text-white focus:outline-hidden focus:border-white"
              />
              <div className="text-[11px] text-[#62666d] mt-1.5 font-mono">
                Simülasyon kodu: 482910
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="btn-linear-primary w-full py-3 px-4 text-sm font-semibold rounded-xl cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? t.payment.processing : 'Onayla ve Ödemeyi Tamamla'}
              </button>
            </div>
          </form>
        ) : (
          /* ================= 3. CARD CHECKOUT FORM ================= */
          <form onSubmit={handleStartPayment} className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
              <div className="p-2 rounded-lg bg-white/[0.04] text-white border border-white/[0.08]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#f7f8f8]">{t.payment.modalTitle}</h3>
                <p className="text-xs text-[#8a8f98]">{t.payment.modalSubtitle}</p>
              </div>
            </div>

            {/* Amount Banner */}
            <div className="bg-[#050506] p-3.5 rounded-xl border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="text-xs text-[#8a8f98]">{t.payment.milestoneLabel}</div>
                <div className="text-xs font-semibold text-[#f7f8f8] truncate max-w-[200px]">
                  {paymentModal.title}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#8a8f98]">{t.payment.amountToPay}</div>
                <div className="text-lg font-bold font-mono text-emerald-400">
                  ₺{paymentModal.amount.toLocaleString('tr-TR')}
                </div>
              </div>
            </div>

            {/* Test Card Fill Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleFillTestCard}
                className="text-[11px] text-[#8a8f98] hover:text-white underline cursor-pointer"
              >
                {t.payment.useTestCard}
              </button>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
                {t.payment.cardHolder} *
              </label>
              <input
                type="text"
                required
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="AD SOYAD"
                className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25]"
              />
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
                {t.payment.cardNumber} *
              </label>
              <input
                type="text"
                required
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="5428 0000 0000 0000"
                className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25] font-mono"
              />
            </div>

            {/* Expiry & CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
                  {t.payment.expiry} *
                </label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="AA/YY"
                  className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25] font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
                  {t.payment.cvv} *
                </label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="•••"
                  className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25] font-mono"
                />
              </div>
            </div>

            {/* Installment Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#8a8f98] uppercase tracking-wider mb-1">
                {t.payment.installment}
              </label>
              <select
                value={installment}
                onChange={(e) => setInstallment(e.target.value)}
                className="w-full bg-[#050506] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#f7f8f8] focus:outline-hidden focus:border-white/[0.25] cursor-pointer"
              >
                <option value="single" className="bg-[#050506]">{t.payment.singlePayment}</option>
                <option value="3" className="bg-[#050506]">{t.payment.installments3}</option>
                <option value="6" className="bg-[#050506]">{t.payment.installments6}</option>
              </select>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-[11px] text-[#62666d] pt-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t.payment.securityNotice}</span>
            </div>

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="btn-linear-primary w-full py-3 px-4 text-sm font-semibold rounded-xl cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>{t.payment.processing}</span>
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-black" />
                    <span>{t.payment.payNow}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
