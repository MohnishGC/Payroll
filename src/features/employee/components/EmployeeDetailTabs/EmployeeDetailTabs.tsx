import React, { useState } from 'react';
import { Tabs } from '../../../../components/ui/Tabs/Tabs';
import { tabsRegistry } from './tabsRegistry';
import type { EmployeeMaster } from '../../types/employee.types';
import './EmployeeDetailTabs.css';

export interface EmployeeDetailTabsProps {
  employee: EmployeeMaster;
}

export const EmployeeDetailTabs: React.FC<EmployeeDetailTabsProps> = ({ employee }) => {
  const [activeTabKey, setActiveTabKey] = useState<string>('personal');

  const tabItems = tabsRegistry.map((tab) => {
    let badge: number | undefined;
    const educations = employee?.educations || (employee as any)?.Educations || [];
    const documents = employee?.documents || (employee as any)?.Documents || [];
    if (tab.key === 'education') badge = educations.length;
    if (tab.key === 'documents') badge = documents.length;
    return {
      key: tab.key,
      label: tab.label,
      badge,
    };
  });

  const activeTabEntry = tabsRegistry.find((tab) => tab.key === activeTabKey) || tabsRegistry[0];
  const ActiveComponent = activeTabEntry.component;

  return (
    <div className="employee-detail-tabs">
      <Tabs
        items={tabItems}
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
        className="employee-detail-tabs__header"
      />

      <div className="employee-detail-tabs__content">
        <ActiveComponent employee={employee} />
      </div>
    </div>
  );
};
