import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../services/api';
import { FertilizerAdvisoryResult } from '../types';
import { DisclaimerBanner } from '../components/common/Alert';
import { ConfidenceIndicator } from '../components/common/ConfidenceIndicator';
import { EmptyState } from '../components/common/EmptyState';
import { generateAdvisoryPDF } from '../utils/pdfExport';
import { toast } from 'sonner';
import {
  FlaskConical, Download, Sparkles, AlertCircle, Leaf,
  Layers, CheckCircle, ShieldAlert
} from 'lucide-react';
import { soilTypes, growthStages } from '../utils/constants';

const schema = z.object({
  cropName: z.string().min(2, 'Crop name is required'),
  growthStage: z.string().min(2, 'Growth stage is required'),
  soilType: z.string().min(2, 'Soil type is required'),
  soilPh: z.preprocess(v => v === '' || v === null || v === undefined ? undefined : Number(v),
    z.number().min(0).max(14).optional()),
  nitrogen: z.preprocess(v => v === '' || v === null || v === undefined ? undefined : Number(v),
    z.number().min(0).optional()),
  phosphorus: z.preprocess(v => v === '' || v === null || v === undefined ? undefined : Number(v),
    z.number().min(0).optional()),
  potassium: z.preprocess(v => v === '' || v === null || v === undefined ? undefined : Number(v),
    z.number().min(0).optional()),
  soilTestAvailable: z.boolean().default(false),
  organicFertilizerAvailable: z.boolean().default(false),
});
type FormData = z.infer<typeof schema>;

interface FertilizerReport {
  id: string;
  aiResult: FertilizerAdvisoryResult;
}

export default function FertilizerAdvisoryPage() {
  const [result, setResult] = useState<FertilizerReport | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      soilTestAvailable: false,
      organicFertilizerAvailable: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);

    try {
      const res = await api.post<FertilizerReport>('/fertilizer-advisory', data);
      setResult(res);
      toast.success('Nutrient & fertilizer advisory generated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate fertilizer guidance.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!result) return;
    generateAdvisoryPDF({
      type: 'fertilizer',
      title: `${result.aiResult.cropName} Fertilizer & Nutrient Advisory`,
      data: result.aiResult,
      formData: getValues(),
    });
    toast.success('PDF report downloaded!');
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FlaskConical className="w-5 h-5 text-purple-700" />
          <h1 className="text-2xl font-black text-slate-800">Nutrient & Fertilizer Advisory</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Stage-specific nutrient management, deficiency prevention, and organic alternatives tailored to your soil conditions
        </p>
      </div>

      <div className="card p-5 mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Crop Name *</label>
              <input
                {...register('cropName')}
                placeholder="e.g., Rice, Tomato, Sugarcane, Maize"
                className={`input-field ${errors.cropName ? 'input-error' : ''}`}
              />
              {errors.cropName && <p className="text-red-500 text-xs mt-1">{errors.cropName.message}</p>}
            </div>
            <div>
              <label className="label-field">Crop Growth Stage *</label>
              <select {...register('growthStage')} className={`input-field ${errors.growthStage ? 'input-error' : ''}`}>
                <option value="">Select Growth Stage</option>
                {growthStages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.growthStage && <p className="text-red-500 text-xs mt-1">{errors.growthStage.message}</p>}
            </div>
            <div>
              <label className="label-field">Soil Type *</label>
              <select {...register('soilType')} className={`input-field ${errors.soilType ? 'input-error' : ''}`}>
                <option value="">Select Soil Type</option>
                {soilTypes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.soilType && <p className="text-red-500 text-xs mt-1">{errors.soilType.message}</p>}
            </div>
            <div>
              <label className="label-field">Soil pH (Optional)</label>
              <input
                {...register('soilPh')}
                type="number"
                step="0.1"
                min="0"
                max="14"
                placeholder="e.g., 6.8"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Nitrogen Level (kg/ha, Optional)</label>
              <input {...register('nitrogen')} type="number" step="1" placeholder="e.g., 180" className="input-field" />
            </div>
            <div>
              <label className="label-field">Phosphorus Level (kg/ha, Optional)</label>
              <input {...register('phosphorus')} type="number" step="1" placeholder="e.g., 55" className="input-field" />
            </div>
            <div>
              <label className="label-field">Potassium Level (kg/ha, Optional)</label>
              <input {...register('potassium')} type="number" step="1" placeholder="e.g., 120" className="input-field" />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                {...register('soilTestAvailable')}
                type="checkbox"
                className="w-4 h-4 accent-purple-700 rounded"
              />
              <span>I have an official Soil Health Card / Lab Test report</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                {...register('organicFertilizerAvailable')}
                type="checkbox"
                className="w-4 h-4 accent-purple-700 rounded"
              />
              <span>Prioritize organic options (FYM, Vermicompost, Jeevamrutha)</span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Generating Nutrient Advisory with Gemini AI...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> Generate Fertilizer Guidance
              </span>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-5">
          {/* Header Card */}
          <div className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 pb-3 border-b border-slate-100">
              <div>
                <span className="badge bg-purple-100 text-purple-800 text-xs mb-1">Nutrient Management</span>
                <h2 className="text-xl font-black text-slate-800">
                  {result.aiResult.cropName} — {result.aiResult.growthStage}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <ConfidenceIndicator level={result.aiResult.confidence} />
                <button onClick={handleExportPDF} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{result.aiResult.soilAssessment}</p>
          </div>

          {/* Nutrient Requirements */}
          {result.aiResult.nutrientRequirements?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-700" /> Nutrient Requirements & Deficiency Symptoms
              </h3>
              <div className="space-y-3">
                {result.aiResult.nutrientRequirements.map((nr, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                    <h4 className="font-bold text-sm text-slate-800 mb-1">{nr.nutrient}</h4>
                    <p className="text-xs text-slate-600 mb-2">{nr.importance}</p>
                    {nr.possibleDeficiencySymptoms?.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold text-amber-700">Deficiency Signs: </span>
                        <span className="text-xs text-slate-500">{nr.possibleDeficiencySymptoms.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organic Options & Fertilizer Categories */}
          <div className="grid sm:grid-cols-2 gap-4">
            {result.aiResult.organicOptions?.length > 0 && (
              <div className="card p-4">
                <h3 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-700" /> Organic & Bio-Fertilizer Alternatives
                </h3>
                <ul className="space-y-1 text-xs text-slate-600">
                  {result.aiResult.organicOptions.map((opt, oi) => (
                    <li key={oi} className="flex items-start gap-1.5">
                      <span className="text-green-600 font-bold">•</span>
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.aiResult.fertilizerCategories?.length > 0 && (
              <div className="card p-4">
                <h3 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-700" /> Recommended Application Categories
                </h3>
                <ul className="space-y-1 text-xs text-slate-600">
                  {result.aiResult.fertilizerCategories.map((cat, ci) => (
                    <li key={ci} className="flex items-start gap-1.5">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{cat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Application Considerations & Soil Testing Recommendations */}
          <div className="grid sm:grid-cols-2 gap-4">
            {result.aiResult.applicationConsiderations?.length > 0 && (
              <div className="card p-4">
                <h3 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-700" /> Timing & Application Considerations
                </h3>
                <ul className="space-y-1 text-xs text-slate-600">
                  {result.aiResult.applicationConsiderations.map((app, ai) => (
                    <li key={ai} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.aiResult.soilTestingRecommendations?.length > 0 && (
              <div className="card p-4">
                <h3 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700" /> Soil Testing Recommendations
                </h3>
                <ul className="space-y-1 text-xs text-slate-600">
                  {result.aiResult.soilTestingRecommendations.map((st, si) => (
                    <li key={si} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Precautions */}
          {result.aiResult.precautions?.length > 0 && (
            <div className="card p-4 bg-amber-50/50 border-amber-200">
              <h3 className="font-bold text-sm text-amber-800 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> Environmental & Soil Health Precautions
              </h3>
              <ul className="space-y-1 text-xs text-amber-800">
                {result.aiResult.precautions.map((p, pi) => (
                  <li key={pi} className="flex items-start gap-1.5">
                    <span>⚠</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <DisclaimerBanner text={result.aiResult.disclaimer} />
        </div>
      )}

      {!result && !loading && (
        <EmptyState
          icon={FlaskConical}
          title="Get customized nutrient and fertilizer guidance"
          description="Enter your crop name, soil type, and current growth phase to generate a balanced fertilizer plan."
        />
      )}
    </div>
  );
}
