const VALID_STATUSES   = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

function validateProject(req, res, next) {
  const { name } = req.body;
  const errors   = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Project name is required.');
  } else if (name.trim().length > 150) {
    errors.push('Project name must not exceed 150 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation Error', messages: errors });
  }

  next();
}

function validateTask(req, res, next) {
  const { title, status, priority, due_date } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Task title is required.');
  } else if (title.trim().length > 200) {
    errors.push('Task title must not exceed 200 characters.');
  }

  if (status && !VALID_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  if (due_date && isNaN(Date.parse(due_date))) {
    errors.push('due_date must be a valid date string (e.g. 2025-12-31).');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation Error', messages: errors });
  }

  next();
}

function validateTaskUpdate(req, res, next) {
  const { title, status, priority, due_date } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Task title must be a non-empty string.');
    } else if (title.trim().length > 200) {
      errors.push('Task title must not exceed 200 characters.');
    }
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  if (due_date !== undefined && due_date !== null && due_date !== '' && isNaN(Date.parse(due_date))) {
    errors.push('due_date must be a valid date string (e.g. 2025-12-31).');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation Error', messages: errors });
  }

  next();
}

module.exports = { validateProject, validateTask, validateTaskUpdate };
