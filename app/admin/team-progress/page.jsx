'use client'

import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { TEAM_STATS, TRAINEE_PROGRESS, USERS } from '@/lib/mockData'

export default function TeamProgressPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Progress</h1>
          <p className="mt-1 text-muted-foreground">Monitor developer and trainee performance</p>
        </div>

        {/* Developer Statistics */}
        <div>
          <h2 className="mb-4 text-2xl font-bold text-foreground">Developer Performance</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {TEAM_STATS.map((stat) => (
              <div key={stat.id} className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">{stat.name}</h3>
                
                <div className="space-y-4">
                  {/* Task Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Tasks</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{stat.totalTasks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="mt-1 text-2xl font-bold text-green-600">{stat.completedTasks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="mt-1 text-2xl font-bold text-yellow-600">{stat.pendingTasks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Projects</p>
                      <p className="mt-1 text-2xl font-bold text-primary">{stat.totalProjects}</p>
                    </div>
                  </div>

                  {/* Completion Rate */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                      <p className="text-sm font-bold text-foreground">{stat.completionRate}%</p>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-3 rounded-full bg-primary transition-all"
                        style={{ width: `${stat.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trainee Statistics */}
        <div>
          <h2 className="mb-4 text-2xl font-bold text-foreground">Trainee Progress</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {TRAINEE_PROGRESS.map((trainee) => (
              <div key={trainee.id} className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">{trainee.name}</h3>

                <div className="space-y-4">
                  {/* Task Progress */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Tasks: {trainee.completedTasks}/{trainee.assignedTasks}
                    </p>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${trainee.completionRate}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs font-medium text-foreground">{trainee.completionRate}% Complete</p>
                  </div>

                  {/* Learning Path Progress */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">Learning Path</p>

                    {[
                      { name: 'HTML', progress: trainee.htmlProgress },
                      { name: 'CSS', progress: trainee.cssProgress },
                      { name: 'JavaScript', progress: trainee.jsProgress },
                      { name: 'React', progress: trainee.reactProgress },
                    ].map((item) => (
                      <div key={item.name}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-muted-foreground">{item.name}</p>
                          <p className="text-xs font-bold text-foreground">{item.progress}%</p>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Overall Statistics</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {TEAM_STATS.reduce((acc, s) => acc + s.totalTasks, 0)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Total Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">
                {TEAM_STATS.reduce((acc, s) => acc + s.completedTasks, 0)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Completed Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">
                {TRAINEE_PROGRESS.length}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Trainees</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600">
                {TEAM_STATS.length}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Developers</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
