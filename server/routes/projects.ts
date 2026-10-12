import { Router, Request, Response } from 'express';
import { readDb, writeDb } from '../db';
import { dbGetProjects, dbSaveProject, dbDeleteProject } from '../db/postgres';

export const projectsRouter = Router();

// GET all tracked projects
projectsRouter.get('/', async (_req: Request, res: Response) => {
  const projects = await dbGetProjects();
  res.json(projects);
});

// GET single project by code or id
projectsRouter.get('/:codeOrId', async (req: Request, res: Response) => {
  const projects = await dbGetProjects();
  const query = req.params.codeOrId.toLowerCase();
  const project = projects.find(
    (p) => p.id?.toLowerCase() === query || p.projectCode?.toLowerCase() === query
  );
  if (!project) {
    res.status(404).json({ error: 'Proje bulunamadı' });
    return;
  }
  res.json(project);
});

// POST create new project
projectsRouter.post('/', async (req: Request, res: Response) => {
  const db = readDb();
  const body = req.body;
  const newProject = {
    id: 'trk-' + Date.now(),
    projectCode:
      body.projectCode ||
      `LOD-${new Date().getFullYear()}-${String(db.projects.length + 1).padStart(2, '0')}`,
    title: body.title || 'Yeni Müşteri Projesi',
    clientName: body.clientName || 'İsimsiz Müşteri',
    clientEmail: body.clientEmail || '',
    leadArchitect: body.leadArchitect || 'Kaan Demir (Principal Tech Lead)',
    totalBudget: Number(body.totalBudget) || 100000,
    paidAmount: Number(body.paidAmount) || 0,
    overallProgress: Number(body.overallProgress) || 10,
    currentStage: body.currentStage || 'discovery',
    currentStageName: body.currentStageName || 'Keşif & Kapsam Analizi',
    startDate: body.startDate || new Date().toISOString().split('T')[0],
    estimatedDeliveryDate: body.estimatedDeliveryDate || '',
    stagingUrl: body.stagingUrl || '',
    repositoryUrl: body.repositoryUrl || '',
    milestones:
      body.milestones && body.milestones.length > 0
        ? body.milestones
        : [
            {
              id: 'm-1',
              stage: 'discovery',
              title: { tr: 'Keşif & İhtiyaç Analizi', en: 'Discovery & Requirement Analysis' },
              description: {
                tr: 'Müşteri iş hedefleri ve sistem gereksinimlerinin belirlenmesi.',
                en: 'Defining client objectives and system requirements.',
              },
              progress: 100,
              completed: true,
              dueDate: 'Hafta 1',
            },
            {
              id: 'm-2',
              stage: 'design',
              title: { tr: 'UI/UX & Tasarım Onayı', en: 'UI/UX & Design Approval' },
              description: {
                tr: 'Wireframe ve interaktif Figma prototipleri.',
                en: 'Wireframes and interactive design prototypes.',
              },
              progress: 50,
              completed: false,
              dueDate: 'Hafta 3',
            },
            {
              id: 'm-3',
              stage: 'development',
              title: { tr: 'Yazılım & API Geliştirme', en: 'Software & API Development' },
              description: {
                tr: 'Frontend ve backend bileşenlerinin inşası.',
                en: 'Building frontend and backend components.',
              },
              progress: 0,
              completed: false,
              dueDate: 'Hafta 6',
            },
            {
              id: 'm-4',
              stage: 'testing',
              title: { tr: 'QA & Güvenlik Testleri', en: 'QA & Security Testing' },
              description: {
                tr: 'Uçtan uca testler ve güvenlik denetimi.',
                en: 'End-to-end tests and security auditing.',
              },
              progress: 0,
              completed: false,
              dueDate: 'Hafta 8',
            },
            {
              id: 'm-5',
              stage: 'deployment',
              title: { tr: 'Canlıya Alma & Teslim', en: 'Go-Live & Handover' },
              description: {
                tr: 'Canlı sunuculara dağıtım ve devir teslim.',
                en: 'Production rollout and client handover.',
              },
              progress: 0,
              completed: false,
              dueDate: 'Hafta 9',
            },
          ],
    sprintTasks: body.sprintTasks || [],
    activities: body.activities || [
      {
        id: 'act-' + Date.now(),
        timestamp: 'Bugün',
        actor: 'Sistem',
        action: { tr: 'Proje oluşturuldu.', en: 'Project created.' },
      },
    ],
  };

  const saved = await dbSaveProject(newProject);
  res.status(201).json(saved);
});

