export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
}

export interface SidebarState {
  isOpen: boolean;
  activeMenu: string;
}
