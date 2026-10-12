import { Router, Request, Response } from 'express';
import { readDb, writeDb } from '../db';

export const portfolioRouter = Router();

// GET all portfolio projects
portfolioRouter.get('/', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.portfolio);
});

// POST create portfolio project
portfolioRouter.post('/', (req: Request, res: Response) => {
  const db = readDb();
  const newProj = {
    id: 'proj-' + Date.now(),
    ...req.body,
  };
  db.portfolio.unshift(newProj);
  writeDb(db);
  res.status(201).json(newProj);
});

// PUT update portfolio project
portfolioRouter.put('/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.portfolio.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Portföy projesi bulunamadı' });
    return;
  }
  db.portfolio[idx] = { ...db.portfolio[idx], ...req.body };
  writeDb(db);
  res.json(db.portfolio[idx]);
});

// DELETE portfolio project
portfolioRouter.delete('/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.portfolio.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Portföy projesi bulunamadı' });
    return;
  }
  const deleted = db.portfolio.splice(idx, 1);
  writeDb(db);
  res.json({ success: true, deleted: deleted[0] });
});
