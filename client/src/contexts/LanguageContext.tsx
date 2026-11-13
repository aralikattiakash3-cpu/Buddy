import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface Translations {
  [key: string]: {
    en: string;
    kn: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Navigation
  appName: {
    en: 'KrishiSeva AI',
    kn: 'ಕೃಷಿಸೇವಾ ಎಐ',
    hi: 'कृषिसेवा एआई',
  },
  appTagline: {
    en: 'Smart Agriculture Advisory for Indian Farmers',
    kn: 'ಭಾರತೀಯ ರೈತರಿಗಾಗಿ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಮಾರ್ಗದರ್ಶನ',
    hi: 'भारतीय किसानों के लिए स्मार्ट कृषि सलाह',
  },
  dashboard: {
    en: 'Dashboard',
    kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    hi: 'डैशबोर्ड',
  },
  cropRecommendation: {
    en: 'Crop Recommendation',
    kn: 'ಬೆಳೆ ಶಿಫಾರಸು',
    hi: 'फसल सिफारिश',
  },
  cropAdvisory: {
    en: 'Cultivation Advisory',
    kn: 'ಕೃಷಿ ಮಾರ್ಗದರ್ಶಿ',
    hi: 'फसल खेती सलाह',
  },
  diseaseDetection: {
    en: 'Crop Health & Diseases',
    kn: 'ಬೆಳೆ ರೋಗ ಪತ್ತೆ',
    hi: 'फसल रोग जांच',
  },
  fertilizerAdvisory: {
    en: 'Nutrient & Fertilizer',
    kn: 'ರಸಗೊಬ್ಬರ ಮತ್ತು ಪೋಷಕಾಂಶ',
    hi: 'उर्वरक एवं पोषक तत्व',
  },
  irrigationAdvisory: {
    en: 'Irrigation Advisory',
    kn: 'ನೀರಾವರಿ ನಿರ್ವಹಣೆ',
    hi: 'सिंचाई प्रबंधन',
  },
  aiChatbot: {
    en: 'Kisan AI Chatbot',
    kn: 'ಕಿಸಾನ್ ಎಐ ಚಾಟ್‌ಬಾಟ್',
    hi: 'किसान एआई चैटबॉट',
  },
  advisoryHistory: {
    en: 'Advisory History',
    kn: 'ಹಿಂದಿನ ವರದಿಗಳು',
    hi: 'सलाह इतिहास',
  },
  farmerProfile: {
    en: 'Farmer Profile',
    kn: 'ರೈತರ ಪ್ರೊಫೈಲ್',
    hi: 'किसान प्रोफ़ाइल',
  },
  settings: {
    en: 'Settings',
    kn: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    hi: 'सेटिंग्स',
  },
  logout: {
    en: 'Log Out',
    kn: 'ಲಾಗ್ ಔಟ್',
    hi: 'लॉग आउट',
  },
  login: {
    en: 'Log In',
    kn: 'ಲಾಗಿನ್ ಮಾಡಿ',
    hi: 'लॉग इन करें',
  },
  register: {
    en: 'Register Farmer Account',
    kn: 'ಖಾತೆ ತೆರೆಯಿರಿ',
    hi: 'खाता बनाएं',
  },

  // Actions
  submit: {
    en: 'Submit',
    kn: 'ಸಲ್ಲಿಸಿ',
    hi: 'जमा करें',
  },
  generateAdvice: {
    en: 'Generate AI Recommendations',
    kn: 'ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ',
    hi: 'सलाह प्राप्त करें',
  },
  analyzing: {
    en: 'Analyzing with Gemini AI...',
    kn: 'ಜೆಮಿನಿ ಎಐ ಪರಿಶೀಲಿಸುತ್ತಿದೆ...',
    hi: 'जेमिनी एआई विश्लेषण कर रहा है...',
  },
  downloadPdf: {
    en: 'Download PDF Report',
    kn: 'ಪಿಡಿಎಫ್ ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    hi: 'पीडीएफ रिपोर्ट डाउनलोड करें',
  },
  delete: {
    en: 'Delete',
    kn: 'ಅಳಿಸಿ',
    hi: 'हटाएं',
  },
  viewDetails: {
    en: 'View Full Advisory',
    kn: 'ಸಂಪೂರ್ಣ ಮಾಹಿತಿ ನೋಡಿ',
    hi: 'पूरी सलाह देखें',
  },
  cancel: {
    en: 'Cancel',
    kn: 'ರದ್ದುಮಾಡಿ',
    hi: 'रद्द करें',
  },
  saveChanges: {
    en: 'Save Changes',
    kn: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    hi: 'परिवर्तन सहेजें',
  },

  // Common Fields
  state: {
    en: 'State',
    kn: 'ರಾಜ್ಯ',
    hi: 'राज्य',
  },
  district: {
    en: 'District',
    kn: 'ಜಿಲ್ಲೆ',
    hi: 'ज़िला',
  },
  soilType: {
    en: 'Soil Type',
    kn: 'ಮಣ್ಣಿನ ವಿಧ',
    hi: 'मिट्टी का प्रकार',
  },
  soilPh: {
    en: 'Soil pH (Optional)',
    kn: 'ಮಣ್ಣಿನ ಪಿ.ಹೆಚ್ (ಐಚ್ಛಿಕ)',
    hi: 'मिट्टी का पीएच (वैकल्पिक)',
  },
  landArea: {
    en: 'Land Area',
    kn: 'ಭೂಮಿ ವಿಸ್ತೀರ್ಣ',
    hi: 'भूमि क्षेत्र',
  },
  irrigationType: {
    en: 'Irrigation Facility',
    kn: 'ನೀರಾವರಿ ಸೌಲಭ್ಯ',
    hi: 'सिंचाई सुविधा',
  },
  season: {
    en: 'Season',
    kn: 'ಋತು',
    hi: 'मौसम / ऋतु',
  },
  cropName: {
    en: 'Crop Name',
    kn: 'ಬೆಳೆಯ ಹೆಸರು',
    hi: 'फसल का नाम',
  },
  growthStage: {
    en: 'Growth Stage',
    kn: 'ಬೆಳವಣಿಗೆಯ ಹಂತ',
    hi: 'विकास की अवस्था',
  },

  // Agricultural Disclaimer
  disclaimerNotice: {
    en: 'Agricultural Decision-Support Notice: AI recommendations serve as decision guidance based on general principles and do not replace professional laboratory soil tests or certified extension officer diagnostics.',
    kn: 'ಕೃಷಿ ತೀರ್ಮಾನ-ಬೆಂಬಲ ಸೂಚನೆ: ಈ ಎಐ ಶಿಫಾರಸುಗಳು ಸಾಮಾನ್ಯ ಕೃಷಿ ತತ್ವಗಳ ಆಧಾರದ ಮೇಲೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತವೆ. ಇವು ಪ್ರಯೋಗಾಲಯದ ಮಣ್ಣು ಪರೀಕ್ಷೆ ಅಥವಾ ತಜ್ಞ ಕೃಷಿ ಅಧಿಕಾರಿಗಳ ಪರಿಶೀಲನೆಗೆ ಪರ್ಯಾಯವಲ್ಲ.',
    hi: 'कृषि निर्णय-सहायता सूचना: यह एआई सलाह सामान्य कृषि सिद्धांतों पर आधारित निर्णय मार्गदर्शन है। यह पेशेवर मिट्टी परीक्षण प्रयोगशाला या प्रमाणित कृषि अधिकारी के निदान का विकल्प नहीं है।',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('krishi_language') as Language;
    return saved === 'kn' || saved === 'hi' || saved === 'en' ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('krishi_language', lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    if (translations[key] && translations[key]['en']) {
      return translations[key]['en'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
