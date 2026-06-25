export function StatusBadge({ status }) {
  const statusStyles = {
    'Not Started': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status] || statusStyles['Pending']}`}>
      {status}
    </span>
  )
}
