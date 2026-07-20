import React, { useState } from 'react';
import { Tabs } from '../../../../components/ui/Tabs/Tabs';
import { tabsRegistry } from './tabsRegistry';
import type { EmployeeMaster } from '../../types/employee.types';
import './EmployeeDetailTabs.css';

export interface EmployeeDetailTabsProps {
  employee: EmployeeMaster;
  isEditing: boolean;
  onUpdate: (updated: Partial<EmployeeMaster>) => void;
}

export const EmployeeDetailTabs: React.FC<EmployeeDetailTabsProps> = ({
  employee,
  isEditing,
  onUpdate,
}) => {
  const [activeTabKey, setActiveTabKey] = useState<string>('personal');

  const tabItems = tabsRegistry.map((tab) => {
    let badge: number | undefined;
    if (tab.key === 'education') badge = employee.educations?.length;
    if (tab.key === 'documents') badge = employee.documents?.length;
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
        <ActiveComponent
          employee={employee}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
};
