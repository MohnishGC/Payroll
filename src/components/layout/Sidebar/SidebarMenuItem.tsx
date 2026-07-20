import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '../../icons/Icon';
import type { SidebarItem } from './sidebarConfig';
import './SidebarMenuItem.css';

export interface SidebarMenuItemProps {
  item: SidebarItem;
  isCollapsed?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  isCollapsed = false,
  isOpen: externalIsOpen,
  onToggle,
}) => {
  const location = useLocation();
  const hasChildren = Boolean(item.children && item.children.length > 0);

  // Check if current location matches any child path
  const isChildActive = hasChildren
    ? item.children?.some((child) => location.pathname === child.path)
    : false;

  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(Boolean(isChildActive));

  // Auto expand when route changes to a child
  useEffect(() => {
    if (isChildActive) {
      setInternalIsOpen(true);
    }
  }, [location.pathname, isChildActive]);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleHeaderClick = () => {
    if (hasChildren) {
      if (onToggle) {
        onToggle();
      } else {
        setInternalIsOpen((prev) => !prev);
      }
    }
  };

  if (!hasChildren && item.path) {
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `sidebar-item ${isActive ? 'sidebar-item--active' : ''} ${
            isCollapsed ? 'sidebar-item--collapsed' : ''
          }`
        }
        title={isCollapsed ? item.label : undefined}
      >
        <span className="sidebar-item__active-indicator" />
        <span className="sidebar-item__icon">
          <Icon name={item.icon} size={20} />
        </span>
        {!isCollapsed && <span className="sidebar-item__label">{item.label}</span>}
      </NavLink>
    );
  }

  return (
    <div
      className={`sidebar-submenu ${isOpen ? 'sidebar-submenu--open' : ''} ${
        isChildActive ? 'sidebar-submenu--child-active' : ''
      } ${isCollapsed ? 'sidebar-submenu--collapsed' : ''}`}
    >
      <button
        type="button"
        className={`sidebar-item sidebar-item--parent ${
          isChildActive ? 'sidebar-item--active' : ''
        }`}
        onClick={handleHeaderClick}
        aria-expanded={isOpen}
        title={isCollapsed ? item.label : undefined}
      >
        <span className="sidebar-item__active-indicator" />
        <span className="sidebar-item__icon">
          <Icon name={item.icon} size={20} />
        </span>
        {!isCollapsed && <span className="sidebar-item__label">{item.label}</span>}
        {!isCollapsed && (
          <span className={`sidebar-item__chevron ${isOpen ? 'sidebar-item__chevron--rotated' : ''}`}>
            <Icon name="chevronDown" size={16} />
          </span>
        )}
      </button>

      {hasChildren && !isCollapsed && isOpen && (
        <div className="sidebar-submenu__list" role="region">
          {item.children?.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                `sidebar-submenu__item ${isActive ? 'sidebar-submenu__item--active' : ''}`
              }
            >
              <span className="sidebar-submenu__dot" />
              <span className="sidebar-submenu__label">{child.label}</span>
              {child.badge && <span className="sidebar-submenu__badge">{child.badge}</span>}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};
