import { Request, Response } from 'express';
import { taskService } from '../services/taskService';

export const taskController = {
	async getByProject(req: Request, res: Response): Promise<void> {
		try {
			const projectId = Number(req.params['projectId']);
			const tasks = await taskService.getByProject(projectId);
			res.json(tasks);
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	},

	async getById(req: Request, res: Response): Promise<void> {
		try {
			const id = Number(req.params['id']);
			const task = await taskService.getById(id);
			res.json(task);
		} catch (error: any) {
			res.status(404).json({ error: error.message });
		}
	},

	async create(req: Request, res: Response): Promise<void> {
		try {
			const projectId = Number(req.params['projectId']);
			const { title, description } = req.body;
			const task = await taskService.create({ title, description, projectId });
			res.status(201).json(task);
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	},

	async update(req: Request, res: Response): Promise<void> {
		try {
			const id = Number(req.params['id']);
			const { title, description, status } = req.body;
			const task = await taskService.update(id, { title, description, status });
			res.json(task);
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	},

	async delete(req: Request, res: Response): Promise<void> {
		try {
			const id = Number(req.params['id']);
			await taskService.delete(id);
			res.status(204).send();
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}
};
