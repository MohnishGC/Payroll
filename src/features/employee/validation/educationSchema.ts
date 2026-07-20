export interface EducationFormEntry {
  id: string;
  qualification: string;
  institution: string;
  boardUniversity: string;
  yearOfPassing: string;
  percentageCgpa: string;
}

export const validateEducation = (
  entries: EducationFormEntry[]
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!entries || entries.length === 0) {
    errors['general'] = 'At least one education qualification is required.';
    return errors;
  }

  entries.forEach((entry, index) => {
    if (!entry.qualification || entry.qualification === '-- Select --') {
      errors[`education[${index}].qualification`] = 'Qualification is required.';
    }
    if (!entry.institution?.trim()) {
      errors[`education[${index}].institution`] = 'Institution Name is required.';
    }
    if (!entry.yearOfPassing?.trim()) {
      errors[`education[${index}].yearOfPassing`] = 'Year of Passing is required.';
    }
  });

  return errors;
};
