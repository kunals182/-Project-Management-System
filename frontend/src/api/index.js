import axios from 'axios';

const api = axios.create({ baseURL: '/' });

export const getProjects = (page = 1, limit = 9) =>
  api.get('/projects', { params: { page, limit } }).then(r => r.data);

export const getProject = (id) =>
  api.get(`/projects/${id}`).then(r => r.data);

export const createProject = (payload) =>
  api.post('/projects', payload).then(r => r.data);

export const deleteProject = (id) =>
  api.delete(`/projects/${id}`).then(r => r.data);

export const getTasks = (projectId, params = {}) =>
  api.get(`/projects/${projectId}/tasks`, { params }).then(r => r.data);

export const createTask = (projectId, payload) =>
  api.post(`/projects/${projectId}/tasks`, payload).then(r => r.data);

export const updateTask = (id, payload) =>
  api.put(`/tasks/${id}`, payload).then(r => r.data);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`).then(r => r.data);
