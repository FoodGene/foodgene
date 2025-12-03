import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import apiClient from '@/services/api'
import { FoodRequestInput, FoodRequestResponse, Meal } from '@/types/api'
import { ErrorMessage } from '@/components/ErrorMessage'
import { SuccessMessage } from '@/components/SuccessMessage'

export const FoodRequestPage: React.FC = () => {
  const { userId } = useAuth()
  const [request, setRequest] = useState<FoodRequestInput>({
    goal: 'maintain',
    allergies: [],
    constraints: {
      calories_per_day: 2000,
    },
    preferred_cuisines: [],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [result, setResult] = useState<FoodRequestResponse | null>(null)
  const [allergyInput, setAllergyInput] = useState('')
  const [cuisineInput, setCuisineInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const response = await apiClient.requestFoodPlan(request)
      setResult(response)
      setSuccess('✓ Meal plan generated successfully!')
    } catch (err) {
      setError(apiClient.getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const addAllergy = () => {
    if (allergyInput.trim() && !request.allergies.includes(allergyInput.trim())) {
      setRequest((prev) => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()],
      }))
      setAllergyInput('')
    }
  }

  const removeAllergy = (allergy: string) => {
    setRequest((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy),
    }))
  }

  const addCuisine = () => {
    if (cuisineInput.trim() && !request.preferred_cuisines?.includes(cuisineInput.trim())) {
      setRequest((prev) => ({
        ...prev,
        preferred_cuisines: [...(prev.preferred_cuisines || []), cuisineInput.trim()],
      }))
      setCuisineInput('')
    }
  }

  const removeCuisine = (cuisine: string) => {
    setRequest((prev) => ({
      ...prev,
      preferred_cuisines: prev.preferred_cuisines?.filter((c) => c !== cuisine),
    }))
  }

  const acceptPlan = async () => {
    if (!result?.request_id) return

    try {
      setLoading(true)
      await apiClient.acceptFoodRequest(result.request_id)
      setSuccess('✓ Meal plan accepted! +50 points earned!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(apiClient.getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Personalized Meal Plan</h1>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
              <select
                value={request.goal}
                onChange={(e) => setRequest((prev) => ({ ...prev, goal: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Calories
              </label>
              <input
                type="number"
                value={request.constraints?.calories_per_day || 2000}
                onChange={(e) =>
                  setRequest((prev) => ({
                    ...prev,
                    constraints: {
                      ...(prev.constraints || {}),
                      calories_per_day: Number(e.target.value),
                    },
                  }))
                }
                min="1000"
                max="4000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

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
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {request.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs flex items-center gap-1"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuisines</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={cuisineInput}
                  onChange={(e) => setCuisineInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCuisine())}
                  placeholder="Add cuisine..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addCuisine}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {request.preferred_cuisines?.map((cuisine) => (
                  <span
                    key={cuisine}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center gap-1"
                  >
                    {cuisine}
                    <button
                      type="button"
                      onClick={() => removeCuisine(cuisine)}
                      className="hover:text-green-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Generating...' : 'Generate Plan'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Your Meal Plan</h2>
                  <p className="text-sm text-gray-600">Request ID: {result.request_id}</p>
                </div>
                <button
                  onClick={acceptPlan}
                  disabled={loading || result.accepted}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    result.accepted
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {result.accepted ? '✓ Accepted' : 'Accept Plan'}
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">{result.plan.summary}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {result.plan.daily_calories}
                  </p>
                  <p className="text-sm text-gray-600">Calories</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {result.plan.daily_protein}g
                  </p>
                  <p className="text-sm text-gray-600">Protein</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {result.plan.daily_carbs}g
                  </p>
                  <p className="text-sm text-gray-600">Carbs</p>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-4">Daily Meals</h3>
              <div className="space-y-4">
                {result.plan.meals.map((meal: Meal, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{meal.name}</h4>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {meal.cal_total} cal
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="mb-1">Items:</p>
                      <ul className="list-disc list-inside">
                        {meal.items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 flex items-center justify-center min-h-96">
              <p className="text-gray-600 text-center">
                Submit your preferences to generate a personalized meal plan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodRequestPage
