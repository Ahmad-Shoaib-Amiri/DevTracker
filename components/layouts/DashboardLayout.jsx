'use client'

import { Sidebar } from '@/components/common/Sidebar'
import { Navbar } from '@/components/common/Navbar'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function DashboardLayout({ children }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />
      <main className="md:ml-64 pt-16">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
