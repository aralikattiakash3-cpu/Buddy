import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/tasks.controller.js';

export const tasksRouter = Router();

// Protect all task endpoints with authentication
tasksRouter.use(requireAuth);

tasksRouter.get('/tasks', getTasks);
tasksRouter.post('/tasks', createTask);
tasksRouter.put('/tasks/:id', updateTask);
tasksRouter.delete('/tasks/:id', deleteTask);
