
import React, { useEffect, useState } from 'react';
import {
  getLocalFarmTasks,
  saveLocalFarmTasks,
  FARM_TASK_STORAGE_KEY,
  type LocalFarmTask
} from '../utils/farmTaskStorage';

import {
  CalendarCheck,
  Plus,
  Clock,
  Trash2,
  CheckCircle2,
  Circle,
  ListTodo,
  X,
  Sprout,
  RotateCcw
} from 'lucide-react';

type TaskPriority = LocalFarmTask['priority'];
type TaskFilter = 'all' | 'pending' | 'completed';
type FarmTask = LocalFarmTask;

const getLocalDate = (): string => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 10);
};

const formatDate = (date: string): string => {
  if (!date) return 'No due date';

  return new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const FarmPlannerPage: React.FC = () => {
  const [tasks, setTasks] = useState<FarmTask[]>(getLocalFarmTasks);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<TaskFilter>('all');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Irrigation');
  const [dueDate, setDueDate] = useState(getLocalDate());
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [error, setError] = useState('');

  // Save tasks whenever they change.
  useEffect(() => {
    saveLocalFarmTasks(tasks);
  }, [tasks]);

  // Synchronize changes from other browser tabs.
  useEffect(() => {
    const syncTasks = (event: StorageEvent) => {
      if (event.key === FARM_TASK_STORAGE_KEY) {
        setTasks(getLocalFarmTasks());
      }
    };

    window.addEventListener('storage', syncTasks);

    return () => {
      window.removeEventListener('storage', syncTasks);
    };
  }, []);

  const addTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a task name.');
      return;
    }

    if (!dueDate) {
      setError('Please select a due date.');
      return;
    }

    const newTask: FarmTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      category,
      dueDate,
      priority,
      status: 'pending'
    };

    setTasks((previous) => [newTask, ...previous]);

    setTitle('');
    setCategory('Irrigation');
    setDueDate(getLocalDate());
    setPriority('Medium');
    setShowForm(false);
  };

  const toggleTask = (id: string) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? {
            ...task,
            status:
              task.status === 'completed'
                ? 'pending'
                : 'completed'
          }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  };

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === 'completed'
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const visibleTasks = tasks
    .filter(
      (task) => filter === 'all' || task.status === filter
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const priorityStyles: Record<TaskPriority, string> = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-amber-100 text-amber-800',
    High: 'bg-red-100 text-red-800'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center">
            <CalendarCheck className="w-6 h-6 text-leaf-light" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Farming Action Planner
            </h1>
            <p className="text-xs text-slate-500">
              Track tasks, irrigation schedules and field activities
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((previous) => !previous);
            setError('');
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-sm font-semibold transition"
        >
          {showForm ? (
            <X className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {showForm ? 'Close Form' : 'Add Task'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-slate-600">
            <ListTodo className="w-5 h-5" />
            <p className="text-sm font-medium">Total Tasks</p>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {totalTasks}
          </p>
        </div>

        <div className="bg-white border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-amber-700">
            <Clock className="w-5 h-5" />
            <p className="text-sm font-medium">Pending Tasks</p>
          </div>
          <p className="text-3xl font-bold text-amber-800 mt-2">
            {pendingTasks}
          </p>
        </div>

        <div className="bg-white border border-green-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-medium">Completed Tasks</p>
          </div>
          <p className="text-3xl font-bold text-green-800 mt-2">
            {completedTasks}
          </p>
        </div>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <form
          onSubmit={addTask}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5"
        >
          <h2 className="text-lg font-bold text-slate-900">
            Create Farming Task
          </h2>

          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
            >
              Task Name
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
              placeholder="e.g. Check soil moisture in tomato field"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="task-category"
                className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
              >
                Category
              </label>

              <select
                id="task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              >
                <option>Irrigation</option>
                <option>Soil Health</option>
                <option>Crop Monitoring</option>
                <option>Plant Protection</option>
                <option>Harvesting</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-date"
                className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
              >
                Due Date
              </label>

              <input
                id="task-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>

            <div>
              <label
                htmlFor="task-priority"
                className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
              >
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as TaskPriority)
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-sm"
            >
              <Plus className="w-4 h-4" />
              Save Task
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError('');
              }}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold text-slate-900 text-lg">
            Field Activities
          </h2>

          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'completed'] as TaskFilter[]).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize ${filter === item
                      ? 'bg-green-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>

        {visibleTasks.length === 0 ? (
          <div className="text-center py-12">
            <Sprout className="w-12 h-12 text-green-600 mx-auto mb-3" />

            <h3 className="font-bold text-slate-800">
              No Tasks Found
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              {totalTasks === 0
                ? 'Click Add Task to create your first farming activity.'
                : 'There are no tasks matching this filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${task.status === 'completed'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-slate-50 border-slate-200'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    aria-label={`Toggle completion for ${task.title}`}
                    className="mt-0.5 text-green-700"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  <div>
                    <h3
                      className={`font-semibold text-sm ${task.status === 'completed'
                          ? 'text-slate-500 line-through'
                          : 'text-slate-800'
                        }`}
                    >
                      {task.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {task.category} • Due {formatDate(task.dueDate)}
                    </p>

                    <span
                      className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyles[task.priority]
                        }`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ${task.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                      }`}
                  >
                    {task.status === 'completed'
                      ? 'Completed'
                      : 'Pending'}
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Storage Note */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
        <RotateCcw className="w-5 h-5 text-green-700 shrink-0" />

        <p className="text-sm text-green-900">
          Tasks are saved automatically in this browser.
          They remain available after refreshing the page.
          Cloud synchronization across devices is not yet enabled.
        </p>
      </div>
    </div>
  );
};
