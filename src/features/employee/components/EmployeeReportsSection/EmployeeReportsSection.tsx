import React, { useState } from 'react';
import { Icon } from '../../../../components/icons/Icon';
import { Tabs } from '../../../../components/ui/Tabs/Tabs';
import { reportsRegistry } from './reportsRegistry';
import type { EmployeeMaster } from '../../types/employee.types';
import './EmployeeReportsSection.css';

export interface EmployeeReportsSectionProps {
  employee: EmployeeMaster;
}

export const EmployeeReportsSection: React.FC<EmployeeReportsSectionProps> = ({ employee }) => {
  const [activeReportKey, setActiveReportKey] = useState<string>('payslips');

  const tabItems = reportsRegistry.map((rep) => ({
    key: rep.key,
    label: rep.label,
  }));

  const activeEntry = reportsRegistry.find((rep) => rep.key === activeReportKey) || reportsRegistry[0];
  const ActiveReportComponent = activeEntry.component;

  return (
    <div className="employee-reports-section">
      {/* Section Header */}
      <div className="employee-reports-section__header">
        <div className="employee-reports-section__title-group">
          <h3 className="employee-reports-section__title">Employee Reports</h3>
          <span className="employee-reports-section__info-icon" title="View historical payslips and attendance records">
            <Icon name="helpCircle" size={16} />
          </span>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <Tabs
        items={tabItems}
        activeKey={activeReportKey}
        onChange={setActiveReportKey}
        className="employee-reports-section__tabs"
      />

      {/* Active Report Body */}
      <div className="employee-reports-section__content">
        <ActiveReportComponent employee={employee} />
      </div>
    </div>
  );
};