// PUT update project
projectsRouter.put('/:id', async (req: Request, res: Response) => {
  const db = readDb();
  const index = db.projects.findIndex((p) => p.id === req.params.id || p.projectCode === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Proje bulunamadı' });
    return;
  }

  const updatedProject = { ...db.projects[index], ...req.body };
  await dbSaveProject(updatedProject);
  res.json(updatedProject);
});

// DELETE project
projectsRouter.delete('/:id', async (req: Request, res: Response) => {
  const deleted = await dbDeleteProject(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Proje bulunamadı' });
    return;
  }
  res.json({ success: true });
});

// PUT /:id/current-stage -> Core dynamic timeline calculation
projectsRouter.put('/:id/current-stage', async (req: Request, res: Response) => {
  const db = readDb();
  const project = db.projects.find((p) => p.id === req.params.id || p.projectCode === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Proje bulunamadı' });
    return;
  }

  const { stageId, stageName, progress = 60, activityNote } = req.body;
  let targetIndex = -1;

  // Search by stageId
  if (stageId) {
    targetIndex = project.milestones.findIndex((m: any) => m.id === stageId);
  }

  // Search by stageName text
  if (targetIndex === -1 && stageName) {
    const lower = stageName.trim().toLowerCase();
    targetIndex = project.milestones.findIndex(
      (m: any) =>
        m.title.tr.toLowerCase().includes(lower) ||
        m.title.en?.toLowerCase().includes(lower) ||
        m.id.toLowerCase() === lower ||
        m.stage?.toLowerCase() === lower
    );
  }

  // If not found, create a new stage in milestones
  if (targetIndex === -1 && stageName) {
    const newMilestone = {
      id: 'm-' + Date.now(),
      stage: 'in_progress',
      title: { tr: stageName, en: stageName },
      description: { tr: 'Şu an bu aşama yürütülmektedir.', en: 'Currently in progress.' },
      progress: Number(progress) || 60,
      completed: false,
      dueDate: 'Aktif Faz',
    };
    project.milestones.push(newMilestone);
    targetIndex = project.milestones.length - 1;
  }

  if (targetIndex !== -1) {
    const today = new Date().toISOString().split('T')[0];

    // Dynamically update timeline order:
    // Stages prior to target are marked completed: true, progress: 100, completedDate set
    // Target stage is marked active: false, progress: progress, completedDate cleared, startDate set
    // Stages after target are marked completed: false, progress: 0, completedDate cleared
    project.milestones = project.milestones.map((m: any, idx: number) => {
      if (idx < targetIndex) {
        return {
          ...m,
          completed: true,
          progress: 100,
          completedDate: m.completedDate || m.dueDate || today,
        };
      } else if (idx === targetIndex) {
        return {
          ...m,
          completed: false,
          progress: Number(progress) || 60,
          completedDate: undefined,
          startDate: m.startDate || today,
        };
      } else {
        return {
          ...m,
          completed: false,
          progress: 0,
          completedDate: undefined,
        };
      }
    });

    const currentMilestone = project.milestones[targetIndex];
    project.currentStage = currentMilestone.stage || 'in_progress';
    project.currentStageName = currentMilestone.title.tr;

    // Calculate overall progress percentage
    const total = project.milestones.length;
    if (total > 0) {
      const completedCount = targetIndex;
      const currentShare = (Number(progress) || 60) / 100;
      project.overallProgress = Math.min(100, Math.round(((completedCount + currentShare) / total) * 100));
    }
  }

  // Add activity note if provided
  if (activityNote) {
    project.activities.unshift({
      id: 'act-' + Date.now(),
      timestamp: 'Bugün',
      actor: 'Lodonsoft Ekibi',
      action: { tr: activityNote, en: activityNote },
    });
  }

  await dbSaveProject(project);
  res.json(project);
});

