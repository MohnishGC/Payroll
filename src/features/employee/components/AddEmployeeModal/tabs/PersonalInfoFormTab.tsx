import React from 'react';
import { Input } from '../../../../../components/ui/Input/Input';
import { AvatarUpload } from '../../../../../components/ui/AvatarUpload/AvatarUpload';
import type { PersonalInfoFormValues } from '../../../validation/personalInfoSchema';
import { useImageUpload } from '../../../hooks/useImageUpload';
import './FormTabCommon.css';

export interface PersonalInfoFormTabProps {
  values: PersonalInfoFormValues;
  errors: Record<string, string>;
  onChange: <K extends keyof PersonalInfoFormValues>(field: K, val: PersonalInfoFormValues[K]) => void;
  disabled?: boolean;
}

const DEPARTMENTS = ['Engineering', 'HR & Operations', 'Finance & Tax'];
const DESIGNATION_MAP: Record<string, string[]> = {
  Engineering: ['Senior Software Engineer', 'Lead React Developer', 'QA Automation Engineer', 'DevOps Specialist'],
  'HR & Operations': ['Talent Acquisition Manager', 'HR Operations Executive', 'Office Administrator'],
  'Finance & Tax': ['Senior Accountant', 'Payroll Specialist', 'Tax Compliance Officer'],
};

