import React from 'react';
import type { EmployeeMaster } from '../../types/employee.types';
import { PersonalTab } from './tabs/PersonalTab';
import { AccountDetailsTab } from './tabs/AccountDetailsTab';
import { EducationTab } from './tabs/EducationTab';
import { DocumentsTab } from './tabs/DocumentsTab';

export interface TabRegistryEntry {
  key: string;
  label: string;
  component: React.ComponentType<{
    employee: EmployeeMaster;
    isEditing: boolean;
    onUpdate: (updated: Partial<EmployeeMaster>) => void;
  }>;
}

export const tabsRegistry: TabRegistryEntry[] = [
  {
    key: 'personal',
    label: 'Personal',
    component: PersonalTab,
  },
  {
    key: 'account',
    label: 'Account Details',
    component: AccountDetailsTab,
  },
  {
    key: 'education',
    label: 'Education',
    component: EducationTab,
  },
  {
    key: 'documents',
    label: 'Documents',
    component: DocumentsTab,
  },
];
