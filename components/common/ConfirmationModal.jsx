'use client'

import { Button } from '@/components/ui/button'
import { LoadingSpinner } from './LoadingSpinner'

export function ConfirmationModal({ title, message, onConfirm, onCancel, isLoading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  )
}
