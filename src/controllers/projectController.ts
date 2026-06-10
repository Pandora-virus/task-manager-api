import { Request, Response } from 'express';
import { projectService } from '../services/projectService';

export const projectController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const projects = await projectService.getAll(userId);
      res.json(projects);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params['id']);
      const project = await projectService.getById(id);
      res.json(project);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;
      const userId = req.userId!;
      const project = await projectService.create({ name, description, userId });
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params['id']);
      const { name, description } = req.body;
      const project = await projectService.update(id, { name, description });
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params['id']);
      await projectService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};