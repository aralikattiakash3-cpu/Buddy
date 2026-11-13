import { SupabaseClient } from '@supabase/supabase-js';
import { executeStructuredGeminiRequest } from '../utils/geminiHelper.js';
import { getFertilizerAdvisoryPrompt } from '../prompts/agriculture.prompts.js';
import {
  fertilizerResponseSchema,
  fertilizerInputSchema,
} from '../schemas/index.js';
import { z } from 'zod';
import { getSupabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

type FertilizerInput = z.infer<typeof fertilizerInputSchema>;

export class FertilizerAdvisoryService {
  static async generateFertilizerGuidance(
    input: FertilizerInput,
    userId: string,
    client?: SupabaseClient
  ) {
    const prompt = getFertilizerAdvisoryPrompt(input);
    const aiResult = await executeStructuredGeminiRequest({
      prompt,
      schema: fertilizerResponseSchema,
    });

    let savedRecord: any = null;

    if (isSupabaseConfigured()) {
      const db = client || getSupabaseAdmin();
      const { data, error } = await db
        .from('fertilizer_advisories')
        .insert({
          user_id: userId,
          crop_name: input.cropName,
          growth_stage: input.growthStage,
          soil_type: input.soilType,
          soil_ph: input.soilPh,
          nitrogen: input.nitrogen,
          phosphorus: input.phosphorus,
          potassium: input.potassium,
          advisory: aiResult,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving fertilizer advisory to database:', error);
      } else {
        savedRecord = data;

        await db.from('farming_activities').insert({
          user_id: userId,
          crop_name: input.cropName,
          activity_type: 'FERTILIZER_ADVISORY',
          description: `Generated nutrient management advisory for ${input.cropName} (${input.growthStage})`,
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

  static async listUserFertilizers(userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return [];
    }
    const db = client || getSupabaseAdmin();
    const { data, error } = await db
      .from('fertilizer_advisories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getFertilizerById(id: string, userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return null;
    }
    const db = client || getSupabaseAdmin();
    const { data, error } = await db
      .from('fertilizer_advisories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }
}
