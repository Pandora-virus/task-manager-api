import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@taskmanager.com',
      password: hashedPassword
    }
  });

  const project1 = await prisma.project.create({
    data: {
      name: 'Site Institucional',
      description: 'Redesign do site da empresa',
      userId: user.id
    }
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'App Mobile',
      description: 'Desenvolvimento do app para iOS e Android',
      userId: user.id
    }
  });

  await prisma.task.createMany({
    data: [
      { title: 'Levantamento de requisitos', description: 'Reunião com stakeholders', status: 'done', projectId: project1.id },
      { title: 'Criação do layout', description: 'Figma com todas as telas', status: 'in_progress', projectId: project1.id },
      { title: 'Implementação frontend', description: 'HTML, CSS e JS', status: 'pending', projectId: project1.id },
      { title: 'Definir tecnologias', description: 'React Native ou Flutter', status: 'done', projectId: project2.id },
      { title: 'Telas de autenticação', description: 'Login e cadastro', status: 'in_progress', projectId: project2.id },
      { title: 'Integração com API', description: 'Conectar com backend', status: 'pending', projectId: project2.id }
    ]
  });

  console.log('Seed concluído!');
  console.log('Email: admin@taskmanager.com');
  console.log('Senha: admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());