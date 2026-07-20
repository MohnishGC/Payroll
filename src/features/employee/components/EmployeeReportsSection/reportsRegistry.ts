import React from 'react';
import type { EmployeeMaster } from '../../types/employee.types';
import { PayslipHistoryReport } from './reports/PayslipHistoryReport';
import { AttendanceLeaveReport } from './reports/AttendanceLeaveReport';

export interface ReportRegistryEntry {
  key: string;
  label: string;
  component: React.ComponentType<{ employee: EmployeeMaster }>;
}

export const reportsRegistry: ReportRegistryEntry[] = [
  {
    key: 'payslips',
    label: 'Payslip History',
    component: PayslipHistoryReport,
  },
  {
    key: 'attendance-leave',
    label: 'Attendance & Leave',
    component: AttendanceLeaveReport,
  },
];
