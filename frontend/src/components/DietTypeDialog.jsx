import '../styles/DietTypeDialog.css';

export default function DietTypeDialog({ onSelectDietType }) {
  return (
    <div className="diet-type-overlay">
      <div className="diet-type-dialog">
        <h2>Choose Your Diet Plan Type</h2>
        <p>Select the type of diet plan that suits you best</p>

        <div className="diet-options">
          <div
            className="diet-option"
            onClick={() => onSelectDietType('athlete')}
          >
            <div className="diet-icon">💪</div>
            <h3>Athlete / Bodybuilder</h3>
            <p>High protein, optimized for muscle building and athletic performance</p>
            <ul>
              <li>High protein intake (1.6-2.2g per kg)</li>
              <li>Calorie surplus or maintenance</li>
              <li>Optimized meal timing</li>
              <li>Performance-focused macros</li>
            </ul>
          </div>

          <div
            className="diet-option"
            onClick={() => onSelectDietType('normal')}
          >
            <div className="diet-icon">🥗</div>
            <h3>Normal Diet</h3>
            <p>Balanced nutrition for everyday health and wellness</p>
            <ul>
              <li>Balanced macronutrient ratio</li>
              <li>General health focus</li>
              <li>Weight management friendly</li>
              <li>Flexible meal options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
