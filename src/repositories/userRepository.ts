import prisma from '../prisma';

interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async create(data: CreateUserData) {
    return prisma.user.create({ data });
  }
};
