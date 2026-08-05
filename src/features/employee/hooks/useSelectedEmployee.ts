import { useState, useCallback } from 'react';
import { employeeApi } from '../services/employeeApi';
import type { EmployeeMaster } from '../types/employee.types';

export const useSelectedEmployee = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeMaster | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadEmployee = useCallback(async (idOrCode: string) => {
    if (!idOrCode.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await employeeApi.getById(idOrCode);
      if (result) {
        setSelectedEmployee(result);
      } else {
        setError(`No employee found matching "${idOrCode}".`);
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to load employee record.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectEmployee = useCallback((employee: EmployeeMaster | null) => {
    if (employee) {
      const hasDetails = employee.personal && 
        (employee.personal.dob || employee.personal.address);

      if (hasDetails) {
        setSelectedEmployee(employee);
      } else {
        const empId = employee.id || (employee as any).Id || employee.code || (employee as any).Code;
        if (empId) {
          loadEmployee(empId);
        } else {
          setSelectedEmployee(employee);
        }
      }
    } else {
      setSelectedEmployee(null);
    }
    setError(null);
  }, [loadEmployee]);

  const clearSelectedEmployee = useCallback(() => {
    setSelectedEmployee(null);
    setError(null);
  }, []);

  return {
    selectedEmployee,
    isLoading,
    error,
    selectEmployee,
    loadEmployee,
    clearSelectedEmployee,
  };
};
export default useSelectedEmployee;
