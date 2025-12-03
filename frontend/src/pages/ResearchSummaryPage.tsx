import React, { useState } from 'react'
import apiClient from '@/services/api'
import { ResearchSummaryResponse } from '@/types/api'
import { ErrorMessage } from '@/components/ErrorMessage'
import { SuccessMessage } from '@/components/SuccessMessage'

export const ResearchSummaryPage: React.FC = () => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [result, setResult] = useState<ResearchSummaryResponse | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) {
      setError('Please enter some text to summarize')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await apiClient.generateSummary({
        text: text.trim(),
      })

      setResult(response)
      setSuccess('✓ Summary generated successfully!')
    } catch (err) {
      setError(apiClient.getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('✓ Copied to clipboard!')
    setTimeout(() => setSuccess(''), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Research Summary</h1>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Original Text</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your research article, blog post, or any text you want summarized..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent h-80 resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                {text.length} characters • {text.split(/\s+/).filter((w) => w).length} words
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Generating Summary...' : 'Summarize'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {result ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Summary</h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900">Summary Text</h3>
                  <button
                    onClick={() => copyToClipboard(result.summary)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    📋 Copy
                  </button>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-800 leading-relaxed">{result.summary}</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Compression ratio: {((result.summary.length / text.length) * 100).toFixed(1)}%
                </p>
              </div>

              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900">Key Highlights</h3>
                  <button
                    onClick={() => copyToClipboard(result.highlights.join(', '))}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    📋 Copy All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.highlights.map((highlight, index) => (
                    <button
                      key={index}
                      onClick={() => copyToClipboard(highlight)}
                      className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm hover:bg-yellow-200 transition"
                    >
                      {highlight}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <button
                  onClick={() => {
                    setText('')
                    setResult(null)
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear & Summarize Another
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 flex items-center justify-center min-h-96">
            <p className="text-gray-600 text-center">
              Paste your text in the left panel and click "Summarize" to see the summary and key
              highlights here
            </p>
          </div>
        )}
      </div>

      {/* Information Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
          <div>
            <p className="font-medium text-gray-900 mb-2">📝 Extract</p>
            <p>
              The system analyzes your text and extracts the most important sentences that capture
              the main ideas.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-2">🔍 Highlight</p>
            <p>
              Key concepts and important terms are identified and highlighted for quick reference
              and learning.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-2">⚡ Summarize</p>
            <p>
              A concise summary is generated that retains the essential information from the original
              text.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResearchSummaryPage
