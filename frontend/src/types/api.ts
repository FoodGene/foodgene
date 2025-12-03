import {
  DetectedItem,
  DietPlan,
  GamificationStats,
  NutritionInfo,
} from './common'

// Scanner/Scan types
export interface ScannerUploadRequest {
  uploader_id: string
  timestamp: string
  image_base64?: string
  file_path?: string
}

export interface ScannerUploadResponse {
  scan_id: string
  items: DetectedItem[]
  points_awarded: number
}

export interface ScanHistory {
  scan_id: string
  items: DetectedItem[]
  points_awarded: number
  created_at: string
}

// Profile types
export interface ProfileRequest {
  name: string
  age: number
  weight: number
  height: number
  activity_level: string
  dietary_preferences: string
  allergies: string[]
  medical_conditions: string[]
  goals: string[]
}

export interface ProfileResponse {
  user_id: string
  profile_id: string
  name: string
  age: number
  weight: number
  height: number
  activity_level: string
  dietary_preferences: string
  allergies: string[]
  medical_conditions: string[]
  goals: string[]
  profile_complete: boolean
  gamification_points: number
  level: number
  created_at: string
  updated_at: string
}

// Food request types
export interface FoodRequestInput {
  goal: string
  allergies: string[]
  constraints?: {
    calories_per_day?: number
    cuisine_preference?: string[]
  }
  preferred_cuisines?: string[]
}

export interface FoodRequestResponse {
  request_id: string
  plan: DietPlan
  accepted: boolean
  created_at: string
}

// Crop yield types
export interface CropYieldRequest {
  location: string
  crop: string
  soil_type: string
  rainfall: number
}

export interface CropYieldResponse {
  yield_estimate: number
  unit: string
  confidence: number
}

// Research summary types
export interface ResearchSummaryRequest {
  text: string
}

export interface ResearchSummaryResponse {
  summary: string
  highlights: string[]
}

// Dashboard types
export interface DashboardData {
  user: ProfileResponse
  lastScan?: ScanHistory
  currentDietPlan?: FoodRequestResponse
  gamification: GamificationStats
  recentScans: ScanHistory[]
}

// Feature info type
export interface FeatureInfo {
  name: string
  description: string
  icon: string
  enabled: boolean
}

export interface FeaturesResponse {
  title: string
  features: FeatureInfo[]
}
