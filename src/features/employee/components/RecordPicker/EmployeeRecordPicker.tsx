import React, { useState } from 'react';
import { Input } from '../../../../components/ui/Input/Input';
import { Icon } from '../../../../components/icons/Icon';
import { EmployeeSearchModal } from './EmployeeSearchModal';
import type { EmployeeMaster } from '../../types/employee.types';
import './EmployeeRecordPicker.css';

export interface EmployeeRecordPickerProps {
  selectedEmployee: EmployeeMaster | null;
  onSelectEmployee: (employee: EmployeeMaster) => void;
  onClearEmployee: () => void;
  onSearchCodeOrName?: (codeOrName: string) => void;
}

export const EmployeeRecordPicker: React.FC<EmployeeRecordPickerProps> = ({
  selectedEmployee,
  onSelectEmployee,
  onClearEmployee,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const displayValue = selectedEmployee
    ? `${selectedEmployee.code} - ${selectedEmployee.name}`
    : inputValue;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onClearEmployee();
  };

  return (
    <div className="employee-record-picker">
      <label className="employee-record-picker__label" htmlFor="record-picker-input">
        Select Employee Record
      </label>

      <div className="employee-record-picker__row">
        <div className="employee-record-picker__input-container">
          <Input
            id="record-picker-input"
            type="text"
            variant="borderless"
            placeholder="Type Employee Code or Name..."
            iconName="user"
            value={displayValue}
            onChange={(e) => {
              if (selectedEmployee) onClearEmployee();
              setInputValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="employee-record-picker__actions">
          <button
            type="button"
            className="employee-record-picker__btn employee-record-picker__btn--search"
            onClick={() => setIsModalOpen(true)}
            title="Search and select employee"
            aria-label="Search employee record"
          >
            <Icon name="search" size={18} />
          </button>

          <button
            type="button"
            className="employee-record-picker__btn employee-record-picker__btn--clear"
            onClick={handleClear}
            title="Clear selected employee"
            aria-label="Clear employee record"
          >
            <Icon name="refresh" size={18} />
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      <EmployeeSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectEmployee={(emp) => {
          setInputValue(`${emp.code} - ${emp.name}`);
          onSelectEmployee(emp);
        }}
      />
    </div>
  );
};
