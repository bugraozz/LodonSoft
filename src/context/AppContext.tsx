import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  Theme,
  Appointment,
  QuoteRequest,
  ProjectTracker,
  ProjectMilestone,
  Invoice,
  ChatMessage,
  ProjectStage,
  AppointmentStatus,
  QuoteStatus,
  ProjectItem,
  ServiceItem,
  ProcessStep,
  TestimonialItem,
  SystemSettings,
  AuditLogItem,
} from '../types';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_QUOTES,
  INITIAL_PROJECT_TRACKERS,
  INITIAL_INVOICES,
  INITIAL_CHAT_MESSAGES,
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
  INITIAL_PROCESS_STEPS,
  INITIAL_TESTIMONIALS,
  PRESET_GOOGLE_SAMPLE_REVIEWS,
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';
import { translations } from '../i18n/translations';

interface PaymentModalState {
  isOpen: boolean;
  invoiceId?: string;
  projectCode?: string;
  amount: number;
  title: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: typeof translations.tr;
  activeView: 'home' | 'admin' | 'tracker' | 'booking';
  setActiveView: (view: 'home' | 'admin' | 'tracker' | 'booking') => void;
  
  // Data State
  appointments: Appointment[];
  quotes: QuoteRequest[];
  projects: ProjectTracker[];
  portfolioProjects: ProjectItem[];
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  processSteps: ProcessStep[];
  invoices: Invoice[];
  chatMessages: ChatMessage[];
  activeProjectCode: string;
  setActiveProjectCode: (code: string) => void;

  // System Settings & Audit Logs
  systemSettings: SystemSettings;
  updateSystemSettings: (updated: Partial<SystemSettings>) => void;
  resetSystemSettings: () => void;
  auditLogs: AuditLogItem[];
  addAuditLog: (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => void;
  clearAuditLogs: () => void;

  // Portfolio & Site Content Management Actions
  addPortfolioProject: (project: Omit<ProjectItem, 'id'>) => void;
  updatePortfolioProject: (id: string, updated: Partial<ProjectItem>) => void;
  deletePortfolioProject: (id: string) => void;
  resetPortfolioProjects: () => void;

  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  resetServices: () => void;

  // Testimonials, Reviews & Survey Actions
  addTestimonial: (item: Omit<TestimonialItem, 'id'>) => string;
  updateTestimonial: (id: string, updated: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string) => void;
  resetTestimonials: () => void;
  syncGoogleReviews: () => Promise<number>;

  updateProcessStep: (stepNumber: string, updated: Partial<ProcessStep>) => void;
  resetProcessSteps: () => void;

  // Appointment & Quote Actions
  addAppointment: (data: {
    clientName: string;
    companyName: string;
    email: string;
    phone: string;
    serviceId: string;
    serviceName: string;
    date: string;
    timeSlot: string;
    meetingType: 'google_meet' | 'zoom' | 'office';
    notes?: string;
  }) => string;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;

  addQuote: (data: {
    clientName: string;
    companyName: string;
    email: string;
    phone: string;
    selectedServices: string[];
    budgetRange: string;
    targetTimeline: string;
    features: string[];
    description: string;
  }) => string;
  updateQuoteStatus: (id: string, status: QuoteStatus, estimatedCost?: string, extra?: Partial<QuoteRequest>) => void;

  // Live Project Tracker Actions
  addProjectTracker: (projectData: Partial<ProjectTracker>) => Promise<ProjectTracker>;
  updateProjectTracker: (id: string, updated: Partial<ProjectTracker>) => Promise<void>;
  deleteProjectTracker: (id: string) => Promise<void>;
  setProjectCurrentStage: (
    projectCode: string,
    stageNameOrId: string,
    progress?: number,
    activityNote?: string
  ) => Promise<void>;
  addProjectStage: (
    projectCode: string,
    stage: {
      titleTr: string;
      titleEn?: string;
      descTr: string;
      descEn?: string;
      dueDate?: string;
      completedDate?: string;
      startDate?: string;
      progress?: number;
      completed?: boolean;
    },
    insertPosition?: 'start' | 'end'
  ) => Promise<void>;
  updateProjectStage: (
    projectCode: string,
    stageId: string,
    updated: Partial<ProjectMilestone>
  ) => Promise<void>;
  deleteProjectStage: (projectCode: string, stageId: string) => Promise<void>;
  reorderProjectStages: (projectCode: string, stages: any[]) => Promise<void>;
  updateProjectProgress: (
    code: string,
    progress: number,
    stage: ProjectStage,
    activityNote?: string
  ) => void;
  toggleSprintTask: (projectCode: string, taskId: string) => void;
  addSprintTask: (projectCode: string, titleTr: string, titleEn: string, assignee: string) => void;

  // Billing Actions
  createInvoice: (inv: {
    projectCode?: string;
    clientName: string;
    clientCompany: string;
    clientTaxNo?: string;
    clientAddress: string;
    clientEmail: string;
    items: { description: string; quantity: number; unitPrice: number; total: number }[];
    dueDate: string;
  }) => Invoice;
  markInvoicePaid: (invoiceId: string, paymentMethod?: string) => void;

  addChatMessage: (projectCode: string, message: string, sender: 'client' | 'team', senderName: string) => void;

  // Export Utilities
  exportDataAsCsv: (type: 'appointments' | 'quotes' | 'projects' | 'invoices' | 'portfolio' | 'testimonials') => void;
  exportDataAsJson: (type: 'appointments' | 'quotes' | 'projects' | 'invoices' | 'portfolio' | 'testimonials' | 'all') => void;

  // Modals & Drawers
  paymentModal: PaymentModalState | null;
  openPaymentModal: (opts: { amount: number; title: string; invoiceId?: string; projectCode?: string }) => void;
  closePaymentModal: () => void;
  activeInvoiceModal: Invoice | null;
  setActiveInvoiceModal: (inv: Invoice | null) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  selectedCaseStudy: ProjectItem | null;
  setSelectedCaseStudy: (item: ProjectItem | null) => void;
  isSurveyModalOpen: boolean;
  setIsSurveyModalOpen: (open: boolean) => void;
  surveyTargetProjectCode?: string;
  openSurveyModal: (projectCode?: string) => void;
  closeSurveyModal: () => void;

  // Legal Modal (Gizlilik, Kullanım Koşulları, KVKK)
  legalModal: { isOpen: boolean; activeTab: 'privacy' | 'terms' | 'kvkk' } | null;
  openLegalModal: (tab?: 'privacy' | 'terms' | 'kvkk') => void;
  closeLegalModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('lodonsoft_lang');
    return saved === 'en' || saved === 'tr' ? saved : 'tr';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('lodonsoft_theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  const [activeView, setActiveView] = useState<'home' | 'admin' | 'tracker' | 'booking'>('home');
  const [activeProjectCode, setActiveProjectCode] = useState<string>('');

  // Modals
  const [paymentModal, setPaymentModal] = useState<PaymentModalState | null>(null);
  const [activeInvoiceModal, setActiveInvoiceModal] = useState<Invoice | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ProjectItem | null>(null);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState<boolean>(false);
  const [surveyTargetProjectCode, setSurveyTargetProjectCode] = useState<string | undefined>(undefined);
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; activeTab: 'privacy' | 'terms' | 'kvkk' } | null>(null);

  // Persistence Initializers
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('lodonsoft_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    const saved = localStorage.getItem('lodonsoft_quotes');
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });

