"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const router = (0, express_1.Router)();
// Mounted under `/projects` in the app, so these paths become:
// GET  /projects/:projectId/tasks
// POST /projects/:projectId/tasks
router.get('/:projectId/tasks', taskController_1.taskController.getByProject);
router.post('/:projectId/tasks', taskController_1.taskController.create);
// Task operations by id (mounted under `/projects`, full paths: /projects/tasks/:id)
router.get('/tasks/:id', taskController_1.taskController.getById);
router.put('/tasks/:id', taskController_1.taskController.update);
router.delete('/tasks/:id', taskController_1.taskController.delete);
exports.default = router;
