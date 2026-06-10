import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-dev';

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;

    if (!name) throw new Error('Nome é obrigatório');
    if (!email) throw new Error('Email é obrigatório');
    if (!password) throw new Error('Senha é obrigatória');

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new Error('Email já cadastrado');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, password: hashedPassword });

    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  },

  async login(data: { email: string; password: string }) {
    const { email, password } = data;

    if (!email) throw new Error('Email é obrigatório');
    if (!password) throw new Error('Senha é obrigatória');

    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Email ou senha inválidos');

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new Error('Email ou senha inválidos');

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h'
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }
};
