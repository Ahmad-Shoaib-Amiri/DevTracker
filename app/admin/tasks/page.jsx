// 'use client'

// import { DashboardLayout } from '@/components/layouts/DashboardLayout'
// import { StatusBadge } from '@/components/common/StatusBadge'
// import { PriorityBadge } from '@/components/common/PriorityBadge'
// import { SearchBar } from '@/components/common/SearchBar'
// import { Button } from '@/components/ui/button'
// import { useState, useEffect } from 'react'
// import {
//   getTasks,
//   createTask,
//   updateTask,
//   deleteTask,
// } from '@/services/taskServices'

// import { getProjects } from '@/services/projectServices'
// import { getUsers } from '@/services/userService'
// import { Edit2, Trash2, Plus } from 'lucide-react'

// export default function TasksPage() {
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState('all')
//   const [priorityFilter, setPriorityFilter] = useState('all')
//   const [showModal, setShowModal] = useState(false)
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     project: '',
//     assignee: '',
//     priority: 'Medium',
//     dueDate: '',
//   })
//   const [tasks, setTasks] = useState([])
// const [projects, setProjects] = useState([])
// const [users, setUsers] = useState([])
// const [page, setPage] = useState(1)
// const [totalPages, setTotalPages] = useState(1)

//   const filteredTasks = tasks.filter((task) => {
//   const matchesSearch =
//     task.title.toLowerCase().includes(searchTerm.toLowerCase())

//   const matchesStatus =
//     statusFilter === 'all' || task.status === statusFilter

//   const matchesPriority =
//     priorityFilter === 'all' || task.priority === priorityFilter

//   return matchesSearch && matchesStatus && matchesPriority
// })

//   const handleAddTask = async (e) => {
//     e.preventDefault()

// try {
//   await createTask(formData)

//   fetchTasks()

//   setFormData({
//     title: '',
//     description: '',
//     project: '',
//     assignee: '',
//     priority: 'Medium',
//     dueDate: '',
//   })

//   setShowModal(false)
// } catch (err) {
//   console.error(err)
// }}

//   const fetchTasks = async () => {
//   try {
//     const taskData = await getTasks(page, 10)
//     const projectData = await getProjects()
//     const userData = await getUsers()

//     setTasks(taskData.tasks)
//     setTotalPages(Math.ceil(taskData.total / 10))

//     setProjects(projectData.projects ?? projectData)
//     setUsers(userData.users ?? userData)
//   } catch (err) {
//     console.error(err)
//   }
// }

// useEffect(() => {
//   fetchTasks()
// }, [page])

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
//             <p className="mt-1 text-muted-foreground">Manage all team tasks</p>
//           </div>
//           <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
//             <Plus size={18} />
//             New Task
//           </Button>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-col gap-3 md:flex-row md:items-center">
//           <div className="flex-1">
//             <SearchBar
//               placeholder="Search tasks..."
//               onSearch={setSearchTerm}
//             />
//           </div>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//           >
//             <option value="all">All Status</option>
//             <option value="Pending">Pending</option>
//             <option value="In Progress">In Progress</option>
//             <option value="Completed">Completed</option>
//           </select>
//           <select
//             value={priorityFilter}
//             onChange={(e) => setPriorityFilter(e.target.value)}
//             className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//           >
//             <option value="all">All Priority</option>
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="High">High</option>
//           </select>
//         </div>

//         {/* Table */}
//         <div className="rounded-lg border border-border bg-card overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-border bg-muted/50">
//                   <th className="px-6 py-4 text-left font-medium text-muted-foreground">Title</th>
//                   <th className="px-6 py-4 text-left font-medium text-muted-foreground">Project</th>
//                   <th className="px-6 py-4 text-left font-medium text-muted-foreground">Assignee</th>
//                   <th className="px-6 py-4 text-left font-medium text-muted-foreground">Priority</th>
//                   <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
//                   <th className="px-6 py-4 text-left font-medium text-muted-foreground">Due Date</th>
//                   <th className="px-6 py-4 text-left font-medium text-muted-foreground">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-border">
//                 {filteredTasks.map((task) => {
//                   const assignee = users.find((u) => u.id === task.assignee)
//                   const project = projects.find((p) => p.id === task.project)
//                   return (
//                     <tr key={task._id} className="hover:bg-muted/30">
//                       <td className="px-6 py-4 font-medium text-foreground max-w-xs truncate">{task.title}</td>
//                       <td className="px-6 py-4 text-muted-foreground text-xs">{project?.name || 'N/A'}</td>
//                       <td className="px-6 py-4 text-muted-foreground">{assignee?.name}</td>
//                       <td className="px-6 py-4">
//                         <PriorityBadge priority={task.priority} />
//                       </td>
//                       <td className="px-6 py-4">
//                         <StatusBadge status={task.status} />
//                       </td>
//                       <td className="px-6 py-4 text-muted-foreground">{task.dueDate}</td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <button className="rounded-lg p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
//                             <Edit2 size={18} />
//                           </button>
//                           <button className="rounded-lg p-2 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-colors">
//                             <Trash2 size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Add Task Modal */}
//         {showModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//             <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg max-h-96 overflow-y-auto">
//               <h2 className="text-xl font-semibold text-foreground mb-4">Create New Task</h2>
//               <form onSubmit={handleAddTask} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">Task Title</label>
//                   <input
//                     type="text"
//                     value={formData.title}
//                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                     placeholder="Task title"
//                     className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">Description</label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     placeholder="Task description..."
//                     rows="2"
//                     className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-sm font-medium text-foreground mb-2">Project</label>
//                     <select
//                       value={formData.project}
//                       onChange={(e) => setFormData({ ...formData, project: e.target.value })}
//                       className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//                     >
//                       <option value="">Select project</option>
//                       {projects.map((p) => (
//                         <option key={p._id} value={p._id}>
//                           {p.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-foreground mb-2">Assignee</label>
//                     <select
//                       value={formData.assignee}
//                       onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
//                       className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//                     >
//                       <option value="">Select user</option>
//                       {users.filter(u => u.role !== 'admin').map((u) => (
//                         <option key={u._id} value={u._id}>
//                           {u.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
//                     <select
//                       value={formData.priority}
//                       onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
//                       className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//                     >
//                       <option value="Low">Low</option>
//                       <option value="Medium">Medium</option>
//                       <option value="High">High</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
//                     <input
//                       type="date"
//                       value={formData.dueDate}
//                       onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
//                       className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex gap-3 pt-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setShowModal(false)}
//                     className="flex-1"
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit" className="flex-1">
//                     Create Task
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   )
// }






