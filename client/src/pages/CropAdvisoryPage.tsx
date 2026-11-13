import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../services/api';
import { CropAdvisoryResult } from '../types';
import { DisclaimerBanner } from '../components/common/Alert';
import { EmptyState } from '../components/common/EmptyState';
import { generateAdvisoryPDF } from '../utils/pdfExport';
import { toast } from 'sonner';
import {
  BookOpen, Download, Sprout, Calendar, Clock,
  ShieldAlert, Sparkles, Layers, Bug, CheckCircle, Droplets
} from 'lucide-react';
import {
  indianStates, soilTypes, irrigationTypes, growthStages
} from '../utils/constants';

const schema = z.object({
  cropName: z.string().min(2, 'Crop name is required'),
  cropVariety: z.string().optional().or(z.literal('')),
  sowingDate: z.string().optional().or(z.literal('')),
  growthStage: z.string().optional().or(z.literal('')),
  soilType: z.string().optional().or(z.literal('')),
  irrigationType: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  district: z.string().optional().or(z.literal('')),
  currentProblem: z.string().max(500).optional().or(z.literal('')),
});
type FormData = z.infer<typeof schema>;

interface AdvisoryReport {
  id: string;
  aiResult: CropAdvisoryResult;
}

export default function CropAdvisoryPage() {
  const [result, setResult] = useState<AdvisoryReport | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        cropName: data.cropName,
        cropVariety: data.cropVariety || undefined,
        sowingDate: data.sowingDate || undefined,
        growthStage: data.growthStage || undefined,
        soilType: data.soilType || undefined,
        irrigationType: data.irrigationType || undefined,
        location: (data.state || data.district) ? {
          state: data.state || undefined,
          district: data.district || undefined,
        } : undefined,
        currentProblem: data.currentProblem || undefined,
      };

      const res = await api.post<AdvisoryReport>('/crop-advisories', payload);
      setResult(res);
      toast.success('Crop cultivation advisory generated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate cultivation advisory.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!result) return;
    generateAdvisoryPDF({
      type: 'crop-advisory',
      title: `${result.aiResult.cropName} Cultivation Advisory`,
      data: result.aiResult,
      formData: getValues(),
    });
    toast.success('PDF report downloaded!');
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-green-700" />
          <h1 className="text-2xl font-black text-slate-800">Crop Cultivation Advisory</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Get comprehensive, stage-by-stage cultivation guidance for any crop under your local conditions
        </p>
      </div>

      <div className="card p-5 mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Crop Name *</label>
              <input
                {...register('cropName')}
                placeholder="e.g., Rice, Tomato, Cotton, Arecanut"
                className={`input-field ${errors.cropName ? 'input-error' : ''}`}
              />
              {errors.cropName && <p className="text-red-500 text-xs mt-1">{errors.cropName.message}</p>}
            </div>
            <div>
              <label className="label-field">Crop Variety (Optional)</label>
              <input
                {...register('cropVariety')}
                placeholder="e.g., Sona Masoori, Arka Rakshak, Bt Cotton"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Current Growth Stage</label>
              <select {...register('growthStage')} className="input-field">
                <option value="">Select Growth Stage (or Full Lifecycle)</option>
                {growthStages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Sowing Date (Optional)</label>
              <input {...register('sowingDate')} type="date" className="input-field" />
            </div>
            <div>
              <label className="label-field">Soil Type</label>
              <select {...register('soilType')} className="input-field">
                <option value="">Select Soil Type</option>
                {soilTypes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Irrigation Method</label>
              <select {...register('irrigationType')} className="input-field">
                <option value="">Select Irrigation Method</option>
                {irrigationTypes.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">State (Optional)</label>
              <select {...register('state')} className="input-field">
                <option value="">Select State</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">District (Optional)</label>
              <input {...register('district')} placeholder="e.g., Dharwad, Belagavi" className="input-field" />
            </div>
          </div>

          <div>
            <label className="label-field">Current Field Issues / Questions (Optional)</label>
            <textarea
              {...register('currentProblem')}
              rows={2}
              placeholder="e.g., Leaf yellowing observed after recent rains, slow flowering, etc."
              className="input-field"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Generating Advisory with Gemini AI...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> Generate Cultivation Guide
              </span>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
              <div>
                <span className="badge-green text-xs mb-2">Cultivation Guide</span>
                <h2 className="text-xl font-black text-slate-800">{result.aiResult.cropName}</h2>
              </div>
              <button onClick={handleExportPDF} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 self-start">
                <Download className="w-4 h-4" /> Download Printable PDF
              </button>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{result.aiResult.overview}</p>
          </div>

          {/* Growth Stages Timeline */}
          {result.aiResult.growthStages?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-700" /> Lifecycle Growth Stages
              </h3>
              <div className="space-y-4">
                {result.aiResult.growthStages.map((stage, idx) => (
                  <div key={idx} className="relative pl-6 pb-4 border-l-2 border-green-200 last:border-l-0 last:pb-0">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-600 border-2 border-white" />
                    <h4 className="font-bold text-sm text-slate-800">{stage.stage}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 mb-2">{stage.description}</p>
                    {stage.management?.length > 0 && (
                      <div className="bg-slate-50 rounded-xl p-3 space-y-1">
                        {stage.management.map((m, mi) => (
                          <div key={mi} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cultivation Practices Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Land Preparation', items: result.aiResult.landPreparation, icon: Layers },
              { title: 'Seed Selection & Treatment', items: result.aiResult.seedSelection, icon: Sprout },
              { title: 'Sowing Guidance', items: result.aiResult.sowingGuidance, icon: Calendar },
              { title: 'Irrigation Management', items: result.aiResult.irrigation, icon: Droplets },
              { title: 'Nutrient & Fertilizer Management', items: result.aiResult.nutrientManagement, icon: Sparkles },
              { title: 'Weed Control', items: result.aiResult.weedManagement, icon: Layers },
              { title: 'Integrated Pest Management (IPM)', items: result.aiResult.pestManagement, icon: Bug },
              { title: 'Disease Prevention', items: result.aiResult.diseasePrevention, icon: ShieldAlert },
              { title: 'Harvesting Guidelines', items: result.aiResult.harvesting, icon: CheckCircle },
              { title: 'Post-Harvest & Storage', items: result.aiResult.storage, icon: BookOpen },
            ].filter(section => section.items && section.items.length > 0).map(section => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="card p-4">
                  <h3 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-green-700" /> {section.title}
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {section.items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-1.5">
                        <span className="text-green-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Precautions */}
          {result.aiResult.precautions?.length > 0 && (
            <div className="card p-4 bg-amber-50/50 border-amber-200">
              <h3 className="font-bold text-sm text-amber-800 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> Important Cultivation Precautions
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
          icon={BookOpen}
          title="Ready to generate your crop cultivation guide"
          description="Enter your crop name and field conditions to receive a complete cultivation blueprint."
        />
      )}
    </div>
  );
}
