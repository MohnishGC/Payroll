import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';
import { Topbar } from '../Topbar/Topbar';
import './DashboardLayout.css';

const COLLAPSE_STORAGE_KEY = 'timee_pms_sidebar_collapsed';

export const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COLLAPSE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_STORAGE_KEY, String(isCollapsed));
    } catch {
      // ignore storage error
    }
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar - Persists squeezed/expanded state across menu & route changes */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Fluid Content Area */}
      <div className="dashboard-layout__content-wrapper">
        <Topbar onToggleMobileMenu={toggleCollapse} />
        <main className="dashboard-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
