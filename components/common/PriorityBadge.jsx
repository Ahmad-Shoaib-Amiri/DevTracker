export function PriorityBadge({ priority }) {
  const priorityStyles = {
    Low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${priorityStyles[priority] || priorityStyles['Medium']}`}>
      {priority}
    </span>
  )
}
