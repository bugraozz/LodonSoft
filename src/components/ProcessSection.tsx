import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Compass,
  Palette,
  Code2,
  ShieldCheck,
  Rocket,
  Headphones,
  ArrowRight,
  Shield,
  RefreshCw,
  Key,
  Award,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

export const ProcessSection: React.FC = () => {
  const { language, t, processSteps, setActiveView } = useApp();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Distinct icon and role mapping for each phase
  const stepMeta = [
    {
      icon: Compass,
      role: { tr: 'Çözüm Mimarı', en: 'Solution Architect' },
      accent: 'from-blue-500/10 via-transparent to-transparent',
    },
    {
      icon: Palette,
      role: { tr: 'UI/UX Tasarımı', en: 'UI/UX Design' },
      accent: 'from-purple-500/10 via-transparent to-transparent',
    },
    {
      icon: Code2,
      role: { tr: 'Mühendislik Ekibi', en: 'Engineering Squad' },
      accent: 'from-emerald-500/10 via-transparent to-transparent',
    },
    {
      icon: ShieldCheck,
      role: { tr: 'QA & Güvenlik', en: 'QA & Security' },
      accent: 'from-amber-500/10 via-transparent to-transparent',
    },
    {
      icon: Rocket,
      role: { tr: 'DevOps & Bulut', en: 'DevOps & Cloud' },
      accent: 'from-cyan-500/10 via-transparent to-transparent',
    },
    {
      icon: Headphones,
      role: { tr: '7/24 SLA Destek', en: '24/7 SLA Support' },
      accent: 'from-rose-500/10 via-transparent to-transparent',
    },
  ];
  return (
    <section id="process" className="py-16 sm:py-20 bg-[#050506] border-b border-white/[0.08] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Compact Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono font-medium text-[#8a8f98] mb-2">
            <Sparkles className="w-3 h-3 text-white/70" />
            <span>{t.process.kicker}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f7f8f8] tracking-tight">
            {t.process.sectionTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
            {t.process.sectionSubtitle}
          </p>
        </motion.div>

        {/* Compact Alternating (Bir Sağ Bir Sol) Timeline Stream */}
        <div className="relative mb-14">
          {/* Continuous Center Timeline Line */}
          <div className="absolute left-4 sm:left-6 lg:left-1/2 top-3 bottom-3 w-[1px] -translate-x-1/2 bg-gradient-to-b from-white/20 via-white/10 to-white/5 pointer-events-none" />

          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            {processSteps.map((step, idx) => {
              const meta = stepMeta[idx % stepMeta.length];
              const StepIcon = meta.icon;
              const isLeft = idx % 2 === 0;

              return (
                <div
                  key={step.step}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="relative group"
                >
                  {/* Central timeline node (Desktop) */}
                  <div className="hidden lg:flex absolute left-1/2 top-6 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#08090c] border border-white/20 items-center justify-center z-20 group-hover:border-white group-hover:bg-white group-hover:text-black group-hover:scale-105 transition-all shadow-[0_0_12px_rgba(255,255,255,0.1)]">
                    <span className="font-mono text-[11px] font-bold text-inherit">
                      {step.step}
                    </span>
                  </div>

                  {/* Left timeline node (Mobile) */}
                  <div className="lg:hidden absolute left-4 sm:left-6 top-5 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#08090c] border border-white/20 flex items-center justify-center z-20 font-mono text-[10px] font-bold text-white group-hover:border-white">
                    <span>{step.step}</span>
                  </div>

                  {/* Compact Alternating Columns */}
                  <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-10 items-center">
                    {/* LEFT SLOT */}
                    {isLeft ? (
                      <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                        className="pl-10 sm:pl-14 lg:pl-0 w-full"
                      >
                        <div
                          className={`linear-card rounded-xl p-4 sm:p-5 relative overflow-hidden transition-all duration-200 hover:border-white/25 ${
                            hoveredIdx === idx ? 'border-white/25 bg-white/[0.02]' : ''
                          }`}
                        >
                          {/* Ambient glow */}
                          <div
                            className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${meta.accent} rounded-full blur-xl pointer-events-none transition-opacity ${
                              hoveredIdx === idx ? 'opacity-100' : 'opacity-20'
                            }`}
                          />

                          {/* Top row */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/80 group-hover:text-white shrink-0">
                                <StepIcon className="w-3.5 h-3.5" />
                              </div>
                              <h3 className="text-sm sm:text-base font-bold text-[#f7f8f8] truncate group-hover:text-white transition-colors">
                                {step.title[language]}
                              </h3>
                            </div>

                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-[#8a8f98] shrink-0">
                              <Clock className="w-3 h-3 text-white/50" />
                              <span>{step.duration[language]}</span>
                            </div>
                          </div>

                          {/* Concise description */}
                          <p className="text-xs text-[#8a8f98] leading-relaxed mb-2.5">
                            {step.description[language]}
                          </p>

                          {/* Compact Deliverables chips */}
                          <div className="pt-2 border-t border-white/[0.05] flex flex-wrap items-center gap-1.5 text-[11px]">
                            {step.deliverables[language].map((output, outIdx) => (
                              <span
                                key={outIdx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05] text-[#b3b7bf]"
                              >
                                <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                                <span>{output}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="hidden lg:block w-full" />
                    )}

                    {/* RIGHT SLOT */}
                    {!isLeft ? (
                      <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                        className="pl-10 sm:pl-14 lg:pl-0 w-full"
                      >
                        <div
                          className={`linear-card rounded-xl p-4 sm:p-5 relative overflow-hidden transition-all duration-200 hover:border-white/25 ${
                            hoveredIdx === idx ? 'border-white/25 bg-white/[0.02]' : ''
                          }`}
                        >
                          {/* Ambient glow */}
                          <div
                            className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${meta.accent} rounded-full blur-xl pointer-events-none transition-opacity ${
                              hoveredIdx === idx ? 'opacity-100' : 'opacity-20'
                            }`}
                          />

                          {/* Top row */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/80 group-hover:text-white shrink-0">
                                <StepIcon className="w-3.5 h-3.5" />
                              </div>
                              <h3 className="text-sm sm:text-base font-bold text-[#f7f8f8] truncate group-hover:text-white transition-colors">
                                {step.title[language]}
                              </h3>
                            </div>

                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-[#8a8f98] shrink-0">
                              <Clock className="w-3 h-3 text-white/50" />
                              <span>{step.duration[language]}</span>
                            </div>
                          </div>

                          {/* Concise description */}
                          <p className="text-xs text-[#8a8f98] leading-relaxed mb-2.5">
                            {step.description[language]}
                          </p>

                          {/* Compact Deliverables chips */}
                          <div className="pt-2 border-t border-white/[0.05] flex flex-wrap items-center gap-1.5 text-[11px]">
                            {step.deliverables[language].map((output, outIdx) => (
                              <span
                                key={outIdx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05] text-[#b3b7bf]"
                              >
                                <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                                <span>{output}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="hidden lg:block w-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ultra-Compact Minimal Guarantees Bar */}
    

        
      </div>
    </section>
  );
};
