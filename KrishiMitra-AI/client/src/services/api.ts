
import type { HealthStatus } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async checkHealth(): Promise<HealthStatus> {
    const response = await fetch(`${this.baseUrl}/health`);

    if (!response.ok) {
      throw new Error(
        `Health check failed with status: ${response.status}`
      );
    }

    return response.json();
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase is not configured. Check client/.env.'
      );
    }

    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    if (!session?.access_token) {
      throw new Error(
        'Please sign in to KrishiMitra AI before using this feature.'
      );
    }

    const headers = new Headers(options.headers);

    headers.set(
      'Authorization',
      `Bearer ${session.access_token}`
    );

    if (
      options.body &&
      !(options.body instanceof FormData) &&
      !headers.has('Content-Type')
    ) {
      headers.set('Content-Type', 'application/json');
    }

    const path = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;

    const response = await fetch(
      `${this.baseUrl}${path}`,
      {
        ...options,
        headers
      }
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);

      throw new Error(
        errorBody?.message ||
        errorBody?.error ||
        `API request failed (${response.status})`
      );
    }

    return response.json() as Promise<T>;
  }
}

export const api = new ApiService(API_BASE_URL);
