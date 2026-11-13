import { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

export class DashboardService {
  static async getSummary(userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return {
        stats: {
          totalAdvisories: 0,
          cropRecommendationsCount: 0,
          diseaseAnalysesCount: 0,
          fertilizerAdvisoriesCount: 0,
          irrigationAdvisoriesCount: 0,
          chatSessionsCount: 0,
        },
        profile: null,
        recentAdvisories: [],
        recentActivities: [],
      };
    }

    const db = client || getSupabaseAdmin();

    // Query counts in parallel
    const [
      { count: cropCount },
      { count: advisoryCount },
      { count: diseaseCount },
      { count: fertilizerCount },
      { count: irrigationCount },
      { count: chatCount },
      { data: profile },
      { data: recentCrops },
      { data: recentAdvisories },
      { data: recentDiseases },
      { data: recentActivities },
    ] = await Promise.all([
      db.from('crop_recommendations').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      db.from('crop_advisories').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      db.from('disease_analyses').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      db.from('fertilizer_advisories').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      db.from('irrigation_advisories').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      db.from('chat_sessions').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      db.from('profiles').select('*').eq('id', userId).single(),
      db.from('crop_recommendations').select('id, district, state, recommendations, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
      db.from('crop_advisories').select('id, crop_name, growth_stage, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
      db.from('disease_analyses').select('id, crop_name, plant_part, confidence, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
      db.from('farming_activities').select('*').eq('user_id', userId).order('activity_date', { ascending: false }).limit(8),
    ]);

    const totalAdvisories =
      (cropCount || 0) +
      (advisoryCount || 0) +
      (diseaseCount || 0) +
      (fertilizerCount || 0) +
      (irrigationCount || 0);

    // Normalize recent advisories for convenient dashboard feed
    const combinedRecent: Array<{
      id: string;
      type: string;
      title: string;
      subtitle: string;
      createdAt: string;
    }> = [];

    (recentCrops || []).forEach(r => {
      const topCrop = r.recommendations?.recommendations?.[0]?.cropName || 'Recommendations';
      combinedRecent.push({
        id: r.id,
        type: 'crop_recommendation',
        title: `Crop Recommendation: ${topCrop}`,
        subtitle: `${r.district}, ${r.state}`,
        createdAt: r.created_at,
      });
    });

    (recentAdvisories || []).forEach(a => {
      combinedRecent.push({
        id: a.id,
        type: 'crop_advisory',
        title: `Cultivation Advisory: ${a.crop_name}`,
        subtitle: `Stage: ${a.growth_stage || 'Comprehensive'}`,
        createdAt: a.created_at,
      });
    });

    (recentDiseases || []).forEach(d => {
      combinedRecent.push({
        id: d.id,
        type: 'disease_detection',
        title: `Health Analysis: ${d.crop_name || 'Plant'}`,
        subtitle: `Confidence: ${d.confidence || 'Medium'}`,
        createdAt: d.created_at,
      });
    });

    combinedRecent.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      stats: {
        totalAdvisories,
        cropRecommendationsCount: cropCount || 0,
        cropAdvisoriesCount: advisoryCount || 0,
        diseaseAnalysesCount: diseaseCount || 0,
        fertilizerAdvisoriesCount: fertilizerCount || 0,
        irrigationAdvisoriesCount: irrigationCount || 0,
        chatSessionsCount: chatCount || 0,
      },
      profile: profile || null,
      recentAdvisories: combinedRecent.slice(0, 5),
      recentActivities: recentActivities || [],
    };
  }

  static async getRecentActivities(userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const db = client || getSupabaseAdmin();
    const { data, error } = await db
      .from('farming_activities')
      .select('*')
      .eq('user_id', userId)
      .order('activity_date', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  }
}
