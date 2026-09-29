import { USE_MOCK_API } from '../../../constants/config';
import { httpClient } from '../../../lib/http/httpClient';

export interface Department {
  id: string; // GUID
  code: string;
  name: string;
  isActive: boolean;
}

export interface Designation {
  id: string; // GUID
  departmentId: string;
  title: string;
  isActive: boolean;
  departmentName?: string; // Optional resolved name for UI
}

export interface Branch {
  id: string; // GUID
  companyDetailId: string; // GUID
  companyName?: string; // Read-only
  name: string;
  code: string;
  address?: string;
  isActive: boolean;
}

export interface ApplicationSetting {
  applicationSettingsId: string; // GUID
  mainCode: string;
  subCode: string;
  value: string;
  subValue: string | null;
  description?: string;
  options?: string[];
  isUserSetting: boolean;
  modifiedOn?: string;
  modifiedBy: string;
}

export interface CompanyDetail {
  id: string; // GUID
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive: boolean;
}

export interface GradePay {
  id: string; // GUID
  designationId?: string | null;
  designationTitle?: string | null;
  code: string;
  title: string;
  payBandMin: number;
  payBandMax: number;
  gradePayAmount: number;
  entryBasic: number;
  isActive: boolean;
  createdBy?: string;
  createdOn?: string;
  modifiedBy?: string | null;
  lastModifiedOn?: string | null;
}

export interface CityClassHRA {
  id: string; // GUID
  classCode: string; // X, Y, Z
  className: string;
  hraPercentage: number;
  description?: string;
  isActive: boolean;
  createdBy?: string;
  createdOn?: string;
  modifiedBy?: string | null;
  lastModifiedOn?: string | null;
}

// In-memory mock database
let mockDepartments: Department[] = [
  { id: 'dept-1', code: 'ENG', name: 'Engineering', isActive: true },
  { id: 'dept-2', code: 'HR', name: 'HR & Operations', isActive: true },
  { id: 'dept-3', code: 'FIN', name: 'Finance & Tax', isActive: true }
];

let mockDesignations: Designation[] = [
  { id: 'des-1', departmentId: 'dept-1', title: 'Senior Software Engineer', isActive: true, departmentName: 'Engineering' },
  { id: 'des-2', departmentId: 'dept-1', title: 'Lead React Developer', isActive: true, departmentName: 'Engineering' },
  { id: 'des-3', departmentId: 'dept-1', title: 'QA Automation Engineer', isActive: true, departmentName: 'Engineering' },
  { id: 'des-4', departmentId: 'dept-1', title: 'DevOps Specialist', isActive: true, departmentName: 'Engineering' },
  { id: 'des-5', departmentId: 'dept-2', title: 'Talent Acquisition Manager', isActive: true, departmentName: 'HR & Operations' },
  { id: 'des-6', departmentId: 'dept-2', title: 'HR Operations Executive', isActive: true, departmentName: 'HR & Operations' },
  { id: 'des-7', departmentId: 'dept-2', title: 'Office Administrator', isActive: true, departmentName: 'HR & Operations' },
  { id: 'des-8', departmentId: 'dept-3', title: 'Senior Accountant', isActive: true, departmentName: 'Finance & Tax' },
  { id: 'des-9', departmentId: 'dept-3', title: 'Payroll Specialist', isActive: true, departmentName: 'Finance & Tax' },
  { id: 'des-10', departmentId: 'dept-3', title: 'Tax Compliance Officer', isActive: true, departmentName: 'Finance & Tax' }
];

let mockBranches: Branch[] = [
  {
    id: 'b1111111-2222-3333-4444-555555555555',
    companyDetailId: 'c1111111-2222-3333-4444-555555555555',
    companyName: 'ACME Head Office',
    name: 'Mumbai HQ',
    code: 'MUM-HQ',
    address: 'BKC, Bandra East, Mumbai, MH',
    isActive: true
  },
  {
    id: 'b2222222-2222-3333-4444-555555555555',
    companyDetailId: 'c1111111-2222-3333-4444-555555555555',
    companyName: 'ACME Head Office',
    name: 'Pune Development Center',
    code: 'PUN-01',
    address: 'Hinjewadi Phase 1, Pune, MH',
    isActive: true
  }
];

