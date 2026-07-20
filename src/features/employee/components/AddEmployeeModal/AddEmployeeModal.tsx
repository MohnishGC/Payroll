import React, { useState, useEffect } from 'react';
import { Modal } from '../../../../components/ui/Modal/Modal';
import { Tabs } from '../../../../components/ui/Tabs/Tabs';
import { AddEmployeeModalHeader } from './AddEmployeeModalHeader';
import { AddEmployeeModalFooter } from './AddEmployeeModalFooter';
import { addEmployeeTabsRegistry } from './formConfig/addEmployeeTabsRegistry';
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
  onEmployeeCreated: (newEmployee: EmployeeMaster) => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onEmployeeCreated,
}) => {
  const [activeTabKey, setActiveTabKey] = useState<TabKey>('personal');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState<boolean>(false);

  // Hooks
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
    setPersonalField,
    setAccountField,
    setEducationList,
    setDocumentList,
    resetForm,
    validateAll,
    submitForm,
  } = useAddEmployeeForm();

  // Fetch next employee code on modal open
  useEffect(() => {
    if (isOpen) {
      fetchCode();
      setActiveTabKey('personal');
      setShowDiscardConfirm(false);
    }
  }, [isOpen, fetchCode]);

  const handleAttemptClose = () => {
    if (isDirty) {
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
      // Auto-scroll to first invalid element
      setTimeout(() => {
        const firstErrorEl = document.querySelector('.form-field__error-msg, .input-group--error');
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    const created = await submitForm(code);
    if (created) {
      onEmployeeCreated(created);
      onClose();
    }
  };

  const tabItems = addEmployeeTabsRegistry.map((tab) => ({
    key: tab.key,
    label: tab.label,
    status: tabStatuses[tab.key],
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleAttemptClose}
      size="xl"
      className="add-employee-modal"
      headerContent={
        <AddEmployeeModalHeader
          code={code}
          isGeneratingCode={isGeneratingCode}
          codeError={codeError}
          onRetryCode={fetchCode}
        />
      }
      footer={
        <AddEmployeeModalFooter
          onCancel={handleAttemptClose}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
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

        {/* Form Error Banner */}
        {submitError && (
          <div className="add-employee-modal__submit-error" role="alert">
            <span>{submitError}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="add-employee-modal__form-body">
          {activeTabKey === 'personal' && (
            <PersonalInfoFormTab
              values={values.personal}
              errors={errors.personal}
              onChange={setPersonalField}
              disabled={isSubmitting}
            />
          )}

          {activeTabKey === 'account' && (
            <AccountDetailsFormTab
              values={values.account}
              errors={errors.account}
              onChange={setAccountField}
              disabled={isSubmitting}
            />
          )}

          {activeTabKey === 'education' && (
            <EducationFormTab
              entries={values.education}
              errors={errors.education}
              onChangeList={setEducationList}
              disabled={isSubmitting}
            />
          )}

          {activeTabKey === 'documents' && (
            <DocumentsFormTab
              files={values.documents}
              errors={errors.documents}
              onChangeFiles={setDocumentList}
              disabled={isSubmitting}
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
