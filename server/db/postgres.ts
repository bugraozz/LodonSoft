import { Pool, PoolConfig } from 'pg';
import { readDb, writeDb, DatabaseSchema } from '../db';

// Global pool cache across hot-reloads
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

export function isPostgresConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL ||
    (process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE) ||
    (process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_DB_NAME)
  );
}

export function getPostgresPool(): Pool | null {
  if (!isPostgresConfigured()) {
    return null;
  }

  if (global._pgPool) {
    return global._pgPool;
  }

  const poolConfig: PoolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
        max: 10,
        connectionTimeoutMillis: 10000,
      }
    : {
        host: process.env.PGHOST || process.env.SQL_HOST || 'localhost',
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER || process.env.SQL_USER || 'postgres',
        password: process.env.PGPASSWORD || process.env.SQL_PASSWORD || '',
        database: process.env.PGDATABASE || process.env.SQL_DB_NAME || 'lodonsoft_db',
        ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
        max: 10,
        connectionTimeoutMillis: 10000,
      };

  try {
    global._pgPool = new Pool(poolConfig);
    global._pgPool.on('error', (err) => {
      console.warn('[PostgreSQL Pool Warning]:', err.message);
    });
    return global._pgPool;
  } catch (err) {
    console.warn('[PostgreSQL Init Warning]: Could not create pool, using fallback store.', err);
    return null;
  }
}

