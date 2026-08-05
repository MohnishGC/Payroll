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

const BANK_LIST = [
  { name: 'State Bank of India', ifsc: 'SBIN0000301' },
  { name: 'HDFC Bank', ifsc: 'HDFC0000060' },
  { name: 'ICICI Bank', ifsc: 'ICIC0000007' },
  { name: 'Axis Bank', ifsc: 'UTIB0000007' },
  { name: 'Punjab National Bank', ifsc: 'PUNB0000100' },
  { name: 'Bank of Baroda', ifsc: 'BARB0COLABA' },
  { name: 'Chase National Bank', ifsc: 'CHAS0001298' },
  { name: 'Bank of America', ifsc: 'BOFA0004412' },
  { name: 'Wells Fargo', ifsc: 'WFBI0008890' },
  { name: 'National Bank', ifsc: 'NATB0001000' }
];

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
          {/* Bank Name Dropdown */}
          <div className="form-field">
            <label className="form-field__label" htmlFor="field-bankName">
              Bank Name *
            </label>
            <select
              id="field-bankName"
              className={`form-field__select ${errors.bankName ? 'form-field__select--error' : ''}`}
              value={values.bankName}
              onChange={(e) => {
                const selectedBank = e.target.value;
                onChange('bankName', selectedBank);
                // Auto fill IFSC
                const bank = BANK_LIST.find((b) => b.name === selectedBank);
                if (bank) {
                  onChange('ifscCode', bank.ifsc);
                } else {
                  onChange('ifscCode', '');
                }
              }}
              disabled={disabled}
              required
            >
              <option value="">-- Select Bank --</option>
              {BANK_LIST.map((bank) => (
                <option key={bank.name} value={bank.name}>
                  {bank.name}
                </option>
              ))}
            </select>
            {errors.bankName && (
              <span className="form-field__error" style={{ color: 'var(--color-error)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                {errors.bankName}
              </span>
            )}
          </div>

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
            placeholder="9 to 18 digits (numeric only)"
            value={values.accountNumber}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 18);
              onChange('accountNumber', val);
            }}
            error={errors.accountNumber}
            disabled={disabled}
            required
          />

          {/* IFSC Code (Auto-filled & Disabled) */}
          <Input
            id="field-ifscCode"
            label="IFSC / Routing Code *"
            placeholder="Auto-filled on selecting bank"
            value={values.ifscCode}
            onChange={(e) => onChange('ifscCode', e.target.value.toUpperCase())}
            error={errors.ifscCode}
            disabled={true}
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
                onClick={() => {
                  onChange('pfApplicable', false);
                  onChange('uanNumber', '');
                  onChange('pfNumber', '');
                }}
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
                onClick={() => {
                  onChange('esiApplicable', false);
                  onChange('esiNumber', '');
                }}
                disabled={disabled}
              >
                No
              </button>
            </div>
          </div>

          {/* UAN */}
          {values.pfApplicable && (
            <Input
              id="field-uan"
              label="UAN *"
              placeholder="12 digits (numeric only)"
              value={values.uanNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                onChange('uanNumber', val);
              }}
              error={errors.uanNumber}
              disabled={disabled}
              required
            />
          )}

          {/* PF Account Number */}
          {values.pfApplicable && (
            <Input
              id="field-pfNumber"
              label="PF Account Number *"
              placeholder="22 characters (alphanumeric)"
              value={values.pfNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 22).toUpperCase();
                onChange('pfNumber', val);
              }}
              error={errors.pfNumber}
              disabled={disabled}
              required
            />
          )}

          {/* ESI Number */}
          {values.esiApplicable && (
            <Input
              id="field-esiNumber"
              label="ESI Number *"
              placeholder="10 digits (numeric only)"
              value={values.esiNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                onChange('esiNumber', val);
              }}
              error={errors.esiNumber}
              disabled={disabled}
              required
            />
          )}
        </div>
      </div>
    </div>
  );
};
