"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectController = void 0;
const projectService_1 = require("../services/projectService");
exports.projectController = {
    async getAll(req, res) {
        try {
            const userId = req.userId;
            const projects = await projectService_1.projectService.getAll(userId);
            res.json(projects);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async getById(req, res) {
        try {
            const id = Number(req.params['id']);
            const project = await projectService_1.projectService.getById(id);
            res.json(project);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    },
    async create(req, res) {
        try {
            const { name, description } = req.body;
            const userId = req.userId;
            const project = await projectService_1.projectService.create({ name, description, userId });
            res.status(201).json(project);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async update(req, res) {
        try {
            const id = Number(req.params['id']);
            const { name, description } = req.body;
            const project = await projectService_1.projectService.update(id, { name, description });
            res.json(project);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async delete(req, res) {
        try {
            const id = Number(req.params['id']);
            await projectService_1.projectService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};
