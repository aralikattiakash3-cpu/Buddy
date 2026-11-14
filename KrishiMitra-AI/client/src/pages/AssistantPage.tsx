
import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Send,
  Trash2,
  Sprout,
  Info,
  MessageCircle,
} from 'lucide-react';

type Language = 'en' | 'kn' | 'hi';

type Topic =
  | 'water'
  | 'soil'
  | 'disease'
  | 'fertilizer'
  | 'weather'
  | 'crop'
  | 'market'
  | 'schemes';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
};

const CHAT_KEY = 'krishimitra-basic-chat';
const LANG_KEY = 'krishimitra-basic-language';

const translations = {
  en: {
    title: 'Basic Farming Assistant',
    subtitle: 'Quick farming guidance without an AI connection',
    welcome:
      'Namaste! I am your KrishiMitra Farming Assistant. Ask me about irrigation, soil, crops, fertilizer, plant diseases, market prices or government schemes.',
    placeholder: 'Ask a farming question...',
    quick: 'Quick Questions',
    clear: 'Clear Chat',
    chat: 'Farming Chat',
    note: 'Rule-based general guidance. Consult a local agricultural expert for important crop treatment decisions.',
    unknown:
      'I can help with irrigation, soil health, crop selection, fertilizer, plant diseases, weather, market prices and government schemes. Please ask about one of these topics.',
    questions: [
      'How should I water my crops?',
      'How can I improve soil health?',
      'How do I prevent crop diseases?',
      'How can I check market prices?',
    ],
  },
  kn: {
    title: 'ಕೃಷಿಮಿತ್ರ ಕೃಷಿ ಸಹಾಯಕ',
    subtitle: 'ಇಂಟರ್ನೆಟ್ AI ಸಂಪರ್ಕವಿಲ್ಲದೆ ಸಾಮಾನ್ಯ ಕೃಷಿ ಮಾರ್ಗದರ್ಶನ',
    welcome:
      'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿಮಿತ್ರ ಕೃಷಿ ಸಹಾಯಕ. ನೀರಾವರಿ, ಮಣ್ಣು, ಬೆಳೆ, ಗೊಬ್ಬರ, ರೋಗಗಳು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ.',
    placeholder: 'ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಬರೆಯಿರಿ...',
    quick: 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು',
    clear: 'ಚಾಟ್ ಅಳಿಸಿ',
    chat: 'ಕೃಷಿ ಸಂಭಾಷಣೆ',
    note: 'ಇವು ಸಾಮಾನ್ಯ ಮಾರ್ಗಸೂಚಿಗಳು. ಪ್ರಮುಖ ಕೃಷಿ ನಿರ್ಧಾರಗಳಿಗೆ ಸ್ಥಳೀಯ ಕೃಷಿ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    unknown:
      'ನೀರಾವರಿ, ಮಣ್ಣಿನ ಆರೋಗ್ಯ, ಬೆಳೆ ಆಯ್ಕೆ, ಗೊಬ್ಬರ, ಬೆಳೆ ರೋಗಗಳು, ಹವಾಮಾನ, ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ.',
    questions: [
      'ಬೆಳೆಗಳಿಗೆ ನೀರು ಯಾವಾಗ ಹಾಕಬೇಕು?',
      'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಹೇಗೆ ಸುಧಾರಿಸಬಹುದು?',
      'ಬೆಳೆ ರೋಗಗಳನ್ನು ಹೇಗೆ ತಡೆಯಬಹುದು?',
      'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ಹೇಗೆ ತಿಳಿಯಬಹುದು?',
    ],
  },
  hi: {
    title: 'कृषिमित्र कृषि सहायक',
    subtitle: 'AI कनेक्शन के बिना सामान्य खेती मार्गदर्शन',
    welcome:
      'नमस्ते! मैं आपका कृषिमित्र कृषि सहायक हूँ। सिंचाई, मिट्टी, फसल, खाद, रोग और मंडी भाव के बारे में पूछें।',
    placeholder: 'खेती से संबंधित सवाल पूछें...',
    quick: 'आम सवाल',
    clear: 'चैट साफ करें',
    chat: 'खेती की बातचीत',
    note: 'यह सामान्य मार्गदर्शन है। महत्वपूर्ण कृषि निर्णयों के लिए स्थानीय कृषि विशेषज्ञ से सलाह लें।',
    unknown:
      'आप सिंचाई, मिट्टी, फसल चयन, खाद, फसल रोग, मौसम, मंडी भाव और सरकारी योजनाओं के बारे में पूछ सकते हैं।',
    questions: [
      'फसलों को पानी कब देना चाहिए?',
      'मिट्टी की गुणवत्ता कैसे सुधारें?',
      'फसल रोगों से कैसे बचें?',
      'मंडी के भाव कैसे देखें?',
    ],
  },
};

