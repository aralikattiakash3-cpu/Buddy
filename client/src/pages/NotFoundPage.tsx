import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-8 h-8 text-green-700" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 mb-2">404</h1>
        <h2 className="text-lg font-bold text-slate-700 mb-2">Field Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The agricultural advisory page you are looking for does not exist or has been moved.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/" className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link to="/dashboard" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
