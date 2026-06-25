'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

export function SearchBar({ placeholder = 'Search...', onSearch }) {
  const [value, setValue] = useState('')

  const handleChange = (e) => {
    const newValue = e.target.value
    setValue(newValue)
    onSearch?.(newValue)
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  )
}
