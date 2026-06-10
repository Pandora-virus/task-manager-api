import path from 'path';
import express from 'express';
import { authMiddleware } from './middlewares/authMiddleware';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'src', 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);

// Register routes (apply auth for protected endpoints)
app.use('/projects', authMiddleware, projectRoutes);
app.use('/projects', authMiddleware, taskRoutes);

export default app;