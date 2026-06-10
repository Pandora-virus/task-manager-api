"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const taskService_1 = require("../services/taskService");
exports.taskController = {
    async getByProject(req, res) {
        try {
            const projectId = Number(req.params['projectId']);
            const tasks = await taskService_1.taskService.getByProject(projectId);
            res.json(tasks);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async getById(req, res) {
        try {
            const id = Number(req.params['id']);
            const task = await taskService_1.taskService.getById(id);
            res.json(task);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    },
    async create(req, res) {
        try {
            const projectId = Number(req.params['projectId']);
            const { title, description } = req.body;
            const task = await taskService_1.taskService.create({ title, description, projectId });
            res.status(201).json(task);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async update(req, res) {
        try {
            const id = Number(req.params['id']);
            const { title, description, status } = req.body;
            const task = await taskService_1.taskService.update(id, { title, description, status });
            res.json(task);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async delete(req, res) {
        try {
            const id = Number(req.params['id']);
            await taskService_1.taskService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};
