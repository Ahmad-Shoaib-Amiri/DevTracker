import api from "@/lib/axios";

// Get all tasks (with pagination)
export const getTasks = async (page = 1, limit = 10) => {
  const res = await api.get(`/tasks?page=${page}&limit=${limit}`);
  return res.data;
};

// Get single task
export const getTaskById = async (id) => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

// Create task
export const createTask = async (taskData) => {
  const res = await api.post("/tasks", taskData);
  return res.data;
};

// Update task
export const updateTask = async (id, taskData) => {
  const res = await api.put(`/tasks/${id}`, taskData);
  return res.data;
};

// Delete task
export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};