export const PersonalInfoFormTab: React.FC<PersonalInfoFormTabProps> = ({
  values,
  errors,
  onChange,
  disabled = false,
}) => {
  const { previewUrl, selectImage, removeImage } = useImageUpload(values.avatarUrl);

  const handleAvatarSelect = (file: File) => {
    selectImage(file);
    onChange('avatarFile', file);
    onChange('avatarUrl', URL.createObjectURL(file));
  };

  const handleAvatarRemove = () => {
    removeImage();
    onChange('avatarFile', null);
    onChange('avatarUrl', undefined);
  };

  const designations = values.department && DESIGNATION_MAP[values.department]
    ? DESIGNATION_MAP[values.department]
    : ['Senior Specialist', 'Lead Specialist', 'Associate Specialist'];

  return (
    <div className="form-tab-container">
      {/* Top Avatar Upload */}
      <div className="form-tab-container__avatar-wrapper">
        <AvatarUpload
          previewUrl={previewUrl}
          nameFallback={values.name || 'New Employee'}
          onFileSelect={handleAvatarSelect}
          onRemove={handleAvatarRemove}
          disabled={disabled}
        />
      </div>

      {/* Section 1: Personal Details */}
      <div className="form-tab-section">
        <h3 className="form-tab-section__title">Personal Details</h3>
        <div className="form-tab-grid">
          {/* Full Name */}
          <Input
            id="field-name"
            label="Full Name *"
            placeholder="e.g. Eleanor Vance"
            iconName="user"
            value={values.name}
            onChange={(e) => onChange('name', e.target.value)}
            error={errors.name}
            disabled={disabled}
            required
          />

          {/* Gender */}
          <div className="form-field">
            <label className="form-field__label" htmlFor="field-gender">Gender *</label>
            <select
              id="field-gender"
              className={`form-field__select ${errors.gender ? 'form-field__select--error' : ''}`}
              value={values.gender}
              onChange={(e) => onChange('gender', e.target.value)}
              disabled={disabled}
            >
              <option value="-- Select --">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className="form-field__error-msg" role="alert">{errors.gender}</span>}
          </div>

          {/* Date of Birth */}
          <Input
            id="field-dob"
            label="Date of Birth *"
            type="date"
            value={values.dob}
            onChange={(e) => onChange('dob', e.target.value)}
            error={errors.dob}
            disabled={disabled}
            required
          />

          {/* Marital Status */}
          <div className="form-field">
            <label className="form-field__label" htmlFor="field-maritalStatus">Marital Status</label>
            <select
              id="field-maritalStatus"
              className="form-field__select"
              value={values.maritalStatus}
              onChange={(e) => onChange('maritalStatus', e.target.value)}
              disabled={disabled}
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
            </select>
          </div>

          {/* Blood Group */}
          <div className="form-field">
            <label className="form-field__label" htmlFor="field-bloodGroup">Blood Group</label>
            <select
              id="field-bloodGroup"
              className="form-field__select"
              value={values.bloodGroup}
              onChange={(e) => onChange('bloodGroup', e.target.value)}
              disabled={disabled}
            >
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Contact Info */}
      <div className="form-tab-section">
        <h3 className="form-tab-section__title">Contact Info</h3>
        <div className="form-tab-grid">
          {/* Phone */}
          <Input
            id="field-phone"
            label="Phone Number *"
            placeholder="+1 (555) 000-0000"
            iconName="user"
            value={values.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            error={errors.phone}
            disabled={disabled}
            required
          />

          {/* Email */}
          <Input
            id="field-email"
            label="Email Address *"
            type="email"
            placeholder="eleanor@efficio.io"
            iconName="user"
            value={values.email}
            onChange={(e) => onChange('email', e.target.value)}
            error={errors.email}
            disabled={disabled}
            required
          />

          {/* Present Address */}
          <div className="form-field form-field--span-2">
            <Input
              id="field-presentAddress"
              label="Present Address *"
              placeholder="Full street address, city, state"
              value={values.presentAddress}
              onChange={(e) => onChange('presentAddress', e.target.value)}
              error={errors.presentAddress}
              disabled={disabled}
              required
            />
          </div>

          {/* Permanent Address & Checkbox */}
          <div className="form-field form-field--span-2">
            <div className="form-field__header-row">
              <label className="form-field__label" htmlFor="field-permanentAddress">Permanent Address</label>
              <label className="form-field__checkbox-label">
                <input
                  type="checkbox"
                  checked={values.sameAsPresent}
                  onChange={(e) => onChange('sameAsPresent', e.target.checked)}
                  disabled={disabled}
                />
                <span>Same as present address</span>
              </label>
            </div>
            <Input
              id="field-permanentAddress"
              placeholder="Permanent street address"
              value={values.permanentAddress}
              onChange={(e) => onChange('permanentAddress', e.target.value)}
              disabled={disabled || values.sameAsPresent}
            />
          </div>
        </div>
      </div>

      {/* Section 3: Emergency Contact */}
      <div className="form-tab-section">
        <h3 className="form-tab-section__title">Emergency Contact</h3>
        <div className="form-tab-grid">
          <Input
            id="field-emergencyName"
            label="Emergency Contact Name"
            placeholder="e.g. Marcus Vance"
            value={values.emergencyContactName}
            onChange={(e) => onChange('emergencyContactName', e.target.value)}
            disabled={disabled}
          />

          <Input
            id="field-emergencyPhone"
            label="Emergency Contact Phone"
            placeholder="+1 (555) 999-8888"
            value={values.emergencyContactPhone}
            onChange={(e) => onChange('emergencyContactPhone', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Section 4: Employment Details */}
      <div className="form-tab-section">
        <h3 className="form-tab-section__title">Employment Details</h3>
        <div className="form-tab-grid">
          {/* Department */}
          <div className="form-field">
            <label className="form-field__label" htmlFor="field-department">Department *</label>
            <select
              id="field-department"
              className={`form-field__select ${errors.department ? 'form-field__select--error' : ''}`}
              value={values.department}
              onChange={(e) => {
                onChange('department', e.target.value);
                onChange('designation', '-- Select --');
              }}
              disabled={disabled}
            >
              <option value="-- Select --">-- Select Department --</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <span className="form-field__error-msg" role="alert">{errors.department}</span>}
          </div>

          {/* Designation */}
          <div className="form-field">
            <label className="form-field__label" htmlFor="field-designation">Designation *</label>
            <select
              id="field-designation"
              className={`form-field__select ${errors.designation ? 'form-field__select--error' : ''}`}
              value={values.designation}
              onChange={(e) => onChange('designation', e.target.value)}
              disabled={disabled}
            >
              <option value="-- Select --">-- Select Designation --</option>
              {designations.map((desig) => (
                <option key={desig} value={desig}>{desig}</option>
              ))}
            </select>
            {errors.designation && <span className="form-field__error-msg" role="alert">{errors.designation}</span>}
          </div>

          {/* Joining Date */}
          <Input
            id="field-joinedDate"
            label="Joining Date *"
            type="date"
            value={values.joinedDate}
            onChange={(e) => onChange('joinedDate', e.target.value)}
            error={errors.joinedDate}
            disabled={disabled}
            required
          />
        </div>
      </div>
    </div>
  );
};
