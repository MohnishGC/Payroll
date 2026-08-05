import React from 'react';
import type { EmployeeMaster } from '../../../types/employee.types';

export interface AccountDetailsTabProps {
  employee: EmployeeMaster;
}

export const AccountDetailsTab: React.FC<AccountDetailsTabProps> = ({ employee }) => {
  const acc = employee?.account || (employee as any)?.Account || {};

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Bank Name</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{acc.bankName || '—'}</p>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Account Number</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{acc.accountNumber || '—'}</p>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>IFSC / Routing Code</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{acc.ifscCode || '—'}</p>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>PAN Number</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{acc.panNumber || '—'}</p>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>UAN</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{acc.uanNumber || (acc as any).UanNumber || (acc as any).uan || (acc as any).Uan || '—'}</p>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>PF Account Number</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{acc.pfNumber || (acc as any).PfNumber || '—'}</p>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>ESI Number</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{acc.esiNumber || '—'}</p>
      </div>
    </div>
  );
};
