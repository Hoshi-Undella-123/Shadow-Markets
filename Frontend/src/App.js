import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [equities, setEquities] = useState([]);
  const [shadowPrices, setShadowPrices] = useState([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [newExchange, setNewExchange] = useState('');

  // Fetch equities and shadow prices
  useEffect(() => {
    axios.get('http://localhost:8001/api/equities/'
      .then(res => setEquities(res.data))
      .catch(err => console.error(err)));

    axios.get('http://localhost:8001/api/shadow-prices/')
      .then(res => setShadowPrices(res.data))
      .catch(err => console.error(err));
  }, []);

  // Add a new equity
  const handleAddEquity = (e) => {
  e.preventDefault();
  axios.post('http://localhost:8001/api/equities/', {
    symbol: newSymbol,
    exchange: newExchange
  })
  .then(res => {
    setEquities([...equities, res.data]);
    setNewSymbol('');
    setNewExchange('');
  })
  .catch(err => {
    if (err.response) {
      alert('Error adding equity: ' + JSON.stringify(err.response.data));
    } else if (err.request) {
      alert('No response from backend. Check if Django is running.');
    } else {
      alert('Error adding equity: ' + err.message);
    }
    console.error(err);
  });
};

  return (
    <div style={{ padding: '20px' }}>
      <h1>Equities</h1>
      <form onSubmit={handleAddEquity}>
        <input
          type="text"
          placeholder="Symbol"
          value={newSymbol}
          onChange={e => setNewSymbol(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Exchange"
          value={newExchange}
          onChange={e => setNewExchange(e.target.value)}
          required
        />
        <button type="submit">Add Equity</button>
      </form>
      <ul>
        {equities.map(eq => (
          <li key={eq.id}>{eq.symbol} ({eq.exchange})</li>
        ))}
      </ul>

      <h2>Shadow Prices</h2>
      <ul>
        {shadowPrices.map(sp => (
          <li key={sp.id}>
            {sp.equity} on {sp.date}: ${sp.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