let mockApplicationSettings: ApplicationSetting[] = [
  {
    applicationSettingsId: 's1111111-1111-1111-1111-111111111111',
    mainCode: 'PAYROLL',
    subCode: 'PF_RATE',
    value: '12.0',
    subValue: 'PERCENTAGE',
    description: 'Standard Provident Fund employee deduction rate',
    isUserSetting: false,
    modifiedOn: '2026-08-01T10:30:00Z',
    modifiedBy: 'admin@enterpriseportal.com'
  },
  {
    applicationSettingsId: 's2222222-2222-2222-2222-222222222222',
    mainCode: 'SYSTEM',
    subCode: 'DEFAULT_CURRENCY',
    value: 'INR',
    subValue: '₹',
    description: 'System default display currency symbol',
    isUserSetting: true,
    modifiedOn: '2026-08-01T11:00:00Z',
    modifiedBy: 'admin@enterpriseportal.com'
  },
  {
    applicationSettingsId: 'd1000000-0000-0000-0000-000000000001',
    mainCode: 'SYSTEM',
    subCode: 'BRANCH_MODE',
    value: 'SINGLE',
    subValue: null,
    description: 'Controls whether the portal runs in Single Branch or Multi Branch mode.',
    options: ['SINGLE', 'MULTI'],
    isUserSetting: true,
    modifiedOn: '2026-01-01T00:00:00Z',
    modifiedBy: 'SYS-ADMIN'
  }
];

let mockCompanyDetails: CompanyDetail[] = [
  {
    id: 'c1111111-2222-3333-4444-555555555555',
    name: 'ACME Head Office',
    code: 'ACME',
    address: 'BKC, Bandra East, Mumbai, MH, 400051',
    phone: '022-12345678',
    email: 'contact@acme.com',
    website: 'https://acme.com',
    isActive: true
  }
];

let mockGradePays: GradePay[] = [
  {
    id: "a1000000-0000-0000-0000-000000000001",
    code: "GP-2400",
    title: "Grade Pay 2400",
    payBandMin: 5200.00,
    payBandMax: 20200.00,
    gradePayAmount: 2400.00,
    entryBasic: 7600.00,
    isActive: true,
    createdBy: "SYS-ADMIN",
    createdOn: "2026-08-12T10:00:00Z",
    modifiedBy: null,
    lastModifiedOn: null
  },
  {
    id: "a1000000-0000-0000-0000-000000000002",
    code: "GP-4200",
    title: "Grade Pay 4200 (Technical Staff)",
    payBandMin: 9300.00,
    payBandMax: 34800.00,
    gradePayAmount: 4200.00,
    entryBasic: 13500.00,
    isActive: true,
    createdBy: "SYS-ADMIN",
    createdOn: "2026-08-12T10:00:00Z",
    modifiedBy: null,
    lastModifiedOn: null
  }
];

let mockCityClassHRAs: CityClassHRA[] = [
  {
    id: "e1111111-1111-1111-1111-111111111111",
    classCode: "X",
    className: "Class X (Metro Cities)",
    hraPercentage: 27.00,
    description: "Tier-1 cities (e.g. Mumbai, Delhi, Bangalore)",
    isActive: true,
    createdBy: "SYS-ADMIN",
    createdOn: "2026-01-01T00:00:00Z",
    modifiedBy: null,
    lastModifiedOn: null
  },
  {
    id: "e2222222-2222-2222-2222-222222222222",
    classCode: "Y",
    className: "Class Y (Tier-2 Cities)",
    hraPercentage: 18.00,
    description: "Tier-2 cities (e.g. Pune, Ahmedabad, Jaipur)",
    isActive: true,
    createdBy: "SYS-ADMIN",
    createdOn: "2026-01-01T00:00:00Z",
    modifiedBy: null,
    lastModifiedOn: null
  },
  {
    id: "e3333333-3333-3333-3333-333333333333",
    classCode: "Z",
    className: "Class Z (Other / Rural)",
    hraPercentage: 9.00,
    description: "All other locations",
    isActive: true,
    createdBy: "SYS-ADMIN",
    createdOn: "2026-01-01T00:00:00Z",
    modifiedBy: null,
    lastModifiedOn: null
  }
];

