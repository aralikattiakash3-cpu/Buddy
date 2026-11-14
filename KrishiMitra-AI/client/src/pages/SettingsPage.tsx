import React from 'react';
import { Settings, Globe, Bell, Shield } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center">
            <Settings className="w-6 h-6 text-leaf-light" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Application Settings</h1>
            <p className="text-xs text-slate-500">Language, notification preferences, and privacy controls</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs divide-y divide-slate-100">
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-forest-700" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Default Language</h3>
              <p className="text-xs text-slate-500">Preferred language for AI assistant voice and text</p>
            </div>
          </div>
          <select className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium">
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-forest-700" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Weather Alert Notifications</h3>
              <p className="text-xs text-slate-500">Receive alerts before rainfall or sudden temperature shifts</p>
            </div>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-forest-700 rounded cursor-pointer" />
        </div>

        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-forest-700" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Privacy & Data Isolation</h3>
              <p className="text-xs text-slate-500">Supabase Row-Level Security active on your farm logs</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-100 text-emerald-800">
            Protected
          </span>
        </div>
      </div>
    </div>
  );
};
