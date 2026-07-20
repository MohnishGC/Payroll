import { useState, useCallback } from 'react';
import { employeeApi } from '../services/employeeApi';
import type { EmployeeMaster } from '../types/employee.types';

export const useSelectedEmployee = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeMaster | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const selectEmployee = useCallback((employee: EmployeeMaster | null) => {
    setSelectedEmployee(employee);
    setIsEditing(false);
    setError(null);
  }, []);

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

  const saveEmployee = useCallback(
    async (updatedFields: Partial<EmployeeMaster>): Promise<boolean> => {
      if (!selectedEmployee) return false;
      setIsLoading(true);
      setError(null);
      try {
        const updated = await employeeApi.update(selectedEmployee.id, updatedFields);
        setSelectedEmployee(updated);
        setIsEditing(false);
        return true;
      } catch (err) {
        setError((err as Error).message || 'Failed to save employee changes.');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedEmployee]
  );

  const removeEmployee = useCallback(async (): Promise<boolean> => {
    if (!selectedEmployee) return false;
    setIsLoading(true);
    setError(null);
    try {
      await employeeApi.delete(selectedEmployee.id);
      setSelectedEmployee(null);
      setIsEditing(false);
      return true;
    } catch (err) {
      setError((err as Error).message || 'Failed to delete employee record.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedEmployee]);

  const clearSelectedEmployee = useCallback(() => {
    setSelectedEmployee(null);
    setIsEditing(false);
    setError(null);
  }, []);

  return {
    selectedEmployee,
    isLoading,
    isEditing,
    setIsEditing,
    error,
    selectEmployee,
    loadEmployee,
    saveEmployee,
    removeEmployee,
    clearSelectedEmployee,
  };
};
