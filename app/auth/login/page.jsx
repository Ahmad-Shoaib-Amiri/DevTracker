'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export default function LoginPage() {
  const { user, isLoading, login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      router.push(`/${user.role}/dashboard`)
    }
  }, [user, router])

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    login(email, password)
    setPassword('')
  }

  const demoAccounts = [
    { email: 'admin@task.com', password: 'admin', role: 'Admin' },
    { email: 'developer@task.com', password: 'dev123', role: 'Developer' },
    { email: 'trainee@task.com', password: 'trainee', role: 'Trainee' },
  ]

  const fillDemoCredentials = (email, password) => {
    setEmail(email)
    setPassword(password)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-lg border border-border bg-background shadow-lg p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
              TM
            </div>
            <h1 className="text-2xl font-bold text-foreground">TaskMgr</h1>
          </div>

          {/* Title */}
          <h2 className="text-center text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Sign in to manage your tasks and team
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 pr-10 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="border-t border-border pt-6">
            <p className="text-xs text-center text-muted-foreground mb-3 font-medium">Demo Accounts</p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemoCredentials(account.email, account.password)}
                  className="w-full rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
                >
                  {account.role} Demo
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Employee Task Management System © 2026
        </p>
      </div>
    </div>
  )
}
