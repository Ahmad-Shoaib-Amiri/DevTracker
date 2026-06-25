'use client'

import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = (email, password) => {
    setIsLoading(true)
    setTimeout(() => {
      // Simulate authentication
      if (email === 'admin@task.com' && password === 'admin') {
        const userData = {
          id: 1,
          name: 'Admin User',
          email: 'admin@task.com',
          role: 'admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
      } else if (email === 'developer@task.com' && password === 'dev123') {
        const userData = {
          id: 2,
          name: 'John Developer',
          email: 'developer@task.com',
          role: 'developer',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev',
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
      } else if (email === 'trainee@task.com' && password === 'trainee') {
        const userData = {
          id: 3,
          name: 'Sarah Trainee',
          email: 'trainee@task.com',
          role: 'trainee',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trainee',
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
      }
      setIsLoading(false)
    }, 500)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const initializeAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('user')
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, initializeAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
