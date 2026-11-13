import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  LayoutDashboard, Sprout, BookOpen, Bug, FlaskConical, Droplets,
  MessageCircle, History, User, Settings, LogOut, Leaf, Menu, X, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { to: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { to: '/crop-recommendation', labelKey: 'cropRecommendation', icon: Sprout },
  { to: '/crop-advisory', labelKey: 'cropAdvisory', icon: BookOpen },
  { to: '/disease-detection', labelKey: 'diseaseDetection', icon: Bug },
  { to: '/fertilizer-advisory', labelKey: 'fertilizerAdvisory', icon: FlaskConical },
  { to: '/irrigation-advisory', labelKey: 'irrigationAdvisory', icon: Droplets },
  { to: '/ai-chatbot', labelKey: 'aiChatbot', icon: MessageCircle },
  { to: '/history', labelKey: 'advisoryHistory', icon: History },
];

const bottomItems = [
  { to: '/profile', labelKey: 'farmerProfile', icon: User },
  { to: '/settings', labelKey: 'settings', icon: Settings },
];

export default function DashboardLayout() {
  const { signOut, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed. Please try again.');
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center shadow-sm">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-green-800">{t('appName')}</div>
            <div className="text-xs text-slate-500">Kisan AI Assistant</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Advisory Tools
        </p>
        {navItems.map(({ to, labelKey, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{t(labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-3 border-t border-slate-100 space-y-0.5">
        {bottomItems.map(({ to, labelKey, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{t(labelKey)}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>{t('logout')}</span>
        </button>
      </div>

      {/* User info */}
      {user?.email && (
        <div className="px-4 py-3 bg-green-50 border-t border-slate-100">
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
          <p className="text-xs font-medium text-green-700 mt-0.5">Signed in as Farmer</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-200 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 flex flex-col w-72 max-w-[85vw] h-full bg-white shadow-2xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-600 hover:text-slate-800 p-1"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-700 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-green-800 text-sm">{t('appName')}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
