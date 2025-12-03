import React, { useState } from 'react'
import apiClient from '@/services/api'
import { CropYieldRequest, CropYieldResponse } from '@/types/api'
import { ErrorMessage } from '@/components/ErrorMessage'
import { SuccessMessage } from '@/components/SuccessMessage'

export const CropYieldPage: React.FC = () => {
  const [request, setRequest] = useState<CropYieldRequest>({
    location: 'Karnataka',
    crop: 'rice',
    soil_type: 'loam',
    rainfall: 1000,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [result, setResult] = useState<CropYieldResponse | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setRequest((prev) => ({
      ...prev,
      [name]: name === 'rainfall' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const response = await apiClient.predictCropYield(request)
      setResult(response)
      setSuccess('✓ Crop yield predicted successfully!')
    } catch (err) {
      setError(apiClient.getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800'
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Crop Yield Prediction</h1>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-6 text-gray-900">Input Parameters</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                name="location"
                value={request.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="Karnataka">Karnataka</option>
                <option value="Punjab">Punjab</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="TamilNadu">Tamil Nadu</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
              <select
                name="crop"
                value={request.crop}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="rice">Rice</option>
                <option value="wheat">Wheat</option>
                <option value="corn">Corn</option>
                <option value="potato">Potato</option>
                <option value="tomato">Tomato</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
              <select
                name="soil_type"
                value={request.soil_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="loam">Loam</option>
                <option value="silt">Silt</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Rainfall (mm)
              </label>
              <input
                type="number"
                name="rainfall"
                value={request.rainfall}
                onChange={handleInputChange}
                min="100"
                max="3000"
                step="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Predicting...' : 'Predict Yield'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow p-6">
          {result ? (
            <>
              <h2 className="text-lg font-semibold mb-6 text-gray-900">Prediction Results</h2>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Estimated Yield</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-blue-600">
                      {result.yield_estimate.toFixed(2)}
                    </p>
                    <p className="text-lg text-gray-600">{result.unit}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Prediction Confidence</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${(result.confidence * 100).toFixed(0)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(result.confidence)}`}
                    >
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Input Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <strong>Location:</strong> {request.location}
                    </p>
                    <p className="text-gray-600">
                      <strong>Crop:</strong> {request.crop.charAt(0).toUpperCase() + request.crop.slice(1)}
                    </p>
                    <p className="text-gray-600">
                      <strong>Soil Type:</strong> {request.soil_type.charAt(0).toUpperCase() + request.soil_type.slice(1)}
                    </p>
                    <p className="text-gray-600">
                      <strong>Rainfall:</strong> {request.rainfall} mm
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>📊 Note:</strong> This is a prediction based on historical data and
                    climate patterns. Actual yield may vary due to farming practices, pest
                    management, and weather conditions.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-600 text-center">
                Fill in the parameters and click "Predict Yield" to see results
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">About Crop Yield Prediction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">How it works</h3>
            <p>
              Our prediction model considers location-specific climate patterns, crop characteristics,
              and soil composition to estimate potential yields under typical conditions.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Factors considered</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Regional rainfall patterns</li>
              <li>Soil type and composition</li>
              <li>Crop-specific requirements</li>
              <li>Historical yield data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CropYieldPage
