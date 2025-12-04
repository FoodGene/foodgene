import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import html2pdf from 'html2pdf.js'
import { ErrorMessage } from '@/components/ErrorMessage'
import './MealPlanPage.css'

ChartJS.register(ArcElement, Tooltip, Legend)

export const MealPlanPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as any

  const [swappingMeal, setSwappingMeal] = useState<string | null>(null)
  const [email, setEmail] = useState<string>('')
  const [sendingEmail, setSendingEmail] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const plan = state?.plan
  const planId = state?.planId
  const calories = state?.calories || 2000
  const macros = state?.macros || { protein_g: 150, carbs_g: 250, fat_g: 65 }

  if (!plan) {
    return (
      <div className="page-container">
        <div className="error-message">No meal plan data available</div>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go Back
        </button>
      </div>
    )
  }

  const chartData = {
    labels: ['Protein', 'Carbs', 'Fats'],
    datasets: [
      {
        data: [macros.protein_g, macros.carbs_g, macros.fat_g],
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
        borderColor: ['#fff', '#fff', '#fff'],
        borderWidth: 2
      }
    ]
  }

  const handleSwapMeal = async (day: string, mealIndex: number) => {
    setSwappingMeal(`${day}-${mealIndex}`)
    setError('')

    try {
      const response = await fetch('/api/swap-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: planId,
          day,
          meal_index: mealIndex,
          profile: {
            diet_pref: 'balanced',
            allergies: []
          }
        })
      })

      if (!response.ok) throw new Error('Failed to swap meal')

      const data = await response.json()
      const dayInfo = plan.daily_meals?.find((d: any) => d.day === day)
      if (dayInfo && dayInfo.meals[mealIndex]) {
        dayInfo.meals[mealIndex] = data.alternative_meal
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to swap meal')
    } finally {
      setSwappingMeal(null)
    }
  }

  const handleExportPDF = () => {
    const element = document.getElementById('meal-plan-export')
    if (!element) return

    const opt = {
      margin: 10,
      filename: 'meal-plan.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    }

    html2pdf().set(opt).from(element).save()
  }

  const handleEmailPlan = async () => {
    if (!email) {
      setError('Please enter an email address')
      return
    }

    setSendingEmail(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/email-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          plan_id: planId
        })
      })

      if (!response.ok) throw new Error('Failed to send email')

      setSuccess('Meal plan sent successfully!')
      setEmail('')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email')
    } finally {
      setSendingEmail(false)
    }
  }

  return (
    <div className="page-container meal-plan-page">
      <div className="meal-plan-header">
        <h1 className="page-title">Your 7-Day Meal Plan</h1>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-secondary"
        >
          ← Back
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      {success && (
        <div className="success-message">{success}</div>
      )}

      {/* Nutrition Summary Section */}
      <div className="nutrition-summary">
        <div className="nutrition-card">
          <h2>Daily Targets</h2>
          <div className="calorie-display">
            <p className="calorie-value">{calories}</p>
            <p className="calorie-label">Calories</p>
          </div>
          <div className="macro-breakdown">
            <div className="macro-item">
              <p className="macro-value">{macros.protein_g}g</p>
              <p className="macro-label">Protein</p>
            </div>
            <div className="macro-item">
              <p className="macro-value">{macros.carbs_g}g</p>
              <p className="macro-label">Carbs</p>
            </div>
            <div className="macro-item">
              <p className="macro-value">{macros.fat_g}g</p>
              <p className="macro-label">Fats</p>
            </div>
          </div>
        </div>

        <div className="nutrition-card chart-card">
          <h2>Macro Distribution</h2>
          <div className="chart-container">
            <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="meal-plan-actions">
        <button className="btn btn-primary" onClick={handleExportPDF}>
          📄 Download PDF
        </button>
        <div className="email-section">
          <input
            type="email"
            placeholder="Enter email to send plan..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-input"
          />
          <button
            className="btn btn-primary"
            onClick={handleEmailPlan}
            disabled={sendingEmail}
          >
            {sendingEmail ? 'Sending...' : '✉️ Send Email'}
          </button>
        </div>
      </div>

      {/* Meal Plan Grid */}
      <div id="meal-plan-export" className="meal-plan-content">
        <h2 className="section-title">7-Day Meal Plan</h2>
        <div className="days-grid">
          {(plan.daily_meals || plan.days) && (plan.daily_meals || plan.days).map((dayInfo: any, dayIndex: number) => (
            <div key={dayIndex} className="day-card">
              <h3>Day {dayIndex + 1}</h3>
              {dayInfo.meals && dayInfo.meals.map((meal: any, mealIndex: number) => (
                <div key={mealIndex} className="meal-item">
                  <div className="meal-info">
                    <p className="meal-name">{meal.name}</p>
                    <p className="meal-calories">{meal.calories || 0} cal</p>
                  </div>
                  <button
                    className="swap-btn"
                    onClick={() => handleSwapMeal(`Day ${dayIndex + 1}`, mealIndex)}
                    disabled={swappingMeal === `Day ${dayIndex + 1}-${mealIndex}`}
                  >
                    {swappingMeal === `Day ${dayIndex + 1}-${mealIndex}` ? '⟳' : '⟳ Swap'}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Grocery List */}
        {plan.grocery_list && (
          <div className="grocery-section">
            <h2>Shopping List</h2>
            {Array.isArray(plan.grocery_list) && plan.grocery_list.length > 0 ? (
              typeof plan.grocery_list[0] === 'object' && plan.grocery_list[0].category ? (
                // Categorized format
                <div className="grocery-categories">
                  {plan.grocery_list.map((category: any, catIdx: number) => (
                    <div key={catIdx} className="grocery-category">
                      <h3>{category.category}</h3>
                      <ul>
                        {category.items && category.items.map((item: any, itemIdx: number) => (
                          <li key={itemIdx}>
                            {item.name} {item.quantity ? `- ${item.quantity}` : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                // Simple flat format
                <div className="grocery-items">
                  {plan.grocery_list.map((item: any, idx: number) => (
                    <div key={idx} className="grocery-item">
                      <span>✓</span>
                      <p>{typeof item === 'string' ? item : item.name || JSON.stringify(item)}</p>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <p>No items in grocery list</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MealPlanPage
