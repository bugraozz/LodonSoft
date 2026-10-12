export type Language = 'tr' | 'en';
export type Theme = 'dark' | 'light';

export type ServiceCategory = 'web' | 'mobile' | 'cloud' | 'enterprise' | 'uiux' | 'ai';

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  number: string;
  title: { tr: string; en: string };
  shortDesc: { tr: string; en: string };
  longDesc: { tr: string; en: string };
  deliverables: { tr: string[]; en: string[] };
  technologies: string[];
  startingPrice: string;
  duration: { tr: string; en: string };
}

export interface ProjectItem {
  id: string;
  title: string;
  client: string;
  category: ServiceCategory;
  categoryLabel: { tr: string; en: string };
  image: string;
  summary: { tr: string; en: string };
  metrics: { tr: string; en: string };
  technologies: string[];
  year: string;
  demoUrl?: string;
  caseStudy: { tr: string; en: string };
}

export interface ProcessStep {
  step: string;
  title: { tr: string; en: string };
  description: { tr: string; en: string };
  duration: { tr: string; en: string };
  deliverables: { tr: string[]; en: string[] };
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  trackingCode: string;
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
  status: AppointmentStatus;
  createdAt: string;
}

export type QuoteStatus = 'pending' | 'reviewed' | 'proposal_sent' | 'accepted' | 'declined';

export interface QuoteRequest {
  id: string;
  trackingCode: string;
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  selectedServices: string[];
  budgetRange: string;
  targetTimeline: string;
  features: string[];
  description: string;
  status: QuoteStatus;
  estimatedCost?: string;
  createdAt: string;
  proposalBasePrice?: number;
  proposalCashDiscountPercent?: number;
  proposalDiscountAmount?: number;
  proposalTaxRate?: number;
  proposalTaxAmount?: number;
  proposalTotalWithTax?: number;
  proposalDepositPercent?: number;
  proposalDepositAmount?: number;
  proposalPaymentTerms?: 'milestone' | 'cash';
  proposalNotes?: string;
}

export type ProjectStage = 'discovery' | 'design' | 'development' | 'testing' | 'deployment' | 'completed' | (string & {});

export interface ProjectMilestone {
  id: string;
  stage: ProjectStage;
  title: { tr: string; en: string };
  description: { tr: string; en: string };
  progress: number;
  completed: boolean;
  dueDate: string; // Beklenen bitiş tarihi
  completedDate?: string; // Tamamlanma tarihi (fiili teslim)
  startDate?: string; // Aşama başlangıç tarihi
}

export interface SprintTask {
  id: string;
  title: { tr: string; en: string };
  status: 'done' | 'in_progress' | 'planned';
  assignee: string;
}

export interface ProjectActivity {
  id: string;
  timestamp: string;
  actor: string;
  action: { tr: string; en: string };
}

export interface ProjectTracker {
  id: string;
  projectCode: string;
  title: string;
  clientName: string;
  clientEmail: string;
  leadArchitect: string;
  totalBudget: number;
  paidAmount: number;
  overallProgress: number;
  currentStage: ProjectStage;
  currentStageName?: string;
  startDate: string;
  estimatedDeliveryDate: string;
  milestones: ProjectMilestone[];
  sprintTasks: SprintTask[];
  activities: ProjectActivity[];
  stagingUrl?: string;
  repositoryUrl?: string;
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectCode?: string;
  clientName: string;
  clientCompany: string;
  clientTaxNo?: string;
  clientAddress: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // e.g. 20 for 20%
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  paidAt?: string;
}

export interface ChatMessage {
  id: string;
  projectCode: string;
  sender: 'client' | 'team';
  senderName: string;
  senderRole?: string;
  message: string;
  timestamp: string;
  attachmentName?: string;
}

export interface SurveyRatings {
  speed: number; // 1-5
  quality: number; // 1-5
  communication: number; // 1-5
  npsScore: number; // 1-10
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  role: { tr: string; en: string };
  company: string;
  industry: { tr: string; en: string };
  projectDelivered: { tr: string; en: string };
  metricHighlight: { tr: string; en: string };
  quote: { tr: string; en: string };
  outcome: { tr: string; en: string };
  verifiedDate: string;
  source?: 'google' | 'client_survey' | 'direct';
  rating?: number; // 1 to 5 stars
  avatar?: string;
  googleReviewUrl?: string;
  status?: 'approved' | 'pending' | 'hidden';
  projectCode?: string;
  surveyRatings?: SurveyRatings;
}

export interface SystemSettings {
  // Company & Legal
  companyName: string;
  legalEntityName: string;
  taxNumber: string;
  taxOffice: string;
  crNumber?: string; // Ticaret Sicil No
  mersisNumber?: string; // MERSİS No
  supportEmail: string;
  billingEmail: string;
  contactEmail?: string;
  phone: string;
  contactPhone?: string;
  whatsappNumber: string;
  address: string;
  establishedYear: string;
  bankName?: string;
  bankIban?: string;

