import { Router, Request, Response } from 'express';
import { readDb, writeDb } from '../db';
import { PRESET_GOOGLE_SAMPLE_REVIEWS } from '../../src/data/initialData';

export const testimonialsRouter = Router();

// GET all testimonials
testimonialsRouter.get('/', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.testimonials);
});

// POST add testimonial / survey
testimonialsRouter.post('/', (req: Request, res: Response) => {
  const db = readDb();
  const newT = {
    id: 't-' + Date.now(),
    verifiedDate: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }),
    status: 'approved',
    rating: 5,
    ...req.body,
  };
  db.testimonials.unshift(newT);
  writeDb(db);
  res.status(201).json(newT);
});

// PATCH update testimonial
testimonialsRouter.patch('/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.testimonials.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Yorum bulunamadı' });
    return;
  }
  db.testimonials[idx] = { ...db.testimonials[idx], ...req.body };
  writeDb(db);
  res.json(db.testimonials[idx]);
});

// DELETE testimonial
testimonialsRouter.delete('/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.testimonials.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Yorum bulunamadı' });
    return;
  }
  const deleted = db.testimonials.splice(idx, 1);
  writeDb(db);
  res.json({ success: true, deleted: deleted[0] });
});

// POST sync google reviews
testimonialsRouter.post('/sync-google', (_req: Request, res: Response) => {
  const db = readDb();
  const existingNames = new Set(db.testimonials.map((item: any) => item.clientName?.toLowerCase()));
  const toAdd = PRESET_GOOGLE_SAMPLE_REVIEWS.filter(
    (sample) => !existingNames.has(sample.clientName?.toLowerCase())
  ).map((sample, idx) => ({
    ...sample,
    id: `t-g-synced-${Date.now()}-${idx}`,
  }));

  db.testimonials = [...toAdd, ...db.testimonials];
  writeDb(db);
  res.json({ addedCount: toAdd.length, total: db.testimonials.length });
});
