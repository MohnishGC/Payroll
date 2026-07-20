import React from 'react';
import type { EmployeeMaster } from '../../../types/employee.types';
import { Input } from '../../../../../components/ui/Input/Input';

export interface TabProps {
  employee: EmployeeMaster;
  isEditing: boolean;
  onUpdate: (updated: Partial<EmployeeMaster>) => void;
}

export const PersonalTab: React.FC<TabProps> = ({ employee, isEditing, onUpdate }) => {
  const p = employee.personal;

  const handlePersonalChange = (field: string, value: string) => {
    onUpdate({
      personal: {
        ...p,
        [field]: value,
      },
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Date of Birth</label>
        {isEditing ? (
          <Input id="personal-dob" type="date" value={p.dob} onChange={(e) => handlePersonalChange('dob', e.target.value)} />
        ) : (
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{p.dob}</p>
        )}
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Gender</label>
        {isEditing ? (
          <Input id="personal-gender" value={p.gender} onChange={(e) => handlePersonalChange('gender', e.target.value)} />
        ) : (
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{p.gender}</p>
        )}
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Marital Status</label>
        {isEditing ? (
          <Input id="personal-maritalStatus" value={p.maritalStatus} onChange={(e) => handlePersonalChange('maritalStatus', e.target.value)} />
        ) : (
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{p.maritalStatus}</p>
        )}
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Blood Group</label>
        {isEditing ? (
          <Input id="personal-bloodGroup" value={p.bloodGroup} onChange={(e) => handlePersonalChange('bloodGroup', e.target.value)} />
        ) : (
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{p.bloodGroup}</p>
        )}
      </div>

      <div style={{ gridColumn: 'span 2' }}>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Residential Address</label>
        {isEditing ? (
          <Input id="personal-address" value={p.address} onChange={(e) => handlePersonalChange('address', e.target.value)} />
        ) : (
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{p.address}</p>
        )}
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Emergency Contact Name</label>
        {isEditing ? (
          <Input id="personal-emergName" value={p.emergencyContactName} onChange={(e) => handlePersonalChange('emergencyContactName', e.target.value)} />
        ) : (
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{p.emergencyContactName}</p>
        )}
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Emergency Contact Phone</label>
        {isEditing ? (
          <Input id="personal-emergPhone" value={p.emergencyContactPhone} onChange={(e) => handlePersonalChange('emergencyContactPhone', e.target.value)} />
        ) : (
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)', marginTop: '4px' }}>{p.emergencyContactPhone}</p>
        )}
      </div>
    </div>
  );
};
