import api from "@/lib/axios";

export const getProjects = async (page = 1, limit = 10) => {
  const res = await api.get(`/projects?page=${page}&limit=${limit}`);
  return res.data;
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