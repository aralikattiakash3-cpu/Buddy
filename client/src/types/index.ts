export type Language = 'en' | 'kn' | 'hi';

export interface UserProfile {
  id: string;
  full_name: string;
  email?: string;
  phone?: string | null;
  state?: string | null;
  district?: string | null;
  village?: string | null;
  preferred_language: Language;
  farming_experience?: string | null;
  land_area?: number | null;
  land_unit?: string | null;
  farming_type?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CropRecommendationItem {
  cropName: string;
  suitabilityScore: number;
  suitabilityExplanation: string;
  soilCompatibility: string;
  waterRequirement: string;
  growingDuration: string;
  plantingPeriod: string;
  majorRisks: string[];
}

export interface CropRecommendationResult {
  summary: string;
  dataLimitations: string[];
  recommendations: CropRecommendationItem[];
  confidence: 'low' | 'medium' | 'high';
  disclaimer: string;
}

export interface CropGrowthStage {
  stage: string;
  description: string;
  management: string[];
}

export interface CropAdvisoryResult {
  cropName: string;
  overview: string;
  landPreparation: string[];
  seedSelection: string[];
  sowingGuidance: string[];
  growthStages: CropGrowthStage[];
  irrigation: string[];
  nutrientManagement: string[];
  weedManagement: string[];
  pestManagement: string[];
  diseasePrevention: string[];
  harvesting: string[];
  storage: string[];
  precautions: string[];
  disclaimer: string;
}

export interface DiseaseCondition {
  name: string;
  likelihood: 'low' | 'medium' | 'high';
  reason: string;
}

export interface DiseaseDetectionResult {
  cropName: string;
  plantPart: string;
  observations: string[];
  possibleConditions: DiseaseCondition[];
  alternativeCauses: string[];
  recommendedActions: string[];
  preventiveMeasures: string[];
  expertConsultationRecommended: boolean;
  imageQuality: 'good' | 'moderate' | 'poor';
  confidence: 'low' | 'medium' | 'high';
  disclaimer: string;
}

export interface NutrientRequirement {
  nutrient: string;
  importance: string;
  possibleDeficiencySymptoms: string[];
}

export interface FertilizerAdvisoryResult {
  cropName: string;
  growthStage: string;
  soilAssessment: string;
  nutrientRequirements: NutrientRequirement[];
  organicOptions: string[];
  fertilizerCategories: string[];
  applicationConsiderations: string[];
  soilTestingRecommendations: string[];
  precautions: string[];
  confidence: 'low' | 'medium' | 'high';
  disclaimer: string;
}

export interface IrrigationAdvisoryResult {
  cropName: string;
  growthStage: string;
  waterAssessment: string;
  irrigationMethod: string;
  irrigationGuidance: string[];
  waterConservation: string[];
  waterStressIndicators: string[];
  overIrrigationRisks: string[];
  weatherDataAvailable: boolean;
  confidence: 'low' | 'medium' | 'high';
  disclaimer: string;
}

export interface ChatMessage {
  id?: string;
  session_id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export interface ChatResponse {
  answer: string;
  language: Language;
  category: string;
  suggestedFollowUpQuestions: string[];
  warnings: string[];
  confidence: 'low' | 'medium' | 'high';
}

export interface DashboardSummary {
  stats: {
    totalAdvisories: number;
    cropRecommendationsCount: number;
    cropAdvisoriesCount: number;
    diseaseAnalysesCount: number;
    fertilizerAdvisoriesCount: number;
    irrigationAdvisoriesCount: number;
    chatSessionsCount: number;
  };
  profile: UserProfile | null;
  recentAdvisories: Array<{
    id: string;
    type: string;
    title: string;
    subtitle: string;
    createdAt: string;
  }>;
  recentActivities: Array<{
    id: string;
    crop_name?: string;
    activity_type: string;
    description: string;
    activity_date: string;
  }>;
}
