export interface StatCardData {
  id: string;
  title: string;
  value: string;
  deltaPercent: string;
  deltaDirection: 'up' | 'down';
  deltaLabel: string;
}

export interface MonthlyAttendance {
  month: string;
  total: number;
  onTime: number;
}

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  dueDate: string;
}

export interface TaskColumnData {
  id: string;
  name: string;
  statusColor: string;
  tasks: TaskItem[];
}

export interface DashboardMockData {
  stats: StatCardData[];
  attendance: {
    totalEmployees: number;
    onTimeEmployees: number;
    monthlyData: MonthlyAttendance[];
  };
  taskColumns: TaskColumnData[];
}

export const mockDashboardData: DashboardMockData = {
  stats: [
    {
      id: 'total-emp',
      title: 'Total Employees',
      value: '1,284',
      deltaPercent: '12.4%',
      deltaDirection: 'up',
      deltaLabel: '+142 from last month',
    },
    {
      id: 'job-applicants',
      title: 'Job Applicant',
      value: '342',
      deltaPercent: '8.1%',
      deltaDirection: 'up',
      deltaLabel: '+24 new applications',
    },
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      value: '$4,842.00',
      deltaPercent: '16.2%',
      deltaDirection: 'up',
      deltaLabel: '+$620.00 vs previous cycle',
    },
    {
      id: 'attendance-rate',
      title: 'Attendance Rate',
      value: '95.4%',
      deltaPercent: '1.2%',
      deltaDirection: 'down',
      deltaLabel: '-0.8% vs benchmark target',
    },
  ],

  attendance: {
    totalEmployees: 1284,
    onTimeEmployees: 1225,
    monthlyData: [
      { month: 'Jan', total: 92, onTime: 88 },
      { month: 'Feb', total: 94, onTime: 91 },
      { month: 'Mar', total: 96, onTime: 94 },
      { month: 'Apr', total: 89, onTime: 84 },
      { month: 'May', total: 95, onTime: 92 },
      { month: 'Jun', total: 97, onTime: 95 },
      { month: 'Jul', total: 93, onTime: 90 },
      { month: 'Aug', total: 96, onTime: 93 },
      { month: 'Sep', total: 91, onTime: 87 },
      { month: 'Oct', total: 94, onTime: 91 },
      { month: 'Nov', total: 98, onTime: 96 },
      { month: 'Dec', total: 95, onTime: 92 },
    ],
  },

  taskColumns: [
    {
      id: 'new-request',
      name: 'New Request',
      statusColor: '#3B82F6',
      tasks: [
        {
          id: 'tsk-1',
          title: 'Review Q3 Tax Allowance Documents',
          category: 'Payroll & Tax',
          priority: 'High',
          assignee: 'Sarah Jenkins',
          dueDate: 'Mar 12',
        },
        {
          id: 'tsk-2',
          title: 'Onboard 4 New Engineering Leads',
          category: 'HR Operations',
          priority: 'Medium',
          assignee: 'David Chen',
          dueDate: 'Mar 15',
        },
      ],
    },
    {
      id: 'in-progress',
      name: 'In Progress',
      statusColor: '#F59E0B',
      tasks: [
        {
          id: 'tsk-3',
          title: 'Audit March Overtime Payment Slips',
          category: 'Audit',
          priority: 'High',
          assignee: 'Arnold Smith',
          dueDate: 'Mar 10',
        },
        {
          id: 'tsk-4',
          title: 'Update Branch Office Holiday Calendar',
          category: 'Settings',
          priority: 'Low',
          assignee: 'Emma Watson',
          dueDate: 'Mar 18',
        },
      ],
    },
    {
      id: 'completed',
      name: 'Completed',
      statusColor: '#10B981',
      tasks: [
        {
          id: 'tsk-5',
          title: 'Generate Annual Salary Certificates',
          category: 'Reports',
          priority: 'Medium',
          assignee: 'Arnold Smith',
          dueDate: 'Mar 05',
        },
      ],
    },
  ],
};
