import { useState, useCallback } from 'react';
import { employeeApi } from '../services/employeeApi';

export const useEmployeeCodeGenerator = () => {
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCode = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const generated = await employeeApi.generateEmployeeCode();
      setCode(generated);
    } catch (err) {
      setError((err as Error).message || 'Failed to generate employee code');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    code,
    isLoading,
    error,
    fetchCode,
  };
};
