import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../services/api';
import { DiseaseDetectionResult } from '../types';
import { DisclaimerBanner } from '../components/common/Alert';
import { ConfidenceIndicator } from '../components/common/ConfidenceIndicator';
import { EmptyState } from '../components/common/EmptyState';
import { generateAdvisoryPDF } from '../utils/pdfExport';
import { toast } from 'sonner';
import {
  Bug, Upload, Image as ImageIcon, X, AlertTriangle, ShieldCheck,
  CheckCircle2, AlertOctagon, HelpCircle, Download, Sparkles
} from 'lucide-react';
import { plantParts } from '../utils/constants';

const schema = z.object({
  cropName: z.string().optional().or(z.literal('')),
  plantPart: z.string().optional().or(z.literal('')),
  symptoms: z.string().optional().or(z.literal('')),
  duration: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
});
type FormData = z.infer<typeof schema>;

interface DiseaseReport {
  id: string;
  imagePath?: string;
  aiResult: DiseaseDetectionResult;
}

export default function DiseaseDetectionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseReport | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { plantPart: 'Leaves' },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Unsupported file format. Please upload JPG, PNG, or WEBP.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image size exceeds 8 MB limit. Please choose a smaller image.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedFile) {
      toast.error('Please upload an image of the affected plant or leaf.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      if (data.cropName) formData.append('cropName', data.cropName);
      if (data.plantPart) formData.append('plantPart', data.plantPart);
      if (data.symptoms) formData.append('symptoms', data.symptoms);
      if (data.duration) formData.append('duration', data.duration);
      if (data.location) formData.append('location', data.location);

      const res = await api.post<DiseaseReport>('/disease-detection', formData);
      setResult(res);
      toast.success('Crop health analysis completed!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to analyze crop image. Check that the Gemini API is configured.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!result) return;
    generateAdvisoryPDF({
      type: 'disease-detection',
      title: `Plant Health Analysis — ${result.aiResult.cropName}`,
      data: result.aiResult,
      formData: getValues(),
    });
    toast.success('PDF report downloaded!');
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Bug className="w-5 h-5 text-red-600" />
          <h1 className="text-2xl font-black text-slate-800">Crop Health & Disease Detection</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Upload a clear photo of the affected plant part to receive AI-assisted symptom observations, possible causes, and preventive care
        </p>
      </div>

      <div className="card p-5 mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* File Upload Zone */}
          <div>
            <label className="label-field">Crop Image * (JPG, PNG, WEBP - Max 8MB)</label>
            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-green-500 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-50 hover:bg-green-50/50 flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-green-700" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">Click or drag image to upload</p>
                <p className="text-xs text-slate-400">Capture clear, well-lit photos of leaves, stems, or affected area</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center max-h-72">
                <img
                  src={previewUrl}
                  alt="Crop preview"
                  className="object-contain max-h-72 w-full"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs text-white flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{selectedFile?.name} ({(selectedFile?.size! / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              </div>
            )}
          </div>

          {/* Metadata Fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Crop Name (Optional)</label>
              <input
                {...register('cropName')}
                placeholder="e.g., Tomato, Paddy, Groundnut, Cotton"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Plant Part Affected</label>
              <select {...register('plantPart')} className="input-field">
                {plantParts.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Duration of Symptoms</label>
              <input
                {...register('duration')}
                placeholder="e.g., Noticed 3 days ago, 1-2 weeks"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Location / District</label>
              <input
                {...register('location')}
                placeholder="e.g., Dharwad, Belagavi"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label-field">Describe Visible Symptoms (Optional)</label>
            <textarea
              {...register('symptoms')}
              rows={2}
              placeholder="e.g., Yellow spots turning brown with yellow halos, curling edges, powdery white coating on leaf undersides"
              className="input-field"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Analyzing Image with Gemini Vision AI...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> Analyze Plant Health
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Analysis Results */}
      {result && (
        <div className="space-y-5">
          {/* Summary Card */}
          <div className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
              <div>
                <span className="badge-red text-xs mb-1">Health Analysis Report</span>
                <h2 className="text-xl font-black text-slate-800">
                  {result.aiResult.cropName} — {result.aiResult.plantPart}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <ConfidenceIndicator level={result.aiResult.confidence} />
                <button onClick={handleExportPDF} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>

            {/* Observations */}
            <div className="mb-4">
              <h3 className="font-bold text-sm text-slate-700 mb-2">Visible Physical Symptoms Observed:</h3>
              <ul className="space-y-1 text-sm text-slate-600">
                {result.aiResult.observations?.map((obs, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expert Consultation Notice */}
            {result.aiResult.expertConsultationRecommended && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Official Agricultural Expert Consultation Recommended: </span>
                  Visual identification is preliminary. Verify with your local Krishi Vigyan Kendra (KVK) or Horticulture Department before applying synthetic chemical interventions.
                </div>
              </div>
            )}
          </div>

          {/* Possible Conditions */}
          {result.aiResult.possibleConditions?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Possible Conditions Identified
              </h3>
              <div className="space-y-3">
                {result.aiResult.possibleConditions.map((condition, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-sm text-slate-800">{condition.name}</h4>
                      <span className={
                        condition.likelihood === 'high' ? 'badge-red' :
                        condition.likelihood === 'medium' ? 'badge-amber' : 'badge-slate'
                      }>
                        {condition.likelihood.toUpperCase()} Likelihood
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{condition.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Causes */}
          {result.aiResult.alternativeCauses?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm">
                <HelpCircle className="w-4 h-4 text-blue-600" /> Alternative Abiotic / Non-Disease Factors
              </h3>
              <ul className="space-y-1 text-xs text-slate-600">
                {result.aiResult.alternativeCauses.map((cause, ci) => (
                  <li key={ci} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions & Preventive Measures */}
          <div className="grid sm:grid-cols-2 gap-4">
            {result.aiResult.recommendedActions?.length > 0 && (
              <div className="card p-4">
                <h3 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-700" /> Immediate Recommended Actions
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {result.aiResult.recommendedActions.map((action, ai) => (
                    <li key={ai} className="flex items-start gap-1.5">
                      <span className="text-green-600 font-bold">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.aiResult.preventiveMeasures?.length > 0 && (
              <div className="card p-4">
                <h3 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" /> Long-Term Preventive Measures
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {result.aiResult.preventiveMeasures.map((prev, pi) => (
                    <li key={pi} className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{prev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <DisclaimerBanner text={result.aiResult.disclaimer} />
        </div>
      )}

      {!result && !loading && (
        <EmptyState
          icon={Bug}
          title="Upload a plant photo to diagnose crop health"
          description="Take a clear, close-up photograph of diseased leaves or stems to receive immediate AI observation and care guidance."
        />
      )}
    </div>
  );
}
