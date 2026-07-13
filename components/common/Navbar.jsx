'use client'

import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useRouter } from 'next/navigation'
import { Bell, LogOut, Moon, Sun, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import notificationService from '@/services/notificationService'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications()
        setNotifications(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load notifications', err)
      }
    }

    fetchNotifications()
  }, [user])

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-20 border-b border-border bg-background md:left-64">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-muted-foreground hover:text-foreground">
              <Bell size={20} />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-background shadow-lg z-50">
                <div className="px-4 py-2 border-b border-border font-medium">Notifications</div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="p-4 text-sm text-muted-foreground">No notifications</div>
                  )}
                  {notifications.map((n) => (
                    <div key={n._id} className={`px-4 py-3 border-b border-border ${n.isRead ? 'text-muted-foreground' : 'font-medium'}`}>
                      <div className="flex justify-between items-start">
                        <div className="text-sm">{n.message}</div>
                        <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                      {!n.isRead && (
                        <div className="mt-2">
                          <button
                            onClick={async () => {
                              try {
                                await notificationService.markAsRead(n._id)
                                setNotifications((prev) => prev.map(p => p._id === n._id ? { ...p, isRead: true } : p))
                              } catch (err) {
                                console.error('Failed to mark notification read', err)
                              }
                            }}
                            className="text-xs text-primary"
                          >
                            Mark as read
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
            >
              <img
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=man&gender=male&facialHairProbability=100'}
                alt={user?.name}
                className="size-8 rounded-full"
              />
              <div className="hidden sm:block text-sm">
                <p className="font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-background shadow-lg">
                <div className="border-b border-border px-4 py-3">
                  <p className="font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowMenu(false)
                    router.push('/profile')
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <User size={16} />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-muted"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
