import { Router, Request, Response } from 'express';
import { readDb, writeDb } from '../db';

export const invoicesRouter = Router();

// GET all invoices
invoicesRouter.get('/', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.invoices);
});

// POST create invoice
invoicesRouter.post('/', (req: Request, res: Response) => {
  const db = readDb();
  const body = req.body;
  const newInv = {
    id: 'inv-' + Date.now(),
    invoiceNumber:
      body.invoiceNumber ||
      'INV-' + new Date().getFullYear() + '-' + String(db.invoices.length + 1).padStart(3, '0'),
    issueDate: body.issueDate || new Date().toISOString().split('T')[0],
    dueDate: body.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: body.status || 'pending',
    clientName: body.clientName || 'Müşteri',
    clientCompany: body.clientCompany || 'Şirket',
    clientAddress: body.clientAddress || 'Türkiye',
    clientEmail: body.clientEmail || '',
    projectCode: body.projectCode,
    items: body.items || [
      {
        description: 'Yazılım Geliştirme Hakediş Bedeli',
        quantity: 1,
        unitPrice: 50000,
        total: 50000,
      },
    ],
    subtotal: Number(body.subtotal) || 50000,
    taxAmount: Number(body.taxAmount) || 10000,
    totalAmount: Number(body.totalAmount) || 60000,
  };

  db.invoices.unshift(newInv);
  writeDb(db);
  res.status(201).json(newInv);
});

// PATCH update invoice / mark paid
invoicesRouter.patch('/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.invoices.findIndex((inv) => inv.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Fatura bulunamadı' });
    return;
  }
  db.invoices[idx] = { ...db.invoices[idx], ...req.body };
  writeDb(db);
  res.json(db.invoices[idx]);
});

// DELETE invoice
invoicesRouter.delete('/:id', (req: Request, res: Response) => {
  const db = readDb();
  const idx = db.invoices.findIndex((inv) => inv.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Fatura bulunamadı' });
    return;
  }
  const deleted = db.invoices.splice(idx, 1);
  writeDb(db);
  res.json({ success: true, deleted: deleted[0] });
});
