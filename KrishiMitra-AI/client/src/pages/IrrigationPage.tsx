
import React, { useState } from 'react';
import {
  Droplets,
  Sparkles,
  Leaf,
  CloudRain,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sprout,
  Gauge
} from 'lucide-react';

type IrrigationResult = {
  status: string;
  priority: 'low' | 'medium' | 'high';
  explanation: string;
  recommendations: string[];
};

export const IrrigationPage: React.FC = () => {
  const [crop, setCrop] = useState('Tomato');
  const [stage, setStage] = useState('Vegetative');
  const [soil, setSoil] = useState('Black Soil');
  const [moisture, setMoisture] = useState('Moderate');
  const [rainfall, setRainfall] = useState('0');

  const [result, setResult] = useState<IrrigationResult | null>(null);
  const [error, setError] = useState('');

  const analyzeIrrigation = () => {
    setError('');
    setResult(null);

    if (!crop.trim()) {
      setError('Please enter a crop name.');
      return;
    }

    if (rainfall.trim() === '') {
      setError('Please enter recent rainfall in millimeters.');
      return;
    }

    const rain = Number(rainfall);

    if (!Number.isFinite(rain) || rain < 0) {
      setError('Please enter a valid non-negative rainfall value.');
      return;
    }

    const recommendations: string[] = [];

    let priority: IrrigationResult['priority'] = 'medium';
    let status = 'Check Field Conditions';
    let explanation =
      'Irrigation decisions depend on crop water requirements, root-zone moisture, soil properties and weather.';

    if (moisture === 'Wet') {
      priority = 'low';
      status = 'Irrigation May Not Be Needed Yet';
      explanation =
        'The soil is reported as wet. Additional watering may increase waterlogging risk.';
      recommendations.push(
        'Check root-zone moisture before applying more water.',
        'Inspect drainage and avoid water accumulation around plant roots.'
      );
    } else if (moisture === 'Dry') {
      priority = 'high';
      status = 'Inspect for Irrigation Need';
      explanation =
        'Dry soil can indicate a need for irrigation, especially during sensitive growth stages.';
      recommendations.push(
        'Inspect soil moisture at the crop root depth before irrigating.',
        'If irrigation is needed, apply water gradually and avoid surface runoff.'
      );
    } else {
      priority = 'medium';
      status = 'Monitor Soil Moisture';
      explanation =
        'Moderate soil moisture suggests checking crop condition and root-zone moisture before scheduling irrigation.';
      recommendations.push(
        'Monitor soil moisture regularly rather than irrigating on a fixed calendar alone.'
      );
    }

    if (rain >= 10) {
      recommendations.push(
        'Recent rainfall was reported. Check how much water entered the soil before scheduling additional irrigation.'
      );

      if (moisture !== 'Dry') {
        priority = 'low';
        status = 'Recheck Moisture After Rainfall';
      }
    }

    if (stage === 'Flowering' || stage === 'Fruiting / Grain Filling') {
      recommendations.push(
        'This growth stage may be sensitive to water stress. Avoid prolonged drying while also preventing waterlogging.'
      );
    }

    if (soil === 'Sandy Soil') {
      recommendations.push(
        'Sandy soils often drain quickly. Monitor moisture more frequently and consider suitable mulching.'
      );
    } else if (soil === 'Black Soil') {
      recommendations.push(
        'Black soils may retain substantial moisture. Check below the surface before adding water.'
      );
    } else if (soil === 'Clay Soil') {
      recommendations.push(
        'Clay-rich soils may drain slowly. Avoid excessive irrigation and check for waterlogging.'
      );
    } else {
      recommendations.push(
        'Monitor soil moisture and drainage according to local soil conditions.'
      );
    }

    recommendations.push(
      'Use mulch where appropriate to reduce evaporation and conserve soil moisture.',
      'Consider drip irrigation where suitable for the crop and farm conditions.',
      'Check local weather forecasts before making the final irrigation decision.'
    );

    setResult({
      status,
      priority,
      explanation,
      recommendations
    });
  };

  const resetForm = () => {
    setCrop('Tomato');
    setStage('Vegetative');
    setSoil('Black Soil');
    setMoisture('Moderate');
    setRainfall('0');
    setResult(null);
    setError('');
  };

  const priorityStyle = {
    low: 'bg-green-50 border-green-200 text-green-900',
    medium: 'bg-amber-50 border-amber-200 text-amber-900',
    high: 'bg-orange-50 border-orange-200 text-orange-900'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center">
          <Droplets className="w-6 h-6 text-leaf-light" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Smart Irrigation Guidance
          </h1>
          <p className="text-xs text-slate-500">
            Water conservation and crop-stage irrigation planning
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Farm Irrigation Parameters
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Enter your field conditions to receive practical,
            water-saving irrigation guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="irrigation-crop"
              className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
            >
              Crop Name
            </label>
            <input
              id="irrigation-crop"
              type="text"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder="e.g. Tomato, Cotton, Wheat"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div>
            <label
              htmlFor="irrigation-stage"
              className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
            >
              Growth Stage
            </label>
            <select
              id="irrigation-stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            >
              <option>Seedling</option>
              <option>Vegetative</option>
              <option>Flowering</option>
              <option>Fruiting / Grain Filling</option>
              <option>Maturity</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="irrigation-soil"
              className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
            >
              Soil Type
            </label>
            <select
              id="irrigation-soil"
              value={soil}
              onChange={(e) => setSoil(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            >
              <option>Black Soil</option>
              <option>Red Soil</option>
              <option>Sandy Soil</option>
              <option>Clay Soil</option>
              <option>Loamy Soil</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="irrigation-moisture"
              className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
            >
              Current Soil Moisture
            </label>
            <select
              id="irrigation-moisture"
              value={moisture}
              onChange={(e) => setMoisture(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            >
              <option>Dry</option>
              <option>Moderate</option>
              <option>Wet</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="irrigation-rainfall"
              className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
            >
              Recent Rainfall (mm)
            </label>
            <input
              id="irrigation-rainfall"
              type="number"
              min="0"
              step="any"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={analyzeIrrigation}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-sm shadow transition"
          >
            <Sparkles className="w-4 h-4 text-leaf-light" />
            Get Irrigation Advice
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

      {/* Irrigation Results */}
      {result && (
        <div className="space-y-6">
          <div
            className={`border rounded-2xl p-6 ${priorityStyle[result.priority]}`}
          >
            <div className="flex items-start gap-3">
              {result.priority === 'high' ? (
                <AlertTriangle className="w-6 h-6 shrink-0" />
              ) : (
                <CheckCircle2 className="w-6 h-6 shrink-0" />
              )}

              <div>
                <p className="text-xs font-bold uppercase mb-1">
                  Irrigation Assessment
                </p>
                <h2 className="text-xl font-bold">
                  {result.status}
                </h2>
                <p className="text-sm mt-2 leading-6">
                  {result.explanation}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Gauge className="w-5 h-5 text-green-700" />
              <h2 className="text-lg font-bold text-slate-900">
                Farm Condition Summary
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                ['Crop', crop],
                ['Growth Stage', stage],
                ['Soil Type', soil],
                ['Soil Moisture', moisture],
                ['Recent Rainfall', `${rainfall} mm`]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-4"
                >
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-700" />
              <h2 className="text-lg font-bold text-slate-900">
                Water Conservation Recommendations
              </h2>
            </div>

            <div className="space-y-3">
              {result.recommendations.map((advice, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4"
                >
                  <Sprout className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                  <p className="text-sm text-green-900 leading-6">
                    {advice}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <CloudRain className="w-5 h-5 text-blue-700 shrink-0" />
              <p className="text-sm text-blue-900">
                <strong>Weather tip:</strong> Check the Weather Dashboard
                for upcoming rainfall before irrigating.
                This prototype uses the rainfall value you enter;
                it does not automatically retrieve weather data.
              </p>
            </div>

            <p className="text-xs text-slate-500">
              This is a rule-based planning prototype, not a measured
              irrigation requirement or a validated watering schedule.
              Consult local agricultural guidance for exact water
              quantities and timing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
