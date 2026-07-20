import React from 'react';
import { Input } from '../../../../../components/ui/Input/Input';
import { Icon } from '../../../../../components/icons/Icon';
import type { EducationFormEntry } from '../../../validation/educationSchema';
import './FormTabCommon.css';

export interface EducationFormTabProps {
  entries: EducationFormEntry[];
  errors: Record<string, string>;
  onChangeList: (newList: EducationFormEntry[]) => void;
  disabled?: boolean;
}

const QUALIFICATIONS = [
  'High School (10th)',
  'Higher Secondary (12th)',
  'Diploma',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate (Ph.D.)',
  'Other Certification',
];

export const EducationFormTab: React.FC<EducationFormTabProps> = ({
  entries,
  errors,
  onChangeList,
  disabled = false,
}) => {
  const handleEntryChange = (index: number, field: keyof EducationFormEntry, value: string) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    onChangeList(updated);
  };

  const handleAddQualification = () => {
    const newEntry: EducationFormEntry = {
      id: `edu-${Date.now()}`,
      qualification: '-- Select --',
      institution: '',
      boardUniversity: '',
      yearOfPassing: '',
      percentageCgpa: '',
    };
    onChangeList([...entries, newEntry]);
  };

  const handleRemoveQualification = (index: number) => {
    if (entries.length <= 1) return;
    const updated = entries.filter((_, i) => i !== index);
    onChangeList(updated);
  };

  return (
    <div className="form-tab-container">
      {errors['general'] && (
        <p className="form-field__error-msg" role="alert">
          {errors['general']}
        </p>
      )}

      {entries.map((entry, index) => {
        const qErr = errors[`education[${index}].qualification`];
        const iErr = errors[`education[${index}].institution`];
        const yErr = errors[`education[${index}].yearOfPassing`];

        return (
          <div key={entry.id || index} className="education-card">
            <div className="education-card__header">
              <span className="education-card__badge">Qualification #{index + 1}</span>
              {entries.length > 1 && (
                <button
                  type="button"
                  className="education-card__remove-btn"
                  onClick={() => handleRemoveQualification(index)}
                  disabled={disabled}
                  title="Remove qualification record"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>

            <div className="form-tab-grid">
              {/* Qualification */}
              <div className="form-field">
                <label className="form-field__label">Qualification *</label>
                <select
                  className={`form-field__select ${qErr ? 'form-field__select--error' : ''}`}
                  value={entry.qualification}
                  onChange={(e) => handleEntryChange(index, 'qualification', e.target.value)}
                  disabled={disabled}
                >
                  <option value="-- Select --">-- Select Qualification --</option>
                  {QUALIFICATIONS.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
                {qErr && <span className="form-field__error-msg" role="alert">{qErr}</span>}
              </div>

              {/* Institution Name */}
              <Input
                id={`edu-inst-${index}`}
                label="Institution Name *"
                placeholder="e.g. Stanford University"
                value={entry.institution}
                onChange={(e) => handleEntryChange(index, 'institution', e.target.value)}
                error={iErr}
                disabled={disabled}
                required
              />

              {/* Board / University */}
              <Input
                id={`edu-board-${index}`}
                label="Board / University"
                placeholder="e.g. State Board / UGC"
                value={entry.boardUniversity}
                onChange={(e) => handleEntryChange(index, 'boardUniversity', e.target.value)}
                disabled={disabled}
              />

              {/* Year of Passing */}
              <Input
                id={`edu-year-${index}`}
                label="Year of Passing *"
                placeholder="e.g. 2018"
                value={entry.yearOfPassing}
                onChange={(e) => handleEntryChange(index, 'yearOfPassing', e.target.value)}
                error={yErr}
                disabled={disabled}
                required
              />

              {/* Percentage / CGPA */}
              <Input
                id={`edu-cgpa-${index}`}
                label="Percentage / CGPA"
                placeholder="e.g. 3.8 / 85%"
                value={entry.percentageCgpa}
                onChange={(e) => handleEntryChange(index, 'percentageCgpa', e.target.value)}
                disabled={disabled}
              />
            </div>
          </div>
        );
      })}

      {/* Add Qualification Button */}
      <button
        type="button"
        className="education-add-btn"
        onClick={handleAddQualification}
        disabled={disabled}
      >
        <Icon name="plus" size={16} />
        <span>+ Add Another Qualification</span>
      </button>
    </div>
  );
};