  const [projects, setProjects] = useState<ProjectTracker[]>(() => {
    const saved = localStorage.getItem('lodonsoft_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECT_TRACKERS;
  });

  const [portfolioProjects, setPortfolioProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem('lodonsoft_portfolio_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('lodonsoft_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    const saved = localStorage.getItem('lodonsoft_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(() => {
    const saved = localStorage.getItem('lodonsoft_process_steps');
    return saved ? JSON.parse(saved) : INITIAL_PROCESS_STEPS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('lodonsoft_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  // Fetch initial data from full-stack backend
  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProjects(data);
      })
      .catch(() => {});

    fetch('/api/portfolio')
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPortfolioProjects(data);
      })
      .catch(() => {});

    fetch('/api/services')
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setServices(data);
      })
      .catch(() => {});

    fetch('/api/appointments')
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (Array.isArray(data)) setAppointments(data);
      })
      .catch(() => {});

    fetch('/api/quotes')
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (Array.isArray(data)) setQuotes(data);
      })
      .catch(() => {});

    fetch('/api/invoices')
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (Array.isArray(data)) setInvoices(data);
      })
      .catch(() => {});

    fetch('/api/settings')
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (data && typeof data === 'object') setSystemSettings((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {});
  }, []);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('lodonsoft_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('lodonsoft_settings');
    return saved ? { ...INITIAL_SYSTEM_SETTINGS, ...JSON.parse(saved) } : INITIAL_SYSTEM_SETTINGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('lodonsoft_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('lodonsoft_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem('lodonsoft_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => {
    const now = new Date();
    const formatted = now.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const newEntry: AuditLogItem = {
      ...log,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formatted,
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
  };

  const updateSystemSettings = (updated: Partial<SystemSettings>) => {
    setSystemSettings((prev) => ({ ...prev, ...updated }));
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
    addAuditLog({
      action: 'Sistem Parametreleri Güncellendi',
      category: 'system',
      actor: 'admin@lodonsoft.com',
      ipAddress: '185.122.90.14',
      status: 'success',
      details: Object.keys(updated).join(', ') + ' güncellendi.',
    });
  };

  const resetSystemSettings = () => {
    setSystemSettings(INITIAL_SYSTEM_SETTINGS);
    fetch('/api/settings/reset', { method: 'POST' }).catch(() => {});
    addAuditLog({
      action: 'Sistem Parametreleri Sıfırlandı',
      category: 'system',
      actor: 'admin@lodonsoft.com',
      ipAddress: '185.122.90.14',
      status: 'warning',
      details: 'Tüm sistem ve SLA ayarları fabrika ayarlarına döndürüldü.',
    });
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
  };

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('lodonsoft_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('lodonsoft_theme', theme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  useEffect(() => {
    localStorage.setItem('lodonsoft_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('lodonsoft_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('lodonsoft_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('lodonsoft_portfolio_projects', JSON.stringify(portfolioProjects));
  }, [portfolioProjects]);

  useEffect(() => {
    localStorage.setItem('lodonsoft_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('lodonsoft_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('lodonsoft_process_steps', JSON.stringify(processSteps));
  }, [processSteps]);

  useEffect(() => {
    localStorage.setItem('lodonsoft_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('lodonsoft_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
  };

  const t = translations[language];

  // Survey Modal Control Actions
  const openSurveyModal = (projectCode?: string) => {
    setSurveyTargetProjectCode(projectCode);
    setIsSurveyModalOpen(true);
  };

  const closeSurveyModal = () => {
    setIsSurveyModalOpen(false);
    setSurveyTargetProjectCode(undefined);
  };

  const openLegalModal = (tab: 'privacy' | 'terms' | 'kvkk' = 'privacy') => {
    setLegalModal({ isOpen: true, activeTab: tab });
  };

  const closeLegalModal = () => {
    setLegalModal(null);
  };

  // Testimonial, Reviews & Survey Actions
  const addTestimonial = (itemData: Omit<TestimonialItem, 'id'>): string => {
    const newId = `t-${Date.now()}`;
    const newTestimonial: TestimonialItem = {
      ...itemData,
      id: newId,
      status: itemData.status || 'approved',
      rating: itemData.rating || 5,
      source: itemData.source || 'client_survey',
    };
    setTestimonials((prev) => [newTestimonial, ...prev]);
    fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTestimonial),
    }).catch(() => {});
    return newId;
  };

  const updateTestimonial = (id: string, updated: Partial<TestimonialItem>) => {
    setTestimonials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    fetch(`/api/testimonials/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((item) => item.id !== id));
    fetch(`/api/testimonials/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
  };

  const resetTestimonials = () => {
    setTestimonials(INITIAL_TESTIMONIALS);
  };

  const syncGoogleReviews = async (): Promise<number> => {
    try {
      const res = await fetch('/api/testimonials/sync-google', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const fetchAll = await fetch('/api/testimonials');
        if (fetchAll.ok) {
          const allT = await fetchAll.json();
          setTestimonials(allT);
        }
        return data.addedCount || 0;
      }
    } catch (e) {
      console.warn('API error during review sync', e);
    }

    // Local fallback
    await new Promise((resolve) => setTimeout(resolve, 600));
    let newCount = 0;
    setTestimonials((prev) => {
      const existingNames = new Set(prev.map((item) => item.clientName.toLowerCase()));
      const toAdd = PRESET_GOOGLE_SAMPLE_REVIEWS.filter(
        (sample) => !existingNames.has(sample.clientName.toLowerCase())
      ).map((sample, idx) => ({
        ...sample,
        id: `t-g-synced-${Date.now()}-${idx}`,
      }));
      newCount = toAdd.length;
      return [...toAdd, ...prev];
    });
    return newCount;
  };

  // Portfolio Management Actions
  const addPortfolioProject = (projectData: Omit<ProjectItem, 'id'>) => {
    const newProj: ProjectItem = {
      ...projectData,
      id: `proj-${Date.now()}`,
    };
    setPortfolioProjects((prev) => [newProj, ...prev]);
    fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProj),
    }).catch(() => {});
  };

  const updatePortfolioProject = (id: string, updated: Partial<ProjectItem>) => {
    setPortfolioProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    if (selectedCaseStudy && selectedCaseStudy.id === id) {
      setSelectedCaseStudy((prev) => (prev ? { ...prev, ...updated } : null));
    }
    fetch(`/api/portfolio/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  const deletePortfolioProject = (id: string) => {
    setPortfolioProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedCaseStudy && selectedCaseStudy.id === id) {
      setSelectedCaseStudy(null);
    }
    fetch(`/api/portfolio/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
  };

  const resetPortfolioProjects = () => {
    setPortfolioProjects(INITIAL_PROJECTS);
  };

  // Services Management Actions
  const addService = (serviceData: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };
    setServices((prev) => [...prev, newService]);
    fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newService),
    }).catch(() => {});
  };

  const updateService = (id: string, updated: Partial<ServiceItem>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    fetch(`/api/services/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    fetch(`/api/services/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
  };

  const resetServices = () => {
    setServices(INITIAL_SERVICES);
  };

  // Process Step Management Actions
  const updateProcessStep = (stepNumber: string, updated: Partial<ProcessStep>) => {
    setProcessSteps((prev) =>
      prev.map((p) => (p.step === stepNumber ? { ...p, ...updated } : p))
    );
  };

  const resetProcessSteps = () => {
    setProcessSteps(INITIAL_PROCESS_STEPS);
  };

  // Appointments Actions
  const addAppointment = (data: {
    clientName: string;
    companyName: string;
    email: string;
    phone: string;
    serviceId: string;
    serviceName: string;
    date: string;
    timeSlot: string;
    meetingType: 'google_meet' | 'zoom' | 'office';
    notes?: string;
  }): string => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `LOD-APP-${randomNum}`;
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      trackingCode,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newApt, ...prev]);
    fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApt),
    }).catch(() => {});
    return trackingCode;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    fetch(`/api/appointments/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  };

  const addQuote = (data: {
    clientName: string;
    companyName: string;
    email: string;
    phone: string;
    selectedServices: string[];
    budgetRange: string;
    targetTimeline: string;
    features: string[];
    description: string;
  }): string => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `LOD-QTE-${randomNum}`;
    const newQuote: QuoteRequest = {
      ...data,
      id: `qte-${Date.now()}`,
      trackingCode,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setQuotes((prev) => [newQuote, ...prev]);
    fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuote),
    }).catch(() => {});
    return trackingCode;
  };

  const updateQuoteStatus = (id: string, status: QuoteStatus, estimatedCost?: string, extra?: Partial<QuoteRequest>) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status, estimatedCost: estimatedCost || q.estimatedCost, ...extra } : q
      )
    );
    fetch(`/api/quotes/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, estimatedCost, ...extra }),
    }).catch(() => {});
  };

  // ================= PROJECT TRACKER & DYNAMIC STAGES =================
  const addProjectTracker = async (projectData: Partial<ProjectTracker>): Promise<ProjectTracker> => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      if (res.ok) {
        const created: ProjectTracker = await res.json();
        setProjects((prev) => [created, ...prev]);
        return created;
      }
    } catch (e) {
      console.warn('API error, falling back locally', e);
    }

    const newProj: ProjectTracker = {
      id: `trk-${Date.now()}`,
      projectCode: projectData.projectCode || `LOD-2026-${String(projects.length + 1).padStart(2, '0')}`,
      title: projectData.title || 'Yeni Müşteri Projesi',
      clientName: projectData.clientName || 'Müşteri',
      clientEmail: projectData.clientEmail || '',
      leadArchitect: projectData.leadArchitect || 'Kaan Demir (Principal Tech Lead)',
      totalBudget: Number(projectData.totalBudget) || 100000,
      paidAmount: Number(projectData.paidAmount) || 0,
      overallProgress: Number(projectData.overallProgress) || 10,
      currentStage: projectData.currentStage || 'discovery',
      currentStageName: projectData.currentStageName || 'Keşif & Kapsam Analizi',
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      estimatedDeliveryDate: projectData.estimatedDeliveryDate || '',
      stagingUrl: projectData.stagingUrl || '',
      repositoryUrl: projectData.repositoryUrl || '',
      milestones: projectData.milestones || [
        {
          id: 'm-1',
          stage: 'discovery',
          title: { tr: 'Keşif & Analiz', en: 'Discovery & Analysis' },
          description: { tr: 'İş planı ve sistem gereksinimleri.', en: 'Business plan & requirements.' },
          progress: 100,
          completed: true,
          dueDate: 'Hafta 1',
        },
        {
          id: 'm-2',
          stage: 'design',
          title: { tr: 'UI/UX & Prototip', en: 'UI/UX & Prototype' },
          description: { tr: 'Tasarım ve onay süreci.', en: 'Design & feedback approval.' },
          progress: 50,
          completed: false,
          dueDate: 'Hafta 3',
        },
        {
          id: 'm-3',
          stage: 'development',
          title: { tr: 'Geliştirme & Kodlama', en: 'Core Development' },
          description: { tr: 'Sistem altyapısı ve entegrasyonlar.', en: 'Core infrastructure & API.' },
          progress: 0,
          completed: false,
          dueDate: 'Hafta 6',
        },
      ],
      sprintTasks: projectData.sprintTasks || [],
      activities: projectData.activities || [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Bugün',
          actor: 'Sistem',
          action: { tr: 'Proje oluşturuldu.', en: 'Project initialized.' },
        },
      ],
    };

    setProjects((prev) => [newProj, ...prev]);
    return newProj;
  };

  const updateProjectTracker = async (id: string, updated: Partial<ProjectTracker>) => {
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const saved = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === id || p.projectCode === id ? saved : p)));
        return;
      }
    } catch (e) {
      console.warn('API error, falling back locally', e);
    }

    setProjects((prev) =>
      prev.map((p) => (p.id === id || p.projectCode === id ? { ...p, ...updated } : p))
    );
  };

  const deleteProjectTracker = async (id: string) => {
    try {
      await fetch(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API error', e);
    }
    setProjects((prev) => prev.filter((p) => p.id !== id && p.projectCode !== id));
  };

  const setProjectCurrentStage = async (
    projectCode: string,
    stageNameOrId: string,
    progress: number = 60,
    activityNote?: string
  ) => {
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(projectCode)}/current-stage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageName: stageNameOrId,
          stageId: stageNameOrId,
          progress,
          activityNote,
        }),
      });
      if (res.ok) {
        const updatedProject: ProjectTracker = await res.json();
        setProjects((prev) =>
          prev.map((p) => (p.projectCode === projectCode ? updatedProject : p))
        );
        return;
      }
    } catch (e) {
      console.warn('API error, falling back locally', e);
    }

    // Local state fallback logic
    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectCode !== projectCode) return p;
        const lower = stageNameOrId.trim().toLowerCase();
        let targetIdx = p.milestones.findIndex(
          (m) =>
            m.id.toLowerCase() === lower ||
            m.title.tr.toLowerCase().includes(lower) ||
            m.stage.toLowerCase() === lower
        );

        let updatedMilestones = [...p.milestones];
        if (targetIdx === -1) {
          const newM = {
            id: `m-${Date.now()}`,
            stage: stageNameOrId,
            title: { tr: stageNameOrId, en: stageNameOrId },
            description: { tr: 'Şu an bu aşama yürütülmektedir.', en: 'Currently in progress.' },
            progress,
            completed: false,
            dueDate: 'Aktif Faz',
          };
          updatedMilestones.push(newM);
          targetIdx = updatedMilestones.length - 1;
        }

        updatedMilestones = updatedMilestones.map((m, idx) => {
          if (idx < targetIdx) return { ...m, completed: true, progress: 100 };
          if (idx === targetIdx) return { ...m, completed: false, progress };
          return { ...m, completed: false, progress: 0 };
        });

        const activeStage = updatedMilestones[targetIdx];
        const newActivities = activityNote
          ? [
              {
                id: `act-${Date.now()}`,
                timestamp: language === 'tr' ? 'Az önce' : 'Just now',
                actor: 'Lodonsoft Ekibi',
                action: { tr: activityNote, en: activityNote },
              },
              ...p.activities,
            ]
          : p.activities;

        const total = updatedMilestones.length;
        const overallProgress =
          total > 0
            ? Math.min(100, Math.round(((targetIdx + progress / 100) / total) * 100))
            : p.overallProgress;

        return {
          ...p,
          milestones: updatedMilestones,
          currentStage: activeStage.stage,
          currentStageName: activeStage.title.tr,
          overallProgress,
          activities: newActivities,
        };
      })
    );
  };

  const addProjectStage = async (
    projectCode: string,
    stage: {
      titleTr: string;
      titleEn?: string;
      descTr: string;
      descEn?: string;
      dueDate?: string;
      completedDate?: string;
      startDate?: string;
      progress?: number;
      completed?: boolean;
    },
    insertPosition: 'start' | 'end' = 'end'
  ) => {
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(projectCode)}/stages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStage: stage, insertPosition }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) =>
          prev.map((p) => (p.projectCode === projectCode ? updated : p))
        );
        return;
      }
    } catch (e) {
      console.warn('API error, falling back locally', e);
    }

    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectCode !== projectCode) return p;
        const newM = {
          id: `m-${Date.now()}`,
          stage: stage.titleTr,
          title: { tr: stage.titleTr, en: stage.titleEn || stage.titleTr },
          description: { tr: stage.descTr, en: stage.descEn || stage.descTr },
          progress: stage.progress || 0,
          completed: Boolean(stage.completed),
          dueDate: stage.dueDate || '',
          completedDate:
            stage.completedDate ||
            (stage.completed ? new Date().toISOString().split('T')[0] : undefined),
          startDate: stage.startDate || '',
        };
        const milestones =
          insertPosition === 'start' ? [newM, ...p.milestones] : [...p.milestones, newM];
        return { ...p, milestones };
      })
    );
  };

  const updateProjectStage = async (
    projectCode: string,
    stageId: string,
    updated: Partial<ProjectMilestone>
  ) => {
    try {
      const res = await fetch(
        `/api/projects/${encodeURIComponent(projectCode)}/stages/${encodeURIComponent(stageId)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        }
      );
      if (res.ok) {
        const updatedProject = await res.json();
        setProjects((prev) =>
          prev.map((p) => (p.projectCode === projectCode ? updatedProject : p))
        );
        return;
      }
    } catch (e) {
      console.warn('API error, falling back locally', e);
    }

    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectCode !== projectCode) return p;
        return {
          ...p,
          milestones: p.milestones.map((m) => (m.id === stageId ? { ...m, ...updated } : m)),
        };
      })
    );
  };

  const deleteProjectStage = async (projectCode: string, stageId: string) => {
    try {
      const res = await fetch(
        `/api/projects/${encodeURIComponent(projectCode)}/stages/${encodeURIComponent(stageId)}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) =>
          prev.map((p) => (p.projectCode === projectCode ? updated : p))
        );
        return;
      }
    } catch (e) {
      console.warn('API error, falling back locally', e);
    }

    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectCode !== projectCode) return p;
        return { ...p, milestones: p.milestones.filter((m) => m.id !== stageId) };
      })
    );
  };

  const reorderProjectStages = async (projectCode: string, stages: any[]) => {
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(projectCode)}/stages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stages }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) =>
          prev.map((p) => (p.projectCode === projectCode ? updated : p))
        );
        return;
      }
    } catch (e) {
      console.warn('API error, falling back locally', e);
    }

    setProjects((prev) =>
      prev.map((p) => (p.projectCode === projectCode ? { ...p, milestones: stages } : p))
    );
  };

  const updateProjectProgress = (
    code: string,
    progress: number,
    stage: ProjectStage,
    activityNote?: string
  ) => {
    setProjectCurrentStage(code, stage, progress, activityNote);
  };

  const toggleSprintTask = (projectCode: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectCode !== projectCode) return p;
        const updatedTasks = p.sprintTasks.map((t) => {
          if (t.id !== taskId) return t;
          const nextStatus = t.status === 'done' ? 'in_progress' : 'done';
          return { ...t, status: nextStatus as 'done' | 'in_progress' };
        });
        return { ...p, sprintTasks: updatedTasks };
      })
    );
  };

  const addSprintTask = (projectCode: string, titleTr: string, titleEn: string, assignee: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectCode !== projectCode) return p;
        const newTask = {
          id: `t-${Date.now()}`,
          title: { tr: titleTr, en: titleEn },
          status: 'planned' as const,
          assignee: assignee || 'Geliştirici Ekibi',
        };
        return { ...p, sprintTasks: [...p.sprintTasks, newTask] };
      })
    );
  };

  const createInvoice = (inv: {
    projectCode?: string;
    clientName: string;
    clientCompany: string;
    clientTaxNo?: string;
    clientAddress: string;
    clientEmail: string;
    items: { description: string; quantity: number; unitPrice: number; total: number }[];
    dueDate: string;
  }): Invoice => {
    const subtotal = inv.items.reduce((acc, i) => acc + i.total, 0);
    const taxRate = 20;
    const taxAmount = Math.round(subtotal * 0.2);
    const totalAmount = subtotal + taxAmount;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `LOD-2026-INV-${randomNum}`;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      projectCode: inv.projectCode,
      clientName: inv.clientName,
      clientCompany: inv.clientCompany,
      clientTaxNo: inv.clientTaxNo || 'VKN: 8840291122',
      clientAddress: inv.clientAddress,
      clientEmail: inv.clientEmail,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: inv.dueDate,
      items: inv.items,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      status: 'pending',
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInvoice),
    }).catch(() => {});
    return newInvoice;
  };

  const markInvoicePaid = (invoiceId: string, paymentMethod?: string) => {
    let paidAmount = 0;
    let projCode = '';

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          paidAmount = inv.totalAmount;
          projCode = inv.projectCode || '';
          return {
            ...inv,
            status: 'paid',
            paymentMethod: paymentMethod || '3D Secure Kredi Kartı',
            paidAt: new Date().toISOString().split('T')[0],
          };
        }
        return inv;
      })
    );

    fetch(`/api/invoices/${encodeURIComponent(invoiceId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'paid',
        paymentMethod: paymentMethod || '3D Secure Kredi Kartı',
        paidAt: new Date().toISOString().split('T')[0],
      }),
    }).catch(() => {});

    if (projCode) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.projectCode === projCode) {
            return {
              ...p,
              paidAmount: Math.min(p.totalBudget, p.paidAmount + paidAmount),
              activities: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: language === 'tr' ? 'Bugün' : 'Today',
                  actor: 'Sistem',
                  action: {
                    tr: `₺${paidAmount.toLocaleString('tr-TR')} tutarında hakediş ödemesi başarıyla tahsil edildi.`,
                    en: `Milestone payment of ₺${paidAmount.toLocaleString('tr-TR')} settled successfully.`,
                  },
                },
                ...p.activities,
              ],
            };
          }
          return p;
        })
      );
    }
  };

  const addChatMessage = (
    projectCode: string,
    message: string,
    sender: 'client' | 'team',
    senderName: string
  ) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      projectCode,
      sender,
      senderName,
      senderRole: sender === 'team' ? 'Teknik Ekip' : 'Müşteri',
      message,
      timestamp: language === 'tr' ? 'Şimdi' : 'Just now',
    };
    setChatMessages((prev) => [...prev, newMsg]);
    fetch(`/api/chat/${encodeURIComponent(projectCode)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMsg),
    }).catch(() => {});

    if (sender === 'client') {
      setTimeout(() => {
        const autoReplies =
          language === 'tr'
            ? [
                'Mesajınız teknik mimarımız ve proje yöneticimize iletildi. İlgili sprint üzerinde kontrol edip hemen dönüş yapıyoruz!',
                'Geri bildiriminiz için teşekkürler! Test ortamında gerekli güncellemeyi inceleyip size bağlantıyı paylaşıyoruz.',
                'Talebiniz kaydedildi. Bugün saat 17:00 sprint değerlendirmesinde konuyu ele alacağız.',
              ]
            : [
                'Message received by our lead architect! We are reviewing this sprint task and will get back to you shortly.',
                'Thanks for the update! We are verifying the staging deploy and will share the test results shortly.',
                'Noted! This item is scheduled for today’s 17:00 sprint standup review.',
              ];
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          projectCode,
          sender: 'team',
          senderName: 'Selin Kaya',
          senderRole: 'Proje Yöneticisi',
          message: randomReply,
          timestamp: language === 'tr' ? 'Şimdi' : 'Just now',
        };
        setChatMessages((prev) => [...prev, replyMsg]);
      }, 1200);
    }
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportDataAsCsv = (type: 'appointments' | 'quotes' | 'projects' | 'invoices' | 'portfolio' | 'testimonials') => {
    let csv = '';
    const dateStr = new Date().toISOString().split('T')[0];

    if (type === 'appointments') {
      csv = 'TakipKodu,Musteri,Sirket,Eposta,Telefon,Hizmet,Tarih,Saat,Kanal,Durum\n';
      appointments.forEach((a) => {
        csv += `"${a.trackingCode}","${a.clientName}","${a.companyName}","${a.email}","${a.phone}","${a.serviceName}","${a.date}","${a.timeSlot}","${a.meetingType}","${a.status}"\n`;
      });
      downloadFile(csv, `lodonsoft-randevular-${dateStr}.csv`, 'text/csv;charset=utf-8;');
    } else if (type === 'quotes') {
      csv = 'TakipKodu,Musteri,Sirket,Eposta,Butce,HedefSure,Durum,TahminiTutar\n';
      quotes.forEach((q) => {
        csv += `"${q.trackingCode}","${q.clientName}","${q.companyName}","${q.email}","${q.budgetRange}","${q.targetTimeline}","${q.status}","${q.estimatedCost || ''}"\n`;
      });
      downloadFile(csv, `lodonsoft-teklifler-${dateStr}.csv`, 'text/csv;charset=utf-8;');
    } else if (type === 'projects') {
      csv = 'ProjeKodu,Baslik,Musteri,Mimar,ToplamButce,OdenenTutar,IlerlemeYuzdesi,AktifFaz\n';
      projects.forEach((p) => {
        csv += `"${p.projectCode}","${p.title}","${p.clientName}","${p.leadArchitect}","${p.totalBudget}","${p.paidAmount}","%${p.overallProgress}","${p.currentStage}"\n`;
      });
      downloadFile(csv, `lodonsoft-projeler-${dateStr}.csv`, 'text/csv;charset=utf-8;');
    } else if (type === 'portfolio') {
      csv = 'Id,Baslik,Musteri,Kategori,Yil,CanliUrl,Gorsel\n';
      portfolioProjects.forEach((p) => {
        csv += `"${p.id}","${p.title}","${p.client}","${p.category}","${p.year}","${p.demoUrl || ''}","${p.image}"\n`;
      });
      downloadFile(csv, `lodonsoft-portfolyo-${dateStr}.csv`, 'text/csv;charset=utf-8;');
    } else if (type === 'invoices') {
      csv = 'FaturaNo,ProjeKodu,Musteri,VergiNo,DuzenlemeTarihi,AraToplam,KDV,ToplamTutar,Durum\n';
      invoices.forEach((inv) => {
        csv += `"${inv.invoiceNumber}","${inv.projectCode || ''}","${inv.clientCompany}","${inv.clientTaxNo || ''}","${inv.issueDate}","${inv.subtotal}","${inv.taxAmount}","${inv.totalAmount}","${inv.status}"\n`;
      });
      downloadFile(csv, `lodonsoft-faturalar-${dateStr}.csv`, 'text/csv;charset=utf-8;');
    } else if (type === 'testimonials') {
      csv = 'Id,Musteri,Sirket,Kaynak,Puan,Durum,Tarih,Yorum\n';
      testimonials.forEach((tm) => {
        const comment = typeof tm.quote === 'string' ? tm.quote : (tm.quote.tr || tm.quote.en || '');
        csv += `"${tm.id}","${tm.clientName}","${tm.company}","${tm.source || 'direct'}","${tm.rating || 5}","${tm.status || 'approved'}","${tm.verifiedDate}","${comment.replace(/"/g, '""')}"\n`;
      });
      downloadFile(csv, `lodonsoft-yorumlar-referanslar-${dateStr}.csv`, 'text/csv;charset=utf-8;');
    }
  };

  const exportDataAsJson = (type: 'appointments' | 'quotes' | 'projects' | 'invoices' | 'portfolio' | 'testimonials' | 'all') => {
    const dateStr = new Date().toISOString().split('T')[0];
    let dataToExport: unknown;

    if (type === 'appointments') dataToExport = appointments;
    else if (type === 'quotes') dataToExport = quotes;
    else if (type === 'projects') dataToExport = projects;
    else if (type === 'portfolio') dataToExport = portfolioProjects;
    else if (type === 'invoices') dataToExport = invoices;
    else if (type === 'testimonials') dataToExport = testimonials;
    else dataToExport = { appointments, quotes, projects, portfolioProjects, services, testimonials, processSteps, invoices, chatMessages, exportDate: dateStr };

    const jsonStr = JSON.stringify(dataToExport, null, 2);
    downloadFile(jsonStr, `lodonsoft-${type}-${dateStr}.json`, 'application/json');
  };

  const openPaymentModal = (opts: { amount: number; title: string; invoiceId?: string; projectCode?: string }) => {
    setPaymentModal({
      isOpen: true,
      amount: opts.amount,
      title: opts.title,
      invoiceId: opts.invoiceId,
      projectCode: opts.projectCode,
    });
  };

  const closePaymentModal = () => {
    setPaymentModal(null);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        t,
        activeView,
        setActiveView,
        appointments,
        quotes,
        projects,
        portfolioProjects,
        services,
        testimonials,
        processSteps,
        invoices,
        chatMessages,
        activeProjectCode,
        setActiveProjectCode,
        systemSettings,
        updateSystemSettings,
        resetSystemSettings,
        auditLogs,
        addAuditLog,
        clearAuditLogs,
        addPortfolioProject,
        updatePortfolioProject,
        deletePortfolioProject,
        resetPortfolioProjects,
        addService,
        updateService,
        deleteService,
        resetServices,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        resetTestimonials,
        syncGoogleReviews,
        updateProcessStep,
        resetProcessSteps,
        addAppointment,
        updateAppointmentStatus,
        addQuote,
        updateQuoteStatus,
        addProjectTracker,
        updateProjectTracker,
        deleteProjectTracker,
        setProjectCurrentStage,
        addProjectStage,
        updateProjectStage,
        deleteProjectStage,
        reorderProjectStages,
        updateProjectProgress,
        toggleSprintTask,
        addSprintTask,
        createInvoice,
        markInvoicePaid,
        addChatMessage,
        exportDataAsCsv,
        exportDataAsJson,
        paymentModal,
        openPaymentModal,
        closePaymentModal,
        activeInvoiceModal,
        setActiveInvoiceModal,
        isChatOpen,
        setIsChatOpen,
        selectedCaseStudy,
        setSelectedCaseStudy,
        isSurveyModalOpen,
        setIsSurveyModalOpen,
        surveyTargetProjectCode,
        openSurveyModal,
        closeSurveyModal,
        legalModal,
        openLegalModal,
        closeLegalModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
