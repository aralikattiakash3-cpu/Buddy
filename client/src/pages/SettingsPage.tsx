import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';
import { Settings, Globe, Shield, User, LogOut, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    toast.success(`Language set to ${lang === 'kn' ? 'ಕನ್ನಡ (Kannada)' : lang === 'hi' ? 'हिन्दी (Hindi)' : 'English'}`);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-slate-700" />
          <h1 className="text-2xl font-black text-slate-800">Settings</h1>
        </div>
        <p className="text-slate-500 text-sm">Manage your application preferences and farmer account</p>
      </div>

      <div className="space-y-5">
        {/* Language Selection */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-green-700" />
            <h2 className="font-bold text-slate-800">Preferred Language</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Select the language in which you prefer to view agricultural advisories, chat responses, and notifications.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'en', label: 'English', sub: 'Standard Advisory' },
              { id: 'kn', label: 'ಕನ್ನಡ', sub: 'Kannada' },
              { id: 'hi', label: 'हिन्दी', sub: 'Hindi' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleLanguageChange(item.id as Language)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  language === item.id
                    ? 'border-green-600 bg-green-50 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`font-bold text-base ${language === item.id ? 'text-green-800' : 'text-slate-800'}`}>
                  {item.label}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{item.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Account Details */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-slate-700" />
            <h2 className="font-bold text-slate-800">Account Information</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Email Address:</span>
              <span className="font-medium text-slate-800">{user?.email || 'Not available'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Account Role:</span>
              <span className="badge-green text-xs">Registered Farmer</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500">Data Privacy:</span>
              <span className="text-xs text-slate-600">Isolated via Supabase Row-Level Security</span>
            </div>
          </div>
        </div>

        {/* Advisory Security Notice */}
        <div className="card p-5 bg-slate-50 border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-green-700" />
            <h3 className="font-bold text-sm text-slate-800">Privacy & Data Isolation</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your farm location, soil data, and crop photos are strictly isolated using PostgreSQL Row-Level Security (RLS).
            Crop health images are stored in a private bucket accessible only by your authenticated account.
          </p>
        </div>

        {/* Sign Out */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleLogout}
            className="btn-danger text-sm py-2 px-4 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
