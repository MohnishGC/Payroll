import React from 'react';
import './Tabs.css';

export interface TabItem {
  key: string;
  label: string;
  badge?: string | number;
  status?: 'untouched' | 'valid' | 'invalid';
}

export interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeKey,
  onChange,
  className = '',
}) => {
  return (
    <div className={`ui-tabs ${className}`} role="tablist">
      {items.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`ui-tabs__item ${isActive ? 'ui-tabs__item--active' : ''}`}
            onClick={() => onChange(tab.key)}
          >
            {tab.status && (
              <span
                className={`ui-tabs__status-dot ui-tabs__status-dot--${tab.status}`}
                title={`Status: ${tab.status}`}
              />
            )}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="ui-tabs__badge">{tab.badge}</span>
            )}
            {isActive && <span className="ui-tabs__active-border" />}
          </button>
        );
      })}
    </div>
  );
};
