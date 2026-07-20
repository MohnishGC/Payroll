import React from 'react';
import type { EmployeeMaster, LeaveRecord } from '../../../types/employee.types';
import { Table } from '../../../../../components/ui/Table/Table';
import type { ColumnDef } from '../../../../../components/ui/Table/Table';

export interface ReportProps {
  employee: EmployeeMaster;
}

export const AttendanceLeaveReport: React.FC<ReportProps> = ({ employee }) => {
  const att = employee.attendance || { presentDays: 0, absentDays: 0, lateDays: 0, totalWorkDays: 0 };
  const leaves = employee.leaves || [];

  const columns: ColumnDef<LeaveRecord>[] = [
    { key: 'leaveType', header: 'LEAVE TYPE' },
    { key: 'fromDate', header: 'FROM' },
    { key: 'toDate', header: 'TO' },
    {
      key: 'days',
      header: 'DAYS',
      render: (row) => `${row.days} day(s)`,
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (row) => {
        let bg = 'var(--color-input-bg)';
        let color = 'var(--color-text-main)';
        if (row.status === 'Approved') {
          bg = 'var(--color-success-bg)';
          color = '#065F46';
        } else if (row.status === 'Pending') {
          bg = '#FEF3C7';
          color = '#92400E';
        } else if (row.status === 'Rejected') {
          bg = 'var(--color-danger-bg)';
          color = '#991B1B';
        }
        return (
          <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700, backgroundColor: bg, color }}>
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Attendance Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#065F46', textTransform: 'uppercase' }}>Present Days</span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#065F46', marginTop: '4px' }}>{att.presentDays} <span style={{ fontSize: '14px', fontWeight: 500 }}>/ {att.totalWorkDays}</span></h3>
        </div>

        <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' }}>Late Arrivals</span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#92400E', marginTop: '4px' }}>{att.lateDays} <span style={{ fontSize: '14px', fontWeight: 500 }}>days</span></h3>
        </div>

        <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-danger-bg)', border: '1px solid var(--color-error-border)' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase' }}>Absent Days</span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#991B1B', marginTop: '4px' }}>{att.absentDays} <span style={{ fontSize: '14px', fontWeight: 500 }}>days</span></h3>
        </div>
      </div>

      {/* Leave History Table */}
      <div>
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '12px' }}>
          Leave Application History
        </h4>
        <Table
          columns={columns}
          data={leaves}
          keyExtractor={(item) => item.id}
          emptyText="No leave application history recorded."
        />
      </div>
    </div>
  );
};
