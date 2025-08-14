// This file is now unused. See App.js for the new main UI.
export default function Search({ onSearch }) {
  const [query, setQuery] = useState('');
  const [advanced, setAdvanced] = useState(false);
  const [authors, setAuthors] = useState('');
  const [journal, setJournal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, authors, journal });
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="Search for research papers..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button className="search-btn" type="submit">Search</button>
      <button type="button" className="search-btn" style={{background:'#f59e42',marginLeft:'1rem'}} onClick={()=>setAdvanced(a=>!a)}>
        {advanced ? 'Hide Filters' : 'Advanced'}
      </button>
      {advanced && (
        <div style={{marginTop:'1rem',display:'flex',gap:'1rem'}}>
          <input
            className="search-input"
            type="text"
            placeholder="Authors"
            value={authors}
            onChange={e => setAuthors(e.target.value)}
          />
          <input
            className="search-input"
            type="text"
            placeholder="Journal"
            value={journal}
            onChange={e => setJournal(e.target.value)}
          />
        </div>
      )}
    </form>
  );
}
