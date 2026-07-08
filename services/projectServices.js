import api from "@/lib/axios";
import { PROJECTS } from '@/lib/mockData'

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

const fallbackProjects = PROJECTS.map((project) => ({
  ...project,
  _id: project.id,
}))

export const getProjects = async (page = 1, limit = 10, query = {}) => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return { projects: fallbackProjects.slice((page - 1) * limit, page * limit), total: fallbackProjects.length }
  }

  try {
    const queryString = buildQuery({ page, limit, ...query })
    const res = await api.get(`/projects${queryString}`)
    return res.data
  } catch (error) {
    console.warn('Projects API unavailable, using fallback data.', error)
    return { projects: fallbackProjects.slice((page - 1) * limit, page * limit), total: fallbackProjects.length }
  }
};

export const createProject = async (projectData) => {
  const res = await api.post("/projects", projectData);
  return res.data;
};

export const updateProject = async (id, projectData) => {
  const res = await api.put(`/projects/${id}`, projectData);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};