import type { TabKey } from '../../../hooks/useAddEmployeeForm';

export interface AddEmployeeTabMeta {
  key: TabKey;
  label: string;
}

export const addEmployeeTabsRegistry: AddEmployeeTabMeta[] = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'account', label: 'Account Details' },
  { key: 'education', label: 'Education' },
  { key: 'documents', label: 'Documents' },
];
