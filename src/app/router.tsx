import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './router/ProtectedRoute';

// Layout
import { DashboardLayout } from '../components/layout/DashboardLayout/DashboardLayout';

// Auth Page
import { LoginPage } from '../features/auth/pages/LoginPage';

// Dashboard Page
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';

// Employee Pages
import { EmployeeMasterPage } from '../features/employee/pages/EmployeeMasterPage';
import { EmployeeListPage } from '../features/employee/pages/EmployeeListPage';
import { AddEmployeePage } from '../features/employee/pages/AddEmployeePage';
import { DocumentsPage } from '../features/employee/pages/DocumentsPage';
// Settings Pages
import { DepartmentsPage } from '../features/settings/pages/DepartmentsPage';
import { DesignationsPage } from '../features/settings/pages/DesignationsPage';
import { UsersPage } from '../features/settings/pages/UsersPage';
import { CitiesPage } from '../features/settings/pages/CitiesPage';
import { BranchesPage } from '../features/settings/pages/BranchesPage';
import { FinancialYearPage } from '../features/settings/pages/FinancialYearPage';
import { HolidaysPage } from '../features/settings/pages/HolidaysPage';
import { ApplicationSettingsPage } from '../features/settings/pages/ApplicationSettingsPage';
import { PayrollConfigurationPage } from '../features/settings/pages/PayrollConfigurationPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Dashboard Shell Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Employee Submenu Routes */}
        <Route path="employee/master" element={<EmployeeMasterPage />} />
        <Route path="employee/list" element={<EmployeeListPage />} />
        <Route path="employee/add" element={<AddEmployeePage />} />
        <Route path="employee/documents" element={<DocumentsPage />} />

        {/* Settings Submenu Routes */}
        <Route path="settings/users" element={<UsersPage />} />
        <Route path="settings/cities" element={<CitiesPage />} />
        <Route path="settings/branches" element={<BranchesPage />} />
        <Route path="settings/departments" element={<DepartmentsPage />} />
        <Route path="settings/designations" element={<DesignationsPage />} />
        <Route path="settings/financial-year" element={<FinancialYearPage />} />
        <Route path="settings/holidays" element={<HolidaysPage />} />
        <Route path="settings/application-settings" element={<ApplicationSettingsPage />} />
        <Route path="settings/payroll-configuration" element={<PayrollConfigurationPage />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
