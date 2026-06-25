'use client'

import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityBadge } from '@/components/common/PriorityBadge'
import { useAuth } from '@/context/AuthContext'
import { TASKS } from '@/lib/mockData'
import { useState } from 'react'

export default function TraineeTasksPage() {
  const { user } = useAuth()
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const myTasks = TASKS.filter(t => t.assignee === user?.id && !t.project)

  const filteredTasks = myTasks.filter((task) => {
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    return matchesCategory && matchesStatus
  })

  const categories = [...new Set(myTasks.map(t => t.category).filter(Boolean))]

  const stats = {
    total: myTasks.length,
    completed: myTasks.filter(t => t.status === 'Completed').length,
    inProgress: myTasks.filter(t => t.status === 'In Progress').length,
    pending: myTasks.filter(t => t.status === 'Pending').length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Learning Tasks</h1>
          <p className="mt-1 text-muted-foreground">Complete your assigned learning tasks</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="mt-2 text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="mt-2 text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Tasks */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>

              {/* Task Details */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border mt-4">
                {task.category && (
                  <span className="text-xs bg-primary/20 text-primary dark:bg-primary/30 px-3 py-1.5 rounded-full font-medium">
                    {task.category}
                  </span>
                )}
                <PriorityBadge priority={task.priority} />
                <span className="text-xs text-muted-foreground ml-auto">
                  Due: <span className="font-medium text-foreground">{task.dueDate}</span>
                </span>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  {task.status === 'Completed' ? 'View Details' : 'Start Learning →'}
                </button>
              </div>
            </div>
          ))}
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
