import prisma from '../prisma';

interface CreateProjectData {
  name: string;
  description?: string;
  userId: number;
}

export const projectRepository = {
  async findAll(userId: number) {
    return prisma.project.findMany({
      where: { userId },
      include: { tasks: true },
      orderBy: { createdAt: 'desc' }
    });
  },

  async findById(id: number) {
    return prisma.project.findUnique({
      where: { id },
      include: { tasks: true }
    });
  },

  async create(data: CreateProjectData) {
    return prisma.project.create({ data });
  },

  async update(id: number, data: Partial<CreateProjectData>) {
    return prisma.project.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.project.delete({ where: { id } });
  }
};