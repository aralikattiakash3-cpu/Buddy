import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Leaf, Sprout, Bug, Droplets, MessageCircle, ChevronRight,
  CheckCircle, Users, BarChart3, Shield, ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Sprout,
      title: 'Smart Crop Recommendation',
      description: 'Get AI-powered crop suggestions tailored to your soil type, location, season, and water availability.',
      color: 'bg-green-100 text-green-700',
    },
    {
      icon: Bug,
      title: 'Crop Disease Detection',
      description: 'Upload a photo of your crop and our AI will analyze visible symptoms and suggest preventive steps.',
      color: 'bg-red-100 text-red-700',
    },
    {
      icon: Droplets,
      title: 'Irrigation Advisory',
      description: 'Receive water management guidance based on crop growth stage, soil type, and available irrigation.',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      icon: MessageCircle,
      title: 'Kisan AI Chatbot',
      description: 'Ask farming questions in English, Kannada, or Hindi and get instant agricultural guidance.',
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  const steps = [
    { step: '1', title: 'Create Your Farmer Profile', desc: 'Register with your location, land details, and irrigation type.' },
    { step: '2', title: 'Enter Farm Information', desc: 'Share soil details, season, and farming goals.' },
    { step: '3', title: 'Get AI Recommendations', desc: 'Receive personalized crop advice powered by Google Gemini AI.' },
    { step: '4', title: 'Download Your Report', desc: 'Save a PDF of your advisory to reference in the field.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-green-800 text-base block leading-tight">KrishiSeva AI</span>
              <span className="text-xs text-slate-500 leading-tight">Agriculture Advisory</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary text-sm py-2 px-4"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm py-2 px-4">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-green-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium text-green-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Powered by Google Gemini AI
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
              Your AI-Powered
              <span className="text-yellow-400 block">Kisan Advisor</span>
            </h1>

            <p className="text-lg md:text-xl text-green-100 mb-8 leading-relaxed max-w-2xl">
              Get smart, localized crop advice — from soil-based recommendations to disease detection —
              in English, Kannada, and Hindi. Built specifically for Indian farmers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-lg text-base">
                Start Free Advisory
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 border-2 border-white/40 hover:border-white text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 text-base">
                Login to Dashboard
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { icon: Users, text: 'Designed for Indian Farmers' },
                { icon: Shield, text: 'Secure & Private Data' },
                { icon: BarChart3, text: 'Real AI Advisory' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-green-100">
                  <Icon className="w-4 h-4 text-yellow-400" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-800 mb-3">Complete Agricultural Advisory Platform</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            All the tools a modern Indian farmer needs, powered by advanced AI and built for real farm conditions.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="card p-6 card-hover">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2 text-sm">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Crop Categories */}
      <section className="py-16 bg-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Advisory for 40+ Crop Types</h2>
            <p className="text-slate-500 text-sm">From cereals and pulses to fruits and spices</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Rice', 'Wheat', 'Maize', 'Ragi', 'Groundnut', 'Sunflower', 'Tomato', 'Onion',
              'Potato', 'Chilli', 'Sugarcane', 'Cotton', 'Mango', 'Banana', 'Coffee',
              'Arecanut', 'Coconut', 'Turmeric', 'Ginger', 'Cardamom', 'Soybean', 'Chickpea',
            ].map(crop => (
              <span key={crop} className="badge-green text-xs py-1.5 px-3 font-medium">
                🌾 {crop}
              </span>
            ))}
            <span className="badge-slate text-xs py-1.5 px-3 font-medium">+ many more</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-800 mb-3">Get Started in 4 Simple Steps</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ step, title, desc }) => (
            <div key={step} className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center font-black text-sm shrink-0">
                  {step}
                </div>
                {step !== '4' && (
                  <div className="hidden lg:block flex-1 h-0.5 bg-green-200" />
                )}
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-800 text-white text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-4">Ready to Grow Smarter?</h2>
          <p className="text-green-200 mb-8 text-base">
            Join Indian farmers already using AI for better crop decisions. Free to use.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg text-base">
            Create Your Farmer Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-green-200 py-8 px-4 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Leaf className="w-4 h-4 text-green-400" />
          <span className="font-bold text-white">KrishiSeva AI</span>
        </div>
        <p className="text-green-400 text-xs mb-2">AI-Powered Agriculture Advisory for Indian Farmers</p>
        <p className="text-green-500 text-xs">
          Advisory content is for decision-support only. Consult certified agricultural officers for field-specific guidance.
        </p>
      </footer>
    </div>
  );
}
