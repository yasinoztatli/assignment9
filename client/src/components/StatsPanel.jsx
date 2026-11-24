export default function StatsPanel({ stats, loading, error }) {
  if (loading && !stats) {
    return (
      <section className="panel stats-panel">
        <h2>Statistics</h2>
        <p>Loading statistics...</p>
      </section>
    );
  }

  if (error && !stats) {
    return (
      <section className="panel stats-panel">
        <h2>Statistics</h2>
        <p className="error-text">{error}</p>
      </section>
    );
  }

  if (!stats) {
    return null;
  }

  const genreEntries = Object.entries(stats.byGenre || {});

  return (
    <section className="panel stats-panel">
      <h2>Statistics</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Total</span>
          <strong className="stat-value">{stats.total}</strong>
        </div>
        <div className="stat-item">
          <span className="stat-label">Read</span>
          <strong className="stat-value">{stats.read}</strong>
        </div>
        <div className="stat-item">
          <span className="stat-label">Unread</span>
          <strong className="stat-value">{stats.unread}</strong>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average Rating</span>
          <strong className="stat-value">
            {stats.averageRating === null ? '—' : stats.averageRating}
          </strong>
        </div>
      </div>

      <div className="stats-genres">
        <span className="stat-label">By Genre:</span>
        {genreEntries.length === 0 ? (
          <span> No books yet</span>
        ) : (
          <ul className="genre-list">
            {genreEntries.map(([genre, count]) => (
              <li key={genre}>
                {genre}: {count}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}