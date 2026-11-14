
import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Leaf,
  FlaskConical,
  RotateCcw
} from 'lucide-react';

type Nutrient = 'Nitrogen' | 'Phosphorus' | 'Potassium';

type SoilResult = {
  nutrient: Nutrient;
  value: number;
  note: string;
  suggestion: string;
};

export const SoilAdvisorPage: React.FC = () => {
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');

  const [results, setResults] = useState<SoilResult[]>([]);
  const [error, setError] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  const analyzeSoil = () => {
    setError('');
    setAnalyzed(false);

    const fields = [
      { nutrient: 'Nitrogen' as Nutrient, value: nitrogen },
      { nutrient: 'Phosphorus' as Nutrient, value: phosphorus },
      { nutrient: 'Potassium' as Nutrient, value: potassium }
    ];

    if (fields.some((field) => field.value.trim() === '')) {
      setError('Please enter all three NPK values from your soil test.');
      return;
    }

    const parsed = fields.map((field) => ({
      nutrient: field.nutrient,
      value: Number(field.value)
    }));

    if (
      parsed.some(
        (field) => !Number.isFinite(field.value) || field.value < 0
      )
    ) {
      setError('Enter valid, non-negative numeric values.');
      return;
    }

    const suggestions: Record<Nutrient, string> = {
      Nitrogen:
        'Nitrogen supports leaf and stem growth. Consider crop rotation with legumes, suitable compost and green manure to support long-term soil fertility.',
      Phosphorus:
        'Phosphorus supports root development and flowering. Maintain appropriate soil pH and use well-decomposed organic matter to support nutrient availability.',
      Potassium:
        'Potassium supports water regulation and plant stress tolerance. Maintain soil organic matter and avoid unnecessary nutrient applications.'
    };

    const notes: Record<Nutrient, string> = {
      Nitrogen:
        'Nitrogen availability depends on soil conditions, crop requirements and the laboratory testing method.',
      Phosphorus:
        'Available phosphorus is strongly affected by soil pH and the laboratory extraction method.',
      Potassium:
        'Available potassium depends on soil minerals, texture and the laboratory testing method.'
    };

    const output = parsed.map((field) => ({
      nutrient: field.nutrient,
      value: field.value,
      note: notes[field.nutrient],
      suggestion: suggestions[field.nutrient]
    }));

    setResults(output);
    setAnalyzed(true);
  };

  const resetForm = () => {
    setNitrogen('');
    setPhosphorus('');
    setPotassium('');
    setResults([]);
    setError('');
    setAnalyzed(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center">
          <Layers className="w-6 h-6 text-leaf-light" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Soil Health Advisor
          </h1>
          <p className="text-xs text-slate-500">
            Soil nutrient information and sustainable farming guidance
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Enter Soil Test Values
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Enter nitrogen, phosphorus and potassium values reported
            in kg/ha by your soil testing laboratory.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="soil-n"
              className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
            >
              Nitrogen (N) — kg/ha
            </label>
            <input
              id="soil-n"
              type="number"
              min="0"
              step="any"
              value={nitrogen}
              onChange={(e) => setNitrogen(e.target.value)}
              placeholder="e.g. 250"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div>
            <label
              htmlFor="soil-p"
              className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
            >
              Phosphorus (P) — kg/ha
            </label>
            <input
              id="soil-p"
              type="number"
              min="0"
              step="any"
              value={phosphorus}
              onChange={(e) => setPhosphorus(e.target.value)}
              placeholder="e.g. 20"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div>
            <label
              htmlFor="soil-k"
              className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
            >
              Potassium (K) — kg/ha
            </label>
            <input
              id="soil-k"
              type="number"
              min="0"
              step="any"
              value={potassium}
              onChange={(e) => setPotassium(e.target.value)}
              placeholder="e.g. 180"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={analyzeSoil}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-sm shadow transition"
          >
            <Sparkles className="w-4 h-4 text-leaf-light" />
            Analyze Soil Health
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Results */}
      {analyzed && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-700 shrink-0" />
            <div>
              <h2 className="font-bold text-green-900">
                Soil Information Report Generated
              </h2>
              <p className="text-sm text-green-800 mt-1">
                Your NPK measurements have been recorded below,
                along with general nutrient and soil-care guidance.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <FlaskConical className="w-5 h-5 text-green-700" />
              <h2 className="text-lg font-bold text-slate-900">
                NPK Nutrient Overview
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.map((result) => (
                <div
                  key={result.nutrient}
                  className="border border-slate-200 bg-slate-50 rounded-xl p-5 space-y-3"
                >
                  <p className="font-semibold text-slate-800">
                    {result.nutrient}
                  </p>
                  <p className="text-3xl font-extrabold text-green-800">
                    {result.value}
                    <span className="text-sm font-medium text-slate-500 ml-1">
                      kg/ha
                    </span>
                  </p>
                  <p className="text-sm text-slate-600">
                    {result.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-700" />
              <h2 className="text-lg font-bold text-slate-900">
                Sustainable Soil Improvement Guidance
              </h2>
            </div>

            {results.map((result) => (
              <div
                key={result.nutrient}
                className="bg-green-50 border border-green-100 rounded-xl p-4"
              >
                <h3 className="font-semibold text-green-900">
                  {result.nutrient} Management
                </h3>
                <p className="text-sm text-green-800 mt-2 leading-6">
                  {result.suggestion}
                </p>
              </div>
            ))}

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-900">
                <strong>Important:</strong> This prototype does not
                classify nutrient levels as deficient, adequate or
                excessive. Such classifications require the soil
                laboratory method, locally validated reference
                ranges, crop requirements and additional soil data.
                Consult a soil testing laboratory or agricultural
                extension expert before applying fertilizers.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
