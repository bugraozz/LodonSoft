import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ExternalLink,
  X,
  TrendingUp,
  Globe,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProjectsSection: React.FC = () => {
  const { language, t, setSelectedCaseStudy, selectedCaseStudy, portfolioProjects } = useApp();
  const [filter, setFilter] = useState<string>('all');

  const filteredProjects = portfolioProjects.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'web') return p.category === 'web';
    if (filter === 'cloud') return p.category === 'cloud' || p.category === 'enterprise';
    if (filter === 'ai') return p.category === 'ai';
    return true;
  });

  return (
    <section id="projects" className="py-24 bg-[#050506] border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="text-xs uppercase tracking-widest text-[#8a8f98] font-semibold mb-2">
              {language === 'tr' ? 'SEÇİLMİŞ ÇALIŞMALAR & PROJELER' : 'SELECTED WORKS & PROJECTS'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f7f8f8] tracking-tight text-balance">
              {t.projects.sectionTitle}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#8a8f98] leading-relaxed">
              {t.projects.sectionSubtitle}
            </p>
          </motion.div>

          {/* Interactive segmented filter control */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-1.5 p-1 bg-[#0c0d11] border border-white/[0.08] rounded-xl self-start md:self-auto overflow-x-auto max-w-full"
          >
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-black shadow-xs font-semibold'
                  : 'text-[#8a8f98] hover:text-white'
              }`}
            >
              {t.projects.filterAll}
            </button>
            <button
              onClick={() => setFilter('web')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                filter === 'web'
                  ? 'bg-white text-black shadow-xs font-semibold'
                  : 'text-[#8a8f98] hover:text-white'
              }`}
            >
              {t.projects.filterWeb}
            </button>
            <button
              onClick={() => setFilter('cloud')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                filter === 'cloud'
                  ? 'bg-white text-black shadow-xs font-semibold'
                  : 'text-[#8a8f98] hover:text-white'
              }`}
            >
              {t.projects.filterCloud}
            </button>
            <button
              onClick={() => setFilter('ai')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                filter === 'ai'
                  ? 'bg-white text-black shadow-xs font-semibold'
                  : 'text-[#8a8f98] hover:text-white'
              }`}
            >
              {t.projects.filterAi}
            </button>
          </motion.div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedCaseStudy(project)}
              className="linear-card group rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              {/* Top Preview Canvas (Full width & flush with top, left, right edges) */}
              <div className="relative w-full aspect-16/10 overflow-hidden bg-black/50 border-b border-white/[0.08]">
                {/* Project Screenshot */}
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Gradient overlay on image matching card #0a0b0e surface */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0b0e] via-black/25 to-transparent opacity-85" />

                {/* Floating Category Pill */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/[0.12] text-white text-[11px] font-mono tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  <span>{project.categoryLabel[language]}</span>
                </div>

                {/* Live Demo or Year badge */}
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/80 hover:bg-white hover:text-black backdrop-blur-md border border-white/[0.12] text-zinc-200 text-[11px] font-mono transition-all z-10 group/btn"
                    title={language === 'tr' ? 'Canlı Siteyi Ziyaret Et' : 'Open Live Site'}
                  >
                    <Globe className="w-3 h-3 text-[#8a8f98] group-hover/btn:text-black transition-colors" />
                    <span>{language === 'tr' ? 'Canlı' : 'Live'}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/btn:opacity-100" />
                  </a>
                ) : (
                  <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/[0.1] text-[#8a8f98] text-[10px] font-mono">
                    {project.year}
                  </div>
                )}
              </div>

              {/* Body Content (Styled matching ServicesSection card body) */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Client & Year meta */}
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#8a8f98] mb-2.5">
                    <span className="truncate group-hover:text-white transition-colors font-medium">
                      {project.client}
                    </span>
                    <span className="text-[#5c6068] group-hover:text-[#8a8f98] transition-colors">
                      {project.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-semibold text-[#f7f8f8] group-hover:text-white transition-colors tracking-tight line-clamp-1">
                    {project.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-2.5 text-xs sm:text-sm text-[#8a8f98] leading-relaxed line-clamp-2">
                    {project.summary[language]}
                  </p>
                </div>

                {/* Bottom Strip: Tech Stack & Action Link */}
                <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center justify-between gap-3 text-xs">
                  {/* Tech Badges */}
                  <div className="flex items-center gap-1.5 overflow-hidden flex-wrap max-h-6">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[#8a8f98]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-[10px] font-mono text-[#5c6068]">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action Link with Arrow */}
                  <div className="flex items-center gap-1 text-white font-medium group-hover:translate-x-0.5 transition-transform shrink-0">
                    <span className="text-xs">{t.projects.viewDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8a8f98] group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedCaseStudy(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b0c11] border border-white/[0.12] rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCaseStudy(null)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 transition-colors cursor-pointer z-20"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image Header */}
              <div className="rounded-2xl overflow-hidden bg-black/50 mb-6 border border-white/10 relative">
                <div className="relative aspect-16/9 overflow-hidden">
                  <img
                    src={selectedCaseStudy.image}
                    alt={selectedCaseStudy.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0b0c11] via-transparent to-transparent opacity-80" />

                  {/* Floating tags */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-xs font-mono">
                      {selectedCaseStudy.client}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                      {selectedCaseStudy.year}
                    </span>
                  </div>

                  {selectedCaseStudy.demoUrl && (
                    <div className="absolute bottom-4 right-4">
                      <a
                        href={selectedCaseStudy.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black hover:bg-zinc-200 px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xl transition-colors cursor-pointer"
                      >
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <span>{language === 'tr' ? 'Canlı Projeyi Ziyaret Et' : 'Visit Live Project'}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-600" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2 font-mono">
                <span className="text-emerald-400 font-semibold">{selectedCaseStudy.categoryLabel[language]}</span>
                <span>•</span>
                <span>{selectedCaseStudy.client}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
                {selectedCaseStudy.title}
              </h3>

              {/* Quantified Metrics Highlight */}
              <div className="p-4 sm:p-5 bg-white/[0.025] border border-white/[0.08] rounded-2xl mb-6">
                <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === 'tr' ? 'Ölçülebilir Çıktılar & Kazanımlar' : 'Measurable Outcomes & ROI'}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {selectedCaseStudy.metrics[language].split('·').map((metric, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-3.5 py-2 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 flex items-center gap-2 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{metric.trim()}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Case Study Details */}
              <div className="space-y-5 text-sm text-zinc-300 leading-relaxed">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-white font-semibold mb-2 flex items-center gap-2 font-mono">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === 'tr' ? 'Mimari Yaklaşım & Çözüm Stratejisi' : 'Architecture & Solution Strategy'}</span>
                  </h4>
                  <div className="text-zinc-300 bg-white/[0.02] p-4 rounded-xl border border-white/[0.06] leading-relaxed">
                    {selectedCaseStudy.caseStudy[language]}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider text-white font-semibold mb-2 flex items-center gap-2 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{language === 'tr' ? 'Proje Özeti & İş Kapsamı' : 'Project Summary'}</span>
                  </h4>
                  <p className="text-zinc-400 leading-relaxed">
                    {selectedCaseStudy.summary[language]}
                  </p>
                </div>
              </div>

              {/* Technologies */}
              <div className="mt-6 pt-5 border-t border-white/[0.08]">
                <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-3 font-mono flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-white/60" />
                  <span>{language === 'tr' ? 'Kullanılan Teknolojiler' : 'Technologies & Infrastructure'}</span>
                </h4>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {selectedCaseStudy.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-white/[0.04] rounded-lg border border-white/[0.08] text-zinc-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Close Button at bottom */}
              <div className="mt-8 pt-5 border-t border-white/[0.08] flex items-center justify-end">
                <button
                  onClick={() => setSelectedCaseStudy(null)}
                  className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  {t.projects.closeModal}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
