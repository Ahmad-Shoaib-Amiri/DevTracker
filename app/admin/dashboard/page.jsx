'use client'

import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/common/DashboardCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityBadge } from '@/components/common/PriorityBadge'
import { Users, FolderOpen, CheckSquare, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  getDashboardStats,
  getDashboardLists,
} from '@/services/dashboardService'

export default function AdminDashboard() {
  const [stats, setStats] = useState({})
const [recentProjects, setRecentProjects] = useState([])
const [recentTasks, setRecentTasks] = useState([])
const [activities, setActivities] = useState([])

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const statsData = await getDashboardStats()
      const listsData = await getDashboardLists()

      setStats(statsData)
      setRecentProjects(listsData.recentProjects)
      setRecentTasks(listsData.recentTasks)
      setActivities(listsData.recentActivities)
    } catch (error) {
      console.error(error)
    }
  }

  fetchDashboard()
}, [])

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
          <DashboardCard title="Developers" value={stats.developers || 0} icon={Users} />
          <DashboardCard title="Trainees" value={stats.trainees || 0} icon={Users} />
          <DashboardCard title="Projects" value={stats.projects || 0} icon={FolderOpen} />
          <DashboardCard title="Total Tasks" value={stats.totalTasks || 0} icon={CheckSquare} />
          <DashboardCard title="Completed" value={stats.completedProjects || 0} icon={CheckSquare} />
          <DashboardCard title="Pending" value={stats.pendingTasks || 0} icon={Clock} />
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
                  // project.assignedDeveloper?.name
                  return (
                    <tr key={project._id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium text-foreground">{project.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{project.assignedDeveloper?.name}</td>
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
                  // task.project?.name
                  // task.assignedUser?.name
                  return (
                    <tr key={task._id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium text-foreground">{task.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">
  {task.project?.name || 'N/A'}
</td>
                     <td className="px-4 py-3 text-muted-foreground">
  {task.assignedUser?.name || 'N/A'}
</td>
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
            {activities.map((log) => (
              <div key={log._id} className="flex items-start gap-4 border-b border-border pb-4 last:border-0">
                <div className="mt-1 size-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    <span className="font-bold">{log.user}: </span>  
                    <span className="text-semibold">{log.message}{' '}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
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
