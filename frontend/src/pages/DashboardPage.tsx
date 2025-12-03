import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import apiClient from '@/services/api'
import { ProfileResponse } from '@/types/api'
import { ErrorMessage } from '@/components/ErrorMessage'
import './Pages.css'

export const DashboardPage: React.FC = () => {
  const { userId } = useAuth()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getMyProfile()
      setProfile(data)
    } catch (err) {
      setError(apiClient.getErrorMessage(err))
    } finally {
      setLoading(false)
    }
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
      <h1 className="page-title">Dashboard</h1>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      {profile && (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>Profile</h2>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Age:</strong> {profile.age} years</p>
            <p><strong>Weight:</strong> {profile.weight} kg</p>
            <p><strong>Status:</strong> <span className={`profile-status ${profile.profile_complete ? 'status-complete' : 'status-incomplete'}`}>{profile.profile_complete ? 'Complete' : 'Incomplete'}</span></p>
          </div>
          <div className="dashboard-card">
            <h2>Gamification</h2>
            <p><span className="stats-value">{profile.gamification_points || 0}</span></p>
            <p className="stats-label">Total Points</p>
            <p style={{ marginTop: '1rem' }}><span className="stats-value" style={{ color: '#ca8a04' }}>{profile.level || 1}</span></p>
            <p className="stats-label">Level</p>
          </div>
          <div className="dashboard-card">
            <h2>Quick Stats</h2>
            <p><strong>Activity:</strong> {profile.activity_level}</p>
            <p><strong>Diet:</strong> {profile.dietary_preferences}</p>
            <p><strong>Allergies:</strong> {profile.allergies?.length || 0}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
