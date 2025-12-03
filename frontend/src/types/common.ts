// Common data types shared across features

export interface DetectedItem {
  label: string
  confidence: number
  nutrition?: NutritionInfo
}

export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Meal {
  name: string
  items: string[]
  cal_total: number
}

export interface DietPlan {
  summary: string
  meals: Meal[]
  daily_calories: number
  daily_protein: number
  daily_carbs: number
  daily_fat: number
}

export interface MealItem {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

// Gamification types
export interface GamificationStats {
  total_points: number
  level: number
  badges: string[]
  streak_days: number
}

export interface ApiErrorResponse {
  detail: string
}

// Form submission types
export interface FormErrors {
  [key: string]: string
}
