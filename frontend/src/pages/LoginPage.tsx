import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ErrorMessage } from '@/components/ErrorMessage'
import './LoginPage.css'

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('testuser')
  const [password, setPassword] = useState('testpass123')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">FoodGene</h1>
        <p className="login-subtitle">Smart nutrition and crop management</p>

        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary login-btn"
          >
            {isLoading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-info">
          <p>
            <strong>Demo credentials:</strong><br />
            Username: testuser<br />
            Password: testpass123
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
