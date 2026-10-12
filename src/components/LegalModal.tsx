import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  FileText,
  Lock,
  X,
  Printer,
  Copy,
  Check,
  Building,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export const LegalModal: React.FC = () => {
  const { legalModal, closeLegalModal, openLegalModal, systemSettings } = useApp();
  const [copied, setCopied] = useState(false);

  if (!legalModal?.isOpen) return null;

  const activeTab = legalModal.activeTab;

  const getContent = () => {
    switch (activeTab) {
      case 'privacy':
        return systemSettings.privacyPolicyContent || 'Gizlilik politikası metni henüz yapılandırılmamış.';
      case 'terms':
        return systemSettings.termsOfServiceContent || 'Kullanım koşulları metni henüz yapılandırılmamış.';
      case 'kvkk':
        return systemSettings.kvkkTextContent || 'KVKK aydınlatma metni henüz yapılandırılmamış.';
      default:
        return '';
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'privacy':
        return 'Gizlilik & Veri Güvenliği Politikası';
      case 'terms':
        return 'Kullanım Koşulları & Hizmet Şartları';
      case 'kvkk':
        return 'KVKK Aydınlatma & Veri Sahibi Hakları';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0a0b0e] border border-white/[0.12] rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 print:border-none print:shadow-none print:bg-white print:text-black print:p-0 flex flex-col max-h-[90vh]">
        
        {/* Header & Close Button */}
        <div className="flex items-start justify-between pb-5 border-b border-white/[0.08] print:border-neutral-300">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-md bg-white text-black font-bold text-xs flex items-center justify-center">
                L
              </div>
              <span className="text-xs font-mono tracking-wider uppercase text-zinc-400">
                {systemSettings.legalEntityName || 'Lodonsoft Bilişim Teknolojileri A.Ş.'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white print:text-black tracking-tight">
              {getTitle()}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8a8f98] mt-2 font-mono">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Yürürlük / Son Güncelleme: {systemSettings.legalLastUpdated || 'Ekim 2026'}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mersis: {systemSettings.mersisNumber || '0609088192300001'}</span>
              </span>
            </div>
          </div>

          <button
            onClick={closeLegalModal}
            className="no-print text-[#8a8f98] hover:text-white p-2 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector (no-print) */}
        <div className="no-print pt-4 pb-2 flex items-center gap-1.5 overflow-x-auto border-b border-white/[0.06]">
          <button
            type="button"
            onClick={() => openLegalModal('privacy')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-white text-black shadow-xs'
                : 'text-[#8a8f98] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Gizlilik Politikası</span>
          </button>

          <button
            type="button"
            onClick={() => openLegalModal('terms')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'bg-white text-black shadow-xs'
                : 'text-[#8a8f98] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Kullanım Koşulları</span>
          </button>

          <button
            type="button"
            onClick={() => openLegalModal('kvkk')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'kvkk'
                ? 'bg-white text-black shadow-xs'
                : 'text-[#8a8f98] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>KVKK Aydınlatma Metni</span>
          </button>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto py-5 pr-2 my-2 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans space-y-4 whitespace-pre-line selection:bg-white/20">
          <div className="p-4 rounded-xl bg-[#050506] border border-white/[0.06] text-xs text-[#8a8f98] space-y-1">
            <div className="flex items-center gap-2 text-white font-medium">
              <Building className="w-3.5 h-3.5 text-emerald-400" />
              <span>{systemSettings.companyName || 'Lodonsoft'} Resmi Hukuki Beyanı</span>
            </div>
            <div>
              Vergi Dairesi & No: {systemSettings.taxOffice || 'Zincirlikuyu VD'} - {systemSettings.taxNumber || '6090881923'} | Adres: {systemSettings.address || 'Büyükdere Cad. No: 198 Levent / İstanbul'}
            </div>
            <div>
              İletişim & Tebligat E-Posta: <span className="font-mono text-zinc-300">{systemSettings.supportEmail || 'destek@lodonsoft.com'}</span>
            </div>
          </div>

          <div className="bg-[#07080a] p-5 sm:p-6 rounded-xl border border-white/[0.08] text-zinc-200 font-mono text-[11px] sm:text-xs leading-6">
            {content}
          </div>
        </div>

        {/* Footer Actions (no-print) */}
        <div className="no-print pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-[11px] text-[#62666d]">
            Bu metinler Lodonsoft Yönetim Paneli üzerinden güncellenmektedir.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn-linear-secondary px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer text-zinc-300 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copied ? 'Kopyalandı' : 'Metni Kopyala'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn-linear-secondary px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer text-zinc-300 hover:text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-400" />
              <span>Yazdır / PDF</span>
            </button>

            <button
              onClick={closeLegalModal}
              className="btn-linear-primary px-4 py-1.5 rounded-lg font-semibold cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
