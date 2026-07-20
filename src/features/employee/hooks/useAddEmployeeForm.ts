import { useState, useCallback, useMemo } from 'react';
import { validatePersonalInfo, type PersonalInfoFormValues } from '../validation/personalInfoSchema';
import { validateAccountDetails, type AccountDetailsFormValues } from '../validation/accountDetailsSchema';
import { validateEducation, type EducationFormEntry } from '../validation/educationSchema';
import { validateDocuments } from '../validation/documentsSchema';
import type { UploadedFileItem } from '../../../components/ui/FileUpload/FileUpload';
import { employeeApi } from '../services/employeeApi';
import type { EmployeeMaster } from '../types/employee.types';

export type TabKey = 'personal' | 'account' | 'education' | 'documents';

export interface AddEmployeeFormValues {
  personal: PersonalInfoFormValues;
  account: AccountDetailsFormValues;
  education: EducationFormEntry[];
  documents: UploadedFileItem[];
}

const initialValues: AddEmployeeFormValues = {
  personal: {
    name: '',
    gender: '-- Select --',
    dob: '',
    maritalStatus: 'Single',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    presentAddress: '',
    permanentAddress: '',
    sameAsPresent: false,
    emergencyContactName: '',
    emergencyContactPhone: '',
    department: '-- Select --',
    designation: '-- Select --',
    joinedDate: new Date().toISOString().split('T')[0],
    avatarUrl: undefined,
    avatarFile: null,
  },
  account: {
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    panNumber: '',
    uanPfNumber: '',
    esiNumber: '',
    pfApplicable: true,
    esiApplicable: true,
  },
  education: [
    {
      id: 'edu-init-1',
      qualification: 'Bachelor\'s',
      institution: '',
      boardUniversity: '',
      yearOfPassing: '',
      percentageCgpa: '',
    },
  ],
  documents: [],
};

