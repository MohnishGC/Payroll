import React, { useState } from 'react';
import type { EmployeeMaster, PayslipRecord } from '../../../types/employee.types';
import { Table } from '../../../../../components/ui/Table/Table';
import type { ColumnDef } from '../../../../../components/ui/Table/Table';
import { Modal } from '../../../../../components/ui/Modal/Modal';
import { Icon } from '../../../../../components/icons/Icon';

export interface ReportProps {
  employee: EmployeeMaster;
}

export const PayslipHistoryReport: React.FC<ReportProps> = ({ employee }) => {
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipRecord | null>(null);
  const payslips = employee.payslips || [];

  const columns: ColumnDef<PayslipRecord>[] = [
    { key: 'month', header: 'MONTH' },
    {
      key: 'grossPay',
      header: 'GROSS PAY',
      render: (row) => `$${row.grossPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      key: 'deductions',
      header: 'DEDUCTIONS',
      render: (row) => `$${row.deductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      key: 'netPay',
      header: 'NET PAY',
      render: (row) => (
        <strong style={{ color: 'var(--color-primary)' }}>
          ${row.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </strong>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (row) => (
        <span
          style={{
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '11.5px',
            fontWeight: 700,
            backgroundColor: row.status === 'Paid' ? 'var(--color-success-bg)' : '#FEF3C7',
            color: row.status === 'Paid' ? '#065F46' : '#92400E',
          }}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'ACTION',
      align: 'right',
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedPayslip(row)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #BFDBFE',
            backgroundColor: 'var(--color-primary-bg)',
            color: 'var(--color-primary)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Icon name="search" size={13} />
          <span>View Slip</span>
        </button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Table
        columns={columns}
        data={payslips}
        keyExtractor={(item) => item.id}
        emptyText="No payslip history records available."
      />

      {/* Payslip Preview Modal */}
      {selectedPayslip && (
        <Modal
          isOpen={Boolean(selectedPayslip)}
          onClose={() => setSelectedPayslip(null)}
          title={`Payslip Preview - ${selectedPayslip.month}`}
          maxWidth="520px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-heading)' }}>TIMEE PMS PAYROLL SLIP</h3>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Employee: {employee.name} ({employee.code})</span>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: '999px', backgroundColor: 'var(--color-success-bg)', color: '#065F46', fontSize: '12px', fontWeight: 700 }}>
                {selectedPayslip.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Gross Earnings</span>
                <strong>${selectedPayslip.grossPay.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Tax & Statutory Deductions</span>
                <strong style={{ color: 'var(--color-danger)' }}>-${selectedPayslip.deductions.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px dashed var(--color-border)', fontSize: '16px' }}>
                <span>Net Salary Payable</span>
                <strong style={{ color: 'var(--color-primary)' }}>${selectedPayslip.netPay.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
