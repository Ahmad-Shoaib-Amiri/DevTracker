'use client'

import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { StatusBadge } from '@/components/common/StatusBadge'
import { SearchBar } from '@/components/common/SearchBar'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { getProjects } from '@/services/projectServices'
import { getUsers } from '@/services/userService'   // ← Added

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    developers: [],
    startDate: '',
    deadline: '',
  })

  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])        // ← New: Users from backend
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  // Fetch Users from Backend
  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data?.users || data || [])   // Adjust based on your API response structure
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setUsers([])
    }
  }

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const data = await getProjects(page, 10)
      console.log('Projects API response:', data)

      const projectsData = Array.isArray(data)
        ? data
        : data?.projects || data?.data || []

      const totalCount = data?.total ?? data?.count ?? data?.totalCount ?? projectsData.length

      setProjects(projectsData)
      setTotalPages(Math.max(1, Math.ceil(totalCount / 10)))
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      setProjects([])
    }
  }

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchUsers(), fetchProjects()])
      setLoading(false)
    }

    loadData()
  }, [])

  // Refetch projects when page changes
  useEffect(() => {
    fetchProjects()
  }, [page])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchesStatus = statusFilter === 'all' || project?.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddProject = (e) => {
    e.preventDefault()
    console.log('Adding project:', formData)

    setFormData({
      name: '',
      description: '',
      developers: [],
      startDate: '',
      deadline: '',
    })
    setShowModal(false)
  }

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
  }

  const getDeveloperNames = (developers) => {
    if (!developers || !Array.isArray(developers)) return 'No developers assigned'

    const names = developers
      .map((developer) => {
        if (typeof developer === 'string') {
          const user = users.find((u) => u.id === developer || u._id === developer)
          return user?.name || user?.fullName || user?.username || developer
        }

        if (typeof developer === 'object') {
          if (developer?.name || developer?.fullName || developer?.username) {
            return developer.name || developer.fullName || developer.username
          }

          if (developer?.user?.name || developer?.user?.fullName || developer?.user?.username) {
            return developer.user.name || developer.user.fullName || developer.user.username
          }

          if (developer?.developer?.name || developer?.developer?.fullName || developer?.developer?.username) {
            return developer.developer.name || developer.developer.fullName || developer.developer.username
          }

          const user = users.find(
            (u) => u.id === developer?.id || u._id === developer?._id || u.id === developer?.userId || u._id === developer?.userId
          )

          return user?.name || user?.fullName || user?.username || ''
        }

        return ''
      })
      .filter(Boolean)

    return names.length ? names.join(', ') : 'No developers assigned'
  }

  const getProgressValue = (project) => {
    const value = project?.progress ?? project?.completionPercentage ?? project?.progressPercentage ?? project?.completed ?? project?.percentage ?? 0
    const numericValue = Number(value)

    if (!Number.isFinite(numericValue)) return 0

    return Math.max(0, Math.min(100, numericValue))
  }

  const formatDeadline = (deadline) => {
    if (!deadline) return 'No deadline'

    const date = new Date(deadline)

    if (Number.isNaN(date.getTime())) return deadline

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="mt-1 text-muted-foreground">Manage development projects</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus size={18} />
            New Project
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <SearchBar
              placeholder="Search projects..."
              onSearch={setSearchTerm}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Project Name</th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Developers</th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Progress</th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Deadline</th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProjects.map((project) => (
                  <tr key={project._id || project.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium text-foreground">{project.name}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {getDeveloperNames(project.developers)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${getProgressValue(project)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-10">{getProgressValue(project)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDeadline(project.deadline)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button className="rounded-lg p-2 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(p)}
                    className="w-9"
                  >
                    {p}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Add Project Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg max-h-96 overflow-y-auto">
              <h2 className="text-xl font-semibold text-foreground mb-4">Create New Project</h2>
              <form onSubmit={handleAddProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Project Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E-commerce Platform"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Project description..."
                    rows="3"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Deadline</label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Create Project
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}