import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { UserProfile } from '../types';
import { PageLoader } from '../components/common/Loader';
import { toast } from 'sonner';
import { User, MapPin, Wheat, Phone } from 'lucide-react';
import {
  indianStates, karnatakaDistricts, farmingExperienceOptions, farmingTypes, landUnits
} from '../utils/constants';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().max(20).optional().or(z.literal('')),
  state: z.string().max(100).optional().or(z.literal('')),
  district: z.string().max(100).optional().or(z.literal('')),
  village: z.string().max(100).optional().or(z.literal('')),
  preferredLanguage: z.enum(['en', 'kn', 'hi']),
  farmingExperience: z.string().optional().or(z.literal('')),
  landArea: z.preprocess(v => v === '' || v === null || v === undefined ? undefined : Number(v),
    z.number().nonnegative().max(100000).optional()),
  landUnit: z.string().optional().or(z.literal('')),
  farmingType: z.string().optional().or(z.literal('')),
});
type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { preferredLanguage: 'en' },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get<UserProfile>('/profile');
        setProfile(data);
        if (data) {
          reset({
            fullName: data.full_name,
            phone: data.phone || '',
            state: data.state || '',
            district: data.district || '',
            village: data.village || '',
            preferredLanguage: (data.preferred_language as 'en' | 'kn' | 'hi') || 'en',
            farmingExperience: data.farming_experience || '',
            landArea: data.land_area || undefined,
            landUnit: data.land_unit || '',
            farmingType: data.farming_type || '',
          });
        }
      } catch {
        // Profile may not exist yet
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        fullName: data.fullName,
        phone: data.phone || null,
        state: data.state || null,
        district: data.district || null,
        village: data.village || null,
        preferredLanguage: data.preferredLanguage,
        farmingExperience: data.farmingExperience || null,
        landArea: data.landArea ?? null,
        landUnit: data.landUnit || null,
        farmingType: data.farmingType || null,
      };
      const updated = await api.put<UserProfile>('/profile', payload);
      setProfile(updated);
      toast.success('Farmer profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
    }
  };

  if (loading) return <PageLoader text="Loading your profile..." />;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800">Farmer Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Your location and farm details help us give better recommendations</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Info */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-green-700" />
            <h2 className="font-bold text-slate-700">Personal Information</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Full Name *</label>
              <input {...register('fullName')} className={`input-field ${errors.fullName ? 'input-error' : ''}`} />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="label-field">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input {...register('phone')} type="tel" placeholder="+91 9876543210" className="input-field pl-9" />
              </div>
            </div>
            <div>
              <label className="label-field">Email</label>
              <input value={user?.email || ''} disabled className="input-field bg-slate-50 text-slate-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="label-field">Preferred Language</label>
              <select {...register('preferredLanguage')} className="input-field">
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-green-700" />
            <h2 className="font-bold text-slate-700">Farming Location</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">State</label>
              <select {...register('state')} className="input-field">
                <option value="">Select State</option>
                {indianStates.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">District</label>
              <input {...register('district')} placeholder="e.g., Dharwad, Mysuru" className="input-field" />
            </div>
            <div>
              <label className="label-field">Village / Taluk (Optional)</label>
              <input {...register('village')} placeholder="e.g., Hubli, Haveri" className="input-field" />
            </div>
          </div>
        </div>

        {/* Farm Info */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wheat className="w-4 h-4 text-green-700" />
            <h2 className="font-bold text-slate-700">Farm Details</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Farming Experience</label>
              <select {...register('farmingExperience')} className="input-field">
                <option value="">Select Experience</option>
                {farmingExperienceOptions.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Farming Type</label>
              <select {...register('farmingType')} className="input-field">
                <option value="">Select Type</option>
                {farmingTypes.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Total Land Area</label>
              <input {...register('landArea')} type="number" step="0.01" min="0" placeholder="e.g., 2.5" className="input-field" />
            </div>
            <div>
              <label className="label-field">Land Unit</label>
              <select {...register('landUnit')} className="input-field">
                <option value="">Select Unit</option>
                {landUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
