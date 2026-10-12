import { Router, Request, Response } from 'express';
import { readDb, writeDb } from '../db';

export const chatRouter = Router();

// GET messages for a project code
chatRouter.get('/:projectCode', (req: Request, res: Response) => {
  const db = readDb();
  const code = req.params.projectCode.toLowerCase();
  const messages = db.chatMessages.filter(
    (m: any) => m.projectCode?.toLowerCase() === code
  );
  res.json(messages);
});

// POST message to project chat
chatRouter.post('/:projectCode', (req: Request, res: Response) => {
  const db = readDb();
  const { sender, senderName, message } = req.body;
  const projectCode = req.params.projectCode;

  const newMsg = {
    id: 'msg-' + Date.now(),
    projectCode,
    sender: sender || 'client',
    senderName: senderName || (sender === 'team' ? 'Teknik Ekip' : 'Müşteri'),
    senderRole: sender === 'team' ? 'Teknik Ekip' : 'Müşteri',
    message,
    timestamp: 'Şimdi',
  };

  db.chatMessages.push(newMsg);
  writeDb(db);
  res.status(201).json(newMsg);
});
