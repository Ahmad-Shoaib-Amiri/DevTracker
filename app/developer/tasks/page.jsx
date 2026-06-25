'use client'

import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityBadge } from '@/components/common/PriorityBadge'
import { useAuth } from '@/context/AuthContext'
import { TASKS, PROJECTS } from '@/lib/mockData'
import { useState } from 'react'

export default function DeveloperTasksPage() {
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState('all')

  const myTasks = TASKS.filter(t => t.assignee === user?.id)

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

        {/* Filter */}
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

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const project = PROJECTS.find(p => p.id === task.project)
            return (
              <div key={task.id} className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{task.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                      {project && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {project.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p className="font-medium">Due: {task.dueDate}</p>
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
      </div>
    </DashboardLayout>
  )
}
