import { useState, useEffect } from 'react'
import { adminProfileService } from '../../api/services/admin/adminProfileService'
import type { AdminProfile, UpdateProfileData } from '../../types/Admin/profile'

export const useAdminProfile = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = async () => {
    setIsLoading(true)
    try {
      const data = await adminProfileService.getProfile()
      setProfile(data)
      setError(null)
    } catch (err) {
      setError('Failed to load profile')
      console.error('Error loading profile:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const updated = await adminProfileService.updateProfile(data)
      setProfile(updated)
      return { success: true, data: updated }
    } catch (err) {
      const errorMsg = 'Failed to update profile'
      setError(errorMsg)
      console.error('Error updating profile:', err)
      return { success: false, error: errorMsg }
    }
  }

  const updateProfilePicture = async (file: File) => {
    try {
      const updated = await adminProfileService.updateProfilePicture(file)
      setProfile(updated)
      return { success: true, data: updated }
    } catch (err) {
      const errorMsg = 'Failed to upload profile picture'
      setError(errorMsg)
      console.error('Error uploading picture:', err)
      return { success: false, error: errorMsg }
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const success = await adminProfileService.changePassword(currentPassword, newPassword)
      if (success) {
        return { success: true }
      } else {
        return { success: false, error: 'Current password is incorrect' }
      }
    } catch (err) {
      const errorMsg = 'Failed to change password'
      setError(errorMsg)
      console.error('Error changing password:', err)
      return { success: false, error: errorMsg }
    }
  }

  return {
    profile,
    isLoading,
    error,
    loadProfile,
    updateProfile,
    updateProfilePicture,
    changePassword,
  }
}
