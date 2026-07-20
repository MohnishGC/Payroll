import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../icons/Icon';
import { UserProfileCard } from '../UserProfileCard/UserProfileCard';
import { SidebarMenuItem } from './SidebarMenuItem';
import { sidebarConfig } from './sidebarConfig';
import { useAuth } from '../../../app/providers/AuthProvider';
import './Sidebar.css';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  accordion?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  accordion = true,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  const handleSubmenuToggle = (id: string) => {
    if (accordion) {
      setOpenSectionId((prev) => (prev === id ? null : id));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Top Header: Logo + Collapse Button */}
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <span className="sidebar__logo-badge">
            <Icon name="plus" size={18} color="#FFFFFF" aria-label="Efficio Logo" />
          </span>
          {!isCollapsed && <span className="sidebar__logo-title">Payroll</span>}
        </div>

        <button
          type="button"
          className="sidebar__collapse-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name={isCollapsed ? 'chevronRight' : 'chevronLeft'} size={18} />
        </button>
      </div>

      {/* User Profile Card */}
      <div className="sidebar__profile-container">
        <UserProfileCard isCollapsed={isCollapsed} />
      </div>

      {/* Main Scrollable Navigation List */}
      <nav className="sidebar__nav" aria-label="Main Navigation">
        {sidebarConfig.map((section) => (
          <div key={section.sectionLabel} className="sidebar__section">
            {!isCollapsed && (
              <span className="sidebar__section-label">{section.sectionLabel}</span>
            )}
            <div className="sidebar__section-items">
              {section.items.map((item) => (
                <SidebarMenuItem
                  key={item.id}
                  item={item}
                  isCollapsed={isCollapsed}
                  isOpen={accordion ? openSectionId === item.id : undefined}
                  onToggle={() => handleSubmenuToggle(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Pinned Log Out Action */}
      <div className="sidebar__footer">
        <button
          type="button"
          className="sidebar__logout-btn"
          onClick={handleLogout}
          title={isCollapsed ? 'Log Out' : undefined}
        >
          <span className="sidebar__logout-icon">
            <Icon name="logOut" size={20} />
          </span>
          {!isCollapsed && <span className="sidebar__logout-label">Log Out</span>}
        </button>
      </div>
    </aside>
  );
};
