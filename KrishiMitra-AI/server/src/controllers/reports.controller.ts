import { Request, Response } from 'express';
import { supabaseServer, isBackendSupabaseConfigured } from '../config/supabase.js';

export const getReports = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  if (!isBackendSupabaseConfigured || userId === 'demo-farmer-id-12345') {
    return res.status(200).json({
      status: 'success',
      data: [
        {
          id: 'demo-report-1',
          user_id: 'demo-farmer-id-12345',
          report_type: 'plant_doctor',
          crop_name: 'Tomato',
          input_data: { symptoms: 'Yellow spots with dark rings on lower leaves' },
          result: {
            condition: 'Early Blight (Alternaria solani)',
            confidence: 'Moderate (85%)',
            recommendation: 'Spray organic copper fungicide or neem oil solution.',
          },
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      source: 'evaluation_store',
    });
  }

  try {
    const { data, error } = await supabaseServer
      .from('advisory_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }

    return res.status(200).json({
      status: 'success',
      data: data || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch reports';
    return res.status(500).json({ status: 'error', message });
  }
};
