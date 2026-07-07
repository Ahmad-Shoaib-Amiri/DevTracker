import api from '@/lib/axios'
import { getProjects } from './projectServices'
import { getTasks } from './taskServices'

const normalizeList = (res) => {
  if (!res) return []
  if (Array.isArray(res)) return res
  return res.tasks || res.projects || res.data?.tasks || res.data?.projects || res.data || []
}

const normalizeId = (value) => {
  if (value == null) return null
  return value.toString()
}

const getPotentialIds = (entity) => {
  if (entity == null) return []
  if (typeof entity === 'string' || typeof entity === 'number') return [entity.toString()]
  const ids = []
  if (entity._id) ids.push(entity._id)
  if (entity.id) ids.push(entity.id)
  if (entity.userId) ids.push(entity.userId)
  if (entity.developerId) ids.push(entity.developerId)
  if (entity.user?.id) ids.push(entity.user.id)
  if (entity.user?._id) ids.push(entity.user._id)
  if (entity.developer?.id) ids.push(entity.developer.id)
  if (entity.developer?._id) ids.push(entity.developer._id)
  return ids.map(normalizeId).filter(Boolean)
}

const matchesDeveloperInProject = (project, developerId) => {
  const normalizedId = normalizeId(developerId)

  if (Array.isArray(project?.developers)) {
    return project.developers.some((dev) => normalizeId(dev) === normalizedId)
  }

  const assigned = project?.assignedDeveloper
  return getPotentialIds(assigned).includes(normalizedId)
}

const matchesDeveloperInTask = (task, developerId) => {
  const normalizedId = normalizeId(developerId)
  const assignee = task?.assignee || task?.assignedUser
  return getPotentialIds(assignee).includes(normalizedId)
}

export const getDeveloperProjects = async (developerId) => {
  const res = await getProjects(1, 1000, { assignedDeveloper: developerId })
  const projects = normalizeList(res)
  return projects
}

export const getDeveloperTasks = async (developerId) => {
  const res = await getTasks(1, 1000, { assignedUser: developerId })
  const tasks = normalizeList(res)
  return tasks
}

export const getDeveloperTrainees = async (developerId) => {
  // use developer-specific endpoint
  try {
    const res = await api.get('/developer/my-trainees')
    return res.data || []
  } catch (err) {
    console.warn('Failed to fetch developer trainees', err)
    return []
  }
}

export const getAvailableTrainees = async () => {
  try {
    const res = await api.get('/developer/available-trainees')
    return res.data || []
  } catch (err) {
    console.warn('Failed to fetch available trainees', err)
    return []
  }
}

export const assignTraineeToMe = async (traineeId) => {
  try {
    const res = await api.post('/developer/assign-trainee', { traineeId })
    return res.data
  } catch (err) {
    console.error('Failed to assign trainee', err)
    throw err
  }
}

export default {
  getDeveloperProjects,
  getDeveloperTasks,
  getDeveloperTrainees,
  getAvailableTrainees,
  assignTraineeToMe,
}
