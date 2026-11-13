import { SupabaseClient } from '@supabase/supabase-js';
import { executeStructuredGeminiRequest } from '../utils/geminiHelper.js';
import { getCropAdvisoryPrompt } from '../prompts/agriculture.prompts.js';
import {
  cropAdvisoryResponseSchema,
  cropAdvisoryInputSchema,
} from '../schemas/index.js';
import { z } from 'zod';
import { GEMINI_MODEL } from '../config/gemini.js';
import { getSupabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

type CropAdvisoryInput = z.infer<typeof cropAdvisoryInputSchema>;

export class CropAdvisoryService {
  static async generateAdvisory(
    input: CropAdvisoryInput,
    userId: string,
    client?: SupabaseClient
  ) {
    const prompt = getCropAdvisoryPrompt(input);
    const aiResult = await executeStructuredGeminiRequest({
      prompt,
      schema: cropAdvisoryResponseSchema,
    });

    let savedRecord: any = null;

    if (isSupabaseConfigured()) {
      const db = client || getSupabaseAdmin();
      const { data, error } = await db
        .from('crop_advisories')
        .insert({
          user_id: userId,
          crop_name: input.cropName,
          crop_variety: input.cropVariety,
          sowing_date: input.sowingDate || null,
          growth_stage: input.growthStage,
          soil_type: input.soilType,
          irrigation_type: input.irrigationType,
          location: input.location || null,
          advisory: aiResult,
          ai_model: GEMINI_MODEL,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving crop advisory to database:', error);
      } else {
        savedRecord = data;

        // Log farming activity
        await db.from('farming_activities').insert({
          user_id: userId,
          crop_name: input.cropName,
          activity_type: 'CROP_ADVISORY',
          description: `Generated cultivation guidance for ${input.cropName}`,
        });
      }
    }

    return {
      id: savedRecord?.id || 'temp-' + Date.now(),
      input,
      aiResult,
      createdAt: savedRecord?.created_at || new Date().toISOString(),
    };
  }

  static async listUserAdvisories(userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return [];
    }
    const db = client || getSupabaseAdmin();
    const { data, error } = await db
      .from('crop_advisories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getAdvisoryById(id: string, userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return null;
    }
    const db = client || getSupabaseAdmin();
    const { data, error } = await db
      .from('crop_advisories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteAdvisory(id: string, userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return true;
    }
    const db = client || getSupabaseAdmin();
    const { error } = await db
      .from('crop_advisories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
}
