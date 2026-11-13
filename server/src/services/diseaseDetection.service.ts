import { SupabaseClient } from '@supabase/supabase-js';
import { executeStructuredGeminiRequest } from '../utils/geminiHelper.js';
import { getDiseaseDetectionPrompt } from '../prompts/agriculture.prompts.js';
import { diseaseDetectionResponseSchema } from '../schemas/index.js';
import { GEMINI_MODEL } from '../config/gemini.js';
import { getSupabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

export interface DiseaseDetectionInput {
  cropName?: string;
  plantPart?: string;
  symptoms?: string;
  duration?: string;
  location?: string;
}

export class DiseaseDetectionService {
  static async analyzeCropImage(
    file: Express.Multer.File,
    metadata: DiseaseDetectionInput,
    userId: string,
    client?: SupabaseClient
  ) {
    let imagePath = '';

    // Upload to Supabase Storage if configured
    if (isSupabaseConfigured()) {
      try {
        const db = client || getSupabaseAdmin();
        const fileExt = file.originalname.split('.').pop() || 'jpg';
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await db.storage
          .from('crop-images')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (uploadError) {
          console.warn('Storage upload note:', uploadError.message);
        } else if (uploadData) {
          imagePath = uploadData.path;
        }
      } catch (storageErr) {
        console.warn('Supabase storage upload skipped or failed:', storageErr);
      }
    }

    const prompt = getDiseaseDetectionPrompt(metadata);
    const aiResult = await executeStructuredGeminiRequest({
      prompt,
      schema: diseaseDetectionResponseSchema,
      inlineImage: {
        mimeType: file.mimetype,
        data: file.buffer,
      },
    });

    let savedRecord: any = null;

    if (isSupabaseConfigured()) {
      const db = client || getSupabaseAdmin();
      const { data, error } = await db
        .from('disease_analyses')
        .insert({
          user_id: userId,
          crop_name: aiResult.cropName || metadata.cropName || 'Identified Crop',
          plant_part: aiResult.plantPart || metadata.plantPart || 'Leaf/Foliage',
          image_path: imagePath || null,
          symptoms: metadata.symptoms || null,
          analysis: aiResult,
          confidence: aiResult.confidence,
          ai_model: GEMINI_MODEL,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving disease analysis to database:', error);
      } else {
        savedRecord = data;

        // Log farming activity
        await db.from('farming_activities').insert({
          user_id: userId,
          crop_name: aiResult.cropName || metadata.cropName,
          activity_type: 'DISEASE_DETECTION',
          description: `Analyzed plant health for ${aiResult.cropName}: observed ${aiResult.possibleConditions[0]?.name || 'condition'}`,
        });
      }
    }

    return {
      id: savedRecord?.id || 'temp-' + Date.now(),
      metadata,
      imagePath,
      aiResult,
      createdAt: savedRecord?.created_at || new Date().toISOString(),
    };
  }

  static async listUserAnalyses(userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return [];
    }
    const db = client || getSupabaseAdmin();
    const { data, error } = await db
      .from('disease_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getAnalysisById(id: string, userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return null;
    }
    const db = client || getSupabaseAdmin();
    const { data, error } = await db
      .from('disease_analyses')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteAnalysis(id: string, userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return true;
    }
    const db = client || getSupabaseAdmin();
    const { error } = await db
      .from('disease_analyses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
}
