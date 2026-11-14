
import React, { useMemo, useState } from 'react';
import {
    Search,
    TrendingUp,
    TrendingDown,
    IndianRupee,
    MapPin,
    BarChart3,
    Sprout,
    Info,
} from 'lucide-react';

type MarketRecord = {
    crop: string;
    market: string;
    district: string;
    min: number;
    max: number;
    modal: number;
};

const samplePrices: MarketRecord[] = [
    { crop: 'Tomato', market: 'Bengaluru', district: 'Bengaluru', min: 1200, max: 2400, modal: 1800 },
    { crop: 'Tomato', market: 'Mysuru', district: 'Mysuru', min: 1100, max: 2200, modal: 1700 },
    { crop: 'Tomato', market: 'Hubballi', district: 'Dharwad', min: 1000, max: 2100, modal: 1600 },
    { crop: 'Tomato', market: 'Belagavi', district: 'Belagavi', min: 1150, max: 2300, modal: 1750 },

    { crop: 'Onion', market: 'Bengaluru', district: 'Bengaluru', min: 1600, max: 3000, modal: 2300 },
    { crop: 'Onion', market: 'Mysuru', district: 'Mysuru', min: 1400, max: 2800, modal: 2100 },
    { crop: 'Onion', market: 'Hubballi', district: 'Dharwad', min: 1500, max: 2900, modal: 2200 },
    { crop: 'Onion', market: 'Belagavi', district: 'Belagavi', min: 1300, max: 2700, modal: 2000 },

    { crop: 'Potato', market: 'Bengaluru', district: 'Bengaluru', min: 1400, max: 2600, modal: 2000 },
    { crop: 'Potato', market: 'Mysuru', district: 'Mysuru', min: 1300, max: 2500, modal: 1900 },
    { crop: 'Potato', market: 'Hubballi', district: 'Dharwad', min: 1200, max: 2400, modal: 1800 },

    { crop: 'Rice', market: 'Bengaluru', district: 'Bengaluru', min: 2500, max: 4000, modal: 3200 },
    { crop: 'Rice', market: 'Mysuru', district: 'Mysuru', min: 2400, max: 3800, modal: 3100 },
    { crop: 'Rice', market: 'Hubballi', district: 'Dharwad', min: 2300, max: 3700, modal: 3000 },

    { crop: 'Maize', market: 'Hubballi', district: 'Dharwad', min: 1600, max: 2400, modal: 2000 },
    { crop: 'Maize', market: 'Belagavi', district: 'Belagavi', min: 1500, max: 2300, modal: 1900 },
    { crop: 'Maize', market: 'Mysuru', district: 'Mysuru', min: 1550, max: 2350, modal: 1950 },

    { crop: 'Cotton', market: 'Hubballi', district: 'Dharwad', min: 5500, max: 7500, modal: 6500 },
    { crop: 'Cotton', market: 'Belagavi', district: 'Belagavi', min: 5300, max: 7300, modal: 6300 },
];

const crops = [
    'All Crops',
    ...Array.from(new Set(samplePrices.map((item) => item.crop))),
];

const markets = [
    'All Markets',
    ...Array.from(new Set(samplePrices.map((item) => item.market))),
];

const formatPrice = (value: number) =>
    `₹${value.toLocaleString('en-IN')}`;

