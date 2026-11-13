import { SupabaseClient } from '@supabase/supabase-js';
import { executeStructuredGeminiRequest } from '../utils/geminiHelper.js';
import { getIrrigationAdvisoryPrompt } from '../prompts/agriculture.prompts.js';
import {
  irrigationResponseSchema,
  irrigationInputSchema,
} from '../schemas/index.js';
import { z } from 'zod';
import { getSupabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

type IrrigationInput = z.infer<typeof irrigationInputSchema>;

export class IrrigationAdvisoryService {
  static async generateIrrigationGuidance(
    input: IrrigationInput,
    userId: string,
    client?: SupabaseClient
  ) {
    const prompt = getIrrigationAdvisoryPrompt(input);
    const aiResult = await executeStructuredGeminiRequest({
      prompt,
      schema: irrigationResponseSchema,
    });

    let savedRecord: any = null;

    if (isSupabaseConfigured()) {
      const db = client || getSupabaseAdmin();
      const { data, error } = await db
        .from('irrigation_advisories')
        .insert({
          user_id: userId,
          crop_name: input.cropName,
          growth_stage: input.growthStage,
          soil_type: input.soilType,
          irrigation_type: input.irrigationType,
          water_availability: input.waterAvailability,
          advisory: aiResult,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving irrigation advisory to database:', error);
      } else {
        savedRecord = data;

        await db.from('farming_activities').insert({
          user_id: userId,
          crop_name: input.cropName,
          activity_type: 'IRRIGATION_ADVISORY',
          description: `Generated irrigation schedule advisory for ${input.cropName} (${input.irrigationType})`,
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

  static async listUserIrrigations(userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return [];
    }
    const db = client || getSupabaseAdmin();
    const { data, error } = await db
      .from('irrigation_advisories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getIrrigationById(id: string, userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return null;
    }
    const db = client || getSupabaseAdmin();
    const { data, error } = await db
      .from('irrigation_advisories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }
}
