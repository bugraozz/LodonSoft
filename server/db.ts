import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  INITIAL_PROJECT_TRACKERS,
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
  INITIAL_APPOINTMENTS,
  INITIAL_QUOTES,
  INITIAL_INVOICES,
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_TESTIMONIALS,
  INITIAL_CHAT_MESSAGES,
} from '../src/data/initialData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root path
const ROOT_DIR = path.resolve(__dirname, '..');
export const DB_FILE = path.resolve(ROOT_DIR, 'data', 'db.json');

export interface DatabaseSchema {
  projects: any[];
  portfolio: any[];
  services: any[];
  appointments: any[];
  quotes: any[];
  invoices: any[];
  testimonials: any[];
  settings: any;
  chatMessages: any[];
}

export function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseSchema = {
        projects: INITIAL_PROJECT_TRACKERS,
        portfolio: INITIAL_PROJECTS,
        services: INITIAL_SERVICES,
        appointments: INITIAL_APPOINTMENTS,
        quotes: INITIAL_QUOTES,
        invoices: INITIAL_INVOICES,
        testimonials: INITIAL_TESTIMONIALS,
        settings: INITIAL_SYSTEM_SETTINGS,
        chatMessages: INITIAL_CHAT_MESSAGES,
      };
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // Ensure all collections exist
    return {
      projects: parsed.projects || INITIAL_PROJECT_TRACKERS,
      portfolio: parsed.portfolio || INITIAL_PROJECTS,
      services: parsed.services || INITIAL_SERVICES,
      appointments: parsed.appointments || INITIAL_APPOINTMENTS,
      quotes: parsed.quotes || INITIAL_QUOTES,
      invoices: parsed.invoices || INITIAL_INVOICES,
      testimonials: parsed.testimonials || INITIAL_TESTIMONIALS,
      settings: parsed.settings || INITIAL_SYSTEM_SETTINGS,
      chatMessages: parsed.chatMessages || INITIAL_CHAT_MESSAGES,
    };
  } catch (err) {
    console.error('[DB] Error reading db.json, returning seeded default:', err);
    return {
      projects: INITIAL_PROJECT_TRACKERS,
      portfolio: INITIAL_PROJECTS,
      services: INITIAL_SERVICES,
      appointments: INITIAL_APPOINTMENTS,
      quotes: INITIAL_QUOTES,
      invoices: INITIAL_INVOICES,
      testimonials: INITIAL_TESTIMONIALS,
      settings: INITIAL_SYSTEM_SETTINGS,
      chatMessages: INITIAL_CHAT_MESSAGES,
    };
  }
}

export function writeDb(data: DatabaseSchema): void {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error writing to db.json:', err);
  }
}
