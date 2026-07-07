'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityBadge } from '@/components/common/PriorityBadge'
import { useAuth } from '@/context/AuthContext'
import { createTask, updateTask } from '@/services/taskServices'
import developerService from '@/services/developerService'

export default function DeveloperTasksPage() {
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState('all')
  const [myTasks, setMyTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    project: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState(null)

  const fetchData = async () => {
    if (!user) return

    try {
      const [tasks, assignedProjects] = await Promise.all([
        developerService.getDeveloperTasks(user._id || user.id),
        developerService.getDeveloperProjects(user._id || user.id),
      ])

      setMyTasks(tasks || [])
      setProjects(assignedProjects || [])
    } catch (err) {
      console.error('Failed to load developer tasks', err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      project: '',
      priority: 'Medium',
      status: 'Pending',
      dueDate: '',
    })
    setUpdatingTaskId(null)
  }

  const handleCreateTask = async (event) => {
    event.preventDefault()
    if (!user) return
    setSubmitLoading(true)

    try {
      const payload = {
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        status: taskForm.status,
        dueDate: taskForm.dueDate,
        project: taskForm.project,
        assignedUser: user._id || user.id,
      }

      await createTask(payload)
      await fetchData()
      resetTaskForm()
      setShowModal(false)
    } catch (err) {
      console.error('Failed to create task', err)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleTaskProgress = async (task, newStatus) => {
    if (!task) return
    setUpdatingTaskId(task._id || task.id)

    try {
      const payload = {
        ...task,
        status: newStatus,
      }
      await updateTask(task._id || task.id, payload)
      await fetchData()
    } catch (err) {
      console.error('Failed to update task status', err)
    } finally {
      setUpdatingTaskId(null)
    }
  }

  const filteredTasks = myTasks.filter(task => {
    return statusFilter === 'all' || task.status === statusFilter
  })

  const stats = {
    total: myTasks.length,
    pending: myTasks.filter(t => t.status === 'Pending').length,
    inProgress: myTasks.filter(t => t.status === 'In Progress').length,
    completed: myTasks.filter(t => t.status === 'Completed').length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
          <p className="mt-1 text-muted-foreground">Manage your assigned tasks</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="mt-2 text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="mt-2 text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
        </div>

        {/* Filter & action */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Tasks</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Add Task to My Project
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const project = projects.find(p => (p._id || p.id) === (task.project || task.projectId))
            const isUpdating = updatingTaskId === (task._id || task.id)

            return (
              <div key={task._id || task.id} className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{task.title}</h3>
                      <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{task.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{task.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <PriorityBadge priority={task.priority} />
                      {project && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {project.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 text-xs text-muted-foreground md:items-end">
                    <span className="font-medium">Due: {task.dueDate || 'No due date'}</span>
                    <div className="flex flex-wrap gap-2">
                      {task.status === 'Pending' && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleTaskProgress(task, 'In Progress')}
                          className="rounded-lg bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isUpdating ? 'Updating...' : 'Mark 50%'}
                        </button>
                      )}
                      {task.status !== 'Completed' && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleTaskProgress(task, 'Completed')}
                          className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isUpdating ? 'Updating...' : 'Mark 100%'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-lg bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Create Task for My Project</h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetTaskForm()
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Task title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Task details"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Project</label>
                  <select
                    value={taskForm.project}
                    onChange={(e) => setTaskForm({ ...taskForm, project: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  >
                    <option value="">Select a project assigned to you</option>
                    {projects.map((project) => (
                      <option key={project._id || project.id} value={project._id || project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetTaskForm()
                    }}
                    className="w-full rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading || projects.length === 0}
                    className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitLoading ? 'Saving...' : 'Create Task'}
                  </button>
                </div>

                {projects.length === 0 && (
                  <p className="text-sm text-red-600">You currently have no assigned projects. Ask the admin to assign you to a project before creating tasks.</p>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
