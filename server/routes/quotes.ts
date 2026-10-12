import { Router, Request, Response } from 'express';
import { readDb, writeDb } from '../db';

export const quotesRouter = Router();

// GET all quote requests
quotesRouter.get('/', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.quotes);
});

// POST create quote request
quotesRouter.post('/', (req: Request, res: Response) => {
  const db = readDb();
  const newQuote = {
    id: 'q-' + Date.now(),
    trackingCode: 'LOD-Q-' + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    status: 'pending',
    ...req.body,
  };
  db.quotes.unshift(newQuote);
  writeDb(db);
  res.status(201).json(newQuote);
});

// PATCH update quote status / proposal details
quotesRouter.patch('/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.quotes.findIndex((q) => q.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Teklif bulunamadı' });
    return;
  }
  db.quotes[idx] = { ...db.quotes[idx], ...req.body };
  writeDb(db);
  res.json(db.quotes[idx]);
});

// DELETE quote
quotesRouter.delete('/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.quotes.findIndex((q) => q.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Teklif bulunamadı' });
    return;
  }
  const deleted = db.quotes.splice(idx, 1);
  writeDb(db);
  res.json({ success: true, deleted: deleted[0] });
});
