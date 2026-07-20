export interface PersonalInfoFormValues {
  name: string;
  gender: string;
  dob: string;
  maritalStatus: string;
  bloodGroup: string;
  phone: string;
  email: string;
  presentAddress: string;
  permanentAddress: string;
  sameAsPresent: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
  department: string;
  designation: string;
  joinedDate: string;
  avatarUrl?: string;
  avatarFile?: File | null;
}

export const validatePersonalInfo = (
  values: PersonalInfoFormValues
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.name?.trim()) {
    errors.name = 'Full Name is required.';
  }

  if (!values.gender || values.gender === '-- Select --') {
    errors.gender = 'Gender is required.';
  }

  if (!values.dob) {
    errors.dob = 'Date of Birth is required.';
  }

  if (!values.phone?.trim()) {
    errors.phone = 'Phone Number is required.';
  }

  if (!values.email?.trim()) {
    errors.email = 'Email Address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.presentAddress?.trim()) {
    errors.presentAddress = 'Present Address is required.';
  }

  if (!values.department || values.department === '-- Select --') {
    errors.department = 'Department is required.';
  }

  if (!values.designation || values.designation === '-- Select --') {
    errors.designation = 'Designation is required.';
  }

  if (!values.joinedDate) {
    errors.joinedDate = 'Joining Date is required.';
  }

  return errors;
};
