export interface AdminProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  role: string
  avatar?: string
  joinDate: string
  lastLogin: string
  status: 'active' | 'inactive'
  bio?: string
  address?: string
  city?: string
  country?: string
}

export interface UpdateProfileData {
  firstName: string
  lastName: string
  phone: string
  department: string
  bio?: string
  address?: string
  city?: string
  country?: string
}

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
  joinDate: string
  lastLogin: string
  bio?: string
  address?: string
  city?: string
  country?: string
  postalCode?: string
}

export interface UpdateUserProfileData {
  firstName?: string
  lastName?: string
  phone?: string
  bio?: string
  address?: string
  city?: string
  country?: string
  postalCode?: string
}

