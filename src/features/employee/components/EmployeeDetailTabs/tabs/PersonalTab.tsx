import React from 'react';
import type { EmployeeMaster } from '../../../types/employee.types';

export interface TabProps {
  employee: EmployeeMaster;
}

export const PersonalTab: React.FC<TabProps> = ({ employee }) => {
  const p = employee?.personal || (employee as any)?.Personal || {};

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Date of Birth</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{p.dob || '—'}</p>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Gender</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{p.gender || '—'}</p>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Marital Status</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{p.maritalStatus || '—'}</p>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Blood Group</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{p.bloodGroup || '—'}</p>
      </div>

      <div style={{ gridColumn: 'span 2' }}>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Residential Address</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{p.address || '—'}</p>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Emergency Contact Name</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{p.emergencyContactName || '—'}</p>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Emergency Contact Phone</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{p.emergencyContactPhone || '—'}</p>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Branch</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{employee.branchName || (employee as any).BranchName || '—'}</p>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Category</label>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{employee.category || (employee as any).Category || '—'}</p>
      </div>
    </div>
  );
};
