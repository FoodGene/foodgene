import axios, { AxiosInstance, AxiosError } from 'axios'
import {
  LoginRequest,
  TokenResponse,
} from '@/types/auth'
import {
  ScannerUploadRequest,
  ScannerUploadResponse,
  ProfileRequest,
  ProfileResponse,
  FoodRequestInput,
  FoodRequestResponse,
  CropYieldRequest,
  CropYieldResponse,
  ResearchSummaryRequest,
  ResearchSummaryResponse,
  FeaturesResponse,
} from '@/types/api'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
const TOKEN_KEY = 'foodgene_token'
const USER_ID_KEY = 'foodgene_user_id'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear token on unauthorized
          this.clearAuth()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const params = new URLSearchParams()
    params.append('username', credentials.username)
    params.append('password', credentials.password)

    const response = await this.client.post<TokenResponse>(
      '/auth/login',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const token = response.data.access_token
    const userId = this.extractUserIdFromToken(token)

    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_ID_KEY, userId)

    this.setAuthHeader(token)
    return response.data
  }

  logout(): void {
    this.clearAuth()
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  private getUserId(): string | null {
    return localStorage.getItem(USER_ID_KEY)
  }

  private setAuthHeader(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  private clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_ID_KEY)
    delete this.client.defaults.headers.common['Authorization']
  }

  private extractUserIdFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.sub || 'unknown'
    } catch {
      return 'unknown'
    }
  }

  // Initialize auth from stored token
  initializeAuth(): void {
    const token = this.getToken()
    if (token) {
      this.setAuthHeader(token)
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await this.client.get('/health')
    return response.data
  }

  // Scanner endpoints
  async uploadScan(request: ScannerUploadRequest): Promise<ScannerUploadResponse> {
    const response = await this.client.post<ScannerUploadResponse>(
      '/api/v1/scan',
      request
    )
    return response.data
  }

  // Profile endpoints
  async createProfile(profile: ProfileRequest): Promise<ProfileResponse> {
    const response = await this.client.post<ProfileResponse>(
      '/api/v1/profile',
      profile
    )
    return response.data
  }

  async updateProfile(profile: ProfileRequest): Promise<ProfileResponse> {
    const response = await this.client.post<ProfileResponse>(
      '/api/v1/profile',
      profile
    )
    return response.data
  }

  async getProfile(userId: string): Promise<ProfileResponse> {
    const response = await this.client.get<ProfileResponse>(
      `/api/v1/profile/${userId}`
    )
    return response.data
  }

  async getMyProfile(): Promise<ProfileResponse> {
    const userId = this.getUserId()
    if (!userId) {
      throw new Error('User not authenticated')
    }
    return this.getProfile(userId)
  }

  // Food request endpoints
  async requestFoodPlan(request: FoodRequestInput): Promise<FoodRequestResponse> {
    const response = await this.client.post<FoodRequestResponse>(
      '/api/v1/food-request',
      request
    )
    return response.data
  }

  async acceptFoodRequest(requestId: string): Promise<FoodRequestResponse> {
    const response = await this.client.post<FoodRequestResponse>(
      `/api/v1/food-request/${requestId}/accept`
    )
    return response.data
  }

  // Crop yield endpoints
  async predictCropYield(params: CropYieldRequest): Promise<CropYieldResponse> {
    const response = await this.client.get<CropYieldResponse>(
      '/api/v1/crop-yield',
      { params }
    )
    return response.data
  }

  // Research summary endpoints
  async generateSummary(request: ResearchSummaryRequest): Promise<ResearchSummaryResponse> {
    const response = await this.client.post<ResearchSummaryResponse>(
      '/api/v1/research-summary',
      request
    )
    return response.data
  }

  // Features endpoint
  async getFeatures(): Promise<FeaturesResponse> {
    const response = await this.client.get<FeaturesResponse>(
      '/api/v1/features'
    )
    return response.data
  }

  // Error handling helper
  getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.detail || error.message || 'An error occurred'
    }
    return error instanceof Error ? error.message : 'An unknown error occurred'
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

export default apiClient
