import 'dotenv/config';
import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Modular route imports
import { projectsRouter } from './server/routes/projects';
import { portfolioRouter } from './server/routes/portfolio';
import { servicesRouter } from './server/routes/services';
import { appointmentsRouter } from './server/routes/appointments';
import { quotesRouter } from './server/routes/quotes';
import { invoicesRouter } from './server/routes/invoices';
import { settingsRouter } from './server/routes/settings';
import { testimonialsRouter } from './server/routes/testimonials';
import { chatRouter } from './server/routes/chat';
import { initPostgresTables, isPostgresConfigured } from './server/db/postgres';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = Number(process.env.PORT) || 3000;

  // Initialize PostgreSQL before accepting requests so API calls cannot race table creation.
  if (isPostgresConfigured()) {
    const initialized = await initPostgresTables();
    if (!initialized) {
      console.warn('[PostgreSQL] Continuing with the JSON file store.');
    }
  }

  // Middleware
  app.use(express.json());

  // ----------------------------------------------------
  // MODULAR REST API ROUTES
  // ----------------------------------------------------
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Lodonsoft Full-Stack Enterprise Engine',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/projects', projectsRouter);
  app.use('/api/portfolio', portfolioRouter);
  app.use('/api/services', servicesRouter);
  app.use('/api/appointments', appointmentsRouter);
  app.use('/api/quotes', quotesRouter);
  app.use('/api/invoices', invoicesRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/testimonials', testimonialsRouter);
  app.use('/api/chat', chatRouter);

  // ----------------------------------------------------
  // VITE DEV SERVER OR STATIC PROD SERVE
  // ----------------------------------------------------
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Lodonsoft Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Lodonsoft Server] All REST API routes active (/api/projects, /api/portfolio, /api/services, /api/appointments, /api/quotes, /api/invoices, /api/settings, /api/testimonials, /api/chat)`);
  });
}

startServer().catch((err) => {
  console.error('[Lodonsoft Server Error]:', err);
  process.exit(1);
});
