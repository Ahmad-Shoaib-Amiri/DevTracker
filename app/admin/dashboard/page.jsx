'use client'

import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/common/DashboardCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityBadge } from '@/components/common/PriorityBadge'
import { Users, FolderOpen, CheckSquare, Clock } from 'lucide-react'
import { USERS, PROJECTS, TASKS, ACTIVITY_LOG } from '@/lib/mockData'

export default function AdminDashboard() {
  const developers = USERS.filter(u => u.role === 'developer').length
  const trainees = USERS.filter(u => u.role === 'trainee').length
  const totalProjects = PROJECTS.length
  const totalTasks = TASKS.length
  const completedTasks = TASKS.filter(t => t.status === 'Completed').length
  const pendingTasks = TASKS.filter(t => t.status === 'Pending').length

  const recentProjects = PROJECTS.slice(0, 5)
  const recentTasks = TASKS.slice(0, 5)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back! Here&apos;s your team overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <DashboardCard title="Developers" value={developers} icon={Users} />
          <DashboardCard title="Trainees" value={trainees} icon={Users} />
          <DashboardCard title="Projects" value={totalProjects} icon={FolderOpen} />
          <DashboardCard title="Total Tasks" value={totalTasks} icon={CheckSquare} />
          <DashboardCard title="Completed" value={completedTasks} icon={CheckSquare} />
          <DashboardCard title="Pending" value={pendingTasks} icon={Clock} />
        </div>

        {/* Recent Projects */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Projects</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Project</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Developer</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Progress</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentProjects.map((project) => {
                  const dev = USERS.find(u => project.developers.includes(u.id))
                  return (
                    <tr key={project.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium text-foreground">{project.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{dev?.name}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{project.deadline}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Tasks</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Project</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Assignee</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Priority</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentTasks.map((task) => {
                  const assignee = USERS.find(u => u.id === task.assignee)
                  const project = PROJECTS.find(p => p.id === task.project)
                  return (
                    <tr key={task.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium text-foreground">{task.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{project?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{assignee?.name}</td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={task.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Log */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Activity</h2>
          <div className="space-y-4">
            {ACTIVITY_LOG.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-start gap-4 border-b border-border pb-4 last:border-0">
                <div className="mt-1 size-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    <span className="font-semibold">{log.user}</span> {log.action}{' '}
                    <span className="text-primary">{log.item}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
