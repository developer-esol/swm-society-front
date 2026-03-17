export interface Permission {
  id: number
  name: string
  description: string
  resource: string
  action: string
}

export interface Role {
  id: number
  name: string
  description: string
  permissions: Permission[]
}

export interface CreateRoleRequest {
  name: string
  description: string
  permissionIds: number[]
}

export interface PermissionCategory {
  category: string
  permissions: Permission[]
}