const answers: Record<Topic, Record<Language, string>> = {
  water: {
    en: 'Irrigate according to crop type, growth stage, soil moisture and weather. Check moisture near the root zone before watering. Avoid waterlogging and consider drip irrigation to reduce water waste.',
    kn: 'ಬೆಳೆಯ ಪ್ರಕಾರ, ಬೆಳವಣಿಗೆಯ ಹಂತ, ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು ಹವಾಮಾನಕ್ಕೆ ಅನುಗುಣವಾಗಿ ನೀರು ನೀಡಿ. ನೀರು ಹಾಕುವ ಮೊದಲು ಬೇರುಗಳ ಬಳಿಯ ಮಣ್ಣಿನ ತೇವಾಂಶ ಪರಿಶೀಲಿಸಿ. ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.',
    hi: 'फसल, विकास की अवस्था, मिट्टी की नमी और मौसम के अनुसार सिंचाई करें। पानी देने से पहले जड़ों के पास मिट्टी की नमी जाँचें। जलभराव से बचें।',
  },
  soil: {
    en: 'Improve soil health by testing the soil, adding well-decomposed compost, using crop rotation and reducing erosion. Apply nutrients according to soil test recommendations.',
    kn: 'ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ ಮಾಡಿಸಿ, ಚೆನ್ನಾಗಿ ಕೊಳೆತ ಕಾಂಪೋಸ್ಟ್ ಬಳಸಿ, ಬೆಳೆ ಪರಿವರ್ತನೆ ಮಾಡಿ ಮತ್ತು ಮಣ್ಣಿನ ಸವಕಳಿಯನ್ನು ತಡೆಯಿರಿ. ಪರೀಕ್ಷೆಯ ಫಲಿತಾಂಶಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಪೋಷಕಾಂಶಗಳನ್ನು ನೀಡಿ.',
    hi: 'मिट्टी की जाँच कराएँ, अच्छी तरह तैयार कम्पोस्ट डालें, फसल चक्र अपनाएँ और मिट्टी का कटाव रोकें। मिट्टी की जाँच के अनुसार पोषक तत्व दें।',
  },
  disease: {
    en: 'Inspect plants regularly for unusual spots, wilting or discoloration. Improve airflow, avoid excessive irrigation and remove affected plant material safely. Use Plant Doctor for preliminary guidance and confirm treatments with an agricultural expert.',
    kn: 'ಎಲೆಗಳ ಮೇಲಿನ ಕಲೆಗಳು, ಬಾಡುವಿಕೆ ಮತ್ತು ಬಣ್ಣ ಬದಲಾವಣೆಗಳನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ. ಗಾಳಿಯ ಸಂಚಾರ ಉತ್ತಮವಾಗಿರಲಿ ಮತ್ತು ಅತಿಯಾದ ನೀರಾವರಿ ತಪ್ಪಿಸಿ. ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ Plant Doctor ಬಳಸಿ.',
    hi: 'पत्तियों पर धब्बे, मुरझाने और रंग बदलने के लक्षण नियमित रूप से देखें। हवा का प्रवाह अच्छा रखें और अधिक सिंचाई से बचें। शुरुआती जानकारी के लिए Plant Doctor का उपयोग करें।',
  },
  fertilizer: {
    en: 'Choose fertilizer based on your soil test, crop and growth stage. Compost can support soil structure. Avoid applying excessive fertilizer because it can damage crops and increase costs.',
    kn: 'ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ, ಬೆಳೆ ಮತ್ತು ಬೆಳವಣಿಗೆಯ ಹಂತಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಗೊಬ್ಬರ ಆಯ್ಕೆ ಮಾಡಿ. ಕಾಂಪೋಸ್ಟ್ ಮಣ್ಣಿನ ಗುಣಮಟ್ಟಕ್ಕೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಅತಿಯಾದ ಗೊಬ್ಬರ ಬಳಕೆಯನ್ನು ತಪ್ಪಿಸಿ.',
    hi: 'मिट्टी की जाँच, फसल और विकास की अवस्था के अनुसार खाद चुनें। कम्पोस्ट मिट्टी को बेहतर बनाने में मदद करता है। जरूरत से ज्यादा खाद न डालें।',
  },
  weather: {
    en: 'Check the Weather Dashboard before planning irrigation, spraying or harvesting. Rain, wind and temperature can affect farm operations. Use an updated local forecast for important decisions.',
    kn: 'ನೀರಾವರಿ, ಸಿಂಪಡಣೆ ಅಥವಾ ಕೊಯ್ಲಿನ ಮೊದಲು Weather Dashboard ಪರಿಶೀಲಿಸಿ. ಮಳೆ, ಗಾಳಿ ಮತ್ತು ತಾಪಮಾನ ಕೃಷಿ ಕೆಲಸಗಳ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರುತ್ತವೆ.',
    hi: 'सिंचाई, छिड़काव या कटाई से पहले Weather Dashboard देखें। बारिश, हवा और तापमान खेती के काम को प्रभावित कर सकते हैं।',
  },
  crop: {
    en: 'Select crops based on local climate, growing season, soil type, irrigation availability and market demand. Use the Crop Advisor page to explore suitable options.',
    kn: 'ಸ್ಥಳೀಯ ಹವಾಮಾನ, ಋತು, ಮಣ್ಣಿನ ಪ್ರಕಾರ, ನೀರಿನ ಲಭ್ಯತೆ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆಯನ್ನು ಪರಿಗಣಿಸಿ ಬೆಳೆ ಆಯ್ಕೆ ಮಾಡಿ. Crop Advisor ಪುಟ ಬಳಸಿ.',
    hi: 'स्थानीय जलवायु, मौसम, मिट्टी, पानी की उपलब्धता और बाजार की माँग के आधार पर फसल चुनें। Crop Advisor पेज का उपयोग करें।',
  },
  market: {
    en: 'Open the Mandi Market Prices page to compare crop prices across markets. The current tracker contains illustrative sample prices, not live quotations. Verify actual prices before selling.',
    kn: 'ವಿವಿಧ ಮಾರುಕಟ್ಟೆಗಳ ಬೆಲೆಗಳನ್ನು ಹೋಲಿಸಲು Mandi Market Prices ಪುಟ ತೆರೆಯಿರಿ. ಪ್ರಸ್ತುತ ಬೆಲೆಗಳು ಮಾದರಿ ಮಾಹಿತಿಯಾಗಿದ್ದು ನೇರ ಮಾರುಕಟ್ಟೆ ದರಗಳಲ್ಲ.',
    hi: 'अलग-अलग मंडियों के भाव देखने के लिए Mandi Market Prices पेज खोलें। वर्तमान कीमतें केवल उदाहरण हैं, लाइव बाजार भाव नहीं।',
  },
  schemes: {
    en: 'Visit the Government Schemes Finder page to explore PM-KISAN, crop insurance and Karnataka agriculture programmes. Confirm eligibility and current application rules on official government websites.',
    kn: 'PM-KISAN, ಬೆಳೆ ವಿಮೆ ಮತ್ತು ಕರ್ನಾಟಕದ ಕೃಷಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ತಿಳಿಯಲು Government Schemes Finder ಪುಟ ತೆರೆಯಿರಿ. ಅರ್ಹತೆಯನ್ನು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.',
    hi: 'PM-KISAN, फसल बीमा और कर्नाटक की कृषि योजनाओं की जानकारी के लिए Government Schemes Finder पेज खोलें। पात्रता आधिकारिक वेबसाइट पर जाँचें।',
  },
};

const keywords: Record<Topic, string[]> = {
  water: [
    'water', 'irrigat', 'drip', 'ನೀರು', 'ನೀರಾವರಿ',
    'पानी', 'सिंचाई',
  ],
  soil: [
    'soil', 'compost', 'ಮಣ್ಣು', 'ಮಣ್ಣಿನ',
    'मिट्टी', 'कम्पोस्ट',
  ],
  disease: [
    'disease', 'pest', 'infection', 'leaf', 'leaves',
    'ರೋಗ', 'ಕೀಟ', 'ಎಲೆ', 'बीमारी', 'रोग', 'कीट', 'पत्त',
  ],
  fertilizer: [
    'fertiliz', 'manure', 'nutrient', 'ಗೊಬ್ಬರ',
    'खाद', 'उर्वरक',
  ],
  weather: [
    'weather', 'rain', 'temperature', 'ಹವಾಮಾನ',
    'ಮಳೆ', 'मौसम', 'बारिश',
  ],
  crop: [
    'crop', 'seed', 'planting', 'harvest', 'ಬೆಳೆ',
    'ಬೀಜ', 'फसल', 'बीज',
  ],
  market: [
    'market', 'mandi', 'price', 'sell', 'ಮಾರುಕಟ್ಟೆ',
    'ಬೆಲೆ', 'ಮಂಡಿ', 'बाजार', 'मंडी', 'भाव', 'कीमत',
  ],
  schemes: [
    'scheme', 'government', 'subsidy', 'pm-kisan',
    'ಯೋಜನೆ', 'ಸರ್ಕಾರ', 'सरकार', 'योजना', 'सब्सिडी',
  ],
};

