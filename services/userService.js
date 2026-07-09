import api from "@/lib/axios";
import { USERS } from '@/lib/mockData'

const fallbackUsers = USERS.map((user) => ({
  ...user,
  _id: user.id,
}))

export const getUsers = async (page = 1, limit = 10) => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return { users: fallbackUsers.slice((page - 1) * limit, page * limit), total: fallbackUsers.length }
  }

  try {
    const res = await api.get(`/users?page=${page}&limit=${limit}`)
    return res.data
  } catch (error) {
    console.warn('Users API unavailable, using fallback data.', error)
    return { users: fallbackUsers.slice((page - 1) * limit, page * limit), total: fallbackUsers.length }
  }
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


