import type { Role, Permission } from '../../../types/Admin/roles'

// Mock permissions data
const mockPermissions: Permission[] = [
  { id: '1', name: 'View Dashboard Analytics', category: 'Dashboard', enabled: true },
  { id: '2', name: 'User Top Selling Products', category: 'Dashboard', enabled: true },
  { id: '3', name: 'Search Products', category: 'Products Management', enabled: true },
  { id: '4', name: 'Create new products', category: 'Products Management', enabled: true },
  { id: '5', name: 'Update existing products', category: 'Products Management', enabled: true },
  { id: '6', name: 'Remove existing products', category: 'Products Management', enabled: true },
  { id: '7', name: 'View available stock', category: 'Stock Management', enabled: true },
  { id: '8', name: 'Change stock price', category: 'Stock Management', enabled: true },
  { id: '9', name: 'Remove existing stock', category: 'Stock Management', enabled: true },
  { id: '10', name: 'Change stock quantity', category: 'Stock Management', enabled: true },
  { id: '11', name: 'Add new stock', category: 'Stock Management', enabled: true },
  { id: '12', name: 'Adjust loyalty points of customers', category: 'Loyalty Points Management', enabled: true },
  { id: '13', name: 'View Sales Information', category: 'Sales', enabled: true },
  { id: '14', name: 'Update delivery status', category: 'Sales', enabled: true },
  { id: '15', name: 'View existing customers', category: 'Users', enabled: true },
  { id: '16', name: 'Deactivate Accounts', category: 'Users', enabled: true },
]

class RolesService {
  private mockRoles: Role[] = [
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access and control',
      icon: '🔴',
      usersCount: 2,
      permissionsCount: 16,
      status: 'Active',
      permissions: mockPermissions,
    },
    {
      id: '2',
      name: 'Admin',
      description: 'Administrative access to most features',
      icon: '🔵',
      usersCount: 3,
      permissionsCount: 14,
      status: 'Active',
      permissions: mockPermissions.slice(0, 14),
    },
    {
      id: '3',
      name: 'Manager',
      description: 'Manage products, orders and customers',
      icon: '🟢',
      usersCount: 12,
      permissionsCount: 12,
      status: 'Active',
      permissions: mockPermissions.slice(0, 12),
    },
    {
      id: '4',
      name: 'Support',
      description: 'Customer support and order management',
      icon: '🟡',
      usersCount: 8,
      permissionsCount: 8,
      status: 'Active',
      permissions: mockPermissions.slice(0, 8),
    },
  ]

  async getAll(): Promise<Role[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('rolesService.getAll() - returning roles:', this.mockRoles)
        resolve(this.mockRoles)
      }, 300)
    })
  }

  async getById(id: string): Promise<Role | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockRoles.find((role) => role.id === id))
      }, 300)
    })
  }

  async create(role: Omit<Role, 'id'>): Promise<Role> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRole: Role = {
          ...role,
          id: String(this.mockRoles.length + 1),
        }
        this.mockRoles.push(newRole)
        resolve(newRole)
      }, 300)
    })
  }

  async update(id: string, role: Partial<Role>): Promise<Role | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.mockRoles.findIndex((r) => r.id === id)
        if (index > -1) {
          this.mockRoles[index] = { ...this.mockRoles[index], ...role }
          resolve(this.mockRoles[index])
        } else {
          resolve(undefined)
        }
      }, 300)
    })
  }

  async delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.mockRoles.findIndex((r) => r.id === id)
        if (index > -1) {
          this.mockRoles.splice(index, 1)
          resolve(true)
        } else {
          resolve(false)
        }
      }, 300)
    })
  }

  async search(query: string): Promise<Role[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.mockRoles.filter(
          (role) =>
            role.name.toLowerCase().includes(query.toLowerCase()) ||
            role.description.toLowerCase().includes(query.toLowerCase())
        )
        resolve(filtered)
      }, 300)
    })
  }
}

export const rolesService = new RolesService()
export { mockPermissions }
