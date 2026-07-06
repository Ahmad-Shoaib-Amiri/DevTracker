import api from '@/lib/axios'

export const getTeamProgress = async (page = 1, limit = 10) => {
  const res = await api.get(`/team-progress?page=${page}&limit=${limit}`)
  return res.data
}
