
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Stethoscope,
  Compass,
  CloudSun,
  Layers,
  Droplets,
  CalendarCheck,
  History,
  User,
  Settings,
  Sprout,
  LogOut,
  TrendingUp,
  Landmark,
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onCloseMobile,
}) => {
  const { user, profile, signOut, isDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully.');
    navigate('/');
  };

  const farmerName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    'Kisan Bandhu';

  const farmerLocation = `${profile?.district || 'Dharwad'
    }, ${profile?.state || 'Karnataka'}`;

  const initials =
    farmerName
      .split(' ')
      .map((n: string) => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'KM';

  const navItems = [
    {
      label: 'Farmer Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'AI Farming Assistant',
      path: '/assistant',
      icon: Bot,
      badge: 'Voice',
    },
    {
      label: 'AI Plant Doctor',
      path: '/plant-doctor',
      icon: Stethoscope,
    },
    {
      label: 'Crop Advisor',
      path: '/crop-advisor',
      icon: Compass,
    },
    {
      label: 'Weather Dashboard',
      path: '/weather',
      icon: CloudSun,
    },
    {
      label: 'Soil Health Advisor',
      path: '/soil-advisor',
      icon: Layers,
    },
    {
      label: 'Irrigation Guidance',
      path: '/irrigation',
      icon: Droplets,
    },

    // NEW FEATURE 1
    {
      label: 'Mandi Market Prices',
      path: '/market-prices',
      icon: TrendingUp,
    },

    // NEW FEATURE 2
    {
      label: 'Government Schemes',
      path: '/government-schemes',
      icon: Landmark,
    },

    {
      label: 'Farming Action Planner',
      path: '/farm-planner',
      icon: CalendarCheck,
    },
    {
      label: 'Previous Reports',
      path: '/history',
      icon: History,
    },
  ];

  const secondaryNavItems = [
    {
      label: 'Farmer Profile',
      path: '/profile',
      icon: User,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-forest-950 text-white flex flex-col h-full border-r border-forest-900 shadow-xl select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-forest-900 flex items-center justify-between">
        <Link
          to="/"
          onClick={onCloseMobile}
          className="flex items-center space-x-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-white shadow-md group-hover:bg-forest-700 transition">
            <Sprout className="w-5 h-5 text-leaf-light" />
          </div>

          <div>
            <h1 className="font-bold text-lg tracking-tight text-white flex items-center">
              Krishi
              <span className="text-leaf-light">
                Mitra
              </span>
              <span className="ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-forest-800 text-leaf-light">
                AI
              </span>
            </h1>

            <p className="text-[10px] text-slate-400">
              Smart Farming Suite
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-forest-300/70">
            Farming Intelligence
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-forest-800 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-forest-900 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className="w-4 h-4 text-leaf-light flex-shrink-0" />
                    <span className="truncate">
                      {item.label}
                    </span>
                  </div>

                  {'badge' in item && item.badge && (
                    <span className="text-[10px] bg-leaf-dark/30 text-leaf-light font-semibold px-1.5 py-0.5 rounded-full border border-leaf-dark/50">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-forest-300/70">
            Account & Preferences
          </div>

          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-forest-800 text-white font-semibold'
                      : 'text-slate-300 hover:bg-forest-900 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="truncate">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile & Exit */}
      <div className="p-3 border-t border-forest-900 bg-forest-950/80">
        <div className="flex items-center justify-between p-2 rounded-lg bg-forest-900/60 border border-forest-800">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-forest-700 flex items-center justify-center font-bold text-xs text-white">
              {initials}
            </div>

            <div className="truncate">
              <div className="flex items-center space-x-1">
                <p className="text-xs font-semibold text-white truncate">
                  {farmerName}
                </p>

                {isDemoUser && (
                  <span className="text-[9px] bg-amber-500/30 text-amber-300 px-1 py-0.5 rounded font-mono">
                    Demo
                  </span>
                )}
              </div>

              <p className="text-[10px] text-leaf-light truncate">
                {farmerLocation}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-md hover:bg-forest-800 transition"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
