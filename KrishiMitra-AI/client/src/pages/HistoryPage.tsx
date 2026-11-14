
import React, { useState } from 'react';
import {
  History,
  FileText,
  Search,
  Trash2,
  Download,
  X,
  Plus,
  Eye,
  CalendarDays
} from 'lucide-react';

type ReportType =
  | 'Plant Doctor'
  | 'Soil Health'
  | 'Crop Advisor'
  | 'Irrigation'
  | 'Other';

type AdvisoryReport = {
  id: string;
  title: string;
  type: ReportType;
  crop: string;
  content: string;
  createdAt: string;
};

const STORAGE_KEY = 'krishimitra-advisory-reports-v1';

const reportTypes: ReportType[] = [
  'Plant Doctor',
  'Soil Health',
  'Crop Advisor',
  'Irrigation',
  'Other'
];

const loadReports = (): AdvisoryReport[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((report): report is AdvisoryReport => {
      if (!report || typeof report !== 'object') return false;

      return (
        typeof report.id === 'string' &&
        typeof report.title === 'string' &&
        reportTypes.includes(report.type) &&
        typeof report.crop === 'string' &&
        typeof report.content === 'string' &&
        typeof report.createdAt === 'string'
      );
    });
  } catch {
    return [];
  }
};

export const HistoryPage: React.FC = () => {
  const [reports, setReports] = useState<AdvisoryReport[]>(
    loadReports
  );

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedReport, setSelectedReport] =
    useState<AdvisoryReport | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReportType>('Other');
  const [crop, setCrop] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const saveReports = (updated: AdvisoryReport[]) => {
    setReports(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addReport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Please enter a report title and report details.');
      return;
    }

    const newReport: AdvisoryReport = {
      id: crypto.randomUUID(),
      title: title.trim(),
      type,
      crop: crop.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    saveReports([newReport, ...reports]);

    setTitle('');
    setType('Other');
    setCrop('');
    setContent('');
    setError('');
    setShowForm(false);
  };

  const deleteReport = (id: string) => {
    if (!window.confirm('Delete this report permanently?')) {
      return;
    }

    saveReports(reports.filter((report) => report.id !== id));

    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
  };

  const downloadReport = (report: AdvisoryReport) => {
    const text = [
      'KRISHIMITRA AI - AGRICULTURAL ADVISORY REPORT',
      '===========================================',
      '',
      `Title: ${report.title}`,
      `Category: ${report.type}`,
      `Crop: ${report.crop || 'Not specified'}`,
      `Date: ${new Date(report.createdAt).toLocaleString('en-IN')}`,
      '',
      'REPORT DETAILS',
      '--------------',
      report.content,
      '',
      'Disclaimer: Advisory information is not a confirmed',
      'diagnosis. Consult a qualified local agricultural expert.'
    ].join('\n');

    const blob = new Blob([text], {
      type: 'text/plain;charset=utf-8'
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `KrishiMitra-Report-${report.id}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  const filteredReports = reports
    .filter((report) => {
      const matchesFilter =
        filter === 'All' || report.type === filter;

      const query = search.toLowerCase().trim();

      const matchesSearch =
        report.title.toLowerCase().includes(query) ||
        report.crop.toLowerCase().includes(query) ||
        report.content.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center">
            <History className="w-6 h-6 text-leaf-light" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Advisory Reports History
            </h1>
            <p className="text-xs text-slate-500">
              Archive of agricultural diagnoses, soil checks and plans
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-sm font-semibold"
        >
          {showForm ? (
            <X className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}

          {showForm ? 'Close' : 'Add Report'}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500">Total Reports</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {reports.length}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500">Plant Reports</p>
          <p className="text-3xl font-bold text-green-800 mt-2">
            {reports.filter((r) => r.type === 'Plant Doctor').length}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500">Soil Reports</p>
          <p className="text-3xl font-bold text-amber-800 mt-2">
            {reports.filter((r) => r.type === 'Soil Health').length}
          </p>
        </div>
      </div>

      {/* Add Report Form */}
      {showForm && (
        <form
          onSubmit={addReport}
          className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
        >
          <h2 className="font-bold text-slate-900">
            Save Agricultural Report
          </h2>

          <div>
            <label
              htmlFor="report-title"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Report Title
            </label>
            <input
              id="report-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Tomato Soil Health Assessment"
              maxLength={150}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="report-type"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Report Type
              </label>
              <select
                id="report-type"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as ReportType)
                }
                className="w-full p-3 rounded-xl border border-slate-200 text-sm"
              >
                {reportTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="report-crop"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Crop (Optional)
              </label>
              <input
                id="report-crop"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="e.g. Tomato"
                maxLength={100}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="report-content"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Report Details
            </label>
            <textarea
              id="report-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the agricultural observations and recommendations..."
              rows={6}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="px-6 py-3 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-sm font-semibold"
          >
            Save Report
          </button>
        </form>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by title, crop or details..."
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', ...reportTypes].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold ${filter === item
                  ? 'bg-green-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Report List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="font-bold text-slate-900">
          Saved Reports
        </h2>

        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-green-700 mb-3" />

            <h3 className="font-semibold text-slate-900">
              No Reports Found
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              {reports.length === 0
                ? 'No reports have been saved yet. Click Add Report to create one.'
                : 'Try another search or filter.'}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-green-700 mt-1 shrink-0" />

                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {report.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    {report.type}
                    {report.crop ? ` • ${report.crop}` : ''}
                  </p>

                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {new Date(report.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(report)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-green-800 hover:bg-green-50 text-xs font-semibold"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>

                <button
                  type="button"
                  onClick={() => downloadReport(report)}
                  aria-label={`Download ${report.title}`}
                  className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => deleteReport(report.id)}
                  aria-label={`Delete ${report.title}`}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Details */}
      {selectedReport && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Report Details"
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <div className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedReport.title}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {selectedReport.type} •{' '}
                  {new Date(selectedReport.createdAt).toLocaleString('en-IN')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                aria-label="Close report details"
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-green-900">
                Crop: {selectedReport.crop || 'Not specified'}
              </p>
            </div>

            <div className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-800">
              {selectedReport.content}
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => downloadReport(selectedReport)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-800 text-white rounded-xl text-sm font-semibold"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500 text-center">
        Reports are stored locally in this browser.
        Automatic report saving from other KrishiMitra modules
        and cloud synchronization are planned for a later stage.
      </p>
    </div>
  );
};
