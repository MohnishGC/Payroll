export interface AccountDetailsFormValues {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
  uanNumber: string;
  pfNumber: string;
  esiNumber: string;
  pfApplicable: boolean;
  esiApplicable: boolean;
}

export const validateAccountDetails = (
  values: AccountDetailsFormValues
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.bankName?.trim()) {
    errors.bankName = 'Bank Name is required.';
  }

  if (!values.accountHolderName?.trim()) {
    errors.accountHolderName = 'Account Holder Name is required.';
  }

  if (!values.accountNumber?.trim()) {
    errors.accountNumber = 'Account Number is required.';
  } else if (!/^\d{9,18}$/.test(values.accountNumber)) {
    errors.accountNumber = 'Account Number must be between 9 and 18 digits (numeric only).';
  }

  if (!values.ifscCode?.trim()) {
    errors.ifscCode = 'IFSC / Routing Code is required.';
  }

  if (!values.panNumber?.trim()) {
    errors.panNumber = 'PAN Number is required.';
  } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.panNumber.toUpperCase())) {
    errors.panNumber = 'Invalid PAN format (e.g. ABCDE1234F).';
  }

  if (values.pfApplicable) {
    if (!values.uanNumber?.trim()) {
      errors.uanNumber = 'UAN is required.';
    } else if (!/^\d{12}$/.test(values.uanNumber)) {
      errors.uanNumber = 'UAN must be exactly 12 digits (numeric only).';
    }

    if (!values.pfNumber?.trim()) {
      errors.pfNumber = 'PF Account Number is required.';
    } else if (values.pfNumber.length !== 22) {
      errors.pfNumber = 'PF Account Number must be exactly 22 characters.';
    } else if (!/^[a-zA-Z0-9]{22}$/.test(values.pfNumber)) {
      errors.pfNumber = 'PF Account Number must be alphanumeric only.';
    }
  }

  if (values.esiApplicable) {
    if (!values.esiNumber?.trim()) {
      errors.esiNumber = 'ESI Number is required.';
    } else if (!/^\d{10}$/.test(values.esiNumber)) {
      errors.esiNumber = 'ESI Number must be exactly 10 digits (numeric only).';
    }
  }

  return errors;
};
