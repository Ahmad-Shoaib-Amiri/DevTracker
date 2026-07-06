'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { useAuth } from '@/context/AuthContext'
import { updateUser } from '@/services/userService'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const { user, initializeAuth, updateLocalProfile } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [photoFile, setPhotoFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', password: '' })
      setPreview(user.profilePhoto || user.avatar || null)
    }
  }, [user])

  useEffect(() => {
    if (!photoFile) return
    const url = URL.createObjectURL(photoFile)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [photoFile])

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f) setPhotoFile(f)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      setLoading(true)

      let res
      // If a file is selected, send multipart/form-data
      if (photoFile || form.password) {
        const fd = new FormData()
        if (form.name) fd.append('name', form.name)
        if (form.email) fd.append('email', form.email)
        if (form.password) fd.append('password', form.password)
        if (photoFile) fd.append('profilePhoto', photoFile)

        res = await updateUser(user._id || user.id, fd)
      } else {
        // send JSON
        const payload = {
          name: form.name,
          email: form.email,
        }
        res = await updateUser(user._id || user.id, payload)
      }

      // Refresh auth/profile
      await initializeAuth()
      alert('Profile updated successfully')
      setForm((f) => ({ ...f, password: '' }))
      setPhotoFile(null)
    } catch (err) {
      console.error('Update failed', err)
      // Fallback: if backend doesn't accept uploads or is missing, store photo locally and update auth state
      try {
        let photoDataUrl = null
        if (photoFile) {
          photoDataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(photoFile)
          })
        }

        const localUpdates = {}
        if (form.name) localUpdates.name = form.name
        if (form.email) localUpdates.email = form.email
        if (photoDataUrl) localUpdates.profilePhoto = photoDataUrl

        if (Object.keys(localUpdates).length) {
          updateLocalProfile(localUpdates)
          alert('Saved profile changes locally (backend update failed).')
          setForm((f) => ({ ...f, password: '' }))
          setPhotoFile(null)
        } else {
          alert('Failed to update profile (no local changes to save).')
        }
      } catch (fallbackErr) {
        console.error('Local fallback failed', fallbackErr)
        alert('Failed to update profile')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-6">Please sign in to view your profile.</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-muted-foreground">No photo</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Change Photo</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Leave blank to keep current password"
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
