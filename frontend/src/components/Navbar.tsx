import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import './Navbar.css'

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout, userId } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-text">
            FoodGene
          </Link>
        </div>

        {isAuthenticated && (
          <div className="navbar-menu">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/scan" className="nav-link">
              Scan
            </Link>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <Link to="/food-request" className="nav-link">
              Meal Plan
            </Link>
            <Link to="/crop-yield" className="nav-link">
              Crops
            </Link>
            <Link to="/research" className="nav-link">
              Research
            </Link>
            <span className="nav-user">{userId}</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