function detectTopic(question: string): Topic | null {
  const text = question.toLowerCase();

  // Prefer the topic with the longest matching keyword.
  // This prevents a generic word like "crop" from overriding
  // a more specific topic like "crop disease".
  let bestTopic: Topic | null = null;
  let bestLength = 0;

  for (const topic of Object.keys(keywords) as Topic[]) {
    for (const word of keywords[topic]) {
      if (text.includes(word) && word.length > bestLength) {
        bestTopic = topic;
        bestLength = word.length;
      }
    }
  }

  return bestTopic;
}

function makeMessage(
  role: Message['role'],
  text: string
): Message {
  return {
    id: `${Date.now()}-${Math.random()}`,
    role,
    text,
    time: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

function readLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'kn' || saved === 'hi' || saved === 'en') {
      return saved;
    }
  } catch {
    // Browser storage unavailable
  }

  return 'kn';
}

function isWelcomeText(text: string): boolean {
  return Object.values(translations).some(
    (translation) => translation.welcome === text
  );
}

function readMessages(language: Language): Message[] {
  try {
    const saved = localStorage.getItem(CHAT_KEY);

    if (saved) {
      const parsed: unknown = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        const valid = parsed.filter(
          (item): item is Message =>
            item !== null &&
            typeof item === 'object' &&
            typeof item.id === 'string' &&
            (item.role === 'user' || item.role === 'assistant') &&
            typeof item.text === 'string' &&
            typeof item.time === 'string'
        );

        if (valid.length > 0) {
          const restored = valid.slice(-80);

          // Ensure the saved welcome message matches the
          // currently selected language after refreshing.
          if (
            restored[0]?.role === 'assistant' &&
            isWelcomeText(restored[0].text)
          ) {
            restored[0] = {
              ...restored[0],
              text: translations[language].welcome,
            };
          }

          return restored;
        }
      }
    }
  } catch {
    // Invalid saved data
  }

  return [
    makeMessage('assistant', translations[language].welcome),
  ];
}

