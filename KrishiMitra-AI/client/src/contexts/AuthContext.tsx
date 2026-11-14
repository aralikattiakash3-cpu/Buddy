import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { UserProfile, SupportedLanguage } from '../types';

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  state?: string;
  district?: string;
  preferredLanguage?: SupportedLanguage;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  isDemoUser: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (data: SignUpData) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  enableDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = 'krishimitra_demo_user';
const DEMO_PROFILE: UserProfile = {
  id: 'demo-farmer-id-12345',
  full_name: 'Basavaraj Patil',
  phone: '+91 98765 43210',
  state: 'Karnataka',
  district: 'Dharwad',
  preferred_language: 'kn',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  // Fetch farmer profile from Supabase 'profiles' table with graceful fallback to user metadata
  const fetchProfile = async (userId: string, currentUser?: User | null) => {
    if (!isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Table may not have been created yet or profile trigger pending: fall back to user_metadata
        console.warn('Could not load profile from database table:', error.message);
        if (currentUser?.user_metadata) {
          const meta = currentUser.user_metadata;
          setProfile({
            id: userId,
            full_name: meta.full_name || 'Farmer',
            phone: meta.phone || '',
            state: meta.state || 'Karnataka',
            district: meta.district || 'Dharwad',
            preferred_language: meta.preferred_language || 'kn',
            created_at: currentUser.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
        return;
      }

      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (err) {
      console.warn('Exception while fetching user profile:', err);
    }
  };

  useEffect(() => {
    // Check if demo user is active in localStorage
    const savedDemo = localStorage.getItem(DEMO_USER_KEY);
    if (savedDemo === 'true') {
      setIsDemoUser(true);
      setUser({
        id: DEMO_PROFILE.id,
        email: 'basavaraj.patil@krishimitra.in',
        app_metadata: {},
        user_metadata: { full_name: DEMO_PROFILE.full_name },
        aud: 'authenticated',
        created_at: DEMO_PROFILE.created_at,
      } as User);
      setProfile(DEMO_PROFILE);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Get initial Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id, session.user);
      }
      setLoading(false);
    });

    // Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: new Error(
          'Supabase credentials are not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in client/.env, or use Demo Mode to test immediately.'
        ),
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      if (data.user) {
        setUser(data.user);
        localStorage.removeItem(DEMO_USER_KEY);
        setIsDemoUser(false);
        await fetchProfile(data.user.id, data.user);
      }

      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      return { error: new Error(message) };
    }
  };

  const signUp = async (data: SignUpData) => {
    if (!isSupabaseConfigured) {
      return {
        error: new Error(
          'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in client/.env.'
        ),
      };
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone || '',
            state: data.state || 'Karnataka',
            district: data.district || 'Dharwad',
            preferred_language: data.preferredLanguage || 'kn',
          },
        },
      });

      if (authError) {
        return { error: new Error(authError.message) };
      }

      if (authData.user) {
        setUser(authData.user);
        localStorage.removeItem(DEMO_USER_KEY);
        setIsDemoUser(false);

        // Attempt direct profile insertion in case trigger hasn't been created in Supabase yet
        try {
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            full_name: data.fullName,
            phone: data.phone,
            state: data.state || 'Karnataka',
            district: data.district || 'Dharwad',
            preferred_language: data.preferredLanguage || 'kn',
            updated_at: new Date().toISOString(),
          });
        } catch {
          // Trigger or manual table insertion optional
        }

        await fetchProfile(authData.user.id, authData.user);
      }

      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      return { error: new Error(message) };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(DEMO_USER_KEY);
    setIsDemoUser(false);
    setUser(null);
    setProfile(null);

    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user);
    }
  };

  const enableDemoMode = () => {
    localStorage.setItem(DEMO_USER_KEY, 'true');
    setIsDemoUser(true);
    setUser({
      id: DEMO_PROFILE.id,
      email: 'basavaraj.patil@krishimitra.in',
      app_metadata: {},
      user_metadata: { full_name: DEMO_PROFILE.full_name },
      aud: 'authenticated',
      created_at: DEMO_PROFILE.created_at,
    } as User);
    setProfile(DEMO_PROFILE);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        isDemoUser,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        enableDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
