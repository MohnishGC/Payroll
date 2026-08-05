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
          // If department name is passed, match it; otherwise match departmentId
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
};
