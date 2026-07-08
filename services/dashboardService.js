import api from "@/lib/axios";
import { PROJECTS, TASKS, USERS, ACTIVITY_LOG } from '@/lib/mockData'

const hasApiConfig = () => Boolean(process.env.NEXT_PUBLIC_API_URL)

const toDashboardTask = (task) => ({
  ...task,
  _id: task._id || task.id,
  project: task.project && typeof task.project === 'object'
    ? task.project
    : task.project
      ? { name: PROJECTS.find((p) => p.id === task.project || p._id === task.project)?.name || 'Unknown Project' }
      : null,
  assignedUser: task.assignedUser && typeof task.assignedUser === 'object'
    ? task.assignedUser
    : task.assignee
      ? { name: USERS.find((u) => u.id === task.assignee || u._id === task.assignee)?.name || 'Unassigned' }
      : null,
})

const toDashboardProject = (project) => ({
  ...project,
  _id: project._id || project.id,
  assignedDeveloper: project.assignedDeveloper || (project.developers?.[0]
    ? USERS.find((u) => u.id === project.developers[0] || u._id === project.developers[0])
    : null),
})

export const getDashboardStats = async () => {
  if (!hasApiConfig()) {
    return {
      developers: 2,
      trainees: 3,
      projects: PROJECTS.length,
      totalTasks: TASKS.length,
      completedProjects: 1,
      pendingTasks: TASKS.filter((task) => task.status === 'Pending').length,
    }
  }

  try {
    const response = await api.get('/dashboard/stats')
    return response.data
  } catch (error) {
    console.warn('Dashboard stats API unavailable, using fallback data.', error)
    return {
      developers: 2,
      trainees: 3,
      projects: PROJECTS.length,
      totalTasks: TASKS.length,
      completedProjects: 1,
      pendingTasks: TASKS.filter((task) => task.status === 'Pending').length,
    }
  }
}

export const getDashboardLists = async () => {
  if (!hasApiConfig()) {
    const fallbackProjects = PROJECTS.slice(0, 4).map(toDashboardProject)
    const fallbackTasks = TASKS.slice(0, 5).map(toDashboardTask)
    const fallbackActivities = ACTIVITY_LOG.slice(0, 4).map((log) => ({
      ...log,
      _id: log.id,
      createdAt: log.timestamp,
      message: `${log.action} ${log.item}`,
    }))

    return {
      recentProjects: fallbackProjects,
      recentTasks: fallbackTasks,
      recentActivities: fallbackActivities,
    }
  }

  try {
    const response = await api.get('/dashboard/lists')
    return response.data
  } catch (error) {
    console.warn('Dashboard lists API unavailable, using fallback data.', error)
    const fallbackProjects = PROJECTS.slice(0, 4).map(toDashboardProject)
    const fallbackTasks = TASKS.slice(0, 5).map(toDashboardTask)
    const fallbackActivities = ACTIVITY_LOG.slice(0, 4).map((log) => ({
      ...log,
      _id: log.id,
      createdAt: log.timestamp,
      message: `${log.action} ${log.item}`,
    }))

    return {
      recentProjects: fallbackProjects,
      recentTasks: fallbackTasks,
      recentActivities: fallbackActivities,
    }
  }
};