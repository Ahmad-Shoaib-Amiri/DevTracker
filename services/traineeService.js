import { getUsers } from './userService'

const normalizeList = (res) => {
  if (!res) return []
  if (Array.isArray(res)) return res
  return res.users || res.data || []
}

export const getTrainees = async () => {
  const res = await getUsers(1, 1000)
  const users = normalizeList(res)
  return users.filter((u) => u.role === 'trainee')
}

export default {
  getTrainees,
}
