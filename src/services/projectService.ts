import { projectRepository } from '../repositories/projectRepository';

export const projectService = {
  async getAll(userId: number) {
    return projectRepository.findAll(userId);
  },

  async getById(id: number) {
    const project = await projectRepository.findById(id);
    if (!project) throw new Error('Projeto não encontrado');
    return project;
  },

  async create(data: { name: string; description?: string; userId: number }) {
    if (!data.name) throw new Error('Nome do projeto é obrigatório');
    return projectRepository.create(data);
  },

  async update(id: number, data: { name?: string; description?: string }) {
    await projectService.getById(id);
    return projectRepository.update(id, data);
  },

  async delete(id: number) {
    await projectService.getById(id);
    return projectRepository.delete(id);
  }
};