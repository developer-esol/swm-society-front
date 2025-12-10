export interface AdminUser {
  id: string
  email: string
  status: 'Active' | 'Inactive'
  role: string
}
