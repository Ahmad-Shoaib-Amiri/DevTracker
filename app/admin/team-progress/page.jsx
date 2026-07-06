'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { SearchBar } from '@/components/common/SearchBar'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getTeamProgress } from '@/services/teamProgressService'

export default function TeamProgressPage() {
  const [teamProgress, setTeamProgress] = useState({ developers: [], trainees: [] })
  const [devSearch, setDevSearch] = useState('')
  const [traineeSearch, setTraineeSearch] = useState('')
  const [developerPage, setDeveloperPage] = useState(1)
  const [traineePage, setTraineePage] = useState(1)
  const developerLimit = 4
  const traineeLimit = 6
  const [loading, setLoading] = useState(true)

  const fetchTeamProgress = async () => {
    try {
      setLoading(true)
      const data = await getTeamProgress(1, 1000)
      const developers = data?.developers || []
      const trainees = data?.trainees || []

      setTeamProgress({ developers, trainees })
    } catch (error) {
      console.error('Failed to load team progress:', error)
      setTeamProgress({ developers: [], trainees: [] })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeamProgress()
  }, [])

  const developers = teamProgress.developers || []
  const trainees = teamProgress.trainees || []
  const filteredDevelopers = developers.filter((developer) => {
    const query = devSearch.trim().toLowerCase()
    if (!query) return true
    const displayName = `${developer.name || ''} ${developer.fullName || ''} ${developer.username || ''}`.toLowerCase()
    return displayName.includes(query)
  })
  const filteredTrainees = trainees.filter((trainee) => {
    const query = traineeSearch.trim().toLowerCase()
    if (!query) return true
    const displayName = `${trainee.name || ''} ${trainee.fullName || ''} ${trainee.username || ''}`.toLowerCase()
    return displayName.includes(query)
  })
  const developerTotalPages = Math.max(1, Math.ceil(filteredDevelopers.length / developerLimit))
  const traineeTotalPages = Math.max(1, Math.ceil(filteredTrainees.length / traineeLimit))
  const pagedDevelopers = filteredDevelopers.slice((developerPage - 1) * developerLimit, developerPage * developerLimit)
  const pagedTrainees = filteredTrainees.slice((traineePage - 1) * traineeLimit, traineePage * traineeLimit)

  const handleDeveloperPage = (newPage) => {
    if (newPage < 1 || newPage > developerTotalPages) return
    setDeveloperPage(newPage)
  }

  const handleTraineePage = (newPage) => {
    if (newPage < 1 || newPage > traineeTotalPages) return
    setTraineePage(newPage)
  }
  const totalDeveloperTasks = developers.reduce((sum, dev) => sum + (dev.totalTasks || 0), 0)
  const totalCompletedTasks = developers.reduce((sum, dev) => sum + (dev.completedTasks || 0), 0) + trainees.reduce((sum, tr) => sum + (tr.completedTasks || 0), 0)
  const totalTrainees = trainees.length
  const totalDevelopers = developers.length

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Progress</h1>
          <p className="mt-1 text-muted-foreground">Monitor developer and trainee performance</p>
        </div>

        {loading ? (
          <div className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">Loading team progress...</div>
        ) : null}

        {/* Developer Statistics */}
        <div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Developer Performance</h2>
              <p className="text-sm text-muted-foreground">Summary of active developers and project workload</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="w-full sm:w-64">
                <SearchBar placeholder="Search developers..." onSearch={(value) => { setDevSearch(value); setDeveloperPage(1) }} />
              </div>
              {developerTotalPages > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeveloperPage(developerPage - 1)}
                    disabled={developerPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: developerTotalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={p === developerPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleDeveloperPage(p)}
                        className="w-9"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeveloperPage(developerPage + 1)}
                    disabled={developerPage === developerTotalPages}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {pagedDevelopers.map((developer) => {
              const totalTasks = developer.totalTasks || 0
              const completedTasks = developer.completedTasks || 0
              const pendingTasks = developer.pendingTasks || 0
              const inProgressTasks = developer.inProgressTasks ?? Math.max(0, totalTasks - completedTasks - pendingTasks)
              const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
              const projectCount = Array.isArray(developer.projects) ? developer.projects.length : developer.projects || 0

              return (
                <div key={developer._id || developer.id || developer.name} className="rounded-lg border border-border bg-card p-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">{developer.name || developer.fullName || developer.username || 'Unnamed Developer'}</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Tasks</p>
                        <p className="mt-1 text-2xl font-bold text-foreground">{totalTasks}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="mt-1 text-2xl font-bold text-green-600">{completedTasks}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="mt-1 text-2xl font-bold text-yellow-600">{pendingTasks}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                        <p className="mt-1 text-2xl font-bold text-indigo-600">{inProgressTasks}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Projects</p>
                        <p className="mt-1 text-2xl font-bold text-primary">{projectCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Completion Rate</p>
                        <p className="mt-1 text-2xl font-bold text-foreground">{completionRate}%</p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <p className="text-sm font-semibold text-foreground">{completionRate}%</p>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${completionRate}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Trainee Statistics */}
        <div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Trainee Progress</h2>
              <p className="text-sm text-muted-foreground">Task and learning progress for trainees</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="w-full sm:w-64">
                <SearchBar placeholder="Search trainees..." onSearch={(value) => { setTraineeSearch(value); setTraineePage(1) }} />
              </div>
              {traineeTotalPages > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTraineePage(traineePage - 1)}
                    disabled={traineePage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: traineeTotalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={p === traineePage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleTraineePage(p)}
                        className="w-9"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTraineePage(traineePage + 1)}
                    disabled={traineePage === traineeTotalPages}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pagedTrainees.map((trainee) => {
              const totalTasks = trainee.totalTasks || 0
              const completedTasks = trainee.completedTasks || 0
              const pendingTasks = trainee.pendingTasks || 0
              const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
              const taskCountLabel = `${completedTasks}/${totalTasks}`

              return (
                <div key={trainee._id || trainee.id || trainee.name} className="rounded-lg border border-border bg-card p-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">{trainee.name || trainee.fullName || trainee.username || 'Unnamed Trainee'}</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Tasks: {taskCountLabel}</p>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${completionRate}%` }} />
                      </div>
                      <p className="mt-1 text-xs font-medium text-foreground">{completionRate}% Complete</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="mt-1 text-2xl font-bold text-green-600">{completedTasks}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="mt-1 text-2xl font-bold text-yellow-600">{pendingTasks}</p>
                      </div>
                    </div>

                    {Array.isArray(trainee.tasks) && trainee.tasks.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-foreground">Recent Tasks</p>
                        {trainee.tasks.slice(0, 3).map((task) => (
                          <div key={task._id || task.id || task.title} className="rounded-lg bg-muted/70 p-3">
                            <p className="text-sm font-medium text-foreground truncate">{task.title || task.name}</p>
                            <p className="text-xs text-muted-foreground">{task.project?.name || task.project}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Overall Statistics</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{totalDeveloperTasks}</p>
              <p className="mt-2 text-sm text-muted-foreground">Total Developer Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">{totalCompletedTasks}</p>
              <p className="mt-2 text-sm text-muted-foreground">Completed Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">{totalTrainees}</p>
              <p className="mt-2 text-sm text-muted-foreground">Trainees</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600">{totalDevelopers}</p>
              <p className="mt-2 text-sm text-muted-foreground">Developers</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
