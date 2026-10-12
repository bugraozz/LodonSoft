import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ExternalLink,
  MessageSquarePlus,
  ShieldCheck,
  MousePointerClick,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { TestimonialItem } from '../types';

const SQRT_5000 = Math.sqrt(5000);

export interface StaggerCardItem {
  tempId: number | string;
  id: string;
  testimonial: string;
  by: string;
  clientName: string;
  company: string;
  role: string;
  imgSrc: string;
  sourceBadge: string;
  source: 'google' | 'client_survey' | 'direct';
  rating: number;
  googleReviewUrl?: string;
}

interface TestimonialCardProps {
  position: number;
  testimonial: StaggerCardItem;
  handleMove: (steps: number) => void;
  cardSize: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        'absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out select-none',
        isCenter
          ? 'z-10 bg-primary text-primary-foreground border-primary'
          : 'z-0 bg-card text-card-foreground border-border hover:border-primary/50'
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? '0px 8px 0px 4px hsl(var(--border))'
          : '0px 0px 0px 0px transparent',
      }}
    >
      {/* 45-degree angle corner line */}
      <span
        className="absolute block origin-top-right rotate-45 bg-border pointer-events-none"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
        }}
      />

      {/* Top Header: Avatar + Rating & Source Badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <img
          src={testimonial.imgSrc}
          alt={testimonial.clientName}
          referrerPolicy="no-referrer"
          className="h-14 w-12 bg-muted object-cover object-top shrink-0"
          style={{
            boxShadow: '3px 3px 0px hsl(var(--background))',
          }}
        />

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className={cn('flex items-center gap-0.5', isCenter ? 'text-primary-foreground' : 'text-[#e4f222]')}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  'w-3.5 h-3.5',
                  (testimonial.rating || 5) >= s
                    ? (isCenter ? 'fill-current' : 'fill-[#e4f222]')
                    : 'opacity-25'
                )}
              />
            ))}
          </div>

          <span
            className={cn(
              'text-[10px] font-mono px-2 py-0.5 rounded-[4px] border uppercase tracking-wider',
              isCenter
                ? 'bg-black/10 border-black/25 text-primary-foreground font-semibold'
                : 'bg-[#161718] border-[#23252a] text-[#8a8f98]'
            )}
          >
            {testimonial.sourceBadge}
          </span>
        </div>
      </div>

      {/* Testimonial Quote */}
      <h3
        className={cn(
          'text-sm sm:text-base font-medium leading-relaxed line-clamp-4',
          isCenter ? 'text-primary-foreground font-semibold' : 'text-foreground'
        )}
      >
        "{testimonial.testimonial}"
      </h3>

      {/* Bottom Author Tag */}
      <p
        className={cn(
          'absolute bottom-7 left-8 right-8 text-xs italic truncate font-sans',
          isCenter ? 'text-primary-foreground/90 font-medium' : 'text-muted-foreground'
        )}
        title={testimonial.by}
      >
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC<{ items: StaggerCardItem[] }> = ({ items }) => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState<StaggerCardItem[]>(items);

  // Keep synced if items or filter changes
  useEffect(() => {
    setTestimonialsList(items);
  }, [items]);

  const handleMove = (steps: number) => {
    if (!steps || testimonialsList.length === 0) return;
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia('(min-width: 640px)');
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (items.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-center text-[#8a8f98] font-mono text-sm border-0">
        Bu kategoride henüz yayınlanmış değerlendirme bulunmamaktadır.
      </div>
    );
  }

  return (
    /* Completely borderless container as requested (no border, no outer frame) */
    <div
      className="relative w-full overflow-hidden select-none border-0"
      style={{ height: 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}

      {/* Floating navigation chevrons */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3 z-20">
        <button
          type="button"
          onClick={() => handleMove(-1)}
          className={cn(
            'flex h-14 w-14 items-center justify-center text-2xl transition-all cursor-pointer rounded-none',
            'bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95'
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={() => handleMove(1)}
          className={cn(
            'flex h-14 w-14 items-center justify-center text-2xl transition-all cursor-pointer rounded-none',
            'bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95'
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export const TestimonialsSection: React.FC = () => {
  const { language, t, openSurveyModal, testimonials } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'google' | 'survey' | 'reference'>('all');

  // Filter counts
  const counts = useMemo(() => {
    const approved = testimonials.filter((t) => t.status !== 'hidden');
    return {
      all: approved.length,
      google: approved.filter((t) => t.source === 'google').length,
      survey: approved.filter((t) => t.source === 'client_survey').length,
      reference: approved.filter((t) => t.source === 'direct').length,
    };
  }, [testimonials]);

  // Filter and map real system testimonials to StaggerCardItem
  const currentItems = useMemo<StaggerCardItem[]>(() => {
    const rawFiltered = testimonials.filter((item) => {
      if (item.status === 'hidden') return false;
      if (activeFilter === 'all') return true;
      if (activeFilter === 'google') return item.source === 'google';
      if (activeFilter === 'survey') return item.source === 'client_survey';
      if (activeFilter === 'reference') return item.source === 'direct';
      return true;
    });

    const mapped = rawFiltered.map((item: TestimonialItem, idx: number) => {
      const quoteText = typeof item.quote === 'string' ? item.quote : item.quote[language] || item.quote.tr;
      const roleText = typeof item.role === 'string' ? item.role : item.role[language] || item.role.tr;
      
      let badge = 'Doğrulanmış';
      if (item.source === 'google') {
        badge = 'Google 5.0 ★';
      } else if (item.source === 'client_survey') {
        badge = language === 'tr' ? 'Onaylı Anket' : 'Verified Survey';
      } else if (item.source === 'direct') {
        badge = language === 'tr' ? 'Kurumsal Referans' : 'Enterprise Ref';
      }

      const defaultAvatar =
        idx % 2 === 0
          ? 'https://cdn.21st.dev/assets/mirror/f0/f02fed36023656a5b5df6f247c83c96c53bfa9db5b98085cdee93ffc938a5f37.jpg'
          : 'https://cdn.21st.dev/assets/mirror/5b/5b5b2f3487692d40f629010ea6448d150907f780d8c262c4ca194b7386115c2d.jpg';

      return {
        tempId: `${item.id}-${idx}`,
        id: item.id,
        testimonial: quoteText,
        by: `${item.clientName}, ${roleText} (${item.company})`,
        clientName: item.clientName,
        company: item.company,
        role: roleText,
        imgSrc: item.avatar || defaultAvatar,
        sourceBadge: badge,
        source: item.source || 'direct',
        rating: item.rating || 5,
        googleReviewUrl: item.googleReviewUrl,
      };
    });

    // If the category has fewer than 7 items, pad/loop them so the 3D staggered cascade fan stays rich and balanced
    if (mapped.length > 0 && mapped.length < 7) {
      const needed = 8 - mapped.length;
      const padded = [...mapped];
      for (let i = 0; i < needed; i++) {
        const itemToClone = mapped[i % mapped.length];
        padded.push({
          ...itemToClone,
          tempId: `${itemToClone.id}-loop-${i}`,
        });
      }
      return padded;
    }

    return mapped;
  }, [testimonials, activeFilter, language]);

  return (
    <section id="testimonials" className="py-24 bg-[#08090a] border-b border-[#23252a] relative font-sans text-[#d0d6e0] overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= 1. HEADER ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            {/* Linear Display Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[510] text-[#ffffff] tracking-[-0.022em] leading-[1.05]">
              {t.testimonials.sectionTitle || 'Mühendislik Kalitesi ve Müşteri Deneyimi'}
            </h2>
            <p className="mt-3 text-[15px] text-[#8a8f98] leading-[1.6]">
              {language === 'tr'
                ? 'Google İşletme profilimizden senkronize edilen 5.0 yıldızlı referanslar, proje teslim sonrası uygulanan tarafsız anketler ve kurumsal referanslarımız.'
                : 'Verified Google Business reviews, post-delivery survey feedback, and enterprise client references.'}
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-2.5 self-start lg:self-end"
          >
            <button
              onClick={() => openSurveyModal()}
              className="bg-white text-black hover:bg-neutral-100 font-[510] text-[13px] px-4 py-2 rounded-[6px] cursor-pointer flex items-center gap-2 transition-all shadow-sm active:scale-95 border border-white"
              title="Teslim edilen projeniz için anket doldurun"
            >
              <MessageSquarePlus className="w-4 h-4 text-black" />
              <span>Projemi Değerlendir</span>
            </button>

            <a
              href="https://maps.google.com/?cid=lodonsoft-reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-linear-ghost flex items-center gap-2"
              title="Google İşletme profilimizi görüntüleyin"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google 5.0 ★</span>
              <ExternalLink className="w-3 h-3 text-[#8a8f98]" />
            </a>
          </motion.div>
        </div>

        {/* ================= 4. CATEGORY FILTERS (GOOGLE YORUMU, MÜŞTERİ YORUMU, REFERANS) ================= */}
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-4 overflow-x-auto pb-2">
          {/* All */}
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={cn(
              'px-4 py-2 text-[13px] rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 select-none',
              activeFilter === 'all'
                ? 'bg-white text-black border-white font-[510] shadow-sm'
                : 'bg-transparent text-[#8a8f98] border-[#23252a] hover:text-white hover:border-[#383b3f]'
            )}
          >
            <span>{language === 'tr' ? 'Tüm Değerlendirmeler' : 'All Reviews'}</span>
            <span className={cn('font-mono text-[11px] px-1.5 py-0.2 rounded-full', activeFilter === 'all' ? 'bg-black/10 text-black' : 'bg-[#161718] text-[#8a8f98]')}>
              {counts.all}
            </span>
          </button>

          {/* Google Reviews */}
          <button
            type="button"
            onClick={() => setActiveFilter('google')}
            className={cn(
              'px-4 py-2 text-[13px] rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 select-none',
              activeFilter === 'google'
                ? 'bg-white text-black border-white font-[510] shadow-sm'
                : 'bg-transparent text-[#8a8f98] border-[#23252a] hover:text-white hover:border-[#383b3f]'
            )}
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{language === 'tr' ? 'Google Yorumları' : 'Google Reviews'}</span>
            <span className={cn('font-mono text-[11px] px-1.5 py-0.2 rounded-full', activeFilter === 'google' ? 'bg-black/10 text-black' : 'bg-[#161718] text-[#8a8f98]')}>
              {counts.google}
            </span>
          </button>

          {/* Client Surveys / Reviews */}
          <button
            type="button"
            onClick={() => setActiveFilter('survey')}
            className={cn(
              'px-4 py-2 text-[13px] rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 select-none',
              activeFilter === 'survey'
                ? 'bg-white text-black border-white font-[510] shadow-sm'
                : 'bg-transparent text-[#8a8f98] border-[#23252a] hover:text-white hover:border-[#383b3f]'
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#27a644]" />
            <span>{language === 'tr' ? 'Müşteri Yorumları & Anketler' : 'Client Feedback'}</span>
            <span className={cn('font-mono text-[11px] px-1.5 py-0.2 rounded-full', activeFilter === 'survey' ? 'bg-black/10 text-black' : 'bg-[#161718] text-[#8a8f98]')}>
              {counts.survey}
            </span>
          </button>

          {/* Enterprise References */}
          <button
            type="button"
            onClick={() => setActiveFilter('reference')}
            className={cn(
              'px-4 py-2 text-[13px] rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 select-none',
              activeFilter === 'reference'
                ? 'bg-white text-black border-white font-[510] shadow-sm'
                : 'bg-transparent text-[#8a8f98] border-[#23252a] hover:text-white hover:border-[#383b3f]'
            )}
          >
            <Building2 className="w-3.5 h-3.5 text-[#8a8f98]" />
            <span>{language === 'tr' ? 'Kurumsal Referanslar' : 'Enterprise References'}</span>
            <span className={cn('font-mono text-[11px] px-1.5 py-0.2 rounded-full', activeFilter === 'reference' ? 'bg-black/10 text-black' : 'bg-[#161718] text-[#8a8f98]')}>
              {counts.reference}
            </span>
          </button>
        </div>

        {/* ================= 5. BORDERLESS STAGGER TESTIMONIALS (CARDS FLOATING SEAMLESSLY) ================= */}
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="my-2 border-0"
        >
          <StaggerTestimonials items={currentItems} />
        </motion.div>

        {/* Interactive Helper Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-[#62666d]">
          <MousePointerClick className="w-3.5 h-3.5 text-[#8a8f98]" />
          <span>
            {language === 'tr'
              ? 'Kartların üzerine tıklayarak veya yön butonlarını kullanarak yorumları inceleyebilirsiniz.'
              : 'Click any card or use the chevron navigation buttons to browse testimonials.'}
          </span>
        </div>

      </div>
    </section>
  );
};
