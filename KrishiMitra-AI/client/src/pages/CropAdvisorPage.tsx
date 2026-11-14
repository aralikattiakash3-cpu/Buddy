
import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Droplets,
  Sprout,
  CheckCircle2,
  Leaf,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

type Crop = {
  name: string;
  kannada: string;
  soils: string[];
  water: string[];
  reason: string;
  waterNeed: string;
  tip: string;
};

const crops: Crop[] = [
  {
    name: 'Chickpea (Gram)',
    kannada: 'ಕಡಲೆ',
    soils: ['black', 'red', 'alluvial'],
    water: ['rainfed', 'irrigated', 'low'],
    reason: 'A pulse crop suited to well-drained soils and relatively limited water.',
    waterNeed: 'Low to moderate',
    tip: 'Avoid waterlogging and use soil moisture to decide irrigation.'
  },
  {
    name: 'Sorghum (Jowar)',
    kannada: 'ಜೋಳ',
    soils: ['black', 'red', 'alluvial'],
    water: ['rainfed', 'irrigated', 'low'],
    reason: 'A relatively drought-tolerant cereal suited to many semi-arid farming systems.',
    waterNeed: 'Low to moderate',
    tip: 'Use mulching and timely weed control to conserve moisture.'
  },
  {
    name: 'Pearl Millet (Bajra)',
    kannada: 'ಸಜ್ಜೆ',
    soils: ['red', 'alluvial', 'black'],
    water: ['rainfed', 'low', 'irrigated'],
    reason: 'A hardy millet that can perform under relatively dry conditions.',
    waterNeed: 'Low',
    tip: 'Use locally recommended varieties and avoid unnecessary irrigation.'
  },
  {
    name: 'Groundnut',
    kannada: 'ಕಡಲೆಕಾಯಿ',
    soils: ['red', 'alluvial'],
    water: ['rainfed', 'irrigated'],
    reason: 'Often suited to well-drained, lighter-textured soils.',
    waterNeed: 'Moderate',
    tip: 'Maintain drainage and pay attention to moisture during flowering and pod development.'
  },
  {
    name: 'Cotton',
    kannada: 'ಹತ್ತಿ',
    soils: ['black', 'alluvial'],
    water: ['rainfed', 'irrigated', 'canal'],
    reason: 'Can be suitable for deep black soils with appropriate seasonal rainfall.',
    waterNeed: 'Moderate to high',
    tip: 'Consider drip irrigation where practical and avoid waterlogging.'
  },
  {
    name: 'Maize',
    kannada: 'ಮೆಕ್ಕೆಜೋಳ',
    soils: ['red', 'black', 'alluvial'],
    water: ['irrigated', 'canal', 'rainfed'],
    reason: 'Grows in several soil types when moisture and drainage are adequate.',
    waterNeed: 'Moderate',
    tip: 'Prioritize moisture during critical growth stages and avoid overwatering.'
  },
  {
    name: 'Pigeon Pea (Tur)',
    kannada: 'ತೊಗರಿ',
    soils: ['black', 'red', 'alluvial'],
    water: ['rainfed', 'low', 'irrigated'],
    reason: 'A deep-rooted pulse crop commonly grown in rainfed farming systems.',
    waterNeed: 'Low to moderate',
    tip: 'Use suitable spacing and maintain drainage during heavy rainfall.'
  },
  {
    name: 'Finger Millet (Ragi)',
    kannada: 'ರಾಗಿ',
    soils: ['red', 'alluvial', 'laterite'],
    water: ['rainfed', 'low', 'irrigated'],
    reason: 'A millet grown in several Karnataka regions, including rainfed areas.',
    waterNeed: 'Low to moderate',
    tip: 'Conserve soil moisture with mulching and timely field management.'
  },
  {
    name: 'Rice (Paddy)',
    kannada: 'ಭತ್ತ',
    soils: ['alluvial', 'laterite', 'black'],
    water: ['canal', 'irrigated'],
    reason: 'May be suitable where sufficient water and appropriate field conditions exist.',
    waterNeed: 'High',
    tip: 'Use locally recommended water-saving rice cultivation practices.'
  }
];

type Recommendation = Crop & {
  score: number;
};

