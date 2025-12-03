import React from 'react'
import { useNavigate } from 'react-router-dom'
import './DietTypePage.css'

export const DietTypePage: React.FC = () => {
  const navigate = useNavigate()

  const handleSelectDiet = (dietType: string) => {
    localStorage.setItem('dietType', dietType)
    navigate('/questionnaire')
  }

  return (
    <div className="diet-type-page">
      <div className="diet-type-container">
        <h1>Select Your Diet Type</h1>
        <p className="subtitle">Choose the diet plan that suits your lifestyle</p>

        <div className="diet-options">
          <div
            className="diet-card"
            onClick={() => handleSelectDiet('athlete')}
          >
            <div className="diet-emoji">💪</div>
            <h2>Athlete / Bodybuilder</h2>
            <p className="diet-description">
              Optimized for muscle building and performance
            </p>
            <div className="diet-features">
              <p>✓ High protein intake (1.6-2.2g per kg)</p>
              <p>✓ Muscle-focused nutrition plan</p>
              <p>✓ Performance optimization</p>
            </div>
          </div>

          <div
            className="diet-card"
            onClick={() => handleSelectDiet('normal')}
          >
            <div className="diet-emoji">🥗</div>
            <h2>Normal Diet</h2>
            <p className="diet-description">
              Balanced nutrition for everyday health
            </p>
            <div className="diet-features">
              <p>✓ Balanced macronutrients</p>
              <p>✓ General health focus</p>
              <p>✓ Sustainable eating habits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DietTypePage
