import React from 'react';

export const AddEmployeePage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-heading)' }}>
        Add New Employee
      </h1>
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          boxShadow: 'var(--shadow-card)',
          maxWidth: '800px',
        }}
      >
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          Fill in employee details to register a new member into Efficio PMS.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-heading)', display: 'block', marginBottom: '6px' }}>First Name</label>
            <input type="text" placeholder="e.g. John" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-input-bg)' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-heading)', display: 'block', marginBottom: '6px' }}>Last Name</label>
            <input type="text" placeholder="e.g. Doe" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-input-bg)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeePage;
