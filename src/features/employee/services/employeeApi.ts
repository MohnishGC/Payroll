import { USE_MOCK_API } from '../../../constants/config';
import { httpClient } from '../../../lib/http/httpClient';
import type {
  EmployeeMaster,
  EmployeeSearchFilters,
  EmployeeSearchResult,
} from '../types/employee.types';

// Initial Mock Dataset for testing & demonstration
const initialEmployees: EmployeeMaster[] = [
  {
    id: 'emp-101',
    code: 'EMP-1001',
    name: 'Arnold Smith',
    joinedDate: '2023-01-15',
    email: 'arnold.smith@efficio.io',
    isEmailVerified: true,
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    phone: '+1 (555) 234-5678',
    isPhoneVerified: false,
    personal: {
      dob: '1992-06-14',
      gender: 'Male',
      maritalStatus: 'Married',
      bloodGroup: 'O+',
      address: '742 Evergreen Terrace, Springfield, IL',
      emergencyContactName: 'Clara Smith',
      emergencyContactPhone: '+1 (555) 987-6543',
    },
    account: {
      bankName: 'Chase National Bank',
      accountNumber: 'XXXX-XXXX-8821',
      ifscCode: 'CHAS0001298',
      panNumber: 'ABCDE1234F',
      uanPfNumber: '100982348123',
      esiNumber: '3100982312',
    },
    educations: [
      {
        id: 'edu-1',
        qualification: 'B.Tech in Computer Science',
        institution: 'University of Illinois',
        yearOfPassing: '2014',
      },
      {
        id: 'edu-2',
        qualification: 'M.S. in Software Engineering',
        institution: 'Stanford University',
        yearOfPassing: '2016',
      },
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Employment_Agreement_2023.pdf',
        type: 'PDF Document',
        uploadedDate: '2023-01-15',
      },
      {
        id: 'doc-2',
        name: 'Passport_Scan_Copy.jpg',
        type: 'Image File',
        uploadedDate: '2023-01-16',
      },
    ],
    payslips: [
      { id: 'ps-1', month: 'February 2026', grossPay: 6500, deductions: 650, netPay: 5850, status: 'Paid' },
      { id: 'ps-2', month: 'January 2026', grossPay: 6500, deductions: 650, netPay: 5850, status: 'Paid' },
      { id: 'ps-3', month: 'December 2025', grossPay: 6200, deductions: 620, netPay: 5580, status: 'Paid' },
    ],
    attendance: {
      presentDays: 21,
      absentDays: 1,
      lateDays: 2,
      totalWorkDays: 24,
    },
    leaves: [
      { id: 'lv-1', leaveType: 'Casual Leave', fromDate: '2026-02-10', toDate: '2026-02-11', days: 1, status: 'Approved' },
      { id: 'lv-2', leaveType: 'Sick Leave', fromDate: '2026-01-05', toDate: '2026-01-05', days: 1, status: 'Approved' },
    ],
  },
  {
    id: 'emp-102',
    code: 'EMP-1002',
    name: 'Sarah Jenkins',
    joinedDate: '2022-03-20',
    email: 'sarah.j@efficio.io',
    isEmailVerified: true,
    department: 'Engineering',
    designation: 'Lead React Developer',
    phone: '+1 (555) 345-6789',
    isPhoneVerified: true,
    personal: {
      dob: '1990-11-22',
      gender: 'Female',
      maritalStatus: 'Single',
      bloodGroup: 'A+',
      address: '101 Market St, San Francisco, CA',
      emergencyContactName: 'Robert Jenkins',
      emergencyContactPhone: '+1 (555) 876-5432',
    },
    account: {
      bankName: 'Bank of America',
      accountNumber: 'XXXX-XXXX-4432',
      ifscCode: 'BOFA0004412',
      panNumber: 'FGHIJ5678K',
      uanPfNumber: '100876543210',
      esiNumber: '3100876543',
    },
    educations: [
      {
        id: 'edu-3',
        qualification: 'B.S. in Information Technology',
        institution: 'UC Berkeley',
        yearOfPassing: '2012',
      },
    ],
    documents: [
      {
        id: 'doc-3',
        name: 'Offer_Letter_Signed.pdf',
        type: 'PDF Document',
        uploadedDate: '2022-03-20',
      },
    ],
    payslips: [
      { id: 'ps-4', month: 'February 2026', grossPay: 7200, deductions: 720, netPay: 6480, status: 'Paid' },
      { id: 'ps-5', month: 'January 2026', grossPay: 7200, deductions: 720, netPay: 6480, status: 'Paid' },
    ],
    attendance: {
      presentDays: 23,
      absentDays: 0,
      lateDays: 1,
      totalWorkDays: 24,
    },
    leaves: [
      { id: 'lv-3', leaveType: 'Earned Leave', fromDate: '2025-12-24', toDate: '2025-12-31', days: 6, status: 'Approved' },
    ],
  },
  {
    id: 'emp-103',
    code: 'EMP-1003',
    name: 'David Chen',
    joinedDate: '2021-08-10',
    email: 'david.chen@efficio.io',
    isEmailVerified: false,
    department: 'HR & Operations',
    designation: 'Talent Acquisition Manager',
    phone: '+1 (555) 456-7890',
    isPhoneVerified: false,
    personal: {
      dob: '1988-04-05',
      gender: 'Male',
      maritalStatus: 'Married',
      bloodGroup: 'B+',
      address: '55 Pine Street, Seattle, WA',
      emergencyContactName: 'Mei Chen',
      emergencyContactPhone: '+1 (555) 765-4321',
    },
    account: {
      bankName: 'Wells Fargo',
      accountNumber: 'XXXX-XXXX-9912',
      ifscCode: 'WFBI0008890',
      panNumber: 'LMNOP9012Q',
      uanPfNumber: '100765432109',
      esiNumber: '3100765432',
    },
    educations: [
      {
        id: 'edu-4',
        qualification: 'MBA in Human Resources',
        institution: 'University of Washington',
        yearOfPassing: '2011',
      },
    ],
    documents: [],
    payslips: [
      { id: 'ps-6', month: 'February 2026', grossPay: 5800, deductions: 580, netPay: 5220, status: 'Paid' },
    ],
    attendance: {
      presentDays: 22,
      absentDays: 1,
      lateDays: 1,
      totalWorkDays: 24,
    },
    leaves: [],
  },
];

