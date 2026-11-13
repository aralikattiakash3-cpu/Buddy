import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { PageLoader } from '../components/common/Loader';
import { EmptyState } from '../components/common/EmptyState';
import { generateAdvisoryPDF } from '../utils/pdfExport';
import { toast } from 'sonner';
import {
  History, Sprout, BookOpen, Bug, FlaskConical, Droplets,
  Calendar, Trash2, Download, ChevronRight, Filter
} from 'lucide-react';

interface AdvisoryRecord {
  id: string;
  type: string;
  title: string;
  cropName: string;
  subtitle: string;
  createdAt: string;
  rawData: any;
}

export default function HistoryPage() {
  const [records, setRecords] = useState<AdvisoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      // Query all advisory endpoints in parallel
      const [crops, advisories, diseases, fertilizers, irrigations] = await Promise.allSettled([
        api.get<any[]>('/crop-recommendations'),
        api.get<any[]>('/crop-advisories'),
        api.get<any[]>('/disease-detection'),
        api.get<any[]>('/fertilizer-advisory'),
        api.get<any[]>('/irrigation-advisory'),
      ]);

      const combined: AdvisoryRecord[] = [];

      if (crops.status === 'fulfilled' && Array.isArray(crops.value)) {
        crops.value.forEach(c => {
          const topCrop = c.recommendations?.recommendations?.[0]?.cropName || 'Recommended Crops';
          combined.push({
            id: c.id,
            type: 'crop-recommendation',
            title: `Crop Recommendation: ${topCrop}`,
            cropName: topCrop,
            subtitle: `${c.district}, ${c.state} • ${c.land_area} ${c.land_unit}`,
            createdAt: c.created_at,
            rawData: c.recommendations,
          });
        });
      }

      if (advisories.status === 'fulfilled' && Array.isArray(advisories.value)) {
        advisories.value.forEach(a => {
          combined.push({
            id: a.id,
            type: 'crop-advisory',
            title: `Cultivation Guide: ${a.crop_name}`,
            cropName: a.crop_name,
            subtitle: `Stage: ${a.growth_stage || 'Full lifecycle'}`,
            createdAt: a.created_at,
            rawData: a.advisory,
          });
        });
      }

      if (diseases.status === 'fulfilled' && Array.isArray(diseases.value)) {
        diseases.value.forEach(d => {
          combined.push({
            id: d.id,
            type: 'disease-detection',
            title: `Health Analysis: ${d.crop_name || 'Plant'}`,
            cropName: d.crop_name || 'Plant',
            subtitle: `Part: ${d.plant_part || 'Foliage'} • Confidence: ${d.confidence || 'Medium'}`,
            createdAt: d.created_at,
            rawData: d.analysis,
          });
        });
      }

      if (fertilizers.status === 'fulfilled' && Array.isArray(fertilizers.value)) {
        fertilizers.value.forEach(f => {
          combined.push({
            id: f.id,
            type: 'fertilizer',
            title: `Fertilizer Guide: ${f.crop_name}`,
            cropName: f.crop_name,
            subtitle: `Stage: ${f.growth_stage || 'General'}`,
            createdAt: f.created_at,
            rawData: f.advisory,
          });
        });
      }

      if (irrigations.status === 'fulfilled' && Array.isArray(irrigations.value)) {
        irrigations.value.forEach(i => {
          combined.push({
            id: i.id,
            type: 'irrigation',
            title: `Irrigation Guide: ${i.crop_name}`,
            cropName: i.crop_name,
            subtitle: `Method: ${i.irrigation_type || 'General'}`,
            createdAt: i.created_at,
            rawData: i.advisory,
          });
        });
      }

      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecords(combined);
    } catch {
      // Empty history
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record: AdvisoryRecord) => {
    if (!window.confirm(`Are you sure you want to delete this ${record.title}?`)) return;

    setDeletingId(record.id);
    try {
      let endpoint = '';
      switch (record.type) {
        case 'crop-recommendation':
          endpoint = `/crop-recommendations/${record.id}`;
          break;
        case 'crop-advisory':
          endpoint = `/crop-advisories/${record.id}`;
          break;
        case 'disease-detection':
          endpoint = `/disease-detection/${record.id}`;
          break;
        default:
          break;
      }

      if (endpoint) {
        await api.delete(endpoint);
      }
      setRecords(prev => prev.filter(r => r.id !== record.id));
      toast.success('Report deleted successfully');
    } catch {
      toast.error('Failed to delete report');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadPDF = (record: AdvisoryRecord) => {
    generateAdvisoryPDF({
      type: record.type,
      title: record.title,
      data: record.rawData,
    });
    toast.success('PDF report downloaded!');
  };

  const filteredRecords = selectedFilter === 'all'
    ? records
    : records.filter(r => r.type === selectedFilter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'crop-recommendation': return Sprout;
      case 'crop-advisory': return BookOpen;
      case 'disease-detection': return Bug;
      case 'fertilizer': return FlaskConical;
      case 'irrigation': return Droplets;
      default: return History;
    }
  };

  if (loading) return <PageLoader text="Loading your advisory reports..." />;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-green-700" />
            <h1 className="text-2xl font-black text-slate-800">Advisory History</h1>
          </div>
          <p className="text-slate-500 text-sm">
            Review and export your previously generated crop recommendations, disease checks, and management reports
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          {[
            { id: 'all', label: 'All' },
            { id: 'crop-recommendation', label: 'Crops' },
            { id: 'crop-advisory', label: 'Cultivation' },
            { id: 'disease-detection', label: 'Diseases' },
            { id: 'fertilizer', label: 'Fertilizer' },
            { id: 'irrigation', label: 'Irrigation' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`text-xs px-2.5 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
                selectedFilter === f.id
                  ? 'bg-green-700 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filteredRecords.length > 0 ? (
        <div className="space-y-3">
          {filteredRecords.map(item => {
            const Icon = getIcon(item.type);
            return (
              <div
                key={item.id}
                className="card p-4 card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-slate-800 truncate">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleDownloadPDF(item)}
                    className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1"
                    title="Download PDF"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                  <Link
                    to={`/history/${item.id}?type=${item.type}`}
                    className="btn-ghost text-xs py-1.5 px-2.5 flex items-center gap-1"
                  >
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={deletingId === item.id}
                    className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={History}
          title="No advisory reports found"
          description={
            selectedFilter === 'all'
              ? 'Generate crop recommendations or crop health analyses to see them listed in your history.'
              : `No reports found for the '${selectedFilter}' filter category.`
          }
        />
      )}
    </div>
  );
}
