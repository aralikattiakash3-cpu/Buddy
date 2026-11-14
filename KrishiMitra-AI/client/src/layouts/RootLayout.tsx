import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Toaster } from 'sonner';

export const RootLayout: React.FC = () => {
  const [lang, setLang] = useState<'kn' | 'hi' | 'en'>('kn');

  return (
    <div className="flex flex-col min-h-screen bg-cream-50 text-slate-800">
      <Header currentLanguage={lang} onLanguageChange={setLang} />
      <main className="flex-1">
        <Outlet context={{ language: lang }} />
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
};
