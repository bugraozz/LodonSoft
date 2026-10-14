import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Calendar,
  Search,
  ChevronDown,
} from 'lucide-react';
import { motion } from 'motion/react';
import { BackgroundBeams } from '@aceternity/ui';

export const Hero: React.FC = () => {
  const { t, setActiveView, setActiveProjectCode } = useApp();
  const [quickTrackerInput, setQuickTrackerInput] = useState('');

  const handleQuickTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackerInput.trim()) {
      setActiveProjectCode(quickTrackerInput.trim());
      setActiveView('tracker');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDemoCode = (code: string) => {
    setActiveProjectCode(code);
    setActiveView('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-between items-center overflow-hidden   linear-glow-hero px-4 py-8 sm:py-12">
      {/* Top spacer to guarantee perfect optical vertical centering */}
      <div className="w-full h-4 hidden sm:block" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto w-full">
        {/* Minimalist Linear Kicker Badge */}

        {/* Centered Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight lg:tracking-[-0.04em] text-white leading-[1.08] text-balance max-w-4xl mx-auto"
        >
          {t.hero.title}
        </motion.h1>

        {/* Centered Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-[#8a8f98] leading-relaxed max-w-2xl mx-auto font-normal text-balance"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* Centered Primary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-3.5 pt-8"
        >
          <button
            onClick={() => {
              const el = document.getElementById('booking');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else setActiveView('booking');
            }}
            className="btn-linear-primary px-7 py-3.5 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2.5 cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.12)] hover:shadow-[0_0_40px_rgba(255,255,255,0.22)]"
          >
            <Calendar className="w-4 h-4 text-black" />
            <span>{t.hero.ctaBooking}</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('booking');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else setActiveView('booking');
            }}
            className="btn-linear-secondary px-7 py-3.5 text-xs sm:text-sm font-medium rounded-xl flex items-center gap-2.5 cursor-pointer"
          >
            <span>{t.hero.ctaQuote}</span>
            <ArrowRight className="w-4 h-4 text-[#8a8f98]" />
          </button>
        </motion.div>

        {/* Centered High-Precision Project Tracking Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="pt-10 max-w-xl mx-auto"
        >
          <form
            onSubmit={handleQuickTrackSubmit}
            className="flex items-center gap-2 bg-[#0c0d11] border border-white/[0.12] rounded-2xl p-1.5 focus-within:border-white/40 focus-within:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all shadow-2xl"
          >
            <Search className="w-4 h-4 text-[#8a8f98] ml-3 shrink-0" />
            <input
              type="text"
              placeholder={t.tracker.inputPlaceholder}
              value={quickTrackerInput}
              onChange={(e) => setQuickTrackerInput(e.target.value)}
              className="bg-transparent border-none text-xs sm:text-sm text-white placeholder:text-[#62666d] focus:outline-hidden w-full px-2 font-mono"
            />
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-[#8a8f98] bg-white/[0.04] border border-white/[0.08] rounded-md">
              ↵ Enter
            </kbd>
            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-semibold text-white bg-white/[0.08] hover:bg-white/[0.18] border border-white/[0.12] rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.hero.ctaTrack}
            </button>
          </form>

          {/* Quick Demo Code Hints */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-[#62666d]">
            <span>{t.tracker.demoCodesHint}</span>
            <button
              type="button"
              onClick={() => handleDemoCode('LOD-2026-01')}
              className="font-mono text-[#8a8f98] hover:text-white px-1.5 py-0.5 rounded bg-white/[0.02] hover:bg-white/[0.08] border border-white/[0.05] transition-colors cursor-pointer"
            >
              LOD-2026-01
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleDemoCode('LOD-2026-02')}
              className="font-mono text-[#8a8f98] hover:text-white px-1.5 py-0.5 rounded bg-white/[0.02] hover:bg-white/[0.08] border border-white/[0.05] transition-colors cursor-pointer"
            >
              LOD-2026-02
            </button>
          </div>
        </motion.div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        onClick={() => {
          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="relative z-10 pt-4 text-[#8a8f98] hover:text-white transition-colors flex flex-col items-center gap-1 cursor-pointer text-[11px] font-mono tracking-wider opacity-60 hover:opacity-100"
        aria-label="Aşağı kaydır"
      >
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.button>

      {/* Aceternity Background Beams (Clean static beams, without purple shooting streaks) */}
      <BackgroundBeams className="pointer-events-none opacity-85" />
    </section>
  );
};
