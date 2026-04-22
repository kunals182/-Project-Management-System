import './TaskCard.css';

const STATUS_MAP = {
  'todo'        : { label: 'To Do',       cls: 'badge-todo' },
  'in-progress' : { label: 'In Progress', cls: 'badge-progress' },
  'done'        : { label: 'Done',        cls: 'badge-done' },
};

const PRIORITY_MAP = {
  low    : { label: 'Low',    cls: 'badge-low' },
  medium : { label: 'Medium', cls: 'badge-medium' },
  high   : { label: 'High',   cls: 'badge-high' },
};

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const d    = new Date(dateStr + 'T00:00:00');
  const now  = new Date();
  const diff = Math.ceil((d - now) / 86400000);

  const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (diff < 0)  return { text: formatted, overdue: true };
  if (diff === 0) return { text: 'Due today', urgent: true };
  if (diff <= 3)  return { text: formatted, urgent: true };
  return { text: formatted };
}

function TaskCard({ task, onEdit, onDelete }) {
  const status   = STATUS_MAP[task.status]   || STATUS_MAP.todo;
  const priority = PRIORITY_MAP[task.priority] || PRIORITY_MAP.medium;
  const due      = formatDueDate(task.due_date);

  return (
    <article className={`task-card ${task.status === 'done' ? 'task-done' : ''}`}>
      <div className="task-card-top">
        <div className="task-badges">
          <span className={`badge ${status.cls}`}>{status.label}</span>
          <span className={`badge ${priority.cls}`}>{priority.label}</span>
        </div>
        <div className="task-actions">
          <button
            className="btn-icon"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label="Edit task"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="btn-icon danger"
            onClick={() => onDelete(task)}
            title="Delete task"
            aria-label="Delete task"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-desc">{task.description}</p>}

      {due && (
        <div className={`task-due ${due.overdue ? 'overdue' : ''} ${due.urgent ? 'urgent' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {due.overdue ? 'Overdue · ' : ''}{due.text}
        </div>
      )}
    </article>
  );
}

export default TaskCard;
