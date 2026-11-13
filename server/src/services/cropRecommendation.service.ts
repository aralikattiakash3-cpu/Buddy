import { SupabaseClient } from '@supabase/supabase-js';
import { executeStructuredGeminiRequest } from '../utils/geminiHelper.js';
import { getCropRecommendationPrompt } from '../prompts/agriculture.prompts.js';
import {
  cropRecommendationResponseSchema,
  cropRecommendationInputSchema,
} from '../schemas/index.js';
import { z } from 'zod';
import { GEMINI_MODEL } from '../config/gemini.js';
import { getSupabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

type CropRecommendationInput = z.infer<typeof cropRecommendationInputSchema>;

export class CropRecommendationService {
  static async generateRecommendations(
    input: CropRecommendationInput,
    userId: string,
    client?: SupabaseClient
  ) {
    const prompt = getCropRecommendationPrompt(input);
    const aiResult = await executeStructuredGeminiRequest({
      prompt,
      schema: cropRecommendationResponseSchema,
    });

    let savedRecord: any = null;

    if (isSupabaseConfigured()) {
      const db = client || getSupabaseAdmin();
      const { data, error } = await db
        .from('crop_recommendations')
        .insert({
          user_id: userId,
          state: input.state,
          district: input.district,
          soil_type: input.soilType,
          soil_ph: input.soilPh,
          nitrogen: input.nitrogen,
          phosphorus: input.phosphorus,
          potassium: input.potassium,
          land_area: input.landArea,
          land_unit: input.landUnit,
          irrigation_type: input.irrigationType,
          water_availability: input.waterAvailability,
          season: input.season,
          farming_objective: input.farmingObjective,
          recommendations: aiResult,
          confidence: aiResult.confidence,
          ai_model: GEMINI_MODEL,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving crop recommendation to database:', error);
      } else {
        savedRecord = data;

        // Log farming activity
        await db.from('farming_activities').insert({
          user_id: userId,
          crop_name: aiResult.recommendations[0]?.cropName || 'Multiple crops',
          activity_type: 'CROP_RECOMMENDATION',
          description: `Generated ${aiResult.recommendations.length} crop recommendations for ${input.district}, ${input.state}`,
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

  static async listUserRecommendations(userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return [];
    }
    const db = client || getSupabaseAdmin();
    const { data, error } = await db
      .from('crop_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getRecommendationById(id: string, userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return null;
    }
    const db = client || getSupabaseAdmin();
    const { data, error } = await db
      .from('crop_recommendations')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteRecommendation(id: string, userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return true;
    }
    const db = client || getSupabaseAdmin();
    const { error } = await db
      .from('crop_recommendations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
}
