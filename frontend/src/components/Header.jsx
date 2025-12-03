import '../styles/Header.css';

export default function Header({ onLogout }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-icon">FG</span>
          <span className="logo-text">FoodGene</span>
        </div>
        
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#generator">Generator</a>
          <a href="#about">About</a>
        </nav>
        
        {onLogout && (
          <button className="login-btn" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
