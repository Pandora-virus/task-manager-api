import prisma from '../prisma';

interface CreateTaskData {
  title: string;
  description?: string;
  projectId: number;
}

export const taskRepository = {
  async findByProject(projectId: number) {
    return prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });
  },

  async findById(id: number) {
    return prisma.task.findUnique({ where: { id } });
  },

  async create(data: CreateTaskData) {
    return prisma.task.create({ data });
  },

  async update(id: number, data: Partial<CreateTaskData & { status: string }>) {
    return prisma.task.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.task.delete({ where: { id } });
  }
};