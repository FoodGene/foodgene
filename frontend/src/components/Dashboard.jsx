import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import html2pdf from 'html2pdf.js';
import '../styles/Dashboard.css';

export default function Dashboard({ userEmail, dietType }) {
  const [calories, setCalories] = useState(2000);
  const [meals, setMeals] = useState([]);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form inputs
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [goal, setGoal] = useState('');

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const data = JSON.parse(userData);
      setHeight(data.height || '');
      setWeight(data.weight || '');
      setAge(data.age || '');
      setGender(data.gender || '');
      setActivityLevel(data.activityLevel || '');
      setGoal(data.goal || '');
    }
  }, []);

  const calculateTDEE = () => {
    if (!height || !weight || !age || !gender || !activityLevel) {
      alert('Please fill in all fields');
      return;
    }

    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);

    // Mifflin-St Jeor Formula
    let bmr;
    if (gender === 'Male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const activityFactors = {
      'Sedentary': 1.2,
      'Light': 1.375,
      'Moderate': 1.55,
      'Active': 1.725,
      'Very Active': 1.9
    };

    const tdee = bmr * (activityFactors[activityLevel] || 1.2);
    
    // Adjust for goal
    let adjustedCalories = tdee;
    if (goal === 'Lose Weight') {
      adjustedCalories = tdee * 0.85;
    } else if (goal === 'Gain Muscle') {
      adjustedCalories = tdee * 1.15;
    }

    setCalories(Math.round(adjustedCalories));
    generateMealPlan(Math.round(adjustedCalories));
  };

  const generateMealPlan = async (calorieTarget) => {
    setLoading(true);
    setError(null);

    try {
      const macroRatio = dietType === 'athlete' 
        ? { protein: 0.35, carbs: 0.45, fats: 0.2 }
        : { protein: 0.25, carbs: 0.50, fats: 0.25 };

      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calories: calorieTarget,
          macros: macroRatio,
          profile: { dietType, goal }
        })
      });

      if (!response.ok) throw new Error('Failed to generate plan');

      const data = await response.json();
      setMealPlan(data);
      setMeals(data.meals || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const swapMeal = async (dayIndex, mealIndex) => {
    try {
      const response = await fetch('/api/swap-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: mealPlan.plan_id,
          day: dayIndex + 1,
          meal_index: mealIndex
        })
      });

      if (!response.ok) throw new Error('Failed to swap meal');

      const data = await response.json();
      const newMeals = [...meals];
      if (!newMeals[dayIndex]) newMeals[dayIndex] = [];
      newMeals[dayIndex][mealIndex] = data.alternative_meal;
      setMeals(newMeals);
    } catch (err) {
      setError(err.message);
    }
  };

  const exportPDF = () => {
    const element = document.getElementById('meal-plan-export');
    if (!element) return;

    const opt = {
      margin: 10,
      filename: 'meal_plan.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const emailPlan = async () => {
    try {
      const response = await fetch('/api/email-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          plan_id: mealPlan.plan_id,
          plan_data: mealPlan
        })
      });

      if (!response.ok) throw new Error('Failed to send email');

      alert('Meal plan sent to ' + userEmail);
    } catch (err) {
      setError(err.message);
    }
  };

  const macroData = {
    protein: calories * (dietType === 'athlete' ? 0.35 : 0.25) / 4,
    carbs: calories * (dietType === 'athlete' ? 0.45 : 0.50) / 4,
    fats: calories * (dietType === 'athlete' ? 0.2 : 0.25) / 9
  };

  const chartData = {
    labels: ['Protein', 'Carbs', 'Fats'],
    datasets: [
      {
        data: [macroData.protein, macroData.carbs, macroData.fats],
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
        borderColor: ['#fff', '#fff', '#fff'],
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {userEmail.split('@')[0]}! 👋</h1>
        <p className="diet-badge">{dietType === 'athlete' ? 'Athlete Plan' : 'Normal Diet'} 💪</p>
      </div>

      <div className="dashboard-content">
        {/* Calculator Section */}
        <div className="calculator-section">
          <h2>Calculate Your Daily Nutrition</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
              />
            </div>

            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="75"
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
              />
            </div>

            <div className="form-group">
              <label>Activity Level</label>
              <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                <option value="">Select</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Light">Light</option>
                <option value="Moderate">Moderate</option>
                <option value="Active">Active</option>
                <option value="Very Active">Very Active</option>
              </select>
            </div>

            <div className="form-group">
              <label>Goal</label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="">Select</option>
                <option value="Lose Weight">Lose Weight</option>
                <option value="Maintain">Maintain</option>
                <option value="Gain Muscle">Gain Muscle</option>
                <option value="Improve Health">Improve Health</option>
              </select>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" onClick={calculateTDEE} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Meal Plan'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Nutrition Chart and Stats */}
        {mealPlan && (
          <div className="nutrition-section">
            <div className="nutrition-card">
              <h3>Daily Macros</h3>
              <div className="calorie-display">
                <p className="calorie-value">{calories}</p>
                <p className="calorie-label">Calories</p>
              </div>
              <div className="macro-stats">
                <div className="macro-stat">
                  <p className="macro-value">{Math.round(macroData.protein)}g</p>
                  <p className="macro-label">Protein</p>
                </div>
                <div className="macro-stat">
                  <p className="macro-value">{Math.round(macroData.carbs)}g</p>
                  <p className="macro-label">Carbs</p>
                </div>
                <div className="macro-stat">
                  <p className="macro-value">{Math.round(macroData.fats)}g</p>
                  <p className="macro-label">Fats</p>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3>Macro Distribution</h3>
              <div className="chart-container">
                <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
            </div>
          </div>
        )}

        {/* Meal Plan Section */}
        {mealPlan && (
          <div className="meal-plan-section">
            <div className="meal-plan-header">
              <h2>7-Day Meal Plan</h2>
              <div className="action-buttons">
                <button className="btn btn-secondary" onClick={exportPDF}>
                  📄 Export PDF
                </button>
                <button className="btn btn-secondary" onClick={emailPlan}>
                  ✉️ Email Plan
                </button>
              </div>
            </div>

            <div id="meal-plan-export" className="meal-plan-grid">
              {mealPlan.daily_meals && mealPlan.daily_meals.map((day, dayIndex) => (
                <div key={dayIndex} className="day-card">
                  <h3>Day {dayIndex + 1}</h3>
                  {day.meals && day.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="meal-item">
                      <div className="meal-details">
                        <p className="meal-name">{meal.name}</p>
                        <p className="meal-calories">{meal.calories} cal</p>
                      </div>
                      <button
                        className="swap-btn"
                        onClick={() => swapMeal(dayIndex, mealIndex)}
                      >
                        ↻ Swap
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {mealPlan.grocery_list && (
              <div className="grocery-section">
                <h3>Shopping List</h3>
                <ul className="grocery-list">
                  {mealPlan.grocery_list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
