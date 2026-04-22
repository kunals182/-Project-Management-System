const express = require('express');
const cors    = require('cors');

const projectRoutes  = require('./routes/projects');
const taskRoutes     = require('./routes/tasks');
const errorHandler   = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/projects', projectRoutes);

app.use('/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.method} ${req.path} not found.` });
});

app.use(errorHandler);

module.exports = app;
