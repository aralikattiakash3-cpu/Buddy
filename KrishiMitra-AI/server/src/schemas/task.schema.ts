import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200),
  description: z.string().max(1000).optional(),
  due_date: z.string().datetime({ message: 'due_date must be a valid ISO 8601 datetime' }),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  due_date: z.string().datetime().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
});
