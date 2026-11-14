import { Request, Response } from 'express';
import { supabaseServer, isBackendSupabaseConfigured } from '../config/supabase.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema.js';

// In-memory demo store for evaluation mode without live database
type DemoTask = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  created_at: string;
};

const demoTasks: DemoTask[] = [
  {
    id: 'demo-task-1',
    user_id: 'demo-farmer-id-12345',
    title: 'Check drip irrigation lines in Plot B',
    description: 'Inspect emitters for blockages across cotton beds.',
    due_date: new Date(Date.now() + 86400000).toISOString(),
    status: 'pending',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-task-2',
    user_id: 'demo-farmer-id-12345',
    title: 'Apply organic Neem cake to tomatoes',
    description: 'Mix 250g per plant base before soil earthing up.',
    due_date: new Date(Date.now() + 172800000).toISOString(),
    status: 'in_progress',
    created_at: new Date().toISOString(),
  },
];

export const getTasks = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  if (!isBackendSupabaseConfigured || userId === 'demo-farmer-id-12345') {
    return res.status(200).json({
      status: 'success',
      data: demoTasks,
      source: 'evaluation_store',
    });
  }

  try {
    const { data, error } = await supabaseServer
      .from('farming_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });

    if (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }

    return res.status(200).json({
      status: 'success',
      data: data || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
    return res.status(500).json({ status: 'error', message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: parsed.error.errors,
    });
  }

  const taskPayload = {
    ...parsed.data,
    user_id: userId,
  };

  if (!isBackendSupabaseConfigured || userId === 'demo-farmer-id-12345') {
    const newTask: DemoTask = {
      ...taskPayload,
      description: taskPayload.description ?? '',
      due_date: taskPayload.due_date ?? '',
      id: `task-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    demoTasks.push(newTask);
    return res.status(201).json({ status: 'success', data: newTask });
  }

  try {
    const { data, error } = await supabaseServer
      .from('farming_tasks')
      .insert(taskPayload)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }

    return res.status(201).json({ status: 'success', data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create task';
    return res.status(500).json({ status: 'error', message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const taskId = req.params.id;

  if (!userId) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: parsed.error.errors,
    });
  }

  if (!isBackendSupabaseConfigured || userId === 'demo-farmer-id-12345') {
    const idx = demoTasks.findIndex((t) => t.id === taskId);
    if (idx === -1) {
      return res.status(404).json({ status: 'error', message: 'Task not found' });
    }
    demoTasks[idx] = { ...demoTasks[idx], ...parsed.data };
    return res.status(200).json({ status: 'success', data: demoTasks[idx] });
  }

  try {
    const { data, error } = await supabaseServer
      .from('farming_tasks')
      .update(parsed.data)
      .eq('id', taskId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }

    return res.status(200).json({ status: 'success', data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update task';
    return res.status(500).json({ status: 'error', message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const taskId = req.params.id;

  if (!userId) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  if (!isBackendSupabaseConfigured || userId === 'demo-farmer-id-12345') {
    const idx = demoTasks.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      demoTasks.splice(idx, 1);
    }
    return res.status(200).json({ status: 'success', message: 'Task deleted successfully' });
  }

  try {
    const { error } = await supabaseServer
      .from('farming_tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }

    return res.status(200).json({ status: 'success', message: 'Task deleted successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete task';
    return res.status(500).json({ status: 'error', message });
  }
};