'use client'

import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityBadge } from '@/components/common/PriorityBadge'
import { SearchBar } from '@/components/common/SearchBar'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '@/services/taskServices'

import { getProjects } from '@/services/projectServices'
import { getUsers } from '@/services/userService'
import { Edit2, Trash2, Plus } from 'lucide-react'

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignee: '',
    priority: 'Medium',
    dueDate: '',
  })

  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Fetch all data
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const [taskData, projectData, userData] = await Promise.all([
        getTasks(page, 10),
        getProjects(),
        getUsers()
      ])

      setTasks(taskData?.tasks || taskData || [])
      setTotalPages(Math.ceil((taskData?.total || 0) / 10))

      setProjects(projectData?.projects || projectData || [])
      setUsers(userData?.users || userData || [])
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [page])

  // Create Task
  const handleAddTask = async (e) => {
    e.preventDefault()
    try {
      await createTask(formData)
      fetchTasks()
      resetForm()
      setShowModal(false)
    } catch (err) {
      console.error('Create task failed:', err)
    }
  }

  // Update Task
  const handleEditClick = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title || '',
      description: task.description || '',
      project: task.project?._id || task.project || '',
      assignee: task.assignee?._id || task.assignee || '',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    })
    setShowEditModal(true)
  }

  const handleUpdateTask = async (e) => {
    e.preventDefault()
    if (!editingTask) return

    try {
      await updateTask(editingTask._id, formData)
      fetchTasks()
      setShowEditModal(false)
      setEditingTask(null)
      resetForm()
    } catch (err) {
      console.error('Update task failed:', err)
    }
  }

  // Delete Task
  const handleDeleteTask = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      await deleteTask(id)
      fetchTasks()
    } catch (err) {
      console.error('Delete task failed:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      project: '',
      assignee: '',
      priority: 'Medium',
      dueDate: '',
    })
  }

  // Format due date
  const formatDueDate = (date) => {
    if (!date) return 'No due date'
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            <p className="mt-1 text-muted-foreground">Manage all team tasks</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus size={18} />
            New Task
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <SearchBar placeholder="Search tasks..." onSearch={setSearchTerm} />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-border bg-background px-4 py-2 text-sm">
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="rounded-lg border border-border bg-background px-4 py-2 text-sm">
            <option value="all">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Title</th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Project</th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Assignee</th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Priority</th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Due Date</th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTasks.map((task) => {
                  const project = projects.find(p => 
                    p._id === task.project || p.id === task.project
                  )
                  const assignee = users.find(u => 
                    u._id === task.assignee || u.id === task.assignee
                  )

                  return (
                    <tr key={task._id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium text-foreground max-w-xs truncate">{task.title}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{project?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-muted-foreground">{assignee?.name || 'Unassigned'}</td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{formatDueDate(task.dueDate)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEditClick(task)}
                            className="rounded-lg p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(task._id)}
                            className="rounded-lg p-2 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Task Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg max-h-96 overflow-y-auto">
              <h2 className="text-xl font-semibold text-foreground mb-4">Create New Task</h2>
              <form onSubmit={handleAddTask} className="space-y-4">
                {/* Same form as before - unchanged for brevity */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Task Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Task title" className="w-full rounded-lg border border-border bg-background px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="2" className="w-full rounded-lg border border-border bg-background px-4 py-2" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Project</label>
                    <select value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2">
                      <option value="">Select project</option>
                      {projects.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Assignee</label>
                    <select value={formData.assignee} onChange={(e) => setFormData({ ...formData, assignee: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2">
                      <option value="">Select user</option>
                      {users.filter(u => u.role !== 'admin').map((u) => (
                        <option key={u._id} value={u._id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                    <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
                    <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">Create Task</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg max-h-96 overflow-y-auto">
              <h2 className="text-xl font-semibold text-foreground mb-4">Edit Task</h2>
              <form onSubmit={handleUpdateTask} className="space-y-4">
                {/* Same fields as create modal */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Task Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="2" className="w-full rounded-lg border border-border bg-background px-4 py-2" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Project</label>
                    <select value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2">
                      <option value="">Select project</option>
                      {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Assignee</label>
                    <select value={formData.assignee} onChange={(e) => setFormData({ ...formData, assignee: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2">
                      <option value="">Select user</option>
                      {users.filter(u => u.role !== 'admin').map((u) => (
                        <option key={u._id} value={u._id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                    <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
                    <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full rounded-lg border border-border bg-background px-4 py-2" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => { setShowEditModal(false); setEditingTask(null); }} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">Update Task</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}