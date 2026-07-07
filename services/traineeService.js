import { getUsers } from './userService'

const normalizeList = (res) => {
  if (!res) return []
  if (Array.isArray(res)) return res
  return res.users || res.data || []
}

export const getTrainees = async () => {
  try {
    const res = await getUsers(1, 1000)
    const users = normalizeList(res)
    return users.filter((u) => u.role === 'trainee')
  } catch (err) {
    if (err.response?.status === 403) {
      console.warn('Developer is not authorized to fetch all trainees; returning no trainees.', err)
      return []
    }
    throw err
  }
}

export default {
  getTrainees,
}
