import api from "@/lib/axios";
import { TASKS } from '@/lib/mockData'

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

const fallbackTasks = TASKS.map((task) => ({
  ...task,
  _id: task.id,
}))

// Get all tasks (with pagination)
export const getTasks = async (page = 1, limit = 10, query = {}) => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return { tasks: fallbackTasks.slice((page - 1) * limit, page * limit), total: fallbackTasks.length }
  }

  try {
    const queryString = buildQuery({ page, limit, ...query })
    const res = await api.get(`/tasks${queryString}`)
    return res.data
  } catch (error) {
    console.warn('Tasks API unavailable, using fallback data.', error)
    return { tasks: fallbackTasks.slice((page - 1) * limit, page * limit), total: fallbackTasks.length }
  }
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