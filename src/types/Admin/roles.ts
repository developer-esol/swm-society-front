export interface Permission {
  id: string
  name: string
  category: string
  enabled: boolean
}

export interface Role {
  id: string
  name: string
  description: string
  icon: string
  usersCount: number
  permissionsCount: number
  status: string
  permissions: Permission[]
}

export interface PermissionCategory {
  category: string
  permissions: Permission[]
}
