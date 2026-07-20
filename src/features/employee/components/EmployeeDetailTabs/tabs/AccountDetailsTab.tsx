import React from 'react';
import type { EmployeeMaster } from '../../../types/employee.types';
import { Input } from '../../../../../components/ui/Input/Input';

export interface AccountDetailsTabProps {
  employee: EmployeeMaster;
  isEditing: boolean;
  onUpdate: (updated: Partial<EmployeeMaster>) => void;
}

export const AccountDetailsTab: React.FC<AccountDetailsTabProps> = ({
  employee,
  isEditing,
  onUpdate,
}) => {
  const acc = employee.account;

  const handleAccountChange = (field: string, value: string) => {
    onUpdate({
      account: {
        ...acc,
        [field]: value,
      },
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Bank Name</label>
        {isEditing ? (
          <Input id="acc-bankName" value={acc.bankName} onChange={(e) => handleAccountChange('bankName', e.target.value)} />
        ) : (
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{acc.bankName}</p>
        )}
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Account Number</label>
        {isEditing ? (
          <Input id="acc-accountNumber" value={acc.accountNumber} onChange={(e) => handleAccountChange('accountNumber', e.target.value)} />
        ) : (
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{acc.accountNumber}</p>
        )}
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>IFSC / Routing Code</label>
        {isEditing ? (
          <Input id="acc-ifscCode" value={acc.ifscCode} onChange={(e) => handleAccountChange('ifscCode', e.target.value)} />
        ) : (
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{acc.ifscCode}</p>
        )}
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>PAN Number</label>
        {isEditing ? (
          <Input id="acc-panNumber" value={acc.panNumber} onChange={(e) => handleAccountChange('panNumber', e.target.value)} />
        ) : (
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{acc.panNumber}</p>
        )}
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>UAN / PF Number</label>
        {isEditing ? (
          <Input id="acc-uanPfNumber" value={acc.uanPfNumber} onChange={(e) => handleAccountChange('uanPfNumber', e.target.value)} />
        ) : (
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{acc.uanPfNumber}</p>
        )}
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>ESI Number</label>
        {isEditing ? (
          <Input id="acc-esiNumber" value={acc.esiNumber} onChange={(e) => handleAccountChange('esiNumber', e.target.value)} />
        ) : (
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{acc.esiNumber}</p>
        )}
      </div>
    </div>
  );
};
