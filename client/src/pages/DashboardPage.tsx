import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { DashboardSummary } from '../types';
import { PageLoader } from '../components/common/Loader';
import { EmptyState } from '../components/common/EmptyState';
import { ServiceUnavailableAlert } from '../components/common/Alert';
import {
  Sprout, Bug, Droplets, FlaskConical, MessageCircle, BarChart3,
  BookOpen, TrendingUp, Clock, ChevronRight, Activity
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isConfigured } = useAuth();
  const { t } = useLanguage();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get<DashboardSummary>('/dashboard/summary');
        setSummary(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const displayName = summary?.profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Farmer';

  const quickActions = [
    { to: '/crop-recommendation', icon: Sprout, label: 'Crop Recommendation', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
    { to: '/disease-detection', icon: Bug, label: 'Disease Detection', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
    { to: '/fertilizer-advisory', icon: FlaskConical, label: 'Fertilizer Advisory', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
    { to: '/irrigation-advisory', icon: Droplets, label: 'Irrigation Advisory', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { to: '/crop-advisory', icon: BookOpen, label: 'Cultivation Guide', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
    { to: '/ai-chatbot', icon: MessageCircle, label: 'Ask AI Chatbot', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
  ];

  const activityTypeLabels: Record<string, string> = {
    CROP_RECOMMENDATION: 'Crop Recommendation',
    CROP_ADVISORY: 'Cultivation Advisory',
    DISEASE_DETECTION: 'Disease Analysis',
    FERTILIZER_ADVISORY: 'Fertilizer Advisory',
    IRRIGATION_ADVISORY: 'Irrigation Advisory',
  };

  if (loading) return <PageLoader text="Loading your dashboard..." />;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800">
          ਜੈ ਕਿਸਾਨ! Welcome, {displayName} 🌾
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Your AI-powered agricultural advisory dashboard
        </p>
        {summary?.profile?.state && (
          <p className="text-xs text-green-700 mt-1 font-medium">
            📍 {summary.profile.district}, {summary.profile.state}
          </p>
        )}
      </div>

      {!isConfigured && (
        <ServiceUnavailableAlert
          service="Supabase"
          setupPath="server/.env"
        />
      )}

      {error && !summary && (
        <div className="alert-warning mb-6">
          Unable to load dashboard data: {error}. The backend API may not be running.
        </div>
      )}

      {/* Stats Row */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Advisories', value: summary.stats.totalAdvisories, icon: BarChart3, color: 'text-green-700' },
            { label: 'Crop Recommendations', value: summary.stats.cropRecommendationsCount, icon: Sprout, color: 'text-green-600' },
            { label: 'Disease Analyses', value: summary.stats.diseaseAnalysesCount, icon: Bug, color: 'text-red-600' },
            { label: 'AI Chats', value: summary.stats.chatSessionsCount, icon: MessageCircle, color: 'text-purple-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-2xl font-black text-slate-800">{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-slate-700 mb-3">Quick Advisory Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map(({ to, icon: Icon, label, color }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 p-4 rounded-xl font-medium text-sm transition-all ${color}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Advisories */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-700">Recent Advisories</h2>
            <Link to="/history" className="text-xs text-green-700 hover:underline font-medium flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {summary?.recentAdvisories?.length ? (
            <div className="space-y-3">
              {summary.recentAdvisories.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-green-50 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 text-green-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={TrendingUp}
              title="No advisory reports yet"
              description="Your generated crop, disease, and fertilizer reports will appear here."
            />
          )}
        </div>

        {/* Recent Activities */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-700">Recent Farm Activities</h2>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          {summary?.recentActivities?.length ? (
            <div className="space-y-3">
              {summary.recentActivities.slice(0, 6).map(activity => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">{activityTypeLabels[activity.activity_type] || activity.activity_type}</span>
                      {activity.crop_name && <span className="text-slate-500"> for {activity.crop_name}</span>}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span className="text-xs text-slate-400">
                        {new Date(activity.activity_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Activity}
              title="No activity recorded yet"
              description="Your farming advisory activities will be tracked here."
            />
          )}
        </div>
      </div>

      {/* Profile completion prompt */}
      {summary && !summary.profile?.state && (
        <div className="mt-5 alert-info">
          <p className="font-medium mb-1">Complete Your Farmer Profile</p>
          <p className="text-xs mb-3">Add your location, land details, and irrigation type to get better-tailored recommendations.</p>
          <Link to="/profile" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline">
            Update Profile <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
