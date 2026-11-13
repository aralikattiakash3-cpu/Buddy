import { z } from 'zod';

// ==========================================
// Profile Schemas
// ==========================================
export const profileUpdateSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().max(20).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  district: z.string().max(100).optional().nullable(),
  village: z.string().max(100).optional().nullable(),
  preferredLanguage: z.enum(['en', 'kn', 'hi']).default('en'),
  farmingExperience: z.string().max(100).optional().nullable(),
  landArea: z.number().nonnegative().max(100000).optional().nullable(),
  landUnit: z.string().max(20).optional().nullable(),
  farmingType: z.string().max(50).optional().nullable(),
});

// ==========================================
// Crop Recommendation Schemas
// ==========================================
export const cropRecommendationInputSchema = z.object({
  state: z.string().min(2).max(100),
  district: z.string().min(2).max(100),
  soilType: z.string().min(2).max(100),
  soilPh: z.number().min(0).max(14).optional().nullable(),
  nitrogen: z.number().min(0).max(1000).optional().nullable(),
  phosphorus: z.number().min(0).max(1000).optional().nullable(),
  potassium: z.number().min(0).max(1000).optional().nullable(),
  landArea: z.number().positive().max(100000),
  landUnit: z.enum(['acre', 'hectare', 'gunta', 'cent']),
  irrigationType: z.enum([
    'rainfed',
    'borewell',
    'open_well',
    'canal',
    'drip',
    'sprinkler',
    'mixed',
  ]),
  waterAvailability: z.enum(['low', 'medium', 'high']),
  season: z.enum(['kharif', 'rabi', 'zaid', 'year_round']),
  plantingPeriod: z.string().max(100).optional().nullable(),
  farmingObjective: z.string().min(2).max(200),
});

export const cropRecommendationItemSchema = z.object({
  cropName: z.string(),
  suitabilityScore: z.number().int().min(0).max(100),
  suitabilityExplanation: z.string(),
  soilCompatibility: z.string(),
  waterRequirement: z.string(),
  growingDuration: z.string(),
  plantingPeriod: z.string(),
  majorRisks: z.array(z.string()),
});

export const cropRecommendationResponseSchema = z.object({
  summary: z.string(),
  dataLimitations: z.array(z.string()),
  recommendations: z.array(cropRecommendationItemSchema).max(5),
  confidence: z.enum(['low', 'medium', 'high']),
  disclaimer: z.string(),
});

// ==========================================
// Crop Advisory Schemas
// ==========================================
export const cropAdvisoryInputSchema = z.object({
  cropName: z.string().min(2).max(100),
  cropVariety: z.string().max(100).optional().nullable(),
  sowingDate: z.string().optional().nullable(),
  growthStage: z.string().max(100).optional().nullable(),
  soilType: z.string().max(100).optional().nullable(),
  irrigationType: z.string().max(100).optional().nullable(),
  location: z.object({
    state: z.string().optional(),
    district: z.string().optional(),
  }).optional().nullable(),
  currentProblem: z.string().max(500).optional().nullable(),
});

export const cropGrowthStageSchema = z.object({
  stage: z.string(),
  description: z.string(),
  management: z.array(z.string()),
});

export const cropAdvisoryResponseSchema = z.object({
  cropName: z.string(),
  overview: z.string(),
  landPreparation: z.array(z.string()),
  seedSelection: z.array(z.string()),
  sowingGuidance: z.array(z.string()),
  growthStages: z.array(cropGrowthStageSchema),
  irrigation: z.array(z.string()),
  nutrientManagement: z.array(z.string()),
  weedManagement: z.array(z.string()),
  pestManagement: z.array(z.string()),
  diseasePrevention: z.array(z.string()),
  harvesting: z.array(z.string()),
  storage: z.array(z.string()),
  precautions: z.array(z.string()),
  disclaimer: z.string(),
});

// ==========================================
// Disease Detection Schemas
// ==========================================
export const diseaseConditionSchema = z.object({
  name: z.string(),
  likelihood: z.enum(['low', 'medium', 'high']),
  reason: z.string(),
});

export const diseaseDetectionResponseSchema = z.object({
  cropName: z.string(),
  plantPart: z.string(),
  observations: z.array(z.string()),
  possibleConditions: z.array(diseaseConditionSchema),
  alternativeCauses: z.array(z.string()),
  recommendedActions: z.array(z.string()),
  preventiveMeasures: z.array(z.string()),
  expertConsultationRecommended: z.boolean(),
  imageQuality: z.enum(['good', 'moderate', 'poor']),
  confidence: z.enum(['low', 'medium', 'high']),
  disclaimer: z.string(),
});

// ==========================================
// Fertilizer Advisory Schemas
// ==========================================
export const fertilizerInputSchema = z.object({
  cropName: z.string().min(2).max(100),
  growthStage: z.string().min(2).max(100),
  soilType: z.string().min(2).max(100),
  soilPh: z.number().min(0).max(14).optional().nullable(),
  nitrogen: z.number().min(0).max(1000).optional().nullable(),
  phosphorus: z.number().min(0).max(1000).optional().nullable(),
  potassium: z.number().min(0).max(1000).optional().nullable(),
  soilTestAvailable: z.boolean().optional().default(false),
  organicFertilizerAvailable: z.boolean().optional().default(false),
});

export const nutrientRequirementSchema = z.object({
  nutrient: z.string(),
  importance: z.string(),
  possibleDeficiencySymptoms: z.array(z.string()),
});

export const fertilizerResponseSchema = z.object({
  cropName: z.string(),
  growthStage: z.string(),
  soilAssessment: z.string(),
  nutrientRequirements: z.array(nutrientRequirementSchema),
  organicOptions: z.array(z.string()),
  fertilizerCategories: z.array(z.string()),
  applicationConsiderations: z.array(z.string()),
  soilTestingRecommendations: z.array(z.string()),
  precautions: z.array(z.string()),
  confidence: z.enum(['low', 'medium', 'high']),
  disclaimer: z.string(),
});

// ==========================================
// Irrigation Advisory Schemas
// ==========================================
export const irrigationInputSchema = z.object({
  cropName: z.string().min(2).max(100),
  growthStage: z.string().min(2).max(100),
  soilType: z.string().min(2).max(100),
  irrigationType: z.enum([
    'rainfed',
    'borewell',
    'open_well',
    'canal',
    'drip',
    'sprinkler',
    'mixed',
  ]),
  waterAvailability: z.enum(['low', 'medium', 'high']),
  recentRainfall: z.string().max(200).optional().nullable(),
});

export const irrigationResponseSchema = z.object({
  cropName: z.string(),
  growthStage: z.string(),
  waterAssessment: z.string(),
  irrigationMethod: z.string(),
  irrigationGuidance: z.array(z.string()),
  waterConservation: z.array(z.string()),
  waterStressIndicators: z.array(z.string()),
  overIrrigationRisks: z.array(z.string()),
  weatherDataAvailable: z.boolean(),
  confidence: z.enum(['low', 'medium', 'high']),
  disclaimer: z.string(),
});

// ==========================================
// Agricultural Chatbot Schemas
// ==========================================
export const chatMessageInputSchema = z.object({
  message: z.string().min(1).max(2000),
  language: z.enum(['en', 'kn', 'hi']).default('en'),
});

export const chatResponseSchema = z.object({
  answer: z.string(),
  language: z.enum(['en', 'kn', 'hi']),
  category: z.string(),
  suggestedFollowUpQuestions: z.array(z.string()),
  warnings: z.array(z.string()),
  confidence: z.enum(['low', 'medium', 'high']),
});
