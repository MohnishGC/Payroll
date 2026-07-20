export interface EducationEntry {
  id: string;
  qualification: string;
  institution: string;
  yearOfPassing: string;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  type: string;
  uploadedDate: string;
  fileUrl?: string;
}

export interface PersonalDetails {
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus: 'Single' | 'Married' | 'Divorced';
  bloodGroup: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface AccountDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
  uanPfNumber: string;
  esiNumber: string;
}

export interface PayslipRecord {
  id: string;
  month: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: 'Paid' | 'Pending';
}

export interface AttendanceSummary {
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalWorkDays: number;
}

export interface LeaveRecord {
  id: string;
  leaveType: 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Unpaid';
  fromDate: string;
  toDate: string;
  days: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface EmployeeMaster {
  id: string;
  code: string;
  name: string;
  avatarUrl?: string;
  joinedDate: string;
  email: string;
  isEmailVerified: boolean;
  department: string;
  designation: string;
  phone: string;
  isPhoneVerified: boolean;
  personal: PersonalDetails;
  account: AccountDetails;
  educations: EducationEntry[];
  documents: EmployeeDocument[];
  payslips: PayslipRecord[];
  attendance: AttendanceSummary;
  leaves: LeaveRecord[];
}

export interface EmployeeSearchFilters {
  query?: string;
  department?: string;
  page?: number;
  pageSize?: number;
}

export interface EmployeeSearchResult {
  items: EmployeeMaster[];
  total: number;
  page: number;
  totalPages: number;
}
