import React, { useState, useEffect } from 'react';
import ShadowPriceList from './components/ShadowPriceList';
import ConstraintList from './components/ConstraintList';

function App() {
  const [shadowPrices, setShadowPrices] = useState([]);
  const [constraints, setConstraints] = useState([]);
  const [selectedConstraints, setSelectedConstraints] = useState([]);

  useEffect(() => {
    // Fetch shadow prices
    fetch('/api/shadow-prices/')
      .then(response => response.json())
      .then(data => setShadowPrices(data));

    // Fetch constraints
    fetch('/api/constraints/')
      .then(response => response.json())
      .then(data => setConstraints(data));
  }, []);

  // Filter shadow prices by selected constraints
  const filteredPrices = shadowPrices.filter(price =>
    selectedConstraints.length === 0 ||
    selectedConstraints.includes(price.constraint_id)
  );

  return (
    <div>
      <h1>Shadow Markets Dashboard</h1>
      <ConstraintList
        constraints={constraints}
        selectedConstraints={selectedConstraints}
        onSelect={setSelectedConstraints}
      />
      <ShadowPriceList shadowPrices={filteredPrices} />
    </div>
  );
}

export default App;
