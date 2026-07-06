'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { login as loginService, getProfile } from '@/services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user when the app starts
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const profile = await getProfile()
      // Apply any local overrides (e.g., profile photo stored locally if backend missing upload support)
      const overrideKey = `localProfileOverride:${profile._id || profile.id}`
      const overrideRaw = localStorage.getItem(overrideKey)
      let override = {}
      try {
        override = overrideRaw ? JSON.parse(overrideRaw) : {}
      } catch (e) {
        override = {}
      }

      setUser({ ...profile, ...override })
    } catch (error) {
      console.error(error)

      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setIsLoading(true)

      const data = await loginService({
        email,
        password,
      })

      // Save JWT
      localStorage.setItem('token', data.token)

      // Save logged-in user
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      })

      return data
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateLocalProfile = (updates) => {
    // updates: partial user object, may include profilePhoto (data URL)
    if (!updates) return
    setUser((prev) => {
      const next = { ...(prev || {}), ...updates }
      // persist overrides so they survive reloads when backend doesn't support fields like profilePhoto
      const id = next._id || next.id
      if (id) {
        const overrideKey = `localProfileOverride:${id}`
        // store only partial fields we want to override
        const toStore = {}
        if (updates.profilePhoto) toStore.profilePhoto = updates.profilePhoto
        if (updates.name) toStore.name = updates.name
        if (updates.email) toStore.email = updates.email
        try {
          localStorage.setItem(overrideKey, JSON.stringify(toStore))
        } catch (e) {
          // ignore storage errors
        }
      }

      return next
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        initializeAuth,
        updateLocalProfile,
      }}
    >
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