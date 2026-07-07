import api from "@/lib/axios";

const buildQuery = (params) => {
  const searchParams = new URLSearchParams()
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

// Get all tasks (with pagination)
export const getTasks = async (page = 1, limit = 10, query = {}) => {
  const queryString = buildQuery({ page, limit, ...query })
  const res = await api.get(`/tasks${queryString}`)
  return res.data
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