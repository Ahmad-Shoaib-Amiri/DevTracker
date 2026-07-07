'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/common/DashboardCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAuth } from '@/context/AuthContext'
import developerService from '@/services/developerService'
import { Briefcase, CheckSquare, Users, TrendingUp } from 'lucide-react'

export default function DeveloperDashboard() {
  const { user } = useAuth()
  const [myTasks, setMyTasks] = useState([])
  const [myProjects, setMyProjects] = useState([])
  const [myTrainees, setMyTrainees] = useState([])

  useEffect(() => {
    if (!user) return

    const fetch = async () => {
      try {
        const [projects, tasks, trainees] = await Promise.all([
          developerService.getDeveloperProjects(user._id || user.id),
          developerService.getDeveloperTasks(user._id || user.id),
          developerService.getDeveloperTrainees(user._id || user.id),
        ])

        setMyProjects(projects || [])
        setMyTasks(tasks || [])
        setMyTrainees(trainees || [])
      } catch (err) {
        console.error('Failed to fetch developer dashboard data', err)
      }
    }

    fetch()
  }, [user])

  const completedTasks = myTasks.filter(t => t.status === 'Completed').length
  const completionRate = myTasks.length > 0 ? Math.round((completedTasks / myTasks.length) * 100) : 0

  const recentTasks = myTasks.slice(0, 5)

  // For trainee stats we expect an API-driven progress object; fall back to empty list
  const traineeStats = []

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Developer Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back! Here&apos;s your overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard title="My Projects" value={myProjects.length} icon={Briefcase} />
          <DashboardCard title="My Tasks" value={myTasks.length} icon={CheckSquare} />
          <DashboardCard title="My Trainees" value={myTrainees.length} icon={Users} />
          <DashboardCard title="Completion Rate" value={`${completionRate}%`} icon={TrendingUp} />
        </div>

        {/* My Tasks */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Tasks</h2>
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div key={task._id || task.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No tasks assigned yet</p>
            )}
          </div>
        </div>

        {/* Current Projects */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">My Projects</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {myProjects.length > 0 ? (
              myProjects.map((project) => (
                <div key={project._id || project.id} className="border border-border rounded-lg p-4 hover:bg-muted/30">
                  <h3 className="font-semibold text-foreground mb-2">{project.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge status={project.status} />
                    <span className="text-xs font-bold">{project.progress ?? 0}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${project.progress ?? 0}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8 col-span-2">No projects assigned yet</p>
            )}
          </div>
        </div>

        {/* Trainees Progress */}
        {myTrainees.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">My Trainees Progress</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Trainee</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tasks</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Completion</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {traineeStats.map((stat) => (
                    <tr key={stat.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">{stat.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {stat.completedTasks}/{stat.assignedTasks}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{stat.completionRate}%</td>
                      <td className="px-4 py-3">
                        <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${stat.completionRate}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
