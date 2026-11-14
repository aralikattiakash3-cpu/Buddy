
import React, { useEffect, useRef, useState } from 'react';
import {
  Stethoscope,
  Upload,
  AlertCircle,
  Camera,
  X,
  CheckCircle2,
  Loader2,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../services/supabase';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '');

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

// Safely render Gemini Markdown without extra packages.
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="rounded bg-slate-100 px-1 py-0.5 text-green-900"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function FormattedAnalysis({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');

  return (
    <div className="space-y-2 text-sm leading-7 text-slate-800 break-words">
      {lines.map((rawLine, index) => {
        const line = rawLine.trim();

        if (!line) {
          return <div key={index} className="h-2" />;
        }

        if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
          return (
            <hr
              key={index}
              className="my-4 border-slate-200"
            />
          );
        }

        const heading = line.match(/^(#{1,6})\s+(.+)$/);

        if (heading) {
          return (
            <h3
              key={index}
              className="pt-3 pb-1 text-base sm:text-lg font-bold text-green-900"
            >
              {renderInlineMarkdown(heading[2])}
            </h3>
          );
        }

        const bullet = line.match(/^[-*•]\s+(.+)$/);

        if (bullet) {
          return (
            <div
              key={index}
              className="flex items-start gap-3 pl-2"
            >
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600" />
              <p className="flex-1">
                {renderInlineMarkdown(bullet[1])}
              </p>
            </div>
          );
        }

        const numbered = line.match(/^(\d+)[.)]\s+(.+)$/);

        if (numbered) {
          return (
            <div
              key={index}
              className="flex items-start gap-3 pl-1"
            >
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-green-100 px-1 text-xs font-bold text-green-800">
                {numbered[1]}
              </span>
              <p className="flex-1">
                {renderInlineMarkdown(numbered[2])}
              </p>
            </div>
          );
        }

        return (
          <p key={index}>
            {renderInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}

export const PlantDoctorPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [cropName, setCropName] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedImage]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please select a JPG, PNG or WEBP image.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image size must be less than 5 MB.');
      event.target.value = '';
      return;
    }

    setError('');
    setUploadedPath(null);
    setUploadSuccess(false);
    setAnalysisResult('');
    setSelectedImage(file);

    event.target.value = '';
  };

  const removeImage = () => {
    if (uploading || analyzing) return;

    setSelectedImage(null);
    setImagePreview(null);
    setError('');
    setUploadedPath(null);
    setUploadSuccess(false);
    setAnalysisResult('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || uploading || analyzing || uploadSuccess) {
      return;
    }

    setUploading(true);
    setError('');

    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('Please log in before uploading an image.');
      }

      const extensionByType: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp'
      };

      const extension = extensionByType[selectedImage.type];

      const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

      const { data, error: uploadError } = await supabase.storage
        .from('plant-doctor-images')
        .upload(filePath, selectedImage, {
          contentType: selectedImage.type,
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadedPath(data.path);
      setUploadSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Image upload failed. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || analyzing || uploading) return;

    setAnalyzing(true);
    setError('');
    setAnalysisResult('');

    try {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error('Please log in before using AI Plant Doctor.');
      }

      const formData = new FormData();

      formData.append('image', selectedImage);
      formData.append('cropName', cropName.trim());
      formData.append('symptoms', symptoms.trim());

      const response = await fetch(
        `${API_BASE_URL}/plant-doctor/analyze`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`
          },
          body: formData
        }
      );

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
          responseData?.error?.message ||
          (typeof responseData?.error === 'string'
            ? responseData.error
            : '') ||
          `AI analysis failed (HTTP ${response.status}).`
        );
      }

      const result = responseData?.analysis;

      if (typeof result !== 'string' || !result.trim()) {
        throw new Error(
          'The AI returned an empty or unexpected response.'
        );
      }

      setAnalysisResult(result.trim());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to analyze the plant image.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center">
          <Stethoscope className="w-6 h-6 text-leaf-light" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            AI Plant Doctor
          </h1>
          <p className="text-xs text-slate-500">
            Multimodal Crop Disease &amp; Health Diagnostic Engine
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-forest-200 hover:border-forest-500 bg-forest-50/50 rounded-2xl p-6 sm:p-8 text-center transition">
          <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto text-forest-800 mb-3">
            <Camera className="w-8 h-8" />
          </div>

          <h3 className="font-bold text-forest-950 text-base mb-1">
            Upload or Capture Leaf Photo
          </h3>

          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Take a clear, well-lit photo of the affected plant leaf
            or crop area. Supported formats: JPG, PNG, WEBP.
            Maximum size: 5 MB.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImageChange}
          />

          <button
            type="button"
            disabled={uploading || analyzing}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow transition disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {selectedImage ? 'Change Image' : 'Select Image'}
          </button>

          {/* Image Preview */}
          {selectedImage && imagePreview && (
            <div className="mt-6">
              <div className="flex items-center justify-center gap-2 text-green-700 mb-3">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-semibold">
                  Image Selected Successfully
                </span>
              </div>

              <img
                src={imagePreview}
                alt="Selected plant for diagnosis"
                className="max-h-72 max-w-full mx-auto rounded-xl border border-slate-200 object-contain"
              />

              <p className="text-xs text-slate-500 mt-3 break-all">
                {selectedImage.name}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                <button
                  type="button"
                  disabled={uploading || analyzing}
                  onClick={removeImage}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Remove Image
                </button>

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading || analyzing || uploadSuccess}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold transition disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : uploadSuccess ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}

                  {uploading
                    ? 'Uploading...'
                    : uploadSuccess
                      ? 'Uploaded'
                      : 'Upload to Supabase'}
                </button>
              </div>

              {uploadSuccess && uploadedPath && (
                <div
                  role="status"
                  className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-green-700"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Image uploaded successfully!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Crop Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="plant-crop-name"
              className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
            >
              Crop Name (Optional)
            </label>

            <input
              id="plant-crop-name"
              type="text"
              maxLength={100}
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="e.g. Tomato, Cotton, Rice, Maize"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="plant-symptoms"
              className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
            >
              Observed Symptoms (Optional)
            </label>

            <input
              id="plant-symptoms"
              type="text"
              maxLength={500}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Yellow spots, wilting leaves"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!selectedImage || analyzing || uploading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-green-800 hover:bg-green-900 text-white font-bold text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Plant Image...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Plant with AI
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-500">
            Powered by Gemini AI • Results are advisory, not a confirmed diagnosis
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Analysis Loading */}
        {analyzing && (
          <div
            role="status"
            className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center space-y-3"
          >
            <Loader2 className="w-10 h-10 text-green-700 animate-spin mx-auto" />
            <h3 className="font-bold text-green-900">
              Gemini AI is examining your plant
            </h3>
            <p className="text-sm text-green-800">
              Checking visible symptoms and preparing safe agricultural advice.
            </p>
          </div>
        )}

        {/* AI Diagnosis Result */}
        {analysisResult && !analyzing && (
          <section
            aria-label="AI plant diagnosis"
            className="rounded-2xl border border-green-200 bg-green-50/50 overflow-hidden"
          >
            <div className="bg-green-800 px-5 py-4 text-white flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <h2 className="font-bold text-lg">
                  AI Plant Health Analysis
                </h2>
                <p className="text-xs text-green-100">
                  Gemini-powered advisory report
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-green-100 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">
                    Crop
                  </p>
                  <p className="font-semibold text-slate-900">
                    {cropName.trim() || 'Not specified'}
                  </p>
                </div>

                <div className="bg-white border border-green-100 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">
                    Observed Symptoms
                  </p>
                  <p className="font-semibold text-slate-900">
                    {symptoms.trim() || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-green-900 mb-4">
                  Diagnosis and Recommendations
                </h3>

                <FormattedAnalysis content={analysisResult} />
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 hover:bg-green-900 text-white text-sm font-semibold disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                Analyze Again
              </button>
            </div>
          </section>
        )}

        {/* Responsible AI Notice */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />

          <p>
            <strong>Responsible AI Notice:</strong> Image analysis
            provides possible disease indicators, not a confirmed
            diagnosis. Consult a local agricultural expert or KVK
            center before applying crop treatments. Never apply
            hazardous chemical doses without professional verification.
          </p>
        </div>
      </div>
    </div>
  );
};
