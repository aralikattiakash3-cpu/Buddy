import { Request, Response, NextFunction } from 'express';
import { profileUpdateSchema } from '../schemas/index.js';
import { getSupabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

export class ProfileController {
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      if (!isSupabaseConfigured()) {
        res.json({
          success: true,
          message: 'Profile retrieved (development placeholder)',
          data: {
            id: userId,
            full_name: 'Demo Farmer',
            email: req.user?.email || 'farmer@example.com',
            preferred_language: 'en',
            state: 'Karnataka',
            district: 'Dharwad',
          },
          error: null,
        });
        return;
      }

      const db = req.scopedSupabase || getSupabaseAdmin();
      const { data, error } = await db
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: data || null,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const validatedData = profileUpdateSchema.parse(req.body);

      if (!isSupabaseConfigured()) {
        res.json({
          success: true,
          message: 'Profile updated (development placeholder)',
          data: {
            id: userId,
            ...validatedData,
          },
          error: null,
        });
        return;
      }

      const db = req.scopedSupabase || getSupabaseAdmin();

      const profilePayload = {
        id: userId,
        full_name: validatedData.fullName,
        phone: validatedData.phone,
        state: validatedData.state,
        district: validatedData.district,
        village: validatedData.village,
        preferred_language: validatedData.preferredLanguage,
        farming_experience: validatedData.farmingExperience,
        land_area: validatedData.landArea,
        land_unit: validatedData.landUnit,
        farming_type: validatedData.farmingType,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await db
        .from('profiles')
        .upsert(profilePayload)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        message: 'Farmer profile updated successfully',
        data,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}
