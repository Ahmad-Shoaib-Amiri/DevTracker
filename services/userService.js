import api from "@/lib/axios";

export const getUsers = async (page = 1, limit = 10) => {
  const res = await api.get(`/users?page=${page}&limit=${limit}`)
  return res.data
}
export const createUser = async (userData) => {
  const res = await api.post("/users", userData);
  return res.data;
};

export const updateUser = async (id, userData) => {
  const res = await api.put(`/users/${id}`, userData);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
