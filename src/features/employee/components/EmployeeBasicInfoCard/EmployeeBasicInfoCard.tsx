import React from 'react';
import { Icon } from '../../../../components/icons/Icon';
import { useSecureImage } from '../../hooks/useSecureImage';
import type { EmployeeMaster } from '../../types/employee.types';
import './EmployeeBasicInfoCard.css';

export interface EmployeeBasicInfoCardProps {
  employee: EmployeeMaster;
}

export const EmployeeBasicInfoCard: React.FC<EmployeeBasicInfoCardProps> = ({ employee }) => {
  const initials = (employee?.name || '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  const avatarPath = employee?.avatarUrl || (employee as any)?.AvatarUrl;
  const { src: secureAvatarUrl } = useSecureImage(avatarPath);

  return (
    <div className="employee-basic-info-card">
      {/* Top Header Row */}
      <div className="employee-basic-info-card__header">
        <div className="employee-basic-info-card__avatar-section">
          {secureAvatarUrl ? (
            <img
              src={secureAvatarUrl}
              alt={employee.name || ''}
              className="employee-basic-info-card__avatar-img"
            />
          ) : (
            <div className="employee-basic-info-card__avatar-fallback">{initials}</div>
          )}
          <div className="employee-basic-info-card__title-group">
            <h2 className="employee-basic-info-card__name">{employee?.name || '—'}</h2>
            <span className="employee-basic-info-card__code-badge">{employee?.code || '—'}</span>
          </div>
        </div>
      </div>

      {/* Detail Fields List */}
      <div className="employee-basic-info-card__details">
        {/* Department */}
        <div className="employee-basic-info-card__field">
          <span className="employee-basic-info-card__field-label">Department</span>
          <span className="employee-basic-info-card__field-value">{employee?.department || '—'}</span>
        </div>

        {/* Designation */}
        <div className="employee-basic-info-card__field">
          <span className="employee-basic-info-card__field-label">Designation</span>
          <span className="employee-basic-info-card__field-value">{employee?.designation || '—'}</span>
        </div>

        {/* Email */}
        <div className="employee-basic-info-card__field">
          <span className="employee-basic-info-card__field-label">Email Address</span>
          <div className="employee-basic-info-card__email-wrapper">
            {employee?.email ? (
              <a href={`mailto:${employee.email}`} className="employee-basic-info-card__email-link">
                {employee.email}
              </a>
            ) : (
              <span className="employee-basic-info-card__field-value">—</span>
            )}
            {employee?.email && !employee?.isEmailVerified && (
              <span
                className="employee-basic-info-card__warning-badge"
                title="Unverified email address"
              >
                <Icon name="alertCircle" size={14} color="#F59E0B" />
              </span>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="employee-basic-info-card__field">
          <span className="employee-basic-info-card__field-label">Phone Number</span>
          <div className="employee-basic-info-card__email-wrapper">
            <span className="employee-basic-info-card__field-value">{employee?.phone || '—'}</span>
            {employee?.phone && !employee?.isPhoneVerified && (
              <span
                className="employee-basic-info-card__warning-badge"
                title="Unverified phone number"
              >
                <Icon name="alertCircle" size={14} color="#F59E0B" />
              </span>
            )}
          </div>
        </div>

        {/* Joined Date */}
        <div className="employee-basic-info-card__field">
          <span className="employee-basic-info-card__field-label">Joined Date</span>
          <span className="employee-basic-info-card__field-value">{employee?.joinedDate || '—'}</span>
        </div>
      </div>
    </div>
  );
};
