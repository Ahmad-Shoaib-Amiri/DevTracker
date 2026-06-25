import { AlertCircle } from 'lucide-react'

export function EmptyState({ title, message, icon: Icon = AlertCircle }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 py-12">
      <Icon className="mb-4 size-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
