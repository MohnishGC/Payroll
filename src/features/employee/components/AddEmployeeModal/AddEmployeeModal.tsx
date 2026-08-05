import React, { useState, useEffect } from 'react';
import { Modal } from '../../../../components/ui/Modal/Modal';
import { Tabs } from '../../../../components/ui/Tabs/Tabs';
import { AddEmployeeModalHeader } from './AddEmployeeModalHeader';
import { AddEmployeeModalFooter } from './AddEmployeeModalFooter';
import { PersonalInfoFormTab } from './tabs/PersonalInfoFormTab';
import { AccountDetailsFormTab } from './tabs/AccountDetailsFormTab';
import { EducationFormTab } from './tabs/EducationFormTab';
import { DocumentsFormTab } from './tabs/DocumentsFormTab';
import { useEmployeeCodeGenerator } from '../../hooks/useEmployeeCodeGenerator';
import { useAddEmployeeForm, type TabKey } from '../../hooks/useAddEmployeeForm';
import type { EmployeeMaster } from '../../types/employee.types';
import './AddEmployeeModal.css';

export interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeCreated: (newEmp: EmployeeMaster) => void;
  employeeToEdit?: EmployeeMaster | null;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onEmployeeCreated,
  employeeToEdit,
}) => {
  const [activeTabKey, setActiveTabKey] = useState<TabKey>('personal');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState<boolean>(false);

  const {
    code,
    isLoading: isGeneratingCode,
    error: codeError,
    fetchCode,
  } = useEmployeeCodeGenerator();

  const {
    values,
    errors,
    tabStatuses,
    isDirty,
    isSubmitting,
    submitError,
    isUploadingFile,
    uploadMessage,
    setPersonalField,
    setAccountField,
    setEducationList,
    setDocumentList,
    uploadDocumentFiles,
    resetForm,
    populateForm,
    validateAll,
    submitForm,
    updateForm,
  } = useAddEmployeeForm();

  // Fetch next employee code or pre-populate on modal open
  useEffect(() => {
    if (isOpen) {
      setActiveTabKey('personal');
      setShowDiscardConfirm(false);
      
      if (employeeToEdit) {
        populateForm(employeeToEdit);
      } else {
        fetchCode();
      }
    }
  }, [isOpen, employeeToEdit, fetchCode, populateForm]);

  const handleAttemptClose = () => {
    if (isDirty && !employeeToEdit) {
      setShowDiscardConfirm(true);
    } else {
      resetForm();
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardConfirm(false);
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    const { isValid, firstInvalidTab } = validateAll();
    if (!isValid && firstInvalidTab) {
      setActiveTabKey(firstInvalidTab);
      setTimeout(() => {
        const firstErrorEl = document.querySelector('.form-field__error-msg, .input-group--error');
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    let result: EmployeeMaster | null = null;
    if (employeeToEdit) {
      result = await updateForm(employeeToEdit.id, employeeToEdit.code);
    } else {
      result = await submitForm(code);
    }

    if (result) {
      onEmployeeCreated(result);
      onClose();
    }
  };

  const tabItems = [
    { key: 'personal', label: 'Personal Details', status: tabStatuses.personal },
    { key: 'account', label: 'Bank & Statutory', status: tabStatuses.account },
    { key: 'education', label: 'Qualifications', status: tabStatuses.education },
    { key: 'documents', label: 'Documents Attachment', status: tabStatuses.documents },
  ];

  const activeCode = employeeToEdit ? employeeToEdit.code : code;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleAttemptClose}
      className="add-employee-modal"
      size="lg"
      headerContent={
        <AddEmployeeModalHeader
          code={activeCode}
          isGeneratingCode={!employeeToEdit && isGeneratingCode}
          codeError={!employeeToEdit ? codeError : null}
          onRetryCode={fetchCode}
          title={employeeToEdit ? 'Update Employee Details' : 'Add New Employee'}
        />
      }
      footer={
        <AddEmployeeModalFooter
          onCancel={handleAttemptClose}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting || isUploadingFile}
          submitLabel={employeeToEdit ? 'Update Employee' : 'Create Employee'}
          loadingText={isUploadingFile ? 'Uploading Files...' : (employeeToEdit ? 'Updating Record...' : 'Creating Record...')}
        />
      }
    >
      <div className="add-employee-modal__wrapper">
        {/* Fixed Tab Bar with Status Dots */}
        <div className="add-employee-modal__tab-bar">
          <Tabs
            items={tabItems}
            activeKey={activeTabKey}
            onChange={(k) => setActiveTabKey(k as TabKey)}
          />
        </div>

        {/* Form Error or Upload Notification Banner */}
        {(submitError || uploadMessage) && (
          <div
            className={`add-employee-modal__submit-error ${
              uploadMessage?.type === 'success' ? 'add-employee-modal__submit-error--success' : ''
            }`}
            role="alert"
          >
            <span>{submitError || uploadMessage?.text}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="add-employee-modal__form-body">
          {activeTabKey === 'personal' && (
            <PersonalInfoFormTab
              values={values.personal}
              errors={errors.personal}
              onChange={setPersonalField}
              disabled={isSubmitting || isUploadingFile}
            />
          )}

          {activeTabKey === 'account' && (
            <AccountDetailsFormTab
              values={values.account}
              errors={errors.account}
              onChange={setAccountField}
              disabled={isSubmitting || isUploadingFile}
            />
          )}

          {activeTabKey === 'education' && (
            <EducationFormTab
              entries={values.education}
              errors={errors.education}
              onChangeList={setEducationList}
              disabled={isSubmitting || isUploadingFile}
            />
          )}

          {activeTabKey === 'documents' && (
            <DocumentsFormTab
              files={values.documents}
              errors={errors.documents}
              onChangeFiles={setDocumentList}
              uploadDocumentFiles={uploadDocumentFiles}
              disabled={isSubmitting || isUploadingFile}
            />
          )}
        </div>

        {/* Confirm Discard Dialog Overlay */}
        {showDiscardConfirm && (
          <div className="add-employee-modal__discard-overlay">
            <div className="add-employee-modal__discard-box">
              <h3 className="add-employee-modal__discard-title">Discard Unsaved Changes?</h3>
              <p className="add-employee-modal__discard-desc">
                You have unsaved changes in the employee creation form. Are you sure you want to discard them?
              </p>
              <div className="add-employee-modal__discard-actions">
                <button
                  type="button"
                  className="add-employee-modal__discard-btn add-employee-modal__discard-btn--confirm"
                  onClick={handleConfirmDiscard}
                >
                  Discard Changes
                </button>
                <button
                  type="button"
                  className="add-employee-modal__discard-btn add-employee-modal__discard-btn--keep"
                  onClick={() => setShowDiscardConfirm(false)}
                >
                  Keep Editing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
export default AddEmployeeModal;
