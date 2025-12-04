import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/Generator.css';

ChartJS.register(ArcElement, Tooltip, Legend);

// Calculate macros from user metrics using Mifflin-St Jeor formula
function calculateCalories(height, weight, age, gender, activityLevel) {
  let bmr;
  if (gender === 'Male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  const activityMultipliers = {
    'Sedentary': 1.2,
    'Light': 1.375,
    'Moderate': 1.55,
    'Active': 1.725,
    'Very Active': 1.9
  };
  
  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
  return tdee;
}

// Calculate macros based on goal
function calculateMacros(calories, goal) {
  let macros = {};
  
  switch (goal) {
    case 'Maintain':
      macros.protein_g = Math.round(calories * 0.3 / 4);
      macros.carbs_g = Math.round(calories * 0.45 / 4);
      macros.fat_g = Math.round(calories * 0.25 / 9);
      break;
    case 'Lose Weight':
      macros.protein_g = Math.round(calories * 0.35 / 4);
      macros.carbs_g = Math.round(calories * 0.4 / 4);
      macros.fat_g = Math.round(calories * 0.25 / 9);
      break;
    case 'Gain Muscle':
      macros.protein_g = Math.round(calories * 0.35 / 4);
      macros.carbs_g = Math.round(calories * 0.45 / 4);
      macros.fat_g = Math.round(calories * 0.2 / 9);
      break;
    default:
      macros.protein_g = Math.round(calories * 0.3 / 4);
      macros.carbs_g = Math.round(calories * 0.45 / 4);
      macros.fat_g = Math.round(calories * 0.25 / 9);
  }
  
  return macros;
}

export default function Generator({ onPlanGenerated }) {
  const navigate = useNavigate();
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('Male');
  const [activityLevel, setActivityLevel] = useState('Moderate');
  const [goal, setGoal] = useState('Maintain');
  const [dietPref, setDietPref] = useState('Balanced');
  const [allergies, setAllergies] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calories = calculateCalories(height, weight, age, gender, activityLevel);
  const macros = calculateMacros(calories, goal);

  const chartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [macros.protein_g, macros.carbs_g, macros.fat_g],
        backgroundColor: ['#EF4444', '#84CC16', '#FBBF24'],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 12 }
        }
      }
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const allergiesArray = allergies
        .split(',')
        .map(a => a.trim())
        .filter(a => a);

      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calories,
          macros,
          profile: {
            diet_pref: dietPref,
            allergies: allergiesArray
          }
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to generate plan');
      }

      const data = await response.json();
      // Navigate to meal plan page with state
      navigate('/meal-plan', {
        state: {
          plan: data.plan,
          planId: data.plan_id,
          calories,
          macros
        }
      });
      // Also call the callback if it exists (for backward compatibility)
      if (onPlanGenerated) {
        onPlanGenerated(data.plan, data.plan_id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="generator">
      <div className="generator-container">
        <div className="generator-form">
          <h2>Quick generator</h2>

          <div className="form-group">
            <label>Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Activity level</label>
            <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
              <option>Sedentary</option>
              <option>Light</option>
              <option>Moderate</option>
              <option>Active</option>
              <option>Very Active</option>
            </select>
          </div>

          <div className="form-group">
            <label>Goal</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option>Maintain</option>
              <option>Lose Weight</option>
              <option>Gain Muscle</option>
            </select>
          </div>

          <div className="form-group">
            <label>Diet preference</label>
            <select value={dietPref} onChange={(e) => setDietPref(e.target.value)}>
              <option>Balanced</option>
              <option>Vegetarian</option>
              <option>Vegan</option>
              <option>Keto</option>
              <option>Low Carb</option>
            </select>
          </div>

          <div className="form-group">
            <label>Allergies (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. peanuts, gluten"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            className="generate-btn"
            onClick={handleGeneratePlan}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Plan'}
          </button>
        </div>

        <div className="chart-container">
          <h3>Macro split (preview)</h3>
          <div className="chart">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <div className="macro-stats">
            <div className="stat">
              <strong>{calories}</strong>
              <span>kcal/day</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