export const CropAdvisorPage: React.FC = () => {
  const [state, setState] = useState('Karnataka');
  const [district, setDistrict] = useState('Dharwad');
  const [soil, setSoil] = useState('black');
  const [water, setWater] = useState('rainfed');
  const [results, setResults] = useState<Recommendation[]>([]);
  const [generated, setGenerated] = useState(false);

  const generateRecommendations = () => {
    const ranked = crops
      .filter(crop => crop.soils.includes(soil))
      .map(crop => {
        let score = 55;

        if (crop.soils[0] === soil) score += 20;
        else score += 10;

        if (crop.water.includes(water)) score += 15;
        else score -= 20;

        if (crop.water[0] === water) score += 10;

        if (
          water === 'low' &&
          crop.waterNeed === 'High'
        ) {
          score -= 30;
        }

        return {
          ...crop,
          score: Math.max(0, Math.min(100, score))
        };
      })
      .filter(crop => crop.score >= 60)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setResults(ranked);
    setGenerated(true);
  };

  const resetResults = () => {
    setResults([]);
    setGenerated(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center">
          <Compass className="w-6 h-6 text-leaf-light" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Smart Crop Recommendation Engine
          </h1>
          <p className="text-xs text-slate-500">
            Sustainable crop guidance based on farm conditions
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="font-bold text-forest-950 text-base">
          Farm & Land Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={e => {
                setState(e.target.value);
                resetResults();
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              District
            </label>
            <input
              type="text"
              value={district}
              onChange={e => {
                setDistrict(e.target.value);
                resetResults();
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Soil Type
            </label>
            <select
              value={soil}
              onChange={e => {
                setSoil(e.target.value);
                resetResults();
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            >
              <option value="black">Black Soil (ಕಪ್ಪು ಮಣ್ಣು)</option>
              <option value="red">Red Soil (ಕೆಂಪು ಮಣ್ಣು)</option>
              <option value="alluvial">Alluvial / Sandy Loam</option>
              <option value="laterite">Laterite Soil</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Water Availability
            </label>
            <select
              value={water}
              onChange={e => {
                setWater(e.target.value);
                resetResults();
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            >
              <option value="rainfed">Rainfed / Moderate</option>
              <option value="irrigated">Borewell / Irrigated</option>
              <option value="canal">Canal Water</option>
              <option value="low">Low / Drought Prone</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={generateRecommendations}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-sm shadow transition"
        >
          <Sparkles className="w-4 h-4 text-leaf-light" />
          Generate Suitable Crop Recommendations
        </button>
      </div>

      {generated && (
        <div className="space-y-5">
          <div className="bg-green-50 rounded-2xl border border-green-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-700" />
              <h2 className="font-bold text-green-900">
                Crop Recommendations Generated
              </h2>
            </div>
            <p className="text-sm text-green-800">
              Showing preliminary recommendations for{' '}
              {district || 'your district'}, {state || 'your state'}.
              Rankings are based on the selected soil and water conditions.
            </p>
          </div>

          {results.length === 0 ? (
            <div className="bg-white border border-amber-200 rounded-xl p-5">
              <p className="text-sm text-amber-800">
                No suitable crops were found for this combination.
                Try adjusting your farm conditions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((crop, index) => (
                <div
                  key={crop.name}
                  className="bg-white border border-green-200 rounded-2xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
                        <Sprout className="w-6 h-6 text-green-700" />
                      </div>
                      <div>
                        <p className="text-xs text-green-700 font-semibold">
                          Recommendation #{index + 1}
                        </p>
                        <h3 className="font-bold text-slate-900">
                          {crop.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {crop.kannada}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-800 bg-green-50 px-3 py-1 rounded-lg">
                      {crop.score}/100
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500 mb-1">
                      Why this crop?
                    </p>
                    <p className="text-sm text-slate-700">
                      {crop.reason}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <Droplets className="w-4 h-4" />
                    Water requirement: {crop.waterNeed}
                  </div>

                  <div className="bg-green-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Leaf className="w-4 h-4 text-green-700" />
                      <p className="text-xs font-bold text-green-900">
                        Sustainability Tip
                      </p>
                    </div>
                    <p className="text-xs text-green-900">
                      {crop.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={resetResults}
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-800 hover:text-green-950"
          >
            <RefreshCw className="w-4 h-4" />
            Clear Recommendations
          </button>
        </div>
      )}

      <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
        <p className="text-xs text-amber-900">
          <strong>Advisory Notice:</strong> This is a rule-based
          demonstration using general crop suitability guidance.
          Scores are illustrative, not scientifically validated
          probabilities. Location is displayed for context but
          is not yet used for live climate or seasonal analysis.
          Confirm soil, season, rainfall and local crop suitability
          with agricultural experts before planting.
        </p>
      </div>
    </div>
  );
};
