import { useState, useCallback, useMemo } from 'react';
import { validatePersonalInfo, type PersonalInfoFormValues } from '../validation/personalInfoSchema';
import { validateAccountDetails, type AccountDetailsFormValues } from '../validation/accountDetailsSchema';
import { validateEducation, type EducationFormEntry } from '../validation/educationSchema';
import { validateDocuments } from '../validation/documentsSchema';
import type { UploadedFileItem } from '../../../components/ui/FileUpload/FileUpload';
import { employeeApi } from '../services/employeeApi';
import type { EmployeeMaster } from '../types/employee.types';

export type TabKey = 'personal' | 'account' | 'education' | 'documents';

const generateGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export interface AddEmployeeFormValues {
  id: string;
  personal: PersonalInfoFormValues;
  account: AccountDetailsFormValues;
  education: EducationFormEntry[];
  documents: UploadedFileItem[];
}

const initialValues: AddEmployeeFormValues = {
  id: '',
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
    needsPayrollLogin: false,
  },
  account: {
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    panNumber: '',
    uanNumber: '',
    pfNumber: '',
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
  const [values, setValues] = useState<AddEmployeeFormValues>(() => ({
    ...initialValues,
    id: generateGuid(),
  }));
  const [touchedTabs, setTouchedTabs] = useState<Record<TabKey, boolean>>({
    personal: false,
    account: false,
    education: false,
    documents: false,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const uploadAvatarFile = useCallback(async (file: File) => {
    setValues((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        avatarUrl: URL.createObjectURL(file),
        avatarFile: file,
      },
    }));
  }, []);

  const uploadDocumentFiles = useCallback(async (newFiles: File[]) => {
    const newItems: UploadedFileItem[] = newFiles.map((file, i) => ({
      id: `file-local-${Date.now()}-${i}`,
      file,
      name: file.name,
      size: file.size,
      docType: 'ID Proof',
      progress: 100,
      status: 'completed',
    }));

    setValues((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newItems],
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues({
      ...initialValues,
      id: generateGuid(),
    });
    setTouchedTabs({ personal: false, account: false, education: false, documents: false });
    setIsSubmitting(false);
    setSubmitError(null);
    setUploadMessage(null);
    setIsUploadingFile(false);
  }, []);

  const populateForm = useCallback((employee: EmployeeMaster) => {
    setValues({
      id: employee.id || (employee as any).Id || generateGuid(),
      personal: {
        name: employee.name,
        gender: employee.personal?.gender || 'Male',
        dob: employee.personal?.dob || '',
        maritalStatus: employee.personal?.maritalStatus || 'Single',
        bloodGroup: employee.personal?.bloodGroup || 'O+',
        phone: employee.phone,
        email: employee.email,
        presentAddress: employee.personal?.address || '',
        permanentAddress: employee.personal?.address || '',
        sameAsPresent: true,
        emergencyContactName: employee.personal?.emergencyContactName || '',
        emergencyContactPhone: employee.personal?.emergencyContactPhone || '',
        department: employee.department,
        designation: employee.designation,
        joinedDate: employee.joinedDate,
        avatarUrl: employee.avatarUrl || (employee as any).AvatarUrl,
        avatarFile: null,
        needsPayrollLogin: employee.needsPayrollLogin || false,
      },
      account: {
        bankName: employee.account?.bankName || '',
        accountHolderName: employee.name,
        accountNumber: employee.account?.accountNumber || '',
        ifscCode: employee.account?.ifscCode || '',
        panNumber: employee.account?.panNumber || '',
        uanNumber: employee.account?.uanNumber || (employee.account as any)?.UanNumber || (employee.account as any)?.uan || (employee.account as any)?.Uan || '',
        pfNumber: employee.account?.pfNumber || (employee.account as any)?.PfNumber || '',
        esiNumber: employee.account?.esiNumber || (employee.account as any)?.EsiNumber || '',
        pfApplicable: Boolean(
          employee.account?.uanNumber ||
          (employee.account as any)?.UanNumber ||
          (employee.account as any)?.uan ||
          (employee.account as any)?.Uan ||
          employee.account?.pfNumber ||
          (employee.account as any)?.PfNumber
        ),
        esiApplicable: Boolean(employee.account?.esiNumber),
      },
      education: employee.educations?.length > 0
        ? employee.educations.map((edu) => ({
            id: edu.id,
            qualification: edu.qualification,
            institution: edu.institution,
            boardUniversity: '',
            yearOfPassing: edu.yearOfPassing,
            percentageCgpa: '',
          }))
        : initialValues.education,
      documents: employee.documents?.length > 0
        ? employee.documents.map((doc) => ({
            id: doc.id,
            file: new File([], doc.name),
            name: doc.name,
            size: 0,
            docType: doc.type,
            progress: 100,
            status: 'completed',
            fileUrl: doc.fileUrl,
          }))
        : [],
    });

    setTouchedTabs({
      personal: true,
      account: true,
      education: employee.educations?.length > 0,
      documents: employee.documents?.length > 0,
    });
  }, []);

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

  const uploadFormFiles = async (
    currentId: string,
    avatarFile?: File | null,
    avatarUrl?: string,
    docs: UploadedFileItem[] = []
  ): Promise<{ finalAvatarUrl?: string; finalDocs: any[] }> => {
    // 1. Upload avatar if a new local File exists
    let finalAvatarUrl = avatarUrl;
    if (avatarFile) {
      const res = await employeeApi.uploadFile(avatarFile, 'avatars', currentId);
      finalAvatarUrl = res.fileUrl;
    }

    // 2. Upload any local documents that have a local File reference
    const finalDocs = [];
    for (const doc of docs) {
      if (doc.file) {
        // Upload locally pending file
        const res = await employeeApi.uploadFile(doc.file, 'documents', currentId, doc.docType);
        finalDocs.push({
          id: doc.id.startsWith('file-local-') ? undefined : doc.id,
          name: doc.name,
          type: doc.docType,
          fileUrl: res.fileUrl,
          uploadedDate: new Date().toISOString().split('T')[0],
        });
      } else {
        // Already uploaded document path reference
        finalDocs.push({
          id: doc.id,
          name: doc.name,
          type: doc.docType,
          fileUrl: doc.fileUrl || '',
          uploadedDate: doc.uploadedDate || new Date().toISOString().split('T')[0],
        });
      }
    }

    return { finalAvatarUrl, finalDocs };
  };

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
        const { finalAvatarUrl, finalDocs } = await uploadFormFiles(
          values.id,
          values.personal.avatarFile,
          values.personal.avatarUrl,
          values.documents
        );

        const payload: Partial<EmployeeMaster> = {
          id: values.id,
          code: assignedCode || 'EMP-1004',
          name: values.personal.name,
          joinedDate: values.personal.joinedDate,
          email: values.personal.email,
          department: values.personal.department,
          designation: values.personal.designation,
          phone: values.personal.phone,
          avatarUrl: finalAvatarUrl,
          needsPayrollLogin: values.personal.needsPayrollLogin,
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
            uanNumber: values.account.uanNumber,
            pfNumber: values.account.pfNumber,
            esiNumber: values.account.esiNumber,
          },
          educations: values.education.map((e) => ({
            id: e.id,
            qualification: e.qualification,
            institution: e.institution,
            yearOfPassing: e.yearOfPassing,
          })),
          documents: finalDocs,
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

  const updateForm = useCallback(
    async (id: string, code: string): Promise<EmployeeMaster | null> => {
      const { isValid, firstInvalidTab } = validateAll();
      if (!isValid && firstInvalidTab) {
        setSubmitError(`Please correct the errors in the ${firstInvalidTab.toUpperCase()} tab.`);
        return null;
      }

      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const { finalAvatarUrl, finalDocs } = await uploadFormFiles(
          id,
          values.personal.avatarFile,
          values.personal.avatarUrl,
          values.documents
        );

        const payload: Partial<EmployeeMaster> = {
          code: code,
          name: values.personal.name,
          joinedDate: values.personal.joinedDate,
          email: values.personal.email,
          department: values.personal.department,
          designation: values.personal.designation,
          phone: values.personal.phone,
          avatarUrl: finalAvatarUrl,
          needsPayrollLogin: values.personal.needsPayrollLogin,
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
            uanNumber: values.account.uanNumber,
            pfNumber: values.account.pfNumber,
            esiNumber: values.account.esiNumber,
          },
          educations: values.education.map((e) => ({
            id: e.id,
            qualification: e.qualification,
            institution: e.institution,
            yearOfPassing: e.yearOfPassing,
          })),
          documents: finalDocs,
        };

        const updated = await employeeApi.update(id, payload);
        resetForm();
        return updated;
      } catch (err) {
        setSubmitError((err as Error).message || 'Failed to update employee record.');
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
    isUploadingFile,
    uploadMessage,
    setPersonalField,
    setAccountField,
    setEducationList,
    setDocumentList,
    uploadAvatarFile,
    uploadDocumentFiles,
    resetForm,
    populateForm,
    validateAll,
    submitForm,
    updateForm,
  };
};