export const MarketPricesPage: React.FC = () => {
    const [selectedCrop, setSelectedCrop] = useState('All Crops');
    const [selectedMarket, setSelectedMarket] = useState('All Markets');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        return samplePrices.filter((item) => {
            const cropMatch =
                selectedCrop === 'All Crops' ||
                item.crop === selectedCrop;

            const marketMatch =
                selectedMarket === 'All Markets' ||
                item.market === selectedMarket;

            const searchMatch =
                `${item.crop} ${item.market} ${item.district}`
                    .toLowerCase()
                    .includes(search.toLowerCase());

            return cropMatch && marketMatch && searchMatch;
        });
    }, [selectedCrop, selectedMarket, search]);

    const averageModal = filtered.length
        ? Math.round(
            filtered.reduce((sum, item) => sum + item.modal, 0) /
            filtered.length
        )
        : 0;

    const highest = filtered.length
        ? Math.max(...filtered.map((item) => item.max))
        : 0;

    const lowest = filtered.length
        ? Math.min(...filtered.map((item) => item.min))
        : 0;

    const chartMax = filtered.length
        ? Math.max(...filtered.map((item) => item.modal))
        : 1;

    const bestMarket = filtered.length
        ? filtered.reduce((best, item) =>
            item.modal > best.modal ? item : best
        )
        : null;

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-10">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-xl">
                        <Sprout className="w-6 h-6 text-green-700" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Smart Mandi Market Price Tracker
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Compare agricultural commodity prices across Karnataka markets.
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
                    <Info className="w-5 h-5 shrink-0" />
                    <p>
                        Demo mode: All prices below are illustrative sample data,
                        not current market quotations. Do not use them for actual
                        selling decisions.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h2 className="font-semibold text-slate-900 mb-4">
                    Search & Filter Market Prices
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2">
                            Select Crop
                        </label>
                        <select
                            value={selectedCrop}
                            onChange={(e) => setSelectedCrop(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white"
                        >
                            {crops.map((crop) => (
                                <option key={crop} value={crop}>
                                    {crop}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2">
                            Select Market
                        </label>
                        <select
                            value={selectedMarket}
                            onChange={(e) => setSelectedMarket(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white"
                        >
                            {markets.map((market) => (
                                <option key={market} value={market}>
                                    {market}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2">
                            Search
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Crop, market or district..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <IndianRupee className="w-4 h-4" />
                        Average Modal Price
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mt-3">
                        {filtered.length ? formatPrice(averageModal) : '—'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Per quintal • Sample</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 text-green-700 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        Highest Maximum Price
                    </div>
                    <p className="text-2xl font-bold text-green-700 mt-3">
                        {filtered.length ? formatPrice(highest) : '—'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Per quintal • Sample</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 text-orange-600 text-sm">
                        <TrendingDown className="w-4 h-4" />
                        Lowest Minimum Price
                    </div>
                    <p className="text-2xl font-bold text-orange-600 mt-3">
                        {filtered.length ? formatPrice(lowest) : '—'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Per quintal • Sample</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        <BarChart3 className="w-5 h-5 text-green-700" />
                        <h2 className="font-bold text-slate-900">
                            Market Price Comparison
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {filtered.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No matching market records.
                            </p>
                        ) : (
                            filtered.slice(0, 10).map((item) => (
                                <div key={`${item.crop}-${item.market}`}>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="font-semibold text-slate-700">
                                            {item.crop} — {item.market}
                                        </span>
                                        <span className="font-bold text-green-700">
                                            {formatPrice(item.modal)}
                                        </span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-600 rounded-full"
                                            style={{
                                                width: `${(item.modal / chartMax) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <p className="mt-4 text-xs text-slate-500">
                        Chart compares sample modal prices per quintal.
                        Only the first 10 matching records are shown.
                    </p>
                </div>

                <div className="bg-green-900 text-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-300" />
                        <h2 className="font-bold">Highest Sample Modal Price</h2>
                    </div>

                    {bestMarket ? (
                        <div className="mt-6">
                            <p className="text-green-200 text-sm">
                                {bestMarket.crop}
                            </p>
                            <h3 className="text-2xl font-bold mt-2">
                                {bestMarket.market}
                            </h3>
                            <p className="text-green-200 text-sm mt-1">
                                {bestMarket.district}, Karnataka
                            </p>
                            <p className="text-3xl font-bold mt-6">
                                {formatPrice(bestMarket.modal)}
                            </p>
                            <p className="text-green-200 text-xs mt-2">
                                Per quintal • Illustrative data
                            </p>
                        </div>
                    ) : (
                        <p className="mt-6 text-green-200">
                            No matching market data.
                        </p>
                    )}

                    <p className="text-xs text-green-200 mt-8">
                        Higher quoted prices do not necessarily mean higher
                        farmer profit. Transport, quality, fees and actual
                        market availability also matter.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900">
                        Commodity Market Price Table
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Illustrative prices in Indian Rupees per quintal (100 kg)
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-5 py-3">Crop</th>
                                <th className="px-5 py-3">Market</th>
                                <th className="px-5 py-3">District</th>
                                <th className="px-5 py-3">Min Price</th>
                                <th className="px-5 py-3">Max Price</th>
                                <th className="px-5 py-3">Modal Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item) => (
                                <tr
                                    key={`${item.crop}-${item.market}`}
                                    className="border-t border-slate-100 hover:bg-slate-50"
                                >
                                    <td className="px-5 py-3 font-semibold">
                                        {item.crop}
                                    </td>
                                    <td className="px-5 py-3">{item.market}</td>
                                    <td className="px-5 py-3">{item.district}</td>
                                    <td className="px-5 py-3">
                                        {formatPrice(item.min)}
                                    </td>
                                    <td className="px-5 py-3">
                                        {formatPrice(item.max)}
                                    </td>
                                    <td className="px-5 py-3 font-bold text-green-700">
                                        {formatPrice(item.modal)}
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-5 py-8 text-center text-slate-500"
                                    >
                                        No records found. Try another crop or market.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
