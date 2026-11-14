
import React, { useCallback, useEffect, useState } from 'react';
import {
  CloudSun,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Gauge,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
  Sprout
} from 'lucide-react';

type CurrentWeather = {
  temperature_2m: number;
  relative_humidity_2m: number;
  precipitation: number;
  wind_speed_10m: number;
  weather_code: number;
  time: string;
};

type DailyWeather = {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  weather_code: number[];
};

type WeatherResponse = {
  current: CurrentWeather;
  daily: DailyWeather;
};

const LATITUDE = 15.4589;
const LONGITUDE = 75.0078;

const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Clear Sky';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rainy';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain Showers';
  if (code <= 86) return 'Snow Showers';
  if (code <= 99) return 'Thunderstorms';
  return 'Unknown';
};

const formatDay = (date: string): string => {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};

export const WeatherPage: React.FC = () => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchWeather = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        latitude: String(LATITUDE),
        longitude: String(LONGITUDE),
        current:
          'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code',
        daily:
          'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code',
        timezone: 'Asia/Kolkata',
        forecast_days: '7'
      });

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
        { signal }
      );

      if (!response.ok) {
        throw new Error(`Weather service returned HTTP ${response.status}`);
      }

      const data: WeatherResponse = await response.json();

      if (!data.current || !data.daily) {
        throw new Error('Incomplete weather data received');
      }

      if (signal?.aborted) return;

      setWeather(data);
      setLastUpdated(
        new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      );
    } catch (err) {
      if (signal?.aborted) return;

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load weather information'
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void fetchWeather(controller.signal);

    return () => controller.abort();
  }, [fetchWeather]);

  const current = weather?.current;
  const daily = weather?.daily;

  const rainNextTwoDays = daily
    ? daily.precipitation_sum.slice(0, 2).reduce(
      (total, value) => total + value,
      0
    )
    : 0;

  const maxRainProbability = daily
    ? Math.max(...daily.precipitation_probability_max.slice(0, 2))
    : 0;

  const isHot = current ? current.temperature_2m >= 35 : false;
  const isWindy = current ? current.wind_speed_10m >= 35 : false;
  const rainExpected = rainNextTwoDays >= 5 || maxRainProbability >= 70;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center">
            <CloudSun className="w-6 h-6 text-leaf-light" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Agricultural Weather Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Live weather and 7-day forecast powered by Open-Meteo
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void fetchWeather()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Refresh Weather'}
        </button>
      </div>

      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
          <AlertTriangle className="w-5 h-5 inline mr-2" />
          {error}
        </div>
      )}

      {loading && !weather && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-green-700 mx-auto mb-3" />
          <p className="text-slate-600">Fetching live agricultural weather...</p>
        </div>
      )}

      {current && daily && (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <span className="text-xs font-semibold text-forest-700 uppercase">
                  Selected Location
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  Dharwad, Karnataka
                </h2>
                <p className="text-xs text-slate-500">
                  Lat: {LATITUDE}, Lon: {LONGITUDE}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Last refreshed: {lastUpdated}
                </p>
              </div>

              <div className="text-right">
                <span className="text-4xl font-extrabold text-slate-900">
                  {Math.round(current.temperature_2m)}°C
                </span>
                <p className="text-sm text-emerald-700 font-semibold">
                  {getWeatherDescription(current.weather_code)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <Droplets className="w-6 h-6 text-sky-500" />
                <div>
                  <p className="text-xs text-slate-500">Humidity</p>
                  <p className="text-lg font-bold text-slate-800">
                    {current.relative_humidity_2m}%
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <Wind className="w-6 h-6 text-teal-500" />
                <div>
                  <p className="text-xs text-slate-500">Wind Speed</p>
                  <p className="text-lg font-bold text-slate-800">
                    {current.wind_speed_10m} km/h
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <Gauge className="w-6 h-6 text-amber-500" />
                <div>
                  <p className="text-xs text-slate-500">Precipitation</p>
                  <p className="text-lg font-bold text-slate-800">
                    {current.precipitation} mm
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-green-700" />
              <h2 className="text-lg font-bold text-slate-900">
                7-Day Weather Forecast
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {daily.time.map((date, index) => (
                <div
                  key={date}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3"
                >
                  <p className="text-sm font-bold text-slate-800">
                    {formatDay(date)}
                  </p>

                  <div className="flex items-center gap-2">
                    {daily.precipitation_probability_max[index] >= 60 ? (
                      <CloudRain className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Sun className="w-6 h-6 text-amber-500" />
                    )}
                    <p className="font-semibold text-slate-800">
                      {Math.round(daily.temperature_2m_max[index])}°
                      / {Math.round(daily.temperature_2m_min[index])}°C
                    </p>
                  </div>

                  <p className="text-xs text-slate-600">
                    {getWeatherDescription(daily.weather_code[index])}
                  </p>
                  <p className="text-xs text-blue-700">
                    Rain chance: {daily.precipitation_probability_max[index]}%
                  </p>
                  <p className="text-xs text-slate-600">
                    Expected rain: {daily.precipitation_sum[index]} mm
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-green-700" />
              <h2 className="text-lg font-bold text-slate-900">
                Smart Farming Weather Insights
              </h2>
            </div>

            {rainExpected ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="font-semibold text-blue-900 flex items-center gap-2">
                  <CloudRain className="w-5 h-5" />
                  Rain Expected
                </p>
                <p className="text-sm text-blue-800 mt-2">
                  Rainfall may occur within the next two days.
                  Check field drainage and consider delaying irrigation
                  until soil moisture and rainfall are assessed.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="font-semibold text-green-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Limited Rainfall Expected
                </p>
                <p className="text-sm text-green-800 mt-2">
                  Significant rainfall is not currently indicated
                  for the next two days. Check soil moisture and
                  crop requirements before deciding on irrigation.
                </p>
              </div>
            )}

            {isHot && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="font-semibold text-amber-900">
                  High Temperature Alert
                </p>
                <p className="text-sm text-amber-800 mt-2">
                  Current temperature is high. Monitor crops for
                  heat stress and prioritize moisture conservation.
                </p>
              </div>
            )}

            {isWindy && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="font-semibold text-amber-900">
                  Strong Wind Alert
                </p>
                <p className="text-sm text-amber-800 mt-2">
                  Strong winds are occurring. Protect vulnerable
                  crops and postpone spraying activities.
                </p>
              </div>
            )}

            <p className="text-xs text-slate-500">
              Weather insights are general rule-based guidance.
              Forecasts can change. Actual irrigation decisions
              also depend on soil moisture, crop type and growth stage.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