// POST /:id/stages -> Add or reorder milestones
projectsRouter.post('/:id/stages', async (req: Request, res: Response) => {
  const db = readDb();
  const project = db.projects.find((p) => p.id === req.params.id || p.projectCode === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Proje bulunamadı' });
    return;
  }

  const { stages, newStage, insertPosition } = req.body;
  if (Array.isArray(stages)) {
    project.milestones = stages;
  } else if (newStage) {
    const stageObj = {
      id: 'm-' + Date.now(),
      stage: newStage.stage || 'custom',
      title: { tr: newStage.titleTr || newStage.title || '', en: newStage.titleEn || newStage.title || '' },
      description: { tr: newStage.descTr || newStage.description || '', en: newStage.descEn || newStage.description || '' },
      progress: Number(newStage.progress) || 0,
      completed: Boolean(newStage.completed),
      dueDate: newStage.dueDate || '',
      completedDate: newStage.completedDate || (newStage.completed ? new Date().toISOString().split('T')[0] : undefined),
      startDate: newStage.startDate || '',
    };

    if (insertPosition === 'start') {
      project.milestones.unshift(stageObj);
    } else {
      project.milestones.push(stageObj);
    }
  }

  await dbSaveProject(project);
  res.json(project);
});

// PUT /:id/stages/:stageId -> Update milestone details and dates
projectsRouter.put('/:id/stages/:stageId', async (req: Request, res: Response) => {
  const db = readDb();
  const project = db.projects.find((p) => p.id === req.params.id || p.projectCode === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Proje bulunamadı' });
    return;
  }

  const stageIndex = project.milestones.findIndex((m: any) => m.id === req.params.stageId);
  if (stageIndex === -1) {
    res.status(404).json({ error: 'Aşama bulunamadı' });
    return;
  }

  const current = project.milestones[stageIndex];
  project.milestones[stageIndex] = {
    ...current,
    ...req.body,
    title: req.body.titleTr
      ? { tr: req.body.titleTr, en: req.body.titleEn || req.body.titleTr }
      : current.title,
    description: req.body.descTr
      ? { tr: req.body.descTr, en: req.body.descEn || req.body.descTr }
      : current.description,
  };

  await dbSaveProject(project);
  res.json(project);
});

// DELETE /:id/stages/:stageId
projectsRouter.delete('/:id/stages/:stageId', async (req: Request, res: Response) => {
  const db = readDb();
  const project = db.projects.find((p) => p.id === req.params.id || p.projectCode === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Proje bulunamadı' });
    return;
  }

  project.milestones = project.milestones.filter((m: any) => m.id !== req.params.stageId);
  await dbSaveProject(project);
  res.json(project);
});

// POST /:id/tasks -> Add sprint task
projectsRouter.post('/:id/tasks', (req: Request, res: Response) => {
  const db = readDb();
  const project = db.projects.find((p) => p.id === req.params.id || p.projectCode === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Proje bulunamadı' });
    return;
  }

  const { titleTr, titleEn, assignee } = req.body;
  const newTask = {
    id: 't-' + Date.now(),
    title: { tr: titleTr, en: titleEn || titleTr },
    status: 'planned',
    assignee: assignee || 'Geliştirici Ekip',
  };

  project.sprintTasks.push(newTask);
  writeDb(db);
  res.status(201).json(project);
});

// PATCH /:id/tasks/:taskId -> Toggle task status
projectsRouter.patch('/:id/tasks/:taskId', (req: Request, res: Response) => {
  const db = readDb();
  const project = db.projects.find((p) => p.id === req.params.id || p.projectCode === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Proje bulunamadı' });
    return;
  }

  const task = project.sprintTasks.find((t: any) => t.id === req.params.taskId);
  if (!task) {
    res.status(404).json({ error: 'Görev bulunamadı' });
    return;
  }

  if (req.body.status) {
    task.status = req.body.status;
  } else {
    task.status = task.status === 'done' ? 'in_progress' : 'done';
  }

  writeDb(db);
  res.json(project);
});

// DELETE /:id/tasks/:taskId
projectsRouter.delete('/:id/tasks/:taskId', (req: Request, res: Response) => {
  const db = readDb();
  const project = db.projects.find((p) => p.id === req.params.id || p.projectCode === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Proje bulunamadı' });
    return;
  }

  project.sprintTasks = project.sprintTasks.filter((t: any) => t.id !== req.params.taskId);
  writeDb(db);
  res.json(project);
});
