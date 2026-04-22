const express         = require('express');
const router          = express.Router();
const db              = require('../db/database');
const { validateProject, validateTask } = require('../middleware/validate');

router.post('/', validateProject, async (req, res, next) => {
  try {
    await db.getDb();
    const { name, description } = req.body;

    const info = db.run(
      'INSERT INTO projects (name, description) VALUES (?, ?)',
      [name.trim(), description ? description.trim() : null]
    );

    const project = db.queryOne('SELECT * FROM projects WHERE id = ?', [info.lastInsertRowid]);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    await db.getDb();

    let page  = Math.max(1, parseInt(req.query.page)  || 1);
    let limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const totalRow = db.queryOne('SELECT COUNT(*) AS count FROM projects');
    const total    = totalRow ? totalRow.count : 0;

    const projects = db.queryAll(
      `SELECT p.id, p.name, p.description, p.created_at,
              (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) AS task_count
       FROM   projects p
       ORDER  BY p.created_at DESC
       LIMIT  ? OFFSET ?`,
      [limit, offset]
    );

    res.json({
      success: true,
      data: projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await db.getDb();
    const { id } = req.params;

    const project = db.queryOne(
      `SELECT p.id, p.name, p.description, p.created_at,
              (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) AS task_count
       FROM   projects p WHERE p.id = ?`,
      [id]
    );

    if (!project) {
      return res.status(404).json({ error: 'Not Found', message: `Project with id ${id} does not exist.` });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await db.getDb();
    const { id } = req.params;

    const project = db.queryOne('SELECT id FROM projects WHERE id = ?', [id]);
    if (!project) {
      return res.status(404).json({ error: 'Not Found', message: `Project with id ${id} does not exist.` });
    }

    db.run('DELETE FROM tasks   WHERE project_id = ?', [id]);
    db.run('DELETE FROM projects WHERE id = ?',        [id]);

    res.json({ success: true, message: 'Project and all its tasks have been deleted.' });
  } catch (err) {
    next(err);
  }
});

router.post('/:project_id/tasks', validateTask, async (req, res, next) => {
  try {
    await db.getDb();
    const { project_id } = req.params;
    const { title, description, status, priority, due_date } = req.body;

    const project = db.queryOne('SELECT id FROM projects WHERE id = ?', [project_id]);
    if (!project) {
      return res.status(404).json({ error: 'Not Found', message: `Project with id ${project_id} does not exist.` });
    }

    const info = db.run(
      `INSERT INTO tasks (project_id, title, description, status, priority, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [project_id, title.trim(), description ? description.trim() : null, status || 'todo', priority || 'medium', due_date || null]
    );

    const task = db.queryOne('SELECT * FROM tasks WHERE id = ?', [info.lastInsertRowid]);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

router.get('/:project_id/tasks', async (req, res, next) => {
  try {
    await db.getDb();
    const { project_id } = req.params;
    const { status, sort, order } = req.query;

    const project = db.queryOne('SELECT id FROM projects WHERE id = ?', [project_id]);
    if (!project) {
      return res.status(404).json({ error: 'Not Found', message: `Project with id ${project_id} does not exist.` });
    }

    const VALID_SORTS    = ['due_date', 'created_at', 'priority', 'title'];
    const VALID_STATUSES = ['todo', 'in-progress', 'done'];

    let query  = 'SELECT * FROM tasks WHERE project_id = ?';
    const params = [project_id];

    if (status && VALID_STATUSES.includes(status)) {
      query += ' AND status = ?';
      params.push(status);
    }

    const sortField = VALID_SORTS.includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const tasks = db.queryAll(query, params);
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