export const useAddEmployeeForm = () => {
  const [values, setValues] = useState<AddEmployeeFormValues>(initialValues);
  const [touchedTabs, setTouchedTabs] = useState<Record<TabKey, boolean>>({
    personal: false,
    account: false,
    education: false,
    documents: false,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Per-tab error objects
  const errors = useMemo(() => {
    return {
      personal: validatePersonalInfo(values.personal),
      account: validateAccountDetails(values.account),
      education: validateEducation(values.education),
      documents: validateDocuments(values.documents),
    };
  }, [values]);

  // Tab Status Dots: 'untouched' | 'valid' | 'invalid'
  const tabStatuses = useMemo<Record<TabKey, 'untouched' | 'valid' | 'invalid'>>(() => {
    return {
      personal: !touchedTabs.personal
        ? 'untouched'
        : Object.keys(errors.personal).length > 0
        ? 'invalid'
        : 'valid',
      account: !touchedTabs.account
        ? 'untouched'
        : Object.keys(errors.account).length > 0
        ? 'invalid'
        : 'valid',
      education: !touchedTabs.education
        ? 'untouched'
        : Object.keys(errors.education).length > 0
        ? 'invalid'
        : 'valid',
      documents: !touchedTabs.documents
        ? 'untouched'
        : Object.keys(errors.documents).length > 0
        ? 'invalid'
        : 'valid',
    };
  }, [touchedTabs, errors]);

  // Is Dirty detector
  const isDirty = useMemo(() => {
    return (
      Boolean(values.personal.name) ||
      Boolean(values.personal.email) ||
      Boolean(values.personal.phone) ||
      Boolean(values.account.bankName) ||
      Boolean(values.account.accountNumber) ||
      values.documents.length > 0 ||
      Object.values(touchedTabs).some(Boolean)
    );
  }, [values, touchedTabs]);

  const setPersonalField = useCallback(<K extends keyof PersonalInfoFormValues>(field: K, val: PersonalInfoFormValues[K]) => {
    setTouchedTabs((prev) => ({ ...prev, personal: true }));
    setValues((prev) => {
      const nextPersonal = { ...prev.personal, [field]: val };
      if (field === 'sameAsPresent' && val === true) {
        nextPersonal.permanentAddress = nextPersonal.presentAddress;
      }
      if (field === 'presentAddress' && nextPersonal.sameAsPresent) {
        nextPersonal.permanentAddress = val as string;
      }
      return { ...prev, personal: nextPersonal };
    });
  }, []);

  const setAccountField = useCallback(<K extends keyof AccountDetailsFormValues>(field: K, val: AccountDetailsFormValues[K]) => {
    setTouchedTabs((prev) => ({ ...prev, account: true }));
    setValues((prev) => ({
      ...prev,
      account: { ...prev.account, [field]: val },
    }));
  }, []);

  const setEducationList = useCallback((newList: EducationFormEntry[]) => {
    setTouchedTabs((prev) => ({ ...prev, education: true }));
    setValues((prev) => ({ ...prev, education: newList }));
  }, []);

  const setDocumentList = useCallback((newList: UploadedFileItem[]) => {
    setTouchedTabs((prev) => ({ ...prev, documents: newList.length > 0 || prev.documents }));
    setValues((prev) => ({ ...prev, documents: newList }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setTouchedTabs({ personal: false, account: false, education: false, documents: false });
    setIsSubmitting(false);
    setSubmitError(null);
  }, []);

  // Validate all tabs, return first invalid tab key if any
  const validateAll = useCallback((): { isValid: boolean; firstInvalidTab: TabKey | null } => {
    setTouchedTabs({ personal: true, account: true, education: true, documents: true });

    const pErr = validatePersonalInfo(values.personal);
    const aErr = validateAccountDetails(values.account);
    const eErr = validateEducation(values.education);
    const dErr = validateDocuments(values.documents);

    if (Object.keys(pErr).length > 0) return { isValid: false, firstInvalidTab: 'personal' };
    if (Object.keys(aErr).length > 0) return { isValid: false, firstInvalidTab: 'account' };
    if (Object.keys(eErr).length > 0) return { isValid: false, firstInvalidTab: 'education' };
    if (Object.keys(dErr).length > 0) return { isValid: false, firstInvalidTab: 'documents' };

    return { isValid: true, firstInvalidTab: null };
  }, [values]);

  const submitForm = useCallback(
    async (assignedCode: string): Promise<EmployeeMaster | null> => {
      const { isValid, firstInvalidTab } = validateAll();
      if (!isValid && firstInvalidTab) {
        setSubmitError(`Please correct the errors in the ${firstInvalidTab.toUpperCase()} tab.`);
        return null;
      }

      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const payload: Partial<EmployeeMaster> = {
          code: assignedCode || 'EMP-1004',
          name: values.personal.name,
          joinedDate: values.personal.joinedDate,
          email: values.personal.email,
          department: values.personal.department,
          designation: values.personal.designation,
          phone: values.personal.phone,
          avatarUrl: values.personal.avatarUrl,
          personal: {
            dob: values.personal.dob,
            gender: values.personal.gender as 'Male' | 'Female' | 'Other',
            maritalStatus: values.personal.maritalStatus as 'Single' | 'Married' | 'Divorced',
            bloodGroup: values.personal.bloodGroup,
            address: values.personal.presentAddress,
            emergencyContactName: values.personal.emergencyContactName,
            emergencyContactPhone: values.personal.emergencyContactPhone,
          },
          account: {
            bankName: values.account.bankName,
            accountNumber: values.account.accountNumber,
            ifscCode: values.account.ifscCode,
            panNumber: values.account.panNumber,
            uanPfNumber: values.account.uanPfNumber,
            esiNumber: values.account.esiNumber,
          },
          educations: values.education.map((e) => ({
            id: e.id,
            qualification: e.qualification,
            institution: e.institution,
            yearOfPassing: e.yearOfPassing,
          })),
          documents: values.documents.map((d) => ({
            id: d.id,
            name: d.name,
            type: d.docType,
            uploadedDate: new Date().toISOString().split('T')[0],
          })),
        };

        const created = await employeeApi.create(payload);
        resetForm();
        return created;
      } catch (err) {
        setSubmitError((err as Error).message || 'Failed to submit employee creation form.');
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateAll, values, resetForm]
  );

  return {
    values,
    errors,
    touchedTabs,
    tabStatuses,
    isDirty,
    isSubmitting,
    submitError,
    setPersonalField,
    setAccountField,
    setEducationList,
    setDocumentList,
    resetForm,
    validateAll,
    submitForm,
  };
};
