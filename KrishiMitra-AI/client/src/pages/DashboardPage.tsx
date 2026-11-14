
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Stethoscope, Bot, Compass, CloudSun, Droplets,
  CalendarCheck, ArrowRight, ShieldAlert, CheckCircle2,
  Clock, Sparkles, Server, Database, PlusCircle, FileText,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../services/api';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { HealthStatus, AdvisoryReport } from '../types';
import {
  getLocalFarmTasks,
  saveLocalFarmTasks,
  type LocalFarmTask
} from '../utils/farmTaskStorage';

interface ContextType {
  language: 'kn' | 'hi' | 'en';
}

export const DashboardPage: React.FC = () => {
  const { language } = useOutletContext<ContextType>();
  const { user, profile, isDemoUser } = useAuth();

  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [backendLoading, setBackendLoading] = useState(true);
  const [tasks, setTasks] = useState<LocalFarmTask[]>(
    () => getLocalFarmTasks()
  );
  const [reports, setReports] = useState<AdvisoryReport[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    api.checkHealth()
      .then(setHealth)
      .catch(() => setHealth(null))
      .finally(() => setBackendLoading(false));
  }, []);

  // Synchronize Dashboard with Farm Planner.
  useEffect(() => {
    const refreshTasks = () => {
      setTasks(getLocalFarmTasks());
    };

    refreshTasks();

    window.addEventListener('krishimitra-tasks-updated', refreshTasks);
    window.addEventListener('storage', refreshTasks);
    window.addEventListener('focus', refreshTasks);

    return () => {
      window.removeEventListener('krishimitra-tasks-updated', refreshTasks);
      window.removeEventListener('storage', refreshTasks);
      window.removeEventListener('focus', refreshTasks);
    };
  }, []);

  const loadReports = useCallback(async () => {
    if (!user || isDemoUser || !isSupabaseConfigured) {
      setReports([]);
      return;
    }

    setDbError(null);

    try {
      const { data, error } = await supabase
        .from('advisory_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        setDbError(error.message);
        return;
      }

      setReports((data ?? []) as AdvisoryReport[]);
    } catch {
      setDbError('Unable to load reports.');
    }
  }, [user, isDemoUser]);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const toggleTask = (task: LocalFarmTask) => {
    const updated = getLocalFarmTasks().map(item =>
      item.id === task.id
        ? {
          ...item,
          status: (
            item.status === 'completed'
              ? 'pending'
              : 'completed'
          ) as LocalFarmTask['status']
        }
        : item
    );

    saveLocalFarmTasks(updated);
    setTasks(updated);

    toast.success(
      task.status === 'completed'
        ? 'Task marked pending'
        : 'Task completed successfully!'
    );
  };

  const farmerName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    'Kisan Bandhu';

  const farmerDistrict = profile?.district || 'Dharwad';
  const farmerState = profile?.state || 'Karnataka';

  const greetings = {
    kn: `ನಮಸ್ಕಾರ, ${farmerName}!`,
    hi: `नमस्ते, ${farmerName}!`,
    en: `Welcome back, ${farmerName}!`
  };

  const subtitles = {
    kn: 'ಇಂದಿನ ಕೃಷಿ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಕೃಷಿ ಕಾರ್ಯಸೂಚಿ ಇಲ್ಲಿದೆ.',
    hi: 'आज का कृषि पूर्वानुमान और कार्य सूची यहाँ उपलब्ध है।',
    en: 'Your farm overview, weather and agricultural tasks.'
  };

  const quickActions = [
    {
      title: 'Diagnose Crop Disease',
      desc: 'Snap leaf photo for AI analysis',
      icon: Stethoscope,
      link: '/plant-doctor',
      color: 'bg-emerald-600'
    },
    {
      title: 'Ask AI Assistant',
      desc: 'Kannada, Hindi & English advisory',
      icon: Bot,
      link: '/assistant',
      color: 'bg-green-800'
    },
    {
      title: 'Crop Recommendations',
      desc: 'Soil and climate matched crops',
      icon: Compass,
      link: '/crop-advisor',
      color: 'bg-amber-600'
    },
    {
      title: 'Irrigation Guidance',
      desc: 'Optimized watering schedule',
      icon: Droplets,
      link: '/irrigation',
      color: 'bg-sky-600'
    }
  ];

  return (
    <div className="space-y-6">

      {/* WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-950 via-green-900 to-emerald-950 p-6 sm:p-8 text-white shadow-xl">

        <Sparkles className="absolute right-6 top-5 h-32 w-32 text-emerald-300 opacity-10" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-800/40 px-3 py-1 text-xs text-emerald-200">
            <Sparkles className="h-3 w-3" />
            Smart Advisory Hub • KrishiMitra AI
          </span>

          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
            {greetings[language]}
          </h1>

          <p className="mt-2 text-sm text-emerald-100">
            {subtitles[language]}
          </p>
        </div>

        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-800 pt-4 text-xs">

          <div className="flex flex-wrap gap-3">

            <div className="flex items-center gap-2 rounded-lg border border-green-700 bg-green-900 px-3 py-2">
              <Server className="h-4 w-4" />
              Backend API:
              <strong className={
                health?.status === 'ok'
                  ? 'text-emerald-300'
                  : 'text-amber-300'
              }>
                {backendLoading
                  ? 'Connecting...'
                  : health?.status === 'ok'
                    ? 'Online'
                    : 'Standalone Mode'}
              </strong>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-green-700 bg-green-900 px-3 py-2">
              <Database className="h-4 w-4" />
              Supabase:
              <strong className="text-emerald-300">
                {isDemoUser
                  ? 'Demo Mode'
                  : isSupabaseConfigured
                    ? 'Configured'
                    : 'Not Configured'}
              </strong>
            </div>
          </div>

          <span className="rounded-lg bg-emerald-950 px-3 py-2">
            📍 {farmerDistrict}, {farmerState}
          </span>
        </div>
      </div>

      {/* DATABASE WARNING */}
      {dbError && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <span>{dbError}</span>
          </div>
          <button
            onClick={() => void loadReports()}
            className="flex items-center gap-1 font-semibold"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map(action => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.link}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-green-400 hover:shadow-md"
            >
              <div>
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-white ${action.color}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-bold text-slate-900">
                  {action.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {action.desc}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1 border-t border-slate-100 pt-3 text-xs font-semibold text-green-800">
                Open tool
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* MAIN DASHBOARD */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-7">

          {/* WEATHER */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <CloudSun className="h-5 w-5 text-amber-500" />
                Agricultural Weather: {farmerDistrict}
              </h3>

              <Link
                to="/weather"
                className="text-xs font-semibold text-green-800"
              >
                View Forecast →
              </Link>
            </div>

            <p className="mt-4 text-sm text-slate-600">
              Open the Weather Dashboard for agricultural
              weather conditions and forecasts.
            </p>

            <Link
              to="/weather"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-xs font-semibold text-green-800"
            >
              <CloudSun className="h-4 w-4" />
              Check Weather
            </Link>
          </div>

          {/* REPORTS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <FileText className="h-5 w-5 text-green-700" />
                Recent AI Advisory Reports
              </h3>

              <Link
                to="/history"
                className="text-xs font-semibold text-green-800"
              >
                View All Reports →
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {reports.length > 0 ? (
                reports.map(report => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {report.crop_name || 'Crop Advisory'}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {report.report_type.replace('_', ' ')}
                      </p>

                      <p className="text-xs text-slate-400">
                        {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <Link
                      to="/history"
                      className="text-xs font-semibold text-green-700"
                    >
                      View →
                    </Link>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center">
                  <p className="text-xs text-slate-500">
                    No previous reports found.
                  </p>

                  <Link
                    to="/plant-doctor"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-800"
                  >
                    Run Plant Doctor Diagnostic
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:col-span-5">

          {/* FARM TASKS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <CalendarCheck className="h-5 w-5 text-green-700" />
                Farming Tasks (Field Planner)
              </h3>

              <Link
                to="/farm-planner"
                className="flex items-center gap-1 text-xs font-semibold text-green-800"
              >
                Manage
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-4 space-y-3">

              {tasks.length > 0 ? (
                tasks.map(task => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleTask(task)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${task.status === 'completed'
                        ? 'border-green-200 bg-green-50'
                        : 'border-slate-200 bg-slate-50 hover:border-green-400'
                      }`}
                  >
                    <CheckCircle2
                      className={`mt-0.5 h-5 w-5 shrink-0 ${task.status === 'completed'
                          ? 'text-green-600'
                          : 'text-slate-400'
                        }`}
                    />

                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold ${task.status === 'completed'
                          ? 'text-slate-400 line-through'
                          : 'text-slate-800'
                        }`}>
                        {task.title}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" />

                        <span>
                          {new Date(
                            `${task.dueDate}T12:00:00`
                          ).toLocaleDateString()}
                        </span>

                        <span>•</span>
                        <span>{task.category}</span>
                      </div>

                      <span className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-semibold ${task.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                        }`}>
                        {task.status === 'completed'
                          ? 'Completed'
                          : 'Pending'}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-5 text-center">
                  <p className="text-xs text-slate-500">
                    No tasks currently scheduled.
                  </p>

                  <Link
                    to="/farm-planner"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-green-800"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create Your First Farm Task
                  </Link>
                </div>
              )}
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Tasks sync with your Farming Action Planner
              in this browser.
            </p>
          </div>

          {/* AI ASSISTANT */}
          <div className="space-y-4 rounded-2xl border border-green-800 bg-green-900 p-6 text-white shadow-md">

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-800 p-3">
                <Bot className="h-6 w-6" />
              </div>

              <div>
                <h4 className="font-bold">
                  Agricultural Assistant
                </h4>

                <p className="text-xs text-emerald-200">
                  ಕನ್ನಡ, हिन्दी, English
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-emerald-100">
              Ask about pest control, crop rotation,
              irrigation, fertilizers and farming guidance.
            </p>

            <Link
              to="/assistant"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-xs font-semibold transition hover:bg-green-500"
            >
              Launch Voice / Chat Assistant
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
