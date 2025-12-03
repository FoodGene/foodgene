import { useState, useEffect } from 'react';
import '../styles/Controls.css';

/**
 * Controls Component
 * Contains calorie slider, generate button, PDF export, email input, and theme toggle
 * 
 * Props:
 *   calories: number - Current calorie value
 *   onCalorieChange: function(value) - Callback when slider changes
 *   onGeneratePlan: function(calories, profile) - Callback to generate plan
 *   onExportPDF: function() - Callback to export as PDF
 *   hasPlan: boolean - Whether a plan has been generated
 *   loading: boolean - Whether currently loading
 *   profile: object - {diet_pref, allergies}
 *   onProfileChange: function(profile) - Callback when profile changes
 */
export default function Controls({
  calories,
  onCalorieChange,
  onGeneratePlan,
  onExportPDF,
  hasPlan,
  loading,
  profile,
  onProfileChange
}) {
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [planId, setPlanId] = useState(localStorage.getItem('planId') || null);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailPlan = async () => {
    if (!validateEmail(email)) {
      setEmailFeedback({ type: 'error', text: 'Please enter a valid email' });
      return;
    }

    if (!planId) {
      setEmailFeedback({ type: 'error', text: 'No plan to email' });
      return;
    }

    setEmailLoading(true);
    setEmailFeedback(null);
    try {
      const response = await fetch('/api/email-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan_id: planId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to send email');
      }

      setEmailFeedback({ type: 'success', text: 'Plan emailed successfully!' });
      setEmail('');
    } catch (err) {
      setEmailFeedback({ type: 'error', text: err.message });
      console.error('Email plan error:', err);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    const macros = {
      protein_g: Math.round((calories * 0.3) / 4),
      carbs_g: Math.round((calories * 0.5) / 4),
      fat_g: Math.round((calories * 0.2) / 9)
    };

    try {
      const newPlanId = await onGeneratePlan(calories, macros, profile);
      if (newPlanId) {
        setPlanId(newPlanId);
        localStorage.setItem('planId', newPlanId);
      }
    } catch (err) {
      console.error('Generate plan error:', err);
    }
  };

  return (
    <div className="controls no-print">
      <div className="controls-title">Plan Controls</div>

      <div className="controls-grid">
        {/* Calorie Slider */}
        <div className="control-group">
          <label className="control-label">Daily Calories</label>
          <div className="calorie-input">
            <input
              type="range"
              min="1200"
              max="3500"
              value={calories}
              onChange={(e) => onCalorieChange(parseInt(e.target.value))}
              disabled={loading}
            />
            <div className="calorie-display">{calories}</div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="control-group">
          <label className="control-label">Generate Plan</label>
          <button
            className="action-button btn-generate"
            onClick={handleGeneratePlan}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {/* Export PDF Button */}
        <div className="control-group">
          <label className="control-label">Export</label>
          <button
            className="action-button btn-export"
            onClick={onExportPDF}
            disabled={!hasPlan || loading}
          >
            Export as PDF
          </button>
        </div>

        {/* Email Section */}
        <div className="control-group">
          <label className="control-label">Email Plan</label>
          <div className="email-group">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={emailLoading || !hasPlan}
            />
            <button
              className="email-button"
              onClick={handleEmailPlan}
              disabled={emailLoading || !hasPlan}
            >
              {emailLoading ? '⏳' : 'Send'}
            </button>
          </div>
          {emailFeedback && (
            <div className={`form-feedback ${emailFeedback.type}`}>
              {emailFeedback.text}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="control-group">
          <label className="control-label">Theme</label>
          <div className="theme-toggle">
            <span className="theme-label">{theme === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
            <div
              className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
              onClick={toggleTheme}
            >
              <div className="toggle-slider"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