  // Finance, Rate Cards & Pricing Multipliers
  defaultCurrency: 'TRY' | 'USD' | 'EUR' | 'GBP';
  defaultTaxRate: number; // e.g. 20
  baseHourlyRate: number; // e.g. 2500
  minimumProjectBudget: number; // e.g. 75000
  minimumDepositPercent: number; // e.g. 35 (%)
  techLeadHourlyRate: number; // e.g. 3500
  seniorDevHourlyRate: number; // e.g. 2500
  uiuxLeadHourlyRate: number; // e.g. 2200
  rushDeliveryMultiplier: number; // e.g. 1.5 (+50%)
  mvpComplexityMultiplier: number; // e.g. 0.8 (-20%)
  enterpriseMultiplier: number; // e.g. 1.8 (+80%)
  cashPaymentDiscountPercent: number; // e.g. 10 (%)

  // Engineering & Delivery SLA
  defaultSprintDurationWeeks: number; // 1 or 2
  warrantyDurationMonths: number; // 6 or 12
  guaranteedSlaResponseHours: number; // 2 or 4
  autoDeployStaging: boolean;
  strictCodeReviewEnforced: boolean;
  backupFrequencyHours: number; // 24

  // Cloud Altyapı, DevOps & Sunucu
  primaryCloudProvider: 'gcp' | 'aws' | 'hetzner' | 'cloudflare' | 'vercel' | 'digitalocean';
  serverRegion: string; // e.g. 'europe-west3 (Frankfurt)'
  ddosProtectionLevel: 'balanced' | 'aggressive' | 'under_attack';
  deploymentStrategy: 'blue_green' | 'rolling' | 'canary';
  autoSslRenewal: boolean;
  sentryDsn: string;
  logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  customDomain?: string;
  lastDeploymentTime?: string;
  deploymentEnvironment?: 'production' | 'staging';

  // SMS Entegrasyonu & Müşteri Bildirimleri
  smsProvider: 'netgsm' | 'iletimerkezi' | 'twilio' | 'mutlucell' | 'verimor';
  smsApiUser: string;
  smsApiKey: string;
  smsSenderId: string; // Originator (e.g. LODONSOFT)
  smsBalance: number; // e.g. 4850
  smsEnabled: boolean;
  smsNotifyPaymentReminder: boolean;
  smsNotifyProjectUpdate: boolean;
  smsNotifyNewQuote: boolean;
  smsNotifyAppointmentReminder: boolean;
  smsAppointmentReminderHours: number; // e.g. 2
  smsPaymentTemplate: string;
  smsProjectUpdateTemplate: string;
  smsQuoteTemplate: string;
  smsAppointmentTemplate: string;

  // Integrations & API Hub
  googleMapsCid: string;
  googlePlacesApiKey: string;
  autoSyncGoogleReviews: boolean;
  syncFrequencyHours: number;
  slackWebhookUrl: string;
  discordWebhookUrl: string;
  notifyOnNewAppointment: boolean;
  notifyOnNewQuote: boolean;
  notifyOnPaymentReceived: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpSenderName: string;
  paymentGatewayMode: 'test' | 'live';
  enforce3dSecure: boolean;

  // Otomasyon & İş Akışı Kuralları
  autoSendWelcomeEmail: boolean;
  appointmentReminderHours: number; // e.g. 24
  quoteFollowUpDays: number; // e.g. 3
  invoiceOverdueWarningDays: number; // e.g. 1
  whatsappAutoResponder: boolean;
  whatsappTemplateTr: string;
  autoSurveyRequestOnCompletion: boolean;

  // Global SEO & Analitik İzleme Hub
  siteMetaTitleTr: string;
  siteMetaTitleEn: string;
  siteMetaDescriptionTr: string;
  siteMetaDescriptionEn: string;
  googleAnalyticsId: string;
  metaPixelId: string;
  ogImageUrl: string;
  enableStructuredData: boolean;

  // Hukuki Standartlar, KVKK & Sözleşme Şartları
  requireNdaBeforeDiscovery: boolean;
  ipTransferClauseEnabled: boolean;
  gdprDataRetentionMonths: number;
  slaUptimeGuaranteePercent: number;

  // Web Sitesi Hukuki Metinleri (Footer & Sözleşmeler)
  privacyPolicyContent: string;
  termsOfServiceContent: string;
  kvkkTextContent: string;
  legalLastUpdated: string;

  // Security & Portal Access
  maintenanceMode: boolean;
  maintenanceMessage: string;
  requireTwoFactorAuth: boolean;
  sessionTimeoutMinutes: number;
  allowClientInvoiceDownload: boolean;
  allowClientDirectChat: boolean;
  hideInternalTasksFromClient: boolean;
}

export interface SystemHealthStatus {
  apiLatencyMs: number;
  dbLatencyMs: number;
  uptimePercent: number;
  edgeCacheHitRatio: number;
  activeWebhookQueue: number;
  sslValidUntil: string;
  lastBackupTime: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  category: 'system' | 'security' | 'billing' | 'content' | 'project';
  actor: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'info';
  details?: string;
}
