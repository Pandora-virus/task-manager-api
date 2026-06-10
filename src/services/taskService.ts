import { taskRepository } from '../repositories/taskRepository';

const validStatuses = ['pending', 'in_progress', 'done'];

export const taskService = {
  async getByProject(projectId: number) {
    return taskRepository.findByProject(projectId);
  },

  async getById(id: number) {
    const task = await taskRepository.findById(id);
    if (!task) throw new Error('Tarefa não encontrada');
    return task;
  },

  async create(data: { title: string; description?: string; projectId: number }) {
    if (!data.title) throw new Error('Título da tarefa é obrigatório');
    return taskRepository.create(data);
  },

  async update(id: number, data: { title?: string; description?: string; status?: string }) {
    const task = await taskRepository.findById(id);
    if (!task) throw new Error('Tarefa não encontrada');
    if (data.status && !validStatuses.includes(data.status)) {
      throw new Error(`Status inválido. Use: ${validStatuses.join(', ')}`);
    }
    return taskRepository.update(id, data);
  },

  async delete(id: number) {
    const task = await taskRepository.findById(id);
    if (!task) throw new Error('Tarefa não encontrada');
    return taskRepository.delete(id);
  }
};