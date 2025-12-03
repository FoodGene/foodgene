import React, { useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import apiClient from '@/services/api'
import { ScannerUploadResponse, DetectedItem } from '@/types/api'
import { ErrorMessage } from '@/components/ErrorMessage'
import { SuccessMessage } from '@/components/SuccessMessage'

export const ScannerPage: React.FC = () => {
  const { userId } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [result, setResult] = useState<ScannerUploadResponse | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadScan = async () => {
    if (!preview || !userId) {
      setError('Please select an image first')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const response = await apiClient.uploadScan({
        uploader_id: userId,
        timestamp: new Date().toISOString(),
        image_base64: preview.split(',')[1], // Remove data: prefix
      })

      setResult(response)
      setSuccess(`✓ Scan complete! ${response.points_awarded} points awarded!`)
      setPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setError(apiClient.getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Food Scanner</h1>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Upload Image</h2>

          <div className="mb-6">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-96 object-cover rounded-lg" />
                <button
                  onClick={() => {
                    setPreview(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-600"
                >
                  <p className="text-2xl mb-2">📷</p>
                  <p className="font-medium">Click to upload or drag image</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={uploadScan}
            disabled={!preview || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            {loading ? 'Scanning...' : 'Scan Image'}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Detection Results</h2>

            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>✓ Scan ID:</strong> {result.scan_id}
              </p>
              <p className="text-lg font-bold text-green-700 mt-2">
                +{result.points_awarded} Points Earned!
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Detected Items</h3>
              {result.items.map((item: DetectedItem, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">{item.label}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {(item.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  {item.nutrition && (
                    <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 mt-2">
                      <p>🔥 {item.nutrition.calories} cal</p>
                      <p>🥚 {item.nutrition.protein}g protein</p>
                      <p>🌾 {item.nutrition.carbs}g carbs</p>
                      <p>🧈 {item.nutrition.fat}g fat</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!result && (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 flex items-center justify-center h-96">
            <p className="text-gray-600 text-center">
              Results will appear here after you scan an image
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScannerPage
