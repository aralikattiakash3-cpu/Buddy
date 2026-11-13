import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../services/api';
import { IrrigationAdvisoryResult } from '../types';
import { DisclaimerBanner } from '../components/common/Alert';
import { ConfidenceIndicator } from '../components/common/ConfidenceIndicator';
import { EmptyState } from '../components/common/EmptyState';
import { generateAdvisoryPDF } from '../utils/pdfExport';
import { toast } from 'sonner';
import {
  Droplets, Download, Sparkles, AlertTriangle, ShieldAlert,
  CheckCircle, Waves, CloudRain
} from 'lucide-react';
import { soilTypes, growthStages, irrigationTypes } from '../utils/constants';

const schema = z.object({
  cropName: z.string().min(2, 'Crop name is required'),
  growthStage: z.string().min(2, 'Growth stage is required'),
  soilType: z.string().min(2, 'Soil type is required'),
  irrigationType: z.enum(['rainfed', 'borewell', 'open_well', 'canal', 'drip', 'sprinkler', 'mixed']),
  waterAvailability: z.enum(['low', 'medium', 'high']),
  recentRainfall: z.string().optional().or(z.literal('')),
});
type FormData = z.infer<typeof schema>;

interface IrrigationReport {
  id: string;
  aiResult: IrrigationAdvisoryResult;
}

export default function IrrigationAdvisoryPage() {
  const [result, setResult] = useState<IrrigationReport | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      irrigationType: 'drip',
      waterAvailability: 'medium',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);

    try {
      const res = await api.post<IrrigationReport>('/irrigation-advisory', data);
      setResult(res);
      toast.success('Irrigation advisory generated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate irrigation guidance.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!result) return;
    generateAdvisoryPDF({
      type: 'irrigation',
      title: `${result.aiResult.cropName} Irrigation Advisory`,
      data: result.aiResult,
      formData: getValues(),
    });
    toast.success('PDF report downloaded!');
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Droplets className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl font-black text-slate-800">Irrigation & Water Management</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Stage-specific watering schedules, conservation practices, and over-irrigation risk prevention
        </p>
      </div>

      <div className="card p-5 mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Crop Name *</label>
              <input
                {...register('cropName')}
                placeholder="e.g., Sugarcane, Maize, Tomato, Paddy"
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
              <label className="label-field">Irrigation System *</label>
              <select {...register('irrigationType')} className="input-field">
                {irrigationTypes.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Water Availability *</label>
              <select {...register('waterAvailability')} className="input-field">
                <option value="low">Low (Water Scarcity / Drought Prone)</option>
                <option value="medium">Medium (Seasonal / Adequate)</option>
                <option value="high">High (Perennial / Canal / High Water Table)</option>
              </select>
            </div>
            <div>
              <label className="label-field">Recent Rainfall (Optional)</label>
              <input
                {...register('recentRainfall')}
                placeholder="e.g., Heavy rain 3 days ago, none for 2 weeks"
                className="input-field"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Generating Irrigation Guide with Gemini AI...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> Generate Water Management Guide
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
                <span className="badge-blue text-xs mb-1">Irrigation Schedule</span>
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
            <p className="text-sm text-slate-700 leading-relaxed mb-3">{result.aiResult.waterAssessment}</p>
            <div className="p-3 bg-blue-50/60 rounded-xl text-xs text-blue-900 flex items-center gap-2">
              <Waves className="w-4 h-4 text-blue-600 shrink-0" />
              <span><strong>Recommended Method: </strong>{result.aiResult.irrigationMethod}</span>
            </div>
          </div>

          {/* Watering Guidance */}
          {result.aiResult.irrigationGuidance?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-600" /> Watering Schedule & Field Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {result.aiResult.irrigationGuidance.map((guide, gi) => (
                  <li key={gi} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{guide}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Water Conservation & Indicators */}
          <div className="grid sm:grid-cols-2 gap-4">
            {result.aiResult.waterConservation?.length > 0 && (
              <div className="card p-4">
                <h3 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-green-700" /> Water Conservation Practices
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {result.aiResult.waterConservation.map((c, ci) => (
                    <li key={ci} className="flex items-start gap-1.5">
                      <span className="text-green-600 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.aiResult.waterStressIndicators?.length > 0 && (
              <div className="card p-4">
                <h3 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Signs of Moisture Stress (Under-Watering)
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {result.aiResult.waterStressIndicators.map((s, si) => (
                    <li key={si} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Over Irrigation Risks */}
          {result.aiResult.overIrrigationRisks?.length > 0 && (
            <div className="card p-4 bg-red-50/40 border-red-200">
              <h3 className="font-bold text-sm text-red-800 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600" /> Over-Irrigation & Waterlogging Risks
              </h3>
              <ul className="space-y-1 text-xs text-red-800">
                {result.aiResult.overIrrigationRisks.map((risk, ri) => (
                  <li key={ri} className="flex items-start gap-1.5">
                    <span>⚠</span>
                    <span>{risk}</span>
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
          icon={Droplets}
          title="Optimize your farm irrigation"
          description="Enter your crop and water availability to get recommendations on watering frequency, depth, and water conservation methods."
        />
      )}
    </div>
  );
}
