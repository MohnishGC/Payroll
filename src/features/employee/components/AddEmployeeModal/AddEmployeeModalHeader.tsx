import React from 'react';
import { Icon } from '../../../../components/icons/Icon';
import './AddEmployeeModalHeader.css';

export interface AddEmployeeModalHeaderProps {
  code: string;
  isGeneratingCode: boolean;
  codeError: string | null;
  onRetryCode: () => void;
}

export const AddEmployeeModalHeader: React.FC<AddEmployeeModalHeaderProps> = ({
  code,
  isGeneratingCode,
  codeError,
  onRetryCode,
}) => {
  return (
    <div className="add-employee-modal-header">
      <div className="add-employee-modal-header__title-group">
        <h2 className="add-employee-modal-header__title">Add New Employee</h2>

        {/* Employee Code Readonly Pill */}
        <div className="add-employee-modal-header__code-pill" title="System-generated Employee Code">
          <span className="add-employee-modal-header__code-label">CODE:</span>
          {isGeneratingCode ? (
            <span className="add-employee-modal-header__loading">
              <Icon name="spinner" size={12} className="add-employee-modal-header__spinner" />
              <span>Generating...</span>
            </span>
          ) : codeError ? (
            <button
              type="button"
              className="add-employee-modal-header__retry-btn"
              onClick={onRetryCode}
              title="Click to retry generating code"
            >
              <span>Error</span>
              <Icon name="refresh" size={12} />
            </button>
          ) : (
            <strong className="add-employee-modal-header__code-value">{code || 'EMP-1004'}</strong>
          )}
        </div>
      </div>
    </div>
  );
};
