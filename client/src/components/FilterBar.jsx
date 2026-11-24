const GENRES = [
  'fiction',
  'non-fiction',
  'science',
  'history',
  'fantasy',
  'other',
];

export default function FilterBar({ filters, onChange, onReset }) {
  return (
    <section className="panel filter-panel">
      <h2>Search, Filter &amp; Sort</h2>
      <div className="filter-grid">
        <label className="field">
          <span>Search (Title or Author)</span>
          <input
            type="text"
            name="q"
            value={filters.q}
            onChange={(e) => onChange('q', e.target.value)}
            placeholder="Search books..."
          />
        </label>

        <label className="field">
          <span>Genre</span>
          <select
            name="genre"
            value={filters.genre}
            onChange={(e) => onChange('genre', e.target.value)}
          >
            <option value="">All genres</option>
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Read Status</span>
          <select
            name="read"
            value={filters.read}
            onChange={(e) => onChange('read', e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Read</option>
            <option value="false">Unread</option>
          </select>
        </label>

        <label className="field">
          <span>Sort By</span>
          <select
            name="sort"
            value={filters.sort}
            onChange={(e) => onChange('sort', e.target.value)}
          >
            <option value="">Default (ID)</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="year">Year</option>
            <option value="rating">Rating</option>
          </select>
        </label>

        <label className="field">
          <span>Order</span>
          <select
            name="order"
            value={filters.order}
            onChange={(e) => onChange('order', e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>

        <div className="filter-actions">
          <button type="button" onClick={onReset}>
            Reset Filters
          </button>
        </div>
      </div>
    </section>
  );
}
