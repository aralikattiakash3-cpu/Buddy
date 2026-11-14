import React from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Bot,
  Compass,
  CloudSun,
  Droplets,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Volume2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Stethoscope,
      title: 'AI Plant Doctor',
      desc: 'Photograph crop leaves to instantly detect symptoms, disease patterns, and safe organic remedies with uncertainty estimation.',
      link: '/plant-doctor',
      badge: 'Multimodal AI'
    },
    {
      icon: Bot,
      title: 'Multilingual Voice Assistant',
      desc: 'Speak naturally in Kannada, Hindi, or English. Get contextual answers on pest control, fertilizers, and season guidance.',
      link: '/assistant',
      badge: 'Voice & Text'
    },
    {
      icon: Compass,
      title: 'Crop Recommendation Engine',
      desc: 'Receive tailored crop suggestions based on your state, district, soil type, water availability, and current season.',
      link: '/crop-advisor',
      badge: 'Location-Smart'
    },
    {
      icon: CloudSun,
      title: 'Agricultural Weather Hub',
      desc: 'Real-time hyper-local forecast powered by Open-Meteo with humidity, rain prediction, and agricultural alerts.',
      link: '/weather',
      badge: 'Live Data'
    },
    {
      icon: Layers,
      title: 'Soil Health Guidance',
      desc: 'Interpret NPK levels, soil pH, and organic matter to optimize fertilizer spending without damaging land biodiversity.',
      link: '/soil-advisor',
      badge: 'Nutrient Analysis'
    },
    {
      icon: Droplets,
      title: 'Precision Irrigation Advisor',
      desc: 'Calculate optimal watering cycles matching crop growth stages, rainfall records, and evaporation rates.',
      link: '/irrigation',
      badge: 'Water Conservation'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Speak or Snap',
      desc: 'Take a clear leaf photograph or speak your question in Kannada, Hindi, or English.'
    },
    {
      step: '02',
      title: 'Multimodal AI Analysis',
      desc: 'Our Gemini agricultural pipeline analyzes symptoms, soil context, and local weather patterns.'
    },
    {
      step: '03',
      title: 'Decide & Act',
      desc: 'Receive simple, step-by-step action plans, preventive methods, and schedule tasks on your planner.'
    }
  ];

  const benefits = [
    'Zero complex tech hurdles — designed specifically for rural farmers.',
    'Native Kannada (ಕನ್ನಡ) & Hindi (हिन्दी) support with voice readback.',
    'Responsible AI that never fabricates chemicals or diagnostic certainty.',
    'Integrated with real Open-Meteo forecasts — zero fabricated weather data.',
    'Built with secure Supabase storage and Row Level Security privacy.'
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-linear-to-b from-forest-50/70 via-cream-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200 text-xs sm:text-sm font-medium">
                <Sparkles className="w-4 h-4 text-leaf-dark" />
                <span>Next-Gen Smart Agriculture AI</span>
                <span className="hidden sm:inline text-forest-400">•</span>
                <span className="hidden sm:inline text-forest-700">ಕನ್ನಡ • हिन्दी • English</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-950 tracking-tight leading-[1.15]">
                Your Smart <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-forest-800 via-forest-700 to-leaf-dark">
                  Farming Partner.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Empowering Indian farmers to identify crop diseases, optimize soil nutrients, forecast weather risks, and maximize harvest yields with conversational AI.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-forest-800 hover:bg-forest-900 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition transform active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 text-leaf-light" />
                </Link>

                <a
                  href="#features"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-forest-50 text-forest-900 font-semibold px-6 py-3.5 rounded-xl border border-forest-200 shadow-xs hover:border-forest-300 transition"
                >
                  <span>Explore Features</span>
                </a>
              </div>

              {/* Tagline pills */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span className="flex items-center text-forest-800">
                  <span className="w-2 h-2 rounded-full bg-leaf-dark mr-2" />
                  Speak
                </span>
                <span className="text-slate-300">/</span>
                <span className="flex items-center text-forest-800">
                  <span className="w-2 h-2 rounded-full bg-leaf-dark mr-2" />
                  Diagnose
                </span>
                <span className="text-slate-300">/</span>
                <span className="flex items-center text-forest-800">
                  <span className="w-2 h-2 rounded-full bg-leaf-dark mr-2" />
                  Decide
                </span>
                <span className="text-slate-300">/</span>
                <span className="flex items-center text-forest-800">
                  <span className="w-2 h-2 rounded-full bg-leaf-dark mr-2" />
                  Grow
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual Agriculture Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-forest-100">
                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center font-bold text-sm">
                      KM
                    </div>
                    <div>
                      <h4 className="font-bold text-forest-950 text-sm">Krishi Diagnostic AI</h4>
                      <p className="text-xs text-slate-500">Live Field Assistant</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">
                    Online
                  </span>
                </div>

                <div className="py-5 space-y-4">
                  {/* Chat Preview Item 1 */}
                  <div className="bg-forest-50 p-3.5 rounded-2xl rounded-tl-xs text-xs text-forest-900 border border-forest-100 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-forest-800">
                      <span>ಕೃಷಿ ಸಲಹೆಗಾರ (Kannada)</span>
                      <Volume2 className="w-3.5 h-3.5 text-forest-600" />
                    </div>
                    <p>
                      "ಟೊಮ್ಯಾಟೊ ಎಲೆಗಳಲ್ಲಿ ಹಳದಿ ಕಲೆಗಳು ಕಾಣಿಸುತ್ತಿವೆ. ಆರಂಭಿಕ ಬ್ಲೈಟ್ (Early Blight) ಸಾಧ್ಯತೆ ಇದೆ. ಸಾವಯವ ಶಿಲೀಂಧ್ರನಾಶಕ ಬಳಸಿ."
                    </p>
                  </div>

                  {/* Diagnostic Metric Mock */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Confidence</span>
                      <p className="text-base font-bold text-forest-800">88% Moderate</p>
                      <span className="text-[9px] text-slate-400">Field estimate</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Action Urgent</span>
                      <p className="text-base font-bold text-amber-600">Within 48h</p>
                      <span className="text-[9px] text-slate-400">Spray schedule</span>
                    </div>
                  </div>

                  {/* Weather Snippet */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-xs">
                    <div className="flex items-center space-x-2">
                      <CloudSun className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-semibold text-slate-800">Weather Alert: Dharwad</p>
                        <p className="text-[10px] text-slate-500">Rain expected tomorrow (65%)</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Rain Delay
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/assistant"
                    className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow transition"
                  >
                    <span>Test AI Assistant Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-leaf-dark">
            Complete Farming Suite
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-forest-950">
            Intelligent Tools Built for Real Field Conditions
          </h3>
          <p className="text-slate-600 text-base">
            From crop disease imaging to precision weather alerts, KrishiMitra AI guides your farm decisions with responsible technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.link}
                className="group relative bg-white p-7 rounded-2xl border border-slate-200 hover:border-forest-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 group-hover:bg-forest-800 text-forest-800 group-hover:text-white flex items-center justify-center transition duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-forest-700 bg-forest-50 px-2.5 py-1 rounded-full border border-forest-100">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-forest-950 mb-2 group-hover:text-forest-700 transition">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-2 flex items-center text-xs font-semibold text-forest-700 group-hover:text-forest-900">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-forest-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-leaf-light">
              Simple 3-Step Workflow
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              How KrishiMitra AI Works
            </h3>
            <p className="text-slate-300 text-sm sm:text-base">
              Designed for ease of use in the field with voice input and instant camera diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="bg-forest-950/60 p-8 rounded-2xl border border-forest-800 relative">
                <span className="text-4xl font-black text-leaf-light/30 block mb-4">
                  {s.step}
                </span>
                <h4 className="text-xl font-bold text-white mb-2">
                  {s.title}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multilingual Support Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-forest-800 to-forest-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-leaf-light">
                Built for Indian Languages
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                ಕನ್ನಡ, हिन्दी & English at Your Fingertips
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Language should never be a barrier to high-tech agronomy. Farmers can ask queries in their mother tongue and receive clear audio-supported guidance.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-sm">
                  <span className="font-bold text-leaf-light">ಕನ್ನಡ:</span> "ನನ್ನ ಭತ್ತದ ಬೆಳೆಯಲ್ಲಿ ಕಂದು ಜಿಗಿ ರೋಗ ಕಾಣಿಸಿದೆ"
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-sm">
                  <span className="font-bold text-leaf-light">हिन्दी:</span> "गेहूं की फसल में पीला रतुआ का उपाय क्या है?"
                </div>
              </div>
            </div>
            <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-lg space-y-4">
              <h4 className="font-bold text-forest-950 text-base flex items-center">
                <ShieldCheck className="w-5 h-5 text-forest-700 mr-2" />
                Farmer Benefits & Trust
              </h4>
              <ul className="space-y-3">
                {benefits.map((b, idx) => (
                  <li key={idx} className="flex items-start text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-leaf-dark mr-2.5 mt-0.5 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
