export interface AccessControlUser {
  id: string
  name: string
  email: string
  role: 'Super Admin' | 'Manager' | 'User'
}

export interface AddAccessControlUserFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  role: 'Super Admin' | 'Manager' | 'User'
}
