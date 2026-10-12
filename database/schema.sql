-- ==========================================================
-- Lodonsoft Enterprise Platform - PostgreSQL Database Schema
-- Version: 2.0.0 (PostgreSQL 14+)
-- ==========================================================

-- 1. TRACKED CLIENT PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    project_code VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    lead_architect VARCHAR(255) DEFAULT 'Kaan Demir (Principal Tech Lead)',
    total_budget NUMERIC(12, 2) DEFAULT 100000.00,
    paid_amount NUMERIC(12, 2) DEFAULT 0.00,
    overall_progress INTEGER DEFAULT 10,
    current_stage VARCHAR(64) DEFAULT 'discovery',
    current_stage_name VARCHAR(255) DEFAULT 'Keşif & Kapsam Analizi',
    start_date DATE DEFAULT CURRENT_DATE,
    estimated_delivery_date DATE,
    staging_url VARCHAR(512),
    repository_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROJECT MILESTONES (STAGES / TIMELINE) TABLE
CREATE TABLE IF NOT EXISTS project_milestones (
    id VARCHAR(64) PRIMARY KEY,
    project_code VARCHAR(32) NOT NULL REFERENCES projects(project_code) ON DELETE CASCADE,
    stage VARCHAR(64) NOT NULL,
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_tr TEXT,
    description_en TEXT,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    due_date VARCHAR(64), -- Beklenen bitiş tarihi
    completed_date VARCHAR(64), -- Tamamlanma tarihi (fiili teslim)
    start_date VARCHAR(64), -- Aşama başlangıç tarihi
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_milestones_project_code ON project_milestones(project_code, sort_order);

-- 3. SPRINT TASKS TABLE
CREATE TABLE IF NOT EXISTS sprint_tasks (
    id VARCHAR(64) PRIMARY KEY,
    project_code VARCHAR(32) NOT NULL REFERENCES projects(project_code) ON DELETE CASCADE,
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    status VARCHAR(32) DEFAULT 'planned', -- 'planned', 'in_progress', 'done'
    assignee VARCHAR(128) DEFAULT 'Geliştirici Ekip',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sprint_tasks_project ON sprint_tasks(project_code);

-- 4. PROJECT LIVE ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS project_activities (
    id VARCHAR(64) PRIMARY KEY,
    project_code VARCHAR(32) NOT NULL REFERENCES projects(project_code) ON DELETE CASCADE,
    timestamp_label VARCHAR(64) DEFAULT 'Bugün',
    actor VARCHAR(128) DEFAULT 'Lodonsoft Ekibi',
    action_tr TEXT NOT NULL,
    action_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_project_activities ON project_activities(project_code, created_at DESC);

-- 5. PORTFOLIO SHOWCASE PROJECTS TABLE
CREATE TABLE IF NOT EXISTS portfolio_projects (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    client VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'web', 'mobile', 'cloud', 'enterprise', 'ai'
    category_label_tr VARCHAR(128),
    category_label_en VARCHAR(128),
    image VARCHAR(512) NOT NULL,
    year VARCHAR(16) DEFAULT '2026',
    summary_tr TEXT NOT NULL,
    summary_en TEXT,
    metrics_tr VARCHAR(255),
    metrics_en VARCHAR(255),
    technologies JSONB DEFAULT '[]'::jsonb,
    demo_url VARCHAR(512),
    case_study_tr TEXT,
    case_study_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SERVICES & CAPABILITIES TABLE
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(64) PRIMARY KEY,
    number VARCHAR(16) NOT NULL,
    category VARCHAR(64) NOT NULL,
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    starting_price VARCHAR(64) DEFAULT '₺50.000',
    duration_tr VARCHAR(64) DEFAULT '3 - 6 Hafta',
    duration_en VARCHAR(64) DEFAULT '3 - 6 Weeks',
    short_desc_tr TEXT NOT NULL,
    short_desc_en TEXT,
    long_desc_tr TEXT,
    long_desc_en TEXT,
    deliverables_tr JSONB DEFAULT '[]'::jsonb,
    deliverables_en JSONB DEFAULT '[]'::jsonb,
    technologies JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. APPOINTMENTS (BOOKINGS) TABLE
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(64) PRIMARY KEY,
    tracking_code VARCHAR(32) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64),
    service_id VARCHAR(64),
    service_name VARCHAR(255),
    date DATE NOT NULL,
    time_slot VARCHAR(32) NOT NULL,
    meeting_type VARCHAR(32) DEFAULT 'google_meet', -- 'google_meet', 'zoom', 'office'
    notes TEXT,
    status VARCHAR(32) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_tracking ON appointments(tracking_code);

-- 8. QUOTE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS quotes (
    id VARCHAR(64) PRIMARY KEY,
    tracking_code VARCHAR(32) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64),
    selected_services JSONB DEFAULT '[]'::jsonb,
    budget_range VARCHAR(64),
    target_timeline VARCHAR(64),
    features JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    status VARCHAR(32) DEFAULT 'pending', -- 'pending', 'proposal_sent', 'accepted', 'declined'
    estimated_cost VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quotes_tracking ON quotes(tracking_code);

-- 9. INVOICES & BILLING TABLE
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(64) PRIMARY KEY,
    invoice_number VARCHAR(64) UNIQUE NOT NULL,
    project_code VARCHAR(32),
    client_name VARCHAR(255) NOT NULL,
    client_company VARCHAR(255) NOT NULL,
    client_tax_no VARCHAR(64),
    client_address TEXT,
    client_email VARCHAR(255),
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12, 2) DEFAULT 0.00,
    tax_rate NUMERIC(5, 2) DEFAULT 20.00,
    tax_amount NUMERIC(12, 2) DEFAULT 0.00,
    total_amount NUMERIC(12, 2) DEFAULT 0.00,
    status VARCHAR(32) DEFAULT 'pending', -- 'pending', 'paid', 'overdue', 'cancelled'
    payment_method VARCHAR(64),
    paid_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);

-- 10. TESTIMONIALS & REVIEWS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(64) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(128) DEFAULT 'Kurucu / CTO',
    industry_tr VARCHAR(128),
    industry_en VARCHAR(128),
    project_delivered_tr VARCHAR(255),
    project_delivered_en VARCHAR(255),
    metric_highlight_tr VARCHAR(255),
    metric_highlight_en VARCHAR(255),
    quote_tr TEXT NOT NULL,
    quote_en TEXT,
    outcome_tr TEXT,
    outcome_en TEXT,
    rating INTEGER DEFAULT 5,
    source VARCHAR(32) DEFAULT 'google', -- 'google', 'client_survey', 'direct'
    avatar VARCHAR(512),
    google_review_url VARCHAR(512),
    status VARCHAR(32) DEFAULT 'approved', -- 'approved', 'pending', 'hidden'
    verified_date VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. SYSTEM SETTINGS TABLE (SINGLE ROW / CONFIG)
CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    company_name VARCHAR(255) DEFAULT 'Lodonsoft Yazılım & Teknoloji A.Ş.',
    legal_entity_name VARCHAR(255) DEFAULT 'Lodonsoft Bilişim Hizmetleri San. ve Tic. A.Ş.',
    tax_number VARCHAR(64) DEFAULT '8840291122',
    tax_office VARCHAR(128) DEFAULT 'Zincirlikuyu Vergi Dairesi',
    support_email VARCHAR(255) DEFAULT 'destek@lodonsoft.com',
    billing_email VARCHAR(255) DEFAULT 'fatura@lodonsoft.com',
    contact_email VARCHAR(255) DEFAULT 'iletisim@lodonsoft.com',
    phone VARCHAR(64) DEFAULT '+90 (212) 840 20 40',
    contact_phone VARCHAR(64) DEFAULT '+90 (212) 840 20 40',
    whatsapp_number VARCHAR(64) DEFAULT '+90 532 990 80 70',
    address TEXT DEFAULT 'Levent 199, Büyükdere Cad. No:199, Şişli / İstanbul',
    bank_name VARCHAR(128) DEFAULT 'Garanti BBVA',
    bank_iban VARCHAR(64) DEFAULT 'TR33 0006 2000 0001 2000 3456 78',
    sla_uptime_guarantee_percent NUMERIC(5, 2) DEFAULT 99.90,
    warranty_duration_months INTEGER DEFAULT 6,
    ip_transfer_clause_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. PROJECT CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(64) PRIMARY KEY,
    project_code VARCHAR(32) NOT NULL,
    sender VARCHAR(32) NOT NULL, -- 'client', 'team'
    sender_name VARCHAR(128) NOT NULL,
    sender_role VARCHAR(128),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_project ON chat_messages(project_code, created_at ASC);
