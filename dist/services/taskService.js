"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = void 0;
const taskRepository_1 = require("../repositories/taskRepository");
const validStatuses = ['pending', 'in_progress', 'done'];
exports.taskService = {
    async getByProject(projectId) {
        return taskRepository_1.taskRepository.findByProject(projectId);
    },
    async getById(id) {
        const task = await taskRepository_1.taskRepository.findById(id);
        if (!task)
            throw new Error('Tarefa não encontrada');
        return task;
    },
    async create(data) {
        if (!data.title)
            throw new Error('Título da tarefa é obrigatório');
        return taskRepository_1.taskRepository.create(data);
    },
    async update(id, data) {
        const task = await taskRepository_1.taskRepository.findById(id);
        if (!task)
            throw new Error('Tarefa não encontrada');
        if (data.status && !validStatuses.includes(data.status)) {
            throw new Error(`Status inválido. Use: ${validStatuses.join(', ')}`);
        }
        return taskRepository_1.taskRepository.update(id, data);
    },
    async delete(id) {
        const task = await taskRepository_1.taskRepository.findById(id);
        if (!task)
            throw new Error('Tarefa não encontrada');
        return taskRepository_1.taskRepository.delete(id);
    }
};
