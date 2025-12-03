import { useState } from 'react';
import '../styles/MealItem.css';

/**
 * MealItem Component
 * Displays a single meal with macro breakdown and swap functionality
 * 
 * Props:
 *   planId: string - The plan ID for API calls
 *   day: string - The day name (e.g., "Mon")
 *   mealIndex: number - Index of this meal within the day
 *   meal: object - {name, serving, cal, protein_g, carbs_g, fat_g}
 *   profile: object - {diet_pref, allergies}
 *   onMealSwapped: function(newMeal) - Callback when meal is successfully swapped
 */
export default function MealItem({ planId, day, mealIndex, meal, profile, onMealSwapped }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSwapMeal = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/swap-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: planId,
          day,
          meal_index: mealIndex,
          profile
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to swap meal');
      }

      const data = await response.json();
      onMealSwapped(data.new_meal);
    } catch (err) {
      setError(err.message || 'Error swapping meal');
      console.error('Swap meal error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="meal-item">
      <div className="meal-header">
        <div>
          <div className="meal-name">{meal.name}</div>
          <div className="meal-serving">{meal.serving}</div>
        </div>
        <div className="meal-calories">{meal.cal} cal</div>
      </div>

      <div className="meal-macros">
        <div className="macro-item">
          <div className="macro-label">Protein</div>
          <div className="macro-value">{meal.protein_g}g</div>
        </div>
        <div className="macro-item">
          <div className="macro-label">Carbs</div>
          <div className="macro-value">{meal.carbs_g}g</div>
        </div>
        <div className="macro-item">
          <div className="macro-label">Fat</div>
          <div className="macro-value">{meal.fat_g}g</div>
        </div>
      </div>

      <div className="meal-actions">
        <button
          className="swap-button"
          onClick={handleSwapMeal}
          disabled={loading}
        >
          {loading && <span className="swap-loading">⏳</span>}
          {loading ? 'Swapping...' : 'Swap Meal'}
        </button>
      </div>

      {error && <div className="swap-error">{error}</div>}
    </div>
  );
}
