const express                = require('express');
const router                 = express.Router();
const db                     = require('../db/database');
const { validateTaskUpdate } = require('../middleware/validate');

router.put('/:id', validateTaskUpdate, async (req, res, next) => {
  try {
    await db.getDb();
    const { id } = req.params;

    const existing = db.queryOne('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Not Found', message: `Task with id ${id} does not exist.` });
    }

    const { title, description, status, priority, due_date } = req.body;

    const next_title       = title       !== undefined ? title.trim()       : existing.title;
    const next_description = description !== undefined ? (description ? description.trim() : null) : existing.description;
    const next_status      = status      !== undefined ? status             : existing.status;
    const next_priority    = priority    !== undefined ? priority           : existing.priority;
    const next_due_date    = due_date    !== undefined ? (due_date || null) : existing.due_date;

    db.run(
      `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ? WHERE id = ?`,
      [next_title, next_description, next_status, next_priority, next_due_date, id]
    );

    const updated = db.queryOne('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await db.getDb();
    const { id } = req.params;

    const task = db.queryOne('SELECT id FROM tasks WHERE id = ?', [id]);
    if (!task) {
      return res.status(404).json({ error: 'Not Found', message: `Task with id ${id} does not exist.` });
    }

    db.run('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ success: true, message: 'Task deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
