
import React, { useEffect, useState } from 'react';
import { User, Save, CheckCircle2 } from 'lucide-react';

type FarmerProfile = {
  fullName: string;
  phone: string;
  state: string;
  district: string;
};

const STORAGE_KEY = 'krishimitra_farmer_profile';

const defaultProfile: FarmerProfile = {
  fullName: 'Basavaraj Patil',
  phone: '+91 98765 43210',
  state: 'Karnataka',
  district: 'Dharwad',
};

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<FarmerProfile>(
    defaultProfile
  );

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEY);

      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);

        setProfile({
          ...defaultProfile,
          ...parsed,
        });
      }
    } catch (error) {
      console.error('Failed to load farmer profile:', error);
    }
  }, []);

  const handleChange = (
    field: keyof FarmerProfile,
    value: string
  ) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(profile)
      );

      setSaved(true);
    } catch (error) {
      console.error('Failed to save farmer profile:', error);
      alert('Unable to save profile. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center">
            <User className="w-6 h-6 text-leaf-light" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Farmer Profile
            </h1>

            <p className="text-xs text-slate-500">
              Manage your farm location, contact details,
              and preferred language
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Full Name
            </label>

            <input
              type="text"
              value={profile.fullName}
              onChange={(e) =>
                handleChange('fullName', e.target.value)
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-forest-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Phone Number
            </label>

            <input
              type="tel"
              value={profile.phone}
              onChange={(e) =>
                handleChange('phone', e.target.value)
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-forest-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              State
            </label>

            <input
              type="text"
              value={profile.state}
              onChange={(e) =>
                handleChange('state', e.target.value)
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-forest-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              District
            </label>

            <input
              type="text"
              value={profile.district}
              onChange={(e) =>
                handleChange('district', e.target.value)
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-forest-700"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs shadow transition"
          >
            <Save className="w-4 h-4 text-leaf-light" />
            <span>Save Profile Changes</span>
          </button>

          {saved && (
            <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              Profile saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
