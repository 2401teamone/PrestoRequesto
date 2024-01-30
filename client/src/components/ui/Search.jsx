

export default function Search({ term, handleSearch }) {

  return (
    <div className="search">
      <i className="search-icon fa-light fa-magnifying-glass"></i>
      <input 
        className="search-input"
        value={term}
        onChange={e => handleSearch(e.target.value)}
      />
    </div>
  )
}