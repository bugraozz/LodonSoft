import React from 'react';
import { useApp } from '../context/AppContext';
import { Scales } from './ui/scales';

export const Footer: React.FC = () => {
  const { systemSettings, openLegalModal } = useApp();

  const companyName = systemSettings?.companyName || 'Lodonsoft Bilişim Teknolojileri A.Ş.';
  const address = systemSettings?.address || 'Büyükdere Cad. No: 199, Levent 199 K: 24, Şişli / İstanbul';
  const email = systemSettings?.supportEmail || 'destek@lodonsoft.com';
  const phone = systemSettings?.phone || '+90 (212) 890 40 50';

  return (
    <footer className="relative bg-[#060709] border-t border-white/[0.08] text-[#9ca3af] overflow-hidden selection:bg-white/20 selection:text-white">
      {/* Aceternity Vertical Scales Background */}
      <Scales
        orientation="vertical"
        size={24}
        color="rgba(255, 255, 255, 0.05)"
        className="opacity-70 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_30%,transparent_100%)] pointer-events-none"
      />

      {/* Top Subtle Ambient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Main Columns: Lodonsoft, Merkez, İletişim */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-12 border-b border-white/[0.08]">
          {/* Lodonsoft */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="text-xl font-bold tracking-tight text-white font-sans">
              Lodonsoft
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md font-normal">
              Yüksek performanslı yazılım mimarileri, bulut altyapıları ve kurumsal ölçekte modern dijital ürünler geliştiren teknoloji stüdyosu.
            </p>
          </div>

          {/* Merkez */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase font-sans">
              Merkez
            </h4>
            <div className="text-sm text-neutral-400 leading-relaxed space-y-1">
              <p className="text-white font-medium">{companyName}</p>
              <p>{address}</p>
            </div>
          </div>

          {/* İletişim */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase font-sans">
              İletişim
            </h4>
            <div className="text-sm text-neutral-400 leading-relaxed space-y-1.5">
              <p>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-white transition-colors inline-block"
                >
                  {email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="hover:text-white transition-colors inline-block"
                >
                  {phone}
                </a>
              </p>
              <p className="text-xs text-neutral-500 pt-1">
                Hafta İçi: 09:00 - 18:30
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Telif Hakkı & Hukuki Bağlantılar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-sans">
          <p>© 2026 {companyName}. Tüm hakları saklıdır.</p>

          <div className="flex flex-wrap items-center gap-5 text-xs">
            <button
              type="button"
              onClick={() => openLegalModal('privacy')}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Gizlilik Politikası
            </button>
            <span className="text-white/15">·</span>
            <button
              type="button"
              onClick={() => openLegalModal('terms')}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Kullanım Koşulları
            </button>
            <span className="text-white/15">·</span>
            <button
              type="button"
              onClick={() => openLegalModal('kvkk')}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              KVKK Aydınlatma Metni
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
