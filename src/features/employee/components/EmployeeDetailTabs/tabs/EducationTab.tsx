import React from 'react';
import type { EmployeeMaster } from '../../../types/employee.types';

export interface EducationTabProps {
  employee: EmployeeMaster;
}

export const EducationTab: React.FC<EducationTabProps> = ({ employee }) => {
  const educations = employee?.educations || (employee as any)?.Educations || [];

  return (
    <div className="education-tab" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {educations.length === 0 ? (
        <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          No education records added yet.
        </p>
      ) : (
        educations.map((edu, index) => (
          <div
            key={edu.id || index}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-input-bg)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                {edu.qualification}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {edu.institution} • Passed {edu.yearOfPassing}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
