import React, { useState } from 'react';
import { Icon } from '../../../components/icons/Icon';
import { Button } from '../../../components/ui/Button/Button';
import { EmployeeRecordPicker } from '../components/RecordPicker/EmployeeRecordPicker';
import { EmployeeBasicInfoCard } from '../components/EmployeeBasicInfoCard/EmployeeBasicInfoCard';
import { EmployeeDetailTabs } from '../components/EmployeeDetailTabs/EmployeeDetailTabs';
import { EmployeeReportsSection } from '../components/EmployeeReportsSection/EmployeeReportsSection';
import { AddEmployeeModal } from '../components/AddEmployeeModal/AddEmployeeModal';
import { useSelectedEmployee } from '../hooks/useSelectedEmployee';
import './EmployeeMasterPage.css';

export const EmployeeMasterPage: React.FC = () => {
  const {
    selectedEmployee,
    isLoading,
    isEditing,
    setIsEditing,
    error,
    selectEmployee,
    saveEmployee,
    removeEmployee,
    clearSelectedEmployee,
  } = useSelectedEmployee();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  return (
    <div className="employee-master-page">
      {/* Top Page Header Row */}
      <div className="employee-master-page__header">
        <div>
          <h1 className="employee-master-page__title">Employee Master</h1>
          <p className="employee-master-page__subtitle">
            Centralized employee directory, personal details, bank accounts, education, and payroll reports.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="employee-master-page__add-btn"
        >
          <Icon name="plus" size={16} />
          <span>Add New Employee</span>
        </Button>
      </div>

      {/* SECTION 0: Record Picker (Borderless input + Search & Clear) */}
      <section className="employee-master-page__section">
        <EmployeeRecordPicker
          selectedEmployee={selectedEmployee}
          onSelectEmployee={selectEmployee}
          onClearEmployee={clearSelectedEmployee}
        />
      </section>

      {/* General Error Banner */}
      {error && (
        <div className="employee-master-page__error-banner" role="alert">
          <Icon name="alertCircle" size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="employee-master-page__loading">
          <Icon name="spinner" size={28} className="employee-master-page__spinner" />
          <span>Loading employee record details...</span>
        </div>
      ) : !selectedEmployee ? (
        /* Empty State */
        <div className="employee-master-page__empty-state">
          <div className="employee-master-page__empty-icon-badge">
            <Icon name="users" size={40} color="var(--color-primary)" />
          </div>
          <h2 className="employee-master-page__empty-title">No Employee Selected</h2>
          <p className="employee-master-page__empty-subtext">
            Use the Employee Code or Name input above, or click the search icon to search and select an employee record.
          </p>
        </div>
      ) : (
        /* Selected Employee Layout */
        <div className="employee-master-page__content">
          {/* Two-Column Grid: Basic Info Card (Left) & Tabbed Details (Right) */}
          <div className="employee-master-page__two-column-grid">
            <EmployeeBasicInfoCard
              employee={selectedEmployee}
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing((prev) => !prev)}
              onSave={saveEmployee}
              onDelete={removeEmployee}
            />

            <EmployeeDetailTabs
              employee={selectedEmployee}
              isEditing={isEditing}
              onUpdate={saveEmployee}
            />
          </div>

          {/* Section 3: Reports Section */}
          <section className="employee-master-page__section">
            <EmployeeReportsSection employee={selectedEmployee} />
          </section>
        </div>
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEmployeeCreated={(newEmp) => selectEmployee(newEmp)}
      />
    </div>
  );
};

export default EmployeeMasterPage;
