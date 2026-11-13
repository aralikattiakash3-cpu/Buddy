import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  preferredLanguage: z.enum(['en', 'kn', 'hi']).default('en'),
  termsAccepted: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms to register' }) }),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { signUp, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = React.useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { preferredLanguage: 'en' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signUp(data.email, data.password, data.fullName, data.preferredLanguage);
      toast.success('Account created! Please check your email to confirm, then login.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-green-800 text-xl">KrishiSeva AI</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-800">Create Farmer Account</h1>
          <p className="text-slate-500 text-sm mt-1">Start getting AI-powered agricultural advice</p>
        </div>

        {!isConfigured && (
          <div className="alert-warning mb-6 text-sm">
            <strong>Setup Required: </strong>
            Supabase authentication is not configured. Please add your credentials to <code className="font-mono bg-amber-100 px-1 rounded">client/.env</code>.
          </div>
        )}

        <div className="card p-6 shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label-field">Full Name *</label>
              <input
                {...register('fullName')}
                type="text"
                placeholder="e.g., Ramesh Kumar"
                className={`input-field ${errors.fullName ? 'input-error' : ''}`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="label-field">Email Address *</label>
              <input
                {...register('email')}
                type="email"
                placeholder="farmer@example.com"
                className={`input-field ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label-field">Password *</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label-field">Confirm Password *</label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Re-enter your password"
                className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div>
              <label className="label-field">Preferred Language</label>
              <select {...register('preferredLanguage')} className="input-field">
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            <div className="flex items-start gap-3 mt-2">
              <input
                {...register('termsAccepted')}
                type="checkbox"
                id="terms"
                className="mt-0.5 w-4 h-4 accent-green-700"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed">
                I agree that advisory content is for decision-support only and does not replace certified agricultural officer guidance.
              </label>
            </div>
            {errors.termsAccepted && <p className="text-red-500 text-xs">{errors.termsAccepted.message}</p>}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
              {isSubmitting ? 'Creating Account...' : 'Create Farmer Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-green-700 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
