import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Menu, Globe, Bell, Sparkles } from 'lucide-react';
import { Toaster } from 'sonner';

export const DashboardLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'kn' | 'hi' | 'en'>('kn');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-forest-950 z-10 shadow-2xl">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-forest-900">
                KrishiMitra AI Portal
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-leaf-light/30 text-forest-800 border border-forest-200">
                <Sparkles className="w-3 h-3 mr-1 text-leaf-dark" />
                Live AI v2.5
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Language toggle */}
            <div className="flex items-center bg-cream-100 rounded-lg p-1 border border-forest-200">
              <Globe className="w-3.5 h-3.5 text-forest-700 ml-1.5 mr-1" />
              <button
                onClick={() => setCurrentLang('kn')}
                className={`text-xs px-2 py-0.5 rounded font-medium transition ${
                  currentLang === 'kn' ? 'bg-forest-800 text-white' : 'text-slate-600'
                }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => setCurrentLang('hi')}
                className={`text-xs px-2 py-0.5 rounded font-medium transition ${
                  currentLang === 'hi' ? 'bg-forest-800 text-white' : 'text-slate-600'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setCurrentLang('en')}
                className={`text-xs px-2 py-0.5 rounded font-medium transition ${
                  currentLang === 'en' ? 'bg-forest-800 text-white' : 'text-slate-600'
                }`}
              >
                EN
              </button>
            </div>

            {/* Notification button */}
            <button 
              className="relative p-2 rounded-lg text-slate-500 hover:text-forest-800 hover:bg-slate-100 transition"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-leaf-DEFAULT ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* Page Content scrollable */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ language: currentLang }} />
          </div>
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
};
