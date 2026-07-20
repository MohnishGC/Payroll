import React from 'react';
import { Button } from '../../../../components/ui/Button/Button';
import './AddEmployeeModalFooter.css';

export interface AddEmployeeModalFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const AddEmployeeModalFooter: React.FC<AddEmployeeModalFooterProps> = ({
  onCancel,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <div className="add-employee-modal-footer">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="add-employee-modal-footer__cancel-btn"
      >
        Cancel
      </Button>

      <Button
        type="button"
        variant="primary"
        onClick={onSubmit}
        isLoading={isSubmitting}
        loadingText="Creating Record..."
      >
        Create Employee
      </Button>
    </div>
  );
};
