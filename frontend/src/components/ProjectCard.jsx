import { useNavigate } from 'react-router-dom';
import './ProjectCard.css';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate();

  function handleDelete(e) {
    e.stopPropagation();
    onDelete(project);
  }

  return (
    <article
      className="project-card"
      onClick={() => navigate(`/projects/${project.id}`)}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/projects/${project.id}`)}
      aria-label={`Open project ${project.name}`}
    >
      <div className="project-card-header">
        <div className="project-card-icon" aria-hidden="true">
          {project.name.charAt(0).toUpperCase()}
        </div>
        <button
          className="btn-icon danger"
          onClick={handleDelete}
          title="Delete project"
          aria-label="Delete project"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>

      <div className="project-card-body">
        <h2 className="project-card-name">{project.name}</h2>
        {project.description && (
          <p className="project-card-desc">{project.description}</p>
        )}
      </div>

      <div className="project-card-footer">
        <span className="project-task-count">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          {project.task_count ?? 0} {project.task_count === 1 ? 'task' : 'tasks'}
        </span>
        <span className="project-date">{formatDate(project.created_at)}</span>
      </div>
    </article>
  );
}

export default ProjectCard;
