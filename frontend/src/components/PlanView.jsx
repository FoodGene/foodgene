import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import html2pdf from 'html2pdf.js';
import MealItem from './MealItem';
import Controls from './Controls';
import '../styles/PlanView.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/**
 * PlanView Component
 * Main component for displaying meal plans, managing swaps, and exporting
 */
export default function PlanView() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [calories, setCalories] = useState(2000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('profile');
    return saved
      ? JSON.parse(saved)
      : { diet_pref: 'balanced', allergies: [] };
  });

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  const generatePlan = async (calories, macros, profile) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calories, macros, profile })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to generate plan');
      }

      const data = await response.json();
      setCurrentPlan(data);
      localStorage.setItem('currentPlan', JSON.stringify(data));
      localStorage.setItem('planId', data.plan_id);
      return data.plan_id;
    } catch (err) {
      setError(err.message || 'Error generating plan');
      console.error('Generate plan error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleMealSwapped = (newMeal) => {
    // For now, regenerate the full plan or update locally
    // This is a simplified implementation - in production, track which meal was swapped
    if (currentPlan) {
      setCurrentPlan({ ...currentPlan });
    }
  };

  const calculateDailyCalories = () => {
    if (!currentPlan || !currentPlan.plan.days) return [];
    return currentPlan.plan.days.map((day) => ({
      day: day.day.substring(0, 3),
      calories: (day.meals || []).reduce((sum, meal) => sum + (meal.cal || 0), 0)
    }));
  };

  const exportPDF = () => {
    const element = document.getElementById('plan-to-print');
    if (!element) {
      alert('No plan to export');
      return;
    }

    const opt = {
      margin: 10,
      filename: 'meal_plan.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const dailyCalories = calculateDailyCalories();
  const chartData = {
    labels: dailyCalories.map((d) => d.day),
    datasets: [
      {
        label: 'Daily Calories',
        data: dailyCalories.map((d) => d.calories),
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  return (
    <div className="plan-view">
      <div className="container">
        <div className="plan-header">
          <h1>🍽️ Personalized Meal Plan Generator</h1>
          <p>Generate, customize, and export your perfect 7-day meal plan</p>
        </div>

        <Controls
          calories={calories}
          onCalorieChange={setCalories}
          onGeneratePlan={generatePlan}
          onExportPDF={exportPDF}
          hasPlan={!!currentPlan}
          loading={loading}
          profile={profile}
          onProfileChange={setProfile}
        />

        {error && <div className="message message-error">{error}</div>}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Generating your perfect meal plan...</p>
          </div>
        )}

        {currentPlan && !loading && (
          <div id="plan-to-print">
            <div className="plan-content">
              {/* Weekly Calendar */}
              <h2>Your 7-Day Meal Plan</h2>
              <div className="days-grid">
                {currentPlan.plan.days &&
                  currentPlan.plan.days.map((day, dayIndex) => (
                    <div key={`${day.day}-${dayIndex}`} className="day-card">
                      <div className="day-title">{day.day}</div>
                      <ul className="meals-list">
                        {day.meals && day.meals.map((meal, mealIndex) => (
                          <li key={`${day.day}-${mealIndex}`} className="meal-wrapper">
                            <MealItem
                              planId={currentPlan.plan_id}
                              day={day.day}
                              mealIndex={mealIndex}
                              meal={meal}
                              profile={profile}
                              onMealSwapped={handleMealSwapped}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>

              {/* Weekly Calorie Chart */}
              {dailyCalories.length > 0 && (
                <div className="chart-container">
                  <div className="chart-title">Weekly Calorie Overview</div>
                  <Line data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'top'
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }} />
                </div>
              )}

              {/* Grocery List */}
              {currentPlan.plan.grocery_list && currentPlan.plan.grocery_list.length > 0 && (
                <div className="grocery-section">
                  <h2>🛒 Grocery List</h2>
                  {Array.isArray(currentPlan.plan.grocery_list[0]?.category) === false &&
                  currentPlan.plan.grocery_list[0]?.category ? (
                    <div className="grocery-grid">
                      {currentPlan.plan.grocery_list.map((category, idx) => (
                        <div key={`grocery-${idx}`} className="grocery-category">
                          <h3>{category.category}</h3>
                          <ul className="grocery-items">
                            {category.items && category.items.map((item, itemIdx) => (
                              <li key={`${category.category}-${itemIdx}`} className="grocery-item">
                                <span className="item-name">{item.name}</span>
                                <span className="item-quantity">{item.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grocery-grid">
                      {currentPlan.plan.grocery_list.map((item, idx) => (
                        <div key={`grocery-simple-${idx}`} className="grocery-category">
                          <ul className="grocery-items">
                            <li className="grocery-item">
                              <span className="item-name">{item.item || item.name}</span>
                              <span className="item-quantity">{item.quantity}</span>
                            </li>
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {!currentPlan && !loading && (
          <div className="text-center mt-8 mb-8">
            <p>Generate your first meal plan to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
