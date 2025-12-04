import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import apiClient from '@/services/api'
import { ProfileResponse } from '@/types/api'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import './Pages.css'

ChartJS.register(ArcElement, Tooltip, Legend)

export const DashboardPage: React.FC = () => {
  const { userId, logout } = useAuth()
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    try {
      setLoading(true)
      // Try to load profile from backend
      try {
        await apiClient.getMyProfile()
      } catch (err) {
        // Profile might not exist yet, that's okay
        console.info('Profile not found, using questionnaire data only')
      }

      // Load user profile from localStorage (set during questionnaire)
      const storedProfile = localStorage.getItem('userProfile')
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile))
      }
    } catch (err) {
      setError(apiClient.getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  // Calculate nutrition based on questionnaire data
  const calculateNutrition = () => {
    if (!userProfile) return null

    const weight = parseFloat(userProfile.weight) || 75
    const height = parseFloat(userProfile.height) || 175
    const age = parseFloat(userProfile.age) || 25
    const gender = userProfile.gender || 'Male'
    const activityLevel = userProfile.activityLevel || 'Moderate'
    const dietType = userProfile.dietType || 'normal'

    // Mifflin-St Jeor Formula for BMR
    let bmr: number
    if (gender === 'Male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    const activityFactors: Record<string, number> = {
      'Sedentary': 1.2,
      'Light': 1.375,
      'Moderate': 1.55,
      'Active': 1.725,
      'Very Active': 1.9
    }

    const tdee = bmr * (activityFactors[activityLevel] || 1.55)

    // Macronutrients based on diet type
    const protein = dietType === 'athlete'
      ? (tdee * 0.35) / 4
      : (tdee * 0.25) / 4

    const carbs = dietType === 'athlete'
      ? (tdee * 0.45) / 4
      : (tdee * 0.50) / 4

    const fats = dietType === 'athlete'
      ? (tdee * 0.2) / 9
      : (tdee * 0.25) / 9

    return {
      calories: Math.round(tdee),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats)
    }
  }

  const nutrition = calculateNutrition()

  const chartData = nutrition ? {
    labels: ['Protein', 'Carbs', 'Fats'],
    datasets: [
      {
        data: [nutrition.protein, nutrition.carbs, nutrition.fats],
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
        borderColor: ['#fff', '#fff', '#fff'],
        borderWidth: 2
      }
    ]
  } : null

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Welcome to Your Dashboard</h1>
          <p className="dashboard-subtitle">Your personalized nutrition and health hub</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary logout-btn">
          Logout
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {!loading && (
      <div className="dashboard-grid">
        {/* User Profile Card */}
        {userProfile && (
          <div className="dashboard-card profile-card">
            <h2>👤 Your Profile</h2>
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Height:</span>
                <span className="info-value">{userProfile.height} cm</span>
              </div>
              <div className="info-row">
                <span className="info-label">Weight:</span>
                <span className="info-value">{userProfile.weight} kg</span>
              </div>
              <div className="info-row">
                <span className="info-label">Age:</span>
                <span className="info-value">{userProfile.age} years</span>
              </div>
              <div className="info-row">
                <span className="info-label">Gender:</span>
                <span className="info-value">{userProfile.gender}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Activity Level:</span>
                <span className="info-value">{userProfile.activityLevel}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Goal:</span>
                <span className="info-value">{userProfile.goal}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Diet Type:</span>
                <span className="info-value">{userProfile.dietType === 'athlete' ? '💪 Athlete/Bodybuilder' : '🥗 Normal'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Daily Nutrition Target Card */}
        {nutrition && (
          <div className="dashboard-card nutrition-card">
            <h2>🎯 Daily Nutrition Target</h2>
            <div className="nutrition-display">
              <div className="calorie-box">
                <p className="calorie-value">{nutrition.calories}</p>
                <p className="calorie-label">Calories</p>
              </div>
              <div className="macro-grid">
                <div className="macro-box protein">
                  <p className="macro-value">{nutrition.protein}g</p>
                  <p className="macro-label">Protein</p>
                </div>
                <div className="macro-box carbs">
                  <p className="macro-value">{nutrition.carbs}g</p>
                  <p className="macro-label">Carbs</p>
                </div>
                <div className="macro-box fats">
                  <p className="macro-value">{nutrition.fats}g</p>
                  <p className="macro-label">Fats</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Macro Distribution Chart */}
        {nutrition && chartData && (
          <div className="dashboard-card chart-card">
            <h2>📊 Macro Distribution</h2>
            <div className="chart-container">
              <Doughnut 
                data={chartData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }} 
              />
            </div>
          </div>
        )}

        {/* Meal Type Card */}
        {userProfile && (
          <div className="dashboard-card meal-card">
            <h2>🍽️ Meal Preferences</h2>
            <div className="meal-info">
              <p><strong>Meal Type:</strong> {userProfile.mealType}</p>
              {userProfile.weeklyEating && userProfile.weeklyEating.length > 0 && (
                <div>
                  <p><strong>Weekly Eating Habits:</strong></p>
                  <div className="eating-habits">
                    {userProfile.weeklyEating.map((item: string, idx: number) => (
                      <span key={idx} className="habit-tag">{item}</span>
                    ))}
                  </div>
                </div>
              )}
              {userProfile.allergies && (
                <p><strong>Allergies:</strong> {userProfile.allergies || 'None'}</p>
              )}
            </div>
          </div>
        )}

        {/* Health Conditions Card */}
        {userProfile && (
          <div className="dashboard-card health-card">
            <h2>⚕️ Health Information</h2>
            <div className="health-info">
              <p><strong>Existing Conditions:</strong></p>
              <p className="condition-text">{userProfile.existingConditions || 'None reported'}</p>
            </div>
          </div>
        )}

        {/* Quick Actions Card */}
        <div className="dashboard-card actions-card">
          <h2>⚡ Quick Actions</h2>
          <div className="actions-grid">
            <button 
              onClick={() => navigate('/food-request')}
              className="action-btn"
            >
              📋 Generate Meal Plan
            </button>
            <button 
              onClick={() => navigate('/scan')}
              className="action-btn"
            >
              📸 Scan Food
            </button>
            <button 
              onClick={() => navigate('/crop-yield')}
              className="action-btn"
            >
              🌾 Crop Yield
            </button>
            <button 
              onClick={() => navigate('/research')}
              className="action-btn"
            >
              📚 Research
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

// Simple logger for development
const logger = {
  info: (msg: string) => console.log('[INFO]', msg),
  error: (msg: string) => console.error('[ERROR]', msg)
}

export default DashboardPage
