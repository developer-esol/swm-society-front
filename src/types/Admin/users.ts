export interface AdminUser {
  id: string
  numericId?: number // Numeric ID for backend operations
  email: string
  status: 'Active' | 'Inactive'
  role: string | number // Can be role ID or role name
  roleId?: number // Store original numeric role ID
}
