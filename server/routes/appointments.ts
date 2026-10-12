import { Router, Request, Response } from 'express';
import { readDb, writeDb } from '../db';

export const appointmentsRouter = Router();

// GET all appointments
appointmentsRouter.get('/', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.appointments);
});

// POST create appointment
appointmentsRouter.post('/', (req: Request, res: Response) => {
  const db = readDb();
  const newApt = {
    id: 'apt-' + Date.now(),
    trackingCode: 'LOD-APP-' + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    status: 'pending',
    ...req.body,
  };
  db.appointments.unshift(newApt);
  writeDb(db);
  res.status(201).json(newApt);
});

// PATCH update appointment status or details
appointmentsRouter.patch('/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.appointments.findIndex((a) => a.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Randevu bulunamadı' });
    return;
  }
  db.appointments[idx] = { ...db.appointments[idx], ...req.body };
  writeDb(db);
  res.json(db.appointments[idx]);
});

// DELETE appointment
appointmentsRouter.delete('/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.appointments.findIndex((a) => a.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Randevu bulunamadı' });
    return;
  }
  const deleted = db.appointments.splice(idx, 1);
  writeDb(db);
  res.json({ success: true, deleted: deleted[0] });
});
