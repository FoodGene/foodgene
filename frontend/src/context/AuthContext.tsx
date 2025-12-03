import React, { createContext, useContext, useState, useEffect } from 'react'
import { AuthContextType } from '@/types/auth'
import apiClient from '@/services/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('foodgene_token')
    const storedUserId = localStorage.getItem('foodgene_user_id')

    if (storedToken && storedUserId) {
      setToken(storedToken)
      setUserId(storedUserId)
      apiClient.initializeAuth()
    }

    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.login({ username, password })
      setToken(response.access_token)
      // Extract user ID from token
      const payload = JSON.parse(atob(response.access_token.split('.')[1]))
      setUserId(payload.sub)
    } catch (error) {
      throw new Error(apiClient.getErrorMessage(error))
    }
  }

  const logout = () => {
    apiClient.logout()
    setToken(null)
    setUserId(null)
  }

  const value: AuthContextType = {
    token,
    userId,
    login,
    logout,
    isAuthenticated: !!token,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
