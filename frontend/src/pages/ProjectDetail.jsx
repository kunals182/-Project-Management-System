import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate }            from 'react-router-dom';
import TaskCard      from '../components/TaskCard';
import Filters       from '../components/Filters';
import Modal         from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { getProject, getTasks, createTask, updateTask, deleteTask } from '../api';
import { useToast } from '../components/Toast';
import './ProjectDetail.css';

const BLANK_TASK = { title: '', description: '', status: 'todo', priority: 'medium', due_date: '' };

function ProjectDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const toast    = useToast();

  const [project,     setProject]     = useState(null);
  const [tasks,       setTasks]       = useState([]);
  const [loading,     setLoading]     = useState(true);

  const [filters, setFilters] = useState({ status: '', sort: 'created_at', order: 'desc' });

  const [taskModal,   setTaskModal]   = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form,        setForm]        = useState(BLANK_TASK);
  const [formErrors,  setFormErrors]  = useState([]);
  const [saving,      setSaving]      = useState(false);

  const [toDelete,    setToDelete]    = useState(null);
  const [deleting,    setDeleting]    = useState(false);

  const loadProject = useCallback(async () => {
    try {
      const res = await getProject(id);
      setProject(res.data);
    } catch (err) {
      if (err.response?.status === 404) navigate('/');
      else toast.error('Could not load project.');
    }
  }, [id]);

  const loadTasks = useCallback(async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.sort)   params.sort   = filters.sort;
      if (filters.order)  params.order  = filters.order;
      const res = await getTasks(id, params);
      setTasks(res.data);
    } catch {
      toast.error('Could not load tasks.');
    }
  }, [id, filters]);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadProject(), loadTasks()]).finally(() => setLoading(false));
  }, [loadProject]);

  useEffect(() => {
    if (!loading) loadTasks();
  }, [filters]);

  function openCreate() {
    setEditingTask(null);
    setForm(BLANK_TASK);
    setFormErrors([]);
    setTaskModal(true);
  }

  function openEdit(task) {
    setEditingTask(task);
    setForm({
      title      : task.title,
      description: task.description || '',
      status     : task.status,
      priority   : task.priority,
      due_date   : task.due_date || '',
    });
    setFormErrors([]);
    setTaskModal(true);
  }

  async function handleSaveTask(e) {
    e.preventDefault();
    setFormErrors([]);

    if (!form.title.trim()) {
      setFormErrors(['Task title is required.']);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title      : form.title.trim(),
        description: form.description.trim() || null,
        status     : form.status,
        priority   : form.priority,
        due_date   : form.due_date || null,
      };

      if (editingTask) {
        await updateTask(editingTask.id, payload);
        toast.success('Task updated!');
      } else {
        await createTask(id, payload);
        toast.success('Task created!');
        loadProject();
      }

      setTaskModal(false);
      loadTasks();
    } catch (err) {
      const msgs = err.response?.data?.messages || [err.response?.data?.message || 'Something went wrong.'];
      setFormErrors(msgs);
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDeleteTask() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteTask(toDelete.id);
      toast.success('Task deleted.');
      setToDelete(null);
      loadTasks();
      loadProject();
    } catch {
      toast.error('Could not delete the task.');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div className="spinner-wrapper"><div className="spinner" /></div>;
  if (!project) return null;

  const tasksByStatus = {
    'todo'       : tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    'done'       : tasks.filter(t => t.status === 'done'),
  };

  return (
    <div className="project-detail">
      <div className="detail-header">
        <button className="back-btn btn-icon" onClick={() => navigate('/')} aria-label="Back to projects">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="detail-title-block">
          <h1 className="detail-title">{project.name}</h1>
          {project.description && (
            <p className="detail-desc">{project.description}</p>
          )}
        </div>
        <div className="detail-stats">
          <span className="stat-chip">{tasks.length} tasks</span>
        </div>
      </div>

      <div className="detail-toolbar">
        <Filters
          status={filters.status}
          sort={filters.sort}
          order={filters.order}
          onChange={setFilters}
        />
        <button id="btn-add-task" className="btn btn-primary add-task-btn" onClick={openCreate}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <h3>No tasks found</h3>
          <p>{filters.status ? 'Try clearing the status filter.' : 'Add your first task to get started.'}</p>
        </div>
      ) : filters.status ? (
        <div className="tasks-flat">
          {tasks.map(t => (
            <TaskCard key={t.id} task={t} onEdit={openEdit} onDelete={setToDelete} />
          ))}
        </div>
      ) : (
        <div className="tasks-columns">
          <TaskColumn title="To Do"       tasks={tasksByStatus['todo']}        onEdit={openEdit} onDelete={setToDelete} />
          <TaskColumn title="In Progress" tasks={tasksByStatus['in-progress']} onEdit={openEdit} onDelete={setToDelete} accent="blue" />
          <TaskColumn title="Done"        tasks={tasksByStatus['done']}        onEdit={openEdit} onDelete={setToDelete} accent="green" />
        </div>
      )}

      <Modal
        isOpen={taskModal}
        onClose={() => setTaskModal(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <form onSubmit={handleSaveTask} noValidate>
          <div className="modal-form-fields">
            <div className="form-group">
              <label className="form-label" htmlFor="task-title">Title *</label>
              <input
                id="task-title"
                className="form-input"
                placeholder="What needs to be done?"
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                autoFocus
                maxLength={200}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-desc">Description</label>
              <textarea
                id="task-desc"
                className="form-textarea"
                placeholder="Optional details…"
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  className="form-select"
                  value={form.priority}
                  onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-due">Due Date</label>
              <input
                id="task-due"
                type="date"
                className="form-input"
                value={form.due_date}
                onChange={(e) => setForm(f => ({ ...f, due_date: e.target.value }))}
              />
            </div>

            {formErrors.map((err, i) => (
              <p key={i} className="form-error">{err}</p>
            ))}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={() => setTaskModal(false)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" id="btn-save-task" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDeleteTask}
        title="Delete Task"
        message={`Delete "${toDelete?.title}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}

function TaskColumn({ title, tasks, onEdit, onDelete, accent }) {
  return (
    <div className={`task-column ${accent ? `col-${accent}` : ''}`}>
      <div className="col-header">
        <span className="col-title">{title}</span>
        <span className="col-count">{tasks.length}</span>
      </div>
      <div className="col-tasks">
        {tasks.length === 0
          ? <p className="col-empty">Nothing here</p>
          : tasks.map(t => <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} />)
        }
      </div>
    </div>
  );
}

export default ProjectDetail;
