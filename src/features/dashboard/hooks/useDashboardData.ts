import { useState } from 'react';
import { mockDashboardData } from '../mockData';
import type { DashboardMockData } from '../mockData';

export type DashboardViewMode = 'kanban' | 'table' | 'list';

export const useDashboardData = () => {
  const [data] = useState<DashboardMockData>(mockDashboardData);
  const [viewMode, setViewMode] = useState<DashboardViewMode>('kanban');

  const handleAddTask = (columnId: string) => {
    console.log('Add task card clicked for column:', columnId);
  };

  return {
    stats: data.stats,
    attendance: data.attendance,
    taskColumns: data.taskColumns,
    viewMode,
    setViewMode,
    handleAddTask,
  };
};
