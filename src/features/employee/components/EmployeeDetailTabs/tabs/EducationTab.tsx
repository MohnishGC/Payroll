import React from 'react';
import type { EmployeeMaster, EducationEntry } from '../../../types/employee.types';
import { Icon } from '../../../../../components/icons/Icon';

export interface EducationTabProps {
  employee: EmployeeMaster;
  isEditing: boolean;
  onUpdate: (updated: Partial<EmployeeMaster>) => void;
}

export const EducationTab: React.FC<EducationTabProps> = ({
  employee,
  isEditing,
  onUpdate,
}) => {
  const educations = employee.educations || [];

  const handleAddEducation = () => {
    const newEntry: EducationEntry = {
      id: `edu-${Date.now()}`,
      qualification: 'B.S. Degree',
      institution: 'State University',
      yearOfPassing: '2020',
    };
    onUpdate({
      educations: [...educations, newEntry],
    });
  };

  const handleRemoveEducation = (id: string) => {
    onUpdate({
      educations: educations.filter((edu) => edu.id !== id),
    });
  };

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
            {isEditing && (
              <button
                type="button"
                onClick={() => handleRemoveEducation(edu.id)}
                style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}
                title="Remove Education"
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
        ))
      )}

      {isEditing && (
        <button
          type="button"
          onClick={handleAddEducation}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            border: '2px dashed var(--color-primary-light)',
            backgroundColor: 'var(--color-primary-bg)',
            color: 'var(--color-primary)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          <Icon name="plus" size={16} />
          <span>+ Add Education Record</span>
        </button>
      )}
    </div>
  );
};
