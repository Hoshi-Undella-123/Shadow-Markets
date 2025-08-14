// This file is now unused. See App.js for the new main UI.
export default function Results({ results, loading, error }) {
  if (loading) return <div className="results-loading">Loading...</div>;
  if (error) return <div className="results-error">{error}</div>;
  if (!results || results.length === 0) return <div className="results-empty">No results found.</div>;

  return (
    <div className="results-list">
      {results.map((item, idx) => (
        <div className="results-card" key={idx}>
          <h3>{item.title || item.name || item.ticker}</h3>
          <p>{item.authors && <b>Authors:</b>} {item.authors}</p>
          <p>{item.journal && <b>Journal:</b>} {item.journal}</p>
          <p>{item.description || item.summary || item.abstract || 'No description available.'}</p>
          {item.impact_score && <p><b>Impact Score:</b> {item.impact_score}</p>}
          {item.barrier_score && <p><b>Barrier Score:</b> {item.barrier_score}</p>}
        </div>
      ))}
    </div>
  );
}
