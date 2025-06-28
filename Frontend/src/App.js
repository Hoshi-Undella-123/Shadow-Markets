import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [equities, setEquities] = useState([]);
  const [shadowPrices, setShadowPrices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8001/api/equities/')
      .then(res => setEquities(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:8001/api/shadow-prices/')
      .then(res => setShadowPrices(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Equities</h1>
      <pre>{JSON.stringify(equities, null, 2)}</pre>
      <h1>Shadow Prices</h1>
      <pre>{JSON.stringify(shadowPrices, null, 2)}</pre>
    </div>
  );
}

export default App;
