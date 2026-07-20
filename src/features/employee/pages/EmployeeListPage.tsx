import React from 'react';
import { Icon } from '../../../components/icons/Icon';

export const EmployeeListPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-heading)' }}>
            Employee Directory
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
            Manage active company workforce records, salary levels, and personal profiles.
          </p>
        </div>
        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-gradient)',
            color: '#FFFFFF',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Icon name="plus" size={16} />
          <span>Add Employee</span>
        </button>
      </div>

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-heading)' }}>
              <th style={{ padding: '12px 16px' }}>Employee</th>
              <th style={{ padding: '12px 16px' }}>Department</th>
              <th style={{ padding: '12px 16px' }}>Designation</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Join Date</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Sarah Jenkins', dept: 'Engineering', role: 'Senior React Engineer', status: 'Active', date: 'Jan 15, 2023' },
              { name: 'David Chen', dept: 'HR & Operations', role: 'Talent Acquisition Lead', status: 'Active', date: 'Mar 01, 2022' },
              { name: 'Emma Watson', dept: 'Finance & Tax', role: 'Payroll Accountant', status: 'Active', date: 'Jul 10, 2021' },
            ].map((emp, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-heading)' }}>{emp.name}</td>
                <td style={{ padding: '14px 16px', color: 'var(--color-text-main)' }}>{emp.dept}</td>
                <td style={{ padding: '14px 16px', color: 'var(--color-text-main)' }}>{emp.role}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ backgroundColor: 'var(--color-success-bg)', color: '#065F46', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>
                    {emp.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{emp.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeListPage;
