'use client'

import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Sidebar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const adminMenuItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/projects', label: 'Projects' },
    { href: '/admin/tasks', label: 'Tasks' },
    { href: '/admin/team-progress', label: 'Team Progress' },
  ]

  const developerMenuItems = [
    { href: '/developer/dashboard', label: 'Dashboard' },
    { href: '/developer/projects', label: 'My Projects' },
    { href: '/developer/tasks', label: 'My Tasks' },
    { href: '/developer/trainees', label: 'My Trainees' },
  ]

  const traineeMenuItems = [
    { href: '/trainee/dashboard', label: 'Dashboard' },
    { href: '/trainee/tasks', label: 'My Tasks' },
  ]

  const menuItems = {
    admin: adminMenuItems,
    developer: developerMenuItems,
    trainee: traineeMenuItems,
  }

  const currentMenuItems = menuItems[user?.role] || []

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 border-r border-border bg-background transition-transform duration-200 md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-border px-6 py-6">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              TM
            </div>
            <span className="font-semibold text-foreground">TaskMgr</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {currentMenuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
