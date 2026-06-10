import { Router } from 'express';
import { taskController } from '../controllers/taskController';

const router = Router();

// Mounted under `/projects` in the app, so these paths become:
// GET  /projects/:projectId/tasks
// POST /projects/:projectId/tasks
router.get('/:projectId/tasks', taskController.getByProject);
router.post('/:projectId/tasks', taskController.create);

// Task operations by id (mounted under `/projects`, full paths: /projects/tasks/:id)
router.get('/tasks/:id', taskController.getById);
router.put('/tasks/:id', taskController.update);
router.delete('/tasks/:id', taskController.delete);

export default router;
