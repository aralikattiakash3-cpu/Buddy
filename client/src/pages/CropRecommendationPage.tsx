import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../services/api';
import { CropRecommendationResult } from '../types';
import { DisclaimerBanner } from '../components/common/Alert';
import { ConfidenceIndicator, SuitabilityScore } from '../components/common/ConfidenceIndicator';
import { EmptyState } from '../components/common/EmptyState';
import { generateAdvisoryPDF } from '../utils/pdfExport';
import { toast } from 'sonner';
import {
  Sprout, AlertTriangle, Download, ChevronDown, ChevronUp, Droplets, Clock, MapPin
} from 'lucide-react';
import {
  indianStates, soilTypes, irrigationTypes, seasons, landUnits, farmingObjectives
} from '../utils/constants';

const schema = z.object({
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  soilType: z.string().min(2, 'Soil type is required'),
  soilPh: z.preprocess(v => v === '' || v === null || v === undefined ? undefined : Number(v),
    z.number().min(0).max(14).optional()),
  nitrogen: z.preprocess(v => v === '' || v === null || v === undefined ? undefined : Number(v),
    z.number().min(0).optional()),
  phosphorus: z.preprocess(v => v === '' || v === null || v === undefined ? undefined : Number(v),
    z.number().min(0).optional()),
  potassium: z.preprocess(v => v === '' || v === null || v === undefined ? undefined : Number(v),
    z.number().min(0).optional()),
  landArea: z.preprocess(v => Number(v), z.number().positive('Land area must be positive')),
  landUnit: z.enum(['acre', 'hectare', 'gunta', 'cent']),
  irrigationType: z.enum(['rainfed', 'borewell', 'open_well', 'canal', 'drip', 'sprinkler', 'mixed']),
  waterAvailability: z.enum(['low', 'medium', 'high']),
  season: z.enum(['kharif', 'rabi', 'zaid', 'year_round']),
  plantingPeriod: z.string().optional().or(z.literal('')),
  farmingObjective: z.string().min(2, 'Farming objective is required'),
});
type FormData = z.infer<typeof schema>;

interface RecommendationReport {
  id: string;
  aiResult: CropRecommendationResult;
}

