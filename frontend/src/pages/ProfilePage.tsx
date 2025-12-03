import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import apiClient from '@/services/api'
import { ProfileRequest, ProfileResponse, FormErrors } from '@/types/api'
import { ErrorMessage } from '@/components/ErrorMessage'
import { SuccessMessage } from '@/components/SuccessMessage'

export const ProfilePage: React.FC = () => {
  const { userId } = useAuth()
  const [profile, setProfile] = useState<ProfileRequest>({
    name: '',
    age: 25,
    weight: 70,
    height: 175,
    activity_level: 'moderate',
    dietary_preferences: 'balanced',
    allergies: [],
    medical_conditions: [],
    goals: [],
  })

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [allergyInput, setAllergyInput] = useState('')
  const [conditionInput, setConditionInput] = useState('')
  const [goalInput, setGoalInput] = useState('')

  useEffect(() => {
    loadProfile()
  }, [userId])

  const loadProfile = async () => {
    try {
      setInitialLoading(true)
      const profileData = await apiClient.getMyProfile()
      setProfile({
        name: profileData.name,
        age: profileData.age,
        weight: profileData.weight,
        height: profileData.height,
        activity_level: profileData.activity_level,
        dietary_preferences: profileData.dietary_preferences,
        allergies: profileData.allergies || [],
        medical_conditions: profileData.medical_conditions || [],
        goals: profileData.goals || [],
      })
    } catch (err) {
      // Profile might not exist yet, that's okay
      console.log('Creating new profile')
    } finally {
      setInitialLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!profile.name.trim()) newErrors.name = 'Name is required'
    if (profile.age < 1 || profile.age > 150) newErrors.age = 'Age must be between 1 and 150'
    if (profile.weight < 1 || profile.weight > 500) newErrors.weight = 'Weight must be valid'
    if (profile.height < 50 || profile.height > 300) newErrors.height = 'Height must be valid'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      setError('')

      await apiClient.createProfile(profile)
      setSuccess('✓ Profile saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(apiClient.getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value,
    }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const addAllergy = () => {
    if (allergyInput.trim() && !profile.allergies.includes(allergyInput.trim())) {
      setProfile((prev) => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()],
      }))
      setAllergyInput('')
    }
  }

  const removeAllergy = (allergy: string) => {
    setProfile((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy),
    }))
  }

  const addCondition = () => {
    if (conditionInput.trim() && !profile.medical_conditions.includes(conditionInput.trim())) {
      setProfile((prev) => ({
        ...prev,
        medical_conditions: [...prev.medical_conditions, conditionInput.trim()],
      }))
      setConditionInput('')
    }
  }

  const removeCondition = (condition: string) => {
    setProfile((prev) => ({
      ...prev,
      medical_conditions: prev.medical_conditions.filter((c) => c !== condition),
    }))
  }

  const addGoal = () => {
    if (goalInput.trim() && !profile.goals.includes(goalInput.trim())) {
      setProfile((prev) => ({
        ...prev,
        goals: [...prev.goals, goalInput.trim()],
      }))
      setGoalInput('')
    }
  }

  const removeGoal = (goal: string) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g !== goal),
    }))
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">My Profile</h1>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleInputChange}
              min="1"
              max="150"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                errors.age ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.age && <p className="text-sm text-red-600 mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
            <input
              type="number"
              name="weight"
              value={profile.weight}
              onChange={handleInputChange}
              min="1"
              max="500"
              step="0.1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                errors.weight ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.weight && <p className="text-sm text-red-600 mt-1">{errors.weight}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm) *</label>
            <input
              type="number"
              name="height"
              value={profile.height}
              onChange={handleInputChange}
              min="50"
              max="300"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                errors.height ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.height && <p className="text-sm text-red-600 mt-1">{errors.height}</p>}
          </div>
        </div>

        {/* Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
            <select
              name="activity_level"
              value={profile.activity_level}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diet Type</label>
            <select
              name="dietary_preferences"
              value={profile.dietary_preferences}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="balanced">Balanced</option>
              <option value="keto">Keto</option>
              <option value="vegan">Vegan</option>
              <option value="high_protein">High Protein</option>
              <option value="mediterranean">Mediterranean</option>
            </select>
          </div>
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
              placeholder="Add allergy..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addAllergy}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.allergies.map((allergy) => (
              <span
                key={allergy}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {allergy}
                <button
                  type="button"
                  onClick={() => removeAllergy(allergy)}
                  className="hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Medical Conditions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={conditionInput}
              onChange={(e) => setConditionInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
              placeholder="Add condition..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addCondition}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.medical_conditions.map((condition) => (
              <span
                key={condition}
                className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {condition}
                <button
                  type="button"
                  onClick={() => removeCondition(condition)}
                  className="hover:text-yellow-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Health Goals</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
              placeholder="Add goal..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addGoal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.goals.map((goal) => (
              <span
                key={goal}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {goal}
                <button
                  type="button"
                  onClick={() => removeGoal(goal)}
                  className="hover:text-green-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}

export default ProfilePage
