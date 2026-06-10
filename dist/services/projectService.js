"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const projectRepository_1 = require("../repositories/projectRepository");
exports.projectService = {
    async getAll(userId) {
        return projectRepository_1.projectRepository.findAll(userId);
    },
    async getById(id) {
        const project = await projectRepository_1.projectRepository.findById(id);
        if (!project)
            throw new Error('Projeto não encontrado');
        return project;
    },
    async create(data) {
        if (!data.name)
            throw new Error('Nome do projeto é obrigatório');
        return projectRepository_1.projectRepository.create(data);
    },
    async update(id, data) {
        await exports.projectService.getById(id);
        return projectRepository_1.projectRepository.update(id, data);
    },
    async delete(id) {
        await exports.projectService.getById(id);
        return projectRepository_1.projectRepository.delete(id);
    }
};
