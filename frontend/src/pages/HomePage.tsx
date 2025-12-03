import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import './HomePage.css'

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="brand-highlight">FoodGene</span>
          </h1>
          <p className="hero-subtitle">
            Intelligent nutrition tracking and crop yield prediction powered by advanced ML
          </p>
          <button onClick={handleGetStarted} className="btn btn-primary hero-btn">
            Get Started
          </button>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📸</div>
          <h3>Food Scanner</h3>
          <p>Scan food items with your camera to get instant nutrition analysis</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🍽️</div>
          <h3>Meal Planning</h3>
          <p>Generate personalized diet plans based on your health goals</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🌾</div>
          <h3>Crop Yield</h3>
          <p>Predict crop yields based on location, climate, and soil data</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👤</div>
          <h3>Health Profile</h3>
          <p>Create a comprehensive health profile with allergies, preferences, and goals</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Research Summary</h3>
          <p>Get key insights from research articles with AI-powered summarization</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Gamification</h3>
          <p>Earn points and level up as you use the platform and reach your goals</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
