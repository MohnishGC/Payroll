import React from 'react';
import { Input } from '../../../../../components/ui/Input/Input';
import type { AccountDetailsFormValues } from '../../../validation/accountDetailsSchema';
import './FormTabCommon.css';

export interface AccountDetailsFormTabProps {
  values: AccountDetailsFormValues;
  errors: Record<string, string>;
  onChange: <K extends keyof AccountDetailsFormValues>(field: K, val: AccountDetailsFormValues[K]) => void;
  disabled?: boolean;
}

export const AccountDetailsFormTab: React.FC<AccountDetailsFormTabProps> = ({
  values,
  errors,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="form-tab-container">
      {/* Section 1: Banking Details */}
      <div className="form-tab-section">
        <h3 className="form-tab-section__title">Banking & Account Info</h3>
        <div className="form-tab-grid">
          {/* Bank Name */}
          <Input
            id="field-bankName"
            label="Bank Name *"
            placeholder="e.g. Chase National Bank"
            value={values.bankName}
            onChange={(e) => onChange('bankName', e.target.value)}
            error={errors.bankName}
            disabled={disabled}
            required
          />

          {/* Account Holder Name */}
          <Input
            id="field-accountHolderName"
            label="Account Holder Name *"
            placeholder="Name as printed on bank passbook"
            value={values.accountHolderName}
            onChange={(e) => onChange('accountHolderName', e.target.value)}
            error={errors.accountHolderName}
            disabled={disabled}
            required
          />

          {/* Account Number */}
          <Input
            id="field-accountNumber"
            label="Account Number *"
            placeholder="XXXX-XXXX-1234"
            value={values.accountNumber}
            onChange={(e) => onChange('accountNumber', e.target.value)}
            error={errors.accountNumber}
            disabled={disabled}
            required
          />

          {/* IFSC Code */}
          <Input
            id="field-ifscCode"
            label="IFSC / Routing Code *"
            placeholder="CHAS0001298"
            value={values.ifscCode}
            onChange={(e) => onChange('ifscCode', e.target.value.toUpperCase())}
            error={errors.ifscCode}
            disabled={disabled}
            required
          />

          {/* PAN Number */}
          <Input
            id="field-panNumber"
            label="PAN Number *"
            placeholder="ABCDE1234F"
            value={values.panNumber}
            onChange={(e) => onChange('panNumber', e.target.value.toUpperCase())}
            error={errors.panNumber}
            disabled={disabled}
            required
          />
        </div>
      </div>

      {/* Section 2: Statutory & Tax Details */}
      <div className="form-tab-section">
        <h3 className="form-tab-section__title">Statutory & Provident Fund Info</h3>
        <div className="form-tab-grid">
          {/* PF Applicable Toggle */}
          <div className="form-field">
            <label className="form-field__label">PF Applicable?</label>
            <div className="form-field__toggle-row">
              <button
                type="button"
                className={`form-field__toggle-btn ${values.pfApplicable ? 'form-field__toggle-btn--active' : ''}`}
                onClick={() => onChange('pfApplicable', true)}
                disabled={disabled}
              >
                Yes
              </button>
              <button
                type="button"
                className={`form-field__toggle-btn ${!values.pfApplicable ? 'form-field__toggle-btn--active' : ''}`}
                onClick={() => onChange('pfApplicable', false)}
                disabled={disabled}
              >
                No
              </button>
            </div>
          </div>

          {/* ESI Applicable Toggle */}
          <div className="form-field">
            <label className="form-field__label">ESI Applicable?</label>
            <div className="form-field__toggle-row">
              <button
                type="button"
                className={`form-field__toggle-btn ${values.esiApplicable ? 'form-field__toggle-btn--active' : ''}`}
                onClick={() => onChange('esiApplicable', true)}
                disabled={disabled}
              >
                Yes
              </button>
              <button
                type="button"
                className={`form-field__toggle-btn ${!values.esiApplicable ? 'form-field__toggle-btn--active' : ''}`}
                onClick={() => onChange('esiApplicable', false)}
                disabled={disabled}
              >
                No
              </button>
            </div>
          </div>

          {/* UAN/PF Number */}
          {values.pfApplicable && (
            <Input
              id="field-uanPfNumber"
              label="UAN / PF Number"
              placeholder="100982348123"
              value={values.uanPfNumber}
              onChange={(e) => onChange('uanPfNumber', e.target.value)}
              disabled={disabled}
            />
          )}

          {/* ESI Number */}
          {values.esiApplicable && (
            <Input
              id="field-esiNumber"
              label="ESI Number"
              placeholder="3100982312"
              value={values.esiNumber}
              onChange={(e) => onChange('esiNumber', e.target.value)}
              disabled={disabled}
            />
          )}
        </div>
      </div>
    </div>
  );
};
