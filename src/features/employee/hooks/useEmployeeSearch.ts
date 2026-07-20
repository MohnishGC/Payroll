import { useState, useEffect, useCallback } from 'react';
import { employeeApi } from '../services/employeeApi';
import type { EmployeeMaster } from '../types/employee.types';

export const useEmployeeSearch = (initialPageSize = 5) => {
  const [query, setQuery] = useState<string>('');
  const [department, setDepartment] = useState<string>('-- Select --');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(initialPageSize);
  const [items, setItems] = useState<EmployeeMaster[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const performSearch = useCallback(
    async (q: string, dept: string, p: number) => {
      setIsLoading(true);
      try {
        const res = await employeeApi.search({
          query: q,
          department: dept,
          page: p,
          pageSize,
        });
        setItems(res.items);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error('Employee search failed:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize]
  );

  // Debounced search trigger when query or department changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      performSearch(query, department, 1);
    }, 300);

    return () => clearTimeout(handler);
  }, [query, department, performSearch]);

  // Handle page change directly
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    performSearch(query, department, newPage);
  };

  const clearSearch = () => {
    setQuery('');
    setDepartment('-- Select --');
    setPage(1);
  };

  return {
    query,
    setQuery,
    department,
    setDepartment,
    page,
    pageSize,
    total,
    totalPages,
    items,
    isLoading,
    handlePageChange,
    clearSearch,
    refetch: () => performSearch(query, department, page),
  };
};
