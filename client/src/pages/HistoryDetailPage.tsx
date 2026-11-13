import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { PageLoader } from '../components/common/Loader';
import { DisclaimerBanner } from '../components/common/Alert';
import { generateAdvisoryPDF } from '../utils/pdfExport';
import { toast } from 'sonner';
import {
  ArrowLeft, Download, Calendar, User, MapPin,
  CheckCircle, FileText, Bug, Sprout, BookOpen
} from 'lucide-react';

interface ReportData {
  type: string;
  id: string;
  profile: any;
  report: any;
  generatedAt: string;
}

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'crop-recommendation';
  const navigate = useNavigate();

  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchReport = async () => {
      try {
        const res = await api.get<ReportData>(`/reports/${type}/${id}`);
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Report not found');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, type]);

  const handleDownloadPDF = () => {
    if (!data) return;
    const payload =
      data.report.recommendations ||
      data.report.advisory ||
      data.report.analysis ||
      data.report;

    generateAdvisoryPDF({
      type: data.type,
      title: `Advisory Report — ${data.id}`,
      data: payload,
      farmerProfile: data.profile,
    });
    toast.success('PDF downloaded!');
  };

  if (loading) return <PageLoader text="Loading advisory report details..." />;

  if (error || !data) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center py-16">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800 mb-1">Report Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{error || 'This report may have been deleted.'}</p>
        <Link to="/history" className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to History
        </Link>
      </div>
    );
  }

  const payload =
    data.report.recommendations ||
    data.report.advisory ||
    data.report.analysis ||
    data.report;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Top Nav */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link to="/history" className="text-sm text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Advisory History
        </Link>
        <button
          onClick={handleDownloadPDF}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" /> Download PDF Report
        </button>
      </div>

      {/* Report Container */}
      <div className="space-y-5">
        <div className="card p-6">
          <div className="border-b border-slate-100 pb-4 mb-4">
            <span className="badge-green text-xs uppercase mb-2">Verified Advisory Report</span>
            <h1 className="text-2xl font-black text-slate-800">
              {data.report.crop_name ? `Advisory: ${data.report.crop_name}` : 'Agricultural Advisory Report'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(data.report.created_at || data.generatedAt).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
              {data.profile?.full_name && (
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Farmer: {data.profile.full_name}
                </span>
              )}
              {data.report.district && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {data.report.district}, {data.report.state}
                </span>
              )}
            </div>
          </div>

          {/* Render payload content */}
          {payload && (
            <div className="space-y-4 text-sm text-slate-700">
              {payload.summary && (
                <div className="p-4 rounded-xl bg-green-50/60 border border-green-100">
                  <h3 className="font-bold text-green-900 mb-1">Executive Summary</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{payload.summary}</p>
                </div>
              )}

              {payload.overview && (
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">Overview</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{payload.overview}</p>
                </div>
              )}

              {payload.observations && (
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">Physical Symptoms</h3>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {payload.observations.map((obs: string, oi: number) => (
                      <li key={oi} className="flex items-start gap-1.5">
                        <span className="text-red-500">•</span>
                        <span>{obs}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {payload.recommendations && Array.isArray(payload.recommendations) && (
                <div>
                  <h3 className="font-bold text-slate-800 mb-3">Recommendations</h3>
                  <div className="space-y-3">
                    {payload.recommendations.map((rec: any, ri: number) => (
                      <div key={ri} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-bold text-slate-800">{rec.cropName}</h4>
                          <span className="badge-green text-xs font-bold">{rec.suitabilityScore}/100</span>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">{rec.suitabilityExplanation}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                          <div><strong>Water:</strong> {rec.waterRequirement}</div>
                          <div><strong>Duration:</strong> {rec.growingDuration}</div>
                          <div><strong>Soil:</strong> {rec.soilCompatibility}</div>
                          <div><strong>Planting:</strong> {rec.plantingPeriod}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DisclaimerBanner text={payload?.disclaimer} />
      </div>
    </div>
  );
}
