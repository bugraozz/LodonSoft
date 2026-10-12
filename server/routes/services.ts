import { Router, Request, Response } from 'express';
import { readDb, writeDb } from '../db';

export const servicesRouter = Router();

// GET all services
servicesRouter.get('/', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.services);
});

// POST create service
servicesRouter.post('/', (req: Request, res: Response) => {
  const db = readDb();
  const newService = {
    id: 'srv-' + Date.now(),
    ...req.body,
  };
  db.services.push(newService);
  writeDb(db);
  res.status(201).json(newService);
});

// PUT update service
servicesRouter.put('/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.services.findIndex((s) => s.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Hizmet bulunamadı' });
    return;
  }
  db.services[idx] = { ...db.services[idx], ...req.body };
  writeDb(db);
  res.json(db.services[idx]);
});

// DELETE service
servicesRouter.delete('/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.services.findIndex((s) => s.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Hizmet bulunamadı' });
    return;
  }
  const deleted = db.services.splice(idx, 1);
  writeDb(db);
  res.json({ success: true, deleted: deleted[0] });
});
