import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, Shield, Menu, X, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme, t, activeView, setActiveView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'tracker' | 'booking' | 'admin', anchorId?: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    if (view === 'home' && anchorId) {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          setTimeout(() => {
            document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-transparent  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-base sm:text-lg font-semibold tracking-tight text-[#f7f8f8] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-5 h-5 rounded-md bg-white text-[#050506] font-bold text-xs flex items-center justify-center shadow-xs">
              L
            </div>
            <span>Lodonsoft</span>
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-[#8a8f98]">
            <button
              onClick={() => handleNavClick('home', 'services')}
              className="hover:text-[#f7f8f8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.nav.services}
            </button>
            <button
              onClick={() => handleNavClick('home', 'projects')}
              className="hover:text-[#f7f8f8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.nav.projects}
            </button>
            <button
              onClick={() => handleNavClick('home', 'testimonials')}
              className="hover:text-[#f7f8f8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.nav.testimonials}
            </button>
            <button
              onClick={() => handleNavClick('home', 'process')}
              className="hover:text-[#f7f8f8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.nav.process}
            </button>
            <button
              onClick={() => handleNavClick('tracker')}
              className={`hover:text-[#f7f8f8] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'tracker' ? 'text-white font-semibold' : ''
              }`}
            >
              {t.nav.tracker}
            </button>
            <button
              onClick={() => handleNavClick('booking')}
              className={`hover:text-[#f7f8f8] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'booking' ? 'text-white font-semibold' : ''
              }`}
            >
              {t.nav.booking}
            </button>
          </nav>

          {/* Zone 3: 1 primary action + Language toggle + Theme toggle + Admin */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Language Switcher */}
            <div className="flex items-center bg-[#111216]  rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setLanguage('tr')}
                className={`px-2 py-1 font-semibold rounded-md transition-colors cursor-pointer text-[11px] ${
                  language === 'tr' ? 'bg-white text-black shadow-xs' : 'text-[#8a8f98] hover:text-white'
                }`}
                title="Türkçe"
              >
                TR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 font-semibold rounded-md transition-colors cursor-pointer text-[11px] ${
                  language === 'en' ? 'bg-white text-black shadow-xs' : 'text-[#8a8f98] hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Admin Switch */}
            <button
              onClick={() => handleNavClick(activeView === 'admin' ? 'home' : 'admin')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-white/[0.12] border-white/25 text-white shadow-xs'
                  : 'bg-[#111216] border-white/[0.08] text-[#8a8f98] hover:text-white hover:border-white/[0.18]'
              }`}
              title={activeView === 'admin' ? t.nav.clientView : t.nav.adminPortal}
            >
              <Shield className="w-3.5 h-3.5 text-zinc-300" />
              <span className="text-[11px]">{activeView === 'admin' ? t.nav.clientView : t.nav.adminPortal}</span>
            </button>

            {/* Primary Action Button (Linear White Button) */}
            <button
              onClick={() => handleNavClick('booking')}
              className="btn-linear-primary px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.nav.getProposal}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#8a8f98] hover:text-white rounded-lg focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#0a0b0e] px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => handleNavClick('home', 'services')}
            className="block w-full text-left py-2 text-[#8a8f98] hover:text-white font-medium text-sm"
          >
            {t.nav.services}
          </button>
          <button
            onClick={() => handleNavClick('home', 'projects')}
            className="block w-full text-left py-2 text-[#8a8f98] hover:text-white font-medium text-sm"
          >
            {t.nav.projects}
          </button>
          <button
            onClick={() => handleNavClick('home', 'testimonials')}
            className="block w-full text-left py-2 text-[#8a8f98] hover:text-white font-medium text-sm"
          >
            {t.nav.testimonials}
          </button>
          <button
            onClick={() => handleNavClick('home', 'process')}
            className="block w-full text-left py-2 text-[#8a8f98] hover:text-white font-medium text-sm"
          >
            {t.nav.process}
          </button>
          <button
            onClick={() => handleNavClick('tracker')}
            className="block w-full text-left py-2 text-white font-medium text-sm"
          >
            {t.nav.tracker}
          </button>
          <button
            onClick={() => handleNavClick('booking')}
            className="block w-full text-left py-2 text-[#8a8f98] hover:text-white font-medium text-sm"
          >
            {t.nav.booking}
          </button>
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <button
              onClick={() => handleNavClick(activeView === 'admin' ? 'home' : 'admin')}
              className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium py-1"
            >
              <Shield className="w-4 h-4" />
              <span>{activeView === 'admin' ? t.nav.clientView : t.nav.adminPortal}</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 text-xs text-[#8a8f98] hover:text-white"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse"></span>
                <span className="font-mono text-[11px]">Linear Dark</span>
              </button>
              <div className="text-xs text-[#62666d] flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>{language.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
