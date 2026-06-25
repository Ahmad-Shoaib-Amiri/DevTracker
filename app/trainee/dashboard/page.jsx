'use client'

import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/common/DashboardCard'
import { useAuth } from '@/context/AuthContext'
import { TASKS, TRAINEE_PROGRESS } from '@/lib/mockData'
import { CheckCircle, Clock, BookOpen, TrendingUp } from 'lucide-react'

export default function TraineeDashboard() {
  const { user } = useAuth()

  const myTasks = TASKS.filter(t => t.assignee === user?.id)
  const completedTasks = myTasks.filter(t => t.status === 'Completed').length
  const pendingTasks = myTasks.filter(t => t.status === 'Pending').length

  const progress = TRAINEE_PROGRESS.find(p => p.traineeId === user?.id)

  const recentTasks = myTasks.slice(0, 5)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Learning Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard title="Assigned Tasks" value={myTasks.length} icon={BookOpen} />
          <DashboardCard title="Completed" value={completedTasks} icon={CheckCircle} />
          <DashboardCard title="Pending" value={pendingTasks} icon={Clock} />
          <DashboardCard
            title="Progress Rate"
            value={progress ? `${progress.completionRate}%` : '0%'}
            icon={TrendingUp}
          />
        </div>

        {/* Learning Path Progress */}
        {progress && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold text-foreground">Learning Path Progress</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'HTML', value: progress.htmlProgress, color: 'bg-orange-600' },
                { name: 'CSS', value: progress.cssProgress, color: 'bg-blue-600' },
                { name: 'JavaScript', value: progress.jsProgress, color: 'bg-yellow-600' },
                { name: 'React', value: progress.reactProgress, color: 'bg-cyan-600' },
              ].map((item) => (
                <div key={item.name}>
                  <div className="text-center mb-3">
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{item.value}%</p>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-3 rounded-full ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Tasks */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Learning Tasks</h2>
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{task.title}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      {task.category && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          {task.category}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        task.status === 'Completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : task.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {task.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No tasks assigned yet</p>
            )}
          </div>
        </div>

        {/* Learning Tips */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-2">Focus on Fundamentals</h3>
            <p className="text-sm text-muted-foreground">
              Master the basics of HTML and CSS before moving to JavaScript. Strong foundations are key.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-2">Practice Regularly</h3>
            <p className="text-sm text-muted-foreground">
              Code every day, even if it's just for 30 minutes. Consistency beats intensity.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-2">Build Projects</h3>
            <p className="text-sm text-muted-foreground">
              Apply what you learn by building real projects. It reinforces concepts and builds confidence.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
