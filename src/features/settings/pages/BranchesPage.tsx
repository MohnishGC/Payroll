import React from 'react';

export const BranchesPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-heading)' }}>
        Branches
      </h1>
      <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Manage office branch locations, addresses, and regional payroll codes.</p>
      </div>
    </div>
  );
};

export default BranchesPage;
