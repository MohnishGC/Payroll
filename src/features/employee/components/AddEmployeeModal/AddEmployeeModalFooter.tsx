import React from 'react';
import { Button } from '../../../../components/ui/Button/Button';
import './AddEmployeeModalFooter.css';

export interface AddEmployeeModalFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
  loadingText?: string;
}

export const AddEmployeeModalFooter: React.FC<AddEmployeeModalFooterProps> = ({
  onCancel,
  onSubmit,
  isSubmitting,
  submitLabel = 'Create Employee',
  loadingText = 'Creating Record...',
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
        loadingText={loadingText}
      >
        {submitLabel}
      </Button>
    </div>
  );
};
