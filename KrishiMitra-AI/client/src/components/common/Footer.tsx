import React from 'react';
import { Sprout, Heart, ShieldAlert, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-slate-300 border-t border-forest-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center shadow">
                <Sprout className="w-6 h-6 text-leaf-light" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Krishi<span className="text-leaf-light">Mitra</span> AI
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering Indian farmers with multilingual AI diagnostics, climate-smart advisory, and real-time guidance in Kannada, Hindi, and English.
            </p>
            <div className="flex items-center text-xs text-leaf-light font-medium space-x-1.5 pt-1">
              <Award className="w-4 h-4" />
              <span>Smart Agriculture Hackathon Edition</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              AI Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/plant-doctor" className="hover:text-leaf-light transition">
                  Plant Doctor (Crop Disease)
                </Link>
              </li>
              <li>
                <Link to="/crop-advisor" className="hover:text-leaf-light transition">
                  Crop Recommendation Engine
                </Link>
              </li>
              <li>
                <Link to="/soil-advisor" className="hover:text-leaf-light transition">
                  Soil Health Advisor
                </Link>
              </li>
              <li>
                <Link to="/irrigation" className="hover:text-leaf-light transition">
                  Smart Irrigation Planner
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-leaf-light transition">
                  Multilingual Voice Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Farmer Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/weather" className="hover:text-leaf-light transition">
                  Open-Meteo Weather Forecast
                </Link>
              </li>
              <li>
                <Link to="/farm-planner" className="hover:text-leaf-light transition">
                  Farming Action Tasks
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-leaf-light transition">
                  Advisory Reports History
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Languages: ಕನ್ನಡ | हिन्दी | English</span>
              </li>
            </ul>
          </div>

          {/* Responsible AI Disclaimer */}
          <div className="bg-forest-900/60 p-4 rounded-xl border border-forest-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 text-sm font-medium">
              <ShieldAlert className="w-4 h-4" />
              <span>Responsible AI Notice</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              KrishiMitra AI provides decision support and advisory estimates. Always cross-verify critical crop management decisions and pesticide applications with your local Krishi Vigyan Kendra (KVK) or agricultural extension officer.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-forest-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} KrishiMitra AI. Built for Indian Farmers.</p>
          <div className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
            <span>for sustainable agriculture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