export const settingsApi = {
  // --- Departments ---
  async getDepartments(includeInactive: boolean = true): Promise<Department[]> {
    if (!USE_MOCK_API) {
      return httpClient.get<Department[]>(`/departments?includeInactive=${includeInactive}`);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = includeInactive ? mockDepartments : mockDepartments.filter((d) => d.isActive);
        resolve([...list]);
      }, 200);
    });
  },

  async createDepartment(data: Omit<Department, 'id'>): Promise<Department> {
    if (!USE_MOCK_API) {
      return httpClient.post<Department>('/departments', data);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDept: Department = {
          id: `dept-${Date.now()}`,
          ...data,
        };
        mockDepartments.push(newDept);
        resolve(newDept);
      }, 250);
    });
  },

  async updateDepartment(id: string, data: Omit<Department, 'id'>): Promise<Department> {
    if (!USE_MOCK_API) {
      return httpClient.put<Department>(`/departments/${id}`, data);
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = mockDepartments.findIndex((d) => d.id === id);
        if (idx === -1) {
          reject(new Error('Department not found'));
          return;
        }
        const updated = { ...mockDepartments[idx], ...data };
        mockDepartments[idx] = updated;
        resolve(updated);
      }, 250);
    });
  },

  // --- Designations ---
  async getDesignations(department?: string, includeInactive: boolean = true): Promise<Designation[]> {
    if (!USE_MOCK_API) {
      const params = new URLSearchParams();
      if (department) params.append('department', department);
      params.append('includeInactive', String(includeInactive));
      return httpClient.get<Designation[]>(`/designations?${params.toString()}`);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockDesignations];
        if (department) {
          const dept = mockDepartments.find(
            (d) => d.name.toLowerCase() === department.toLowerCase() || d.id === department
          );
          if (dept) {
            list = list.filter((des) => des.departmentId === dept.id);
          }
        }
        if (!includeInactive) {
          list = list.filter((des) => des.isActive);
        }
        resolve(list);
      }, 200);
    });
  },

  async createDesignation(data: Omit<Designation, 'id' | 'departmentName'>): Promise<Designation> {
    if (!USE_MOCK_API) {
      return httpClient.post<Designation>('/designations', data);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDes: Designation = {
          id: `des-${Date.now()}`,
          ...data,
        };
        const dept = mockDepartments.find((d) => d.id === data.departmentId);
        newDes.departmentName = dept ? dept.name : 'Unknown';
        mockDesignations.push(newDes);
        resolve(newDes);
      }, 250);
    });
  },

  async updateDesignation(id: string, data: Omit<Designation, 'id' | 'departmentName'>): Promise<Designation> {
    if (!USE_MOCK_API) {
      return httpClient.put<Designation>(`/designations/${id}`, data);
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = mockDesignations.findIndex((d) => d.id === id);
        if (idx === -1) {
          reject(new Error('Designation not found'));
          return;
        }
        const updated = { ...mockDesignations[idx], ...data };
        const dept = mockDepartments.find((d) => d.id === data.departmentId);
        updated.departmentName = dept ? dept.name : 'Unknown';
        mockDesignations[idx] = updated;
        resolve(updated);
      }, 250);
    });
  },

  // --- Branches ---
  async getBranches(companyId?: string, query?: string, includeInactive: boolean = true): Promise<Branch[]> {
    if (!USE_MOCK_API) {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      if (query) params.append('query', query);
      params.append('includeInactive', String(includeInactive));
      return httpClient.get<Branch[]>(`/branches?${params.toString()}`);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockBranches];
        if (query) {
          const q = query.toLowerCase();
          list = list.filter((b) => b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q));
        }
        if (!includeInactive) {
          list = list.filter((b) => b.isActive);
        }
        resolve(list);
      }, 200);
    });
  },

  async createBranch(data: Omit<Branch, 'id' | 'companyName'>): Promise<Branch> {
    if (!USE_MOCK_API) {
      return httpClient.post<Branch>('/branches', data);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBranch: Branch = {
          id: `branch-${Date.now()}`,
          ...data,
          companyName: mockCompanyDetails[0]?.name || 'ACME Corp'
        };
        mockBranches.push(newBranch);
        resolve(newBranch);
      }, 250);
    });
  },

  async updateBranch(id: string, data: Omit<Branch, 'id' | 'companyName'>): Promise<Branch> {
    if (!USE_MOCK_API) {
      return httpClient.put<Branch>(`/branches/${id}`, data);
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = mockBranches.findIndex((b) => b.id === id);
        if (idx === -1) {
          reject(new Error('Branch not found'));
          return;
        }
        const updated = { ...mockBranches[idx], ...data };
        mockBranches[idx] = updated;
        resolve(updated);
      }, 250);
    });
  },

  // --- Application Settings ---
  async getApplicationSettings(mainCode?: string, subCode?: string): Promise<ApplicationSetting[]> {
    if (!USE_MOCK_API) {
      const params = new URLSearchParams();
      if (mainCode) params.append('mainCode', mainCode);
      if (subCode) params.append('subCode', subCode);
      return httpClient.get<ApplicationSetting[]>(`/application-settings?${params.toString()}`);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockApplicationSettings];
        if (mainCode) {
          list = list.filter((s) => s.mainCode.toLowerCase() === mainCode.toLowerCase());
        }
        if (subCode) {
          list = list.filter((s) => s.subCode.toLowerCase() === subCode.toLowerCase());
        }
        resolve(list);
      }, 200);
    });
  },

  async createApplicationSetting(data: Omit<ApplicationSetting, 'applicationSettingsId' | 'modifiedOn'>): Promise<ApplicationSetting> {
    if (!USE_MOCK_API) {
      return httpClient.post<ApplicationSetting>('/application-settings', data);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSetting: ApplicationSetting = {
          applicationSettingsId: `setting-${Date.now()}`,
          ...data,
          modifiedOn: new Date().toISOString()
        };
        mockApplicationSettings.push(newSetting);
        resolve(newSetting);
      }, 250);
    });
  },

  async updateApplicationSetting(id: string, data: Omit<ApplicationSetting, 'applicationSettingsId' | 'modifiedOn'>): Promise<ApplicationSetting> {
    if (!USE_MOCK_API) {
      return httpClient.put<ApplicationSetting>(`/application-settings/${id}`, data);
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = mockApplicationSettings.findIndex((s) => s.applicationSettingsId === id);
        if (idx === -1) {
          reject(new Error('Application Setting not found'));
          return;
        }
        const updated = { ...mockApplicationSettings[idx], ...data, modifiedOn: new Date().toISOString() };
        mockApplicationSettings[idx] = updated;
        resolve(updated);
      }, 250);
    });
  },

  // --- Company Details ---
  async getCompanyDetails(query?: string, includeInactive: boolean = true): Promise<CompanyDetail[]> {
    if (!USE_MOCK_API) {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      params.append('includeInactive', String(includeInactive));
      return httpClient.get<CompanyDetail[]>(`/company-details?${params.toString()}`);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockCompanyDetails];
        if (query) {
          const q = query.toLowerCase();
          list = list.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
        }
        if (!includeInactive) {
          list = list.filter((c) => c.isActive);
        }
        resolve(list);
      }, 200);
    });
  },

  async updateCompanyDetail(id: string, data: Omit<CompanyDetail, 'id'>): Promise<CompanyDetail> {
    if (!USE_MOCK_API) {
      return httpClient.put<CompanyDetail>(`/company-details/${id}`, data);
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = mockCompanyDetails.findIndex((c) => c.id === id);
        if (idx === -1) {
          reject(new Error('Company details not found'));
          return;
        }
        const updated = { ...mockCompanyDetails[idx], ...data };
        mockCompanyDetails[idx] = updated;
        resolve(updated);
      }, 250);
    });
  },

  // --- Grade Pay ---
  async getGradePays(includeInactive: boolean = false): Promise<GradePay[]> {
    if (!USE_MOCK_API) {
      return httpClient.get<GradePay[]>(`/salary-calculation/grade-pays?includeInactive=${includeInactive}`);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockGradePays];
        if (!includeInactive) {
          list = list.filter((gp) => gp.isActive);
        }
        resolve(list);
      }, 200);
    });
  },

  async getGradePayById(id: string): Promise<GradePay> {
    if (!USE_MOCK_API) {
      return httpClient.get<GradePay>(`/salary-calculation/grade-pays/${id}`);
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const gp = mockGradePays.find((item) => item.id === id);
        if (!gp) {
          reject(new Error('Grade Pay not found'));
          return;
        }
        resolve(gp);
      }, 200);
    });
  },

  async createGradePay(data: {
    designationId?: string | null;
    code: string;
    title: string;
    payBandMin: number;
    payBandMax: number;
    gradePayAmount: number;
    isActive: boolean;
    createdBy: string;
  }): Promise<GradePay> {
    if (!USE_MOCK_API) {
      return httpClient.post<GradePay>('/salary-calculation/grade-pays', data);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const des = mockDesignations.find((d) => d.id === data.designationId);
        const designationTitle = des ? des.title : null;
        const newGp: GradePay = {
          id: `gp-${Date.now()}`,
          ...data,
          designationTitle,
          entryBasic: Number(data.payBandMin) + Number(data.gradePayAmount),
          createdOn: new Date().toISOString(),
          modifiedBy: null,
          lastModifiedOn: null
        };
        mockGradePays.push(newGp);
        resolve(newGp);
      }, 250);
    });
  },

  async updateGradePay(id: string, data: {
    designationId?: string | null;
    code: string;
    title: string;
    payBandMin: number;
    payBandMax: number;
    gradePayAmount: number;
    isActive: boolean;
    modifiedBy: string;
  }): Promise<GradePay> {
    if (!USE_MOCK_API) {
      return httpClient.put<GradePay>(`/salary-calculation/grade-pays/${id}`, data);
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = mockGradePays.findIndex((gp) => gp.id === id);
        if (idx === -1) {
          reject(new Error('Grade Pay not found'));
          return;
        }
        const des = mockDesignations.find((d) => d.id === data.designationId);
        const designationTitle = des ? des.title : null;
        const existing = mockGradePays[idx];
        const updatedGp: GradePay = {
          ...existing,
          ...data,
          designationTitle,
          entryBasic: Number(data.payBandMin) + Number(data.gradePayAmount),
          lastModifiedOn: new Date().toISOString()
        };
        mockGradePays[idx] = updatedGp;
        resolve(updatedGp);
      }, 250);
    });
  },

  // --- City Class HRA ---
  async getCityClassHRAs(includeInactive: boolean = false): Promise<CityClassHRA[]> {
    if (!USE_MOCK_API) {
      return httpClient.get<CityClassHRA[]>(`/salary-calculation/city-class-hras?includeInactive=${includeInactive}`);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockCityClassHRAs];
        if (!includeInactive) {
          list = list.filter((item) => item.isActive);
        }
        resolve(list);
      }, 200);
    });
  },

  async updateCityClassHRA(id: string, data: {
    hraPercentage: number;
    description?: string;
    isActive: boolean;
    modifiedBy: string;
  }): Promise<CityClassHRA> {
    if (!USE_MOCK_API) {
      return httpClient.put<CityClassHRA>(`/salary-calculation/city-class-hras/${id}`, data);
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = mockCityClassHRAs.findIndex((item) => item.id === id);
        if (idx === -1) {
          reject(new Error('City Class HRA not found'));
          return;
        }
        const existing = mockCityClassHRAs[idx];
        const updated: CityClassHRA = {
          ...existing,
          ...data,
          lastModifiedOn: new Date().toISOString()
        };
        mockCityClassHRAs[idx] = updated;
        resolve(updated);
      }, 250);
    });
  }
};
