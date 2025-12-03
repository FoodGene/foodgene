import { useState } from 'react';
import html2pdf from 'html2pdf.js';
import '../styles/MealPlan.css';

export default function MealPlan({ plan, planId, onBack }) {
  const [swappingMeal, setSwappingMeal] = useState(null);
  const [email, setEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const handleSwapMeal = async (day, mealIndex) => {
    if (!plan || !plan.days) return;

    setSwappingMeal(`${day}-${mealIndex}`);

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
      });

      if (!response.ok) {
        throw new Error('Failed to swap meal');
      }

      const data = await response.json();
      // Update the meal in the plan
      const dayInfo = plan.days.find(d => d.day === day);
      if (dayInfo && dayInfo.meals[mealIndex]) {
        dayInfo.meals[mealIndex] = data.new_meal;
      }
    } catch (err) {
      console.error('Swap failed:', err);
    } finally {
      setSwappingMeal(null);
    }
  };

  const handleExportPDF = () => {
    const element = document.getElementById('meal-plan-content');
    const opt = {
      margin: 10,
      filename: 'meal-plan.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleEmailPlan = async () => {
    if (!email) {
      setEmailError('Please enter an email');
      return;
    }

    setSendingEmail(true);
    setEmailError(null);
    setEmailSuccess(false);

    try {
      const response = await fetch('/api/email-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          plan_id: planId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setEmailSuccess(true);
      setEmail('');
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (err) {
      setEmailError(err.message);
    } finally {
      setSendingEmail(false);
    }
  };

  if (!plan || !plan.days) {
    return <div>Loading...</div>;
  }

  return (
    <section className="meal-plan">
      <div className="meal-plan-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Your 7-Day Meal Plan</h1>
      </div>

      <div className="meal-plan-actions">
        <button className="export-btn" onClick={handleExportPDF}>
          Export as PDF
        </button>
        <div className="email-group">
          <input
            type="email"
            placeholder="Enter email to send plan..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="send-btn"
            onClick={handleEmailPlan}
            disabled={sendingEmail}
          >
            {sendingEmail ? 'Sending...' : 'Send'}
          </button>
        </div>
        {emailError && <div className="email-error">{emailError}</div>}
        {emailSuccess && <div className="email-success">Plan sent successfully!</div>}
      </div>

      <div id="meal-plan-content" className="meal-plan-content">
        <div className="days-grid">
          {plan.days.map((day, dayIndex) => (
            <div key={dayIndex} className="day-card">
              <h2>{day.day}</h2>
              {day.meals.map((meal, mealIndex) => (
                <div key={mealIndex} className="meal-item">
                  <div className="meal-header">
                    <h3>{meal.name}</h3>
                    <button
                      className="swap-btn"
                      onClick={() => handleSwapMeal(day.day, mealIndex)}
                      disabled={swappingMeal === `${day.day}-${mealIndex}`}
                    >
                      {swappingMeal === `${day.day}-${mealIndex}` ? 'Swapping...' : 'Swap'}
                    </button>
                  </div>
                  <p className="serving">{meal.serving}</p>
                  <div className="meal-macros">
                    <span>{meal.cal} cal</span>
                    <span>P: {meal.protein_g}g</span>
                    <span>C: {meal.carbs_g}g</span>
                    <span>F: {meal.fat_g}g</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {plan.grocery_list && (
          <div className="grocery-section">
            <h2>Grocery List</h2>
            {plan.grocery_list.map((category, idx) => (
              <div key={idx} className="grocery-category">
                <h3>{category.category}</h3>
                <ul>
                  {category.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      {item.name} - {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