export default function CropRecommendationPage() {
  const [result, setResult] = useState<RecommendationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedCrop, setExpandedCrop] = useState<number | null>(0);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      landUnit: 'acre',
      irrigationType: 'rainfed',
      waterAvailability: 'medium',
      season: 'kharif',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post<RecommendationReport>('/crop-recommendations', data);
      setResult(res);
      toast.success('AI crop recommendations generated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate recommendations. Check that the backend server is running and Gemini API key is configured.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!result) return;
    generateAdvisoryPDF({
      type: 'crop-recommendation',
      title: 'Crop Recommendation Report',
      data: result.aiResult,
      formData: getValues(),
    });
    toast.success('PDF report downloaded!');
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sprout className="w-5 h-5 text-green-700" />
          <h1 className="text-2xl font-black text-slate-800">Crop Recommendation</h1>
        </div>
        <p className="text-slate-500 text-sm">Share your soil and farm details to get AI-powered crop suggestions tailored to your location</p>
      </div>

      <div className="card p-5 mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Location */}
          <div>
            <h3 className="text-sm font-bold text-slate-600 mb-3 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-green-600" /> Farm Location
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">State *</label>
                <select {...register('state')} className={`input-field ${errors.state ? 'input-error' : ''}`}>
                  <option value="">Select State</option>
                  {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
              </div>
              <div>
                <label className="label-field">District *</label>
                <input {...register('district')} placeholder="e.g., Dharwad, Mysuru, Pune" className={`input-field ${errors.district ? 'input-error' : ''}`} />
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
              </div>
            </div>
          </div>

          {/* Soil */}
          <div>
            <h3 className="text-sm font-bold text-slate-600 mb-3">Soil Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
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
                <input {...register('soilPh')} type="number" step="0.1" min="0" max="14" placeholder="e.g., 6.5 (0–14 scale)" className="input-field" />
                <p className="text-xs text-slate-400 mt-1">Obtain from soil test report. Leave blank if unavailable.</p>
              </div>
              <div>
                <label className="label-field">Nitrogen Level (kg/ha, Optional)</label>
                <input {...register('nitrogen')} type="number" step="1" min="0" placeholder="e.g., 180" className="input-field" />
              </div>
              <div>
                <label className="label-field">Phosphorus Level (kg/ha, Optional)</label>
                <input {...register('phosphorus')} type="number" step="1" min="0" placeholder="e.g., 60" className="input-field" />
              </div>
              <div>
                <label className="label-field">Potassium Level (kg/ha, Optional)</label>
                <input {...register('potassium')} type="number" step="1" min="0" placeholder="e.g., 90" className="input-field" />
              </div>
            </div>
            <p className="text-xs text-amber-700 mt-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              NPK values from your soil test report improve recommendation accuracy. Skip if unavailable.
            </p>
          </div>

          {/* Land & Irrigation */}
          <div>
            <h3 className="text-sm font-bold text-slate-600 mb-3 flex items-center gap-2">
              <Droplets className="w-3.5 h-3.5 text-blue-600" /> Land & Water Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Land Area *</label>
                <div className="flex gap-2">
                  <input {...register('landArea')} type="number" step="0.01" min="0.01" placeholder="e.g., 2.5" className={`input-field flex-1 ${errors.landArea ? 'input-error' : ''}`} />
                  <select {...register('landUnit')} className="input-field w-32">
                    {landUnits.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                </div>
                {errors.landArea && <p className="text-red-500 text-xs mt-1">{errors.landArea.message}</p>}
              </div>
              <div>
                <label className="label-field">Irrigation Facility *</label>
                <select {...register('irrigationType')} className="input-field">
                  {irrigationTypes.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Water Availability *</label>
                <select {...register('waterAvailability')} className="input-field">
                  <option value="low">Low – Scarce / Drought Prone</option>
                  <option value="medium">Medium – Seasonal</option>
                  <option value="high">High – Adequate / Perennial</option>
                </select>
              </div>
              <div>
                <label className="label-field">Season *</label>
                <select {...register('season')} className="input-field">
                  {seasons.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Objective */}
          <div>
            <label className="label-field">Farming Objective *</label>
            <select {...register('farmingObjective')} className={`input-field ${errors.farmingObjective ? 'input-error' : ''}`}>
              <option value="">Select your primary objective</option>
              {farmingObjectives.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {errors.farmingObjective && <p className="text-red-500 text-xs mt-1">{errors.farmingObjective.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Analyzing with Gemini AI...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sprout className="w-4 h-4" /> Generate Crop Recommendations
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="card p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h2 className="font-bold text-slate-800 mb-2">AI Analysis Summary</h2>
                <p className="text-sm text-slate-600">{result.aiResult.summary}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <ConfidenceIndicator level={result.aiResult.confidence} />
                <button onClick={handleExportPDF} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>
            {result.aiResult.dataLimitations?.length > 0 && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <p className="font-semibold mb-1">⚠ Data Limitations Affecting Accuracy:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {result.aiResult.dataLimitations.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Crop Cards */}
          <div>
            <h2 className="font-bold text-slate-800 mb-3">Top {result.aiResult.recommendations.length} Recommended Crops</h2>
            <div className="space-y-3">
              {result.aiResult.recommendations.map((crop, idx) => (
                <div key={idx} className="card card-hover">
                  <button
                    className="w-full p-5 flex items-center justify-between gap-4 text-left"
                    onClick={() => setExpandedCrop(expandedCrop === idx ? null : idx)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <SuitabilityScore score={crop.suitabilityScore} size="sm" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800">{crop.cropName}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{crop.suitabilityExplanation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex flex-col items-end text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{crop.growingDuration}</span>
                        <span className="flex items-center gap-1 mt-0.5"><Droplets className="w-3 h-3" />{crop.waterRequirement}</span>
                      </div>
                      {expandedCrop === idx ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {expandedCrop === idx && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-3">
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Soil Compatibility</p>
                          <p className="text-slate-700">{crop.soilCompatibility}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Planting Period</p>
                          <p className="text-slate-700">{crop.plantingPeriod}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Water Requirement</p>
                          <p className="text-slate-700">{crop.waterRequirement}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Growing Duration</p>
                          <p className="text-slate-700">{crop.growingDuration}</p>
                        </div>
                      </div>
                      {crop.majorRisks?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Major Risks to Consider</p>
                          <div className="flex flex-wrap gap-2">
                            {crop.majorRisks.map((risk, ri) => (
                              <span key={ri} className="badge-amber text-xs">{risk}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DisclaimerBanner text={result.aiResult.disclaimer} />
        </div>
      )}

      {!result && !loading && (
        <EmptyState
          icon={Sprout}
          title="Your crop recommendations will appear here"
          description="Fill in your farm details above and click 'Generate Crop Recommendations' to get started."
        />
      )}
    </div>
  );
}
