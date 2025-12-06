import { create } from 'zustand'
import { accessControlService } from '../api/services/admin/accessControlService'
import type { AccessControlUser } from '../types/Admin/accessControl'

interface AccessControlState {
  users: AccessControlUser[]
  isLoading: boolean
  loadUsers: () => Promise<void>
  addUser: (user: AccessControlUser) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  updateUser: (user: AccessControlUser) => void
}

export const useAccessControlStore = create<AccessControlState>((set) => ({
  users: [],
  isLoading: false,

  loadUsers: async () => {
    set({ isLoading: true })
    try {
      const users = await accessControlService.getAll()
      set({ users, isLoading: false })
    } catch (error) {
      console.error('Failed to load users:', error)
      set({ isLoading: false })
    }
  },

  addUser: async (user: AccessControlUser) => {
    try {
      await accessControlService.addUser(user)
      // Immediately update store with new user
      set((state) => ({
        users: [...state.users, user]
      }))
    } catch (error) {
      console.error('Failed to add user:', error)
    }
  },

  deleteUser: async (userId: string) => {
    try {
      await accessControlService.deleteUser(userId)
      set((state) => ({
        users: state.users.filter((u) => u.id !== userId)
      }))
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  },

  updateUser: (user: AccessControlUser) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === user.id ? user : u))
    }))
  },
}))
