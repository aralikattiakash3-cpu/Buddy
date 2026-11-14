
import React, { useMemo, useState } from 'react';
import {
    Landmark,
    Search,
    ExternalLink,
    MapPin,
    CheckCircle2,
    Info,
    ShieldCheck,
} from 'lucide-react';

type Scheme = {
    id: number;
    name: string;
    category: string;
    government: string;
    description: string;
    eligibility: string;
    benefit: string;
    url: string;
};

const schemes: Scheme[] = [
    {
        id: 1,
        name: 'PM-KISAN',
        category: 'Financial Support',
        government: 'Central Government',
        description:
            'Income support for eligible landholding farmer families.',
        eligibility:
            'Eligible landholding farmer families, subject to scheme exclusions and verification.',
        benefit: '₹6,000 per year in three instalments.',
        url: 'https://pmkisan.gov.in/',
    },
    {
        id: 2,
        name: 'Pradhan Mantri Fasal Bima Yojana',
        category: 'Crop Insurance',
        government: 'Central Government',
        description:
            'Crop insurance against specified agricultural risks.',
        eligibility:
            'Farmers growing notified crops in notified areas, subject to scheme conditions.',
        benefit:
            'Insurance protection according to the notified crop, season and policy terms.',
        url: 'https://pmfby.gov.in/',
    },
    {
        id: 3,
        name: 'PM-KUSUM',
        category: 'Irrigation & Energy',
        government: 'Central Government',
        description:
            'Supports solar energy solutions for agriculture, including eligible solar pump projects.',
        eligibility:
            'Depends on the scheme component, state implementation and available allocations.',
        benefit:
            'Financial assistance for eligible solar agriculture installations.',
        url: 'https://pmkusum.mnre.gov.in/',
    },
    {
        id: 4,
        name: 'Soil Health Card Scheme',
        category: 'Soil & Farming',
        government: 'Central Government',
        description:
            'Provides soil nutrient information and recommendations for better soil management.',
        eligibility:
            'Farmers whose agricultural land is covered by soil testing services.',
        benefit:
            'Soil testing information and nutrient management guidance.',
        url: 'https://soilhealth.dac.gov.in/',
    },
    {
        id: 5,
        name: 'Kisan Credit Card',
        category: 'Financial Support',
        government: 'Central Government',
        description:
            'Access to agricultural credit for eligible farming and allied activities.',
        eligibility:
            'Subject to bank assessment, applicable guidelines and borrower eligibility.',
        benefit:
            'Agricultural credit facilities according to lender terms.',
        url: 'https://www.myscheme.gov.in/',
    },
    {
        id: 6,
        name: 'Raitha Siri',
        category: 'Karnataka Schemes',
        government: 'Karnataka Government',
        description:
            'Karnataka initiative associated with support for millet cultivation.',
        eligibility:
            'Check the latest Karnataka Agriculture Department notifications for current eligibility and availability.',
        benefit:
            'Assistance may be available under applicable government notifications.',
        url: 'https://raitamitra.karnataka.gov.in/',
    },
    {
        id: 7,
        name: 'Krishi Bhagya',
        category: 'Karnataka Schemes',
        government: 'Karnataka Government',
        description:
            'Karnataka agriculture programme associated with rainwater conservation and farm water management.',
        eligibility:
            'Subject to current district coverage, application windows and government guidelines.',
        benefit:
            'Support for eligible farm water conservation measures.',
        url: 'https://raitamitra.karnataka.gov.in/',
    },
];

const categories = [
    'All Categories',
    ...Array.from(new Set(schemes.map((scheme) => scheme.category))),
];

export const GovernmentSchemesPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All Categories');
    const [government, setGovernment] = useState('All Governments');

    const filtered = useMemo(() => {
        return schemes.filter((scheme) => {
            const searchMatch = [
                scheme.name,
                scheme.description,
                scheme.category,
                scheme.government,
            ]
                .join(' ')
                .toLowerCase()
                .includes(search.toLowerCase());

            const categoryMatch =
                category === 'All Categories' ||
                scheme.category === category;

            const governmentMatch =
                government === 'All Governments' ||
                scheme.government === government;

            return searchMatch && categoryMatch && governmentMatch;
        });
    }, [search, category, government]);

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-10">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-xl">
                        <Landmark className="w-6 h-6 text-green-700" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Government Schemes Finder
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Discover agricultural schemes from the Central
                            and Karnataka Governments.
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-200 p-3 text-sm text-blue-900">
                    <Info className="w-5 h-5 shrink-0" />
                    <p>
                        This is an informational directory, not an
                        official eligibility checker. Scheme availability,
                        benefits and application rules can change.
                        Confirm details on official government websites.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <p className="text-sm text-slate-500">
                        Listed Schemes
                    </p>
                    <p className="text-3xl font-bold text-green-800 mt-2">
                        {schemes.length}
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <p className="text-sm text-slate-500">
                        Central Government
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                        {schemes.filter(
                            (s) => s.government === 'Central Government'
                        ).length}
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <p className="text-sm text-slate-500">
                        Karnataka Government
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                        {schemes.filter(
                            (s) => s.government === 'Karnataka Government'
                        ).length}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h2 className="font-bold text-slate-900 mb-4">
                    Find Schemes for Farmers
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search schemes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm"
                        />
                    </div>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white"
                    >
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <select
                        value={government}
                        onChange={(e) => setGovernment(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white"
                    >
                        <option>All Governments</option>
                        <option>Central Government</option>
                        <option>Karnataka Government</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900">
                    Available Scheme Information
                </h2>
                <span className="text-sm text-slate-500">
                    {filtered.length} results
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filtered.map((scheme) => (
                    <div
                        key={scheme.id}
                        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="p-3 bg-green-50 rounded-xl">
                                <ShieldCheck className="w-6 h-6 text-green-700" />
                            </div>

                            <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                                {scheme.category}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mt-4">
                            {scheme.name}
                        </h3>

                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                            <MapPin className="w-4 h-4" />
                            {scheme.government}
                        </div>

                        <p className="text-sm text-slate-600 mt-4">
                            {scheme.description}
                        </p>

                        <div className="bg-slate-50 rounded-xl p-4 mt-4 space-y-3">
                            <div>
                                <p className="text-xs font-bold text-slate-800">
                                    Eligibility Information
                                </p>
                                <p className="text-sm text-slate-600 mt-1">
                                    {scheme.eligibility}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-slate-800">
                                    Benefits
                                </p>
                                <p className="text-sm text-slate-600 mt-1">
                                    {scheme.benefit}
                                </p>
                            </div>
                        </div>

                        <a
                            href={scheme.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 inline-flex items-center justify-center gap-2 bg-green-800 hover:bg-green-900 text-white px-4 py-3 rounded-xl text-sm font-semibold"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Visit Official Information
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
                    No schemes found. Try changing your filters.
                </div>
            )}

            <div className="bg-green-900 text-white rounded-2xl p-6">
                <h2 className="text-lg font-bold">
                    Need help finding more schemes?
                </h2>
                <p className="text-sm text-green-100 mt-2">
                    Visit the Government of India's myScheme portal
                    to explore additional programmes and check
                    official eligibility requirements.
                </p>

                <a
                    href="https://www.myscheme.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 bg-white text-green-900 px-5 py-3 rounded-xl font-bold text-sm"
                >
                    Explore myScheme
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
};
