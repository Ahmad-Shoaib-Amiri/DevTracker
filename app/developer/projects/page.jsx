'use client'

import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAuth } from '@/context/AuthContext'
import { PROJECTS, TASKS } from '@/lib/mockData'

export default function DeveloperProjectsPage() {
  const { user } = useAuth()
  const myProjects = PROJECTS.filter(p => p.developers.includes(user?.id))

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
          <p className="mt-1 text-muted-foreground">Manage your assigned projects</p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myProjects.map((project) => {
            const projectTasks = TASKS.filter(t => t.project === project.id)
            const completedTasks = projectTasks.filter(t => t.status === 'Completed').length

            return (
              <div key={project.id} className="rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground flex-1">{project.name}</h3>
                  <StatusBadge status={project.status} />
                </div>

                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-muted-foreground">Progress</p>
                    <p className="text-sm font-bold text-foreground">{project.progress}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Task Summary */}
                <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-border my-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{projectTasks.length}</p>
                    <p className="text-xs text-muted-foreground">Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                    <p className="text-xs text-muted-foreground">Done</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{projectTasks.length - completedTasks}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start:</span>
                    <span className="font-medium text-foreground">{project.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="font-medium text-foreground">{project.deadline}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {myProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects assigned yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
