import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceItem } from '../types';
import { ArrowUpRight, Check, X, Code2, Layers, Cpu, ShieldCheck, Smartphone, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ServicesSection: React.FC = () => {
  const { language, t, setActiveView, services } = useApp();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'web':
        return <Code2 className="w-4 h-4 text-white" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4 text-white" />;
      case 'enterprise':
        return <Server className="w-4 h-4 text-white" />;
      case 'ai':
        return <Cpu className="w-4 h-4 text-white" />;
      case 'uiux':
        return <Layers className="w-4 h-4 text-white" />;
      case 'cloud':
        return <ShieldCheck className="w-4 h-4 text-white" />;
      default:
        return <Code2 className="w-4 h-4 text-white" />;
    }
  };

  const handleRequestService = () => {
    setSelectedService(null);
    setActiveView('booking');
    setTimeout(() => {
      const el = document.getElementById('booking');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section id="services" className="py-24 bg-[#050506] ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16"
        >
          <div className="text-xs uppercase tracking-widest text-[#8a8f98] font-semibold mb-2">
            KABİLİYETLER & SİSTEMLER
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f7f8f8] tracking-tight text-balance">
            {t.services.sectionTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#8a8f98] leading-relaxed">
            {t.services.sectionSubtitle}
          </p>
        </motion.div>

        {/* Bento Grid with Linear Hairline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => (
            <motion.div
              key={srv.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedService(srv)}
              className="linear-card group rounded-2xl p-6.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Number & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-semibold text-[#5c6068] group-hover:text-white transition-colors">
                    {srv.number}.
                  </span>
                  <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white">
                    {getServiceIcon(srv.category)}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-semibold text-[#f7f8f8] group-hover:text-white transition-colors">
                  {srv.title[language]}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                  {srv.shortDesc[language]}
                </p>

                {/* Unboxed Deliverables Preview */}
                <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-2 text-xs text-[#8a8f98]">
                  {srv.deliverables[language].slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/40 shrink-0"></span>
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Metadata & Action */}
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <div className="text-[#8a8f98] font-mono">
                  <span>{t.services.startingFrom} </span>
                  <span className="text-[#f7f8f8] font-semibold">{srv.startingPrice}</span>
                </div>
                <div className="flex items-center gap-1 text-white font-medium group-hover:translate-x-0.5 transition-transform">
                  <span>Detay</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#8a8f98] group-hover:text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0a0b0e] border border-white/[0.12] rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 text-[#8a8f98] hover:text-white p-1 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-sm font-semibold text-[#8a8f98]">
                {selectedService.number}.
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#f7f8f8]">
                {selectedService.title[language]}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-[#8a8f98] leading-relaxed mt-2">
              {selectedService.longDesc[language]}
            </p>

            {/* Deliverables List */}
            <div className="mt-6 pt-5 border-t border-white/[0.08]">
              <h4 className="text-xs uppercase tracking-wider text-[#8a8f98] font-semibold mb-3">
                {t.services.deliverablesTitle}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedService.deliverables[language].map((d, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#f7f8f8] bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.06]">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Unboxed Metadata */}
            <div className="mt-5 pt-4 border-t border-white/[0.08]">
              <h4 className="text-xs uppercase tracking-wider text-[#8a8f98] font-semibold mb-2">
                {t.services.techStackTitle}
              </h4>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-[#8a8f98]">
                {selectedService.technologies.map((tech, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white/[0.04] rounded border border-white/[0.08] text-[#f7f8f8]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Price & Duration Strip */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-[#8a8f98]">
                <div>{t.services.estDuration} <span className="text-white font-medium">{selectedService.duration[language]}</span></div>
                <div>{t.services.startingFrom} <span className="text-white font-bold font-mono">{selectedService.startingPrice}</span></div>
              </div>

              <button
                onClick={handleRequestService}
                className="btn-linear-primary px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer"
              >
                {t.services.requestQuoteForService}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </section>
);
};
