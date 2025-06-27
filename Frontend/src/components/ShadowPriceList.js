function ShadowPriceList({ shadowPrices }) {
  return (
    <div>
      <h2>Shadow Prices</h2>
      {shadowPrices.map(price => (
        <div key={price.id}>
          <p>Equity: {price.equity_id}, Price: {price.price}, Date: {price.date}</p>
        </div>
      ))}
    </div>
  );
}

export default ShadowPriceList;
