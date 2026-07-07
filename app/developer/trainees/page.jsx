'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { useAuth } from '@/context/AuthContext'
import developerService from '@/services/developerService'
import traineeService from '@/services/traineeService'
import { createTask } from '@/services/taskServices'

export default function TraineesPage() {
  const { user } = useAuth()
  const [myTrainees, setMyTrainees] = useState([])
  const [traineeProgress, setTraineeProgress] = useState([])
  const [availableTrainees, setAvailableTrainees] = useState([])
  const [taskModal, setTaskModal] = useState({ open: false, trainee: null })
  const [taskForm, setTaskForm] = useState({ title: '', description: '', project: '', technology: 'HTML', dueDate: '' })

  useEffect(() => {
    if (!user) return

    const fetch = async () => {
      try {
        const trainees = await developerService.getDeveloperTrainees(user._id || user.id)
        const available = await developerService.getAvailableTrainees()
        setMyTrainees(trainees || [])
        setAvailableTrainees(available || [])

        // Progress data is not yet available via API in this repo; keep empty or map if provided
        setTraineeProgress([])
      } catch (err) {
        console.error('Failed to fetch trainees', err)
      }
    }

    fetch()
  }, [user])

  const refreshTrainees = async () => {
    if (!user) return
    try {
      const trainees = await developerService.getDeveloperTrainees(user._id || user.id)
      const available = await developerService.getAvailableTrainees()
      setMyTrainees(trainees || [])
      setAvailableTrainees(available || [])
    } catch (err) {
      console.error('Failed to refresh trainees', err)
    }
  }

  const handleAssignToMe = async (trainee) => {
    try {
      await developerService.assignTraineeToMe(trainee._id || trainee.id)
      await refreshTrainees()
    } catch (err) {
      console.error('Assign failed', err)
    }
  }

  const openTaskModal = (trainee) => {
    setTaskModal({ open: true, trainee })
    setTaskForm({ title: '', description: '', project: '', technology: 'HTML', dueDate: '' })
  }

  const handleCreateTaskForTrainee = async (e) => {
    e.preventDefault()
    if (!taskModal.trainee) return
    try {
      const payload = {
        title: taskForm.title,
        description: taskForm.description,
        project: taskForm.project,
        assignedUser: taskModal.trainee._id || taskModal.trainee.id,
        technology: taskForm.technology,
        category: 'Learning',
        dueDate: taskForm.dueDate || undefined,
      }
      await createTask(payload)
      setTaskModal({ open: false, trainee: null })
      await refreshTrainees()
    } catch (err) {
      console.error('Failed to create trainee task', err)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Trainees</h1>
          <p className="mt-1 text-muted-foreground">Monitor trainee progress and learning path</p>
        </div>

        {/* Trainees Cards */}
        {myTrainees.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {myTrainees.map((trainee) => {
              const progress = traineeProgress.find(p => p.traineeId === (trainee._id || trainee.id))
              return (
                <div key={trainee._id || trainee.id} className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground">{trainee.name}</h3>
                    <p className="text-sm text-muted-foreground">{trainee.email}</p>
                  </div>

                  {progress && (
                    <div className="space-y-6">
                      {/* Task Progress */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-3">Task Completion</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              {progress.completedTasks}/{progress.assignedTasks} completed
                            </span>
                            <span className="font-bold text-foreground">{progress.completionRate}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${progress.completionRate}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Learning Path */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-3">Learning Path Progress</h4>
                        <div className="space-y-3">
                          {[
                            { name: 'HTML', value: progress.htmlProgress },
                            { name: 'CSS', value: progress.cssProgress },
                            { name: 'JavaScript', value: progress.jsProgress },
                            { name: 'React', value: progress.reactProgress },
                          ].map((item) => (
                            <div key={item.name}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-foreground">{item.name}</span>
                                <span className="text-xs text-muted-foreground">{item.value}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-1.5 rounded-full bg-primary"
                                  style={{ width: `${item.value}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status Cards */}
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{progress.assignedTasks}</p>
                          <p className="text-xs text-muted-foreground">Assigned Tasks</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{progress.completedTasks}</p>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => openTaskModal(trainee)} className="rounded-lg bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">Assign Task</button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">You have no trainees assigned yet</p>
          </div>
        )}
        {/* Available trainees to assign */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Available Trainees</h2>
          {availableTrainees.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              {availableTrainees.map(t => (
                <div key={t._id || t.id} className="rounded-lg border border-border bg-card p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.email}</div>
                  </div>
                  <div>
                    <button onClick={() => handleAssignToMe(t)} className="rounded-lg bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">Assign to me</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">No unassigned trainees available</p>
          )}
        </div>

        {/* Task Modal for trainee */}
        {taskModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-lg bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Create Task for {taskModal.trainee.name}</h2>
                <button type="button" onClick={() => setTaskModal({ open: false, trainee: null })} className="text-muted-foreground">Close</button>
              </div>
              <form onSubmit={handleCreateTaskForTrainee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                  <input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required className="w-full rounded-lg border border-border bg-background px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} rows={3} required className="w-full rounded-lg border border-border bg-background px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Project</label>
                  <select value={taskForm.project} onChange={(e) => setTaskForm({ ...taskForm, project: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2">
                    <option value="">Select project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Technology</label>
                  <select value={taskForm.technology} onChange={(e) => setTaskForm({ ...taskForm, technology: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2">
                    <option value="HTML">HTML</option>
                    <option value="CSS">CSS</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
                  <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2" />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setTaskModal({ open: false, trainee: null })} className="rounded-lg border px-4 py-2">Cancel</button>
                  <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Create Task</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
