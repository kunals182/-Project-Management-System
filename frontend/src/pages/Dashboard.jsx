import { useState, useEffect, useCallback } from 'react';
import ProjectCard    from '../components/ProjectCard';
import Pagination     from '../components/Pagination';
import Modal          from '../components/Modal';
import ConfirmDialog  from '../components/ConfirmDialog';
import { getProjects, createProject, deleteProject } from '../api';
import { useToast } from '../components/Toast';
import './Dashboard.css';

const LIMIT = 9;

function Dashboard() {
  const toast = useToast();

  const [projects,    setProjects]    = useState([]);
  const [pagination,  setPagination]  = useState({ page: 1, total: 0, totalPages: 1 });
  const [loading,     setLoading]     = useState(true);

  const [showCreate,  setShowCreate]  = useState(false);
  const [form,        setForm]        = useState({ name: '', description: '' });
  const [formErrors,  setFormErrors]  = useState([]);
  const [saving,      setSaving]      = useState(false);

  const [toDelete,    setToDelete]    = useState(null);
  const [deleting,    setDeleting]    = useState(false);

  const loadProjects = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getProjects(page, LIMIT);
      setProjects(res.data);
      setPagination({
        page   : res.pagination.page,
        total  : res.pagination.total,
        totalPages: res.pagination.totalPages,
      });
    } catch {
      toast.error('Failed to load projects. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProjects(1); }, [loadProjects]);

  async function handleCreate(e) {
    e.preventDefault();
    setFormErrors([]);

    if (!form.name.trim()) {
      setFormErrors(['Project name is required.']);
      return;
    }

    setSaving(true);
    try {
      await createProject({ name: form.name.trim(), description: form.description.trim() });
      toast.success('Project created!');
      setShowCreate(false);
      setForm({ name: '', description: '' });
      loadProjects(1);
    } catch (err) {
      const msgs = err.response?.data?.messages || [err.response?.data?.message || 'Something went wrong.'];
      setFormErrors(msgs);
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteProject(toDelete.id);
      toast.success('Project deleted.');
      setToDelete(null);
      loadProjects(pagination.page);
    } catch {
      toast.error('Could not delete the project. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Projects</h1>
          <p className="dashboard-subtitle">
            {pagination.total} {pagination.total === 1 ? 'project' : 'projects'} in total
          </p>
        </div>
        <button id="btn-new-project" className="btn btn-primary" onClick={() => { setShowCreate(true); setFormErrors([]); setForm({ name: '', description: '' }); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Project
        </button>
      </div>

      {loading ? (
        <div className="spinner-wrapper"><div className="spinner" /></div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <h3>No projects yet</h3>
          <p>Create your first project to start managing tasks and tracking progress.</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>Create a project</button>
        </div>
      ) : (
        <>
          <div className="projects-grid">
            {projects.map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                onDelete={setToDelete}
              />
            ))}
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => loadProjects(p)}
          />
        </>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Project">
        <form onSubmit={handleCreate} noValidate>
          <div className="modal-form-fields">
            <div className="form-group">
              <label className="form-label" htmlFor="proj-name">Project Name *</label>
              <input
                id="proj-name"
                className="form-input"
                placeholder="e.g. Website Redesign"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                autoFocus
                maxLength={150}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="proj-desc">Description</label>
              <textarea
                id="proj-desc"
                className="form-textarea"
                placeholder="What is this project about? (optional)"
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>
            {formErrors.map((e, i) => (
              <p key={i} className="form-error">{e}</p>
            ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" id="btn-save-project" className="btn btn-primary" disabled={saving}>
              {saving ? 'Creating…' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${toDelete?.name}"? This will permanently remove all tasks inside it.`}
        loading={deleting}
      />
    </div>
  );
}

export default Dashboard;
