import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Generator from './components/Generator';
import MealPlan from './components/MealPlan';
import './App.css';

function App() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [planId, setPlanId] = useState(null);

  return (
    <div className="app">
      <Header />
      {!currentPlan ? (
        <>
          <Hero />
          <Generator onPlanGenerated={(plan, id) => {
            setCurrentPlan(plan);
            setPlanId(id);
          }} />
        </>
      ) : (
        <MealPlan 
          plan={currentPlan} 
          planId={planId}
          onBack={() => {
            setCurrentPlan(null);
            setPlanId(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
