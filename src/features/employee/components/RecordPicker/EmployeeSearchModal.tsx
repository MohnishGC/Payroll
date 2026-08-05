import React from 'react';
import { Modal } from '../../../../components/ui/Modal/Modal';
import { Input } from '../../../../components/ui/Input/Input';
import { Table } from '../../../../components/ui/Table/Table';
import type { ColumnDef } from '../../../../components/ui/Table/Table';
import { Icon } from '../../../../components/icons/Icon';
import { useEmployeeSearch } from '../../hooks/useEmployeeSearch';
import type { EmployeeMaster } from '../../types/employee.types';
import './EmployeeSearchModal.css';

export interface EmployeeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmployee: (employee: EmployeeMaster) => void;
}

export const EmployeeSearchModal: React.FC<EmployeeSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectEmployee,
}) => {
  const {
    query,
    setQuery,
    department,
    setDepartment,
    page,
    totalPages,
    items,
    isLoading,
    handlePageChange,
    clearSearch,
  } = useEmployeeSearch(5);

  const columns: ColumnDef<EmployeeMaster>[] = [
    {
      key: 'action',
      header: 'ACTION',
      width: '100px',
      render: (emp) => (
        <button
          type="button"
          className="employee-search-modal__select-btn"
          onClick={() => {
            onSelectEmployee(emp);
            onClose();
          }}
        >
          Select
        </button>
      ),
    },
    {
      key: 'code',
      header: 'EMPLOYEE CODE',
      render: (emp) => (
        <span className="employee-search-modal__code-badge">{emp.code}</span>
      ),
    },
    {
      key: 'name',
      header: 'NAME',
      render: (emp) => (
        <div className="employee-search-modal__name-cell">
          <div className="employee-search-modal__avatar-mini">
            {emp.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <span className="employee-search-modal__name-text">{emp.name}</span>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'DEPARTMENT',
    },
    {
      key: 'designation',
      header: 'DESIGNATION',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Search and Select Employee"
      maxWidth="780px"
    >
      <div className="employee-search-modal">
        {/* Filters Row */}
        <div className="employee-search-modal__filter-row">
          <div className="employee-search-modal__dept-filter">
            <label className="employee-search-modal__label">Department</label>
            <select
              className="employee-search-modal__select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="0">-- Select Department --</option>
              <option value="Engineering">Engineering</option>
              <option value="HR & Operations">HR & Operations</option>
              <option value="Finance & Tax">Finance & Tax</option>
            </select>
          </div>

          <div className="employee-search-modal__search-input-wrapper">
            <Input
              id="modal-employee-search"
              type="text"
              placeholder="Search code or name..."
              iconName="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              variant="borderless"
            />
            {query && (
              <button
                type="button"
                className="employee-search-modal__clear-search-btn"
                onClick={clearSearch}
                title="Clear search"
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Paginated Table */}
        <Table
          columns={columns}
          data={items}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyText="No matching employee records found."
          pagination={{
            currentPage: page,
            totalPages,
            onPageChange: handlePageChange,
          }}
        />
      </div>
    </Modal>
  );
};
