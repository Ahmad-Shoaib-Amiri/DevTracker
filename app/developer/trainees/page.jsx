'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { useAuth } from '@/context/AuthContext'
import developerService from '@/services/developerService'
import traineeService from '@/services/traineeService'

export default function TraineesPage() {
  const { user } = useAuth()
  const [myTrainees, setMyTrainees] = useState([])
  const [traineeProgress, setTraineeProgress] = useState([])

  useEffect(() => {
    if (!user) return

    const fetch = async () => {
      try {
        const trainees = await developerService.getDeveloperTrainees(user._id || user.id)
        setMyTrainees(trainees || [])

        // Progress data is not yet available via API in this repo; keep empty or map if provided
        setTraineeProgress([])
      } catch (err) {
        console.error('Failed to fetch trainees', err)
      }
    }

    fetch()
  }, [user])

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
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">You have no trainees assigned yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
