import { getProjects } from './projectServices'
import { getTasks } from './taskServices'
import { getUsers } from './userService'

const normalizeList = (res) => {
  if (!res) return []
  if (Array.isArray(res)) return res
  return res.projects || res.data || []
}

export const getDeveloperProjects = async (developerId) => {
  const res = await getProjects(1, 1000)
  const projects = normalizeList(res)
  return projects.filter((p) => (p.developers || []).includes(developerId))
}

export const getDeveloperTasks = async (developerId) => {
  const res = await getTasks(1, 1000)
  const tasks = normalizeList(res)
  return tasks.filter((t) => t.assignee === developerId || t.assignee === (developerId + ''))
}

export const getDeveloperTrainees = async (developerId) => {
  const res = await getUsers(1, 1000)
  const users = normalizeList(res)
  return users.filter((u) => u.role === 'trainee' && (u.assignedDeveloper === developerId || u.assignedDeveloper === (developerId + '')))
}

export default {
  getDeveloperProjects,
  getDeveloperTasks,
  getDeveloperTrainees,
}
