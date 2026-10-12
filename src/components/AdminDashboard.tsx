import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminStatsSummary } from './AdminStatsSummary';
import {
  GitBranch,
  TrendingUp,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Calendar,
  FileText,
  Receipt,
  Settings,
  Sparkles,
  ArrowRight,
  Shield,
  Save,
  Check,
  X,
  Search,
  Eye,
  Briefcase,
  DollarSign,
  ChevronRight,
  Code2,
} from 'lucide-react';
import {
  ProjectTracker,
  ProjectMilestone,
  ProjectItem,
  ServiceItem,
  ServiceCategory,
  AppointmentStatus,
  QuoteStatus,
} from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    language,
    t,
    projects,
    addProjectTracker,
    deleteProjectTracker,
    setProjectCurrentStage,
    addProjectStage,
    updateProjectStage,
    deleteProjectStage,
    addSprintTask,
    toggleSprintTask,
    portfolioProjects,
    addPortfolioProject,
    updatePortfolioProject,
    deletePortfolioProject,
    services,
    addService,
    updateService,
    deleteService,
    appointments,
    updateAppointmentStatus,
    quotes,
    updateQuoteStatus,
    invoices,
    createInvoice,
    markInvoicePaid,
    setActiveInvoiceModal,
    systemSettings,
    updateSystemSettings,
    setActiveView,
    setActiveProjectCode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'projects' | 'portfolio' | 'services' | 'appointments' | 'quotes' | 'invoices' | 'settings'
  >('projects');

  // Success toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ==========================================
  // TAB 1: PROJECT TRACKER & TIMELINE STATE
  // ==========================================
  const [selectedCode, setSelectedCode] = useState<string>(
    projects[0]?.projectCode || 'LOD-2026-01'
  );
  const currentProj: ProjectTracker | undefined =
    projects.find((p) => p.projectCode === selectedCode) || projects[0];

  // Stage update input state
  const [currentStageInput, setCurrentStageInput] = useState<string>(
    currentProj?.currentStageName || currentProj?.currentStage || ''
  );
  const [currentProgressInput, setCurrentProgressInput] = useState<number>(
    currentProj?.overallProgress || 60
  );
  const [activityNoteInput, setActivityNoteInput] = useState<string>('');
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);

  // New stage modal state
  const [showAddStageModal, setShowAddStageModal] = useState(false);
  const [newStageTitleTr, setNewStageTitleTr] = useState('');
  const [newStageTitleEn, setNewStageTitleEn] = useState('');
  const [newStageDescTr, setNewStageDescTr] = useState('');
  const [newStageDueDate, setNewStageDueDate] = useState('');
  const [newStageStartDate, setNewStageStartDate] = useState('');
  const [newStageCompletedDate, setNewStageCompletedDate] = useState('');
  const [newStageCompleted, setNewStageCompleted] = useState(false);
  const [newStageProgress, setNewStageProgress] = useState(0);
  const [newStagePosition, setNewStagePosition] = useState<'end' | 'start'>('end');

  // Edit milestone modal state
  const [editingMilestone, setEditingMilestone] = useState<ProjectMilestone | null>(null);
  const [editStageTitleTr, setEditStageTitleTr] = useState('');
  const [editStageDescTr, setEditStageDescTr] = useState('');
  const [editStageDueDate, setEditStageDueDate] = useState('');
  const [editStageCompletedDate, setEditStageCompletedDate] = useState('');
  const [editStageStartDate, setEditStageStartDate] = useState('');
  const [editStageProgress, setEditStageProgress] = useState(0);
  const [editStageCompleted, setEditStageCompleted] = useState(false);

  const handleOpenEditMilestone = (m: ProjectMilestone) => {
    setEditingMilestone(m);
    setEditStageTitleTr(m.title.tr);
    setEditStageDescTr(m.description.tr);
    setEditStageDueDate(m.dueDate || '');
    setEditStageCompletedDate(m.completedDate || '');
    setEditStageStartDate(m.startDate || '');
    setEditStageProgress(m.progress || 0);
    setEditStageCompleted(Boolean(m.completed));
  };

  const handleSaveEditedMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone || !currentProj) return;

    const finalCompletedDate = editStageCompleted
      ? (editStageCompletedDate || new Date().toISOString().split('T')[0])
      : undefined;

    await updateProjectStage(currentProj.projectCode, editingMilestone.id, {
      title: { tr: editStageTitleTr, en: editStageTitleTr },
      description: { tr: editStageDescTr, en: editStageDescTr },
      dueDate: editStageDueDate,
      completedDate: finalCompletedDate,
      startDate: editStageStartDate,
      progress: editStageCompleted ? 100 : editStageProgress,
      completed: editStageCompleted,
    });

    setEditingMilestone(null);
    showToast('Aşama ve tarih bilgileri başarıyla veritabanına kaydedildi!');
  };

  // New project modal state
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjClient, setNewProjClient] = useState('');
  const [newProjEmail, setNewProjEmail] = useState('');
  const [newProjCode, setNewProjCode] = useState('');
  const [newProjBudget, setNewProjBudget] = useState('150000');
  const [newProjDelivery, setNewProjDelivery] = useState('2026-12-15');

  // New task state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  // Handle switching selected project
  const handleSelectProject = (code: string) => {
    setSelectedCode(code);
    const p = projects.find((item) => item.projectCode === code);
    if (p) {
      setCurrentStageInput(p.currentStageName || p.currentStage);
      setCurrentProgressInput(p.overallProgress);
    }
  };

  // Submit current stage update
  const handleSaveCurrentStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProj || !currentStageInput.trim()) return;

    setIsUpdatingStage(true);
    await setProjectCurrentStage(
      currentProj.projectCode,
      currentStageInput.trim(),
      currentProgressInput,
      activityNoteInput.trim() || undefined
    );
    setIsUpdatingStage(false);
    setActivityNoteInput('');
    showToast('Aşama ve zaman çizelgesi başarıyla güncellendi!');
  };

  // Submit new stage addition
  const handleAddNewStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProj || !newStageTitleTr.trim()) return;

    const finalCompletedDate = newStageCompleted
      ? (newStageCompletedDate || new Date().toISOString().split('T')[0])
      : undefined;

    await addProjectStage(
      currentProj.projectCode,
      {
        titleTr: newStageTitleTr.trim(),
        titleEn: newStageTitleEn.trim() || newStageTitleTr.trim(),
        descTr: newStageDescTr.trim() || 'Aşama planlandı.',
        descEn: newStageDescTr.trim() || 'Stage planned.',
        dueDate: newStageDueDate.trim() || '',
        startDate: newStageStartDate.trim() || '',
        completedDate: finalCompletedDate,
        progress: newStageCompleted ? 100 : Number(newStageProgress) || 0,
        completed: Boolean(newStageCompleted),
      },
      newStagePosition
    );

    setNewStageTitleTr('');
    setNewStageTitleEn('');
    setNewStageDescTr('');
    setNewStageDueDate('');
    setNewStageStartDate('');
    setNewStageCompletedDate('');
    setNewStageCompleted(false);
    setNewStageProgress(0);
    setShowAddStageModal(false);
    showToast('Yeni aşama zaman çizelgesine eklendi!');
  };

  // Create new project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjClient.trim()) return;

    const created = await addProjectTracker({
      projectCode:
        newProjCode.trim() ||
        `LOD-${new Date().getFullYear()}-${String(projects.length + 1).padStart(2, '0')}`,
      title: newProjTitle.trim(),
      clientName: newProjClient.trim(),
      clientEmail: newProjEmail.trim(),
      totalBudget: Number(newProjBudget) || 100000,
      paidAmount: 0,
      overallProgress: 15,
      currentStage: 'discovery',
      currentStageName: 'Keşif & Kapsam Analizi',
      estimatedDeliveryDate: newProjDelivery || '',
    });

    setSelectedCode(created.projectCode);
    setCurrentStageInput(created.currentStageName || 'Keşif & Kapsam Analizi');
    setShowNewProjectModal(false);
    setNewProjTitle('');
    setNewProjClient('');
    setNewProjEmail('');
    setNewProjCode('');
    showToast('Yeni müşteri takip projesi oluşturuldu!');
  };

  // Delete project
  const handleDeleteCurrentProject = async (id: string, code: string) => {
    if (!window.confirm(`"${code}" kodlu projeyi silmek istediğinize emin misiniz?`)) return;
    await deleteProjectTracker(id);
    const remaining = projects.filter((p) => p.projectCode !== code);
    if (remaining.length > 0) {
      setSelectedCode(remaining[0].projectCode);
    }
    showToast('Proje silindi.');
  };

  // Add sprint task
  const handleAddSprintTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProj || !newTaskTitle.trim()) return;
    addSprintTask(
      currentProj.projectCode,
      newTaskTitle.trim(),
      newTaskTitle.trim(),
      newTaskAssignee.trim() || 'Geliştirici Ekip'
    );
    setNewTaskTitle('');
    setNewTaskAssignee('');
    showToast('Görev eklendi!');
  };

  // ==========================================
  // TAB 2: PORTFOLIO STATE
  // ==========================================
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [portTitle, setPortTitle] = useState('');
  const [portClient, setPortClient] = useState('');
  const [portCategory, setPortCategory] = useState<ServiceCategory>('web');
  const [portImage, setPortImage] = useState(
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop'
  );
  const [portYear, setPortYear] = useState('2026');
  const [portSummaryTr, setPortSummaryTr] = useState('');
  const [portTechs, setPortTechs] = useState('React, TypeScript, Node.js, PostgreSQL');
  const [portDemoUrl, setPortDemoUrl] = useState('');

  const openPortfolioModal = (project?: ProjectItem) => {
    if (project) {
      setEditingPortfolioId(project.id);
      setPortTitle(project.title);
      setPortClient(project.client);
      setPortCategory(project.category);
      setPortImage(project.image);
      setPortYear(project.year);
      setPortSummaryTr(project.summary.tr);
      setPortTechs(project.technologies.join(', '));
      setPortDemoUrl(project.demoUrl || '');
    } else {
      setEditingPortfolioId(null);
      setPortTitle('');
      setPortClient('');
      setPortCategory('web');
      setPortImage(
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop'
      );
      setPortYear(new Date().getFullYear().toString());
      setPortSummaryTr('');
      setPortTechs('Next.js, TypeScript, PostgreSQL');
      setPortDemoUrl('');
    }
    setShowPortfolioModal(true);
  };

  const handleSavePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    const techs = portTechs.split(',').map((t) => t.trim()).filter(Boolean);
    const catLabel =
      portCategory === 'web'
        ? { tr: 'Web & Bulut Mimarisi', en: 'Web & Cloud Architecture' }
        : portCategory === 'mobile'
        ? { tr: 'Mobil Uygulama', en: 'Mobile App' }
        : portCategory === 'ai'
        ? { tr: 'Yapay Zeka & Veri', en: 'AI & Data' }
        : { tr: 'Kurumsal Yazılım', en: 'Enterprise Software' };

    if (editingPortfolioId) {
      updatePortfolioProject(editingPortfolioId, {
        title: portTitle,
        client: portClient,
        category: portCategory,
        categoryLabel: catLabel,
        image: portImage,
        year: portYear,
        summary: { tr: portSummaryTr, en: portSummaryTr },
        technologies: techs,
        demoUrl: portDemoUrl || undefined,
      });
      showToast('Portföy projesi güncellendi!');
    } else {
      addPortfolioProject({
        title: portTitle,
        client: portClient,
        category: portCategory,
        categoryLabel: catLabel,
        image: portImage,
        year: portYear,
        summary: { tr: portSummaryTr, en: portSummaryTr },
        metrics: { tr: 'Yüksek Performans & Güvenilirlik', en: 'High Performance & Reliability' },
        technologies: techs,
        demoUrl: portDemoUrl || undefined,
        caseStudy: { tr: portSummaryTr, en: portSummaryTr },
      });
      showToast('Yeni portföy projesi eklendi!');
    }
    setShowPortfolioModal(false);
  };

  // ==========================================
  // TAB 3: SERVICES STATE
  // ==========================================
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [srvNumber, setSrvNumber] = useState('07');
  const [srvTitleTr, setSrvTitleTr] = useState('');
  const [srvCategory, setSrvCategory] = useState<ServiceCategory>('web');
  const [srvPrice, setSrvPrice] = useState('₺50.000');
  const [srvDuration, setSrvDuration] = useState('3 - 6 Hafta');
  const [srvShortDesc, setSrvShortDesc] = useState('');
  const [srvDeliverables, setSrvDeliverables] = useState(
    'Mikroservis Mimarisi\nREST & GraphQL API Katmanı\nOtomatik Test & CI/CD'
  );

  const openServiceModal = (srv?: ServiceItem) => {
    if (srv) {
      setEditingServiceId(srv.id);
      setSrvNumber(srv.number);
      setSrvTitleTr(srv.title.tr);
      setSrvCategory(srv.category);
      setSrvPrice(srv.startingPrice);
      setSrvDuration(srv.duration.tr);
      setSrvShortDesc(srv.shortDesc.tr);
      setSrvDeliverables(srv.deliverables.tr.join('\n'));
    } else {
      setEditingServiceId(null);
      setSrvNumber(String(services.length + 1).padStart(2, '0'));
      setSrvTitleTr('');
      setSrvCategory('web');
      setSrvPrice('₺60.000');
      setSrvDuration('4 - 8 Hafta');
      setSrvShortDesc('');
      setSrvDeliverables('Mimari Analiz\nModern Arayüz\nAPI Entegrasyonu');
    }
    setShowServiceModal(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const deliverablesList = srvDeliverables.split('\n').map((d) => d.trim()).filter(Boolean);

    if (editingServiceId) {
      updateService(editingServiceId, {
        number: srvNumber,
        category: srvCategory,
        title: { tr: srvTitleTr, en: srvTitleTr },
        startingPrice: srvPrice,
        duration: { tr: srvDuration, en: srvDuration },
        shortDesc: { tr: srvShortDesc, en: srvShortDesc },
        deliverables: { tr: deliverablesList, en: deliverablesList },
      });
      showToast('Hizmet başarıyla güncellendi!');
    } else {
      addService({
        number: srvNumber,
        category: srvCategory,
        title: { tr: srvTitleTr, en: srvTitleTr },
        startingPrice: srvPrice,
        duration: { tr: srvDuration, en: srvDuration },
        shortDesc: { tr: srvShortDesc, en: srvShortDesc },
        longDesc: { tr: srvShortDesc, en: srvShortDesc },
        deliverables: { tr: deliverablesList, en: deliverablesList },
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      });
      showToast('Yeni hizmet başarıyla eklendi!');
    }
    setShowServiceModal(false);
  };

  // ==========================================
  // TAB 7: SETTINGS STATE
  // ==========================================
  const [settingsForm, setSettingsForm] = useState({
    companyName: systemSettings.companyName || 'Lodonsoft Yazılım & Teknoloji A.Ş.',
    contactEmail: systemSettings.contactEmail || 'iletisim@lodonsoft.com',
    contactPhone: systemSettings.contactPhone || '+90 (212) 840 20 40',
    address: systemSettings.address || 'Levent 199, Büyükdere Cad. No:199, Şişli / İstanbul',
    bankName: systemSettings.bankName || 'Garanti BBVA',
    bankIban: systemSettings.bankIban || 'TR33 0006 2000 0001 2000 3456 78',
    slaUptimeGuaranteePercent: systemSettings.slaUptimeGuaranteePercent || 99.9,
    warrantyDurationMonths: systemSettings.warrantyDurationMonths || 6,
    ipTransferClauseEnabled: Boolean(systemSettings.ipTransferClauseEnabled),
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings(settingsForm);
    showToast('Sistem ayarları başarıyla kaydedildi!');
  };

  return (
    <div className="min-h-screen bg-[#050506] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-medium shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8a8f98] mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Lodonsoft Master Control Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Yönetim Paneli & Müşteri Takip Sistemi
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#8a8f98]">
              Müşteri projelerini, aşamaları, portföyü, hizmetleri, randevuları ve faturaları tek noktadan yönetin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveView('tracker');
                setTimeout(() => {
                  const el = document.getElementById('tracker');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.1] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Müşteri Takip Sayfasına Git</span>
            </button>
            <button
              onClick={() => setActiveView('home')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ÖZET İSTATİSTİK KARTLARI (EXECUTIVE STATS SUMMARY)       */}
        {/* ======================================================== */}
        <AdminStatsSummary onSelectTab={(tab) => setActiveTab(tab)} activeTab={activeTab} />

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#0c0d12] border border-white/[0.08] rounded-2xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-white text-black shadow-md'
                : 'text-[#8a8f98] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Müşteri Proje Takip & Timeline</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'portfolio'
                ? 'bg-white text-black shadow-md'
                : 'text-[#8a8f98] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Portföy Projeleri</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10">
              {portfolioProjects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-white text-black shadow-md'
                : 'text-[#8a8f98] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Hizmetlerimiz</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10">
              {services.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-white text-black shadow-md'
                : 'text-[#8a8f98] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Randevular</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10">
              {appointments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'quotes'
                ? 'bg-white text-black shadow-md'
                : 'text-[#8a8f98] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Teklif Talepleri</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10">
              {quotes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-white text-black shadow-md'
                : 'text-[#8a8f98] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Faturalar</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10">
              {invoices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-black shadow-md'
                : 'text-[#8a8f98] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Sistem Ayarları</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: CLIENT PROJECT TRACKER & DYNAMIC TIMELINE         */}
        {/* ======================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Project Switcher Bar */}
            <div className="p-4 bg-[#0a0b0e] border border-white/[0.08] rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-[#8a8f98] font-semibold font-mono">
                  Yönetilen Proje:
                </span>
                <select
                  value={selectedCode}
                  onChange={(e) => handleSelectProject(e.target.value)}
                  className="bg-[#050506] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden font-mono cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.projectCode} className="bg-[#0a0b0e]">
                      {p.projectCode} – {p.title} ({p.clientName})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yeni Müşteri Projesi Ekle</span>
                </button>
              </div>

              {currentProj && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveProjectCode(currentProj.projectCode);
                      setActiveView('tracker');
                      setTimeout(() => {
                        const el = document.getElementById('tracker');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 underline"
                  >
                    <span>Müşteri Görünümünü Aç</span>
                    <ExternalLink className="w-3 h-3 text-[#8a8f98]" />
                  </button>
                  <button
                    onClick={() => handleDeleteCurrentProject(currentProj.id, currentProj.projectCode)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Projeyi Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {currentProj && (
              <>
                {/* Project Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#0a0b0e] border border-white/[0.08]">
                    <span className="text-xs text-[#8a8f98] font-mono">Müşteri Şirket</span>
                    <div className="text-base font-bold text-white mt-1 truncate">
                      {currentProj.clientName}
                    </div>
                    <div className="text-xs text-[#5c6068] mt-0.5 font-mono">{currentProj.projectCode}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0a0b0e] border border-white/[0.08]">
                    <span className="text-xs text-[#8a8f98] font-mono">Genel İlerleme</span>
                    <div className="text-base font-bold text-emerald-400 mt-1 font-mono">
                      %{currentProj.overallProgress}
                    </div>
                    <div className="w-full bg-[#050506] h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${currentProj.overallProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0a0b0e] border border-white/[0.08]">
                    <span className="text-xs text-[#8a8f98] font-mono">Bütçe Durumu</span>
                    <div className="text-base font-bold text-white mt-1 font-mono">
                      ₺{currentProj.paidAmount.toLocaleString('tr-TR')} / ₺
                      {currentProj.totalBudget.toLocaleString('tr-TR')}
                    </div>
                    <div className="text-xs text-[#5c6068] mt-0.5 font-mono">
                      Kalan: ₺{(currentProj.totalBudget - currentProj.paidAmount).toLocaleString('tr-TR')}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0a0b0e] border border-white/[0.08]">
                    <span className="text-xs text-[#8a8f98] font-mono">Mevcut Aktif Faz</span>
                    <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="truncate">{currentProj.currentStageName || currentProj.currentStage}</span>
                    </div>
                    <div className="text-xs text-[#5c6068] mt-0.5 font-mono">
                      Teslim: {currentProj.estimatedDeliveryDate || 'Belirtilmedi'}
                    </div>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* CORE REQUIREMENT: DYNAMIC CURRENT STAGE INPUT & TIMELINE */}
                {/* ======================================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column (5 Cols): Stage Input Form */}
                  <div className="lg:col-span-5 linear-card rounded-2xl p-6 sm:p-7 space-y-6">
                    <div>
                      <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Aşama & Durum Güncellemesi</span>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        Şu An Hangi Aşamadasınız?
                      </h3>
                      <p className="text-xs text-[#8a8f98] mt-1 leading-relaxed">
                        Aşağıya bulunduğunuz aşamayı yazın veya seçin. Sistem, bu aşamadan öncekileri otomatik olarak
                        <strong> "Tamamlandı"</strong>, sonrakileri ise <strong>"Planlandı"</strong> olarak zaman çizelgesine işler.
                      </p>
                    </div>

                    <form onSubmit={handleSaveCurrentStage} className="space-y-4">
                      {/* Stage Name / Input */}
                      <div>
                        <label className="text-xs text-zinc-300 block mb-1.5 font-medium">
                          Mevcut Aşama Adı (Yazın veya Seçin)
                        </label>
                        <div className="space-y-2">
                          <input
                            type="text"
                            required
                            value={currentStageInput}
                            onChange={(e) => setCurrentStageInput(e.target.value)}
                            placeholder="Örn: Frontend & API Entegrasyonu"
                            className="w-full bg-[#050506] border border-white/[0.12] focus:border-emerald-500/50 rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-[#5c6068] focus:outline-hidden font-mono"
                          />

                          {/* Quick selection chips from existing milestones */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="text-[11px] text-[#62666d] self-center mr-1">Öneriler:</span>
                            {currentProj.milestones.map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => setCurrentStageInput(m.title.tr)}
                                className={`text-[11px] font-mono px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                                  currentStageInput === m.title.tr
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : 'bg-white/[0.03] text-zinc-400 border-white/[0.08] hover:text-white'
                                }`}
                              >
                                {m.title.tr}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Current Stage Progress Slider */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-zinc-300">Bu Aşamadaki İlerleme:</span>
                          <span className="font-mono text-emerald-400 font-bold text-sm">
                            %{currentProgressInput}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={currentProgressInput}
                          onChange={(e) => setCurrentProgressInput(Number(e.target.value))}
                          className="w-full accent-emerald-400 cursor-pointer"
                        />
                      </div>

                      {/* Live Activity Note */}
                      <div>
                        <label className="text-xs text-zinc-300 block mb-1.5 font-medium">
                          Müşteri Paneline Eklenecek Canlı Aktivite Notu (İsteğe Bağlı)
                        </label>
                        <input
                          type="text"
                          value={activityNoteInput}
                          onChange={(e) => setActivityNoteInput(e.target.value)}
                          placeholder="Örn: 4. Sprint tamamlandı, ödeme entegrasyonu test edildi."
                          className="w-full bg-[#050506] border border-white/[0.12] focus:border-white/30 rounded-xl p-3 text-xs text-white placeholder:text-[#5c6068] focus:outline-hidden"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isUpdatingStage}
                        className="btn-linear-primary w-full py-3 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg"
                      >
                        <Save className="w-4 h-4 text-black" />
                        <span>Aşamayı Kaydet & Zaman Çizelgesine Yansıt</span>
                      </button>
                    </form>
                  </div>

                  {/* Right Column (7 Cols): Visual Timeline Display & Management */}
                  <div className="lg:col-span-7 linear-card rounded-2xl p-6 sm:p-7 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-white" />
                          <span>Proje Zaman Çizelgesi (Timeline)</span>
                        </h3>
                        <p className="text-xs text-[#8a8f98] mt-0.5">
                          Aşamaların sıralaması ve mevcut durumun görsel akışı.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowAddStageModal(true)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.1] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Yeni Aşama Ekle</span>
                      </button>
                    </div>

                    {/* Sequential Timeline List */}
                    <div className="space-y-3.5 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-white/[0.08] before:h-[90%] before:top-4">
                      {currentProj.milestones.map((m, idx) => {
                        // Is this stage matching the active stage?
                        const isActive =
                          !m.completed &&
                          (m.title.tr.toLowerCase() === currentProj.currentStageName?.toLowerCase() ||
                            m.stage === currentProj.currentStage ||
                            m.progress > 0);

                        return (
                          <div
                            key={m.id}
                            className={`relative pl-10 group transition-all`}
                          >
                            {/* Timeline Node Icon */}
                            <div
                              className={`absolute left-2.5 top-3 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center transition-all z-10 ${
                                m.completed
                                  ? 'bg-emerald-500 text-black ring-4 ring-emerald-500/20'
                                  : isActive
                                  ? 'bg-emerald-400 ring-4 ring-emerald-400/30 animate-pulse'
                                  : 'bg-[#15161b] border-2 border-white/20'
                              }`}
                            >
                              {m.completed && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                            </div>

                            {/* Milestone Card */}
                            <div
                              className={`p-4 rounded-xl border transition-all ${
                                isActive
                                  ? 'bg-emerald-500/[0.06] border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                                  : m.completed
                                  ? 'bg-white/[0.02] border-emerald-500/20'
                                  : 'bg-[#06070a] border-white/[0.06] opacity-75'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-mono text-[#8a8f98]">
                                      Aşama {idx + 1}
                                    </span>
                                    <span className="text-sm font-bold text-white">
                                      {m.title.tr}
                                    </span>
                                    {isActive && (
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold animate-pulse">
                                        ŞU AN BURADA
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-[#8a8f98] leading-relaxed">
                                    {m.description.tr}
                                  </p>

                                  {/* Dynamic Dates Grid: Beklenen Bitiş & Tamamlanma Tarihi */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5 text-xs">
                                    {/* Beklenen Bitiş */}
                                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                      <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                      <div className="flex flex-col min-w-0">
                                        <span className="text-[9px] uppercase font-mono text-[#8a8f98]">Beklenen Bitiş</span>
                                        <span className="font-mono text-white text-[11px] font-medium truncate">
                                          {m.dueDate || 'Belirtilmedi'}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Tamamlanma Tarihi */}
                                    <div
                                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${
                                        m.completed
                                          ? 'bg-emerald-500/[0.08] border-emerald-500/25 text-emerald-300'
                                          : 'bg-white/[0.02] border-white/[0.06]'
                                      }`}
                                    >
                                      {m.completed ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                      ) : (
                                        <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                                      )}
                                      <div className="flex flex-col min-w-0">
                                        <span className="text-[9px] uppercase font-mono text-[#8a8f98]">Tamamlanma Tarihi</span>
                                        <span
                                          className={`font-mono text-[11px] font-medium truncate ${
                                            m.completed ? 'text-emerald-300' : 'text-zinc-400'
                                          }`}
                                        >
                                          {m.completed
                                            ? (m.completedDate || m.dueDate || 'Tamamlandı')
                                            : isActive
                                            ? 'Devam Ediyor'
                                            : 'Henüz Tamamlanmadı'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 text-[10px] font-mono text-[#62666d] pt-0.5">
                                    {m.startDate && <span>Başlangıç: {m.startDate}</span>}
                                    <span>Aşama İlerlemesi: %{m.progress}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                                  <span
                                    className={`px-2.5 py-1 text-[10px] font-mono font-semibold rounded-md uppercase tracking-wider ${
                                      m.completed
                                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25'
                                        : isActive
                                        ? 'bg-white text-black font-bold'
                                        : 'bg-white/[0.04] text-zinc-400 border border-white/[0.08]'
                                    }`}
                                  >
                                    {m.completed
                                      ? 'Tamamlandı'
                                      : isActive
                                      ? 'Mevcut Aşama'
                                      : 'Planlandı'}
                                  </span>

                                  {/* Edit stage & dates button */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditMilestone(m)}
                                    className="p-1.5 text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg border border-transparent hover:border-emerald-500/20 transition-colors cursor-pointer"
                                    title="Aşama Bilgileri ve Tarihleri Düzenle"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete stage button */}
                                  <button
                                    type="button"
                                    onClick={() => deleteProjectStage(currentProj.projectCode, m.id)}
                                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer"
                                    title="Bu Aşamayı Sil"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Sprint Tasks Checklist Section */}
                <div className="linear-card rounded-2xl p-6 sm:p-7 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-white" />
                        <span>Sprint Alt Görevleri ({currentProj.sprintTasks.length})</span>
                      </h3>
                      <p className="text-xs text-[#8a8f98] mt-0.5">
                        Müşterinin aşama altında görebileceği sprint maddeleri.
                      </p>
                    </div>
                  </div>

                  {/* Add Sprint Task Form */}
                  <form onSubmit={handleAddSprintTask} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      required
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Yeni görev başlığı (Örn: Veritabanı index optimizasyonu)"
                      className="flex-1 bg-[#050506] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#5c6068] focus:outline-hidden font-mono"
                    />
                    <input
                      type="text"
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                      placeholder="Atanan kişi (Örn: Selin Kaya)"
                      className="sm:w-56 bg-[#050506] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#5c6068] focus:outline-hidden font-mono"
                    />
                    <button
                      type="submit"
                      className="btn-linear-secondary px-5 py-2.5 text-xs font-semibold rounded-xl shrink-0 cursor-pointer"
                    >
                      Görev Ekle
                    </button>
                  </form>

                  {/* Tasks List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {currentProj.sprintTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleSprintTask(currentProj.projectCode, task.id)}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={task.status === 'done'}
                            onChange={() => {}}
                            className="rounded accent-emerald-400 cursor-pointer"
                          />
                          <span
                            className={`text-xs truncate ${
                              task.status === 'done' ? 'line-through text-zinc-500' : 'text-zinc-200'
                            }`}
                          >
                            {task.title.tr}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#8a8f98] shrink-0 ml-2">
                          {task.assignee}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PORTFOLIO MANAGEMENT                              */}
        {/* ======================================================== */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <h2 className="text-xl font-bold text-white">Portföy & Vitrin Projeleri</h2>
                <p className="text-xs text-[#8a8f98] mt-1">
                  Ana sayfadaki "Projeler" bölümünde listelenen gerçek çalışmalar.
                </p>
              </div>

              <button
                onClick={() => openPortfolioModal()}
                className="btn-linear-primary px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>Yeni Portföy Projesi Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioProjects.map((p) => (
                <div
                  key={p.id}
                  className="linear-card rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-black/40 border-b border-white/[0.08]">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-white border border-white/10">
                      {p.category} · {p.year}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-mono text-[#8a8f98] mb-1">{p.client}</div>
                      <h4 className="text-base font-bold text-white tracking-tight">{p.title}</h4>
                      <p className="text-xs text-[#8a8f98] mt-2 line-clamp-2">{p.summary.tr}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {p.technologies.slice(0, 2).map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#8a8f98]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openPortfolioModal(p)}
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors cursor-pointer"
                          title="Düzenle"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Bu projeyi portföyden silmek istiyor musunuz?')) {
                              deletePortfolioProject(p.id);
                              showToast('Proje silindi.');
                            }
                          }}
                          className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SERVICES MANAGEMENT                               */}
        {/* ======================================================== */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <h2 className="text-xl font-bold text-white">Hizmetlerimiz & Modüller</h2>
                <p className="text-xs text-[#8a8f98] mt-1">
                  Ana sayfadaki "Kabiliyetler & Sistemler" bölümünde yayınlanan hizmet kartları.
                </p>
              </div>

              <button
                onClick={() => openServiceModal()}
                className="btn-linear-primary px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>Yeni Hizmet Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="linear-card rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs font-mono text-[#8a8f98]">
                      <span>#{srv.number}</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] text-white">
                        {srv.startingPrice}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{srv.title.tr}</h4>
                    <p className="text-xs text-[#8a8f98] mt-2 line-clamp-3">{srv.shortDesc.tr}</p>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1">
                      {srv.deliverables.tr.slice(0, 3).map((d, i) => (
                        <div key={i} className="text-[11px] text-[#8a8f98] flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-white/40" />
                          <span className="truncate">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-[#8a8f98] font-mono">{srv.duration.tr}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openServiceModal(srv)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Bu hizmeti silmek istiyor musunuz?')) {
                            deleteService(srv.id);
                            showToast('Hizmet silindi.');
                          }
                        }}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: APPOINTMENTS                                      */}
        {/* ======================================================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-bold text-white">Gelen Randevu Talepleri</h2>
              <p className="text-xs text-[#8a8f98] mt-1">
                Müşterilerin web sitesi üzerinden oluşturduğu randevular.
              </p>
            </div>

            <div className="linear-card rounded-2xl overflow-hidden border border-white/[0.08]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0a0b0e] text-[#8a8f98] font-mono border-b border-white/[0.08]">
                    <tr>
                      <th className="p-4">Takip Kodu</th>
                      <th className="p-4">Müşteri & Şirket</th>
                      <th className="p-4">İletişim</th>
                      <th className="p-4">Hizmet & Tarih</th>
                      <th className="p-4">Durum</th>
                      <th className="p-4 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-white/[0.02]">
                        <td className="p-4 font-mono font-semibold text-white">{apt.trackingCode}</td>
                        <td className="p-4">
                          <div className="font-semibold text-white">{apt.clientName}</div>
                          <div className="text-[11px] text-[#8a8f98]">{apt.companyName}</div>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-[#8a8f98]">
                          <div>{apt.email}</div>
                          <div>{apt.phone}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-white">{apt.serviceName}</div>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            {apt.date} · {apt.timeSlot} ({apt.meetingType})
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                                : apt.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/25'
                                : apt.status === 'completed'
                                ? 'bg-blue-500/10 text-blue-300 border border-blue-500/25'
                                : 'bg-red-500/10 text-red-300 border border-red-500/25'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {apt.status === 'pending' && (
                            <button
                              onClick={() => {
                                updateAppointmentStatus(apt.id, 'confirmed');
                                showToast('Randevu onaylandı!');
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer"
                            >
                              Onayla
                            </button>
                          )}
                          {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                updateAppointmentStatus(apt.id, 'completed');
                                showToast('Randevu tamamlandı!');
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/[0.04] text-white hover:bg-white/[0.1] border border-white/[0.08] cursor-pointer"
                            >
                              Tamamla
                            </button>
                          )}
                          {apt.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                updateAppointmentStatus(apt.id, 'cancelled');
                                showToast('Randevu iptal edildi.');
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
                            >
                              İptal
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: QUOTES                                            */}
        {/* ======================================================== */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-bold text-white">Teklif Talepleri & Proje Başvuruları</h2>
              <p className="text-xs text-[#8a8f98] mt-1">
                İnteraktif teklif sihirbazı üzerinden gönderilen müşteri talepleri.
              </p>
            </div>

            <div className="linear-card rounded-2xl overflow-hidden border border-white/[0.08]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0a0b0e] text-[#8a8f98] font-mono border-b border-white/[0.08]">
                    <tr>
                      <th className="p-4">Takip Kodu</th>
                      <th className="p-4">Müşteri</th>
                      <th className="p-4">Bütçe & Süre</th>
                      <th className="p-4">Açıklama</th>
                      <th className="p-4">Durum</th>
                      <th className="p-4 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {quotes.map((q) => (
                      <tr key={q.id} className="hover:bg-white/[0.02]">
                        <td className="p-4 font-mono font-semibold text-white">{q.trackingCode}</td>
                        <td className="p-4">
                          <div className="font-semibold text-white">{q.clientName}</div>
                          <div className="text-[11px] text-[#8a8f98]">{q.companyName}</div>
                          <div className="text-[10px] text-[#5c6068] font-mono">{q.email}</div>
                        </td>
                        <td className="p-4 font-mono">
                          <div className="text-emerald-400 font-semibold">{q.budgetRange}</div>
                          <div className="text-[11px] text-[#8a8f98]">{q.targetTimeline}</div>
                        </td>
                        <td className="p-4 max-w-xs">
                          <p className="text-zinc-300 line-clamp-2">{q.description}</p>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                              q.status === 'accepted'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : q.status === 'proposal_sent'
                                ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {q.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {q.status === 'pending' && (
                            <button
                              onClick={() => {
                                updateQuoteStatus(q.id, 'proposal_sent');
                                showToast('Teklif gönderildi olarak işaretlendi!');
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/30 cursor-pointer"
                            >
                              Teklif İletildi
                            </button>
                          )}
                          {q.status !== 'accepted' && (
                            <button
                              onClick={() => {
                                updateQuoteStatus(q.id, 'accepted');
                                showToast('Teklif onaylandı olarak işaretlendi!');
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 cursor-pointer"
                            >
                              Kabul Edildi
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: INVOICES                                          */}
        {/* ======================================================== */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <h2 className="text-xl font-bold text-white">Faturalar & Hakediş Ödemeleri</h2>
                <p className="text-xs text-[#8a8f98] mt-1">
                  Müşteri hakediş faturaları ve tahsilat takibi.
                </p>
              </div>

              <button
                onClick={() => {
                  const newInv = createInvoice({
                    clientName: currentProj?.clientName || 'Örnek Müşteri',
                    clientCompany: currentProj?.clientName || 'Örnek A.Ş.',
                    clientAddress: 'İstanbul, Türkiye',
                    clientEmail: currentProj?.clientEmail || 'muhasebe@sirket.com',
                    projectCode: currentProj?.projectCode,
                    items: [
                      {
                        description: `${currentProj?.title || 'Yazılım Geliştirme'} – Sprint Hakediş Bedeli`,
                        quantity: 1,
                        unitPrice: 50000,
                        total: 50000,
                      },
                    ],
                    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                  });
                  setActiveInvoiceModal(newInv);
                  showToast('Yeni fatura taslağı oluşturuldu!');
                }}
                className="btn-linear-primary px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>Hızlı Fatura Oluştur</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="linear-card rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-white">{inv.invoiceNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          inv.status === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {inv.status === 'paid' ? 'Ödendi' : 'Bekliyor'}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-white">{inv.clientCompany}</div>
                    <div className="text-xs text-[#8a8f98]">{inv.clientName}</div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono">
                      <span className="text-xs text-[#8a8f98]">Genel Toplam:</span>
                      <span className="text-base font-bold text-white">
                        ₺{inv.totalAmount.toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-[#5c6068] font-mono">Vade: {inv.dueDate}</span>
                    <div className="flex items-center gap-2">
                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => {
                            markInvoicePaid(inv.id);
                            showToast('Fatura ödendi olarak işaretlendi!');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold cursor-pointer"
                        >
                          Ödendi Yap
                        </button>
                      )}
                      <button
                        onClick={() => setActiveInvoiceModal(inv)}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.06] text-white hover:bg-white/[0.12] text-xs font-semibold cursor-pointer"
                      >
                        Görüntüle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: SETTINGS                                          */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl linear-card rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-bold text-white">Sistem & Kurumsal Parametreler</h2>
              <p className="text-xs text-[#8a8f98] mt-1">
                Şirket iletişim, banka IBAN bilgileri ve SLA garanti taahhütleri.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1.5 font-medium">Şirket Ünvanı</label>
                  <input
                    type="text"
                    value={settingsForm.companyName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1.5 font-medium">İletişim E-Posta</label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1.5 font-medium">Telefon</label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1.5 font-medium">Banka Adı</label>
                  <input
                    type="text"
                    value={settingsForm.bankName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1.5 font-medium">Kurumsal IBAN</label>
                <input
                  type="text"
                  value={settingsForm.bankIban}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bankIban: e.target.value })}
                  className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1.5 font-medium">Merkez Adres</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1.5 font-medium">SLA Uptime Taahhüdü (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settingsForm.slaUptimeGuaranteePercent}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, slaUptimeGuaranteePercent: Number(e.target.value) })
                    }
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white font-mono focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1.5 font-medium">Garanti Desteği (Ay)</label>
                  <input
                    type="number"
                    value={settingsForm.warrantyDurationMonths}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, warrantyDurationMonths: Number(e.target.value) })
                    }
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-linear-primary w-full py-3 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-4"
              >
                <Save className="w-4 h-4 text-black" />
                <span>Ayarları Kaydet</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD STAGE (AŞAMA EKLE)                            */}
      {/* ======================================================== */}
      {showAddStageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setShowAddStageModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b0c11] border border-white/[0.12] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Zaman Çizelgesine Yeni Aşama Ekle</span>
              </h3>
              <button
                onClick={() => setShowAddStageModal(false)}
                className="p-1.5 text-[#8a8f98] hover:text-white rounded-lg hover:bg-white/[0.08] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewStage} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">Aşama Başlığı (TR)</label>
                <input
                  type="text"
                  required
                  value={newStageTitleTr}
                  onChange={(e) => setNewStageTitleTr(e.target.value)}
                  placeholder="Örn: Güvenlik & Penetrasyon Testleri"
                  className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">Açıklama</label>
                <textarea
                  rows={3}
                  value={newStageDescTr}
                  onChange={(e) => setNewStageDescTr(e.target.value)}
                  placeholder="Bu aşamada yapılacak çalışmaların özeti..."
                  className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Beklenen Bitiş Tarihi</span>
                  </label>
                  <input
                    type="text"
                    value={newStageDueDate}
                    onChange={(e) => setNewStageDueDate(e.target.value)}
                    placeholder="Örn: 2026-11-20 veya 5. Hafta"
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Aşama Başlangıç Tarihi</label>
                  <input
                    type="text"
                    value={newStageStartDate}
                    onChange={(e) => setNewStageStartDate(e.target.value)}
                    placeholder="Örn: 2026-10-15"
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Konumlandırma</label>
                  <select
                    value={newStagePosition}
                    onChange={(e) => setNewStagePosition(e.target.value as 'end' | 'start')}
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="end">Zaman Çizelgesinin Sonuna Ekle</option>
                    <option value="start">En Başa Ekle</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-300">Başlangıç İlerlemesi:</span>
                    <span className="font-mono text-emerald-400 font-bold">%{newStageProgress}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newStageProgress}
                    onChange={(e) => setNewStageProgress(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer pt-2"
                  />
                </div>
              </div>

              {/* Completed Toggle for New Stage */}
              <div>
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newStageCompleted}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setNewStageCompleted(isChecked);
                      if (isChecked && !newStageCompletedDate) {
                        setNewStageCompletedDate(new Date().toISOString().split('T')[0]);
                        setNewStageProgress(100);
                      }
                    }}
                    className="rounded accent-emerald-400 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Bu Aşama Zaten Tamamlandı</span>
                    <span className="text-[10px] text-[#8a8f98]">
                      Tamamlandı olarak işaretlenirse fiili teslim tarihi kaydedilir.
                    </span>
                  </div>
                </label>
              </div>

              {newStageCompleted && (
                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fiili Tamamlanma Tarihi</span>
                  </label>
                  <input
                    type="text"
                    value={newStageCompletedDate}
                    onChange={(e) => setNewStageCompletedDate(e.target.value)}
                    placeholder="Örn: 2026-10-20"
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddStageModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.06] text-white hover:bg-white/[0.12] cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="btn-linear-primary px-5 py-2 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Aşamayı Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT STAGE & DATES (AŞAMA & TARİHLERİ DÜZENLE)     */}
      {/* ======================================================== */}
      {editingMilestone && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setEditingMilestone(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b0c11] border border-white/[0.12] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Aşama ve Tarihleri Düzenle
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingMilestone(null)}
                className="p-1.5 text-[#8a8f98] hover:text-white rounded-lg hover:bg-white/[0.08] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedMilestone} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">Aşama Başlığı (TR)</label>
                <input
                  type="text"
                  required
                  value={editStageTitleTr}
                  onChange={(e) => setEditStageTitleTr(e.target.value)}
                  className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">Açıklama</label>
                <textarea
                  rows={2}
                  value={editStageDescTr}
                  onChange={(e) => setEditStageDescTr(e.target.value)}
                  className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden"
                />
              </div>

              {/* Dates Grid: Beklenen Bitiş & Tamamlanma Tarihi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Beklenen Bitiş Tarihi</span>
                  </label>
                  <input
                    type="text"
                    value={editStageDueDate}
                    onChange={(e) => setEditStageDueDate(e.target.value)}
                    placeholder="Örn: 2026-10-25"
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tamamlanma Tarihi</span>
                  </label>
                  <input
                    type="text"
                    value={editStageCompletedDate}
                    onChange={(e) => setEditStageCompletedDate(e.target.value)}
                    placeholder="Örn: 2026-10-22"
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Aşama Başlangıç Tarihi</label>
                  <input
                    type="text"
                    value={editStageStartDate}
                    onChange={(e) => setEditStageStartDate(e.target.value)}
                    placeholder="Örn: 2026-09-16"
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-300">İlerleme:</span>
                    <span className="font-mono text-emerald-400 font-bold">%{editStageProgress}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editStageProgress}
                    onChange={(e) => setEditStageProgress(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer pt-2"
                  />
                </div>
              </div>

              {/* Completed Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer hover:bg-white/[0.05] transition-colors">
                  <input
                    type="checkbox"
                    checked={editStageCompleted}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setEditStageCompleted(isChecked);
                      if (isChecked && !editStageCompletedDate) {
                        setEditStageCompletedDate(new Date().toISOString().split('T')[0]);
                        setEditStageProgress(100);
                      }
                    }}
                    className="rounded accent-emerald-400 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Bu Aşama Tamamlandı Olarak İşaretlensin</span>
                    <span className="text-[10px] text-[#8a8f98]">
                      Seçildiğinde durum "Tamamlandı" olarak ayarlanır ve fiili tamamlanma tarihi sisteme işlenir.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.06] text-white hover:bg-white/[0.12] cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="btn-linear-primary px-5 py-2 text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5 text-black" />
                  <span>Kaydet & Veritabanına Yaz</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: NEW CLIENT PROJECT TRACKER                        */}
      {/* ======================================================== */}
      {showNewProjectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setShowNewProjectModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b0c11] border border-white/[0.12] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                <span>Yeni Müşteri Takip Projesi Oluştur</span>
              </h3>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="p-1.5 text-[#8a8f98] hover:text-white rounded-lg hover:bg-white/[0.08] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">Proje Başlığı</label>
                <input
                  type="text"
                  required
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="Örn: B2B Tedarik Zinciri ve Lojistik Paneli"
                  className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Müşteri Şirket / Kişi</label>
                  <input
                    type="text"
                    required
                    value={newProjClient}
                    onChange={(e) => setNewProjClient(e.target.value)}
                    placeholder="Örn: Atlas Lojistik A.Ş."
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Müşteri E-Posta</label>
                  <input
                    type="email"
                    value={newProjEmail}
                    onChange={(e) => setNewProjEmail(e.target.value)}
                    placeholder="muhasebe@atlas.com"
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Proje Kodu</label>
                  <input
                    type="text"
                    value={newProjCode}
                    onChange={(e) => setNewProjCode(e.target.value)}
                    placeholder="Örn: LOD-2026-04"
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Toplam Bütçe (₺)</label>
                  <input
                    type="number"
                    value={newProjBudget}
                    onChange={(e) => setNewProjBudget(e.target.value)}
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Hedef Teslim</label>
                  <input
                    type="date"
                    value={newProjDelivery}
                    onChange={(e) => setNewProjDelivery(e.target.value)}
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.06] text-white hover:bg-white/[0.12] cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="btn-linear-primary px-5 py-2 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Projeyi Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD/EDIT PORTFOLIO                                */}
      {/* ======================================================== */}
      {showPortfolioModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setShowPortfolioModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b0c11] border border-white/[0.12] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white">
                {editingPortfolioId ? 'Portföy Projesini Düzenle' : 'Yeni Portföy Projesi'}
              </h3>
              <button
                onClick={() => setShowPortfolioModal(false)}
                className="p-1.5 text-[#8a8f98] hover:text-white rounded-lg hover:bg-white/[0.08] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePortfolio} className="space-y-3.5">
              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">Proje Başlığı</label>
                <input
                  type="text"
                  required
                  value={portTitle}
                  onChange={(e) => setPortTitle(e.target.value)}
                  placeholder="Örn: Paycore – Çoklu Para Birimli Ödeme Ağ Geçidi"
                  className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Müşteri Adı</label>
                  <input
                    type="text"
                    required
                    value={portClient}
                    onChange={(e) => setPortClient(e.target.value)}
                    placeholder="Örn: Paycore Financial Ltd."
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Kategori</label>
                  <select
                    value={portCategory}
                    onChange={(e) => setPortCategory(e.target.value as ServiceCategory)}
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden"
                  >
                    <option value="web">Web & Bulut Platformu</option>
                    <option value="mobile">Mobil Uygulama</option>
                    <option value="enterprise">Kurumsal Yazılım / ERP</option>
                    <option value="ai">Yapay Zeka & Veri</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">Görsel URL</label>
                <input
                  type="url"
                  required
                  value={portImage}
                  onChange={(e) => setPortImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">Özet Açıklama</label>
                <textarea
                  rows={2}
                  value={portSummaryTr}
                  onChange={(e) => setPortSummaryTr(e.target.value)}
                  placeholder="Kart üzerinde gösterilecek kısa açıklama..."
                  className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Teknoloji Yığını (Virgülle)</label>
                  <input
                    type="text"
                    value={portTechs}
                    onChange={(e) => setPortTechs(e.target.value)}
                    placeholder="Next.js, TypeScript, PostgreSQL"
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Canlı Demo URL (Varsa)</label>
                  <input
                    type="url"
                    value={portDemoUrl}
                    onChange={(e) => setPortDemoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPortfolioModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.06] text-white hover:bg-white/[0.12] cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="btn-linear-primary px-5 py-2 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD/EDIT SERVICE                                  */}
      {/* ======================================================== */}
      {showServiceModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setShowServiceModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b0c11] border border-white/[0.12] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white">
                {editingServiceId ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
              </h3>
              <button
                onClick={() => setShowServiceModal(false)}
                className="p-1.5 text-[#8a8f98] hover:text-white rounded-lg hover:bg-white/[0.08] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Hizmet No</label>
                  <input
                    type="text"
                    required
                    value={srvNumber}
                    onChange={(e) => setSrvNumber(e.target.value)}
                    placeholder="07"
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Kategori</label>
                  <select
                    value={srvCategory}
                    onChange={(e) => setSrvCategory(e.target.value as ServiceCategory)}
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden"
                  >
                    <option value="web">Web & Bulut</option>
                    <option value="mobile">Mobil Uygulama</option>
                    <option value="enterprise">Kurumsal / ERP</option>
                    <option value="ai">Yapay Zeka</option>
                    <option value="cloud">DevOps & Güvenlik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">Hizmet Başlığı</label>
                <input
                  type="text"
                  required
                  value={srvTitleTr}
                  onChange={(e) => setSrvTitleTr(e.target.value)}
                  placeholder="Örn: Siber Güvenlik & Penetrasyon Testleri"
                  className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Başlangıç Fiyatı</label>
                  <input
                    type="text"
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(e.target.value)}
                    placeholder="₺50.000"
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1 font-medium">Tahmini Süre</label>
                  <input
                    type="text"
                    value={srvDuration}
                    onChange={(e) => setSrvDuration(e.target.value)}
                    placeholder="3 - 6 Hafta"
                    className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">Kısa Açıklama</label>
                <textarea
                  rows={2}
                  value={srvShortDesc}
                  onChange={(e) => setSrvShortDesc(e.target.value)}
                  placeholder="Hizmet kartında listelenecek açıklama..."
                  className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1 font-medium">
                  Çıktılar & Teslimatlar (Her satıra bir madde)
                </label>
                <textarea
                  rows={3}
                  value={srvDeliverables}
                  onChange={(e) => setSrvDeliverables(e.target.value)}
                  className="w-full bg-[#050506] border border-white/[0.1] rounded-xl p-2.5 text-xs text-white focus:outline-hidden font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.06] text-white hover:bg-white/[0.12] cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="btn-linear-primary px-5 py-2 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
