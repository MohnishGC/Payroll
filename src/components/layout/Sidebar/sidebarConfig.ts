import type { IconName } from '../../icons/icon-registry';

export interface SidebarSubItem {
  label: string;
  path: string;
  badge?: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: IconName;
  path?: string;
  children?: SidebarSubItem[];
}

export interface SidebarSection {
  sectionLabel: string;
  items: SidebarItem[];
}

export const sidebarConfig: SidebarSection[] = [
  {
    sectionLabel: 'Main Menu',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'layoutGrid',
        path: '/dashboard',
      },
    ],
  },
  {
    sectionLabel: 'HR Management',
    items: [
      {
        id: 'employee',
        label: 'Employee',
        icon: 'users',
        children: [
          { label: 'Employee Master', path: '/employee/master' },
          { label: 'Employee List', path: '/employee/list' },
          { label: 'Add Employee', path: '/employee/add' },
          { label: 'Departments', path: '/employee/departments' },
          { label: 'Designations', path: '/employee/designations' },
          { label: 'Documents', path: '/employee/documents' },
        ],
      },
      {
        id: 'settings',
        label: 'Setting',
        icon: 'settings',
        children: [
          { label: 'User', path: '/settings/users' },
          { label: 'City', path: '/settings/cities' },
          { label: 'Branch', path: '/settings/branches' },
          { label: 'Financial Year', path: '/settings/financial-year' },
          { label: 'Holiday', path: '/settings/holidays' },
        ],
      },
    ],
  },
];
