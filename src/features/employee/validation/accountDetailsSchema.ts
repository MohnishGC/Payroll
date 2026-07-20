export interface AccountDetailsFormValues {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
  uanPfNumber: string;
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
  }

  if (!values.ifscCode?.trim()) {
    errors.ifscCode = 'IFSC / Routing Code is required.';
  }

  if (!values.panNumber?.trim()) {
    errors.panNumber = 'PAN Number is required.';
  } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.panNumber.toUpperCase())) {
    errors.panNumber = 'Invalid PAN format (e.g. ABCDE1234F).';
  }

  return errors;
};
