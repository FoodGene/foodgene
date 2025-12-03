import '../styles/Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Personalized diet plans — fast, local-ready.</h1>
        <p>Get a 7-day meal plan, consolidated grocery list, and live macro breakdown that matches your goal.</p>
        
        <div className="hero-features">
          <div className="feature">
            <h3>Calorie & macro calculation</h3>
            <p>Customize TDEE + goal-aware macros</p>
          </div>
          <div className="feature">
            <h3>Swap & regenerate</h3>
            <p>Easily change meals (future works)</p>
          </div>
          <div className="feature">
            <h3>Reminders</h3>
            <p>Schedule reminders via SMS/email (future)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