let mockDb = [...initialEmployees];

export const employeeApi = {
  async search(filters: EmployeeSearchFilters = {}): Promise<EmployeeSearchResult> {
    if (!USE_MOCK_API) {
      const params = new URLSearchParams();
      if (filters.query) params.append('query', filters.query);
      if (filters.department) params.append('department', filters.department);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.pageSize) params.append('pageSize', String(filters.pageSize));
      return httpClient.get<EmployeeSearchResult>(`/employees?${params.toString()}`);
    }

    // Mock API implementation with simulated async delay
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...mockDb];

        if (filters.query?.trim()) {
          const q = filters.query.trim().toLowerCase();
          results = results.filter(
            (emp) => emp.name.toLowerCase().includes(q) || emp.code.toLowerCase().includes(q)
          );
        }

        if (filters.department && filters.department !== '-- Select --' && filters.department !== 'All') {
          results = results.filter((emp) => emp.department === filters.department);
        }

        const page = filters.page || 1;
        const pageSize = filters.pageSize || 5;
        const total = results.length;
        const totalPages = Math.ceil(total / pageSize) || 1;
        const start = (page - 1) * pageSize;
        const items = results.slice(start, start + pageSize);

        resolve({
          items,
          total,
          page,
          totalPages,
        });
      }, 250);
    });
  },

  async getById(idOrCode: string): Promise<EmployeeMaster | null> {
    if (!USE_MOCK_API) {
      return httpClient.get<EmployeeMaster>(`/employees/${idOrCode}`);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const found = mockDb.find(
          (emp) => emp.id === idOrCode || emp.code.toLowerCase() === idOrCode.toLowerCase()
        );
        resolve(found || null);
      }, 200);
    });
  },

  async create(employeeData: Partial<EmployeeMaster>): Promise<EmployeeMaster> {
    if (!USE_MOCK_API) {
      return httpClient.post<EmployeeMaster>('/employees', employeeData);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const newCode = `EMP-${1000 + mockDb.length + 1}`;
        const newEmployee: EmployeeMaster = {
          id: `emp-${Date.now()}`,
          code: employeeData.code || newCode,
          name: employeeData.name || 'New Employee',
          joinedDate: employeeData.joinedDate || new Date().toISOString().split('T')[0],
          email: employeeData.email || 'employee@efficio.io',
          isEmailVerified: false,
          department: employeeData.department || 'Engineering',
          designation: employeeData.designation || 'Associate Specialist',
          phone: employeeData.phone || '+1 (555) 000-0000',
          isPhoneVerified: false,
          personal: employeeData.personal || {
            dob: '1995-01-01',
            gender: 'Male',
            maritalStatus: 'Single',
            bloodGroup: 'O+',
            address: 'City Center',
            emergencyContactName: 'Emergency Contact',
            emergencyContactPhone: '+1 (555) 000-0000',
          },
          account: employeeData.account || {
            bankName: 'National Bank',
            accountNumber: 'XXXX-XXXX-0000',
            ifscCode: 'NATB0001000',
            panNumber: 'AAAAA0000A',
            uanPfNumber: '100000000000',
            esiNumber: '3100000000',
          },
          educations: employeeData.educations || [],
          documents: employeeData.documents || [],
          payslips: [],
          attendance: { presentDays: 0, absentDays: 0, lateDays: 0, totalWorkDays: 0 },
          leaves: [],
        };

        mockDb.unshift(newEmployee);
        resolve(newEmployee);
      }, 400);
    });
  },

  async update(id: string, updatedFields: Partial<EmployeeMaster>): Promise<EmployeeMaster> {
    if (!USE_MOCK_API) {
      return httpClient.put<EmployeeMaster>(`/employees/${id}`, updatedFields);
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockDb.findIndex((emp) => emp.id === id);
        if (index === -1) {
          reject(new Error(`Employee with ID ${id} not found.`));
          return;
        }

        const updated: EmployeeMaster = {
          ...mockDb[index],
          ...updatedFields,
          personal: {
            ...mockDb[index].personal,
            ...(updatedFields.personal || {}),
          },
          account: {
            ...mockDb[index].account,
            ...(updatedFields.account || {}),
          },
        };

        mockDb[index] = updated;
        resolve(updated);
      }, 350);
    });
  },

  async delete(id: string): Promise<boolean> {
    if (!USE_MOCK_API) {
      await httpClient.delete(`/employees/${id}`);
      return true;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        mockDb = mockDb.filter((emp) => emp.id !== id);
        resolve(true);
      }, 300);
    });
  },

  async generateEmployeeCode(): Promise<string> {
    if (!USE_MOCK_API) {
      const res = await httpClient.get<{ code: string }>('/employees/next-code');
      return res.code;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const nextNumber = 1000 + mockDb.length + 1;
        resolve(`EMP-${nextNumber}`);
      }, 400);
    });
  },

  async uploadFile(file: File): Promise<{ url: string; name: string }> {
    if (!USE_MOCK_API) {
      const formData = new FormData();
      formData.append('file', file);
      return httpClient.post<{ url: string; name: string }>('/uploads', formData);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const objectUrl = URL.createObjectURL(file);
        resolve({
          url: objectUrl,
          name: file.name,
        });
      }, 300);
    });
  },
};
