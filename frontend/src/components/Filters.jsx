import './Filters.css';

function Filters({ status, sort, order, onChange }) {
  function set(key, value) {
    onChange({ status, sort, order, [key]: value });
  }

  function toggleOrder() {
    onChange({ status, sort, order: order === 'asc' ? 'desc' : 'asc' });
  }

  return (
    <div className="filters-bar" role="search" aria-label="Filter and sort tasks">
      {/* Status filter */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          className="form-select filter-select"
          value={status}
          onChange={(e) => set('status', e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Sort field */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-sort">Sort by</label>
        <select
          id="filter-sort"
          className="form-select filter-select"
          value={sort}
          onChange={(e) => set('sort', e.target.value)}
        >
          <option value="created_at">Date created</option>
          <option value="due_date">Due date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Sort direction */}
      <button
        className={`sort-toggle ${order === 'asc' ? 'asc' : 'desc'}`}
        onClick={toggleOrder}
        title={`Currently: ${order === 'asc' ? 'Ascending' : 'Descending'}`}
        aria-label="Toggle sort direction"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {order === 'asc'
            ? <><path d="M12 20V4"/><polyline points="6 10 12 4 18 10"/></>
            : <><path d="M12 4v16"/><polyline points="18 14 12 20 6 14"/></>}
        </svg>
        {order === 'asc' ? 'Ascending' : 'Descending'}
      </button>
    </div>
  );
}

export default Filters;