// Automatically create tables if PostgreSQL is live
export async function initPostgresTables(): Promise<boolean> {
  const pool = getPostgresPool();
  if (!pool) return false;

  try {
    const client = await pool.connect();
    try {
      await client.query(`
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
          milestones JSONB DEFAULT '[]'::jsonb,
          sprint_tasks JSONB DEFAULT '[]'::jsonb,
          activities JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS portfolio_projects (
          id VARCHAR(64) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          client VARCHAR(255) NOT NULL,
          category VARCHAR(64) NOT NULL,
          image VARCHAR(512) NOT NULL,
          year VARCHAR(16) DEFAULT '2026',
          summary JSONB NOT NULL,
          metrics JSONB,
          technologies JSONB DEFAULT '[]'::jsonb,
          demo_url VARCHAR(512),
          case_study JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS services (
          id VARCHAR(64) PRIMARY KEY,
          number VARCHAR(16) NOT NULL,
          category VARCHAR(64) NOT NULL,
          title JSONB NOT NULL,
          starting_price VARCHAR(64) DEFAULT '₺50.000',
          duration JSONB NOT NULL,
          short_desc JSONB NOT NULL,
          long_desc JSONB,
          deliverables JSONB DEFAULT '[]'::jsonb,
          technologies JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS appointments (
          id VARCHAR(64) PRIMARY KEY,
          tracking_code VARCHAR(32) UNIQUE NOT NULL,
          client_name VARCHAR(255) NOT NULL,
          company_name VARCHAR(255),
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(64),
          service_id VARCHAR(64),
          service_name VARCHAR(255),
          date VARCHAR(32) NOT NULL,
          time_slot VARCHAR(32) NOT NULL,
          meeting_type VARCHAR(32) DEFAULT 'google_meet',
          notes TEXT,
          status VARCHAR(32) DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

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
          status VARCHAR(32) DEFAULT 'pending',
          estimated_cost VARCHAR(64),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS invoices (
          id VARCHAR(64) PRIMARY KEY,
          invoice_number VARCHAR(64) UNIQUE NOT NULL,
          project_code VARCHAR(32),
          client_name VARCHAR(255) NOT NULL,
          client_company VARCHAR(255) NOT NULL,
          client_tax_no VARCHAR(64),
          client_address TEXT,
          client_email VARCHAR(255),
          issue_date VARCHAR(32),
          due_date VARCHAR(32),
          items JSONB DEFAULT '[]'::jsonb,
          subtotal NUMERIC(12, 2) DEFAULT 0.00,
          tax_rate NUMERIC(5, 2) DEFAULT 20.00,
          tax_amount NUMERIC(12, 2) DEFAULT 0.00,
          total_amount NUMERIC(12, 2) DEFAULT 0.00,
          status VARCHAR(32) DEFAULT 'pending',
          payment_method VARCHAR(64),
          paid_at VARCHAR(32),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS system_settings (
          id INTEGER PRIMARY KEY DEFAULT 1,
          data JSONB NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS testimonials (
          id VARCHAR(64) PRIMARY KEY,
          client_name VARCHAR(255) NOT NULL,
          company VARCHAR(255) NOT NULL,
          role VARCHAR(128),
          rating INTEGER DEFAULT 5,
          source VARCHAR(32) DEFAULT 'google',
          status VARCHAR(32) DEFAULT 'approved',
          data JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS chat_messages (
          id VARCHAR(64) PRIMARY KEY,
          project_code VARCHAR(32) NOT NULL,
          sender VARCHAR(32) NOT NULL,
          sender_name VARCHAR(128) NOT NULL,
          sender_role VARCHAR(128),
          message TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('[PostgreSQL] Database tables initialized successfully.');
      return true;
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn('[PostgreSQL Connection Note]:', err.message);
    return false;
  }
}

// ==========================================================
// UNIFIED DATA ACCESS LAYER (POSTGRESQL WITH AUTO-FALLBACK)
// ==========================================================

export async function dbGetProjects(): Promise<any[]> {
  const pool = getPostgresPool();
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
      if (res.rows.length > 0) {
        return res.rows.map((row) => ({
          ...row,
          projectCode: row.project_code,
          clientName: row.client_name,
          clientEmail: row.client_email,
          leadArchitect: row.lead_architect,
          totalBudget: Number(row.total_budget),
          paidAmount: Number(row.paid_amount),
          overallProgress: Number(row.overall_progress),
          currentStage: row.current_stage,
          currentStageName: row.current_stage_name,
          startDate: row.start_date,
          estimatedDeliveryDate: row.estimated_delivery_date,
          stagingUrl: row.staging_url,
          repositoryUrl: row.repository_url,
          milestones: row.milestones || [],
          sprintTasks: row.sprint_tasks || [],
          activities: row.activities || [],
        }));
      }
    } catch {
      // Fallback
    }
  }
  return readDb().projects;
}

export async function dbSaveProject(project: any): Promise<any> {
  const pool = getPostgresPool();
  if (pool) {
    try {
      await pool.query(
        `INSERT INTO projects (
          id, project_code, title, client_name, client_email, lead_architect,
          total_budget, paid_amount, overall_progress, current_stage, current_stage_name,
          start_date, estimated_delivery_date, staging_url, repository_url,
          milestones, sprint_tasks, activities
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          client_name = EXCLUDED.client_name,
          client_email = EXCLUDED.client_email,
          total_budget = EXCLUDED.total_budget,
          paid_amount = EXCLUDED.paid_amount,
          overall_progress = EXCLUDED.overall_progress,
          current_stage = EXCLUDED.current_stage,
          current_stage_name = EXCLUDED.current_stage_name,
          estimated_delivery_date = EXCLUDED.estimated_delivery_date,
          milestones = EXCLUDED.milestones,
          sprint_tasks = EXCLUDED.sprint_tasks,
          activities = EXCLUDED.activities`,
        [
          project.id,
          project.projectCode,
          project.title,
          project.clientName,
          project.clientEmail || null,
          project.leadArchitect || 'Kaan Demir',
          project.totalBudget || 100000,
          project.paidAmount || 0,
          project.overallProgress || 10,
          project.currentStage || 'discovery',
          project.currentStageName || 'Keşif & Kapsam Analizi',
          project.startDate || new Date().toISOString().split('T')[0],
          project.estimatedDeliveryDate || null,
          project.stagingUrl || null,
          project.repositoryUrl || null,
          JSON.stringify(project.milestones || []),
          JSON.stringify(project.sprintTasks || []),
          JSON.stringify(project.activities || []),
        ]
      );
    } catch (err) {
      console.warn('[PostgreSQL Query Error]:', err);
    }
  }

  // Also sync persistent store
  const db = readDb();
  const idx = db.projects.findIndex((p) => p.id === project.id || p.projectCode === project.projectCode);
  if (idx !== -1) {
    db.projects[idx] = { ...db.projects[idx], ...project };
  } else {
    db.projects.unshift(project);
  }
  writeDb(db);
  return project;
}

export async function dbDeleteProject(codeOrId: string): Promise<boolean> {
  const pool = getPostgresPool();
  if (pool) {
    try {
      await pool.query('DELETE FROM projects WHERE id = $1 OR project_code = $1', [codeOrId]);
    } catch {
      // Fallback
    }
  }

  const db = readDb();
  const idx = db.projects.findIndex((p) => p.id === codeOrId || p.projectCode === codeOrId);
  if (idx !== -1) {
    db.projects.splice(idx, 1);
    writeDb(db);
    return true;
  }
  return false;
}
