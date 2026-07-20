import React, { useState } from 'react';
import { Icon } from '../../../../components/icons/Icon';
import { Input } from '../../../../components/ui/Input/Input';
import type { EmployeeMaster } from '../../types/employee.types';
import './EmployeeBasicInfoCard.css';

export interface EmployeeBasicInfoCardProps {
  employee: EmployeeMaster;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: (updated: Partial<EmployeeMaster>) => Promise<boolean>;
  onDelete: () => void;
}

export const EmployeeBasicInfoCard: React.FC<EmployeeBasicInfoCardProps> = ({
  employee,
  isEditing,
  onToggleEdit,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Partial<EmployeeMaster>>({
    name: employee.name,
    code: employee.code,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
    joinedDate: employee.joinedDate,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  const handleChange = (field: keyof EmployeeMaster, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  return (
    <div className="employee-basic-info-card">
      {/* Top Header Row with Actions */}
      <div className="employee-basic-info-card__header">
        <div className="employee-basic-info-card__avatar-section">
          {employee.avatarUrl ? (
            <img
              src={employee.avatarUrl}
              alt={employee.name}
              className="employee-basic-info-card__avatar-img"
            />
          ) : (
            <div className="employee-basic-info-card__avatar-fallback">{initials}</div>
          )}
          <div className="employee-basic-info-card__title-group">
            <h2 className="employee-basic-info-card__name">{employee.name}</h2>
            <span className="employee-basic-info-card__code-badge">{employee.code}</span>
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="employee-basic-info-card__actions">
          {!isEditing ? (
            <>
              <button
                type="button"
                className="employee-basic-info-card__action-btn employee-basic-info-card__action-btn--edit"
                onClick={onToggleEdit}
                title="Edit Employee Information"
                aria-label="Edit employee information"
              >
                <Icon name="key" size={16} />
              </button>
              <button
                type="button"
                className="employee-basic-info-card__action-btn employee-basic-info-card__action-btn--delete"
                onClick={() => setShowDeleteConfirm(true)}
                title="Delete Employee Record"
                aria-label="Delete employee record"
              >
                <Icon name="close" size={16} />
              </button>
            </>
          ) : (
            <div className="employee-basic-info-card__save-cancel-group">
              <button
                type="button"
                className="employee-basic-info-card__save-btn"
                onClick={handleSaveClick}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                className="employee-basic-info-card__cancel-btn"
                onClick={onToggleEdit}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Popup Overlay */}
      {showDeleteConfirm && (
        <div className="employee-basic-info-card__delete-alert">
          <span>Are you sure you want to delete {employee.name}?</span>
          <div className="employee-basic-info-card__delete-btn-group">
            <button
              type="button"
              className="employee-basic-info-card__confirm-delete-btn"
              onClick={() => {
                setShowDeleteConfirm(false);
                onDelete();
              }}
            >
              Yes, Delete
            </button>
            <button
              type="button"
              className="employee-basic-info-card__cancel-delete-btn"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Detail Fields List */}
      <div className="employee-basic-info-card__details">
        {/* Department */}
        <div className="employee-basic-info-card__field">
          <span className="employee-basic-info-card__field-label">Department</span>
          {isEditing ? (
            <Input
              id="edit-department"
              value={formData.department || ''}
              onChange={(e) => handleChange('department', e.target.value)}
            />
          ) : (
            <span className="employee-basic-info-card__field-value">{employee.department}</span>
          )}
        </div>

        {/* Designation */}
        <div className="employee-basic-info-card__field">
          <span className="employee-basic-info-card__field-label">Designation</span>
          {isEditing ? (
            <Input
              id="edit-designation"
              value={formData.designation || ''}
              onChange={(e) => handleChange('designation', e.target.value)}
            />
          ) : (
            <span className="employee-basic-info-card__field-value">{employee.designation}</span>
          )}
        </div>

        {/* Email */}
        <div className="employee-basic-info-card__field">
          <span className="employee-basic-info-card__field-label">Email Address</span>
          {isEditing ? (
            <Input
              id="edit-email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          ) : (
            <div className="employee-basic-info-card__email-wrapper">
              <a href={`mailto:${employee.email}`} className="employee-basic-info-card__email-link">
                {employee.email}
              </a>
              {!employee.isEmailVerified && (
                <span
                  className="employee-basic-info-card__warning-badge"
                  title="Unverified email address"
                >
                  <Icon name="alertCircle" size={14} color="#F59E0B" />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="employee-basic-info-card__field">
          <span className="employee-basic-info-card__field-label">Phone Number</span>
          {isEditing ? (
            <Input
              id="edit-phone"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          ) : (
            <div className="employee-basic-info-card__email-wrapper">
              <span className="employee-basic-info-card__field-value">{employee.phone}</span>
              {!employee.isPhoneVerified && (
                <span
                  className="employee-basic-info-card__warning-badge"
                  title="Unverified phone number"
                >
                  <Icon name="alertCircle" size={14} color="#F59E0B" />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Joined Date */}
        <div className="employee-basic-info-card__field">
          <span className="employee-basic-info-card__field-label">Joined Date</span>
          {isEditing ? (
            <Input
              id="edit-joinedDate"
              type="date"
              value={formData.joinedDate || ''}
              onChange={(e) => handleChange('joinedDate', e.target.value)}
            />
          ) : (
            <span className="employee-basic-info-card__field-value">{employee.joinedDate}</span>
          )}
        </div>
      </div>
    </div>
  );
};
