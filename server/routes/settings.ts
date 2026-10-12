import { Router, Request, Response } from 'express';
import { readDb, writeDb } from '../db';
import { INITIAL_SYSTEM_SETTINGS } from '../../src/data/initialData';

export const settingsRouter = Router();

// GET settings
settingsRouter.get('/', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.settings);
});

// PUT update settings
settingsRouter.put('/', (req: Request, res: Response) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json(db.settings);
});

// POST reset settings to factory defaults
settingsRouter.post('/reset', (_req: Request, res: Response) => {
  const db = readDb();
  db.settings = INITIAL_SYSTEM_SETTINGS;
  writeDb(db);
  res.json(db.settings);
});
