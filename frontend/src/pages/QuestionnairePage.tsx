import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ErrorMessage } from '@/components/ErrorMessage'
import './QuestionnairePage.css'

export const QuestionnairePage: React.FC = () => {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    mealType: '',
    activityLevel: '',
    goal: '',
    weeklyEating: [] as string[],
    allergies: '',
    existingConditions: '',
  })

  const totalSteps = 6

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleWeeklyEating = (item: string) => {
    setFormData(prev => ({
      ...prev,
      weeklyEating: prev.weeklyEating.includes(item)
        ? prev.weeklyEating.filter(x => x !== item)
        : [...prev.weeklyEating, item]
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.height || !formData.weight) {
          setError('Please fill in height and weight')
          return false
        }
        return true
      case 2:
        if (!formData.age || !formData.gender) {
          setError('Please select age and gender')
          return false
        }
        return true
      case 3:
        if (!formData.mealType) {
          setError('Please select meal type')
          return false
        }
        return true
      case 4:
        if (!formData.activityLevel || !formData.goal) {
          setError('Please select activity level and goal')
          return false
        }
        return true
      case 5:
        if (formData.weeklyEating.length === 0) {
          setError('Please select at least one eating habit')
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      setError('')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError('')
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setLoading(true)
    setError('')

    try {
      // Get email and dietType from storage
      const userEmail = localStorage.getItem('userEmail') || userId || 'unknown'
      const dietType = localStorage.getItem('dietType') || 'normal'

      const response = await fetch('/api/questionnaire/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          ...formData,
          dietType
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to submit questionnaire')
      }

      // Store profile data
      const data = await response.json()
      localStorage.setItem('userProfile', JSON.stringify(data.profile))

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="questionnaire-page">
      <div className="questionnaire-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>

        <h1>Health & Fitness Questionnaire</h1>
        <p className="step-indicator">
          Step {currentStep} of {totalSteps}
        </p>

        {error && (
          <ErrorMessage message={error} onDismiss={() => setError('')} />
        )}

        {/* Step 1: Height and Weight */}
        {currentStep === 1 && (
          <div className="question-section">
            <h2>Body Measurements</h2>
            <div className="form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                placeholder="e.g., 175"
              />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="e.g., 75"
              />
            </div>
          </div>
        )}

        {/* Step 2: Age and Gender */}
        {currentStep === 2 && (
          <div className="question-section">
            <h2>Personal Information</h2>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="e.g., 25"
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Meal Type */}
        {currentStep === 3 && (
          <div className="question-section">
            <h2>Meal Preference</h2>
            <div className="options">
              {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Pescatarian'].map(
                (option) => (
                  <button
                    key={option}
                    className={`option-btn ${
                      formData.mealType === option ? 'selected' : ''
                    }`}
                    onClick={() => handleInputChange('mealType', option)}
                  >
                    {option}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Step 4: Activity and Goal */}
        {currentStep === 4 && (
          <div className="question-section">
            <h2>Activity Level & Goal</h2>
            <div className="form-group">
              <label>Activity Level</label>
              <select
                value={formData.activityLevel}
                onChange={(e) => handleInputChange('activityLevel', e.target.value)}
              >
                <option value="">Select activity level</option>
                <option value="Sedentary">
                  Sedentary (little or no exercise)
                </option>
                <option value="Light">Light (1-3 days/week)</option>
                <option value="Moderate">Moderate (3-5 days/week)</option>
                <option value="Active">Active (6-7 days/week)</option>
                <option value="Very Active">Very Active (intense daily)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Goal</label>
              <select
                value={formData.goal}
                onChange={(e) => handleInputChange('goal', e.target.value)}
              >
                <option value="">Select goal</option>
                <option value="Lose Weight">Lose Weight</option>
                <option value="Maintain">Maintain Weight</option>
                <option value="Gain Muscle">Gain Muscle</option>
                <option value="Improve Health">Improve Health</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 5: Weekly Eating Habits */}
        {currentStep === 5 && (
          <div className="question-section">
            <h2>Weekly Eating Habits</h2>
            <p className="sub-text">Select all that apply</p>
            <div className="options-grid">
              {[
                'Chicken & Poultry',
                'Fish & Seafood',
                'Beef & Red Meat',
                'Rice & Grains',
                'Bread & Pasta',
                'Vegetables',
                'Fruits',
                'Dairy & Milk',
                'Nuts & Seeds',
                'Legumes & Beans',
              ].map((item) => (
                <button
                  key={item}
                  className={`option-btn ${
                    formData.weeklyEating.includes(item) ? 'selected' : ''
                  }`}
                  onClick={() => toggleWeeklyEating(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Allergies and Conditions */}
        {currentStep === 6 && (
          <div className="question-section">
            <h2>Additional Information</h2>
            <div className="form-group">
              <label>Allergies (comma separated)</label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                placeholder="e.g., peanuts, gluten, dairy"
              />
            </div>
            <div className="form-group">
              <label>Any existing health conditions?</label>
              <input
                type="text"
                value={formData.existingConditions}
                onChange={(e) =>
                  handleInputChange('existingConditions', e.target.value)
                }
                placeholder="e.g., diabetes, high blood pressure"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="button-group">
          <button
            className="btn btn-secondary"
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
          >
            Back
          </button>

          {currentStep === totalSteps ? (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Creating Profile...' : 'Complete Profile'}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={loading}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionnairePage
