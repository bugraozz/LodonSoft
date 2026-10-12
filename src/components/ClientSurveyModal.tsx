import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, CheckCircle, Sparkles, Send, Award, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ClientSurveyModal: React.FC = () => {
  const {
    isSurveyModalOpen,
    closeSurveyModal,
    surveyTargetProjectCode,
    projects,
    addTestimonial,
    language,
    setActiveView,
  } = useApp();

  const [projectCode, setProjectCode] = useState(surveyTargetProjectCode || projects[0]?.projectCode || 'LOD-2026-01');
  const [clientName, setClientName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Survey specific metrics
  const [speedRating, setSpeedRating] = useState<number>(5);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [commRating, setCommRating] = useState<number>(5);
  const [npsScore, setNpsScore] = useState<number>(10);

  const [metricHighlight, setMetricHighlight] = useState('');
  const [quote, setQuote] = useState('');
  const [outcome, setOutcome] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset or initialize when opened
  React.useEffect(() => {
    if (isSurveyModalOpen) {
      if (surveyTargetProjectCode) {
        setProjectCode(surveyTargetProjectCode);
        const p = projects.find((item) => item.projectCode === surveyTargetProjectCode);
        if (p) {
          setCompany(p.clientName);
          setMetricHighlight(`%${p.overallProgress} Başarılı Teslimat`);
        }
      }
      setIsSubmitted(false);
    }
  }, [isSurveyModalOpen, surveyTargetProjectCode, projects]);

  if (!isSurveyModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !quote) return;

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#10b981', '#3b82f6', '#f59e0b'],
      });
    } catch {
      // Ignore if confetti fails
    }

    const targetProj = projects.find((p) => p.projectCode === projectCode);
    const deliveredTitle = targetProj ? targetProj.title : `${company || 'Kurumsal'} Özel Yazılım Projesi`;

    addTestimonial({
      clientName: clientName.trim(),
      role: { tr: role.trim() || 'Yönetici', en: role.trim() || 'Executive' },
      company: company.trim() || targetProj?.clientName || 'Partner Şirket',
      industry: {
        tr: industry.trim() || (language === 'tr' ? 'Teknoloji & Yazılım' : 'Technology & Software'),
        en: industry.trim() || 'Technology & Software',
      },
      projectDelivered: {
        tr: deliveredTitle,
        en: deliveredTitle,
      },
      metricHighlight: {
        tr: metricHighlight.trim() || (language === 'tr' ? '%100 Zamanında Teslim · 5.0 Memnuniyet' : '100% On-Time Delivery · 5.0 CSAT'),
        en: metricHighlight.trim() || '100% On-Time Delivery · 5.0 CSAT',
      },
      quote: {
        tr: quote.trim(),
        en: quote.trim(),
      },
      outcome: {
        tr: outcome.trim() || (language === 'tr' ? 'Tüm modüller sıfır hata ile canlıya alındı.' : 'All modules deployed error-free.'),
        en: outcome.trim() || 'All modules deployed error-free.',
      },
      verifiedDate: 'Ekim 2026',
      source: 'client_survey',
      rating,
      status: 'approved',
      projectCode: projectCode.trim(),
      avatar: selectedAvatar,
      surveyRatings: {
        speed: speedRating,
        quality: qualityRating,
        communication: commRating,
        npsScore,
      },
    });

    setIsSubmitted(true);
  };

  const handleFinishAndScroll = () => {
    closeSurveyModal();
    setActiveView('home');
    setTimeout(() => {
      const el = document.getElementById('testimonials');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const avatarPresets = [
    { label: 'Kadın Yönetici', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { label: 'Erkek Yönetici', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { label: 'Girişimci / CTO', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { label: 'Ürün Lideri', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0a0b0e] border border-white/[0.12] rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl relative text-[#f7f8f8]">
        {/* Close Button */}
        <button
          onClick={closeSurveyModal}
          className="absolute top-5 right-5 text-[#8a8f98] hover:text-white p-1 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Modal Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 font-semibold mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>PROJE TESLİMİ SONRASI MÜŞTERİ ANKETİ & DEĞERLENDİRME</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Deneyiminizi Paylaşın & Web Sitemizde Görünün
              </h3>
              <p className="text-xs sm:text-sm text-[#8a8f98] mt-1.5 leading-relaxed">
                Proje teslim süreciniz, mühendislik kalitemiz ve ekip iletişimimiz hakkındaki geri bildiriminiz
                doğrudan Referanslar bölümümüzde yayınlanacaktır.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project & Client Basic Information */}
              <div className="p-4 bg-white/[0.02] border border-white/[0.07] rounded-xl space-y-4">
                <div className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
                  1. Proje & Kurum Bilgileri
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#8a8f98] block mb-1">Proje Kodu</label>
                    <select
                      value={projectCode}
                      onChange={(e) => {
                        setProjectCode(e.target.value);
                        const p = projects.find((item) => item.projectCode === e.target.value);
                        if (p) setCompany(p.clientName);
                      }}
                      className="w-full bg-[#050506] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/40 font-mono"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.projectCode} className="bg-[#0a0b0e]">
                          {p.projectCode} - {p.title}
                        </option>
                      ))}
                      <option value="LOD-OTHER" className="bg-[#0a0b0e]">
                        Diğer / Özel Proje
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#8a8f98] block mb-1">Adınız & Soyadınız *</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Örn: Mehmet Yılmaz"
                      className="w-full bg-[#050506] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#5c6068] focus:outline-hidden focus:border-white/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#8a8f98] block mb-1">Şirket / Kurum Adı *</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Örn: Nova Dijital A.Ş."
                      className="w-full bg-[#050506] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#5c6068] focus:outline-hidden focus:border-white/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#8a8f98] block mb-1">Göreviniz / Unvanınız</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Örn: Kurucu Ortak & CTO"
                      className="w-full bg-[#050506] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#5c6068] focus:outline-hidden focus:border-white/40"
                    />
                  </div>
                </div>
              </div>

              {/* Star Rating & Survey Dimensions */}
              <div className="p-4 bg-white/[0.02] border border-white/[0.07] rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
                    2. Genel Memnuniyet & Yıldız Puanınız
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="cursor-pointer p-0.5 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            (hoverRating || rating) >= star
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold font-mono ml-2 text-amber-400">
                      {rating}.0 / 5.0
                    </span>
                  </div>
                </div>

                {/* Sub-ratings */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/[0.06]">
                  <div>
                    <div className="text-[11px] text-[#8a8f98] mb-1.5 flex justify-between">
                      <span>Teslimat Hızı</span>
                      <span className="font-mono text-white">{speedRating}/5</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSpeedRating(val)}
                          className={`flex-1 py-1 text-[11px] font-mono rounded cursor-pointer transition-colors ${
                            speedRating >= val ? 'bg-white text-black font-semibold' : 'bg-white/[0.05] text-[#8a8f98]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-[#8a8f98] mb-1.5 flex justify-between">
                      <span>Kod & Mimari Kalitesi</span>
                      <span className="font-mono text-white">{qualityRating}/5</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setQualityRating(val)}
                          className={`flex-1 py-1 text-[11px] font-mono rounded cursor-pointer transition-colors ${
                            qualityRating >= val ? 'bg-white text-black font-semibold' : 'bg-white/[0.05] text-[#8a8f98]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-[#8a8f98] mb-1.5 flex justify-between">
                      <span>Ekip İletişimi</span>
                      <span className="font-mono text-white">{commRating}/5</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setCommRating(val)}
                          className={`flex-1 py-1 text-[11px] font-mono rounded cursor-pointer transition-colors ${
                            commRating >= val ? 'bg-white text-black font-semibold' : 'bg-white/[0.05] text-[#8a8f98]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* NPS 1-10 */}
                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="flex justify-between items-center text-[11px] text-[#8a8f98] mb-1.5">
                    <span>Lodonsoft'u bir meslektaşınıza veya iş ortağınıza tavsiye eder misiniz? (NPS)</span>
                    <span className="font-mono text-emerald-400 font-bold">{npsScore} / 10</span>
                  </div>
                  <div className="grid grid-cols-10 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNpsScore(num)}
                        className={`py-1.5 text-xs font-mono rounded cursor-pointer transition-all ${
                          npsScore === num
                            ? 'bg-emerald-500 text-black font-bold shadow-xs'
                            : npsScore > num
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                            : 'bg-white/[0.04] text-[#8a8f98] hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review & Testimonial Quote */}
              <div className="p-4 bg-white/[0.02] border border-white/[0.07] rounded-xl space-y-4">
                <div className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
                  3. Yorum & Başarı Detayları
                </div>

                <div>
                  <label className="text-xs text-[#8a8f98] block mb-1">
                    Elde Edilen Somut Başarı / Öne Çıkan Metrik
                  </label>
                  <input
                    type="text"
                    value={metricHighlight}
                    onChange={(e) => setMetricHighlight(e.target.value)}
                    placeholder="Örn: +%120 Ciro Artışı · 2 Haftada Hatasız Canlıya Alındı"
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#5c6068] focus:outline-hidden focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8a8f98] block mb-1">
                    Müşteri Yorumunuz (Web Sitesinde Referansınız Olarak Görüntülenecektir) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Lodonsoft ekibiyle olan çalışma deneyiminizi, sprint şeffaflığını, teknik yaklaşımlarını ve projenizin başarısını anlatın..."
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-lg p-3 text-xs text-white placeholder:text-[#5c6068] focus:outline-hidden focus:border-white/40 leading-relaxed"
                  />
                </div>

                {/* Avatar selection */}
                <div>
                  <label className="text-xs text-[#8a8f98] block mb-2">Profil Fotoğrafı Seçimi</label>
                  <div className="flex items-center gap-3">
                    {avatarPresets.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAvatar(av.url)}
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                          selectedAvatar === av.url ? 'border-white scale-110 shadow-md' : 'border-white/20 opacity-60 hover:opacity-100'
                        }`}
                        title={av.label}
                      >
                        <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={closeSurveyModal}
                  className="px-4 py-2 text-xs font-semibold text-[#8a8f98] hover:text-white cursor-pointer"
                >
                  İptal
                </button>

                <button
                  type="submit"
                  className="btn-linear-primary px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>Yorumu Gönder & Yayınla</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">
              Değerlendirmeniz İçin Teşekkür Ederiz!
            </h3>

            <p className="text-sm text-[#8a8f98] max-w-md mx-auto leading-relaxed">
              Yorumunuz ve proje teslim anketi başarıyla kaydedildi.
              Referanslar bölümünde ve müşteri panomuzda canlı olarak yayınlanmaktadır.
            </p>

            {/* Preview Card */}
            <div className="linear-card rounded-xl p-5 text-left max-w-lg mx-auto border border-white/[0.12] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedAvatar}
                    alt={clientName}
                    className="w-9 h-9 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{clientName}</div>
                    <div className="text-[11px] text-[#8a8f98]">{role || 'Yönetici'} · {company}</div>
                  </div>
                </div>
                <div className="flex items-center text-amber-400 text-xs">
                  {'★'.repeat(rating)}
                </div>
              </div>

              <p className="text-xs text-[#f7f8f8] italic border-l-2 border-emerald-500/40 pl-3">
                "{quote}"
              </p>

              {metricHighlight && (
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded inline-block">
                  {metricHighlight}
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleFinishAndScroll}
                className="btn-linear-primary px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <ThumbsUp className="w-4 h-4 text-black" />
                <span>Web Sitesinde Yorumları Gör</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
