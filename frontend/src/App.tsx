import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import HomePage from '@/pages/HomePage'
import DashboardPage from '@/pages/DashboardPage'
import ScannerPage from '@/pages/ScannerPage'
import ProfilePage from '@/pages/ProfilePage'
import FoodRequestPage from '@/pages/FoodRequestPage'
import CropYieldPage from '@/pages/CropYieldPage'
import ResearchSummaryPage from '@/pages/ResearchSummaryPage'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scan"
              element={
                <ProtectedRoute>
                  <ScannerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/food-request"
              element={
                <ProtectedRoute>
                  <FoodRequestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crop-yield"
              element={
                <ProtectedRoute>
                  <CropYieldPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research"
              element={
                <ProtectedRoute>
                  <ResearchSummaryPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
