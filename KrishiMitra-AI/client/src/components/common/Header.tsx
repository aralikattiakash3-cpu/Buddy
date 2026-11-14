import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Globe, Menu, X, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  currentLanguage?: 'kn' | 'hi' | 'en';
  onLanguageChange?: (lang: 'kn' | 'hi' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage = 'kn',
  onLanguageChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'Plant Doctor', path: '/plant-doctor' },
    { name: 'Crop Advisor', path: '/crop-advisor' },
    { name: 'Weather', path: '/weather' },
  ];

  const displayName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || '';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-forest-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center shadow-md group-hover:bg-forest-700 transition">
              <Sprout className="w-6 h-6 text-leaf-light" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-forest-950 flex items-center">
                Krishi<span className="text-leaf-dark">Mitra</span>
                <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200">
                  AI
                </span>
              </span>
              <p className="text-[10px] text-slate-500 hidden sm:block -mt-1 font-medium">
                Speak. Diagnose. Decide. Grow.
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-forest-700 ${location.pathname === link.path
                    ? 'text-forest-800 font-semibold'
                    : 'text-slate-600'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action buttons & Language */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center bg-cream-100 rounded-lg p-1 border border-forest-200">
              <Globe className="w-4 h-4 text-forest-700 ml-1.5 mr-1" />
              <button
                onClick={() => onLanguageChange && onLanguageChange('kn')}
                className={`text-xs px-2 py-1 rounded font-medium transition ${currentLanguage === 'kn'
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-slate-700 hover:text-forest-800'
                  }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => onLanguageChange && onLanguageChange('hi')}
                className={`text-xs px-2 py-1 rounded font-medium transition ${currentLanguage === 'hi'
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-slate-700 hover:text-forest-800'
                  }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange && onLanguageChange('en')}
                className={`text-xs px-2 py-1 rounded font-medium transition ${currentLanguage === 'en'
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-slate-700 hover:text-forest-800'
                  }`}
              >
                ENG
              </button>
            </div>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-forest-50 text-forest-800 border border-forest-200 hover:bg-forest-100 transition"
                >
                  <UserCheck className="w-3.5 h-3.5 text-forest-700" />
                  <span>{displayName}</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-2 text-sm font-semibold text-white bg-forest-800 hover:bg-forest-900 px-4 py-2.5 rounded-lg shadow-xs hover:shadow transition"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-forest-900 hover:text-forest-700 px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 text-sm font-semibold text-white bg-forest-800 hover:bg-forest-900 px-4 py-2.5 rounded-lg shadow-xs hover:shadow transition"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-forest-800 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-forest-100 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Language
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onLanguageChange && onLanguageChange('kn')}
                className={`text-xs px-2 py-1 rounded font-medium ${currentLanguage === 'kn' ? 'bg-forest-800 text-white' : 'bg-slate-100'
                  }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => onLanguageChange && onLanguageChange('hi')}
                className={`text-xs px-2 py-1 rounded font-medium ${currentLanguage === 'hi' ? 'bg-forest-800 text-white' : 'bg-slate-100'
                  }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange && onLanguageChange('en')}
                className={`text-xs px-2 py-1 rounded font-medium ${currentLanguage === 'en' ? 'bg-forest-800 text-white' : 'bg-slate-100'
                  }`}
              >
                ENG
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 text-slate-800 font-medium hover:bg-forest-50 hover:text-forest-800 rounded-md"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center w-full py-2 text-sm font-semibold text-white bg-forest-800 rounded-lg shadow"
              >
                Go to Farmer Dashboard ({displayName})
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center w-full py-2 text-sm font-semibold text-forest-900 border border-forest-300 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center w-full py-2 text-sm font-semibold text-white bg-forest-800 rounded-lg shadow"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