export const AssistantPage: React.FC = () => {
  const [language, setLanguage] = useState<Language>(readLanguage);

  const [messages, setMessages] = useState<Message[]>(() =>
    readMessages(readLanguage())
  );

  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const ui = translations[language];

  useEffect(() => {
    try {
      localStorage.setItem(
        CHAT_KEY,
        JSON.stringify(messages.slice(-80))
      );
    } catch {
      // Browser storage unavailable
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, language);
    } catch {
      // Browser storage unavailable
    }
  }, [language]);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [messages]);

  // Change both the interface language and the welcome message.
  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);

    setMessages((previous) =>
      previous.map((message, index) => {
        const isWelcome =
          index === 0 &&
          message.role === 'assistant' &&
          isWelcomeText(message.text);

        return isWelcome
          ? {
            ...message,
            text: translations[nextLanguage].welcome,
          }
          : message;
      })
    );
  };

  const askQuestion = (question: string) => {
    const trimmed = question.trim();

    if (!trimmed) return;

    const topic = detectTopic(trimmed);

    const response = topic
      ? answers[topic][language]
      : ui.unknown;

    setMessages((previous) => [
      ...previous,
      makeMessage('user', trimmed),
      makeMessage('assistant', response),
    ]);

    setInput('');
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    askQuestion(input);
  };

  const clearChat = () => {
    setMessages([
      makeMessage('assistant', ui.welcome),
    ]);
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-8">
      {/* Assistant Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-forest-800 text-white p-3 rounded-xl">
              <Bot className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {ui.title}
              </h1>

              <p className="text-xs text-slate-500 mt-1">
                {ui.subtitle}
              </p>
            </div>
          </div>

          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
            Offline Rule-Based
          </span>
        </div>

        {/* Language Buttons */}
        <div className="flex flex-wrap gap-2 mt-5">
          {([
            ['kn', 'ಕನ್ನಡ'],
            ['hi', 'हिन्दी'],
            ['en', 'English'],
          ] as const).map(([code, label]) => (
            <button
              key={code}
              type="button"
              onClick={() => changeLanguage(code)}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition ${language === code
                  ? 'bg-forest-800 text-white border-forest-800'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-green-50'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Advisory Notice */}
        <div className="mt-4 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />

          <p className="text-xs text-blue-800">
            {ui.note}
          </p>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-700" />

            <h2 className="font-bold text-slate-900 text-sm">
              {ui.chat}
            </h2>
          </div>

          <button
            type="button"
            onClick={clearChat}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
            {ui.clear}
          </button>
        </div>

        {/* Chat Messages */}
        <div className="h-[350px] overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user'
                  ? 'justify-end'
                  : 'justify-start'
                }`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-sm ${message.role === 'user'
                    ? 'bg-forest-800 text-white'
                    : 'bg-green-50 text-slate-800 border border-green-100'
                  }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {message.text}
                </p>

                <p className="text-[10px] opacity-60 text-right mt-2">
                  {message.time}
                </p>
              </div>
            </div>
          ))}

          <div ref={endRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-100">
          <form
            onSubmit={handleSubmit}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder={ui.placeholder}
              className="flex-1 min-w-0 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-white px-4 py-3 rounded-xl transition"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sprout className="w-5 h-5 text-green-700" />

          <h2 className="font-bold text-slate-900">
            {ui.quick}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ui.questions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => askQuestion(question)}
              className="text-left p-3 rounded-xl border border-green-100 bg-green-50 hover:bg-green-100 text-green-900 text-sm font-medium transition"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;
